const { createClient } = require('@supabase/supabase-js');

async function comprehensiveDebug() {
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  );

  console.log('--- Checking Articles with CTA /outils/vma-vo2 ---');
  const { data: articles } = await supabase
    .from('articles')
    .select('id, title, cta, slug, category')
    .eq('cta', '/outils/vma-vo2');
  console.table(articles);

  console.log('\n--- Checking site_content for VMA keys ---');
  const { data: siteContent } = await supabase
    .from('site_content')
    .select('key, value')
    .or('key.ilike.%vma%,key.ilike.%jeun%');
  console.table(siteContent);

  // If ID 17 still has the CTA, we MUST change it.
  // Maybe it's NOT ID 17? Or maybe there are more.
}

comprehensiveDebug();
