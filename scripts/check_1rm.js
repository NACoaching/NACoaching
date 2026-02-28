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
        .select('id, title, content, excerpt, cta, tool_hints')
        .eq('cta', '/outils/calculateur-1rm');

    if (error) {
        console.error(error);
        process.exit(1);
    }

    console.log(JSON.stringify(data, null, 2));
}

check();
