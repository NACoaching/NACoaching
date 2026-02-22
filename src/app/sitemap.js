import { supabase } from '@/lib/supabaseClient';

export default async function sitemap() {
    const baseUrl = 'https://na-coaching.com';

    // Get all articles (only published for sitemap)
    const { data: articles } = await supabase.from('articles').select('id, slug, category, created_at, cta').eq('is_published', true);

    const blogUrls = (articles || [])
        .filter(article => article.category !== 'Outils')
        .map((article) => ({
            url: `${baseUrl}/blog/${article.slug || article.id}`,
            lastModified: new Date(article.created_at),
            changeFrequency: 'weekly',
            priority: 0.8,
        }));

    const toolUrls = (articles || [])
        .filter(article => article.category === 'Outils')
        .map((article) => ({
            url: article.cta.startsWith('/') ? `${baseUrl}${article.cta}` : `${baseUrl}/outils/${article.cta}`,
            lastModified: new Date(article.created_at),
            changeFrequency: 'monthly',
            priority: 0.8,
        }));

    // Get unique categories for Labo category pages
    const categories = [...new Set((articles || []).map(a => a.category).filter(Boolean))];
    const categoryUrls = categories.map(category => ({
        url: `${baseUrl}/labo/${encodeURIComponent(category.toLowerCase().replace(/ /g, '-'))}`,
        lastModified: new Date(),
        changeFrequency: 'weekly',
        priority: 0.75,
    }));

    // Get all products
    const { data: products } = await supabase.from('products').select('id, created_at');

    const productUrls = products?.map((product) => ({
        url: `${baseUrl}/boutique/${product.id}`,
        lastModified: new Date(product.created_at),
        changeFrequency: 'monthly',
        priority: 0.7,
    })) || [];

    return [
        {
            url: baseUrl,
            lastModified: new Date(),
            changeFrequency: 'weekly',
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
            url: `${baseUrl}/outils`,
            lastModified: new Date(),
            changeFrequency: 'monthly',
            priority: 0.9,
        },
        {
            url: `${baseUrl}/contact`,
            lastModified: new Date(),
            changeFrequency: 'monthly',
            priority: 0.7,
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
        ...toolUrls,
        ...productUrls,
        ...categoryUrls,
    ];
}
