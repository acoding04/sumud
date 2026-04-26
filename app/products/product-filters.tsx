"use client";

import { ChevronDown, SlidersHorizontal, X } from "lucide-react";
import { useRouter } from "next/navigation";
import { useCallback, useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { Slider } from "@/components/ui/slider";
import { CURRENCY, LOCALE } from "@/lib/constants";
import { formatMoney } from "@/lib/money";

const GENDERS = ["Male", "Female", "Unisex"] as const;
const SERIES = ["12", "24", "48"] as const;
const PRICE_MIN = 0;
const PRICE_MAX = 4000;
const PRICE_STEP = 500;

const SERIES_LABELS: Record<string, string> = {
	"12": "12-Series (Daytime)",
	"24": "24-Series (Signature)",
	"48": "48-Series (Heavyweight)",
};

type FilterValues = {
	gender?: string;
	series?: string;
	minPrice?: string;
	maxPrice?: string;
};

function formatPrice(amount: number) {
	return formatMoney({ amount: BigInt(amount), currency: CURRENCY, locale: LOCALE });
}

function FilterContent({
	filters,
	onFilterChange,
}: {
	filters: FilterValues;
	onFilterChange: (filters: FilterValues) => void;
}) {
	const activeGenders = filters.gender?.split(",").filter(Boolean) ?? [];
	const activeSeries = filters.series?.split(",").filter(Boolean) ?? [];
	const priceRange = [Number(filters.minPrice) || PRICE_MIN, Number(filters.maxPrice) || PRICE_MAX];

	const toggleGender = (gender: string) => {
		const updated = activeGenders.includes(gender)
			? activeGenders.filter((g) => g !== gender)
			: [...activeGenders, gender];
		onFilterChange({ ...filters, gender: updated.join(",") || undefined });
	};

	const toggleSeries = (series: string) => {
		const updated = activeSeries.includes(series)
			? activeSeries.filter((s) => s !== series)
			: [...activeSeries, series];
		onFilterChange({ ...filters, series: updated.join(",") || undefined });
	};

	const handlePriceChange = (value: number[]) => {
		onFilterChange({
			...filters,
			minPrice: value[0] > PRICE_MIN ? String(value[0]) : undefined,
			maxPrice: value[1] < PRICE_MAX ? String(value[1]) : undefined,
		});
	};

	return (
		<div className="space-y-6">
			<div>
				<h4 className="text-sm font-medium mb-3">Gender</h4>
				<div className="space-y-2">
					{GENDERS.map((gender) => (
						<label key={gender} className="flex items-center gap-2 cursor-pointer">
							<Checkbox
								checked={activeGenders.includes(gender)}
								onCheckedChange={() => toggleGender(gender)}
							/>
							<span className="text-sm">{gender}</span>
						</label>
					))}
				</div>
			</div>

			<div>
				<h4 className="text-sm font-medium mb-3">Series</h4>
				<div className="space-y-2">
					{SERIES.map((series) => (
						<label key={series} className="flex items-center gap-2 cursor-pointer">
							<Checkbox
								checked={activeSeries.includes(series)}
								onCheckedChange={() => toggleSeries(series)}
							/>
							<span className="text-sm">{SERIES_LABELS[series]}</span>
						</label>
					))}
				</div>
			</div>

			<div>
				<h4 className="text-sm font-medium mb-3">Price Range</h4>
				<Slider
					min={PRICE_MIN}
					max={PRICE_MAX}
					step={PRICE_STEP}
					value={priceRange}
					onValueChange={handlePriceChange}
					className="mb-2"
				/>
				<div className="flex justify-between text-xs text-muted-foreground">
					<span>{formatPrice(priceRange[0])}</span>
					<span>{formatPrice(priceRange[1])}</span>
				</div>
			</div>
		</div>
	);
}

export function ProductFilters({ currentFilters }: { currentFilters: FilterValues & { sort?: string } }) {
	const router = useRouter();
	const [mobileOpen, setMobileOpen] = useState(false);

	const activeFilterCount = [
		currentFilters.gender,
		currentFilters.series,
		currentFilters.minPrice,
		currentFilters.maxPrice,
	].filter(Boolean).length;

	const applyFilters = useCallback(
		(filters: FilterValues) => {
			const params = new URLSearchParams();
			if (currentFilters.sort) params.set("sort", currentFilters.sort);
			if (filters.gender) params.set("gender", filters.gender);
			if (filters.series) params.set("series", filters.series);
			if (filters.minPrice) params.set("minPrice", filters.minPrice);
			if (filters.maxPrice) params.set("maxPrice", filters.maxPrice);
			const qs = params.size ? `?${params.toString()}` : "";
			router.push(`/products${qs}`);
		},
		[currentFilters.sort],
	);

	const clearFilters = () => {
		const params = new URLSearchParams();
		if (currentFilters.sort) params.set("sort", currentFilters.sort);
		const qs = params.size ? `?${params.toString()}` : "";
		router.push(`/products${qs}`);
	};

	return (
		<div className="mb-6 flex items-center gap-3">
			{/* Desktop filters */}
			<div className="hidden lg:flex items-center gap-2">
				<Popover>
					<PopoverTrigger asChild>
						<Button variant="outline" size="sm" className="gap-1.5">
							Gender
							{currentFilters.gender && (
								<Badge variant="secondary" className="ml-1 h-5 px-1.5 text-xs">
									{currentFilters.gender.split(",").length}
								</Badge>
							)}
							<ChevronDown className="h-3.5 w-3.5" />
						</Button>
					</PopoverTrigger>
					<PopoverContent align="start" className="w-48">
						<div className="space-y-2">
							{GENDERS.map((gender) => {
								const active = currentFilters.gender?.split(",").includes(gender);
								return (
									<label key={gender} className="flex items-center gap-2 cursor-pointer">
										<Checkbox
											checked={active}
											onCheckedChange={() => {
												const current = currentFilters.gender?.split(",").filter(Boolean) ?? [];
												const updated = active ? current.filter((g) => g !== gender) : [...current, gender];
												applyFilters({ ...currentFilters, gender: updated.join(",") || undefined });
											}}
										/>
										<span className="text-sm">{gender}</span>
									</label>
								);
							})}
						</div>
					</PopoverContent>
				</Popover>

				<Popover>
					<PopoverTrigger asChild>
						<Button variant="outline" size="sm" className="gap-1.5">
							Series
							{currentFilters.series && (
								<Badge variant="secondary" className="ml-1 h-5 px-1.5 text-xs">
									{currentFilters.series.split(",").length}
								</Badge>
							)}
							<ChevronDown className="h-3.5 w-3.5" />
						</Button>
					</PopoverTrigger>
					<PopoverContent align="start" className="w-56">
						<div className="space-y-2">
							{SERIES.map((series) => {
								const active = currentFilters.series?.split(",").includes(series);
								return (
									<label key={series} className="flex items-center gap-2 cursor-pointer">
										<Checkbox
											checked={active}
											onCheckedChange={() => {
												const current = currentFilters.series?.split(",").filter(Boolean) ?? [];
												const updated = active ? current.filter((s) => s !== series) : [...current, series];
												applyFilters({ ...currentFilters, series: updated.join(",") || undefined });
											}}
										/>
										<span className="text-sm">{SERIES_LABELS[series]}</span>
									</label>
								);
							})}
						</div>
					</PopoverContent>
				</Popover>

				<Popover>
					<PopoverTrigger asChild>
						<Button variant="outline" size="sm" className="gap-1.5">
							Price
							{(currentFilters.minPrice || currentFilters.maxPrice) && (
								<Badge variant="secondary" className="ml-1 h-5 px-1.5 text-xs">
									1
								</Badge>
							)}
							<ChevronDown className="h-3.5 w-3.5" />
						</Button>
					</PopoverTrigger>
					<PopoverContent align="start" className="w-64">
						<Slider
							min={PRICE_MIN}
							max={PRICE_MAX}
							step={PRICE_STEP}
							value={[
								Number(currentFilters.minPrice) || PRICE_MIN,
								Number(currentFilters.maxPrice) || PRICE_MAX,
							]}
							onValueCommit={(value) => {
								applyFilters({
									...currentFilters,
									minPrice: value[0] > PRICE_MIN ? String(value[0]) : undefined,
									maxPrice: value[1] < PRICE_MAX ? String(value[1]) : undefined,
								});
							}}
							className="mb-2"
						/>
						<div className="flex justify-between text-xs text-muted-foreground">
							<span>{formatPrice(Number(currentFilters.minPrice) || PRICE_MIN)}</span>
							<span>{formatPrice(Number(currentFilters.maxPrice) || PRICE_MAX)}</span>
						</div>
					</PopoverContent>
				</Popover>
			</div>

			{/* Mobile filter button */}
			<Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
				<SheetTrigger asChild>
					<Button variant="outline" size="sm" className="lg:hidden gap-1.5">
						<SlidersHorizontal className="h-3.5 w-3.5" />
						Filters
						{activeFilterCount > 0 && (
							<Badge variant="secondary" className="ml-1 h-5 px-1.5 text-xs">
								{activeFilterCount}
							</Badge>
						)}
					</Button>
				</SheetTrigger>
				<SheetContent side="left" className="w-80">
					<SheetHeader>
						<SheetTitle>Filters</SheetTitle>
					</SheetHeader>
					<div className="mt-6">
						<FilterContent
							filters={currentFilters}
							onFilterChange={(filters) => {
								applyFilters(filters);
								setMobileOpen(false);
							}}
						/>
					</div>
				</SheetContent>
			</Sheet>

			{/* Clear filters */}
			{activeFilterCount > 0 && (
				<Button variant="ghost" size="sm" onClick={clearFilters} className="gap-1.5 text-muted-foreground">
					<X className="h-3.5 w-3.5" />
					Clear filters
				</Button>
			)}
		</div>
	);
}
