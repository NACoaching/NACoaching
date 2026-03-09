const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY);

async function updateImages() {
    console.log("Updating database with Git-hosted image paths...");

    // ID 458: Endurance Fondamentale -> zone2_forest.png (let's assume they want the forest one or I'll pick the most premium one)
    // ID 47: Prédicteur -> tool_predictor.png
    // ID 44: RPE -> tool_rpe.png
    // ID 46: Test VMA -> tool_vma_test.png

    const updates = [
        { id: 458, image: '/images/blog/zone2_forest.png' },
        { id: 47, image: '/images/tools/tool_predictor.png' },
        { id: 44, image: '/images/tools/tool_rpe.png' },
        { id: 46, image: '/images/tools/tool_vma_test.png' }
    ];

    for (const item of updates) {
        const { error } = await supabase
            .from('articles')
            .update({ image: item.image })
            .eq('id', item.id);

        if (error) {
            console.error(`Error updating ID ${item.id}:`, error);
        } else {
            console.log(`Successfully updated ID ${item.id} to ${item.image}`);
        }
    }
}
updateImages();
