import AdvancedMacros from "@/components/tools/AdvancedMacros";
import HomeFAQ from '@/components/HomeFAQ';
import AnimWrapper from "@/components/AnimWrapper";
import Link from "next/link";
import { ArrowLeft, ShoppingBag, Info } from "lucide-react";
import { getToolArticle, getToolRelatedArticles } from "@/lib/getToolArticle";
import { supabase } from "@/lib/supabaseClient";
import ToolArticleContent from "@/components/ToolArticleContent";
import AffiliateCard from "@/components/AffiliateCard";
import RelatedArticles from "@/components/RelatedArticles";
import RelatedTools from "@/components/RelatedTools";
import Breadcrumb from "@/components/Breadcrumb";

export const revalidate = 0;

export async function generateMetadata() {
    const article = await getToolArticle('/outils/macros-avancees');
    return {
        title: `${article.title || 'Calculateur de Macros Avancé — Protéines, Lipides & Glucides'} | NA Coaching`,
        description: article.meta_desc || article.intro || 'Calculez précisément vos besoins en protéines, lipides et glucides selon votre poids de corps et vos objectifs. Outil gratuit pour sportifs.',
        authors: [{ name: 'NA Coaching (Master EOPS)', url: 'https://www.na-coaching.com/' }],
        openGraph: {
            title: article.title || 'Calculateur de Macros Avancé',
            description: article.meta_desc || article.intro || 'Calculez vos macronutriments pour la musculation et la performance.',
            images: [article.image || '/logo.png'],
            type: 'website',
        },
        alternates: { canonical: 'https://www.na-coaching.com/outils/macros-avancees/' },
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

const DEFAULT_FAQ_DATA = [
    {
        question: "Comment calculer la répartition idéale de ses macronutriments ?",
        answer: "La répartition optimale dépend de votre objectif : en prise de masse, visez environ 2g de protéines/kg, 4-6g de glucides/kg et 0.8-1.2g de lipides/kg. En sèche, augmentez les protéines (2-2.5g/kg), réduisez les glucides et maintenez les lipides. Notre outil calcule ces valeurs automatiquement."
    },
    {
        question: "Combien de protéines par jour pour la musculation ?",
        answer: "La recherche scientifique recommande 1.6 à 2.2g de protéines par kg de poids corporel pour optimiser la synthèse protéique musculaire. Au-delà de 2.2g/kg, les bénéfices supplémentaires sont minimes. Répartissez l'apport sur 3 à 5 repas pour maximiser l'absorption."
    },
    {
        question: "Faut-il compter les macros ou les calories pour progresser ?",
        answer: "Les deux sont complémentaires. Les calories déterminent si vous gagnez ou perdez du poids, tandis que la répartition des macronutriments influence la composition corporelle (muscle vs graisse). Compter ses macros est la méthode la plus efficace pour transformer son physique de manière ciblée."
    },
    {
        question: "Quelle est la différence entre macros et calories ?",
        answer: "Les macronutriments (protéines, glucides, lipides) fournissent des calories : 1g de protéine = 4 kcal, 1g de glucide = 4 kcal, 1g de lipide = 9 kcal. Les calories sont l'énergie totale, les macros sont la composition qualitative de cette énergie. Les deux comptent pour la performance et la composition corporelle."
    },
    {
        question: "Comment adapter ses macros selon les jours d'entraînement ?",
        answer: "Le cycling des glucides est une stratégie efficace : augmentez les glucides les jours d'entraînement intense (+50-100g) pour soutenir la performance, et réduisez-les légèrement les jours de repos. Les protéines restent constantes chaque jour. Notre outil vous aide à ajuster cette répartition automatiquement."
    }
];

export default async function MacrosAvanceesPage() {
    const article = await getToolArticle('/outils/macros-avancees');
    const relatedArticles = await getToolRelatedArticles(article);

    let faqData = DEFAULT_FAQ_DATA;
    const { data: faqItem } = await supabase.from('site_content').select('value').eq('key', 'tool_macros_faq').single();
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
                dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
            />
            {faqData && faqData.length > 0 && (
                <script
                    type="application/ld+json"
                    dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
                />
            )}
            <div className="max-w-4xl mx-auto px-6">
                <AnimWrapper>
                    <Breadcrumb items={[
                        { label: 'Accueil', href: '/' },
                        { label: 'Outils', href: '/outils/' },
                        { label: article.title || 'Macros Avancées' }
                    ]} />

                    <Link href="/outils/" className="inline-flex items-center gap-2 text-zinc-700 hover:text-[#FF6B00] transition mt-8 mb-8 font-bold uppercase text-sm">
                        <ArrowLeft size={16} /> Retour aux outils
                    </Link>

                    <h1 className="text-4xl md:text-5xl font-black uppercase mb-6 text-[#FF6B00]">
                        {article.title || 'Calculateur de Macros Avancé'}
                    </h1>
                    <p className="text-xl text-zinc-800 mb-12 font-medium">
                        {article.intro || "Allez plus loin qu'un simple calcul de calories. Définissez vos ratios de protéines et lipides selon votre poids de corps."}
                    </p>

                    <div className="mb-16">
                        <AdvancedMacros hints={article.tool_hints} />
                    </div>

                    {/* SEO Content */}
                    <ToolArticleContent content={article.content} glossary={article.auto_links} currentPath={article.current_path} />

                    {/* AFFILIATE SECTION (RESTORED STYLE) */}
                    {article.affiliate_link && (
                        <div className="mt-12 border-t border-zinc-200 pt-12 flex flex-col items-center">
                            <div className="flex items-center gap-2 mb-8">
                                <Info size={16} className="text-[#FF6B00]" />
                                <h4 className="text-sm font-black uppercase tracking-wider text-zinc-700 font-bold">Expertise Matériel</h4>
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

                    <RelatedTools currentTool="macros-avancees" />

                    {/* FAQ SECTION */}
                    {faqData && faqData.length > 0 && (
                        <div className="mt-16">
                            <HomeFAQ faqData={faqData} title="Questions Fréquentes sur les Macronutriments" id="faq-macros" />
                        </div>
                    )}

                    {/* Related Articles */}
                    <RelatedArticles
                        articles={relatedArticles}
                        title={article.related_title}
                        subtitle={article.related_subtitle}
                    />
                </AnimWrapper>
            </div>
        </section>
    );
}
