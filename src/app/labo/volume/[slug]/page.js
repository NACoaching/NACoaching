import Link from 'next/link';
import { ArrowLeft, BookOpen, Clock } from 'lucide-react';

export const revalidate = 3600; // Cache pendant 1 heure pour la vitesse (ISR)

import { supabase } from '@/lib/supabaseClient';

async function getVolumeData(slug) {
    try {
        const targetCategory = slug.replace(/-/g, ' ').toUpperCase();

        // Fetch only PUBLISHED articles from Supabase directly
        const { data: articles, error } = await supabase
            .from('articles')
            .select('*')
            .eq('is_published', true)
            .order('created_at', { ascending: false });

        if (error) {
            console.error('Failed to fetch articles for Volume:', error);
            return [];
        }

        const volumeArticles = (articles || []).filter(a => {
            if (!a.category) return false;
            const cat = a.category.toUpperCase().replace(/[^A-Z0-9]/g, '');
            const tgt = targetCategory.replace(/[^A-Z0-9]/g, '');
            return cat.includes(tgt) || tgt.includes(cat);
        });

        return volumeArticles;
    } catch (e) {
        console.error('Error fetching Volume Data:', e);
        return [];
    }
}

export async function generateMetadata({ params }) {
    const { slug } = await params;

    // Very basic title generation from slug for now. Real titles can be mapped or fetched.
    const titleFromSlug = slug.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase());

    return {
        title: `${titleFromSlug} | Encyclopédie NA Coaching`,
        description: `Explorez notre Volume dédié : ${titleFromSlug}. Retrouvez des dizaines d'articles d'expertise en Force, Endurance, et Mode de vie.`,
        openGraph: {
            title: `${titleFromSlug} | NA Coaching`,
            description: `Le guide complet pour maîtriser ce domaine.`,
            type: 'website'
        }
    };
}

export default async function VolumePage({ params }) {
    const { slug } = await params;
    const articles = await getVolumeData(slug);

    // Fetch custom SEO content for this specific volume
    // The DB key is like 'volume_seo_volume-1-la-science-de-la-force'
    const { data: volumeContentData } = await supabase
        .from('site_content')
        .select('value')
        .eq('key', `volume_seo_volume-${slug}`)
        .single();

    const volumeSeoText = volumeContentData?.value || "Retrouvez ici toute l'expertise NA Coaching compilée. Que vous cherchiez à optimiser vos gains, comprendre la physiologie humaine ou adopter les meilleures routines.";

    // Format the slug '1-la-science-de-la-force' into 'Volume 1 : La Science De La Force'
    const formattedSlug = slug.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
    const fancyTitle = `Volume ${formattedSlug.replace(' ', ' : ')}`;

    // Group articles by subcategory to create beautiful "Chapters"
    const chapters = {};
    articles.forEach(art => {
        const subcat = art.subcategory || 'Généralités';
        if (!chapters[subcat]) chapters[subcat] = [];
        chapters[subcat].push(art);
    });

    const hasContent = articles.length > 0;

    return (
        <div className="min-h-screen bg-black text-white font-sans">
            <div className="max-w-4xl mx-auto px-6 py-24">

                {/* Header Section */}
                <div className="mb-16">
                    <Link href="/labo" className="inline-flex items-center gap-2 text-[#FF6B00] font-bold text-sm hover:underline mb-8 uppercase tracking-widest">
                        <ArrowLeft size={16} />
                        Retour au Labo
                    </Link>

                    <h1 className="text-4xl md:text-6xl font-black uppercase leading-tight mb-8">
                        {fancyTitle}
                    </h1>

                    <div className="prose prose-invert prose-lg max-w-2xl border-l-4 border-[#FF6B00] pl-6 text-zinc-400 font-medium leading-relaxed whitespace-pre-wrap">
                        {volumeSeoText}
                    </div>
                </div>

                {/* Content Statistics */}
                {hasContent && (
                    <div className="flex gap-6 mb-16 pb-16 border-b border-zinc-900">
                        <div className="flex items-center gap-3">
                            <div className="w-12 h-12 bg-[#FF6B00]/10 rounded-full flex items-center justify-center text-[#FF6B00]">
                                <BookOpen size={24} />
                            </div>
                            <div>
                                <div className="text-2xl font-black">{articles.length}</div>
                                <div className="text-xs text-zinc-500 uppercase font-bold tracking-wider">Articles</div>
                            </div>
                        </div>
                        <div className="flex items-center gap-3">
                            <div className="w-12 h-12 bg-zinc-900 rounded-full flex items-center justify-center text-zinc-400">
                                <Clock size={24} />
                            </div>
                            <div>
                                <div className="text-2xl font-black">{Object.keys(chapters).length}</div>
                                <div className="text-xs text-zinc-500 uppercase font-bold tracking-wider">Chapitres</div>
                            </div>
                        </div>
                    </div>
                )}

                {/* Listing Chapters */}
                <div className="space-y-16">
                    {!hasContent ? (
                        <div className="text-center py-20 bg-zinc-900/50 rounded-lg border border-zinc-800 border-dashed">
                            <BookOpen size={48} className="mx-auto text-zinc-600 mb-4" />
                            <h3 className="text-xl font-black uppercase text-zinc-300 mb-2">Volume en cours de rédaction</h3>
                            <p className="text-zinc-500 text-sm">Les articles de ce volume seront bientôt publiés par NA Coaching.</p>
                        </div>
                    ) : (
                        Object.entries(chapters).map(([chapterName, chapterArticles], idx) => (
                            <section key={chapterName} className="relative">
                                {/* Chapter Title */}
                                <div className="sticky top-0 bg-black/90 backdrop-blur pb-4 pt-4 z-10 border-b border-zinc-800 mb-8 flex items-baseline gap-4">
                                    <span className="text-[#FF6B00] font-black text-2xl">{(idx + 1).toString().padStart(2, '0')}.</span>
                                    <h2 className="text-2xl font-black uppercase tracking-tight text-white">{chapterName}</h2>
                                </div>

                                {/* Article Grid */}
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    {chapterArticles.map(article => (
                                        <article key={article.id} className="group bg-zinc-950 p-6 rounded-lg border border-zinc-800/50 hover:border-[#FF6B00] transition-all hover:bg-zinc-900 flex flex-col justify-between">
                                            <div>
                                                <div className="flex justify-between items-start mb-4">
                                                    <span className={`text-[10px] uppercase font-black px-2 py-1 rounded ${article.is_published ? 'bg-green-500/10 text-green-500 border border-green-500/20' : 'bg-orange-500/10 text-orange-500 border border-orange-500/20'}`}>
                                                        {article.is_published ? 'Publié' : 'En rédaction'}
                                                    </span>
                                                </div>
                                                <h3 className="text-lg font-bold text-white mb-2 leading-snug group-hover:text-[#FF6B00] transition-colors line-clamp-2">
                                                    {article.title}
                                                </h3>
                                                <p className="text-zinc-500 text-sm line-clamp-3 leading-relaxed mb-6">
                                                    {article.excerpt}
                                                </p>
                                            </div>

                                            {article.is_published ? (
                                                <Link href={`/blog/${article.slug || article.id}`} className="mt-auto text-xs font-black uppercase text-white hover:text-[#FF6B00] flex items-center gap-2 group/link w-fit">
                                                    Lire l&apos;article <ArrowLeft className="w-4 h-4 rotate-180 group-hover/link:translate-x-1 transition-transform" />
                                                </Link>
                                            ) : (
                                                <div className="mt-auto text-xs font-bold uppercase text-zinc-600 flex items-center gap-2 cursor-not-allowed">
                                                    Bientôt disponible <Clock className="w-3 h-3" />
                                                </div>
                                            )}
                                        </article>
                                    ))}
                                </div>
                            </section>
                        ))
                    )}
                </div>
            </div>
        </div>
    );
}
