import { cacheLife } from "next/cache";
import { AppLink } from "@/components/app-link";
import { commerce } from "@/lib/commerce";

async function FooterCollections() {
	"use cache";
	cacheLife("hours");

	const collections = await commerce.collectionBrowse({ limit: 5 });

	if (collections.data.length === 0) {
		return null;
	}

	return (
		<div>
			<h3 className="text-xs font-semibold uppercase tracking-[0.2em] text-[#d2ab5a] mb-6">Collections</h3>
			<ul className="space-y-4">
				{collections.data.map((collection: any) => (
					<li key={collection.id}>
						<AppLink
							prefetch={"eager"}
							href={`/collection/${collection.slug}`}
							className="text-sm font-light text-neutral-400 hover:text-white transition-colors"
						>
							{collection.name}
						</AppLink>
					</li>
				))}
			</ul>
		</div>
	);
}

async function FooterLegalPages() {
	"use cache";
	cacheLife("hours");

	const pages = await commerce.legalPageBrowse();

	if (pages.data.length === 0) {
		return null;
	}

	return (
		<div>
			<h3 className="text-xs font-semibold uppercase tracking-[0.2em] text-[#d2ab5a] mb-6">Legal</h3>
			<ul className="space-y-4">
				{pages.data.map((page: any) => (
					<li key={page.id}>
						<AppLink
							prefetch={"eager"}
							href={`/legal${page.path}`}
							className="text-sm font-light text-neutral-400 hover:text-white transition-colors"
						>
							{page.title}
						</AppLink>
					</li>
				))}
			</ul>
		</div>
	);
}

export function Footer() {
	return (
		<footer className="border-t border-neutral-900 bg-[#0a0a0a] pt-24 pb-12 text-white">
			<div className="max-w-7xl mx-auto px-6 lg:px-8">
				<div className="flex flex-col lg:flex-row justify-between items-start gap-16 mb-24">
					{/* Brand Logo & Description */}
					<div className="flex flex-col justify-start max-w-sm">
						<AppLink prefetch={"eager"} href="/" className="text-4xl sm:text-5xl font-serif tracking-[0.3em] text-[#d2ab5a] font-light">
							SUMUD
						</AppLink>
						<p className="mt-8 text-sm font-light text-neutral-400 leading-relaxed">
							Steadfast Elegance, Bottled.<br />
							Experience true luxury rooted in resilience.
						</p>
					</div>

					{/* Navigation Links */}
					<div className="flex flex-wrap lg:flex-nowrap gap-16 lg:gap-24">
						{/* Collections */}
						<FooterCollections />

						{/* Support */}
						<div>
							<h3 className="text-xs font-semibold uppercase tracking-[0.2em] text-[#d2ab5a] mb-6">Support</h3>
							<ul className="space-y-4">
								<li>
									<AppLink
										prefetch={"eager"}
										href="/faq"
										className="text-sm font-light text-neutral-400 hover:text-white transition-colors"
									>
										FAQ
									</AppLink>
								</li>
							</ul>
						</div>

						{/* Legal */}
						<FooterLegalPages />
					</div>
				</div>

				{/* Bottom bar / Copyright */}
				<div className="pt-8 border-t border-neutral-900/80 flex flex-col md:flex-row justify-between items-center gap-4">
					<p className="text-[10px] uppercase tracking-[0.2em] text-neutral-500 font-light">
						&copy; {new Date().getFullYear()} SUMUD SCENTS. ALL RIGHTS RESERVED.
					</p>
				</div>
			</div>
		</footer>
	);
}
