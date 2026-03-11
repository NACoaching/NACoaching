import { supabase } from '@/lib/supabaseClient';
import { notFound } from 'next/navigation';
import ProductClientView from '@/components/ProductClientView';
import Breadcrumb from '@/components/Breadcrumb';

export const revalidate = 3600;

// Generate dynamic metadata for the product
export async function generateMetadata({ params }) {
    const { slug } = await params;
    const { data: product } = await supabase.from('products').select('*').eq('slug', slug).single();

    if (!product) {
        return {
            title: 'Produit introuvable - NA Coaching',
        }
    }

    const firstImage = (product.images && product.images.length > 0) ? product.images[0] : product.image;

    return {
        title: `${product.title} - NA Coaching`,
        description: product.description,
        openGraph: {
            title: product.title,
            description: product.description,
            images: firstImage ? [firstImage] : [],
        },
    }
}

export default async function ProductPage({ params }) {
    const { slug } = await params;

    // Fetch the product first to get its ID for reviews
    const { data: productDetails } = await supabase.from('products').select('*').eq('slug', slug).single();

    if (!productDetails) {
        notFound();
    }

    // Fetch all data necessary on the server
    const [contentRes, reviewsRes] = await Promise.all([
        supabase.from('site_content').select('*'),
        supabase.from('reviews').select('*').eq('product_id', productDetails.id).order('created_at', { ascending: false })
    ]);

    const product = productDetails;
    const siteContentMap = {};
    if (contentRes.data) {
        contentRes.data.forEach(item => { siteContentMap[item.key] = item.value; });
    }
    const reviews = reviewsRes.data || [];

    // Fetch related articles (Labo)
    const { data: relatedArticlesData } = await supabase
        .from('articles')
        .select('id, title, category')
        .eq('is_published', true)
        .order('created_at', { ascending: false })
        .limit(3);

    const relatedArticles = relatedArticlesData || [];

    const averageRating = reviews.length > 0
        ? (reviews.reduce((acc, r) => acc + r.rating, 0) / reviews.length).toFixed(1)
        : null;

    const firstImage = (product.images && product.images.length > 0) ? product.images[0] : product.image;

    // Structured Data for Google (Product JSON-LD)
    const jsonLd = {
        '@context': 'https://schema.org',
        '@type': 'Product',
        name: product.title,
        description: product.description,
        image: firstImage ? [firstImage] : [],
        offers: {
            '@type': 'Offer',
            price: (product.discount_price || product.price) ? (product.discount_price || product.price).replace(/[^0-9.,]/g, '').replace(',', '.') : '0', // Keep only numbers
            priceCurrency: 'EUR',
            availability: 'https://schema.org/InStock',
            url: `https://www.na-coaching.com/boutique/${product.id}`,
        }
    };

    if (averageRating) {
        jsonLd.aggregateRating = {
            '@type': 'AggregateRating',
            ratingValue: averageRating,
            reviewCount: reviews.length,
            bestRating: '5',
            worstRating: '1'
        };
    }

    let faqJsonLd = null;
    if (product.faqs && Array.isArray(product.faqs) && product.faqs.length > 0) {
        faqJsonLd = {
            '@context': 'https://schema.org',
            '@type': 'FAQPage',
            mainEntity: product.faqs.map(faq => ({
                '@type': 'Question',
                name: faq.question,
                acceptedAnswer: {
                    '@type': 'Answer',
                    text: faq.answer
                }
            }))
        };
    }

    const breadcrumbItems = [
        { label: 'Accueil', href: '/' },
        { label: 'Boutique', href: '/boutique' },
        { label: product.title, href: `/boutique/${product.slug || product.id}` },
    ];


    return (
        <>
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
            />
            {faqJsonLd && (
                <script
                    type="application/ld+json"
                    dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
                />
            )}
            <ProductClientView
                initialProduct={product}
                initialReviews={reviews}
                siteContentMap={siteContentMap}
                relatedArticles={relatedArticles}
                breadcrumbItems={breadcrumbItems}
            />
        </>
    );
}
