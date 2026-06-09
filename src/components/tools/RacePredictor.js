"use client";
import React, { useState, useMemo } from 'react';
import { Trophy, Clock, Info, ArrowRight } from 'lucide-react';
import Tooltip from "@/components/Tooltip";

const DISTANCES = [
    { id: '5k', name: '5 km', meters: 5000 },
    { id: '10k', name: '10 km', meters: 10000 },
    { id: 'half', name: 'Semi-Marathon', meters: 21097 },
    { id: 'marathon', name: 'Marathon', meters: 42195 },
];

export default function RacePredictor({ hints = {} }) {
    const [refDist, setRefDist] = useState(5000);
    const [hours, setHours] = useState('');
    const [mins, setMins] = useState('');
    const [secs, setSecs] = useState('');

    const predictions = useMemo(() => {
        const h = parseInt(hours) || 0;
        const m = parseInt(mins) || 0;
        const s = parseInt(secs) || 0;
        const totalSeconds = (h * 3600) + (m * 60) + s;

        if (totalSeconds <= 0) return null;

        return DISTANCES.map(d => {
            // Riegel's Formula: T2 = T1 * (D2 / D1)^1.06
            const predictedSeconds = totalSeconds * Math.pow((d.meters / refDist), 1.06);

            const pH = Math.floor(predictedSeconds / 3600);
            const pM = Math.floor((predictedSeconds % 3600) / 60);
            const pS = Math.round(predictedSeconds % 60);

            const timeStr = pH > 0
                ? `${pH}h ${pM.toString().padStart(2, '0')}m ${pS.toString().padStart(2, '0')}s`
                : `${pM}m ${pS.toString().padStart(2, '0')}s`;

            // Pace calculation (min/km)
            const paceInDecimalMinutes = (predictedSeconds / (d.meters / 1000)) / 60;
            const paceMins = Math.floor(paceInDecimalMinutes);
            const paceSecs = Math.round((paceInDecimalMinutes - paceMins) * 60);
            const paceStr = `${paceMins}'${paceSecs.toString().padStart(2, '0')}`;

            return {
                ...d,
                time: timeStr,
                pace: paceStr,
                isRef: d.meters === refDist
            };
        });
    }, [refDist, hours, mins, secs]);

    return (
        <div className="bg-white p-8 rounded-2xl border border-zinc-200 shadow-xl max-w-2xl mx-auto">
            <div className="flex items-center gap-4 mb-8">
                <div className="w-12 h-12 bg-blue-50 text-blue-500 rounded-xl flex items-center justify-center">
                    <Trophy size={24} />
                </div>
                <div>
                    <h2 className="text-3xl font-bold text-zinc-950 leading-none">
                        PRÉDICTEUR <span className="text-[#FF6B00]">RUNNING</span>
                    </h2>
                    <p className="text-[10px] font-bold text-zinc-600 uppercase tracking-widest mt-1">Potentiel Chrono & Formule de Riegel</p>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                <div>
                    <label className="block text-xs font-bold text-zinc-900 mb-2">Distance de Référence</label>
                    <select
                        value={refDist}
                        onChange={(e) => setRefDist(parseInt(e.target.value))}
                        className="w-full bg-zinc-50 border border-zinc-200 p-4 rounded-xl font-bold focus:outline-none focus:border-blue-500 transition shadow-inner text-black"
                    >
                        {DISTANCES.map(d => (
                            <option key={d.id} value={d.meters} className="text-black bg-white">{d.name}</option>
                        ))}
                    </select>
                </div>

                <div>
                    <label className="block text-xs font-bold text-zinc-900 mb-2">Temps Réalisé</label>
                    <div className="flex items-center gap-2">
                        <div className="flex-1 min-w-0 text-center">
                            <input type="number" placeholder="HH" value={hours} onChange={e => setHours(e.target.value)} className="w-full bg-zinc-50 border border-zinc-200 p-3 rounded-lg font-bold text-center text-black" />
                            <span className="text-[10px] uppercase font-bold text-zinc-600">h</span>
                        </div>
                        <div className="flex-1 min-w-0 text-center">
                            <input type="number" placeholder="MM" value={mins} onChange={e => setMins(e.target.value)} className="w-full bg-zinc-50 border border-zinc-200 p-3 rounded-lg font-bold text-center text-black" />
                            <span className="text-[10px] uppercase font-bold text-zinc-600">m</span>
                        </div>
                        <div className="flex-1 min-w-0 text-center">
                            <input type="number" placeholder="SS" value={secs} onChange={e => setSecs(e.target.value)} className="w-full bg-zinc-50 border border-zinc-200 p-3 rounded-lg font-bold text-center text-black" />
                            <span className="text-[10px] uppercase font-bold text-zinc-600">s</span>
                        </div>
                    </div>
                </div>
            </div>

            {predictions ? (
                <div className="space-y-4 animate-in fade-in slide-in-from-bottom-4 duration-500">
                    <h3 className="text-xs font-bold text-zinc-900 tracking-widest mb-4">Tes Prédictions Théoriques</h3>
                    <div className="space-y-3">
                        {predictions.map((p) => (
                            <div key={p.id} className={`flex items-center justify-between p-4 rounded-xl border transition-all ${p.isRef ? 'bg-blue-50 border-blue-200' : 'bg-zinc-50 border-zinc-100'}`}>
                                <div>
                                    <div className="text-xs font-bold text-zinc-900 flex items-center gap-2">
                                        {p.name} {p.isRef && <span className="bg-blue-600 text-white px-2 py-0.5 rounded-full text-[8px]">RÉfÉrence</span>}
                                    </div>
                                    <div className="text-xl font-bold text-zinc-900 leading-tight mt-1">{p.time}</div>
                                </div>
                                <div className="text-right">
                                    <div className="text-[10px] font-bold text-zinc-800 uppercase">Allure cible</div>
                                    <div className="text-md font-bold text-black">{p.pace} min/km</div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            ) : (
                <div className="p-12 border-2 border-dashed border-zinc-100 rounded-2xl flex flex-col items-center justify-center text-center opacity-50">
                    <Clock size={40} className="text-zinc-500 mb-4" />
                    <p className="text-sm font-bold text-zinc-700 uppercase tracking-widest">Entrez votre temps de référence</p>
                </div>
            )}

            <div className="mt-8 pt-6 border-t border-zinc-100">
                <div className="flex gap-4 items-start">
                    <Info size={18} className="text-[#FF6B00] shrink-0 mt-0.5" />
                    <p className="text-[10px] text-zinc-900 leading-relaxed font-medium italic">
                        La <strong className="font-bold">formule de Riegel</strong> est l'étalon d'or pour prédire les performances en endurance. Elle suppose un entraînement adéquat pour la distance visée. Plus l'écart entre votre distance de référence et l'objectif est grand, plus la marge d'erreur augmente.
                    </p>
                </div>
            </div>
        </div>
    );
}
