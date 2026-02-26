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

    const { data } = await supabase
        .from('articles')
        .select('title, excerpt, content, image, related_title, related_subtitle, related_articles')
        .eq('cta', slug)
        .single();

    return {
        title: data?.title || '',
        intro: data?.excerpt || '',
        content: data?.content || '',
        related_title: data?.related_title || '',
        related_subtitle: data?.related_subtitle || '',
        related_articles: data?.related_articles || [],
        image: data?.image || ''
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
        const { data } = await supabase
            .from('articles')
            .select('id, title, category, slug')
            .in('id', article.related_articles)
            .eq('is_published', true);
        return data || [];
    }

    const { data } = await supabase
        .from('articles')
        .select('id, title, category, slug')
        .eq('is_published', true)
        .neq('category', 'Outils')
        .limit(3);

    return data || [];
}
