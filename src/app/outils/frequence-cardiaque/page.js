
import CalculatorHeartRate from "@/components/tools/CalculatorHeartRate";
import AnimWrapper from "@/components/AnimWrapper";
import Link from "next/link";
import { ArrowLeft, ShoppingBag, Info } from "lucide-react";
import { getToolArticle, getToolRelatedArticles } from "@/lib/getToolArticle";
import { supabase } from '@/lib/supabaseClient';
import ToolArticleContent from "@/components/ToolArticleContent";
import AffiliateCard from "@/components/AffiliateCard";
import RelatedArticles from "@/components/RelatedArticles";
import HomeFAQ from "@/components/HomeFAQ";

export const revalidate = 0;

export async function generateMetadata() {
    const article = await getToolArticle('/outils/frequence-cardiaque');
    return {
        title: `${article.title || 'Zones de Fréquence Cardiaque'} | NA Coaching`,
        description: article.intro || 'Calculez vos zones d\'intensité.',
        authors: [{ name: 'NA Coaching (Master EOPS)', url: 'https://na-coaching.com' }],
        openGraph: {
            title: article.title || 'Zones de Fréquence Cardiaque',
            description: article.intro || 'Calculez vos zones d\'intensité.',
            images: [article.image || '/logo.png'],
            type: 'website',
        },
        alternates: {
            canonical: '/outils/frequence-cardiaque',
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
        question: 'Comment calculer mes zones de fréquence cardiaque ?',
        answer: 'La méthode la plus précise est celle de Karvonen, qui prend en compte votre fréquence cardiaque de repos et votre fréquence cardiaque maximale.'
    },
    {
        question: 'C\'est quoi la zone d\'endurance fondamentale ?',
        answer: 'L\'endurance fondamentale correspond généralement aux zones 1 et 2 (entre 60% et 75% de votre FC Max). C\'est l\'allure à laquelle vous pouvez parler sans être essoufflé.'
    },
    {
        question: 'Pourquoi utiliser la méthode de Karvonen ?',
        answer: 'Contrairement à la formule classique (220-âge), Karvonen utilise la fréquence cardiaque de réserve, ce qui rend les zones d\'intensité beaucoup plus personnalisées et précises.'
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
                    <p className="text-xl text-zinc-600 mb-12">
                        {article.intro || "Optimisez votre entraînement en ciblant les bonnes zones d'intensité grâce à la formule de Karvonen."}
                    </p>

                    <div className="mb-16">
                        <CalculatorHeartRate />
                    </div>

                    {/* SEO Content */}
                    <ToolArticleContent content={article.content} />

                    {/* AFFILIATE SECTION (RESTORED STYLE) */}
                    {article.affiliate_link && (
                        <div className="mt-12 border-t border-zinc-200 pt-12 flex flex-col items-center">
                            <div className="flex items-center gap-2 mb-8">
                                <Info size={16} className="text-[#FF6B00]" />
                                <h4 className="text-sm font-black uppercase tracking-wider text-zinc-500 font-bold">Expertise Matériel</h4>
                            </div>

                            <div className="max-w-md w-full mx-auto">
                                <AffiliateCard
                                    title={article.title}
                                    description={article.affiliate_text || "Recommandation d'expert pour optimiser vos résultats."}
                                    imageUrl={article.affiliate_image}
                                    affiliateUrl={article.affiliate_link}
                                    ctaText="Voir le produit"
                                    badge="Sélection Coach"
                                />
                            </div>
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
            <HomeFAQ faqData={faqData} />
        </section>
    );
}
