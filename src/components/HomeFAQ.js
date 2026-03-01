"use client";
import React, { useState } from 'react';
import { ChevronDown } from 'lucide-react';
import AnimWrapper from '@/components/AnimWrapper';

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
                    className={`text-zinc-600 group-hover:text-[#FF6B00] transition-transform duration-300 flex-shrink-0 ${isOpen ? 'rotate-180' : ''}`}
                />
            </button>
            <div className={`overflow-hidden transition-all duration-300 ${isOpen ? 'max-h-96 pb-5' : 'max-h-0'}`}>
                <p className="text-zinc-700 text-sm leading-relaxed px-1">
                    {item.answer}
                </p>
            </div>
        </div>
    );
}

export default function HomeFAQ({ faqData }) {
    const [openIndex, setOpenIndex] = useState(null);

    // Ensure we have an array to work with
    let faqs = [];
    if (typeof faqData === 'string') {
        try {
            faqs = JSON.parse(faqData);
        } catch (e) {
            console.error("Error parsing FAQ data", e);
        }
    } else if (Array.isArray(faqData)) {
        faqs = faqData;
    }

    if (!faqs || faqs.length === 0) return null;

    return (
        <section className="py-24 bg-white border-t border-zinc-200">
            <div className="max-w-3xl mx-auto px-6">
                <AnimWrapper>
                    <div className="text-center mb-10">
                        <h2 className="text-3xl font-black uppercase mb-3 text-black">Questions <span className="text-[#FF6B00]">Fréquentes</span></h2>
                        <p className="text-zinc-700 text-sm">Les réponses aux questions les plus posées</p>
                    </div>
                    <div className="bg-zinc-50 rounded-lg border border-zinc-200 px-6">
                        {faqs.map((faq, index) => (
                            <FAQItem
                                key={index}
                                item={faq}
                                isOpen={openIndex === index}
                                onToggle={() => setOpenIndex(openIndex === index ? null : index)}
                            />
                        ))}
                    </div>
                </AnimWrapper>
            </div>
        </section>
    );
}
