export default function PostLoading() {
    return (
        <div className="w-full flex flex-col pt-4 pb-16 animate-pulse">
            {/* Header Skeleton */}
            <section className="px-6 w-full max-w-7xl mx-auto mb-16">
                <div className="flex flex-col items-center text-center max-w-4xl mx-auto mb-10 mt-6">
                    <div className="flex items-center gap-3 mb-6">
                        <div className="h-6 w-20 rounded bg-zinc-800/50" />
                        <div className="h-4 w-28 rounded bg-zinc-800/50" />
                    </div>
                    <div className="h-12 w-3/4 rounded bg-zinc-800/50 mb-4" />
                    <div className="h-8 w-2/3 rounded bg-zinc-800/50" />
                </div>
                <div className="w-full rounded-2xl md:rounded-[32px] bg-zinc-800/50 h-[400px] md:h-[600px] lg:h-[700px]" />
            </section>

            {/* Content Skeleton */}
            <section className="px-6 w-full max-w-4xl mx-auto">
                <div className="flex flex-col gap-4">
                    {[...Array(8)].map((_, i) => (
                        <div key={i} className="h-5 rounded bg-zinc-800/50" style={{ width: `${85 + Math.random() * 15}%` }} />
                    ))}
                    <div className="h-8 w-1/2 rounded bg-zinc-800/50 mt-6" />
                    {[...Array(5)].map((_, i) => (
                        <div key={`b${i}`} className="h-5 rounded bg-zinc-800/50" style={{ width: `${75 + Math.random() * 25}%` }} />
                    ))}
                </div>
            </section>
        </div>
    );
}
