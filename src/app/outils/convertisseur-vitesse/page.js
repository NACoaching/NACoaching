
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
import Breadcrumb from "@/components/Breadcrumb";

export const dynamic = 'force-dynamic';

export async function generateMetadata() {
    const article = await getToolArticle('/outils/convertisseur-vitesse');
    const defaultTitle = 'Convertisseur de Vitesse Running : km/h, min/km & m/s (Allures & Fractionné)';
    const displayTitle = (article.title && !article.title.includes('min/km & km/h')) ? article.title : defaultTitle;
    const seoTitle = article.seo_title || displayTitle;
    const description = (article.meta_desc && article.meta_desc.includes('m/s'))
        ? article.meta_desc
        : 'Convertissez instantanément vos allures et vitesses entre km/h, min/km et m/s. Calculez les distances exactes de vos séances de fractionné (15/15, 30/30) avec une précision de coach.';

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
            canonical: 'https://www.na-coaching.com/outils/convertisseur-vitesse/',
        }
    }
}

const softwareJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'SoftwareApplication',
    'name': 'Convertisseur Vitesse Running : km/h, min/km & m/s | NA Coaching',
    'applicationCategory': 'HealthApplication',
    'operatingSystem': 'Web',
    'offers': {
        '@type': 'Offer',
        'price': '0',
        'priceCurrency': 'EUR'
    },
    'description': 'Outil gratuit pour convertir la vitesse de course en km/h, allure en min/km et mètres par seconde (m/s). Calculez vos distances de fractionné (15/15, 30/30) et temps de passage.'
};

const DEFAULT_FAQ_DATA = [
    {
        question: "Comment convertir des km/h en m/s (mètres par seconde) ?",
        answer: "Pour convertir des km/h en m/s, divisez la vitesse par 3,6 (formule : m/s = km/h ÷ 3,6). Par exemple, 18 km/h ÷ 3,6 = 5,00 m/s. À l'inverse, multipliez vos m/s par 3,6 pour obtenir des km/h (ex : 4 m/s × 3,6 = 14,4 km/h). Notre outil effectue le calcul en temps réel."
    },
    {
        question: "Combien de mètres faut-il courir lors d'un fractionné 15/15 ou 30/30 ?",
        answer: "La distance dépend de votre vitesse en m/s multipliée par la durée de fraction en secondes (distance = m/s × secondes). Par exemple, pour un 15/15 à 18 km/h (5 m/s), vous devez courir exactement 75 mètres en 15 secondes. À 15 km/h (4,17 m/s), cela fait 62,5 mètres. Utilisez notre calculateur de fractionné ci-dessus pour baliser votre piste avec des plots."
    },
    {
        question: "Pourquoi convertir sa vitesse en m/s est indispensable sur piste ?",
        answer: "Sur des fractions très courtes (15/15, 30/30, 10/10), les puces GPS des montres ont un temps de latence de plusieurs secondes et manquent de précision instantanée. Convertir votre allure en m/s vous permet de mesurer la distance exacte en mètres et de baliser des repères fixes au sol (plots) pour courir à l'intensité physiologique exacte voulue."
    },
    {
        question: "Comment convertir les km/h en min/km (allure de course) ?",
        answer: "La formule est : allure (min/km) = 60 ÷ vitesse (km/h). Par exemple, 12 km/h = 60 ÷ 12 = 5:00 min/km. Notre convertisseur fait le calcul instantanément dans les deux sens et affiche aussi les mètres par seconde correspondants."
    },
    {
        question: "Quelle allure pour courir un marathon en moins de 4 heures ?",
        answer: "Pour terminer un marathon (42.195 km) en moins de 4 heures, vous devez maintenir une allure moyenne de 5:41 min/km, soit environ 10.55 km/h (ou 2.93 m/s). Prévoyez de courir les premiers kilomètres légèrement plus vite (5:35 min/km) pour avoir une marge de sécurité."
    },
    {
        question: "Pourquoi les coureurs utilisent l'allure en min/km plutôt que la vitesse en km/h ?",
        answer: "L'allure en min/km est plus pratique en course à pied car elle permet de calculer facilement ses temps de passage au kilomètre et de gérer son effort pendant la course. C'est aussi le format universel affiché sur les montres GPS de running comme Garmin, Polar ou COROS."
    }
];

const MS_SEO_SECTION = `## Pourquoi convertir sa vitesse en mètres par seconde (m/s) en course à pied ?

La plupart des coureurs et des montres connectées (Garmin, Coros, Polar, Suunto) utilisent l'**allure en min/km** ou la **vitesse en km/h**. Pourtant, dès que l'on aborde l'entraînement sur piste, la préparation physique ou le **fractionné court à haute intensité**, les **mètres par seconde (m/s)** deviennent la métrique reine.

### Le problème majeur du GPS sur les fractions courtes (15/15, 30/30)
Sur des efforts intermittents courts comme un **15/15** (15 secondes d'effort à 100-110% de VMA / 15 secondes de récupération) ou un **30/30**, une montre GPS accuse un **temps de latence de 3 à 8 secondes**. Lorsque votre montre indique enfin que vous êtes à 18 km/h, votre fraction est déjà terminée !

La solution utilisée par tous les entraîneurs diplômés (Master EOPS) et préparateurs physiques consiste à **traduire la vitesse cible en mètres par seconde**, puis à multiplier par la durée de fraction pour obtenir la **distance exacte en mètres** à baliser avec des plots.

$$\\text{Distance (mètres)} = \\text{Vitesse (m/s)} \\times \\text{Temps d'effort (secondes)}$$

---

## Les Formules de Conversion (km/h, m/s et min/km)

Le passage d'une unité à l'autre repose sur des équivalences mathématiques simples :

* **Convertir des km/h en m/s :** divisez par 3,6.  
  $$\\text{Vitesse (m/s)} = \\frac{\\text{Vitesse (km/h)}}{3{,}6}$$  
  *Exemple :* $18\\text{ km/h} / 3{,}6 = 5{,}00\\text{ m/s}$.
* **Convertir des m/s en km/h :** multipliez par 3,6.  
  $$\\text{Vitesse (km/h)} = \\text{Vitesse (m/s)} \\times 3{,}6$$  
  *Exemple :* $4{,}5\\text{ m/s} \\times 3{,}6 = 16{,}20\\text{ km/h}$.
* **Convertir des min/km en m/s :** convertissez l'allure en secondes totales par kilomètre, puis calculez $1000 / \\text{secondes}$.  
  *Exemple :* $4{:}00\\text{ min/km} = 240\\text{ s}$. $1000 / 240 = 4{,}17\\text{ m/s}$.

---

## Grand Tableau de Correspondance : km/h, m/s, min/km et Distances de Fractionné

Voici le tableau de référence pour calibrer vos séances de fractionné court (10/10, 15/15, 30/30) et repérer vos temps de passage :

| Vitesse (km/h) | Vitesse (m/s) | Allure (min/km) | Distance en 15s (15/15) | Distance en 30s (30/30) | Temps sur 10 km |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **10 km/h** | 2,78 m/s | 6:00 min/km | **41,7 m** | **83,3 m** | 1h 00min |
| **11 km/h** | 3,06 m/s | 5:27 min/km | **45,8 m** | **91,7 m** | 54min 32s |
| **12 km/h** | 3,33 m/s | 5:00 min/km | **50,0 m** | **100,0 m** | 50min 00s |
| **13 km/h** | 3,61 m/s | 4:37 min/km | **54,2 m** | **108,3 m** | 46min 09s |
| **14 km/h** | 3,89 m/s | 4:17 min/km | **58,3 m** | **116,7 m** | 42min 51s |
| **15 km/h** | 4,17 m/s | 4:00 min/km | **62,5 m** | **125,0 m** | 40min 00s |
| **16 km/h** | 4,44 m/s | 3:45 min/km | **66,7 m** | **133,3 m** | 37min 30s |
| **17 km/h** | 4,72 m/s | 3:32 min/km | **70,8 m** | **141,7 m** | 35min 18s |
| **18 km/h** | 5,00 m/s | 3:20 min/km | **75,0 m** | **150,0 m** | 33min 20s |
| **19 km/h** | 5,28 m/s | 3:09 min/km | **79,2 m** | **158,3 m** | 31min 35s |
| **20 km/h** | 5,56 m/s | 3:00 min/km | **83,3 m** | **166,7 m** | 30min 00s |
| **21 km/h** | 5,83 m/s | 2:51 min/km | **87,5 m** | **175,0 m** | 28min 34s |
| **22 km/h** | 6,11 m/s | 2:44 min/km | **91,7 m** | **183,3 m** | 27min 16s |

---

## Protocole Coach : Comment Baliser une Séance de 15/15 sur le Terrain ?

1. **Déterminez votre VMA** grâce à notre [Test Demi-Cooper](/outils/test-demi-cooper) ou [Calculateur VMA / VO2max](/outils/vma-vo2).
2. **Choisissez l'intensité cible** : pour du fractionné court (15/15), on travaille généralement entre **100% et 110% de sa VMA**.
   * *Exemple :* Pour un coureur avec une VMA de 16 km/h souhaitant faire son 15/15 à 105% de VMA, la vitesse cible est de $16{,}8\\text{ km/h}$.
3. **Convertissez en m/s** via le convertisseur ci-dessus : $16{,}8\\text{ km/h} / 3{,}6 = 4{,}67\\text{ m/s}$.
4. **Calculez la distance par fraction de 15s** : $4{,}67 \\times 15 = 70\\text{ mètres}$.
5. **Posez vos repères** : placez un plot de départ à 0 m et un plot d'arrivée à 70 m (en ligne droite ou sur la corde du couloir 1 d'une piste de 400 m).
6. **Exécution** : au coup de sifflet ou au bip du chronomètre, partez du plot 1 et atteignez impérativement le plot 2 en 15 secondes pile. Récupérez 15 secondes sur place ou en trottinant, puis repartez dans l'autre sens.

Cette méthode garantit une **précision physiologique totale**, sans dépendre des erreurs ou lenteurs du signal GPS.

---
`;

export default async function SpeedConverterPage() {
    const article = await getToolArticle('/outils/convertisseur-vitesse');
    const relatedArticles = await getToolRelatedArticles(article);

    const defaultTitle = 'Convertisseur de Vitesse Running : km/h, min/km & m/s (Allures & Fractionné)';
    const displayTitle = (article.title && !article.title.includes('min/km & km/h')) ? article.title : defaultTitle;
    const defaultIntro = "Convertissez instantanément vos vitesses entre km/h, min/km et m/s (mètres par seconde). Calculez précisément vos temps de passage et les distances exactes pour vos séances de fractionné court (15/15, 30/30) avec une précision de coach Master EOPS.";
    const displayIntro = (article.intro && article.intro.includes('m/s')) ? article.intro : defaultIntro;

    // Ensure m/s and fractionné content is integrated into the article
    let finalContent = article.content || '';
    if (!finalContent.includes('mètres par seconde (m/s)')) {
        finalContent = `${MS_SEO_SECTION}\n\n${finalContent}`;
    }

    // Fetch Dynamic FAQ
    let faqData = DEFAULT_FAQ_DATA;
    const { data: faqItem } = await supabase.from('site_content').select('value').eq('key', 'tool_speed_faq').single();
    if (faqItem && faqItem.value) {
        try {
            const parsed = JSON.parse(faqItem.value);
            if (parsed && parsed.length > 0) {
                // Ensure m/s questions exist in dynamic FAQ
                const hasMsQuestion = parsed.some(q => q.question?.toLowerCase().includes('m/s'));
                faqData = hasMsQuestion ? parsed : [...DEFAULT_FAQ_DATA.slice(0, 3), ...parsed];
            }
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
                        { label: 'Vitesse / Allure / m/s' }
                    ]} />

                    <Link href="/outils/" className="inline-flex items-center gap-2 text-zinc-500 hover:text-[#FF6B00] transition mt-8 mb-8 font-bold text-sm">
                        <ArrowLeft size={16} /> Retour aux outils
                    </Link>

                    <h1 className="text-4xl md:text-5xl font-bold mb-6 text-zinc-950 text-center">
                        {displayTitle}
                    </h1>
                    <p className="text-zinc-800 font-normal text-zinc-600 text-lg mb-8 leading-relaxed text-center max-w-2xl mx-auto">
                        {displayIntro}
                    </p>

                    <div className="mb-16">
                        <SpeedConverter hints={article.tool_hints} />
                    </div>

                    {/* SEO Content */}
                    <ToolArticleContent content={finalContent} glossary={article.auto_links} currentPath={article.current_path} />

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
