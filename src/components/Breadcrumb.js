import Link from 'next/link';
import { ChevronRight } from 'lucide-react';

/**
 * Breadcrumb component - renders both visual breadcrumbs and BreadcrumbList JSON-LD for SEO
 * 
 * @param {Array} items - Array of { label: string, href: string (optional for last item) }
 * Example: [{ label: 'Accueil', href: '/' }, { label: 'Boutique', href: '/boutique' }, { label: 'Mon produit' }]
 */
export default function Breadcrumb({ items = [] }) {
    if (!items || items.length < 2) return null;

    const jsonLd = {
        '@context': 'https://schema.org',
        '@type': 'BreadcrumbList',
        itemListElement: items.map((item, index) => ({
            '@type': 'ListItem',
            position: index + 1,
            name: item.label,
            item: item.href ? `https://www.na-coaching.com${item.href}${item.href.endsWith('/') ? '' : '/'}` : undefined,
        })),
    };

    return (
        <>
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
            />
            <nav aria-label="Fil d'ariane" className="flex items-center gap-1.5 text-xs font-bold text-zinc-600 flex-wrap">
                {items.map((item, index) => (
                    <span key={index} className="flex items-center gap-1.5">
                        {index > 0 && <ChevronRight size={12} className="text-zinc-700 flex-shrink-0" />}
                        {item.href && index < items.length - 1 ? (
                            <Link href={item.href} className="hover:text-[#FF6B00] transition uppercase tracking-wider">
                                {item.label}
                            </Link>
                        ) : (
                            <span className="text-zinc-700 uppercase tracking-wider line-clamp-1">{item.label}</span>
                        )}
                    </span>
                ))}
            </nav>
        </>
    );
}
