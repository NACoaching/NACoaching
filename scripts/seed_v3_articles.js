const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

const articles = [
    {
        title: "VBT (Velocity Based Training) : L'avenir de l'auto-régulation",
        excerpt: "Découvrez comment la vitesse de la barre peut devenir votre meilleur indicateur d'intensité, bien au-delà de la charge sur la barre.",
        category: "Musculation",
        content: `<h2>Qu'est-ce que le VBT ?</h2><p>Le Velocity Based Training consiste à utiliser un capteur pour mesurer la vitesse de déplacement de la charge. C'est l'outil ultime pour ajuster son entraînement en temps réel.</p><h3>Points clés :</h3><ul><li>Rapport Vitesse / Intensité théorique.</li><li>Gérer la fatigue nerveuse jour après jour.</li><li>Identifier le moment exact où arrêter sa série.</li></ul>`,
        is_published: false,
        date: "Mars 2026"
    },
    {
        title: "Économie de course : Consommer moins pour aller plus loin",
        excerpt: "La VMA et le VO2max ne font pas tout. Apprenez à optimiser votre économie de course pour surperformer sans effort supplémentaire.",
        category: "Running",
        content: `<h2>L'Économie de Course expliquée</h2><p>L'économie de course représente l'oxygène consommé pour une vitesse donnée. Deux coureurs à la même VMA peuvent avoir des résultats drastiquement différents selon leur efficacité.</p><h3>Domaines d'action :</h3><ul><li>Biomécanique et posture.</li><li>Choix de l'équipement (Super-shoes).</li><li>Renforcement musculaire spécifique.</li></ul>`,
        is_published: false,
        date: "Mars 2026"
    },
    {
        title: "Cycle Menstruel et Performance : Adapter sa programmation",
        excerpt: "Comment la physiologie hormonale influence la force et l'endurance, et comment synchroniser son cycle avec ses blocs d'entraînement.",
        category: "Science",
        content: `<h2>Entraîner la femme athlète</h2><p>Le cycle hormonal a un impact direct sur la thermorégulation, la force contractile et le métabolisme des substrats. Ignorer ces phases, c'est se priver d'une optimisation majeure.</p><h3>Phase par phase :</h3><ul><li>Phase folliculaire : Surcharge et force.</li><li>Phase lutéale : Endurance et vigilance thermique.</li><li>Nutrition adaptée selon les fluctuations.</li></ul>`,
        is_published: false,
        date: "Mars 2026"
    },
    {
        title: "La Fenêtre Anabolique : Mythe ou Réalité ?",
        excerpt: "Faut-il vraiment prendre son shaker dans les 30 minutes après sa séance ? La science moderne répond enfin.",
        category: "Nutrition",
        content: `<h2>Timing vs Qualité totale</h2><p>Longtemps considérée comme sacrée, la fenêtre anabolique de 30 minutes est-elle vraiment déterminante pour l'hypertrophie ?</p><h3>Ce qu'on sait en 2026 :</h3><ul><li>Rôle de la protéosynthèse sur 24h-48h.</li><li>Importance du repas pré-effort.</li><li>Cas particuliers (entraînement à jeun).</li></ul>`,
        is_published: false,
        date: "Mars 2026"
    },
    {
        title: "Surcharge Progressive : 5 méthodes au-delà du poids",
        excerpt: "Bloqué sur un plateau ? Apprenez à progresser sans ajouter de disques sur la barre.",
        category: "Musculation",
        content: `<h2>Évoluer intelligemment</h2><p>La surcharge progressive ne se résume pas à l'intensité brute. Il existe plusieurs leviers pour augmenter le stimulus.</p><h3>Les leviers :</h3><ul><li>Densité d'entraînement (réduction du repos).</li><li>Temps sous tension (Tempo).</li><li>Qualité technique et amplitude de mouvement.</li></ul>`,
        is_published: false,
        date: "Mars 2026"
    },
    {
        title: "Z2 Training : Pourquoi la lenteur construit la rapidité",
        excerpt: "Le secret des athlètes d'élite : passer 80% de son temps à une allure 'facile'. Explications de la magie de la Zone 2.",
        category: "Running",
        content: `<h2>Le paradoxe de la Zone 2</h2><p>Courir lentement permet de construire un socle mitochondrial solide sans générer trop de fatigue systémique.</p><h3>Avantages :</h3><ul><li>Densité mitochondriale.</li><li>Utilisation des lipides (Fat-Max).</li><li>Volume total hebdomadaire supérieur.</li></ul>`,
        is_published: false,
        date: "Mars 2026"
    },
    {
        title: "Sodium et Endurance : Le guide de l'hydratation intra-effort",
        excerpt: "Ne buvez pas que de l'eau. Comprenez pourquoi le sel est votre meilleur allié contre les crampes et l'épuisement.",
        category: "Nutrition",
        content: `<h2>L'importance des électrolytes</h2><p>Lors d'un effort long, nous perdons plus que de l'eau. L'hyponatrémie est un risque réel pour le traileur et le marathonien.</p><h3>Stratégie :</h3><ul><li>Calculer son 'Sweat Rate'.</li><li>Apports cibles par heure (sodium/poids).</li><li>Mélange glucides/sodium optimal.</li></ul>`,
        is_published: false,
        date: "Mars 2026"
    },
    {
        title: "L'art du Deload : Pourquoi reculer pour mieux sauter",
        excerpt: "Apprenez à programmer vos semaines de récupération pour éviter le surentraînement et maximiser la surcompensation.",
        category: "Entraînement",
        content: `<h2>Dissiper la fatigue résiduelle</h2><p>Une progression linéaire n'existe pas. Le deload permet au système nerveux et aux tissus conjonctifs de se régénérer.</p><h3>Signaux d'alarme :</h3><ul><li>Baisse de la motivation et troubles du sommeil.</li><li>Diminution de la force sur des charges habituelles.</li><li>Méthodes : Volume réduit vs Intensité réduite.</li></ul>`,
        is_published: false,
        date: "Mars 2026"
    },
    {
        title: "Plyométrie : Transformer votre force en puissance",
        excerpt: "Comment les sauts et les exercices balistiques améliorent la raideur tendineuse et l'explosivité.",
        category: "Performance",
        content: `<h2>Le Cycle Étirement-Détente (SSC)</h2><p>La plyométrie permet d'utiliser l'énergie élastique de vos tendons. Indispensable pour l'athlète complet.</p><h3>Progression :</h3><ul><li>Landing mechanics (la sécurité d'abord).</li><li>Sauts extensifs vs intensifs.</li><li>Intégration dans un bloc de force.</li></ul>`,
        is_published: false,
        date: "Mars 2026"
    },
    {
        title: "Le Cortisol : L'ennemi silencieux de tes gains ?",
        excerpt: "Comprendre le rôle de 'l'hormone du stress' dans la dégradation musculaire et comment la réguler via l'entraînement.",
        category: "Science",
        content: `<h2>Ami ou Ennemi ?</h2><p>Le cortisol est essentiel à l'effort physique, mais sa chronification est dévastatrice pour le muscle et le métabolisme.</p><h3>Gestion du stress :</h3><ul><li>Équilibre Volume / Récupération.</li><li>Nutrition post-effort pour stopper le catabolisme.</li><li>Impact du sommeil sur le profil hormonal.</li></ul>`,
        is_published: false,
        date: "Mars 2026"
    },
    {
        title: "Programmation 80/20 : La règle d'or des champions",
        excerpt: "Pourquoi le mélange des intensités est plus important que l'intensité elle-même. Apprenez à polariser votre entraînement.",
        category: "Running",
        content: `<h2>Le Modèle Polarisé</h2><p>Arrêtez de courir dans le 'No Man's Land' (zone grise). Apprenez à séparer vos séances très faciles de vos séances très dures.</p><h3>Application :</h3><ul><li>Distribution du volume hebdomadaire.</li><li>Pourquoi la zone 3 est souvent une erreur stratégique.</li></ul>`,
        is_published: false,
        date: "Mars 2026"
    },
    {
        title: "Sauna et Volume Plasmatique : Le hack chaleur",
        excerpt: "Découvrez comment l'exposition à la chaleur peut booster vos performances d'endurance de façon quasi-magique.",
        category: "Science",
        content: `<h2>Heat Acclimation vs Training</h2><p>Utiliser le sauna après une séance d'endurance peut provoquer une augmentation du volume sanguin, améliorant ainsi votre thermorégulation et votre VO2max.</p><h3>Protocole :</h3><ul><li>Durée et température optimales.</li><li>Fréquence hebdomadaire.</li><li>Hydratation post-sauna.</li></ul>`,
        is_published: false,
        date: "Mars 2026"
    }
];

async function seedEvenMoreArticles() {
    console.log(`Seeding v3 content: ${articles.length} new advanced ideas...`);
    const { data, error } = await supabase.from('articles').insert(articles).select();

    if (error) {
        console.error('Error seeding v3:', error);
    } else {
        console.log('Success! Advanced v3 topics added:', data.map(a => a.title));
    }
}

seedEvenMoreArticles();
