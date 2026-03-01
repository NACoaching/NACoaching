"use client";
import React, { useState } from 'react';
import Link from 'next/link';
import AnimWrapper from "@/components/AnimWrapper";
import { ArrowLeft } from 'lucide-react';

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
    const [searchQuery, setSearchQuery] = useState("");

    const filteredArticles = articles.filter(article => {
        if (article.is_published === false) return false;

        const matchesSearch = (article.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
            article.excerpt?.toLowerCase().includes(searchQuery.toLowerCase()));

        if (!matchesSearch) return false;

        if (selectedCategory === "Tous") return true;

        const isTool = article.category?.toLowerCase() === "outils" || article.category?.toLowerCase() === "outil";

        if (selectedCategory === "Outils") return isTool;

        // For any other specific chapter filter:
        // 1. MUST NOT be a tool (exclusive)
        // 2. Subcategory must match
        return !isTool && article.subcategory === selectedCategory;
    });

    return (
        <section className="py-20 min-h-screen bg-white text-zinc-900 border-t border-zinc-100">
            <div className="max-w-7xl mx-auto px-6">
                <AnimWrapper>
                    <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-16">
                        <div>
                            <h2 className="text-5xl font-black uppercase mb-4 text-[#FF6B00]">{siteContent?.about_title || 'Le Labo'}</h2>
                            <p className="text-zinc-600 max-w-xl text-lg font-medium leading-relaxed">
                                {siteContent?.about_text || 'Vulgarisation scientifique et conseils d\'experts.'}
                            </p>
                        </div>
                    </div>
                </AnimWrapper>

                {/* ENCYCLOPEDIA VOLUMES (PILLAR PAGES) */}
                <AnimWrapper delay={0.1}>
                    <div className="mb-24">
                        <div className="flex items-center gap-4 mb-10">
                            <h3 className="text-2xl font-black uppercase tracking-tight text-black">L'Encyclopédie Suprême</h3>
                            <div className="h-0.5 bg-gradient-to-r from-[#FF6B00]/20 to-transparent flex-grow"></div>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">

                            {/* Volume 1 */}
                            <Link href="/labo/volume/1-la-science-de-la-force" className="group relative overflow-hidden rounded-3xl bg-zinc-950 p-10 border border-zinc-800 hover:border-[#FF6B00]/50 transition-all duration-500 flex flex-col justify-between min-h-[300px] shadow-2xl">
                                <div className="absolute top-0 right-0 w-64 h-64 bg-[#FF6B00]/10 rounded-full blur-[100px] -mr-16 -mt-16 group-hover:bg-[#FF6B00]/20 transition-all duration-700"></div>
                                <div className="relative z-10">
                                    <div className="bg-[#FF6B00] text-black font-black uppercase tracking-tighter text-[10px] py-1 px-3 rounded-full w-fit mb-6">Volume 01</div>
                                    <h4 className="text-3xl font-black uppercase text-white mb-4 group-hover:text-[#FF6B00] transition-colors leading-[0.9] tracking-tighter">
                                        La Science de la Force
                                    </h4>
                                    <p className="text-zinc-400 text-sm leading-relaxed max-w-[280px]">
                                        Mécanique musculaire, hypertrophie et programmation. Le guide suprême pour devenir plus fort.
                                    </p>
                                </div>
                                <div className="relative z-10 mt-8 flex items-center gap-3 text-white text-[10px] font-black uppercase tracking-[0.2em] group-hover:text-[#FF6B00] transition-colors">
                                    Explorer l'expertise <ArrowLeft className="w-4 h-4 rotate-180 group-hover:translate-x-2 transition-transform" />
                                </div>
                            </Link>

                            {/* Volume 2 */}
                            <Link href="/labo/volume/2-la-science-de-lendurance" className="group relative overflow-hidden rounded-3xl bg-zinc-950 p-10 border border-zinc-800 hover:border-[#FF6B00]/50 transition-all duration-500 flex flex-col justify-between min-h-[300px] shadow-2xl">
                                <div className="absolute top-0 right-0 w-64 h-64 bg-[#FF6B00]/10 rounded-full blur-[100px] -mr-16 -mt-16 group-hover:bg-[#FF6B00]/20 transition-all duration-700"></div>
                                <div className="relative z-10">
                                    <div className="bg-[#FF6B00] text-black font-black uppercase tracking-tighter text-[10px] py-1 px-3 rounded-full w-fit mb-6">Volume 02</div>
                                    <h4 className="text-3xl font-black uppercase text-white mb-4 group-hover:text-[#FF6B00] transition-colors leading-[0.9] tracking-tighter">
                                        La Science de l'Endurance
                                    </h4>
                                    <p className="text-zinc-400 text-sm leading-relaxed max-w-[280px]">
                                        VMA, seuils et physiologie cardio-vasculaire. Optimisez votre moteur aérobie à l'infini.
                                    </p>
                                </div>
                                <div className="relative z-10 mt-8 flex items-center gap-3 text-white text-[10px] font-black uppercase tracking-[0.2em] group-hover:text-[#FF6B00] transition-colors">
                                    Explorer l'expertise <ArrowLeft className="w-4 h-4 rotate-180 group-hover:translate-x-2 transition-transform" />
                                </div>
                            </Link>

                            {/* Volume 3 */}
                            <Link href="/labo/volume/3-la-science-de-la-sante" className="group relative overflow-hidden rounded-3xl bg-zinc-950 p-10 border border-zinc-800 hover:border-[#FF6B00]/50 transition-all duration-500 flex flex-col justify-between min-h-[300px] shadow-2xl">
                                <div className="absolute top-0 right-0 w-64 h-64 bg-[#FF6B00]/10 rounded-full blur-[100px] -mr-16 -mt-16 group-hover:bg-[#FF6B00]/20 transition-all duration-700"></div>
                                <div className="relative z-10">
                                    <div className="bg-[#FF6B00] text-black font-black uppercase tracking-tighter text-[10px] py-1 px-3 rounded-full w-fit mb-6">Volume 03</div>
                                    <h4 className="text-3xl font-black uppercase text-white mb-4 group-hover:text-[#FF6B00] transition-colors leading-[0.9] tracking-tighter">
                                        La Science de la Santé
                                    </h4>
                                    <p className="text-zinc-400 text-sm leading-relaxed max-w-[280px]">
                                        Nutrition, longévité et récupération profonde. Les secrets pour durer et exceller biologiquement.
                                    </p>
                                </div>
                                <div className="relative z-10 mt-8 flex items-center gap-3 text-white text-[10px] font-black uppercase tracking-[0.2em] group-hover:text-[#FF6B00] transition-colors">
                                    Explorer l'expertise <ArrowLeft className="w-4 h-4 rotate-180 group-hover:translate-x-2 transition-transform" />
                                </div>
                            </Link>

                        </div>
                    </div>
                </AnimWrapper>

                {/* SEARCH & FILTERS FOR REGULAR ARTICLES */}
                <AnimWrapper delay={0.2}>
                    <div className="flex items-center gap-4 mb-8">
                        <h3 className="text-2xl font-black uppercase tracking-tight text-black">Accès Direct</h3>
                        <div className="h-px bg-zinc-100 flex-grow"></div>
                    </div>

                    {/* SEARCH & FILTERS */}
                    <div className="mb-16 space-y-10">
                        {/* Search Input */}
                        <div className="relative max-w-2xl group">
                            <input
                                type="text"
                                placeholder="Rechercher une expertise (ex: Sommeil, RPE, VMA...)"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="w-full bg-zinc-50 border-2 border-zinc-100 rounded-2xl px-8 py-5 text-zinc-900 focus:outline-none focus:border-[#FF6B00] transition-all shadow-sm pl-16 text-lg font-medium placeholder:text-zinc-400 group-hover:border-zinc-200"
                            />
                            <div className="absolute left-6 top-1/2 -translate-y-1/2 text-zinc-300 group-hover:text-[#FF6B00] transition-colors">
                                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>
                            </div>
                            {searchQuery && (
                                <button
                                    onClick={() => setSearchQuery("")}
                                    className="absolute right-6 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-black transition"
                                >
                                    Effacer
                                </button>
                            )}
                        </div>

                        {/* Category Pills */}
                        <div className="flex flex-wrap gap-4">
                            <button
                                onClick={() => setSelectedCategory("Tous")}
                                className={`px-8 py-3.5 rounded-2xl text-[10px] font-black uppercase tracking-[0.15em] border-2 transition-all duration-300 ${selectedCategory === "Tous"
                                    ? 'bg-black text-white border-black shadow-xl scale-105'
                                    : 'bg-white text-zinc-500 border-zinc-100 hover:border-[#FF6B00] hover:text-[#FF6B00] hover:bg-zinc-50'
                                    }`}
                            >
                                Tous
                            </button>
                            {/* Exclusive Filter: Tools first, then Chapters */}
                            {["Outils", ...new Set(articles
                                .filter(a => a.is_published !== false && a.category?.toLowerCase() !== "outils" && a.category?.toLowerCase() !== "outil" && a.subcategory)
                                .map(a => a.subcategory)
                            )].sort((a, b) => {
                                if (a === "Outils") return -1;
                                if (b === "Outils") return 1;
                                return a.localeCompare(b);
                            }).map(category => (
                                <button
                                    key={category}
                                    onClick={() => setSelectedCategory(category)}
                                    className={`px-8 py-3.5 rounded-2xl text-[10px] font-black uppercase tracking-[0.15em] border-2 transition-all duration-300 ${selectedCategory === category
                                        ? 'bg-[#FF6B00] text-black border-[#FF6B00] shadow-xl scale-105'
                                        : 'bg-white text-zinc-500 border-zinc-100 hover:border-[#FF6B00] hover:text-[#FF6B00] hover:bg-zinc-50'
                                        }`}
                                >
                                    {category}
                                </button>
                            ))}
                        </div>
                    </div>
                </AnimWrapper>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12">
                    {filteredArticles.map((article, index) => {
                        const isTool = article.category?.toLowerCase() === 'outils' || article.category?.toLowerCase() === 'outil';
                        const href = isTool && article.cta ? article.cta : `/blog/${article.slug || article.id}`;

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
                                            <div className="w-full h-full flex items-center justify-center bg-zinc-100 text-zinc-700">
                                                <span className="text-4xl font-black opacity-20">NA</span>
                                            </div>
                                        )}
                                    </div>
                                    <div className="flex-grow">
                                        <div className="text-[#FF6B00] text-xs font-black uppercase mb-2 tracking-widest">
                                            {isTool ? 'Outil' : (article.subcategory || 'Article')}
                                        </div>
                                        <h3 className="text-2xl font-black uppercase leading-none mb-4 text-black group-hover:text-[#FF6B00] transition">{article.title}</h3>
                                        <p className="text-zinc-600 leading-relaxed mb-4 line-clamp-3">{article.excerpt}</p>
                                    </div>
                                    <div className="pt-4 border-t border-zinc-100 flex justify-between items-center text-xs font-bold text-zinc-600">
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

