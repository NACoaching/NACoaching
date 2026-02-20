"use client";
import React, { useState } from 'react';
import { Mail, Loader2, CheckCircle, AlertTriangle, ChevronDown } from 'lucide-react';

const faqItems = [
    {
        question: "Comment fonctionne le coaching en ligne ?",
        answer: "Le coaching en ligne se fait à distance. Après un échange initial pour comprendre vos objectifs, je vous envoie un programme personnalisé adapté à votre niveau et à votre matériel. Un suivi régulier par message permet d'ajuster le plan en fonction de vos retours et de votre progression."
    },
    {
        question: "Quel est le délai de livraison des programmes ?",
        answer: "Les programmes digitaux sont livrés instantanément par email après l'achat. Vous recevez un lien de téléchargement valide pendant 7 jours. Pour un coaching personnalisé, comptez 48 à 72h après notre premier échange pour recevoir votre programme sur-mesure."
    },
    {
        question: "Les programmes sont-ils adaptés aux débutants ?",
        answer: "Oui, chaque programme est conçu pour s'adapter à votre niveau. Que vous soyez débutant ou athlète confirmé, les exercices, volumes et intensités sont ajustés. Les programmes incluent des descriptions détaillées des mouvements pour garantir une bonne exécution."
    },
    {
        question: "Puis-je obtenir un remboursement ?",
        answer: "Les programmes digitaux étant des produits dématérialisés, ils ne sont pas remboursables une fois téléchargés. Si vous rencontrez un problème technique pour accéder à votre programme, contactez-moi et je trouverai une solution rapidement."
    },
    {
        question: "Comment utiliser les outils gratuits du site ?",
        answer: "Tous les outils (calculateur 1RM, besoins caloriques, zones de fréquence cardiaque, VMA/VO2max, convertisseur de vitesse) sont accessibles gratuitement depuis la section Outils. Il suffit d'entrer vos données et les résultats s'affichent instantanément. Vous pouvez même partager vos résultats."
    },
    {
        question: "Quel type de coaching proposez-vous ?",
        answer: "Je propose du coaching en musculation, en course à pied et en préparation physique hybride. Chaque accompagnement est basé sur des données scientifiques et une approche individualisée. L'objectif est de vous faire progresser durablement avec une méthode structurée."
    },
    {
        question: "Comment vous contacter pour une question ?",
        answer: "Vous pouvez utiliser le formulaire de contact ci-dessus ou m'envoyer un message directement sur Instagram @na_coaching_. Je réponds généralement sous 24 à 48h."
    }
];

function FAQItem({ item, isOpen, onToggle }) {
    return (
        <div className="border-b border-zinc-200 last:border-b-0">
            <button
                onClick={onToggle}
                className="w-full flex justify-between items-center py-5 px-1 text-left group"
            >
                <span className="font-bold text-sm uppercase tracking-wide text-zinc-800 group-hover:text-[#FF6B00] transition pr-4">
                    {item.question}
                </span>
                <ChevronDown
                    size={20}
                    className={`text-zinc-400 group-hover:text-[#FF6B00] transition-transform duration-300 flex-shrink-0 ${isOpen ? 'rotate-180' : ''}`}
                />
            </button>
            <div
                className={`overflow-hidden transition-all duration-300 ${isOpen ? 'max-h-96 pb-5' : 'max-h-0'}`}
            >
                <p className="text-zinc-500 text-sm leading-relaxed px-1">
                    {item.answer}
                </p>
            </div>
        </div>
    );
}

export default function ContactPage() {
    const [status, setStatus] = useState('idle'); // idle, loading, success, error
    const [openFAQ, setOpenFAQ] = useState(null);

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

    // JSON-LD structured data for FAQ (SEO)
    const faqJsonLd = {
        "@context": "https://schema.org",
        "@type": "FAQPage",
        "mainEntity": faqItems.map(item => ({
            "@type": "Question",
            "name": item.question,
            "acceptedAnswer": {
                "@type": "Answer",
                "text": item.answer
            }
        }))
    };

    return (
        <>
            {/* FAQ JSON-LD for SEO */}
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
            />

            <section className="py-20 min-h-screen bg-white">
                <div className="max-w-3xl mx-auto px-6">
                    <div className="text-center mb-16">
                        <h2 className="text-5xl font-black uppercase mb-4 text-black">Me <span className="text-[#FF6B00]">Contacter</span></h2>
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

                    {/* FAQ Section */}
                    <div className="mt-20">
                        <div className="text-center mb-10">
                            <h2 className="text-3xl font-black uppercase mb-3 text-black">Questions <span className="text-[#FF6B00]">Fréquentes</span></h2>
                            <p className="text-zinc-500 text-sm">Les réponses aux questions les plus posées</p>
                        </div>

                        <div className="bg-zinc-50 rounded-lg border border-zinc-200 px-6">
                            {faqItems.map((item, index) => (
                                <FAQItem
                                    key={index}
                                    item={item}
                                    isOpen={openFAQ === index}
                                    onToggle={() => setOpenFAQ(openFAQ === index ? null : index)}
                                />
                            ))}
                        </div>
                    </div>
                </div>
            </section>
        </>
    );
}
