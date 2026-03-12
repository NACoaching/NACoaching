import Link from 'next/link';
import HomeFAQ from '@/components/HomeFAQ';
import { ChevronLeft, Info, ShoppingBag } from 'lucide-react';
import AffiliateCard from "@/components/AffiliateCard";
import RacePredictor from '@/components/tools/RacePredictor';
import { getToolArticle, getToolRelatedArticles } from '@/lib/getToolArticle';
import RelatedArticles from '@/components/RelatedArticles';
import RelatedTools from '@/components/RelatedTools';
import ToolArticleContent from '@/components/ToolArticleContent';
import { supabase } from '@/lib/supabaseClient';

export const revalidate = 0;

export async function generateMetadata() {
    const article = await getToolArticle('/outils/predictateur-performance');
    return {
        title: `${article.title || 'Prédicteur de Performance Running — 5km, 10km, Semi & Marathon'} | NA Coaching`,
        description: article.intro || "Prédisez vos temps sur 5km, 10km, Semi-Marathon et Marathon à partir d'un chrono de référence. Formule de Riegel pour vos objectifs course à pied.",
        authors: [{ name: 'NA Coaching (Master EOPS)', url: 'https://www.na-coaching.com' }],
        openGraph: {
            title: article.title || 'Prédicteur de Performance Running',
            description: article.intro || "Prédisez vos temps de course sur toutes les distances.",
            images: [article.image || '/logo.png'],
            type: 'website',
        },
        alternates: { canonical: 'https://www.na-coaching.com/outils/predictateur-performance' },
    };
}

const DEFAULT_FAQ_DATA = [
    {
        question: "Comment prédire son temps de course sur une autre distance ?",
        answer: "Le prédicteur de performance utilise votre temps sur une distance connue (ex : 10 km en 50 min) pour estimer vos temps sur d'autres distances (5 km, semi-marathon, marathon). Les modèles tiennent compte du facteur de fatigue et de la baisse de vitesse inhérente aux distances plus longues."
    },
    {
        question: "Les prédicteurs de temps de course sont-ils fiables ?",
        answer: "Les prédictions sont fiables à ±2-5% si vous avez un entraînement adapté à la distance cible. Les écarts sont plus grands pour le marathon si votre référence est un 5 km, car le marathon requiert une endurance spécifique que la performance sur courte distance ne reflète pas entièrement."
    },
    {
        question: "Quel temps au 10 km pour courir un marathon en 3h30 ?",
        answer: "Pour un marathon en 3h30, il faut typiquement courir le 10 km autour de 45-47 minutes. Cela correspond à une VMA d'environ 16 km/h. L'entraînement spécifique marathon (sorties longues, travail au seuil) est ensuite indispensable pour transformer ce potentiel en performance le jour J."
    },
    {
        question: "Comment utiliser le prédicteur pour planifier une compétition ?",
        answer: "Entrez votre meilleur temps récent (moins de 6 semaines) sur n'importe quelle distance. Le prédicteur affiche vos temps estimés sur les distances courantes. Utilisez le temps de la distance cible pour déterminer votre allure de course, puis entraînez-vous spécifiquement à cette allure."
    },
    {
        question: "Pourquoi mon temps réel diffère-t-il de la prédiction ?",
        answer: "Plusieurs facteurs influencent le résultat le jour J : condition météo (chaleur, vent), dénivelé du parcours, gestion de l'alimentation, hydratation, qualité du sommeil la veille, et surtout votre stratégie de course (partir trop vite est l'erreur n°1). Le prédicteur donne un potentiel théorique, l'exécution dépend de vous."
    }
];

export default async function RacePredictorPage() {
    const article = await getToolArticle('/outils/predictateur-performance');
    const relatedArticles = await getToolRelatedArticles(article);

    let faqData = DEFAULT_FAQ_DATA;
    const { data: faqItem } = await supabase.from('site_content').select('value').eq('key', 'tool_predictor_faq').single();
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
        "name": article.title || "Prédicteur de Performance Running",
        "description": article.intro,
        "applicationCategory": "FitnessApplication",
        "operatingSystem": "Web"
    };

    return (
        <div className="min-h-screen bg-zinc-50 pt-32 pb-20">
            <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
            <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }} />

            <div className="max-w-7xl mx-auto px-6">
                <Link href="/outils" className="inline-flex items-center gap-2 text-zinc-600 hover:text-[#FF6B00] transition mb-8 group font-bold uppercase text-xs">
                    <ChevronLeft size={16} className="group-hover:-translate-x-1 transition-transform" /> Retour aux outils
                </Link>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-16">
                    <div className="lg:col-span-12">
                        <RacePredictor hints={article.tool_hints} />
                    </div>

                    <div className="lg:col-span-5">
                        <div className="prose prose-zinc max-w-none">
                            <h1 className="text-4xl font-black uppercase mb-6 leading-tight">
                                {article.title || "Prédicteur de Performance"}
                            </h1>
                            <p className="text-zinc-800 font-medium text-lg mb-8 leading-relaxed">
                                {article.intro}
                            </p>
                            <div className="h-px bg-zinc-200 mb-8" />
                            <ToolArticleContent content={article.content} glossary={article.auto_links} currentPath={article.current_path} />
                        </div>
                    </div>
                </div>

                {/* AFFILIATE SECTION (RESTORED STYLE) */}
                {article.affiliate_link && (
                    <div className="mt-12 border-t border-zinc-200 pt-12 text-left flex flex-col items-center">
                        <div className="flex items-center gap-2 mb-8">
                            <Info size={16} className="text-[#FF6B00]" />
                            <h4 className="text-sm font-black uppercase tracking-wider text-zinc-700 font-bold">Expertise Matériel</h4>
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

                <RelatedTools currentTool="predictateur-performance" />

                {/* Related Articles */}
                <RelatedArticles
                    articles={relatedArticles}
                    title={article.related_title}
                    subtitle={article.related_subtitle}
                />
            </div>
            <div className="bg-white">
                {faqData && faqData.length > 0 && (
                    <HomeFAQ faqData={faqData} title="Questions Fréquentes sur les Prédictions Running" id="faq-predictor" />
                )}
            </div>
        </div>
    );
}
