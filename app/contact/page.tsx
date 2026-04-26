import { Clock, Mail, MapPin } from "lucide-react";
import type { Metadata } from "next";
import { AppLink } from "@/components/app-link";
import { ContactForm } from "./contact-form";

export const metadata: Metadata = {
	title: "Contact — Sumud Scents",
	description: "Get in touch with Sumud Scents. We'd love to hear from you.",
};

const contactDetails = [
	{
		icon: Mail,
		label: "Email",
		value: "hello@sumudscents.com",
		href: "mailto:hello@sumudscents.com",
	},
	{
		icon: MapPin,
		label: "Location",
		value: "United Kingdom",
	},
	{
		icon: Clock,
		label: "Response Time",
		value: "Within 24 hours",
	},
];

export default function ContactPage() {
	return (
		<div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
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
				<span className="text-sm">Contact</span>
				<h1 className="mt-4 text-4xl font-medium tracking-tight">Get in Touch</h1>
				<p className="mt-3 text-lg text-muted-foreground">
					Have a question, suggestion, or just want to say hello? We'd love to hear from you.
				</p>
			</div>

			<div className="grid grid-cols-1 lg:grid-cols-5 gap-12 lg:gap-16">
				{/* Contact Form */}
				<div className="lg:col-span-3">
					<ContactForm />
				</div>

				{/* Contact Details */}
				<div className="lg:col-span-2">
					<div className="rounded-lg border border-border bg-secondary/30 p-8 space-y-8">
						<h2 className="text-lg font-medium tracking-tight">Contact Details</h2>
						{contactDetails.map((detail) => (
							<div key={detail.label} className="flex items-start gap-4">
								<div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-secondary">
									<detail.icon className="h-4 w-4 text-muted-foreground" />
								</div>
								<div>
									<p className="text-sm font-medium">{detail.label}</p>
									{detail.href ? (
										<a
											href={detail.href}
											className="text-sm text-muted-foreground hover:text-foreground transition-colors"
										>
											{detail.value}
										</a>
									) : (
										<p className="text-sm text-muted-foreground">{detail.value}</p>
									)}
								</div>
							</div>
						))}
					</div>

					<div className="mt-8 rounded-lg border border-border bg-secondary/30 p-8">
						<h2 className="text-lg font-medium tracking-tight mb-2">Frequently Asked Questions</h2>
						<p className="text-sm text-muted-foreground mb-4">
							Many common questions are already answered in our FAQ.
						</p>
						<AppLink
							prefetch="eager"
							href="/faq"
							className="text-sm font-medium hover:underline transition-colors"
						>
							Visit our FAQ page
						</AppLink>
					</div>
				</div>
			</div>
		</div>
	);
}
