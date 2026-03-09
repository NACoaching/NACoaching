const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY);

async function test() {
    const slug = "endurance-fondamentale-zone-2-le-secret-d-un-cardio-inepuisable";
    const { data: article, error } = await supabase.from('articles').select('*').eq('slug', slug).single();
    if (error) {
        console.error("Error fetching article:", error);
        return;
    }

    console.log("Article title:", article.title);
    console.log("Article related_articles:", article.related_articles);
    console.log("Type of related_articles:", typeof article.related_articles);
    console.log("Is array?", Array.isArray(article.related_articles));

    if (article && article.related_articles && article.related_articles.length > 0) {
        const toolsMap = {
            'rpe-1rm': true, 'convertisseur-vitesse': true, 'test-demi-cooper': true,
            'frequence-cardiaque': true, 'predictateur-performance': true,
            'besoins-caloriques': true, 'macros-avancees': true, 'volume-effectif': true,
            'ratio-acwr': true, 'score-recuperation': true
        };
        const articleSlugsToFetch = article.related_articles.filter(slug => !toolsMap[slug]);
        console.log("articleSlugsToFetch:", articleSlugsToFetch);

        if (articleSlugsToFetch.length > 0) {
            const res = await supabase
                .from('articles')
                .select('id, slug, title, category')
                .in('slug', articleSlugsToFetch)
                .eq('is_published', true);
            console.log("Query result for related via slug:", res.data, res.error);
        }

        // Also let's fetch an old article to see if it causes issues.
        const { data: oldArticle } = await supabase.from('articles').select('*').limit(1).single();
        if (oldArticle && oldArticle.related_articles && oldArticle.related_articles.length > 0) {
            console.log("Old article test related_articles:", oldArticle.related_articles);
        }
    }
}
test();
