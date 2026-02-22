import ACWRCalculator from "@/components/tools/ACWRCalculator";
import AnimWrapper from "@/components/AnimWrapper";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { getToolArticle } from "@/lib/getToolArticle";
import ToolArticleContent from "@/components/ToolArticleContent";

export const revalidate = 0;

export async function generateMetadata() {
    const article = await getToolArticle('/outils/acwr');
    return {
        title: `${article.title || 'Calculateur ACWR'} | NA Coaching`,
        description: article.intro || 'Surveille ta charge d\'entraînement pour prévenir les blessures.',
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
                        {article.intro || "Optimise ta progression et minimise les risques de blessures en surveillant ton ratio de charge aiguë / chronique."}
                    </p>

                    <div className="mb-16">
                        <ACWRCalculator />
                    </div>

                    <ToolArticleContent content={article.content} />
                </AnimWrapper>
            </div>
        </section>
    );
}
