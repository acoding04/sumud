import { NextResponse } from "next/server";
import Stripe from "stripe";
import { CURRENCY } from "@/lib/constants";

// Initialize Stripe with the secret key from environment variables (fallback for build step)
const stripe = new Stripe(
	process.env.STRIPE_SECRET_KEY || "sk_test_dummy",
	{
		apiVersion: "2023-10-16" as any, // adjust according to the Stripe SDK version
	}
);

export async function POST(req: Request) {
	try {
		const { items } = await req.json();

		// Map your application's cart items to Stripe line items
		const line_items = items.map((item: any) => {
			// Create price data according to your item structure
			return {
				price_data: {
					currency: CURRENCY.toLowerCase(),
					product_data: {
						name: item.name || "Product", // Replace with actual item details
						// images: item.image ? [item.image] : [],
					},
					unit_amount: item.price, // Make sure this is the price in cents!
				},
				quantity: item.quantity || 1,
			};
		});

		const origin = req.headers.get("origin") || "http://localhost:3000";

		const session = await stripe.checkout.sessions.create({
			payment_method_types: ["card"],
			line_items,
			mode: "payment",
			success_url: `${origin}/order/success/{CHECKOUT_SESSION_ID}`,
			cancel_url: `${origin}/cart`,
		});

		return NextResponse.json({ url: session.url });
	} catch (error: any) {
		return NextResponse.json({ error: error.message }, { status: 500 });
	}
}
