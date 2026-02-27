import Link from 'next/link';
import { ChevronLeft, ShoppingBag, Info } from 'lucide-react';
import AffiliateCard from "@/components/AffiliateCard";
import EffectiveVolume from '@/components/tools/EffectiveVolume';
import { getToolArticle, getToolRelatedArticles } from '@/lib/getToolArticle';
import RelatedArticles from '@/components/RelatedArticles';
import { supabase } from '@/lib/supabaseClient';

export const revalidate = 0;

export async function generateMetadata() {
    const article = await getToolArticle('volume-effectif');
    return {
        title: `${article.title} | NA Coaching`,
        description: article.intro || "Calculez votre volume d'entraînement hebdomadaire par groupe musculaire. Identifiez vos zones de maintenance, de progression et de sur-reaching.",
    };
}

export default async function VolumePage() {
    const article = await getToolArticle('volume-effectif');
    const relatedArticles = await getToolRelatedArticles(article);

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

            <div className="max-w-7xl mx-auto px-6">
                <Link href="/outils" className="inline-flex items-center gap-2 text-zinc-400 hover:text-[#FF6B00] transition mb-8 group font-bold uppercase text-xs">
                    <ChevronLeft size={16} className="group-hover:-translate-x-1 transition-transform" /> Retour aux outils
                </Link>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-16">
                    <div className="lg:col-span-8">
                        <EffectiveVolume />
                    </div>

                    <div className="lg:col-span-4">
                        <div className="prose prose-zinc max-w-none">
                            <h1 className="text-4xl font-black uppercase mb-6 leading-tight">
                                {article.title || "Calculateur de Volume Effectif"}
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
                    <div className="mt-12 border-t border-zinc-200 pt-12 text-left flex flex-col items-center">
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
            </div>
        </div>
    );
}
