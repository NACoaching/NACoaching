
import Calculator1RM from "@/components/tools/Calculator1RM";
import AnimWrapper from "@/components/AnimWrapper";
import Link from "next/link";
import { ArrowLeft, ShoppingBag } from "lucide-react";
import { supabase } from '@/lib/supabaseClient';
import { getToolArticle, getToolRelatedArticles } from "@/lib/getToolArticle";
import ToolArticleContent from "@/components/ToolArticleContent";
import RelatedArticles from "@/components/RelatedArticles";
import HomeFAQ from "@/components/HomeFAQ";

export const revalidate = 3600;

export async function generateMetadata() {
    const article = await getToolArticle('/outils/calculateur-1rm');
    return {
        title: `${article.title || 'Calculateur 1RM'} | NA Coaching`,
        description: article.intro || 'Estimez votre 1RM en musculation.',
        authors: [{ name: 'NA Coaching (Master EOPS)', url: 'https://na-coaching.com' }],
        openGraph: {
            title: article.title || 'Calculateur 1RM',
            description: article.intro || 'Estimez votre 1RM en musculation.',
            images: [article.image || '/logo.png'],
            type: 'website',
        },
        alternates: {
            canonical: '/outils/calculateur-1rm',
        }
    }
}

const softwareJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'SoftwareApplication',
    'name': 'Calculateur 1RM NA Coaching',
    'applicationCategory': 'HealthApplication',
    'operatingSystem': 'Web',
    'offers': {
        '@type': 'Offer',
        'price': '0',
        'priceCurrency': 'EUR'
    },
    'description': 'Outil gratuit pour calculer sa répétition maximale (1RM) en musculation.'
};

const DEFAULT_FAQ_DATA = [
    {
        question: 'C\'est quoi le 1RM en musculation ?',
        answer: 'Le 1RM (One Repetition Maximum) est la charge maximale que vous pouvez soulever sur une seule répétition avec une technique parfaite.'
    },
    {
        question: 'Pourquoi calculer son 1RM ?',
        answer: 'Calculer son 1RM est essentiel pour calibrer les intensités d\'entraînement (en % de charge) afin de viser précisément la force, l\'hypertrophie ou l\'endurance musculaire.'
    },
    {
        question: 'Comment utiliser le calculateur 1RM ?',
        answer: 'Entrez le poids soulevé et le nombre de répétitions effectuées. Le calculateur utilise les formules de Brzycki et Epley pour estimer votre max théorique.'
    }
];

export default async function Calculator1RMPage() {
    const article = await getToolArticle('/outils/calculateur-1rm');
    const relatedArticles = await getToolRelatedArticles(article);

    // Fetch Dynamic FAQ
    let faqData = DEFAULT_FAQ_DATA;
    const { data: faqItem } = await supabase.from('site_content').select('value').eq('key', 'tool_1rm_faq').single();
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
                        {article.title || 'Calculateur 1RM (Max Rep)'}
                    </h1>
                    <p className="text-xl text-zinc-600 mb-12">
                        {article.intro || "Estimez votre charge maximale théorique pour calibrer vos entraînements de force et d'hypertrophie."}
                    </p>

                    <div className="mb-16">
                        <Calculator1RM />
                    </div>

                    {/* SEO Content */}
                    <ToolArticleContent content={article.content} />

                    {/* AFFILIATE BANNER (HORIZONTAL) */}
                    {article.affiliate_link && (
                        <div className="mt-12 p-8 rounded-xl border-2 border-dashed border-[#FF6B00]/30 bg-[#FF6B00]/5 flex flex-col md:flex-row items-center gap-8 group">
                            <div className="flex-1 text-center md:text-left">
                                <span className="inline-block px-3 py-1 bg-[#FF6B00] text-black text-[10px] font-black uppercase tracking-widest rounded-full mb-4">
                                    Recommandation de l&apos;expert
                                </span>
                                <p className="text-zinc-800 font-medium text-lg leading-relaxed mb-6">
                                    {article.affiliate_text || "Profitez de cette recommandation pour optimiser vos résultats."}
                                </p>
                                <a
                                    href={article.affiliate_link}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="inline-block bg-black text-white font-black py-4 px-8 rounded-sm uppercase text-xs hover:bg-[#FF6B00] hover:text-black transition shadow-lg"
                                >
                                    Découvrir le produit
                                </a>
                            </div>
                            <div className="w-32 h-32 flex items-center justify-center shrink-0">
                                {article.affiliate_image ? (
                                    <img
                                        src={article.affiliate_image}
                                        alt="Recommandation"
                                        className="w-full h-full object-contain group-hover:scale-110 transition-transform duration-500"
                                    />
                                ) : (
                                    <ShoppingBag className="w-full h-full text-[#FF6B00] opacity-20" />
                                )}
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
