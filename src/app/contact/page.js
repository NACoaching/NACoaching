import React from 'react';
import ContactForm from '@/components/ContactForm';
import HomeFAQ from '@/components/HomeFAQ';
import { supabase } from '@/lib/supabaseClient';

export const revalidate = 3600;

export default async function ContactPage() {
    const { data: content } = await supabase.from('site_content').select('*');
    const siteContent = content || [];

    const DEFAULT_CONTACT_FAQS = [
        { question: "Comment fonctionne le coaching en ligne ?", answer: "Le coaching en ligne se fait à distance. Après un échange initial pour comprendre vos objectifs, je vous envoie un programme personnalisé adapté à votre niveau et à votre matériel. Un suivi régulier par message permet d'ajuster le plan en fonction de vos retours et de votre progression." },
        { question: "Quel est le délai de livraison des programmes ?", answer: "Les programmes digitaux sont livrés instantanément par email après l'achat. Vous recevez un lien de téléchargement valide pendant 7 jours. Pour un coaching personnalisé, comptez 48 à 72h après notre premier échange pour recevoir votre programme sur-mesure." },
        { question: "Les programmes sont-ils adaptés aux débutants ?", answer: "Oui, chaque programme est conçu pour s'adapter à votre niveau. Que vous soyez débutant ou athlète confirmé, les exercices, volumes et intensités sont ajustés. Les programmes incluent des descriptions détaillées des mouvements pour garantir une bonne exécution." },
        { question: "Puis-je obtenir un remboursement ?", answer: "Les programmes digitaux étant des produits dématérialisés, ils ne sont pas remboursables une fois téléchargés. Si vous rencontrez un problème technique pour accéder à votre programme, contactez-moi et je trouverai une solution rapidement." },
        { question: "Comment utiliser les outils gratuits du site ?", answer: "Tous les outils (calculateur 1RM, besoins caloriques, zones de fréquence cardiaque, VMA/VO2max, convertisseur de vitesse) sont accessibles gratuitement depuis la section Outils. Il suffit d'entrer vos données et les résultats s'affichent instantanément. Vous pouvez même partager vos résultats." },
        { question: "Quel type de coaching proposez-vous ?", answer: "Je propose du coaching en musculation, en course à pied et en préparation physique hybride. Chaque accompagnement est basé sur des données scientifiques et une approche individualisée. L'objectif est de vous faire progresser durablement avec une méthode structurée." },
        { question: "Comment vous contacter pour une question ?", answer: "Vous pouvez utiliser le formulaire de contact ci-dessus ou m'envoyer un message directement sur Instagram @na_coaching_. Je réponds généralement sous 24 à 48h." }
    ];

    // Parse contact FAQs if they exist
    let contactFaqs = DEFAULT_CONTACT_FAQS;
    const faqString = siteContent.find(c => c.key === 'contact_faq')?.value;
    if (faqString && faqString !== '[]') {
        try {
            contactFaqs = JSON.parse(faqString);
        } catch (e) {
            console.error("Could not parse contact_faq", e);
        }
    }

    let faqJsonLd = null;
    if (contactFaqs.length > 0) {
        faqJsonLd = {
            '@context': 'https://schema.org',
            '@type': 'FAQPage',
            mainEntity: contactFaqs.map(faq => ({
                '@type': 'Question',
                name: faq.question,
                acceptedAnswer: {
                    '@type': 'Answer',
                    text: faq.answer
                }
            }))
        };
    }

    return (
        <>
            {faqJsonLd && (
                <script
                    type="application/ld+json"
                    dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
                />
            )}

            <section className="py-32 bg-white">
                <div className="max-w-3xl mx-auto px-6">
                    <div className="text-center mb-16">
                        <h2 className="text-5xl font-black uppercase mb-4 text-black">Me <span className="text-[#FF6B00]">Contacter</span></h2>
                        <p className="text-zinc-500 max-w-xl mx-auto">
                            Une question sur un programme ou une demande de coaching ? Remplissez le formulaire ci-dessous.
                        </p>
                    </div>

                    <ContactForm />
                </div>
            </section>

            <HomeFAQ faqData={contactFaqs} />
        </>
    );
}
