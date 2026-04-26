import { cacheLife } from "next/cache";
import { AppLink } from "@/components/app-link";
import { commerce } from "@/lib/commerce";

export async function Navbar() {
	"use cache";
	cacheLife("hours");

	const collections = await commerce.collectionBrowse({ limit: 5 });

	return (
		<nav className="hidden sm:flex items-center gap-6">
			<AppLink
				prefetch={"eager"}
				href="/"
				className="text-sm font-medium text-neutral-400 hover:text-white transition-colors"
			>
				Home
			</AppLink>
			<AppLink
				prefetch={"eager"}
				href="/products"
				className="text-sm font-medium text-neutral-400 hover:text-white transition-colors"
			>
				Products
			</AppLink>
			<AppLink
				prefetch={"eager"}
				href="/about"
				className="text-sm font-medium text-neutral-400 hover:text-white transition-colors"
			>
				About
			</AppLink>
			<AppLink
				prefetch={"eager"}
				href="/faq"
				className="text-sm font-medium text-neutral-400 hover:text-white transition-colors"
			>
				FAQ
			</AppLink>
			{collections.data.map((collection: any) => (
				<AppLink
					prefetch={"eager"}
					key={collection.id}
					href={`/collection/${collection.slug}`}
					className="text-sm font-medium text-neutral-400 hover:text-white transition-colors"
				>
					{collection.name}
				</AppLink>
			))}
		</nav>
	);
}
