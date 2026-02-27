import Link from 'next/link';
import { ChevronLeft, Info, ShoppingBag } from 'lucide-react';
import AffiliateCard from "@/components/AffiliateCard";
import RacePredictor from '@/components/tools/RacePredictor';
import { getToolArticle, getToolRelatedArticles } from '@/lib/getToolArticle';
import RelatedArticles from '@/components/RelatedArticles';
import { supabase } from '@/lib/supabaseClient';

export const revalidate = 0;

export async function generateMetadata() {
    const article = await getToolArticle('race-predictor');
    return {
        title: `${article.title || 'Prédicteur de Performance'} | NA Coaching`,
        description: article.intro || "Prédisez vos temps sur 5km, 10km, Semi-Marathon et Marathon à partir d'un chrono de référence. Utilisez la formule de Riegel pour vos objectifs.",
    };
}

export default async function RacePredictorPage() {
    const article = await getToolArticle('race-predictor');
    const relatedArticles = await getToolRelatedArticles(article);

    const jsonLd = {
        "@context": "https://schema.org",
        "@type": "WebApplication",
        "name": article.title || "Prédicteur de Performance Running",
        "description": article.intro,
        "applicationCategory": "FitnessApplication",
        "operatingSystem": "Web"
    };

    return (
        <div className="min-h-screen bg-zinc-50 pt-32 pb-20">
            <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

            <div className="max-w-7xl mx-auto px-6">
                <Link href="/outils" className="inline-flex items-center gap-2 text-zinc-400 hover:text-[#FF6B00] transition mb-8 group font-bold uppercase text-xs">
                    <ChevronLeft size={16} className="group-hover:-translate-x-1 transition-transform" /> Retour aux outils
                </Link>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-16">
                    <div className="lg:col-span-7">
                        <RacePredictor />
                    </div>

                    <div className="lg:col-span-5">
                        <div className="prose prose-zinc max-w-none">
                            <h1 className="text-4xl font-black uppercase mb-6 leading-tight">
                                {article.title || "Prédicteur de Performance"}
                            </h1>
                            <p className="text-zinc-500 text-lg mb-8 leading-relaxed">
                                {article.intro}
                            </p>
                            <div className="h-px bg-zinc-200 mb-8" />
                            <div className="text-zinc-600 leading-relaxed space-y-4" dangerouslySetInnerHTML={{ __html: article.content }} />
                        </div>
                    </div>
                </div>

                {/* AFFILIATE SECTION (RESTORED STYLE) */}
                {article.affiliate_link && (
                    <div className="mt-12 border-t border-zinc-200 pt-12 text-left">
                        <div className="flex items-center gap-2 mb-8">
                            <Info size={16} className="text-[#FF6B00]" />
                            <h4 className="text-sm font-black uppercase tracking-wider text-zinc-500 font-bold">Expertise Matériel</h4>
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
            </div>
        </div>
    );
}
