require('dotenv').config({ path: '.env.local' });
const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

const generateSlug = (title) => {
    if (!title) return '';
    return title
        .toLowerCase()
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)+/g, '');
};

async function fixSlugs() {
    const { data: articles } = await supabase.from('articles').select('id, title, slug');
    for (const article of articles) {
        const correctSlug = generateSlug(article.title);
        if (article.slug !== correctSlug) {
            console.log(`Fixing ${article.id}: ${article.slug} -> ${correctSlug}`);
            await supabase.from('articles').update({ slug: correctSlug }).eq('id', article.id);
        }
    }
    console.log("Done fixing slugs.");
}

fixSlugs();
