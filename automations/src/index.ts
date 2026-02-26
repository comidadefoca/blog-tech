import dotenv from 'dotenv';
import { gatherViralContent } from './fetcher';
import { generateBlogPost, generateImage } from './generator';
import { getConfigs, saveDraft } from './sheets';
import { uploadImage } from './supabase';
import sharp from 'sharp';
// import fs from 'fs/promises';
// import path from 'path';

dotenv.config();

async function main() {
    console.log("Starting Blog Automation Pipeline...");

    // 0. Fetch Configurations from Google Sheets
    console.log("Fetching config from Google Sheets ('Dashboard')...");
    const config = await getConfigs();
    console.log(`Niches found: ${config.niches.join(', ')}`);

    // 1. Fetch viral content based on Niches
    const viralContent = await gatherViralContent(config.niches);

    if (viralContent.length === 0) {
        console.log("No viral content found.");
        return;
    }

    console.log(`Found ${viralContent.length} potential topics. Selecting the top one for generation...`);

    const topTopic = viralContent[0];
    console.log(`\nSelected Topic: ${topTopic.title}`);
    console.log(`Source: ${topTopic.source}`);

    // 2. Generate Blog Post Text with custom dynamic prompts
    const post = await generateBlogPost(topTopic, config.systemPrompt);

    if (!post) {
        console.error("Failed to generate blog post.");
        return;
    }

    console.log("\n--- Generated Post Data ---");
    console.log(`Title: ${post.title}`);
    console.log(`Slug: ${post.slug}`);
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
slug: "${post.slug}"
excerpt: "${post.excerpt}"
keywords: [${post.seoKeywords.join(', ')}]
---

${post.contentMarkdown}`;

    await saveDraft(post.title, content.trim(), post.relevanceScore, imageUrl);

    console.log(`\nAutomation Cycle Complete! Check the Google Sheet!`);
}

main().catch(console.error);
