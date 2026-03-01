import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
    console.error("❌ Missing Supabase credentials in .env.local");
    process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

// =============================================================================
// FAQ OPTIMISÉES SEO — NA COACHING
// Stratégie : questions longue traîne + mots-clés naturels + réponses enrichies
// =============================================================================

const ALL_FAQS = {

    // =========================================================================
    // PAGE D'ACCUEIL
    // =========================================================================
    home_faq: {
        label: 'FAQ Page Accueil',
        faqs: [
            {
                question: "Le coaching sportif personnalisé est-il adapté aux débutants ?",
                answer: "Absolument. En tant que coach diplômé Master EOPS, j'adapte chaque programme à votre niveau initial, vos antécédents médicaux et vos objectifs personnels. Que vous n'ayez jamais fait de sport ou que vous repreniez après une longue pause, la progression est calibrée pour être efficace et sans risque."
            },
            {
                question: "Proposez-vous des programmes de réathlétisation après blessure ?",
                answer: "C'est l'une de mes spécialités principales. Après une blessure (rupture des ligaments croisés, entorse, déchirure musculaire, tendinopathie), j'établis un protocole de réathlétisation progressif et scientifique. L'objectif est un retour au sport optimal, sans rechute, en respectant les délais de cicatrisation tissulaire."
            },
            {
                question: "En combien de temps peut-on voir les premiers résultats en musculation ?",
                answer: "Avec un entraînement structuré et une surcharge progressive bien calibrée, les premiers gains de force se ressentent dès 3 à 4 semaines. Les changements physiques visibles (hypertrophie, composition corporelle) apparaissent généralement entre 6 et 12 semaines d'entraînement régulier."
            },
            {
                question: "Ai-je besoin de matériel ou d'une salle de sport pour suivre un programme ?",
                answer: "Pas obligatoirement. Je m'adapte à votre environnement : salle de musculation complète, home gym avec haltères et banc, ou même entraînement au poids du corps. Le programme respecte les principes physiologiques de progression quel que soit le matériel disponible."
            },
            {
                question: "Proposez-vous un suivi nutritionnel en complément de l'entraînement ?",
                answer: "Je ne prescris pas de régime alimentaire, mais je vous apprends à gérer vos macronutriments (protéines, glucides, lipides) pour soutenir vos performances sportives. Mon outil gratuit 'Calculateur de besoins caloriques' vous aide à déterminer votre apport optimal au quotidien."
            },
            {
                question: "Quelle est la différence entre un coach sportif classique et un Master EOPS ?",
                answer: "Le Master EOPS (Entraînement et Optimisation de la Performance Sportive) est le plus haut niveau de formation universitaire en préparation physique en France (Bac+5). Il combine des compétences en physiologie de l'exercice, biomécanique, planification de l'entraînement et réathlétisation — bien au-delà d'un simple diplôme de coaching."
            },
            {
                question: "Comment fonctionne le coaching en ligne à distance ?",
                answer: "Après un bilan initial détaillé, vous recevez votre programme personnalisé via une application dédiée avec vidéos des exercices. Un suivi hebdomadaire permet d'ajuster les charges, le volume et l'intensité en fonction de votre progression et de vos sensations."
            }
        ]
    },

    // =========================================================================
    // PAGE CONTACT
    // =========================================================================
    contact_faq: {
        label: 'FAQ Page Contact',
        faqs: [
            {
                question: "Comment fonctionne le coaching sportif en ligne ?",
                answer: "Le coaching en ligne se fait à distance via une application dédiée. Après un échange initial pour analyser vos objectifs, votre niveau et vos contraintes, je crée un programme 100% personnalisé. Un suivi régulier par message permet d'ajuster le plan chaque semaine en fonction de votre progression."
            },
            {
                question: "Quel est le délai de livraison des programmes d'entraînement ?",
                answer: "Les programmes digitaux (PDF) sont livrés instantanément par email après l'achat. Pour un coaching personnalisé sur-mesure, comptez 48 à 72 heures après notre premier échange pour recevoir votre programme complet avec explications et vidéos."
            },
            {
                question: "Les programmes de musculation sont-ils adaptés aux débutants ?",
                answer: "Oui, chaque programme est conçu pour s'adapter à votre niveau. Que vous soyez débutant complet ou athlète confirmé, les exercices, le volume d'entraînement et les intensités sont ajustés. Chaque mouvement est accompagné de descriptions détaillées pour garantir une exécution sûre et efficace."
            },
            {
                question: "Puis-je obtenir un remboursement sur un programme digital ?",
                answer: "Les programmes digitaux étant des produits dématérialisés, ils ne sont pas remboursables une fois téléchargés, conformément à la législation en vigueur. En cas de problème technique d'accès, contactez-moi directement et je trouverai une solution immédiate."
            },
            {
                question: "Comment utiliser les outils gratuits de calcul sportif ?",
                answer: "Tous les outils (calculateur 1RM, besoins caloriques, zones de fréquence cardiaque, VMA/VO2max, convertisseur d'allure, RPE, score de récupération, ACWR) sont accessibles gratuitement depuis la section Outils. Entrez vos données et les résultats s'affichent instantanément avec des explications détaillées."
            },
            {
                question: "Quels types de coaching sportif proposez-vous ?",
                answer: "Je propose du coaching en musculation et force, en course à pied (du 5 km au marathon), en préparation physique hybride et en réathlétisation post-blessure. Chaque accompagnement repose sur des données scientifiques et une approche individualisée pour une progression durable."
            },
            {
                question: "Comment vous contacter pour une question ou un devis ?",
                answer: "Vous pouvez utiliser le formulaire de contact ci-dessus ou m'écrire directement sur Instagram @na_coaching_. Je réponds généralement sous 24 à 48 heures. N'hésitez pas à détailler votre situation pour que je puisse vous orienter au mieux."
            }
        ]
    },

    // =========================================================================
    // CALCULATEUR 1RM
    // =========================================================================
    tool_1rm_faq: {
        label: 'FAQ Outil 1RM',
        faqs: [
            {
                question: "C'est quoi le 1RM en musculation et à quoi ça sert ?",
                answer: "Le 1RM (One Repetition Maximum) est la charge maximale que vous pouvez soulever sur une seule répétition avec une technique parfaite. C'est la référence pour programmer vos entraînements : les pourcentages de charge (ex : 75% du 1RM pour l'hypertrophie) permettent de cibler précisément vos objectifs."
            },
            {
                question: "Comment calculer son 1RM sans tester sa charge maximale ?",
                answer: "Plutôt que de risquer une blessure en testant votre max réel, utilisez les formules d'estimation (Brzycki, Epley). Entrez simplement le poids soulevé et le nombre de répétitions effectuées (entre 2 et 10 reps) et le calculateur estime votre 1RM théorique avec une marge d'erreur de 5 à 10%."
            },
            {
                question: "Quelle est la différence entre les formules Brzycki et Epley ?",
                answer: "La formule de Brzycki (1RM = poids × 36 / (37 − reps)) est plus précise pour les séries courtes (2-6 reps). Celle d'Epley (1RM = poids × (1 + reps/30)) fonctionne mieux pour les séries plus longues (6-10 reps). Notre calculateur utilise les deux pour vous donner l'estimation la plus fiable."
            },
            {
                question: "À quelle fréquence faut-il recalculer son 1RM ?",
                answer: "Il est recommandé de réévaluer votre 1RM toutes les 4 à 6 semaines, ou à chaque début de nouveau cycle d'entraînement. Cela permet d'ajuster vos charges de travail à votre progression réelle et d'éviter de stagner."
            },
            {
                question: "Quel pourcentage du 1RM utiliser pour la prise de masse musculaire ?",
                answer: "Pour l'hypertrophie musculaire, travaillez entre 65% et 80% de votre 1RM avec 8 à 12 répétitions par série. Pour la force maximale, visez 85-95% du 1RM avec 1 à 5 reps. Pour l'endurance musculaire, restez entre 50-65% avec 15 à 20 reps."
            }
        ]
    },

    // =========================================================================
    // BESOINS CALORIQUES
    // =========================================================================
    tool_calories_faq: {
        label: 'FAQ Outil Calories',
        faqs: [
            {
                question: "Comment calculer ses besoins caloriques journaliers ?",
                answer: "Vos besoins caloriques dépendent de deux facteurs : votre métabolisme de base (BMR – calories brûlées au repos, calculé selon votre âge, sexe, poids et taille) et votre niveau d'activité physique quotidien. Le TDEE (Total Daily Energy Expenditure) est le résultat de ces deux facteurs combinés."
            },
            {
                question: "C'est quoi le TDEE et pourquoi est-ce important ?",
                answer: "Le TDEE (Total Daily Energy Expenditure) est le nombre total de calories que votre corps brûle chaque jour. C'est votre point d'équilibre : manger au-dessus permet la prise de masse, manger en dessous déclenche la perte de poids. Connaître son TDEE est la base de toute stratégie nutritionnelle efficace."
            },
            {
                question: "Quel déficit calorique pour perdre du gras sans perdre de muscle ?",
                answer: "Un déficit modéré de 300 à 500 calories par jour par rapport à votre TDEE est optimal pour perdre du gras tout en préservant la masse musculaire. Combiné à un apport suffisant en protéines (1.6 à 2.2g/kg) et un entraînement de musculation, ce déficit permet une perte durable d'environ 0.5 kg par semaine."
            },
            {
                question: "Combien de calories en surplus pour prendre du muscle ?",
                answer: "Pour une prise de masse musculaire propre, visez un surplus calorique de 200 à 400 calories au-dessus de votre TDEE. Au-delà, vous risquez d'accumuler trop de tissu adipeux. Ce surplus doit s'accompagner d'un entraînement progressif en musculation et d'un apport protéique suffisant."
            },
            {
                question: "Quelle formule est utilisée pour calculer le métabolisme de base ?",
                answer: "Notre calculateur utilise la formule de Mifflin-St Jeor, considérée comme la plus précise par la recherche scientifique actuelle. Elle tient compte de votre poids, taille, âge et sexe. Le résultat est ensuite multiplié par un coefficient d'activité pour obtenir votre TDEE."
            }
        ]
    },

    // =========================================================================
    // VMA / VO2MAX
    // =========================================================================
    tool_vma_faq: {
        label: 'FAQ Outil VMA',
        faqs: [
            {
                question: "C'est quoi la VMA et pourquoi la calculer ?",
                answer: "La VMA (Vitesse Maximale Aérobie) est la vitesse de course à laquelle votre consommation d'oxygène atteint son maximum (VO2max). C'est l'indicateur clé en course à pied pour calibrer vos allures d'entraînement : endurance fondamentale, seuil, VMA, et fractionné."
            },
            {
                question: "Comment calculer sa VMA avec un test terrain ?",
                answer: "Les tests les plus courants sont le Test de Cooper (distance maximale en 12 minutes) et le Demi-Cooper (distance maximale en 6 minutes). Notre outil convertit directement votre résultat en VMA et VO2max. D'autres tests existent comme le VAMEVAL ou le Léger-Boucher."
            },
            {
                question: "Quelle est la différence entre VMA et VO2max ?",
                answer: "La VO2max est une mesure physiologique exprimée en ml/kg/min : c'est le volume maximal d'oxygène que vos muscles peuvent utiliser. La VMA est la traduction de cette capacité en vitesse de course (km/h). La relation est : VMA ≈ VO2max / 3.5. Connaître les deux permet de planifier un entraînement optimal."
            },
            {
                question: "Quelle est une bonne VMA selon le niveau ?",
                answer: "En course à pied, une VMA de 12-14 km/h correspond à un débutant, 14-17 km/h à un coureur régulier, 17-20 km/h à un bon compétiteur et au-delà de 20 km/h à un athlète de haut niveau. La VMA progresse avec un entraînement spécifique en fractionné court."
            },
            {
                question: "Comment améliorer sa VMA et sa VO2max ?",
                answer: "Le meilleur moyen est le travail en fractionné court : des intervalles de 30 secondes à 3 minutes courus entre 95% et 105% de votre VMA, entrecoupés de récupérations actives. Deux séances par semaine pendant 6 à 8 semaines permettent généralement un gain de 1 à 2 km/h de VMA."
            }
        ]
    },

    // =========================================================================
    // FRÉQUENCE CARDIAQUE
    // =========================================================================
    tool_hr_faq: {
        label: 'FAQ Outil Fréquence Cardiaque',
        faqs: [
            {
                question: "Comment calculer ses zones de fréquence cardiaque d'entraînement ?",
                answer: "La méthode la plus précise est celle de Karvonen, qui utilise votre fréquence cardiaque de réserve (FC max − FC repos). Elle donne 5 zones d'intensité personnalisées : récupération, endurance fondamentale, tempo, seuil et effort maximal. Notre calculateur les détermine automatiquement."
            },
            {
                question: "C'est quoi la zone d'endurance fondamentale et à quoi sert-elle ?",
                answer: "L'endurance fondamentale correspond aux zones 1 et 2, soit environ 60-75% de votre FC de réserve. C'est l'allure où vous pouvez tenir une conversation sans essoufflement. Elle développe le réseau capillaire, améliore l'utilisation des graisses et constitue la base de tout programme de course à pied."
            },
            {
                question: "Pourquoi la méthode de Karvonen est-elle plus précise que 220 moins l'âge ?",
                answer: "La formule classique (220 − âge) estime seulement la FC max théorique et ne tient pas compte de votre fréquence cardiaque de repos. Karvonen utilise la FCR (fréquence cardiaque de réserve = FC max − FC repos), ce qui rend les zones beaucoup plus personnalisées, surtout pour les sportifs entraînés."
            },
            {
                question: "Comment mesurer sa fréquence cardiaque de repos ?",
                answer: "Mesurez votre FC de repos le matin au réveil, allongé et détendu, avant de vous lever. Comptez vos pulsations pendant 60 secondes ou utilisez une montre connectée. Faites la mesure sur 3 à 5 jours consécutifs et prenez la moyenne pour un résultat fiable."
            },
            {
                question: "Dans quelle zone cardiaque courir pour perdre du poids ?",
                answer: "La zone d'endurance fondamentale (zone 2, environ 60-70% de FC max) est idéale pour la perte de poids car elle maximise l'oxydation des graisses. Cependant, les séances à haute intensité (zone 4-5) brûlent plus de calories totales et créent un effet afterburn. L'idéal est de combiner les deux."
            }
        ]
    },

    // =========================================================================
    // CONVERTISSEUR VITESSE
    // =========================================================================
    tool_speed_faq: {
        label: 'FAQ Outil Vitesse',
        faqs: [
            {
                question: "Comment convertir les km/h en min/km (allure de course) ?",
                answer: "La formule est simple : allure (min/km) = 60 ÷ vitesse (km/h). Par exemple, 12 km/h = 60 ÷ 12 = 5:00 min/km. Notre convertisseur fait le calcul instantanément dans les deux sens et affiche aussi les temps de passage aux distances clés."
            },
            {
                question: "Quelle allure pour courir un marathon en moins de 4 heures ?",
                answer: "Pour terminer un marathon (42.195 km) en moins de 4 heures, vous devez maintenir une allure moyenne de 5:41 min/km, soit environ 10.55 km/h. Prévoyez de courir les premiers kilomètres légèrement plus vite (5:35 min/km) pour avoir une marge de sécurité."
            },
            {
                question: "Pourquoi les coureurs utilisent l'allure en min/km plutôt que la vitesse en km/h ?",
                answer: "L'allure en min/km est plus pratique en course à pied car elle permet de calculer facilement ses temps de passage au kilomètre et de gérer son effort pendant la course. C'est aussi le format universel affiché sur les montres GPS de running comme Garmin, Polar ou COROS."
            },
            {
                question: "Comment calculer son temps de course prévu sur une distance ?",
                answer: "Multipliez votre allure (en min/km) par la distance (en km). Par exemple, à 5:30 min/km sur un semi-marathon (21.1 km) : 5.5 × 21.1 = 116 min soit 1h56. Notre outil affiche automatiquement les temps estimés pour le 5 km, 10 km, semi et marathon."
            },
            {
                question: "Quelle est l'allure moyenne d'un coureur débutant ?",
                answer: "Un coureur débutant court généralement entre 7:00 et 8:00 min/km (soit 7.5 à 8.5 km/h). Avec un entraînement régulier de 3 séances par semaine, cette allure peut descendre à 5:30-6:30 min/km en quelques mois. L'important est de progresser graduellement sans vouloir aller trop vite."
            }
        ]
    },

    // =========================================================================
    // RPE / 1RM (NOUVEAU)
    // =========================================================================
    tool_rpe_faq: {
        label: 'FAQ Outil RPE',
        faqs: [
            {
                question: "C'est quoi le RPE en musculation ?",
                answer: "Le RPE (Rate of Perceived Exertion) est une échelle de perception de l'effort de 1 à 10 utilisée en musculation. Un RPE 10 signifie que vous ne pouviez pas faire une répétition de plus (effort maximal). Un RPE 8 signifie qu'il vous restait environ 2 répétitions en réserve (RIR 2)."
            },
            {
                question: "Comment utiliser l'échelle RPE pour programmer ses entraînements ?",
                answer: "Au lieu de travailler avec des pourcentages fixes du 1RM, le RPE permet d'ajuster la charge au jour le jour selon votre forme. Un programme peut prescrire 'Squat 4×5 @ RPE 8', ce qui signifie 4 séries de 5 reps avec une charge laissant 2 reps en réserve. C'est l'autorégulation de l'entraînement."
            },
            {
                question: "Quelle est la différence entre RPE et RIR (Reps In Reserve) ?",
                answer: "Le RIR (Repetitions In Reserve) est le complément du RPE : RPE 10 = RIR 0 (aucune rep en réserve), RPE 9 = RIR 1, RPE 8 = RIR 2, etc. Les deux systèmes expriment la même chose de manière inverse. Notre convertisseur vous permet de passer de l'un à l'autre et d'estimer le pourcentage du 1RM correspondant."
            },
            {
                question: "À quel RPE s'entraîner pour la prise de masse musculaire ?",
                answer: "Pour l'hypertrophie, la plupart des séries de travail devraient se situer entre RPE 7 et RPE 9 (1 à 3 reps en réserve). Un RPE trop bas (<7) ne génère pas assez de tension mécanique, tandis qu'un RPE 10 systématique augmente la fatigue et le risque de blessure sans bénéfice supplémentaire."
            },
            {
                question: "Le RPE est-il fiable pour les débutants en musculation ?",
                answer: "Les débutants ont tendance à sous-estimer ou surestimer leur effort, donc le RPE est moins précis au début. Avec 3 à 6 mois de pratique, la calibration s'améliore considérablement. En attendant, combiner RPE et pourcentages du 1RM est une excellente approche pour apprendre à jauger son effort."
            }
        ]
    },

    // =========================================================================
    // MACROS AVANCÉES (NOUVEAU)
    // =========================================================================
    tool_macros_faq: {
        label: 'FAQ Outil Macros Avancées',
        faqs: [
            {
                question: "Comment calculer la répartition idéale de ses macronutriments ?",
                answer: "La répartition optimale dépend de votre objectif : en prise de masse, visez environ 2g de protéines/kg, 4-6g de glucides/kg et 0.8-1.2g de lipides/kg. En sèche, augmentez les protéines (2-2.5g/kg), réduisez les glucides et maintenez les lipides. Notre outil calcule ces valeurs automatiquement."
            },
            {
                question: "Combien de protéines par jour pour la musculation ?",
                answer: "La recherche scientifique recommande 1.6 à 2.2g de protéines par kg de poids corporel pour optimiser la synthèse protéique musculaire. Au-delà de 2.2g/kg, les bénéfices supplémentaires sont minimes. Répartissez l'apport sur 3 à 5 repas pour maximiser l'absorption."
            },
            {
                question: "Faut-il compter les macros ou les calories pour progresser ?",
                answer: "Les deux sont complémentaires. Les calories déterminent si vous gagnez ou perdez du poids, tandis que la répartition des macronutriments influence la composition corporelle (muscle vs graisse). Compter ses macros est la méthode la plus efficace pour transformer son physique de manière ciblée."
            },
            {
                question: "Quelle est la différence entre macros et calories ?",
                answer: "Les macronutriments (protéines, glucides, lipides) fournissent des calories : 1g de protéine = 4 kcal, 1g de glucide = 4 kcal, 1g de lipide = 9 kcal. Les calories sont l'énergie totale, les macros sont la composition qualitative de cette énergie. Les deux comptent pour la performance et la composition corporelle."
            },
            {
                question: "Comment adapter ses macros selon les jours d'entraînement ?",
                answer: "Le cycling des glucides est une stratégie efficace : augmentez les glucides les jours d'entraînement intense (+50-100g) pour soutenir la performance, et réduisez-les légèrement les jours de repos. Les protéines restent constantes chaque jour. Notre outil vous aide à ajuster cette répartition automatiquement."
            }
        ]
    },

    // =========================================================================
    // TEST DEMI-COOPER (NOUVEAU)
    // =========================================================================
    tool_cooper_faq: {
        label: 'FAQ Outil Demi-Cooper',
        faqs: [
            {
                question: "C'est quoi le test Demi-Cooper et comment le faire ?",
                answer: "Le test Demi-Cooper consiste à courir la plus grande distance possible en 6 minutes. Échauffez-vous 10 minutes, puis courez à allure maximale régulière pendant 6 minutes sur terrain plat. La distance parcourue permet d'estimer votre VMA avec la formule : VMA = distance (m) / 6 × 60 / 1000."
            },
            {
                question: "Quelle est la différence entre le test de Cooper et le Demi-Cooper ?",
                answer: "Le test de Cooper dure 12 minutes, le Demi-Cooper dure 6 minutes. Le Demi-Cooper est plus adapté aux sportifs non-spécialistes de course à pied car il est moins éprouvant mentalement et physiquement. Les deux tests donnent une estimation de la VMA et de la VO2max."
            },
            {
                question: "Quelle distance est bonne au Demi-Cooper selon le niveau ?",
                answer: "Au test Demi-Cooper (6 minutes) : moins de 1200m correspond à un débutant, 1200-1500m à un niveau intermédiaire, 1500-1800m à un bon sportif et plus de 1800m à un athlète entraîné. Ces distances correspondent à des VMA de 12 à 18+ km/h."
            },
            {
                question: "Faut-il s'échauffer avant le test Demi-Cooper ?",
                answer: "Un échauffement de 10 à 15 minutes est indispensable : footing léger, gammes de course, puis 2-3 accélérations progressives. Un bon échauffement améliore le résultat du test de 3 à 5% et réduit considérablement le risque de blessure musculaire."
            },
            {
                question: "À quelle fréquence refaire le test Demi-Cooper ?",
                answer: "Répétez le test toutes les 6 à 8 semaines pour suivre votre progression. Faites-le toujours dans les mêmes conditions (même terrain, même moment de la journée, après un échauffement similaire) pour que les résultats soient comparables. C'est un excellent indicateur de votre forme aérobie."
            }
        ]
    },

    // =========================================================================
    // SCORE DE RÉCUPÉRATION (NOUVEAU)
    // =========================================================================
    tool_recovery_faq: {
        label: 'FAQ Outil Récupération',
        faqs: [
            {
                question: "Comment savoir si j'ai bien récupéré entre deux séances de sport ?",
                answer: "Le score de récupération évalue plusieurs indicateurs : qualité du sommeil, douleurs musculaires résiduelles (DOMS), niveau de fatigue perçue, humeur et motivation. Un score élevé indique que vous êtes prêt pour un entraînement intense, un score bas suggère une séance légère ou un jour de repos."
            },
            {
                question: "C'est quoi le surentraînement et comment l'éviter ?",
                answer: "Le surentraînement est un état de fatigue chronique causé par un déséquilibre entre charge d'entraînement et récupération. Symptômes : baisse de performance, fatigue persistante, troubles du sommeil, irritabilité. Pour l'éviter, respectez les jours de repos, surveillez votre score de récupération et augmentez les charges progressivement."
            },
            {
                question: "Combien de temps de repos entre deux séances de musculation ?",
                answer: "Pour le même groupe musculaire, 48 à 72 heures de repos sont recommandées. Cela laisse le temps à la synthèse protéique musculaire (qui dure 24-48h post-entraînement) de s'achever. Vous pouvez cependant entraîner des groupes musculaires différents sur des jours consécutifs."
            },
            {
                question: "Le sommeil affecte-t-il vraiment la récupération musculaire ?",
                answer: "Le sommeil est le facteur n°1 de récupération. Pendant les phases de sommeil profond, le corps libère l'hormone de croissance (GH), essentielle à la réparation musculaire. Moins de 7 heures de sommeil réduit la synthèse protéique de 18% et augmente le cortisol (hormone catabolique). Visez 7 à 9 heures par nuit."
            },
            {
                question: "Quelles sont les meilleures stratégies de récupération après un entraînement ?",
                answer: "Par ordre d'importance : 1) Sommeil de qualité (7-9h), 2) Nutrition post-entraînement (protéines + glucides dans les 2h), 3) Hydratation suffisante, 4) Gestion du stress, 5) Mobilité et étirements légers. Les bains froids et la compression sont des bonus, mais les fondamentaux ci-dessus sont prioritaires."
            }
        ]
    },

    // =========================================================================
    // ACWR (NOUVEAU)
    // =========================================================================
    tool_acwr_faq: {
        label: 'FAQ Outil ACWR',
        faqs: [
            {
                question: "C'est quoi le ratio ACWR en préparation physique ?",
                answer: "Le ratio ACWR (Acute:Chronic Workload Ratio) compare votre charge d'entraînement récente (semaine en cours) à votre charge chronique (moyenne des 4 dernières semaines). Un ratio entre 0.8 et 1.3 est considéré comme la 'zone optimale' de progression avec un risque de blessure minimisé."
            },
            {
                question: "Comment calculer l'ACWR pour éviter les blessures ?",
                answer: "Divisez la charge de la semaine en cours par la moyenne des 4 semaines précédentes. La charge peut être mesurée en volume (km, tonnes soulevées) ou en charge interne (RPE × durée). Un ratio supérieur à 1.5 indique un pic de charge dangereux et augmente significativement le risque de blessure."
            },
            {
                question: "Quelle est la zone optimale du ratio ACWR ?",
                answer: "La zone optimale se situe entre 0.8 et 1.3. En dessous de 0.8, vous êtes en sous-entraînement et perdez des adaptations. Au-dessus de 1.5, le risque de blessure augmente de 200 à 400% selon les études. Entre 1.3 et 1.5, c'est une zone de vigilance qui nécessite une attention particulière."
            },
            {
                question: "L'ACWR est-il utile pour les sportifs amateurs ?",
                answer: "Absolument. L'ACWR est encore plus important pour les amateurs car ils sont plus vulnérables aux pics de charge (reprise après vacances, augmentation brutale du volume). Notre outil simplifie le calcul : entrez vos charges hebdomadaires et le ratio est calculé automatiquement avec un code couleur visuel."
            },
            {
                question: "Comment augmenter progressivement sa charge d'entraînement ?",
                answer: "La règle générale est de ne pas augmenter la charge de plus de 10% par semaine. Cela maintient l'ACWR dans la zone optimale. Par exemple, si vous courez 30 km cette semaine, ne dépassez pas 33 km la semaine suivante. Cette progression graduelle permet au corps de s'adapter et réduit le risque de blessure."
            }
        ]
    },

    // =========================================================================
    // PRÉDICTEUR DE PERFORMANCE (NOUVEAU)
    // =========================================================================
    tool_predictor_faq: {
        label: 'FAQ Outil Prédicteur Performance',
        faqs: [
            {
                question: "Comment prédire son temps de course sur une autre distance ?",
                answer: "Le prédicteur de performance utilise votre temps sur une distance connue (ex : 10 km en 50 min) pour estimer vos temps sur d'autres distances (5 km, semi-marathon, marathon). Les modèles tiennent compte du facteur de fatigue et de la baisse de vitesse inhérente aux distances plus longues."
            },
            {
                question: "Les prédicteurs de temps de course sont-ils fiables ?",
                answer: "Les prédictions sont fiables à ±2-5% si vous avez un entraînement adapté à la distance cible. Les écarts sont plus grands pour le marathon si votre référence est un 5 km, car le marathon requiert une endurance spécifique que la performance sur courte distance ne reflète pas entièrement."
            },
            {
                question: "Quel temps au 10 km pour courir un marathon en 3h30 ?",
                answer: "Pour un marathon en 3h30, il faut typiquement courir le 10 km autour de 45-47 minutes. Cela correspond à une VMA d'environ 16 km/h. L'entraînement spécifique marathon (sorties longues, travail au seuil) est ensuite indispensable pour transformer ce potentiel en performance le jour J."
            },
            {
                question: "Comment utiliser le prédicteur pour planifier une compétition ?",
                answer: "Entrez votre meilleur temps récent (moins de 6 semaines) sur n'importe quelle distance. Le prédicteur affiche vos temps estimés sur les distances courantes. Utilisez le temps de la distance cible pour déterminer votre allure de course, puis entraînez-vous spécifiquement à cette allure."
            },
            {
                question: "Pourquoi mon temps réel diffère-t-il de la prédiction ?",
                answer: "Plusieurs facteurs influencent le résultat le jour J : condition météo (chaleur, vent), dénivelé du parcours, gestion de l'alimentation, hydratation, qualité du sommeil la veille, et surtout votre stratégie de course (partir trop vite est l'erreur n°1). Le prédicteur donne un potentiel théorique, l'exécution dépend de vous."
            }
        ]
    },

    // =========================================================================
    // VOLUME EFFECTIF (NOUVEAU)
    // =========================================================================
    tool_volume_faq: {
        label: 'FAQ Outil Volume Effectif',
        faqs: [
            {
                question: "C'est quoi le volume effectif d'entraînement en musculation ?",
                answer: "Le volume effectif désigne le nombre de séries 'stimulantes' réalisées par groupe musculaire par semaine — c'est-à-dire les séries suffisamment proches de l'échec pour déclencher une adaptation (généralement RPE 7+). Les séries d'échauffement et les séries trop faciles ne comptent pas."
            },
            {
                question: "Combien de séries par semaine par groupe musculaire pour progresser ?",
                answer: "Les recommandations scientifiques sont : 10 à 20 séries effectives par groupe musculaire par semaine pour l'hypertrophie. Les débutants progressent avec 10-12 séries, les intermédiaires avec 12-16 séries, et les avancés peuvent nécessiter 16-20+ séries. Au-delà, les bénéfices diminuent."
            },
            {
                question: "Comment répartir le volume d'entraînement sur la semaine ?",
                answer: "Il est plus efficace de répartir le volume sur 2 à 3 séances par groupe musculaire plutôt que tout concentrer en une seule séance. Par exemple, 16 séries de pectoraux = 2 séances de 8 séries (ex : lundi et jeudi). Cela améliore la qualité des séries et optimise la synthèse protéique."
            },
            {
                question: "C'est quoi le MRV et le MEV en musculation ?",
                answer: "Le MEV (Minimum Effective Volume) est le volume minimum pour stimuler la croissance musculaire (souvent 6-8 séries/semaine). Le MRV (Maximum Recoverable Volume) est le volume maximal que vous pouvez supporter sans compromettre la récupération (souvent 20-25 séries/semaine). Entraînez-vous entre les deux."
            },
            {
                question: "Comment savoir si je fais trop ou pas assez de volume ?",
                answer: "Signes de volume insuffisant : aucune courbature, aucune progression des charges, pas de congestion (pump) pendant l'entraînement. Signes de volume excessif : fatigue chronique, douleurs articulaires, régression des performances, troubles du sommeil. Notre outil vous aide à trouver le juste milieu."
            }
        ]
    }
};

async function main() {
    console.log("🚀 Seed des FAQ optimisées SEO — NA Coaching");
    console.log("=".repeat(60));

    let success = 0;
    let errors = 0;

    for (const [key, data] of Object.entries(ALL_FAQS)) {
        const { error } = await supabase
            .from('site_content')
            .upsert(
                { key, label: data.label, value: JSON.stringify(data.faqs) },
                { onConflict: 'key' }
            );

        if (error) {
            console.error(`❌ ${key}: ${error.message}`);
            errors++;
        } else {
            console.log(`✅ ${key} — ${data.faqs.length} FAQ insérées`);
            success++;
        }
    }

    console.log("=".repeat(60));
    console.log(`✅ ${success} pages FAQ mises à jour`);
    if (errors > 0) console.log(`❌ ${errors} erreurs`);
    console.log(`📊 Total: ${Object.values(ALL_FAQS).reduce((sum, d) => sum + d.faqs.length, 0)} FAQ`);
}

main();
