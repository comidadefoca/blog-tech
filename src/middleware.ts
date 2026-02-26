import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

/**
 * Middleware that auto-detects the browser's preferred language
 * on the very first visit (when no NEXT_LOCALE cookie exists yet).
 */
export function middleware(request: NextRequest) {
    const cookie = request.cookies.get("NEXT_LOCALE");

    // If the user already has a preference, do nothing
    if (cookie) return NextResponse.next();

    // Read the browser's Accept-Language header
    const acceptLang = request.headers.get("accept-language") || "";
    const prefersPt = acceptLang.toLowerCase().startsWith("pt");

    const lang = prefersPt ? "pt" : "en";

    const response = NextResponse.next();
    response.cookies.set("NEXT_LOCALE", lang, {
        path: "/",
        maxAge: 60 * 60 * 24 * 365, // 1 year
    });

    return response;
}

// Only run on page requests, not on static assets
export const config = {
    matcher: [
        "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico)$).*)",
    ],
};
