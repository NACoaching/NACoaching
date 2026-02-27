import ACWRCalculator from "@/components/tools/ACWRCalculator";
import AnimWrapper from "@/components/AnimWrapper";
import Link from "next/link";
import { ArrowLeft, ShoppingBag } from "lucide-react";
import { getToolArticle, getToolRelatedArticles } from "@/lib/getToolArticle";
import ToolArticleContent from "@/components/ToolArticleContent";
import RelatedArticles from "@/components/RelatedArticles";

export const revalidate = 0;

export async function generateMetadata() {
    const article = await getToolArticle('/outils/acwr');
    return {
        title: `${article.title || 'Calculateur ACWR'} | NA Coaching`,
        description: article.intro || 'Surveillez votre charge d\'entraînement pour prévenir les blessures.',
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

export default async function ACWRPage() {
    const article = await getToolArticle('/outils/acwr');
    const relatedArticles = await getToolRelatedArticles(article);

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
                        {article.title || 'Calculateur ACWR (Fatigue/Charge)'}
                    </h1>
                    <p className="text-xl text-zinc-600 mb-12">
                        {article.intro || "Optimisez votre progression et minimisez les risques de blessures en surveillant votre ratio de charge aiguë / chronique."}
                    </p>

                    <div className="mb-16">
                        <ACWRCalculator />
                    </div>

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
        </section>
    );
}
