import { Package } from "lucide-react";
import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { AppLink } from "@/components/app-link";
import {
	Breadcrumb,
	BreadcrumbItem,
	BreadcrumbLink,
	BreadcrumbList,
	BreadcrumbPage,
	BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Button } from "@/components/ui/button";
import { AppMedia } from "@/lib/app-media";
import { getCurrentUser } from "@/lib/auth";
import { commerce } from "@/lib/commerce";
import { CURRENCY, LOCALE } from "@/lib/constants";
import { formatMoney } from "@/lib/money";

export const metadata: Metadata = {
	title: "Order History — Sumud Scents",
};

export default async function OrdersPage() {
	const user = await getCurrentUser();
	if (!user) redirect("/login");

	const { data: allOrders } = await commerce.orderBrowse({ userId: user.id });

	return (
		<div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
			<Breadcrumb className="mb-6">
				<BreadcrumbList>
					<BreadcrumbItem>
						<BreadcrumbLink asChild>
							<AppLink prefetch="eager" href="/account">
								Account
							</AppLink>
						</BreadcrumbLink>
					</BreadcrumbItem>
					<BreadcrumbSeparator />
					<BreadcrumbItem>
						<BreadcrumbPage>Orders</BreadcrumbPage>
					</BreadcrumbItem>
				</BreadcrumbList>
			</Breadcrumb>

			<h1 className="text-3xl sm:text-4xl font-medium tracking-tight mb-2">Order History</h1>
			<p className="text-muted-foreground mb-10">
				{allOrders.length} {allOrders.length === 1 ? "order" : "orders"}
			</p>

			{allOrders.length === 0 ? (
				<div className="text-center py-16">
					<div className="flex justify-center mb-4">
						<div className="h-16 w-16 rounded-full bg-zinc-100 flex items-center justify-center">
							<Package className="h-8 w-8 text-zinc-400" />
						</div>
					</div>
					<p className="text-muted-foreground mb-6">You haven&apos;t placed any orders yet.</p>
					<Button asChild>
						<AppLink href="/products">Browse Products</AppLink>
					</Button>
				</div>
			) : (
				<div className="space-y-6">
					{allOrders.map((order) => (
						<OrderDetailCard key={order.id} order={order} />
					))}
				</div>
			)}
		</div>
	);
}

function OrderDetailCard({
	order,
}: {
	order: {
		id: string;
		lookup: string;
		status: string;
		createdAt: string;
		orderData: {
			lineItems: {
				id: string;
				quantity: number;
				productVariant: {
					price: string;
					images: string[];
					product: { name: string; slug: string; images: string[] };
				};
			}[];
			shipping: { name: string; price: string };
			shippingAddress: { name: string; line1: string; city: string; postalCode: string; country: string };
		};
	};
}) {
	const subtotal = order.orderData.lineItems.reduce(
		(sum, item) => sum + BigInt(item.productVariant.price) * BigInt(item.quantity),
		BigInt(0),
	);
	const shippingCost = BigInt(order.orderData.shipping.price);
	const total = subtotal + shippingCost;

	const statusColors: Record<string, string> = {
		confirmed: "bg-blue-100 text-blue-700",
		processing: "bg-yellow-100 text-yellow-700",
		shipped: "bg-purple-100 text-purple-700",
		delivered: "bg-green-100 text-green-700",
	};

	return (
		<div className="border border-border rounded-lg overflow-hidden">
			<div className="bg-secondary/50 px-6 py-4 flex flex-wrap items-center justify-between gap-4">
				<div className="flex items-center gap-3">
					<span className="font-medium">#{order.lookup}</span>
					<span
						className={`text-xs px-2.5 py-1 rounded-full font-medium capitalize ${statusColors[order.status] ?? "bg-zinc-100 text-zinc-700"}`}
					>
						{order.status}
					</span>
				</div>
				<div className="flex items-center gap-4 text-sm text-muted-foreground">
					<span>
						{new Date(order.createdAt).toLocaleDateString(undefined, {
							year: "numeric",
							month: "long",
							day: "numeric",
						})}
					</span>
					<span className="font-medium text-foreground">
						{formatMoney({ amount: total, currency: CURRENCY, locale: LOCALE })}
					</span>
				</div>
			</div>
			<div className="divide-y divide-border">
				{order.orderData.lineItems.map((item) => {
					const image = item.productVariant.images[0] ?? item.productVariant.product.images[0];
					const lineTotal = BigInt(item.productVariant.price) * BigInt(item.quantity);
					return (
						<div key={item.id} className="flex items-center gap-4 px-6 py-4">
							<AppLink
								href={`/product/${item.productVariant.product.slug}`}
								className="relative h-14 w-14 rounded-lg overflow-hidden bg-zinc-100 shrink-0"
							>
								{image && (
									<AppMedia
										src={image}
										alt={item.productVariant.product.name}
										fill
										sizes="56px"
										className="object-cover"
									/>
								)}
							</AppLink>
							<div className="flex-1 min-w-0">
								<AppLink
									href={`/product/${item.productVariant.product.slug}`}
									className="text-sm font-medium hover:underline line-clamp-1"
								>
									{item.productVariant.product.name}
								</AppLink>
								<p className="text-xs text-muted-foreground">Qty: {item.quantity}</p>
							</div>
							<span className="text-sm font-medium shrink-0">
								{formatMoney({ amount: lineTotal, currency: CURRENCY, locale: LOCALE })}
							</span>
						</div>
					);
				})}
			</div>
			<div className="bg-secondary/30 px-6 py-3 flex justify-between text-sm">
				<span className="text-muted-foreground">
					Shipping: {order.orderData.shipping.name} (
					{shippingCost > BigInt(0)
						? formatMoney({ amount: shippingCost, currency: CURRENCY, locale: LOCALE })
						: "Free"}
					)
				</span>
				<span className="text-muted-foreground">
					{order.orderData.shippingAddress.city}, {order.orderData.shippingAddress.country}
				</span>
			</div>
		</div>
	);
}
