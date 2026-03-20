import { supabase } from '@/lib/supabaseClient';
import LaboView from '@/components/LaboView';

export const metadata = {
    title: 'Le Labo — Articles Musculation, Running & Performance Sportive',
    description: 'Découvrez nos articles scientifiques sur la musculation, le running, la nutrition sportive et la réathlétisation. Conseils d\'expert Master EOPS.',
    openGraph: {
        title: 'Le Labo — Articles Musculation, Running & Performance Sportive',
        description: 'Articles scientifiques sur la performance, la physiologie et la réathlétisation par un coach expert EOPS.',
        url: 'https://www.na-coaching.com/labo',
        type: 'website',
    },
    alternates: {
        canonical: 'https://www.na-coaching.com/labo/',
    }
};

export const revalidate = 10; // Enable ISR (10 seconds) for faster updates

export default async function LaboPage() {
    const { data: articles } = await supabase.from('articles').select('*').eq('is_published', true).order('created_at', { ascending: false });
    const { data: content } = await supabase.from('site_content').select('*');

    const siteContent = {};
    if (content) {
        content.forEach(item => { siteContent[item.key] = item.value; });
    }

    return <LaboView articles={articles || []} siteContent={siteContent} />;
}
