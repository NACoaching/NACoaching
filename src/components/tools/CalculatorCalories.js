"use client";
import React, { useState } from 'react';
import { Flame, Activity, Info } from 'lucide-react';
import AnimWrapper from "@/components/AnimWrapper";
import ShareResults from "@/components/tools/ShareResults";

export default function CalculatorCalories() {
    const [gender, setGender] = useState('male');
    const [weight, setWeight] = useState('');
    const [height, setHeight] = useState('');
    const [age, setAge] = useState('');
    const [activity, setActivity] = useState('1.2');
    const [result, setResult] = useState(null);

    const calculateCalories = (e) => {
        e.preventDefault();
        // Mifflin-St Jeor Equation
        let bmr = (10 * parseFloat(weight)) + (6.25 * parseFloat(height)) - (5 * parseFloat(age));

        if (gender === 'male') {
            bmr += 5;
        } else {
            bmr -= 161;
        }

        const tdee = Math.round(bmr * parseFloat(activity));
        setResult(tdee);
    };

    return (
        <AnimWrapper delay={0.1}>
            <div className="bg-zinc-50 text-zinc-900 border border-zinc-200 p-6 rounded-lg h-full flex flex-col">
                <div className="flex items-center gap-3 mb-4">
                    <div className="bg-[#FF6B00] p-2 rounded text-white">
                        <Flame size={24} />
                    </div>
                    <h3 className="text-xl font-black uppercase">Calculateur Calories</h3>
                </div>

                <p className="text-zinc-600 mb-6 text-sm">
                    Estime tes besoins énergétiques journaliers selon ton objectif.
                </p>

                <form onSubmit={calculateCalories} className="space-y-4 mb-6">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-xs font-bold uppercase text-zinc-500 mb-1">Sexe</label>
                            <select
                                value={gender}
                                onChange={(e) => setGender(e.target.value)}
                                className="w-full border p-2 rounded bg-white text-sm"
                            >
                                <option value="male">Homme</option>
                                <option value="female">Femme</option>
                            </select>
                        </div>
                        <div>
                            <label className="block text-xs font-bold uppercase text-zinc-500 mb-1">Âge (ans)</label>
                            <input
                                type="number"
                                value={age}
                                onChange={(e) => setAge(e.target.value)}
                                className="w-full border p-2 rounded text-sm"
                                required
                            />
                        </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-xs font-bold uppercase text-zinc-500 mb-1">Poids (kg)</label>
                            <input
                                type="number"
                                value={weight}
                                onChange={(e) => setWeight(e.target.value)}
                                className="w-full border p-2 rounded text-sm"
                                required
                            />
                        </div>
                        <div>
                            <label className="block text-xs font-bold uppercase text-zinc-500 mb-1">Taille (cm)</label>
                            <input
                                type="number"
                                value={height}
                                onChange={(e) => setHeight(e.target.value)}
                                className="w-full border p-2 rounded text-sm"
                                required
                            />
                        </div>
                    </div>
                    <div>
                        <label className="block text-xs font-bold uppercase text-zinc-500 mb-1">Activité</label>
                        <select
                            value={activity}
                            onChange={(e) => setActivity(e.target.value)}
                            className="w-full border p-3 rounded text-sm focus:border-[#FF6B00] outline-none bg-white"
                        >
                            <option value="1.2">Sédentaire (Bureau, peu de sport)</option>
                            <option value="1.375">Légèrement actif (1-3 fois/semaine)</option>
                            <option value="1.55">Modérément actif (3-5 fois/semaine)</option>
                            <option value="1.725">Très actif (6-7 fois/semaine)</option>
                            <option value="1.9">Extrêmement actif (Physique + Sport)</option>
                        </select>
                    </div>

                    <button type="submit" className="w-full bg-black text-white font-black py-3 rounded uppercase hover:bg-[#FF6B00] hover:text-black transition">
                        Calculer
                    </button>
                </form>

                {result && (
                    <div className="mt-auto bg-white border border-zinc-200 p-4 rounded-lg">
                        <div className="text-center mb-4">
                            <span className="block text-xs font-bold uppercase text-zinc-400">Maintenance (TDEE)</span>
                            <span className="text-4xl font-black text-[#FF6B00]">{result} kcal</span>
                        </div>
                        <div className="flex justify-between text-center gap-2">
                            <div className="bg-zinc-50 p-2 rounded flex-1">
                                <span className="block text-[10px] font-bold uppercase text-zinc-400">Sèche</span>
                                <span className="font-bold text-zinc-700">{result - 300}</span>
                            </div>
                            <div className="bg-zinc-100 p-3 rounded text-center">
                                <span className="block text-[10px] font-bold uppercase text-zinc-500">Prise de Masse</span>
                                <span className="text-lg font-black text-zinc-800">{Math.round(result * 1.15)}</span>
                                <span className="text-[10px] text-zinc-400 block">kcal/jour</span>
                            </div>
                        </div>
                        <ShareResults title="Mes Besoins" value={result + "kcal"} subtitle="Maintien Quotidien" />
                    </div>
                )}
            </div>

        </AnimWrapper>
    );
}
