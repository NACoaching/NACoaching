// --- DONNÉES SIMULÉES (Facile à modifier pour tes futurs articles) ---
export const ARTICLES = [
    {
        id: 1,
        category: "Pathologie",
        title: "Lésion des croisés : l'approche EOPS pour une reprise sécurisée.",
        excerpt: "Pourquoi 25% des sportifs se blessent de nouveau après une opération ? Analyse des facteurs de risque neuro-cognitifs.",
        content: `
      En tant que diplômé Master EOPS, l'analyse du LCA (Ligament Croisé Antérieur) est un sujet majeur. La science nous montre que la rééducation classique se concentre souvent trop sur le muscle et pas assez sur le cerveau. 
      
      Dans cet article, nous explorons :
      1. La symétrie de force quadriceps/ischios (Ratio H/Q).
      2. Le déficit d'attention visuelle lors de la reprise d'appui.
      3. Pourquoi les tests de "Return to Play" doivent être validés par la data.
      
      L'objectif n'est pas juste de courir, mais d'être "terrain-ready".
    `,
        image: "https://images.unsplash.com/photo-1517836357463-d25dfeac3438?q=80&w=2070&auto=format&fit=crop",
        date: "15 Fév 2024",
        cta: "Pack Genou Strong"
    },
    {
        id: 2,
        category: "Santé",
        title: "Perte de poids durable : pourquoi la science invalide les régimes flash.",
        excerpt: "Comprendre le NEAT et l'adaptation métabolique pour arrêter l'effet yoyo une bonne fois pour toutes.",
        content: `
      La perte de gras n'est pas une simple soustraction de calories. C'est une gestion hormonale et métabolique. 
      
      Le muscle est votre organe métabolique numéro 1. Plus vous avez de masse active, plus votre métabolisme de base est élevé. Dans cet article vulgarisé, je vous explique comment la musculation, alliée à une augmentation du NEAT (activité non-sportive), est la seule clé d'un changement pérenne.
    `,
        image: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?q=80&w=2070&auto=format&fit=crop",
        date: "12 Fév 2024",
        cta: "Dos d'Acier"
    },
    {
        id: 3,
        category: "Performance",
        title: "Optimisation de la VMA : les secrets de la périodisation.",
        excerpt: "Comment structurer vos blocs d'entraînement pour éviter le surentraînement et maximiser vos gains.",
        content: `
      La VMA est un indicateur, pas une finalité. Pour progresser en course à pied ou en sport collectif, la périodisation de la charge de travail est essentielle. 
      
      L'expertise EOPS nous apprend à jongler entre intensité et volume. Apprenez à identifier vos zones cibles et pourquoi la récupération fait partie intégrante de votre progression.
    `,
        image: "https://images.unsplash.com/photo-1461896836934-ffe607ba8211?q=80&w=2070&auto=format&fit=crop",
        date: "10 Fév 2024",
        cta: "Pack Performance"
    },
    {
        id: 4,
        category: "Nutrition",
        title: "Le mythe des protéines : quelle quantité réelle pour l'hypertrophie ?",
        excerpt: "Faut-il vraiment 2g par kilo de poids de corps ? Ce que disent les dernières méta-analyses sur l'absorption protéique.",
        content: `
      On entend tout et n'importe quoi sur les protéines. 
      
      En réalité, pour la majorité des pratiquants naturels, dépasser 1.6g/kg n'apporte aucun bénéfice supplémentaire pour la construction musculaire.
      
      Ce qui compte vraiment :
      1. Le total calorique.
      2. La répartition des prises (Timing).
      3. La qualité des sources (Leucine threshold).
    `,
        image: "https://images.unsplash.com/photo-1490645935967-10de6ba17061?q=80&w=2070&auto=format&fit=crop",
        date: "18 Fév 2024",
        cta: "Suivi Nutrition"
    }
];

export const EBOOKS = [
    {
        id: "genou-strong",
        title: "Pack Genou Strong",
        price: "34,90€",
        description: "Le protocole de réathlétisation et prévention complet basé sur les dernières études scientifiques.",
        features: ["Plan de 12 semaines", "Vidéos démo", "Tests de progression"],
        stripeUrl: "#" // Remplace par ton lien Stripe
    },
    {
        id: "dos-acier",
        title: "Dos d'Acier",
        price: "29,00€",
        description: "Éliminez les douleurs lombaires par le mouvement et le renforcement spécifique.",
        features: ["Routine 15 min/jour", "Vulgarisation anatomique", "Accès à vie"],
        stripeUrl: "#" // Remplace par ton lien Stripe
    }
];
