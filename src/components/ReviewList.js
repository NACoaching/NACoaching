"use client";
import React from 'react';
import { Star, User } from 'lucide-react';


export default function ReviewList({ reviews }) {
    if (!reviews || reviews.length === 0) {
        return (
            <div className="text-zinc-500 italic text-center py-8 bg-zinc-50 rounded-lg border border-zinc-100">
                Soyez le premier à donner votre avis !
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {reviews.map((review) => (
                <div key={review.id} className="bg-white p-6 rounded-lg border border-zinc-200 shadow-sm transition hover:shadow-md">
                    <div className="flex items-start justify-between mb-3">
                        <div className="flex items-center gap-2">
                            <div className="w-8 h-8 rounded-full bg-zinc-100 flex items-center justify-center text-zinc-400">
                                <User size={16} />
                            </div>
                            <div>
                                <h4 className="font-bold text-sm">{review.author_name}</h4>
                                <span className="text-xs text-zinc-400 block">
                                    {new Date(review.created_at).toLocaleDateString('fr-FR', {
                                        day: 'numeric',
                                        month: 'long',
                                        year: 'numeric'
                                    })}
                                </span>
                            </div>
                        </div>
                        <div className="flex gap-0.5">
                            {[1, 2, 3, 4, 5].map((star) => (
                                <Star
                                    key={star}
                                    size={14}
                                    fill={review.rating >= star ? "#FF6B00" : "transparent"}
                                    color={review.rating >= star ? "#FF6B00" : "#D1D5DB"}
                                />
                            ))}
                        </div>
                    </div>
                    {review.comment && (
                        <p className="text-zinc-600 text-sm leading-relaxed">
                            {review.comment}
                        </p>
                    )}
                </div>
            ))}
        </div>
    );
}
