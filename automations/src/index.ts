import dotenv from 'dotenv';
import { gatherViralContent } from './fetcher';
import { generateBlogPost, generateImage } from './generator';
import fs from 'fs/promises';
import path from 'path';

dotenv.config();

async function main() {
    console.log("Starting Blog Automation...");

    // 1. Fetch viral content
    const viralContent = await gatherViralContent();

    if (viralContent.length === 0) {
        console.log("No viral content found.");
        return;
    }

    console.log(`Found ${viralContent.length} potential topics. Selecting the top one for generation...`);

    const topTopic = viralContent[0];
    console.log(`\nSelected Topic: ${topTopic.title}`);
    console.log(`Source: ${topTopic.source}`);

    // 2. Generate Blog Post Text
    const post = await generateBlogPost(topTopic);

    if (!post) {
        console.error("Failed to generate blog post.");
        return;
    }

    console.log("\n--- Generated Post Data ---");
    console.log(`Title: ${post.title}`);
    console.log(`Slug: ${post.slug}`);
    console.log(`Image Prompt: ${post.imagePrompt}`);

    // 3. Output directory setup
    const outDir = path.join(__dirname, '../output');
    await fs.mkdir(outDir, { recursive: true });

    const timestamp = Date.now();
    const filePrefix = `${post.slug}-${timestamp}`;
    let imageFileName = '';

    // 4. Generate Image (DALL-E 3)
    const imageBuffer = await generateImage(post.imagePrompt, post.imageType);
    if (imageBuffer) {
        imageFileName = `${filePrefix}.png`;
        const imagePath = path.join(outDir, imageFileName);
        await fs.writeFile(imagePath, imageBuffer);
        console.log(`\nCover Image saved to ${imagePath}`);
    } else {
        console.log("\nFailed to generate image. Continuing without one...");
    }

    // 5. Output Markdown File
    const markdownImage = imageFileName ? `![Cover Image](./${imageFileName})\n` : '';

    const content = `---
title: "${post.title}"
slug: "${post.slug}"
excerpt: "${post.excerpt}"
keywords: [${post.seoKeywords.map(k => `"${k}"`).join(', ')}]
---

${markdownImage}
${post.contentMarkdown}
  `;

    const mdFilepath = path.join(outDir, `${filePrefix}.md`);
    await fs.writeFile(mdFilepath, content, 'utf-8');

    console.log(`Draft saved to ${mdFilepath}`);
}

main().catch(console.error);
