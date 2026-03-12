import { supabase } from '@/lib/supabaseClient';
import AnimWrapper from "@/components/AnimWrapper";

export const metadata = {
    title: 'Politique de Confidentialité',
    description: 'Politique de confidentialité de NA Coaching : collecte de données, cookies, droits RGPD et protection de la vie privée.',
    alternates: { canonical: 'https://www.na-coaching.com/politique-confidentialite' },
    robots: { index: false, follow: true },
};

export const revalidate = 0;

export default async function PolitiqueConfidentialite() {
    const { data } = await supabase.from('site_content').select('value').eq('key', 'privacy_policy').single();
    const content = data?.value || "Contenu non disponible.";

    return (
        <section className="py-32 min-h-screen bg-white">
            <div className="max-w-4xl mx-auto px-6">
                <AnimWrapper>
                    <h1 className="text-4xl font-black uppercase mb-12 text-[#FF6B00]">Politique de Confidentialité</h1>
                    <div className="prose prose-lg prose-zinc max-w-none whitespace-pre-wrap text-zinc-900">
                        {content}
                    </div>
                </AnimWrapper>
            </div>
        </section>
    );
}
