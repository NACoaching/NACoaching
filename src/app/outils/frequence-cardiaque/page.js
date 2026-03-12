
import CalculatorHeartRate from "@/components/tools/CalculatorHeartRate";
import AnimWrapper from "@/components/AnimWrapper";
import Link from "next/link";
import { ArrowLeft, ShoppingBag, Info } from "lucide-react";
import { getToolArticle, getToolRelatedArticles } from "@/lib/getToolArticle";
import { supabase } from '@/lib/supabaseClient';
import ToolArticleContent from "@/components/ToolArticleContent";
import AffiliateCard from "@/components/AffiliateCard";
import RelatedArticles from "@/components/RelatedArticles";
import RelatedTools from "@/components/RelatedTools";
import HomeFAQ from "@/components/HomeFAQ";

export const revalidate = 0;

export async function generateMetadata() {
    const article = await getToolArticle('/outils/frequence-cardiaque');
    return {
        title: `${article.title || 'Zones de Fréquence Cardiaque'} | NA Coaching`,
        description: article.intro || 'Calculez vos zones d\'intensité.',
        authors: [{ name: 'NA Coaching (Master EOPS)', url: 'https://www.na-coaching.com' }],
        openGraph: {
            title: article.title || 'Zones de Fréquence Cardiaque',
            description: article.intro || 'Calculez vos zones d\'intensité.',
            images: [article.image || '/logo.png'],
            type: 'website',
        },
        alternates: {
            canonical: 'https://www.na-coaching.com/outils/frequence-cardiaque',
        }
    }
}

const softwareJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'SoftwareApplication',
    'name': 'Calculateur Zones Cardiaques NA Coaching',
    'applicationCategory': 'HealthApplication',
    'operatingSystem': 'Web',
    'offers': {
        '@type': 'Offer',
        'price': '0',
        'priceCurrency': 'EUR'
    },
    'description': 'Outil gratuit pour calculer ses zones de fréquence cardiaque avec la méthode Karvonen.'
};

const DEFAULT_FAQ_DATA = [
    {
        question: "Comment calculer ses zones de fréquence cardiaque d'entraînement ?",
        answer: "La méthode la plus précise est celle de Karvonen, qui utilise votre fréquence cardiaque de réserve (FC max − FC repos). Elle donne 5 zones d'intensité personnalisées : récupération, endurance fondamentale, tempo, seuil et effort maximal. Notre calculateur les détermine automatiquement."
    },
    {
        question: "C'est quoi la zone d'endurance fondamentale et à quoi sert-elle ?",
        answer: "L'endurance fondamentale correspond aux zones 1 et 2, soit environ 60-75% de votre FC de réserve. C'est l'allure où vous pouvez tenir une conversation sans essoufflement. Elle développe le réseau capillaire, améliore l'utilisation des graisses et constitue la base de tout programme de course à pied."
    },
    {
        question: "Pourquoi la méthode de Karvonen est-elle plus précise que 220 moins l'âge ?",
        answer: "La formule classique (220 − âge) estime seulement la FC max théorique et ne tient pas compte de votre fréquence cardiaque de repos. Karvonen utilise la FCR (fréquence cardiaque de réserve = FC max − FC repos), ce qui rend les zones beaucoup plus personnalisées, surtout pour les sportifs entraînés."
    },
    {
        question: "Comment mesurer sa fréquence cardiaque de repos ?",
        answer: "Mesurez votre FC de repos le matin au réveil, allongé et détendu, avant de vous lever. Comptez vos pulsations pendant 60 secondes ou utilisez une montre connectée. Faites la mesure sur 3 à 5 jours consécutifs et prenez la moyenne pour un résultat fiable."
    },
    {
        question: "Dans quelle zone cardiaque courir pour perdre du poids ?",
        answer: "La zone d'endurance fondamentale (zone 2, environ 60-70% de FC max) est idéale pour la perte de poids car elle maximise l'oxydation des graisses. Cependant, les séances à haute intensité (zone 4-5) brûlent plus de calories totales et créent un effet afterburn. L'idéal est de combiner les deux."
    }
];

export default async function CalculatorHeartRatePage() {
    const article = await getToolArticle('/outils/frequence-cardiaque');
    const relatedArticles = await getToolRelatedArticles(article);

    // Fetch Dynamic FAQ
    let faqData = DEFAULT_FAQ_DATA;
    const { data: faqItem } = await supabase.from('site_content').select('value').eq('key', 'tool_hr_faq').single();
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
                dangerouslySetInnerHTML={{ __html: JSON.stringify(softwareJsonLd) }}
            />
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
            />
            <div className="max-w-4xl mx-auto px-6">
                <AnimWrapper>
                    <Link href="/outils" className="inline-flex items-center gap-2 text-zinc-500 hover:text-[#FF6B00] transition mb-8 font-bold uppercase text-sm">
                        <ArrowLeft size={16} /> Retour aux outils
                    </Link>

                    <h1 className="text-4xl md:text-5xl font-black uppercase mb-6 text-[#FF6B00]">
                        {article.title || 'Zones de Fréquence Cardiaque'}
                    </h1>
                    <p className="text-zinc-800 font-medium text-lg mb-8 leading-relaxed">
                        {article.intro || "Optimisez votre entraînement en ciblant les bonnes zones d'intensité grâce à la formule de Karvonen."}
                    </p>

                    <div className="lg:col-span-7">
                        <CalculatorHeartRate hints={article.tool_hints} />
                    </div>

                    {/* SEO Content */}
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

                    <RelatedTools currentTool="frequence-cardiaque" />

                    {/* Related Articles */}
                    <RelatedArticles
                        articles={relatedArticles}
                        title={article.related_title}
                        subtitle={article.related_subtitle}
                    />
                </AnimWrapper>
            </div>
            <div className="bg-white">
                {faqData && faqData.length > 0 && (
                    <HomeFAQ faqData={faqData} title="Questions Fréquentes sur la FC" id="faq-fc" />
                )}
            </div>
        </section>
    );
}
