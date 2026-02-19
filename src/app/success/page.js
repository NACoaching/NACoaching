"use client";
import React, { Suspense } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { CheckCircle, Mail, ArrowRight } from 'lucide-react';
import AnimWrapper from '@/components/AnimWrapper';

function SuccessContent() {
    const searchParams = useSearchParams();
    const sessionId = searchParams.get('session_id');

    return (
        <section className="min-h-screen bg-zinc-50 flex items-center justify-center p-6 text-center">
            <div className="max-w-md w-full">
                <AnimWrapper>
                    <div className="bg-white p-8 rounded-lg border border-zinc-200 shadow-sm relative overflow-hidden">
                        <div className="absolute top-0 left-0 w-full h-1 bg-[#FF6B00]"></div>

                        <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6 text-green-600">
                            <CheckCircle size={40} strokeWidth={3} />
                        </div>

                        <h1 className="text-3xl font-black uppercase mb-4 text-zinc-900">Merci !</h1>
                        <p className="text-zinc-800 mb-8 font-medium">Votre commande a bien été validée.</p>

                        <div className="bg-zinc-50 p-4 rounded-lg border border-zinc-100 mb-8 text-left flex items-start gap-4">
                            <div className="bg-white p-2 rounded shadow-sm text-[#FF6B00]">
                                <Mail size={24} />
                            </div>
                            <div>
                                <h3 className="font-bold text-sm uppercase mb-1 text-zinc-900">Vérifiez vos emails (et spams !)</h3>
                                <p className="text-xs text-zinc-700 font-medium">
                                    Nous vous avons envoyé un lien de téléchargement sécurisé. <br />
                                    <strong>Attention : ce lien n'est valable que 7 jours.</strong><br />
                                    Si vous ne recevez rien, pensez à vérifier vos courriers indésirables.
                                </p>
                            </div>
                        </div>

                        <div className="space-y-3">
                            <Link href="/boutique" className="block w-full bg-black text-white px-6 py-3 rounded font-black uppercase hover:bg-[#FF6B00] hover:text-black transition">
                                Retour à la boutique
                            </Link>
                            <Link href="/" className="block w-full text-zinc-400 text-xs font-bold uppercase hover:text-zinc-900 transition flex items-center justify-center gap-1">
                                Retour à l'accueil <ArrowRight size={12} />
                            </Link>
                        </div>

                        {sessionId && (
                            <p className="mt-8 text-[10px] text-zinc-300 font-mono">ID de transaction : {sessionId.slice(0, 10)}...</p>
                        )}
                    </div>
                </AnimWrapper>
            </div>
        </section>
    );
}

export default function SuccessPage() {
    return (
        <Suspense fallback={<div className="min-h-screen flex items-center justify-center">Chargement...</div>}>
            <SuccessContent />
        </Suspense>
    );
}
