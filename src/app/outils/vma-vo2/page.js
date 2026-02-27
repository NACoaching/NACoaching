
import VmaVo2Converter from "@/components/tools/VmaVo2Converter";
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
    const article = await getToolArticle('/outils/vma-vo2');
    return {
        title: `${article.title || 'Convertisseur VMA / VO2max'} | NA Coaching`,
        description: article.intro || 'Estimez votre VMA et VO2max.',
        authors: [{ name: 'NA Coaching (Master EOPS)', url: 'https://na-coaching.com' }],
        openGraph: {
            title: article.title || 'Convertisseur VMA / VO2max',
            description: article.intro || 'Estimez votre VMA et VO2max.',
            images: [article.image || '/logo.png'],
            type: 'website',
        },
        alternates: {
            canonical: '/outils/vma-vo2',
        }
    }
}

const softwareJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'SoftwareApplication',
    'name': 'Convertisseur VMA VO2max NA Coaching',
    'applicationCategory': 'HealthApplication',
    'operatingSystem': 'Web',
    'offers': {
        '@type': 'Offer',
        'price': '0',
        'priceCurrency': 'EUR'
    },
    'description': 'Outil gratuit pour convertir la VMA en VO2max et inversement.'
};

const DEFAULT_FAQ_DATA = [
    {
        question: 'C\'est quoi la VMA ?',
        answer: 'La VMA (Vitesse Maximale Aérobie) est la vitesse à laquelle votre consommation d\'oxygène est maximale. C\'est un indicateur clé pour calibrer vos allures d\'entraînement.'
    },
    {
        question: 'Comment calculer sa VMA ?',
        answer: 'La VMA peut être estimée via des tests terrain comme le Test de Cooper (distance parcourue en 12 min) ou le Demi-Cooper (distance en 6 min).'
    },
    {
        question: 'Quelle est la différence entre VMA et VO2max ?',
        answer: 'La VO2max est une mesure physiologique (volume d\'oxygène), tandis que la VMA est la traduction de cette capacité en vitesse de course concrète.'
    }
];

export default async function VmaVo2ConverterPage() {
    const article = await getToolArticle('/outils/vma-vo2');
    const relatedArticles = await getToolRelatedArticles(article);

    // Fetch Dynamic FAQ
    let faqData = DEFAULT_FAQ_DATA;
    const { data: faqItem } = await supabase.from('site_content').select('value').eq('key', 'tool_vma_faq').single();
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
                        {article.title || 'Convertisseur VMA / VO2max'}
                    </h1>
                    <p className="text-xl text-zinc-600 mb-12">
                        {article.intro || "Analysez votre potentiel aérobie en reliant votre vitesse maximale à votre consommation d'oxygène."}
                    </p>

                    <div className="mb-16">
                        <VmaVo2Converter />
                    </div>

                    {/* SEO Content */}
                    <ToolArticleContent content={article.content} />

                    {/* AFFILIATE SECTION (RESTORED STYLE) */}
                    {article.affiliate_link && (
                        <div className="mt-12 border-t border-zinc-200 pt-12">
                            <div className="flex items-center gap-2 mb-8">
                                <span className="flex items-center gap-2">
                                    <Info size={16} className="text-[#FF6B00]" />
                                    <h4 className="text-sm font-black uppercase tracking-wider text-zinc-500 font-bold">Expertise Matériel</h4>
                                </span>
                            </div>

                            <div className="max-w-md mx-auto md:mx-0">
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
