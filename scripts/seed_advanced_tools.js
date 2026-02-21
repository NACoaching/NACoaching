const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

const tools = [
    {
        title: "Convertisseur RPE / % 1RM",
        excerpt: "Traduisez votre effort perçu (RPE) en pourcentage théorique de votre force maximale. L'outil indispensable pour programmer vos séances de musculation avec précision.",
        content: `<h2>Pourquoi utiliser le RPE ?</h2>
<p>L'échelle RPE (Rate of Perceived Exertion) permet d'ajuster l'intensité de votre séance en fonction de votre état de forme du jour (auto-régulation). Cet outil utilise la table de Mike Tuchscherer pour estimer votre pourcentage de 1RM.</p>
<h3>Comment lire les résultats ?</h3>
<ul>
    <li><strong>RPE 10 :</strong> Échec maximal, aucune répétition de plus.</li>
    <li><strong>RPE 9 :</strong> Il restait 1 répétition en réserve (RIR 1).</li>
    <li><strong>RPE 8 :</strong> Il restait 2 répétitions en réserve (RIR 2).</li>
</ul>`,
        category: "Outils",
        cta: "/outils/rpe-1rm",
        is_published: false,
        image: "https://images.unsplash.com/photo-1541534741688-6078c65b5a33?q=80&w=1770&auto=format&fit=crop",
        date: "Février 2026"
    },
    {
        title: "Calculateur de Volume Effectif",
        excerpt: "Analysez votre volume d'entraînement hebdomadaire muscle par muscle. Assurez-vous d'être dans la zone optimale pour l'hypertrophie sans risquer le surentraînement.",
        content: `<h2>La Science du Volume</h2>
<p>La recherche montre qu'il existe une relation en "U inversé" entre le volume d'entraînement et les gains de muscle. Trop peu de volume ne stimule pas assez, trop de volume empêche la récupération.</p>
<h3>Les paliers de Dr. Mike Israetel :</h3>
<ul>
    <li><strong>MV (Maintenance Volume) :</strong> Volume minimal pour conserver ses acquis (souvent 4-6 séries).</li>
    <li><strong>MEV (Minimum Effective Volume) :</strong> Le seuil à partir duquel on commence à progresser.</li>
    <li><strong>MAV (Maximum Adaptive Volume) :</strong> La zone "Goldilocks" pour un gain maximal (souvent entre 12 et 20 séries).</li>
    <li><strong>MRV (Maximum Recoverable Volume) :</strong> La limite avant le surentraînement.</li>
</ul>`,
        category: "Outils",
        cta: "/outils/volume-effectif",
        is_published: false,
        image: "https://images.unsplash.com/photo-1517836357463-d25dfeac3438?q=80&w=1770&auto=format&fit=crop",
        date: "Février 2026"
    },
    {
        title: "Test de VMA Indirect (6 min)",
        excerpt: "Calculez votre Vitesse Maximale Aérobie (VMA) et estimez votre VO2max avec précision grâce à ce test de terrain simple et efficace.",
        content: `<h2>Le Test Demi-Cooper</h2>
<p>Le test de 6 minutes est l'un des moyens les plus fiables pour estimer sa VMA sans matériel de laboratoire. La distance parcourue en 6 minutes (en mètres) divisée par 100 vous donne votre VMA en km/h.</p>
<h3>Pourquoi connaître sa VMA ?</h3>
<p>La VMA est le socle de toute programmation en running. Elle permet de définir vos allures de seuil, de fractionné et d'endurance fondamentale pour progresser scientifiquement.</p>`,
        category: "Outils",
        cta: "/outils/test-demi-cooper",
        is_published: false,
        image: "https://images.unsplash.com/photo-1476480862126-209bfaa8edc8?q=80&w=1770&auto=format&fit=crop",
        date: "Février 2026"
    }
];

async function seedAdvancedTools() {
    console.log(`Seeding ${tools.length} advanced tools...`);
    const { data, error } = await supabase.from('articles').insert(tools).select();

    if (error) {
        console.error('Error seeding advanced tools:', error);
    } else {
        console.log('Success! Advanced tools added as drafts:', data.map(t => t.title));
    }
}

seedAdvancedTools();
