import Image from "next/image";
import Link from "next/link";
import FadeIn from "@/components/FadeIn";
import { getPosts, getMostViewed } from "@/lib/supabase";
import { cookies } from "next/headers";
import { t, type Lang } from "@/lib/i18n";

// ISR: revalidate every 60 seconds — fresh content + caching for SEO performance
export const revalidate = 60;

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

export default async function Home() {
  const cookieStore = await cookies();
  const lang = (cookieStore.get("NEXT_LOCALE")?.value || "en") as Lang;
  const dict = t(lang);

  const [posts, mostViewed] = await Promise.all([
    getPosts(),
    getMostViewed(5),
  ]);

  // Split posts into hero (first 3) and grid (rest)
  const heroPosts = posts.slice(0, 3);
  const gridPosts = posts.slice(3, 9);

  return (
    <div className="w-full flex flex-col gap-20">

      {/* 1. Hero Section - Asymmetrical Grid */}
      <section className="px-6 w-full max-w-7xl mx-auto">
        <FadeIn delay={100} direction="up">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">

            {/* Main Featured Post (Left) */}
            {heroPosts[0] && (
              <Link href={`/post/${heroPosts[0].slug}`} className="lg:col-span-8 relative rounded-2xl overflow-hidden h-[500px] lg:h-[600px] group block aspect-video md:aspect-auto">
                {heroPosts[0].image_url ? (
                  <Image
                    src={heroPosts[0].image_url}
                    alt={heroPosts[0].title}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-700 ease-in-out"
                    priority
                  />
                ) : (
                  <div className="absolute inset-0 bg-gradient-to-br from-blue-900 to-zinc-900" />
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-[#0E0E0E] via-[#0E0E0E]/60 to-transparent" />

                <div className="absolute bottom-0 left-0 p-8 md:p-12 w-full max-w-2xl text-tribune-text">
                  <div className="flex items-center gap-3 text-xs font-semibold uppercase tracking-wider mb-4">
                    <span className="bg-zinc-800/80 backdrop-blur-sm px-2.5 py-1 rounded text-white">{getFirstTag(heroPosts[0].tags)}</span>
                    <span className="text-zinc-400">{formatDate(heroPosts[0].published_at, lang)}</span>
                  </div>
                  <h1 className="text-3xl md:text-5xl font-bold tracking-tight leading-[1.15] text-white">
                    {heroPosts[0].title_pt && lang === 'pt' ? heroPosts[0].title_pt : heroPosts[0].title}
                  </h1>
                </div>
              </Link>
            )}

            {/* Side Featured Posts (Right Stack) */}
            <div className="lg:col-span-4 flex flex-col gap-6">
              {heroPosts.slice(1, 3).map((post) => (
                <Link key={post.id} href={`/post/${post.slug}`} className="relative rounded-2xl overflow-hidden h-[240px] lg:h-[288px] group block bg-tribune-card">
                  {post.image_url ? (
                    <Image
                      src={post.image_url}
                      alt={post.title}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-700 ease-in-out opacity-80 mix-blend-lighten"
                    />
                  ) : (
                    <div className="absolute inset-0 bg-gradient-to-br from-blue-900 to-zinc-900" />
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-[#0E0E0E] to-transparent/20" />

                  <div className="absolute bottom-0 left-0 p-6 md:p-8 w-full">
                    <div className="flex items-center gap-3 text-xs font-semibold uppercase tracking-wider mb-3">
                      <span className="bg-zinc-800/80 backdrop-blur-sm px-2.5 py-1 rounded text-white">{getFirstTag(post.tags)}</span>
                      <span className="text-zinc-400">{formatDate(post.published_at, lang)}</span>
                    </div>
                    <h2 className="text-xl md:text-2xl font-bold tracking-tight leading-snug text-white">
                      {post.title_pt && lang === 'pt' ? post.title_pt : post.title}
                    </h2>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </FadeIn>
      </section>

      {/* 2. Article Grid (3 Columns) */}
      {gridPosts.length > 0 && (
        <section className="px-6 w-full max-w-7xl mx-auto">
          <FadeIn delay={300} direction="up">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-6 gap-y-12">
              {gridPosts.map((post) => (
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
                </Link>
              ))}
            </div>
          </FadeIn>
        </section>
      )}

      {/* 3. Most Read Section */}
      {mostViewed.length > 0 && (
        <section className="px-6 w-full max-w-7xl mx-auto">
          <FadeIn delay={400} direction="up">
            <h2 className="text-xs uppercase tracking-widest text-zinc-500 font-bold mb-8">{dict.mostRead}</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
              {mostViewed.map((post, index) => (
                <Link key={post.id} href={`/post/${post.slug}`} className="group flex flex-col gap-3">
                  <div className="flex items-center gap-3">
                    <span className="text-4xl font-serif font-bold text-zinc-800 group-hover:text-tribune-accent transition-colors">
                      {String(index + 1).padStart(2, '0')}
                    </span>
                    <div className="flex flex-col gap-1">
                      {post.category && (
                        <span className="text-[10px] text-tribune-accent font-semibold uppercase tracking-wider">{post.category}</span>
                      )}
                      <h4 className="text-sm font-bold text-white leading-snug group-hover:text-tribune-accent transition-colors line-clamp-2">
                        {post.title_pt && lang === 'pt' ? post.title_pt : post.title}
                      </h4>
                      <span className="flex items-center gap-1 text-xs text-zinc-600">
                        <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="1.5">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z" />
                          <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                        </svg>
                        {(post.views || 0).toLocaleString('pt-BR')}
                      </span>
                    </div>
                  </div>
                </Link>
              ))}
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
