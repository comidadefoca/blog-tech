import OpenAI from 'openai';
import dotenv from 'dotenv';
import { ViralContent } from './fetcher';
import axios from 'axios';

dotenv.config();

const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
});

export interface GeneratedPost {
    title: string;
    slug: string;
    excerpt: string;
    contentMarkdown: string;
    seoKeywords: string[];
    imageType: 'people' | 'abstract';
    imagePrompt: string;
    relevanceScore: number;
    category: string; // Which blog category this post belongs to
}

export async function generateBlogPost(
    sourceContent: ViralContent,
    customSystemPrompt: string = '',
    categories: string[] = []
): Promise<GeneratedPost | null> {
    console.log(`Generating blog post for: "${sourceContent.title}"...`);

    const categoriesList = categories.length > 0
        ? categories.join(', ')
        : 'Notícias IA, Ferramentas IA, Tutoriais, Tendências, Opinião';

    const systemPrompt = `
You are an expert writer for a blog focused entirely on Artificial Intelligence and Technology.
Your mission is to take trending content and transform it into a completely new, highly engaging, well-structured blog post that fits our editorial voice.

Do NOT just summarize. Expand on the topic, add insights, provide examples, and explore implications.

${customSystemPrompt ? `EDITOR'S VOICE & TONE INSTRUCTIONS:\n${customSystemPrompt}\n` : ''}

BLOG CATEGORIES (you MUST classify into exactly one):
${categoriesList}

The target audience is curious professionals who want to understand AI's impact on their lives, careers, and businesses.

SEO RELEVANCE SCORING RULES (you MUST be strict and honest):
Score the topic from 1 to 10 based on these criteria. Be critical — most topics should score between 4-7. Only truly exceptional topics deserve 8+.
- 1-3: Niche humor, memes, personal stories, or topics with near-zero search volume. Example: "My cat broke my GPU".
- 4-5: Interesting but narrow topics, or topics already heavily covered by competitors. Example: "Another ChatGPT wrapper app launched".  
- 6-7: Solid trending topics with proven engagement and moderate search volume. Example: "Google releases new open-source AI model".
- 8-9: High-impact breaking news, major announcements, or topics at the intersection of AI + business/money. Example: "OpenAI announces GPT-5 with reasoning capabilities".
- 10: Once-in-a-year paradigm shifts. Example: "AGI achieved" or "EU bans all AI models".

FORMATTING REQUIREMENTS:
Return ONLY a strictly valid JSON object, without any markdown formatting wrappers (like \`\`\`json). The JSON object must have this exact structure:
{
  "title": "A catchy, SEO-friendly title (max 60 chars)",
  "slug": "url-friendly-slug-with-dashes",
  "excerpt": "A short, engaging paragraph summarizing the post (max 160 chars)",
  "contentMarkdown": "The full blog post content formatted with rich Markdown (H2, H3, bold, lists, code blocks if necessary). Must be at least 600 words.",
  "seoKeywords": ["keyword1", "keyword2", "keyword3", "keyword4", "keyword5"],
  "category": "One of the blog categories listed above that best fits this article",
  "imageType": "Must be exactly 'people' if the main subject involves humans, or 'abstract' if the subject is concepts, tech, code or objects.",
  "imagePrompt": "A very brief, abstract semantic description of the post's core topic to be used as a 3D shape concept (e.g., 'a broken server rack', 'an interconnected web of nodes', 'a glowing shield'). No style instructions, just the object.",
  "relevanceScore": 6
}
  `;

    const userPrompt = `
Generate a new blog post based on this trending topic:
Title: ${sourceContent.title}
Source: ${sourceContent.source}
Original Content/Description: ${sourceContent.content || 'N/A'}

Provide the final JSON output.
  `;

    try {
        const response = await openai.chat.completions.create({
            model: 'gpt-4o-mini',
            messages: [
                { role: 'system', content: systemPrompt },
                { role: 'user', content: userPrompt }
            ],
            temperature: 0.7,
            max_tokens: 2500,
        });

        const responseText = response.choices[0].message.content?.trim();
        if (!responseText) {
            throw new Error("No response from OpenAI");
        }

        let cleanJson = responseText;
        if (cleanJson.startsWith('```json')) {
            cleanJson = cleanJson.replace(/```json\n/, '').replace(/\n```$/, '');
        }

        const parsedData: GeneratedPost = JSON.parse(cleanJson);
        return parsedData;
    } catch (error) {
        console.error("Error generating blog post with OpenAI:", error);
        return null;
    }
}

/**
 * Generates an image using DALL-E 3 based on the topic prompt.
 * It enforces a specific visual style to avoid generic aesthetics.
 */
export async function generateImage(
    basePrompt: string,
    imageType: 'people' | 'abstract',
    customImageStyle: string = ''
): Promise<Buffer | null> {
    console.log(`Generating image via DALL-E 3 (Type: ${imageType})...`);

    const defaultStyle = `Minimal single 3D object, translucent blue glass material, 
soft internal gradient blue to cyan, subtle glow edges, 
smooth rounded geometry, centered composition, 
dark background with soft vignette, studio lighting, clean negative space.`;

    const finalPrompt = `${customImageStyle || defaultStyle}

Shape variation: ${basePrompt}`;

    try {
        const response = await openai.images.generate({
            model: "dall-e-3",
            prompt: finalPrompt,
            n: 1,
            size: "1024x1024",
            quality: "standard", // "hd" is also available but more expensive
        });

        const imageUrl = response.data?.[0]?.url; if (!imageUrl) throw new Error("No image URL returned");

        // Download the image locally to return it as a buffer
        const imageResponse = await axios.get(imageUrl, { responseType: 'arraybuffer' });
        return Buffer.from(imageResponse.data);
    } catch (error) {
        console.error("Error generating or downloading image:", error);
        return null;
    }
}
