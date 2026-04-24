import "@/app/globals.css";

import type { Metadata } from "next";
import { Montserrat, Playfair_Display } from "next/font/google";
import { Suspense } from "react";
import { CartProvider } from "@/app/cart/cart-context";
import { CartSidebar } from "@/app/cart/cart-sidebar";
import { CartButton } from "@/app/cart-button";
import { Footer } from "@/app/footer";
import { Navbar } from "@/app/navbar";
import { SearchInput } from "@/app/search-input";
import { AppLink } from "@/components/app-link";
import { ErrorOverlayRemover, NavigationReporter } from "@/components/devtools";
import { commerce, getStoreFaviconUrl, meGetCached } from "@/lib/commerce";
import { getCartCookieJson } from "@/lib/cookies";
import { StoreJsonLd } from "@/lib/json-ld";

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
	const { cart, cartId } = await getInitialCart();

	return (
		<CartProvider initialCart={cart} initialCartId={cartId}>
			<div className="flex min-h-screen flex-col">
				<header className="sticky top-0 z-50 border-b border-neutral-800 bg-[#111111]/90 text-white backdrop-blur-xl transition-all duration-300">
					<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
						<div className="flex items-center justify-between h-16">
							<div className="flex items-center gap-8">
								<AppLink
									prefetch={"eager"}
									href="/"
									className="text-xl font-serif text-[#d2ab5a] tracking-widest"
								>
									SUMUD SCENTS
								</AppLink>
								<Navbar />
							</div>
							<div className="flex items-center gap-2 text-white">
								<Suspense>
									<SearchInput />
								</Suspense>
								<CartButton />
							</div>
						</div>
					</div>
				</header>
				<div className="flex-1">{children}</div>
				<Footer />
			</div>
			<CartSidebar />
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
