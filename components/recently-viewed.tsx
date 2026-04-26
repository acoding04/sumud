import { ProductCard } from "@/components/product-card";
import { commerce } from "@/lib/commerce";
import { getRecentlyViewedCookieJson } from "@/lib/recently-viewed-cookies";

export async function RecentlyViewed({ currentSlug }: { currentSlug: string }) {
	const cookie = await getRecentlyViewedCookieJson();
	const slugs = (cookie?.slugs ?? []).filter((s) => s !== currentSlug).slice(0, 4);

	if (slugs.length === 0) return null;

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

	if (products.length === 0) return null;

	return (
		<section className="bg-white py-16 border-t border-zinc-100 dark:bg-zinc-950 dark:border-zinc-800">
			<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
				<h2 className="text-2xl font-serif tracking-tight text-zinc-900 dark:text-zinc-100 mb-8">
					Recently Viewed
				</h2>
				<div className="grid grid-cols-2 md:grid-cols-4 gap-6">
					{products.map((product) => (
						<ProductCard key={product.id} product={product} />
					))}
				</div>
			</div>
		</section>
	);
}
