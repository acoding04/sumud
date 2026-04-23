import { ArrowRight } from "lucide-react";
import { StripeCheckoutButton } from "@/components/stripe-checkout-button";

const FEATURED_SCENTS = [
	{
		id: "price_1 OudResilience",
		name: "Oud Resilience",
		size: "50ml",
		price: "£45.00",
		description: "A deep, grounding blend of aged oud and smoked cedar.",
	},
	{
		id: "price_2 AmberSteadfast",
		name: "Amber Steadfast",
		size: "50ml",
		price: "£45.00",
		description: "Warm amber layered with rich vanilla and dark tonka beans.",
	},
	{
		id: "price_3 VelvetObsidian",
		name: "Velvet Obsidian",
		size: "50ml",
		price: "£45.00",
		description: "Quiet elegance captured in black rose and heavy musk.",
	},
];

export default function Home() {
	return (
		<main className="min-h-screen bg-black text-neutral-200 selection:bg-neutral-800 selection:text-white">
			{/* HERO SECTION */}
			<section className="relative flex min-h-[90vh] flex-col items-center justify-center overflow-hidden border-b border-neutral-800/50 px-4 pt-16 sm:px-6 lg:px-8">
				<div className="absolute inset-0 z-0 opacity-40">
					<div className="absolute left-1/2 top-1/2 h-[800px] w-[800px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-gradient-to-tr from-neutral-900 via-neutral-950 to-neutral-900 blur-3xl mix-blend-screen" />
				</div>

				<div className="relative z-10 flex max-w-4xl flex-col items-center text-center">
					<div className="mb-6 inline-flex animate-fade-in items-center rounded-full border border-neutral-800 bg-neutral-900/50 px-3 py-1 text-xs tracking-widest text-neutral-400 backdrop-blur-sm">
						NEW COLLECTION
					</div>

					<h1
						className="font-serif mb-8 flex flex-col items-center justify-center font-light tracking-tight drop-shadow-2xl"
						style={{ fontFamily: "Playfair Display, serif", color: "#d2ab5a" }}
					>
						<span className="text-6xl sm:text-7xl md:text-9xl">SUMUD</span>
						<span className="text-3xl sm:text-4xl md:text-6xl tracking-[0.3em] mt-2 sm:mt-4">SCENTS</span>
					</h1>

					<p className="mb-12 max-w-xl text-lg font-light tracking-wide text-neutral-400 sm:text-2xl">
						Steadfast Elegance, Bottled. <br className="hidden sm:block" /> Experience true luxury rooted in
						resilience.
					</p>

					<a
						href="#collection"
						className="group flex items-center gap-3 rounded-sm border border-neutral-700 bg-neutral-950 px-8 py-4 text-sm font-medium tracking-[0.2em] text-neutral-200 transition-all hover:border-neutral-400 hover:bg-neutral-900"
					>
						EXPLORE THE COLLECTION
						<ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
					</a>
				</div>
			</section>

			{/* FEATURED COLLECTION */}
			<section id="collection" className="mx-auto max-w-7xl px-4 py-32 sm:px-6 lg:px-8">
				<div className="mb-20 text-center">
					<h2
						className="font-serif text-3xl font-light tracking-wide text-white sm:text-4xl"
						style={{ fontFamily: "Playfair Display, serif" }}
					>
						Signature Scents
					</h2>
					<div className="mx-auto mt-6 h-px w-24 bg-gradient-to-r from-transparent via-neutral-700 to-transparent" />
				</div>

				<div className="grid grid-cols-1 gap-12 sm:grid-cols-2 lg:grid-cols-3">
					{FEATURED_SCENTS.map((scent, i) => (
						<div key={scent.id} className="group flex flex-col">
							{/* Dark Minimalist Image Placeholder */}
							<div className="relative aspect-square w-full overflow-hidden bg-zinc-950 border border-neutral-900 flex flex-col items-center justify-center transition-colors group-hover:border-neutral-800">
								<div className="absolute inset-0 bg-gradient-to-b from-transparent to-black/60 opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
								<div className="h-2/3 w-2/3 max-w-[200px] border border-neutral-800 bg-neutral-900/20 mix-blend-luminosity shadow-2xl relative">
									<div className="absolute -left-1/3 -top-1/3 h-full w-full bg-gradient-to-br from-white/5 to-transparent blur-xl rotate-12 pointer-events-none" />
								</div>
								<div className="absolute bottom-6 left-1/2 -translate-x-1/2 text-xs uppercase tracking-[0.3em] text-neutral-600 font-medium whitespace-nowrap">
									Placeholder_{i + 1}
								</div>
							</div>

							{/* Text Area */}
							<div className="mt-8 flex flex-col flex-1">
								<div className="flex items-start justify-between gap-4">
									<div>
										<h3
											className="font-serif text-xl font-light text-neutral-100"
											style={{ fontFamily: "Playfair Display, serif" }}
										>
											{scent.name}
										</h3>
										<p className="mt-2 text-sm text-neutral-500 max-w-[240px]">{scent.description}</p>
									</div>
									<div className="text-right">
										<p className="text-sm font-medium tracking-wider text-neutral-300">{scent.price}</p>
										<p className="mt-1 text-xs text-neutral-600 tracking-widest">{scent.size}</p>
									</div>
								</div>

								<div className="mt-8 mt-auto">
									<StripeCheckoutButton priceId={scent.id} className="w-full" />
								</div>
							</div>
						</div>
					))}
				</div>
			</section>

			{/* FOOTER PREVIEW / BRAND REINFORCEMENT */}
			<footer className="border-t border-neutral-900 bg-black py-20 text-center">
				<h2
					className="font-serif text-2xl font-light tracking-[0.2em] text-neutral-600 mb-6"
					style={{ fontFamily: "Playfair Display, serif" }}
				>
					SUMUD
				</h2>
				<p className="text-xs tracking-wider text-neutral-500">
					&copy; 2026 SUMUD SCENTS. ALL RIGHTS RESERVED.
				</p>
			</footer>
		</main>
	);
}
