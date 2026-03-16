import ACWRCalculator from "@/components/tools/ACWRCalculator";
import HomeFAQ from '@/components/HomeFAQ';
import AnimWrapper from "@/components/AnimWrapper";
import Link from "next/link";
import { ArrowLeft, ShoppingBag, Info } from "lucide-react";
import { getToolArticle, getToolRelatedArticles } from "@/lib/getToolArticle";
import { supabase } from "@/lib/supabaseClient";
import ToolArticleContent from "@/components/ToolArticleContent";
import AffiliateCard from "@/components/AffiliateCard";
import RelatedArticles from "@/components/RelatedArticles";
import RelatedTools from "@/components/RelatedTools";

export const revalidate = 0;

export async function generateMetadata() {
    const article = await getToolArticle('/outils/acwr');
    return {
        title: `${article.title || 'Calculateur ACWR — Ratio Charge Aiguë/Chronique'} | NA Coaching`,
        description: article.meta_desc || article.intro || 'Surveillez votre ratio de charge aiguë/chronique (ACWR) pour prévenir les blessures et le surentraînement. Outil gratuit pour sportifs.',
        authors: [{ name: 'NA Coaching (Master EOPS)', url: 'https://www.na-coaching.com/' }],
        openGraph: {
            title: article.title || 'Calculateur ACWR',
            description: article.intro || 'Prévenez les blessures en surveillant votre charge d\'entraînement.',
            images: [article.image || '/logo.png'],
            type: 'website',
        },
        alternates: { canonical: 'https://www.na-coaching.com/outils/acwr/' },
    }
}

const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'SoftwareApplication',
    'name': 'Calculateur ACWR NA Coaching',
    'applicationCategory': 'HealthApplication',
    'operatingSystem': 'Web',
    'offers': {
        '@type': 'Offer',
        'price': '0',
        'priceCurrency': 'EUR'
    },
    'description': 'Outil gratuit pour calculer son Acute:Chronic Workload Ratio (ACWR) et prévenir le surentraînement.'
};

const DEFAULT_FAQ_DATA = [
    {
        question: "C'est quoi le ratio ACWR en préparation physique ?",
        answer: "Le ratio ACWR (Acute:Chronic Workload Ratio) compare votre charge d'entraînement récente (semaine en cours) à votre charge chronique (moyenne des 4 dernières semaines). Un ratio entre 0.8 et 1.3 est considéré comme la 'zone optimale' de progression avec un risque de blessure minimisé."
    },
    {
        question: "Comment calculer l'ACWR pour éviter les blessures ?",
        answer: "Divisez la charge de la semaine en cours par la moyenne des 4 semaines précédentes. La charge peut être mesurée en volume (km, tonnes soulevées) ou en charge interne (RPE × durée). Un ratio supérieur à 1.5 indique un pic de charge dangereux et augmente significativement le risque de blessure."
    },
    {
        question: "Quelle est la zone optimale du ratio ACWR ?",
        answer: "La zone optimale se situe entre 0.8 et 1.3. En dessous de 0.8, vous êtes en sous-entraînement et perdez des adaptations. Au-dessus de 1.5, le risque de blessure augmente de 200 à 400% selon les études. Entre 1.3 et 1.5, c'est une zone de vigilance qui nécessite une attention particulière."
    },
    {
        question: "L'ACWR est-il utile pour les sportifs amateurs ?",
        answer: "Absolument. L'ACWR est encore plus important pour les amateurs car ils sont plus vulnérables aux pics de charge (reprise après vacances, augmentation brutale du volume). Notre outil simplifie le calcul : entrez vos charges hebdomadaires et le ratio est calculé automatiquement avec un code couleur visuel."
    },
    {
        question: "Comment augmenter progressivement sa charge d'entraînement ?",
        answer: "La règle générale est de ne pas augmenter la charge de plus de 10% par semaine. Cela maintient l'ACWR dans la zone optimale. Par exemple, si vous courez 30 km cette semaine, ne dépassez pas 33 km la semaine suivante. Cette progression graduelle permet au corps de s'adapter et réduit le risque de blessure."
    }
];

export default async function ACWRPage() {
    const article = await getToolArticle('/outils/acwr');
    const relatedArticles = await getToolRelatedArticles(article);

    let faqData = DEFAULT_FAQ_DATA;
    const { data: faqItem } = await supabase.from('site_content').select('value').eq('key', 'tool_acwr_faq').single();
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

    return (
        <section className="pt-32 pb-20 min-h-screen bg-zinc-50">
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
            />
            {faqData && faqData.length > 0 && (
                <script
                    type="application/ld+json"
                    dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
                />
            )}
            <div className="max-w-4xl mx-auto px-6">
                <AnimWrapper>
                    <Link href="/outils" className="inline-flex items-center gap-2 text-zinc-700 hover:text-[#FF6B00] transition mb-8 font-bold uppercase text-sm">
                        <ArrowLeft size={16} /> Retour aux outils
                    </Link>

                    <h1 className="text-4xl md:text-5xl font-black uppercase mb-6 text-[#FF6B00]">
                        {article.title || 'Calculateur ACWR (Fatigue/Charge)'}
                    </h1>
                    <p className="text-xl text-zinc-800 mb-12 font-medium">
                        {article.intro || "Optimisez votre progression et minimisez les risques de blessures en surveillant votre ratio de charge aiguë / chronique."}
                    </p>

                    <div className="mb-16">
                        <ACWRCalculator hints={article.tool_hints} />
                    </div>

                    <ToolArticleContent content={article.content} glossary={article.auto_links} currentPath={article.current_path} />

                    {/* AFFILIATE SECTION (RESTORED STYLE) */}
                    {article.affiliate_link && (
                        <div className="mt-12 border-t border-zinc-200 pt-12 flex flex-col items-center">
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

                    <RelatedTools currentTool="acwr" />

                    {/* FAQ SECTION */}
                    {faqData && faqData.length > 0 && (
                        <div className="mt-16">
                            <HomeFAQ faqData={faqData} title="Questions Fréquentes sur l'ACWR & Prévention" id="faq-acwr" />
                        </div>
                    )}

                    {/* Related Articles */}
                    <RelatedArticles
                        articles={relatedArticles}
                        title={article.related_title}
                        subtitle={article.related_subtitle}
                    />
                </AnimWrapper>
            </div>
        </section>
    );
}
