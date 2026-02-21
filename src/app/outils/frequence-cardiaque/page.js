
import CalculatorHeartRate from "@/components/tools/CalculatorHeartRate";
import AnimWrapper from "@/components/AnimWrapper";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { getToolArticle } from "@/lib/getToolArticle";
import ToolArticleContent from "@/components/ToolArticleContent";
import RelatedArticles from "@/components/RelatedArticles";
import { supabase } from '@/lib/supabaseClient';

export const revalidate = 0;

export async function generateMetadata() {
    const article = await getToolArticle('/outils/frequence-cardiaque');
    return {
        title: `${article.title || 'Zones de Fréquence Cardiaque'} | NA Coaching`,
        description: article.intro || 'Calculez vos zones d\'intensité.',
    }
}

const jsonLd = {
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

export default async function CalculatorHeartRatePage() {
    const [article, { data: relatedArticlesData }] = await Promise.all([
        getToolArticle('/outils/frequence-cardiaque'),
        supabase.from('articles').select('id, title, category').eq('is_published', true).neq('category', 'Outils').limit(3)
    ]);
    const relatedArticles = relatedArticlesData || [];

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

                    {/* Related Articles */}
                    <RelatedArticles
                        articles={relatedArticles}
                        title="Cardio & Physiologie"
                        subtitle="Optimise ton endurance avec les conseils du Labo"
                    />
                </AnimWrapper>
            </div>
        </section>
    );
}
