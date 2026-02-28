import { createClient } from "@supabase/supabase-js";
import dotenv from "dotenv";
dotenv.config({ path: ".env.local" });

const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

async function analyze() {
    const { data, error } = await supabase
        .from('page_views')
        .select('visitor_id, created_at, page_path')
        .order('created_at', { ascending: false });

    if (error) {
        console.error(error);
        return;
    }

    const visitorGroups = {};
    data.forEach(v => {
        const id = v.visitor_id || 'NULL';
        if (!visitorGroups[id]) {
            visitorGroups[id] = { count: 0, pages: new Set(), first: v.created_at, last: v.created_at };
        }
        visitorGroups[id].count++;
        visitorGroups[id].pages.add(v.page_path);
        if (new Date(v.created_at) < new Date(visitorGroups[id].first)) visitorGroups[id].first = v.created_at;
        if (new Date(v.created_at) > new Date(visitorGroups[id].last)) visitorGroups[id].last = v.created_at;
    });

    const summary = Object.entries(visitorGroups)
        .map(([id, stats]) => ({
            id,
            count: stats.count,
            uniquePages: stats.pages.size,
            durationMin: Math.round((new Date(stats.last) - new Date(stats.first)) / 60000),
            lastSeen: stats.last
        }))
        .sort((a, b) => b.count - a.count);

    console.log(JSON.stringify(summary.slice(0, 50), null, 2));
}

analyze();
