const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

const articles = [
    {
        title: "Discipline vs Motivation : Lequel construit des champions ?",
        excerpt: "Pourquoi compter sur la motivation est l'erreur n°1 des débutants et comment automatiser ses progrès.",
        content: "## Structure suggérée :\n1. Le mythe de la motivation constante.\n2. La psychologie de l'habitude (système 1 vs système 2).\n3. L'environnement : Ton meilleur allié ou pire ennemi.\n4. Comment rester constant quand on n'a 'pas envie'.\n\n### Concept clé :\n- La règle des 2 minutes pour démarrer une séance.",
        category: "Mental",
        is_published: false,
        image: "https://images.unsplash.com/photo-1552674605-db6ffd4facb5?q=80&w=1770&auto=format&fit=crop",
        date: "Février 2026"
    },
    {
        title: "Entraînement en excentrique : Le secret de la force brute",
        excerpt: "Découvrez pourquoi freiner la charge peut être plus productif que de simplement la soulever.",
        content: "## Structure suggérée :\n1. Qu'est-ce que la phase excentrique ?\n2. Les adaptations structurelles (tendons et sarcomères).\n3. Protocole 'Heavy Negative' pour les plateaux.\n4. Risques et gestion des courbatures (DOMS).\n\n### Avantage :\n- Renforcement majeur des tissus conjonctifs.",
        category: "Musculation",
        is_published: false,
        image: "https://images.unsplash.com/photo-1541534741688-6078c65b5a33?q=80&w=1770&auto=format&fit=crop",
        date: "Février 2026"
    },
    {
        title: "Trail Running : Gérer les montées et les descentes",
        excerpt: "Techniques spécifiques et préparation physique pour briller sur les sentiers techniques.",
        content: "## Structure suggérée :\n1. La biomécanique de la montée (utilisation des bâtons).\n2. L'art de la descente : Économiser ses quadriceps.\n3. Travail de proprioception et stabilité de cheville.\n4. Nutrition spécifique pour les efforts longs en altitude.",
        category: "Running",
        is_published: false,
        image: "https://images.unsplash.com/photo-1533038590840-1cde6e668a91?q=80&w=1887&auto=format&fit=crop",
        date: "Février 2026"
    },
    {
        title: "VO2max : L'indicateur n°1 de la longévité ?",
        excerpt: "Analyse du lien entre capacité aérobie et espérance de vie en bonne santé (Healthspan).",
        content: "## Structure suggérée :\n1. Qu'est-ce que la VO2max réellement ?\n2. Les données de Peter Attia sur la mortalité toutes causes confondues.\n3. Comment tester sa VO2max (Test de Cooper ou Labo).\n4. Programmation pour une longévité athlétique.",
        category: "Science",
        is_published: false,
        image: "https://images.unsplash.com/photo-1517438476312-10d79c67750d?q=80&w=1770&auto=format&fit=crop",
        date: "Février 2026"
    },
    {
        title: "Mobilité de bureau : L'anti-guide de la sédentarité",
        excerpt: "5 exercices de 30 secondes à faire au travail pour sauver ton dos et tes hanches.",
        content: "## Structure suggérée :\n1. Le syndrome des fléchisseurs de hanche raccourcis.\n2. Amnésie fessière : Pourquoi tu ne sens plus tes muscles.\n3. Routine d'étirement dynamique sur chaise.\n4. L'importance des 'breaks' de mouvement.",
        category: "Mobilité",
        is_published: false,
        image: "https://images.unsplash.com/photo-1499750310107-5fef28a66643?q=80&w=1770&auto=format&fit=crop",
        date: "Février 2026"
    },
    {
        title: "BFR Training (Occlusion) : Hypertrophie sans charges lourdes",
        excerpt: "Comment le Blood Flow Restriction peut aider à maintenir du muscle pendant une blessure.",
        content: "## Structure suggérée :\n1. Science du BFR : Hypoxie et recrutement des fibres rapides.\n2. Protocole de serrage (pression).\n3. Cas d'utilisation : Rééducation et fin de séance.\n4. Précautions de sécurité indispensables.",
        category: "Science",
        is_published: false,
        image: "https://images.unsplash.com/photo-1583454110551-21f2fa2adfcd?q=80&w=1770&auto=format&fit=crop",
        date: "Février 2026"
    },
    {
        title: "Voyage et Entraînement : Comment rester fit en déplacement ?",
        excerpt: "Stratégies minimalistes pour garder ses gains avec le poids du corps et des élastiques.",
        content: "## Structure suggérée :\n1. Priorité au maintien vs Progression.\n2. Séance type 20 min sans matériel.\n3. Gérer l'alimentation au restaurant ou à l'hôtel.\n4. Récupération et jet lag.",
        category: "Entraînement",
        is_published: false,
        image: "https://images.unsplash.com/photo-1436491865332-7a61a109cc05?q=80&w=1770&auto=format&fit=crop",
        date: "Février 2026"
    },
    {
        title: "Psychologie du PR : Le mental derrière le barre",
        excerpt: "Comment se préparer psychologiquement à tenter un nouveau record personnel.",
        content: "## Structure suggérée :\n1. Visualisation et ancrage.\n2. Le dialogue interne (Self-talk).\n3. Gérer l'adrénaline et le stress de la charge.\n4. L'importance du rituel pré-levée.",
        category: "Mental",
        is_published: false,
        image: "https://images.unsplash.com/photo-1517836357463-d25dfeac3438?q=80&w=1770&auto=format&fit=crop",
        date: "Février 2026"
    },
    {
        title: "Jeûne Intermittent et Sport : Ami ou Ennemi ?",
        excerpt: "Avantages métaboliques vs performance pure. Qui devrait l'utiliser ?",
        content: "## Structure suggérée :\n1. Impact sur l'insuline et l'hormone de croissance.\n2. Le problème du timing des nutriments pour la prise de muscle.\n3. Jeûne et endurance : Autophagie et flexibilité métabolique.\n4. Conclusion : Pour qui est-ce réellement fait ?",
        category: "Nutrition",
        is_published: false,
        image: "https://images.unsplash.com/photo-1490818387583-1baba5e638af?q=80&w=1932&auto=format&fit=crop",
        date: "Février 2026"
    },
    {
        title: "Cluster Sets : Dépasser ses limites de force",
        excerpt: "Une technique avancée pour manipuler la densité d'entraînement et soulever plus lourd, plus souvent.",
        content: "## Structure suggérée :\n1. Définition des Cluster Sets (pauses intra-série).\n2. Avantages sur la vitesse de barre et la technique.\n3. Exemples de protocoles (Polsquin, etc.).\n4. Intégration dans une phase de force maximale.",
        category: "Musculation",
        is_published: false,
        image: "https://images.unsplash.com/photo-1526506118085-60ce8714f8c5?q=80&w=1887&auto=format&fit=crop",
        date: "Février 2026"
    }
];

async function seedMoreInspiration() {
    console.log(`Seeding ${articles.length} additional draft articles...`);
    const { data, error } = await supabase.from('articles').insert(articles).select();

    if (error) {
        console.error('Error seeding articles:', error);
    } else {
        console.log('Success! More articles added as drafts:', data.map(a => a.title));
    }
}

seedMoreInspiration();
