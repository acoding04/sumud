import { cookies } from "next/headers";

const WISHLIST_COOKIE = "sumud_wishlist";

type WishlistCookieJson = { variantIds: string[] };

export async function setWishlistCookie(json: WishlistCookieJson) {
	try {
		(await cookies()).set(WISHLIST_COOKIE, JSON.stringify(json), {
			httpOnly: true,
			secure: process.env.NODE_ENV === "production",
			sameSite: "lax",
		});
	} catch (error) {
		console.error("Failed to set wishlist cookie", error);
	}
}

export async function getWishlistCookieJson(): Promise<WishlistCookieJson | null> {
	const raw = (await cookies()).get(WISHLIST_COOKIE)?.value;
	try {
		const parsed = raw ? JSON.parse(raw) : null;
		if (
			!parsed ||
			typeof parsed !== "object" ||
			!("variantIds" in parsed) ||
			!Array.isArray(parsed.variantIds)
		) {
			return null;
		}
		return parsed as WishlistCookieJson;
	} catch {
		return null;
	}
}
