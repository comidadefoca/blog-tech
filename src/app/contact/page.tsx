import FadeIn from "@/components/FadeIn";
import Link from "next/link";

export default function ContactPage() {
    return (
        <div className="w-full flex flex-col pt-10 pb-24 px-6 max-w-4xl mx-auto min-h-[60vh]">
            <FadeIn delay={100} direction="up">
                {/* Header Section */}
                <div className="mb-12 border-b border-zinc-800 pb-12">
                    <h1 className="font-serif text-5xl md:text-7xl font-bold tracking-tight text-white mb-6">
                        Get in touch
                    </h1>
                    <p className="text-xl md:text-2xl text-zinc-400 font-medium font-serif leading-relaxed">
                        We'd love to hear from you. Whether you have a question about our articles, want to collaborate, or simply want to say hello.
                    </p>
                </div>

                {/* Contact Information */}
                <div className="flex flex-col md:flex-row gap-12 md:gap-24">
                    <div className="flex flex-col gap-4">
                        <h3 className="text-sm font-bold uppercase tracking-widest text-zinc-500">General Inquiries</h3>
                        <a href="mailto:hello@tribuneblog.com" className="text-2xl md:text-3xl font-bold text-white hover:text-tribune-accent transition-colors">
                            hello@tribuneblog.com
                        </a>
                    </div>

                    <div className="flex flex-col gap-4">
                        <h3 className="text-sm font-bold uppercase tracking-widest text-zinc-500">Press & Media</h3>
                        <a href="mailto:press@tribuneblog.com" className="text-2xl md:text-3xl font-bold text-white hover:text-tribune-accent transition-colors">
                            press@tribuneblog.com
                        </a>
                    </div>
                </div>

                <div className="mt-20 pt-12 border-t border-zinc-800">
                    <p className="text-zinc-500 mb-6">Alternatively, you can find us on our social networks:</p>
                    <div className="flex gap-6">
                        <a href="#" className="w-12 h-12 rounded-full border border-zinc-700 flex items-center justify-center text-zinc-400 hover:bg-tribune-accent hover:text-white hover:border-tribune-accent transition-colors">
                            <span className="sr-only">Twitter</span>
                            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true"><path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84"></path></svg>
                        </a>
                        <a href="#" className="w-12 h-12 rounded-full border border-zinc-700 flex items-center justify-center text-zinc-400 hover:bg-tribune-accent hover:text-white hover:border-tribune-accent transition-colors">
                            <span className="sr-only">LinkedIn</span>
                            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true"><path fillRule="evenodd" d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" clipRule="evenodd"></path></svg>
                        </a>
                    </div>
                </div>
            </FadeIn>
        </div>
    );
}
