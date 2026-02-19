import { supabase } from '@/lib/supabaseClient';
import { ShoppingBag, ChevronRight } from 'lucide-react';
import Link from 'next/link';

export const metadata = {
    title: 'La Boutique - NA Coaching',
    description: 'Programmes de coaching et ebooks basés sur la science.',
};

export const revalidate = 0;

import AnimWrapper from "@/components/AnimWrapper";

export default async function BoutiquePage() {
    const { data: products } = await supabase.from('products').select('*').order('created_at', { ascending: false });
    const { data: content } = await supabase.from('site_content').select('*');

    const siteContent = {};
    if (content) {
        content.forEach(item => { siteContent[item.key] = item.value; });
    }

    return (
        <section className="pt-32 pb-20 bg-zinc-950 text-white min-h-screen">
            <div className="max-w-7xl mx-auto px-6">
                <AnimWrapper>
                    <div className="text-center mb-16">
                        <h2 className="text-5xl font-black uppercase mb-4 text-[#FF6B00]">{siteContent.shop_title || 'La Boutique'}</h2>
                        <p className="text-zinc-400 max-w-xl mx-auto italic">
                            {siteContent.shop_subtitle || 'Programmes basés sur la science.'}
                        </p>
                    </div>
                </AnimWrapper>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto">
                    {products && products.map((product, index) => (
                        <AnimWrapper key={product.id} delay={index * 0.1} className="h-full">
                            <div className="bg-zinc-900 p-10 border border-zinc-800 hover:border-[#FF6B00] transition-all group flex flex-col h-full">
                                <div className="flex justify-between items-start mb-6">
                                    <ShoppingBag className="text-[#FF6B00]" size={40} />
                                    <span className="text-3xl font-black italic">{product.price}</span>
                                </div>
                                <h3 className="text-3xl font-black uppercase mb-4">{product.title}</h3>
                                <p className="text-zinc-400 mb-8 flex-grow">{product.description}</p>
                                <ul className="space-y-3 mb-10">
                                    {product.features?.map((f, i) => (
                                        <li key={i} className="flex items-center gap-3 text-sm font-bold">
                                            <ChevronRight size={16} className="text-[#FF6B00]" /> {f}
                                        </li>
                                    ))}
                                </ul>
                                <Link
                                    href={`/boutique/${product.id}`}
                                    className="bg-[#FF6B00] text-black font-black py-4 rounded-sm uppercase text-center tracking-widest hover:bg-white transition mt-auto block"
                                >
                                    En savoir plus
                                </Link>
                            </div>
                        </AnimWrapper>
                    ))}
                </div>
            </div>
        </section>
    );
}
