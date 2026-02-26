"use client";

import { useState } from "react";
import Link from "next/link";

export default function Navbar() {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [isSearchOpen, setIsSearchOpen] = useState(false);

    return (
        <>
            <nav className="w-full z-40 px-6 py-6 bg-tribune-bg border-b border-zinc-800 relative">
                <div className="max-w-7xl mx-auto flex items-center justify-between">

                    {/* Hamburger Menu Toggle */}
                    <button
                        onClick={() => {
                            setIsMenuOpen(!isMenuOpen);
                            setIsSearchOpen(false);
                        }}
                        className="flex items-center gap-2 cursor-pointer group hover:opacity-80 transition-opacity"
                        aria-label="Toggle menu"
                    >
                        <div className="flex flex-col gap-[5px] w-5">
                            <span className={`w-full h-[1.5px] bg-white transition-all ${isMenuOpen ? "rotate-45 translate-y-[6.5px]" : ""}`}></span>
                            <span className={`h-[1.5px] bg-white transition-all ${isMenuOpen ? "opacity-0" : "w-[80%]"}`}></span>
                            <span className={`w-full h-[1.5px] bg-white transition-all ${isMenuOpen ? "-rotate-45 -translate-y-[6.5px]" : ""}`}></span>
                        </div>
                        <span className="text-xs uppercase tracking-widest font-semibold ml-2 text-white">
                            {isMenuOpen ? "Fechar" : "Menu"}
                        </span>
                    </button>

                    {/* Logo */}
                    <Link href="/" className="absolute left-1/2 transform -translate-x-1/2">
                        <span className="font-serif text-4xl font-bold tracking-tight text-white hover:text-gray-200 transition-colors">
                            Lumen<span className="text-tribune-accent font-normal">.AI</span>
                        </span>
                    </Link>

                    {/* Search Toggle */}
                    <button
                        onClick={() => {
                            setIsSearchOpen(!isSearchOpen);
                            setIsMenuOpen(false);
                        }}
                        className="flex items-center gap-2 cursor-pointer hover:text-tribune-accent transition-colors text-white"
                        aria-label="Toggle search"
                    >
                        <span className="text-xs uppercase tracking-widest font-semibold mr-2 hidden md:block">
                            {isSearchOpen ? "Fechar" : "Buscar"}
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
                </div>
            </nav>

            {/* Full Screen Search Overlay */}
            {isSearchOpen && (
                <div className="fixed inset-0 z-30 bg-tribune-bg/95 backdrop-blur-md pt-32 px-6 flex justify-center animate-in fade-in duration-200">
                    <div className="w-full max-w-3xl">
                        <input
                            type="text"
                            placeholder="Buscar artigos..."
                            className="w-full bg-transparent border-b-2 border-zinc-700 text-3xl md:text-5xl text-white outline-none py-4 placeholder-zinc-600 focus:border-tribune-accent transition-colors"
                            autoFocus
                        />
                        <div className="mt-8 flex flex-wrap gap-3">
                            <span className="text-sm text-zinc-500 mr-2">Populares:</span>
                            <button className="text-sm px-3 py-1 rounded-full border border-zinc-700 text-zinc-300 hover:bg-zinc-800">Notícias IA</button>
                            <button className="text-sm px-3 py-1 rounded-full border border-zinc-700 text-zinc-300 hover:bg-zinc-800">Ferramentas</button>
                            <button className="text-sm px-3 py-1 rounded-full border border-zinc-700 text-zinc-300 hover:bg-zinc-800">Tutoriais</button>
                        </div>
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
                                <Link href="#" className="hover:text-tribune-accent transition-colors">Notícias IA</Link>
                                <Link href="#" className="hover:text-tribune-accent transition-colors">Ferramentas IA</Link>
                                <Link href="#" className="hover:text-tribune-accent transition-colors">Tutoriais</Link>
                                <Link href="#" className="hover:text-tribune-accent transition-colors">Tendências</Link>
                                <Link href="#" className="hover:text-tribune-accent transition-colors">Opinião</Link>
                            </div>
                        </div>
                        <div>
                            <h3 className="text-xs uppercase tracking-widest text-zinc-500 font-bold mb-6">Sobre</h3>
                            <p className="text-zinc-400 text-sm leading-relaxed mb-6">
                                Lumen AI é o blog que transforma temas complexos de Inteligência Artificial em conhecimento claro e acessível. Profundidade sem intimidar. Clareza sem trivializar.
                            </p>
                            <Link href="/contact" className="text-sm font-bold text-white border-b border-white hover:text-tribune-accent hover:border-tribune-accent transition-colors pb-1">
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
