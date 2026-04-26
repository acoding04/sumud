import { Clock, Package, RefreshCw, Shield } from "lucide-react";
import type { Metadata } from "next";
import { AppLink } from "@/components/app-link";

export const metadata: Metadata = {
	title: "Shipping & Returns — Sumud Scents",
	description: "Learn about our shipping options, delivery times, and hassle-free return policy.",
};

const shippingOptions = [
	{
		name: "Standard Shipping",
		time: "3–5 business days",
		price: "Free on orders over £50",
	},
	{
		name: "Express Shipping",
		time: "1–2 business days",
		price: "£5.99",
	},
	{
		name: "International Shipping",
		time: "7–14 business days",
		price: "Calculated at checkout",
	},
];

const highlights = [
	{
		icon: Package,
		title: "Secure Packaging",
		description: "Every order is carefully wrapped to protect your fragrance during transit.",
	},
	{
		icon: Clock,
		title: "Fast Processing",
		description: "Orders placed before 2 PM are processed and dispatched the same business day.",
	},
	{
		icon: RefreshCw,
		title: "14-Day Returns",
		description: "Not satisfied? Return any unopened product within 14 days for a full refund.",
	},
	{
		icon: Shield,
		title: "Satisfaction Guaranteed",
		description: "We stand behind every product. Reach out if anything isn't right.",
	},
];

export default function ShippingPage() {
	return (
		<div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
			{/* Breadcrumb */}
			<div className="mb-10">
				<AppLink
					prefetch="eager"
					href="/"
					className="text-sm text-muted-foreground hover:text-foreground transition-colors"
				>
					Home
				</AppLink>
				<span className="mx-2 text-muted-foreground">/</span>
				<span className="text-sm">Shipping & Returns</span>
				<h1 className="mt-4 text-4xl font-medium tracking-tight">Shipping & Returns</h1>
				<p className="mt-3 text-lg text-muted-foreground">
					Everything you need to know about getting your order to you — and what to do if it's not quite
					right.
				</p>
			</div>

			{/* Highlights */}
			<div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-16">
				{highlights.map((item) => (
					<div key={item.title} className="flex items-start gap-4 rounded-lg border border-border p-6">
						<div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-secondary">
							<item.icon className="h-4 w-4 text-muted-foreground" />
						</div>
						<div>
							<h3 className="text-sm font-medium">{item.title}</h3>
							<p className="mt-1 text-sm text-muted-foreground">{item.description}</p>
						</div>
					</div>
				))}
			</div>

			{/* Shipping Options Table */}
			<section className="mb-16">
				<h2 className="text-2xl font-medium tracking-tight mb-6">Shipping Options</h2>
				<div className="overflow-hidden rounded-lg border border-border">
					<table className="w-full text-sm">
						<thead>
							<tr className="border-b border-border bg-secondary/50">
								<th className="px-6 py-3 text-left font-medium">Method</th>
								<th className="px-6 py-3 text-left font-medium">Estimated Delivery</th>
								<th className="px-6 py-3 text-left font-medium">Cost</th>
							</tr>
						</thead>
						<tbody>
							{shippingOptions.map((option) => (
								<tr key={option.name} className="border-b border-border last:border-b-0">
									<td className="px-6 py-4 font-medium">{option.name}</td>
									<td className="px-6 py-4 text-muted-foreground">{option.time}</td>
									<td className="px-6 py-4 text-muted-foreground">{option.price}</td>
								</tr>
							))}
						</tbody>
					</table>
				</div>
			</section>

			{/* Returns Policy */}
			<section className="mb-16">
				<h2 className="text-2xl font-medium tracking-tight mb-6">Returns Policy</h2>
				<div className="space-y-4 text-muted-foreground leading-relaxed">
					<p>
						We want you to love your purchase. If for any reason you're not completely satisfied, we accept
						returns within <strong className="text-foreground">30 days</strong> of delivery.
					</p>
					<p>To be eligible for a return, items must be:</p>
					<ul className="list-disc pl-6 space-y-2">
						<li>Unopened and in their original packaging</li>
						<li>Free from damage or signs of use</li>
						<li>Accompanied by proof of purchase</li>
					</ul>
					<p>
						To start a return, contact us at{" "}
						<a
							href="mailto:hello@sumudscents.com"
							className="text-foreground underline underline-offset-4 hover:text-foreground/80 transition-colors"
						>
							hello@sumudscents.com
						</a>{" "}
						with your order number and reason for return.
					</p>
				</div>
			</section>

			{/* Refunds */}
			<section className="mb-16">
				<h2 className="text-2xl font-medium tracking-tight mb-6">Refunds</h2>
				<div className="space-y-4 text-muted-foreground leading-relaxed">
					<p>
						Once we receive and inspect your return, we'll process your refund within 5–7 business days.
						Refunds are issued to the original payment method.
					</p>
					<p>Shipping costs are non-refundable unless the return is due to an error on our part.</p>
				</div>
			</section>

			{/* CTA */}
			<div className="rounded-lg border border-border bg-secondary/30 p-8 text-center">
				<h2 className="text-xl font-medium tracking-tight">Still have questions?</h2>
				<p className="mt-2 text-muted-foreground">
					Our team is happy to help with any shipping or returns questions.
				</p>
				<div className="mt-6 flex flex-wrap items-center justify-center gap-4">
					<AppLink
						prefetch="eager"
						href="/contact"
						className="rounded-md bg-foreground px-6 py-2.5 text-sm font-medium text-background transition-colors hover:bg-foreground/90"
					>
						Contact Us
					</AppLink>
					<AppLink
						prefetch="eager"
						href="/faq"
						className="rounded-md border border-border px-6 py-2.5 text-sm font-medium transition-colors hover:bg-secondary"
					>
						View FAQ
					</AppLink>
				</div>
			</div>
		</div>
	);
}
