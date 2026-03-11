
import SpeedConverter from "@/components/tools/SpeedConverter";
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

export const revalidate = 0;

export async function generateMetadata() {
    const article = await getToolArticle('/outils/convertisseur-vitesse');
    return {
        title: `${article.title || 'Convertisseur Vitesse'} | NA Coaching`,
        description: article.intro || 'Convertissez instantanément votre vitesse.',
        authors: [{ name: 'NA Coaching (Master EOPS)', url: 'https://www.na-coaching.com' }],
        openGraph: {
            title: article.title || 'Convertisseur Vitesse',
            description: article.intro || 'Convertissez instantanément votre vitesse.',
            images: [article.image || '/logo.png'],
            type: 'website',
        },
        alternates: {
            canonical: '/outils/convertisseur-vitesse',
        }
    }
}

const softwareJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'SoftwareApplication',
    'name': 'Convertisseur Vitesse Allure NA Coaching',
    'applicationCategory': 'HealthApplication',
    'operatingSystem': 'Web',
    'offers': {
        '@type': 'Offer',
        'price': '0',
        'priceCurrency': 'EUR'
    },
    'description': 'Outil gratuit pour convertir la vitesse de course (km/h) en allure (min/km).'
};

const DEFAULT_FAQ_DATA = [
    {
        question: "Comment convertir les km/h en min/km (allure de course) ?",
        answer: "La formule est simple : allure (min/km) = 60 ÷ vitesse (km/h). Par exemple, 12 km/h = 60 ÷ 12 = 5:00 min/km. Notre convertisseur fait le calcul instantanément dans les deux sens et affiche aussi les temps de passage aux distances clés."
    },
    {
        question: "Quelle allure pour courir un marathon en moins de 4 heures ?",
        answer: "Pour terminer un marathon (42.195 km) en moins de 4 heures, vous devez maintenir une allure moyenne de 5:41 min/km, soit environ 10.55 km/h. Prévoyez de courir les premiers kilomètres légèrement plus vite (5:35 min/km) pour avoir une marge de sécurité."
    },
    {
        question: "Pourquoi les coureurs utilisent l'allure en min/km plutôt que la vitesse en km/h ?",
        answer: "L'allure en min/km est plus pratique en course à pied car elle permet de calculer facilement ses temps de passage au kilomètre et de gérer son effort pendant la course. C'est aussi le format universel affiché sur les montres GPS de running comme Garmin, Polar ou COROS."
    },
    {
        question: "Comment calculer son temps de course prévu sur une distance ?",
        answer: "Multipliez votre allure (en min/km) par la distance (en km). Par exemple, à 5:30 min/km sur un semi-marathon (21.1 km) : 5.5 × 21.1 = 116 min soit 1h56. Notre outil affiche automatiquement les temps estimés pour le 5 km, 10 km, semi et marathon."
    },
    {
        question: "Quelle est l'allure moyenne d'un coureur débutant ?",
        answer: "Un coureur débutant court généralement entre 7:00 et 8:00 min/km (soit 7.5 à 8.5 km/h). Avec un entraînement régulier de 3 séances par semaine, cette allure peut descendre à 5:30-6:30 min/km en quelques mois. L'important est de progresser graduellement sans vouloir aller trop vite."
    }
];

export default async function SpeedConverterPage() {
    const article = await getToolArticle('/outils/convertisseur-vitesse');
    const relatedArticles = await getToolRelatedArticles(article);

    // Fetch Dynamic FAQ
    let faqData = DEFAULT_FAQ_DATA;
    const { data: faqItem } = await supabase.from('site_content').select('value').eq('key', 'tool_speed_faq').single();
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
                    <Link href="/outils" className="inline-flex items-center gap-2 text-zinc-500 hover:text-[#FF6B00] transition mb-8 font-bold uppercase text-sm">
                        <ArrowLeft size={16} /> Retour aux outils
                    </Link>

                    <h1 className="text-4xl md:text-5xl font-black uppercase mb-6 text-[#FF6B00]">
                        {article.title || 'Convertisseur Vitesse / Allure'}
                    </h1>
                    <p className="text-zinc-800 font-medium text-lg mb-8 leading-relaxed">
                        {article.intro || "Passez facilement des km/h aux min/km pour calibrer vos séances de course à pied."}
                    </p>

                    <div className="mb-16">
                        <SpeedConverter hints={article.tool_hints} />
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

                    <RelatedTools currentTool="convertisseur-vitesse" />

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
                    <HomeFAQ faqData={faqData} title="Questions Fréquentes sur les Allures" id="faq-vitesse" />
                )}
            </div>
        </section>
    );
}
