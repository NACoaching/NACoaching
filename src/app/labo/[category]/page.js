import { supabase } from '@/lib/supabaseClient';
import Link from 'next/link';
import Image from 'next/image';
import Breadcrumb from '@/components/Breadcrumb';
import AnimWrapper from '@/components/AnimWrapper';

// Tell Next.js to render this page dynamically (categories come from the DB)
export const revalidate = 3600; // Revalidate every hour

// Generate static paths for all existing categories at build time
export async function generateStaticParams() {
    const { data } = await supabase.from('articles').select('category');
    if (!data) return [];
    const categories = [...new Set(data.map(a => a.category).filter(Boolean))];
    // Return the raw lowercase slug - Next.js handles URL encoding automatically
    return categories.map(category => ({
        category: category.toLowerCase().replace(/ /g, '-'),
    }));
}

// Generate SEO metadata dynamically per category
export async function generateMetadata({ params }) {
    const { category } = await params;
    // Next.js decodes params automatically
    const categoryName = category.replace(/-/g, ' ');
    const displayName = categoryName.charAt(0).toUpperCase() + categoryName.slice(1);

    return {
        title: `${displayName} - Le Labo NA Coaching`,
        description: `Tous les articles scientifiques de NA Coaching sur la thématique "${displayName}". Découvrez les conseils d'expert d'un Master EOPS.`,
        openGraph: {
            title: `${displayName} - Le Labo NA Coaching`,
            description: `Tous les articles NA Coaching sur : ${displayName}.`,
            url: `https://na-coaching.com/labo/${category}`,
            type: 'website',
        },
        alternates: {
            canonical: `https://na-coaching.com/labo/${category}`,
        },
    };
}

export default async function LaboCategoryPage({ params }) {
    // Next.js automatically decodes URL params, so no need for decodeURIComponent
    const { category } = await params;
    const categoryName = category.replace(/-/g, ' ');

    // Fetch all articles, filter by category (case-insensitive)
    const { data: articles } = await supabase
        .from('articles')
        .select('*')
        .ilike('category', categoryName)
        .order('created_at', { ascending: false });

    const articlesList = articles || [];

    // JSON-LD CollectionPage structured data
    const jsonLd = {
        '@context': 'https://schema.org',
        '@type': 'CollectionPage',
        name: `${categoryName} - Le Labo NA Coaching`,
        description: `Articles scientifiques sur la thématique ${categoryName} par NA Coaching.`,
        url: `https://na-coaching.com/labo/${category}`,
        hasPart: articlesList.map(article => ({
            '@type': 'Article',
            headline: article.title,
            url: `https://na-coaching.com/blog/${article.id}`,
            image: article.image,
            description: article.excerpt,
        })),
    };

    const breadcrumbItems = [
        { label: 'Accueil', href: '/' },
        { label: 'Le Labo', href: '/labo' },
        { label: categoryName.charAt(0).toUpperCase() + categoryName.slice(1) },
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
                        <h1 className="text-5xl font-black uppercase text-black mb-4">
                            {categoryName.charAt(0).toUpperCase() + categoryName.slice(1)}
                        </h1>
                        <p className="text-zinc-500 mb-12 max-w-xl">
                            {articlesList.length} article{articlesList.length > 1 ? 's' : ''} sur cette thématique — basés sur la science et l'expertise d'un Master EOPS.
                        </p>
                    </AnimWrapper>

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
                                            <h2 className="text-xl font-black uppercase leading-tight mb-3 group-hover:text-[#FF6B00] transition">{article.title}</h2>
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
