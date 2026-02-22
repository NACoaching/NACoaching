import AdvancedMacros from "@/components/tools/AdvancedMacros";
import AnimWrapper from "@/components/AnimWrapper";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { getToolArticle } from "@/lib/getToolArticle";
import ToolArticleContent from "@/components/ToolArticleContent";

export const revalidate = 0;

export async function generateMetadata() {
    const article = await getToolArticle('/outils/macros-avancees');
    return {
        title: `${article.title || 'Macros Avancées'} | NA Coaching`,
        description: article.intro || 'Calcule précisément tes besoins en protéines, lipides et glucides.',
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
                        {article.intro || "Va plus loin qu'un simple calcul de calories. Définis tes ratios de protéines et lipides selon ton poids de corps."}
                    </p>

                    <div className="mb-16">
                        <AdvancedMacros />
                    </div>

                    <ToolArticleContent content={article.content} />
                </AnimWrapper>
            </div>
        </section>
    );
}
