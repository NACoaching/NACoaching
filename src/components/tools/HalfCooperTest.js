"use client";
import React, { useState, useMemo } from 'react';
import { Timer, ChevronRight, Info, Zap } from 'lucide-react';

export default function HalfCooperTest() {
    const [distance, setDistance] = useState('');

    const results = useMemo(() => {
        const d = parseFloat(distance);
        if (!d || d <= 0) return null;

        // VMA = (Distance in meters / 6 minutes) * 10 
        // Example: 1500m in 6min -> 15km/h
        const vma = (d / 100);
        const vo2max = vma * 3.5;

        // Target Paces
        const paces = {
            '100% VMA (Fractionné court)': (60 / vma).toFixed(2), // min/km
            '90% VMA (Seuil)': (60 / (vma * 0.9)).toFixed(2),
            '80% VMA (Allure Marathon)': (60 / (vma * 0.8)).toFixed(2),
            '70% VMA (Endurance Fondamentale)': (60 / (vma * 0.7)).toFixed(2),
        };

        const formatPace = (decimalMin) => {
            const mins = Math.floor(decimalMin);
            const secs = Math.round((decimalMin - mins) * 60);
            return `${mins}'${secs.toString().padStart(2, '0')}`;
        };

        return {
            vma: vma.toFixed(1),
            vo2max: vo2max.toFixed(1),
            paces: Object.entries(paces).map(([label, pace]) => ({ label, pace: formatPace(pace) }))
        };
    }, [distance]);

    return (
        <div className="bg-white p-8 rounded-2xl border border-zinc-200 shadow-xl max-w-2xl mx-auto">
            <div className="flex items-center gap-4 mb-8">
                <div className="w-12 h-12 bg-orange-50 text-orange-500 rounded-xl flex items-center justify-center">
                    <Timer size={24} />
                </div>
                <div>
                    <h2 className="text-2xl font-black uppercase text-zinc-900">Test Demi-Cooper (6 min)</h2>
                    <p className="text-xs font-bold text-zinc-400 uppercase tracking-widest">Calcul de VMA & VO2max</p>
                </div>
            </div>

            <div className="mb-8 p-4 bg-orange-50 rounded-xl border border-orange-100 flex gap-4 items-start">
                <Zap size={20} className="text-orange-500 shrink-0 mt-0.5" />
                <p className="text-xs text-orange-800 leading-relaxed font-medium">
                    **Le test** : Parcourez la plus grande distance possible en **exactement 6 minutes** sur terrain plat.
                </p>
            </div>

            <div className="mb-10">
                <label className="block text-xs font-black uppercase text-zinc-500 mb-2 text-center">Distance parcourue en 6 minutes (mètres)</label>
                <input
                    type="number"
                    placeholder="Ex: 1500"
                    value={distance}
                    onChange={(e) => setDistance(e.target.value)}
                    className="w-full bg-zinc-50 border border-zinc-200 p-6 rounded-2xl font-black text-4xl text-center focus:outline-none focus:border-orange-500 transition shadow-inner"
                />
            </div>

            {results ? (
                <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
                    <div className="grid grid-cols-2 gap-4">
                        <div className="bg-zinc-900 text-white p-8 rounded-2xl text-center">
                            <span className="text-[10px] font-black uppercase tracking-widest text-zinc-500 block mb-2">Ta VMA</span>
                            <div className="text-5xl font-black text-orange-500">{results.vma}</div>
                            <span className="text-[10px] text-zinc-400 font-bold uppercase">km/h</span>
                        </div>
                        <div className="bg-zinc-50 border border-zinc-100 p-8 rounded-2xl text-center">
                            <span className="text-[10px] font-black uppercase tracking-widest text-zinc-400 block mb-2">VO2max Estimé</span>
                            <div className="text-5xl font-black text-zinc-900">{results.vo2max}</div>
                            <span className="text-[10px] text-zinc-400 font-bold uppercase whitespace-nowrap">ml/kg/min</span>
                        </div>
                    </div>

                    <div className="border-t border-zinc-100 pt-6">
                        <h4 className="text-xs font-black uppercase text-zinc-900 mb-4 tracking-widest">Tes Allures d'Entraînement</h4>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                            {results.paces.map((p, i) => (
                                <div key={i} className="flex justify-between items-center bg-zinc-50 p-4 rounded-xl border border-zinc-100">
                                    <span className="text-[10px] font-bold text-zinc-500 uppercase max-w-[120px]">{p.label}</span>
                                    <span className="text-md font-black text-zinc-900">{p.pace} min/km</span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            ) : (
                <div className="p-8 border-2 border-dashed border-zinc-100 rounded-2xl flex flex-col items-center justify-center text-center opacity-50">
                    <Timer size={40} className="text-zinc-200 mb-4" />
                    <p className="text-sm font-bold text-zinc-400 uppercase tracking-widest">Entrez votre distance pour voir les résultats</p>
                </div>
            )}

            <div className="mt-8 pt-6 border-t border-zinc-100">
                <div className="flex gap-4 items-start">
                    <Info size={18} className="text-zinc-400 shrink-0 mt-0.5" />
                    <p className="text-[10px] text-zinc-500 leading-relaxed italic">
                        La **VMA** (Vitesse Maximale Aérobie) est la vitesse à laquelle vous consommez le maximum d'oxygène (**VO2max**). Elle est la base de programmation pour le running moderne.
                    </p>
                </div>
            </div>
        </div>
    );
}
