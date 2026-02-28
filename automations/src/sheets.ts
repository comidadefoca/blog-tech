import { GoogleSpreadsheet } from 'google-spreadsheet';
import { JWT } from 'google-auth-library';
import dotenv from 'dotenv';
dotenv.config();

const SCOPES = [
    'https://www.googleapis.com/auth/spreadsheets',
    'https://www.googleapis.com/auth/drive.file',
];

const getAuthToken = () => {
    const rawKey = process.env.GOOGLE_PRIVATE_KEY || '';
    // Handle newline escape characters if they are present in the env var
    const privateKey = rawKey.includes('\\n') ? rawKey.replace(/\\n/g, '\n') : rawKey;
    const email = process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL;

    if (!privateKey || !email) {
        console.error(`
❌ ERRO CRÍTICO: Credenciais do Google ausentes!
Parece que o GitHub Actions não conseguiu ler os secrets 'GOOGLE_PRIVATE_KEY' ou 'GOOGLE_SERVICE_ACCOUNT_EMAIL'.

Verifique o repositório no GitHub:
1. Se os secrets foram adicionados em "Settings > Secrets and variables > Actions > Repository secrets".
2. Se o nome dos secrets estão EXATAMENTE corretos.
3. Se você não os adicionou acidentalmente na aba "Environment secrets" (ao invés de "Repository secrets").
`);
        process.exit(1);
    }

    return new JWT({
        email: email,
        key: privateKey,
        scopes: SCOPES,
    });
};

export const getDoc = async (): Promise<GoogleSpreadsheet> => {
    const doc = new GoogleSpreadsheet(process.env.GOOGLE_SHEET_ID || '', getAuthToken());
    await doc.loadInfo();
    return doc;
};

export interface SheetConfig {
    categories: string[];
    systemPrompt: string;
    imageStylePrompt: string;
}

export const getConfigs = async (): Promise<SheetConfig> => {
    const doc = await getDoc();

    let sheet = doc.sheetsByTitle['Dashboard'];

    // Auto-create Dashboard if missing
    if (!sheet) {
        console.log("Creating 'Dashboard' config tab...");
        sheet = await doc.addSheet({ title: 'Dashboard' });
        await sheet.loadCells('A1:B10');

        sheet.getCellByA1('A1').value = 'Categorias do Blog (separadas por vírgula)';
        sheet.getCellByA1('B1').value = 'Notícias IA, Ferramentas IA, Tutoriais, Tendências, Opinião';

        sheet.getCellByA1('A2').value = 'Prompt Sistema (Instruções ChatGPT)';
        sheet.getCellByA1('B2').value = 'Você é um escritor sênior de um blog sobre Inteligência Artificial. Escreva de forma cativante, acessível e otimizada para SEO. O tom deve ser informativo mas envolvente, como se estivesse explicando para um amigo curioso.';

        sheet.getCellByA1('A3').value = 'Prompt Style (Instruções DALL-E 3)';
        sheet.getCellByA1('B3').value = 'Minimal single 3D object, translucent blue glass material, dark background with soft vignette.';

        await sheet.saveUpdatedCells();
    } else {
        await sheet.loadCells('A1:B10');
    }

    const categoriesCell = sheet.getCellByA1('B1').value?.toString() || 'Notícias IA, Ferramentas IA, Tutoriais';
    const systemPromptCell = sheet.getCellByA1('B2').value?.toString() || '';
    const imagePromptCell = sheet.getCellByA1('B3').value?.toString() || '';

    return {
        categories: categoriesCell.split(',').map(n => n.trim()),
        systemPrompt: systemPromptCell,
        imageStylePrompt: imagePromptCell
    };
};

/**
 * Returns all existing article titles from the Rascunhos sheet.
 * Used for duplicate detection before generating new content.
 */
export const getExistingTitles = async (): Promise<string[]> => {
    const doc = await getDoc();
    const draftSheet = doc.sheetsByTitle['Rascunhos'];
    if (!draftSheet) return [];

    try {
        await draftSheet.loadHeaderRow();
    } catch {
        return [];
    }

    const rows = await draftSheet.getRows();
    return rows
        .map(row => row.get('Título do Artigo')?.toString() || '')
        .filter(t => t.length > 0);
};

export const saveDraft = async (
    title: string,
    contentMarkdown: string,
    score: number,
    imageUrl: string,
    category: string = ''
) => {
    const doc = await getDoc();

    let draftSheet = doc.sheetsByTitle['Rascunhos'];

    // We strictly define our headers
    const requiredHeaders = ['Assunto', 'Título do Artigo', 'Categoria', 'Data', 'Conteúdo', 'Imagem', 'Score SEO', 'Aprovado', 'Publicado'];

    if (!draftSheet) {
        draftSheet = await doc.addSheet({
            title: 'Rascunhos',
            headerValues: requiredHeaders
        });
    } else {
        // Load the header row without failing on duplicates, or just re-set it if it's messed up
        try {
            await draftSheet.loadHeaderRow();
        } catch (error: any) {
            // If the user manually edited headers and made duplicates, we override them to be safe
            if (error.message?.includes('Duplicate header detected')) {
                console.log("Fixing duplicate headers in Rascunhos tab...");
                await draftSheet.setHeaderRow(requiredHeaders);
            }
        }
    }

    const today = new Date().toISOString().split('T')[0];

    const newRow = await draftSheet.addRow({
        'Assunto': title.substring(0, 30) + '...',
        'Título do Artigo': title,
        'Categoria': category,
        'Data': today,
        'Conteúdo': contentMarkdown,
        'Imagem': imageUrl,
        'Score SEO': score,
        'Aprovado': 'FALSE',
        'Publicado': 'FALSE'
    });

    // To turn these string TRUE/FALSE into actual workable checkboxes,
    // Google Sheets API requires sending a request to update the data validation for those cells.
    // However, google-spreadsheet package v4 doesn't have an explicit .setCheckbox() yet,
    // so we set the initial value to the string 'FALSE'. The user or a one-time setup 
    // can apply 'Data > Data Validation > Checkbox' to columns G and H.
    // Setting to 'FALSE' or 'TRUE' is natively understood by existing Checkboxes.


    console.log(`Draft saved to Google Sheets: Row ${newRow.rowNumber}`);
};
