import { createClient } from "@supabase/supabase-js";
import dotenv from "dotenv";
dotenv.config({ path: ".env.local" });

const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

async function check() {
    const { data, error } = await supabase
        .from('articles')
        .select('id, title, content, excerpt, cta')
        .eq('cta', '/outils/calculateur-1rm');

    if (error) {
        console.error(error);
        process.exit(1);
    }

    console.log('Found:', data.length, 'articles');
    data.forEach(a => {
        console.log(`ID: ${a.id}, Title: ${a.title}, Content Length: ${a.content?.length || 0}`);
    });
}

check();
