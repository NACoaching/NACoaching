import Link from 'next/link';
import HomeFAQ from '@/components/HomeFAQ';
import { ChevronLeft, ShoppingBag, Info } from 'lucide-react';
import AffiliateCard from "@/components/AffiliateCard";
import HalfCooperTest from '@/components/tools/HalfCooperTest';
import { getToolArticle, getToolRelatedArticles } from '@/lib/getToolArticle';
import RelatedArticles from '@/components/RelatedArticles';
import RelatedTools from '@/components/RelatedTools';
import ToolArticleContent from '@/components/ToolArticleContent';
import Breadcrumb from '@/components/Breadcrumb';
import { supabase } from '@/lib/supabaseClient';

export const dynamic = 'force-dynamic';

export async function generateMetadata() {
    const article = await getToolArticle('/outils/test-demi-cooper');
    const displayTitle = article.title || 'Test Demi-Cooper';
    const seoTitle = article.seo_title || displayTitle;
    const description = article.meta_desc || article.intro || 'Calculez votre VMA avec le Test Demi-Cooper (6 min).';

    return {
        title: seoTitle.includes('NA Coaching') ? seoTitle : `${seoTitle} | NA Coaching`,
        description: article.meta_desc || article.intro || "Évaluez votre VMA et votre VO2max avec le test du demi-Cooper (6 minutes). Obtenez vos allures d'entraînement personnalisées pour le running.",
        authors: [{ name: 'NA Coaching (Master EOPS)', url: 'https://www.na-coaching.com/' }],
        openGraph: {
            title: article.title || 'Test Demi-Cooper (6 min)',
            description: article.meta_desc || article.intro || "Évaluez votre VMA et VO2max avec un test terrain simple.",
            images: [article.image || '/logo.png'],
            type: 'website',
        },
        alternates: { canonical: 'https://www.na-coaching.com/outils/test-demi-cooper/' },
    };
}

const DEFAULT_FAQ_DATA = [
    {
        question: "C'est quoi le test Demi-Cooper et comment le faire ?",
        answer: "Le test Demi-Cooper consiste à courir la plus grande distance possible en 6 minutes. Échauffez-vous 10 minutes, puis courez à allure maximale régulière pendant 6 minutes sur terrain plat. La distance parcourue permet d'estimer votre VMA avec la formule : VMA = distance (m) / 6 × 60 / 1000."
    },
    {
        question: "Quelle est la différence entre le test de Cooper et le Demi-Cooper ?",
        answer: "Le test de Cooper dure 12 minutes, le Demi-Cooper dure 6 minutes. Le Demi-Cooper est plus adapté aux sportifs non-spécialistes de course à pied car il est moins éprouvant mentalement et physiquement. Les deux tests donnent une estimation de la VMA et de la VO2max."
    },
    {
        question: "Quelle distance est bonne au Demi-Cooper selon le niveau ?",
        answer: "Au test Demi-Cooper (6 minutes) : moins de 1200m correspond à un débutant, 1200-1500m à un niveau intermédiaire, 1500-1800m à un bon sportif et plus de 1800m à un athlète entraîné. Ces distances correspondent à des VMA de 12 à 18+ km/h."
    },
    {
        question: "Faut-il s'échauffer avant le test Demi-Cooper ?",
        answer: "Un échauffement de 10 à 15 minutes est indispensable : footing léger, gammes de course, puis 2-3 accélérations progressives. Un bon échauffement améliore le résultat du test de 3 à 5% et réduit considérablement le risque de blessure musculaire."
    },
    {
        question: "À quelle fréquence refaire le test Demi-Cooper ?",
        answer: "Répétez le test toutes les 6 à 8 semaines pour suivre votre progression. Faites-le toujours dans les mêmes conditions (même terrain, même moment de la journée, après un échauffement similaire) pour que les résultats soient comparables. C'est un excellent indicateur de votre forme aérobie."
    }
];

export default async function DemiCooperPage() {
    const article = await getToolArticle('/outils/test-demi-cooper');
    const relatedArticles = await getToolRelatedArticles(article);

    let faqData = DEFAULT_FAQ_DATA;
    const { data: faqItem } = await supabase.from('site_content').select('value').eq('key', 'tool_cooper_faq').single();
    if (faqItem && faqItem.value) {
        try {
            const parsed = JSON.parse(faqItem.value);
            if (parsed && parsed.length > 0) faqData = parsed;
        } catch (e) { console.error("Error parsing FAQ", e); }
    }

    const faqJsonLd = {
        '@context': 'https://schema.org',
        '@type': 'FAQPage',
        'mainEntity': faqData.map(item => ({
            '@type': 'Question',
            'name': item.question,
            'acceptedAnswer': {
                '@type': 'Answer',
                'text': item.answer
            }
        }))
    };

    const jsonLd = {
        "@context": "https://schema.org",
        "@type": "WebApplication",
        "name": article.title,
        "description": article.intro,
        "applicationCategory": "FitnessApplication",
        "operatingSystem": "Web"
    };

    return (
        <div className="min-h-screen bg-zinc-50 pt-32 pb-20">
            <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
            <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }} />

            <div className="max-w-7xl mx-auto px-6">
                <Breadcrumb items={[
                    { label: 'Accueil', href: '/' },
                    { label: 'Outils', href: '/outils/' },
                    { label: article.title || 'Test Demi-Cooper' }
                ]} />

                <Link href="/outils/" className="inline-flex items-center gap-2 text-zinc-600 hover:text-[#FF6B00] transition mt-8 mb-8 group font-bold uppercase text-xs">
                    <ChevronLeft size={16} className="group-hover:-translate-x-1 transition-transform" /> Retour aux outils
                </Link>

                <div className="max-w-4xl mx-auto">
                    <h1 className="text-3xl md:text-5xl font-bold mb-8 leading-tight text-zinc-950 text-center">
                        {article.title || 'Test Demi-Cooper (6 min)'}
                    </h1>
                    
                    <p className="text-zinc-800 font-medium text-xl mb-12 leading-relaxed text-center">
                        {article.intro || "Calculez votre Vitesse Maximale Aérobie (VMA) et estimez votre VO2max avec précision grâce à ce test de terrain simple et efficace."}
                    </p>

                    <div className="mb-16">
                        <HalfCooperTest hints={article.tool_hints} />
                    </div>

                    <div className="prose prose-zinc max-w-none">
                        <div className="h-px bg-zinc-200 mb-12" />
                        <ToolArticleContent content={article.content} glossary={article.auto_links} currentPath={article.current_path} />
                    </div>
                </div>

                {/* AFFILIATE SECTION (RESTORED STYLE) */}
                {article.affiliate_link && (
                    <div className="mt-12 border-t border-zinc-200 pt-12 text-left flex flex-col items-center">
                        <div className="flex items-center gap-2 mb-8">
                            <Info size={16} className="text-[#FF6B00]" />
                            <h4 className="text-sm font-bold tracking-wider text-zinc-700 font-bold">Expertise Matériel</h4>
                        </div>

                        <div className="max-w-md w-full mx-auto">
                            <AffiliateCard
                                title={article.affiliate_title || article.title}
                                description={article.affiliate_text || "Recommandation d'expert pour optimiser vos résultats."}
                                imageUrl={article.affiliate_image}
                                affiliateUrl={article.affiliate_link}
                                ctaText="Voir le produit"
                                badge="Sélection Coach"
                            />
                        </div>
                    </div>
                )}

                <RelatedTools currentTool="test-demi-cooper" />

                {/* Related Articles */}
                <RelatedArticles
                    articles={relatedArticles}
                    title={article.related_title}
                    subtitle={article.related_subtitle}
                />
            </div>
            <div className="bg-white">
                {faqData && faqData.length > 0 && (
                    <HomeFAQ faqData={faqData} title="Questions Fréquentes sur le Test de VMA" id="faq-vma" />
                )}
            </div>
        </div>
    );
}
