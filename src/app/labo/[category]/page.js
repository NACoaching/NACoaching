import { supabase } from '@/lib/supabaseClient';
import Link from 'next/link';
import Image from 'next/image';
import Breadcrumb from '@/components/Breadcrumb';
import AnimWrapper from '@/components/AnimWrapper';

export const revalidate = 3600;

// Use the exact category name from the DB as the static param
export async function generateStaticParams() {
    const { data } = await supabase.from('articles').select('category');
    if (!data) return [];
    const categories = [...new Set(data.map(a => a.category).filter(Boolean))];
    // Pass the exact category name - Next.js will URL-encode it in the path automatically
    return categories.map(category => ({ category }));
}

export async function generateMetadata({ params }) {
    // Next.js always gives us the decoded value in params
    const category = decodeURIComponent((await params).category);

    return {
        title: `${category} - Le Labo NA Coaching`,
        description: `Tous les articles scientifiques de NA Coaching sur la thématique "${category}". Découvrez les conseils d'expert d'un Master EOPS.`,
        openGraph: {
            title: `${category} - Le Labo NA Coaching`,
            description: `Tous les articles NA Coaching sur : ${category}.`,
            type: 'website',
        },
    };
}

export default async function LaboCategoryPage({ params }) {
    // Next.js gives us the decoded category name in params
    const category = decodeURIComponent((await params).category);

    // Fetch articles + all categories for the navigation bar in parallel
    const [articlesRes, allCatsRes] = await Promise.all([
        supabase.from('articles').select('*').eq('category', category).order('created_at', { ascending: false }),
        supabase.from('articles').select('category'),
    ]);

    let articlesList = articlesRes.data || [];

    // Fallback: case-insensitive match
    if (articlesList.length === 0) {
        const { data: fallback } = await supabase.from('articles').select('*').ilike('category', category).order('created_at', { ascending: false });
        articlesList = fallback || [];
    }

    const allCategories = [...new Set((allCatsRes.data || []).map(a => a.category).filter(Boolean))];

    const jsonLd = {
        '@context': 'https://schema.org',
        '@type': 'CollectionPage',
        name: `${category} - Le Labo NA Coaching`,
        description: `Articles scientifiques sur la thématique ${category} par NA Coaching.`,
        url: `https://na-coaching.com/labo/${encodeURIComponent(category)}`,
        hasPart: articlesList.map(article => ({
            '@type': 'Article',
            headline: article.title,
            url: `https://na-coaching.com/blog/${article.id}`,
            image: article.image,
        })),
    };

    const breadcrumbItems = [
        { label: 'Accueil', href: '/' },
        { label: 'Le Labo', href: '/labo' },
        { label: category },
    ];

    return (
        <>
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
            />
            <section className="py-20 min-h-screen bg-white">
                <div className="max-w-7xl mx-auto px-6">
                    <AnimWrapper>
                        <Breadcrumb items={breadcrumbItems} />
                        <div className="mt-6 mb-4">
                            <span className="text-[#FF6B00] text-sm font-black uppercase tracking-widest">Catégorie</span>
                        </div>
                        <h1 className="text-5xl font-black uppercase text-black mb-4">{category}</h1>
                        <p className="text-zinc-500 mb-8 max-w-xl">
                            {articlesList.length} article{articlesList.length > 1 ? 's' : ''} sur cette thématique — basés sur la science et l'expertise d'un Master EOPS.
                        </p>
                    </AnimWrapper>

                    {/* CATEGORY NAVIGATION */}
                    <div className="flex flex-wrap gap-3 mb-10">
                        <Link href="/labo" className="px-4 py-2 rounded-full text-xs font-black uppercase tracking-widest border border-zinc-200 bg-zinc-100 text-zinc-600 hover:border-[#FF6B00] hover:text-[#FF6B00] transition">
                            Tous
                        </Link>
                        {allCategories.map(cat => (
                            <Link
                                key={cat}
                                href={`/labo/${cat}`}
                                className={`px-4 py-2 rounded-full text-xs font-black uppercase tracking-widest border transition ${cat === category
                                    ? 'bg-[#FF6B00] text-black border-[#FF6B00]'
                                    : 'bg-zinc-100 text-zinc-600 border-zinc-200 hover:border-[#FF6B00] hover:text-[#FF6B00]'
                                    }`}
                            >
                                {cat}
                            </Link>
                        ))}
                    </div>

                    {articlesList.length === 0 ? (
                        <div className="text-center py-20">
                            <p className="text-zinc-400 text-lg font-bold">Aucun article dans cette catégorie pour le moment.</p>
                            <Link href="/labo" className="mt-6 inline-block text-[#FF6B00] font-black uppercase hover:underline">
                                ← Voir tous les articles
                            </Link>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12">
                            {articlesList.map((article, index) => (
                                <AnimWrapper key={article.id} delay={index * 0.1}>
                                    <Link href={`/blog/${article.id}`} className="group cursor-pointer flex flex-col h-full">
                                        <div className="aspect-[4/3] bg-zinc-200 mb-6 overflow-hidden relative rounded-lg">
                                            {article.image ? (
                                                <Image
                                                    src={article.image}
                                                    alt={article.title}
                                                    fill
                                                    className="object-cover group-hover:scale-105 transition duration-500"
                                                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                                                />
                                            ) : (
                                                <div className="w-full h-full flex items-center justify-center bg-zinc-100">
                                                    <span className="text-zinc-400 font-bold uppercase text-sm">NA Coaching</span>
                                                </div>
                                            )}
                                        </div>
                                        <div className="flex flex-col flex-grow">
                                            <span className="text-[#FF6B00] text-xs font-black uppercase tracking-widest mb-2">{article.category}</span>
                                            <h2 className="text-xl font-black uppercase leading-tight mb-3 text-black group-hover:text-[#FF6B00] transition">{article.title}</h2>
                                            <p className="text-zinc-500 text-sm line-clamp-3 flex-grow">{article.excerpt}</p>
                                            <div className="mt-4 text-xs font-black uppercase text-zinc-400 group-hover:text-[#FF6B00] transition">
                                                Lire l'article →
                                            </div>
                                        </div>
                                    </Link>
                                </AnimWrapper>
                            ))}
                        </div>
                    )}

                    <div className="mt-16 pt-10 border-t border-zinc-100 text-center">
                        <Link href="/labo" className="text-sm font-black uppercase text-zinc-400 hover:text-[#FF6B00] transition tracking-widest">
                            ← Toutes les catégories
                        </Link>
                    </div>
                </div>
            </section>
        </>
    );
}
