"use client";

import { useState, useEffect, useCallback, useTransition } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { searchPosts, Post } from "@/lib/supabase";
import { setLanguage } from "@/actions/language";

export default function Navbar({ lang }: { lang: "en" | "pt" }) {
    const router = useRouter();
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [isSearchOpen, setIsSearchOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState("");
    const [searchResults, setSearchResults] = useState<Post[]>([]);
    const [isSearching, setIsSearching] = useState(false);
    const [isPending, startTransition] = useTransition();

    const toggleLang = () => {
        const next = lang === "en" ? "pt" : "en";
        startTransition(async () => {
            await setLanguage(next);
            router.refresh();
        });
    };

    // Debounced search
    const doSearch = useCallback(async (query: string) => {
        if (query.trim().length < 2) {
            setSearchResults([]);
            return;
        }
        setIsSearching(true);
        const results = await searchPosts(query);
        setSearchResults(results);
        setIsSearching(false);
    }, []);

    useEffect(() => {
        const timer = setTimeout(() => doSearch(searchQuery), 300);
        return () => clearTimeout(timer);
    }, [searchQuery, doSearch]);

    // Close search when pressing Escape
    useEffect(() => {
        const handleEsc = (e: KeyboardEvent) => {
            if (e.key === "Escape") {
                setIsSearchOpen(false);
                setSearchQuery("");
                setSearchResults([]);
            }
        };
        window.addEventListener("keydown", handleEsc);
        return () => window.removeEventListener("keydown", handleEsc);
    }, []);

    return (
        <>
            <nav className="w-full z-40 px-6 py-6 bg-tribune-bg border-b border-zinc-800 relative">
                <div className="max-w-7xl mx-auto flex items-center justify-between">

                    {/* Hamburger Menu Toggle */}
                    <button
                        onClick={() => {
                            setIsMenuOpen(!isMenuOpen);
                            setIsSearchOpen(false);
                            setSearchQuery("");
                        }}
                        className="flex items-center gap-2 cursor-pointer group hover:opacity-80 transition-opacity"
                        aria-label="Toggle menu"
                    >
                        <div className="flex flex-col gap-[5px] w-5">
                            <span className={`w-full h-[1.5px] bg-white transition-all duration-300 ${isMenuOpen ? "rotate-45 translate-y-[6.5px]" : ""}`}></span>
                            <span className={`h-[1.5px] bg-white transition-all duration-300 ${isMenuOpen ? "opacity-0" : "w-[80%]"}`}></span>
                            <span className={`w-full h-[1.5px] bg-white transition-all duration-300 ${isMenuOpen ? "-rotate-45 -translate-y-[6.5px]" : ""}`}></span>
                        </div>
                        <span className="text-xs uppercase tracking-widest font-semibold ml-2 text-white">
                            {isMenuOpen ? "Fechar" : "Menu"}
                        </span>
                    </button>

                    {/* Logo */}
                    <Link href="/" className="absolute left-1/2 transform -translate-x-1/2">
                        <span className="font-serif text-4xl font-bold tracking-tight text-white hover:text-gray-200 transition-colors">
                            Lumen<span className="text-tribune-accent">.</span>AI
                        </span>
                    </Link>

                    {/* Search Trigger */}
                    <button
                        onClick={() => {
                            setIsSearchOpen(!isSearchOpen);
                            setIsMenuOpen(false);
                            setTimeout(() => document.getElementById('search-input')?.focus(), 100);
                        }}
                        className="flex items-center gap-2 hover:text-white transition-colors cursor-pointer"
                        aria-label="Search articles"
                    >
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>
                        <span>Busca</span>
                    </button>

                    {/* Language Toggle */}
                    <button
                        onClick={toggleLang}
                        disabled={isPending}
                        className="font-bold px-3 py-1.5 bg-zinc-800 text-zinc-300 rounded-lg hover:bg-zinc-700 transition disabled:opacity-50"
                    >
                        {lang === "en" ? "🇺🇸 EN" : "🇧🇷 PT"}
                    </button>
                </div>
            </nav>

            {/* Full Screen Search Overlay */}
            {isSearchOpen && (
                <div className="fixed inset-0 z-30 bg-tribune-bg/95 backdrop-blur-md pt-32 px-6 flex justify-center animate-in fade-in duration-200">
                    <div className="w-full max-w-3xl">
                        <input
                            type="text"
                            placeholder="Buscar artigos..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full bg-transparent border-b-2 border-zinc-700 text-3xl md:text-5xl text-white outline-none py-4 placeholder-zinc-600 focus:border-tribune-accent transition-colors"
                            autoFocus
                        />

                        {/* Search Results */}
                        {isSearching && (
                            <p className="text-zinc-500 mt-6 text-sm animate-pulse">Buscando...</p>
                        )}

                        {!isSearching && searchResults.length > 0 && (
                            <div className="mt-8 flex flex-col gap-4">
                                <span className="text-xs text-zinc-500 uppercase tracking-widest font-bold">
                                    {searchResults.length} resultado{searchResults.length > 1 ? 's' : ''}
                                </span>
                                {searchResults.map((post) => (
                                    <Link
                                        key={post.id}
                                        href={`/post/${post.slug}`}
                                        onClick={() => { setIsSearchOpen(false); setSearchQuery(""); setSearchResults([]); }}
                                        className="group flex items-center gap-4 py-3 border-b border-zinc-800 hover:border-tribune-accent transition-colors"
                                    >
                                        <div className="flex flex-col gap-1">
                                            {post.category && (
                                                <span className="text-xs uppercase tracking-widest text-tribune-accent font-bold">{(post.category || 'Tech')}</span>
                                            )}
                                            <span className="text-white text-lg font-bold group-hover/result:underline leading-tight">
                                                {post.title_pt && lang === 'pt' ? post.title_pt : post.title}
                                            </span>
                                            {post.excerpt && (
                                                <p className="text-sm text-zinc-500 line-clamp-1">{post.excerpt}</p>
                                            )}
                                        </div>
                                    </Link>
                                ))}
                            </div>
                        )}

                        {!isSearching && searchQuery.length >= 2 && searchResults.length === 0 && (
                            <p className="text-zinc-500 mt-8 text-lg">Nenhum resultado encontrado para &quot;{searchQuery}&quot;</p>
                        )}

                        {/* Category Quick Filters */}
                        {searchQuery.length < 2 && (
                            <div className="mt-8 flex flex-wrap gap-3">
                                <span className="text-sm text-zinc-500 mr-2">Categorias:</span>
                                {["Notícias IA", "Ferramentas", "Tutoriais", "Opinião"].map((cat) => (
                                    <button
                                        key={cat}
                                        onClick={() => setSearchQuery(cat)}
                                        className="text-sm px-3 py-1 rounded-full border border-zinc-700 text-zinc-300 hover:bg-zinc-800 hover:border-tribune-accent transition-all"
                                    >
                                        {cat}
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            )}

            {/* Menu Overlay Panel */}
            {isMenuOpen && (
                <div className="absolute top-[85px] left-0 w-full z-30 bg-tribune-bg border-b border-zinc-800 shadow-2xl animate-in slide-in-from-top-2 duration-200">
                    <div className="max-w-7xl mx-auto px-6 py-12 grid grid-cols-1 md:grid-cols-3 gap-12">
                        <div>
                            <h3 className="text-xs uppercase tracking-widest text-zinc-500 font-bold mb-6">Categorias</h3>
                            <div className="flex flex-col gap-4 text-2xl font-serif text-white">
                                <Link href="#" onClick={() => setIsMenuOpen(false)} className="hover:text-tribune-accent transition-colors">Notícias IA</Link>
                                <Link href="#" onClick={() => setIsMenuOpen(false)} className="hover:text-tribune-accent transition-colors">Ferramentas IA</Link>
                                <Link href="#" onClick={() => setIsMenuOpen(false)} className="hover:text-tribune-accent transition-colors">Tutoriais</Link>
                                <Link href="#" onClick={() => setIsMenuOpen(false)} className="hover:text-tribune-accent transition-colors">Tendências</Link>
                                <Link href="#" onClick={() => setIsMenuOpen(false)} className="hover:text-tribune-accent transition-colors">Opinião</Link>
                            </div>
                        </div>
                        <div>
                            <h3 className="text-xs uppercase tracking-widest text-zinc-500 font-bold mb-6">Sobre</h3>
                            <p className="text-zinc-400 text-sm leading-relaxed mb-6">
                                Lumen AI é o blog que transforma temas complexos de Inteligência Artificial em conhecimento claro e acessível. Profundidade sem intimidar. Clareza sem trivializar.
                            </p>
                            <Link href="/contact" onClick={() => setIsMenuOpen(false)} className="text-sm font-bold text-white border-b border-white hover:text-tribune-accent hover:border-tribune-accent transition-colors pb-1">
                                Saiba mais sobre nós
                            </Link>
                        </div>
                        <div>
                            <h3 className="text-xs uppercase tracking-widest text-zinc-500 font-bold mb-6">Siga-nos</h3>
                            <div className="flex flex-col gap-4 text-sm font-medium text-zinc-300">
                                <a href="#" className="hover:text-white transition-colors flex items-center gap-3">
                                    <span className="w-1.5 h-1.5 rounded-full bg-blue-500"></span> LinkedIn
                                </a>
                                <a href="#" className="hover:text-white transition-colors flex items-center gap-3">
                                    <span className="w-1.5 h-1.5 rounded-full bg-sky-400"></span> Twitter / X
                                </a>
                                <a href="#" className="hover:text-white transition-colors flex items-center gap-3">
                                    <span className="w-1.5 h-1.5 rounded-full bg-pink-500"></span> Instagram
                                </a>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}
