"use client";
import React, { useState } from 'react';
import { Gauge, Wind } from 'lucide-react';
import AnimWrapper from "@/components/AnimWrapper";
import ShareResults from "@/components/tools/ShareResults";
import Tooltip from "@/components/Tooltip";

export default function VmaVo2Converter({ hints = {} }) {
    const [vma, setVma] = useState('');
    const [vo2max, setVo2max] = useState('');
    const [weight, setWeight] = useState('');
    const [vo2Rel, setVo2Rel] = useState(null);
    const [vo2Abs, setVo2Abs] = useState(null);

    const calculate = (newVma, newWeight) => {
        const v = parseFloat(newVma);
        const w = parseFloat(newWeight);

        if (v && !isNaN(v)) {
            // Relative VO2max = VMA * 3.5
            const rel = v * 3.5;
            setVo2Rel(rel.toFixed(1));

            if (w && !isNaN(w)) {
                // Absolute VO2max (L/min) = (Relative * Weight) / 1000
                const abs = (rel * w) / 1000;
                setVo2Abs(abs.toFixed(2));
            } else {
                setVo2Abs(null);
            }
        } else {
            setVo2Rel(null);
            setVo2Abs(null);
        }
    };

    const handleVmaChange = (e) => {
        const val = e.target.value;
        setVma(val);
        // Sync vo2max
        if (val && !isNaN(val)) {
            setVo2max((parseFloat(val) * 3.5).toFixed(1));
        }
        calculate(val, weight);
    };

    const handleVo2maxChange = (e) => {
        const val = e.target.value;
        setVo2max(val);
        // Sync VMA
        if (val && !isNaN(val)) {
            setVma((parseFloat(val) / 3.5).toFixed(1));
        }
        calculate(parseFloat(val) / 3.5, weight);
    };

    const handleWeightChange = (e) => {
        const val = e.target.value;
        setWeight(val);
        calculate(vma, val);
    };

    return (
        <AnimWrapper delay={0.3}>
            <div className="bg-zinc-50 text-zinc-900 border border-zinc-200 p-6 rounded-lg h-full flex flex-col">
                <div className="flex items-center gap-3 mb-4">
                    <div className="bg-[#FF6B00] p-2 rounded text-white">
                        <Wind size={24} />
                    </div>
                    <h3 className="text-xl font-black uppercase">VMA ➔ VO2max</h3>
                </div>

                <p className="text-zinc-600 mb-6 text-sm">
                    Estime ton VO2max Relatif et Absolu à partir de ta VMA et de ton poids.
                </p>

                <div className="space-y-4 mb-6">
                    <div>
                        <label className="flex items-center text-xs font-bold uppercase text-zinc-700 mb-1">
                            Ta VMA (km/h)
                            <Tooltip text={hints.vma} />
                        </label>
                        <input
                            type="number"
                            step="0.1"
                            value={vma}
                            onChange={handleVmaChange}
                            className="w-full border p-3 rounded text-sm focus:border-[#FF6B00] outline-none"
                            placeholder="Ex: 15.5"
                        />
                    </div>
                    <div>
                        <label className="flex items-center text-xs font-bold uppercase text-zinc-700 mb-1">
                            Ta VO2max (ml/kg/min)
                            <Tooltip text={hints.vo2max} />
                        </label>
                        <input
                            type="number"
                            step="0.1"
                            value={vo2max}
                            onChange={handleVo2maxChange}
                            className="w-full border p-3 rounded text-sm focus:border-[#FF6B00] outline-none"
                            placeholder="Ex: 50.2"
                        />
                    </div>
                </div>

                {vo2Rel && (
                    <div className="mt-auto bg-white border border-zinc-200 p-4 rounded-lg space-y-3">
                        <div className="text-center">
                            <span className="block text-xs font-bold uppercase text-zinc-600">VO2max Relatif</span>
                            <span className="text-4xl font-black text-[#FF6B00]">{vo2Rel}</span>
                            <span className="block text-[10px] text-zinc-600">ml/kg/min</span>
                        </div>
                        {vo2Abs && (
                            <div className="text-center border-t border-zinc-100 pt-3">
                                <span className="block text-xs font-bold uppercase text-zinc-600">VO2max Absolu</span>
                                <span className="text-2xl font-black text-zinc-800">{vo2Abs}</span>
                                <span className="block text-[10px] text-zinc-600">L/min</span>
                            </div>
                        )}
                        <ShareResults
                            title="Mon VO2max"
                            value={vo2Rel}
                            subtitle={vo2Abs ? `Absolu : ${vo2Abs} L/min` : `VMA : ${vma} km/h`}
                        />
                    </div>
                )}
            </div>
        </AnimWrapper>
    );
}
