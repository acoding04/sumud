import { Suspense } from "react";
import { ProductGrid } from "@/components/sections/product-grid";
import { commerce } from "@/lib/commerce";
import { perfumes } from "@/lib/perfume-data";

export function RelatedProducts(props: { productId: string; slug: string }) {
	return (
		<Suspense>
			<RelatedProductsContent {...props} />
		</Suspense>
	);
}

function getAllNotes(p: (typeof perfumes)[number]) {
	return [...p.topNotes, ...p.heartNotes, ...p.baseNotes];
}

function computeScore(current: (typeof perfumes)[number], candidate: (typeof perfumes)[number]) {
	let score = 0;
	if (candidate.gender === current.gender) score += 3;

	const currentSeries = current.slug.charAt(0);
	const candidateSeries = candidate.slug.charAt(0);
	if (candidateSeries === currentSeries) score += 2;

	const currentNotes = new Set(getAllNotes(current).map((n) => n.toLowerCase()));
	const candidateNotes = getAllNotes(candidate);
	candidateNotes.map((note) => {
		if (currentNotes.has(note.toLowerCase())) score += 1;
	});

	return score;
}

async function RelatedProductsContent({ productId, slug }: { productId: string; slug: string }) {
	const result = await commerce.productBrowse({ active: true, limit: 100 });
	const candidates = result.data.filter((p: { id: string }) => p.id !== productId);

	const currentPerfume = perfumes.find((p) => p.slug === slug);

	const scored = candidates.map((product: { slug: string }) => {
		const candidatePerfume = perfumes.find((p) => p.slug === product.slug);
		const score = currentPerfume && candidatePerfume ? computeScore(currentPerfume, candidatePerfume) : 0;
		return { product, score };
	});

	scored.sort((a: { score: number }, b: { score: number }) => b.score - a.score);
	const related = scored.slice(0, 4).map((s: { product: unknown }) => s.product);

	if (related.length === 0) return null;

	return (
		<ProductGrid
			title="You might also like"
			description="Based on scent profile"
			products={related}
			showViewAll={false}
		/>
	);
}
