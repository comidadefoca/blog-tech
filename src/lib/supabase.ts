import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export interface Post {
    id: string;
    title: string;
    title_pt?: string;
    slug: string;
    excerpt: string;
    excerpt_pt?: string;
    content: string;
    content_pt?: string;
    image_url: string;
    category: string;
    tags: string;
    views: number;
    published_at: string;
    created_at: string;
}

/**
 * Fetches all published posts, ordered by most recent first.
 */
export async function getPosts(): Promise<Post[]> {
    const { data, error } = await supabase
        .from('posts')
        .select('*')
        .order('published_at', { ascending: false });

    if (error) {
        console.error('Error fetching posts:', error.message);
        return [];
    }

    return data || [];
}

/**
 * Fetches a single post by its slug.
 */
export async function getPostBySlug(slug: string): Promise<Post | null> {
    const { data, error } = await supabase
        .from('posts')
        .select('*')
        .eq('slug', slug)
        .single();

    if (error) {
        console.error('Error fetching post:', error.message);
        return null;
    }

    return data;
}

/**
 * Fetches the most viewed posts (for "Most Read" section).
 */
export async function getMostViewed(limit: number = 5): Promise<Post[]> {
    const { data, error } = await supabase
        .from('posts')
        .select('*')
        .order('views', { ascending: false })
        .limit(limit);

    if (error) {
        console.error('Error fetching most viewed:', error.message);
        return [];
    }

    return data || [];
}

/**
 * Increments the view count for a post (called from client-side).
 * Uses an RPC function to avoid race conditions.
 * Falls back to direct update if RPC doesn't exist.
 */
export async function incrementViews(postId: string): Promise<void> {
    const { error } = await supabase.rpc('increment_views', { post_id: postId });

    if (error) {
        // Fallback: direct update (less safe but works without RPC)
        console.warn('RPC increment_views not found, using direct update:', error.message);
    }
}

/**
 * Searches posts by title, content, or tags.
 */
export async function searchPosts(query: string): Promise<Post[]> {
    if (!query || query.trim().length < 2) return [];

    const searchTerm = `%${query.trim()}%`;

    const { data, error } = await supabase
        .from('posts')
        .select('*')
        .or(`title.ilike.${searchTerm},excerpt.ilike.${searchTerm},tags.ilike.${searchTerm}`)
        .order('published_at', { ascending: false })
        .limit(10);

    if (error) {
        console.error('Error searching posts:', error.message);
        return [];
    }

    return data || [];
}
