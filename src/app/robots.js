export default function robots() {
    return {
        rules: [
            {
                userAgent: '*',
                allow: '/',
                disallow: ['/admin/', '/api/', '/success'],
            }
        ],
        sitemap: 'https://www.na-coaching.com/sitemap.xml',
    }
}
