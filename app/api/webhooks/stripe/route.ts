import { NextResponse } from "next/server";
import type Stripe from "stripe";
import { commerce } from "@/lib/commerce";
import { sendOrderConfirmationEmail } from "@/lib/email";
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
		let cartItems: CartItemMeta[] = [];
		try {
			cartItems = cartItemsRaw ? JSON.parse(cartItemsRaw) : [];
		} catch {
			console.error("Failed to parse cart items from Stripe metadata");
			return NextResponse.json({ error: "Invalid cart metadata" }, { status: 400 });
		}

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

		const order = await commerce.orderCreate({
			userId,
			stripeSessionId: session.id,
			customer: {
				email: session.customer_details?.email ?? "",
				name: session.customer_details?.name ?? shippingAddress.name,
			},
			lineItems,
			shippingAddress,
			shipping: {
				name:
					session.metadata?.shippingCost && session.metadata.shippingCost !== "0" ? "Standard" : "Free",
				price: session.metadata?.shippingCost ?? "0",
			},
		});

		if (order?.orderData?.customer?.email) {
			const emailResult = await sendOrderConfirmationEmail(order);
			if (!emailResult.success) {
				console.error(
					`[WEBHOOK] Order created but email failed for order #${order.lookup}: ${emailResult.error}`,
				);
			} else {
				console.log(`[WEBHOOK] Order #${order.lookup} created with email sent (ID: ${emailResult.emailId})`);
			}
		} else {
			console.warn(`[WEBHOOK] Order created but no email address available: ${order?.lookup}`);
		}
	}

	return NextResponse.json({ received: true });
}
