
const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

async function test() {
    const slug = '/outils/convertisseur-vitesse';
    const { data: articlesData, error } = await supabase
        .from('articles')
        .select('*')
        .eq('cta', slug);

    if (error) {
        console.error('Error:', error);
        return;
    }

    console.log('Found', articlesData.length, 'articles for', slug);
    articlesData.forEach(a => {
        console.log('ID:', a.id, 'Title:', a.title, 'CTA:', a.cta);
        console.log('Content length:', a.content?.length);
        console.log('Content tail:', a.content?.slice(-100));
    });

    const { data: articlesDataWithSlash } = await supabase
        .from('articles')
        .select('*')
        .eq('cta', slug + '/');
    
    console.log('Found', articlesDataWithSlash?.length, 'articles for', slug + '/');
    articlesDataWithSlash?.forEach(a => {
        console.log('ID:', a.id, 'Title:', a.title, 'CTA:', a.cta);
        console.log('Content length:', a.content?.length);
    });
}

test();
