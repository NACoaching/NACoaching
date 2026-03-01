const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

async function checkToolsSEO() {
    console.log("Checking SEO texts for all Tools in Supabase...");
    const { data: articles, error } = await supabase
        .from('articles')
        .select('title, content')
        .eq('category', 'Outils');

    if (error) {
        console.error("Error fetching data:", error);
        return;
    }

    articles.forEach(a => {
        const text = a.content ? a.content.trim() : "";
        const len = text.length;
        if (len > 500) {
            console.log(`✅ ${a.title}: Text is rich (${len} chars)`);
        } else if (len > 0) {
            console.log(`⚠️ ${a.title}: Text is too short (${len} chars)`);
        } else {
            console.log(`❌ ${a.title}: Empty!`);
        }
    });
}

checkToolsSEO();
