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
        const matchesCategory = selectedCategory === "Tous" ? true : article.category === selectedCategory;
        const matchesSearch = (article.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
            article.excerpt?.toLowerCase().includes(searchQuery.toLowerCase()));
        return (article.is_published !== false) && matchesCategory && matchesSearch;
    });

    return (
        <section className="py-20 min-h-screen bg-white">
            <div className="max-w-7xl mx-auto px-6">
                <AnimWrapper>
                    <h2 className="text-5xl font-black uppercase mb-4 text-[#FF6B00]">{siteContent?.about_title || 'Le Labo'}</h2>
                    <p className="text-zinc-700 mb-16 max-w-xl">
                        {siteContent?.about_text || 'Vulgarisation scientifique et conseils.'}
                    </p>
                </AnimWrapper>

                {/* ENCYCLOPEDIA VOLUMES (PILLAR PAGES) */}
                <AnimWrapper delay={0.1}>
                    <div className="mb-24">
                        <div className="flex items-center gap-4 mb-8">
                            <h3 className="text-3xl font-black uppercase text-black">L'Encyclopédie</h3>
                            <div className="h-px bg-zinc-200 flex-grow"></div>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">

                            {/* Volume 1 */}
                            <Link href="/labo/volume/1-la-science-de-la-force" className="group relative overflow-hidden rounded-2xl bg-zinc-950 p-8 border border-zinc-800 hover:border-[#FF6B00] transition-all flex flex-col justify-between min-h-[250px]">
                                <div className="absolute top-0 right-0 w-64 h-64 bg-[#FF6B00]/5 rounded-full blur-3xl -mr-16 -mt-16 group-hover:bg-[#FF6B00]/10 transition-colors"></div>
                                <div className="relative z-10">
                                    <div className="text-[#FF6B00] font-black uppercase tracking-widest text-xs mb-4">Volume 1</div>
                                    <h4 className="text-2xl font-black uppercase text-white mb-2 group-hover:text-[#FF6B00] transition-colors leading-tight">
                                        La Science de la Force
                                    </h4>
                                    <p className="text-zinc-400 text-sm leading-relaxed max-w-sm">
                                        Mécanique musculaire, hypertrophie, programmation et santé articulaire. Le guide complet pour devenir plus fort.
                                    </p>
                                </div>
                                <div className="relative z-10 mt-8 flex items-center gap-2 text-white text-xs font-bold uppercase tracking-wider group-hover:text-[#FF6B00] transition-colors">
                                    Explorer <ArrowLeft className="w-4 h-4 rotate-180 group-hover:translate-x-1 transition-transform" />
                                </div>
                            </Link>

                            {/* Volume 2 */}
                            <Link href="/labo/volume/2-la-science-de-lendurance" className="group relative overflow-hidden rounded-2xl bg-zinc-950 p-8 border border-zinc-800 hover:border-[#FF6B00] transition-all flex flex-col justify-between min-h-[250px]">
                                <div className="absolute top-0 right-0 w-64 h-64 bg-[#FF6B00]/5 rounded-full blur-3xl -mr-16 -mt-16 group-hover:bg-[#FF6B00]/10 transition-colors"></div>
                                <div className="relative z-10">
                                    <div className="text-[#FF6B00] font-black uppercase tracking-widest text-xs mb-4">Volume 2</div>
                                    <h4 className="text-2xl font-black uppercase text-white mb-2 group-hover:text-[#FF6B00] transition-colors leading-tight">
                                        La Science de l'Endurance
                                    </h4>
                                    <p className="text-zinc-400 text-sm leading-relaxed max-w-sm">
                                        VMA, seuils ventilatoires, zones cardiaques et physiologie de l'effort continu. Optimisez votre moteur aérobie.
                                    </p>
                                </div>
                                <div className="relative z-10 mt-8 flex items-center gap-2 text-white text-xs font-bold uppercase tracking-wider group-hover:text-[#FF6B00] transition-colors">
                                    Explorer <ArrowLeft className="w-4 h-4 rotate-180 group-hover:translate-x-1 transition-transform" />
                                </div>
                            </Link>

                            {/* Volume 3 */}
                            <Link href="/labo/volume/3-la-science-de-la-sante" className="group relative overflow-hidden rounded-2xl bg-zinc-950 p-8 border border-zinc-800 hover:border-[#FF6B00] transition-all flex flex-col justify-between min-h-[250px]">
                                <div className="absolute top-0 right-0 w-64 h-64 bg-[#FF6B00]/5 rounded-full blur-3xl -mr-16 -mt-16 group-hover:bg-[#FF6B00]/10 transition-colors"></div>
                                <div className="relative z-10">
                                    <div className="text-[#FF6B00] font-black uppercase tracking-widest text-xs mb-4">Volume 3</div>
                                    <h4 className="text-2xl font-black uppercase text-white mb-2 group-hover:text-[#FF6B00] transition-colors leading-tight">
                                        La Science de la Santé
                                    </h4>
                                    <p className="text-zinc-400 text-sm leading-relaxed max-w-sm">
                                        Nutrition avancée, longévité, gestion du stress et récupération. Les secrets pour durer et exceller.
                                    </p>
                                </div>
                                <div className="relative z-10 mt-8 flex items-center gap-2 text-white text-xs font-bold uppercase tracking-wider group-hover:text-[#FF6B00] transition-colors">
                                    Explorer <ArrowLeft className="w-4 h-4 rotate-180 group-hover:translate-x-1 transition-transform" />
                                </div>
                            </Link>

                        </div>
                    </div>
                </AnimWrapper>

                {/* SEARCH & FILTERS FOR REGULAR ARTICLES */}
                <AnimWrapper delay={0.2}>
                    <div className="flex items-center gap-4 mb-8">
                        <h3 className="text-3xl font-black uppercase text-black">Tous les articles</h3>
                        <div className="h-px bg-zinc-200 flex-grow"></div>
                    </div>

                    {/* SEARCH & FILTERS */}
                    <AnimWrapper delay={0.2}>
                        <div className="mb-12 space-y-6">
                            {/* Search Input */}
                            <div className="relative max-w-2xl">
                                <input
                                    type="text"
                                    placeholder="Rechercher un article (ex: Musculation, Sommeil...)"
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    className="w-full bg-zinc-50 border border-zinc-200 rounded-xl px-6 py-4 text-zinc-900 focus:outline-none focus:ring-2 focus:ring-[#FF6B00] focus:border-transparent transition-all shadow-sm pl-14"
                                />
                                <div className="absolute left-5 top-1/2 -translate-y-1/2 text-zinc-600">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>
                                </div>
                                {searchQuery && (
                                    <button
                                        onClick={() => setSearchQuery("")}
                                        className="absolute right-4 top-1/2 -translate-y-1/2 text-zinc-600 hover:text-black transition"
                                    >
                                        Effacer
                                    </button>
                                )}
                            </div>

                            {/* Category Pills */}
                            <div className="flex flex-wrap gap-3">
                                <button
                                    onClick={() => setSelectedCategory("Tous")}
                                    className={`px-5 py-2.5 rounded-full text-xs font-black uppercase tracking-widest border transition-all ${selectedCategory === "Tous"
                                        ? 'bg-[#FF6B00] text-black border-[#FF6B00] shadow-[0_4px_12px_rgba(255,107,0,0.2)]'
                                        : 'bg-white text-zinc-700 border-zinc-200 hover:border-[#FF6B00] hover:text-[#FF6B00] shadow-sm'
                                        }`}
                                >
                                    Tous
                                </button>
                                {[...new Set(articles
                                    .filter(a => a.is_published !== false && a.category && !a.category.startsWith('Volume'))
                                    .map(a => a.category)
                                )].sort().map(category => (
                                    <button
                                        key={category}
                                        onClick={() => setSelectedCategory(category)}
                                        className={`px-5 py-2.5 rounded-full text-xs font-black uppercase tracking-widest border transition-all ${selectedCategory === category
                                            ? 'bg-[#FF6B00] text-black border-[#FF6B00] shadow-[0_4px_12px_rgba(255,107,0,0.2)]'
                                            : 'bg-white text-zinc-700 border-zinc-200 hover:border-[#FF6B00] hover:text-[#FF6B00] shadow-sm'
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
                            const isTool = article.category === 'Outils';
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
                                            <div className="text-[#FF6B00] text-xs font-black uppercase mb-2 tracking-widest">{article.category}</div>
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
                </AnimWrapper>
            </div>
        </section>
    );
}

