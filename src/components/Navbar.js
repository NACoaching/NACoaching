"use client";
import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { Instagram, Menu, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { supabase } from '@/lib/supabaseClient';

export default function Navbar({ initialLogoUrl = '/logo.png' }) {
    const pathname = usePathname();
    const [logoUrl, setLogoUrl] = useState(initialLogoUrl);

    useEffect(() => {
        async function fetchLogo() {
            const { data } = await supabase.from('site_content').select('value').eq('key', 'logo_url').single();
            if (data && data.value !== initialLogoUrl) setLogoUrl(data.value);
        }
        fetchLogo();
    }, [initialLogoUrl]);

    const isActive = (path) => pathname === path;

    const [isOpen, setIsOpen] = useState(false);

    return (
        <nav className="fixed w-full z-50 bg-black/80 backdrop-blur-xl text-white py-4 px-6 border-b border-white/10">
            <div className="max-w-7xl mx-auto flex justify-between items-center">
                <Link href="/" className="text-2xl font-black tracking-tighter cursor-pointer flex items-center gap-2 z-50 relative">
                    {logoUrl ? <Image src={logoUrl} alt="NA Coaching" width={40} height={40} className="object-contain rounded-sm" style={{ mixBlendMode: 'screen', filter: 'contrast(1.5) brightness(1.2)' }} priority /> : <span className="text-xl font-bold">NA</span>}
                    <span className="hidden sm:inline">NA <span className="text-[#FF6B00]">COACHING</span></span>
                </Link>

                {/* DESKTOP MENU */}
                <div className="hidden md:flex space-x-8 font-semibold text-sm uppercase tracking-widest">
                    <Link href="/" className={`hover:text-[#FF6B00] transition ${isActive('/') ? 'text-[#FF6B00]' : ''}`}>Accueil</Link>
                    <Link href="/labo" className={`hover:text-[#FF6B00] transition ${isActive('/labo') || pathname.startsWith('/blog') ? 'text-[#FF6B00]' : ''}`}>Le Labo</Link>
                    <Link href="/outils" className={`hover:text-[#FF6B00] transition ${isActive('/outils') ? 'text-[#FF6B00]' : ''}`}>Outils</Link>
                    <Link href="/boutique" className={`hover:text-[#FF6B00] transition ${isActive('/boutique') ? 'text-[#FF6B00]' : ''}`}>Boutique</Link>
                    <Link href="/coach" className={`hover:text-[#FF6B00] transition ${isActive('/coach') ? 'text-[#FF6B00]' : ''}`}>Le Coach</Link>
                    <Link href="/contact" className={`hover:text-[#FF6B00] transition ${isActive('/contact') ? 'text-[#FF6B00]' : ''}`}>Contact</Link>
                </div>

                <div className="hidden md:block">
                    <a href="https://instagram.com/na_coaching_" target="_blank" className="bg-[#FF6B00] p-2 rounded-full hover:scale-110 transition inline-block">
                        <Instagram size={20} className="text-black" />
                    </a>
                </div>

                {/* MOBILE MENU TOGGLE */}
                <button className="md:hidden z-50 relative text-white" onClick={() => setIsOpen(!isOpen)}>
                    {isOpen ? <X size={32} /> : <Menu size={32} />}
                </button>
            </div>

            {/* MOBILE OVERLAY */}
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: "-100%" }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: "-100%" }}
                        transition={{ duration: 0.4, ease: "easeInOut" }}
                        className="fixed inset-0 bg-black z-40 flex flex-col items-center justify-center space-y-8"
                    >
                        <Link href="/" onClick={() => setIsOpen(false)} className="text-3xl font-black uppercase hover:text-[#FF6B00]">Accueil</Link>
                        <Link href="/labo" onClick={() => setIsOpen(false)} className="text-3xl font-black uppercase hover:text-[#FF6B00]">Le Labo</Link>
                        <Link href="/outils" onClick={() => setIsOpen(false)} className="text-3xl font-black uppercase hover:text-[#FF6B00]">Outils</Link>
                        <Link href="/boutique" onClick={() => setIsOpen(false)} className="text-3xl font-black uppercase hover:text-[#FF6B00]">Boutique</Link>
                        <Link href="/coach" onClick={() => setIsOpen(false)} className="text-3xl font-black uppercase hover:text-[#FF6B00]">Le Coach</Link>
                        <Link href="/contact" onClick={() => setIsOpen(false)} className="text-3xl font-black uppercase hover:text-[#FF6B00]">Contact</Link>

                        <div className="pt-8">
                            <a href="https://instagram.com/na_coaching_" target="_blank" className="bg-[#FF6B00] p-4 rounded-full inline-block">
                                <Instagram size={32} className="text-black" />
                            </a>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </nav>
    );
}
