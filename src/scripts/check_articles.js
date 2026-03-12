import { createClient } from '@supabase/supabase-js';
import * as dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

async function checkArticles() {
  const { data, error } = await supabase.from('articles').select('id, slug, category, cta');
  if (error) {
    console.error(error);
    process.exit(1);
  }
  
  let issues = 0;
  for (const article of data) {
    if (article.category === 'Outils') {
        if (!article.cta) {
            console.log(`Tool with no CTA: ${article.slug} (ID: ${article.id})`);
            issues++;
        } else if (article.cta.includes('http') || !article.cta.startsWith('/outils/')) {
            console.log(`Tool with unusual CTA: ${article.slug} (ID: ${article.id}) -> ${article.cta}`);
            issues++;
        }
    }
    
    // Check if slug is numeric
    if (/^\d+$/.test(article.slug)) {
        console.log(`Article with purely numeric slug: ${article.slug} (ID: ${article.id})`);
        issues++;
    }
    
    // Check if slug == id string
    if (article.slug === String(article.id)) {
        console.log(`Article where slug == id: ${article.slug}`);
        issues++;
    }
  }
  console.log(`Found ${issues} potential issues.`);
}

checkArticles();
