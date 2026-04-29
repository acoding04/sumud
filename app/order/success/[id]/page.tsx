import { CheckCircle, Clock } from "lucide-react";
import { cacheLife } from "next/cache";
import { AppLink } from "@/components/app-link";
import { Button } from "@/components/ui/button";
import { AppMedia } from "@/lib/app-media";
import { commerce } from "@/lib/commerce";
import { CURRENCY, LOCALE } from "@/lib/constants";
import { formatMoney } from "@/lib/money";
import { getProductThumbnail } from "@/lib/utils";
import { getStripe } from "@/lib/stripe";
import { sendOrderConfirmationEmail } from "@/lib/email";
import { ClearCartOnMount } from "./clear-cart";

export default async function OrderSuccessPage(props: { params: Promise<{ id: string }> }) {
	"use cache";
	cacheLife("seconds");

	return <OrderDetails params={props.params} />;
}

type CartItemMeta = {
        name: string;
        price: string;
        quantity: number;
        image: string;
        variantId: string;
        productSlug: string;
};

const OrderDetails = async ({ params }: { params: Promise<{ id: string }> }) => {
        const { id } = await params;

        let order =
                (await commerce.orderGetByStripeSession({ stripeSessionId: id })) ?? (await commerce.orderGet({ id }));

        if (!order) {
                try {
                        const session = await getStripe().checkout.sessions.retrieve(id);
                        if (session.payment_status === "paid") {
                                const cartItemsRaw = session.metadata?.cartItems;
                                let cartItems: CartItemMeta[] = [];
                                try {
                                        cartItems = cartItemsRaw ? JSON.parse(cartItemsRaw) : [];
                                } catch {
                                        console.error("Failed to parse cart items from Stripe metadata");
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
                                const email = session.customer_details?.email ?? "";

                                order = await commerce.orderCreate({
                                        userId,
                                        stripeSessionId: session.id,
                                        customer: {
                                                email,
                                                name: session.customer_details?.name ?? shippingAddress.name,
                                        },
                                        lineItems,
                                        shippingAddress,
                                        shipping: {
                                                name: session.shipping_cost ? "Standard" : "Free",
                                                price: session.shipping_cost ? String(session.shipping_cost.amount_total) : "0",
                                        },
                                });

                                if (order?.orderData?.customer?.email) {
                                        await sendOrderConfirmationEmail(order);
                                }
                        }
                } catch (e) {
                        console.error("Failed to retrieve Stripe session", e);
                }
        }

        if (!order) {
		return (
			<div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
				<ClearCartOnMount />
				<div className="text-center mb-10">
					<div className="flex justify-center mb-4">
						<div className="flex h-16 w-16 items-center justify-center rounded-full bg-amber-100">
							<Clock className="h-8 w-8 text-amber-600" />
						</div>
					</div>
					<h1 className="text-3xl font-semibold tracking-tight">Your order is being processed</h1>
					<p className="text-muted-foreground mt-2">
						We&apos;re confirming your payment. This usually takes a few seconds.
					</p>
					<p className="text-sm text-muted-foreground mt-4">
						Please refresh this page in a moment, or check your email for confirmation.
					</p>
				</div>
				<div className="mt-8 text-center space-x-4">
					<Button variant="outline" asChild>
						<AppLink prefetch="eager" href={`/order/success/${id}`}>
							Refresh
						</AppLink>
					</Button>
					<Button asChild>
						<AppLink prefetch="eager" href="/">
							Continue Shopping
						</AppLink>
					</Button>
				</div>
			</div>
		);
	}

	const lineItems = order.orderData.lineItems;
	const shippingAddress = order.orderData.shippingAddress;
	const shipping = order.orderData.shipping;
	const customer = order.orderData.customer;

	const subtotal = lineItems.reduce(
		(acc: bigint, item: { productVariant: { price: string }; quantity: number }) => {
			return acc + BigInt(item.productVariant.price) * BigInt(item.quantity);
		},
		BigInt(0),
	);

	const shippingCost = shipping ? BigInt(shipping.price) : BigInt(0);
	const standardShippingCost = 395n;
	const isFreeShipping = shippingCost === 0n;
	const total = subtotal + shippingCost;

	return (
		<div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
			<ClearCartOnMount />

			{/* Success Header */}
			<div className="text-center mb-10">
				<div className="flex justify-center mb-4">
					<div className="flex h-16 w-16 items-center justify-center rounded-full bg-green-100">
						<CheckCircle className="h-8 w-8 text-green-600" />
					</div>
				</div>
				<h1 className="text-3xl font-semibold tracking-tight">Thank you for your order!</h1>
				<p className="text-muted-foreground mt-2">Order #{order.lookup} has been confirmed</p>
				{customer?.email && (
					<p className="text-sm text-muted-foreground mt-1">
						A confirmation email will be sent to {customer.email}
					</p>
				)}
			</div>

			{/* Order Items */}
			<div className="border border-border rounded-lg overflow-hidden">
				<div className="bg-secondary/50 px-6 py-4 border-b border-border">
					<h2 className="font-medium">Order Items</h2>
				</div>
				<div className="divide-y divide-border">
					{lineItems.map((item: OrderLineItem) => (
						<OrderItem key={item.id} item={item} />
					))}
				</div>

				{/* Order Summary */}
				<div className="bg-secondary/30 px-6 py-4 space-y-2">
					<div className="flex items-center justify-between text-sm">
						<span className="text-muted-foreground">Subtotal</span>
						<span>{formatMoney({ amount: subtotal, currency: CURRENCY, locale: LOCALE })}</span>
					</div>
					{shipping && (
						<div className="flex items-center justify-between text-sm">
							<span className="text-muted-foreground">Shipping ({shipping.name})</span>
							<span className={isFreeShipping ? "flex items-center gap-2" : ""}>
								{isFreeShipping ? (
									<>
										<span className="text-muted-foreground line-through">
											{formatMoney({ amount: standardShippingCost, currency: CURRENCY, locale: LOCALE })}
										</span>
										<span className="font-medium text-foreground">
											{formatMoney({ amount: BigInt(0), currency: CURRENCY, locale: LOCALE })}
										</span>
									</>
								) : (
									formatMoney({ amount: shippingCost, currency: CURRENCY, locale: LOCALE })
								)}
							</span>
						</div>
					)}
					<div className="flex items-center justify-between font-semibold pt-2 border-t border-border">
						<span>Total</span>
						<span>{formatMoney({ amount: total, currency: CURRENCY, locale: LOCALE })}</span>
					</div>
				</div>
			</div>

			{/* Shipping Address */}
			{shippingAddress && (
				<div className="border border-border rounded-lg overflow-hidden mt-6">
					<div className="bg-secondary/50 px-6 py-4 border-b border-border">
						<h2 className="font-medium">Shipping Address</h2>
					</div>
					<div className="px-6 py-4 text-sm text-muted-foreground">
						{shippingAddress.name && <p className="text-foreground font-medium">{shippingAddress.name}</p>}
						{shippingAddress.line1 && <p>{shippingAddress.line1}</p>}
						{shippingAddress.line2 && <p>{shippingAddress.line2}</p>}
						<p>
							{[shippingAddress.city, shippingAddress.state, shippingAddress.postalCode]
								.filter(Boolean)
								.join(", ")}
						</p>
						{shippingAddress.country && <p>{shippingAddress.country}</p>}
					</div>
				</div>
			)}

			{/* Continue Shopping Button */}
			<div className="mt-8 text-center">
				<Button asChild>
					<AppLink prefetch="eager" href="/">
						Continue Shopping
					</AppLink>
				</Button>
			</div>
		</div>
	);
};

type OrderLineItem = {
	id: string;
	quantity: number;
	productVariant: {
		id: string;
		price: string;
		images: string[];
		product: {
			id: string;
			name: string;
			slug: string;
			images: string[];
		};
	};
};

function OrderItem({ item }: { item: OrderLineItem }) {
	const { productVariant, quantity } = item;
	const { product } = productVariant;

	const image = getProductThumbnail(productVariant.images) ?? getProductThumbnail(product.images);
	const price = BigInt(productVariant.price);
	const lineTotal = price * BigInt(quantity);

	return (
		<div className="flex gap-4 p-6">
			{/* Product Image */}
			<AppLink
				prefetch="eager"
				href={`/product/${product.slug}`}
				className="relative h-20 w-20 shrink-0 overflow-hidden rounded-lg bg-secondary"
			>
				{image && <AppMedia src={image} alt={product.name} fill className="object-cover" sizes="80px" />}
			</AppLink>

			{/* Product Details */}
			<div className="flex min-w-0 flex-1 flex-col justify-between">
				<div>
					<AppLink
						prefetch="eager"
						href={`/product/${product.slug}`}
						className="text-sm font-medium leading-tight text-foreground hover:underline line-clamp-2"
					>
						{product.name}
					</AppLink>
					<p className="text-sm text-muted-foreground mt-1">Qty: {quantity}</p>
				</div>
				<p className="text-sm font-semibold">
					{formatMoney({ amount: lineTotal, currency: CURRENCY, locale: LOCALE })}
				</p>
			</div>
		</div>
	);
}
