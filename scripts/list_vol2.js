const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY);

async function testTitle() {
    const { data: articles, error } = await supabase
        .from('articles')
        .select('*')
        .eq('category', "Volume 2 : La Science de l'Endurance")
        .order('created_at', { ascending: false });

    console.log("Volume 2 articles:", articles.map(a => `${a.title} (${a.is_published ? 'Published' : 'Draft'})`));
}
testTitle();
