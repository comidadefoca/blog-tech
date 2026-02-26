export default function Loading() {
    return (
        <div className="w-full flex flex-col gap-20 animate-pulse px-6 max-w-7xl mx-auto">

            {/* Hero Skeleton */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                <div className="lg:col-span-8 rounded-2xl bg-zinc-800/50 h-[500px] lg:h-[600px]" />
                <div className="lg:col-span-4 flex flex-col gap-6">
                    <div className="rounded-2xl bg-zinc-800/50 h-[240px] lg:h-[288px]" />
                    <div className="rounded-2xl bg-zinc-800/50 h-[240px] lg:h-[288px]" />
                </div>
            </div>

            {/* Grid Skeleton */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-6 gap-y-12">
                {[...Array(6)].map((_, i) => (
                    <div key={i} className="flex flex-col gap-4">
                        <div className="w-full aspect-[4/3] rounded-2xl bg-zinc-800/50" />
                        <div className="h-4 w-24 rounded bg-zinc-800/50" />
                        <div className="h-6 w-3/4 rounded bg-zinc-800/50" />
                    </div>
                ))}
            </div>
        </div>
    );
}
