"use client";

import { createContext, type ReactNode, useCallback, useContext, useMemo, useOptimistic } from "react";

type WishlistAction = { type: "TOGGLE"; variantId: string };

type WishlistContextValue = {
	items: string[];
	isWishlisted: (variantId: string) => boolean;
	dispatch: (action: WishlistAction) => void;
};

const WishlistContext = createContext<WishlistContextValue | null>(null);

export function WishlistProvider({
	children,
	initialWishlist,
}: {
	children: ReactNode;
	initialWishlist: string[];
}) {
	const [optimisticItems, dispatchAction] = useOptimistic(
		initialWishlist,
		(state, action: WishlistAction) => {
			if (action.type === "TOGGLE") {
				return state.includes(action.variantId)
					? state.filter((id) => id !== action.variantId)
					: [...state, action.variantId];
			}
			return state;
		},
	);

	const isWishlisted = useCallback(
		(variantId: string) => optimisticItems.includes(variantId),
		[optimisticItems],
	);

	const value = useMemo(
		() => ({ items: optimisticItems, isWishlisted, dispatch: dispatchAction }),
		[optimisticItems, isWishlisted, dispatchAction],
	);

	return <WishlistContext.Provider value={value}>{children}</WishlistContext.Provider>;
}

export function useWishlist() {
	const context = useContext(WishlistContext);
	if (!context) {
		throw new Error("useWishlist must be used within a WishlistProvider");
	}
	return context;
}
