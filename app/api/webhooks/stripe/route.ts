import { NextResponse } from "next/server";
import type Stripe from "stripe";
import { commerce } from "@/lib/commerce";
import { getStripe } from "@/lib/stripe";

type CartItemMeta = {
	name: string;
	price: string;
	quantity: number;
	image: string;
	variantId: string;
	productSlug: string;
};

export async function POST(req: Request) {
	const body = await req.text();
	const signature = req.headers.get("stripe-signature");

	if (!signature) {
		return NextResponse.json({ error: "Missing stripe-signature header" }, { status: 400 });
	}

	const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;
	if (!webhookSecret) {
		return NextResponse.json({ error: "Webhook secret not configured" }, { status: 500 });
	}

	let event: Stripe.Event;
	try {
		event = await getStripe().webhooks.constructEventAsync(body, signature, webhookSecret);
	} catch {
		return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
	}

	if (event.type === "checkout.session.completed") {
		const session = event.data.object;

		const existing = await commerce.orderGetByStripeSession({
			stripeSessionId: session.id,
		});
		if (existing) {
			return NextResponse.json({ received: true });
		}

		const cartItemsRaw = session.metadata?.cartItems;
		const cartItems: CartItemMeta[] = cartItemsRaw ? JSON.parse(cartItemsRaw) : [];

		let lineItemCounter = 0;
		const lineItems = cartItems.map((item) => ({
			id: `li-${++lineItemCounter}`,
			quantity: item.quantity,
			productVariant: {
				id: item.variantId || "v-unknown",
				price: item.price,
				images: item.image ? [item.image] : [],
				product: {
					id: item.variantId ? `p-${item.variantId.replace("v-", "")}` : "p-unknown",
					name: item.name,
					slug: item.productSlug || "unknown",
					images: item.image ? [item.image] : [],
				},
			},
		}));

		const shippingDetails = session.collected_information?.shipping_details;
		const shippingAddress = shippingDetails
			? {
					name: shippingDetails.name ?? "",
					line1: shippingDetails.address?.line1 ?? "",
					line2: shippingDetails.address?.line2 ?? undefined,
					city: shippingDetails.address?.city ?? "",
					state: shippingDetails.address?.state ?? "",
					postalCode: shippingDetails.address?.postal_code ?? "",
					country: shippingDetails.address?.country ?? "",
				}
			: {
					name: session.customer_details?.name ?? "",
					line1: "",
					city: "",
					state: "",
					postalCode: "",
					country: "GB",
				};

		const userId = session.metadata?.userId ?? "guest";

		await commerce.orderCreate({
			userId,
			stripeSessionId: session.id,
			customer: {
				email: session.customer_details?.email ?? "",
				name: session.customer_details?.name ?? shippingAddress.name,
			},
			lineItems,
			shippingAddress,
			shipping: {
				name: session.shipping_cost ? "Standard" : "Free",
				price: session.shipping_cost ? String(session.shipping_cost.amount_total) : "0",
			},
		});
	}

	return NextResponse.json({ received: true });
}
