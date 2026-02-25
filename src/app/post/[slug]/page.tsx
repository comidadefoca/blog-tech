import Image from "next/image";
import Link from "next/link";
import FadeIn from "@/components/FadeIn";
import { notFound } from "next/navigation";

export default async function BlogPostPage({
    params,
}: {
    params: Promise<{ slug: string }>;
}) {
    const { slug } = await params;

    if (!slug) {
        notFound();
    }

    // Simulated article data based on the Tribune layout
    return (
        <div className="w-full flex flex-col pt-4 pb-16">

            {/* 1. Article Header & Hero Image */}
            <section className="px-6 w-full max-w-7xl mx-auto mb-16">
                <FadeIn delay={100} direction="up">
                    <div className="flex flex-col items-center text-center max-w-4xl mx-auto mb-10 mt-6">
                        <div className="flex items-center gap-3 text-xs font-semibold uppercase tracking-wider mb-6">
                            <span className="bg-zinc-800 px-3 py-1.5 rounded text-zinc-300">Design</span>
                            <span className="text-zinc-500">Jun 16, 2024</span>
                        </div>

                        <h1 className="font-serif text-4xl md:text-5xl lg:text-7xl font-bold tracking-tight text-white mb-6 leading-[1.1]">
                            Brilliant documentaries and books about animation
                        </h1>
                        <p className="text-xl md:text-2xl text-zinc-400 font-medium">
                            Viverra in ultrices quam urna, massa nunc. Enim magna sed consequat et porttitor tortor quisque egestas odio.
                        </p>
                    </div>

                    <div className="w-full relative rounded-2xl md:rounded-[32px] overflow-hidden h-[400px] md:h-[600px] lg:h-[700px]">
                        <Image
                            src="https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=2064&auto=format&fit=crop"
                            alt="Featured Article Background"
                            fill
                            className="object-cover"
                            priority
                        />
                    </div>
                </FadeIn>
            </section>

            {/* 2. Main Article Content Grid */}
            <section className="px-6 w-full max-w-7xl mx-auto flex flex-col lg:flex-row gap-12 lg:gap-20">
                <FadeIn delay={300} direction="up" className="w-full flex flex-col lg:flex-row gap-12 lg:gap-20">
                    {/* Left Column: Article Text */}
                    <article className="w-full lg:w-2/3 max-w-none">

                        <p className="text-xl md:text-2xl leading-relaxed text-zinc-300 font-serif mb-10">
                            Magna diam eget odio ac dictumst tellus rhoncus. Auctor sagittis laoreet potenti elementum facilisis magnis lectus. Ornare mauris blandit elit ut gravida nunc pellentesque. Lectus enim ornare in euismod hendrerit eget elit eget proin.
                        </p>

                        <div className="prose prose-lg prose-invert max-w-none text-zinc-400 prose-headings:font-serif prose-headings:text-white prose-a:text-tribune-accent prose-a:no-underline hover:prose-a:underline">
                            <h3 className="text-2xl font-bold mt-12 mb-6 text-white font-sans">Enim pharetra commodo dictum</h3>
                            <p className="mb-6">
                                Nibh purus massa neque diam feugiat sollicitudin. Aliquam imperdiet justo amet sed ullamcorper. Ipsum, dignissim enim non, luctus pellentesque eget. Euismod vulputate commodo molestie consequat velit. Neque, sagittis, bibendum sed eleifend.
                            </p>
                            <p className="mb-10">
                                Mus faucibus mi lorem consectetur. Dui, aliquam in eget sem et fusce semper. Sed elementum sit lobortis hendrerit vel. Mauris dignissim consequat aliquet sed egestas consequat. Risus congue urna vulputate sed lorem fringilla molestie. Mauris platea amet ultricies ultrices felis ut fringilla. A hac id id aenean sit vivamus. Nibh sem mauris lectus pharetra volutpat non sed a. Vitae, vestibulum, facilisis nulla morbi. Metus non aenean.
                            </p>

                            <blockquote className="border-l-[3px] border-tribune-accent pl-6 py-2 my-12">
                                <p className="text-2xl md:text-3xl font-serif font-medium text-white leading-snug italic m-0">
                                    "In a world older and more complete than ours they move finished and complete, gifted with extensions of the senses we have lost or never attained, living by voices we shall never hear."
                                </p>
                            </blockquote>

                            <h3 className="text-2xl font-bold mt-12 mb-6 text-white font-sans">Sagittis lacus vitae cursus purus quis</h3>
                            <p className="mb-6">
                                Congue eu tellus et viverra purus bibendum. Porttitor eget tellus risus nisi netus. Donec sed lobortis dolor, fusce egestas facilisis. Adipiscing in turpis facilisi sit. Massa proin ultrices sed consectetur tincidunt pellentesque tincidunt enim.
                            </p>

                            <ul className="list-disc pl-6 space-y-3 mb-10 text-zinc-300">
                                <li>Sit nibh adipiscing tellus eget vestibulum nunc duis.</li>
                                <li>Leo aliquam at feugiat nunc morbi lectus.</li>
                                <li>Ultrices dictum elit, sapien, elit. Lacinia leo libero varius.</li>
                                <li>Mauris, enim nisl varius cursus varius felis.</li>
                            </ul>

                            <h3 className="text-2xl font-bold mt-12 mb-6 text-white font-sans">Natoque nulla tempor leo dignissim</h3>
                            <p className="mb-6">
                                Proin facilisi arcu ultrices scelerisque fringilla nec ac. Viverra ligula gravida urna, nunc auctor. Vel suspendisse mi phasellus malesuada. Cursus turpis sem nulla convallis dictum maecenas morbi. Morbi adipiscing luctus ultrices cursus amet tempor sed tristique vivamus.
                            </p>
                        </div>

                        <div className="flex gap-3 mt-12 pt-8 border-t border-zinc-800">
                            <span className="text-xs uppercase tracking-widest text-zinc-500 font-bold flex items-center mr-2">Tags</span>
                            <span className="bg-zinc-900 px-3 py-1.5 rounded-lg text-sm text-zinc-300 cursor-pointer hover:bg-zinc-800 transition-colors">Design</span>
                            <span className="bg-zinc-900 px-3 py-1.5 rounded-lg text-sm text-zinc-300 cursor-pointer hover:bg-zinc-800 transition-colors">Books</span>
                            <span className="bg-zinc-900 px-3 py-1.5 rounded-lg text-sm text-zinc-300 cursor-pointer hover:bg-zinc-800 transition-colors">Animation</span>
                        </div>

                    </article>

                    <aside className="w-full lg:w-1/3 flex flex-col gap-10">

                        {/* Related Articles Stack */}
                        <div>
                            <h4 className="text-xs font-bold uppercase tracking-widest text-zinc-500 mb-6">Latest in Design</h4>
                            <div className="flex flex-col gap-6">
                                <Link href="#" className="group flex gap-4">
                                    <div className="w-20 h-20 rounded-xl overflow-hidden relative shrink-0 bg-zinc-800">
                                        <Image src="https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?q=80&w=200&auto=format&fit=crop" alt="Thumb" fill className="object-cover group-hover:scale-110 transition-transform duration-500" />
                                    </div>
                                    <div className="flex flex-col justify-center gap-1.5">
                                        <span className="text-xs text-tribune-accent font-semibold">Interior</span>
                                        <h5 className="text-sm font-bold text-white leading-snug group-hover:text-zinc-300 transition-colors">
                                            10 Top commercial interior design firms to watch
                                        </h5>
                                    </div>
                                </Link>

                                <Link href="#" className="group flex gap-4">
                                    <div className="w-20 h-20 rounded-xl overflow-hidden relative shrink-0 bg-zinc-800">
                                        <Image src="https://images.unsplash.com/photo-1516961642265-531546e84af2?q=80&w=200&auto=format&fit=crop" alt="Thumb" fill className="object-cover group-hover:scale-110 transition-transform duration-500" />
                                    </div>
                                    <div className="flex flex-col justify-center gap-1.5">
                                        <span className="text-xs text-tribune-accent font-semibold">Photographs</span>
                                        <h5 className="text-sm font-bold text-white leading-snug group-hover:text-zinc-300 transition-colors">
                                            How 7 things will change the way you approach photographs
                                        </h5>
                                    </div>
                                </Link>
                            </div>
                        </div>

                    </aside>
                </FadeIn>
            </section>

        </div>
    );
}
