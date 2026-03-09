const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY);

async function checkDatabase() {
    console.log("Fetching all tools and relevant articles...");
    const { data: articles, error } = await supabase
        .from('articles')
        .select('id, title, image, category, is_published')
        .or('id.in.(10,46,2,141),title.ilike.%Prédicteur%,title.ilike.%RPE%,title.ilike.%Endurance%');

    if (error) {
        console.error("Error fetching articles:", error);
        return;
    }

    articles.forEach(a => {
        console.log(`[ID ${a.id}] ${a.title} (${a.category}) [Pub: ${a.is_published}]: ${a.image}`);
    });
}
checkDatabase();
