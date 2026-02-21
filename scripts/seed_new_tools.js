const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

async function seedTools() {
    const tools = [
        {
            title: "Calculateur ACWR (Charge d'Entraînement)",
            excerpt: "Prévoyez le surentraînement et les blessures en calculant votre ratio de charge aiguë / chronique.",
            content: "## Pourquoi l'ACWR est indispensable ?\nL'Acute:Chronic Workload Ratio est utilisé par les plus grands clubs de sport pro (Premier League, NBA) pour gérer la fatigue des athlètes. Il permet de voir d'un coup d'œil si votre progression est trop rapide ou si vous risquez une blessure de fatigue.\n\n### Comment l'interpréter ?\n- **0.8 - 1.3** : La zone optimale (Sweet Spot).\n- **> 1.5** : Risque de blessure multiplié par 2.",
            cta: "/outils/acwr",
            category: "Outils",
            is_published: false,
            image: "https://images.unsplash.com/photo-1576678927484-cc907957088c?q=80&w=1974&auto=format&fit=crop",
            date: "Février 2026"
        },
        {
            title: "Score de Récupération & Readiness",
            excerpt: "Un questionnaire rapide basé sur la science pour savoir s'il faut pousser ou lever le pied aujourd'hui.",
            content: "## Écouter ton corps avec de la donnée\nS'entraîner dur est nécessaire, mais s'entraîner quand on est en zone rouge est contre-productif. Cet outil utilise l'échelle de Hooper-Mackinnon pour quantifier ton état de forme interne.\n\n### Les piliers du score :\n1. Qualité du sommeil\n2. Niveau de stress\n3. Courbatures\n4. Humeur\n5. Fatigue générale",
            cta: "/outils/score-recuperation",
            category: "Outils",
            is_published: false,
            image: "https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?q=80&w=2040&auto=format&fit=crop",
            date: "Février 2026"
        },
        {
            title: "Calculateur de Macros Avancé",
            excerpt: "Optimisez votre nutrition avec une répartition précise des protéines et lipides selon votre morphologie.",
            content: "## La précision nutritionnelle\nContrairement aux calculateurs classiques qui donnent des pourcentages arbitraires, cet outil se base sur ton poids de corps pour fixer les éléments structuraux (protéines et lipides). Les glucides servent ensuite de variable d'ajustement.\n\n### Recommandations :\n- **Protéines** : 1.6g à 2.2g par kg de poids de corps.\n- **Lipides** : 0.8g à 1.2g par kg pour la santé hormonale.",
            cta: "/outils/macros-avancees",
            category: "Outils",
            is_published: false,
            image: "https://images.unsplash.com/photo-1490645935967-10de6ba17061?q=80&w=1770&auto=format&fit=crop",
            date: "Février 2026"
        }
    ];

    console.log('Seeding new tools as drafts...');
    const { data, error } = await supabase.from('articles').insert(tools).select();

    if (error) {
        console.error('Error seeding tools:', error);
    } else {
        console.log('Tools seeded successfully:', data.map(t => t.title));
    }
}

seedTools();
