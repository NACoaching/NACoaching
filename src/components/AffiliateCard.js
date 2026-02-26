"use client";
import React from 'react';
import { ExternalLink, ShoppingCart, Info } from 'lucide-react';
import { motion } from 'framer-motion';

const AffiliateCard = ({
    title,
    price,
    description,
    imageUrl,
    affiliateUrl,
    badge = "Recommandation Coach",
    ctaText = "Voir sur Amazon"
}) => {
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            whileHover={{ y: -5 }}
            transition={{ duration: 0.3 }}
            className="bg-white border border-zinc-200 rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 group max-w-sm mx-auto w-full"
        >
            <div className="relative h-48 bg-zinc-50 flex items-center justify-center p-6 overflow-hidden">
                {imageUrl ? (
                    <img
                        src={imageUrl}
                        alt={title}
                        className="h-full object-contain group-hover:scale-110 transition-transform duration-500"
                    />
                ) : (
                    <div className="bg-zinc-200 w-full h-full rounded-lg flex items-center justify-center text-zinc-400">
                        <ShoppingCart size={48} />
                    </div>
                )}
                <div className="absolute top-4 left-4 bg-[#FF6B00] text-black text-[10px] font-black uppercase px-2 py-1 rounded tracking-tighter shadow-lg">
                    {badge}
                </div>
            </div>

            <div className="p-6">
                <div className="flex justify-between items-start mb-2">
                    <h3 className="text-lg font-black uppercase text-zinc-900 leading-tight">
                        {title}
                    </h3>
                    {price && (
                        <span className="text-[#FF6B00] font-black text-xl leading-none">
                            {price}
                        </span>
                    )}
                </div>

                <p className="text-zinc-600 text-sm mb-6 line-clamp-2">
                    {description}
                </p>

                <a
                    href={affiliateUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full flex items-center justify-center gap-2 bg-black text-white text-xs font-black uppercase py-4 rounded-xl hover:bg-[#FF6B00] hover:text-black transition-colors duration-300 shadow-lg shadow-black/5"
                >
                    {ctaText}
                    <ExternalLink size={14} />
                </a>

                <div className="mt-4 flex items-center gap-1.5 justify-center text-[10px] text-zinc-400 font-medium">
                    <Info size={10} />
                    <span>Lien affilié — Soutenez le blog sans surcoût</span>
                </div>
            </div>
        </motion.div>
    );
};

export default AffiliateCard;
