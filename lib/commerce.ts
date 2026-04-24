// We are replacing the YNS API with a completely local mock dataset so you don't
// have to pay or rely on Sumud Scents for your backend.

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
	productBrowse: async (args?: any) => ({ data: PRODUCTS, meta: { count: PRODUCTS.length } }),
	cartGet: async (args?: any) => null,
	cartUpsert: async (args?: any) => null,
	collectionGet: async (args?: any) => null,
	legalPageGet: async (args?: any) => null,
	subscriberCreate: async (args?: any) => null,
	orderGet: async (args?: any) => null,
	productGet: async (args?: any) => {
		if (args?.idOrSlug) {
			const product = PRODUCTS.find((p) => p.id === args.idOrSlug || p.slug === args.idOrSlug);
			if (product) return product;
		}
		return null;
	},
	productReviewsBrowse: async (args?: any) => ({ data: [], meta: { count: 0 } }),
	productReviewCreate: async (args?: any) => null,
} as any;

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
