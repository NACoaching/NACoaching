const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY);

async function testPageLogic() {
    const slug = "endurance-fondamentale-zone-2-le-secret-d-un-cardio-inepuisable";

    // Simulate query.single()
    let query = supabase.from('articles').select('*').eq('is_published', true).eq('slug', slug);

    try {
        const [articleRes, contentRes, autoLinksRes] = await Promise.all([
            query.single(),
            supabase.from('site_content').select('*'),
            supabase.from('auto_links').select('*').eq('is_active', true)
        ]);

        const article = articleRes.data;
        if (!article) {
            console.log("Article not found!");
            return;
        }

        const toolEmojis = {
            '/outils/rpe-1rm': '💪',
            '/outils/convertisseur-vitesse': '⚡️',
            '/outils/test-demi-cooper': '🏃‍♂️',
        };

        let relatedArticles = [];
        let articleTools = [];

        if (article) {
            console.log("article.related_articles value:", article.related_articles);
            if (article.related_articles && article.related_articles.length > 0) {
                const { data, error } = await supabase
                    .from('articles')
                    .select('id, slug, title, category, cta')
                    .in('id', article.related_articles)
                    .eq('is_published', true);

                if (error) console.error("Error fetching related:", error);

                if (data) {
                    console.log("Data fetched from related IDs:", data);
                    articleTools = data.filter(a => a.category === 'Outils');
                    relatedArticles = data.filter(a => a.category !== 'Outils');
                }
            }
        }

        console.log("Tools mapped:", articleTools);

        // Simulating the render error
        articleTools.map((tool) => {
            const icon = toolEmojis[tool.cta] || '🔧';
            const title = tool.title;
            const url = tool.cta || `/blog/${tool.slug}`;
            console.log("Mapped tool:", icon, title, url);
        });
        console.log("Successfully ran without crashing.");

    } catch (e) {
        console.error("RUNTIME CRASH:", e);
    }
}

testPageLogic();
