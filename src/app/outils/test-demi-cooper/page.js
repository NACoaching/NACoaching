import Link from 'next/link';
import { ChevronLeft } from 'lucide-react';
import HalfCooperTest from '@/components/tools/HalfCooperTest';
import { getToolArticle } from '@/lib/getToolArticle';
import RelatedArticles from '@/components/RelatedArticles';
import { supabase } from '@/lib/supabaseClient';

export const revalidate = 0;

export async function generateMetadata() {
    const article = await getToolArticle('test-demi-cooper');
    return {
        title: `${article.title} | NA Coaching`,
        description: article.intro || "Évaluez votre VMA et votre VO2max avec le test du demi-cooper (6 minutes). Obtenez vos allures d'entraînement personnalisées pour le running.",
    };
}

export default async function DemiCooperPage() {
    const [article, { data: relatedArticlesData }] = await Promise.all([
        getToolArticle('test-demi-cooper'),
        supabase.from('articles').select('id, title, category').eq('is_published', true).neq('category', 'Outils').limit(3)
    ]);
    const relatedArticles = relatedArticlesData || [];

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
                    <div className="lg:col-span-7">
                        <HalfCooperTest />
                    </div>

                    <div className="lg:col-span-5">
                        <div className="prose prose-zinc max-w-none">
                            <h1 className="text-4xl font-black uppercase mb-6 leading-tight">
                                {article.title || "Test Demi-Cooper (6 min)"}
                            </h1>
                            <p className="text-zinc-500 text-lg mb-8 leading-relaxed">
                                {article.intro}
                            </p>
                            <div className="h-px bg-zinc-200 mb-8" />
                            <div className="text-zinc-600 leading-relaxed space-y-4" dangerouslySetInnerHTML={{ __html: article.content }} />
                        </div>
                    </div>
                </div>

                {/* Related Articles */}
                <RelatedArticles
                    articles={relatedArticles}
                    title="VMA & Performance"
                    subtitle="Comprends la physiologie de l'effort avec le Labo"
                />
            </div>
        </div>
    );
}
