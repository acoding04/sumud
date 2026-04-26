"use client";

import { ChevronUp } from "lucide-react";
import { useCallback, useEffect, useState } from "react";

export function BackToTop() {
	const [visible, setVisible] = useState(false);

	useEffect(() => {
		const handleScroll = () => setVisible(window.scrollY > 400);
		window.addEventListener("scroll", handleScroll, { passive: true });
		return () => window.removeEventListener("scroll", handleScroll);
	}, []);

	const scrollToTop = useCallback(() => {
		window.scrollTo({ top: 0, behavior: "smooth" });
	}, []);

	return (
		<button
			type="button"
			onClick={scrollToTop}
			aria-label="Back to top"
			className={`fixed bottom-6 right-6 z-40 h-11 w-11 rounded-full bg-[#1a1a1a] text-[#d2ab5a] shadow-lg border border-[#d2ab5a]/20 flex items-center justify-center transition-all duration-300 hover:bg-[#d2ab5a] hover:text-[#1a1a1a] ${
				visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4 pointer-events-none"
			}`}
		>
			<ChevronUp className="h-5 w-5" />
		</button>
	);
}
