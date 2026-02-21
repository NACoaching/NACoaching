const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

const tool = {
    title: "Prédicteur de Performance Running",
    excerpt: "Estimez vos temps sur 5km, 10km, Semi-Marathon et Marathon à partir d'une performance de référence. Basé sur la formule de Riegel.",
    content: `<h2>La Formule de Riegel</h2>
<p>Développée par Peter Riegel, cette formule est devenue la référence mondiale pour prédire les performances sur différentes distances en endurance. Elle repose sur le principe de l'endurance spécifique : la vitesse diminue progressivement à mesure que la distance augmente.</p>
<h3>Comment utiliser ce prédicteur ?</h3>
<ul>
    <li>Entrez votre meilleure performance récente sur une distance connue.</li>
    <li>L'outil calcule instantanément vos chronos potentiels sur les autres distances.</li>
    <li>Utilisez ces temps pour définir vos objectifs de course et vos allures d'entraînement.</li>
</ul>
<p><strong>Note :</strong> Ces prédictions supposent que vous suiviez un entraînement spécifiquement adapté à la distance visée (prépa marathon pour un marathon, etc.).</p>`,
    category: "Outils",
    cta: "/outils/predictateur-performance",
    is_published: false,
    image: "https://images.unsplash.com/photo-1476480862126-209bfaa8edc8?q=80&w=1770&auto=format&fit=crop",
    date: "Février 2026"
};

async function seedRacePredictor() {
    console.log(`Seeding Race Predictor tool...`);
    const { data, error } = await supabase.from('articles').insert([tool]).select();

    if (error) {
        console.error('Error seeding tool:', error);
    } else {
        console.log('Success! Race Predictor added as draft:', data[0].title);
    }
}

seedRacePredictor();
