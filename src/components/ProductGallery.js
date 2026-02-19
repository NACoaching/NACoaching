"use client";
import React, { useState } from 'react';
import Image from 'next/image';
import { ShoppingBag } from 'lucide-react';
import AnimWrapper from '@/components/AnimWrapper';

export default function ProductGallery({ images, title }) {
    const [selectedImage, setSelectedImage] = useState(images && images.length > 0 ? images[0] : null);

    if (!images || images.length === 0) {
        return (
            <div className="relative aspect-square bg-zinc-200 rounded-lg overflow-hidden mb-8 shadow-sm border border-zinc-200 flex items-center justify-center text-zinc-300">
                <ShoppingBag size={64} />
            </div>
        );
    }

    return (
        <div className="mb-8">
            {/* MAIN IMAGE */}
            <div className="relative aspect-square bg-zinc-200 rounded-lg overflow-hidden mb-4 shadow-sm border border-zinc-200">
                <Image
                    src={selectedImage}
                    alt={title}
                    fill
                    className="object-cover"
                    priority
                    sizes="(max-width: 768px) 100vw, 50vw"
                />
            </div>

            {/* THUMBNAILS */}
            {images.length > 1 && (
                <div className="flex gap-4 overflow-x-auto pb-2 scrollbar-hide">
                    {images.map((img, index) => (
                        <button
                            key={index}
                            onClick={() => setSelectedImage(img)}
                            className={`relative w-20 h-20 shrink-0 rounded-lg overflow-hidden border-2 transition ${selectedImage === img ? 'border-[#FF6B00]' : 'border-transparent hover:border-zinc-300'}`}
                        >
                            <Image
                                src={img}
                                alt={`${title} view ${index + 1}`}
                                fill
                                className="object-cover"
                                sizes="80px"
                            />
                        </button>
                    ))}
                </div>
            )}
        </div>
    );
}
