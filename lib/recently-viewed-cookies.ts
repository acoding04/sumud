import { cookies } from "next/headers";

const COOKIE_NAME = "sumud_recently_viewed";
const MAX_ITEMS = 10;

type RecentlyViewedCookieJson = { slugs: string[] };

export async function setRecentlyViewedCookie(json: RecentlyViewedCookieJson) {
	try {
		(await cookies()).set(COOKIE_NAME, JSON.stringify(json), {
			httpOnly: true,
			secure: process.env.NODE_ENV === "production",
			sameSite: "lax",
		});
	} catch (error) {
		console.error("Failed to set recently viewed cookie", error);
	}
}

export async function getRecentlyViewedCookieJson(): Promise<RecentlyViewedCookieJson | null> {
	const raw = (await cookies()).get(COOKIE_NAME)?.value;
	try {
		const parsed = raw ? JSON.parse(raw) : null;
		if (!parsed || typeof parsed !== "object" || !("slugs" in parsed) || !Array.isArray(parsed.slugs)) {
			return null;
		}
		return parsed as RecentlyViewedCookieJson;
	} catch {
		return null;
	}
}

export async function trackRecentlyViewed(slug: string) {
	const cookie = await getRecentlyViewedCookieJson();
	const current = cookie?.slugs ?? [];
	const updated = [slug, ...current.filter((s) => s !== slug)].slice(0, MAX_ITEMS);
	await setRecentlyViewedCookie({ slugs: updated });
}
