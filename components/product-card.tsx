import { AppMedia } from "@/lib/app-media";
import { CURRENCY, LOCALE } from "@/lib/constants";
import { formatMoney } from "@/lib/money";
import { isVideoUrl } from "@/lib/utils";
import { AppLink } from "./app-link";
import { CompareButton } from "./compare-button";
import { QuickAddButton } from "./quick-add-button";
import { QuickViewTrigger } from "./quick-view-modal";
import { WishlistButton } from "./wishlist-button";

type ProductCardProduct = {
	id: string;
	name: string;
	slug: string;
	images: string[];
	variants?: { id: string; price: string; images: string[]; attributes?: Record<string, string> }[];
};

export function ProductCard({ product }: { product: ProductCardProduct }) {
	const variants = "variants" in product ? product.variants : null;
	const firstVariantPrice = variants?.[0] ? BigInt(variants[0].price) : null;
	const { minPrice, maxPrice } =
		variants && firstVariantPrice !== null
			? variants.reduce(
					(acc, v) => {
						const price = BigInt(v.price);
						return {
							minPrice: price < acc.minPrice ? price : acc.minPrice,
							maxPrice: price > acc.maxPrice ? price : acc.maxPrice,
						};
					},
					{ minPrice: firstVariantPrice, maxPrice: firstVariantPrice },
				)
			: { minPrice: null, maxPrice: null };

	const priceDisplay =
		variants && variants.length > 1 && minPrice && maxPrice && minPrice !== maxPrice
			? `${formatMoney({ amount: minPrice, currency: CURRENCY, locale: LOCALE })} - ${formatMoney({ amount: maxPrice, currency: CURRENCY, locale: LOCALE })}`
			: minPrice
				? formatMoney({ amount: minPrice, currency: CURRENCY, locale: LOCALE })
				: null;

	const allImages = [
		...(product.images ?? []),
		...(variants?.flatMap((v) => v.images ?? []).filter((img) => !(product.images ?? []).includes(img)) ??
			[]),
	];
	const primaryImage = allImages[0];
	const secondaryImage = allImages[1];

	const singleVariant = variants?.length === 1 ? variants[0] : null;

	return (
		<AppLink
			prefetch={"eager"}
			href={`/product/${product.slug}`}
			className="group block transition-all duration-500 hover:shadow-[0_12px_40px_rgb(0,0,0,0.06)] rounded-2xl pb-4"
		>
			<div className="relative aspect-square bg-secondary rounded-2xl overflow-hidden mb-6">
				{variants?.[0] && (
					<WishlistButton
						variantId={variants[0].id}
						productName={product.name}
						className="absolute top-3 right-3 z-10 h-9 w-9 opacity-100 sm:opacity-0 sm:group-hover:opacity-100 transition-all"
					/>
				)}
				{variants && (
					<QuickViewTrigger
						product={{
							id: product.id,
							name: product.name,
							slug: product.slug,
							images: product.images ?? [],
							variants: variants.map((v) => ({ id: v.id, price: v.price, images: v.images ?? [] })),
						}}
						className="absolute top-3 left-3 z-10 h-9 w-9 rounded-full bg-white/90 backdrop-blur-sm shadow-md flex items-center justify-center text-zinc-600 hover:text-zinc-900 hover:bg-white opacity-0 sm:group-hover:opacity-100 transition-all"
					/>
				)}
				<CompareButton
					slug={product.slug}
					productName={product.name}
					className="absolute bottom-3 left-3 z-10 h-9 w-9 opacity-0 sm:group-hover:opacity-100 transition-all"
				/>
				{singleVariant && (
					<div className="absolute inset-x-0 bottom-4 z-10 mx-auto w-[85%] opacity-0 transform translate-y-4 transition-all duration-300 group-hover:opacity-100 group-hover:translate-y-0">
						<QuickAddButton
							variantId={singleVariant.id}
							variantPrice={singleVariant.price}
							variantImages={singleVariant.images}
							product={{
								id: product.id,
								name: product.name,
								slug: product.slug,
								images: product.images ?? [],
							}}
						/>
					</div>
				)}
				{primaryImage &&
					(isVideoUrl(primaryImage) ? (
						<video
							className={`absolute inset-0 w-full h-full object-cover transform transition-all duration-700 group-hover:scale-105 ${secondaryImage ? "group-hover:opacity-0" : ""}`}
							src={primaryImage}
							muted
							loop
							autoPlay
							playsInline
						/>
					) : (
						<AppMedia
							src={primaryImage}
							alt={product.name}
							fill
							sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
							className={`object-cover transform transition-all duration-700 group-hover:scale-105 ${secondaryImage ? "group-hover:opacity-0" : ""}`}
						/>
					))}
				{secondaryImage &&
					(isVideoUrl(secondaryImage) ? (
						<video
							className="absolute inset-0 w-full h-full object-cover transform transition-all duration-700 scale-100 opacity-0 group-hover:scale-105 group-hover:opacity-100"
							src={secondaryImage}
							muted
							loop
							autoPlay
							playsInline
						/>
					) : (
						<AppMedia
							src={secondaryImage}
							alt={`${product.name} - alternate view`}
							fill
							sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
							className="object-cover transform transition-all duration-700 scale-100 opacity-0 group-hover:scale-105 group-hover:opacity-100"
						/>
					))}
			</div>
			<div className="space-y-1.5 px-2">
				<h3 className="text-[1.05rem] font-medium tracking-tight text-foreground leading-snug">
					{product.name}
				</h3>
				<p className="text-base font-semibold text-muted-foreground">{priceDisplay}</p>
			</div>
		</AppLink>
	);
}
