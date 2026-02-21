"use client";
import React, { useState } from 'react';
import Link from 'next/link';
import AnimWrapper from "@/components/AnimWrapper";

import Image from 'next/image';

// Map tool slugs to emojis for visual flair
const toolIcons = {
    'calculateur-1rm': '💪',
    'besoins-caloriques': '🔥',
    'vma-vo2': '🏃‍♂️',
    'frequence-cardiaque': '🫀',
    'convertisseur-vitesse': '⚡',
};

function getToolIcon(cta) {
    if (!cta) return '🔧';
    for (const [slug, icon] of Object.entries(toolIcons)) {
        if (cta.includes(slug)) return icon;
    }
    return '🔧';
}

export default function LaboView({ articles, siteContent }) {
    const [selectedCategory, setSelectedCategory] = useState("Tous");

    const filteredArticles = articles.filter(article =>
        (article.is_published !== false) &&
        (selectedCategory === "Tous" ? true : article.category === selectedCategory)
    );

    return (
        <section className="py-20 min-h-screen bg-white">
            <div className="max-w-7xl mx-auto px-6">
                <AnimWrapper>
                    <h2 className="text-5xl font-black uppercase mb-4 text-[#FF6B00]">{siteContent?.about_title || 'Le Labo'}</h2>
                    <p className="text-zinc-500 mb-8 max-w-xl">
                        {siteContent?.about_text || 'Vulgarisation scientifique et conseils.'}
                    </p>
                </AnimWrapper>

                {/* FILTERS */}
                <AnimWrapper delay={0.2}>
                    <div className="flex flex-wrap gap-4 mb-12">
                        <button
                            onClick={() => setSelectedCategory("Tous")}
                            className={`px-4 py-2 rounded-full text-xs font-black uppercase tracking-widest border border-zinc-200 transition ${selectedCategory === "Tous"
                                ? 'bg-[#FF6B00] text-black border-[#FF6B00]'
                                : 'bg-zinc-100 text-zinc-600 border-zinc-200 hover:border-[#FF6B00] hover:text-[#FF6B00]'
                                }`}
                        >
                            Tous
                        </button>
                        {[...new Set(articles.filter(a => a.is_published !== false).map(a => a.category))].sort().map(category => (
                            <Link
                                key={category}
                                href={`/labo/${category}`}
                                className="px-4 py-2 rounded-full text-xs font-black uppercase tracking-widest border border-zinc-200 transition bg-zinc-100 text-zinc-600 hover:border-[#FF6B00] hover:text-[#FF6B00] hover:bg-white"
                                onClick={() => setSelectedCategory(category)}
                            >
                                {category}
                            </Link>
                        ))}
                    </div>
                </AnimWrapper>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12">
                    {filteredArticles.map((article, index) => {
                        const isTool = article.category === 'Outils';
                        const href = isTool && article.cta ? article.cta : `/blog/${article.id}`;

                        return (
                            <AnimWrapper key={article.id} delay={index * 0.1}>
                                <Link href={href} className="group cursor-pointer flex flex-col h-full bg-white p-6 rounded-xl border border-zinc-100 hover:border-[#FF6B00] transition-all duration-300 hover:shadow-[0_20px_40px_rgba(0,0,0,0.05),0_0_20px_rgba(255,107,0,0.05)]">
                                    <div className="aspect-[4/3] bg-zinc-200 mb-6 overflow-hidden relative rounded-lg">
                                        {article.image ? (
                                            <Image
                                                src={article.image}
                                                alt={article.title}
                                                fill
                                                className="object-cover group-hover:scale-105 transition duration-700 ease-out"
                                                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                                            />
                                        ) : isTool ? (
                                            <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-zinc-900 to-zinc-800">
                                                <span className="text-7xl group-hover:scale-110 transition-transform duration-500">{getToolIcon(article.cta)}</span>
                                            </div>
                                        ) : (
                                            <div className="w-full h-full flex items-center justify-center bg-zinc-100 text-zinc-300">
                                                <span className="text-4xl font-black opacity-20">NA</span>
                                            </div>
                                        )}
                                    </div>
                                    <div className="flex-grow">
                                        <div className="text-[#FF6B00] text-xs font-black uppercase mb-2 tracking-widest">{article.category}</div>
                                        <h3 className="text-2xl font-black uppercase leading-none mb-4 text-black group-hover:text-[#FF6B00] transition">{article.title}</h3>
                                        <p className="text-zinc-600 leading-relaxed mb-4 line-clamp-3">{article.excerpt}</p>
                                    </div>
                                    <div className="pt-4 border-t border-zinc-100 flex justify-between items-center text-xs font-bold text-zinc-400">
                                        <span>{article.date}</span>
                                        <span className="group-hover:text-[#FF6B00] transition-colors flex items-center gap-1">
                                            {isTool ? 'Utiliser l\'outil' : 'Lire l\'article'} →
                                        </span>
                                    </div>
                                </Link>
                            </AnimWrapper>
                        );
                    })}
                </div>
            </div>
        </section>
    );
}

