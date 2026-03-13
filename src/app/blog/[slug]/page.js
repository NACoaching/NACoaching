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
import AuthorBio from '@/components/AuthorBio';
import { autoLinkContent } from '@/lib/contentProcessor';

import { redirect } from 'next/navigation';

export const revalidate = 10;

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

    // Fetch SEO Overrides
    const { data: seoData } = await supabase
        .from('site_content')
        .select('*')
        .in('key', [`article_${article.id}_seo_title`, `article_${article.id}_seo_desc`]);

    const overrides = {};
    if (seoData) {
        seoData.forEach(item => {
            if (item.key.includes('title')) overrides.title = item.value;
            if (item.key.includes('desc')) overrides.description = item.value;
        });
    }

    const finalTitle = overrides.title || `${article.title} - NA Coaching`;
    const finalDesc = overrides.description || article.excerpt;

    return {
        title: finalTitle,
        description: finalDesc,
        openGraph: {
            title: finalTitle,
            description: finalDesc,
            images: [article.image],
        },
        alternates: {
            canonical: `https://www.na-coaching.com/blog/${article.slug || article.id}`,
        },
        authors: [{ name: 'NA Coaching (Master EOPS)', url: 'https://www.na-coaching.com' }],
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

    const [articleRes, contentRes, autoLinksRes] = await Promise.all([
        query.single(),
        supabase.from('site_content').select('*'),
        supabase.from('auto_links').select('*').eq('is_active', true)
    ]);

    const article = articleRes.data;
    const autoLinks = autoLinksRes.data || [];
    // Emoji mapping for tools based on their URL
    const toolEmojis = {
        '/outils/rpe-1rm': '💪',
        '/outils/convertisseur-vitesse': '⚡️',
        '/outils/test-demi-cooper': '🏃‍♂️',
        '/outils/frequence-cardiaque': '❤️',
        '/outils/predictateur-performance': '⏱️',
        '/outils/besoins-caloriques': '🔥',
        '/outils/macros-avancees': '🥑',
        '/outils/volume-effectif': '📊',
        '/outils/ratio-acwr': '📈',
        '/outils/score-recuperation': '🔋',
    };

    let relatedArticles = [];
    let articleTools = [];

    // Safe fetching of related articles and tools
    try {
        if (article && Array.isArray(article.related_articles) && article.related_articles.length > 0) {
            const { data, error } = await supabase
                .from('articles')
                .select('id, slug, title, category, cta')
                .in('id', article.related_articles)
                .eq('is_published', true);

            if (data && !error) {
                // Separate tools from regular articles
                articleTools = data.filter(a => a.category === 'Outils');
                relatedArticles = data.filter(a => a.category !== 'Outils');
            }
        } else if (article) {
            const { data, error } = await supabase
                .from('articles')
                .select('id, slug, title, category')
                .neq('id', article.id)
                .eq('category', article.category)
                .eq('is_published', true)
                .limit(2);

            if (data && !error) {
                relatedArticles = data || [];
            }

            // If not enough in same category, just get latest
            if (relatedArticles.length < 2) {
                const { data: fallbackData, error: fallbackError } = await supabase
                    .from('articles')
                    .select('id, slug, title, category')
                    .neq('id', article.id)
                    .eq('is_published', true)
                    .order('created_at', { ascending: false })
                    .limit(2 - relatedArticles.length);

                if (fallbackData && !fallbackError) {
                    relatedArticles = [...relatedArticles, ...fallbackData];
                }
            }
        }
    } catch (e) {
        console.error("Safely caught render error in related articles parsing:", e);
    }

    const siteContent = contentRes.data || [];
    const getContent = (key) => siteContent.find(c => c.key === key)?.value;

    if (!article) return <div className="p-20 text-center">Article introuvable.</div>;

    if (isId && article.slug) {
        redirect(`/blog/${article.slug}`);
    }

    // Redirect tools to their interactive page if a CTA exists
    if (article.category === 'Outils' && article.cta) {
        redirect(article.cta);
    }

    const currentUrl = `https://www.na-coaching.com/blog/${article.slug || article.id}`;

    const coachName = getContent('coach_name') || 'Nolwen Albanesi';
    const coachImage = getContent('coach_image') || '/logo.png';
    const coachTagline = getContent('coach_tagline') || 'Coach Sportif · Master EOPS · Spécialiste Performance & Réathlétisation';

    const jsonLd = {
        '@context': 'https://schema.org',
        '@type': 'BlogPosting',
        headline: article.title,
        image: article.image ? [article.image] : [],
        datePublished: article.created_at,
        dateModified: article.created_at,
        author: {
            '@type': 'Person',
            name: coachName,
            url: 'https://www.na-coaching.com/coach',
            jobTitle: 'Coach Sportif - Master EOPS',
            sameAs: ['https://www.na-coaching.com/coach']
        },
        publisher: {
            '@type': 'Organization',
            name: 'NA Coaching',
            url: 'https://www.na-coaching.com',
            logo: {
                '@type': 'ImageObject',
                url: 'https://www.na-coaching.com/logo.png'
            }
        }
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
                        { label: article.title, href: `/blog/${article.slug || article.id}` },
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
                                    a: ({ node, ...props }) => {
                                        const isInternal = props.href?.startsWith('/') || props.href?.includes('na-coaching.com');
                                        if (isInternal) {
                                            return <Link href={props.href} className="text-[#FF6B00] font-bold hover:underline" {...props} />;
                                        }
                                        return <a target="_blank" rel="noopener noreferrer" className="text-[#FF6B00] font-bold hover:underline" {...props} />;
                                    },
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
                                    h1: ({ node, ...props }) => <h2 className="text-3xl font-black uppercase mt-12 mb-6 text-[#FF6B00] border-l-8 border-[#FF6B00] pl-6 italic" {...props} />,
                                    h2: ({ node, ...props }) => <h2 className="text-2xl font-black uppercase mt-12 mb-6 text-black border-b-2 border-zinc-100 pb-2" {...props} />,
                                    h3: ({ node, ...props }) => <h3 className="text-xl font-black uppercase mt-8 mb-4 text-zinc-500 tracking-wider" {...props} />,
                                    h4: ({ node, ...props }) => <h4 className="text-lg font-bold mt-6 mb-3 text-black" {...props} />,
                                    ul: ({ node, ...props }) => <ul className="list-disc pl-6 mb-6 space-y-2" {...props} />,
                                    li: ({ node, ...props }) => <li className="pl-2" {...props} />,
                                    strong: ({ node, ...props }) => <strong className="font-black text-black" {...props} />,
                                }}
                            >
                                {autoLinkContent(article.content, autoLinks, "/blog/" + (article.slug || article.id))}
                            </ReactMarkdown>
                        </div>

                        {/* EXPERT BOX (CTA PROGRAMME) - FIN D'ARTICLE */}
                        {article.cta && (
                            <div className="my-12 p-8 rounded-xl bg-black border border-zinc-800 flex flex-col md:flex-row items-center gap-8 group shadow-2xl">
                                <div className="flex-1 text-center md:text-left">
                                    <span className="inline-block px-3 py-1 bg-[#FF6B00] text-black text-[10px] font-black uppercase tracking-widest rounded-full mb-4">
                                        Programme Recommandé
                                    </span>
                                    <h4 className="text-2xl font-black uppercase mb-2 text-white">
                                        {article.cta_title || getContent('expert_box_title') || "Passez à l'action"}
                                    </h4>
                                    <p className="text-zinc-400 font-medium text-base leading-relaxed mb-6">
                                        {article.cta_text || getContent('expert_box_text') || "La lecture ne suffit pas pour progresser. Découvrez le programme complet incluant les méthodes, protocoles et entraînements abordés sur ce site."}
                                    </p>
                                    <Link
                                        href={article.cta.startsWith('http') ? article.cta : `/boutique/${article.cta}`}
                                        className="inline-block bg-[#FF6B00] text-black font-black py-4 px-8 rounded-sm uppercase text-xs hover:bg-white hover:text-black transition shadow-lg"
                                    >
                                        Découvrir le programme
                                    </Link>
                                </div>
                                <div className="w-32 h-32 flex items-center justify-center shrink-0">
                                    {article.cta_image ? (
                                        <img
                                            src={article.cta_image}
                                            alt="Aperçu du Programme"
                                            className="w-full h-full object-contain group-hover:scale-110 transition-transform duration-500 rounded"
                                        />
                                    ) : (
                                        <ShoppingBag className="w-full h-full text-[#FF6B00] opacity-80 group-hover:scale-110 group-hover:text-white transition-all duration-500" strokeWidth={1} />
                                    )}
                                </div>
                            </div>
                        )}

                        <ShareButtons url={currentUrl} title={article.title} />

                        <AuthorBio name={coachName} tagline={coachTagline} imageUrl={coachImage} />
                    </div>

                    {/* AFFILIATE BANNER (HORIZONTAL) */}
                    {article.affiliate_link && (
                        <div className="mt-12 p-8 rounded-xl border-2 border-dashed border-[#FF6B00]/30 bg-[#FF6B00]/5 flex flex-col md:flex-row items-center gap-8 group">
                            <div className="flex-1 text-center md:text-left">
                                <span className="inline-block px-3 py-1 bg-[#FF6B00] text-black text-[10px] font-black uppercase tracking-widest rounded-full mb-4">
                                    Recommandation de l&apos;expert
                                </span>
                                {article.affiliate_title && (
                                    <h4 className="text-xl font-black uppercase mb-2 text-black">{article.affiliate_title}</h4>
                                )}
                                <p className="text-zinc-800 font-medium text-lg leading-relaxed mb-6">
                                    {article.affiliate_text || "Profitez de cette recommandation pour optimiser vos résultats."}
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
                            <div className="w-32 h-32 flex items-center justify-center shrink-0">
                                {article.affiliate_image ? (
                                    <img
                                        src={article.affiliate_image}
                                        alt="Recommandation"
                                        className="w-full h-full object-contain group-hover:scale-110 transition-transform duration-500"
                                    />
                                ) : (
                                    <ShoppingBag className="w-full h-full text-[#FF6B00] opacity-20" />
                                )}
                            </div>
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
                                        <div className="mt-auto text-xs font-bold text-zinc-400 group-hover:text-black transition">Lire l&apos;article →</div>
                                    </div>
                                </Link>
                            ))}
                        </div>
                    </div>

                    {/* RELATED TOOLS - MAILLAGE INTERNE DYNAMIQUE */}
                    {articleTools.length > 0 && (
                        <div className="mt-16 pt-12 border-t border-zinc-100 bg-zinc-50/50 p-8 rounded-xl">
                            <h3 className="text-xl font-black uppercase mb-6 text-black">Outils Scientifiques Gratuits</h3>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                {articleTools.map((tool) => {
                                    const icon = toolEmojis[tool.cta] || '🔧';
                                    const title = tool.title;
                                    const url = tool.cta || `/blog/${tool.slug}`;

                                    return (
                                        <Link key={tool.id} href={url} className="bg-white p-4 rounded border border-zinc-200 hover:border-[#FF6B00] transition group">
                                            <div className="text-2xl mb-2">{icon}</div>
                                            <div className="text-xs font-black uppercase text-black group-hover:text-[#FF6B00]">{title}</div>
                                        </Link>
                                    );
                                })}
                            </div>
                        </div>
                    )}

                    <CommentsSection articleId={article.id} />
                </div>
            </section>
        </>
    );
}
