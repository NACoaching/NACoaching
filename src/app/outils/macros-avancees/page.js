import AdvancedMacros from "@/components/tools/AdvancedMacros";
import AnimWrapper from "@/components/AnimWrapper";
import Link from "next/link";
import { ArrowLeft, ShoppingBag, Info } from "lucide-react";
import { getToolArticle, getToolRelatedArticles } from "@/lib/getToolArticle";
import ToolArticleContent from "@/components/ToolArticleContent";
import AffiliateCard from "@/components/AffiliateCard";
import RelatedArticles from "@/components/RelatedArticles";

export const revalidate = 0;

export async function generateMetadata() {
    const article = await getToolArticle('/outils/macros-avancees');
    return {
        title: `${article.title || 'Macros Avancées'} | NA Coaching`,
        description: article.intro || 'Calculez précisément vos besoins en protéines, lipides et glucides.',
    }
}

const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'SoftwareApplication',
    'name': 'Calculateur Macros Avancées NA Coaching',
    'applicationCategory': 'HealthApplication',
    'operatingSystem': 'Web',
    'offers': {
        '@type': 'Offer',
        'price': '0',
        'priceCurrency': 'EUR'
    },
    'description': 'Calculateur nutritionnel précis pour athlètes et pratiquants de musculation.'
};

export default async function MacrosAvanceesPage() {
    const article = await getToolArticle('/outils/macros-avancees');
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
                        {article.title || 'Calculateur de Macros Avancé'}
                    </h1>
                    <p className="text-xl text-zinc-600 mb-12">
                        {article.intro || "Allez plus loin qu'un simple calcul de calories. Définissez vos ratios de protéines et lipides selon votre poids de corps."}
                    </p>

                    <div className="mb-16">
                        <AdvancedMacros />
                    </div>

                    {/* SEO Content */}
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
