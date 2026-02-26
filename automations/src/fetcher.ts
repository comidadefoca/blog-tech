import axios from 'axios';
import Parser from 'rss-parser';

export interface ViralContent {
    title: string;
    url: string;
    source: string;
    content?: string;
    score?: number;
    publishedDate?: string;
    author?: string;
}

const parser = new Parser();

/**
 * Curated subreddits that are highly relevant to AI, technology, and innovation.
 * These communities consistently produce high-quality, viral content within our niche.
 * The user controls the "flavor" of topics through the System Prompt and Categories,
 * NOT through this list. This list ensures raw material is always on-brand.
 */
const AI_FOCUSED_SUBREDDITS = [
    'artificial',        // General AI discussions
    'MachineLearning',   // Technical ML research & papers
    'ChatGPT',           // ChatGPT use cases and news
    'LocalLLaMA',        // Open-source AI models
    'singularity',       // Future of AI & humanity
    'StableDiffusion',   // AI image generation
    'OpenAI',            // OpenAI announcements
    'technology',        // Broad tech news (filtered by AI later)
    'programming',       // Developer culture & tools
    'webdev',            // Web development trends
];

/**
 * Curated RSS feeds from reputable AI and tech news sources.
 */
const AI_FOCUSED_RSS = [
    'https://hnrss.org/newest?q=AI+OR+LLM+OR+GPT+OR+machine+learning',  // Hacker News filtered for AI
    'https://techcrunch.com/category/artificial-intelligence/feed/',       // TechCrunch AI category
];

export async function fetchFromSubreddit(subreddit: string, limit: number = 3): Promise<ViralContent[]> {
    try {
        console.log(`  📡 r/${subreddit}...`);
        const response = await axios.get(
            `https://www.reddit.com/r/${subreddit}/top.json?limit=${limit}&t=week`,
            { timeout: 8000 }
        );

        const posts = response.data.data.children;
        return posts.map((post: any) => ({
            title: post.data.title,
            url: `https://www.reddit.com${post.data.permalink}`,
            source: `r/${subreddit}`,
            content: post.data.selftext?.substring(0, 500) || '',
            score: post.data.score,
            author: post.data.author,
        }));
    } catch (error: any) {
        // Silently skip failed subreddits (404, rate limits, etc.)
        return [];
    }
}

export async function fetchFromRSS(feedUrl: string, limit: number = 3): Promise<ViralContent[]> {
    try {
        const feed = await parser.parseURL(feedUrl);
        return feed.items.slice(0, limit).map((item) => ({
            title: item.title || 'Untitled',
            url: item.link || '',
            source: feed.title || 'RSS',
            content: item.contentSnippet?.substring(0, 500) || item.content?.substring(0, 500) || '',
            publishedDate: item.pubDate,
            author: item.creator,
        }));
    } catch (error) {
        return [];
    }
}

/**
 * Gathers viral content from all curated AI-focused sources.
 * The `categories` parameter from the Dashboard is used for logging only;
 * the actual content filtering is done by the AI System Prompt during generation.
 * 
 * This design ensures maximum variety in raw topics while keeping them
 * within the broad AI/Tech umbrella.
 */
export async function gatherViralContent(categories: string[]): Promise<ViralContent[]> {
    console.log(`\nScouting viral AI content across ${AI_FOCUSED_SUBREDDITS.length} subreddits and ${AI_FOCUSED_RSS.length} RSS feeds...`);
    console.log(`Blog categories to fill: ${categories.join(' | ')}\n`);

    let allContent: ViralContent[] = [];

    // Fetch from curated subreddits (2 posts each to keep it fast)
    for (const sub of AI_FOCUSED_SUBREDDITS) {
        const posts = await fetchFromSubreddit(sub, 2);
        allContent.push(...posts);
    }

    // Fetch from curated RSS feeds
    for (const feed of AI_FOCUSED_RSS) {
        const posts = await fetchFromRSS(feed, 3);
        allContent.push(...posts);
    }

    // Sort by engagement score (most viral first)
    allContent = allContent.sort((a, b) => (b.score || 0) - (a.score || 0));

    console.log(`\n✅ Found ${allContent.length} on-niche topics across all sources.`);
    return allContent;
}
