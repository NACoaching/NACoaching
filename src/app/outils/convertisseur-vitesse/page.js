
import SpeedConverter from "@/components/tools/SpeedConverter";
import AnimWrapper from "@/components/AnimWrapper";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { getToolArticle, getToolRelatedArticles } from "@/lib/getToolArticle";
import { supabase } from '@/lib/supabaseClient';
import ToolArticleContent from "@/components/ToolArticleContent";
import RelatedArticles from "@/components/RelatedArticles";
import HomeFAQ from "@/components/HomeFAQ";

export const revalidate = 0;

export async function generateMetadata() {
    const article = await getToolArticle('/outils/convertisseur-vitesse');
    return {
        title: `${article.title || 'Convertisseur Vitesse'} | NA Coaching`,
        description: article.intro || 'Convertissez instantanément votre vitesse.',
        authors: [{ name: 'NA Coaching (Master EOPS)', url: 'https://na-coaching.com' }],
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
        question: 'Comment convertir km/h en min/km ?',
        answer: 'La formule est 60 divisé par la vitesse en km/h. Par exemple, pour 12 km/h : 60 / 12 = 5 min/km.'
    },
    {
        question: 'Quelle est l\'allure pour courir un marathon en 4h ?',
        answer: 'Pour terminer un marathon en 4 heures, vous devez maintenir une allure moyenne de 5:41 min/km (soit environ 10.55 km/h).'
    },
    {
        question: 'Pourquoi mesurer l\'allure en min/km plutôt qu\'en km/h ?',
        answer: 'L\'allure en min/km est plus pratique pour le coureur car elle permet de calculer facilement ses temps de passage au kilomètre et de gérer son effort pendant la course.'
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
                    <p className="text-xl text-zinc-600 mb-12">
                        {article.intro || "Passez facilement des km/h aux min/km pour calibrer vos séances de course à pied."}
                    </p>

                    <div className="mb-16">
                        <SpeedConverter />
                    </div>

                    {/* SEO Content */}
                    <ToolArticleContent content={article.content} />

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
