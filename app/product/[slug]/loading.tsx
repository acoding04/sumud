export default function ProductLoading() {
	return (
		<main className="w-full bg-white pb-16">
			<section className="relative w-full bg-zinc-50 min-h-[60vh] lg:min-h-[70vh] flex flex-col justify-center items-center border-b border-zinc-200 pb-16 lg:pb-0 pt-24 lg:pt-0">
				<div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-24 grid lg:grid-cols-2 gap-12 lg:gap-24 items-center">
					{/* Image skeleton */}
					<div className="aspect-square bg-zinc-200 rounded-2xl animate-pulse" />

					{/* Details skeleton */}
					<div className="flex flex-col items-center lg:items-start gap-4">
						<div className="h-4 w-20 bg-zinc-200 rounded animate-pulse" />
						<div className="h-12 w-64 bg-zinc-200 rounded animate-pulse" />
						<div className="h-8 w-32 bg-zinc-200 rounded animate-pulse mt-2" />
						<div className="space-y-3 w-full mt-4">
							<div className="h-5 w-full bg-zinc-200 rounded animate-pulse" />
							<div className="h-5 w-4/5 bg-zinc-200 rounded animate-pulse" />
							<div className="h-5 w-3/5 bg-zinc-200 rounded animate-pulse" />
						</div>
						<div className="h-14 w-full bg-zinc-200 rounded-2xl animate-pulse mt-8" />
					</div>
				</div>
			</section>
		</main>
	);
}
