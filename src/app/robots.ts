import type { MetadataRoute } from 'next';

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://aifrontiers.blog';

/**
 * robots.txt configuration — tells search engines what to crawl.
 * Served automatically at /robots.txt by Next.js.
 */
export default function robots(): MetadataRoute.Robots {
    return {
        rules: [
            {
                userAgent: '*',
                allow: '/',
                disallow: ['/api/', '/_next/'],
            },
        ],
        sitemap: `${SITE_URL}/sitemap.xml`,
    };
}
