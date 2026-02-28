export const dictionaries = {
    en: {
        menu: "Menu",
        close: "Close",
        search: "Search",
        searchPlaceholder: "Search articles...",
        searching: "Searching...",
        noResults: "No results found for",
        results: "result",
        resultsPlural: "results",
        categories: "Categories",
        about: "About",
        aboutText: "AI Frontiers is the blog that transforms complex Artificial Intelligence topics into clear and accessible knowledge. Depth without intimidation. Clarity without trivialization.",
        learnMore: "Learn more about us",
        mostRead: "Most Read",
        archive: "Archive",
        noPosts: "No posts yet",
        noPostsText: "Content is being generated. Come back soon!",
        loadMore: "Load more",
        readMore: "Read more",
        tags: "Tags",
        backToHome: "← Back to Home",
    },
    pt: {
        menu: "Menu",
        close: "Fechar",
        search: "Buscar",
        searchPlaceholder: "Buscar artigos...",
        searching: "Buscando...",
        noResults: "Nenhum resultado encontrado para",
        results: "resultado",
        resultsPlural: "resultados",
        categories: "Categorias",
        about: "Sobre",
        aboutText: "AI Frontiers é o blog que transforma temas complexos de Inteligência Artificial em conhecimento claro e acessível. Profundidade sem intimidar. Clareza sem trivializar.",
        learnMore: "Saiba mais sobre nós",
        mostRead: "Mais Lidos",
        archive: "Arquivo",
        noPosts: "Nenhum post ainda",
        noPostsText: "O conteúdo está sendo gerado. Volte em breve!",
        loadMore: "Carregar mais",
        readMore: "Leia mais",
        tags: "Tags",
        backToHome: "← Voltar ao Início",
    },
} as const;

export type Lang = "en" | "pt";
export type Dictionary = typeof dictionaries.en;

export function t(lang: Lang) {
    return dictionaries[lang];
}
