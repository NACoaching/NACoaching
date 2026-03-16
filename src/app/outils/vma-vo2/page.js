
import VmaVo2Converter from "@/components/tools/VmaVo2Converter";
import AnimWrapper from "@/components/AnimWrapper";
import Link from "next/link";
import { ArrowLeft, ShoppingBag, Info } from "lucide-react";
import { getToolArticle, getToolRelatedArticles } from "@/lib/getToolArticle";
import { supabase } from '@/lib/supabaseClient';
import ToolArticleContent from "@/components/ToolArticleContent";
import AffiliateCard from "@/components/AffiliateCard";
import RelatedArticles from "@/components/RelatedArticles";
import RelatedTools from "@/components/RelatedTools";
import HomeFAQ from "@/components/HomeFAQ";
import Breadcrumb from "@/components/Breadcrumb";

export const revalidate = 0;

export async function generateMetadata() {
    const article = await getToolArticle('/outils/vma-vo2');
    const title = article.title || 'Convertisseur VMA / VO2max';
    const description = article.meta_desc || article.intro || 'Estimez votre VMA et VO2max.';

    return {
        title: `${title} | NA Coaching`,
        description: description,
        authors: [{ name: 'NA Coaching (Master EOPS)', url: 'https://www.na-coaching.com/' }],
        openGraph: {
            title: title,
            description: description,
            images: [article.image || '/logo.png'],
            type: 'website',
        },
        alternates: {
            canonical: 'https://www.na-coaching.com/outils/vma-vo2/',
        }
    }
}

const softwareJsonLd = {
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

const DEFAULT_FAQ_DATA = [
    {
        question: "C'est quoi la VMA et pourquoi la calculer ?",
        answer: "La VMA (Vitesse Maximale Aérobie) est la vitesse de course à laquelle votre consommation d'oxygène atteint son maximum (VO2max). C'est l'indicateur clé en course à pied pour calibrer vos allures d'entraînement : endurance fondamentale, seuil, VMA, et fractionné."
    },
    {
        question: "Comment calculer sa VMA avec un test terrain ?",
        answer: "Les tests les plus courants sont le Test de Cooper (distance maximale en 12 minutes) et le Demi-Cooper (distance maximale en 6 minutes). Notre outil convertit directement votre résultat en VMA et VO2max. D'autres tests existent comme le VAMEVAL ou le Léger-Boucher."
    },
    {
        question: "Quelle est la différence entre VMA et VO2max ?",
        answer: "La VO2max est une mesure physiologique exprimée en ml/kg/min : c'est le volume maximal d'oxygène que vos muscles peuvent utiliser. La VMA est la traduction de cette capacité en vitesse de course (km/h). La relation est : VMA ≈ VO2max / 3.5. Connaître les deux permet de planifier un entraînement optimal."
    },
    {
        question: "Quelle est une bonne VMA selon le niveau ?",
        answer: "En course à pied, une VMA de 12-14 km/h correspond à un débutant, 14-17 km/h à un coureur régulier, 17-20 km/h à un bon compétiteur et au-delà de 20 km/h à un athlète de haut niveau. La VMA progresse avec un entraînement spécifique en fractionné court."
    },
    {
        question: "Comment améliorer sa VMA et sa VO2max ?",
        answer: "Le meilleur moyen est le travail en fractionné court : des intervalles de 30 secondes à 3 minutes courus entre 95% et 105% de votre VMA, entrecoupés de récupérations actives. Deux séances par semaine pendant 6 à 8 semaines permettent généralement un gain de 1 à 2 km/h de VMA."
    }
];

export default async function VmaVo2ConverterPage() {
    const article = await getToolArticle('/outils/vma-vo2');
    const relatedArticles = await getToolRelatedArticles(article);

    // Fetch Dynamic FAQ
    let faqData = DEFAULT_FAQ_DATA;
    const { data: faqItem } = await supabase.from('site_content').select('value').eq('key', 'tool_vma_faq').single();
    if (faqItem && faqItem.value) {
        try {
            const parsed = JSON.parse(faqItem.value);
            if (parsed && parsed.length > 0) faqData = parsed;
        } catch (e) { console.error("Error parsing FAQ", e); }
    }

    const faqJsonLd = {
        '@context': 'https://schema.org',
        '@type': 'FAQPage',
        'mainEntity': faqData.map(item => ({
            '@type': 'Question',
            'name': item.question,
            'acceptedAnswer': {
                '@type': 'Answer',
                'text': item.answer
            }
        }))
    };

    return (
        <section className="pt-32 pb-20 min-h-screen bg-zinc-50">
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(softwareJsonLd) }}
            />
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
            />
            <div className="max-w-4xl mx-auto px-6">
                <AnimWrapper>
                    <Breadcrumb items={[
                        { label: 'Accueil', href: '/' },
                        { label: 'Outils', href: '/outils/' },
                        { label: article.title || 'VMA / VO2max' }
                    ]} />

                    <Link href="/outils/" className="inline-flex items-center gap-2 text-zinc-500 hover:text-[#FF6B00] transition mt-6 mb-8 font-bold uppercase text-sm">
                        <ArrowLeft size={16} /> Retour aux outils
                    </Link>

                    <h1 className="text-4xl md:text-5xl font-black uppercase mb-6 text-[#FF6B00]">
                        {article.title || 'Convertisseur VMA / VO2max'}
                    </h1>
                    <p className="text-xl text-zinc-600 mb-12">
                        {article.intro || "Analysez votre potentiel aérobie en reliant votre vitesse maximale à votre consommation d'oxygène."}
                    </p>

                    <div className="lg:col-span-7">
                        <VmaVo2Converter hints={article.tool_hints} />
                    </div>

                    {/* SEO Content */}
                    <ToolArticleContent content={article.content} glossary={article.auto_links} currentPath={article.current_path} />

                    {/* AFFILIATE SECTION (RESTORED STYLE) */}
                    {article.affiliate_link && (
                        <div className="mt-12 border-t border-zinc-200 pt-12 flex flex-col items-center">
                            <div className="flex items-center gap-2 mb-8">
                                <span className="flex items-center gap-2">
                                    <Info size={16} className="text-[#FF6B00]" />
                                    <h4 className="text-sm font-black uppercase tracking-wider text-zinc-500 font-bold">Expertise Matériel</h4>
                                </span>
                            </div>

                            <div className="max-w-md w-full mx-auto">
                                <AffiliateCard
                                    title={article.affiliate_title || article.title}
                                    description={article.affiliate_text || "Recommandation d'expert pour optimiser vos résultats."}
                                    imageUrl={article.affiliate_image}
                                    affiliateUrl={article.affiliate_link}
                                    ctaText="Voir le produit"
                                    badge="Sélection Coach"
                                />
                            </div>
                        </div>
                    )}

                    <RelatedTools currentTool="vma-vo2" />

                    {/* Related Articles */}
                    <RelatedArticles
                        articles={relatedArticles}
                        title={article.related_title}
                        subtitle={article.related_subtitle}
                    />
                </AnimWrapper>
            </div>
            <HomeFAQ faqData={faqData} />
        </section>
    );
}
