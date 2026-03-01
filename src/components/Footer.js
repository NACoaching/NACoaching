"use client";
import React, { useState, useEffect } from 'react';
import { Instagram } from 'lucide-react';
import { supabase } from '@/lib/supabaseClient';
import Link from 'next/link';
import Image from 'next/image';

export default function Footer() {
    const [siteContent, setSiteContent] = useState({
        logo_url: '/logo.png',
        footer_text: "Expertise scientifique au service de la performance sportive et de la santé. Basé sur les principes de l'entraînement et l'optimisation des performances (EOPS)."
    });

    useEffect(() => {
        async function fetchContent() {
            const { data } = await supabase.from('site_content').select('*');
            if (data) {
                const newContent = {};
                data.forEach(item => { newContent[item.key] = item.value; });
                setSiteContent(prev => ({ ...prev, ...newContent }));
            }
        }
        fetchContent();
    }, []);

    const handleSubscribe = async (e) => {
        e.preventDefault();
        const email = e.target.email.value;
        if (!email) return;

        const { error } = await supabase.from('subscribers').insert([{ email }]);

        if (error) {
            if (error.code === '23505') alert('Vous êtes déjà inscrit !');
            else alert('Erreur : ' + error.message);
        } else {
            alert('Merci ! Vous êtes bien inscrit à la newsletter.');
            e.target.reset();
        }
    };

    return (
        <footer className="bg-zinc-950 text-white pt-24 pb-12 relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-[#FF6B00]/50 to-transparent"></div>
            <div className="max-w-7xl mx-auto px-6 relative z-10">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-12 lg:gap-16 mb-16">
                    <div>
                        {siteContent.logo_url ? <Image src={siteContent.logo_url} alt="NA Coaching" width={48} height={48} className="mb-6 object-contain" /> : <div className="mb-6 font-bold text-xl">NA COACHING</div>}
                        <p className="text-zinc-400 text-sm leading-relaxed">
                            {siteContent.footer_text || "Expertise scientifique au service de la performance sportive et de la santé."}
                        </p>
                    </div>
                    <div>
                        <h4 className="font-black uppercase tracking-widest mb-6 text-[#FF6B00]">{siteContent.footer_newsletter_title || 'Newsletter'}</h4>
                        <p className="text-xs text-zinc-400 mb-4 italic">{siteContent.footer_newsletter_text || 'Recevez mes analyses scientifiques (Gratuit).'}</p>
                        <form onSubmit={handleSubscribe} className="flex gap-2">
                            <input
                                required
                                type="email"
                                name="email"
                                placeholder="votre@email.com"
                                className="bg-white/5 border border-white/10 rounded-full px-4 py-3 flex-grow text-sm focus:outline-none focus:border-[#FF6B00] transition-colors"
                            />
                            <button type="submit" className="bg-[#FF6B00] text-white font-semibold px-4 py-3 rounded-full uppercase text-xs hover:bg-[#e66000] transition-colors">OK</button>
                        </form>
                    </div>
                    <div>
                        <h4 className="font-black uppercase tracking-widest mb-6 text-[#FF6B00]">Découvrir</h4>
                        <div className="flex flex-col gap-3 text-sm text-zinc-400 font-medium">
                            <Link href="/outils/rpe-1rm" className="hover:text-white transition">Calculateur RPE / 1RM</Link>
                            <Link href="/outils/test-demi-cooper" className="hover:text-white transition">Test Demi-Cooper (VMA)</Link>
                            <Link href="/outils/besoins-caloriques" className="hover:text-white transition">Besoins Caloriques</Link>
                            <Link href="/labo" className="hover:text-white transition">L&apos;Encyclopédie</Link>
                        </div>
                    </div>
                    <div className="flex flex-col md:items-end">
                        <h4 className="font-black uppercase tracking-widest mb-6 text-[#FF6B00]">{siteContent.footer_follow_title || "Réseaux"}</h4>
                        <div className="flex gap-4">
                            <a href="https://instagram.com/na_coaching_" target="_blank" rel="noopener noreferrer" className="text-zinc-400 hover:text-white transition flex items-center gap-2 font-bold text-sm">
                                <Instagram size={20} /> @na_coaching_
                            </a>
                        </div>
                    </div>
                </div>
                <div className="pt-8 border-t border-zinc-900 text-[10px] text-zinc-500 uppercase tracking-widest flex flex-col md:flex-row justify-between items-center gap-4">
                    <span>{siteContent.footer_copyright || '© 2024 NA Coaching - Master EOPS / Licence STAPS'} - {siteContent.footer_sub_copyright || 'Design Scientifique & Terrain'}</span>
                    <div className="flex gap-4">
                        <Link href="/mentions-legales" className="hover:text-[#FF6B00]">Mentions Légales</Link>
                        <Link href="/politique-confidentialite" className="hover:text-[#FF6B00]">Confidentialité</Link>
                        <Link href="/admin" className="hover:text-[#FF6B00]">Admin</Link>
                    </div>
                </div>
            </div>
        </footer>
    );
}
