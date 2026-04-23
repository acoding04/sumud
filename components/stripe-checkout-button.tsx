"use client";

import { Loader2, ShoppingBag } from "lucide-react";
import { useState } from "react";
import { try_ as safe } from "safe-try";

interface CheckoutButtonProps {
	priceId: string;
	className?: string;
}

export function StripeCheckoutButton({ priceId, className }: CheckoutButtonProps) {
	const [loading, setLoading] = useState(false);

	async function handleCheckout() {
		setLoading(true);

		// POST request to the existing /api/checkout route
		const [error, response] = await safe(
			fetch("/api/checkout", {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify({ priceId }),
			}),
		);

		if (error || !response?.ok) {
			console.error("Failed to initiate checkout", error);
			setLoading(false);
			return;
		}

		const { url } = await response.json();
		if (url) {
			window.location.href = url;
		} else {
			setLoading(false);
		}
	}

	return (
		<button
			onClick={handleCheckout}
			disabled={loading}
			className={`group relative flex items-center justify-center gap-2 overflow-hidden rounded-none border border-neutral-700 bg-black px-6 py-3 text-sm font-medium tracking-widest text-neutral-300 transition-all hover:border-neutral-500 hover:text-white disabled:opacity-50 ${className || ""}`}
		>
			{loading ? (
				<Loader2 className="h-4 w-4 animate-spin text-neutral-400" />
			) : (
				<>
					CHECKOUT
					<ShoppingBag className="h-4 w-4 opacity-50 transition-opacity group-hover:opacity-100" />
				</>
			)}
		</button>
	);
}
