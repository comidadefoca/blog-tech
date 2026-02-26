import Image from "next/image";
import Link from "next/link";
import FadeIn from "@/components/FadeIn";
import { getPaginatedPosts } from "@/lib/supabase";
import { cookies } from "next/headers";
import { t, type Lang } from "@/lib/i18n";

export const dynamic = 'force-dynamic';

const PER_PAGE = 12;

function formatDate(dateStr: string, lang: Lang) {
    const locale = lang === 'pt' ? 'pt-BR' : 'en-US';
    return new Date(dateStr).toLocaleDateString(locale, {
        month: 'short', day: 'numeric', year: 'numeric'
    });
}

function getFirstTag(tags: string): string {
    if (!tags) return 'AI';
    return tags.split(',')[0].trim() || 'AI';
}

export default async function ArchivePage({
    searchParams,
}: {
    searchParams: Promise<{ page?: string }>;
}) {
    const cookieStore = await cookies();
    const lang = (cookieStore.get("NEXT_LOCALE")?.value || "en") as Lang;
    const dict = t(lang);

    const params = await searchParams;
    const currentPage = Math.max(1, parseInt(params.page || '1', 10));
    const { posts, total } = await getPaginatedPosts(currentPage, PER_PAGE);
    const totalPages = Math.ceil(total / PER_PAGE);

    return (
        <div className="w-full flex flex-col gap-12">
            {/* Header */}
            <section className="px-6 w-full max-w-7xl mx-auto pt-4">
                <FadeIn delay={100} direction="up">
                    <h1 className="font-serif text-4xl md:text-6xl font-bold tracking-tight text-white mb-4">
                        {dict.archive}
                    </h1>
                    <p className="text-zinc-400 text-lg">
                        {total} {lang === 'pt' ? 'artigos publicados' : 'published articles'}
                    </p>
                </FadeIn>
            </section>

            {/* Posts Grid */}
            <section className="px-6 w-full max-w-7xl mx-auto">
                <FadeIn delay={200} direction="up">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-6 gap-y-12">
                        {posts.map((post) => (
                            <Link key={post.id} href={`/post/${post.slug}`} className="flex flex-col group block">
                                <div className="relative w-full aspect-[4/3] rounded-2xl overflow-hidden mb-6 bg-tribune-card">
                                    {post.image_url ? (
                                        <Image
                                            src={post.image_url}
                                            alt={post.title}
                                            fill
                                            className="object-cover group-hover:scale-105 transition-transform duration-700 ease-in-out opacity-90"
                                        />
                                    ) : (
                                        <div className="absolute inset-0 bg-gradient-to-br from-blue-900 to-zinc-900" />
                                    )}
                                </div>
                                <div className="flex items-center gap-3 text-xs font-semibold uppercase tracking-wider mb-3">
                                    <span className="bg-[#1A1A1A] px-2.5 py-1 rounded text-zinc-300">{getFirstTag(post.tags)}</span>
                                    <span className="text-zinc-500">{formatDate(post.published_at, lang)}</span>
                                </div>
                                <h3 className="text-2xl font-bold tracking-tight text-white group-hover:text-tribune-accent transition-colors leading-snug">
                                    {post.title_pt && lang === 'pt' ? post.title_pt : post.title}
                                </h3>
                                {post.excerpt && (
                                    <p className="text-zinc-400 text-sm mt-2 line-clamp-2">
                                        {post.excerpt_pt && lang === 'pt' ? post.excerpt_pt : post.excerpt}
                                    </p>
                                )}
                            </Link>
                        ))}
                    </div>
                </FadeIn>
            </section>

            {/* Pagination */}
            {totalPages > 1 && (
                <section className="px-6 w-full max-w-7xl mx-auto">
                    <FadeIn delay={300} direction="up">
                        <div className="flex items-center justify-center gap-3">
                            {currentPage > 1 && (
                                <Link
                                    href={`/archive?page=${currentPage - 1}`}
                                    className="px-4 py-2 rounded-lg bg-zinc-800 text-zinc-300 hover:bg-zinc-700 transition text-sm font-medium"
                                >
                                    ←
                                </Link>
                            )}
                            {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                                <Link
                                    key={page}
                                    href={`/archive?page=${page}`}
                                    className={`px-4 py-2 rounded-lg text-sm font-medium transition ${page === currentPage
                                            ? 'bg-tribune-accent text-white'
                                            : 'bg-zinc-800 text-zinc-400 hover:bg-zinc-700'
                                        }`}
                                >
                                    {page}
                                </Link>
                            ))}
                            {currentPage < totalPages && (
                                <Link
                                    href={`/archive?page=${currentPage + 1}`}
                                    className="px-4 py-2 rounded-lg bg-zinc-800 text-zinc-300 hover:bg-zinc-700 transition text-sm font-medium"
                                >
                                    →
                                </Link>
                            )}
                        </div>
                    </FadeIn>
                </section>
            )}

            {/* Empty State */}
            {posts.length === 0 && (
                <section className="px-6 w-full max-w-7xl mx-auto text-center py-20">
                    <h2 className="text-3xl font-bold text-white mb-4">{dict.noPosts}</h2>
                    <p className="text-zinc-400 text-lg">{dict.noPostsText}</p>
                </section>
            )}
        </div>
    );
}
