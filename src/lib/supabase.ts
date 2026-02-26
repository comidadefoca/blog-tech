import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export interface Post {
    id: string;
    title: string;
    slug: string;
    excerpt: string;
    content: string;
    image_url: string;
    tags: string;
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
