"use client";

import { Eye, ShoppingBag } from "lucide-react";
import { useState, useTransition } from "react";
import { toast } from "sonner";
import { addToCart } from "@/app/cart/actions";
import { useCart } from "@/app/cart/cart-context";
import { AppLink } from "@/components/app-link";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { AppMedia } from "@/lib/app-media";
import { CURRENCY, LOCALE } from "@/lib/constants";
import { formatMoney } from "@/lib/money";
import { perfumes } from "@/lib/perfume-data";

type QuickViewProduct = {
	id: string;
	name: string;
	slug: string;
	images: string[];
	variants: { id: string; price: string; images: string[] }[];
};

export function QuickViewTrigger({ product, className }: { product: QuickViewProduct; className?: string }) {
	const [open, setOpen] = useState(false);
	const [isPending, startTransition] = useTransition();
	const { dispatch } = useCart();

	const perfumeData = perfumes.find((p) => p.slug === product.slug);
	const variant = product.variants[0];
	const price = variant
		? formatMoney({ amount: BigInt(variant.price), currency: CURRENCY, locale: LOCALE })
		: null;
	const image = product.images[0];
	const isSingleVariant = product.variants.length === 1;

	const handleAddToCart = () => {
		if (!variant) return;
		startTransition(async () => {
			dispatch({
				type: "ADD_ITEM",
				item: {
					quantity: 1,
					productVariant: {
						id: variant.id,
						price: variant.price,
						images: variant.images,
						product: {
							id: product.id,
							name: product.name,
							slug: product.slug,
							images: product.images,
						},
					},
				},
			});
			await addToCart(variant.id, 1);
			toast.success(`${product.name} added to cart`);
			setOpen(false);
		});
	};

	return (
		<>
			<button
				type="button"
				onClick={(e) => {
					e.preventDefault();
					e.stopPropagation();
					setOpen(true);
				}}
				className={className}
				aria-label={`Quick view ${product.name}`}
			>
				<Eye className="h-4 w-4" />
			</button>
			<Dialog open={open} onOpenChange={setOpen}>
				<DialogContent className="sm:max-w-2xl p-0 overflow-hidden">
					<div className="grid sm:grid-cols-2">
						<div className="relative aspect-square bg-zinc-100">
							{image && (
								<AppMedia
									src={image}
									alt={product.name}
									fill
									sizes="(max-width: 640px) 100vw, 320px"
									className="object-cover"
								/>
							)}
						</div>
						<div className="p-6 flex flex-col">
							<DialogTitle className="text-2xl font-serif tracking-tight mb-1">{product.name}</DialogTitle>
							{perfumeData?.gender && (
								<span className="text-xs tracking-[0.15em] uppercase text-zinc-500 font-medium mb-3">
									{perfumeData.gender}
								</span>
							)}
							{price && <div className="text-xl font-light text-zinc-800 mb-4">{price}</div>}
							{perfumeData?.scentProfile && (
								<p className="text-sm text-zinc-500 leading-relaxed mb-6">{perfumeData.scentProfile}</p>
							)}
							{perfumeData && (
								<div className="grid grid-cols-3 gap-3 text-xs mb-6">
									<div>
										<span className="block font-medium text-zinc-700 mb-1">Top</span>
										<span className="text-zinc-500">{perfumeData.topNotes.join(", ")}</span>
									</div>
									<div>
										<span className="block font-medium text-zinc-700 mb-1">Heart</span>
										<span className="text-zinc-500">{perfumeData.heartNotes.join(", ")}</span>
									</div>
									<div>
										<span className="block font-medium text-zinc-700 mb-1">Base</span>
										<span className="text-zinc-500">{perfumeData.baseNotes.join(", ")}</span>
									</div>
								</div>
							)}
							<div className="mt-auto space-y-3">
								{isSingleVariant && variant && (
									<Button onClick={handleAddToCart} disabled={isPending} className="w-full gap-2">
										<ShoppingBag className="h-4 w-4" />
										{isPending ? "Adding..." : "Add to Cart"}
									</Button>
								)}
								<AppLink
									href={`/product/${product.slug}`}
									className="block w-full text-center text-sm text-zinc-500 hover:text-zinc-900 transition-colors py-2"
									onClick={() => setOpen(false)}
								>
									View Full Details
								</AppLink>
							</div>
						</div>
					</div>
				</DialogContent>
			</Dialog>
		</>
	);
}
