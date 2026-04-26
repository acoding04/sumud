export default function ProductsLoading() {
	return (
		<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
			<div className="mb-10">
				<div className="h-9 w-48 bg-secondary/80 rounded animate-pulse" />
				<div className="mt-3 h-5 w-64 bg-secondary/80 rounded animate-pulse" />
			</div>

			<div className="mb-8 flex flex-wrap items-center gap-3">
				<div className="h-5 w-16 bg-secondary/80 rounded animate-pulse" />
				{Array.from({ length: 4 }, (_, i) => (
					<div key={i} className="h-5 w-24 bg-secondary/80 rounded animate-pulse" />
				))}
			</div>

			<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
				{Array.from({ length: 6 }, (_, i) => (
					<div key={i} className="animate-pulse">
						<div className="aspect-square bg-secondary/80 rounded-2xl mb-6" />
						<div className="space-y-2 px-2">
							<div className="h-5 w-3/4 bg-secondary/80 rounded" />
							<div className="h-4 w-1/3 bg-secondary/80 rounded" />
						</div>
					</div>
				))}
			</div>
		</div>
	);
}
