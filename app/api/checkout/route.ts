import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth";
import { commerce } from "@/lib/commerce";
import { CURRENCY } from "@/lib/constants";
import { calculateDiscount, validatePromoCode } from "@/lib/promo-codes";
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
		const { items, promoCode } = (await req.json()) as {
			items: CartItem[];
			promoCode?: string | null;
		};

		if (!items?.length) {
			return NextResponse.json({ error: "Cart is empty" }, { status: 400 });
		}

		const verifiedItems = await Promise.all(
			items.map(async (item) => {
				if (!item.variantId) return item;
				const product = await commerce.productGet({ idOrSlug: item.variantId.replace("v-", "p-") });
				const variant = product?.variants.find((v: { id: string; price: string }) => v.id === item.variantId);
				if (variant) {
					return { ...item, price: variant.price };
				}
				return item;
			}),
		);

		const lineItems = verifiedItems.map((item) => ({
			price_data: {
				currency: CURRENCY.toLowerCase(),
				product_data: {
					name: item.name || "Product",
				},
				unit_amount: Number(item.price),
			},
			quantity: item.quantity || 1,
		}));

		const subtotal = verifiedItems.reduce(
			(sum, item) => sum + BigInt(item.price) * BigInt(item.quantity || 1),
			0n,
		);

		let discountAmount = 0n;
		let validatedPromo: ReturnType<typeof validatePromoCode> = null;

		if (promoCode) {
			validatedPromo = validatePromoCode(promoCode);
			if (validatedPromo) {
				discountAmount = calculateDiscount(subtotal, validatedPromo);
			}
		}

		const origin = req.headers.get("origin") || "http://localhost:3000";

		let cancelUrl: URL;
		try {
			cancelUrl = new URL(req.headers.get("referer") || origin);
		} catch {
			cancelUrl = new URL(origin);
		}
		cancelUrl.searchParams.set("cart", "open");

		const user = await getCurrentUser();
		const userId = user?.id ?? "guest";

		const stripe = getStripe();

		let couponId: string | undefined;
		if (discountAmount > 0n) {
			const coupon = await stripe.coupons.create({
				amount_off: Number(discountAmount),
				currency: CURRENCY.toLowerCase(),
				duration: "once",
				name: validatedPromo?.label ?? "Discount",
			});
			couponId = coupon.id;
		}

		const session = await stripe.checkout.sessions.create({
			payment_method_types: ["card"],
			line_items: lineItems,
			mode: "payment",
			customer_email: user?.email ?? undefined,
			shipping_address_collection: { allowed_countries: ["GB"] },
			success_url: `${origin}/order/success/{CHECKOUT_SESSION_ID}`,
			cancel_url: cancelUrl.toString(),
			...(couponId && {
				discounts: [{ coupon: couponId }],
			}),
			metadata: {
				userId,
				cartItems: JSON.stringify(
					verifiedItems.map((item) => ({
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
