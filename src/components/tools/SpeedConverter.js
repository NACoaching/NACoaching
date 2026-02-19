"use client";
import React, { useState, useEffect } from 'react';
import { Gauge, ArrowRightLeft } from 'lucide-react';
import AnimWrapper from "@/components/AnimWrapper";

export default function SpeedConverter() {
    const [kmh, setKmh] = useState('');
    const [ms, setMs] = useState('');
    const [minkm, setMinkm] = useState(''); // Stores "min:sec" string

    const handleKmhChange = (e) => {
        const val = e.target.value;
        setKmh(val);
        if (val && !isNaN(val)) {
            const k = parseFloat(val);
            setMs((k / 3.6).toFixed(2));
            const paceDec = 60 / k;
            const mins = Math.floor(paceDec);
            const secs = Math.round((paceDec - mins) * 60);
            setMinkm(`${mins}:${secs < 10 ? '0' : ''}${secs}`);
        } else {
            setMs('');
            setMinkm('');
        }
    };

    const handleMsChange = (e) => {
        const val = e.target.value;
        setMs(val);
        if (val && !isNaN(val)) {
            const m = parseFloat(val);
            const k = m * 3.6;
            setKmh(k.toFixed(2));
            const paceDec = 60 / k;
            const mins = Math.floor(paceDec);
            const secs = Math.round((paceDec - mins) * 60);
            setMinkm(`${mins}:${secs < 10 ? '0' : ''}${secs}`);
        } else {
            setKmh('');
            setMinkm('');
        }
    };

    const handleMinkmChange = (e) => {
        let val = e.target.value;
        setMinkm(val);

        // formats: "5", "5:30", "5.5"
        if (val.includes(':')) {
            const parts = val.split(':');
            const mins = parseFloat(parts[0]);
            const secs = parseFloat(parts[1] || 0);
            const totalMin = mins + secs / 60;
            if (totalMin > 0) {
                const k = 60 / totalMin;
                setKmh(k.toFixed(2));
                setMs((k / 3.6).toFixed(2));
            }
        } else if (val && !isNaN(val)) {
            // Treat as minutes if no colon
            const totalMin = parseFloat(val);
            if (totalMin > 0) {
                const k = 60 / totalMin;
                setKmh(k.toFixed(2));
                setMs((k / 3.6).toFixed(2));
            }
        } else {
            setKmh('');
            setMs('');
        }
    };

    return (
        <AnimWrapper delay={0.2}>
            <div className="bg-zinc-50 text-zinc-900 border border-zinc-200 p-6 rounded-lg h-full flex flex-col">
                <div className="flex items-center gap-3 mb-4">
                    <div className="bg-[#FF6B00] p-2 rounded text-white">
                        <ArrowRightLeft size={24} />
                    </div>
                    <h3 className="text-xl font-black uppercase">Convertisseur Allure</h3>
                </div>

                <p className="text-zinc-600 mb-6 text-sm">
                    Convertis instantanément ta vitesse entre km/h, m/s et allure (min/km).
                </p>

                <div className="space-y-4">
                    <div>
                        <label className="block text-xs font-bold uppercase text-zinc-500 mb-1">Vitesse (km/h)</label>
                        <input
                            type="number"
                            value={kmh}
                            onChange={handleKmhChange}
                            className="w-full border p-3 rounded text-sm focus:border-[#FF6B00] outline-none"
                            placeholder="Ex: 12"
                        />
                    </div>
                    <div>
                        <label className="block text-xs font-bold uppercase text-zinc-500 mb-1">Vitesse (m/s)</label>
                        <input
                            type="number"
                            value={ms}
                            onChange={handleMsChange}
                            className="w-full border p-3 rounded text-sm focus:border-[#FF6B00] outline-none"
                            placeholder="Ex: 3.33"
                        />
                    </div>
                    <div>
                        <label className="block text-xs font-bold uppercase text-zinc-500 mb-1">Allure (min/km)</label>
                        <input
                            type="text"
                            value={minkm}
                            onChange={handleMinkmChange}
                            className="w-full border p-3 rounded text-sm focus:border-[#FF6B00] outline-none"
                            placeholder="Ex: 5:00"
                        />
                        <span className="text-[10px] text-zinc-400">Format: minutes:secondes (ex: 4:30)</span>
                    </div>
                </div>
            </div>
        </AnimWrapper>
    );
}
