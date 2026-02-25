import type { Metadata } from "next";
import { Inter, Playfair_Display } from "next/font/google";
import Navbar from "@/components/Navbar";
import Link from "next/link";
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
  title: "Tribune.Blog | Editorial & Magazine",
  description: "Multipurpose blog, magazine, and portfolio template.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="scroll-smooth">
      <body className={`${inter.variable} ${playfair.variable} font-sans antialiased min-h-screen flex flex-col bg-tribune-bg text-tribune-text relative overflow-x-hidden`}>

        {/* Interactive Navigation Bar */}
        <Navbar />

        {/* Main Content */}
        <main className="flex-grow pt-8 pb-16">
          {children}
        </main>

        {/* Tribune Footer */}
        <footer className="w-full border-t border-zinc-800 bg-tribune-bg pb-8 pt-12 px-6 mt-auto">
          <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-start md:items-center gap-10">
            {/* Logo & Info */}
            <div className="flex flex-col md:flex-row items-center gap-6">
              <a href="/">
                <span className="font-serif text-3xl font-bold tracking-tight text-white">Tribune<span className="text-zinc-500 font-normal">.Blog</span></span>
              </a>
              <div className="flex items-center gap-4 text-sm text-zinc-500">
                <span>Powered by Next.js</span>
                <span className="w-1 h-1 rounded-full bg-zinc-700"></span>
                <span>Made for UI Rebuild</span>
              </div>
            </div>

            {/* Footer Links */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-x-12 gap-y-4 text-sm font-medium text-tribune-text">
              <Link href="/contact" className="hover:text-white transition-colors">Contact</Link>
              <Link href="/privacy" className="hover:text-white transition-colors">Privacy Policy</Link>
              <a href="#" className="hover:text-white transition-colors">Facebook</a>
              <a href="#" className="hover:text-white transition-colors">Twitter</a>
              <a href="#" className="hover:text-white transition-colors">YouTube</a>
              <a href="#" className="hover:text-white transition-colors">Style Guide</a>
              <a href="#" className="hover:text-white transition-colors">Licensing</a>
              <a href="#" className="hover:text-white transition-colors">Changelog</a>
            </div>
          </div>
        </footer>
      </body>
    </html>
  );
}
