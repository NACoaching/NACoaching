import { createClient } from "@supabase/supabase-js";
import dotenv from "dotenv";
dotenv.config({ path: ".env.local" });

const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

async function testRLS() {
    const dummyId = 'test-rls-' + Date.now();
    console.log('Inserting dummy row...');
    const { error: insErr } = await supabase.from('page_views').insert([{ page_path: '/test-rls', visitor_id: dummyId }]);
    if (insErr) {
        console.error('Insert Error:', insErr);
    } else {
        console.log('Insert successful.');
    }

    console.log('Selecting rows...');
    const { data, error: selErr } = await supabase.from('page_views').select('*').limit(5);
    if (selErr) {
        console.error('Select Error:', selErr);
    } else {
        console.log('Select Data:', data);
    }
}

testRLS();
