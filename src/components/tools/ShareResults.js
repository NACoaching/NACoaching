"use client";
import React, { useRef, useState, useEffect } from 'react';
import { Camera, Download, Share2 } from 'lucide-react';
import html2canvas from 'html2canvas';
import { supabase } from '@/lib/supabaseClient';

export default function ShareResults({ title, value, subtitle, zones }) {
    const printRef = useRef(null);
    const [isGenerating, setIsGenerating] = useState(false);
    const [logoUrl, setLogoUrl] = useState(null);

    useEffect(() => {
        async function fetchLogo() {
            const { data } = await supabase.from('site_content').select('value').eq('key', 'logo_url').single();
            if (data?.value) setLogoUrl(data.value);
        }
        fetchLogo();
    }, []);

    const handleDownload = async () => {
        if (!printRef.current) return;
        setIsGenerating(true);

        try {
            const canvas = await html2canvas(printRef.current, {
                useCORS: true,
                scale: 3, // Higher resolution for sharper text/logo
                backgroundColor: "#000000",
            });

            const image = canvas.toDataURL("image/png", 1.0);
            const link = document.createElement("a");
            link.href = image;
            link.download = `NA-Coaching-${title.replace(/\s+/g, '-')}.png`;
            link.click();
        } catch (err) {
            console.error("Error generating image:", err);
            alert("Erreur lors de la génération de l'image.");
        } finally {
            setIsGenerating(false);
        }
    };

    return (
        <div className="mt-6 border-t border-zinc-100 pt-6">
            <button
                onClick={handleDownload}
                disabled={isGenerating}
                className="w-full flex items-center justify-center gap-2 text-xs font-bold uppercase tracking-widest text-[#FF6B00] hover:text-black transition-colors"
            >
                {isGenerating ? "Génération..." : <>Partager ma perf <Camera size={16} /></>}
            </button>

            {/* Hidden Capture Area - Positioned absolute and properly sized */}
            <div style={{ position: "absolute", top: "-9999px", left: "-9999px" }}>
                <div
                    ref={printRef}
                    className="w-[1080px] h-[1080px] flex flex-col items-center justify-center relative overflow-hidden"
                    style={{
                        fontFamily: 'sans-serif',
                        backgroundColor: '#000000',
                        color: '#FFFFFF'
                    }}
                >
                    {/* Background Accents with Hex colors */}
                    <div style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '16px', backgroundColor: '#FF6B00' }}></div>
                    <div style={{ position: 'absolute', bottom: 0, left: 0, width: '100%', height: '16px', backgroundColor: '#FF6B00' }}></div>

                    {/* Blurs with opacity */}
                    <div style={{
                        position: 'absolute', top: '-160px', right: '-160px', width: '384px', height: '384px',
                        backgroundColor: '#FF6B00', borderRadius: '9999px', filter: 'blur(150px)', opacity: 0.2
                    }}></div>
                    <div style={{
                        position: 'absolute', bottom: '-160px', left: '-160px', width: '384px', height: '384px',
                        backgroundColor: '#FF6B00', borderRadius: '9999px', filter: 'blur(150px)', opacity: 0.2
                    }}></div>

                    {/* Content */}
                    <div className="z-10 text-center flex flex-col items-center gap-12 p-16 w-full h-full justify-center">

                        {/* Header / Logo */}
                        <div className="flex items-center gap-4 mb-10">
                            {logoUrl ? (
                                /* eslint-disable-next-line @next/next/no-img-element */
                                <img src={logoUrl} alt="Logo" className="h-40 w-auto object-contain" crossOrigin="anonymous" />
                            ) : (
                                <div style={{ fontSize: '2.25rem', fontWeight: 900, letterSpacing: '-0.05em', color: '#FFFFFF' }}>
                                    NA <span style={{ color: '#FF6B00' }}>COACHING</span>
                                </div>
                            )}
                        </div>

                        {/* Main Result */}
                        <div className="w-full">
                            <h2 style={{ fontSize: '2.25rem', fontWeight: 700, textTransform: 'uppercase', color: '#71717a', marginBottom: '1.5rem', letterSpacing: '0.1em' }}>
                                {title}
                            </h2>

                            {/* Conditional Rendering: Zones List or Single Value */}
                            {zones ? (
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', width: '100%', maxWidth: '800px', margin: '0 auto' }}>
                                    {zones.map((zone, i) => (
                                        <div key={i} style={{
                                            display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                                            borderBottom: '1px solid #333', paddingBottom: '0.5rem', marginBottom: '0.5rem'
                                        }}>
                                            <div style={{ textAlign: 'left' }}>
                                                <span style={{ display: 'block', fontSize: '1.5rem', fontWeight: 900, color: '#FFFFFF', textTransform: 'uppercase' }}>{zone.name}</span>
                                                <span style={{ display: 'block', fontSize: '1rem', color: '#71717a' }}>{zone.range} FC Max</span>
                                            </div>
                                            <div style={{ fontSize: '2.5rem', fontWeight: 900, color: '#FF6B00' }}>
                                                {zone.min}-{zone.max} <span style={{ fontSize: '1rem', color: '#71717a' }}>BPM</span>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <>
                                    <div style={{
                                        fontSize: '12rem', fontWeight: 900, color: '#FFFFFF', lineHeight: 1, letterSpacing: '-0.05em', marginBottom: '3rem',
                                        textShadow: "0 0 40px rgba(255, 107, 0, 0.3)"
                                    }}>
                                        {value}
                                    </div>
                                    <p style={{ fontSize: '3rem', fontWeight: 500, color: '#FF6B00', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                                        {subtitle}
                                    </p>
                                </>
                            )}
                        </div>

                        {/* Footer */}
                        <div style={{
                            marginTop: 'auto', paddingTop: '3rem', borderTop: '1px solid #18181b', width: '100%',
                            display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end',
                            color: '#71717a', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em', fontSize: '1.5rem'
                        }}>
                            <span>Performance</span>
                            <span>Science & Terrain</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
