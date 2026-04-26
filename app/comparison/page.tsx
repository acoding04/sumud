import { ArrowLeftRight } from "lucide-react";
import type { Metadata } from "next";
import { AppLink } from "@/components/app-link";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { AppMedia } from "@/lib/app-media";
import { commerce } from "@/lib/commerce";
import { getComparisonCookieJson } from "@/lib/comparison-cookies";
import { CURRENCY, LOCALE } from "@/lib/constants";
import { formatMoney } from "@/lib/money";
import { perfumes } from "@/lib/perfume-data";
import { ComparisonAddToCart } from "./comparison-add-to-cart";

export const metadata: Metadata = {
	title: "Compare Products — Sumud Scents",
	description: "Compare perfumes side by side.",
};

function getSeriesLabel(slug: string) {
	const prefix = slug.charAt(0);
	if (prefix === "1") return "12-Series (Daytime)";
	if (prefix === "2") return "24-Series (Signature)";
	if (prefix === "4") return "48-Series (Heavyweight)";
	return "—";
}

export default async function ComparisonPage() {
	const cookie = await getComparisonCookieJson();
	const slugs = cookie?.slugs ?? [];

	if (slugs.length === 0) {
		return (
			<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 text-center">
				<div className="flex justify-center mb-6">
					<div className="h-16 w-16 rounded-full bg-zinc-100 flex items-center justify-center">
						<ArrowLeftRight className="h-8 w-8 text-zinc-400" />
					</div>
				</div>
				<h1 className="text-3xl font-serif tracking-tight mb-3">No Products to Compare</h1>
				<p className="text-muted-foreground mb-8">
					Add products to your comparison list by clicking the compare icon on product cards.
				</p>
				<Button asChild>
					<AppLink href="/products">Browse Products</AppLink>
				</Button>
			</div>
		);
	}

	const products = (
		await Promise.all(
			slugs.map(async (slug) => {
				try {
					return await commerce.productGet({ idOrSlug: slug });
				} catch {
					return null;
				}
			}),
		)
	).filter(Boolean);

	const productData = products.map((product) => {
		const perfume = perfumes.find((p) => p.slug === product.slug);
		const price = product.variants[0]
			? formatMoney({ amount: BigInt(product.variants[0].price), currency: CURRENCY, locale: LOCALE })
			: "—";
		return { product, perfume, price };
	});

	const rows = [
		{
			label: "Price",
			values: productData.map((d) => d.price),
		},
		{
			label: "Gender",
			values: productData.map((d) => d.perfume?.gender ?? "—"),
		},
		{
			label: "Series",
			values: productData.map((d) => getSeriesLabel(d.product.slug)),
		},
		{
			label: "Scent Profile",
			values: productData.map((d) => d.perfume?.scentProfile ?? "—"),
		},
		{
			label: "Top Notes",
			values: productData.map((d) => d.perfume?.topNotes.join(", ") ?? "—"),
		},
		{
			label: "Heart Notes",
			values: productData.map((d) => d.perfume?.heartNotes.join(", ") ?? "—"),
		},
		{
			label: "Base Notes",
			values: productData.map((d) => d.perfume?.baseNotes.join(", ") ?? "—"),
		},
	];

	return (
		<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
			<div className="mb-10">
				<h1 className="text-3xl sm:text-4xl font-medium tracking-tight">Compare Products</h1>
				<p className="mt-2 text-muted-foreground">Side-by-side comparison of {products.length} products</p>
			</div>

			<div className="border border-border rounded-lg overflow-hidden">
				<Table>
					<TableHeader>
						<TableRow>
							<TableHead className="w-[140px] bg-secondary/50" />
							{productData.map((d) => (
								<TableHead key={d.product.id} className="text-center bg-secondary/50 min-w-[200px]">
									<AppLink href={`/product/${d.product.slug}`} className="block group">
										<div className="relative w-24 h-24 mx-auto mb-3 rounded-lg overflow-hidden bg-zinc-100">
											{d.product.images[0] && (
												<AppMedia
													src={d.product.images[0]}
													alt={d.product.name}
													fill
													sizes="96px"
													className="object-cover group-hover:scale-105 transition-transform"
												/>
											)}
										</div>
										<span className="text-sm font-medium text-foreground group-hover:text-[#d2ab5a] transition-colors">
											{d.product.name}
										</span>
									</AppLink>
								</TableHead>
							))}
						</TableRow>
					</TableHeader>
					<TableBody>
						{rows.map((row) => (
							<TableRow key={row.label}>
								<TableCell className="font-medium text-sm bg-secondary/30">{row.label}</TableCell>
								{row.values.map((value, i) => (
									<TableCell key={productData[i].product.id} className="text-center text-sm">
										{value}
									</TableCell>
								))}
							</TableRow>
						))}
						<TableRow>
							<TableCell className="bg-secondary/30" />
							{productData.map((d) => (
								<TableCell key={d.product.id} className="text-center">
									{d.product.variants[0] && (
										<ComparisonAddToCart
											variantId={d.product.variants[0].id}
											variantPrice={d.product.variants[0].price}
											variantImages={d.product.variants[0].images}
											product={{
												id: d.product.id,
												name: d.product.name,
												slug: d.product.slug,
												images: d.product.images,
											}}
										/>
									)}
								</TableCell>
							))}
						</TableRow>
					</TableBody>
				</Table>
			</div>
		</div>
	);
}
