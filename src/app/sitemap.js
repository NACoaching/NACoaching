import { supabase } from '@/lib/supabaseClient';

export default async function sitemap() {
    const baseUrl = 'https://www.na-coaching.com';

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
    const categoryUrls = categories
        .filter(cat => !cat.toLowerCase().includes('volume'))
        .map(category => ({
            url: `${baseUrl}/labo/${encodeURIComponent(category.toLowerCase().replace(/ /g, '-'))}`,
            lastModified: new Date(),
            changeFrequency: 'weekly',
            priority: 0.75,
        }));

    // Add explicit URLs for the 3 Encyclopedia Volumes
    const volumeCategories = categories.filter(cat => cat.toLowerCase().includes('volume'));
    const volumeUrls = volumeCategories.map(vol => {
        // Basic slugification for volumes (e.g. "Volume 1 : La Science de la Force" -> "1-la-science-de-la-force")
        const cleanSlug = vol.toLowerCase().replace('volume ', '').replace(' :', '').replace(/ /g, '-').replace(/'/g, '');
        return {
            url: `${baseUrl}/labo/volume/${cleanSlug}`,
            lastModified: new Date(),
            changeFrequency: 'daily', // High priority for pillar pages
            priority: 0.95,
        };
    });

    // Get all products
    const { data: products } = await supabase.from('products').select('id, slug, created_at');

    const productUrls = products?.map((product) => ({
        url: `${baseUrl}/boutique/${product.slug || product.id}`,
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
            url: `${baseUrl}/coach`,
            lastModified: new Date(),
            changeFrequency: 'monthly',
            priority: 0.8,
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
        ...volumeUrls,
    ];
}
