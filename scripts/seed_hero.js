require('dotenv').config({ path: '.env.local' });
const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY);

async function checkAndSeed() {
    const keys = [
        { key: 'hero_title', value: 'NB COACHING', label: 'Titre Principal' },
        { key: 'hero_subtitle', value: 'Coaching sportif haut de gamme basé sur la physiologie et la biomécanique.', label: 'Sous-titre' },
        { key: 'hero_cta_primary', value: 'Commencer l\'entraînement', label: 'Bouton Principal' },
        { key: 'hero_cta_secondary', value: 'Découvrir le Labo', label: 'Bouton Secondaire' }
    ];

    for (const item of keys) {
        const { data } = await supabase.from('site_content').select('*').eq('key', item.key).single();
        if (!data) {
            console.log(`Inserting: ${item.key}`);
            const { error } = await supabase.from('site_content').insert([item]);
            if (error) console.error(`Error inserting ${item.key}:`, error);
        } else {
            console.log(`Exists: ${item.key}`);
        }
    }
}

checkAndSeed();
