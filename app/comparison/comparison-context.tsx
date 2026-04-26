"use client";

import { createContext, type ReactNode, useCallback, useContext, useMemo, useOptimistic } from "react";
import { COMPARISON_MAX_ITEMS } from "@/lib/comparison-constants";

type ComparisonAction = { type: "ADD"; slug: string } | { type: "REMOVE"; slug: string } | { type: "CLEAR" };

type ComparisonContextValue = {
	items: string[];
	isComparing: (slug: string) => boolean;
	isFull: boolean;
	dispatch: (action: ComparisonAction) => void;
};

const ComparisonContext = createContext<ComparisonContextValue | null>(null);

export function ComparisonProvider({
	children,
	initialComparison,
}: {
	children: ReactNode;
	initialComparison: string[];
}) {
	const [optimisticItems, dispatchAction] = useOptimistic(
		initialComparison,
		(state, action: ComparisonAction) => {
			if (action.type === "ADD") {
				if (state.includes(action.slug) || state.length >= COMPARISON_MAX_ITEMS) return state;
				return [...state, action.slug];
			}
			if (action.type === "REMOVE") {
				return state.filter((s) => s !== action.slug);
			}
			if (action.type === "CLEAR") {
				return [];
			}
			return state;
		},
	);

	const isComparing = useCallback((slug: string) => optimisticItems.includes(slug), [optimisticItems]);

	const value = useMemo(
		() => ({
			items: optimisticItems,
			isComparing,
			isFull: optimisticItems.length >= COMPARISON_MAX_ITEMS,
			dispatch: dispatchAction,
		}),
		[optimisticItems, isComparing, dispatchAction],
	);

	return <ComparisonContext.Provider value={value}>{children}</ComparisonContext.Provider>;
}

export function useComparison() {
	const context = useContext(ComparisonContext);
	if (!context) {
		throw new Error("useComparison must be used within a ComparisonProvider");
	}
	return context;
}
