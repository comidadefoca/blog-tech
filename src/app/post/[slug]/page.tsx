import Image from "next/image";
import Link from "next/link";
import FadeIn from "@/components/FadeIn";
import ViewCounter from "@/components/ViewCounter";
import { notFound } from "next/navigation";
import { getPostBySlug } from "@/lib/supabase";
import ReactMarkdown from "react-markdown";

// Force dynamic rendering
export const dynamic = 'force-dynamic';

function formatDate(dateStr: string) {
    return new Date(dateStr).toLocaleDateString('pt-BR', {
        month: 'long', day: 'numeric', year: 'numeric'
    });
}

export default async function BlogPostPage({
    params,
}: {
    params: Promise<{ slug: string }>;
}) {
    const { slug } = await params;

    if (!slug) {
        notFound();
    }

    const post = await getPostBySlug(slug);

    if (!post) {
        notFound();
    }

    // Parse tags
    const tags = post.tags ? post.tags.split(',').map(t => t.trim()).filter(Boolean) : [];

    // Extract the actual markdown content (strip frontmatter if present)
    let markdownContent = post.content || '';
    const fmMatch = markdownContent.match(/^---\n[\s\S]*?\n---\n([\s\S]*)$/);
    if (fmMatch) {
        markdownContent = fmMatch[1].trim();
    }

    return (
        <div className="w-full flex flex-col pt-4 pb-16">

            {/* 1. Article Header & Hero Image */}
            <section className="px-6 w-full max-w-7xl mx-auto mb-16">
                <FadeIn delay={100} direction="up">
                    <div className="flex flex-col items-center text-center max-w-4xl mx-auto mb-10 mt-6">
                        <div className="flex items-center gap-3 text-xs font-semibold uppercase tracking-wider mb-6">
                            {post.category && (
                                <span className="bg-tribune-accent/20 text-tribune-accent px-3 py-1.5 rounded">{post.category}</span>
                            )}
                            {!post.category && tags[0] && (
                                <span className="bg-zinc-800 px-3 py-1.5 rounded text-zinc-300">{tags[0]}</span>
                            )}
                            <span className="text-zinc-500">{formatDate(post.published_at)}</span>
                            <ViewCounter postId={post.id} initialViews={post.views || 0} />
                        </div>

                        <h1 className="font-serif text-4xl md:text-5xl lg:text-7xl font-bold tracking-tight text-white mb-6 leading-[1.1]">
                            {post.title}
                        </h1>
                        {post.excerpt && (
                            <p className="text-xl md:text-2xl text-zinc-400 font-medium">
                                {post.excerpt}
                            </p>
                        )}
                    </div>

                    {post.image_url && (
                        <div className="w-full relative rounded-2xl md:rounded-[32px] overflow-hidden h-[400px] md:h-[600px] lg:h-[700px]">
                            <Image
                                src={post.image_url}
                                alt={post.title}
                                fill
                                className="object-cover"
                                priority
                            />
                        </div>
                    )}
                </FadeIn>
            </section>

            {/* 2. Main Article Content */}
            <section className="px-6 w-full max-w-4xl mx-auto">
                <FadeIn delay={300} direction="up">
                    <article className="w-full max-w-none">
                        <div className="prose prose-lg prose-invert max-w-none text-zinc-400 prose-headings:font-serif prose-headings:text-white prose-a:text-tribune-accent prose-a:no-underline hover:prose-a:underline prose-strong:text-zinc-200 prose-code:text-blue-300 prose-blockquote:border-tribune-accent prose-blockquote:text-zinc-300 prose-li:text-zinc-400">
                            <ReactMarkdown>{markdownContent}</ReactMarkdown>
                        </div>

                        {/* Tags */}
                        {tags.length > 0 && (
                            <div className="flex flex-wrap gap-3 mt-12 pt-8 border-t border-zinc-800">
                                <span className="text-xs uppercase tracking-widest text-zinc-500 font-bold flex items-center mr-2">Tags</span>
                                {tags.map((tag) => (
                                    <span key={tag} className="bg-zinc-900 px-3 py-1.5 rounded-lg text-sm text-zinc-300 cursor-pointer hover:bg-zinc-800 transition-colors">
                                        {tag}
                                    </span>
                                ))}
                            </div>
                        )}
                    </article>
                </FadeIn>
            </section>

            {/* 3. Back to Home */}
            <section className="px-6 w-full max-w-4xl mx-auto mt-16">
                <Link href="/" className="inline-flex items-center gap-2 text-tribune-accent hover:underline font-semibold">
                    ← Voltar para todos os posts
                </Link>
            </section>

        </div>
    );
}
