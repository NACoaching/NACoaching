import { supabase } from '@/lib/supabaseClient';

export default async function sitemap() {
    const baseUrl = 'https://na-coaching.com';

    // Get all articles
    const { data: articles } = await supabase.from('articles').select('id, created_at');

    const blogUrls = articles?.map((article) => ({
        url: `${baseUrl}/blog/${article.id}`,
        lastModified: new Date(article.created_at),
        changeFrequency: 'weekly',
        priority: 0.8,
    })) || [];

    return [
        {
            url: baseUrl,
            lastModified: new Date(),
            changeFrequency: 'yearly',
            priority: 1,
        },
        {
            url: `${baseUrl}/labo`,
            lastModified: new Date(),
            changeFrequency: 'daily',
            priority: 0.9,
        },
        {
            url: `${baseUrl}/boutique`,
            lastModified: new Date(),
            changeFrequency: 'monthly',
            priority: 0.9,
        },
        {
            url: `${baseUrl}/contact`,
            lastModified: new Date(),
            changeFrequency: 'yearly',
            priority: 0.5,
        },
        {
            url: `${baseUrl}/mentions-legales`,
            lastModified: new Date(),
            changeFrequency: 'yearly',
            priority: 0.1,
        },
        {
            url: `${baseUrl}/politique-confidentialite`,
            lastModified: new Date(),
            changeFrequency: 'yearly',
            priority: 0.1,
        },
        ...blogUrls,
    ];
}
