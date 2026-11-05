import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { revalidatePath } from 'next/cache';
import { UPDATED_ARTICLES } from '@/data/internal_links_data';

export async function GET(req) {
    const { searchParams } = new URL(req.url);
    const token = searchParams.get('token');

    if (token !== 'na-coaching-secret-update-2026') {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    try {
        const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
        const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

        if (!supabaseUrl || !serviceKey) {
            return NextResponse.json(
                { error: 'Missing SUPABASE_SERVICE_ROLE_KEY in environment' },
                { status: 500 }
            );
        }

        const supabaseAdmin = createClient(supabaseUrl, serviceKey);
        const results = [];

        for (const [idStr, newContent] of Object.entries(UPDATED_ARTICLES)) {
            const articleId = parseInt(idStr, 10);

            const { data, error } = await supabaseAdmin
                .from('articles')
                .update({ content: newContent })
                .eq('id', articleId)
                .select('id, slug, cta, title');

            if (error) {
                console.error(`Error updating article ${articleId}:`, error);
                results.push({ id: articleId, success: false, error: error.message });
            } else {
                results.push({ id: articleId, success: true, article: data?.[0] });
            }
        }

        // Revalidate blog and tool pages
        try {
            revalidatePath('/blog/[slug]', 'page');
            revalidatePath('/outils/[slug]', 'page');
            revalidatePath('/outils', 'page');
            revalidatePath('/labo', 'page');
            revalidatePath('/', 'page');
        } catch (revErr) {
            console.warn('Revalidation warning:', revErr);
        }

        const successCount = results.filter(r => r.success).length;

        return NextResponse.json({
            success: true,
            message: `${successCount} articles mis à jour avec le maillage interne SEO`,
            total: Object.keys(UPDATED_ARTICLES).length,
            details: results
        });
    } catch (err) {
        return NextResponse.json({ error: err.message }, { status: 500 });
    }
}
