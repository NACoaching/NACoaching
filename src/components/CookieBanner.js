"use client";
import React, { useState, useEffect } from 'react';
import { Cookie, X } from 'lucide-react';
import AnimWrapper from '@/components/AnimWrapper';

export default function CookieBanner() {
    const [showBanner, setShowBanner] = useState(false);

    useEffect(() => {
        // Check if user has already made a choice
        const consent = localStorage.getItem('cookie_consent');
        if (!consent) {
            // Small delay to not be aggressive
            const timer = setTimeout(() => setShowBanner(true), 1500);
            return () => clearTimeout(timer);
        }
    }, []);

    const handleAccept = () => {
        localStorage.setItem('cookie_consent', 'accepted');
        setShowBanner(false);
    };

    const handleRefuse = () => {
        localStorage.setItem('cookie_consent', 'refused');
        setShowBanner(false);
    };

    if (!showBanner) return null;

    return (
        <div className="fixed bottom-0 left-0 w-full z-50 p-4 font-sans">
            <div className="max-w-4xl mx-auto bg-black text-white p-6 rounded-lg shadow-2xl border border-zinc-800 flex flex-col md:flex-row items-center justify-between gap-6">

                <div className="flex items-start gap-4">
                    <div className="p-3 bg-zinc-900 rounded-full text-[#FF6B00]">
                        <Cookie size={24} />
                    </div>
                    <div>
                        <h3 className="font-black uppercase text-[#FF6B00] mb-1">Un cookie pour la perf ?</h3>
                        <p className="text-sm text-zinc-400 leading-relaxed">
                            On utilise des cookies pour analyser le trafic et améliorer ton expérience sur le site.
                            Promis, c'est moins calorique qu'un vrai cookie. 🍪
                        </p>
                    </div>
                </div>

                <div className="flex gap-3 w-full md:w-auto shrink-0">
                    <button
                        onClick={handleRefuse}
                        className="flex-1 md:flex-none border border-zinc-700 text-zinc-400 px-4 py-3 rounded font-bold uppercase text-xs hover:border-white hover:text-white transition whitespace-nowrap"
                    >
                        Continuer sans
                    </button>
                    <button
                        onClick={handleAccept}
                        className="flex-1 md:flex-none bg-[#FF6B00] text-black px-6 py-3 rounded font-black uppercase text-xs hover:bg-white transition whitespace-nowrap"
                    >
                        Accepter
                    </button>
                </div>

            </div>
        </div>
    );
}
