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

    return new JWT({
        email: process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL,
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
    niches: string[];
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

        sheet.getCellByA1('A1').value = 'Buscas (Nichos Separados por Vírgula)';
        sheet.getCellByA1('B1').value = 'Tech, AI, Startups, Web Development';

        sheet.getCellByA1('A2').value = 'Prompt Sistema (Instruções ChatGPT)';
        sheet.getCellByA1('B2').value = 'Você é um especialista em tecnologia e escreve de forma cativante.';

        sheet.getCellByA1('A3').value = 'Prompt Style (Instruções DALL-E 3)';
        sheet.getCellByA1('B3').value = 'Minimal single 3D object, translucent blue glass material, dark background with soft vignette.';

        await sheet.saveUpdatedCells();
    } else {
        await sheet.loadCells('A1:B10');
    }

    // We expect the user to set up rows:
    // A1: "Buscas (Nichos)", B1: "AI, Startups, Web Dev"
    // A2: "Prompt Sistema", B2: "Você é um especialista..."
    // A3: "Prompt Imagens", B3: "Minimal 3D object..."

    const nichesCell = sheet.getCellByA1('B1').value?.toString() || 'Tech, AI, Development';
    const systemPromptCell = sheet.getCellByA1('B2').value?.toString() || '';
    const imagePromptCell = sheet.getCellByA1('B3').value?.toString() || '';

    return {
        niches: nichesCell.split(',').map(n => n.trim()),
        systemPrompt: systemPromptCell,
        imageStylePrompt: imagePromptCell
    };
};

export const saveDraft = async (
    title: string,
    contentMarkdown: string,
    score: number,
    imageUrl: string
) => {
    const doc = await getDoc();

    let draftSheet = doc.sheetsByTitle['Rascunhos'];

    // We strictly define our headers
    const requiredHeaders = ['Assunto', 'Título do Artigo', 'Data', 'Conteúdo', 'Imagem', 'Score SEO', 'Aprovado', 'Publicado'];

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
