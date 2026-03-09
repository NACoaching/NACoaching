const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY);

async function testTitle() {
    const { data: articles, error } = await supabase
        .from('articles')
        .select('*')
        .in('category', ['Volume 1 : La Science de la Force', 'Volume 3 : La Science de la Santé'])
        .order('created_at', { ascending: false })
        .limit(10);

    console.log("Latest vol1 and vol3:", articles.map(a => `${a.title} - ${a.category}`));
}
testTitle();
