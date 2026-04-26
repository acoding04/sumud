import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth";
import { CURRENCY } from "@/lib/constants";
import { getStripe } from "@/lib/stripe";

type CartItem = {
	name: string;
	price: string;
	quantity: number;
	image?: string;
	variantId?: string;
	productSlug?: string;
};

export async function POST(req: Request) {
	try {
		const { items } = (await req.json()) as { items: CartItem[] };

		const lineItems = items.map((item) => ({
			price_data: {
				currency: CURRENCY.toLowerCase(),
				product_data: {
					name: item.name || "Product",
				},
				unit_amount: Number(item.price),
			},
			quantity: item.quantity || 1,
		}));

		const origin = req.headers.get("origin") || "http://localhost:3000";

		const user = await getCurrentUser();
		const userId = user?.id ?? "guest";

		const session = await getStripe().checkout.sessions.create({
			payment_method_types: ["card"],
			line_items: lineItems,
			mode: "payment",
			shipping_address_collection: { allowed_countries: ["GB"] },
			success_url: `${origin}/order/success/{CHECKOUT_SESSION_ID}`,
			cancel_url: `${origin}/cart`,
			metadata: {
				userId,
				cartItems: JSON.stringify(
					items.map((item) => ({
						name: item.name,
						price: item.price,
						quantity: item.quantity,
						image: item.image ?? "",
						variantId: item.variantId ?? "",
						productSlug: item.productSlug ?? "",
					})),
				),
			},
		});

		return NextResponse.json({ url: session.url });
	} catch {
		return NextResponse.json({ error: "Failed to create checkout session" }, { status: 500 });
	}
}
