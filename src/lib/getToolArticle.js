import { createClient } from "@supabase/supabase-js";

/**
 * Fetches tool article content from the 'articles' table based on the tool slug.
 * This unifies tool content management into the Articles section of the admin panel.
 * 
 * @param {string} slug - The tool slug (e.g., '/outils/calculateur-1rm')
 * @returns {Object} - { title, excerpt, content } from the matching article
 */
export async function getToolArticle(slug) {
    const supabase = createClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
    );

    // 1. Récupérer l'article de base
    const { data: articlesData } = await supabase
        .from('articles')
        .select('*')
        .eq('cta', slug)
        .order('id', { ascending: true });

    const article = articlesData && articlesData.length > 0
        ? (articlesData.find(a => a.content && a.content.trim().length > 0) || articlesData[0])
        : null;

    // 2. Chercher des overrides SEO dans site_content
    // On déduit l'ID de l'outil à partir du slug
    const slugToToolId = {
        '/outils/calculateur-1rm': '1rm',
        '/outils/besoins-caloriques': 'calories',
        '/outils/convertisseur-vitesse': 'speed',
        '/outils/vma-vo2': 'vma',
        '/outils/frequence-cardiaque': 'hr',
        '/outils/acwr': 'acwr',
        '/outils/macros-avancees': 'macros',
        '/outils/predictateur-performance': 'pred',
        '/outils/rpe-1rm': 'rpe',
        '/outils/score-recuperation': 'recovery',
        '/outils/test-demi-cooper': 'demi',
        '/outils/volume-effectif': 'volume'
    };
    const toolId = slugToToolId[slug];
    
    let seoOverrides = {};
    if (toolId) {
        const { data: contentData } = await supabase
            .from('site_content')
            .select('key, value')
            .like('key', `tool_${toolId}_%`);
        
        if (contentData) {
            contentData.forEach(item => {
                const suffix = item.key.replace(`tool_${toolId}_`, '');
                seoOverrides[suffix] = item.value;
            });
        }
    }

    // Récupérer les auto-links dynamiques
    const autoLinks = await getAutoLinks();

    return {
        title: seoOverrides.title || article?.title || '',
        meta_desc: seoOverrides.meta_desc || '', // Nouvelle propriété
        intro: seoOverrides.intro || article?.excerpt || '',
        content: seoOverrides.content || article?.content || '',
        related_title: article?.related_title || '',
        related_subtitle: article?.related_subtitle || '',
        related_articles: article?.related_articles || [],
        image: article?.image || '',
        affiliate_link: article?.affiliate_link || '',
        affiliate_text: article?.affiliate_text || '',
        affiliate_image: article?.affiliate_image || '',
        affiliate_title: article?.affiliate_title || '',
        current_path: slug,
        tool_hints: article?.tool_hints || {},
        auto_links: autoLinks
    };
}

/**
 * Fetches the related articles for a given tool article, respecting custom manual selection.
 * @param {Object} article 
 * @returns {Array} relatedArticles
 */
export async function getToolRelatedArticles(article) {
    const supabase = createClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
    );

    if (article && article.related_articles && article.related_articles.length > 0) {
        // Try fetching articles first
        const { data: articlesData } = await supabase
            .from('articles')
            .select('id, title, category, slug, image')
            .in('slug', article.related_articles)
            .eq('is_published', true);

        // Also check if any of the related_articles matches a product slug
        const { data: productsData } = await supabase
            .from('products')
            .select('id, title, category, slug, image, price, discount_price, description')
            .in('slug', article.related_articles);

        return [...(articlesData || []), ...(productsData || [])];
    }

    const { data } = await supabase
        .from('articles')
        .select('id, title, category, slug')
        .eq('is_published', true)
        .neq('category', 'Outils')
        .limit(3);

    return data || [];
}

/**
 * Fetches the active auto-links from the 'auto_links' table.
 * @returns {Array} autoLinks
 */
export async function getAutoLinks() {
    const supabase = createClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
    );

    const { data } = await supabase
        .from('auto_links')
        .select('keywords, url')
        .eq('is_active', true);

    return data || [];
}
