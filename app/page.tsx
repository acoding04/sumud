import { ArrowRight } from "lucide-react";
import { StripeCheckoutButton } from "@/components/stripe-checkout-button";
import Image from "next/image";

const FEATURED_SCENTS = [
	{
		id: "481",
		name: "Kalimat 481",
		size: "50ml",
		price: "£35.00",
		description: "A deep, grounding signature fragrance.",
		image: "/images/Kalimat481.png",
	},
	{
		id: "482",
		name: "Oud 482",
		size: "50ml",
		price: "£35.00",
		description: "Rich oud layered with timeless warmth.",
		image: "/images/Oud482.png",
	},
	{
		id: "483",
		name: "Baccarat 483",
		size: "50ml",
		price: "£35.00",
		description: "Quiet elegance captured in heavy musk.",
		image: "/images/baccarat483.png",
	},
];

export default function Home() {
	return (
		<main className="min-h-screen selection:bg-neutral-800 selection:text-white">
			{/* HERO SECTION (DARK MODE) */}
			<section className="relative flex min-h-[90vh] flex-col items-center justify-center overflow-hidden border-b border-neutral-800/50 px-4 pt-16 sm:px-6 lg:px-8 bg-[#111111] text-neutral-200">
				<div className="absolute inset-0 z-0 pointer-events-none">
					<div className="absolute left-1/2 top-1/2 h-[800px] w-[800px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-neutral-800 via-[#111111] to-[#111111] opacity-40 transform-gpu" />
				</div>

				<div className="relative z-10 flex max-w-4xl flex-col items-center text-center">
					<div className="mb-6 inline-flex animate-fade-in items-center rounded-full border border-neutral-700 bg-neutral-900/50 px-3 py-1 text-xs tracking-widest text-[#d2ab5a] backdrop-blur-sm">
						NEW COLLECTION
					</div>

					<h1 className="font-serif mb-8 flex flex-col items-center justify-center font-light tracking-tight drop-shadow-2xl text-[#d2ab5a]">
						<span className="text-6xl sm:text-7xl md:text-9xl">SUMUD</span>
						<span className="text-3xl sm:text-4xl md:text-6xl tracking-[0.3em] mt-2 sm:mt-4 text-white">
							SCENTS
						</span>
					</h1>

					<p className="mb-12 max-w-xl text-lg font-light tracking-wide text-neutral-300 sm:text-2xl font-sans">
						Steadfast Elegance, Bottled. <br className="hidden sm:block" /> Experience true luxury rooted in
						resilience.
					</p>

					<a
						href="/products"
						className="group flex items-center gap-3 rounded-sm border border-neutral-700 bg-[#1a1a1a] px-8 py-4 text-sm font-medium tracking-[0.2em] text-white transition-all hover:border-[#d2ab5a] hover:bg-black shadow-lg"
					>
						EXPLORE THE COLLECTION
						<ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
					</a>
				</div>
			</section>

			{/* FEATURED COLLECTION (LIGHT MODE) */}
			<section id="collection" className="bg-[#FAF9F6] mx-auto w-full px-4 py-32 sm:px-6 lg:px-8">
				<div className="max-w-7xl mx-auto">
					<div className="mb-20 text-center">
						<h2 className="font-serif text-4xl font-light tracking-wide text-neutral-900 sm:text-5xl">
							Signature Scents
						</h2>
						<div className="mx-auto mt-6 h-px w-24 bg-gradient-to-r from-transparent via-neutral-300 to-transparent" />
					</div>

					<div className="grid grid-cols-1 gap-12 sm:grid-cols-2 lg:grid-cols-3">
						{FEATURED_SCENTS.map((scent) => (
							<div
								key={scent.id}
								className="group flex flex-col bg-white rounded-lg overflow-hidden shadow-[0_4px_20px_-4px_rgba(0,0,0,0.05)] hover:shadow-[0_12px_30px_-4px_rgba(0,0,0,0.1)] transition-all duration-500 hover:-translate-y-1"
							>
								{/* Image Container with Zoom */}
								<div className="relative aspect-[4/5] w-full overflow-hidden bg-neutral-100 flex flex-col items-center justify-center">
									<div className="absolute inset-0 bg-neutral-900/5 opacity-0 transition-opacity duration-500 z-10 group-hover:opacity-100" />
									<div className="h-full w-full relative z-0">
										<Image
											src={scent.image}
											alt={scent.name}
											fill
											priority
											sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
											className="object-cover h-full w-full transition-transform duration-700 ease-out group-hover:scale-105"
										/>
									</div>
								</div>

								{/* Text Area */}
								<div className="p-8 flex flex-col flex-1 bg-white">
									<div className="flex items-start justify-between gap-4">
										<div>
											<h3 className="font-serif text-2xl font-medium text-neutral-900">{scent.name}</h3>
											<p className="mt-2 text-sm text-neutral-500 font-sans leading-relaxed">
												{scent.description}
											</p>
										</div>
										<div className="text-right">
											<p className="text-base font-semibold tracking-wider text-neutral-900 font-sans">
												{scent.price}
											</p>
											<p className="mt-1 text-xs text-neutral-400 tracking-widest uppercase font-sans">
												{scent.size}
											</p>
										</div>
									</div>

									<div className="mt-8 mt-auto pt-4 border-t border-neutral-100">
										<div className="*:bg-[#222] *:text-white *:rounded-sm *:transition-all hover:*:bg-[#111] *:shadow-[-0_2px_10px_rgba(0,0,0,0.1)]">
											<StripeCheckoutButton
												priceId={scent.id}
												className="w-full text-sm tracking-widest font-medium uppercase py-3"
											/>
										</div>
									</div>
								</div>
							</div>
						))}
					</div>
				</div>
			</section>
		</main>
	);
}
