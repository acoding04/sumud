import { Droplets, Heart, Leaf } from "lucide-react";
import type { Metadata } from "next";
import { AppLink } from "@/components/app-link";

export const metadata: Metadata = {
	title: "About — Sumud Scents",
	description:
		"Discover the story behind Sumud Scents — premium inspired-by fragrances at accessible prices.",
};

const values = [
	{
		icon: Leaf,
		title: "Premium Quality",
		description:
			"We carefully select inspired-by fragrances that closely capture the essence of the originals, so you get a luxury experience without the luxury price tag.",
	},
	{
		icon: Droplets,
		title: "Accessible Luxury",
		description:
			"Designer scents shouldn't cost a fortune. Our collection brings you beautifully crafted alternatives at a fraction of the price.",
	},
	{
		icon: Heart,
		title: "Curated with Care",
		description:
			"Every fragrance in our collection is hand-picked and tested to ensure it lives up to the standard our customers expect.",
	},
];

export default function AboutPage() {
	return (
		<main className="bg-[#FAF9F6]">
			{/* Hero */}
			<section className="bg-[#1a1a1a] text-white py-24 sm:py-32">
				<div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
					<p className="text-xs tracking-[0.3em] text-[#d2ab5a] uppercase mb-6">Our Story</p>
					<h1 className="font-serif text-4xl sm:text-5xl lg:text-6xl font-light tracking-tight mb-8">
						Steadfast Elegance, <span className="text-[#d2ab5a]">Bottled</span>
					</h1>
					<p className="text-lg font-light text-neutral-300 leading-relaxed max-w-2xl mx-auto">
						Sumud means resilience — and that's exactly what our fragrances deliver. Long-lasting, bold scents
						inspired by the world's most popular brands, built to stay with you from morning to night.
					</p>
				</div>
			</section>

			{/* Story */}
			<section className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-20 sm:py-28">
				<div className="space-y-8 text-lg text-neutral-600 leading-relaxed font-light">
					<p>
						Sumud Scents was born from a simple idea: you shouldn't have to spend a fortune to smell
						incredible. We offer high-quality fragrances inspired by the world's most loved designer brands —
						at a fraction of the price.
					</p>
					<p>
						The name says it all. Sumud means resilience, and our scents are made to last. We pick fragrances
						that hold their own all day long — strong projection, serious longevity, no fading out after an
						hour.
					</p>
					<p>
						We personally test every scent before it makes it into our collection. If it doesn't last, if it
						doesn't capture the spirit of the original, it doesn't make the cut.
					</p>
				</div>
			</section>

			{/* Values */}
			<section className="border-t border-neutral-200 bg-white py-20 sm:py-28">
				<div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
					<div className="text-center mb-16">
						<h2 className="font-serif text-3xl sm:text-4xl font-light tracking-tight text-neutral-900">
							What We Stand For
						</h2>
						<div className="mx-auto mt-6 h-px w-24 bg-gradient-to-r from-transparent via-neutral-300 to-transparent" />
					</div>
					<div className="grid grid-cols-1 md:grid-cols-3 gap-12">
						{values.map((value) => (
							<div key={value.title} className="text-center">
								<div className="mx-auto mb-6 flex h-14 w-14 items-center justify-center rounded-full bg-neutral-100">
									<value.icon className="h-6 w-6 text-neutral-700" />
								</div>
								<h3 className="text-lg font-medium text-neutral-900 mb-3">{value.title}</h3>
								<p className="text-sm text-neutral-500 leading-relaxed">{value.description}</p>
							</div>
						))}
					</div>
				</div>
			</section>

			{/* CTA */}
			<section className="bg-[#1a1a1a] text-white py-20 sm:py-24">
				<div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
					<h2 className="font-serif text-3xl sm:text-4xl font-light tracking-tight mb-6">
						Find Your Signature
					</h2>
					<p className="text-neutral-400 font-light mb-10">
						Explore our collection and discover a scent that speaks to who you are.
					</p>
					<AppLink
						prefetch="eager"
						href="/products"
						className="inline-flex items-center rounded-sm border border-neutral-700 bg-[#1a1a1a] px-8 py-4 text-sm font-medium tracking-[0.2em] text-white transition-all hover:border-[#d2ab5a] hover:bg-black"
					>
						EXPLORE THE COLLECTION
					</AppLink>
				</div>
			</section>
		</main>
	);
}
