
import CalculatorCalories from "@/components/tools/CalculatorCalories";
import AnimWrapper from "@/components/AnimWrapper";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { getToolArticle } from "@/lib/getToolArticle";
import ToolArticleContent from "@/components/ToolArticleContent";

export const revalidate = 3600;

export async function generateMetadata() {
    const article = await getToolArticle('/outils/besoins-caloriques');
    return {
        title: `${article.title || 'Calculateur de Besoins Caloriques'} | NA Coaching`,
        description: article.intro || 'Calculez vos besoins caloriques journaliers.',
    }
}

const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'SoftwareApplication',
    'name': 'Calculateur Besoins Caloriques NA Coaching',
    'applicationCategory': 'HealthApplication',
    'operatingSystem': 'Web',
    'offers': {
        '@type': 'Offer',
        'price': '0',
        'priceCurrency': 'EUR'
    },
    'description': 'Outil gratuit pour calculer ses besoins caloriques journaliers (TDEE).'
};

export default async function CalculatorCaloriesPage() {
    const article = await getToolArticle('/outils/besoins-caloriques');

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
                        {article.title || 'Calculateur de Besoins Caloriques Journaliers (TDEE)'}
                    </h1>
                    <p className="text-xl text-zinc-600 mb-12">
                        {article.intro || "Estimez précisément votre dépense énergétique totale quotidienne."}
                    </p>

                    <div className="mb-16">
                        <CalculatorCalories />
                    </div>

                    {/* SEO Content */}
                    <ToolArticleContent content={article.content} />
                </AnimWrapper>
            </div>
        </section>
    );
}
