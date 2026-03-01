"use client";
import Tooltip from "@/components/Tooltip";
import React, { useState } from 'react';
import { Layers, Info, AlertTriangle, CheckCircle2 } from 'lucide-react';

const muscles = [
    { id: 'pecs', name: 'Pectoraux' },
    { id: 'dos', name: 'Dos' },
    { id: 'quads', name: 'Quadriceps' },
    { id: 'ischios', name: 'Ischios & Fessiers' },
    { id: 'épaules', name: 'Épaules' },
    { id: 'bras', name: 'Bras (Biceps/Triceps)' }
];

export default function EffectiveVolume({ hints = {} }) {
    const [volumes, setVolumes] = useState({
        pecs: 0, dos: 0, quads: 0, ischios: 0, épaules: 0, bras: 0
    });

    const getStatus = (sets) => {
        if (sets === 0) return { label: 'Inactif', color: 'bg-zinc-100 text-zinc-600', width: '5%', icon: Info };
        if (sets < 6) return { label: 'Maintien', color: 'bg-blue-100 text-blue-600', width: '30%', icon: CheckCircle2 };
        if (sets <= 15) return { label: 'Volume Optimal', color: 'bg-green-100 text-green-600', width: '70%', icon: CheckCircle2 };
        if (sets <= 22) return { label: 'Over-reaching', color: 'bg-orange-100 text-orange-600', width: '90%', icon: AlertTriangle };
        return { label: 'Risque de blessure', color: 'bg-red-100 text-red-600', width: '100%', icon: AlertTriangle };
    };

    return (
        <div className="bg-white p-8 rounded-2xl border border-zinc-200 shadow-xl max-w-3xl mx-auto">
            <div className="flex items-center gap-4 mb-8">
                <div className="w-12 h-12 bg-emerald-50 text-emerald-500 rounded-xl flex items-center justify-center">
                    <Layers size={24} />
                </div>
                <div>
                    <h2 className="text-2xl font-black uppercase text-zinc-900">Calculateur de Volume Effectif</h2>
                    <p className="text-xs font-bold text-zinc-600 uppercase tracking-widest">Optimisation de l'hypertrophie</p>
                </div>
            </div>

            <div className="space-y-6 mb-10">
                <p className="text-sm text-zinc-700 italic mb-6">Indiquez le nombre de **séries effectives** (amenées à proximité de l'échec) par semaine pour chaque groupe musculaire.</p>

                {muscles.map((m) => {
                    const status = getStatus(volumes[m.id]);
                    const StatusIcon = status.icon;

                    return (
                        <div key={m.id} className="group">
                            <div className="flex justify-between items-end mb-3">
                                <div>
                                    <label className="flex items-center text-xs font-black uppercase text-zinc-700 mb-1">
                                        {m.name}
                                        <Tooltip text={hints[m.id]} />
                                    </label>
                                    <div className="flex items-center gap-2">
                                        <input
                                            type="number"
                                            value={volumes[m.id]}
                                            onChange={(e) => setVolumes({ ...volumes, [m.id]: Math.max(0, parseInt(e.target.value) || 0) })}
                                            className="w-20 bg-zinc-50 border border-zinc-200 p-2 rounded-lg font-bold text-center focus:outline-none focus:border-emerald-500 transition"
                                        />
                                        <span className="text-xs font-bold text-zinc-600 uppercase">séries / sem</span>
                                    </div>
                                </div>
                                <div className={`px-3 py-1 rounded-full text-[10px] font-black uppercase flex items-center gap-1.5 ${status.color}`}>
                                    <StatusIcon size={12} /> {status.label}
                                </div>
                            </div>
                            <div className="h-2 bg-zinc-100 rounded-full overflow-hidden">
                                <div
                                    className={`h-full transition-all duration-500 ${status.color.split(' ')[0].replace('-100', '-500')}`}
                                    style={{ width: status.width }}
                                />
                            </div>
                        </div>
                    );
                })}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-4 bg-zinc-50 rounded-xl border border-zinc-100">
                    <h4 className="text-[10px] font-black uppercase text-zinc-600 mb-2">Guide de lecture</h4>
                    <ul className="space-y-2">
                        <li className="text-[11px] text-zinc-600 flex items-center gap-2"><span className="w-2 h-2 rounded-full bg-blue-500" /> **6-10 séries** : Minimum pour progresser.</li>
                        <li className="text-[11px] text-zinc-600 flex items-center gap-2"><span className="w-2 h-2 rounded-full bg-green-500" /> **12-20 séries** : Zone de gain maximal.</li>
                        <li className="text-[11px] text-zinc-600 flex items-center gap-2"><span className="w-2 h-2 rounded-full bg-orange-500" /> **20+ séries** : Haut volume (avancés uniquement).</li>
                    </ul>
                </div>
                <div className="p-4 bg-zinc-50 rounded-xl border border-zinc-100 flex gap-3 items-start">
                    <Info size={16} className="text-zinc-600 shrink-0 mt-0.5" />
                    <p className="text-[10px] text-zinc-700 leading-relaxed italic">
                        Ces données sont basées sur les travaux de **Dr. Mike Israetel** et **James Krieger**. Notez que la récupération dépend aussi de votre sommeil et de votre nutrition.
                    </p>
                </div>
            </div>
        </div>
    );
}
