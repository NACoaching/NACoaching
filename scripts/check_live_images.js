const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY);

async function checkDatabase() {
    console.log("Checking database for image paths...");
    const { data: articles, error } = await supabase
        .from('articles')
        .select('id, title, image')
        .in('id', [10, 46, 2, 141]); // IDs for VMA, Predictor, RPE and Zone 2

    if (error) {
        console.error("Error fetching articles:", error);
        return;
    }

    articles.forEach(a => {
        console.log(`[ID ${a.id}] ${a.title}: ${a.image}`);
    });
}
checkDatabase();
