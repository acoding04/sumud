export type PromoCode = {
	code: string;
	type: "percentage" | "fixed" | "free_shipping";
	value: number;
	label: string;
	freeShipping?: boolean;
};

const PROMO_CODES: PromoCode[] = [
	{ code: "SUMUD10", type: "percentage", value: 10, label: "10% off" },
	{ code: "WELCOME5", type: "percentage", value: 5, label: "5% off" },
	{ code: "FIVER", type: "fixed", value: 500, label: "£5 off" },
	{ code: "FREESHIP", type: "free_shipping", value: 0, label: "Free shipping" },
	{ code: "HALAQAH", type: "percentage", value: 25, label: "25% off + free shipping", freeShipping: true },
];

export function validatePromoCode(code: string) {
	return PROMO_CODES.find((p) => p.code === code.toUpperCase().trim()) ?? null;
}

export function calculateDiscount(subtotal: bigint, promo: PromoCode) {
	if (promo.type === "percentage") {
		return (subtotal * BigInt(promo.value)) / 100n;
	}
	if (promo.type === "free_shipping") {
		return 0n;
	}
	const fixed = BigInt(promo.value);
	return fixed > subtotal ? subtotal : fixed;
}
