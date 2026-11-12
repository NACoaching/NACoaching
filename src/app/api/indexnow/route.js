import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabaseClient';

export async function POST(request) {
  try {
    const authHeader = request.headers.get('authorization');
    const urlObj = new URL(request.url);
    const secret = urlObj.searchParams.get('secret') || authHeader?.replace('Bearer ', '');

    const INDEXNOW_KEY = 'd67e8912a4b54c0389fe123456789abc';
    const HOST = 'www.na-coaching.com';
    const KEY_LOCATION = `https://${HOST}/${INDEXNOW_KEY}.txt`;

    if (secret !== INDEXNOW_KEY && process.env.NODE_ENV === 'production' && secret !== process.env.INDEXNOW_SECRET) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const baseUrl = `https://${HOST}`;

    // Fetch published articles
    const { data: articles } = await supabase
      .from('articles')
      .select('id, slug, category')
      .eq('is_published', true);

    const urls = [
      baseUrl,
      `${baseUrl}/coach`,
      `${baseUrl}/labo`,
      `${baseUrl}/boutique`,
      `${baseUrl}/contact`,
      ...(articles || []).map((a) => `${baseUrl}/blog/${a.slug || a.id}`),
    ];

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

    return NextResponse.json({
      success: true,
      status: res.status,
      message: `Submitted ${urls.length} URLs to IndexNow`,
      urlsCount: urls.length,
    });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function GET() {
  return NextResponse.json({
    site: 'NA Coaching',
    endpoint: 'IndexNow Instant Search Indexing',
    documentation: 'https://www.indexnow.org',
    keyLocation: 'https://www.na-coaching.com/d67e8912a4b54c0389fe123456789abc.txt',
  });
}
