"use client";
import React, { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabaseClient';
import { User } from 'lucide-react';


export default function CommentsSection({ articleId }) {
    const [comments, setComments] = useState([]);

    useEffect(() => {
        async function fetchComments() {
            if (!articleId) return;
            const { data } = await supabase
                .from('comments')
                .select('*')
                .eq('article_id', articleId)
                .eq('is_approved', true) // Only show approved
                .order('created_at', { ascending: false });

            if (data) setComments(data);
        }

        fetchComments();
    }, [articleId]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        const formData = new FormData(e.target);
        const { error } = await supabase.from('comments').insert([{
            article_id: articleId,
            author_name: formData.get('name'),
            content: formData.get('content')
        }]);

        if (error) {
            alert("Erreur : " + error.message);
        } else {
            alert("Merci ! Votre commentaire a été envoyé et est en attente de validation.");
            e.target.reset();
        }
    };

    return (
        <div className="mt-20 border-t border-zinc-200 pt-12">
            <h3 className="text-2xl font-black uppercase mb-8 pl-1 text-black flex items-center gap-3">
                Commentaires <span className="bg-zinc-100 text-zinc-700 text-xs px-2 py-1 rounded-full">{comments.length}</span>
            </h3>

            {/* COMMENT LIST */}
            <div className="space-y-8 mb-12">
                {comments.length === 0 ? (
                    <p className="text-zinc-600 italic">Aucun commentaire pour le moment. Soyez le premier !</p>
                ) : (
                    comments.map(comment => (
                        <div key={comment.id} className="bg-zinc-50 p-6 rounded border border-zinc-100 flex gap-4">
                            <div className="w-10 h-10 rounded-full bg-white border border-zinc-200 flex items-center justify-center text-zinc-600 flex-shrink-0">
                                <User size={20} />
                            </div>
                            <div className="flex-grow">
                                <div className="flex justify-between items-start mb-2">
                                    <span className="font-bold uppercase text-sm">{comment.author_name}</span>
                                    <span className="text-[10px] text-zinc-600 uppercase tracking-widest">{new Date(comment.created_at).toLocaleDateString()}</span>
                                </div>
                                <p className="text-zinc-600 text-sm leading-relaxed">{comment.content}</p>
                            </div>
                        </div>
                    ))
                )}
            </div>

            {/* COMMENT FORM */}
            <div className="bg-zinc-900 p-8 rounded text-white">
                <h4 className="font-bold uppercase tracking-widest mb-6 text-[#FF6B00]">Laisser un commentaire</h4>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-xs font-bold uppercase text-zinc-700 mb-2">Nom / Pseudo</label>
                            <input required name="name" className="w-full bg-zinc-800 border border-zinc-700 p-3 rounded text-sm focus:border-[#FF6B00] outline-none text-white" placeholder="Votre nom" />
                        </div>
                    </div>
                    <div>
                        <label className="block text-xs font-bold uppercase text-zinc-700 mb-2">Message</label>
                        <textarea required name="content" className="w-full bg-zinc-800 border border-zinc-700 p-3 rounded text-sm h-32 focus:border-[#FF6B00] outline-none" placeholder="Partagez votre avis..." />
                    </div>
                    <button type="submit" className="bg-[#FF6B00] text-black font-black py-3 px-8 rounded uppercase text-xs hover:bg-white transition">
                        Envoyer
                    </button>
                    <p className="text-[10px] text-zinc-700 italic mt-2">* Votre commentaire sera visible après validation.</p>
                </form>
            </div>
        </div>
    );
}
