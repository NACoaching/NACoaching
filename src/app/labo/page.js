import { supabase } from '@/lib/supabaseClient';
import LaboView from '@/components/LaboView';

export const metadata = {
    title: 'Le Labo - NA Coaching',
    description: 'Articles scientifiques sur la performance et la réathlétisation.',
};

export const revalidate = 0; // Disable static caching for dynamic content

export default async function LaboPage() {
    const { data: articles } = await supabase.from('articles').select('*').order('created_at', { ascending: false });
    const { data: content } = await supabase.from('site_content').select('*');

    const siteContent = {};
    if (content) {
        content.forEach(item => { siteContent[item.key] = item.value; });
    }

    return <LaboView articles={articles || []} siteContent={siteContent} />;
}
