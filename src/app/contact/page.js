"use client";
import React, { useState } from 'react';
import { Mail, Loader2, CheckCircle, AlertTriangle } from 'lucide-react';

export default function ContactPage() {
    const [status, setStatus] = useState('idle'); // idle, loading, success, error

    const handleSubmit = async (e) => {
        e.preventDefault();
        setStatus('loading');

        const formData = new FormData(e.target);
        const data = {
            name: formData.get('name'),
            email: formData.get('email'),
            phone: formData.get('phone'),
            subject: formData.get('subject'),
            message: formData.get('message')
        };

        try {
            // Send via API (handles both email sending and DB saving)
            const res = await fetch('/api/send', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data),
            });

            if (!res.ok) throw new Error("Erreur lors de l'envoi de l'email");

            setStatus('success');
            e.target.reset();
        } catch (error) {
            console.error(error);
            setStatus('error');
        }
    };

    return (
        <section className="py-20 min-h-screen bg-white">
            <div className="max-w-3xl mx-auto px-6">
                <div className="text-center mb-16">
                    <h2 className="text-5xl font-black uppercase mb-4">Me <span className="text-[#FF6B00]">Contacter</span></h2>
                    <p className="text-zinc-500 max-w-xl mx-auto">
                        Une question sur un programme ou une demande de coaching ? Remplissez le formulaire ci-dessous.
                    </p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6 bg-zinc-50 p-8 rounded-lg border border-zinc-200">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label className="block text-xs font-bold uppercase text-zinc-500 mb-2">Nom</label>
                            <input required name="name" className="w-full border p-3 rounded text-sm focus:border-[#FF6B00] outline-none text-black" placeholder="Votre nom" />
                        </div>
                        <div>
                            <label className="block text-xs font-bold uppercase text-zinc-500 mb-2">Email</label>
                            <input required type="email" name="email" className="w-full border p-3 rounded text-sm focus:border-[#FF6B00] outline-none text-black" placeholder="votre@email.com" />
                        </div>
                    </div>
                    <div>
                        <label className="block text-xs font-bold uppercase text-zinc-500 mb-2">Téléphone (Optionnel)</label>
                        <input name="phone" type="tel" className="w-full border p-3 rounded text-sm focus:border-[#FF6B00] outline-none text-black" placeholder="06 12 34 56 78" />
                    </div>
                    <div>
                        <label className="block text-xs font-bold uppercase text-zinc-500 mb-2">Sujet</label>
                        <input required name="subject" className="w-full border p-3 rounded text-sm focus:border-[#FF6B00] outline-none text-black" placeholder="Renseignement coaching,..." />
                    </div>
                    <div>
                        <label className="block text-xs font-bold uppercase text-zinc-500 mb-2">Message</label>
                        <textarea required name="message" className="w-full border p-3 rounded text-sm h-40 focus:border-[#FF6B00] outline-none text-black" placeholder="Comment puis-je vous aider ?" />
                    </div>

                    <button
                        type="submit"
                        disabled={status === 'loading' || status === 'success'}
                        className={`w-full font-black py-4 rounded uppercase transition flex justify-center items-center gap-2 ${status === 'success' ? 'bg-green-500 text-white' :
                            status === 'error' ? 'bg-red-500 text-white' :
                                'bg-black text-white hover:bg-[#FF6B00] hover:text-black'
                            }`}
                    >
                        {status === 'loading' && <Loader2 className="animate-spin" />}
                        {status === 'success' && <><CheckCircle /> Message Envoyé !</>}
                        {status === 'error' && <><AlertTriangle /> Erreur, réessayez.</>}
                        {status === 'idle' && <>Envoyer le message <Mail size={18} /></>}
                    </button>
                    {status === 'success' && <p className="text-center text-green-600 text-sm font-bold mt-2">Merci ! Je vous répondrai dès que possible.</p>}
                </form>
            </div>
        </section>
    );
}
