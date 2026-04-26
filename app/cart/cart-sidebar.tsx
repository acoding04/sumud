"use client";

import { ShoppingBag } from "lucide-react";
import { useState } from "react";
import { useCart } from "@/app/cart/cart-context";
import { CartItem } from "@/app/cart/cart-item";
import { PromoCodeSection } from "@/app/cart/promo-code-section";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Sheet, SheetContent, SheetFooter, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { CURRENCY, LOCALE } from "@/lib/constants";
import { formatMoney } from "@/lib/money";
import { calculateDiscount, type PromoCode } from "@/lib/promo-codes";

export function CartSidebar() {
	const { isOpen, closeCart, items, itemCount, subtotal } = useCart();
	const [isCheckingOut, setIsCheckingOut] = useState(false);
	const [appliedPromo, setAppliedPromo] = useState<PromoCode | null>(null);

	const discount = appliedPromo ? calculateDiscount(subtotal, appliedPromo) : 0n;
	const total = subtotal - discount;

	const handleCheckout = async () => {
		try {
			setIsCheckingOut(true);
			const response = await fetch("/api/checkout", {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify({
					items: items.map((item) => ({
						name: item.productVariant.product.name,
						price: item.productVariant.price,
						quantity: item.quantity,
						image: item.productVariant.images?.[0] || item.productVariant.product.images?.[0],
						variantId: item.productVariant.id,
						productSlug: item.productVariant.product.slug,
					})),
				}),
			});

			const { url, error } = await response.json();

			if (error) {
				console.error("Checkout error:", error);
				alert("Something went wrong with checkout.");
				return;
			}

			if (url) {
				window.location.href = url;
			}
		} catch (error) {
			console.error("Checkout request failed:", error);
		} finally {
			setIsCheckingOut(false);
		}
	};

	return (
		<Sheet open={isOpen} onOpenChange={(open) => !open && closeCart()}>
			<SheetContent className="flex flex-col w-full sm:max-w-lg">
				<SheetHeader className="border-b border-border pb-4">
					<SheetTitle className="flex items-center gap-2">
						Your Cart
						{itemCount > 0 && (
							<span className="text-sm font-normal text-muted-foreground">({itemCount} items)</span>
						)}
					</SheetTitle>
				</SheetHeader>

				{items.length === 0 ? (
					<div className="flex-1 flex flex-col items-center justify-center gap-4 py-12">
						<div className="flex h-20 w-20 items-center justify-center rounded-full bg-secondary">
							<ShoppingBag className="h-10 w-10 text-muted-foreground" />
						</div>
						<div className="text-center">
							<p className="text-lg font-medium">Your cart is empty</p>
							<p className="text-sm text-muted-foreground mt-1">Add some products to get started</p>
						</div>
						<Button variant="outline" onClick={closeCart}>
							Continue Shopping
						</Button>
					</div>
				) : (
					<>
						<ScrollArea className="flex-1 px-4">
							<div className="divide-y divide-border">
								{items.map((item) => (
									<CartItem key={item.productVariant.id} item={item} />
								))}
							</div>
						</ScrollArea>

						<SheetFooter className="border-t border-border pt-4 mt-auto">
							<div className="w-full space-y-4">
								<PromoCodeSection onPromoApplied={setAppliedPromo} />
								<div className="flex items-center justify-between text-sm text-muted-foreground">
									<span>Subtotal</span>
									<span>{formatMoney({ amount: subtotal, currency: CURRENCY, locale: LOCALE })}</span>
								</div>
								{discount > 0n && (
									<div className="flex items-center justify-between text-sm text-green-600">
										<span>Discount ({appliedPromo?.label})</span>
										<span>-{formatMoney({ amount: discount, currency: CURRENCY, locale: LOCALE })}</span>
									</div>
								)}
								<div className="flex items-center justify-between text-base">
									<span className="font-medium">Total</span>
									<span className="font-semibold">
										{formatMoney({ amount: total, currency: CURRENCY, locale: LOCALE })}
									</span>
								</div>
								<p className="text-xs text-muted-foreground">Shipping and taxes calculated at checkout</p>
								<Button
									className="w-full h-12 text-base font-medium"
									onClick={handleCheckout}
									disabled={isCheckingOut}
								>
									{isCheckingOut ? "Connecting to Stripe..." : "Checkout"}
								</Button>
								<button
									type="button"
									onClick={closeCart}
									className="w-full text-sm text-muted-foreground hover:text-foreground transition-colors"
								>
									Continue Shopping
								</button>
							</div>
						</SheetFooter>
					</>
				)}
			</SheetContent>
		</Sheet>
	);
}
