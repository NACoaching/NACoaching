const { createClient } = require('@supabase/supabase-js');

async function checkArticles() {
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  );

  const { data, error } = await supabase
    .from('articles')
    .select('id, title, category, cta, slug')
    .eq('category', 'Outils')
    .order('id', { ascending: true });

  if (error) {
    console.error('Error:', error);
    return;
  }

  console.log('--- Tool Articles ---');
  console.table(data);

  const { data: vmaArticle, error: vmaError } = await supabase
    .from('articles')
    .select('*')
    .eq('cta', '/outils/vma-vo2');

  if (vmaError) {
    console.error('VMA Error:', vmaError);
  } else {
    console.log('\n--- Article(s) matching /outils/vma-vo2 ---');
    vmaArticle.forEach(a => {
        console.log(`ID: ${a.id}, Title: ${a.title}, Slug: ${a.slug}, CTA: ${a.cta}`);
    });
  }
}

checkArticles();
