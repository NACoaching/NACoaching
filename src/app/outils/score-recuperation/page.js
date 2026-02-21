import RecoveryScore from "@/components/tools/RecoveryScore";
import AnimWrapper from "@/components/AnimWrapper";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { getToolArticle } from "@/lib/getToolArticle";
import ToolArticleContent from "@/components/ToolArticleContent";

export const revalidate = 0;

export async function generateMetadata() {
    const article = await getToolArticle('/outils/score-recuperation');
    return {
        title: `${article.title || 'Score de Récupération'} | NA Coaching`,
        description: article.intro || 'Évaluez votre état de forme quotidien pour adapter votre entraînement.',
    }
}

const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'SoftwareApplication',
    'name': 'Recovery Score NA Coaching',
    'applicationCategory': 'HealthApplication',
    'operatingSystem': 'Web',
    'offers': {
        '@type': 'Offer',
        'price': '0',
        'priceCurrency': 'EUR'
    },
    'description': 'Auto-évaluation de la readiness et de la récupération pour les sportifs.'
};

export default async function RecoveryScorePage() {
    const article = await getToolArticle('/outils/score-recuperation');

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
                        {article.title || 'Score de Récupération (Readiness)'}
                    </h1>
                    <p className="text-xl text-zinc-600 mb-12">
                        {article.intro || "Sommeil, stress, fatigue... Calculez votre état de forme du jour pour savoir s'il faut pousser ou lever le pied."}
                    </p>

                    <div className="mb-16">
                        <RecoveryScore />
                    </div>

                    <ToolArticleContent content={article.content} />
                </AnimWrapper>
            </div>
        </section>
    );
}
