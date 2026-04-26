export type PromoCode = {
	code: string;
	type: "percentage" | "fixed";
	value: number;
	label: string;
};

const PROMO_CODES: PromoCode[] = [
	{ code: "SUMUD10", type: "percentage", value: 10, label: "10% off" },
	{ code: "WELCOME5", type: "percentage", value: 5, label: "5% off" },
	{ code: "FIVER", type: "fixed", value: 500, label: "£5 off" },
];

export function validatePromoCode(code: string) {
	return PROMO_CODES.find((p) => p.code === code.toUpperCase().trim()) ?? null;
}

export function calculateDiscount(subtotal: bigint, promo: PromoCode) {
	if (promo.type === "percentage") {
		return (subtotal * BigInt(promo.value)) / 100n;
	}
	const fixed = BigInt(promo.value);
	return fixed > subtotal ? subtotal : fixed;
}
