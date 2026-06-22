"use client";
import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import ReactMarkdown from 'react-markdown';
import remarkMath from 'remark-math';
import rehypeKatex from 'rehype-katex';
import { Star, ChevronRight, Loader2, Check, ArrowLeft, ShieldCheck, Zap, Lock, Award, ChevronDown } from 'lucide-react';
import AnimWrapper from '@/components/AnimWrapper';
import ProductGallery from '@/components/ProductGallery';
import ReviewForm from '@/components/ReviewForm';
import ReviewList from '@/components/ReviewList';
import { supabase } from '@/lib/supabaseClient';
import Breadcrumb from '@/components/Breadcrumb';

export default function ProductClientView({ initialProduct, initialReviews, siteContentMap, relatedArticles = [], breadcrumbItems = [] }) {
    const [product] = useState(initialProduct);
    const [reviews, setReviews] = useState(initialReviews);
    const [checkoutLoading, setCheckoutLoading] = useState(false);
    const [openFaqIndex, setOpenFaqIndex] = useState(null);

    const fetchReviews = async (productId) => {
        const { data } = await supabase
            .from('reviews')
            .select('*')
            .eq('product_id', productId)
            .order('created_at', { ascending: false });
        if (data) setReviews(data);
    };

    const getContent = (key, fallback) => siteContentMap[key] || fallback;

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
                    <Breadcrumb items={breadcrumbItems} />
                </AnimWrapper>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20">
                    {/* LEFT COLUMN: IMAGE & FEATURES */}
                    <AnimWrapper delay={0.1}>
                        <div className="sticky top-32">
                            <ProductGallery images={productImages} title={product.title} />

                            <div className="bg-white p-8 rounded-lg border border-zinc-200 shadow-sm">
                                <h3 className="text-sm font-black uppercase text-zinc-600 mb-4 tracking-widest">{getContent('product_page_features_title', 'Ce que tu vas obtenir')}</h3>
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
                                <span className="text-sm font-bold text-zinc-700">
                                    {averageRating ? `${averageRating}/5` : 'Nouveau'} ({reviews.length} avis)
                                </span>
                            </div>

                            <p className="text-xl text-zinc-600 mb-8 leading-relaxed font-medium">{product.description}</p>

                            <div className="flex items-center gap-6 mb-8 pb-8 border-b border-zinc-200">
                                {product.discount_price ? (
                                    <div className="flex flex-col">
                                        <div className="flex items-center gap-4">
                                            <div className="text-4xl font-black italic text-[#FF6B00]">{product.discount_price}</div>
                                            <div className="text-xl font-bold text-zinc-600 line-through opacity-70">{product.price}</div>
                                        </div>
                                        <span className="text-[10px] font-black uppercase text-[#FF6B00] tracking-widest mt-1">Offre Spéciale</span>
                                    </div>
                                ) : (
                                    <div className="text-4xl font-black italic text-[#FF6B00]">{product.price}</div>
                                )}
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

                            {/* Trust Badges */}
                            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-10">
                                <div className="flex flex-col items-center text-center gap-2">
                                    <div className="text-[#FF6B00]">
                                        <Lock size={20} strokeWidth={2.5} />
                                    </div>
                                    <span className="text-[10px] font-black uppercase tracking-wider text-zinc-700">Paiement 100% Sécurisé</span>
                                </div>
                                <div className="flex flex-col items-center text-center gap-2">
                                    <div className="text-[#FF6B00]">
                                        <Zap size={20} strokeWidth={2.5} />
                                    </div>
                                    <span className="text-[10px] font-black uppercase tracking-wider text-zinc-700">Accès Immédiat après achat</span>
                                </div>
                                <div className="flex flex-col items-center text-center gap-2">
                                    <div className="text-[#FF6B00]">
                                        <Award size={20} strokeWidth={2.5} />
                                    </div>
                                    <span className="text-[10px] font-black uppercase tracking-wider text-zinc-700">Master EOPS & Expertise</span>
                                </div>
                                <div className="flex flex-col items-center text-center gap-2">
                                    <div className="text-[#FF6B00]">
                                        <ShieldCheck size={20} strokeWidth={2.5} />
                                    </div>
                                    <span className="text-[10px] font-black uppercase tracking-wider text-zinc-700">Garantie & Support Réactif</span>
                                </div>
                            </div>

                            {/* MARKDOWN CONTENT */}
                            <div className="prose prose-zinc prose-lg max-w-none prose-headings:font-black prose-headings:uppercase prose-a:text-[#FF6B00] prose-strong:text-black prose-img:rounded-xl">
                                {product.content ? (
                                    <ReactMarkdown
                                        remarkPlugins={[remarkMath]}
                                        rehypePlugins={[rehypeKatex]}
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
                                            h1: ({ node, ...props }) => <h2 className="text-3xl font-black uppercase mt-8 mb-4 text-[#FF6B00]" {...props} />,
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
                                    <p className="italic text-zinc-700">Pas de description détaillée disponible pour le moment.</p>
                                )}
                            </div>

                            <div className="mt-12 pt-8 border-t border-zinc-200 block md:hidden">
                                <button
                                    onClick={handleCheckout}
                                    disabled={checkoutLoading}
                                    className="bg-[#FF6B00] text-black w-full px-8 py-4 rounded font-black uppercase tracking-widest hover:bg-black hover:text-white transition text-center flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    {checkoutLoading ? <Loader2 className="animate-spin" /> : `Acheter ${product.discount_price || product.price}`}
                                </button>
                            </div>
                        </div>
                    </AnimWrapper>
                </div>

                {/* FAQ SECTION */}
                {product.faqs && Array.isArray(product.faqs) && product.faqs.length > 0 && (
                    <div className="mt-20 pt-20 border-t border-zinc-200 max-w-3xl mx-auto">
                        <AnimWrapper>
                            <div className="text-center mb-10">
                                <h2 className="text-3xl font-black uppercase mb-3 text-black">Foire Aux <span className="text-[#FF6B00]">Questions</span></h2>
                                <p className="text-zinc-700 text-sm">Les réponses aux questions fréquentes sur ce programme</p>
                            </div>
                            <div className="bg-zinc-50 rounded-lg border border-zinc-200 px-6">
                                {product.faqs.map((faq, index) => (
                                    <div key={index} className="border-b border-zinc-200 last:border-b-0">
                                        <button
                                            className="w-full flex justify-between items-center py-5 px-1 text-left group"
                                            onClick={() => setOpenFaqIndex(openFaqIndex === index ? null : index)}
                                        >
                                            <span className="font-bold text-sm uppercase tracking-wide text-zinc-800 group-hover:text-[#FF6B00] transition pr-4">
                                                {faq.question}
                                            </span>
                                            <ChevronDown
                                                size={20}
                                                className={`text-zinc-600 group-hover:text-[#FF6B00] transition-transform duration-300 flex-shrink-0 ${openFaqIndex === index ? 'rotate-180' : ''}`}
                                            />
                                        </button>
                                        <div className={`overflow-hidden transition-all duration-300 ${openFaqIndex === index ? 'max-h-96 pb-5' : 'max-h-0'}`}>
                                            <p className="text-zinc-700 text-sm leading-relaxed px-1">
                                                {faq.answer}
                                            </p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </AnimWrapper>
                    </div>
                )}

                {/* RELATED ARTICLES - MAILLAGE INTERNE */}
                {relatedArticles.length > 0 && (
                    <div className="mt-20 pt-20 border-t border-zinc-200">
                        <AnimWrapper>
                            <h2 className="text-3xl font-black uppercase mb-12 text-center">Continuer la lecture</h2>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                {relatedArticles.map((article) => (
                                    <Link href={`/blog/${article.slug || article.id}`} key={article.id} className="group block">
                                        <div className="bg-white rounded-lg p-6 border border-zinc-200 hover:border-[#FF6B00] hover:shadow-md transition-all h-full flex flex-col">
                                            <div className="text-[#FF6B00] text-xs font-black uppercase tracking-widest mb-2">{article.category}</div>
                                            <h4 className="text-lg font-bold uppercase leading-snug mb-3 text-black group-hover:text-[#FF6B00] transition line-clamp-2">
                                                {article.title}
                                            </h4>
                                            <div className="mt-auto text-xs font-bold text-zinc-600 group-hover:text-black transition">Lire l'article dans le Labo →</div>
                                        </div>
                                    </Link>
                                ))}
                            </div>
                        </AnimWrapper>
                    </div>
                )}

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
