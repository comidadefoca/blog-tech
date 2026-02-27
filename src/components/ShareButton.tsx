"use client";

import { useState } from "react";

interface ShareButtonProps {
    title: string;
    url: string;
    lang: "en" | "pt";
}

export default function ShareButton({ title, url, lang }: ShareButtonProps) {
    const [copied, setCopied] = useState(false);

    const labels = {
        en: { share: "Share", copied: "Link copied!", copyLink: "Copy link" },
        pt: { share: "Compartilhar", copied: "Link copiado!", copyLink: "Copiar link" },
    };

    const l = labels[lang];

    async function handleCopyLink() {
        try {
            await navigator.clipboard.writeText(url);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        } catch {
            // Fallback for older browsers
            const input = document.createElement("input");
            input.value = url;
            document.body.appendChild(input);
            input.select();
            document.execCommand("copy");
            document.body.removeChild(input);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        }
    }

    async function handleNativeShare() {
        if (navigator.share) {
            try {
                await navigator.share({ title, url });
            } catch {
                // User cancelled share — do nothing
            }
        } else {
            handleCopyLink();
        }
    }

    return (
        <div className="flex items-center gap-2">
            {/* Copy Link Button */}
            <button
                onClick={handleCopyLink}
                className={`inline-flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${copied
                        ? "bg-green-500/20 text-green-400 border border-green-500/30"
                        : "bg-zinc-800 text-zinc-300 border border-zinc-700 hover:bg-zinc-700 hover:text-white"
                    }`}
            >
                {copied ? (
                    <>
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                        </svg>
                        {l.copied}
                    </>
                ) : (
                    <>
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="1.5">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M13.19 8.688a4.5 4.5 0 011.242 7.244l-4.5 4.5a4.5 4.5 0 01-6.364-6.364l1.757-1.757m9.86-3.18a4.5 4.5 0 00-1.242-7.244l4.5-4.5a4.5 4.5 0 016.364 6.364l-1.757 1.757" />
                        </svg>
                        {l.copyLink}
                    </>
                )}
            </button>

            {/* Native Share Button (mobile) */}
            <button
                onClick={handleNativeShare}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium bg-tribune-accent text-white hover:bg-tribune-accent/90 transition-colors"
            >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="1.5">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M7.217 10.907a2.25 2.25 0 100 2.186m0-2.186c.18.324.283.696.283 1.093s-.103.77-.283 1.093m0-2.186l9.566-5.314m-9.566 7.5l9.566 5.314m0 0a2.25 2.25 0 103.935 2.186 2.25 2.25 0 00-3.935-2.186zm0-12.814a2.25 2.25 0 103.933-2.185 2.25 2.25 0 00-3.933 2.185z" />
                </svg>
                {l.share}
            </button>
        </div>
    );
}
