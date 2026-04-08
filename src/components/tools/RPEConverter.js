"use client";
import Tooltip from "@/components/Tooltip";
import React, { useState, useMemo } from 'react';
import { Target, Info } from 'lucide-react';

const rpeChart = {
    10: [100, 96, 92, 89, 86, 84, 82, 80, 78, 76, 74, 72],
    9.5: [98, 94, 91, 88, 85, 83, 81, 79, 77, 75, 73, 71],
    9: [96, 92, 89, 86, 84, 82, 80, 78, 76, 74, 72, 70],
    8.5: [94, 91, 88, 85, 83, 81, 79, 77, 75, 73, 71, 69],
    8: [92, 89, 86, 84, 82, 80, 78, 76, 74, 72, 70, 68],
    7.5: [91, 88, 85, 83, 81, 79, 77, 75, 73, 71, 69, 67],
    7: [89, 86, 84, 82, 80, 78, 76, 74, 72, 70, 68, 66],
};

export default function RPEConverter({ hints = {} }) {
    const [reps, setReps] = useState(1);
    const [rpe, setRpe] = useState(10);
    const [weight, setWeight] = useState('');
    const [max, setMax] = useState('');
    const [targetRpe, setTargetRpe] = useState('');

    const percentage = useMemo(() => {
        const row = rpeChart[rpe];
        if (!row) return 0;
        return row[reps - 1] || 0;
    }, [reps, rpe]);

    const estimated1RM = useMemo(() => {
        if (!weight || !percentage) return 0;
        return Math.round((parseFloat(weight) / percentage) * 100);
    }, [weight, percentage]);

    return (
        <div className="bg-white p-8 rounded-2xl border border-zinc-200 shadow-xl max-w-2xl mx-auto">
            <div className="flex items-center gap-4 mb-8">
                <div className="w-12 h-12 bg-blue-50 text-blue-500 rounded-xl flex items-center justify-center">
                    <Target size={24} />
                </div>
                <div>
                    <h2 className="text-3xl font-black uppercase text-black leading-none">
                        CONVERTISSEUR <span className="text-[#FF6B00]">RPE</span>
                    </h2>
                    <p className="text-[10px] font-black text-zinc-600 uppercase tracking-[0.2em] mt-1">Autorégulation & Intensité Relative</p>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                <div>
                    <label className="block text-xs font-black uppercase text-zinc-900 mb-2">Nombre de Répétitions</label>
                    <select
                        value={reps}
                        onChange={(e) => setReps(parseInt(e.target.value))}
                        className="w-full bg-zinc-50 border border-zinc-200 p-4 rounded-xl font-bold focus:outline-none focus:border-blue-500 transition shadow-inner"
                    >
                        {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12].map(r => (
                            <option key={r} value={r}>{r} rep{r > 1 ? 's' : ''}</option>
                        ))}
                    </select>
                </div>

                <div>
                    <label className="flex items-center text-xs font-black uppercase text-zinc-900 mb-2">
                        Intensité (RPE)
                        <Tooltip text={hints.rpe} />
                    </label>
                    <select
                        value={rpe}
                        onChange={(e) => setRpe(parseFloat(e.target.value))}
                        className="w-full bg-zinc-50 border border-zinc-200 p-4 rounded-xl font-bold focus:outline-none focus:border-blue-500 transition shadow-inner"
                    >
                        {Object.keys(rpeChart).sort((a, b) => b - a).map(v => (
                            <option key={v} value={v}>RPE {v}</option>
                        ))}
                    </select>
                </div>

                <div className="md:col-span-2">
                    <label className="flex items-center text-xs font-black uppercase text-zinc-900 mb-2">
                        Charge utilisée (kg) - Optionnel
                        <Tooltip text={hints.weight} />
                    </label>
                    <input
                        type="number"
                        placeholder="Ex: 100"
                        value={weight}
                        onChange={(e) => setWeight(e.target.value)}
                        className="w-full bg-zinc-50 border border-zinc-200 p-4 rounded-xl font-bold focus:outline-none focus:border-blue-500 transition shadow-inner text-black"
                    />
                </div>

                {/* New inputs from the provided snippet */}
                <div className="grid grid-cols-2 gap-4 md:col-span-2">
                    <div>
                        <label className="flex items-center text-xs font-black uppercase text-zinc-900 mb-1">
                            Ton 1RM (kg)
                            <Tooltip text={hints.max || hints.unrm} />
                        </label>
                        <input
                            type="number"
                            value={max}
                            onChange={(e) => setMax(e.target.value)}
                            className="w-full border p-3 rounded text-sm text-black focus:border-[#FF6B00] outline-none"
                            placeholder="Ex: 100"
                            required
                        />
                    </div>
                    <div>
                        <label className="flex items-center text-xs font-black uppercase text-zinc-900 mb-1">
                            RPE visé
                            <Tooltip text={hints.rpe} />
                        </label>
                        <input
                            type="number"
                            step="0.5"
                            value={targetRpe}
                            onChange={(e) => setTargetRpe(e.target.value)}
                            className="w-full border p-3 rounded text-sm text-black focus:border-[#FF6B00] outline-none"
                            placeholder="Ex: 8"
                            required
                        />
                    </div>
                </div>

                <div className="md:col-span-2">
                    <label className="flex items-center text-xs font-black uppercase text-zinc-900 mb-1">
                        Répétitions visées
                        <Tooltip text={hints.reps || hints.repetitions} />
                    </label>
                    <input
                        type="number"
                        value={reps}
                        onChange={(e) => setReps(e.target.value)}
                        className="w-full border p-3 rounded text-sm text-black focus:border-[#FF6B00] outline-none"
                        placeholder="Ex: 5"
                        required
                    />
                    {/* Assuming an input or select would go here for "Répétitions visées" */}
                    {/* For now, leaving it as just the label as per the snippet */}
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-zinc-900 text-white p-6 rounded-2xl flex flex-col items-center justify-center text-center">
                    <span className="text-xs font-black uppercase tracking-widest text-zinc-400 mb-2">Intensité Relative</span>
                    <div className="text-5xl font-black text-blue-500">{percentage}%</div>
                    <span className="text-[10px] text-zinc-600 mt-1 uppercase font-bold">de ton 1RM</span>
                </div>

                <div className="bg-blue-600 text-white p-6 rounded-2xl flex flex-col items-center justify-center text-center">
                    <span className="text-xs font-black uppercase tracking-widest text-blue-200 mb-2">1RM Estimé</span>
                    <div className="text-4xl font-black">{estimated1RM > 0 ? `${estimated1RM} kg` : '--'}</div>
                    <span className="text-[10px] text-blue-200 mt-1 uppercase font-bold">Théorique</span>
                </div>
            </div>

            <div className="mt-8 p-4 bg-zinc-50 rounded-xl border border-zinc-100 flex gap-4 items-start">
                <Info size={18} className="text-[#FF6B00] shrink-0 mt-0.5" />
                <p className="text-xs text-zinc-900 leading-relaxed font-medium italic">
                    Basé sur l'échelle de <strong className="font-black">Mike Tuchscherer (RTS)</strong>. Un RPE 10 signifie aucune répétition supplémentaire possible, un RPE 9 signifie qu'il restait 1 répétition en réserve (RIR 1).
                </p>
            </div>
        </div>
    );
}
