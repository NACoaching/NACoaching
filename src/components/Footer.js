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
            if (error.code === '23505') alert('Tu es déjà inscrit !');
            else alert('Erreur : ' + error.message);
        } else {
            alert('Merci ! Tu es bien inscrit à la newsletter.');
            e.target.reset();
        }
    };

    return (
        <footer className="bg-black text-white pt-24 pb-12 border-t-8 border-[#FF6B00]">
            <div className="max-w-7xl mx-auto px-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-16 mb-16">
                    <div>
                        {siteContent.logo_url ? <Image src={siteContent.logo_url} alt="NA Coaching" width={48} height={48} className="mb-6 object-contain" /> : <div className="mb-6 font-bold text-xl">NA COACHING</div>}
                        <p className="text-zinc-500 text-sm leading-relaxed">
                            {siteContent.footer_text || "Expertise scientifique au service de la performance sportive et de la santé."}
                        </p>
                    </div>
                    <div>
                        <h4 className="font-black uppercase tracking-widest mb-6 text-[#FF6B00]">{siteContent.footer_newsletter_title || 'Newsletter'}</h4>
                        <p className="text-xs text-zinc-500 mb-4 italic">{siteContent.footer_newsletter_text || 'Recevez mes analyses scientifiques hebdomadaires (Gratuit).'}</p>
                        <form onSubmit={handleSubscribe} className="flex">
                            <input
                                required
                                type="email"
                                name="email"
                                placeholder="ton@email.com"
                                className="bg-zinc-900 border border-zinc-800 p-3 flex-grow text-sm focus:outline-none focus:border-[#FF6B00]"
                            />
                            <button type="submit" className="bg-[#FF6B00] text-black font-black px-4 uppercase text-xs">OK</button>
                        </form>
                    </div>
                    <div className="flex flex-col items-end">
                        <h4 className="font-black uppercase tracking-widest mb-6 text-[#FF6B00]">{siteContent.footer_follow_title || "Suivre l'actu"}</h4>
                        <div className="flex gap-4">
                            <a href="https://instagram.com/na_coaching_" className="hover:text-[#FF6B00] transition flex items-center gap-2 font-bold">
                                <Instagram size={20} /> @na_coaching_
                            </a>
                        </div>
                    </div>
                </div>
                <div className="pt-8 border-t border-zinc-900 text-[10px] text-zinc-600 uppercase tracking-widest flex flex-col md:flex-row justify-between items-center gap-4">
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
