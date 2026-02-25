"use client";

import Image from "next/image";
import Link from "next/link";
import FadeIn from "@/components/FadeIn";

export default function Home() {
  return (
    <div className="w-full flex flex-col gap-20">

      {/* 1. Hero Section - Asymmetrical Grid */}
      <section className="px-6 w-full max-w-7xl mx-auto">
        <FadeIn delay={100} direction="up">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">

            {/* Main Featured Post (Left) */}
            <Link href="/post/best-blog-hosting-services" className="lg:col-span-8 relative rounded-2xl overflow-hidden h-[500px] lg:h-[600px] group block aspect-video md:aspect-auto">
              <Image
                src="https://images.unsplash.com/photo-1550751827-4bd374c3f58b?q=80&w=2070&auto=format&fit=crop"
                alt="Server Room"
                fill
                className="object-cover group-hover:scale-105 transition-transform duration-700 ease-in-out"
              />
              {/* Gradient Overlay for Text Readability */}
              <div className="absolute inset-0 bg-gradient-to-t from-[#0E0E0E] via-[#0E0E0E]/60 to-transparent" />

              <div className="absolute bottom-0 left-0 p-8 md:p-12 w-full max-w-2xl text-tribune-text">
                <div className="flex items-center gap-3 text-xs font-semibold uppercase tracking-wider mb-4">
                  <span className="bg-zinc-800/80 backdrop-blur-sm px-2.5 py-1 rounded text-white">Technology</span>
                  <span className="text-zinc-400">Jun 16, 2024</span>
                </div>
                <h1 className="text-3xl md:text-5xl font-bold tracking-tight leading-[1.15] text-white">
                  Best blog hosting services, detailed comparison
                </h1>
              </div>
            </Link>

            {/* Side Featured Posts (Right Stack) */}
            <div className="lg:col-span-4 flex flex-col gap-6">

              <Link href="/post/embarking-on-interior" className="relative rounded-2xl overflow-hidden h-[240px] lg:h-[288px] group block bg-tribune-card">
                <Image
                  src="https://images.unsplash.com/photo-1497366216548-37526070297c?q=80&w=2069&auto=format&fit=crop"
                  alt="Architecture and stairs"
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-700 ease-in-out opacity-80 mix-blend-lighten"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#0E0E0E] to-transparent/20" />

                <div className="absolute bottom-0 left-0 p-6 md:p-8 w-full">
                  <div className="flex items-center gap-3 text-xs font-semibold uppercase tracking-wider mb-3">
                    <span className="bg-zinc-800/80 backdrop-blur-sm px-2.5 py-1 rounded text-white">Interior</span>
                    <span className="text-zinc-400">Jun 16, 2024</span>
                  </div>
                  <h2 className="text-xl md:text-2xl font-bold tracking-tight leading-snug text-white">
                    5 Must-haves before embarking on interior
                  </h2>
                </div>
              </Link>

              <Link href="/post/things-to-immediately-do-about-car" className="relative rounded-2xl overflow-hidden h-[240px] lg:h-[288px] group block bg-tribune-card">
                <Image
                  src="https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?q=80&w=2070&auto=format&fit=crop"
                  alt="Blue sports car"
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-700 ease-in-out opacity-80 mix-blend-lighten"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#0E0E0E] to-transparent/20" />

                <div className="absolute bottom-0 left-0 p-6 md:p-8 w-full">
                  <div className="flex items-center gap-3 text-xs font-semibold uppercase tracking-wider mb-3">
                    <span className="bg-zinc-800/80 backdrop-blur-sm px-2.5 py-1 rounded text-white">Life Style</span>
                    <span className="text-zinc-400">Jun 16, 2024</span>
                  </div>
                  <h2 className="text-xl md:text-2xl font-bold tracking-tight leading-snug text-white">
                    The next 7 things to immediately do about car
                  </h2>
                </div>
              </Link>

            </div>
          </div>
        </FadeIn>
      </section>

      {/* 2. Article Grid (3 Columns) */}
      <section className="px-6 w-full max-w-7xl mx-auto">
        <FadeIn delay={300} direction="up">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-6 gap-y-12">

            {/* Card 1 */}
            <Link href="/post/cosmonauts-prep" className="flex flex-col group block">
              <div className="relative w-full aspect-[4/3] rounded-2xl overflow-hidden mb-6 bg-tribune-card">
                <Image
                  src="https://images.unsplash.com/photo-1541185933-ef5d8ed016c2?q=80&w=2070&auto=format&fit=crop"
                  alt="Space astronaut uniform patch"
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-700 ease-in-out opacity-90"
                />
              </div>
              <div className="flex items-center gap-3 text-xs font-semibold uppercase tracking-wider mb-3">
                <span className="bg-[#1A1A1A] px-2.5 py-1 rounded text-zinc-300">Technology</span>
                <span className="text-zinc-500">Jun 16, 2024</span>
              </div>
              <h3 className="text-2xl font-bold tracking-tight text-white group-hover:text-tribune-accent transition-colors leading-snug">
                Cosmonauts prep for spacewalk
              </h3>
            </Link>

            {/* Card 2 */}
            <Link href="/post/iphone-business" className="flex flex-col group block">
              <div className="relative w-full aspect-[4/3] rounded-2xl overflow-hidden mb-6 bg-tribune-card">
                <Image
                  src="https://images.unsplash.com/photo-1596742571253-12948c26ab67?q=80&w=2070&auto=format&fit=crop"
                  alt="Phone presentation"
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-700 ease-in-out opacity-90"
                />
              </div>
              <div className="flex items-center gap-3 text-xs font-semibold uppercase tracking-wider mb-3">
                <span className="bg-[#1A1A1A] px-2.5 py-1 rounded text-zinc-300">Technology</span>
                <span className="text-zinc-500">Jun 16, 2024</span>
              </div>
              <h3 className="text-2xl font-bold tracking-tight text-white group-hover:text-tribune-accent transition-colors leading-snug">
                iPhone is bound to make an impact in your business
              </h3>
            </Link>

            {/* Card 3 */}
            <Link href="/post/embarrassed-by-car-skills" className="flex flex-col group block">
              <div className="relative w-full aspect-[4/3] rounded-2xl overflow-hidden mb-6 bg-tribune-card">
                <Image
                  src="https://images.unsplash.com/photo-1583121274602-3e2820c69888?q=80&w=2070&auto=format&fit=crop"
                  alt="Yellow Porsche"
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-700 ease-in-out opacity-90"
                />
              </div>
              <div className="flex items-center gap-3 text-xs font-semibold uppercase tracking-wider mb-3">
                <span className="bg-[#1A1A1A] px-2.5 py-1 rounded text-zinc-300">Life Style</span>
                <span className="text-zinc-500">Jun 16, 2024</span>
              </div>
              <h3 className="text-2xl font-bold tracking-tight text-white group-hover:text-tribune-accent transition-colors leading-snug">
                Are you embarrassed by your car skills? Here's what to do
              </h3>
            </Link>

            {/* Card 4 */}
            <Link href="/post/approach-photographs" className="flex flex-col group block">
              <div className="relative w-full aspect-[4/3] rounded-2xl overflow-hidden mb-6 bg-tribune-card">
                <Image
                  src="https://images.unsplash.com/photo-1516961642265-531546e84af2?q=80&w=1974&auto=format&fit=crop"
                  alt="Photography neon"
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-700 ease-in-out opacity-90"
                />
              </div>
              <div className="flex items-center gap-3 text-xs font-semibold uppercase tracking-wider mb-3">
                <span className="bg-[#1A1A1A] px-2.5 py-1 rounded text-zinc-300">Photographs</span>
                <span className="text-zinc-500">Jun 16, 2024</span>
              </div>
              <h3 className="text-2xl font-bold tracking-tight text-white group-hover:text-tribune-accent transition-colors leading-snug">
                How 7 things will change the way you approach photographs
              </h3>
            </Link>

            {/* Card 5 */}
            <Link href="/post/professional-animation-courses" className="flex flex-col group block">
              <div className="relative w-full aspect-[4/3] rounded-2xl overflow-hidden mb-6 bg-tribune-card">
                <Image
                  src="https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=1964&auto=format&fit=crop"
                  alt="Abstract art"
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-700 ease-in-out opacity-90"
                />
              </div>
              <div className="flex items-center gap-3 text-xs font-semibold uppercase tracking-wider mb-3">
                <span className="bg-[#1A1A1A] px-2.5 py-1 rounded text-zinc-300">Design</span>
                <span className="text-zinc-500">Jun 16, 2024</span>
              </div>
              <h3 className="text-2xl font-bold tracking-tight text-white group-hover:text-tribune-accent transition-colors leading-snug">
                Online professional animation courses for beginners
              </h3>
            </Link>

            {/* Card 6 */}
            <Link href="/post/commercial-interior-design" className="flex flex-col group block">
              <div className="relative w-full aspect-[4/3] rounded-2xl overflow-hidden mb-6 bg-tribune-card">
                <Image
                  src="https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?q=80&w=1974&auto=format&fit=crop"
                  alt="Interior Design"
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-700 ease-in-out opacity-90"
                />
              </div>
              <div className="flex items-center gap-3 text-xs font-semibold uppercase tracking-wider mb-3">
                <span className="bg-[#1A1A1A] px-2.5 py-1 rounded text-zinc-300">Interior</span>
                <span className="text-zinc-500">Jun 16, 2024</span>
              </div>
              <h3 className="text-2xl font-bold tracking-tight text-white group-hover:text-tribune-accent transition-colors leading-snug">
                10 Top commercial interior design firms to watch
              </h3>
            </Link>

          </div>
        </FadeIn>

        {/* See All Button */}
        <FadeIn delay={500} direction="up">
          <div className="w-full flex justify-center mt-12">
            <button className="bg-tribune-accent hover:bg-blue-600 hover:-translate-y-1 text-white font-semibold py-4 px-10 rounded-xl transition-all duration-300 shadow-lg shadow-blue-500/20 hover:shadow-blue-500/40">
              See All Posts
            </button>
          </div>
        </FadeIn>
      </section>


      {/* 3. CTA Banner */}
      <section className="px-6 w-full max-w-7xl mx-auto mb-10">
        <FadeIn delay={200} direction="up">
          <div className="w-full relative rounded-2xl overflow-hidden h-[360px] md:h-[400px] flex items-center justify-center">

            {/* Abstract background - simulating the marbling effect */}
            <Image
              src="https://images.unsplash.com/photo-1633630650912-3023c72bdf35?q=80&w=2070&auto=format&fit=crop"
              alt="Liquid Marble"
              fill
              className="object-cover opacity-60 mix-blend-color-dodge saturate-200"
            />

            {/* Inner Blue Content Box */}
            <div className="relative z-10 w-[90%] md:w-[600px] bg-tribune-accent p-10 md:p-14 rounded-2xl text-center shadow-2xl backdrop-blur-md">
              <h2 className="text-3xl md:text-5xl font-bold text-white mb-4 tracking-tight">
                Subscribe <span className="font-serif italic font-normal">to</span> Tribune
              </h2>
              <p className="text-blue-100 mb-8 max-w-md mx-auto">
                Sign up to our newsletters and we'll keep you in the loop.
              </p>

              <form className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto" onSubmit={(e) => e.preventDefault()}>
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
            </div>
          </div>
        </FadeIn>
      </section>

    </div >
  );
}
