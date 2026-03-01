import Link from 'next/link';
import HomeFAQ from '@/components/HomeFAQ';
import { ChevronLeft, ShoppingBag, Info } from 'lucide-react';
import AffiliateCard from "@/components/AffiliateCard";
import RPEConverter from '@/components/tools/RPEConverter';
import { getToolArticle, getToolRelatedArticles } from '@/lib/getToolArticle';
import RelatedArticles from '@/components/RelatedArticles';
import RelatedTools from '@/components/RelatedTools';
import ToolArticleContent from '@/components/ToolArticleContent';
import { supabase } from '@/lib/supabaseClient';

export const revalidate = 0;

export async function generateMetadata() {
    const article = await getToolArticle('rpe-1rm');
    return {
        title: `${article.title || 'Convertisseur RPE / % 1RM — Intensité & Force'} | NA Coaching`,
        description: article.intro || "Calculez votre intensité relative (% de 1RM) à partir de votre RPE et de vos répétitions. L'outil indispensable pour la force athlétique.",
        authors: [{ name: 'NA Coaching (Master EOPS)', url: 'https://na-coaching.com' }],
        openGraph: {
            title: article.title || 'Convertisseur RPE / % 1RM',
            description: article.intro || "Calculez votre intensité relative pour la force athlétique.",
            images: [article.image || '/logo.png'],
            type: 'website',
        },
        alternates: { canonical: '/outils/rpe-1rm' },
    };
}

const DEFAULT_FAQ_DATA = [
    {
        question: "C'est quoi le RPE en musculation ?",
        answer: "Le RPE (Rate of Perceived Exertion) est une échelle de perception de l'effort de 1 à 10 utilisée en musculation. Un RPE 10 signifie que vous ne pouviez pas faire une répétition de plus (effort maximal). Un RPE 8 signifie qu'il vous restait environ 2 répétitions en réserve (RIR 2)."
    },
    {
        question: "Comment utiliser l'échelle RPE pour programmer ses entraînements ?",
        answer: "Au lieu de travailler avec des pourcentages fixes du 1RM, le RPE permet d'ajuster la charge au jour le jour selon votre forme. Un programme peut prescrire 'Squat 4×5 @ RPE 8', ce qui signifie 4 séries de 5 reps avec une charge laissant 2 reps en réserve. C'est l'autorégulation de l'entraînement."
    },
    {
        question: "Quelle est la différence entre RPE et RIR (Reps In Reserve) ?",
        answer: "Le RIR (Repetitions In Reserve) est le complément du RPE : RPE 10 = RIR 0 (aucune rep en réserve), RPE 9 = RIR 1, RPE 8 = RIR 2, etc. Les deux systèmes expriment la même chose de manière inverse. Notre convertisseur vous permet de passer de l'un à l'autre et d'estimer le pourcentage du 1RM correspondant."
    },
    {
        question: "À quel RPE s'entraîner pour la prise de masse musculaire ?",
        answer: "Pour l'hypertrophie, la plupart des séries de travail devraient se situer entre RPE 7 et RPE 9 (1 à 3 reps en réserve). Un RPE trop bas (<7) ne génère pas assez de tension mécanique, tandis qu'un RPE 10 systématique augmente la fatigue et le risque de blessure sans bénéfice supplémentaire."
    },
    {
        question: "Le RPE est-il fiable pour les débutants en musculation ?",
        answer: "Les débutants ont tendance à sous-estimer ou surestimer leur effort, donc le RPE est moins précis au début. Avec 3 à 6 mois de pratique, la calibration s'améliore considérablement. En attendant, combiner RPE et pourcentages du 1RM est une excellente approche pour apprendre à jauger son effort."
    }
];

export default async function RPEPage() {
    const article = await getToolArticle('rpe-1rm');
    const relatedArticles = await getToolRelatedArticles(article);

    let faqData = DEFAULT_FAQ_DATA;
    const { data: faqItem } = await supabase.from('site_content').select('value').eq('key', 'tool_rpe_faq').single();
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
                <Link href="/outils" className="inline-flex items-center gap-2 text-zinc-400 hover:text-[#FF6B00] transition mb-8 group font-bold uppercase text-xs">
                    <ChevronLeft size={16} className="group-hover:-translate-x-1 transition-transform" /> Retour aux outils
                </Link>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-16">
                    <div className="lg:col-span-7">
                        <RPEConverter hints={article.tool_hints} />
                    </div>

                    <div className="lg:col-span-5">
                        <div className="prose prose-zinc max-w-none">
                            <h1 className="text-4xl font-black uppercase mb-6 leading-tight">
                                {article.title || "Convertisseur RPE / % 1RM"}
                            </h1>
                            <p className="text-zinc-500 text-lg mb-8 leading-relaxed">
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
                            <h4 className="text-sm font-black uppercase tracking-wider text-zinc-500 font-bold">Expertise Matériel</h4>
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

                <RelatedTools currentTool="rpe-1rm" />

                {/* Related Articles */}
                <RelatedArticles
                    articles={relatedArticles}
                    title={article.related_title}
                    subtitle={article.related_subtitle}
                />
            </div>
            <div className="bg-white"><HomeFAQ faqData={faqData} /></div>
        </div>
    );
}
