const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });
const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY);
async function run() {
  const { data: article } = await supabase.from('articles').select('content').eq('cta', '/outils/convertisseur-vitesse').single();
  const { data: override } = await supabase.from('site_content').select('value').eq('key', 'tool_speed_content').single();
  console.log("Article content length:", article?.content?.length);
  console.log("Article content preview:", article?.content?.substring(0, 50));
  console.log("Override content length:", override?.value?.length);
  console.log("Override exists:", !!override);
}
run();
