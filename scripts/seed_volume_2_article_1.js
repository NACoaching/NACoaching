const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');

// Read .env.local manually
const envFile = fs.readFileSync('.env.local', 'utf8');
const envVars = {};
envFile.split('\n').forEach(line => {
    const match = line.match(/^([^=]+)=(.*)$/);
    if (match) {
        envVars[match[1]] = match[2];
    }
});

const supabaseUrl = envVars.NEXT_PUBLIC_SUPABASE_URL;

// To bypass RLS and avoid 42501 we need the service role key. 
// However, if we don't have it in .env, we can just use the Service Role Key directly if we had it.
// Looking at the previous code, I see NEXT_PUBLIC_SUPABASE_ANON_KEY.
// Let's try inserting with Anon Key but ensuring we just upsert or maybe the RLS policy for insert is blocked.

// Wait, I noticed I used `insert()` in the previous scripts (`seed_v3_articles.js`).
// Let's copy the exact logic from `seed_v3_articles.js` which worked.

const supabaseKey = envVars.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
    console.error("Missing Supabase credentials.");
    process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

const article = {
    title: "1. Endurance Fondamentale (Zone 2) : Le Secret d'un Cardio Inépuisable",
    slug: "endurance-fondamentale-zone-2",
    excerpt: "Découvrez pourquoi courir lentement est paradoxalement le meilleur moyen de devenir plus rapide. Plongée dans la physiologie de la Zone 2 et de l'endurance fondamentale.",
    content: "C’est le paradoxe le plus contre-intuitif et pourtant le plus vital des sports d'endurance : **pour courir vite, il faut passer la majeure partie de son temps à courir lentement**.\n\nBeaucoup d'athlètes amateurs commettent l'erreur classique de s'entraîner systématiquement dans une \"zone grise\" : trop vite pour récupérer, mais trop lentement pour créer de réelles adaptations de haute intensité. Le résultat ? Une stagnation des performances, une fatigue chronique et un risque de blessure décuplé.\n\nLa solution réside dans la maîtrise d'une filière énergétique bien spécifique : **l'endurance fondamentale**, souvent appelée entraînement en **Zone 2**.\n\nDans ce premier chapitre du Volume 2, nous allons décortiquer la physiologie de l'endurance fondamentale, comprendre comment elle transforme votre corps de l'intérieur, et comment l'intégrer correctement à votre entraînement.\n\n---\n\n## Qu'est-ce que l'Endurance Fondamentale (Zone 2) ?\n\nEn physiologie de l'exercice, l'endurance fondamentale correspond à une intensité d'effort très faible à modérée. Elle se situe exactement sous le **premier seuil ventilatoire (SV1)** ou seuil aérobie.\n\nÀ cette intensité :\n* **Votre corps utilise principalement les graisses (lipides)** comme carburant, en épargnant vos réserves limitées de glycogène (sucre).\n* **L'effort est purement aérobie** : il nécessite de l'oxygène, mais ne produit quasiment pas d'acide lactique (ou plus précisément, de lactate et d'ions H+ liés à la fatigue).\n* **Vous êtes capable de parler** en faisant des phrases complètes sans être essoufflé (c'est le fameux *Talk Test*).\n\nEn général, la Zone 2 correspond à **65-75% de votre Fréquence Cardiaque Maximale (FCmax)**.\n\n> 💡 **Le Saviez-vous ?**\n> Les athlètes élites (qu'ils soient marathoniens, cyclistes du Tour de France ou triathlètes Ironman) passent environ **80% de tout leur volume d'entraînement** dans cette Zone 2. C'est le fondement de la méthode d'entraînement dite \"polarisée\".\n\n## Pourquoi la Zone 2 est-elle le \"Moteur\" du Sportif ?\n\nL'entraînement régulier en endurance fondamentale induit des adaptations physiologiques profondes et structurelles que le travail à haute intensité (HIIT) ne peut pas reproduire.\n\n### 1. Augmentation de la Densité Mitochondriale\nLes mitochondries sont les \"centrales énergétiques\" de vos cellules musculaires. C'est là que les graisses et les glucides sont transformés en énergie (ATP) en présence d'oxygène. L'entraînement en Zone 2 est le stimulus le plus puissant pour **créer de nouvelles mitochondries** (biogenèse) et augmenter la taille des mitochondries existantes. Plus vous en avez, plus vous produisez d'énergie efficacement.\n\n### 2. Le Développement du Réseau Capillaire\nAutour de vos fibres musculaires se trouvent des capillaires sanguins (de minuscules vaisseaux) qui apportent l'oxygène et évacuent les déchets métaboliques. Courir longtemps à basse intensité force votre corps à développer ce réseau. Une meilleure capillarisation signifie un **apport en oxygène grandement amélioré** aux muscles actifs.\n\n### 3. L'Efficacité Lipolytique (Utiliser les graisses)\nLe corps humain dispose de dizaines de milliers de calories stockées sous forme de graisses, contre seulement environ 2000 calories stockées sous forme de sucre (glycogène). En forçant votre corps à travailler en Zone 2, vous lui apprenez à devenir **efficace pour oxyder les graisses**. Lors d'une course longue (comme un marathon), c'est cette capacité à préserver votre glycogène qui vous empêchera de frapper le redouté \"mur\" du 30ème kilomètre.\n\n### 4. Renforcement Osteo-Articulaire et Tendineux\nLa haute intensité impose un stress mécanique énorme (impacts, tensions). L'endurance fondamentale permet d'habituer progressivement les os, les tendons et les ligaments à la charge mécanique sans les amener à la rupture, préparant ainsi le corps aux séances plus dures.\n\n---\n\n## Comment S'entraîner Correctement en Zone 2 ?\n\nLe plus grand défi de la Zone 2 n'est pas physique, il est mental : **l'égo**. Accepter de se faire doubler, accepter de marcher dans les montées, et accepter que l'allure sur la montre soit bien plus lente que ce dont on se sent capable.\n\n### Le Test de la Parole (*Talk Test*)\nC'est la méthode de terrain la plus fiable si vous n'avez pas de cardiofréquencemètre de haute précision.\n* **Zone 2 validée** : Vous pouvez maintenir une conversation normale, faire des phrases complètes, ou chanter doucement sans chercher votre souffle.\n* **Zone 3 naissante** : Vous pouvez dire quelques mots, mais vous devez reprendre votre souffle au milieu d'une phrase. Vous allez trop vite.\n\n### Le Contrôle par la Fréquence Cardiaque\nSi vous utilisez une ceinture cardio thoracique (les capteurs au poignet sont souvent imprécis en mouvement), visez :\n* **65% à 75% de votre FCmax**.\n* Ou, si vous connaissez votre fréquence cardiaque de réserve (méthode Karvonen), visez **60% à 70% de votre FC de réserve**.\n\n### La Durée de l'Effort\nPour créer des adaptations significatives au niveau mitochondrial, une séance d'endurance fondamentale devrait durer **au minimum 45 minutes**. Les sorties longues du dimanche (1h30, 2h ou plus) sont les séances reines de ce développement aérobie.\n\n---\n\n## Conclusion : Bâtir une Pyramide Solide\n\nVisualisez votre condition physique comme une pyramide. L'entraînement à haute intensité (VMA, seuil lactique, sprints) en est la pointe. L'endurance fondamentale (Zone 2) en est la base. \n\n**Plus la base de votre pyramide est large, plus sa pointe pourra monter haut.**\n\nArrêtez de courir tous vos footings le système respiratoire en feu. Ralentissez, construisez vos fondations physiologiques, et vous serez étonné de constater à quel point vos chronos s'amélioreront lorsque le jour de la performance sera venu.",
    image: "https://images.unsplash.com/photo-1571008887538-b36bb32f4571?q=80&w=2070&auto=format&fit=crop",
    category: "Volume 2 : La Science de l'Endurance",
    subcategory: "Les Bases Physiologiques",
    is_published: true,
    cta: "/outils/frequence-cardiaque",
    date: "Mars 2026"
};

async function insertArticle() {
    console.log("Inserting Article into Supabase...");
    // Changed to insert to match seed_v3_articles instead of upsert
    const { data, error } = await supabase.from('articles').insert([article]).select();

    if (error) {
        console.error("Error inserting article:", error);
    } else {
        console.log("Success! Inserted article:", data[0]?.title);
    }
}

insertArticle();
