"use client";
import Tooltip from "@/components/Tooltip";
import React, { useState } from 'react';
import { Activity, Thermometer, AlertTriangle, CheckCircle2, Info } from 'lucide-react';
import AnimWrapper from '@/components/AnimWrapper';

export default function ACWRCalculator({ hints = {} }) {
    const [acute, setAcute] = useState('');
    const [chronic, setChronic] = useState('');
    const [result, setResult] = useState(null);

    const calculateACWR = (e) => {
        e.preventDefault();
        const a = parseFloat(acute);
        const c = parseFloat(chronic);
        if (a > 0 && c > 0) {
            const ratio = a / c;
            setResult(ratio);
        }
    };

    const getStatus = (ratio) => {
        if (ratio < 0.8) return {
            text: "Sous-entraînement",
            color: "text-blue-500",
            bg: "bg-blue-50",
            icon: Thermometer,
            desc: "Votre charge actuelle est nettement inférieure à votre habitude. Risque de désadaptation s'il n'y a pas d'objectif de récupération."
        };
        if (ratio <= 1.3) return {
            text: "Sweet Spot (Optimal)",
            color: "text-green-600",
            bg: "bg-green-50",
            icon: CheckCircle2,
            desc: "Zone optimale de progression. Vous améliorez votre condition physique sans risque excessif de blessure."
        };
        if (ratio <= 1.5) return {
            text: "Zone de Danger",
            color: "text-orange-500",
            bg: "bg-orange-50",
            icon: AlertTriangle,
            desc: "Attention, votre charge augmente rapidement. Surveillez vos signaux de fatigue de près."
        };
        return {
            text: "Risque de Blessure Élevé",
            color: "text-red-500",
            bg: "bg-red-50",
            icon: AlertTriangle,
            desc: "Zone critique. La charge aiguë est beaucoup trop élevée par rapport à la charge habituelle. Risque de blessure imminent."
        };
    };

    return (
        <div className="max-w-xl mx-auto">
            <div className="bg-white p-8 rounded-3xl border border-zinc-200 shadow-xl overflow-hidden relative">
                <div className="absolute top-0 right-0 p-6 opacity-5">
                    <Activity size={120} />
                </div>

                <h2 className="text-3xl font-black uppercase mb-6 flex items-center gap-3 italic text-black">
                    <Activity className="text-[#FF6B00]" /> ACWR Calculator
                </h2>

                <p className="text-sm text-zinc-800 mb-8 leading-relaxed font-medium">
                    L'<strong>Acute:Chronic Workload Ratio</strong> est l'outil n°1 des préparateurs physiques pour prévenir les blessures. Il compare votre fatigue récente (7 jours) à votre habitude (28 jours).
                </p>

                <form onSubmit={calculateACWR} className="space-y-6">
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="flex items-center text-xs font-bold uppercase text-zinc-900 mb-1">
                                Charge Aiguë (7j)
                                <Tooltip text={hints.aigue || hints.acute} />
                            </label>
                            <input
                                type="number"
                                value={acute}
                                onChange={(e) => setAcute(e.target.value)}
                                className="w-full border p-3 rounded text-sm focus:border-[#FF6B00] outline-none"
                                placeholder="Ex: 350"
                                required
                            />
                        </div>
                        <div>
                            <label className="flex items-center text-xs font-bold uppercase text-zinc-900 mb-1">
                                Charge Chronique (28j)
                                <Tooltip text={hints.chronique || hints.chronic} />
                            </label>
                            <input
                                type="number"
                                value={chronic}
                                onChange={(e) => setChronic(e.target.value)}
                                className="w-full border p-3 rounded text-sm focus:border-[#FF6B00] outline-none"
                                placeholder="Ex: 300"
                                required
                            />
                        </div>
                    </div>

                    <button type="submit" className="w-full bg-black text-white font-black py-5 rounded-xl uppercase tracking-widest hover:bg-[#FF6B00] hover:text-black transition-all shadow-lg hover:shadow-[#FF6B00]/40">
                        Calculer mon ratio
                    </button>
                </form>

                {result !== null && (
                    <AnimWrapper delay={0.1}>
                        <div className={`mt-8 p-6 rounded-2xl border ${getStatus(result).bg} ${getStatus(result).color.replace('text', 'border')}`}>
                            <div className="flex items-center justify-between mb-4">
                                <span className="font-black uppercase tracking-tighter text-sm">Verdict Scientifique</span>
                                <span className="text-3xl font-black italic">{result.toFixed(2)}</span>
                            </div>

                            <div className="flex gap-4 items-start">
                                <div className={`p-2 rounded-lg ${getStatus(result).bg} brightness-95`}>
                                    {React.createElement(getStatus(result).icon, { size: 24 })}
                                </div>
                                <div>
                                    <h4 className="font-black uppercase text-lg leading-none mb-2">
                                        {getStatus(result).text}
                                    </h4>
                                    <p className="text-sm opacity-80 leading-relaxed">
                                        {getStatus(result).desc}
                                    </p>
                                </div>
                            </div>
                        </div>
                    </AnimWrapper>
                )}
            </div>

            <div className="mt-8 bg-zinc-100 p-6 rounded-2xl flex gap-4">
                <Info className="text-zinc-600 shrink-0" />
                <p className="text-[10px] text-zinc-900 uppercase font-bold leading-tight">
                    Note : La "charge" peut être calculée en multipliant la durée (min) par l'intensité perçue (RPE 0-10). Exemple : 60 min à intensité 7 = 420 unités de charge.
                </p>
            </div>
        </div>
    );
}
