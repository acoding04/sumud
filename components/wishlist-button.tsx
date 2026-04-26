"use client";

import { Heart } from "lucide-react";
import { useTransition } from "react";
import { toast } from "sonner";
import { toggleWishlistItem } from "@/app/wishlist/actions";
import { useWishlist } from "@/app/wishlist/wishlist-context";

export function WishlistButton({
	variantId,
	productName,
	className = "",
}: {
	variantId: string;
	productName: string;
	className?: string;
}) {
	const { isWishlisted, dispatch } = useWishlist();
	const [isPending, startTransition] = useTransition();
	const wishlisted = isWishlisted(variantId);

	const handleClick = (e: React.MouseEvent) => {
		e.preventDefault();
		e.stopPropagation();

		startTransition(async () => {
			dispatch({ type: "TOGGLE", variantId });
			await toggleWishlistItem(variantId);
			toast.success(wishlisted ? `${productName} removed from wishlist` : `${productName} added to wishlist`);
		});
	};

	return (
		<button
			type="button"
			onClick={handleClick}
			disabled={isPending}
			className={`flex items-center justify-center rounded-full bg-background/80 backdrop-blur-sm transition-all hover:bg-background hover:scale-110 active:scale-95 disabled:opacity-50 ${className}`}
			aria-label={wishlisted ? `Remove ${productName} from wishlist` : `Add ${productName} to wishlist`}
		>
			<Heart
				className={`h-4 w-4 transition-colors ${wishlisted ? "fill-red-500 text-red-500" : "text-foreground"}`}
			/>
		</button>
	);
}
