"use client";
import Tooltip from "@/components/Tooltip";
import React, { useState, useEffect } from 'react';
import { Gauge, ArrowRightLeft } from 'lucide-react';
import AnimWrapper from "@/components/AnimWrapper";

export default function SpeedConverter({ hints = {} }) {
    const [kmh, setKmh] = useState('');
    const [ms, setMs] = useState('');
    const [minkm, setMinkm] = useState('');

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
                    <h3 className="text-xl font-black uppercase text-black">Convertisseur de Vitesse : Allures, km/h & min/km</h3>
                </div>

                <p className="text-zinc-600 mb-6 text-sm">
                    Convertis instantanément ta vitesse entre km/h, m/s et allure (min/km).
                </p>

                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <label className="flex items-center text-xs font-black uppercase text-zinc-900 mb-1">
                            Vitesse (km/h)
                            <Tooltip text={hints.vitesse || hints.speed} />
                        </label>
                        <input
                            type="number"
                            step="0.1"
                            value={kmh}
                            onChange={handleKmhChange}
                            className="w-full border p-3 rounded text-sm focus:border-[#FF6B00] outline-none text-black"
                            placeholder="Ex: 12.5"
                        />
                    </div>
                    <div>
                        <label className="flex items-center text-xs font-black uppercase text-zinc-900 mb-1">
                            Allure (min/km)
                            <Tooltip text={hints.allure || hints.pace} />
                        </label>
                        <div className="flex gap-1">
                            <input
                                type="number"
                                value={minkm.split(':')[0] || ''}
                                onChange={(e) => {
                                    const s = minkm.split(':')[1] || '00';
                                    handleMinkmChange({ target: { value: `${e.target.value}:${s}` } });
                                }}
                                className="w-full border p-3 rounded text-sm focus:border-[#FF6B00] outline-none"
                                placeholder="Min"
                            />
                            <input
                                type="number"
                                value={minkm.split(':')[1] || ''}
                                onChange={(e) => {
                                    const m = minkm.split(':')[0] || '0';
                                    handleMinkmChange({ target: { value: `${m}:${e.target.value}` } });
                                }}
                                className="w-full border p-3 rounded text-sm focus:border-[#FF6B00] outline-none"
                                placeholder="Sec"
                            />
                        </div>
                        <span className="text-[10px] text-zinc-600">Format: minutes:secondes (ex: 4:30)</span>
                    </div>
                </div>
            </div>
        </AnimWrapper>
    );
}
