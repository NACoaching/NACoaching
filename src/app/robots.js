export default function robots() {
    return {
        rules: [
            {
                userAgent: '*',
                allow: '/',
                disallow: ['/admin/', '/api/', '/success'],
            },
            {
                // Explicitly welcome AI Search Bots (ChatGPT Search, Perplexity, Claude, Apple Intelligence)
                userAgent: [
                    'GPTBot',
                    'OAI-SearchBot',
                    'ChatGPT-User',
                    'PerplexityBot',
                    'ClaudeBot',
                    'Applebot-Extended',
                    'Google-Extended',
                    'Bingbot'
                ],
                allow: ['/', '/llms.txt', '/llms-full.txt'],
                disallow: ['/admin/', '/api/', '/success'],
            }
        ],
        sitemap: 'https://www.na-coaching.com/sitemap.xml',
    }
}

