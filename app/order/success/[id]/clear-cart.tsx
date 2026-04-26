"use client";

import { useEffect, useRef } from "react";
import { clearCart } from "./actions";

export function ClearCartOnMount() {
	const cleared = useRef(false);
	useEffect(() => {
		if (!cleared.current) {
			cleared.current = true;
			clearCart();
		}
	}, []);
	return null;
}
