"use server";

import { commerce } from "@/lib/commerce";
import { getCartCookieJson, setCartCookie } from "@/lib/cookies";

export async function getCart() {
	const cartCookie = await getCartCookieJson();

	if (!cartCookie?.id) {
		return null;
	}

	try {
		return await commerce.cartGet({ cartId: cartCookie.id });
	} catch {
		return null;
	}
}

export async function addToCart(variantId: string, quantity = 1) {
	const cartCookie = await getCartCookieJson();

	const cart = await commerce.cartUpsert({
		cartId: cartCookie?.id,
		variantId,
		quantity,
	});

	if (!cart) {
		return { success: false, cart: null };
	}

	await setCartCookie({ id: cart.id });

	// Fetch full cart data to sync with client
	const fullCart = await commerce.cartGet({ cartId: cart.id });

	return { success: true, cart: fullCart };
}

export async function removeFromCart(variantId: string) {
	const cartCookie = await getCartCookieJson();

	if (!cartCookie?.id) {
		return { success: false, cart: null };
	}

	try {
		// Set quantity to 0 to remove the item
		await commerce.cartUpsert({
			cartId: cartCookie.id,
			variantId,
			quantity: 0,
		});

		// Fetch updated cart
		const cart = await commerce.cartGet({ cartId: cartCookie.id });
		return { success: true, cart };
	} catch {
		return { success: false, cart: null };
	}
}

// Set absolute quantity for a cart item
export async function setCartQuantity(variantId: string, quantity: number) {
	const cartCookie = await getCartCookieJson();

	if (!cartCookie?.id) {
		return { success: false, cart: null };
	}

	try {
		if (quantity <= 0) {
			// Remove item
			await commerce.cartUpsert({ cartId: cartCookie.id, variantId, quantity: 0 });
		} else {
			const currentCart = await commerce.cartGet({ cartId: cartCookie.id });
			// eslint-disable-next-line @typescript-eslint/no-explicit-any
			const existingItem = currentCart?.lineItems?.find((item: any) => item.productVariant.id === variantId);
			const existingQuantity = existingItem ? existingItem.quantity : 0;
			const diff = quantity - existingQuantity;

			if (diff !== 0) {
				await commerce.cartUpsert({ cartId: cartCookie.id, variantId, quantity: diff });
			}
		}

		// Fetch updated cart
		const cart = await commerce.cartGet({ cartId: cartCookie.id });
		return { success: true, cart };
	} catch {
		return { success: false, cart: null };
	}
}
