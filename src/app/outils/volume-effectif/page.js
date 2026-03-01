import Link from 'next/link';
import HomeFAQ from '@/components/HomeFAQ';
import { ChevronLeft, ShoppingBag, Info } from 'lucide-react';
import AffiliateCard from "@/components/AffiliateCard";
import EffectiveVolume from '@/components/tools/EffectiveVolume';
import { getToolArticle, getToolRelatedArticles } from '@/lib/getToolArticle';
import RelatedArticles from '@/components/RelatedArticles';
import RelatedTools from '@/components/RelatedTools';
import ToolArticleContent from '@/components/ToolArticleContent';
import { supabase } from '@/lib/supabaseClient';

export const revalidate = 0;

export async function generateMetadata() {
    const article = await getToolArticle('volume-effectif');
    return {
        title: `${article.title || 'Calculateur Volume Effectif — Séries par Muscle'} | NA Coaching`,
        description: article.intro || "Calculez votre volume d'entraînement hebdomadaire par groupe musculaire. Identifiez vos zones de maintenance, de progression et de sur-reaching.",
        authors: [{ name: 'NA Coaching (Master EOPS)', url: 'https://na-coaching.com' }],
        openGraph: {
            title: article.title || 'Calculateur Volume Effectif',
            description: article.intro || "Optimisez vos séries par muscle pour l'hypertrophie.",
            images: [article.image || '/logo.png'],
            type: 'website',
        },
        alternates: { canonical: '/outils/volume-effectif' },
    };
}

const DEFAULT_FAQ_DATA = [
    {
        question: "C'est quoi le volume effectif d'entraînement en musculation ?",
        answer: "Le volume effectif désigne le nombre de séries 'stimulantes' réalisées par groupe musculaire par semaine — c'est-à-dire les séries suffisamment proches de l'échec pour déclencher une adaptation (généralement RPE 7+). Les séries d'échauffement et les séries trop faciles ne comptent pas."
    },
    {
        question: "Combien de séries par semaine par groupe musculaire pour progresser ?",
        answer: "Les recommandations scientifiques sont : 10 à 20 séries effectives par groupe musculaire par semaine pour l'hypertrophie. Les débutants progressent avec 10-12 séries, les intermédiaires avec 12-16 séries, et les avancés peuvent nécessiter 16-20+ séries. Au-delà, les bénéfices diminuent."
    },
    {
        question: "Comment répartir le volume d'entraînement sur la semaine ?",
        answer: "Il est plus efficace de répartir le volume sur 2 à 3 séances par groupe musculaire plutôt que tout concentrer en une seule séance. Par exemple, 16 séries de pectoraux = 2 séances de 8 séries (ex : lundi et jeudi). Cela améliore la qualité des séries et optimise la synthèse protéique."
    },
    {
        question: "C'est quoi le MRV et le MEV en musculation ?",
        answer: "Le MEV (Minimum Effective Volume) est le volume minimum pour stimuler la croissance musculaire (souvent 6-8 séries/semaine). Le MRV (Maximum Recoverable Volume) est le volume maximal que vous pouvez supporter sans compromettre la récupération (souvent 20-25 séries/semaine). Entraînez-vous entre les deux."
    },
    {
        question: "Comment savoir si je fais trop ou pas assez de volume ?",
        answer: "Signes de volume insuffisant : aucune courbature, aucune progression des charges, pas de congestion (pump) pendant l'entraînement. Signes de volume excessif : fatigue chronique, douleurs articulaires, régression des performances, troubles du sommeil. Notre outil vous aide à trouver le juste milieu."
    }
];

export default async function VolumePage() {
    const article = await getToolArticle('volume-effectif');
    const relatedArticles = await getToolRelatedArticles(article);

    let faqData = DEFAULT_FAQ_DATA;
    const { data: faqItem } = await supabase.from('site_content').select('value').eq('key', 'tool_volume_faq').single();
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
                <Link href="/outils" className="inline-flex items-center gap-2 text-zinc-600 hover:text-[#FF6B00] transition mb-8 group font-bold uppercase text-xs">
                    <ChevronLeft size={16} className="group-hover:-translate-x-1 transition-transform" /> Retour aux outils
                </Link>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-16">
                    <div className="lg:col-span-8">
                        <EffectiveVolume hints={article.tool_hints} />
                    </div>

                    <div className="lg:col-span-4">
                        <div className="prose prose-zinc max-w-none">
                            <h1 className="text-4xl font-black uppercase mb-6 leading-tight">
                                {article.title || "Calculateur de Volume Effectif"}
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

                <RelatedTools currentTool="volume-effectif" />

                {/* Related Articles */}
                <RelatedArticles
                    articles={relatedArticles}
                    title={article.related_title}
                    subtitle={article.related_subtitle}
                />
            </div>
            <div className="bg-white">
                {faqData && faqData.length > 0 && (
                    <HomeFAQ faqData={faqData} title="Questions Fréquentes sur le Volume d'Entraînement" id="faq-volume" />
                )}
            </div>
        </div>
    );
}
