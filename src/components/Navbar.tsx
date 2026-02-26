"use client";

import { useState, useEffect, useCallback, useTransition } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { searchPosts, Post } from "@/lib/supabase";
import { setLanguage } from "@/actions/language";
import { t, type Lang } from "@/lib/i18n";

const CATEGORIES = ["Notícias IA", "Ferramentas IA", "Tutoriais", "Opinião"];

export default function Navbar({ lang }: { lang: Lang }) {
    const router = useRouter();
    const dict = t(lang);
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

                    {/* Left: Hamburger Menu Toggle */}
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
                            {isMenuOpen ? dict.close : dict.menu}
                        </span>
                    </button>

                    {/* Center: Logo */}
                    <Link href="/" className="absolute left-1/2 transform -translate-x-1/2">
                        <span className="font-serif text-4xl font-bold tracking-tight text-white hover:text-gray-200 transition-colors">
                            Lumen<span className="text-tribune-accent">.</span>AI
                        </span>
                    </Link>

                    {/* Right: Search + Language Toggle */}
                    <div className="flex items-center gap-3">
                        {/* Search Trigger */}
                        <button
                            onClick={() => {
                                setIsSearchOpen(!isSearchOpen);
                                setIsMenuOpen(false);
                                if (isSearchOpen) {
                                    setSearchQuery("");
                                    setSearchResults([]);
                                }
                                setTimeout(() => document.getElementById('search-input')?.focus(), 100);
                            }}
                            className="flex items-center gap-2 cursor-pointer hover:text-tribune-accent transition-colors text-white"
                            aria-label="Toggle search"
                        >
                            <span className="text-xs uppercase tracking-widest font-semibold hidden md:block">
                                {isSearchOpen ? dict.close : dict.search}
                            </span>
                            {isSearchOpen ? (
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                    <line x1="18" y1="6" x2="6" y2="18"></line>
                                    <line x1="6" y1="6" x2="18" y2="18"></line>
                                </svg>
                            ) : (
                                <svg className="w-5 h-5" stroke="currentColor" fill="none" strokeWidth="2" viewBox="0 0 24 24" strokeLinecap="round" strokeLinejoin="round">
                                    <circle cx="11" cy="11" r="8"></circle>
                                    <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
                                </svg>
                            )}
                        </button>

                        {/* Language Toggle */}
                        <button
                            onClick={toggleLang}
                            disabled={isPending}
                            className="text-xs font-bold px-2.5 py-1.5 bg-zinc-800 text-zinc-300 rounded-lg hover:bg-zinc-700 transition disabled:opacity-50 cursor-pointer"
                        >
                            {lang === "en" ? "🇺🇸 EN" : "🇧🇷 PT"}
                        </button>
                    </div>
                </div>
            </nav>

            {/* Full Screen Search Overlay */}
            {isSearchOpen && (
                <div className="fixed inset-0 z-30 bg-tribune-bg/95 backdrop-blur-md pt-32 px-6 flex justify-center animate-in fade-in duration-200">
                    <div className="w-full max-w-3xl flex flex-col max-h-[calc(100vh-8rem)]">
                        <input
                            id="search-input"
                            type="text"
                            placeholder={dict.searchPlaceholder}
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full bg-transparent border-b-2 border-zinc-700 text-3xl md:text-5xl text-white outline-none py-4 placeholder-zinc-600 focus:border-tribune-accent transition-colors shrink-0"
                            autoFocus
                        />

                        {/* Scrollable results area */}
                        <div className="overflow-y-auto flex-1 mt-4">
                            {/* Search Results */}
                            {isSearching && (
                                <p className="text-zinc-500 mt-6 text-sm animate-pulse">{dict.searching}</p>
                            )}

                            {!isSearching && searchResults.length > 0 && (
                                <div className="mt-4 flex flex-col gap-4">
                                    <span className="text-xs text-zinc-500 uppercase tracking-widest font-bold">
                                        {searchResults.length} {searchResults.length > 1 ? dict.resultsPlural : dict.results}
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
                                                    <span className="text-xs uppercase tracking-widest text-tribune-accent font-bold">{post.category}</span>
                                                )}
                                                <span className="text-white text-lg font-bold group-hover:underline leading-tight">
                                                    {post.title_pt && lang === 'pt' ? post.title_pt : post.title}
                                                </span>
                                                {post.excerpt && (
                                                    <p className="text-sm text-zinc-500 line-clamp-1">
                                                        {post.excerpt_pt && lang === 'pt' ? post.excerpt_pt : post.excerpt}
                                                    </p>
                                                )}
                                            </div>
                                        </Link>
                                    ))}
                                </div>
                            )}

                            {!isSearching && searchQuery.length >= 2 && searchResults.length === 0 && (
                                <p className="text-zinc-500 mt-8 text-lg">{dict.noResults} &quot;{searchQuery}&quot;</p>
                            )}

                            {/* Category Quick Filters */}
                            {searchQuery.length < 2 && (
                                <div className="mt-8 flex flex-wrap gap-3">
                                    <span className="text-sm text-zinc-500 mr-2">{dict.categories}:</span>
                                    {CATEGORIES.map((cat) => (
                                        <button
                                            key={cat}
                                            onClick={() => setSearchQuery(cat)}
                                            className="text-sm px-3 py-1 rounded-full border border-zinc-700 text-zinc-300 hover:bg-zinc-800 hover:border-tribune-accent transition-all cursor-pointer"
                                        >
                                            {cat}
                                        </button>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            )}

            {/* Menu Overlay Panel */}
            {isMenuOpen && (
                <div className="absolute top-[85px] left-0 w-full z-30 bg-tribune-bg border-b border-zinc-800 shadow-2xl animate-in slide-in-from-top-2 duration-200">
                    <div className="max-w-7xl mx-auto px-6 py-12 grid grid-cols-1 md:grid-cols-2 gap-12">
                        {/* Categories */}
                        <div>
                            <h3 className="text-xs uppercase tracking-widest text-zinc-500 font-bold mb-6">{dict.categories}</h3>
                            <div className="flex flex-col gap-4 text-2xl font-serif text-white">
                                {CATEGORIES.map((cat) => (
                                    <button
                                        key={cat}
                                        onClick={() => {
                                            setIsMenuOpen(false);
                                            setIsSearchOpen(true);
                                            setSearchQuery(cat);
                                        }}
                                        className="text-left hover:text-tribune-accent transition-colors cursor-pointer"
                                    >
                                        {cat}
                                    </button>
                                ))}
                            </div>
                        </div>
                        {/* About + Links */}
                        <div>
                            <h3 className="text-xs uppercase tracking-widest text-zinc-500 font-bold mb-6">{dict.about}</h3>
                            <p className="text-zinc-400 text-sm leading-relaxed mb-6">
                                {dict.aboutText}
                            </p>
                            <div className="flex flex-col gap-3">
                                <Link href="/contact" onClick={() => setIsMenuOpen(false)} className="text-sm font-bold text-white border-b border-white hover:text-tribune-accent hover:border-tribune-accent transition-colors pb-1 w-fit">
                                    {dict.learnMore}
                                </Link>
                                <Link href="/archive" onClick={() => setIsMenuOpen(false)} className="text-sm font-bold text-white border-b border-white hover:text-tribune-accent hover:border-tribune-accent transition-colors pb-1 w-fit">
                                    {dict.archive}
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}
