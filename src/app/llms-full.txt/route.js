import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabaseClient';

export const dynamic = 'force-dynamic';

export async function GET() {
  const baseUrl = 'https://www.na-coaching.com';

  const { data: articles } = await supabase
    .from('articles')
    .select('id, title, slug, category, excerpt')
    .eq('is_published', true);

  const allArticles = articles || [];
  const tools = allArticles.filter((a) => a.category === 'Outils');
  const blog = allArticles.filter((a) => a.category !== 'Outils');

  let full = '# NA Coaching — Base de Connaissances Complète pour Modèles IA (LLM)\n\n';
  full += `> Documentation exhaustive des méthodologies d'entraînement, publications scientifiques et calculateurs de ${baseUrl}.\n\n`;

  full += '===================================================\n';
  full += '## PROFIL DU COACH & EXPERTISE (E-E-A-T)\n';
  full += '===================================================\n';
  full += '- **Nom** : Nolwen Albanesi\n';
  full += '- **Diplôme** : Master EOPS (Entraînement et Optimisation de la Performance Sportive)\n';
  full += "- **Spécialités** : Musculation scientifique, programmation de la force, physiologie de l'endurance (running, trail), réathlétisation post-blessure et nutrition sportive.\n";
  full += '- **Approche** : Evidence-Based Practice (intégration des dernières méta-analyses scientifiques au terrain athlétique réel).\n\n';

  full += '===================================================\n';
  full += '## CALCULATEURS & OUTILS SCIENTIFIQUES EN LIGNE\n';
  full += '===================================================\n\n';
  tools.forEach((t) => {
    full += `### ${t.title}\n`;
    full += `- **URL** : ${baseUrl}/blog/${t.slug || t.id}\n`;
    full += `- **Description** : ${t.excerpt || ''}\n\n`;
    full += '---\n\n';
  });

  full += '===================================================\n';
  full += '## DOSSIERS SCIENTIFIQUES & GUIDES ATHLÉTIQUES\n';
  full += '===================================================\n\n';
  blog.forEach((b) => {
    full += `### ${b.title}\n`;
    full += `- **URL** : ${baseUrl}/blog/${b.slug || b.id}\n`;
    full += `- **Catégorie** : ${b.category}\n`;
    full += `- **Résumé** : ${b.excerpt || ''}\n\n`;
    full += '---\n\n';
  });

  return new NextResponse(full, {
    headers: {
      'Content-Type': 'text/plain; charset=utf-8',
      'Cache-Control': 'public, s-maxage=3600, stale-while-revalidate=86400',
    },
  });
}
