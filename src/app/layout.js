import { Geist, Geist_Mono } from "next/font/google";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import PageTracker from "@/components/PageTracker";
import CookieBanner from "@/components/CookieBanner";
import { Analytics } from "@vercel/analytics/react"
import { SpeedInsights } from "@vercel/speed-insights/next"
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

import { supabase } from '@/lib/supabaseClient';

const siteUrl = 'https://www.na-coaching.com';

export async function generateMetadata() {
  const { data } = await supabase.from('site_content').select('*');
  const content = {};
  if (data) {
    data.forEach(item => { content[item.key] = item.value });
  }

  return {
    metadataBase: new URL(siteUrl),
    title: {
      default: "Coach Sportif Expert EOPS — Musculation, Running & Réathlétisation | NA Coaching",
      template: `%s | ${content.site_title || "NA Coaching"}`
    },
    description: content.site_description || "Coach sportif certifié Master EOPS. Outils gratuits, programmes et articles scientifiques pour la musculation, le running et la réathlétisation.",
    openGraph: {
      title: content.site_title || "NA COACHING",
      description: content.site_description || "Coaching sportif et réathlétisation par un expert Master EOPS",
      url: siteUrl,
      siteName: 'NA Coaching',
      images: [
        {
          url: content.logo_url || '/logo.png',
          width: 800,
          height: 600,
        },
      ],
      locale: 'fr_FR',
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title: content.site_title || "NA COACHING",
      description: content.site_description || "Coaching sportif et réathlétisation par un expert Master EOPS",
      images: [content.logo_url || '/logo.png'],
    },
    authors: [{ name: 'NA Coaching', url: siteUrl }],
    publisher: 'NA Coaching',
    alternates: {
      canonical: siteUrl,
    },
  };
}

export default async function RootLayout({ children }) {
  const { data } = await supabase.from('site_content').select('value').eq('key', 'logo_url').single();
  const initialLogoUrl = data?.value || '/logo.png';

  const organizationJsonLd = {
    "@context": "https://schema.org",
    "@type": "Organization",
    "name": "NA Coaching",
    "url": siteUrl,
    "logo": `${siteUrl}${initialLogoUrl}`,
    "sameAs": [
      "https://www.instagram.com/na_coaching_/",
      "https://www.youtube.com/@nacoaching"
    ],
    "description": "Expertise en musculation, running et réathlétisation par un coach Master EOPS."
  };

  return (
    <html lang="fr">
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased bg-zinc-50 font-sans text-zinc-900 selection:bg-orange-500 selection:text-white`}>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationJsonLd) }}
        />
        <PageTracker />
        <Navbar initialLogoUrl={initialLogoUrl} />
        <main className="pt-16 min-h-screen">
          {children}
        </main>
        <Footer />
        <CookieBanner />
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  );
}
