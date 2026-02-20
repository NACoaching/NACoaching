
import VmaVo2Converter from "@/components/tools/VmaVo2Converter";
import AnimWrapper from "@/components/AnimWrapper";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { getToolArticle } from "@/lib/getToolArticle";

export async function generateMetadata() {
    const article = await getToolArticle('/outils/vma-vo2');
    return {
        title: `${article.title || 'Convertisseur VMA / VO2max'} | NA Coaching`,
        description: article.intro || 'Estimez votre VMA et VO2max.',
    }
}

const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'SoftwareApplication',
    'name': 'Convertisseur VMA VO2max NA Coaching',
    'applicationCategory': 'HealthApplication',
    'operatingSystem': 'Web',
    'offers': {
        '@type': 'Offer',
        'price': '0',
        'priceCurrency': 'EUR'
    },
    'description': 'Outil gratuit pour convertir la VMA en VO2max et inversement.'
};

export default async function VmaVo2ConverterPage() {
    const article = await getToolArticle('/outils/vma-vo2');

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
                        {article.title || 'Convertisseur VMA / VO2max'}
                    </h1>
                    <p className="text-xl text-zinc-600 mb-12">
                        {article.intro || "Analysez votre potentiel aérobie en reliant votre vitesse maximale à votre consommation d'oxygène."}
                    </p>

                    <div className="mb-16">
                        <VmaVo2Converter />
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
