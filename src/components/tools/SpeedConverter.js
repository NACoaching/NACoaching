"use client";
import Tooltip from "@/components/Tooltip";
import React, { useState } from 'react';
import { ArrowRightLeft, Sparkles, MapPin } from 'lucide-react';
import AnimWrapper from "@/components/AnimWrapper";

export default function SpeedConverter({ hints = {} }) {
    const [kmh, setKmh] = useState('');
    const [ms, setMs] = useState('');
    const [minkm, setMinkm] = useState('');
    const [fractionSeconds, setFractionSeconds] = useState(15);
    const [customSeconds, setCustomSeconds] = useState('');

    const syncFromKmh = (val) => {
        setKmh(val);
        if (val && !isNaN(val) && parseFloat(val) > 0) {
            const k = parseFloat(val);
            const m = k / 3.6;
            setMs(m.toFixed(2));
            const paceDec = 60 / k;
            const mins = Math.floor(paceDec);
            const secs = Math.round((paceDec - mins) * 60);
            setMinkm(`${mins}:${secs < 10 ? '0' : ''}${secs}`);
        } else {
            setMs('');
            setMinkm('');
        }
    };

    const handleKmhChange = (e) => {
        syncFromKmh(e.target.value);
    };

    const handleMsChange = (e) => {
        const val = e.target.value;
        setMs(val);
        if (val && !isNaN(val) && parseFloat(val) > 0) {
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

    const handleMinkmChange = (val) => {
        setMinkm(val);
        if (val.includes(':')) {
            const parts = val.split(':');
            const mins = parseFloat(parts[0] || 0);
            const secs = parseFloat(parts[1] || 0);
            const totalMin = mins + secs / 60;
            if (totalMin > 0) {
                const k = 60 / totalMin;
                setKmh(k.toFixed(2));
                setMs((k / 3.6).toFixed(2));
            }
        } else if (val && !isNaN(val)) {
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

    // Calculate fraction distance
    const currentMs = parseFloat(ms) || (parseFloat(kmh) ? parseFloat(kmh) / 3.6 : 0);
    const activeSeconds = customSeconds ? parseFloat(customSeconds) : fractionSeconds;
    const distanceMeters = currentMs && activeSeconds > 0 ? (currentMs * activeSeconds).toFixed(1) : null;

    // Presets for common speed targets
    const speedPresets = [10, 12, 14, 15, 16, 18, 20];
    const fractionPresets = [
        { label: '10/10 (10s)', sec: 10 },
        { label: '15/15 (15s)', sec: 15 },
        { label: '20/20 (20s)', sec: 20 },
        { label: '30/30 (30s)', sec: 30 },
        { label: '45/15 (45s)', sec: 45 },
        { label: '1 min (60s)', sec: 60 },
    ];

    return (
        <AnimWrapper delay={0.2}>
            <div className="bg-white text-zinc-900 border border-zinc-200 p-6 md:p-8 rounded-2xl shadow-sm flex flex-col gap-6">
                {/* Header */}
                <div>
                    <div className="flex items-center gap-3 mb-3">
                        <div className="bg-[#FF6B00] p-2.5 rounded-xl text-white shadow-sm shadow-orange-500/20">
                            <ArrowRightLeft size={24} />
                        </div>
                        <div>
                            <h3 className="text-xl md:text-2xl font-bold text-zinc-950">
                                Convertisseur de Vitesse : km/h, min/km & m/s
                            </h3>
                            <p className="text-zinc-500 text-xs md:text-sm">
                                Conversion instantanée tridirectionnelle pour course sur route, tapis et piste d'athlétisme.
                            </p>
                        </div>
                    </div>
                </div>

                {/* 3 Interactive Inputs */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {/* Vitesse km/h */}
                    <div className="bg-zinc-50/80 border border-zinc-200/80 p-4 rounded-xl hover:border-[#FF6B00] hover:bg-orange-50/10 focus-within:border-[#FF6B00] focus-within:bg-white focus-within:shadow-xs transition duration-200">
                        <label className="flex items-center justify-between text-xs font-bold text-zinc-900 mb-1.5">
                            <span>Vitesse (km/h)</span>
                            <Tooltip text={hints.vitesse || hints.speed || "Vitesse standard sur tapis de course, vélo ou voiture. Ex: 15 km/h."} />
                        </label>
                        <div className="relative">
                            <input
                                type="number"
                                step="0.1"
                                min="0"
                                value={kmh}
                                onChange={handleKmhChange}
                                className="w-full bg-white border border-zinc-200 py-2.5 pl-3 pr-14 rounded-lg text-lg font-bold text-zinc-950 focus:border-[#FF6B00] focus:ring-1 focus:ring-[#FF6B00] outline-none transition [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                                placeholder="Ex: 15"
                            />
                            <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-semibold text-zinc-400 pointer-events-none select-none">
                                km/h
                            </span>
                        </div>
                        <span className="text-[11px] text-zinc-500 mt-1 block">Tapis de course, route, vélo</span>
                    </div>

                    {/* Vitesse m/s */}
                    <div className="bg-zinc-50/80 border border-zinc-200/80 p-4 rounded-xl hover:border-[#FF6B00] hover:bg-orange-50/10 focus-within:border-[#FF6B00] focus-within:bg-white focus-within:shadow-xs transition duration-200">
                        <label className="flex items-center justify-between text-xs font-bold text-zinc-900 mb-1.5">
                            <span>Vitesse (m/s)</span>
                            <Tooltip text={hints.ms || hints.m_s || "Mètres par seconde : la métrique essentielle pour le fractionné court (15/15, 30/30) et le balisage de plots sur piste. 1 m/s = 3.6 km/h."} />
                        </label>
                        <div className="relative">
                            <input
                                type="number"
                                step="0.05"
                                min="0"
                                value={ms}
                                onChange={handleMsChange}
                                className="w-full bg-white border border-zinc-200 py-2.5 pl-3 pr-14 rounded-lg text-lg font-bold text-zinc-950 focus:border-[#FF6B00] focus:ring-1 focus:ring-[#FF6B00] outline-none transition [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                                placeholder="Ex: 4.17"
                            />
                            <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-semibold text-zinc-400 pointer-events-none select-none">
                                m/s
                            </span>
                        </div>
                        <span className="text-[11px] text-zinc-500 mt-1 block">Distance parcourue par seconde</span>
                    </div>

                    {/* Allure min/km */}
                    <div className="bg-zinc-50/80 border border-zinc-200/80 p-4 rounded-xl hover:border-[#FF6B00] hover:bg-orange-50/10 focus-within:border-[#FF6B00] focus-within:bg-white focus-within:shadow-xs transition duration-200">
                        <label className="flex items-center justify-between text-xs font-bold text-zinc-900 mb-1.5">
                            <span>Allure (min/km)</span>
                            <Tooltip text={hints.allure || hints.pace || "Allure GPS en minutes et secondes par kilomètre. Ex: 4:00 min/km."} />
                        </label>
                        <div className="flex gap-2">
                            <div className="relative flex-1">
                                <input
                                    type="number"
                                    min="0"
                                    max="59"
                                    value={minkm ? minkm.split(':')[0] || '' : ''}
                                    onChange={(e) => {
                                        const s = minkm.includes(':') ? minkm.split(':')[1] || '00' : '00';
                                        handleMinkmChange(`${e.target.value}:${s}`);
                                    }}
                                    className="w-full bg-white border border-zinc-200 py-2.5 pl-2 pr-8 rounded-lg text-lg font-bold text-zinc-950 focus:border-[#FF6B00] focus:ring-1 focus:ring-[#FF6B00] outline-none transition text-center [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                                    placeholder="Min"
                                />
                                <span className="absolute right-2 top-1/2 -translate-y-1/2 text-[10px] text-zinc-400 pointer-events-none select-none font-bold">
                                    min
                                </span>
                            </div>
                            <span className="self-center font-bold text-zinc-400 text-lg">:</span>
                            <div className="relative flex-1">
                                <input
                                    type="number"
                                    min="0"
                                    max="59"
                                    value={minkm && minkm.includes(':') ? minkm.split(':')[1] || '' : ''}
                                    onChange={(e) => {
                                        const m = minkm.includes(':') ? minkm.split(':')[0] || '0' : '0';
                                        handleMinkmChange(`${m}:${e.target.value}`);
                                    }}
                                    className="w-full bg-white border border-zinc-200 py-2.5 pl-2 pr-8 rounded-lg text-lg font-bold text-zinc-950 focus:border-[#FF6B00] focus:ring-1 focus:ring-[#FF6B00] outline-none transition text-center [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                                    placeholder="Sec"
                                />
                                <span className="absolute right-2 top-1/2 -translate-y-1/2 text-[10px] text-zinc-400 pointer-events-none select-none font-bold">
                                    sec
                                </span>
                            </div>
                        </div>
                        <span className="text-[11px] text-zinc-500 mt-1 block">Montres GPS (Garmin, Coros, Strava)</span>
                    </div>
                </div>

                {/* Quick Speed Presets */}
                <div className="flex flex-wrap items-center gap-2 pt-1 border-t border-zinc-100">
                    <span className="text-xs text-zinc-600 font-bold mr-1">Allures rapides :</span>
                    {speedPresets.map((speed) => (
                        <button
                            key={speed}
                            type="button"
                            onClick={() => syncFromKmh(speed.toString())}
                            className={`text-xs px-2.5 py-1 rounded-md border font-bold transition ${
                                parseFloat(kmh) === speed
                                    ? 'bg-[#FF6B00] text-white border-[#FF6B00]'
                                    : 'bg-zinc-50 hover:bg-zinc-100 text-zinc-700 border-zinc-200'
                            }`}
                        >
                            {speed} km/h
                        </button>
                    ))}
                    {(kmh || ms || minkm) && (
                        <button
                            type="button"
                            onClick={() => {
                                setKmh('');
                                setMs('');
                                setMinkm('');
                            }}
                            className="text-xs text-zinc-600 hover:text-red-500 underline ml-auto transition"
                        >
                            Réinitialiser
                        </button>
                    )}
                </div>

                {/* SPECIAL COACH SECTION: Calculateur de Distance de Fractionné (15/15, 30/30) */}
                <div className="bg-gradient-to-br from-zinc-900 to-zinc-950 text-white p-5 md:p-6 rounded-xl shadow-lg border border-zinc-800">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 mb-4 pb-3 border-b border-zinc-800">
                        <div className="flex items-center gap-2">
                            <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-[#FF6B00] text-white">
                                <Sparkles size={16} />
                            </span>
                            <div>
                                <h4 className="text-sm md:text-base font-bold text-white">
                                    Calculateur de Fractionné Court & Balisage Piste
                                </h4>
                                <p className="text-zinc-400 text-xs">
                                    Combien de mètres faire lors d'un 15/15, 30/30 ou fractionné VMA ?
                                </p>
                            </div>
                        </div>
                        <span className="inline-block text-[11px] font-semibold bg-zinc-800 text-[#FF6B00] px-2.5 py-1 rounded-full border border-zinc-700 self-start md:self-auto">
                            Formule : d = v (m/s) × t (s)
                        </span>
                    </div>

                    {/* Presets interval */}
                    <div className="mb-4">
                        <label className="text-xs font-bold text-zinc-300 block mb-2">
                            Choisissez votre format de fractionné :
                        </label>
                        <div className="flex flex-wrap gap-2">
                            {fractionPresets.map((preset) => {
                                const isSelected = !customSeconds && fractionSeconds === preset.sec;
                                return (
                                    <button
                                        key={preset.sec}
                                        type="button"
                                        onClick={() => {
                                            setFractionSeconds(preset.sec);
                                            setCustomSeconds('');
                                        }}
                                        className={`text-xs px-3 py-1.5 rounded-lg font-bold transition ${
                                            isSelected
                                                ? 'bg-[#FF6B00] text-white shadow-sm'
                                                : 'bg-zinc-800/80 hover:bg-zinc-800 text-zinc-300 border border-zinc-700/60'
                                        }`}
                                    >
                                        {preset.label}
                                    </button>
                                );
                            })}
                            <div className="flex items-center gap-1.5 ml-auto">
                                <span className="text-xs text-zinc-400">Autre :</span>
                                <input
                                    type="number"
                                    min="1"
                                    placeholder="ex: 40"
                                    value={customSeconds}
                                    onChange={(e) => setCustomSeconds(e.target.value)}
                                    className="w-16 bg-zinc-800 border border-zinc-700 text-white text-xs px-2 py-1.5 rounded-lg text-center font-bold focus:border-[#FF6B00] outline-none [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                                />
                                <span className="text-xs text-zinc-400">sec</span>
                            </div>
                        </div>
                    </div>

                    {/* Live Calculation Display */}
                    <div className="bg-zinc-900/90 border border-zinc-800 p-4 rounded-xl flex flex-col md:flex-row items-center justify-between gap-4">
                        {distanceMeters ? (
                            <>
                                <div>
                                    <div className="text-xs text-zinc-400 mb-0.5">
                                        Distance exacte à parcourir par fraction de {activeSeconds}s :
                                    </div>
                                    <div className="flex items-baseline gap-2">
                                        <span className="text-3xl md:text-4xl font-extrabold text-[#FF6B00]">
                                            {distanceMeters} m
                                        </span>
                                        <span className="text-xs text-zinc-400">
                                            (à {currentMs.toFixed(2)} m/s soit {kmh ? kmh : (currentMs * 3.6).toFixed(1)} km/h)
                                        </span>
                                    </div>
                                </div>

                                <div className="text-left md:text-right border-t md:border-t-0 md:border-l border-zinc-800 pt-2 md:pt-0 md:pl-4">
                                    <div className="text-xs font-semibold text-zinc-300 flex items-center md:justify-end gap-1">
                                        <MapPin size={13} className="text-[#FF6B00]" />
                                        Balisage de terrain :
                                    </div>
                                    <div className="text-xs text-zinc-400 mt-0.5 max-w-xs">
                                        Placez un plot à <strong>0 m</strong> et un plot à <strong>{Math.round(distanceMeters)} m</strong>.
                                        À chaque bip de {activeSeconds}s, vous devez atteindre le repère.
                                    </div>
                                </div>
                            </>
                        ) : (
                            <div className="text-center w-full py-2 text-zinc-400 text-xs">
                                💡 Saisissez une vitesse ci-dessus (en km/h, m/s ou min/km) pour voir instantanément le nombre de mètres à parcourir en <strong className="text-white">{activeSeconds}s</strong>.
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </AnimWrapper>
    );
}
