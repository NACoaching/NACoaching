"use client";
import React, { useState } from 'react';
import { HelpCircle } from 'lucide-react';

/**
 * A reusable tooltip component that shows a help icon and displays text on hover.
 * @param {string} text - The text to display in the tooltip
 */
export default function Tooltip({ text }) {
    const [isVisible, setIsVisible] = useState(false);

    if (!text) return null;

    return (
        <div className="relative inline-block ml-1 group">
            <button
                type="button"
                onMouseEnter={() => setIsVisible(true)}
                onMouseLeave={() => setIsVisible(false)}
                className="text-zinc-600 hover:text-[#FF6B00] transition-colors focus:outline-none"
                aria-label="Aide"
            >
                <HelpCircle size={14} />
            </button>

            {isVisible && (
                <div className="absolute z-50 bottom-full left-1/2 -translate-x-1/2 mb-2 w-64 p-3 bg-zinc-900 text-white text-xs rounded-lg shadow-xl border border-zinc-800 pointer-events-none animate-in fade-in duration-200">
                    <div className="relative">
                        {text}
                        <div className="absolute top-full left-1/2 -translate-x-1/2 -mb-1 w-2 h-2 bg-zinc-900 rotate-45 border-b border-r border-zinc-800" />
                    </div>
                </div>
            )}
        </div>
    );
}
