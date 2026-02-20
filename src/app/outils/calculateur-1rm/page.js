
import Calculator1RM from "@/components/tools/Calculator1RM";
import AnimWrapper from "@/components/AnimWrapper";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { getToolArticle } from "@/lib/getToolArticle";

export async function generateMetadata() {
    const article = await getToolArticle('/outils/calculateur-1rm');
    return {
        title: `${article.title || 'Calculateur 1RM'} | NA Coaching`,
        description: article.intro || 'Estimez votre 1RM en musculation.',
    }
}

const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'SoftwareApplication',
    'name': 'Calculateur 1RM NA Coaching',
    'applicationCategory': 'HealthApplication',
    'operatingSystem': 'Web',
    'offers': {
        '@type': 'Offer',
        'price': '0',
        'priceCurrency': 'EUR'
    },
    'description': 'Outil gratuit pour calculer sa répétition maximale (1RM) en musculation.'
};

export default async function Calculator1RMPage() {
    const article = await getToolArticle('/outils/calculateur-1rm');

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
                        {article.title || 'Calculateur 1RM (Max Rep)'}
                    </h1>
                    <p className="text-xl text-zinc-600 mb-12">
                        {article.intro || "Estimez votre charge maximale théorique pour calibrer vos entraînements de force et d'hypertrophie."}
                    </p>

                    <div className="mb-16">
                        <Calculator1RM />
                    </div>

                    {/* SEO Content */}
                    <article
                        className="prose prose-zinc max-w-none text-zinc-900"
                        dangerouslySetInnerHTML={{ __html: article.content }}
                    />
                </AnimWrapper>
            </div>
        </section>
    );
}
