import { Geist, Geist_Mono } from "next/font/google";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import PageTracker from "@/components/PageTracker";
import CookieBanner from "@/components/CookieBanner";
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

export async function generateMetadata() {
  const { data } = await supabase.from('site_content').select('*');
  const content = {};
  if (data) {
    data.forEach(item => { content[item.key] = item.value });
  }

  const siteUrl = 'https://na-coaching.com'; // Replace with actual domain

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
    icons: {
      icon: [
        { url: '/favicon.ico', sizes: '32x32', type: 'image/x-icon' },
        { url: '/favicon.png', sizes: '64x64', type: 'image/png' },
      ],
      shortcut: '/favicon.ico',
      apple: '/apple-icon.png',
      other: [
        { rel: 'mask-icon', url: '/favicon.png', color: '#FF6B00' },
      ],
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

  return (
    <html lang="fr">
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased bg-zinc-50 font-sans text-zinc-900 selection:bg-orange-500 selection:text-white`}>
        <PageTracker />
        <Navbar initialLogoUrl={initialLogoUrl} />
        <main className="pt-16 min-h-screen">
          {children}
        </main>
        <Footer />
        <CookieBanner />
      </body>
    </html>
  );
}
