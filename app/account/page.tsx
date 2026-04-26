import { Package, User } from "lucide-react";
import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { logoutAction } from "@/app/(auth)/actions";
import { AppLink } from "@/components/app-link";
import { Button } from "@/components/ui/button";
import { AppMedia } from "@/lib/app-media";
import { getCurrentUser } from "@/lib/auth";
import { commerce } from "@/lib/commerce";
import { CURRENCY, LOCALE } from "@/lib/constants";
import { formatMoney } from "@/lib/money";

export const metadata: Metadata = {
	title: "My Account — Sumud Scents",
};

export default async function AccountPage() {
	const user = await getCurrentUser();
	if (!user) redirect("/login");

	const { data: recentOrders } = await commerce.orderBrowse({ userId: user.id });

	return (
		<div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
			<div className="flex items-center justify-between mb-10">
				<div>
					<h1 className="text-3xl sm:text-4xl font-medium tracking-tight">My Account</h1>
					<p className="mt-2 text-muted-foreground">Welcome back, {user.name}</p>
				</div>
				<form action={logoutAction}>
					<Button variant="outline" size="sm" type="submit">
						Sign Out
					</Button>
				</form>
			</div>

			<div className="grid gap-8 md:grid-cols-2 mb-12">
				<div className="border border-border rounded-lg p-6">
					<div className="flex items-center gap-3 mb-4">
						<div className="h-10 w-10 rounded-full bg-zinc-100 flex items-center justify-center">
							<User className="h-5 w-5 text-zinc-600" />
						</div>
						<h2 className="text-lg font-medium">Profile</h2>
					</div>
					<div className="space-y-2 text-sm">
						<div className="flex justify-between">
							<span className="text-muted-foreground">Name</span>
							<span className="font-medium">{user.name}</span>
						</div>
						<div className="flex justify-between">
							<span className="text-muted-foreground">Email</span>
							<span className="font-medium">{user.email}</span>
						</div>
					</div>
				</div>

				<div className="border border-border rounded-lg p-6">
					<div className="flex items-center gap-3 mb-4">
						<div className="h-10 w-10 rounded-full bg-zinc-100 flex items-center justify-center">
							<Package className="h-5 w-5 text-zinc-600" />
						</div>
						<h2 className="text-lg font-medium">Orders</h2>
					</div>
					<p className="text-sm text-muted-foreground mb-4">
						You have {recentOrders.length} {recentOrders.length === 1 ? "order" : "orders"}
					</p>
					<Button asChild variant="outline" size="sm">
						<AppLink href="/account/orders">View All Orders</AppLink>
					</Button>
				</div>
			</div>

			{recentOrders.length > 0 && (
				<div>
					<div className="flex items-center justify-between mb-6">
						<h2 className="text-xl font-medium">Recent Orders</h2>
						<AppLink
							href="/account/orders"
							className="text-sm text-muted-foreground hover:text-foreground transition-colors"
						>
							View all
						</AppLink>
					</div>
					<div className="space-y-4">
						{recentOrders.slice(0, 3).map((order) => (
							<OrderCard key={order.id} order={order} />
						))}
					</div>
				</div>
			)}
		</div>
	);
}

function OrderCard({
	order,
}: {
	order: {
		id: string;
		lookup: string;
		status: string;
		createdAt: string;
		orderData: {
			lineItems: {
				quantity: number;
				productVariant: { price: string; images: string[]; product: { name: string; images: string[] } };
			}[];
			shipping: { price: string };
		};
	};
}) {
	const total =
		order.orderData.lineItems.reduce(
			(sum, item) => sum + BigInt(item.productVariant.price) * BigInt(item.quantity),
			BigInt(0),
		) + BigInt(order.orderData.shipping.price);

	const itemCount = order.orderData.lineItems.reduce((sum, item) => sum + item.quantity, 0);
	const firstImage =
		order.orderData.lineItems[0]?.productVariant.images[0] ??
		order.orderData.lineItems[0]?.productVariant.product.images[0];

	const statusColors: Record<string, string> = {
		confirmed: "bg-blue-100 text-blue-700",
		processing: "bg-yellow-100 text-yellow-700",
		shipped: "bg-purple-100 text-purple-700",
		delivered: "bg-green-100 text-green-700",
	};

	return (
		<div className="border border-border rounded-lg p-4 flex items-center gap-4">
			<div className="relative h-16 w-16 rounded-lg overflow-hidden bg-zinc-100 shrink-0">
				{firstImage && <AppMedia src={firstImage} alt="Order" fill sizes="64px" className="object-cover" />}
			</div>
			<div className="flex-1 min-w-0">
				<div className="flex items-center gap-2 mb-1">
					<span className="text-sm font-medium">#{order.lookup}</span>
					<span
						className={`text-xs px-2 py-0.5 rounded-full font-medium capitalize ${statusColors[order.status] ?? "bg-zinc-100 text-zinc-700"}`}
					>
						{order.status}
					</span>
				</div>
				<p className="text-xs text-muted-foreground">
					{new Date(order.createdAt).toLocaleDateString(undefined, {
						year: "numeric",
						month: "short",
						day: "numeric",
					})}{" "}
					· {itemCount} {itemCount === 1 ? "item" : "items"}
				</p>
			</div>
			<div className="text-sm font-medium shrink-0">
				{formatMoney({ amount: total, currency: CURRENCY, locale: LOCALE })}
			</div>
		</div>
	);
}
