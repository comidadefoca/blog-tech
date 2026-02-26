import dotenv from 'dotenv';
import { gatherViralContent, ViralContent } from './fetcher';
import { generateBlogPost, generateImage } from './generator';
import { getConfigs, saveDraft, getExistingTitles } from './sheets';
import { uploadImage } from './supabase';
import sharp from 'sharp';

dotenv.config();

// Common words to ignore when comparing titles for duplicates
const STOP_WORDS = new Set([
    'the', 'a', 'an', 'is', 'are', 'was', 'were', 'in', 'on', 'at', 'to', 'for',
    'of', 'and', 'or', 'but', 'not', 'with', 'from', 'by', 'it', 'its', 'this',
    'that', 'just', 'my', 'your', 'how', 'what', 'why', 'who', 'i', 'you', 'we',
    'they', 'about', 'after', 'before', 'up', 'down', 'out', 'new', 'old', 'do',
    'does', 'did', 'has', 'have', 'had', 'be', 'been', 'being', 'so', 'if', 'no',
    'yes', 'all', 'more', 'some', 'any', 'over', 'into', 'than', 'can', 'will',
]);

/**
 * Extracts significant keywords from a title (removes stop words and short words).
 */
function extractKeywords(title: string): Set<string> {
    return new Set(
        title.toLowerCase()
            .replace(/[^a-záàâãéèêíïóôõúüç\s]/gi, '') // Keep accented chars
            .split(/\s+/)
            .filter(w => w.length > 2 && !STOP_WORDS.has(w))
    );
}

/**
 * Checks if a viral topic is too similar to any existing article title.
 * Returns true if 2+ significant keywords overlap.
 */
function isDuplicate(topic: ViralContent, existingKeywordSets: Set<string>[]): boolean {
    const topicKeywords = extractKeywords(topic.title);
    for (const existingSet of existingKeywordSets) {
        let overlap = 0;
        for (const word of topicKeywords) {
            if (existingSet.has(word)) overlap++;
        }
        if (overlap >= 2) return true;
    }
    return false;
}

async function main() {
    console.log("Starting Blog Automation Pipeline...");

    // 0. Fetch Configurations from Google Sheets
    console.log("Fetching config from Google Sheets ('Dashboard')...");
    const config = await getConfigs();
    console.log(`Blog Categories: ${config.categories.join(' | ')}`);

    // 1. Fetch viral content from curated AI-focused sources
    const viralContent = await gatherViralContent(config.categories);

    if (viralContent.length === 0) {
        console.log("No viral content found.");
        return;
    }

    // 2. Load existing titles for duplicate detection
    console.log("\n🔍 Checking for duplicate topics...");
    const existingTitles = await getExistingTitles();
    const existingKeywordSets = existingTitles.map(t => extractKeywords(t));
    console.log(`Found ${existingTitles.length} existing articles to compare against.`);

    // 3. Filter out duplicates and pick a random unique topic from the top candidates
    const uniqueTopics = viralContent.filter(t => !isDuplicate(t, existingKeywordSets));
    console.log(`${viralContent.length - uniqueTopics.length} duplicate topics filtered out.`);
    console.log(`${uniqueTopics.length} unique topics available.`);

    if (uniqueTopics.length === 0) {
        console.log("⚠️ All trending topics have already been covered! Try again tomorrow.");
        return;
    }

    const randomIndex = Math.floor(Math.random() * Math.min(5, uniqueTopics.length));
    const topTopic = uniqueTopics[randomIndex];
    console.log(`\nSelected Topic: ${topTopic.title}`);
    console.log(`Source: ${topTopic.source}`);

    // 2. Generate Blog Post Text with custom dynamic prompts and categories
    const post = await generateBlogPost(topTopic, config.systemPrompt, config.categories);

    if (!post) {
        console.error("Failed to generate blog post.");
        return;
    }

    console.log("\n--- Generated Post Data ---");
    console.log(`Title: ${post.title}`);
    console.log(`Slug: ${post.slug}`);
    console.log(`Category: ${post.category}`);
    console.log(`SEO Score: ${post.relevanceScore}/10`);
    console.log(`Image Prompt: ${post.imagePrompt}`);

    // 3. Generate Image using custom dynamic image styles
    const imageBuffer = await generateImage(post.imagePrompt, post.imageType, config.imageStylePrompt);

    // We haven't integrated Supabase Storage yet, so we'll mock the URL or save locally temporarily
    // For now we'll write a placeholder. In the next stage, this buffer will be uploaded to Supabase Storage.
    let imageUrl = '';
    if (imageBuffer) {
        console.log("\nCompressing image with Sharp natively...");
        // Convert to WebP, shrink to max 1200px width, and compress to 80% quality
        const compressedBuffer = await sharp(imageBuffer)
            .resize({ width: 1200, withoutEnlargement: true })
            .webp({ quality: 80 })
            .toBuffer();

        const fileName = `${post.slug}-${Date.now()}.webp`;
        console.log(`Uploading WebP Image (${fileName}) to Supabase Storage...`);
        const uploadedUrl = await uploadImage(compressedBuffer, fileName);

        if (uploadedUrl) {
            imageUrl = uploadedUrl;
            console.log(`Image uploaded successfully! URL: ${imageUrl}`);
        } else {
            console.log("Failed to upload image to Supabase. Using placeholder.");
            imageUrl = 'https://via.placeholder.com/1024x1024.png?text=Upload+Failed';
        }
    } else {
        console.log("\nFailed to generate image.");
    }

    // 4. Output to Google Sheets CRM (Rascunhos tab)
    console.log("\nSaving to Google Sheets CRM...");

    // Convert to rich string for sheets (just markdown)
    const content = `---
title: "${post.title}"
title_pt: "${post.title_pt}"
slug: "${post.slug}"
excerpt: "${post.excerpt}"
excerpt_pt: "${post.excerpt_pt}"
keywords: [${post.seoKeywords.join(', ')}]
---

${post.contentMarkdown}

=== PT ===

${post.contentMarkdown_pt}`;

    await saveDraft(post.title, content.trim(), post.relevanceScore, imageUrl, post.category);

    console.log(`\nAutomation Cycle Complete! Check the Google Sheet!`);
}

main().catch(console.error);
