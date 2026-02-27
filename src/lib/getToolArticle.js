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

    const { data, error } = await supabase
        .from('articles')
        .select('title, excerpt, content, image, related_title, related_subtitle, related_articles, affiliate_link, affiliate_text, affiliate_image, affiliate_title')
        .eq('cta', slug)
        .order('id', { ascending: true }) // Consistance : on prend le premier créé ou spécifiquement celui voulu
        .limit(1);

    const article = data && data.length > 0 ? data[0] : null;

    return {
        title: article?.title || '',
        intro: article?.excerpt || '',
        content: article?.content || '',
        related_title: article?.related_title || '',
        related_subtitle: article?.related_subtitle || '',
        related_articles: article?.related_articles || [],
        image: article?.image || '',
        affiliate_link: article?.affiliate_link || '',
        affiliate_text: article?.affiliate_text || '',
        affiliate_image: article?.affiliate_image || '',
        affiliate_title: article?.affiliate_title || ''
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
