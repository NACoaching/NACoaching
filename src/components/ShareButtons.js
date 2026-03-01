"use client";
import React from 'react';
import { Facebook, Linkedin, Twitter, MessageCircle } from 'lucide-react';

export default function ShareButtons({ url, title }) {
    const encodedUrl = encodeURIComponent(url);
    const encodedTitle = encodeURIComponent(title);

    const shareLinks = [
        {
            name: 'Facebook',
            icon: Facebook,
            url: `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`,
            color: 'hover:text-blue-600'
        },
        {
            name: 'LinkedIn',
            icon: Linkedin,
            url: `https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}`,
            color: 'hover:text-blue-700'
        },
        {
            name: 'Twitter',
            icon: Twitter,
            url: `https://twitter.com/intent/tweet?url=${encodedUrl}&text=${encodedTitle}`,
            color: 'hover:text-sky-500'
        },
        {
            name: 'WhatsApp',
            icon: MessageCircle,
            url: `https://wa.me/?text=${encodedTitle}%20${encodedUrl}`,
            color: 'hover:text-green-500'
        }
    ];

    return (
        <div className="flex items-center gap-4 mt-8 border-t border-zinc-100 pt-6">
            <span className="text-xs font-bold uppercase tracking-widest text-zinc-600">Partager :</span>
            <div className="flex gap-3">
                {shareLinks.map((link) => (
                    <a
                        key={link.name}
                        href={link.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className={`p-2 bg-zinc-100 rounded-full text-zinc-600 transition ${link.color}`}
                        aria-label={`Partager sur ${link.name}`}
                    >
                        <link.icon size={18} />
                    </a>
                ))}
            </div>
        </div>
    );
}
