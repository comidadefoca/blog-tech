import Image from "next/image";
import Link from "next/link";
import FadeIn from "@/components/FadeIn";
import SubscribeForm from "@/components/SubscribeForm";
import { getPosts } from "@/lib/supabase";

// Force dynamic rendering so posts are always fresh
export const dynamic = 'force-dynamic';

function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString('en-US', {
    month: 'short', day: 'numeric', year: 'numeric'
  });
}

function getFirstTag(tags: string): string {
  if (!tags) return 'AI';
  return tags.split(',')[0].trim() || 'AI';
}

export default async function Home() {
  const posts = await getPosts();

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
                    <span className="text-zinc-400">{formatDate(heroPosts[0].published_at)}</span>
                  </div>
                  <h1 className="text-3xl md:text-5xl font-bold tracking-tight leading-[1.15] text-white">
                    {heroPosts[0].title}
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
                      <span className="text-zinc-400">{formatDate(post.published_at)}</span>
                    </div>
                    <h2 className="text-xl md:text-2xl font-bold tracking-tight leading-snug text-white">
                      {post.title}
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
                    <span className="text-zinc-500">{formatDate(post.published_at)}</span>
                  </div>
                  <h3 className="text-2xl font-bold tracking-tight text-white group-hover:text-tribune-accent transition-colors leading-snug">
                    {post.title}
                  </h3>
                </Link>
              ))}
            </div>
          </FadeIn>
        </section>
      )}

      {/* Empty State */}
      {posts.length === 0 && (
        <section className="px-6 w-full max-w-7xl mx-auto text-center py-20">
          <h2 className="text-3xl font-bold text-white mb-4">No posts yet</h2>
          <p className="text-zinc-400 text-lg">Content is being generated. Check back soon!</p>
        </section>
      )}

      {/* 3. CTA Banner */}
      <section className="px-6 w-full max-w-7xl mx-auto mb-10">
        <FadeIn delay={200} direction="up">
          <div className="w-full relative rounded-2xl overflow-hidden h-[360px] md:h-[400px] flex items-center justify-center">
            <Image
              src="https://images.unsplash.com/photo-1633630650912-3023c72bdf35?q=80&w=2070&auto=format&fit=crop"
              alt="Liquid Marble"
              fill
              className="object-cover opacity-60 mix-blend-color-dodge saturate-200"
            />

            <div className="relative z-10 w-[90%] md:w-[600px] bg-tribune-accent p-10 md:p-14 rounded-2xl text-center shadow-2xl backdrop-blur-md">
              <h2 className="text-3xl md:text-5xl font-bold text-white mb-4 tracking-tight">
                Subscribe <span className="font-serif italic font-normal">to</span> Tribune
              </h2>
              <p className="text-blue-100 mb-8 max-w-md mx-auto">
                Sign up to our newsletters and we&apos;ll keep you in the loop.
              </p>

              <SubscribeForm />
            </div>
          </div>
        </FadeIn>
      </section>

    </div>
  );
}
