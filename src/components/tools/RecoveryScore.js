"use client";
import Tooltip from "@/components/Tooltip";
import React, { useState } from 'react';
import { Sparkles, Moon, Battery, Brain, Heart, ChevronRight, RotateCcw } from 'lucide-react';
import AnimWrapper from '@/components/AnimWrapper';

const QUESTIONS = [
    { key: 'sleep', label: 'Qualité du sommeil', icon: Moon, desc: 'Heures, réveils, sensation au réveil' },
    { key: 'fatigue', label: 'Niveau de fatigue générale', icon: Battery, desc: 'Désir de s\'entraîner, tonus' },
    { key: 'muscles', label: 'Courbatures (DOMS)', icon: Sparkles, desc: 'Douleurs musculaires résiduelles' },
    { key: 'stress', label: 'Niveau de stress', icon: Brain, desc: 'Travail, vie perso, charge mentale' },
    { key: 'mood', label: 'Humeur / Motivation', icon: Heart, desc: 'Envie d\'écraser la séance' }
];

export default function RecoveryScore({ hints = {} }) {
    const [scores, setScores] = useState({ sleep: 3, fatigue: 3, muscles: 3, stress: 3, mood: 3 });
    const [result, setResult] = useState(null);

    const handleScore = (key, val) => {
        setScores(prev => ({ ...prev, [key]: val }));
    };

    const calculateResult = () => {
        const total = Object.values(scores).reduce((a, b) => a + b, 0);
        const max = QUESTIONS.length * 5;
        const percentage = (total / max) * 10;
        setResult(percentage);
    };

    const getRecommendation = (score) => {
        if (score >= 8.5) return {
            title: "Feu Vert Total",
            text: "Ta récupération est optimale. C'est le moment d'aller chercher un record personnel ou d'augmenter le volume.",
            color: "text-green-600",
            bg: "bg-green-50"
        };
        if (score >= 6.5) return {
            title: "Prêt au combat",
            text: "Bonne récupération. Suis le programme prévu, l'intensité passera sans problème.",
            color: "text-blue-500",
            bg: "bg-blue-50"
        };
        if (score >= 4.5) return {
            title: "Moyenne - Vigilance",
            text: "Récupération correcte mais incomplète. Envisage de réduire un peu l'intensité ou le nombre de séries si tu te sens lourd.",
            color: "text-orange-500",
            bg: "bg-orange-50"
        };
        return {
            title: "Drapeau Rouge",
            text: "Récupération critique. Privilégie une séance déchargée (Deload), du stretching ou un jour de repos total.",
            color: "text-red-500",
            bg: "bg-red-50"
        };
    };

    return (
        <div className="max-w-2xl mx-auto">
            <div className="bg-white p-8 md:p-12 rounded-[2rem] border border-zinc-200 shadow-2xl relative overflow-hidden">
                <div className="absolute top-0 right-0 p-8 opacity-[0.03]">
                    <Sparkles size={160} />
                </div>

                <div className="text-center mb-12">
                    <h2 className="text-4xl font-bold uppercase mb-4 italic text-black">
                        SCORE DE <span className="text-[#FF6B00]">RÉCUPÉRATION</span>
                    </h2>
                    <p className="text-zinc-600 max-w-md mx-auto font-bold uppercase text-[10px] tracking-widest">
                        Évalue ta readiness & optimise ta charge
                    </p>
                </div>

                <div className="space-y-10">
                    {QUESTIONS.map((q) => (
                        <div key={q.key} className="space-y-4">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-4">
                                    <div className="w-10 h-10 bg-zinc-100 rounded-xl flex items-center justify-center text-zinc-900">
                                        <q.icon size={20} />
                                    </div>
                                    <div>
                                        <div className="flex items-center gap-1 font-bold text-sm tracking-tight text-zinc-900">
                                            {q.label}
                                            <Tooltip text={hints[q.key]} />
                                        </div>
                                        <div className="text-[10px] text-zinc-500 font-bold">{q.desc}</div>
                                    </div>
                                </div>
                                <span className="text-2xl font-bold italic text-[#FF6B00]">{scores[q.key]}/5</span>
                            </div>
                            <div className="grid grid-cols-5 gap-2">
                                {[1, 2, 3, 4, 5].map((val) => (
                                    <button
                                        key={val}
                                        onClick={() => handleScore(q.key, val)}
                                        className={`h-12 rounded-xl border-2 transition-all font-bold text-lg ${scores[q.key] === val
                                            ? 'bg-black text-white border-black scale-105'
                                            : 'bg-zinc-50 border-zinc-100 text-zinc-600 hover:border-zinc-300'
                                            }`}
                                    >
                                        {val}
                                    </button>
                                ))}
                            </div>
                        </div>
                    ))}
                </div>

                <div className="mt-12 flex flex-col md:flex-row gap-4">
                    <button
                        onClick={calculateResult}
                        className="flex-grow bg-[#FF6B00] text-black font-bold py-5 rounded-2xl uppercase tracking-widest hover:bg-black hover:text-white transition-all shadow-xl flex items-center justify-center gap-3"
                    >
                        Obtenir mon score <ChevronRight size={20} />
                    </button>
                    {result !== null && (
                        <button
                            onClick={() => { setResult(null); setScores({ sleep: 3, fatigue: 3, muscles: 3, stress: 3, mood: 3 }); }}
                            className="bg-zinc-100 p-5 rounded-2xl hover:bg-zinc-200 transition-colors"
                        >
                            <RotateCcw size={24} className="text-zinc-600" />
                        </button>
                    )}
                </div>

                {result !== null && (
                    <AnimWrapper delay={0.2}>
                        <div className={`mt-12 p-8 rounded-3xl border-4 ${getRecommendation(result).bg} ${getRecommendation(result).color.replace('text', 'border')} flex flex-col items-center text-center`}>
                            <div className={`text-7xl font-bold italic mb-2 tracking-tighter ${getRecommendation(result).color}`}>
                                {result.toFixed(1)}<span className="text-2xl opacity-60">/10</span>
                            </div>
                            <h3 className={`text-2xl font-bold uppercase mb-4 ${getRecommendation(result).color}`}>
                                {getRecommendation(result).title}
                            </h3>
                            <p className="text-zinc-600 leading-relaxed font-medium">
                                {getRecommendation(result).text}
                            </p>
                        </div>
                    </AnimWrapper>
                )}
            </div>

            <p className="mt-8 text-center text-zinc-400 text-[10px] font-bold">
                Basé sur l'Échelle de Hooper-Mackinnon pour le Monitoring Athlétique
            </p>
        </div>
    );
}
