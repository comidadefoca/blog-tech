import { getPosts } from '@/lib/supabase';
import type { MetadataRoute } from 'next';

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://aifrontiers.blog';

/**
 * Auto-generated sitemap from all Supabase posts.
 * Google discovers this at /sitemap.xml automatically via Next.js convention.
 */
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
    const posts = await getPosts();

    const postUrls = posts.map((post) => ({
        url: `${SITE_URL}/post/${post.slug}`,
        lastModified: new Date(post.published_at),
        changeFrequency: 'weekly' as const,
        priority: 0.8,
    }));

    return [
        {
            url: SITE_URL,
            lastModified: new Date(),
            changeFrequency: 'daily',
            priority: 1,
        },
        {
            url: `${SITE_URL}/archive`,
            lastModified: new Date(),
            changeFrequency: 'daily',
            priority: 0.7,
        },
        {
            url: `${SITE_URL}/contact`,
            lastModified: new Date(),
            changeFrequency: 'monthly',
            priority: 0.3,
        },
        {
            url: `${SITE_URL}/privacy`,
            lastModified: new Date(),
            changeFrequency: 'yearly',
            priority: 0.1,
        },
        ...postUrls,
    ];
}
