import Image from "next/image";
import Link from "next/link";
import FadeIn from "@/components/FadeIn";
import ViewCounter from "@/components/ViewCounter";
import ShareButton from "@/components/ShareButton";
import { notFound } from "next/navigation";
import { getPostBySlug } from "@/lib/supabase";
import ReactMarkdown from "react-markdown";
import { cookies } from "next/headers";
import { t, type Lang } from "@/lib/i18n";
import type { Metadata } from "next";

// ISR: revalidate every 60 seconds for fresh content + caching for SEO performance
export const revalidate = 60;

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://aifrontiers.blog';

/**
 * Dynamic metadata per post — gives each article its own <title>, <meta description>,
 * Open Graph tags, and Twitter Card for SEO and social sharing.
 */
export async function generateMetadata({
    params,
}: {
    params: Promise<{ slug: string }>;
}): Promise<Metadata> {
    const { slug } = await params;
    const post = await getPostBySlug(slug);

    if (!post) {
        return { title: 'Post Not Found — Lumen AI' };
    }

    const title = `${post.title} — Lumen AI`;
    const description = post.excerpt || post.title;
    const url = `${SITE_URL}/post/${post.slug}`;
    const imageUrl = post.image_url || `${SITE_URL}/og-default.png`;

    return {
        title,
        description,
        keywords: post.tags?.split(',').map((t: string) => t.trim()),
        alternates: { canonical: url },
        openGraph: {
            type: 'article',
            title: post.title,
            description,
            url,
            siteName: 'Lumen AI',
            images: [{ url: imageUrl, width: 1200, height: 630, alt: post.title }],
            publishedTime: post.published_at,
            tags: post.tags?.split(',').map((t: string) => t.trim()),
        },
        twitter: {
            card: 'summary_large_image',
            title: post.title,
            description,
            images: [imageUrl],
        },
    };
}

function formatDate(dateStr: string, lang: Lang) {
    const locale = lang === 'pt' ? 'pt-BR' : 'en-US';
    return new Date(dateStr).toLocaleDateString(locale, {
        month: 'long', day: 'numeric', year: 'numeric'
    });
}

export default async function BlogPostPage({
    params,
}: {
    params: Promise<{ slug: string }>;
}) {
    const { slug } = await params;

    const cookieStore = await cookies();
    const lang = (cookieStore.get("NEXT_LOCALE")?.value || "en") as Lang;
    const dict = t(lang);

    if (!slug) {
        notFound();
    }

    const post = await getPostBySlug(slug);

    if (!post) {
        notFound();
    }

    // Parse tags
    const tags = post.tags ? post.tags.split(',').map(t => t.trim()).filter(Boolean) : [];

    // Select correct language content
    const displayTitle = post.title_pt && lang === 'pt' ? post.title_pt : post.title;
    const displayExcerpt = post.excerpt_pt && lang === 'pt' ? post.excerpt_pt : post.excerpt;
    const rawContent = (post.content_pt && lang === 'pt') ? post.content_pt : (post.content || '');

    // Extract the actual markdown content (strip frontmatter if present)
    let markdownContent = rawContent;
    const fmMatch = markdownContent.match(/^---\n[\s\S]*?\n---\n([\s\S]*)$/);
    if (fmMatch) {
        markdownContent = fmMatch[1].trim();
    }

    // JSON-LD structured data for Google rich snippets
    const postUrl = `${SITE_URL}/post/${post.slug}`;
    const jsonLd = {
        '@context': 'https://schema.org',
        '@type': 'Article',
        headline: post.title,
        description: post.excerpt || post.title,
        image: post.image_url || undefined,
        datePublished: post.published_at,
        dateModified: post.published_at,
        url: postUrl,
        publisher: {
            '@type': 'Organization',
            name: 'Lumen AI',
            url: SITE_URL,
        },
        mainEntityOfPage: {
            '@type': 'WebPage',
            '@id': postUrl,
        },
        keywords: post.tags || undefined,
    };

    return (
        <div className="w-full flex flex-col pt-4 pb-16">

            {/* JSON-LD Schema for Google Rich Snippets */}
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
            />

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
                            <span className="text-zinc-500">{formatDate(post.published_at, lang)}</span>
                            <ViewCounter postId={post.id} initialViews={post.views || 0} />
                        </div>

                        <h1 className="font-serif text-4xl md:text-5xl lg:text-7xl font-bold tracking-tight text-white mb-6 leading-[1.1]">
                            {displayTitle}
                        </h1>
                        {displayExcerpt && (
                            <p className="text-xl md:text-2xl text-zinc-400 font-medium">
                                {displayExcerpt}
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
                        <div className="prose prose-lg md:prose-xl lg:prose-2xl prose-invert max-w-none text-zinc-300 leading-relaxed md:leading-[1.8] tracking-wide prose-headings:font-serif prose-headings:text-white prose-h2:mt-16 prose-h2:mb-8 prose-h3:mt-12 prose-h3:mb-6 prose-a:text-tribune-accent prose-a:no-underline hover:prose-a:underline prose-strong:text-zinc-100 prose-strong:font-bold prose-code:text-blue-300 prose-blockquote:border-tribune-accent prose-blockquote:text-zinc-200 prose-blockquote:bg-tribune-accent/5 prose-blockquote:py-2 prose-blockquote:px-6 prose-blockquote:rounded-r-xl prose-blockquote:italic  prose-li:text-zinc-300 prose-li:my-2 prose-p:mb-8">
                            <ReactMarkdown>{markdownContent}</ReactMarkdown>
                        </div>

                        {/* Share + Tags Section */}
                        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 mt-12 pt-8 border-t border-zinc-800">
                            {/* Tags */}
                            {tags.length > 0 && (
                                <div className="flex flex-wrap gap-3">
                                    <span className="text-xs uppercase tracking-widest text-zinc-500 font-bold flex items-center mr-2">{dict.tags}</span>
                                    {tags.map((tag) => (
                                        <span key={tag} className="bg-zinc-900 px-3 py-1.5 rounded-lg text-sm text-zinc-300 cursor-pointer hover:bg-zinc-800 transition-colors">
                                            {tag}
                                        </span>
                                    ))}
                                </div>
                            )}

                            {/* Share Button */}
                            <ShareButton
                                title={displayTitle}
                                url={postUrl}
                                lang={lang}
                            />
                        </div>
                    </article>
                </FadeIn>
            </section>

            {/* 3. Back to Home */}
            <section className="px-6 w-full max-w-4xl mx-auto mt-16">
                <Link href="/" className="inline-flex items-center gap-2 text-tribune-accent hover:underline font-semibold">
                    {dict.backToHome}
                </Link>
            </section>

        </div>
    );
}
