import { supabase } from '@/lib/supabaseClient';

export default async function sitemap() {
    const baseUrl = 'https://www.na-coaching.com';

    // Get all articles (only published for sitemap)
    const { data: articles } = await supabase.from('articles').select('id, slug, category, created_at, cta').eq('is_published', true);

    const blogUrls = (articles || [])
        .filter(article => article.category !== 'Outils')
        .map((article) => ({
            url: `${baseUrl}/blog/${article.slug || article.id}/`,
            lastModified: new Date(article.created_at),
            changeFrequency: 'weekly',
            priority: 0.8,
        }));

    const toolUrls = (articles || [])
        .filter(article => article.category === 'Outils')
        .map((article) => ({
            url: article.cta.startsWith('/') ? `${baseUrl}${article.cta}/` : `${baseUrl}/outils/${article.cta}/`,
            lastModified: new Date(article.created_at),
            changeFrequency: 'monthly',
            priority: 0.8,
        }));

    // Get unique categories for Labo category pages and normalize them to avoid duplicates
    const categoriesRaw = [...new Set((articles || []).map(a => a.category).filter(Boolean))];
    const categories = Array.from(new Map(categoriesRaw.map(cat => [cat.toLowerCase().trim(), cat])).values());

    // Helper to create clean SEO-friendly slugs (no accents, lowercase)
    const slugify = (str) => str
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .toLowerCase()
        .trim()
        .replace(/\s+/g, '-')
        .replace(/[^a-z0-9-]/g, '');

    const categoryUrls = categories
        .filter(cat => !cat.toLowerCase().includes('volume'))
        .map(category => ({
            url: `${baseUrl}/labo/${slugify(category)}/`,
            lastModified: new Date(),
            changeFrequency: 'weekly',
            priority: 0.75,
        }));

    // Add explicit URLs for the 3 Encyclopedia Volumes
    const volumeCategories = categories.filter(cat => cat.toLowerCase().includes('volume'));
    const volumeUrls = volumeCategories.map(vol => {
        // Basic slugification for volumes (e.g. "Volume 1 : La Science de la Force" -> "1-la-science-de-la-force")
        const cleanSlug = slugify(vol.replace(/volume\s*\d*\s*:/gi, '').replace(/volume\s*\d*/gi, '').trim());
        // For volumes, we might want to keep the number if it's there
        const volNumber = vol.match(/volume\s*(\d+)/i)?.[1] || '';
        const finalSlug = volNumber ? `${volNumber}-${cleanSlug}` : cleanSlug;

        return {
            url: `${baseUrl}/labo/volume/${finalSlug}/`,
            lastModified: new Date(),
            changeFrequency: 'daily', // High priority for pillar pages
            priority: 0.95,
        };
    });

    // Get all products
    const { data: products } = await supabase.from('products').select('id, slug, created_at');

    const productUrls = products?.map((product) => ({
        url: `${baseUrl}/boutique/${product.slug || product.id}/`,
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
            url: `${baseUrl}/labo/`,
            lastModified: new Date(),
            changeFrequency: 'daily',
            priority: 0.9,
        },
        {
            url: `${baseUrl}/boutique/`,
            lastModified: new Date(),
            changeFrequency: 'monthly',
            priority: 0.9,
        },
        {
            url: `${baseUrl}/outils/`,
            lastModified: new Date(),
            changeFrequency: 'monthly',
            priority: 0.9,
        },
        {
            url: `${baseUrl}/coach/`,
            lastModified: new Date(),
            changeFrequency: 'monthly',
            priority: 0.8,
        },
        {
            url: `${baseUrl}/contact/`,
            lastModified: new Date(),
            changeFrequency: 'monthly',
            priority: 0.7,
        },
        ...blogUrls,
        ...toolUrls,
        ...productUrls,
        ...categoryUrls,
        ...volumeUrls,
    ];
}
