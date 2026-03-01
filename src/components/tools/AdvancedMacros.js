"use client";
import Tooltip from "@/components/Tooltip";
import React, { useState } from 'react';
import { Pizza, ChevronRight, Apple, Info, InfoIcon } from 'lucide-react';
import AnimWrapper from '@/components/AnimWrapper';

export default function AdvancedMacros({ hints = {} }) {
    const [weight, setWeight] = useState('');
    const [bodyFat, setBodyFat] = useState('');
    const [goal, setGoal] = useState('maintenance');
    const [calories, setCalories] = useState('');
    const [proteinRatio, setProteinRatio] = useState(2.0);
    const [fatRatio, setFatRatio] = useState(0.8);
    const [result, setResult] = useState(null);

    const calculate = (e) => {
        e.preventDefault();
        const w = parseFloat(weight);
        const c = parseFloat(calories);
        if (w > 0 && c > 0) {
            const pGrams = w * parseFloat(proteinRatio);
            const pCals = pGrams * 4;

            const fGrams = w * parseFloat(fatRatio);
            const fCals = fGrams * 9;

            const carbCals = c - pCals - fCals;
            const carbGrams = Math.max(0, carbCals / 4);

            setResult({
                p: { g: Math.round(pGrams), c: Math.round(pCals), pct: Math.round((pCals / c) * 100) },
                f: { g: Math.round(fGrams), c: Math.round(fCals), pct: Math.round((fCals / c) * 100) },
                c: { g: Math.round(carbGrams), c: Math.round(carbCals), pct: Math.round((carbCals / c) * 100) },
                total: c
            });
        }
    };

    return (
        <div className="max-w-xl mx-auto">
            <div className="bg-white p-8 md:p-10 rounded-3xl border border-zinc-200 shadow-2xl">
                <h2 className="text-3xl font-black uppercase mb-8 flex items-center gap-3 italic text-black">
                    <Apple className="text-[#FF6B00]" /> Macros Avancées
                </h2>

                <form onSubmit={calculate} className="space-y-8">
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="flex items-center text-xs font-bold uppercase text-zinc-900 mb-1">
                                Poids (kg)
                                <Tooltip text={hints.poids || hints.weight} />
                            </label>
                            <input
                                type="number"
                                value={weight}
                                onChange={(e) => setWeight(e.target.value)}
                                className="w-full border p-3 rounded text-sm focus:border-[#FF6B00] outline-none"
                                placeholder="Ex: 75"
                                required
                            />
                        </div>
                        <div>
                            <label className="flex items-center text-xs font-bold uppercase text-zinc-900 mb-1">
                                % MG (optionnel)
                                <Tooltip text={hints.fat_percentage || hints.mg} />
                            </label>
                            <input
                                type="number"
                                value={bodyFat}
                                onChange={(e) => setBodyFat(e.target.value)}
                                className="w-full border p-3 rounded text-sm focus:border-[#FF6B00] outline-none"
                                placeholder="Ex: 15"
                            />
                        </div>
                    </div>

                    <div>
                        <label className="flex items-center text-xs font-bold uppercase text-zinc-900 mb-1">
                            Objectif
                            <Tooltip text={hints.objectif || hints.goal} />
                        </label>
                        <select
                            value={goal}
                            onChange={(e) => setGoal(e.target.value)}
                            className="w-full border p-3 rounded text-sm focus:border-[#FF6B00] outline-none"
                        >
                            <option value="loss">Perte de poids</option>
                            <option value="maintenance">Maintien</option>
                            <option value="gain">Prise de masse</option>
                        </select>
                    </div>

                    <div className="space-y-2">
                        <label className="flex items-center text-xs font-bold uppercase text-zinc-900 mb-1">
                            Calories Cibles
                            <Tooltip text="Votre apport calorique journalier souhaité." />
                        </label>
                        <input
                            type="number"
                            required
                            value={calories}
                            onChange={(e) => setCalories(e.target.value)}
                            className="w-full border p-3 rounded text-sm focus:border-[#FF6B00] outline-none"
                            placeholder="Ex: 2500"
                        />
                    </div>

                    <div className="space-y-6">
                        <div className="space-y-2">
                            <div className="flex justify-between items-end px-1">
                                <label className="text-[10px] font-black uppercase text-zinc-600 tracking-widest">Ratio Protéines</label>
                                <span className="text-sm font-black text-[#FF6B00]">{proteinRatio} g/kg</span>
                            </div>
                            <input
                                type="range"
                                min="1.2"
                                max="3.0"
                                step="0.1"
                                value={proteinRatio}
                                onChange={(e) => setProteinRatio(e.target.value)}
                                className="w-full accent-[#FF6B00] h-2 bg-zinc-100 rounded-lg appearance-none cursor-pointer"
                            />
                            <div className="flex justify-between text-[8px] font-black text-black uppercase italic">
                                <span>Minimum (Santé)</span>
                                <span>Intense (Muscle)</span>
                            </div>
                        </div>

                        <div className="space-y-2">
                            <div className="flex justify-between items-end px-1">
                                <label className="text-[10px] font-black uppercase text-black tracking-widest pl-1">Ratio Lipides</label>
                                <span className="text-sm font-black text-[#FF6B00]">{fatRatio} g/kg</span>
                            </div>
                            <input
                                type="range"
                                min="0.5"
                                max="1.5"
                                step="0.05"
                                value={fatRatio}
                                onChange={(e) => setFatRatio(e.target.value)}
                                className="w-full accent-[#FF6B00] h-2 bg-zinc-100 rounded-lg appearance-none cursor-pointer"
                            />
                            <div className="flex justify-between text-[8px] font-black text-black uppercase italic">
                                <span>Hormonal Min</span>
                                <span>High Fat</span>
                            </div>
                        </div>
                    </div>

                    <button type="submit" className="w-full bg-black text-white font-black py-5 rounded-2xl uppercase tracking-widest hover:bg-[#FF6B00] hover:text-black transition-all shadow-xl">
                        Calculer mes macros
                    </button>
                </form>

                {result && (
                    <AnimWrapper delay={0.1}>
                        <div className="mt-12 pt-8 border-t border-zinc-100 space-y-6">
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                <MacroCard label="Protéines" grams={result.p.g} pct={result.p.pct} color="bg-orange-500" />
                                <MacroCard label="Lipides" grams={result.f.g} pct={result.f.pct} color="bg-zinc-900" />
                                <MacroCard label="Glucides" grams={result.c.g} pct={result.c.pct} color="bg-[#FF6B00]" />
                            </div>

                            <div className="bg-zinc-50 p-6 rounded-2xl space-y-3">
                                <div className="flex justify-between text-[10px] font-black uppercase text-zinc-600">
                                    <span>Répartition Calorique</span>
                                    <span>{result.total} kcal</span>
                                </div>
                                <div className="flex h-3 rounded-full overflow-hidden">
                                    <div className="bg-orange-500 h-full transition-all duration-1000" style={{ width: `${result.p.pct}%` }}></div>
                                    <div className="bg-zinc-900 h-full transition-all duration-1000" style={{ width: `${result.f.pct}%` }}></div>
                                    <div className="bg-[#FF6B00] h-full transition-all duration-1000" style={{ width: `${result.c.pct}%` }}></div>
                                </div>
                                <div className="flex gap-4 text-[9px] font-bold uppercase justify-center mt-2">
                                    <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-orange-500"></span> Protéines</span>
                                    <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-zinc-900"></span> Lipides</span>
                                    <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-[#FF6B00]"></span> Glucides</span>
                                </div>
                            </div>
                        </div>
                    </AnimWrapper>
                )}
            </div>

            <div className="mt-8 bg-zinc-900 text-zinc-200 p-6 rounded-2xl flex items-start gap-4">
                <InfoIcon size={20} className="shrink-0 mt-1 text-[#FF6B00]" />
                <p className="text-[10px] font-black leading-relaxed uppercase tracking-tight">
                    Le ratio glucidique est ajusté automatiquement après avoir fixé vos besoins en protéines (essentiels pour la structure) et lipides (essentiels pour le système hormonal).
                </p>
            </div>
        </div>
    );
}

function MacroCard({ label, grams, pct, color }) {
    return (
        <div className="flex flex-col items-center p-4 rounded-2xl border border-zinc-100">
            <span className="text-[9px] font-black uppercase text-zinc-900 mb-1">{label}</span>
            <span className="text-3xl font-black italic text-zinc-900">{grams}<span className="text-sm not-italic opacity-60 ml-1 text-zinc-700">g</span></span>
            <div className={`mt-2 px-2 py-0.5 rounded text-[8px] font-black text-white ${color}`}>{pct}%</div>
        </div>
    );
}
