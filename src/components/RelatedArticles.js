import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { supabase } from '@/lib/supabaseClient';

export default async function RelatedArticles({ articles, title, subtitle }) {
    if (!articles || articles.length === 0) return null;

    let displayTitle = title;
    let displaySubtitle = subtitle;

    if (!title || !subtitle) {
        const { data: content } = await supabase.from('site_content').select('*').in('key', ['tools_related_title', 'tools_related_subtitle']);

        if (!title) displayTitle = content?.find(c => c.key === 'tools_related_title')?.value || "Articles Recommandés";
        if (!subtitle) displaySubtitle = content?.find(c => c.key === 'tools_related_subtitle')?.value || "En apprendre plus avec le Labo";
    }

    return (
        <div className="mt-16 pt-16 border-t border-zinc-200">
            <div className="mb-10">
                <h3 className="text-2xl font-black uppercase text-black">{displayTitle}</h3>
                <p className="text-zinc-500 text-sm mt-1">{displaySubtitle}</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {articles.map((article) => (
                    <Link href={`/blog/${article.slug || article.id}`} key={article.id} className="group block">
                        <div className="bg-white rounded-lg p-6 border border-zinc-200 hover:border-[#FF6B00] hover:shadow-md transition-all h-full flex flex-col">
                            <div className="text-[#FF6B00] text-xs font-black uppercase tracking-widest mb-2">{article.category}</div>
                            <h4 className="text-lg font-bold uppercase leading-snug mb-3 text-black group-hover:text-[#FF6B00] transition line-clamp-2">
                                {article.title}
                            </h4>
                            <div className="mt-auto text-xs font-bold text-zinc-400 group-hover:text-black transition flex items-center gap-2">
                                Lire l'article <ArrowRight size={12} className="group-hover:translate-x-1 transition-transform" />
                            </div>
                        </div>
                    </Link>
                ))}
            </div>
        </div>
    );
}
