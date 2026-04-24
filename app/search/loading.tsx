export default function SearchLoading() {
	return (
		<section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 sm:py-32">
			<div className="mb-12">
				<div className="h-8 w-48 bg-secondary/80 rounded animate-pulse-soft" />
				<div className="mt-4 h-5 w-32 bg-secondary/80 rounded animate-pulse-soft" />
			</div>
			<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10">
				{Array.from({ length: 6 }, (_, i) => (
					<div key={i} className="animate-pulse-soft">
						<div className="aspect-square bg-secondary/80 rounded-2xl mb-6 shadow-sm" />
						<div className="space-y-3 px-2">
							<div className="h-5 w-4/5 bg-secondary/80 rounded" />
							<div className="h-4 w-1/3 bg-secondary/80 rounded" />
						</div>
					</div>
				))}
			</div>
		</section>
	);
}
