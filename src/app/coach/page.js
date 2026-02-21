import Link from 'next/link';
import AnimWrapper from '@/components/AnimWrapper';
import { supabase } from '@/lib/supabaseClient';
import { Award, BookOpen, Activity, HeartPulse, Star, ChevronRight, Dumbbell, Target, Zap, Shield } from 'lucide-react';

export const revalidate = 0;

export async function generateMetadata() {
    const { data: content } = await supabase.from('site_content').select('*');
    const get = (key, fallback) => content?.find(c => c.key === key)?.value || fallback;

    return {
        title: `${get('coach_name', 'Nolwen Albanesi')} - Coach Sportif | NA Coaching`,
        description: get('coach_meta_desc', 'Coach sportif certifié Master EOPS, spécialiste en musculation, course à pied, préparation physique hybride et réathlétisation.'),
        openGraph: {
            title: `${get('coach_name', 'Nolwen Albanesi')} - Coach Sportif | NA Coaching`,
            description: get('coach_meta_desc', 'Coach sportif Expert Master EOPS.'),
            url: 'https://na-coaching.com/coach',
            type: 'profile',
        },
        alternates: { canonical: 'https://na-coaching.com/coach' },
    };
}

// Map string icon names to Lucide components
const ICON_MAP = {
    Award, BookOpen, Activity, HeartPulse, Dumbbell, Target, Zap, Shield, Star,
};

const DEFAULT_CREDENTIALS = [
    { icon: 'Award', title: 'Master EOPS', desc: "Master Entraînement et Optimisation de la Performance Sportive — formation d'élite en sciences du sport." },
    { icon: 'HeartPulse', title: 'Expert Sport-Santé', desc: 'Spécialiste en réathlétisation et préparation physique pour les sportifs blessés ou en reprise.' },
    { icon: 'Activity', title: 'Prépa Physique Hybride', desc: 'Maîtrise des disciplines hybrides : musculation, course à pied et performance aérobie-anaérobie.' },
    { icon: 'BookOpen', title: 'Vulgarisation Scientifique', desc: 'Traduction des données scientifiques en protocoles concrets, accessibles à tous les niveaux.' },
];

const DEFAULT_VALUES = [
    { number: '01', title: 'La Science avant tout', desc: "Chaque conseil est ancré dans la littérature scientifique. Pas de méthodes à la mode, que des protocoles validés." },
    { number: '02', title: "L'Individualisation", desc: "Ton corps, tes objectifs, ta vie. Un programme générique ne fonctionne pas — chaque athlète mérite une approche sur-mesure." },
    { number: '03', title: 'La Durabilité', desc: "Performer sur le long terme sans se blesser. L'objectif n'est pas la transformation rapide, c'est la progression durable." },
];

export default async function CoachPage() {
    const { data: content } = await supabase.from('site_content').select('*');
    const get = (key, fallback) => content?.find(c => c.key === key)?.value || fallback;

    const name = get('coach_name', 'Nolwen Albanesi');
    const badge = get('coach_badge', 'Le Coach');
    const tagline = get('coach_tagline', 'Master EOPS · Coach Sportif Expert · Spécialiste Performance & Réathlétisation');
    const description = get('coach_description', `Ma mission : appliquer les données de la science du sport pour t'aider à progresser durablement, sans te blesser.`);
    const ctaTitle = get('coach_cta_title', 'Prêt à Progresser ?');
    const ctaDesc = get('coach_cta_desc', 'Que tu cherches à progresser en musculation, en running ou à récupérer d\'une blessure, il existe un programme fait pour toi.');
    const philosophyTitle = get('coach_philosophy_title', 'Ma Philosophie');

    let credentials = DEFAULT_CREDENTIALS;
    const credRaw = get('coach_credentials', '');
    if (credRaw) { try { credentials = JSON.parse(credRaw); } catch { } }

    let values = DEFAULT_VALUES;
    const valRaw = get('coach_values', '');
    if (valRaw) { try { values = JSON.parse(valRaw); } catch { } }

    const personJsonLd = {
        '@context': 'https://schema.org',
        '@type': 'Person',
        name,
        jobTitle: 'Coach Sportif Expert',
        description: get('coach_meta_desc', 'Coach sportif certifié Master EOPS.'),
        url: 'https://na-coaching.com/coach',
        image: 'https://na-coaching.com/logo.png',
        sameAs: ['https://www.instagram.com/na_coaching_'],
        knowsAbout: ['Musculation', 'Course à pied', 'Préparation physique hybride', 'Réathlétisation', 'Physiologie du sport', 'Biomécanique'],
        alumniOf: { '@type': 'EducationalOrganization', name: 'Master EOPS — Entraînement et Optimisation de la Performance Sportive' },
        worksFor: { '@type': 'LocalBusiness', name: 'NA Coaching', url: 'https://na-coaching.com' },
    };

    return (
        <>
            <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(personJsonLd) }} />

            {/* HERO */}
            <section className="pt-32 pb-0 bg-black text-white overflow-hidden">
                <div className="max-w-7xl mx-auto px-6">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-end">
                        <AnimWrapper>
                            <p className="text-[#FF6B00] font-black uppercase tracking-widest text-sm mb-4">{badge}</p>
                            <h1 className="text-6xl md:text-8xl font-black uppercase leading-none mb-6">
                                {name.split(' ')[0]}<br />
                                <span className="text-[#FF6B00]">{name.split(' ').slice(1).join(' ')}</span>
                            </h1>
                            <p className="text-zinc-300 text-lg max-w-lg leading-relaxed mb-4">{tagline}</p>
                            <p className="text-zinc-500 text-base max-w-lg leading-relaxed mb-8">{description}</p>
                            <div className="flex flex-col sm:flex-row gap-4">
                                <Link href="/contact" className="bg-[#FF6B00] text-black px-8 py-4 rounded font-black uppercase tracking-widest hover:bg-white transition flex items-center gap-2 group justify-center">
                                    Me Contacter <ChevronRight className="group-hover:translate-x-1 transition-transform" size={18} />
                                </Link>
                                <Link href="/labo" className="border border-zinc-600 text-white px-8 py-4 rounded font-bold uppercase tracking-widest hover:border-[#FF6B00] hover:text-[#FF6B00] transition justify-center text-center">
                                    Le Labo →
                                </Link>
                            </div>
                        </AnimWrapper>
                        <AnimWrapper delay={0.2} className="flex justify-center lg:justify-end">
                            <div className="relative w-72 h-96 lg:w-96 lg:h-[500px]">
                                <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent z-10 rounded-xl" />
                                <div className="absolute -inset-1 bg-[#FF6B00]/20 rounded-xl blur-xl" />
                                <div className="relative w-full h-full bg-zinc-800 rounded-xl overflow-hidden border border-zinc-700 flex items-center justify-center">
                                    <span className="text-8xl font-black text-zinc-600 select-none">NA</span>
                                </div>
                            </div>
                        </AnimWrapper>
                    </div>
                </div>
            </section>

            {/* CREDENTIALS */}
            <section className="py-24 bg-zinc-950">
                <div className="max-w-7xl mx-auto px-6">
                    <AnimWrapper>
                        <h2 className="text-3xl font-black uppercase text-white mb-12 text-center">
                            Expertises & <span className="text-[#FF6B00]">Formations</span>
                        </h2>
                    </AnimWrapper>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {credentials.map((cred, i) => {
                            const IconComponent = ICON_MAP[cred.icon] || Award;
                            return (
                                <AnimWrapper key={i} delay={i * 0.1}>
                                    <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-8 hover:border-[#FF6B00]/50 transition group">
                                        <IconComponent size={32} className="text-[#FF6B00] mb-4 group-hover:scale-110 transition" />
                                        <h3 className="text-xl font-black uppercase text-white mb-3">{cred.title}</h3>
                                        <p className="text-zinc-400 text-sm leading-relaxed">{cred.desc}</p>
                                    </div>
                                </AnimWrapper>
                            );
                        })}
                    </div>
                </div>
            </section>

            {/* PHILOSOPHY */}
            <section className="py-24 bg-white">
                <div className="max-w-7xl mx-auto px-6">
                    <AnimWrapper>
                        <div className="text-center mb-16">
                            <h2 className="text-4xl font-black uppercase text-black mb-4">{philosophyTitle.split(' ')[0]} <span className="text-[#FF6B00]">{philosophyTitle.split(' ').slice(1).join(' ')}</span></h2>
                            <p className="text-zinc-500 max-w-xl mx-auto">Trois piliers fondamentaux guident chaque programme, chaque conseil, chaque accompagnement.</p>
                        </div>
                    </AnimWrapper>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {values.map((val, i) => (
                            <AnimWrapper key={i} delay={i * 0.15}>
                                <div className="relative p-8 border-l-4 border-[#FF6B00] bg-zinc-50 rounded-r-xl">
                                    <div className="text-6xl font-black text-zinc-100 absolute top-4 right-6 select-none">{val.number}</div>
                                    <h3 className="text-xl font-black uppercase text-black mb-3 relative z-10">{val.title}</h3>
                                    <p className="text-zinc-500 text-sm leading-relaxed relative z-10">{val.desc}</p>
                                </div>
                            </AnimWrapper>
                        ))}
                    </div>
                </div>
            </section>

            {/* CTA */}
            <section className="py-24 bg-black text-white">
                <div className="max-w-3xl mx-auto px-6 text-center">
                    <AnimWrapper>
                        <Star size={40} className="text-[#FF6B00] mx-auto mb-6" />
                        <h2 className="text-4xl font-black uppercase mb-6">{ctaTitle.split(' ').slice(0, -1).join(' ')} <span className="text-[#FF6B00]">{ctaTitle.split(' ').at(-1)}</span></h2>
                        <p className="text-zinc-400 mb-10 text-lg">{ctaDesc}</p>
                        <div className="flex flex-col sm:flex-row gap-4 justify-center">
                            <Link href="/boutique" className="bg-[#FF6B00] text-black px-8 py-4 rounded font-black uppercase tracking-widest hover:bg-white transition">
                                Voir les Programmes →
                            </Link>
                            <Link href="/contact" className="border border-zinc-600 text-white px-8 py-4 rounded font-bold uppercase tracking-widest hover:border-[#FF6B00] hover:text-[#FF6B00] transition">
                                Coaching Personnalisé
                            </Link>
                        </div>
                    </AnimWrapper>
                </div>
            </section>
        </>
    );
}
