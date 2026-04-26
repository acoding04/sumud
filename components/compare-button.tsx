"use client";

import { ArrowLeftRight } from "lucide-react";
import { useTransition } from "react";
import { toast } from "sonner";
import { addToComparison, removeFromComparison } from "@/app/comparison/actions";
import { useComparison } from "@/app/comparison/comparison-context";

export function CompareButton({
	slug,
	productName,
	className,
}: {
	slug: string;
	productName: string;
	className?: string;
}) {
	const { isComparing, isFull, dispatch } = useComparison();
	const [, startTransition] = useTransition();
	const active = isComparing(slug);

	const handleClick = (e: React.MouseEvent) => {
		e.preventDefault();
		e.stopPropagation();

		if (!active && isFull) {
			toast.error("You can compare up to 3 products");
			return;
		}

		startTransition(async () => {
			if (active) {
				dispatch({ type: "REMOVE", slug });
				await removeFromComparison(slug);
				toast.success(`${productName} removed from comparison`);
			} else {
				dispatch({ type: "ADD", slug });
				await addToComparison(slug);
				toast.success(`${productName} added to comparison`);
			}
		});
	};

	return (
		<button
			type="button"
			onClick={handleClick}
			className={`rounded-full flex items-center justify-center transition-all ${
				active
					? "bg-[#d2ab5a] text-white shadow-md"
					: "bg-white/90 backdrop-blur-sm shadow-md text-zinc-600 hover:text-zinc-900 hover:bg-white"
			} ${className}`}
			aria-label={active ? `Remove ${productName} from comparison` : `Compare ${productName}`}
		>
			<ArrowLeftRight className="h-4 w-4" />
		</button>
	);
}
