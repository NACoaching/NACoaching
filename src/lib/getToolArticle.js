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
        .select('title, excerpt, content')
        .eq('cta', slug)
        .single();

    return {
        title: data?.title || '',
        intro: data?.excerpt || '',
        content: data?.content || '',
    };
}
