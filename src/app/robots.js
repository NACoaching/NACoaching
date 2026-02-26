export default function robots() {
    return {
        rules: [
            {
                userAgent: '*',
                allow: '/',
                disallow: ['/admin/', '/api/', '/_next/'],
            }
        ],
        sitemap: 'https://na-coaching.com/sitemap.xml',
    }
}
