"use server";

import { COMPARISON_MAX_ITEMS, getComparisonCookieJson, setComparisonCookie } from "@/lib/comparison-cookies";

export async function addToComparison(slug: string) {
	const cookie = await getComparisonCookieJson();
	const current = cookie?.slugs ?? [];
	if (current.includes(slug)) return current;
	if (current.length >= COMPARISON_MAX_ITEMS) return current;
	const updated = [...current, slug];
	await setComparisonCookie({ slugs: updated });
	return updated;
}

export async function removeFromComparison(slug: string) {
	const cookie = await getComparisonCookieJson();
	const current = cookie?.slugs ?? [];
	const updated = current.filter((s) => s !== slug);
	await setComparisonCookie({ slugs: updated });
	return updated;
}

export async function clearComparison() {
	await setComparisonCookie({ slugs: [] });
	return [];
}
