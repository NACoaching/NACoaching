"use client";
import React, { useState } from 'react';
import Link from 'next/link';
import AnimWrapper from "@/components/AnimWrapper";

import Image from 'next/image';

export default function LaboView({ articles, siteContent }) {
    const [selectedCategory, setSelectedCategory] = useState("Tous");

    const filteredArticles = selectedCategory === "Tous"
        ? articles
        : articles.filter(article => article.category === selectedCategory);

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
                        {["Tous", ...new Set(articles.map(a => a.category))].map(category => (
                            <button
                                key={category}
                                onClick={() => setSelectedCategory(category)}
                                className={`px-4 py-2 rounded-full text-xs font-black uppercase tracking-widest border border-zinc-200 transition ${selectedCategory === category
                                    ? 'bg-[#FF6B00] text-black border-[#FF6B00]'
                                    : 'bg-zinc-100 text-zinc-600 border-zinc-200 hover:border-[#FF6B00] hover:text-[#FF6B00]'
                                    }`}
                            >
                                {category}
                            </button>
                        ))}
                    </div>
                </AnimWrapper>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12">
                    {filteredArticles.map((article, index) => (
                        <AnimWrapper key={article.id} delay={index * 0.1}>
                            <Link href={`/blog/${article.id}`} className="group cursor-pointer flex flex-col h-full">
                                <div className="aspect-[4/3] bg-zinc-200 mb-6 overflow-hidden relative">
                                    {article.image ? (
                                        <Image
                                            src={article.image}
                                            alt={article.title}
                                            fill
                                            className="object-cover group-hover:scale-105 transition duration-500"
                                            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                                        />
                                    ) : (
                                        <div className="w-full h-full flex items-center justify-center bg-zinc-100 text-zinc-300">
                                            <span className="text-4xl font-black opacity-20">NA</span>
                                        </div>
                                    )}
                                </div>
                                <div className="flex-grow">
                                    <div className="text-[#FF6B00] text-xs font-black uppercase mb-2 tracking-widest">{article.category}</div>
                                    <h3 className="text-2xl font-black uppercase leading-none mb-4 text-black group-hover:text-[#FF6B00] transition">{article.title}</h3>
                                    <p className="text-zinc-600 leading-relaxed mb-4">{article.excerpt}</p>
                                </div>
                                <div className="pt-4 border-t border-zinc-100 flex justify-between items-center text-xs font-bold text-zinc-400">
                                    <span>{article.date}</span>
                                    <span className="group-hover:text-[#FF6B00]">Lire l'article →</span>
                                </div>
                            </Link>
                        </AnimWrapper>
                    ))}
                </div>

                {/* TOOLS SECTION */}
                <div className="mt-20 pt-16 border-t border-zinc-200">
                    <AnimWrapper>
                        <div className="flex justify-between items-end mb-12">
                            <h2 className="text-4xl font-black uppercase text-black">Mes Outils <span className="text-[#FF6B00]">Gratuits</span></h2>
                            <Link href="/outils" className="text-[#FF6B00] font-bold hover:underline">Voir tout →</Link>
                        </div>
                    </AnimWrapper>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                        {[
                            { title: "Calculateur 1RM", desc: "Estime ta force maximale théorique à partir d'une charge et d'un nombre de répétitions.", icon: "💪", href: "/outils/calculateur-1rm" },
                            { title: "Besoins Caloriques", desc: "Calcule tes besoins énergétiques journaliers selon ton profil et ton niveau d'activité.", icon: "🔥", href: "/outils/besoins-caloriques" },
                            { title: "VMA / VO2max", desc: "Estime ta vitesse maximale aérobie et ta consommation d'oxygène maximale.", icon: "🏃‍♂️", href: "/outils/vma-vo2" },
                            { title: "Zones Cardiaques", desc: "Détermine tes 5 zones d'entraînement à partir de ta fréquence cardiaque maximale.", icon: "🫀", href: "/outils/frequence-cardiaque" },
                            { title: "Convertisseur Vitesse", desc: "Convertis facilement entre km/h, min/km et m/s pour tes séances.", icon: "⚡", href: "/outils/convertisseur-vitesse" },
                        ].map((tool, i) => (
                            <AnimWrapper key={i} delay={i * 0.1}>
                                <Link href={tool.href} className="block group h-full">
                                    <div className="bg-zinc-50 p-6 rounded-lg border border-zinc-200 hover:border-[#FF6B00] transition h-full flex flex-col hover:shadow-lg">
                                        <div className="text-4xl mb-4">{tool.icon}</div>
                                        <h3 className="text-lg font-black uppercase mb-2 text-black group-hover:text-[#FF6B00] transition">{tool.title}</h3>
                                        <p className="text-zinc-600 text-sm mb-4 flex-grow">{tool.desc}</p>
                                        <div className="mt-auto text-xs font-bold uppercase tracking-widest text-[#FF6B00] flex items-center gap-2">
                                            Utiliser →
                                        </div>
                                    </div>
                                </Link>
                            </AnimWrapper>
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
}
