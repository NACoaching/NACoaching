import { supabase } from '@/lib/supabaseClient';
import AnimWrapper from "@/components/AnimWrapper";

export const metadata = {
    title: 'Mentions Légales',
    description: 'Mentions légales du site NA Coaching : éditeur, hébergeur, propriété intellectuelle et conditions d\'utilisation.',
    alternates: { canonical: 'https://www.na-coaching.com/mentions-legales/' },
};

export const revalidate = 0;

export default async function MentionsLegales() {
    const { data } = await supabase.from('site_content').select('value').eq('key', 'legal_mentions').single();
    const content = data?.value || "Contenu non disponible.";

    return (
        <section className="py-32 min-h-screen bg-white">
            <div className="max-w-4xl mx-auto px-6">
                <AnimWrapper>
                    <h1 className="text-4xl font-black uppercase mb-12 text-[#FF6B00]">Mentions Légales</h1>
                    <div className="prose prose-lg prose-zinc max-w-none whitespace-pre-wrap text-zinc-900">
                        {content}
                    </div>
                </AnimWrapper>
            </div>
        </section>
    );
}
