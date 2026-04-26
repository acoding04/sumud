"use server";

import { clearCartCookie } from "@/lib/cookies";

export async function clearCart() {
	await clearCartCookie();
}
