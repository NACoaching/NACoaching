const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY);

async function testTitle() {
    const { data: articles, error } = await supabase
        .from('articles')
        .select('id, title, category')
        .eq('category', 'Outils')
        .ilike('title', '%VMA%');

    console.log("VMA tools:", articles);
}
testTitle();
