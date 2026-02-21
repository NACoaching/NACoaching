const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

const articles = [
    {
        title: "L'entraînement Hybride : Science et Planification",
        excerpt: "Comment concilier force et endurance sans compromettre ses gains ? Découvrez le phénomène de l'interférence.",
        content: "## Structure suggérée :\n1. Le concept d'entraînement hybride.\n2. L'effet d'interférence : Mythe ou réalité ?\n3. Comment structurer sa semaine (musculation + running).\n4. La gestion de la fatigue nerveuse.\n\n### Points clés :\n- Isoler les séances intenses.\n- Privilégier la basse intensité pour le cardio.",
        category: "Entraînement",
        is_published: false,
        image: "https://images.unsplash.com/photo-1517836357463-d25dfeac3438?q=80&w=1770&auto=format&fit=crop",
        date: "Février 2026"
    },
    {
        title: "Protéines : Pourquoi 2g/kg est le 'Sweet Spot'",
        excerpt: "Analyse des dernières méta-analyses sur l'hypertrophie et la synthèse protéique musculaire.",
        content: "## Structure suggérée :\n1. Synthèse protéique vs Dégradation.\n2. Les besoins selon l'âge et le niveau.\n3. Protéines animales vs végétales.\n4. La leucine et le seuil anabolique.\n\n### Études à citer :\n- Schoenfeld & Aragon (2018).\n- Morton et al. (2018).",
        category: "Nutrition",
        is_published: false,
        image: "https://images.unsplash.com/photo-1532384748853-8f54a8f476e2?q=80&w=1770&auto=format&fit=crop",
        date: "Février 2026"
    },
    {
        title: "VMA vs Seuil : Comment booster son endurance ?",
        excerpt: "Comprendre les zones d'intensité pour ne plus courir 'dans le vide' et progresser réellement en running.",
        content: "## Structure suggérée :\n1. Définition de la VMA (Vitesse Maximale Aérobie).\n2. Le seuil ventilatoire 1 et 2.\n3. Pourquoi l'endurance fondamentale est la base (80/20).\n4. Exemples de séances de fractionné.\n\n### Outil lié :\n- Utiliser le convertisseur VMA présent sur le site.",
        category: "Running",
        is_published: false,
        image: "https://images.unsplash.com/photo-1476480862126-209bfaa8edc8?q=80&w=1770&auto=format&fit=crop",
        date: "Février 2026"
    },
    {
        title: "La science de la récupération : Bain froid ou Sommeil ?",
        excerpt: "Trier le vrai du faux sur les méthodes de récupération moderne. Que dit réellement la science ?",
        content: "## Structure suggérée :\n1. Le sommeil : Le levier n°1 (stades de sommeil et testostérone).\n2. Cryothérapie et bains froids : Attention à l'hypertrophie.\n3. Compression et massages : Récupération active.\n4. Nutrition post-effort.\n\n### Note :\n- Le bain froid juste après la muscu peut freiner les gains.",
        category: "Récupération",
        is_published: false,
        image: "https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?q=80&w=1770&auto=format&fit=crop",
        date: "Février 2026"
    },
    {
        title: "Périodisation Ondulatoire vs Linéaire",
        excerpt: "Quelle méthode choisir pour ne plus stagner sous la barre et continuer de progresser en force ?",
        content: "## Structure suggérée :\n1. Rappel sur la surcharge progressive.\n2. Périodisation linéaire (Western).\n3. Périodisation ondulatoire (DUP) : Pourquoi c'est l'avenir ?\n4. Comment intégrer des blocs de décharge (Deload).",
        category: "Musculation",
        is_published: false,
        image: "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?q=80&w=1770&auto=format&fit=crop",
        date: "Février 2026"
    },
    {
        title: "Sommeil et Performance : Le guide complet",
        excerpt: "Comment optimiser sa nuit pour exploser ses PR et mieux récupérer nerveusement.",
        content: "## Structure suggérée :\n1. Rythme circadien et hormones.\n2. L'impact de la lumière bleue et du magnésium.\n3. Température de la chambre et cycles de 90 min.\n4. Le lien entre manque de sommeil et blessures sportives.",
        category: "Science",
        is_published: false,
        image: "https://images.unsplash.com/photo-1511295742364-917535456247?q=80&w=1854&auto=format&fit=crop",
        date: "Février 2026"
    },
    {
        title: "L'importance de la mobilité en haltérophilie",
        excerpt: "Pourquoi vous n'arrivez pas à descendre en Clean ou Snatch sans arrondir le dos.",
        content: "## Structure suggérée :\n1. Dorsiflexion de la cheville : Le facteur limitant.\n2. Mobilité thoracique et OverHead Press.\n3. Ouverture de hanche.\n4. Routine de 5 min pré-séance.",
        category: "Mobilité",
        is_published: false,
        image: "https://images.unsplash.com/photo-1517838276537-2244bb01242e?q=80&w=1770&auto=format&fit=crop",
        date: "Février 2026"
    },
    {
        title: "Compléments : Focus sur la Créatine Monohydrate",
        excerpt: "L'un des seuls compléments réellement validés. Tout savoir sur le dosage et les effets.",
        content: "## Structure suggérée :\n1. Mécanisme de l'ATP-PC.\n2. Mythes (Rétention d'eau, Rein, Calvitie).\n3. Dosage : Phase de charge ou non ?\n4. Relation avec les fonctions cognitives.",
        category: "Nutrition",
        is_published: false,
        image: "https://images.unsplash.com/photo-1593094856338-3444009cd34b?q=80&w=1770&auto=format&fit=crop",
        date: "Février 2026"
    },
    {
        title: "Courir son premier Marathon : Guide de 16 semaines",
        excerpt: "De la préparation physique à la stratégie de nutrition le jour J.",
        content: "## Structure suggérée :\n1. Les prerequisites physiques.\n2. Construire le volume hebdomadaire (milage).\n3. Les sorties longues : Pourquoi et comment ?\n4. L'affûtage (Tapering) avant la course.",
        category: "Running",
        is_published: false,
        image: "https://images.unsplash.com/photo-1530549387074-d619c815ec6e?q=80&w=1770&auto=format&fit=crop",
        date: "Février 2026"
    },
    {
        title: "Stress Mécanique vs Stress Métabolique",
        excerpt: "Lequel est le plus important pour bâtir du muscle durablement ?",
        content: "## Structure suggérée :\n1. Tension mécanique : Le moteur principal.\n2. Stress métabolique : La pompe et les métabolites.\n3. Dommages musculaires : Utiles ou nuisibles ?\n4. Comment équilibrer les deux dans sa programmation.",
        category: "Musculation",
        is_published: false,
        image: "https://images.unsplash.com/photo-1541534741688-6078c65b5a33?q=80&w=1770&auto=format&fit=crop",
        date: "Février 2026"
    }
];

async function seedInspiration() {
    console.log(`Seeding ${articles.length} draft articles...`);
    const { data, error } = await supabase.from('articles').insert(articles).select();

    if (error) {
        console.error('Error seeding articles:', error);
    } else {
        console.log('Success! Articles added as drafts:', data.map(a => a.title));
    }
}

seedInspiration();
