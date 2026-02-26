import dotenv from 'dotenv';
import { getDoc } from './sheets';
import { supabase } from './supabase';

dotenv.config();

async function runPublisher() {
    console.log("Starting Publisher Automation...");

    const doc = await getDoc();
    const draftSheet = doc.sheetsByTitle['Rascunhos'];

    if (!draftSheet) {
        console.log("Sheet 'Rascunhos' not found. Nothing to publish.");
        return;
    }

    const rows = await draftSheet.getRows();
    let publishedCount = 0;
    let deletedCount = 0;

    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    for (let i = rows.length - 1; i >= 0; i--) {
        const row = rows[i];
        const isApproved = row.get('Aprovado')?.toString().trim().toUpperCase() === 'TRUE';
        const isPublished = row.get('Publicado')?.toString().trim().toUpperCase() === 'TRUE';
        const dateStr = row.get('Data'); // Assuming format YYYY-MM-DD

        let shouldDelete = false;

        // Auto-delete logic: If not published and older than 30 days
        if (dateStr && !isPublished) {
            const rowDate = new Date(dateStr);
            if (!isNaN(rowDate.getTime()) && rowDate < thirtyDaysAgo) {
                console.log(`\nDeleting old unapproved draft: "${row.get('Título do Artigo') || 'Unknown'}" (Created: ${dateStr})`);
                shouldDelete = true;
            }
        }

        if (shouldDelete) {
            try {
                await row.delete();
                deletedCount++;
            } catch (e) {
                console.error("Failed to delete row:", e);
            }
            continue; // Skip publishing logic for this row
        }

        if (isApproved && !isPublished) {
            const title = row.get('Título do Artigo');
            console.log(`\nPublishing: "${title}"...`);

            const rawContent = row.get('Conteúdo') || '';
            const imageUrl = row.get('Imagem') || '';

            // Extract Slug, Excerpt, and Keywords from the markdown frontmatter
            let slug = title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');
            let excerpt = '';
            let content = rawContent;
            let tags = '';

            const match = rawContent.match(/^---\n([\s\S]*?)\n---\n([\s\S]*)$/);
            if (match) {
                const frontmatter = match[1];
                content = match[2].trim();

                const slugMatch = frontmatter.match(/slug:\s*"(.*?)"/);
                if (slugMatch) slug = slugMatch[1];

                const excerptMatch = frontmatter.match(/excerpt:\s*"(.*?)"/);
                if (excerptMatch) excerpt = excerptMatch[1];

                const keysMatch = frontmatter.match(/keywords:\s*\[(.*?)\]/);
                if (keysMatch) {
                    tags = keysMatch[1].replace(/["']/g, ''); // cleanup quotes if any
                }
            }

            // Insert into Supabase
            const { data, error } = await supabase
                .from('posts')
                .insert([
                    {
                        title: title,
                        slug: slug,
                        excerpt: excerpt,
                        content: content,
                        image_url: imageUrl,
                        tags: tags, // Might need to be formatted as an array depending on DB schema
                        published_at: new Date().toISOString()
                    }
                ]);

            if (error) {
                console.error(`Error inserting into Supabase:`, error.message);
            } else {
                console.log(`Successfully published to Supabase!`);
                // Update Google Sheets row
                row.set('Publicado', 'TRUE');
                await row.save();
                publishedCount++;
            }
        }
    }

    console.log(`\nPublisher Finished.`);
    console.log(`Total new posts published: ${publishedCount}`);
    console.log(`Total old drafts deleted: ${deletedCount}`);
}

runPublisher().catch(console.error);
