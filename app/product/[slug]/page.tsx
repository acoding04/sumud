import type { Metadata } from "next";
import { cacheLife } from "next/cache";
import { notFound } from "next/navigation";
import { AddToCartButton } from "@/app/product/[slug]/add-to-cart-button";
import { MediaGallery } from "@/app/product/[slug]/media-gallery";
import { ProductReviews } from "@/app/product/[slug]/product-reviews";
import { RelatedProducts } from "@/app/product/[slug]/related-products";
import { commerce } from "@/lib/commerce";
import { CURRENCY, LOCALE } from "@/lib/constants";
import { buildProductBreadcrumbJsonLd, buildProductJsonLd, JsonLdScript } from "@/lib/json-ld";
import { formatMoney } from "@/lib/money";
import { perfumes } from "@/lib/perfume-data";

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
	const { slug } = await params;
	const product = await commerce.productGet({ idOrSlug: slug });

	if (!product) {
		return { title: "Product Not Found — Sumud Scents" };
	}

	return {
		title: `${product.name} — Sumud Scents`,
		description: product.summary ?? undefined,
		openGraph: {
			title: product.name,
			description: product.summary ?? undefined,
			images: product.images[0] ? [product.images[0]] : undefined,
		},
	};
}

export default async function ProductPage(props: { params: Promise<{ slug: string }> }) {
	"use cache";
	cacheLife("minutes");

	return <ProductDetails params={props.params} />;
}

const ProductDetails = async ({ params }: { params: Promise<{ slug: string }> }) => {
	const { slug } = await params;
	const [product, reviews] = await Promise.all([
		commerce.productGet({ idOrSlug: slug }),
		commerce.productReviewsBrowse({ idOrSlug: slug }, { limit: 20 }),
	]);

	if (!product) {
		notFound();
	}

	const perfumeData = perfumes.find((p) => p.slug === slug);

	const { minPrice, maxPrice } = product.variants.reduce(
		(acc: any, v: any) => {
			const price = BigInt(v.price);
			return {
				minPrice: price < acc.minPrice ? price : acc.minPrice,
				maxPrice: price > acc.maxPrice ? price : acc.maxPrice,
			};
		},
		{
			minPrice: product.variants[0] ? BigInt(product.variants[0].price) : BigInt(0),
			maxPrice: product.variants[0] ? BigInt(product.variants[0].price) : BigInt(0),
		},
	);

	const priceDisplay =
		product.variants.length > 1 && minPrice !== maxPrice
			? `${formatMoney({ amount: minPrice, currency: CURRENCY, locale: LOCALE })} - ${formatMoney({ amount: maxPrice, currency: CURRENCY, locale: LOCALE })}`
			: formatMoney({ amount: minPrice, currency: CURRENCY, locale: LOCALE });

	const allImages = [
		...product.images,
		...product.variants.flatMap((v: any) => v.images).filter((img: any) => !product.images.includes(img)),
	];

	return (
		<main className="font-sans w-full overflow-x-hidden bg-white dark:bg-zinc-950 pb-16">
			<JsonLdScript data={buildProductJsonLd(product, reviews)} />
			<JsonLdScript data={buildProductBreadcrumbJsonLd(product)} />

			{/* Light Hero Section */}
			<section className="relative w-full bg-zinc-50 text-zinc-900 min-h-[60vh] lg:min-h-[70vh] flex flex-col justify-center items-center border-b border-zinc-200 pb-16 lg:pb-0 pt-24 lg:pt-0">
				<div className="relative z-10 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-24 grid lg:grid-cols-2 gap-12 lg:gap-24 items-center">
					{/* Left Column: Image/Media Gallery */}
					<div className="w-full">
						<MediaGallery images={allImages} productName={product.name} variants={product.variants} />
					</div>

					{/* Right Column: Title, Details, and Add to Cart */}
					<div className="flex flex-col text-center lg:text-left">
						<span className="text-zinc-500 tracking-[0.25em] text-sm uppercase font-medium mb-4">
							{perfumeData?.id ? `Nº ${perfumeData.id}` : product.category?.name || "Scents"}
						</span>
						<h1 className="text-5xl lg:text-7xl font-serif tracking-tight leading-tight text-zinc-900 mb-4">
							{product.name}
						</h1>

						<div className="flex items-center justify-center lg:justify-start gap-4 mb-8 pt-2">
							<div className="text-3xl font-light tracking-wide text-zinc-800">{priceDisplay}</div>
							{perfumeData?.gender && (
								<div className="px-4 py-1.5 bg-zinc-100 text-zinc-800 text-xs font-semibold tracking-[0.2em] uppercase rounded-full border border-zinc-200">
									{perfumeData.gender}
								</div>
							)}
						</div>

						<p className="text-lg lg:text-xl text-zinc-600 font-light leading-[1.65] mb-12">
							{perfumeData?.scentProfile || product.summary}
						</p>

						{/* Add to Cart within the Right Hero Column to keep it easily accessible alongside Title! */}
						<div className="bg-white border border-zinc-200 p-6 lg:p-8 rounded-2xl shadow-sm text-zinc-900 animate-fade-up transition-all hover:shadow-[0_8px_30px_rgb(0,0,0,0.04)]">
							<AddToCartButton
								variants={product.variants}
								product={{
									id: product.id,
									name: product.name,
									slug: product.slug,
									images: product.images,
								}}
								volumePricingTiers={product.volumePricingTiers}
							/>
						</div>
					</div>
				</div>
			</section>

			{/* Crisp, White Light Information Section */}
			<section className="w-full bg-white text-zinc-900 py-24">
				<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
					{perfumeData ? (
						<>
							<div className="mb-16">
								<h2 className="text-sm font-semibold tracking-[0.2em] text-zinc-400 uppercase mb-2">
									The Architecture
								</h2>
								<h3 className="text-3xl lg:text-4xl font-serif text-zinc-800 tracking-tight">
									Fragrance Notes
								</h3>
							</div>

							<div className="grid grid-cols-1 md:grid-cols-3 gap-12 lg:gap-20 mb-24">
								<div className="flex flex-col">
									<span className="text-xs uppercase tracking-widest text-zinc-400 mb-6 border-b border-zinc-200 pb-4">
										Top Notes
									</span>
									<ul className="space-y-3">
										{perfumeData.topNotes.map((note) => (
											<li key={note} className="text-lg text-zinc-700">
												{note}
											</li>
										))}
									</ul>
								</div>

								<div className="flex flex-col">
									<span className="text-xs uppercase tracking-widest text-zinc-400 mb-6 border-b border-zinc-200 pb-4">
										Heart Notes
									</span>
									<ul className="space-y-3">
										{perfumeData.heartNotes.map((note) => (
											<li key={note} className="text-lg text-zinc-700">
												{note}
											</li>
										))}
									</ul>
								</div>

								<div className="flex flex-col">
									<span className="text-xs uppercase tracking-widest text-zinc-400 mb-6 border-b border-zinc-200 pb-4">
										Base Notes
									</span>
									<ul className="space-y-3">
										{perfumeData.baseNotes.map((note) => (
											<li key={note} className="text-lg text-zinc-700 font-medium">
												{note}
											</li>
										))}
									</ul>
								</div>
							</div>
						</>
					) : (
						<div className="mb-24">
							{product.description && (
								<div
									className="prose prose-zinc prose-lg max-w-none text-zinc-700"
									dangerouslySetInnerHTML={{ __html: product.description }}
								/>
							)}
						</div>
					)}
				</div>
			</section>

			<section className="bg-zinc-50 py-16 border-t border-zinc-100 dark:bg-zinc-950 dark:border-zinc-800">
				<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
					<ProductReviews reviews={reviews} slug={slug} />
					<RelatedProducts productId={product.id} categorySlug={product.category?.slug} />
				</div>
			</section>
		</main>
	);
};
