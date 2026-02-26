"use client";
import React, { useState } from 'react';
import { Dumbbell, RotateCcw, Info } from 'lucide-react';
import AnimWrapper from "@/components/AnimWrapper";
import ShareResults from "@/components/tools/ShareResults";
import AffiliateCard from "@/components/AffiliateCard";

export default function Calculator1RM({ affiliateData }) {
    const [weight, setWeight] = useState('');
    const [reps, setReps] = useState('');
    const [result, setResult] = useState(null);

    const calculate1RM = (e) => {
        e.preventDefault();
        const w = parseFloat(weight);
        const r = parseFloat(reps);

        if (w > 0 && r > 0) {
            // Epley Formula
            const oneRm = w * (1 + r / 30);
            setResult(Math.round(oneRm));
        }
    };

    return (
        <AnimWrapper>
            <div className="bg-zinc-50 text-zinc-900 border border-zinc-200 p-6 rounded-lg h-full flex flex-col">
                <div className="flex items-center gap-3 mb-4">
                    <div className="bg-[#FF6B00] p-2 rounded text-white">
                        <Dumbbell size={24} />
                    </div>
                    <h3 className="text-xl font-black uppercase">Calculateur 1RM</h3>
                </div>

                <p className="text-zinc-600 mb-6 text-sm">
                    Estime ta force maximale (1RM) à partir d'une charge et d'un nombre de répétitions.
                </p>

                <form onSubmit={calculate1RM} className="space-y-4 mb-6">
                    <div>
                        <label className="block text-xs font-bold uppercase text-zinc-500 mb-1">Poids soulevé (kg)</label>
                        <input
                            type="number"
                            value={weight}
                            onChange={(e) => setWeight(e.target.value)}
                            className="w-full border p-3 rounded text-sm focus:border-[#FF6B00] outline-none"
                            placeholder="Ex: 80"
                            required
                        />
                    </div>
                    <div>
                        <label className="block text-xs font-bold uppercase text-zinc-500 mb-1">Répétitions</label>
                        <input
                            type="number"
                            value={reps}
                            onChange={(e) => setReps(e.target.value)}
                            className="w-full border p-3 rounded text-sm focus:border-[#FF6B00] outline-none"
                            placeholder="Ex: 5"
                            required
                        />
                    </div>
                    <button type="submit" className="w-full bg-black text-white font-black py-3 rounded uppercase hover:bg-[#FF6B00] hover:text-black transition">
                        Calculer
                    </button>
                </form>

                {result && (
                    <div className="mt-auto bg-white border border-zinc-200 p-4 rounded-lg">
                        <div className="text-center mb-4">
                            <span className="block text-xs font-bold uppercase text-zinc-400">Ton 1RM estimé</span>
                            <span className="text-4xl font-black text-[#FF6B00]">{result} kg</span>
                        </div>
                        <div className="grid grid-cols-4 gap-2 text-center text-xs">
                            <div className="bg-zinc-50 p-2 rounded">
                                <span className="block font-bold">90%</span>
                                <span className="text-zinc-500">{Math.round(result * 0.9)}kg</span>
                            </div>
                            <div className="bg-zinc-50 p-2 rounded">
                                <span className="block font-bold">80%</span>
                                <span className="text-zinc-500">{Math.round(result * 0.8)}kg</span>
                            </div>
                            <div className="bg-zinc-50 p-2 rounded">
                                <span className="block font-bold">70%</span>
                                <span className="text-zinc-500">{Math.round(result * 0.7)}kg</span>
                            </div>
                            <div className="bg-zinc-50 p-2 rounded">
                                <span className="block font-bold">50%</span>
                                <span className="text-zinc-500">{Math.round(result * 0.5)}kg</span>
                            </div>
                        </div>
                        <ShareResults title="Mon 1RM Estimé" value={result + "kg"} subtitle={`${weight}kg x ${reps} reps`} />
                    </div>
                )}
            </div>

            {affiliateData?.affiliate_link && (
                <div className="mt-8 border-t border-zinc-200 pt-8">
                    <div className="flex items-center gap-2 mb-6">
                        <Info size={16} className="text-[#FF6B00]" />
                        <h4 className="text-sm font-black uppercase tracking-wider text-zinc-500">Expertise Matériel</h4>
                    </div>

                    <AffiliateCard
                        title={affiliateData.title?.toLowerCase().includes('1rm') ? "Accessoires de musculation" : "Recommandation"}
                        description={affiliateData.affiliate_text || "Pour tes séances de force, le bon matériel fait la différence."}
                        imageUrl={affiliateData.affiliate_image}
                        affiliateUrl={affiliateData.affiliate_link}
                        ctaText="Voir la sélection"
                        badge="Sélection Coach"
                    />
                </div>
            )}
        </AnimWrapper>
    );
}
