"use server";

import { trackRecentlyViewed } from "@/lib/recently-viewed-cookies";

export async function trackRecentlyViewedAction(slug: string) {
	await trackRecentlyViewed(slug);
}
