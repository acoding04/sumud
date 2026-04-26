"use client";

import { ArrowLeftRight, X } from "lucide-react";
import { useTransition } from "react";
import { clearComparison, removeFromComparison } from "@/app/comparison/actions";
import { useComparison } from "@/app/comparison/comparison-context";
import { AppLink } from "@/components/app-link";
import { Button } from "@/components/ui/button";
import { AppMedia } from "@/lib/app-media";

const PRODUCTS_DATA: Record<string, { name: string; image: string }> = {
	"121-ana-abiyedh": { name: "Ana Abiadh", image: "/images/Abiyadh121.png" },
	"122-invictus": { name: "Inviktus", image: "/images/Invictus122.png" },
	"123-fantasy": { name: "Fantasy", image: "/images/Fantasy123.png" },
	"124-paris-hilton": { name: "Paris Hill", image: "/images/Paris124.png" },
	"241-sauvage": { name: "Sauvage", image: "/images/Sauvage241.png" },
	"242-one-million": { name: "One Million", image: "/images/Million242.png" },
	"243-terre-d-hermes": { name: "Terre Dermes", image: "/images/terre243.png" },
	"481-kalimat": { name: "Kalimat", image: "/images/Kalimat481.png" },
	"482-oud-mubakhar": { name: "Oud Mubakhar", image: "/images/Oud482.png" },
	"483-baccarat-rouge": { name: "Baccarat Rouge", image: "/images/baccarat483.png" },
};

export function ComparisonBar() {
	const { items, dispatch } = useComparison();
	const [, startTransition] = useTransition();

	if (items.length === 0) return null;

	const handleRemove = (slug: string) => {
		startTransition(async () => {
			dispatch({ type: "REMOVE", slug });
			await removeFromComparison(slug);
		});
	};

	const handleClear = () => {
		startTransition(async () => {
			dispatch({ type: "CLEAR" });
			await clearComparison();
		});
	};

	return (
		<div className="fixed bottom-0 left-0 right-0 z-50 bg-[#1a1a1a] border-t border-[#d2ab5a]/20 text-white shadow-2xl animate-in slide-in-from-bottom-full duration-300">
			<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 flex items-center gap-4">
				<div className="flex items-center gap-2 text-[#d2ab5a] shrink-0">
					<ArrowLeftRight className="h-4 w-4" />
					<span className="text-sm font-medium hidden sm:inline">Compare</span>
				</div>

				<div className="flex items-center gap-3 flex-1 min-w-0">
					{items.map((slug) => {
						const data = PRODUCTS_DATA[slug];
						return (
							<div key={slug} className="flex items-center gap-2 bg-white/10 rounded-lg px-2 py-1.5">
								<div className="relative h-8 w-8 rounded overflow-hidden bg-zinc-800 shrink-0">
									{data?.image && (
										<AppMedia
											src={data.image}
											alt={data?.name ?? slug}
											fill
											sizes="32px"
											className="object-cover"
										/>
									)}
								</div>
								<span className="text-xs truncate max-w-[80px] sm:max-w-[120px]">{data?.name ?? slug}</span>
								<button
									type="button"
									onClick={() => handleRemove(slug)}
									className="text-white/50 hover:text-white transition-colors shrink-0"
									aria-label={`Remove ${data?.name ?? slug}`}
								>
									<X className="h-3.5 w-3.5" />
								</button>
							</div>
						);
					})}
				</div>

				<div className="flex items-center gap-2 shrink-0">
					<button
						type="button"
						onClick={handleClear}
						className="text-xs text-white/50 hover:text-white transition-colors"
					>
						Clear
					</button>
					<Button
						asChild
						size="sm"
						disabled={items.length < 2}
						className="bg-[#d2ab5a] text-[#111111] hover:bg-[#c49d4a] font-medium"
					>
						<AppLink href="/comparison">Compare ({items.length})</AppLink>
					</Button>
				</div>
			</div>
		</div>
	);
}
