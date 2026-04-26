import "@/app/globals.css";

import type { Metadata } from "next";
import { Montserrat, Playfair_Display } from "next/font/google";
import Image from "next/image";
import { Suspense } from "react";
import { CartProvider } from "@/app/cart/cart-context";
import { CartSidebar } from "@/app/cart/cart-sidebar";
import { CartButton } from "@/app/cart-button";
import { ComparisonProvider } from "@/app/comparison/comparison-context";
import { Footer } from "@/app/footer";
import { Navbar } from "@/app/navbar";
import { SearchInput } from "@/app/search-input";
import { WishlistProvider } from "@/app/wishlist/wishlist-context";
import { AnnouncementBar } from "@/components/announcement-bar";
import { AppLink } from "@/components/app-link";
import { BackToTop } from "@/components/back-to-top";
import { ComparisonBar } from "@/components/comparison-bar";
import { ErrorOverlayRemover, NavigationReporter } from "@/components/devtools";
import { Toaster } from "@/components/ui/sonner";
import { UserButton } from "@/components/user-button";
import { getCurrentUser } from "@/lib/auth";
import { commerce, getStoreFaviconUrl, meGetCached } from "@/lib/commerce";
import { getComparisonCookieJson } from "@/lib/comparison-cookies";
import { getCartCookieJson } from "@/lib/cookies";
import { StoreJsonLd } from "@/lib/json-ld";
import { getWishlistCookieJson } from "@/lib/wishlist-cookies";

const montserrat = Montserrat({
	variable: "--font-montserrat",
	subsets: ["latin"],
});

const playfair = Playfair_Display({
	variable: "--font-playfair",
	subsets: ["latin"],
});

export async function generateMetadata(): Promise<Metadata> {
	const me = await meGetCached();
	const storeName = me.store.settings?.storeName || "Sumud Scents";
	const faviconUrl = getStoreFaviconUrl(me.store.settings) ?? "/logo.svg";

	return {
		title: storeName,
		description: me.store.settings?.storeDescription || "Your next e-commerce store",
		icons: {
			icon: [
				{ url: faviconUrl, sizes: "any", type: "image/svg+xml" },
				{ url: faviconUrl, sizes: "192x192", type: "image/png" },
			],
			apple: [{ url: faviconUrl, sizes: "180x180" }],
			shortcut: faviconUrl,
		},
		manifest: "/manifest.webmanifest",
	};
}

async function getInitialCart() {
	const cartCookie = await getCartCookieJson();

	if (!cartCookie?.id) {
		return { cart: null, cartId: null };
	}

	try {
		const cart = await commerce.cartGet({ cartId: cartCookie.id });
		return { cart: cart ?? null, cartId: cartCookie.id };
	} catch {
		return { cart: null, cartId: cartCookie.id };
	}
}

async function CartProviderWrapper({ children }: { children: React.ReactNode }) {
	const [{ cart, cartId }, wishlistCookie, comparisonCookie, user] = await Promise.all([
		getInitialCart(),
		getWishlistCookieJson(),
		getComparisonCookieJson(),
		getCurrentUser(),
	]);

	return (
		<CartProvider initialCart={cart} initialCartId={cartId}>
			<WishlistProvider initialWishlist={wishlistCookie?.variantIds ?? []}>
				<ComparisonProvider initialComparison={comparisonCookie?.slugs ?? []}>
					<div className="flex min-h-screen flex-col">
						<AnnouncementBar />
						<header className="sticky top-0 z-50 border-b border-neutral-800 bg-black text-white transition-all duration-300">
							<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
								<div className="flex items-center justify-between h-20">
									<div className="flex items-center gap-8">
										<AppLink prefetch={"eager"} href="/" className="shrink-0">
											<Image
												src="/images/sumud_dark.png"
												alt="Sumud Scents"
												width={320}
												height={80}
												className="h-20 w-auto"
												priority
											/>
										</AppLink>
										<Navbar />
									</div>
									<div className="flex items-center gap-2 text-white">
										<Suspense>
											<SearchInput />
										</Suspense>
										<UserButton user={user} />
										<CartButton />
									</div>
								</div>
							</div>
						</header>
						<div className="flex-1">{children}</div>
						<Footer />
					</div>
					<CartSidebar />
					<ComparisonBar />
					<Toaster position="bottom-right" />
					<BackToTop />
				</ComparisonProvider>
			</WishlistProvider>
		</CartProvider>
	);
}

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	const env = process.env.VERCEL_ENV || "development";

	return (
		<html lang="en">
			<body
				className={`${montserrat.variable} ${playfair.variable} font-sans antialiased bg-[#FAF9F6] text-neutral-900`}
			>
				<Suspense>
					<StoreJsonLd />
				</Suspense>
				<Suspense>
					<CartProviderWrapper>{children}</CartProviderWrapper>
				</Suspense>
				{env === "development" && (
					<>
						<NavigationReporter />
						<ErrorOverlayRemover />
					</>
				)}
			</body>
		</html>
	);
}
