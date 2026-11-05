import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { revalidatePath } from 'next/cache';
import { UPDATED_ARTICLES } from '@/data/internal_links_data';

const TOOL_SEO_UPDATES = [
    {
        id: 46,
        toolId: 'demi',
        slug: '/outils/test-demi-cooper',
        title: 'Test Demi-Cooper : Calcule ta VMA en 6 min (Tableau Gratuit)',
        meta_desc: "Calculez votre VMA et VO2max avec le test Demi-Cooper (6 min). Barème officiel de performance, tableau d'allures et protocole complet par un coach EOPS."
    },
    {
        id: 44,
        toolId: 'rpe',
        slug: '/outils/rpe-1rm',
        title: 'Tableau RPE Musculation & Convertisseur RIR (Échelle 1 à 10)',
        meta_desc: "Tableau RPE complet et convertisseur RIR en pourcentage du 1RM. Estimez vos charges d'entraînement et autorégulez vos séances sans échec musculaire."
    },
    {
        id: 8,
        toolId: '1rm',
        slug: '/outils/calculateur-1rm',
        title: 'Calculateur 1RM Musculation : Formules Brzycki & Epley',
        meta_desc: "Calculez votre charge maximale (1RM) avec les formules Brzycki et Epley. Tableau des pourcentages et calcul immédiat pour planifier vos cycles de force."
    },
    {
        id: 18,
        toolId: 'acwr',
        slug: '/outils/acwr',
        title: 'Calculateur ACWR Gratuit : Ratio Charge & Prévention Blessure',
        meta_desc: "Calculez votre ratio ACWR (charge aiguë sur chronique). Identifiez la zone optimale (Sweet Spot) et évitez le surentraînement grâce à un suivi précis."
    },
    {
        id: 47,
        toolId: 'pred',
        slug: '/outils/predictateur-performance',
        title: 'Prédicteur de Course : Formule de Riegel (10km, Semi, Marathon)',
        meta_desc: "Prédisez vos chronos sur 10 km, semi-marathon et marathon grâce à la formule de Riegel. Estimation fiable du temps de passage et calcul des allures cibles."
    },
    {
        id: 9,
        toolId: 'calories',
        slug: '/outils/besoins-caloriques',
        title: 'Calculateur TDEE Gratuit : Calories Journalières & Métabolisme',
        meta_desc: "Calculez gratuitement votre dépense énergétique totale (TDEE) et votre métabolisme de base. Ajustez votre apport calorique exact pour sécher ou prendre du muscle."
    },
    {
        id: 11,
        toolId: 'hr',
        slug: '/outils/frequence-cardiaque',
        title: 'Formule de Karvonen : Calculateur Zones Cardio en Ligne',
        meta_desc: "Calculez vos 5 zones de fréquence cardiaque avec la formule de Karvonen (FC Réserve). Optimisez votre endurance fondamentale et vos séances sans approximations."
    }
];

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
        const seoResults = [];

        // 1. Mise à jour du maillage interne dans articles
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

        // 2. Mise à jour des titres & descriptions SEO dans articles et site_content
        for (const tool of TOOL_SEO_UPDATES) {
            // Mettre à jour la table articles
            const { error: artErr } = await supabaseAdmin
                .from('articles')
                .update({ title: tool.title, excerpt: tool.meta_desc })
                .eq('id', tool.id);

            // Upsert dans site_content pour compatibilité maximale avec la colonne label requise
            const siteContentItems = [
                { key: `article_${tool.id}_seo_title`, value: tool.title, label: `SEO Title: ${tool.title}` },
                { key: `article_${tool.id}_seo_desc`, value: tool.meta_desc, label: `SEO Desc: ${tool.title}` },
                { key: `tool_${tool.toolId}_title`, value: tool.title, label: `Titre Outil: ${tool.title}` },
                { key: `tool_${tool.toolId}_meta_desc`, value: tool.meta_desc, label: `Meta Desc Outil: ${tool.title}` }
            ];

            const { error: scErr } = await supabaseAdmin
                .from('site_content')
                .upsert(siteContentItems, { onConflict: 'key' });

            seoResults.push({
                id: tool.id,
                slug: tool.slug,
                articles_updated: !artErr,
                site_content_updated: !scErr,
                errors: [artErr?.message, scErr?.message].filter(Boolean)
            });
        }

        // 3. Revalidation des pages de cache
        try {
            revalidatePath('/blog/[slug]', 'page');
            revalidatePath('/outils/[slug]', 'page');
            revalidatePath('/outils/test-demi-cooper', 'page');
            revalidatePath('/outils/rpe-1rm', 'page');
            revalidatePath('/outils/calculateur-1rm', 'page');
            revalidatePath('/outils/acwr', 'page');
            revalidatePath('/outils/predictateur-performance', 'page');
            revalidatePath('/outils/besoins-caloriques', 'page');
            revalidatePath('/outils/frequence-cardiaque', 'page');
            revalidatePath('/outils', 'page');
            revalidatePath('/labo', 'page');
            revalidatePath('/', 'page');
        } catch (revErr) {
            console.warn('Revalidation warning:', revErr);
        }

        const successCount = results.filter(r => r.success).length;
        const seoSuccessCount = seoResults.filter(r => r.articles_updated).length;

        return NextResponse.json({
            success: true,
            internal_links_updated: successCount,
            seo_tools_updated: seoSuccessCount,
            seo_details: seoResults,
            total_articles: Object.keys(UPDATED_ARTICLES).length
        });
    } catch (err) {
        return NextResponse.json({ error: err.message }, { status: 500 });
    }
}
