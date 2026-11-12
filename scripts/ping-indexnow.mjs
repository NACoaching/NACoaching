import { createClient } from '@supabase/supabase-js';

async function pingIndexNow() {
  try {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

    if (!supabaseUrl || !supabaseKey) {
      console.log('[IndexNow] Supabase credentials not found in env, skipping build ping.');
      return;
    }

    const supabase = createClient(supabaseUrl, supabaseKey);
    const { data: articles } = await supabase
      .from('articles')
      .select('id, slug')
      .eq('is_published', true);

    const HOST = 'www.na-coaching.com';
    const INDEXNOW_KEY = 'd67e8912a4b54c0389fe123456789abc';
    const KEY_LOCATION = `https://${HOST}/${INDEXNOW_KEY}.txt`;
    const baseUrl = `https://${HOST}`;

    const urls = [
      baseUrl,
      `${baseUrl}/coach`,
      `${baseUrl}/labo`,
      `${baseUrl}/boutique`,
      `${baseUrl}/contact`,
      ...(articles || []).map((a) => `${baseUrl}/blog/${a.slug || a.id}`),
    ];

    console.log(`[IndexNow] Submitting ${urls.length} URLs to Bing & IndexNow for ${HOST}...`);

    const payload = {
      host: HOST,
      key: INDEXNOW_KEY,
      keyLocation: KEY_LOCATION,
      urlList: urls,
    };

    const res = await fetch('https://api.indexnow.org/indexnow', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json; charset=utf-8',
      },
      body: JSON.stringify(payload),
    });

    console.log(`[IndexNow] Done! Status: ${res.status} (${urls.length} URLs submitted)`);
  } catch (err) {
    console.warn(`[IndexNow] Warning: Could not ping IndexNow during build:`, err.message);
  }
}

pingIndexNow();
