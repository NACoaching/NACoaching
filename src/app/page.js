import { supabase } from '@/lib/supabaseClient';
import Link from 'next/link';
import Head from 'next/head';
import Image from 'next/image';
import AnimWrapper from '@/components/AnimWrapper';
import { Award, Activity, UserCheck, HeartPulse, ChevronRight, ArrowRight } from 'lucide-react';
import HomeFAQ from '@/components/HomeFAQ';

export const revalidate = 3600;

export default async function HomePage() {
  const { data: articles } = await supabase.from('articles').select('*').eq('is_published', true).order('created_at', { ascending: false }).limit(3);
  const { data: content } = await supabase.from('site_content').select('*');

  const siteContent = content || [];

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'LocalBusiness',
    name: siteContent.find(c => c.key === 'site_title')?.value || 'NA Coaching',
    image: 'https://na-coaching.com/logo.png', // Fallback, update if needed
    description: siteContent.find(c => c.key === 'site_description')?.value || 'Coaching sportif et réathlétisation par un expert Master EOPS',
    url: 'https://na-coaching.com',
    telephone: siteContent.find(c => c.key === 'contact_phone')?.value || '',
    address: {
      '@type': 'PostalAddress',
      addressCountry: 'FR'
    },
    sameAs: [
      siteContent.find(c => c.key === 'social_instagram')?.value,
      siteContent.find(c => c.key === 'social_tiktok')?.value
    ].filter(Boolean)
  };

  const DEFAULT_HOME_FAQS = [
    { question: "Le coaching est-il adapté à mon sport ?", answer: "Oui, en tant que Master EOPS, j'analyse les spécificités physiologiques et biomécaniques de votre discipline (course à pied, football, triathlon...) pour créer un programme qui optimise vos performances de manière ciblée." },
    { question: "Proposez-vous des programmes de réathlétisation ?", answer: "C'est l'une de mes spécialités. Si vous sortez d'une blessure, nous établirons un protocole scientifique et progressif pour garantir un retour au sport optimal et sans risque de rechute." },
    { question: "Quand vais-je voir les premiers résultats ?", answer: "La performance prend du temps, mais avec une surcharge progressive bien calibrée, les premiers gains de force ou d'endurance se font ressentir dès 4 à 6 semaines d'entraînement sérieux." },
    { question: "Ai-je besoin de beaucoup de matériel ?", answer: "Pas obligatoirement. Que vous soyez inscrit(e) dans une salle suréquipée ou que vous vous entraîniez à la maison avec une paire d'haltères, j'adapte le programme pour respecter les principes physiologiques de progression avec ce que vous avez." },
    { question: "Proposez-vous un suivi nutritionnel ?", answer: "Je ne donne pas de plan alimentaire figé, mais je vous apprends à gérer vos macronutriments (comme le montre mon outil 'Besoins Caloriques' gratuit) pour soutenir vos nouvelles performances sportives." }
  ];

  // Parse global FAQs if they exist
  let globalFaqs = DEFAULT_HOME_FAQS;
  const faqString = siteContent.find(c => c.key === 'home_faq')?.value;
  if (faqString && faqString !== '[]') {
    try {
      const parsed = JSON.parse(faqString);
      if (parsed.length > 0) globalFaqs = parsed;
    } catch (e) {
      console.error("Could not parse home_faq", e);
    }
  }

  let faqJsonLd = null;
  if (globalFaqs.length > 0) {
    faqJsonLd = {
      '@context': 'https://schema.org',
      '@type': 'FAQPage',
      mainEntity: globalFaqs.map(faq => ({
        '@type': 'Question',
        name: faq.question,
        acceptedAnswer: {
          '@type': 'Answer',
          text: faq.answer
        }
      }))
    };
  }

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      {faqJsonLd && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
        />
      )}
      {/* HERO SECTION */}
      <section className="relative min-h-[90vh] flex items-center justify-center bg-zinc-900 text-white overflow-hidden pb-12 pt-24">
        <div className="absolute inset-0 z-0">
          <Image
            src="https://images.unsplash.com/photo-1534438327276-14e5300c3a48?q=80&w=2070&auto=format&fit=crop"
            alt="Background"
            fill
            className="object-cover opacity-40 mix-blend-luminosity"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-t from-zinc-900 via-transparent to-zinc-900/50" />
        </div>

        <div className="relative z-10 text-center px-6 max-w-5xl mx-auto">
          <AnimWrapper>
            <div className="inline-block mb-6 px-4 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-sm font-medium text-zinc-200 tracking-wide">
              Expertise & Performance
            </div>
          </AnimWrapper>
          <AnimWrapper delay={0.1}>
            <h1 className="text-5xl md:text-7xl font-bold mb-6 tracking-tight text-white drop-shadow-lg leading-tight">
              {siteContent.find(c => c.key === 'hero_title')?.value || "La science au service de ton potentiel"}
            </h1>
          </AnimWrapper>
          <AnimWrapper delay={0.3}>
            <p className="text-lg md:text-2xl text-zinc-300 mb-10 font-medium max-w-2xl mx-auto leading-relaxed">
              {siteContent.find(c => c.key === 'hero_subtitle')?.value || "Coaching sportif haut de gamme basé sur la physiologie et la biomécanique."}
            </p>
          </AnimWrapper>
          <AnimWrapper delay={0.5}>
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Link href="/labo" className="bg-[#FF6B00] text-white px-8 py-4 rounded-full font-semibold text-lg hover:bg-[#e66000] hover:scale-105 transition-all duration-300 shadow-[0_0_20px_rgba(255,107,0,0.4)] flex items-center gap-2 group">
                {siteContent.find(c => c.key === 'hero_cta_primary_v2')?.value || "Découvrir le Labo"} <ArrowRight className="group-hover:translate-x-1 transition-transform" />
              </Link>
              <Link href="/outils" className="bg-white/10 backdrop-blur-md text-white border border-white/30 px-8 py-4 rounded-full font-semibold text-lg hover:bg-white hover:text-black hover:scale-105 transition-all duration-300">
                {siteContent.find(c => c.key === 'hero_cta_secondary_v2')?.value || "Mes outils pour toi"}
              </Link>
            </div>
          </AnimWrapper>
        </div>

        {/* Decorative elements */}
        <div className="absolute bottom-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-white/20 to-transparent"></div>
      </section>

      {/* EXPERTISE BAR */}
      <section className="bg-zinc-50 py-16 md:py-24 relative z-10 -mt-8">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {[
              { icon: Award, title: siteContent.find(c => c.key === 'expertise_1')?.value || "Master EOPS" },
              { icon: Activity, title: siteContent.find(c => c.key === 'expertise_2')?.value || "Expert Sport-Santé" },
              { icon: UserCheck, title: siteContent.find(c => c.key === 'expertise_3')?.value || "Brevet Football" },
              { icon: HeartPulse, title: siteContent.find(c => c.key === 'expertise_4')?.value || "Licence STAPS" }
            ].map((exp, i) => (
              <AnimWrapper key={i} delay={i * 0.1}>
                <div className="bg-white p-6 rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-zinc-100 flex flex-col items-center text-center group hover:-translate-y-2 hover:shadow-xl transition-all duration-300 h-full">
                  <div className="w-16 h-16 rounded-2xl bg-orange-50/80 flex items-center justify-center mb-4 group-hover:scale-110 group-hover:bg-orange-100 transition-all duration-300">
                    <exp.icon className="text-[#FF6B00]" size={28} />
                  </div>
                  <h3 className="font-bold text-zinc-900 text-lg mb-1">{exp.title}</h3>
                </div>
              </AnimWrapper>
            ))}
          </div>
        </div>
      </section>

      {/* QUICK BLOG PREVIEW (LE LABO) */}
      <section className="py-20 md:py-32 bg-white relative overflow-hidden">
        {/* Soft background glow */}
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-orange-50/50 rounded-full blur-3xl opacity-50 -translate-y-1/2 translate-x-1/2 pointer-events-none"></div>

        <div className="max-w-7xl mx-auto px-6 relative z-10">
          <AnimWrapper>
            <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-6">
              <div className="max-w-2xl">
                <h2 className="text-4xl md:text-5xl font-bold text-zinc-900 tracking-tight mb-4">
                  {siteContent.find(c => c.key === 'about_title')?.value || 'Le Labo'}
                </h2>
                <p className="text-zinc-600 text-lg">
                  {siteContent.find(c => c.key === 'about_subtitle')?.value || "Découvrez les dernières avancées scientifiques appliquées à l'entraînement, la nutrition et la récupération."}
                </p>
              </div>
              <Link href="/labo" className="inline-flex items-center text-[#FF6B00] font-semibold text-lg hover:text-[#e66000] border-b-2 border-transparent hover:border-[#FF6B00] pb-1 transition-all">
                Explorer les articles <ArrowRight className="ml-2 w-5 h-5" />
              </Link>
            </div>
          </AnimWrapper>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-10">
            {articles && articles.map((article, index) => (
              <AnimWrapper key={article.id} delay={index * 0.1}>
                <Link href={`/blog/${article.slug || article.id}`} className="group block h-full">
                  <div className="bg-white rounded-[2rem] overflow-hidden shadow-[0_8px_30px_rgb(0,0,0,0.06)] hover:shadow-2xl transition-all duration-500 h-full flex flex-col hover:-translate-y-2 border border-zinc-100/50">
                    <div className="relative h-64 overflow-hidden w-full m-2 rounded-t-[1.75rem] rounded-b-xl">
                      <Image
                        src={article.image || "/api/placeholder/400/320"}
                        alt={article.title}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                      />
                      <div className="absolute top-4 left-4">
                        <span className="bg-white/90 backdrop-blur-sm text-zinc-900 text-xs font-bold px-4 py-1.5 rounded-full tracking-wide shadow-sm">
                          {article.category}
                        </span>
                      </div>
                    </div>
                    <div className="px-8 pt-6 pb-8 flex flex-col flex-grow">
                      <h3 className="text-2xl font-bold mb-3 leading-tight text-zinc-900 group-hover:text-[#FF6B00] transition-colors line-clamp-2">
                        {article.title}
                      </h3>
                      <p className="text-zinc-500 text-base mb-6 line-clamp-3 flex-grow leading-relaxed">
                        {article.excerpt}
                      </p>
                      <div className="flex items-center text-[#FF6B00] text-sm font-semibold mt-auto">
                        Lire l'article <ArrowRight size={16} className="ml-2 group-hover:translate-x-2 transition-transform" />
                      </div>
                    </div>
                  </div>
                </Link>
              </AnimWrapper>
            ))}
          </div>
        </div>
      </section>

      {/* FEATURED TOOLS PREVIEW */}
      <section className="py-20 md:py-32 bg-zinc-900 relative">
        <div className="max-w-7xl mx-auto px-6">
          <AnimWrapper>
            <div className="text-center mb-16 max-w-3xl mx-auto">
              <h2 className="text-4xl md:text-5xl font-bold text-white tracking-tight mb-4">
                Mes Outils <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#FF6B00] to-orange-300">Gratuits</span>
              </h2>
              <p className="text-zinc-400 text-lg">
                {siteContent.find(c => c.key === 'tools_subtitle')?.value || "Des calculateurs fiables basés sur la littérature scientifique pour optimiser ton entraînement."}
              </p>
            </div>
          </AnimWrapper>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { title: siteContent.find(c => c.key === 'home_tool_1_title')?.value || "Calculateur 1RM", desc: siteContent.find(c => c.key === 'home_tool_1_desc')?.value || "Estime ta force max théorique selon la méthode Brzycki ou Epley.", icon: "💪", href: "/outils" },
              { title: siteContent.find(c => c.key === 'home_tool_2_title')?.value || "Besoins Caloriques", desc: siteContent.find(c => c.key === 'home_tool_2_desc')?.value || "Défini ton métabolisme de base et tes dépenses journalières.", icon: "🔥", href: "/outils" },
              { title: siteContent.find(c => c.key === 'home_tool_3_title')?.value || "VMA & VO2max", desc: siteContent.find(c => c.key === 'home_tool_3_desc')?.value || "Évalue tes capacités aérobies pour mieux cibler tes efforts.", icon: "🏃‍♂️", href: "/outils" },
              { title: siteContent.find(c => c.key === 'home_tool_4_title')?.value || "Zones Cardiaques", desc: siteContent.find(c => c.key === 'home_tool_4_desc')?.value || "Cible tes 5 zones d'entraînement via la méthode Karvonen.", icon: "🫀", href: "/outils" }
            ].map((tool, i) => (
              <AnimWrapper key={i} delay={i * 0.1}>
                <Link href={tool.href} className="block group h-full">
                  <div className="bg-zinc-800/50 backdrop-blur-sm p-8 rounded-3xl border border-zinc-700/50 hover:border-[#FF6B00]/50 transition-all duration-300 h-full flex flex-col hover:bg-zinc-800 hover:-translate-y-2">
                    <div className="text-4xl mb-6 bg-zinc-900 w-16 h-16 rounded-2xl flex items-center justify-center shadow-inner">{tool.icon}</div>
                    <h3 className="text-xl font-bold mb-3 text-white group-hover:text-[#FF6B00] transition-colors">{tool.title}</h3>
                    <p className="text-zinc-400 text-sm mb-6 leading-relaxed flex-grow">{tool.desc}</p>
                    <div className="mt-auto text-sm font-semibold text-[#FF6B00] flex items-center gap-2">
                      Utiliser l'outil <ArrowRight size={16} className="group-hover:translate-x-2 transition-transform opacity-0 group-hover:opacity-100 -ml-4 group-hover:ml-0" />
                    </div>
                  </div>
                </Link>
              </AnimWrapper>
            ))}
          </div>

          <AnimWrapper delay={0.4}>
            <div className="mt-12 text-center">
              <Link href="/outils" className="inline-flex items-center text-white font-medium hover:text-[#FF6B00] transition-colors">
                Voir tous les outils <ChevronRight className="ml-1" size={20} />
              </Link>
            </div>
          </AnimWrapper>
        </div>
      </section>

      {/* FAQ SECTION */}
      <div className="bg-white">
        <HomeFAQ faqData={globalFaqs} />
      </div>

      {/* CONTACT CTA */}
      <section className="py-32 bg-zinc-50 relative overflow-hidden">
        {/* Soft geometric shapes */}
        <div className="absolute top-0 right-0 -translate-y-1/2 translate-x-1/3 w-[800px] h-[800px] bg-gradient-to-br from-orange-100 to-transparent rounded-full opacity-50 pointer-events-none"></div>
        <div className="absolute bottom-0 left-0 translate-y-1/2 -translate-x-1/3 w-[600px] h-[600px] bg-gradient-to-tr from-zinc-200 to-transparent rounded-full opacity-50 pointer-events-none"></div>

        <div className="max-w-4xl mx-auto px-6 relative z-10 text-center">
          <AnimWrapper>
            <span className="text-[#FF6B00] font-bold tracking-wider uppercase text-sm mb-4 block">Prêt à commencer ?</span>
            <h2 className="text-4xl md:text-6xl font-bold mb-8 text-zinc-900 tracking-tight leading-tight">
              {siteContent.find(c => c.key === 'contact_cta_title')?.value || "Passe Master de ton propre entraînement."}
            </h2>
            <p className="text-zinc-600 mb-10 text-xl max-w-2xl mx-auto leading-relaxed">
              {siteContent.find(c => c.key === 'contact_cta_text')?.value || "Besoin d'un accompagnement personnalisé ou d'une question sur un programme ? N'hésitez pas à me contacter."}
            </p>
            <Link
              href="/contact"
              className="bg-zinc-900 text-white font-semibold py-4 px-12 rounded-full text-lg hover:bg-[#FF6B00] hover:shadow-lg hover:-translate-y-1 transition-all duration-300 inline-block"
            >
              {siteContent.find(c => c.key === 'contact_cta_button')?.value || "Me Contacter"}
            </Link>
          </AnimWrapper>
        </div>
      </section>
    </>
  );
}
