
import Calculator1RM from "@/components/tools/Calculator1RM";
import AnimWrapper from "@/components/AnimWrapper";
import Link from "next/link";
import { ArrowLeft, ShoppingBag, Info } from "lucide-react";
import { supabase } from '@/lib/supabaseClient';
import { getToolArticle, getToolRelatedArticles } from "@/lib/getToolArticle";
import ToolArticleContent from "@/components/ToolArticleContent";
import AffiliateCard from "@/components/AffiliateCard";
import RelatedArticles from "@/components/RelatedArticles";
import RelatedTools from "@/components/RelatedTools";
import HomeFAQ from "@/components/HomeFAQ";
import Breadcrumb from "@/components/Breadcrumb";

export const dynamic = 'force-dynamic';

export async function generateMetadata() {
    const article = await getToolArticle('/outils/calculateur-1rm');
    const displayTitle = article.title || 'Calculateur 1RM';
    const seoTitle = article.seo_title || displayTitle;
    const description = article.meta_desc || article.intro || 'Estimez votre 1RM en musculation.';
    
    return {
        title: seoTitle.includes('NA Coaching') ? seoTitle : `${seoTitle} | NA Coaching`,
        description: description,
        authors: [{ name: 'NA Coaching (Master EOPS)', url: 'https://www.na-coaching.com/' }],
        openGraph: {
            title: title,
            description: description,
            images: [article.image || '/logo.png'],
            type: 'website',
        },
        alternates: {
            canonical: 'https://www.na-coaching.com/outils/calculateur-1rm/',
        }
    }
}

const softwareJsonLd = {
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

const DEFAULT_FAQ_DATA = [
    {
        question: "C'est quoi le 1RM en musculation et à quoi ça sert ?",
        answer: "Le 1RM (One Repetition Maximum) est la charge maximale que vous pouvez soulever sur une seule répétition avec une technique parfaite. C'est la référence pour programmer vos entraînements : les pourcentages de charge (ex : 75% du 1RM pour l'hypertrophie) permettent de cibler précisément vos objectifs."
    },
    {
        question: "Comment calculer son 1RM sans tester sa charge maximale ?",
        answer: "Plutôt que de risquer une blessure en testant votre max réel, utilisez les formules d'estimation (Brzycki, Epley). Entrez simplement le poids soulevé et le nombre de répétitions effectuées (entre 2 et 10 reps) et le calculateur estime votre 1RM théorique avec une marge d'erreur de 5 à 10%."
    },
    {
        question: "Quelle est la différence entre les formules Brzycki et Epley ?",
        answer: "La formule de Brzycki (1RM = poids × 36 / (37 − reps)) est plus précise pour les séries courtes (2-6 reps). Celle d'Epley (1RM = poids × (1 + reps/30)) fonctionne mieux pour les séries plus longues (6-10 reps). Notre calculateur utilise les deux pour vous donner l'estimation la plus fiable."
    },
    {
        question: "À quelle fréquence faut-il recalculer son 1RM ?",
        answer: "Il est recommandé de réévaluer votre 1RM toutes les 4 à 6 semaines, ou à chaque début de nouveau cycle d'entraînement. Cela permet d'ajuster vos charges de travail à votre progression réelle et d'éviter de stagner."
    },
    {
        question: "Quel pourcentage du 1RM utiliser pour la prise de masse musculaire ?",
        answer: "Pour l'hypertrophie musculaire, travaillez entre 65% et 80% de votre 1RM avec 8 à 12 répétitions par série. Pour la force maximale, visez 85-95% du 1RM avec 1 à 5 reps. Pour l'endurance musculaire, restez entre 50-65% avec 15 à 20 reps."
    }
];

export default async function Calculator1RMPage() {
    const article = await getToolArticle('/outils/calculateur-1rm');
    const relatedArticles = await getToolRelatedArticles(article);

    // Fetch Dynamic FAQ
    let faqData = DEFAULT_FAQ_DATA;
    const { data: faqItem } = await supabase.from('site_content').select('value').eq('key', 'tool_1rm_faq').single();
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
                        { label: article.title || 'Calculateur 1RM' }
                    ]} />

                    <Link href="/outils/" className="inline-flex items-center gap-2 text-zinc-500 hover:text-[#FF6B00] transition mt-6 mb-8 font-bold uppercase text-sm">
                        <ArrowLeft size={16} /> Retour aux outils
                    </Link>

                    <h1 className="text-4xl md:text-5xl font-black uppercase mb-12 text-zinc-950 text-center">
                        {article.title || 'Calculateur 1RM'}
                    </h1>

                    <div className="lg:col-span-12">
                        <Calculator1RM hints={article.tool_hints} />
                    </div>

                    {/* SEO Content */}
                    <ToolArticleContent content={article.content} glossary={article.auto_links} currentPath={article.current_path} />

                    {/* AFFILIATE SECTION (RESTORED STYLE) */}
                    {article.affiliate_link && (
                        <div className="mt-12 border-t border-zinc-200 pt-12 flex flex-col items-center">
                            <div className="flex items-center gap-2 mb-8">
                                <Info size={16} className="text-[#FF6B00]" />
                                <h4 className="text-sm font-black uppercase tracking-wider text-zinc-500 font-bold">Expertise Matériel</h4>
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

                    <RelatedTools currentTool="calculateur-1rm" />

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
