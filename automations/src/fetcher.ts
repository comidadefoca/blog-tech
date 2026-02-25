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

export async function fetchFromReddit(subreddit: string, limit: number = 5): Promise<ViralContent[]> {
    try {
        console.log(`Fetching top posts from r/${subreddit}...`);
        // Using the search API or top API. Let's use top.json for viral content
        const response = await axios.get(`https://www.reddit.com/r/${subreddit}/top.json?limit=${limit}&t=week`);

        const posts = response.data.data.children;
        const viralPosts: ViralContent[] = posts.map((post: any) => ({
            title: post.data.title,
            url: `https://www.reddit.com${post.data.permalink}`,
            source: `Reddit (r/${subreddit})`,
            content: post.data.selftext || '', // text content if it's a text post
            score: post.data.score,
            author: post.data.author,
        }));

        return viralPosts;
    } catch (error) {
        console.error(`Error fetching from Reddit r/${subreddit}:`, error);
        return [];
    }
}

export async function fetchFromRSS(feedUrl: string, limit: number = 5): Promise<ViralContent[]> {
    try {
        console.log(`Fetching RSS feed: ${feedUrl}...`);
        const feed = await parser.parseURL(feedUrl);

        const items = feed.items.slice(0, limit);
        const viralPosts: ViralContent[] = items.map((item) => ({
            title: item.title || 'Untitled',
            url: item.link || '',
            source: feed.title || feedUrl,
            content: item.contentSnippet || item.content || '',
            publishedDate: item.pubDate,
            author: item.creator,
        }));

        return viralPosts;
    } catch (error) {
        console.error(`Error fetching RSS ${feedUrl}:`, error);
        return [];
    }
}

export async function gatherViralContent(): Promise<ViralContent[]> {
    // Example sources - we will make this configurable
    const subreddits = ['webdev', 'nextjs', 'reactjs', 'programming'];
    const rssFeeds = [
        'https://css-tricks.com/feed/',
        'https://hnrss.org/frontpage' // Hacker News top
    ];

    let allContent: ViralContent[] = [];

    for (const sub of subreddits) {
        const posts = await fetchFromReddit(sub, 2); // Get top 2 of the week
        allContent.push(...posts);
    }

    for (const feed of rssFeeds) {
        const posts = await fetchFromRSS(feed, 2);
        allContent.push(...posts);
    }

    // Sort by score if available (Reddit), or just return
    return allContent.sort((a, b) => (b.score || 0) - (a.score || 0));
}
