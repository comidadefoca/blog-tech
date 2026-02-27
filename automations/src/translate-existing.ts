/**
 * One-off script to translate existing English posts to Portuguese.
 * Run with: npx ts-node src/translate-existing.ts
 */
import { createClient } from '@supabase/supabase-js';
import OpenAI from 'openai';
import dotenv from 'dotenv';
dotenv.config();

const supabase = createClient(
    process.env.SUPABASE_URL || '',
    process.env.SUPABASE_SERVICE_ROLE_KEY || ''
);

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

interface Post {
    id: string;
    title: string;
    excerpt: string;
    content: string;
    title_pt: string | null;
    content_pt: string | null;
    excerpt_pt: string | null;
}

async function translatePost(post: Post): Promise<{ title_pt: string; excerpt_pt: string; content_pt: string }> {
    console.log(`  Translating: "${post.title}"...`);

    const response = await openai.chat.completions.create({
        model: 'gpt-4o-mini',
        temperature: 0.5,
        response_format: { type: 'json_object' },
        messages: [
            {
                role: 'system',
                content: `You are a professional translator specializing in technology content. Translate the following blog post from English to Brazilian Portuguese. 
                
Rules:
- Keep the same markdown formatting
- Maintain technical terms in English when appropriate (e.g., "machine learning", "deep learning", "API")
- The translation should feel natural and native, not like a machine translation
- Keep the same tone: informative yet engaging

Return a JSON object with exactly these fields:
{
    "title_pt": "translated title",
    "excerpt_pt": "translated excerpt",
    "content_pt": "translated full markdown content"
}`
            },
            {
                role: 'user',
                content: `Title: ${post.title}\n\nExcerpt: ${post.excerpt}\n\nContent:\n${post.content}`
            }
        ]
    });

    const raw = response.choices[0].message.content || '{}';
    const parsed = JSON.parse(raw);

    return {
        title_pt: parsed.title_pt || post.title,
        excerpt_pt: parsed.excerpt_pt || post.excerpt,
        content_pt: parsed.content_pt || post.content,
    };
}

async function main() {
    console.log('🔍 Fetching posts without Portuguese translations...\n');

    const { data: posts, error } = await supabase
        .from('posts')
        .select('id, title, excerpt, content, title_pt, content_pt, excerpt_pt');

    if (error) {
        console.error('❌ Error fetching posts:', error.message);
        process.exit(1);
    }

    if (!posts || posts.length === 0) {
        console.log('✅ All posts already have Portuguese translations!');
        return;
    }

    console.log(`📝 Found ${posts.length} posts to translate.\n`);

    for (const post of posts) {
        try {
            const translated = await translatePost(post);

            const { error: updateError } = await supabase
                .from('posts')
                .update({
                    title_pt: translated.title_pt,
                    excerpt_pt: translated.excerpt_pt,
                    content_pt: translated.content_pt,
                })
                .eq('id', post.id);

            if (updateError) {
                console.error(`  ❌ Failed to update "${post.title}":`, updateError.message);
            } else {
                console.log(`  ✅ Done: "${post.title}" → "${translated.title_pt}"\n`);
            }
        } catch (err) {
            console.error(`  ❌ Error translating "${post.title}":`, err);
        }
    }

    console.log('\n🎉 All posts translated! The site should now show Portuguese content when toggling.');
}

main();
