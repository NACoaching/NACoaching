import { supabase } from '@/lib/supabaseClient';
import { Activity, ShoppingBag } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import CommentsSection from '@/components/CommentsSection';
import ShareButtons from '@/components/ShareButtons';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import ReadingProgress from '@/components/ReadingProgress';
import Breadcrumb from '@/components/Breadcrumb';

import { redirect } from 'next/navigation';

export async function generateMetadata({ params }) {
    const { slug } = await params;
    const isId = /^\d+$/.test(slug);

    let query = supabase.from('articles').select('*').eq('is_published', true);
    if (isId) {
        query = query.eq('id', slug);
    } else {
        query = query.eq('slug', slug);
    }

    const { data: article } = await query.single();

    if (!article) {
        return {
            title: 'Article introuvable - NA Coaching',
        }
    }

    return {
        title: `${article.title} - NA Coaching`,
        description: article.excerpt,
        openGraph: {
            title: article.title,
            description: article.excerpt,
            images: [article.image],
        },
    }
}

export default async function ArticlePage({ params }) {
    const { slug } = await params;
    const isId = /^\d+$/.test(slug);

    let query = supabase.from('articles').select('*').eq('is_published', true);
    if (isId) {
        query = query.eq('id', slug);
    } else {
        query = query.eq('slug', slug);
    }

    const [articleRes, contentRes] = await Promise.all([
        query.single(),
        supabase.from('site_content').select('*')
    ]);

    const article = articleRes.data;
    const siteContent = contentRes.data || [];

    // Fetch related articles
    let relatedArticles = [];
    if (article) {
        if (article.related_articles && article.related_articles.length > 0) {
            const { data } = await supabase
                .from('articles')
                .select('id, slug, title, category')
                .in('id', article.related_articles)
                .eq('is_published', true);
            relatedArticles = data || [];
        } else {
            const { data } = await supabase
                .from('articles')
                .select('id, slug, title, category')
                .neq('id', article.id)
                .eq('category', article.category)
                .eq('is_published', true)
                .limit(2);

            relatedArticles = data || [];

            // If not enough in same category, just get latest
            if (relatedArticles.length < 2) {
                const { data: fallbackData } = await supabase
                    .from('articles')
                    .select('id, slug, title, category')
                    .neq('id', article.id)
                    .eq('is_published', true)
                    .order('created_at', { ascending: false })
                    .limit(2 - relatedArticles.length);

                if (fallbackData) {
                    relatedArticles = [...relatedArticles, ...fallbackData];
                }
            }
        }
    }

    const getContent = (key) => siteContent.find(c => c.key === key)?.value;

    if (!article) return <div className="p-20 text-center">Article introuvable.</div>;

    if (isId && article.slug) {
        redirect(`/blog/${article.slug}`);
    }

    const currentUrl = `https://na-coaching.com/blog/${article.slug || article.id}`;

    const jsonLd = {
        '@context': 'https://schema.org',
        '@type': 'BlogPosting',
        headline: article.title,
        image: article.image ? [article.image] : [],
        datePublished: article.created_at,
        dateModified: article.created_at,
        author: [{
            '@type': 'Person',
            name: 'NA Coaching',
            url: 'https://na-coaching.com'
        }]
    };

    return (
        <>
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
            />
            <ReadingProgress />
            <section className="py-20 bg-white min-h-screen">
                <div className="max-w-3xl mx-auto px-6">
                    <Breadcrumb items={[
                        { label: 'Accueil', href: '/' },
                        { label: 'Le Labo', href: '/labo' },
                        { label: article.category, href: `/labo?category=${encodeURIComponent(article.category)}` },
                        { label: article.title },
                    ]} />

                    <div className="text-[#FF6B00] text-sm font-black uppercase tracking-widest mb-4 mt-6">{article.category}</div>
                    <h1 className="text-4xl md:text-5xl font-black uppercase leading-tight mb-8 italic border-l-8 border-[#FF6B00] pl-6 text-black">
                        {article.title}
                    </h1>

                    <div className="relative w-full aspect-video mb-12 rounded-sm shadow-2xl overflow-hidden">
                        {article.image ? (
                            <Image
                                src={article.image}
                                alt={article.title}
                                fill
                                className="object-cover"
                                priority
                            />
                        ) : (
                            <div className="w-full h-full flex items-center justify-center bg-zinc-100 text-zinc-300">
                                <span className="text-4xl font-black opacity-20">NA</span>
                            </div>
                        )}
                    </div>

                    <div className="prose prose-zinc prose-lg max-w-none">
                        <p className="text-xl font-medium text-zinc-600 mb-8 leading-relaxed">
                            {article.excerpt}
                        </p>
                        <div className="text-zinc-800 leading-loose">
                            <ReactMarkdown
                                remarkPlugins={[remarkGfm]}
                                components={{
                                    img: ({ node, ...props }) => (
                                        <figure className="my-8">
                                            <div className="relative w-full aspect-video rounded-lg overflow-hidden shadow-lg">
                                                <Image
                                                    src={props.src}
                                                    alt={props.alt}
                                                    fill
                                                    className="object-cover"
                                                />
                                            </div>
                                            {props.alt && (
                                                <figcaption className="text-center text-zinc-500 text-sm mt-2 italic">
                                                    {props.alt}
                                                </figcaption>
                                            )}
                                        </figure>
                                    ),
                                    h1: ({ node, ...props }) => <h1 className="text-3xl font-black uppercase mt-10 mb-6 text-[#FF6B00]" {...props} />,
                                    h2: ({ node, ...props }) => <h2 className="text-2xl font-black uppercase mt-8 mb-4 text-[#FF6B00]" {...props} />,
                                    h3: ({ node, ...props }) => <h3 className="text-xl font-bold mt-6 mb-3 text-black" {...props} />,
                                    h4: ({ node, ...props }) => <h4 className="text-lg font-bold mt-4 mb-2 text-black" {...props} />,
                                    ul: ({ node, ...props }) => <ul className="list-disc pl-6 mb-6 space-y-2" {...props} />,
                                    li: ({ node, ...props }) => <li className="pl-2" {...props} />,
                                    strong: ({ node, ...props }) => <strong className="font-black text-black" {...props} />,
                                }}
                            >
                                {article.content}
                            </ReactMarkdown>
                        </div>

                        <ShareButtons url={currentUrl} title={article.title} />
                    </div>

                    {/* AFFILIATE CARD */}
                    {article.affiliate_link && (
                        <div className="mt-12 p-8 rounded-xl border-2 border-dashed border-[#FF6B00]/30 bg-[#FF6B00]/5 flex flex-col md:flex-row items-center gap-8">
                            <div className="flex-1 text-center md:text-left">
                                <span className="inline-block px-3 py-1 bg-[#FF6B00] text-black text-[10px] font-black uppercase tracking-widest rounded-full mb-4">
                                    Recommandation de l'expert
                                </span>
                                <p className="text-zinc-800 font-medium text-lg leading-relaxed mb-6">
                                    {article.affiliate_text || "Je vous recommande ce produit pour optimiser vos résultats et votre récupération."}
                                </p>
                                <a
                                    href={article.affiliate_link}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="inline-block bg-black text-white font-black py-4 px-8 rounded-sm uppercase text-xs hover:bg-[#FF6B00] hover:text-black transition shadow-lg"
                                >
                                    Découvrir le produit
                                </a>
                            </div>
                            <div className="hidden md:block w-32 h-32 opacity-20">
                                <ShoppingBag className="w-full h-full text-[#FF6B00]" />
                            </div>
                        </div>
                    )}

                    {/* EXPERT BOX */}
                    {article.cta && (
                        <div className="mt-16 bg-black text-white p-8 rounded-sm relative overflow-hidden">
                            <div className="absolute top-0 right-0 p-4 opacity-10">
                                <Activity size={80} className="text-[#FF6B00]" />
                            </div>
                            <h4 className="text-[#FF6B00] font-black uppercase tracking-tighter text-lg mb-2">
                                {getContent('expert_box_title') || "L'avis du Master EOPS"}
                            </h4>
                            <p className="text-zinc-300 text-sm mb-6 leading-relaxed">
                                {getContent('expert_box_text') || "En tant que professionnel, je vous conseille de ne jamais ignorer une douleur asymétrique. La science prouve que le repos n'est pas toujours la solution, c'est le mouvement contrôlé qui soigne."}
                            </p>
                            <Link
                                href="/boutique"
                                className="bg-[#FF6B00] text-black font-black py-3 px-6 rounded-sm uppercase text-xs hover:bg-white transition inline-block"
                            >
                                Découvrir le programme {article.cta}
                            </Link>
                        </div>
                    )}

                    {/* RELATED ARTICLES */}
                    <div className="mt-20 pt-12 border-t border-zinc-200">
                        <h3 className="text-2xl font-black uppercase mb-8 text-black text-center">{article.related_title || "Pour aller plus loin"}</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {relatedArticles.map((relatedArticle) => (
                                <Link href={`/blog/${relatedArticle.slug || relatedArticle.id}`} key={relatedArticle.id} className="group block">
                                    <div className="bg-zinc-50 rounded-lg p-6 border border-zinc-100 hover:border-[#FF6B00] hover:shadow-md transition-all h-full flex flex-col">
                                        <div className="text-[#FF6B00] text-xs font-black uppercase tracking-widest mb-2">{relatedArticle.category}</div>
                                        <h4 className="text-lg font-bold uppercase leading-snug mb-3 text-black group-hover:text-[#FF6B00] transition line-clamp-2">
                                            {relatedArticle.title}
                                        </h4>
                                        <div className="mt-auto text-xs font-bold text-zinc-400 group-hover:text-black transition">Lire l'article →</div>
                                    </div>
                                </Link>
                            ))}
                        </div>
                    </div>

                    {/* RELATED TOOLS - MAILLAGE INTERNE */}
                    <div className="mt-16 pt-12 border-t border-zinc-100 bg-zinc-50/50 p-8 rounded-xl">
                        <h3 className="text-xl font-black uppercase mb-6 text-black">Outils Scientifiques Gratuits</h3>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <Link href="/outils/calculateur-1rm" className="bg-white p-4 rounded border border-zinc-200 hover:border-[#FF6B00] transition group">
                                <div className="text-2xl mb-2">💪</div>
                                <div className="text-xs font-black uppercase text-black group-hover:text-[#FF6B00]">1RM Max</div>
                            </Link>
                            <Link href="/outils/vma-vo2" className="bg-white p-4 rounded border border-zinc-200 hover:border-[#FF6B00] transition group">
                                <div className="text-2xl mb-2">🏃‍♂️</div>
                                <div className="text-xs font-black uppercase text-black group-hover:text-[#FF6B00]">VMA / VO2</div>
                            </Link>
                        </div>
                    </div>

                    <CommentsSection articleId={article.id} />
                </div>
            </section>
        </>
    );
}
