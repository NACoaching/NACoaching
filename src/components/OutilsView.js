"use client";
import React, { useState } from 'react';
import Link from 'next/link';
import AnimWrapper from "@/components/AnimWrapper";
import { ChevronRight, Dumbbell, Flame, Gauge, Activity, Heart, Sparkles, Apple, BarChart3, HelpCircle, Target, Layers, Timer, Trophy } from "lucide-react";

const iconMap = {
    '/outils/calculateur-1rm': { icon: Dumbbell, color: "text-blue-500", bg: "bg-blue-50" },
    '/outils/besoins-caloriques': { icon: Flame, color: "text-orange-500", bg: "bg-orange-50" },
    '/outils/convertisseur-vitesse': { icon: Gauge, color: "text-green-500", bg: "bg-green-50" },
    '/outils/vma-vo2': { icon: Activity, color: "text-purple-500", bg: "bg-purple-50" },
    '/outils/frequence-cardiaque': { icon: Heart, color: "text-red-500", bg: "bg-red-50" },
    '/outils/acwr': { icon: BarChart3, color: "text-indigo-500", bg: "bg-indigo-50" },
    '/outils/score-recuperation': { icon: Sparkles, color: "text-[#FF6B00]", bg: "bg-[#FF6B00]/5" },
    '/outils/macros-avancees': { icon: Apple, color: "text-emerald-500", bg: "bg-emerald-50" },
    '/outils/rpe-1rm': { icon: Target, color: "text-blue-600", bg: "bg-blue-50" },
    '/outils/volume-effectif': { icon: Layers, color: "text-emerald-600", bg: "bg-emerald-50" },
    '/outils/test-demi-cooper': { icon: Timer, color: "text-orange-600", bg: "bg-orange-50" },
    '/outils/predictateur-performance': { icon: Trophy, color: "text-blue-500", bg: "bg-blue-50" },
};

export default function OutilsView({ tools }) {
    const [selectedCategory, setSelectedCategory] = useState("Tous");
    const [searchQuery, setSearchQuery] = useState("");

    const filteredTools = tools.filter(tool => {
        const matchesCategory = selectedCategory === "Tous" ? true : tool.subcategory === selectedCategory;
        const matchesSearch = (tool.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
            tool.excerpt?.toLowerCase().includes(searchQuery.toLowerCase()));
        return (tool.is_published !== false) && matchesCategory && matchesSearch;
    });

    const categories = ["Tous", ...new Set(tools.filter(a => a.is_published !== false && a.subcategory).map(a => a.subcategory))].sort();

    return (
        <section className="pt-32 pb-20 min-h-screen bg-zinc-50">
            <div className="max-w-7xl mx-auto px-6">
                <AnimWrapper>
                    <div className="text-center mb-16">
                        <h1 className="text-5xl font-black uppercase mb-4 text-[#FF6B00]">Les Outils du Coach</h1>
                        <p className="text-zinc-500 max-w-xl mx-auto text-lg">
                            Des calculateurs précis et gratuits pour vous accompagner dans votre progression athlétique.
                        </p>
                    </div>
                </AnimWrapper>

                {/* SEARCH & FILTERS */}
                <AnimWrapper delay={0.2}>
                    <div className="mb-12 space-y-6">
                        {/* Search Input */}
                        <div className="relative max-w-2xl mx-auto">
                            <input
                                type="text"
                                placeholder="Rechercher un outil (ex: VMA, Calories...)"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="w-full bg-white border border-zinc-200 rounded-xl px-6 py-4 text-zinc-900 focus:outline-none focus:ring-2 focus:ring-[#FF6B00] focus:border-transparent transition-all shadow-sm pl-14"
                            />
                            <div className="absolute left-5 top-1/2 -translate-y-1/2 text-zinc-400">
                                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>
                            </div>
                            {searchQuery && (
                                <button
                                    onClick={() => setSearchQuery("")}
                                    className="absolute right-4 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-black transition"
                                >
                                    Effacer
                                </button>
                            )}
                        </div>

                        {/* Category Pills */}
                        <div className="flex flex-wrap justify-center gap-3">
                            {categories.map(category => (
                                <button
                                    key={category}
                                    onClick={() => setSelectedCategory(category)}
                                    className={`px-5 py-2.5 rounded-full text-xs font-black uppercase tracking-widest border transition-all ${selectedCategory === category
                                        ? 'bg-[#FF6B00] text-black border-[#FF6B00] shadow-[0_4px_12px_rgba(255,107,0,0.2)]'
                                        : 'bg-white text-zinc-500 border-zinc-200 hover:border-[#FF6B00] hover:text-[#FF6B00] shadow-sm'
                                        }`}
                                >
                                    {category}
                                </button>
                            ))}
                        </div>
                    </div>
                </AnimWrapper>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {filteredTools.map((tool, index) => {
                        const config = iconMap[tool.cta] || { icon: HelpCircle, color: "text-zinc-400", bg: "bg-zinc-100" };
                        const Icon = config.icon;

                        return (
                            <AnimWrapper key={tool.id} delay={index * 0.1}>
                                <Link href={tool.cta || '#'} className="group block h-full">
                                    <div className="bg-white text-zinc-900 p-8 rounded-2xl border border-zinc-200 shadow-sm hover:shadow-md hover:border-[#FF6B00] transition-all duration-300 h-full flex flex-col hover:-translate-y-1">
                                        <div className={`w-14 h-14 ${config.bg} ${config.color} rounded-xl flex items-center justify-center mb-6 text-2xl`}>
                                            <Icon size={28} strokeWidth={1.5} />
                                        </div>

                                        <h3 className="text-2xl font-black uppercase mb-3 text-zinc-900 group-hover:text-[#FF6B00] transition-colors">
                                            {tool.title}
                                        </h3>

                                        {tool.subcategory && (
                                            <div className="text-[#FF6B00] text-xs font-black uppercase mb-4 tracking-widest">{tool.subcategory}</div>
                                        )}

                                        <p className="text-zinc-500 mb-6 flex-grow leading-relaxed line-clamp-3">
                                            {tool.excerpt}
                                        </p>

                                        <div className="flex items-center gap-2 font-bold uppercase text-sm text-zinc-900 group-hover:gap-3 group-hover:text-[#FF6B00] transition-all">
                                            Utiliser l'outil <ChevronRight size={16} className="text-[#FF6B00]" />
                                        </div>
                                    </div>
                                </Link>
                            </AnimWrapper>
                        );
                    })}
                </div>

                {filteredTools.length === 0 && (
                    <div className="text-center py-20">
                        <p className="text-zinc-500 text-lg">Aucun outil trouvé pour cette recherche.</p>
                    </div>
                )}

                {/* SEO Text for the Hub Page */}
                <div className="mt-20 max-w-4xl mx-auto prose prose-zinc text-center">
                    <h2 className="text-3xl font-black uppercase mb-6 text-zinc-900">Pourquoi utiliser mes outils de coaching ?</h2>
                    <p className="text-zinc-600">
                        La progression sportive ne doit rien au hasard. Que vous soyez pratiquant de musculation, coureur à pied ou athlète hybride,
                        la quantification de la charge et l'ajustement de l'intensité sont les clés de la réussite.
                        Ces outils sont ceux que j'utilise quotidiennement avec mes athlètes pour planifier leurs saisons.
                    </p>
                </div>
            </div>
        </section>
    );
}
