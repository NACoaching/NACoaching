require('dotenv').config({ path: '.env.local' });
const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

async function checkSlugs() {
    const { data: articles, error } = await supabase.from('articles').select('id, title, slug');
    if (error) {
        console.error('Error fetching articles:', error);
    } else {
        console.log('Articles from DB:');
        console.table(articles);
    }
}

checkSlugs();
