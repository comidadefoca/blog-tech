import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
dotenv.config();

const supabaseUrl = process.env.SUPABASE_URL || '';
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || '';

if (!supabaseUrl || !supabaseKey) {
    console.error(`
❌ ERRO CRÍTICO: Credenciais do Supabase ausentes!
Parece que o GitHub Actions não conseguiu ler os secrets 'SUPABASE_URL' ou 'SUPABASE_SERVICE_ROLE_KEY'.

Verifique o repositório no GitHub:
1. Se os secrets foram adicionados em "Settings > Secrets and variables > Actions > Repository secrets".
2. Se o nome dos secrets estão EXATAMENTE corretos.
3. Se você não os adicionou acidentalmente na aba "Environment secrets" (ao invés de "Repository secrets").
`);
    process.exit(1);
}

export const supabase = createClient(supabaseUrl, supabaseKey);
export async function uploadImage(imageBuffer: Buffer, fileName: string): Promise<string | null> {
    try {
        const { data, error } = await supabase.storage
            .from('blog-images')
            .upload(`covers/${fileName}`, imageBuffer, {
                contentType: fileName.endsWith('.webp') ? 'image/webp' : 'image/png',
                upsert: true
            });

        if (error) {
            console.error('Error uploading image to Supabase:', error);
            return null;
        }

        const { data: publicUrlData } = supabase.storage
            .from('blog-images')
            .getPublicUrl(`covers/${fileName}`);

        return publicUrlData.publicUrl;
    } catch (err) {
        console.error('Unexpected error during upload:', err);
        return null;
    }
}
