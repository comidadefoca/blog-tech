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
    imagePrompt: string; // New field for DALL-E prompt
    relevanceScore: number; // SEO Value 1-10
}

export async function generateBlogPost(
    sourceContent: ViralContent,
    customSystemPrompt: string = ''
): Promise<GeneratedPost | null> {
    console.log(`Generating blog post for: "${sourceContent.title}"...`);

    const systemPrompt = `
You are an expert technical writer and SEO specialist. Your goal is to take viral or trending content and write a completely new, highly engaging, and well-structured blog post based on the topic.
Do NOT just summarize the content. Expand on it, add value, provide examples if applicable, and write in a clear, professional yet accessible tone.

${customSystemPrompt ? `ADDITIONAL INSTRUCTIONS FROM EDITOR:\n${customSystemPrompt}\n` : ''}

The target audience is developers, designers, and tech enthusiasts.

FORMATTING REQUIREMENTS:
Return ONLY a strictly valid JSON object, without any markdown formatting wrappers (like \`\`\`json). The JSON object must have this exact structure:
{
  "title": "A catchy, SEO-friendly title (max 60 chars)",
  "slug": "url-friendly-slug-with-dashes",
  "excerpt": "A short, engaging paragraph summarizing the post (max 160 chars)",
  "contentMarkdown": "The full blog post content formatted with rich Markdown (H2, H3, bold, lists, code blocks if necessary). Must be at least 500 words.",
  "seoKeywords": ["keyword1", "keyword2", "keyword3"],
  "imageType": "Must be exactly 'people' if the main subject involves humans, or 'abstract' if the subject is concepts, tech, code or objects.",
  "imagePrompt": "A very brief, abstract semantic description of the post's core topic to be used as a 3D shape concept (e.g., 'a broken server rack', 'an interconnected web of nodes', 'a glowing shield'). No style instructions, just the object.",
  "relevanceScore": 8 // An integer from 1 to 10 estimating how valuable and viral this topic will be for our tech SEO strategy.
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
