/**
 * Automatically wraps specific keywords in Markdown links.
 * It ignores keywords already inside a link or a header.
 * 
 * @param {string} content - Markdown content to process
 * @param {Array} glossary - Array of { keywords: 'kw1, kw2', url: '/url' }
 * @param {string} currentPath - Current page path to skip self-linking
 * @returns {string} - Processed content with auto-links
 */
export function autoLinkContent(content, glossary = [], currentPath = '') {
    if (!content || !glossary || glossary.length === 0) return content;

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
    glossary.forEach(item => {
        // Skip link if it points to the current page
        if (currentPath && item.url === currentPath) return;

        // Keywords can be a string (comma separated) or an array
        const keywordsArray = typeof item.keywords === 'string'
            ? item.keywords.split(',').map(k => k.trim())
            : (Array.isArray(item.keywords) ? item.keywords : []);

        keywordsArray.forEach(keyword => {
            if (!keyword) return;
            // Full word boundary, case insensitive
            const regex = new RegExp(`\\b(${keyword})\\b`, 'gi');

            // Limit to first occurrence per keyword for better readability
            let replaced = false;
            processedContent = processedContent.replace(regex, (match) => {
                if (replaced) return match;
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
