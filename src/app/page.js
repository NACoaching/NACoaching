import { supabase } from '@/lib/supabaseClient';
import Link from 'next/link';
import Head from 'next/head';
import Image from 'next/image';
import AnimWrapper from '@/components/AnimWrapper';
import { Award, Activity, UserCheck, HeartPulse, ChevronRight, ArrowRight } from 'lucide-react';
import HomeFAQ from '@/components/HomeFAQ';

export const revalidate = 0;

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

  // Parse global FAQs if they exist
  let globalFaqs = [];
  const faqString = siteContent.find(c => c.key === 'site_faq')?.value;
  if (faqString) {
    try {
      globalFaqs = JSON.parse(faqString);
    } catch (e) {
      console.error("Could not parse site_faq", e);
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
      <section className="relative h-[80vh] flex items-center justify-center bg-zinc-900 text-white overflow-hidden">
        <div className="absolute inset-0 z-0 opacity-50">
          <Image
            src="https://images.unsplash.com/photo-1534438327276-14e5300c3a48?q=80&w=2070&auto=format&fit=crop"
            alt="Background"
            fill
            className="object-cover grayscale"
            priority
          />
        </div>

        <div className="relative z-10 text-center px-6 max-w-4xl mx-auto">
          <AnimWrapper>
            <h1 className="text-4xl md:text-7xl font-black mb-6 uppercase tracking-tighter">
              {siteContent.find(c => c.key === 'hero_title')?.value || "La science au service de ton potentiel"}
            </h1>
          </AnimWrapper>
          <AnimWrapper delay={0.2}>
            <p className="text-xl md:text-2xl text-zinc-300 mb-10 font-light max-w-2xl mx-auto">
              {siteContent.find(c => c.key === 'hero_subtitle')?.value || "Coaching sportif haut de gamme basé sur la physiologie et la biomécanique."}
            </p>
          </AnimWrapper>
          <AnimWrapper delay={0.4}>
            <div className="flex flex-col md:flex-row gap-4 justify-center">
              <Link href="/labo" className="bg-[#FF6B00] text-black px-8 py-4 rounded font-black uppercase tracking-widest hover:bg-white transition flex items-center gap-2 justify-center group">
                {siteContent.find(c => c.key === 'hero_cta_primary_v2')?.value || "Découvrir le Labo"} <ArrowRight className="group-hover:translate-x-1 transition-transform" />
              </Link>
              <Link href="/outils" className="bg-transparent border-2 border-white px-8 py-4 rounded font-bold uppercase tracking-widest hover:bg-white hover:text-black transition">
                {siteContent.find(c => c.key === 'hero_cta_secondary_v2')?.value || "Mes outils pour toi"}
              </Link>
            </div>
          </AnimWrapper>
        </div>
      </section>

      {/* EXPERTISE BAR */}
      <section className="bg-zinc-100 py-8 md:py-12 border-b border-zinc-200">
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-2 md:grid-cols-4 gap-8">
          <AnimWrapper delay={0.1}>
            <div className="flex flex-col items-center text-center group">
              <Award className="text-[#FF6B00] mb-3 group-hover:scale-110 transition" size={32} />
              <span className="font-bold text-sm uppercase text-black">{siteContent.find(c => c.key === 'expertise_1')?.value || "Master EOPS"}</span>
            </div>
          </AnimWrapper>
          <AnimWrapper delay={0.2}>
            <div className="flex flex-col items-center text-center group">
              <Activity className="text-[#FF6B00] mb-3 group-hover:scale-110 transition" size={32} />
              <span className="font-bold text-sm uppercase text-black">{siteContent.find(c => c.key === 'expertise_2')?.value || "Expert Sport-Santé"}</span>
            </div>
          </AnimWrapper>
          <AnimWrapper delay={0.3}>
            <div className="flex flex-col items-center text-center group">
              <UserCheck className="text-[#FF6B00] mb-3 group-hover:scale-110 transition" size={32} />
              <span className="font-bold text-sm uppercase text-black">{siteContent.find(c => c.key === 'expertise_3')?.value || "Brevet Football"}</span>
            </div>
          </AnimWrapper>
          <AnimWrapper delay={0.4}>
            <div className="flex flex-col items-center text-center group">
              <HeartPulse className="text-[#FF6B00] mb-3 group-hover:scale-110 transition" size={32} />
              <span className="font-bold text-sm uppercase text-black">{siteContent.find(c => c.key === 'expertise_4')?.value || "Licence STAPS"}</span>
            </div>
          </AnimWrapper>
        </div>
      </section >

      {/* QUICK BLOG PREVIEW (LE LABO) - MOVED TO TOP */}
      < section className="py-16 md:py-24 bg-white border-b border-zinc-200" >
        <div className="max-w-7xl mx-auto px-6">
          <AnimWrapper>
            <div className="flex justify-between items-end mb-12">
              <h2 className="text-4xl font-black uppercase text-[#FF6B00]">{siteContent.find(c => c.key === 'about_title')?.value || 'Le Labo'}</h2>
              <Link href="/labo" className="text-[#FF6B00] font-bold hover:underline">Voir tout →</Link>
            </div>
          </AnimWrapper>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {articles.map((article, index) => (
              <AnimWrapper key={article.id} delay={index * 0.1}>
                <Link href={`/blog/${article.id}`} className="group block h-full">
                  <div className="bg-white rounded-lg overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 h-full border border-zinc-100 flex flex-col">
                    <div className="relative h-48 overflow-hidden">
                      <Image
                        src={article.image || "/api/placeholder/400/320"}
                        alt={article.title}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-500"
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                      />
                      <div className="absolute top-4 left-4">
                        <span className="bg-[#FF6B00] text-black text-xs font-black px-3 py-1 rounded uppercase tracking-wider">
                          {article.category}
                        </span>
                      </div>
                    </div>
                    <div className="p-6 flex flex-col flex-grow">
                      <h3 className="text-xl font-black mb-3 uppercase leading-tight text-black group-hover:text-[#FF6B00] transition-colors line-clamp-2">
                        {article.title}
                      </h3>
                      <p className="text-zinc-600 text-sm mb-4 line-clamp-3 flex-grow">
                        {article.excerpt}
                      </p>
                      <div className="flex items-center text-[#FF6B00] text-xs font-bold uppercase tracking-widest mt-auto">
                        Lire l'article <ArrowRight size={14} className="ml-2 group-hover:translate-x-2 transition-transform" />
                      </div>
                    </div>
                  </div>
                </Link>
              </AnimWrapper>
            ))}
          </div>
        </div>
      </section >

      {/* FEATURED TOOLS PREVIEW - MOVED BELOW LABO */}
      < section className="py-16 bg-zinc-50 border-b border-zinc-200" >
        <div className="max-w-7xl mx-auto px-6">
          <AnimWrapper>
            <div className="flex justify-between items-end mb-12">
              <h2 className="text-4xl font-black uppercase text-black">Mes Outils <span className="text-[#FF6B00]">Gratuits</span></h2>
              <Link href="/outils" className="text-[#FF6B00] font-bold hover:underline">Voir tout →</Link>
            </div>
          </AnimWrapper>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { title: "Calculateur 1RM", desc: "Estime ta force max théorique.", icon: "💪", href: "/outils" },
              { title: "Calculateur Calories", desc: "Défini tes besoins journaliers.", icon: "🔥", href: "/outils" },
              { title: "VMA / VO2max", desc: "Estime tes capacités aérobies.", icon: "🏃‍♂️", href: "/outils" },
              { title: "Zones Cardiaques", desc: "Tes 5 zones d'entraînement.", icon: "🫀", href: "/outils" }
            ].map((tool, i) => (
              <AnimWrapper key={i} delay={i * 0.1}>
                <Link href={tool.href} className="block group">
                  <div className="bg-white p-6 rounded-lg border border-zinc-200 hover:border-[#FF6B00] transition h-full flex flex-col hover:shadow-lg">
                    <div className="text-4xl mb-4">{tool.icon}</div>
                    <h3 className="text-lg font-black uppercase mb-2 text-black group-hover:text-[#FF6B00] transition">{tool.title}</h3>
                    <p className="text-zinc-900 text-sm mb-4 font-medium">{tool.desc}</p>
                    <div className="mt-auto text-xs font-bold uppercase tracking-widest text-[#FF6B00] flex items-center gap-2">
                      Utiliser <ArrowRight size={12} className="group-hover:translate-x-1 transition-transform" />
                    </div>
                  </div>
                </Link>
              </AnimWrapper>
            ))}
          </div>
        </div>
      </section >

      {/* FAQ SECTION */}
      < HomeFAQ faqData={globalFaqs} />

      {/* CONTACT CTA */}
      < section className="py-24 bg-zinc-900 text-white text-center" >
        <div className="max-w-3xl mx-auto px-6">
          <AnimWrapper>
            <h2 className="text-4xl font-black uppercase mb-6">{siteContent.find(c => c.key === 'contact_cta_title')?.value || "Prêt à passer au niveau supérieur ?"}</h2>
            <p className="text-zinc-400 mb-8 text-lg">
              {siteContent.find(c => c.key === 'contact_cta_text')?.value || "Besoin d'un accompagnement personnalisé ou d'une question sur un programme ? N'hésitez pas à me contacter."}
            </p>
            <Link
              href="/contact"
              className="bg-[#FF6B00] text-black font-black py-4 px-10 rounded-sm uppercase tracking-tighter hover:bg-white transition inline-block"
            >
              {siteContent.find(c => c.key === 'contact_cta_button')?.value || "Me Contacter"}
            </Link>
          </AnimWrapper>
        </div>
      </section >
    </>
  );
}
