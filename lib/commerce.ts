// We are replacing the YNS API with a completely local mock dataset so you don't
// have to pay or rely on Sumud Scents for your backend.

type StoredCartItem = { variantId: string; quantity: number };

type StoredReview = {
	id: string;
	author: string;
	email: string;
	content: string;
	rating: number;
	createdAt: string;
};

type StoredOrder = {
	id: string;
	lookup: string;
	userId: string;
	stripeSessionId: string;
	status: "confirmed" | "processing" | "shipped" | "delivered";
	createdAt: string;
	orderData: {
		customer: { email: string; name: string };
		lineItems: {
			id: string;
			quantity: number;
			productVariant: {
				id: string;
				price: string;
				images: string[];
				product: { id: string; name: string; slug: string; images: string[] };
			};
		}[];
		shippingAddress: {
			name: string;
			line1: string;
			line2?: string;
			city: string;
			state: string;
			postalCode: string;
			country: string;
		};
		shipping: { name: string; price: string };
	};
};

type CommerceStore = {
	carts: Map<string, StoredCartItem[]>;
	cartCounter: number;
	reviews: Map<string, StoredReview[]>;
	reviewCounter: number;
	orders: Map<string, StoredOrder>;
	customerOrders: Map<string, string[]>;
	orderCounter: number;
};

function createCommerceStore(): CommerceStore {
	const s: CommerceStore = {
		carts: new Map(),
		cartCounter: 0,
		reviews: new Map(),
		reviewCounter: 0,
		orders: new Map(),
		customerOrders: new Map(),
		orderCounter: 0,
	};

	// Seed reviews
	s.reviews.set("481-kalimat", [
		{
			id: "r-1",
			author: "Yusuf A.",
			email: "yusuf@example.com",
			content:
				"Incredible longevity and projection. The oud and amber blend is rich without being overpowering. My signature scent now.",
			rating: 5,
			createdAt: "2025-11-15T10:00:00Z",
		},
		{
			id: "r-2",
			author: "Nadia K.",
			email: "nadia@example.com",
			content:
				"Beautiful scent that lasts all day. The vanilla heart note softens the oud perfectly. Received so many compliments.",
			rating: 4,
			createdAt: "2025-12-02T14:30:00Z",
		},
	]);
	s.reviews.set("241-sauvage", [
		{
			id: "r-3",
			author: "James R.",
			email: "james@example.com",
			content:
				"Fresh, versatile, and perfect for the office. The bergamot opening is sharp and clean. Great value for the quality.",
			rating: 5,
			createdAt: "2025-10-20T09:15:00Z",
		},
		{
			id: "r-4",
			author: "Omar H.",
			email: "omar@example.com",
			content: "Solid everyday fragrance. Lasts about 8 hours on my skin. Would repurchase.",
			rating: 4,
			createdAt: "2026-01-08T16:45:00Z",
		},
		{
			id: "r-5",
			author: "Sarah M.",
			email: "sarah@example.com",
			content: "Bought this for my husband and he absolutely loves it. The pepper note gives it character.",
			rating: 5,
			createdAt: "2026-02-14T11:00:00Z",
		},
	]);
	s.reviews.set("483-baccarat-rouge", [
		{
			id: "r-6",
			author: "Layla F.",
			email: "layla@example.com",
			content:
				"The saffron and jasmine opening is divine. This rivals fragrances ten times the price. Absolutely stunning.",
			rating: 5,
			createdAt: "2025-12-25T08:00:00Z",
		},
		{
			id: "r-7",
			author: "Michael T.",
			email: "michael@example.com",
			content: "Very close to the original. The amberwood drydown is warm and inviting. Good projection too.",
			rating: 4,
			createdAt: "2026-01-18T13:20:00Z",
		},
	]);
	s.reviews.set("242-one-million", [
		{
			id: "r-8",
			author: "Ali B.",
			email: "ali@example.com",
			content: "Sweet, spicy, and bold. This turns heads. The cinnamon note is perfectly balanced.",
			rating: 5,
			createdAt: "2026-03-01T19:00:00Z",
		},
	]);
	s.reviews.set("123-fantasy", [
		{
			id: "r-9",
			author: "Emma W.",
			email: "emma@example.com",
			content:
				"Such a fun, playful scent! The white chocolate and kiwi combo is unique. Perfect for casual outings.",
			rating: 4,
			createdAt: "2026-02-20T10:30:00Z",
		},
		{
			id: "r-10",
			author: "Zara P.",
			email: "zara@example.com",
			content: "Sweet but not cloying. I get compliments every time I wear this. Love it!",
			rating: 5,
			createdAt: "2026-03-10T15:00:00Z",
		},
	]);
	s.reviewCounter = 10;

	// Seed orders
	const order1: StoredOrder = {
		id: "ord-1",
		lookup: "SUMUD-1001",
		userId: "u-1",
		stripeSessionId: "",
		status: "delivered",
		createdAt: "2026-03-15T10:30:00Z",
		orderData: {
			customer: { email: "demo@sumud.com", name: "Demo User" },
			lineItems: [
				{
					id: "li-1",
					quantity: 1,
					productVariant: {
						id: "v-481",
						price: "3500",
						images: ["/images/Kalimat481.png"],
						product: {
							id: "p-481",
							name: "481 - Inspired by Arabian Oud Kalimat",
							slug: "481-kalimat",
							images: ["/images/Kalimat481.png"],
						},
					},
				},
				{
					id: "li-2",
					quantity: 2,
					productVariant: {
						id: "v-241",
						price: "3000",
						images: ["/images/Sauvage241.png"],
						product: {
							id: "p-241",
							name: "241 - Inspired by Dior Sauvage",
							slug: "241-sauvage",
							images: ["/images/Sauvage241.png"],
						},
					},
				},
			],
			shippingAddress: {
				name: "Demo User",
				line1: "123 Scent Street",
				city: "London",
				state: "",
				postalCode: "SW1A 1AA",
				country: "GB",
			},
			shipping: { name: "Standard", price: "0" },
		},
	};
	const order2: StoredOrder = {
		id: "ord-2",
		lookup: "SUMUD-1002",
		userId: "u-1",
		stripeSessionId: "",
		status: "shipped",
		createdAt: "2026-04-10T14:15:00Z",
		orderData: {
			customer: { email: "demo@sumud.com", name: "Demo User" },
			lineItems: [
				{
					id: "li-3",
					quantity: 1,
					productVariant: {
						id: "v-483",
						price: "3000",
						images: ["/images/baccarat483.png"],
						product: {
							id: "p-483",
							name: "483 - Inspired by Baccarat Rouge 540",
							slug: "483-baccarat-rouge",
							images: ["/images/baccarat483.png"],
						},
					},
				},
			],
			shippingAddress: {
				name: "Demo User",
				line1: "123 Scent Street",
				city: "London",
				state: "",
				postalCode: "SW1A 1AA",
				country: "GB",
			},
			shipping: { name: "Express", price: "500" },
		},
	};
	s.orders.set(order1.id, order1);
	s.orders.set(order2.id, order2);
	s.customerOrders.set("u-1", ["ord-2", "ord-1"]);
	s.orderCounter = 2;

	return s;
}

const globalForCommerce = globalThis as unknown as { __sumudCommerce?: CommerceStore };
if (!globalForCommerce.__sumudCommerce) {
	globalForCommerce.__sumudCommerce = createCommerceStore();
}
const db = globalForCommerce.__sumudCommerce;

const PRODUCTS = [
	{
		id: "p-121",
		slug: "121-ana-abiyedh",
		name: "121 - Inspired by Lattafa Ana Abiyedh",
		description:
			"The 12-Series (The Daytime Performers) Clean, fresh, and sweet scents that carry you through a 12-hour day.",
		images: ["/images/Abiyadh121.png"],
		variants: [{ id: "v-121", price: "2500", images: ["/images/Abiyadh121.png"], attributes: {} }],
	},
	{
		id: "p-122",
		slug: "122-invictus",
		name: "122 - Inspired by Paco Rabanne Invictus",
		description:
			"The 12-Series (The Daytime Performers) Clean, fresh, and sweet scents that carry you through a 12-hour day.",
		images: ["/images/Invictus122.png"],
		variants: [{ id: "v-122", price: "2500", images: ["/images/Invictus122.png"], attributes: {} }],
	},
	{
		id: "p-123",
		slug: "123-fantasy",
		name: "123 - Inspired by Britney Spears Fantasy",
		description:
			"The 12-Series (The Daytime Performers) Clean, fresh, and sweet scents that carry you through a 12-hour day.",
		images: ["/images/Fantasy123.png"],
		variants: [{ id: "v-123", price: "2000", images: ["/images/Fantasy123.png"], attributes: {} }],
	},
	{
		id: "p-124",
		slug: "124-paris-hilton",
		name: "124 - Inspired by Paris Hilton",
		description:
			"The 12-Series (The Daytime Performers) Clean, fresh, and sweet scents that carry you through a 12-hour day.",
		images: ["/images/Paris124.png"],
		variants: [{ id: "v-124", price: "2000", images: ["/images/Paris124.png"], attributes: {} }],
	},
	{
		id: "p-241",
		slug: "241-sauvage",
		name: "241 - Inspired by Dior Sauvage",
		description:
			"The 24-Series (The Unwavering Signatures) Bold, grounded woods and spices built to stay on the skin for a full 24 hours.",
		images: ["/images/Sauvage241.png"],
		variants: [{ id: "v-241", price: "3000", images: ["/images/Sauvage241.png"], attributes: {} }],
	},
	{
		id: "p-242",
		slug: "242-one-million",
		name: "242 - Inspired by Paco Rabanne 1 Million",
		description:
			"The 24-Series (The Unwavering Signatures) Bold, grounded woods and spices built to stay on the skin for a full 24 hours.",
		images: ["/images/Million242.png"],
		variants: [{ id: "v-242", price: "3000", images: ["/images/Million242.png"], attributes: {} }],
	},
	{
		id: "p-243",
		slug: "243-terre-d-hermes",
		name: "243 - Inspired by Terre d'Hermès",
		description:
			"The 24-Series (The Unwavering Signatures) Bold, grounded woods and spices built to stay on the skin for a full 24 hours.",
		images: ["/images/terre243.png"],
		variants: [{ id: "v-243", price: "3000", images: ["/images/terre243.png"], attributes: {} }],
	},
	{
		id: "p-481",
		slug: "481-kalimat",
		name: "481 - Inspired by Arabian Oud Kalimat",
		description:
			"The 48-Series (The Immovable Heavyweights) Deep ouds and rich resins that cling to clothes and linger in a room for 48 hours.",
		images: ["/images/Kalimat481.png"],
		variants: [{ id: "v-481", price: "3500", images: ["/images/Kalimat481.png"], attributes: {} }],
	},
	{
		id: "p-482",
		slug: "482-oud-mubakhar",
		name: "482 - Inspired by Oud Mubakhar",
		description:
			"The 48-Series (The Immovable Heavyweights) Deep ouds and rich resins that cling to clothes and linger in a room for 48 hours.",
		images: ["/images/Oud482.png"],
		variants: [{ id: "v-482", price: "3500", images: ["/images/Oud482.png"], attributes: {} }],
	},
	{
		id: "p-483",
		slug: "483-baccarat-rouge",
		name: "483 - Inspired by Baccarat Rouge 540",
		description:
			"The 48-Series (The Immovable Heavyweights) Deep ouds and rich resins that cling to clothes and linger in a room for 48 hours.",
		images: ["/images/baccarat483.png"],
		variants: [{ id: "v-483", price: "3000", images: ["/images/baccarat483.png"], attributes: {} }],
	},
];

export const commerce = {
	meGet: async () => ({
		store: { subdomain: "local", settings: {} },
		publicUrl: "http://localhost:3000",
	}),
	collectionBrowse: async (args?: any) => ({ data: [], meta: { count: 0 } }),
	legalPageBrowse: async () => ({ data: [], meta: { count: 0 } }),
	productBrowse: async (args?: {
		query?: string;
		active?: boolean;
		limit?: number;
		offset?: number;
		orderBy?: string;
		orderDirection?: string;
	}) => {
		let results = [...PRODUCTS];

		if (args?.query) {
			const q = args.query.toLowerCase();
			results = results.filter(
				(p) =>
					p.name.toLowerCase().includes(q) ||
					p.description.toLowerCase().includes(q) ||
					p.slug.toLowerCase().includes(q),
			);
		}

		if (args?.orderBy) {
			const dir = args.orderDirection === "asc" ? 1 : -1;
			results.sort((a, b) => {
				if (args.orderBy === "price") {
					return Number(BigInt(a.variants[0].price) - BigInt(b.variants[0].price)) * dir;
				}
				if (args.orderBy === "name") {
					return a.name.localeCompare(b.name) * dir;
				}
				return 0;
			});
		}

		return { data: results, meta: { count: results.length } };
	},
	cartGet: async (args?: { cartId?: string }) => {
		const items = args?.cartId ? db.carts.get(args.cartId) : undefined;
		if (!items) return null;
		return {
			id: args?.cartId ?? "",
			lineItems: items
				.map((entry) => {
					const product = PRODUCTS.find((p) => p.variants.some((v) => v.id === entry.variantId));
					const variant = product?.variants.find((v) => v.id === entry.variantId);
					if (!product || !variant) return null;
					return {
						quantity: entry.quantity,
						productVariant: {
							id: variant.id,
							price: variant.price,
							images: variant.images,
							attributes: variant.attributes,
							product: {
								id: product.id,
								name: product.name,
								slug: product.slug,
								images: product.images,
							},
						},
					};
				})
				.filter(Boolean),
		};
	},
	cartUpsert: async (args?: { cartId?: string; variantId?: string; quantity?: number }) => {
		const cartId = args?.cartId ?? `cart-${++db.cartCounter}`;
		if (!db.carts.has(cartId)) db.carts.set(cartId, []);
		const items = db.carts.get(cartId);

		if (args?.variantId && items) {
			const idx = items.findIndex((i) => i.variantId === args.variantId);
			if (args.quantity === 0) {
				if (idx !== -1) items.splice(idx, 1);
			} else if (idx !== -1) {
				items[idx].quantity += args.quantity ?? 1;
			} else {
				items.push({ variantId: args.variantId, quantity: args.quantity ?? 1 });
			}
		}

		return { id: cartId };
	},
	collectionGet: async (args?: any) => null,
	legalPageGet: async (args?: any) => null,
	subscriberCreate: async (args?: any) => null,
	orderGet: async (args?: { id?: string }) => {
		if (args?.id) return db.orders.get(args.id) ?? null;
		return null;
	},
	orderBrowse: async (args?: { userId?: string }) => {
		if (!args?.userId) return { data: [], meta: { count: 0 } };
		const ids = db.customerOrders.get(args.userId) ?? [];
		const data = ids.map((id) => db.orders.get(id)).filter(Boolean) as StoredOrder[];
		return { data, meta: { count: data.length } };
	},
	orderCreate: async (args: {
		userId: string;
		stripeSessionId: string;
		customer: { email: string; name: string };
		lineItems: StoredOrder["orderData"]["lineItems"];
		shippingAddress: StoredOrder["orderData"]["shippingAddress"];
		shipping: StoredOrder["orderData"]["shipping"];
	}) => {
		const id = `ord-${++db.orderCounter}`;
		const lookup = `SUMUD-${1000 + db.orderCounter}`;
		const order: StoredOrder = {
			id,
			lookup,
			userId: args.userId,
			stripeSessionId: args.stripeSessionId,
			status: "confirmed",
			createdAt: new Date().toISOString(),
			orderData: {
				customer: args.customer,
				lineItems: args.lineItems,
				shippingAddress: args.shippingAddress,
				shipping: args.shipping,
			},
		};
		db.orders.set(id, order);
		const existing = db.customerOrders.get(args.userId) ?? [];
		existing.unshift(id);
		db.customerOrders.set(args.userId, existing);
		return order;
	},
	orderGetByStripeSession: async (args: { stripeSessionId: string }) => {
		return Array.from(db.orders.values()).find((o) => o.stripeSessionId === args.stripeSessionId) ?? null;
	},
	productGet: async (args?: any) => {
		if (args?.idOrSlug) {
			const product = PRODUCTS.find((p) => p.id === args.idOrSlug || p.slug === args.idOrSlug);
			if (product) return product;
		}
		return null;
	},
	productReviewsBrowse: async (args?: { idOrSlug?: string }, options?: { limit?: number }) => {
		const slug = args?.idOrSlug ?? "";
		const data = (db.reviews.get(slug) ?? []).slice(0, options?.limit ?? 50);
		const reviewCount = data.length;
		const averageRating = reviewCount > 0 ? data.reduce((sum, r) => sum + r.rating, 0) / reviewCount : 0;
		return {
			data,
			summary: { averageRating, reviewCount },
			meta: { count: reviewCount },
		};
	},
	productReviewCreate: async (
		args?: { idOrSlug?: string },
		body?: { author: string; email: string; content: string; rating: number },
	) => {
		const slug = args?.idOrSlug ?? "";
		if (!body) return null;
		const review: StoredReview = {
			id: `r-${++db.reviewCounter}`,
			author: body.author,
			email: body.email,
			content: body.content,
			rating: body.rating,
			createdAt: new Date().toISOString(),
		};
		if (!db.reviews.has(slug)) db.reviews.set(slug, []);
		db.reviews.get(slug)?.unshift(review);
		return review;
	},
} as any;

export function getProductRatings(): Map<string, number> {
	const ratings = new Map<string, number>();
	PRODUCTS.map((p) => {
		const productReviews = db.reviews.get(p.slug) ?? [];
		if (productReviews.length > 0) {
			const avg = productReviews.reduce((sum, r) => sum + r.rating, 0) / productReviews.length;
			ratings.set(p.slug, avg);
		}
	});
	return ratings;
}

export const meGetCached = async (token?: string) => {
	"use cache: remote";
	return commerce.meGet();
};

export function getStoreFaviconUrl(settings: any) {
	return null;
}

export const getSubdomainPublicUrl = async () => {
	return { subdomain: "local", publicUrl: "http://localhost:3000" };
};
