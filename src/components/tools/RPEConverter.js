"use client";
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

export default function RPEConverter() {
    const [reps, setReps] = useState(1);
    const [rpe, setRpe] = useState(10);
    const [weight, setWeight] = useState('');

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
                    <h2 className="text-2xl font-black uppercase text-zinc-900">Convertisseur RPE / % 1RM</h2>
                    <p className="text-xs font-bold text-zinc-400 uppercase tracking-widest">Optimisation de l'intensité</p>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                <div>
                    <label className="block text-xs font-black uppercase text-zinc-500 mb-2">Nombre de Répétitions</label>
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
                    <label className="block text-xs font-black uppercase text-zinc-500 mb-2">Intensité (RPE)</label>
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
                    <label className="block text-xs font-black uppercase text-zinc-500 mb-2">Charge utilisée (kg) - Optionnel</label>
                    <input
                        type="number"
                        placeholder="Ex: 100"
                        value={weight}
                        onChange={(e) => setWeight(e.target.value)}
                        className="w-full bg-zinc-50 border border-zinc-200 p-4 rounded-xl font-bold focus:outline-none focus:border-blue-500 transition shadow-inner"
                    />
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-zinc-900 text-white p-6 rounded-2xl flex flex-col items-center justify-center text-center">
                    <span className="text-xs font-black uppercase tracking-widest text-zinc-500 mb-2">Intensité Relative</span>
                    <div className="text-4xl font-black text-blue-400">{percentage}%</div>
                    <span className="text-[10px] text-zinc-400 mt-1 uppercase font-bold">de ton 1RM</span>
                </div>

                <div className="bg-blue-600 text-white p-6 rounded-2xl flex flex-col items-center justify-center text-center">
                    <span className="text-xs font-black uppercase tracking-widest text-blue-200 mb-2">1RM Estimé</span>
                    <div className="text-4xl font-black">{estimated1RM > 0 ? `${estimated1RM} kg` : '--'}</div>
                    <span className="text-[10px] text-blue-200 mt-1 uppercase font-bold">Théorique</span>
                </div>
            </div>

            <div className="mt-8 p-4 bg-zinc-50 rounded-xl border border-zinc-100 flex gap-4 items-start">
                <Info size={18} className="text-zinc-400 shrink-0 mt-0.5" />
                <p className="text-xs text-zinc-500 leading-relaxed italic">
                    Basé sur l'échelle de **Mike Tuchscherer (RTS)**. Un RPE 10 signifie aucune répétition supplémentaire possible, un RPE 9 signifie qu'il restait 1 répétition en réserve (RIR 1).
                </p>
            </div>
        </div>
    );
}
