"use client";

import { X } from "lucide-react";
import { useState } from "react";

export function AnnouncementBar() {
	const [dismissed, setDismissed] = useState(false);

	if (dismissed) return null;

	return (
		<div className="relative bg-black border-b border-[#d2ab5a]/20 text-[#d2ab5a] text-xs sm:text-sm text-center py-2 px-10">
			<span className="font-medium tracking-wide">
				Free UK shipping on orders over £100 — Use code <span className="font-bold">SUMUD10</span> for 10% off
			</span>
			<button
				type="button"
				onClick={() => setDismissed(true)}
				className="absolute right-3 top-1/2 -translate-y-1/2 text-[#d2ab5a]/60 hover:text-[#d2ab5a] transition-colors"
				aria-label="Dismiss announcement"
			>
				<X className="h-4 w-4" />
			</button>
		</div>
	);
}
