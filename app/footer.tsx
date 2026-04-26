import { cacheLife } from "next/cache";
import Image from "next/image";
import { AppLink } from "@/components/app-link";
import { FooterNewsletter } from "@/components/footer-newsletter";
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
			<h3 className="text-xs font-semibold uppercase tracking-[0.2em] text-[#d2ab5a] mb-5">Collections</h3>
			<ul className="space-y-3">
				{collections.data.map((collection: any) => (
					<li key={collection.id}>
						<AppLink
							prefetch={"eager"}
							href={`/collection/${collection.slug}`}
							className="text-sm font-light text-neutral-400 hover:text-[#d2ab5a] transition-colors"
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
			<h3 className="text-xs font-semibold uppercase tracking-[0.2em] text-[#d2ab5a] mb-5">Legal</h3>
			<ul className="space-y-3">
				{pages.data.map((page: any) => (
					<li key={page.id}>
						<AppLink
							prefetch={"eager"}
							href={`/legal${page.path}`}
							className="text-sm font-light text-neutral-400 hover:text-[#d2ab5a] transition-colors"
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
		<footer className="bg-black text-white">
			{/* Newsletter band */}
			<div className="border-t border-neutral-800 bg-[#0a0a0a]">
				<div className="max-w-7xl mx-auto px-6 lg:px-8 py-14">
					<div className="max-w-xl mx-auto text-center">
						<h3 className="text-xs font-semibold uppercase tracking-[0.3em] text-[#d2ab5a] mb-3">
							Stay in the Loop
						</h3>
						<p className="text-sm text-neutral-500 mb-6">
							New drops, exclusive offers, and early access — straight to your inbox.
						</p>
						<FooterNewsletter />
					</div>
				</div>
			</div>

			{/* Main footer */}
			<div className="border-t border-neutral-800">
				<div className="max-w-7xl mx-auto px-6 lg:px-8 py-16">
					<div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8">
						{/* Brand */}
						<div className="lg:col-span-4">
							<AppLink prefetch={"eager"} href="/" className="inline-block">
								<Image
									src="/images/sumud_dark.png"
									alt="Sumud Scents"
									width={320}
									height={80}
									className="h-20 w-auto"
								/>
							</AppLink>
							<p className="mt-6 text-sm font-light text-neutral-500 leading-relaxed max-w-xs">
								Resilience in every spray. Premium inspired-by fragrances that last from morning to night.
							</p>
						</div>

						{/* Links */}
						<div className="lg:col-span-8">
							<div className="grid grid-cols-2 sm:grid-cols-4 gap-8">
								<FooterCollections />

								<div>
									<h3 className="text-xs font-semibold uppercase tracking-[0.2em] text-[#d2ab5a] mb-5">
										Support
									</h3>
									<ul className="space-y-3">
										<li>
											<AppLink
												prefetch={"eager"}
												href="/faq"
												className="text-sm font-light text-neutral-400 hover:text-[#d2ab5a] transition-colors"
											>
												FAQ
											</AppLink>
										</li>
										<li>
											<AppLink
												prefetch={"eager"}
												href="/contact"
												className="text-sm font-light text-neutral-400 hover:text-[#d2ab5a] transition-colors"
											>
												Contact
											</AppLink>
										</li>
										<li>
											<AppLink
												prefetch={"eager"}
												href="/shipping"
												className="text-sm font-light text-neutral-400 hover:text-[#d2ab5a] transition-colors"
											>
												Shipping & Returns
											</AppLink>
										</li>
									</ul>
								</div>

								<div>
									<h3 className="text-xs font-semibold uppercase tracking-[0.2em] text-[#d2ab5a] mb-5">
										Company
									</h3>
									<ul className="space-y-3">
										<li>
											<AppLink
												prefetch={"eager"}
												href="/about"
												className="text-sm font-light text-neutral-400 hover:text-[#d2ab5a] transition-colors"
											>
												About Us
											</AppLink>
										</li>
										<li>
											<AppLink
												prefetch={"eager"}
												href="/products"
												className="text-sm font-light text-neutral-400 hover:text-[#d2ab5a] transition-colors"
											>
												All Products
											</AppLink>
										</li>
									</ul>
								</div>

								<FooterLegalPages />
							</div>
						</div>
					</div>
				</div>
			</div>

			{/* Copyright */}
			<div className="border-t border-neutral-800/60">
				<div className="max-w-7xl mx-auto px-6 lg:px-8 py-6 flex flex-col sm:flex-row justify-between items-center gap-3">
					<p className="text-[10px] uppercase tracking-[0.2em] text-neutral-400 font-light">
						&copy; {new Date().getFullYear()} Sumud Scents. All rights reserved.
					</p>
					<p className="text-[10px] uppercase tracking-[0.2em] text-neutral-400 font-light">
						Inspired-by fragrances — not affiliated with original brands
					</p>
				</div>
			</div>
		</footer>
	);
}
