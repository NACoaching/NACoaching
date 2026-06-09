import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

export async function GET(req) {
    const { searchParams } = new URL(req.url);
    if (searchParams.get('token') !== 'na-coaching-secret-update-2026') {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    try {
        const supabaseAdmin = createClient(
            process.env.NEXT_PUBLIC_SUPABASE_URL,
            process.env.SUPABASE_SERVICE_ROLE_KEY
        );

        // 1. Update ACWR tool subcategory to 'Récupération'
        const { data: d1, error: e1 } = await supabaseAdmin
            .from('articles')
            .update({ subcategory: 'Récupération' })
            .eq('cta', '/outils/acwr')
            .select();

        // 2. Update readiness (score-recuperation) tool subcategory to 'Récupération'
        const { data: d2, error: e2 } = await supabaseAdmin
            .from('articles')
            .update({ subcategory: 'Récupération' })
            .eq('cta', '/outils/score-recuperation')
            .select();

        return NextResponse.json({
            success: true,
            acwr: { data: d1, error: e1 },
            readiness: { data: d2, error: e2 }
        });
    } catch (err) {
        return NextResponse.json({ error: err.message }, { status: 500 });
    }
}
