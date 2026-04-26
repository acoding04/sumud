import { cookies } from "next/headers";
import { COMPARISON_MAX_ITEMS } from "@/lib/comparison-constants";

const COOKIE_NAME = "sumud_comparison";

type ComparisonCookieJson = { slugs: string[] };

export async function setComparisonCookie(json: ComparisonCookieJson) {
	try {
		(await cookies()).set(COOKIE_NAME, JSON.stringify(json), {
			httpOnly: true,
			secure: process.env.NODE_ENV === "production",
			sameSite: "lax",
		});
	} catch (error) {
		console.error("Failed to set comparison cookie", error);
	}
}

export async function getComparisonCookieJson(): Promise<ComparisonCookieJson | null> {
	const raw = (await cookies()).get(COOKIE_NAME)?.value;
	try {
		const parsed = raw ? JSON.parse(raw) : null;
		if (!parsed || typeof parsed !== "object" || !("slugs" in parsed) || !Array.isArray(parsed.slugs)) {
			return null;
		}
		return parsed as ComparisonCookieJson;
	} catch {
		return null;
	}
}

export { COMPARISON_MAX_ITEMS };
