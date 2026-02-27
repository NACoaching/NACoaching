import Link from 'next/link';
import { ChevronLeft, ShoppingBag } from 'lucide-react';
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
            </div>
        </div>
    );
}
