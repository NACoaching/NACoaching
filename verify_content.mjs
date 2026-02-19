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

async function verify() {
    const { data, error } = await supabase.from('site_content').select('*').order('key');
    if (error) {
        console.error('Error fetching site_content:', error);
        return;
    }
    
    // Check for expert box keys specifically
    const experts = data.filter(d => d.key.startsWith('expert_box_'));
    console.log('--- FOUND EXPERT BOX KEYS ---');
    experts.forEach(e => console.log(`Key: ${e.key}, Value: ${e.value}`));
    
    if (experts.length === 0) {
        console.log('NO EXPERT BOX KEYS FOUND.');
        // Attempt insert again if verify fails? Better to just report status first.
    }
}

verify();
