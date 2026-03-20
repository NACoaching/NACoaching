import { supabase } from '@/lib/supabaseClient';
import { ShoppingBag, ChevronRight, Star } from 'lucide-react';
import Link from 'next/link';

export const metadata = {
    title: 'Boutique — Programmes Musculation & Ebooks Sport',
    description: 'Programmes d\'entraînement et ebooks basés sur la science pour la musculation, le running et la préparation physique. Par un coach expert EOPS.',
    openGraph: {
        title: 'Boutique — Programmes Musculation & Ebooks Sport',
        description: 'Programmes de coaching et ebooks sport basés sur la physiologie et la biomécanique.',
        url: 'https://www.na-coaching.com/boutique',
        type: 'website',
    },
    alternates: {
        canonical: 'https://www.na-coaching.com/boutique/',
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
