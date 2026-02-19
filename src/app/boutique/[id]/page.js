
"use client";
import React, { useState } from 'react';
import { supabase } from '@/lib/supabaseClient';
import Link from 'next/link';
import Image from 'next/image';
import { notFound } from 'next/navigation';
import ReactMarkdown from 'react-markdown';
import { ArrowLeft, ShoppingBag, Check, ChevronRight, Loader2 } from 'lucide-react';
import AnimWrapper from '@/components/AnimWrapper';
import ProductGallery from '@/components/ProductGallery';
import ReviewForm from '@/components/ReviewForm';
import ReviewList from '@/components/ReviewList';
import { Star } from 'lucide-react';

export default function ProductPage({ params }) {
    const [product, setProduct] = useState(null);
    const [loading, setLoading] = useState(true);
    const [checkoutLoading, setCheckoutLoading] = useState(false);
    const [siteContent, setSiteContent] = useState([]);
    const [reviews, setReviews] = useState([]);

    const fetchReviews = async (productId) => {
        const { data } = await supabase
            .from('reviews')
            .select('*')
            .eq('product_id', productId)
            .order('created_at', { ascending: false });
        if (data) setReviews(data);
    };

    React.useEffect(() => {
        async function loadData() {
            const { id } = await params;
            const [prodRes, contentRes, reviewsRes] = await Promise.all([
                supabase.from('products').select('*').eq('id', id).single(),
                supabase.from('site_content').select('*'),
                supabase.from('reviews').select('*').eq('product_id', id).order('created_at', { ascending: false })
            ]);

            if (prodRes.data) setProduct(prodRes.data);
            if (contentRes.data) setSiteContent(contentRes.data);
            if (reviewsRes.data) setReviews(reviewsRes.data);
            setLoading(false);
        }
        loadData();
    }, [params]);

    const getContent = (key, fallback) => siteContent.find(c => c.key === key)?.value || fallback;

    const handleCheckout = async () => {
        setCheckoutLoading(true);
        try {
            const res = await fetch('/api/checkout', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ productId: product.id }),
            });
            const data = await res.json();
            if (data.url) {
                window.location.href = data.url;
            } else {
                alert('Erreur lors de la création de la session de paiement.');
                setCheckoutLoading(false);
            }
        } catch (error) {
            console.error(error);
            alert('Une erreur est survenue.');
            setCheckoutLoading(false);
        }
    };

    if (loading) return <div className="min-h-screen flex justify-center items-center"><Loader2 className="animate-spin" /></div>;
    if (!product) return <div className="min-h-screen flex justify-center items-center">Produit introuvable</div>;

    // Prepare images array
    const productImages = product.images && product.images.length > 0
        ? product.images
        : (product.image ? [product.image] : []);

    const averageRating = reviews.length > 0
        ? (reviews.reduce((acc, r) => acc + r.rating, 0) / reviews.length).toFixed(1)
        : null;

    return (
        <section className="pt-32 pb-20 bg-zinc-50 min-h-screen text-zinc-900">
            <div className="max-w-6xl mx-auto px-6">
                <AnimWrapper>
                    <Link href="/boutique" className="inline-flex items-center gap-2 text-zinc-500 hover:text-[#FF6B00] transition mb-8 font-bold uppercase text-sm">
                        <ArrowLeft size={16} /> {getContent('product_page_back_link', 'Retour à la boutique')}
                    </Link>
                </AnimWrapper>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20">
                    {/* LEFT COLUMN: IMAGE & FEATURES */}
                    <AnimWrapper delay={0.1}>
                        <div className="sticky top-32">
                            <ProductGallery images={productImages} title={product.title} />

                            <div className="bg-white p-8 rounded-lg border border-zinc-200 shadow-sm">
                                <h3 className="text-sm font-black uppercase text-zinc-400 mb-4 tracking-widest">{getContent('product_page_features_title', 'Ce que tu vas obtenir')}</h3>
                                <ul className="space-y-4">
                                    {product.features?.map((f, i) => (
                                        <li key={i} className="flex items-start gap-3 text-sm font-bold">
                                            <div className="bg-[#FF6B00]/10 p-1 rounded mt-[-2px]">
                                                <Check size={14} className="text-[#FF6B00]" />
                                            </div>
                                            {f}
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        </div>
                    </AnimWrapper>

                    {/* RIGHT COLUMN: CONTENT & CTA */}
                    <AnimWrapper delay={0.2}>
                        <div>
                            <div className="mb-2">
                                <span className="text-[#FF6B00] font-black uppercase tracking-widest text-sm">{getContent('product_page_subtitle', 'Programme Digital')}</span>
                            </div>
                            <h1 className="text-4xl md:text-5xl font-black uppercase mb-2 leading-none">{product.title}</h1>

                            {/* Rating Badge */}
                            <div className="flex items-center gap-2 mb-6">
                                <div className="flex gap-0.5">
                                    {[1, 2, 3, 4, 5].map((star) => (
                                        <Star
                                            key={star}
                                            size={18}
                                            fill={averageRating >= star ? "#FF6B00" : "transparent"}
                                            color={averageRating >= star ? "#FF6B00" : "#D1D5DB"}
                                        />
                                    ))}
                                </div>
                                <span className="text-sm font-bold text-zinc-500">
                                    {averageRating ? `${averageRating}/5` : 'Nouveau'} ({reviews.length} avis)
                                </span>
                            </div>

                            <p className="text-xl text-zinc-600 mb-8 leading-relaxed font-medium">{product.description}</p>

                            <div className="flex items-center gap-6 mb-10 pb-10 border-b border-zinc-200">
                                <div className="text-4xl font-black italic text-[#FF6B00]">{product.price}</div>
                                <button
                                    onClick={handleCheckout}
                                    disabled={checkoutLoading}
                                    className="bg-black text-white px-8 py-4 rounded font-black uppercase tracking-widest hover:bg-[#FF6B00] hover:text-black transition flex-grow text-center group flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    {checkoutLoading ? <Loader2 className="animate-spin" /> : (
                                        <>
                                            {getContent('product_page_cta', 'Acheter maintenant')} <ChevronRight className="group-hover:translate-x-1 transition-transform" />
                                        </>
                                    )}
                                </button>
                            </div>

                            {/* MARKDOWN CONTENT */}
                            <div className="prose prose-zinc prose-lg max-w-none prose-headings:font-black prose-headings:uppercase prose-a:text-[#FF6B00] prose-strong:text-black prose-img:rounded-xl">
                                {product.content ? (
                                    <ReactMarkdown
                                        components={{
                                            img: ({ node, ...props }) => (
                                                <span className="block relative h-64 md:h-96 my-8 rounded-xl overflow-hidden">
                                                    <Image
                                                        fill
                                                        className="object-cover"
                                                        {...props}
                                                    />
                                                </span>
                                            ),
                                            h1: ({ node, ...props }) => <h1 className="text-3xl font-black uppercase mt-8 mb-4 text-[#FF6B00]" {...props} />,
                                            h2: ({ node, ...props }) => <h2 className="text-2xl font-black uppercase mt-6 mb-3 text-[#FF6B00]" {...props} />,
                                            h3: ({ node, ...props }) => <h3 className="text-xl font-bold mt-5 mb-2 text-black" {...props} />,
                                            h4: ({ node, ...props }) => <h4 className="text-lg font-bold mt-4 mb-2 text-black" {...props} />,
                                            ul: ({ node, ...props }) => <ul className="list-disc pl-6 mb-4 space-y-1" {...props} />,
                                            li: ({ node, ...props }) => <li className="pl-1" {...props} />,
                                            strong: ({ node, ...props }) => <strong className="font-black text-black" {...props} />,
                                        }}
                                    >
                                        {product.content}
                                    </ReactMarkdown>
                                ) : (
                                    <p className="italic text-zinc-500">Pas de description détaillée disponible pour le moment.</p>
                                )}
                            </div>

                            <div className="mt-12 pt-8 border-t border-zinc-200 block md:hidden">
                                <button
                                    onClick={handleCheckout}
                                    disabled={checkoutLoading}
                                    className="bg-[#FF6B00] text-black w-full px-8 py-4 rounded font-black uppercase tracking-widest hover:bg-black hover:text-white transition text-center flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    {checkoutLoading ? <Loader2 className="animate-spin" /> : `Acheter ${product.price}`}
                                </button>
                            </div>
                        </div>
                    </AnimWrapper>
                </div>

                {/* REVIEWS SECTION */}
                <div className="mt-20 pt-20 border-t border-zinc-200">
                    <h2 className="text-3xl font-black uppercase mb-12 text-center">Avis Clients</h2>

                    <div className="grid grid-cols-1 md:grid-cols-12 gap-12">
                        {/* Review List */}
                        <div className="md:col-span-7 lg:col-span-8 order-2 md:order-1">
                            <ReviewList reviews={reviews} />
                        </div>

                        {/* Review Form */}
                        <div className="md:col-span-5 lg:col-span-4 order-1 md:order-2">
                            <div className="sticky top-32">
                                <ReviewForm
                                    productId={product.id}
                                    onReviewSubmitted={() => fetchReviews(product.id)}
                                />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
