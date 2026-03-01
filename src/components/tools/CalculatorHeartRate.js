"use client";
import React, { useState } from 'react';
import { Heart, Activity } from 'lucide-react';
import AnimWrapper from "@/components/AnimWrapper";
import ShareResults from "@/components/tools/ShareResults";
import { Info } from 'lucide-react';
import Tooltip from "@/components/Tooltip";

export default function CalculatorHeartRate({ hints = {} }) {
    const [age, setAge] = useState('');
    const [restHR, setRestHR] = useState('');
    const [zones, setZones] = useState(null);

    const calculateZones = (e) => {
        e.preventDefault();
        const a = parseFloat(age);
        const rest = parseFloat(restHR);

        if (a > 0 && rest >= 0) {
            // formula: 220 - age
            const max = 220 - a;
            const reserve = max - rest;

            const calculateZone = (percentage) => Math.round((reserve * percentage) + rest);

            setZones([
                { name: "Récupération", range: "50-60%", min: calculateZone(0.5), max: calculateZone(0.6), color: "bg-gray-100 text-gray-800" },
                { name: "Endurance Fondamentale", range: "60-70%", min: calculateZone(0.6), max: calculateZone(0.7), color: "bg-green-100 text-green-800" },
                { name: "Endurance Active", range: "70-80%", min: calculateZone(0.7), max: calculateZone(0.8), color: "bg-yellow-100 text-yellow-800" },
                { name: "Seuil Anaérobie", range: "80-90%", min: calculateZone(0.8), max: calculateZone(0.9), color: "bg-orange-100 text-orange-800" },
                { name: "VO2 Max / Sprint", range: "90-100%", min: calculateZone(0.9), max: calculateZone(1.0), color: "bg-red-100 text-red-800" },
            ]);
        }
    };

    return (
        <AnimWrapper delay={0.4}>
            <div className="bg-zinc-50 text-zinc-900 border border-zinc-200 p-6 rounded-lg h-full flex flex-col">
                <div className="flex items-center gap-3 mb-4">
                    <div className="bg-[#FF6B00] p-2 rounded text-white">
                        <Heart size={24} />
                    </div>
                    <h3 className="text-xl font-black uppercase">Zones Cardiaques</h3>
                </div>

                <p className="text-zinc-600 mb-6 text-sm">
                    Calcule tes 5 zones d&apos;entraînement selon la méthode de Karvonen (plus précise).
                </p>

                <form onSubmit={calculateZones} className="space-y-4 mb-6">
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="flex items-center text-xs font-black uppercase text-zinc-900 mb-1">
                                Ton Âge
                                <Tooltip text={hints.age} />
                            </label>
                            <input
                                type="number"
                                value={age}
                                onChange={(e) => setAge(e.target.value)}
                                className="w-full border p-3 rounded text-sm focus:border-[#FF6B00] outline-none"
                                placeholder="Ex: 25"
                                required
                            />
                        </div>
                        <div>
                            <label className="flex items-center text-xs font-black uppercase text-zinc-900 mb-1">
                                FC Repos (bpm)
                                <Tooltip text={hints.repos || hints.rest_hr} />
                            </label>
                            <input
                                type="number"
                                value={restHR}
                                onChange={(e) => setRestHR(e.target.value)}
                                className="w-full border p-3 rounded text-sm focus:border-[#FF6B00] outline-none"
                                placeholder="Ex: 60"
                                required
                            />
                        </div>
                    </div>
                    <button type="submit" className="w-full bg-black text-white font-black py-3 rounded uppercase hover:bg-[#FF6B00] hover:text-black transition">
                        Calculer
                    </button>
                </form>

                {zones && (
                    <div className="mt-auto bg-white border border-zinc-200 rounded-lg overflow-hidden">
                        {zones.map((zone, index) => (
                            <div key={index} className={`flex justify-between items-center p-3 border-b border-zinc-100 last:border-0 text-xs ${zone.color}`}>
                                <div>
                                    <span className="font-black block uppercase text-zinc-900">{zone.name}</span>
                                    <span className="opacity-90 font-bold">{zone.range}</span>
                                </div>
                                <div className="text-right font-black text-lg text-black">
                                    {zone.min}-{zone.max} <span className="text-[10px] font-bold text-zinc-700 uppercase">bpm</span>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
                {zones && <ShareResults title="Mes Zones Cardiaques" zones={zones} />}
            </div>

        </AnimWrapper>
    );
}
