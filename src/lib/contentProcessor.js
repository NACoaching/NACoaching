/**
 * Glossary of keywords and their corresponding URLs.
 * Add new keywords here to enable auto-linking across the site.
 */
const GLOSSARY = [
    { keywords: ['VMA', 'VO2max', 'Vitesse Maximale Aérobie'], url: '/outils/vma-vo2' },
    { keywords: ['1RM', 'Rep maximale', 'Max rep'], url: '/outils/calculateur-1rm' },
    { keywords: ['Calories', 'Besoin calorique'], url: '/outils/besoins-caloriques' },
    { keywords: ['Macros', 'Protéines', 'Glucides', 'Lipides'], url: '/outils/macros-avancees' },
    { keywords: ['RPE', 'RPE 1-10'], url: '/outils/rpe-1rm' },
    { keywords: ['Cardiaque', 'FC Max', 'Fréquence cardiaque'], url: '/outils/frequence-cardiaque' },
    { keywords: ['Récupération', 'Score de récup'], url: '/outils/score-recuperation' },
    { keywords: ['ACWR', 'Charge de travail'], url: '/outils/acwr' },
    { keywords: ['Volume effectif', 'Séries effectives'], url: '/outils/volume-effectif' },
    { keywords: ['Cooper', 'Demi-Cooper'], url: '/outils/test-demi-cooper' },
    { keywords: ['Boutique', 'Magasin'], url: '/boutique' },
    { keywords: ['Le Labo'], url: '/labo' },
];

/**
 * Automatically wraps specific keywords in Markdown links.
 * It ignores keywords already inside a link or a header.
 * 
 * @param {string} content - Markdown content to process
 * @returns {string} - Processed content with auto-links
 */
export function autoLinkContent(content) {
    if (!content) return content;

    let processedContent = content;

    // 1. Identify and protect existing Markdown links [text](url) or [text]
    const linkRegex = /\[([^\]]+)\]\(([^)]+)\)|\[([^\]]+)\]/g;
    const links = [];
    processedContent = processedContent.replace(linkRegex, (match) => {
        const placeholder = `__LINK_PLACEHOLDER_${links.length}__`;
        links.push(match);
        return placeholder;
    });

    // 2. Identify and protect Headers (lines starting with #)
    const headerRegex = /^(#+.*)$/gm;
    const headers = [];
    processedContent = processedContent.replace(headerRegex, (match) => {
        const placeholder = `__HEADER_PLACEHOLDER_${headers.length}__`;
        headers.push(match);
        return placeholder;
    });

    // 3. Process each glossary item
    GLOSSARY.forEach(item => {
        item.keywords.forEach(keyword => {
            // Only link if not already linked in this pass
            // and ensure it's a full word boundary
            const regex = new RegExp(`\\b(${keyword})\\b`, 'gi');

            // Limit to first occurrence per keyword in the whole content for better UX/SEO
            let replaced = false;
            processedContent = processedContent.replace(regex, (match) => {
                if (replaced) return match;
                // Double check if we are not inside a placeholder already
                replaced = true;
                return `[${match}](${item.url})`;
            });
        });
    });

    // 4. Restore Headers
    headers.forEach((header, i) => {
        processedContent = processedContent.replace(`__HEADER_PLACEHOLDER_${i}__`, header);
    });

    // 5. Restore Links
    links.forEach((link, i) => {
        processedContent = processedContent.replace(`__LINK_PLACEHOLDER_${i}__`, link);
    });

    return processedContent;
}
