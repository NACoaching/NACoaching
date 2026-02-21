"use client";
import React, { useState } from 'react';
import { Star, Loader2, Send } from 'lucide-react';

export default function ReviewForm({ productId, onReviewSubmitted }) {
    const [rating, setRating] = useState(5);
    const [hoverRating, setHoverRating] = useState(0);
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [comment, setComment] = useState('');
    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSubmitting(true);
        setError(null);

        if (!name.trim() || !email.trim()) {
            setError("Merci de renseigner votre nom et votre email.");
            setSubmitting(false);
            return;
        }

        try {
            const res = await fetch('/api/reviews', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    productId: productId,
                    rating,
                    comment,
                    name,
                    email
                })
            });

            const data = await res.json();

            if (!res.ok) {
                throw new Error(data.error || "Une erreur est survenue.");
            }

            // Reset form
            setName('');
            setEmail('');
            setComment('');
            setRating(5);
            setSuccess(true);

            if (onReviewSubmitted) onReviewSubmitted();

            // Hide success message after 5 seconds
            setTimeout(() => setSuccess(false), 5000);

        } catch (err) {
            console.error('Error submitting review:', err);
            setError(err.message || "Une erreur est survenue lors de l'envoi de l'avis.");
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <div className="bg-white p-6 rounded-lg border border-zinc-200 shadow-sm">
            <h3 className="text-xl font-bold uppercase mb-4">Laisser un avis</h3>

            {success && (
                <div className="bg-green-50 text-green-700 p-4 rounded mb-4 text-sm font-medium">
                    Merci ! Votre avis a bien été enregistré.
                </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
                {/* Rating Stars */}
                <div>
                    <label className="block text-sm font-bold text-zinc-700 mb-1">Votre note</label>
                    <div className="flex gap-1">
                        {[1, 2, 3, 4, 5].map((star) => (
                            <button
                                key={star}
                                type="button"
                                className="focus:outline-none transition-transform hover:scale-110"
                                onMouseEnter={() => setHoverRating(star)}
                                onMouseLeave={() => setHoverRating(0)}
                                onClick={() => setRating(star)}
                            >
                                <Star
                                    size={24}
                                    fill={(hoverRating || rating) >= star ? "#FF6B00" : "transparent"}
                                    color={(hoverRating || rating) >= star ? "#FF6B00" : "#D1D5DB"}
                                    className="transition-colors"
                                />
                            </button>
                        ))}
                    </div>
                </div>


                {/* Name Input */}
                <div>
                    <label htmlFor="author_name" className="block text-sm font-bold text-zinc-700 mb-1">Nom</label>
                    <input
                        type="text"
                        id="author_name"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className="w-full p-3 bg-zinc-50 border border-zinc-200 rounded focus:outline-none focus:border-[#FF6B00] transition"
                        placeholder="Votre nom"
                        required
                    />
                </div>

                {/* Email Input */}
                <div>
                    <label htmlFor="email" className="block text-sm font-bold text-zinc-700 mb-1">Email (pour vérification d'achat)</label>
                    <input
                        type="email"
                        id="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="w-full p-3 bg-zinc-50 border border-zinc-200 rounded focus:outline-none focus:border-[#FF6B00] transition"
                        placeholder="L'email utilisé pour l'achat"
                        required
                    />
                    <p className="text-xs text-zinc-400 mt-1 italic">Votre email ne sera pas publié.</p>
                </div>

                {/* Comment Input */}
                <div>
                    <label htmlFor="comment" className="block text-sm font-bold text-zinc-700 mb-1">Commentaire (optionnel)</label>
                    <textarea
                        id="comment"
                        value={comment}
                        onChange={(e) => setComment(e.target.value)}
                        rows={3}
                        className="w-full p-3 bg-zinc-50 border border-zinc-200 rounded focus:outline-none focus:border-[#FF6B00] transition"
                        placeholder="Dites-nous ce que vous en avez pensé..."
                    />
                </div>

                {error && (
                    <div className="text-red-500 text-sm font-medium bg-red-50 p-3 rounded">
                        {error}
                    </div>
                )}

                <button
                    type="submit"
                    disabled={submitting}
                    className="bg-black text-white px-6 py-3 rounded font-black uppercase tracking-widest hover:bg-[#FF6B00] hover:text-black transition w-full flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    {submitting ? <Loader2 className="animate-spin" size={18} /> : (
                        <>
                            Publier mon avis <Send size={16} />
                        </>
                    )}
                </button>
            </form>
        </div>
    );
}
