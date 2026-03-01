import RecoveryScore from "@/components/tools/RecoveryScore";
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
    const article = await getToolArticle('/outils/score-recuperation');
    return {
        title: `${article.title || 'Score de Récupération — Évaluez Votre Readiness'} | NA Coaching`,
        description: article.intro || 'Évaluez votre état de forme quotidien (sommeil, stress, fatigue) pour savoir si vous devez pousser ou récupérer. Outil gratuit.',
        authors: [{ name: 'NA Coaching (Master EOPS)', url: 'https://na-coaching.com' }],
        openGraph: {
            title: article.title || 'Score de Récupération',
            description: article.intro || 'Calculez votre readiness pour optimiser vos entraînements.',
            images: [article.image || '/logo.png'],
            type: 'website',
        },
        alternates: { canonical: '/outils/score-recuperation' },
    }
}

const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'SoftwareApplication',
    'name': 'Recovery Score NA Coaching',
    'applicationCategory': 'HealthApplication',
    'operatingSystem': 'Web',
    'offers': {
        '@type': 'Offer',
        'price': '0',
        'priceCurrency': 'EUR'
    },
    'description': 'Auto-évaluation de la readiness et de la récupération pour les sportifs.'
};

const DEFAULT_FAQ_DATA = [
    {
        question: "Comment savoir si j'ai bien récupéré entre deux séances de sport ?",
        answer: "Le score de récupération évalue plusieurs indicateurs : qualité du sommeil, douleurs musculaires résiduelles (DOMS), niveau de fatigue perçue, humeur et motivation. Un score élevé indique que vous êtes prêt pour un entraînement intense, un score bas suggère une séance légère ou un jour de repos."
    },
    {
        question: "C'est quoi le surentraînement et comment l'éviter ?",
        answer: "Le surentraînement est un état de fatigue chronique causé par un déséquilibre entre charge d'entraînement et récupération. Symptômes : baisse de performance, fatigue persistante, troubles du sommeil, irritabilité. Pour l'éviter, respectez les jours de repos, surveillez votre score de récupération et augmentez les charges progressivement."
    },
    {
        question: "Combien de temps de repos entre deux séances de musculation ?",
        answer: "Pour le même groupe musculaire, 48 à 72 heures de repos sont recommandées. Cela laisse le temps à la synthèse protéique musculaire (qui dure 24-48h post-entraînement) de s'achever. Vous pouvez cependant entraîner des groupes musculaires différents sur des jours consécutifs."
    },
    {
        question: "Le sommeil affecte-t-il vraiment la récupération musculaire ?",
        answer: "Le sommeil est le facteur n°1 de récupération. Pendant les phases de sommeil profond, le corps libère l'hormone de croissance (GH), essentielle à la réparation musculaire. Moins de 7 heures de sommeil réduit la synthèse protéique de 18% et augmente le cortisol (hormone catabolique). Visez 7 à 9 heures par nuit."
    },
    {
        question: "Quelles sont les meilleures stratégies de récupération après un entraînement ?",
        answer: "Par ordre d'importance : 1) Sommeil de qualité (7-9h), 2) Nutrition post-entraînement (protéines + glucides dans les 2h), 3) Hydratation suffisante, 4) Gestion du stress, 5) Mobilité et étirements légers. Les bains froids et la compression sont des bonus, mais les fondamentaux ci-dessus sont prioritaires."
    }
];

export default async function RecoveryScorePage() {
    const article = await getToolArticle('/outils/score-recuperation');
    const relatedArticles = await getToolRelatedArticles(article);

    let faqData = DEFAULT_FAQ_DATA;
    const { data: faqItem } = await supabase.from('site_content').select('value').eq('key', 'tool_recovery_faq').single();
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
            <div className="max-w-4xl mx-auto px-6">
                <AnimWrapper>
                    <Link href="/outils" className="inline-flex items-center gap-2 text-zinc-500 hover:text-[#FF6B00] transition mb-8 font-bold uppercase text-sm">
                        <ArrowLeft size={16} /> Retour aux outils
                    </Link>

                    <h1 className="text-4xl md:text-5xl font-black uppercase mb-6 text-[#FF6B00]">
                        {article.title || 'Score de Récupération (Readiness)'}
                    </h1>
                    <p className="text-xl text-zinc-600 mb-12">
                        {article.intro || "Sommeil, stress, fatigue... Calculez votre état de forme du jour pour savoir s'il faut pousser ou lever le pied."}
                    </p>

                    <div className="mb-16">
                        <RecoveryScore hints={article.tool_hints} />
                    </div>

                    <ToolArticleContent content={article.content} glossary={article.auto_links} currentPath={article.current_path} />

                    {/* AFFILIATE SECTION (RESTORED STYLE) */}
                    {article.affiliate_link && (
                        <div className="mt-12 border-t border-zinc-200 pt-12 flex flex-col items-center">
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

                    <RelatedTools currentTool="score-recuperation" />

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
