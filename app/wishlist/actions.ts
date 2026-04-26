"use server";

import { getWishlistCookieJson, setWishlistCookie } from "@/lib/wishlist-cookies";

export async function toggleWishlistItem(variantId: string) {
	const current = await getWishlistCookieJson();
	const variantIds = current?.variantIds ?? [];

	const updated = variantIds.includes(variantId)
		? variantIds.filter((id) => id !== variantId)
		: [...variantIds, variantId];

	await setWishlistCookie({ variantIds: updated });
	return updated;
}
