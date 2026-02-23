import React from 'react';
import ContactForm from '@/components/ContactForm';
import HomeFAQ from '@/components/HomeFAQ';
import { supabase } from '@/lib/supabaseClient';

export const revalidate = 3600;

export default async function ContactPage() {
    const { data: content } = await supabase.from('site_content').select('*');
    const siteContent = content || [];

    // Parse global FAQs if they exist
    let globalFaqs = [];
    const faqString = siteContent.find(c => c.key === 'site_faq')?.value;
    if (faqString) {
        try {
            globalFaqs = JSON.parse(faqString);
        } catch (e) {
            console.error("Could not parse site_faq", e);
        }
    }

    let faqJsonLd = null;
    if (globalFaqs.length > 0) {
        faqJsonLd = {
            '@context': 'https://schema.org',
            '@type': 'FAQPage',
            mainEntity: globalFaqs.map(faq => ({
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

            <HomeFAQ faqData={globalFaqs} />
        </>
    );
}
