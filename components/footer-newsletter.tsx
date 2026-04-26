"use client";

import { ArrowRight } from "lucide-react";
import { useActionState } from "react";
import { toast } from "sonner";
import { subscribeToNewsletter } from "@/app/newsletter/action";

export function FooterNewsletter() {
	const [state, action, isPending] = useActionState(
		async (...args: Parameters<typeof subscribeToNewsletter>) => {
			const result = await subscribeToNewsletter(...args);
			if (result?.success) {
				toast.success(result.message);
			} else if (result?.error) {
				toast.error(result.error);
			}
			return result;
		},
		null,
	);

	if (state?.success) {
		return <p className="text-sm text-neutral-400">Thanks for subscribing!</p>;
	}

	return (
		<form action={action} className="flex gap-2">
			<input
				type="email"
				name="email"
				placeholder="your@email.com"
				required
				className="h-9 flex-1 rounded-sm border border-neutral-700 bg-neutral-800/50 px-3 text-sm text-white placeholder:text-neutral-500 outline-none transition-colors focus:border-[#d2ab5a]"
			/>
			<button
				type="submit"
				disabled={isPending}
				className="flex h-9 shrink-0 items-center gap-1.5 rounded-sm bg-neutral-800 px-4 text-xs font-medium tracking-wider text-neutral-300 transition-colors hover:bg-neutral-700 disabled:opacity-50"
			>
				{isPending ? (
					"..."
				) : (
					<>
						<ArrowRight className="h-3.5 w-3.5" />
						Subscribe
					</>
				)}
			</button>
		</form>
	);
}
