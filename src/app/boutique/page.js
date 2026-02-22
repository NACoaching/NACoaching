import { supabase } from '@/lib/supabaseClient';
import { ShoppingBag, ChevronRight, Star } from 'lucide-react';
import Link from 'next/link';

export const metadata = {
    title: 'La Boutique - NA Coaching',
    description: 'Programmes de coaching et ebooks basés sur la science.',
    openGraph: {
        title: 'La Boutique - NA Coaching',
        description: 'Programmes de coaching et ebooks basés sur la physiologie et la biomécanique.',
        url: 'https://na-coaching.com/boutique',
        type: 'website',
    }
};

export const revalidate = 3600;

import BoutiqueView from '@/components/BoutiqueView';

export default async function BoutiquePage() {
    const [productsRes, contentRes, reviewsRes] = await Promise.all([
        supabase.from('products').select('*').order('created_at', { ascending: false }),
        supabase.from('site_content').select('*'),
        supabase.from('reviews').select('*')
    ]);

    const products = productsRes.data || [];
    const content = contentRes.data || [];
    const allReviews = reviewsRes.data || [];

    const siteContent = {};
    content.forEach(item => { siteContent[item.key] = item.value; });

    return <BoutiqueView products={products} siteContent={siteContent} allReviews={allReviews} />;
}
