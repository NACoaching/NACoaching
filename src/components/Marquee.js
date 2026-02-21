"use client";
import React from 'react';

export default function Marquee({ items = [], speed = 20, className = "" }) {
    return (
        <div className={`overflow-hidden whitespace-nowrap bg-black py-4 border-y border-zinc-800 ${className}`}>
            <div className="inline-block animate-marquee">
                {items.map((item, i) => (
                    <span key={i} className="inline-block px-8 text-2xl md:text-4xl font-black uppercase tracking-tighter text-white/20 hover:text-[#FF6B00] transition-colors cursor-default select-none">
                        {item}
                        <span className="ml-8 text-[#FF6B00]">•</span>
                    </span>
                ))}
                {items.map((item, i) => (
                    <span key={`dup-${i}`} className="inline-block px-8 text-2xl md:text-4xl font-black uppercase tracking-tighter text-white/20 hover:text-[#FF6B00] transition-colors cursor-default select-none">
                        {item}
                        <span className="ml-8 text-[#FF6B00]">•</span>
                    </span>
                ))}
            </div>
            {/* Inline CSS for the simple animation if not in globals.css */}
            <style jsx>{`
                .animate-marquee {
                    display: inline-block;
                    animation: marquee ${speed}s linear infinite;
                }
                @keyframes marquee {
                    from { transform: translateX(0); }
                    to { transform: translateX(-50%); }
                }
            `}</style>
        </div>
    );
}
