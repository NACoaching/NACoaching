"use client";
import React, { useState } from 'react';
import { ShoppingBag, ChevronRight, Star } from 'lucide-react';
import Link from 'next/link';
import AnimWrapper from "@/components/AnimWrapper";

export default function BoutiqueView({ products, siteContent, allReviews }) {
    const [selectedCategory, setSelectedCategory] = useState("Tous");

    // Calculate average rating per product
    const getProductRating = (productId) => {
        const productReviews = allReviews.filter(r => r.product_id === productId);
        if (productReviews.length === 0) return { avg: null, count: 0 };
        const avg = (productReviews.reduce((acc, r) => acc + r.rating, 0) / productReviews.length).toFixed(1);
        return { avg, count: productReviews.length };
    };

    const uniqueCategories = [...new Set(products.map(p => p.category || 'Programmes'))].sort();
    const categories = ["Tous", ...uniqueCategories];

    const filteredProducts = selectedCategory === "Tous"
        ? products
        : products.filter(p => (p.category || 'Programmes') === selectedCategory);

    return (
        <section className="pt-32 pb-20 bg-zinc-950 text-white min-h-screen">
            <div className="max-w-7xl mx-auto px-6">
                <AnimWrapper>
                    <div className="text-center mb-12">
                        <h2 className="text-5xl font-black uppercase mb-4 text-[#FF6B00]">{siteContent.shop_title || 'La Boutique'}</h2>
                        <p className="text-zinc-400 max-w-xl mx-auto italic">
                            {siteContent.shop_subtitle || 'Programmes basés sur la science.'}
                        </p>
                    </div>
                </AnimWrapper>

                {/* FILTERS */}
                <AnimWrapper delay={0.2}>
                    <div className="flex flex-wrap justify-center gap-4 mb-16">
                        {categories.map(category => (
                            <button
                                key={category}
                                onClick={() => setSelectedCategory(category)}
                                className={`px-6 py-2 rounded-full text-xs font-black uppercase tracking-widest border transition ${selectedCategory === category
                                    ? 'bg-[#FF6B00] text-black border-[#FF6B00]'
                                    : 'bg-zinc-900 text-zinc-400 border-zinc-700 hover:border-[#FF6B00] hover:text-[#FF6B00]'
                                    }`}
                            >
                                {category}
                            </button>
                        ))}
                    </div>
                </AnimWrapper>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto">
                    {filteredProducts.map((product, index) => {
                        const { avg, count } = getProductRating(product.id);
                        return (
                            <AnimWrapper key={product.id} delay={index * 0.1} className="h-full">
                                <div className="bg-zinc-900 p-10 border border-zinc-800 hover:border-[#FF6B00] transition-all group flex flex-col h-full hover:shadow-[0_0_30px_rgba(255,107,0,0.1)]">
                                    <div className="flex justify-between items-start mb-6">
                                        <div className="flex flex-col gap-2">
                                            <ShoppingBag className="text-[#FF6B00] group-hover:scale-110 transition-transform" size={40} />
                                            {product.discount_price && (
                                                <span className="bg-[#FF6B00] text-black text-[10px] font-black px-2 py-0.5 rounded uppercase tracking-tighter w-fit">PROMO</span>
                                            )}
                                        </div>
                                        <div className="flex flex-col items-end">
                                            {product.discount_price ? (
                                                <>
                                                    <span className="text-3xl font-black italic text-[#FF6B00]">{product.discount_price}</span>
                                                    <span className="text-sm font-bold text-zinc-500 line-through opacity-70">{product.price}</span>
                                                </>
                                            ) : (
                                                <span className="text-3xl font-black italic">{product.price}</span>
                                            )}
                                        </div>
                                    </div>
                                    <div className="mb-4">
                                        <span className="text-[10px] font-black uppercase tracking-widest text-[#FF6B00]/60">{product.category || 'Programmes'}</span>
                                        <h3 className="text-3xl font-black uppercase mt-1">{product.title}</h3>
                                    </div>

                                    {/* Star Rating */}
                                    {count > 0 && (
                                        <div className="flex items-center gap-2 mb-4">
                                            <div className="flex gap-0.5">
                                                {[1, 2, 3, 4, 5].map((star) => (
                                                    <Star
                                                        key={star}
                                                        size={16}
                                                        fill={avg >= star ? "#FF6B00" : "transparent"}
                                                        color={avg >= star ? "#FF6B00" : "#52525B"}
                                                    />
                                                ))}
                                            </div>
                                            <span className="text-sm text-zinc-400 font-bold">{avg}/5 ({count} avis)</span>
                                        </div>
                                    )}

                                    <p className="text-zinc-400 mb-8 flex-grow">{product.description}</p>
                                    <ul className="space-y-3 mb-10">
                                        {product.features?.map((f, i) => (
                                            <li key={i} className="flex items-center gap-3 text-sm font-bold">
                                                <ChevronRight size={16} className="text-[#FF6B00]" /> {f}
                                            </li>
                                        ))}
                                    </ul>
                                    <Link
                                        href={`/boutique/${product.id}`}
                                        className="bg-[#FF6B00] text-black font-black py-4 rounded-sm uppercase text-center tracking-widest hover:bg-white transition mt-auto block"
                                    >
                                        En savoir plus
                                    </Link>
                                </div>
                            </AnimWrapper>
                        );
                    })}
                </div>
            </div>
        </section>
    );
}
