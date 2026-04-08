
import CalculatorCalories from "@/components/tools/CalculatorCalories";
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

export const dynamic = 'force-dynamic';

export async function generateMetadata() {
    const article = await getToolArticle('/outils/besoins-caloriques');
    const displayTitle = article.title || 'Besoins Caloriques';
    const seoTitle = article.seo_title || displayTitle;
    const description = article.meta_desc || article.intro || 'Calculez vos besoins caloriques journaliers.';

    return {
        title: seoTitle.includes('NA Coaching') ? seoTitle : `${seoTitle} | NA Coaching`,
        description: description,
        authors: [{ name: 'NA Coaching (Master EOPS)', url: 'https://www.na-coaching.com/' }],
        openGraph: {
            title: seoTitle,
            description: description,
            images: [article.image || '/logo.png'],
            type: 'website',
        },
        alternates: {
            canonical: 'https://www.na-coaching.com/outils/besoins-caloriques/',
        }
    }
}

const softwareJsonLd = {
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

const DEFAULT_FAQ_DATA = [
    {
        question: "Comment calculer ses besoins caloriques journaliers ?",
        answer: "Vos besoins caloriques dépendent de deux facteurs : votre métabolisme de base (BMR – calories brûlées au repos, calculé selon votre âge, sexe, poids et taille) et votre niveau d'activité physique quotidien. Le TDEE (Total Daily Energy Expenditure) est le résultat de ces deux facteurs combinés."
    },
    {
        question: "C'est quoi le TDEE et pourquoi est-ce important ?",
        answer: "Le TDEE (Total Daily Energy Expenditure) est le nombre total de calories que votre corps brûle chaque jour. C'est votre point d'équilibre : manger au-dessus permet la prise de masse, manger en dessous déclenche la perte de poids. Connaître son TDEE est la base de toute stratégie nutritionnelle efficace."
    },
    {
        question: "Quel déficit calorique pour perdre du gras sans perdre de muscle ?",
        answer: "Un déficit modéré de 300 à 500 calories par jour par rapport à votre TDEE est optimal pour perdre du gras tout en préservant la masse musculaire. Combiné à un apport suffisant en protéines (1.6 à 2.2g/kg) et un entraînement de musculation, ce déficit permet une perte durable d'environ 0.5 kg par semaine."
    },
    {
        question: "Combien de calories en surplus pour prendre du muscle ?",
        answer: "Pour une prise de masse musculaire propre, visez un surplus calorique de 200 à 400 calories au-dessus de votre TDEE. Au-delà, vous risquez d'accumuler trop de tissu adipeux. Ce surplus doit s'accompagner d'un entraînement progressif en musculation et d'un apport protéique suffisant."
    },
    {
        question: "Quelle formule est utilisée pour calculer le métabolisme de base ?",
        answer: "Notre calculateur utilise la formule de Mifflin-St Jeor, considérée comme la plus précise par la recherche scientifique actuelle. Elle tient compte de votre poids, taille, âge et sexe. Le résultat est ensuite multiplié par un coefficient d'activité pour obtenir votre TDEE."
    }
];

export default async function CalculatorCaloriesPage() {
    const article = await getToolArticle('/outils/besoins-caloriques');
    const relatedArticles = await getToolRelatedArticles(article);

    // Fetch Dynamic FAQ
    let faqData = DEFAULT_FAQ_DATA;
    const { data: faqItem } = await supabase.from('site_content').select('value').eq('key', 'tool_calories_faq').single();
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
                        { label: article.title || 'Besoins Caloriques' }
                    ]} />

                    <Link href="/outils/" className="inline-flex items-center gap-2 text-zinc-500 hover:text-[#FF6B00] transition mt-6 mb-8 font-bold text-sm">
                        <ArrowLeft size={16} /> Retour aux outils
                    </Link>

                    <h1 className="text-4xl md:text-5xl font-bold mb-6 text-zinc-950 text-center">
                        {article.title || 'Calculateur de Besoins Caloriques'}
                    </h1>
                    <p className="text-zinc-800 font-normal text-zinc-600 text-lg mb-8 leading-relaxed text-center max-w-2xl mx-auto">
                        {article.intro || "Estimez précisément votre dépense énergétique totale quotidienne."}
                    </p>

                    <div className="lg:col-span-7">
                        <CalculatorCalories hints={article.tool_hints} />
                    </div>

                    {/* SEO Content */}
                    <ToolArticleContent content={article.content} glossary={article.auto_links} currentPath={article.current_path} />

                    {/* AFFILIATE SECTION (RESTORED STYLE) */}
                    {article.affiliate_link && (
                        <div className="mt-12 border-t border-zinc-200 pt-12 flex flex-col items-center">
                            <div className="flex items-center gap-2 mb-8">
                                <Info size={16} className="text-[#FF6B00]" />
                                <h4 className="text-sm font-bold tracking-wider text-zinc-700 font-bold">Expertise Matériel</h4>
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

                    <RelatedTools currentTool="besoins-caloriques" />

                    {/* Related Articles */}
                    <RelatedArticles
                        articles={relatedArticles}
                        title={article.related_title}
                        subtitle={article.related_subtitle}
                    />
                </AnimWrapper>
            </div>
            <div className="bg-white">
                {faqData && faqData.length > 0 && (
                    <HomeFAQ faqData={faqData} title="Questions Fréquentes sur les Calories" id="faq-calories" />
                )}
            </div>
        </section>
    );
}
