
import SpeedConverter from "@/components/tools/SpeedConverter";
import AnimWrapper from "@/components/AnimWrapper";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { createClient } from "@supabase/supabase-js";

// Fetch content from Supabase
async function getToolContent() {
    const supabase = createClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
    );

    const keys = ['tool_speed_title', 'tool_speed_intro', 'tool_speed_content'];
    const { data } = await supabase.from('site_content').select('*').in('key', keys);

    const content = {};
    keys.forEach(key => {
        content[key] = data?.find(item => item.key === key)?.value || '';
    });

    return content;
}

export async function generateMetadata() {
    const content = await getToolContent();
    return {
        title: `${content.tool_speed_title || 'Convertisseur Vitesse'} | NA Coaching`,
        description: content.tool_speed_intro || 'Convertissez instantanément votre vitesse.',
    }
}

const jsonLd = {
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

export default async function SpeedConverterPage() {
    const content = await getToolContent();

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
                        {content.tool_speed_title || 'Convertisseur Vitesse / Allure'}
                    </h1>
                    <p className="text-xl text-zinc-600 mb-12">
                        {content.tool_speed_intro || "Passez facilement des km/h aux min/km pour calibrer vos séances de course à pied."}
                    </p>

                    <div className="mb-16">
                        <SpeedConverter />
                    </div>

                    {/* SEO Content */}
                    <article
                        className="prose prose-zinc max-w-none text-zinc-900"
                        dangerouslySetInnerHTML={{ __html: content.tool_speed_content }}
                    />
                </AnimWrapper>
            </div>
        </section>
    );
}
