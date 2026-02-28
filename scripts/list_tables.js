import { createClient } from "@supabase/supabase-js";
import dotenv from "dotenv";
dotenv.config({ path: ".env.local" });

const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

async function listTables() {
    const { data, error } = await supabase.rpc('get_tables'); // This might not work if RPC is not defined
    if (error) {
        // Fallback: try to select from likely candidates
        const tables = ['page_views', 'analytics', 'stats', 'visitors'];
        for (const t of tables) {
            const { count, error: e } = await supabase.from(t).select('*', { count: 'exact', head: true });
            console.log(`Table ${t}: ${count} rows`, e ? `(Error: ${e.message})` : '');
        }
    } else {
        console.log(data);
    }
}

listTables();
