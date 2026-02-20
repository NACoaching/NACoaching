"use client";
import { useEffect } from 'react';
import { usePathname } from 'next/navigation';
import { supabase } from '@/lib/supabaseClient';

export default function PageTracker() {
    const pathname = usePathname();

    useEffect(() => {
        async function trackView() {
            // Don't track admin pages
            if (pathname.startsWith('/admin')) return;

            // Don't track views from authenticated users (admin)
            const { data: { session } } = await supabase.auth.getSession();
            if (session) return;

            await supabase.from('page_views').insert([{ page_path: pathname }]);
        }

        trackView();
    }, [pathname]);

    return null;
}
