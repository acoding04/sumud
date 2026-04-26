import type { Metadata } from "next";
import { cacheLife } from "next/cache";
import { AppLink } from "@/components/app-link";
import { ProductCard } from "@/components/product-card";
import {
	Breadcrumb,
	BreadcrumbItem,
	BreadcrumbLink,
	BreadcrumbList,
	BreadcrumbPage,
	BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { commerce, getProductRatings } from "@/lib/commerce";
import { perfumes } from "@/lib/perfume-data";
import { ProductFilters } from "./product-filters";
import { ProductsPagination } from "./products-pagination";

const PRODUCTS_PER_PAGE = 12;

const sortOptions = [
	{ value: "newest", label: "Newest", orderBy: "createdAt", orderDirection: "desc" },
	{ value: "top-rated", label: "Top Rated", orderBy: "rating", orderDirection: "desc" },
	{ value: "price-asc", label: "Price: Low to High", orderBy: "price", orderDirection: "asc" },
	{ value: "price-desc", label: "Price: High to Low", orderBy: "price", orderDirection: "desc" },
	{ value: "name", label: "Name: A–Z", orderBy: "name", orderDirection: "asc" },
] as const;

export const metadata: Metadata = {
	title: "All Products — Sumud Scents",
	description: "Browse our complete product collection.",
};

type FilterParams = {
	page?: string;
	sort?: string;
	gender?: string;
	series?: string;
	minPrice?: string;
	maxPrice?: string;
};

function getSeriesPrefix(slug: string) {
	const firstChar = slug.charAt(0);
	if (firstChar === "1") return "12";
	if (firstChar === "2") return "24";
	if (firstChar === "4") return "48";
	return null;
}

async function ProductList({ page, sort, gender, series, minPrice, maxPrice }: FilterParams) {
	"use cache";
	cacheLife("minutes");

	const sortOption = sortOptions.find((s) => s.value === sort) ?? sortOptions[0];

	const result = await commerce.productBrowse({
		active: true,
		limit: 100,
		offset: 0,
		orderBy: sortOption.orderBy,
		orderDirection: sortOption.orderDirection,
	});

	const genderFilter = gender?.split(",").filter(Boolean) ?? [];
	const seriesFilter = series?.split(",").filter(Boolean) ?? [];
	const minPriceVal = minPrice ? BigInt(minPrice) : null;
	const maxPriceVal = maxPrice ? BigInt(maxPrice) : null;

	const filtered = result.data.filter((product: { slug: string; variants: { price: string }[] }) => {
		if (genderFilter.length > 0) {
			const perfumeGender = perfumes.find((p) => p.slug === product.slug)?.gender;
			if (!perfumeGender || !genderFilter.includes(perfumeGender)) return false;
		}

		if (seriesFilter.length > 0) {
			const productSeries = getSeriesPrefix(product.slug);
			if (!productSeries || !seriesFilter.includes(productSeries)) return false;
		}

		if (minPriceVal !== null || maxPriceVal !== null) {
			const lowestPrice = product.variants.reduce(
				(min: bigint, v: { price: string }) => {
					const p = BigInt(v.price);
					return p < min ? p : min;
				},
				BigInt(product.variants[0]?.price ?? "0"),
			);
			if (minPriceVal !== null && lowestPrice < minPriceVal) return false;
			if (maxPriceVal !== null && lowestPrice > maxPriceVal) return false;
		}

		return true;
	});

	if (sort === "top-rated") {
		const ratings = getProductRatings();
		filtered.sort((a: { slug: string }, b: { slug: string }) => {
			const rA = ratings.get(a.slug) ?? 0;
			const rB = ratings.get(b.slug) ?? 0;
			return rB - rA;
		});
	}

	const currentPage = Math.max(1, Number(page) || 1);
	const totalPages = Math.ceil(filtered.length / PRODUCTS_PER_PAGE);
	const offset = (currentPage - 1) * PRODUCTS_PER_PAGE;
	const pageProducts = filtered.slice(offset, offset + PRODUCTS_PER_PAGE);

	if (pageProducts.length === 0) {
		return (
			<div className="py-24 text-center">
				<p className="text-lg text-muted-foreground">
					{filtered.length === 0 && result.data.length > 0
						? "No products match your filters."
						: "No products available yet."}
				</p>
			</div>
		);
	}

	return (
		<>
			<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
				{pageProducts.map(
					(product: {
						id: string;
						name: string;
						slug: string;
						images: string[];
						variants?: { id: string; price: string; images: string[] }[];
					}) => (
						<ProductCard key={product.id} product={product} />
					),
				)}
			</div>

			<ProductsPagination
				currentPage={currentPage}
				totalPages={totalPages}
				sort={sort}
				gender={gender}
				series={series}
				minPrice={minPrice}
				maxPrice={maxPrice}
			/>
		</>
	);
}

function SortLink({ option, currentSort }: { option: (typeof sortOptions)[number]; currentSort?: string }) {
	const isActive = option.value === (currentSort ?? "newest");
	const href = option.value === "newest" ? "/products" : `/products?sort=${option.value}`;

	return (
		<AppLink
			prefetch="eager"
			href={href}
			className={`text-sm transition-colors ${isActive ? "font-medium text-foreground" : "text-muted-foreground hover:text-foreground"}`}
		>
			{option.label}
		</AppLink>
	);
}

export default async function ProductsPage({ searchParams }: { searchParams: Promise<FilterParams> }) {
	const { page, sort, gender, series, minPrice, maxPrice } = await searchParams;

	return (
		<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
			<div className="mb-10">
				<Breadcrumb className="mb-4">
					<BreadcrumbList>
						<BreadcrumbItem>
							<BreadcrumbLink asChild>
								<AppLink prefetch="eager" href="/">
									Home
								</AppLink>
							</BreadcrumbLink>
						</BreadcrumbItem>
						<BreadcrumbSeparator />
						<BreadcrumbItem>
							<BreadcrumbPage>Products</BreadcrumbPage>
						</BreadcrumbItem>
					</BreadcrumbList>
				</Breadcrumb>
				<h1 className="text-3xl sm:text-4xl font-medium tracking-tight">All Products</h1>
				<p className="mt-2 text-muted-foreground">Browse our complete collection</p>
			</div>

			<div className="mb-8 flex flex-wrap items-center gap-3">
				<span className="text-sm text-muted-foreground">Sort by:</span>
				{sortOptions.map((option) => (
					<SortLink key={option.value} option={option} currentSort={sort} />
				))}
			</div>

			<ProductFilters currentFilters={{ gender, series, minPrice, maxPrice, sort }} />

			<ProductList
				page={page}
				sort={sort}
				gender={gender}
				series={series}
				minPrice={minPrice}
				maxPrice={maxPrice}
			/>
		</div>
	);
}
