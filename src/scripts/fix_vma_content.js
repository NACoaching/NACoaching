const { createClient } = require('@supabase/supabase-js');

async function fixArticleCta() {
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  );

  // Set the CTA of the "Courir à Jeun" article to null so it doesn't hijack the tool page
  const { data, error } = await supabase
    .from('articles')
    .update({ cta: null })
    .eq('id', 17);

  if (error) {
    console.error('Error fixing article 17:', error);
  } else {
    console.log('Successfully fixed article 17 (removed incorrect CTA).');
  }
}

fixArticleCta();
