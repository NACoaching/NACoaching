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

            // Don't track automated browsers (like Playwright, bots, etc.)
            const isBot =
                typeof window !== 'undefined' &&
                (window.navigator.webdriver ||
                    /bot|crawler|spider|googlebot|bingbot|yandexbot|duckduckbot|slurp|baiduspider|playwright|headless/i.test(window.navigator.userAgent) ||
                    (window.navigator.userAgent.includes('Chrome/') && parseInt(window.navigator.userAgent.match(/Chrome\/(\d+)/)?.[1] || 0) > 140));

            if (isBot) return;

            // Don't track views from authenticated users (admin)
            const { data: { session } } = await supabase.auth.getSession();
            if (session) return;

            // Get or generate visitor_id
            let visitorId = localStorage.getItem('na_visitor_id');
            if (!visitorId) {
                visitorId = crypto.randomUUID();
                localStorage.setItem('na_visitor_id', visitorId);
            }

            await supabase.from('page_views').insert([{
                page_path: pathname,
                visitor_id: visitorId
            }]);
        }

        trackView();
    }, [pathname]);

    return null;
}
