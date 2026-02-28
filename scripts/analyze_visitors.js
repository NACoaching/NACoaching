import { createClient } from "@supabase/supabase-js";
import dotenv from "dotenv";
dotenv.config({ path: ".env.local" });

const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

async function analyzeViews() {
    const { data, error } = await supabase
        .from('page_views')
        .select('visitor_id, created_at');

    if (error) {
        console.error(error);
        return;
    }

    const visitorStats = {};
    data.forEach(v => {
        if (!v.visitor_id) return;
        if (!visitorStats[v.visitor_id]) {
            visitorStats[v.visitor_id] = { count: 0, first: v.created_at, last: v.created_at };
        }
        visitorStats[v.visitor_id].count++;
        if (new Date(v.created_at) < new Date(visitorStats[v.visitor_id].first)) visitorStats[v.visitor_id].first = v.created_at;
        if (new Date(v.created_at) > new Date(visitorStats[v.visitor_id].last)) visitorStats[v.visitor_id].last = v.created_at;
    });

    const sortedVisitors = Object.entries(visitorStats)
        .sort((a, b) => b[1].count - a[1].count);

    console.log('Top Visitors:');
    sortedVisitors.slice(0, 20).forEach(([id, stats]) => {
        const durationMs = new Date(stats.last) - new Date(stats.first);
        const durationMin = Math.round(durationMs / 60000);
        console.log(`ID: ${id}, Views: ${stats.count}, Duration: ${durationMin} min, Start: ${stats.first}`);
    });
}

analyzeViews();
