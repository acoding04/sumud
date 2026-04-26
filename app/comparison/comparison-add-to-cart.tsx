"use client";

import { ShoppingBag } from "lucide-react";
import { useTransition } from "react";
import { toast } from "sonner";
import { addToCart } from "@/app/cart/actions";
import { useCart } from "@/app/cart/cart-context";
import { Button } from "@/components/ui/button";

export function ComparisonAddToCart({
	variantId,
	variantPrice,
	variantImages,
	product,
}: {
	variantId: string;
	variantPrice: string;
	variantImages: string[];
	product: { id: string; name: string; slug: string; images: string[] };
}) {
	const [isPending, startTransition] = useTransition();
	const { dispatch } = useCart();

	const handleClick = () => {
		startTransition(async () => {
			dispatch({
				type: "ADD_ITEM",
				item: {
					quantity: 1,
					productVariant: {
						id: variantId,
						price: variantPrice,
						images: variantImages,
						product,
					},
				},
			});
			await addToCart(variantId, 1);
			toast.success(`${product.name} added to cart`);
		});
	};

	return (
		<Button onClick={handleClick} disabled={isPending} size="sm" className="gap-1.5">
			<ShoppingBag className="h-3.5 w-3.5" />
			{isPending ? "Adding..." : "Add to Cart"}
		</Button>
	);
}
