import type { Metadata } from "next";
import { Inter, Playfair_Display } from "next/font/google";
import Navbar from "@/components/Navbar";
import Link from "next/link";
import { Analytics } from "@vercel/analytics/react";
import { cookies } from "next/headers";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

const playfair = Playfair_Display({
  variable: "--font-playfair",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Lumen AI — Clareza no que importa",
  description: "Blog de Inteligência Artificial e Tecnologia. Temas complexos explicados com clareza, profundidade e estética premium.",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const cookieStore = await cookies();
  const lang = (cookieStore.get("NEXT_LOCALE")?.value || "en") as "en" | "pt";

  return (
    <html lang={lang} className="scroll-smooth">
      <body className={`${inter.variable} ${playfair.variable} font-sans antialiased min-h-screen flex flex-col bg-tribune-bg text-tribune-text relative overflow-x-hidden`}>

        {/* Interactive Navigation Bar */}
        <Navbar lang={lang} />

        {/* Main Content */}
        <main className="flex-grow pt-8 pb-16">
          {children}
        </main>

        {/* Lumen AI Footer */}
        <footer className="w-full border-t border-zinc-800 bg-tribune-bg pb-8 pt-12 px-6 mt-auto">
          <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-start md:items-center gap-10">
            {/* Logo & Info */}
            <div className="flex flex-col md:flex-row items-center gap-6">
              <a href="/">
                <span className="font-serif text-3xl font-bold tracking-tight text-white">Lumen<span className="text-tribune-accent">.</span>AI</span>
              </a>
              <div className="flex items-center gap-4 text-sm text-zinc-500">
                <span>{lang === 'pt' ? 'Clareza no que importa' : 'Clarity where it matters'}</span>
              </div>
            </div>

            {/* Footer Links */}
            <div className="grid grid-cols-2 md:grid-cols-3 gap-x-12 gap-y-4 text-sm font-medium text-tribune-text">
              <Link href="/archive" className="hover:text-white transition-colors">{lang === 'pt' ? 'Arquivo' : 'Archive'}</Link>
              <Link href="/contact" className="hover:text-white transition-colors">{lang === 'pt' ? 'Contato' : 'Contact'}</Link>
              <Link href="/privacy" className="hover:text-white transition-colors">{lang === 'pt' ? 'Privacidade' : 'Privacy'}</Link>
            </div>
          </div>
        </footer>

        <Analytics />
      </body>
    </html>
  );
}
