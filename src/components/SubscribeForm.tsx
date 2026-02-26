"use client";

export default function SubscribeForm() {
    return (
        <form
            className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto"
            onSubmit={(e) => e.preventDefault()}
        >
            <input
                type="email"
                placeholder="Email Address..."
                className="flex-grow px-5 py-3.5 rounded-xl bg-blue-500/30 border border-blue-400/30 text-white placeholder-blue-200 outline-none focus:ring-2 focus:ring-white transition-all"
                required
            />
            <button
                type="submit"
                className="bg-white text-tribune-accent font-bold px-6 py-3.5 rounded-xl hover:bg-zinc-100 hover:-translate-y-1 transition-all duration-300 whitespace-nowrap"
            >
                Subscribe
            </button>
        </form>
    );
}
