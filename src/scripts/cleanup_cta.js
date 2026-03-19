const { createClient } = require('@supabase/supabase-js');
const dotenv = require('dotenv');
dotenv.config({ path: '.env.local' });

async function cleanup() {
    const supabase = createClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
    );

    // Find all articles with a CTA starting with /outils/ but NOT in Outils category
    const { data: duplicates, error } = await supabase
        .from('articles')
        .select('id, title, cta, category')
        .neq('category', 'Outils')
        .like('cta', '/outils/%');

    if (error) {
        console.error('Error fetching duplicates:', error);
        return;
    }

    console.log(`Found ${duplicates.length} articles with potentially colliding CTAs.`);
    
    for (const art of duplicates) {
        console.log(`Cleaning CTA for: ${art.title} (ID: ${art.id}, Category: ${art.category})`);
        // We set the CTA to empty or /contact if it was pointing to a tool incorrectly
        // In this case, many articles use CTA to point to a related page. 
        // If it's a blog article, it shouldn't have a CTA that matches a tool's path exactly if it's meant to be indexed as a separate page.
        const { error: updateError } = await supabase
            .from('articles')
            .update({ cta: '/contact' }) 
            .eq('id', art.id);
        
        if (updateError) console.error(`Error updating ${art.id}:`, updateError);
    }
}

cleanup();
