import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
    console.error('Missing env vars');
    process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function fix() {
    console.log('Inserting content...');
    // Upsert to force update/insert
    const { data, error } = await supabase.from('site_content').upsert([
        { key: 'expert_box_title', label: 'Titre Boîte Expert', value: "L'avis du Master EOPS" },
        { key: 'expert_box_text', label: 'Texte Boîte Expert', value: "En tant que professionnel, je vous conseille de ne jamais ignorer une douleur asymétrique." }
    ], { onConflict: 'key' }).select();

    if (error) {
        console.error('Error upserting:', error);
    } else {
        console.log('Upsert success:', data);
    }
}

fix();
