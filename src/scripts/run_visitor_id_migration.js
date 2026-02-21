const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

const sql = `
ALTER TABLE page_views ADD COLUMN IF NOT EXISTS visitor_id TEXT;
CREATE INDEX IF NOT EXISTS idx_page_views_visitor_id ON page_views(visitor_id);
`;

async function runMigration() {
    console.log('Running migration...');
    const { error } = await supabase.rpc('run_sql', { sql_query: sql });

    if (error) {
        // If RPC isn't available, we might need to handle it or just inform the user
        console.error('Migration failed (RPC run_sql might not be enabled):', error);
        console.log('Please run the following SQL in your Supabase Dashboard:');
        console.log(sql);
    } else {
        console.log('Migration successful!');
    }
}

runMigration();
