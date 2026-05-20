"use client";
import React, { useState, useEffect, useMemo } from 'react';
import { supabase } from '@/lib/supabaseClient';
import { ArrowLeft, Plus, Save, Trash2, Lock, ShoppingBag, FileText, Mail, Activity, Edit, Star, Search, Info } from 'lucide-react';
import Link from 'next/link';


const DEFAULT_TOOL_FAQS = {
    "1rm": [
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
    ],
    "calories": [
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
    ],
    "vma": [
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
    ],
    "hr": [
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
    ],
    "speed": [
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
    ],
    "rpe": [
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
    ],
    "macros": [
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
    ],
    "cooper": [
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
    ],
    "recovery": [
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
    ],
    "acwr": [
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
    ],
    "predictor": [
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
    ],
    "volume": [
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
};

export default function AdminPage() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [session, setSession] = useState(null);
    const [activeTab, setActiveTab] = useState('articles'); // 'articles', 'products', 'content', 'faq', 'messages'
    const [articles, setArticles] = useState([]);
    const [products, setProducts] = useState([]);
    const [siteContent, setSiteContent] = useState([]);
    const [messages, setMessages] = useState([]);
    const [comments, setComments] = useState([]);
    const [reviews, setReviews] = useState([]);
    const [subscribers, setSubscribers] = useState([]);
    const [autoLinks, setAutoLinks] = useState([]);
    const [newAutoLink, setNewAutoLink] = useState({ keywords: '', url: '', is_active: true });
    const [articleForm, setArticleForm] = useState({
        title: '', category: '', subcategory: '', slug: '', excerpt: '', content: '', image: '', cta: '', cta_image: '', cta_title: '', cta_text: '',
        affiliate_link: '', affiliate_text: '', affiliate_image: '', affiliate_title: '',
        related_title: '', related_subtitle: '', related_articles: [],
        tool_hints: {},
        is_published: true,
        date: new Date().toLocaleDateString('fr-FR', { day: 'numeric', month: 'short', year: 'numeric' })
    });
    const [rawPageViews, setRawPageViews] = useState([]);
    const [analyticsFilter, setAnalyticsFilter] = useState('all');
    const [customDate, setCustomDate] = useState('');
    const [loading, setLoading] = useState(true);
    const [uploadStatus, setUploadStatus] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [editingItem, setEditingItem] = useState(null);
    const [logoUrl, setLogoUrl] = useState("/logo.png");
    // FAQ States
    const DEFAULT_HOME_FAQS = [
        { question: "Le coaching est-il adapté à mon sport ?", answer: "Oui, en tant que Master EOPS, j'analyse les spécificités physiologiques et biomécaniques de votre discipline (course à pied, football, triathlon...) pour créer un programme qui optimise vos performances de manière ciblée." },
        { question: "Proposez-vous des programmes de réathlétisation ?", answer: "C'est l'une de mes spécialités. Si vous sortez d'une blessure, nous établirons un protocole scientifique et progressif pour garantir un retour au sport optimal et sans risque de rechute." },
        { question: "Quand vais-je voir les premiers résultats ?", answer: "La performance prend du temps, mais avec une surcharge progressive bien calibrée, les premiers gains de force ou d'endurance se font ressentir dès 4 à 6 semaines d'entraînement sérieux." },
        { question: "Ai-je besoin de beaucoup de matériel ?", answer: "Pas obligatoirement. Que vous soyez inscrit(e) dans une salle suréquipée ou que vous vous entraîniez à la maison avec une paire d'haltères, j'adapte le programme pour respecter les principes physiologiques de progression avec ce que vous avez." },
        { question: "Proposez-vous un suivi nutritionnel ?", answer: "Je ne donne pas de plan alimentaire figé, mais je vous apprends à gérer vos macronutriments (comme le montre mon outil 'Besoins Caloriques' gratuit) pour soutenir vos nouvelles performances sportives." }
    ];
    const [homeFaqs, setHomeFaqs] = useState(DEFAULT_HOME_FAQS);
    const DEFAULT_CONTACT_FAQS = [
        { question: "Comment fonctionne le coaching en ligne ?", answer: "Le coaching en ligne se fait à distance. Après un échange initial pour comprendre vos objectifs, je vous envoie un programme personnalisé adapté à votre niveau et à votre matériel. Un suivi régulier par message permet d'ajuster le plan en fonction de vos retours et de votre progression." },
        { question: "Quel est le délai de livraison des programmes ?", answer: "Les programmes digitaux sont livrés instantanément par email après l'achat. Vous recevez un lien de téléchargement valide pendant 7 jours. Pour un coaching personnalisé, comptez 48 à 72h après notre premier échange pour recevoir votre programme sur-mesure." },
        { question: "Les programmes sont-ils adaptés aux débutants ?", answer: "Oui, chaque programme est conçu pour s'adapter à votre niveau. Que vous soyez débutant ou athlète confirmé, les exercices, volumes et intensités sont ajustés. Les programmes incluent des descriptions détaillées des mouvements pour garantir une bonne exécution." },
        { question: "Puis-je obtenir un remboursement ?", answer: "Les programmes digitaux étant des produits dématérialisés, ils ne sont pas remboursables une fois téléchargés. Si vous rencontrez un problème technique pour accéder à votre programme, contactez-moi et je trouverai une solution rapidement." },
        { question: "Comment utiliser les outils gratuits du site ?", answer: "Tous les outils (calculateur 1RM, besoins caloriques, zones de fréquence cardiaque, VMA/VO2max, convertisseur de vitesse) sont accessibles gratuitement depuis la section Outils. Il suffit d'entrer vos données et les résultats s'affichent instantanément. Vous pouvez même partager vos résultats." },
        { question: "Quel type de coaching proposez-vous ?", answer: "Je propose du coaching en musculation, en course à pied et en préparation physique hybride. Chaque accompagnement est basé sur des données scientifiques et une approche individualisée. L'objectif est de vous faire progresser durablement avec une méthode structurée." },
        { question: "Comment vous contacter pour une question ?", answer: "Vous pouvez utiliser le formulaire de contact ci-dessus ou m'envoyer un message directement sur Instagram @na_coaching_. Je réponds généralement sous 24 à 48h." }
    ];
    const [contactFaqs, setContactFaqs] = useState(DEFAULT_CONTACT_FAQS);
    const [newContactFaqQ, setNewContactFaqQ] = useState('');
    const [newContactFaqA, setNewContactFaqA] = useState('');
    const [productFaqs, setProductFaqs] = useState([]);
    const [faqProduct, setFaqProduct] = useState(null); // product being edited
    const [newFaqQ, setNewFaqQ] = useState('');
    const [newFaqA, setNewFaqA] = useState('');
    const [newProductFaqQ, setNewProductFaqQ] = useState('');
    const [newProductFaqA, setNewProductFaqA] = useState('');
    const [toolFaqs, setToolFaqs] = useState([]);
    const [faqTool, setFaqTool] = useState(null); // tool being edited
    const [newToolFaqQ, setNewToolFaqQ] = useState('');
    const [newToolFaqA, setNewToolFaqA] = useState('');
    const [faqSaving, setFaqSaving] = useState(false);
    // Coach States
    const [coachSaving, setCoachSaving] = useState(false);
    const [coachCredentials, setCoachCredentials] = useState([
        { icon: 'Award', title: 'Master EOPS', desc: "Master Entraînement et Optimisation de la Performance Sportive — formation d'élite en sciences du sport." },
        { icon: 'HeartPulse', title: 'Expert Sport-Santé', desc: 'Spécialiste en réathlétisation et préparation physique pour les sportifs blessés ou en reprise.' },
        { icon: 'Activity', title: 'Prépa Physique Hybride', desc: 'Maîtrise des disciplines hybrides : musculation, course à pied et performance aérobie-anaérobie.' },
        { icon: 'BookOpen', title: 'Vulgarisation Scientifique', desc: 'Traduction des données scientifiques en protocoles concrets, accessibles à tous les niveaux.' },
    ]);
    const [coachValues, setCoachValues] = useState([
        { number: '01', title: 'La Science avant tout', desc: "Chaque conseil est ancré dans la littérature scientifique. Pas de méthodes à la mode, que des protocoles validés." },
        { number: '02', title: "L'Individualisation", desc: "Ton corps, tes objectifs, ta vie. Un programme générique ne fonctionne pas — chaque athlète mérite une approche sur-mesure." },
        { number: '03', title: 'La Durabilité', desc: "Performer sur le long terme sans se blesser. L'objectif n'est pas la transformation rapide, c'est la progression durable." },
    ]);
    const [coachBasics, setCoachBasics] = useState({
        coach_name: 'Nolwen Albanesi',
        coach_badge: 'Le Coach',
        coach_tagline: 'Master EOPS · Coach Sportif Expert · Spécialiste Performance & Réathlétisation',
        coach_description: "Ma mission : appliquer les données de la science du sport pour t'aider à progresser durablement, sans te blesser.",
        coach_meta_desc: 'Coach sportif certifié Master EOPS, spécialiste en musculation, course à pied, préparation physique hybride et réathlétisation.',
        coach_philosophy_title: 'Ma Philosophie',
        coach_cta_title: 'Prêt à Progresser ?',
        coach_cta_desc: "Que tu cherches à progresser en musculation, en running ou à récupérer d'une blessure, il existe un programme fait pour toi.",
        coach_image: '',
    });
    useEffect(() => {
        supabase.auth.getSession().then(({ data: { session } }) => {
            setSession(session);
            if (session) fetchData();
        });

        const {
            data: { subscription },
        } = supabase.auth.onAuthStateChange((_event, session) => {
            setSession(session);
            if (session) fetchData();
        });

        return () => subscription.unsubscribe();
    }, []);

    useEffect(() => {
        async function fetchLogo() {
            const { data } = await supabase.from('site_content').select('value').eq('key', 'logo_url').single();
            if (data) setLogoUrl(data.value);
        }
        fetchLogo();
    }, []);

    // Forms Data

    const [productForm, setProductForm] = useState({
        title: '', price: '', discount_price: '', description: '', features: '', stripeurl: '', image: '', images: [], content: '', file_path: '',
        category: 'Programmes',
        seo_title: '',
        seo_description: ''
    });

    const handleLogin = async (e) => {
        e.preventDefault();
        const { error } = await supabase.auth.signInWithPassword({
            email,
            password,
        });
        if (error) alert('Erreur de connexion : ' + error.message);
    };

    const handleLogout = async () => {
        await supabase.auth.signOut();
        setSession(null);
    };

    const fetchData = async () => {
        setLoading(true);
        const [articlesRes, productsRes, contentRes, messagesRes, commentsRes, subscribersRes, analyticsRes, reviewsRes, autoLinksRes] = await Promise.all([
            supabase.from('articles').select('*').order('created_at', { ascending: false }),
            supabase.from('products').select('*').order('created_at', { ascending: false }),
            supabase.from('site_content').select('*').order('key'),
            supabase.from('messages').select('*').order('created_at', { ascending: false }),
            supabase.from('comments').select('*').order('created_at', { ascending: false }),
            supabase.from('subscribers').select('*').order('created_at', { ascending: false }),
            supabase.from('page_views').select('*'), // GetAll views to aggregate locally (simple for small scale)
            supabase.from('reviews').select('*').order('created_at', { ascending: false }),
            supabase.from('auto_links').select('*').order('created_at', { ascending: false })
        ]);

        if (articlesRes.data) setArticles(articlesRes.data);
        if (productsRes.data) setProducts(productsRes.data);
        if (contentRes.data) {
            setSiteContent(contentRes.data);
            // Parse home FAQs
            const faqItem = contentRes.data.find(c => c.key === 'home_faq');
            if (faqItem && faqItem.value && faqItem.value !== '[]') {
                try {
                    const parsed = JSON.parse(faqItem.value);
                    if (parsed.length > 0) setHomeFaqs(parsed);
                    else setHomeFaqs(DEFAULT_HOME_FAQS);
                } catch { setHomeFaqs(DEFAULT_HOME_FAQS); }
            } else {
                setHomeFaqs(DEFAULT_HOME_FAQS);
            }
            // Parse contact FAQs
            const contactFaqItem = contentRes.data.find(c => c.key === 'contact_faq');
            if (contactFaqItem && contactFaqItem.value && contactFaqItem.value !== '[]') {
                try {
                    const parsed = JSON.parse(contactFaqItem.value);
                    if (parsed.length > 0) setContactFaqs(parsed);
                    else setContactFaqs(DEFAULT_CONTACT_FAQS);
                } catch { setContactFaqs(DEFAULT_CONTACT_FAQS); }
            } else {
                setContactFaqs(DEFAULT_CONTACT_FAQS);
            }
            // Load Coach data
            const coachKeys = ['coach_name', 'coach_badge', 'coach_tagline', 'coach_description', 'coach_meta_desc', 'coach_philosophy_title', 'coach_cta_title', 'coach_cta_desc', 'coach_image'];
            const newBasics = {};
            coachKeys.forEach(k => {
                const found = contentRes.data.find(c => c.key === k);
                if (found) newBasics[k] = found.value;
            });
            if (Object.keys(newBasics).length > 0) setCoachBasics(prev => ({ ...prev, ...newBasics }));
            const credItem = contentRes.data.find(c => c.key === 'coach_credentials');
            if (credItem && credItem.value) { try { setCoachCredentials(JSON.parse(credItem.value)); } catch { } }
            const valItem = contentRes.data.find(c => c.key === 'coach_values');
            if (valItem && valItem.value) { try { setCoachValues(JSON.parse(valItem.value)); } catch { } }
        }
        if (messagesRes.data) setMessages(messagesRes.data);
        if (commentsRes.data) setComments(commentsRes.data);
        if (subscribersRes.data) setSubscribers(subscribersRes.data);
        if (reviewsRes.data) setReviews(reviewsRes.data);
        if (analyticsRes.data) setRawPageViews(analyticsRes.data);
        if (autoLinksRes && autoLinksRes.data) setAutoLinks(autoLinksRes.data);
        setLoading(false);
    };

    const handleArticleChange = (e) => setArticleForm({ ...articleForm, [e.target.name]: e.target.value });
    const handleProductChange = (e) => setProductForm({ ...productForm, [e.target.name]: e.target.value });

    // Handle Content Edit (Local State)
    const handleContentChange = (key, newValue) => {
        setSiteContent(prev => {
            const exists = prev.find(item => item.key === key);
            if (exists) {
                return prev.map(item => item.key === key ? { ...item, value: newValue } : item);
            } else {
                return [...prev, { key, value: newValue, label: '' }];
            }
        });
    };

    // Save Content to Supabase (Upsert to handle new keys)
    const saveContent = async (key, value, label = '') => {
        const { error } = await supabase.from('site_content').upsert({ key, value, label }, { onConflict: 'key' });
        if (error) {
            alert('Erreur : ' + error.message);
        } else {
            alert('Contenu sauvegardé !');
            // Revalidate caches for all main pages that might use site_content
            const pathsToRevalidate = ['/', '/labo', '/outils', '/boutique', '/coach', '/contact'];
            pathsToRevalidate.forEach(path => {
                fetch('/api/revalidate', { method: 'POST', body: JSON.stringify({ path }) });
            });
        }
    };

    const saveAutoLink = async (e) => {
        e.preventDefault();
        const { error } = await supabase.from('auto_links').insert([newAutoLink]);
        if (error) alert('Erreur : ' + error.message);
        else {
            setNewAutoLink({ keywords: '', url: '', is_active: true });
            fetchData();
        }
    };

    const deleteAutoLink = async (id) => {
        if (!confirm('Supprimer ce lien ?')) return;
        const { error } = await supabase.from('auto_links').delete().eq('id', id);
        if (error) alert('Erreur : ' + error.message);
        else fetchData();
    };






    const handleEdit = (item, type) => {
        setEditingItem({ type, id: item.id });
        if (type === 'article') {
            setArticleForm({
                title: item.title, category: item.category, subcategory: item.subcategory || '', slug: item.slug || '', excerpt: item.excerpt,
                content: item.content, image: item.image, cta: item.cta || '', cta_image: item.cta_image || '', cta_title: item.cta_title || '', cta_text: item.cta_text || '', date: item.date,
                is_published: item.is_published || false,
                affiliate_link: item.affiliate_link || '',
                affiliate_text: item.affiliate_text || '',
                affiliate_image: item.affiliate_image || '',
                affiliate_title: item.affiliate_title || '',
                related_title: item.related_title || '',
                related_subtitle: item.related_subtitle || '',
                related_articles: item.related_articles || [],
                tool_hints: item.tool_hints || {},
                seo_title: siteContent.find(c => c.key === `article_${item.id}_seo_title`)?.value || '',
                seo_description: siteContent.find(c => c.key === `article_${item.id}_seo_desc`)?.value || ''
            });
        } else {
            setProductForm({
                id: item.id,
                title: item.title, price: item.price, discount_price: item.discount_price || '', description: item.description,
                features: item.features ? item.features.join(', ') : '', stripeurl: item.stripeurl, image: item.image,
                images: item.images || (item.image ? [item.image] : []),
                content: item.content || '',
                file_path: item.file_path || '',
                seo_title: siteContent.find(c => c.key === `product_${item.id}_seo_title`)?.value || '',
                seo_description: siteContent.find(c => c.key === `product_${item.id}_seo_desc`)?.value || ''
            });
        }
    };

    const cancelEdit = () => {
        setEditingItem(null);
        setArticleForm({
            title: '', category: '', subcategory: '', slug: '', excerpt: '', content: '', image: '', cta: '', cta_image: '', cta_title: '', cta_text: '',
            is_published: false,
            affiliate_link: '', affiliate_text: '', affiliate_image: '', affiliate_title: '',
            related_title: '', related_subtitle: '', related_articles: [],
            tool_hints: {},
            date: new Date().toLocaleDateString('fr-FR', { day: 'numeric', month: 'short', year: 'numeric' })
        });
        setProductForm({
            title: '', price: '', discount_price: '', description: '', features: '', stripeurl: '', image: '', images: [], content: '', file_path: '',
            seo_title: '', seo_description: ''
        });
    };

    const generateSlug = (title) => {
        if (!title) return '';
        return title
            .toLowerCase()
            .normalize("NFD")
            .replace(/[\u0300-\u036f]/g, "")
            .replace(/[^a-z0-9]+/g, '-')
            .replace(/(^-|-$)+/g, '');
    };

    const handleArticleSubmit = async (e) => {
        e.preventDefault();

        const { seo_title, seo_description, ...mainArticleData } = articleForm;
        const dataToSave = { ...mainArticleData, slug: generateSlug(articleForm.slug || articleForm.title) };

        let articleId = editingItem?.id;
        let error;
        if (editingItem && editingItem.type === 'article') {
            const { error: err } = await supabase.from('articles').update(dataToSave).eq('id', editingItem.id);
            error = err;
        } else {
            const { data: inserted, error: err } = await supabase.from('articles').insert([dataToSave]).select();
            error = err;
            if (inserted && inserted.length > 0) articleId = inserted[0].id;
        }

        if (error) alert('Erreur : ' + error.message);
        else {
            // Save SEO Overrides to site_content
            if (articleId) {
                await Promise.all([
                    supabase.from('site_content').upsert({ key: `article_${articleId}_seo_title`, value: articleForm.seo_title || '', label: `SEO Title: ${articleForm.title}` }, { onConflict: 'key' }),
                    supabase.from('site_content').upsert({ key: `article_${articleId}_seo_desc`, value: articleForm.seo_description || '', label: `SEO Desc: ${articleForm.title}` }, { onConflict: 'key' })
                ]);
            }

            alert(editingItem ? 'Article modifié !' : 'Article ajouté !');
            cancelEdit();
            fetchData();

            // Revalidate cache
            if (dataToSave.category === 'Outils') {
                fetch('/api/revalidate', { method: 'POST', body: JSON.stringify({ path: '/outils' }) });
            } else {
                fetch('/api/revalidate', { method: 'POST', body: JSON.stringify({ path: '/labo' }) });
            }
        }
    };

    const handleProductSubmit = async (e) => {
        e.preventDefault();
        // Features are stored as array, user inputs comma separated string
        const featuresArray = productForm.features.split(',').map(f => f.trim());

        // Create payload
        const { seo_title, seo_description, ...mainProductData } = productForm;
        const productData = {
            ...mainProductData,
            features: featuresArray,
            // Ensure we save the first image of the array as the main image for backward compatibility
            image: productForm.images && productForm.images.length > 0 ? productForm.images[0] : productForm.image,
            slug: generateSlug(productForm.title)
        };

        let productId = editingItem?.id;
        let error;
        if (editingItem && editingItem.type === 'product') {
            const { error: err } = await supabase.from('products').update(productData).eq('id', editingItem.id);
            error = err;
        } else {
            const { data: inserted, error: err } = await supabase.from('products').insert([productData]).select();
            error = err;
            if (inserted && inserted.length > 0) productId = inserted[0].id;
        }

        if (error) alert('Erreur : ' + error.message);
        else {
            // Save SEO Overrides to site_content
            if (productId) {
                await Promise.all([
                    supabase.from('site_content').upsert({ key: `product_${productId}_seo_title`, value: productForm.seo_title || '', label: `SEO Title: ${productForm.title}` }, { onConflict: 'key' }),
                    supabase.from('site_content').upsert({ key: `product_${productId}_seo_desc`, value: productForm.seo_description || '', label: `SEO Desc: ${productForm.title}` }, { onConflict: 'key' })
                ]);
            }

            alert(editingItem ? 'Produit modifié !' : 'Produit ajouté !');
            cancelEdit();
            fetchData();
        }
    };

    const handleImageUpload = async (e, formSetter, currentForm) => {
        const file = e.target.files[0];
        if (!file) return;

        setUploadStatus('Uploading...');

        try {
            const fileExt = file.name.split('.').pop();
            const fileName = `${Date.now()}.${fileExt}`;
            const filePath = `${fileName}`;

            const { error: uploadError } = await supabase.storage.from('images').upload(filePath, file);

            if (uploadError) {
                console.error('Upload Error:', uploadError);
                throw uploadError;
            }

            const { data: { publicUrl } } = supabase.storage.from('images').getPublicUrl(filePath);

            formSetter({ ...currentForm, image: publicUrl });
            setUploadStatus('Upload réussi !');
            setTimeout(() => setUploadStatus(null), 3000);

        } catch (error) {
            alert('Erreur upload : ' + error.message);
            setUploadStatus('Erreur upload');
        }
    };

    const handleMultipleImageUpload = async (e) => {
        const files = Array.from(e.target.files);
        if (files.length === 0) return;

        setUploadStatus(`Uploading ${files.length} images...`);

        try {
            const newImages = [];
            for (const file of files) {
                const fileExt = file.name.split('.').pop();
                const fileName = `prod-${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`;

                const { error: uploadError } = await supabase.storage.from('images').upload(fileName, file);
                if (uploadError) throw uploadError;

                const { data: { publicUrl } } = supabase.storage.from('images').getPublicUrl(fileName);
                newImages.push(publicUrl);
            }

            setProductForm(prev => ({
                ...prev,
                images: [...(prev.images || []), ...newImages]
            }));

            setUploadStatus('Upload réussi !');
            setTimeout(() => setUploadStatus(null), 3000);
        } catch (error) {
            alert('Erreur upload multiple : ' + error.message);
            setUploadStatus('Erreur upload');
        }
    };

    const removeImage = (indexToRemove) => {
        setProductForm(prev => ({
            ...prev,
            images: prev.images.filter((_, index) => index !== indexToRemove)
        }));
    };

    const deleteItem = async (table, id) => {
        await supabase.from(table).delete().eq('id', id);
        fetchData();
    };

    const toggleCommentApproval = async (comment) => {
        const { error } = await supabase.from('comments').update({ is_approved: !comment.is_approved }).eq('id', comment.id);
        if (error) alert("Erreur : " + error.message);
        else fetchData();
    };



    const handleFileUpload = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        setUploadStatus('Uploading PDF...');

        try {
            const fileExt = file.name.split('.').pop();
            const fileName = `product-${Date.now()}.${fileExt}`;
            const filePath = `${fileName}`; // In secure_products bucket

            const { error: uploadError } = await supabase.storage.from('secure_products').upload(filePath, file);

            if (uploadError) {
                console.error('Upload Error:', uploadError);
                throw uploadError;
            }

            // We store the path, not the public URL (because it's private)
            setProductForm({ ...productForm, file_path: filePath });
            setUploadStatus('PDF Uploadé !');
            setTimeout(() => setUploadStatus(null), 3000);

        } catch (error) {
            alert('Erreur upload PDF : ' + error.message);
            setUploadStatus('Erreur upload PDF');
        }
    };

    // ... (Login code)
    if (!session) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-zinc-950 text-white">
                <form onSubmit={handleLogin} className="bg-zinc-900 p-8 rounded-lg border border-zinc-800 w-full max-w-md">
                    <div className="flex justify-center mb-6">
                        <img src={logoUrl} alt="NA Coaching" className="h-20 w-auto" />
                    </div>
                    <h1 className="text-2xl font-black text-center mb-6 uppercase">Accès Back Office</h1>
                    <input
                        type="email"
                        placeholder="Email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="w-full bg-zinc-950 border border-zinc-800 p-3 rounded mb-4 text-white focus:border-[#FF6B00] outline-none"
                    />
                    <input
                        type="password"
                        placeholder="Mot de passe"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="w-full bg-zinc-950 border border-zinc-800 p-3 rounded mb-4 text-white focus:border-[#FF6B00] outline-none"
                    />
                    <button type="submit" className="w-full bg-[#FF6B00] text-black font-black py-3 rounded uppercase hover:bg-white transition">Se connecter</button>
                </form>
            </div>
        );
    }

    // Compute filtered analytics
    const now = new Date();
    let filteredViews = rawPageViews;

    if (analyticsFilter === 'today') {
        const todayStr = now.toISOString().split('T')[0];
        filteredViews = rawPageViews.filter(v => v.created_at && v.created_at.startsWith(todayStr));
    } else if (analyticsFilter === '7d') {
        const sevenDaysAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
        filteredViews = rawPageViews.filter(v => new Date(v.created_at) >= sevenDaysAgo);
    } else if (analyticsFilter === '30d') {
        const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
        filteredViews = rawPageViews.filter(v => new Date(v.created_at) >= thirtyDaysAgo);
    } else if (analyticsFilter === 'custom' && customDate) {
        filteredViews = rawPageViews.filter(v => v.created_at && v.created_at.startsWith(customDate));
    }

    const statsByPath = filteredViews.reduce((acc, curr) => {
        if (!acc[curr.page_path]) {
            acc[curr.page_path] = { count: 0, uniqueIds: new Set() };
        }
        acc[curr.page_path].count += 1;
        if (curr.visitor_id) acc[curr.page_path].uniqueIds.add(curr.visitor_id);
        return acc;
    }, {});

    const analytics = Object.entries(statsByPath)
        .map(([path, stats]) => ({
            path,
            count: stats.count,
            uniqueCount: stats.uniqueIds.size
        }))
        .sort((a, b) => b.count - a.count);

    const totalViews = filteredViews.length;
    const uniqueVisitors = new Set(filteredViews.map(v => v.visitor_id).filter(Boolean)).size;
    const filterLabel = analyticsFilter === 'today' ? "Aujourd'hui"
        : analyticsFilter === '7d' ? '7 derniers jours'
            : analyticsFilter === '30d' ? '30 derniers jours'
                : analyticsFilter === 'custom' && customDate ? `Le ${new Date(customDate + 'T00:00:00').toLocaleDateString('fr-FR')}`
                    : 'Depuis le début';

    return (
        <div className="min-h-screen bg-zinc-50 font-sans text-zinc-900">
            <nav className="bg-black text-white py-4 px-6 mb-8 flex justify-between items-center">
                <div className="flex items-center gap-4">
                    <img src={siteContent.find(c => c.key === 'logo_url')?.value || "/logo.png"} alt="NA Coaching" className="h-8 w-auto" />
                    <h1 className="text-xl font-black uppercase text-[#FF6B00]">NA Coaching <span className="text-white">Admin</span></h1>
                </div>
                <div className="flex items-center gap-6">
                    <Link href="/" className="text-sm font-bold hover:text-[#FF6B00] flex items-center gap-2">
                        <ArrowLeft size={16} /> Retour au site
                    </Link>
                    <button onClick={handleLogout} className="text-sm font-bold text-zinc-500 hover:text-white transition">
                        Se déconnecter
                    </button>
                </div>
            </nav>

            <div className="max-w-6xl mx-auto px-6">

                {/* TABS */}
                <div className="flex gap-4 mb-8 flex-wrap">
                    <button
                        onClick={() => setActiveTab('articles')}
                        className={`flex items-center gap-2 px-6 py-3 rounded font-black uppercase tracking-widest transition ${activeTab === 'articles' ? 'bg-[#FF6B00] text-black' : 'bg-white text-zinc-400'}`}
                    >
                        <FileText size={20} /> Articles
                    </button>
                    <button
                        onClick={() => setActiveTab('products')}
                        className={`flex items-center gap-2 px-6 py-3 rounded font-black uppercase tracking-widest transition ${activeTab === 'products' ? 'bg-[#FF6B00] text-black' : 'bg-white text-zinc-400'}`}
                    >
                        <ShoppingBag size={20} /> Produits
                    </button>
                    <button
                        onClick={() => setActiveTab('content')}
                        className={`flex items-center gap-2 px-6 py-3 rounded font-black uppercase tracking-widest transition ${activeTab === 'content' ? 'bg-[#FF6B00] text-black' : 'bg-white text-zinc-400'}`}
                    >
                        <FileText size={20} /> Contenu
                    </button>
                    <button onClick={() => setActiveTab('faq')} className={`flex items-center gap-2 px-6 py-3 rounded font-black uppercase tracking-widest transition ${activeTab === 'faq' ? 'bg-[#FF6B00] text-black' : 'bg-white text-zinc-400'}`}>
                        <FileText size={20} /> FAQs
                    </button>
                    <button onClick={() => setActiveTab('coach')} className={`flex items-center gap-2 px-6 py-3 rounded font-black uppercase tracking-widest transition ${activeTab === 'coach' ? 'bg-[#FF6B00] text-black' : 'bg-white text-zinc-400'}`}>
                        <Star size={20} /> Coach
                    </button>
                    <button
                        onClick={() => setActiveTab('messages')}
                        className={`flex items-center gap-2 px-6 py-3 rounded font-black uppercase tracking-widest transition ${activeTab === 'messages' ? 'bg-[#FF6B00] text-black' : 'bg-white text-zinc-400'}`}
                    >
                        <Mail size={20} /> Messages {messages.length > 0 && <span className="bg-red-500 text-white text-[10px] px-2 rounded-full">{messages.length}</span>}
                    </button>
                    <button
                        onClick={() => setActiveTab('comments')}
                        className={`flex items-center gap-2 px-6 py-3 rounded font-black uppercase tracking-widest transition ${activeTab === 'comments' ? 'bg-[#FF6B00] text-black' : 'bg-white text-zinc-400'}`}
                    >
                        <FileText size={20} /> Commentaires {comments.filter(c => !c.is_approved).length > 0 && <span className="bg-red-500 text-white text-[10px] px-2 rounded-full">{comments.filter(c => !c.is_approved).length}</span>}
                    </button>
                    <button
                        onClick={() => setActiveTab('reviews')}
                        className={`flex items-center gap-2 px-6 py-3 rounded font-black uppercase tracking-widest transition ${activeTab === 'reviews' ? 'bg-[#FF6B00] text-black' : 'bg-white text-zinc-400'}`}
                    >
                        <Star size={20} /> Avis {reviews.length > 0 && <span className="bg-zinc-800 text-white text-[10px] px-2 rounded-full">{reviews.length}</span>}
                    </button>
                    <button
                        onClick={() => setActiveTab('newsletter')}
                        className={`flex items-center gap-2 px-6 py-3 rounded font-black uppercase tracking-widest transition ${activeTab === 'newsletter' ? 'bg-[#FF6B00] text-black' : 'bg-white text-zinc-400'}`}
                    >
                        <Mail size={20} /> Newsletter {subscribers.length > 0 && <span className="bg-zinc-800 text-white text-[10px] px-2 rounded-full">{subscribers.length}</span>}
                    </button>
                    <button
                        onClick={() => setActiveTab('analytics')}
                        className={`flex items-center gap-2 px-6 py-3 rounded font-black uppercase tracking-widest transition ${activeTab === 'analytics' ? 'bg-[#FF6B00] text-black' : 'bg-white text-zinc-400'}`}
                    >
                        <Activity size={20} /> Stats
                    </button>
                    <button
                        onClick={() => setActiveTab('links')}
                        className={`flex items-center gap-2 px-6 py-3 rounded font-black uppercase tracking-widest transition ${activeTab === 'links' ? 'bg-[#FF6B00] text-black' : 'bg-white text-zinc-400'}`}
                    >
                        <Edit size={20} /> Liens Auto
                    </button>
                </div>

                {activeTab === 'analytics' ? (
                    <div className="bg-white p-6 rounded-lg shadow-sm border border-zinc-200">
                        <div className="flex flex-col gap-4 mb-6">
                            <div className="flex justify-between items-center">
                                <h2 className="text-xl font-black uppercase">Top Pages</h2>
                                <div className="flex gap-2">
                                    <span className="text-xs font-bold text-zinc-400 bg-zinc-100 px-2 py-1 rounded">{filterLabel} — {totalViews} vues</span>
                                    <span className="text-xs font-bold text-[#FF6B00] bg-[#FF6B00]/10 px-2 py-1 rounded">{uniqueVisitors} visiteurs uniques</span>
                                </div>
                            </div>
                            {totalViews > 0 && uniqueVisitors === 0 && (
                                <p className="text-[10px] text-zinc-400 italic">
                                    Note : Le comptage des visiteurs uniques a débuté aujourd'hui. Les vues antérieures n'ont pas d'identifiant.
                                </p>
                            )}

                            {/* Date Filter Buttons */}
                            <div className="flex flex-wrap gap-2 items-center">
                                {[
                                    { key: 'today', label: "Aujourd'hui" },
                                    { key: '7d', label: '7 jours' },
                                    { key: '30d', label: '30 jours' },
                                    { key: 'all', label: 'Tout' },
                                ].map(opt => (
                                    <button
                                        key={opt.key}
                                        onClick={() => { setAnalyticsFilter(opt.key); setCustomDate(''); }}
                                        className={`px-4 py-2 rounded text-xs font-bold uppercase tracking-wider transition ${analyticsFilter === opt.key
                                            ? 'bg-[#FF6B00] text-black'
                                            : 'bg-zinc-100 text-zinc-500 hover:bg-zinc-200'
                                            }`}
                                    >
                                        {opt.label}
                                    </button>
                                ))}
                                <div className="flex items-center gap-2 ml-2">
                                    <input
                                        type="date"
                                        value={customDate}
                                        onChange={(e) => { setCustomDate(e.target.value); setAnalyticsFilter('custom'); }}
                                        className="px-3 py-2 rounded border border-zinc-200 text-xs font-bold text-zinc-600 bg-zinc-50 focus:outline-none focus:border-[#FF6B00]"
                                    />
                                </div>
                            </div>
                        </div>
                        <div className="space-y-6">
                            {analytics.length === 0 ? (
                                <p className="text-zinc-500 italic">Pas de données pour cette période.</p>
                            ) : (
                                <div className="space-y-4">
                                    {analytics.map((page, index) => {
                                        let pageLabel = page.path;
                                        if (page.path === '/') pageLabel = '🏠 Accueil';
                                        else if (page.path === '/labo') pageLabel = '🧪 Le Labo';
                                        else if (page.path === '/boutique') pageLabel = '🛍️ Boutique';
                                        else if (page.path.startsWith('/blog/')) {
                                            const articleIdOrSlug = page.path.split('/').pop();
                                            const article = articles.find(a => a.id.toString() === articleIdOrSlug || a.slug === articleIdOrSlug);
                                            if (article) pageLabel = `📄 Article : ${article.title}`;
                                        }
                                        else if (page.path.startsWith('/outils/')) pageLabel = `🔧 ${page.path.split('/').pop()}`;
                                        else if (page.path.startsWith('/boutique/')) pageLabel = `🛍️ Produit`;

                                        return (
                                            <div key={page.path} className="flex items-center gap-4">
                                                <div className="w-6 font-black text-zinc-300 text-sm">#{index + 1}</div>
                                                <div className="flex-grow">
                                                    <div className="flex justify-between text-xs font-bold mb-2 uppercase text-zinc-600">
                                                        <span>{pageLabel}</span>
                                                        <span>{page.uniqueCount} u. / {page.count} vues</span>
                                                    </div>
                                                    <div className="h-1.5 bg-zinc-100 rounded-full overflow-hidden">
                                                        <div
                                                            className="h-full bg-[#FF6B00]"
                                                            style={{ width: `${(page.count / analytics[0].count) * 100}%` }}
                                                        ></div>
                                                    </div>
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                            )}
                        </div>
                    </div>
                ) : activeTab === 'links' ? (
                    <div className="bg-white p-6 rounded-lg shadow-sm border border-zinc-200">
                        <h2 className="text-xl font-black mb-6 uppercase tracking-tight text-[#FF6B00]">Gestion des Liens Automatiques</h2>
                        <p className="text-sm text-zinc-500 mb-8">
                            Ajoute des mots-clés qui seront automatiquement transformés en liens sur tout le site (outils et blog).
                            Sépare les synonymes par des virgules (ex: "VMA, VO2max").
                        </p>

                        <form onSubmit={saveAutoLink} className="bg-zinc-50 p-6 rounded border border-zinc-200 mb-8">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <label className="block text-xs font-black uppercase text-zinc-500 mb-2">Mots-clés (séparés par des virgules)</label>
                                    <input
                                        type="text"
                                        placeholder="ex: VMA, VO2max, Vitesse Maximale"
                                        required
                                        value={newAutoLink.keywords}
                                        onChange={(e) => setNewAutoLink({ ...newAutoLink, keywords: e.target.value })}
                                        className="w-full p-3 border rounded text-sm focus:border-[#FF6B00] outline-none font-bold"
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs font-black uppercase text-zinc-500 mb-2">URL de destination</label>
                                    <input
                                        type="text"
                                        placeholder="ex: /outils/vma-vo2"
                                        required
                                        value={newAutoLink.url}
                                        onChange={(e) => setNewAutoLink({ ...newAutoLink, url: e.target.value })}
                                        className="w-full p-3 border rounded text-sm focus:border-[#FF6B00] outline-none font-bold"
                                    />
                                </div>
                            </div>
                            <div className="mt-4 flex justify-end">
                                <button type="submit" className="bg-[#FF6B00] text-black px-8 py-3 rounded font-black uppercase tracking-widest text-sm hover:scale-105 transition-all">
                                    Ajouter le Lien Auto
                                </button>
                            </div>
                        </form>

                        <div className="space-y-4">
                            <h3 className="text-sm font-black uppercase text-zinc-400 mb-4">Liens Actifs ({autoLinks.length})</h3>
                            {autoLinks.length === 0 ? (
                                <p className="text-zinc-500 italic">Aucun lien automatique pour le moment.</p>
                            ) : (
                                <div className="grid grid-cols-1 gap-4">
                                    {autoLinks.map((link) => (
                                        <div key={link.id} className="flex justify-between items-center bg-white p-4 rounded border border-zinc-100 shadow-sm hover:border-[#FF6B00] transition-colors">
                                            <div>
                                                <div className="flex gap-2 mb-1">
                                                    {link.keywords.split(',').map(kw => (
                                                        <span key={kw} className="bg-[#FF6B00]/10 text-[#FF6B00] text-[10px] px-2 py-0.5 rounded font-black uppercase">{kw.trim()}</span>
                                                    ))}
                                                </div>
                                                <div className="text-xs font-bold text-zinc-400">{link.url}</div>
                                            </div>
                                            <button
                                                onClick={() => deleteAutoLink(link.id)}
                                                className="text-red-500 p-2 hover:bg-red-50 rounded transition-colors"
                                            >
                                                <Trash2 size={18} />
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>
                ) : activeTab === 'newsletter' ? (
                    <div className="bg-white p-6 rounded-lg shadow-sm border border-zinc-200">
                        <h2 className="text-xl font-black mb-6 uppercase">Abonnés Newsletter ({subscribers.length})</h2>
                        <div className="space-y-4">
                            {subscribers.length === 0 ? (
                                <p className="text-zinc-500 italic">Aucun abonné pour le moment.</p>
                            ) : (
                                <div className="space-y-2">
                                    {subscribers.map(sub => (
                                        <div key={sub.id} className="flex justify-between items-center bg-zinc-50 p-3 rounded border border-zinc-100">
                                            <span className="font-bold">{sub.email}</span>
                                            <span className="text-zinc-400 text-xs">{new Date(sub.created_at).toLocaleDateString()}</span>
                                            <button
                                                onClick={() => deleteItem('subscribers', sub.id)}
                                                className="text-red-500 text-xs font-bold hover:underline flex items-center gap-1"
                                            >
                                                <Trash2 size={12} /> Supprimer
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>
                ) : activeTab === 'comments' ? (
                    <div className="bg-white p-6 rounded-lg shadow-sm border border-zinc-200">
                        <h2 className="text-xl font-black mb-6 uppercase">Modération des Commentaires ({comments.length})</h2>
                        <div className="space-y-4">
                            {comments.length === 0 ? (
                                <p className="text-zinc-500 italic">Aucun commentaire.</p>
                            ) : (
                                comments.map(comment => (
                                    <div key={comment.id} className={`border-l-4 p-4 rounded bg-zinc-50 ${comment.is_approved ? 'border-green-500' : 'border-orange-500'}`}>
                                        <div className="flex justify-between items-start mb-2">
                                            <div>
                                                <span className="font-black uppercase text-sm">{comment.author_name}</span>
                                                <span className="text-zinc-400 text-xs ml-2">
                                                    sur l'article {articles.find(a => a.id === comment.article_id)?.title || 'Inconnu'}
                                                </span>
                                            </div>
                                            <div className="flex gap-2">
                                                <span className={`text-[10px] font-bold px-2 py-1 rounded uppercase ${comment.is_approved ? 'bg-green-100 text-green-700' : 'bg-orange-100 text-orange-700'}`}>
                                                    {comment.is_approved ? 'Publié' : 'En attente'}
                                                </span>
                                                <span className="text-zinc-400 text-xs">{new Date(comment.created_at).toLocaleDateString()}</span>
                                            </div>
                                        </div>
                                        <p className="text-zinc-600 text-sm mb-4">{comment.content}</p>
                                        <div className="flex gap-4 border-t border-zinc-200 pt-3">
                                            <button
                                                onClick={() => toggleCommentApproval(comment)}
                                                className={`text-xs font-bold uppercase px-3 py-2 rounded transition ${comment.is_approved ? 'bg-zinc-200 hover:bg-zinc-300' : 'bg-green-500 text-white hover:bg-green-600'}`}
                                            >
                                                {comment.is_approved ? 'Masquer' : 'Valider'}
                                            </button>
                                            <button
                                                onClick={() => deleteItem('comments', comment.id)}
                                                className="text-red-500 text-xs font-bold hover:underline flex items-center gap-1"
                                            >
                                                <Trash2 size={12} /> Supprimer
                                            </button>
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>
                    </div>
                ) : activeTab === 'reviews' ? (
                    <div className="bg-white p-6 rounded-lg shadow-sm border border-zinc-200">
                        <h2 className="text-xl font-black mb-6 uppercase">Gestion des Avis ({reviews.length})</h2>
                        <div className="space-y-4">
                            {reviews.length === 0 ? (
                                <p className="text-zinc-500 italic">Aucun avis client pour le moment.</p>
                            ) : (
                                reviews.map(review => (
                                    <div key={review.id} className="border-l-4 border-yellow-500 p-4 rounded bg-zinc-50">
                                        <div className="flex justify-between items-start mb-2">
                                            <div>
                                                <span className="font-black uppercase text-sm">{review.author_name}</span>
                                                <span className="text-zinc-400 text-xs ml-2">
                                                    sur {products.find(p => p.id === review.product_id)?.title || 'Produit inconnu'}
                                                </span>
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <div className="flex">
                                                    {[1, 2, 3, 4, 5].map(star => (
                                                        <Star
                                                            key={star}
                                                            size={14}
                                                            fill={review.rating >= star ? '#FF6B00' : 'transparent'}
                                                            color={review.rating >= star ? '#FF6B00' : '#D1D5DB'}
                                                        />
                                                    ))}
                                                </div>
                                                <span className="text-zinc-400 text-xs">{new Date(review.created_at).toLocaleDateString()}</span>
                                            </div>
                                        </div>
                                        {review.comment && <p className="text-zinc-600 text-sm mb-4">{review.comment}</p>}
                                        <div className="flex gap-4 border-t border-zinc-200 pt-3">
                                            <button
                                                onClick={() => deleteItem('reviews', review.id)}
                                                className="text-red-500 text-xs font-bold hover:underline flex items-center gap-1"
                                            >
                                                <Trash2 size={12} /> Supprimer
                                            </button>
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>
                    </div>
                ) : activeTab === 'content' ? (
                    <div className="bg-white p-6 rounded-lg shadow-sm border border-zinc-200">
                        <h2 className="text-xl font-black mb-6 uppercase">Personnalisation des textes</h2>
                        <div className="space-y-6">
                            <h3 className="text-lg font-bold uppercase border-b pb-2 text-[#FF6B00]">SEO Global (Accueil)</h3>
                            {[
                                { key: 'site_title', label: 'Titre du Site (Onglet)' },
                                { key: 'site_description', label: 'Description Google (Meta)' }
                            ].map(field => {
                                const itemValue = siteContent.find(c => c.key === field.key)?.value || '';
                                return (
                                    <div key={field.key}>
                                        <label className="block text-xs font-bold uppercase text-zinc-500 mb-2">{field.label}</label>
                                        <div className="flex gap-4 items-start">
                                            <textarea
                                                value={itemValue}
                                                onChange={(e) => handleContentChange(field.key, e.target.value)}
                                                className="w-full border p-3 rounded text-sm min-h-[50px] focus:border-[#FF6B00] outline-none"
                                            />
                                            <button
                                                onClick={() => saveContent(field.key, itemValue, field.label)}
                                                className="bg-black text-white px-4 rounded font-bold uppercase text-xs hover:bg-[#FF6B00] hover:text-black transition h-fit py-3"
                                            >
                                                Sauvegarder
                                            </button>
                                        </div>
                                    </div>
                                );
                            })}

                            <h3 className="text-lg font-bold uppercase border-b pb-2 text-[#FF6B00] pt-6">Héros (Accueil)</h3>
                            {[
                                { key: 'hero_title', label: 'Titre Principal' },
                                { key: 'hero_subtitle', label: 'Sous-titre' },
                                { key: 'hero_cta_primary_v2', label: 'Bouton 1 - Primaire (Labo)' },
                                { key: 'hero_cta_secondary_v2', label: 'Bouton 2 - Secondaire (Outils)' }
                            ].map(field => {
                                const itemValue = siteContent.find(c => c.key === field.key)?.value || '';
                                return (
                                    <div key={field.key}>
                                        <label className="block text-xs font-bold uppercase text-zinc-500 mb-2">{field.label}</label>
                                        <div className="flex gap-4 items-start">
                                            <textarea
                                                value={itemValue}
                                                onChange={(e) => handleContentChange(field.key, e.target.value)}
                                                className="w-full border p-3 rounded text-sm min-h-[50px] focus:border-[#FF6B00] outline-none"
                                            />
                                            <button
                                                onClick={() => saveContent(field.key, itemValue, field.label)}
                                                className="bg-black text-white px-4 rounded font-bold uppercase text-xs hover:bg-[#FF6B00] hover:text-black transition h-fit py-3"
                                            >
                                                Sauvegarder
                                            </button>
                                        </div>
                                    </div>
                                );
                            })}

                            <h3 className="text-lg font-bold uppercase border-b pb-2 text-[#FF6B00] pt-6">Barre d'Expertise</h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {siteContent.filter(item => item.key.startsWith('expertise_')).map(item => (
                                    <div key={item.key}>
                                        <label className="block text-xs font-bold uppercase text-zinc-500 mb-2">{item.label}</label>
                                        <div className="flex gap-2 items-start">
                                            <input
                                                value={item.value}
                                                onChange={(e) => handleContentChange(item.key, e.target.value)}
                                                className="w-full border p-3 rounded text-sm"
                                            />
                                            <button
                                                onClick={() => saveContent(item.key, item.value)}
                                                className="bg-black text-white px-3 rounded font-bold uppercase text-xs hover:bg-[#FF6B00] hover:text-black transition h-fit py-3"
                                            >
                                                <Save size={16} />
                                            </button>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            <h3 className="text-lg font-bold uppercase border-b pb-2 text-[#FF6B00] pt-6">Boîte Expert (Articles)</h3>
                            {siteContent.filter(item => ['expert_box_title', 'expert_box_text'].includes(item.key)).map(item => (
                                <div key={item.key}>
                                    <label className="block text-xs font-bold uppercase text-zinc-500 mb-2">{item.label}</label>
                                    <div className="flex gap-4 items-start">
                                        <textarea
                                            value={item.value}
                                            onChange={(e) => handleContentChange(item.key, e.target.value)}
                                            className="w-full border p-3 rounded text-sm min-h-[50px]"
                                        />
                                        <button
                                            onClick={() => saveContent(item.key, item.value)}
                                            className="bg-black text-white px-4 rounded font-bold uppercase text-xs hover:bg-[#FF6B00] hover:text-black transition h-fit py-3"
                                        >
                                            Sauvegarder
                                        </button>
                                    </div>
                                </div>
                            ))}
                            <h3 className="text-lg font-bold uppercase border-b pb-2 text-[#FF6B00] pt-6">Articles Recommandés (Outils)</h3>
                            {[
                                { key: 'tools_related_title', label: 'Titre de la section' },
                                { key: 'tools_related_subtitle', label: 'Sous-titre de la section' }
                            ].map(field => {
                                const itemValue = siteContent.find(c => c.key === field.key)?.value || '';
                                return (
                                    <div key={field.key} className="mb-4">
                                        <label className="block text-xs font-bold uppercase text-zinc-500 mb-2">{field.label}</label>
                                        <div className="flex gap-4 items-start">
                                            <input
                                                value={itemValue}
                                                onChange={(e) => handleContentChange(field.key, e.target.value)}
                                                className="w-full border p-3 rounded text-sm focus:border-[#FF6B00] outline-none"
                                                placeholder={field.key === 'tools_related_title' ? 'Articles Recommandés' : 'En apprendre plus avec le Labo'}
                                            />
                                            <button
                                                onClick={() => saveContent(field.key, itemValue, field.label)}
                                                className="bg-black text-white px-4 rounded font-bold uppercase text-xs hover:bg-[#FF6B00] hover:text-black transition h-fit py-3"
                                            >
                                                Sauvegarder
                                            </button>
                                        </div>
                                    </div>
                                );
                            })}

                            <h3 className="text-lg font-bold uppercase border-b pb-2 text-[#FF6B00] pt-6">Outils Mis En Avant (Accueil)</h3>
                            {[1, 2, 3, 4].map(num => (
                                <div key={`home_tool_${num}`} className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-zinc-50 p-4 rounded-lg border border-zinc-100 mb-4">
                                    <div>
                                        <label className="block text-[10px] font-black uppercase text-zinc-500 mb-2">Outil {num} - Titre</label>
                                        <div className="flex gap-2 items-start">
                                            <input
                                                value={siteContent.find(c => c.key === `home_tool_${num}_title`)?.value || ''}
                                                onChange={(e) => handleContentChange(`home_tool_${num}_title`, e.target.value)}
                                                className="w-full border p-3 rounded text-sm focus:border-[#FF6B00] outline-none bg-white"
                                            />
                                            <button
                                                onClick={() => saveContent(`home_tool_${num}_title`, siteContent.find(c => c.key === `home_tool_${num}_title`)?.value || '', `Outil ${num} - Titre`)}
                                                className="bg-black text-white px-3 rounded font-bold uppercase text-xs hover:bg-[#FF6B00] transition h-fit py-3"
                                            >
                                                <Save size={16} />
                                            </button>
                                        </div>
                                    </div>
                                    <div>
                                        <label className="block text-[10px] font-black uppercase text-zinc-500 mb-2">Outil {num} - Description</label>
                                        <div className="flex gap-2 items-start">
                                            <textarea
                                                value={siteContent.find(c => c.key === `home_tool_${num}_desc`)?.value || ''}
                                                onChange={(e) => handleContentChange(`home_tool_${num}_desc`, e.target.value)}
                                                className="w-full border p-3 rounded text-sm min-h-[50px] focus:border-[#FF6B00] outline-none bg-white"
                                            />
                                            <button
                                                onClick={() => saveContent(`home_tool_${num}_desc`, siteContent.find(c => c.key === `home_tool_${num}_desc`)?.value || '', `Outil ${num} - Description`)}
                                                className="bg-black text-white px-3 rounded font-bold uppercase text-xs hover:bg-[#FF6B00] transition h-fit py-3"
                                            >
                                                <Save size={16} />
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            ))}



                            <h3 className="text-lg font-bold uppercase border-b pb-2 text-[#FF6B00] pt-6">Sections & Textes Divers</h3>
                            {[
                                { key: 'about_title', label: 'Titre Section Labo' },
                                { key: 'about_subtitle', label: 'Sous-titre Section Labo' },
                                { key: 'about_text', label: 'Texte Section Labo (Optionnel)' },
                                { key: 'outils_header_title', label: 'Titre En-tête Page Outils' },
                                { key: 'outils_header_desc', label: 'Description En-tête Page Outils' },
                                { key: 'tools_subtitle', label: 'Sous-titre Section Outils Gratuits (Accueil)' },
                                { key: 'outils_seo_title', label: 'Titre SEO (Bas de page Outils)' },
                                { key: 'outils_seo_desc', label: 'Description SEO (Bas de page Outils)' },
                                { key: 'shop_title', label: 'Titre Section Boutique' },
                                { key: 'shop_subtitle', label: 'Sous-titre Section Boutique' }
                            ].map(field => {
                                const itemValue = siteContent.find(c => c.key === field.key)?.value || '';
                                return (
                                    <div key={field.key}>
                                        <label className="block text-xs font-bold uppercase text-zinc-500 mb-2">{field.label}</label>
                                        <div className="flex gap-4 items-start">
                                            <textarea
                                                value={itemValue}
                                                onChange={(e) => handleContentChange(field.key, e.target.value)}
                                                className="w-full border p-3 rounded text-sm min-h-[50px] focus:border-[#FF6B00] outline-none"
                                            />
                                            <button
                                                onClick={() => saveContent(field.key, itemValue, field.label)}
                                                className="bg-black text-white px-4 rounded font-bold uppercase text-xs hover:bg-[#FF6B00] hover:text-black transition h-fit py-3"
                                            >
                                                Sauvegarder
                                            </button>
                                        </div>
                                    </div>
                                );
                            })}

                            <h3 className="text-lg font-bold uppercase border-b pb-2 text-[#FF6B00] pt-6">Volumes Encyclopédie (Textes SEO)</h3>
                            {[
                                { key: 'volume_seo_volume-1-la-science-de-la-force', label: 'Volume 1 - Force (SEO)' },
                                { key: 'volume_seo_volume-2-la-science-de-lendurance', label: 'Volume 2 - Endurance (SEO)' },
                                { key: 'volume_seo_volume-3-la-science-de-la-sante', label: 'Volume 3 - Santé (SEO)' },
                                { key: 'volume_seo_volume-4-anecdotes-sportives', label: 'Volume 4 - Anecdotes Sportives (SEO)' }
                            ].map(field => {
                                const itemValue = siteContent.find(c => c.key === field.key)?.value || '';
                                return (
                                    <div key={field.key}>
                                        <label className="block text-xs font-bold uppercase text-zinc-500 mb-2">{field.label}</label>
                                        <div className="flex gap-4 items-start">
                                            <textarea
                                                value={itemValue}
                                                onChange={(e) => handleContentChange(field.key, e.target.value)}
                                                className="w-full border p-3 rounded text-sm min-h-[150px] focus:border-[#FF6B00] outline-none"
                                            />
                                            <button
                                                onClick={() => saveContent(field.key, itemValue, field.label)}
                                                className="bg-black text-white px-4 rounded font-bold uppercase text-xs hover:bg-[#FF6B00] hover:text-black transition h-fit py-3"
                                            >
                                                Sauvegarder
                                            </button>
                                        </div>
                                    </div>
                                );
                            })}

                            <h3 className="text-lg font-bold uppercase border-b pb-2 text-[#FF6B00] pt-6">Contact (Appel à l'action)</h3>
                            {siteContent.filter(item => item.key.startsWith('contact_cta_')).map(item => (
                                <div key={item.key}>
                                    <label className="block text-xs font-bold uppercase text-zinc-500 mb-2">{item.label}</label>
                                    <div className="flex gap-4 items-start">
                                        <textarea
                                            value={item.value}
                                            onChange={(e) => handleContentChange(item.key, e.target.value)}
                                            className="w-full border p-3 rounded text-sm min-h-[50px]"
                                        />
                                        <button
                                            onClick={() => saveContent(item.key, item.value)}
                                            className="bg-black text-white px-4 rounded font-bold uppercase text-xs hover:bg-[#FF6B00] hover:text-black transition h-fit py-3"
                                        >
                                            Sauvegarder
                                        </button>
                                    </div>
                                </div>
                            ))}

                            <h3 className="text-lg font-bold uppercase border-b pb-2 text-[#FF6B00] pt-6">Pied de Page (Footer)</h3>
                            {siteContent.filter(item => ['footer_text', 'footer_newsletter_title', 'footer_newsletter_text', 'footer_follow_title', 'footer_copyright', 'footer_sub_copyright'].includes(item.key)).map(item => (
                                <div key={item.key}>
                                    <label className="block text-xs font-bold uppercase text-zinc-500 mb-2">{item.label}</label>
                                    <div className="flex gap-4 items-start">
                                        <input
                                            value={item.value}
                                            onChange={(e) => handleContentChange(item.key, e.target.value)}
                                            className="w-full border p-3 rounded text-sm"
                                        />
                                        <button
                                            onClick={() => saveContent(item.key, item.value)}
                                            className="bg-black text-white px-4 rounded font-bold uppercase text-xs hover:bg-[#FF6B00] hover:text-black transition h-fit py-3"
                                        >
                                            Sauvegarder
                                        </button>
                                    </div>
                                </div>
                            ))}

                            <h3 className="text-lg font-bold uppercase border-b pb-2 text-[#FF6B00] pt-6">Identité Visuelle</h3>
                            <div className="flex-grow">
                                <label className="block text-xs font-bold uppercase text-zinc-500 mb-2">Logo du Site</label>
                                <div className="flex items-center gap-4 mb-2">
                                    <img src={siteContent.find(c => c.key === 'logo_url')?.value || "/logo.png"} alt="Logo" className="h-12 w-auto bg-zinc-100 p-1 rounded" />
                                    <input
                                        type="file"
                                        accept="image/*"
                                        onChange={async (e) => {
                                            const file = e.target.files[0];
                                            if (!file) return;
                                            const fileName = `logo-${Date.now()}.${file.name.split('.').pop()}`;
                                            const { error } = await supabase.storage.from('images').upload(fileName, file);
                                            if (error) { alert('Erreur upload Supabase: ' + error.message); return; }

                                            const { data } = supabase.storage.from('images').getPublicUrl(fileName);
                                            if (!data || !data.publicUrl) { alert('Erreur: Pas de publicUrl reçue'); return; }

                                            const publicUrl = data.publicUrl;
                                            handleContentChange('logo_url', publicUrl);
                                            saveContent('logo_url', publicUrl);
                                        }}
                                        className="text-xs"
                                    />
                                </div>
                                <input
                                    value={siteContent.find(c => c.key === 'logo_url')?.value}
                                    onChange={(e) => handleContentChange('logo_url', e.target.value)}
                                    className="w-full border p-3 rounded text-sm bg-zinc-50 text-zinc-500"
                                    disabled
                                />
                            </div>


                            <h3 className="text-lg font-bold uppercase border-b pb-2 text-[#FF6B00] pt-6">Page Produit (Détails)</h3>
                            {siteContent.filter(item => ['product_page_back_link', 'product_page_features_title', 'product_page_subtitle', 'product_page_cta'].includes(item.key)).map(item => (
                                <div key={item.key}>
                                    <label className="block text-xs font-bold uppercase text-zinc-500 mb-2">{item.label}</label>
                                    <div className="flex gap-4 items-start">
                                        <input
                                            value={item.value}
                                            onChange={(e) => handleContentChange(item.key, e.target.value)}
                                            className="w-full border p-3 rounded text-sm"
                                        />
                                        <button
                                            onClick={() => saveContent(item.key, item.value)}
                                            className="bg-black text-white px-4 rounded font-bold uppercase text-xs hover:bg-[#FF6B00] hover:text-black transition h-fit py-3"
                                        >
                                            Sauvegarder
                                        </button>
                                    </div>
                                </div>
                            ))}

                            <h3 className="text-lg font-bold uppercase border-b pb-2 text-[#FF6B00] pt-8">Pages Légales</h3>
                            <button
                                onClick={async () => {
                                    if (!confirm('Voulez-vous initialiser le contenu légal par défaut ?')) return;
                                    const legalDefaults = [
                                        { key: 'legal_mentions', label: 'Mentions Légales', value: `EDITEUR DU SITE\nLe site na-coaching.com est édité par [VOTRE NOM], micro-entrepreneur, immatriculé sous le numéro SIRET [VOTRE SIRET], dont le siège social est situé au [VOTRE ADRESSE].\n\nDirecteur de la publication : [VOTRE NOM]\nContact : [VOTRE EMAIL]\n\nHÉBERGEMENT\nLe site est hébergé par Vercel Inc., 340 S Lemon Ave #4133 Walnut, CA 91789, USA.\n\nPROPRIÉTÉ INTELLECTUELLE\nL’ensemble de ce site relève de la législation française et internationale sur le droit d’auteur et la propriété intellectuelle. Tous les droits de reproduction sont réservés.` },
                                        { key: 'privacy_policy', label: 'Politique de Confidentialité', value: `COLLECTE DES DONNÉES\nLes informations recueillies via le formulaire de contact ou l'inscription à la newsletter sont enregistrées dans un fichier informatisé par NA Coaching. Elles sont destinées à la gestion de la clientèle.\n\nDROIT D'ACCÈS\nConformément à la loi « informatique et libertés », vous pouvez exercer votre droit d'accès aux données vous concernant et les faire rectifier en contactant : [VOTRE EMAIL].\n\nCOOKIES\nCe site utilise des cookies pour améliorer l'expérience utilisateur et réaliser des statistiques de visites anonymes via Supabase et Vercel Analytics.` }
                                    ];
                                    for (const item of legalDefaults) {
                                        await saveContent(item.key, item.value, item.label);
                                    }
                                    fetchData();
                                }}
                                className="mb-4 text-xs font-bold text-zinc-500 hover:text-[#FF6B00] underline"
                            >
                                Initialiser le contenu par défaut (Template)
                            </button>
                            {siteContent.filter(item => ['legal_mentions', 'privacy_policy'].includes(item.key)).map(item => (
                                <div key={item.key}>
                                    <label className="block text-xs font-bold uppercase text-zinc-500 mb-2">{item.label}</label>
                                    <div className="flex gap-4 items-start">
                                        <textarea
                                            value={item.value}
                                            onChange={(e) => handleContentChange(item.key, e.target.value)}
                                            className="w-full border p-3 rounded text-sm min-h-[200px]"
                                        />
                                        <button
                                            onClick={() => saveContent(item.key, item.value)}
                                            className="bg-black text-white px-4 rounded font-bold uppercase text-xs hover:bg-[#FF6B00] hover:text-black transition h-fit py-3"
                                        >
                                            Sauvegarder
                                        </button>
                                    </div>
                                </div>
                            ))}

                        </div>
                    </div>
                ) : activeTab === 'faq' ? (
                    <div className="bg-white p-6 rounded-lg shadow-sm border border-zinc-200 space-y-12">
                        {/* SECTION 1: Home FAQs */}
                        <div>
                            <h2 className="text-xl font-black mb-2 uppercase">FAQs Page d'Accueil</h2>
                            <p className="text-zinc-500 text-sm mb-6">Ces questions apparaissent sur la page d'accueil juste avant le bouton "Me Contacter".</p>

                            <div className="space-y-3 mb-6">
                                {homeFaqs.map((faq, i) => (
                                    <div key={i} className="flex gap-4 items-start bg-zinc-50 p-4 rounded border border-zinc-200">
                                        <div className="flex-grow space-y-2">
                                            <input
                                                className="w-full border p-2 rounded text-sm font-bold bg-white focus:outline-none focus:ring-1 focus:ring-[#FF6B00]"
                                                value={faq.question}
                                                onChange={(e) => {
                                                    const updated = [...homeFaqs];
                                                    updated[i].question = e.target.value;
                                                    setHomeFaqs(updated);
                                                }}
                                            />
                                            <textarea
                                                className="w-full border p-2 rounded text-xs bg-white h-20 focus:outline-none focus:ring-1 focus:ring-[#FF6B00]"
                                                value={faq.answer}
                                                onChange={(e) => {
                                                    const updated = [...homeFaqs];
                                                    updated[i].answer = e.target.value;
                                                    setHomeFaqs(updated);
                                                }}
                                            />
                                        </div>
                                        <div className="flex flex-col gap-3 pt-2">
                                            <button
                                                onClick={async () => {
                                                    await supabase.from('site_content').upsert({ key: 'home_faq', label: 'FAQ Page Accueil', value: JSON.stringify(homeFaqs) }, { onConflict: 'key' });
                                                    fetch('/api/revalidate', { method: 'POST', body: JSON.stringify({ path: '/' }) });
                                                    alert('FAQ modifiée avec succès !');
                                                }}
                                                className="text-green-600 hover:text-green-800 flex-shrink-0"
                                                title="Sauvegarder la modification"
                                            >
                                                <Save size={16} />
                                            </button>
                                            <button
                                                onClick={async () => {
                                                    const updated = homeFaqs.filter((_, idx) => idx !== i);
                                                    setHomeFaqs(updated);
                                                    await supabase.from('site_content').upsert({ key: 'home_faq', label: 'FAQ Page Accueil', value: JSON.stringify(updated) }, { onConflict: 'key' });
                                                    fetch('/api/revalidate', { method: 'POST', body: JSON.stringify({ path: '/' }) });
                                                }}
                                                className="text-red-500 hover:text-red-700 flex-shrink-0"
                                                title="Supprimer la question"
                                            >
                                                <Trash2 size={16} />
                                            </button>
                                        </div>
                                    </div>
                                ))}
                                {homeFaqs.length === 0 && <p className="text-zinc-400 italic text-sm">Aucune question pour le moment.</p>}
                            </div>

                            <div className="bg-zinc-50 p-4 rounded border border-zinc-200 space-y-3">
                                <h3 className="font-bold text-sm uppercase text-zinc-500">Ajouter une question</h3>
                                <input
                                    value={newFaqQ}
                                    onChange={e => setNewFaqQ(e.target.value)}
                                    placeholder="Question (ex: Proposez-vous du coaching personnalisé ?)"
                                    className="w-full border p-2 rounded text-sm"
                                />
                                <textarea
                                    value={newFaqA}
                                    onChange={e => setNewFaqA(e.target.value)}
                                    placeholder="Réponse..."
                                    className="w-full border p-2 rounded text-sm h-20"
                                />
                                <button
                                    disabled={!newFaqQ || !newFaqA || faqSaving}
                                    onClick={async () => {
                                        if (!newFaqQ || !newFaqA) return;
                                        setFaqSaving(true);
                                        const updated = [...homeFaqs, { question: newFaqQ, answer: newFaqA }];
                                        setHomeFaqs(updated);
                                        await supabase.from('site_content').upsert({ key: 'home_faq', label: 'FAQ Page Accueil', value: JSON.stringify(updated) }, { onConflict: 'key' });
                                        fetch('/api/revalidate', { method: 'POST', body: JSON.stringify({ path: '/' }) });
                                        setNewFaqQ('');
                                        setNewFaqA('');
                                        setFaqSaving(false);
                                    }}
                                    className="bg-black text-white px-6 py-2 rounded font-bold uppercase text-xs hover:bg-[#FF6B00] hover:text-black transition disabled:opacity-50"
                                >
                                    {faqSaving ? 'Sauvegarde...' : '+ Ajouter'}
                                </button>
                            </div>
                        </div>

                        {/* SECTION: Contact FAQs */}
                        <div>
                            <h2 className="text-xl font-black mb-2 uppercase">FAQs Page Contact</h2>
                            <p className="text-zinc-500 text-sm mb-6">Ces questions apparaissent tout en bas de la page "Me Contacter".</p>

                            <div className="space-y-3 mb-6">
                                {contactFaqs.map((faq, i) => (
                                    <div key={i} className="flex gap-4 items-start bg-zinc-50 p-4 rounded border border-zinc-200">
                                        <div className="flex-grow space-y-2">
                                            <input
                                                className="w-full border p-2 rounded text-sm font-bold bg-white focus:outline-none focus:ring-1 focus:ring-[#FF6B00]"
                                                value={faq.question}
                                                onChange={(e) => {
                                                    const updated = [...contactFaqs];
                                                    updated[i].question = e.target.value;
                                                    setContactFaqs(updated);
                                                }}
                                            />
                                            <textarea
                                                className="w-full border p-2 rounded text-xs bg-white h-20 focus:outline-none focus:ring-1 focus:ring-[#FF6B00]"
                                                value={faq.answer}
                                                onChange={(e) => {
                                                    const updated = [...contactFaqs];
                                                    updated[i].answer = e.target.value;
                                                    setContactFaqs(updated);
                                                }}
                                            />
                                        </div>
                                        <div className="flex flex-col gap-3 pt-2">
                                            <button
                                                onClick={async () => {
                                                    await supabase.from('site_content').upsert({ key: 'contact_faq', label: 'FAQ Page Contact', value: JSON.stringify(contactFaqs) }, { onConflict: 'key' });
                                                    fetch('/api/revalidate', { method: 'POST', body: JSON.stringify({ path: '/contact' }) });
                                                    alert('FAQ modifiée avec succès !');
                                                }}
                                                className="text-green-600 hover:text-green-800 flex-shrink-0"
                                                title="Sauvegarder la modification"
                                            >
                                                <Save size={16} />
                                            </button>
                                            <button
                                                onClick={async () => {
                                                    const updated = contactFaqs.filter((_, idx) => idx !== i);
                                                    setContactFaqs(updated);
                                                    await supabase.from('site_content').upsert({ key: 'contact_faq', label: 'FAQ Page Contact', value: JSON.stringify(updated) }, { onConflict: 'key' });
                                                    fetch('/api/revalidate', { method: 'POST', body: JSON.stringify({ path: '/contact' }) });
                                                }}
                                                className="text-red-500 hover:text-red-700 flex-shrink-0"
                                                title="Supprimer la question"
                                            >
                                                <Trash2 size={16} />
                                            </button>
                                        </div>
                                    </div>
                                ))}
                                {contactFaqs.length === 0 && <p className="text-zinc-400 italic text-sm">Aucune question pour le moment.</p>}
                            </div>

                            <div className="bg-zinc-50 p-4 rounded border border-zinc-200 space-y-3">
                                <h3 className="font-bold text-sm uppercase text-zinc-500">Ajouter une question</h3>
                                <input
                                    value={newContactFaqQ}
                                    onChange={e => setNewContactFaqQ(e.target.value)}
                                    placeholder="Question (ex: Proposez-vous du coaching personnalisé ?)"
                                    className="w-full border p-2 rounded text-sm"
                                />
                                <textarea
                                    value={newContactFaqA}
                                    onChange={e => setNewContactFaqA(e.target.value)}
                                    placeholder="Réponse..."
                                    className="w-full border p-2 rounded text-sm h-20"
                                />
                                <button
                                    disabled={!newContactFaqQ || !newContactFaqA || faqSaving}
                                    onClick={async () => {
                                        if (!newContactFaqQ || !newContactFaqA) return;
                                        setFaqSaving(true);
                                        const updated = [...contactFaqs, { question: newContactFaqQ, answer: newContactFaqA }];
                                        setContactFaqs(updated);
                                        await supabase.from('site_content').upsert({ key: 'contact_faq', label: 'FAQ Page Contact', value: JSON.stringify(updated) }, { onConflict: 'key' });
                                        fetch('/api/revalidate', { method: 'POST', body: JSON.stringify({ path: '/contact' }) });
                                        setNewContactFaqQ('');
                                        setNewContactFaqA('');
                                        setFaqSaving(false);
                                    }}
                                    className="bg-black text-white px-6 py-2 rounded font-bold uppercase text-xs hover:bg-[#FF6B00] hover:text-black transition disabled:opacity-50"
                                >
                                    {faqSaving ? 'Sauvegarde...' : '+ Ajouter'}
                                </button>
                            </div>
                        </div>

                        {/* SECTION 3: Product FAQs */}
                        <div>
                            <h2 className="text-xl font-black mb-2 uppercase">FAQs des Produits</h2>
                            <p className="text-zinc-500 text-sm mb-6">Ces questions apparaissent sur une page produit spécifique, avant la section Avis.</p>

                            <div className="mb-4">
                                <label className="block text-xs font-bold uppercase text-zinc-500 mb-2">Choisir un produit</label>
                                <select
                                    value={faqTool || ""}
                                    onChange={async (e) => {
                                        const p = products.find(p => p.id === parseInt(e.target.value));
                                        setFaqProduct(p);
                                        if (p && p.faqs) {
                                            setProductFaqs(Array.isArray(p.faqs) ? p.faqs : JSON.parse(p.faqs));
                                        } else {
                                            setProductFaqs([]);
                                        }
                                    }}
                                    className="border p-2 rounded text-sm w-full"
                                >
                                    <option value="">-- Sélectionner un produit --</option>
                                    {products.map(p => (
                                        <option key={p.id} value={p.id}>{p.title}</option>
                                    ))}
                                </select>
                            </div>

                            {faqProduct && (
                                <div className="space-y-3 mb-6">
                                    {productFaqs.map((faq, i) => (
                                        <div key={i} className="flex gap-4 items-start bg-zinc-50 p-4 rounded border border-zinc-200">
                                            <div className="flex-grow space-y-2">
                                                <input
                                                    className="w-full border p-2 rounded text-sm font-bold bg-white focus:outline-none focus:ring-1 focus:ring-[#FF6B00]"
                                                    value={faq.question}
                                                    onChange={(e) => {
                                                        const updated = [...productFaqs];
                                                        updated[i].question = e.target.value;
                                                        setProductFaqs(updated);
                                                    }}
                                                />
                                                <textarea
                                                    className="w-full border p-2 rounded text-xs bg-white h-20 focus:outline-none focus:ring-1 focus:ring-[#FF6B00]"
                                                    value={faq.answer}
                                                    onChange={(e) => {
                                                        const updated = [...productFaqs];
                                                        updated[i].answer = e.target.value;
                                                        setProductFaqs(updated);
                                                    }}
                                                />
                                            </div>
                                            <div className="flex flex-col gap-3 pt-2">
                                                <button
                                                    onClick={async () => {
                                                        await supabase.from('products').update({ faqs: productFaqs }).eq('id', faqProduct.id);
                                                        fetch(`/api/revalidate`, { method: 'POST', body: JSON.stringify({ path: `/boutique/${faqProduct.slug}` }) });
                                                        alert('FAQ du produit modifiée avec succès !');
                                                    }}
                                                    className="text-green-600 hover:text-green-800 flex-shrink-0"
                                                    title="Sauvegarder la modification"
                                                >
                                                    <Save size={16} />
                                                </button>
                                                <button
                                                    onClick={async () => {
                                                        const updated = productFaqs.filter((_, idx) => idx !== i);
                                                        setProductFaqs(updated);
                                                        await supabase.from('products').update({ faqs: updated }).eq('id', faqProduct.id);
                                                    }}
                                                    className="text-red-500 hover:text-red-700 flex-shrink-0"
                                                    title="Supprimer la question"
                                                >
                                                    <Trash2 size={16} />
                                                </button>
                                            </div>
                                        </div>
                                    ))}
                                    {productFaqs.length === 0 && <p className="text-zinc-400 italic text-sm">Aucune question pour ce produit.</p>}

                                    <div className="bg-zinc-50 p-4 rounded border border-zinc-200 space-y-3">
                                        <h3 className="font-bold text-sm uppercase text-zinc-500">Ajouter une question à "{faqProduct.title}"</h3>
                                        <input
                                            value={newProductFaqQ}
                                            onChange={e => setNewProductFaqQ(e.target.value)}
                                            placeholder="Question..."
                                            className="w-full border p-2 rounded text-sm"
                                        />
                                        <textarea
                                            value={newProductFaqA}
                                            onChange={e => setNewProductFaqA(e.target.value)}
                                        />
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* SECTION 4: Tool FAQs */}
                        <div>
                            <h2 className="text-xl font-black mb-2 uppercase">FAQs des Outils</h2>
                            <p className="text-zinc-500 text-sm mb-6">Ces questions apparaissent sur les pages outils (1RM, Calories, etc.).</p>

                            <div className="mb-4">
                                <label className="block text-xs font-bold uppercase text-zinc-500 mb-2">Choisir un outil</label>
                                <select
                                    onChange={async (e) => {
                                        const toolId = e.target.value;
                                        setFaqTool(toolId);
                                        const key = `tool_${toolId}_faq`;
                                        const item = siteContent.find(c => c.key === key);
                                        if (item && item.value) {
                                            try {
                                                const parsed = JSON.parse(item.value);
                                                setToolFaqs(parsed && parsed.length > 0 ? parsed : (DEFAULT_TOOL_FAQS[toolId] || []));
                                            } catch { setToolFaqs(DEFAULT_TOOL_FAQS[toolId] || []); }
                                        } else {
                                            setToolFaqs(DEFAULT_TOOL_FAQS[toolId] || []);
                                        }
                                    }}
                                    className="border p-2 rounded text-sm w-full"
                                >
                                    <option value="">-- Sélectionner un outil --</option>
                                    <option value="1rm">Calculateur 1RM</option>
                                    <option value="calories">Calculateur Calories</option>
                                    <option value="vma">VMA / VO2max</option>
                                    <option value="hr">Fréquence Cardiaque</option>
                                    <option value="speed">Vitesse / Allure</option>
                                    <option value="rpe">Convertisseur RPE / 1RM</option>
                                    <option value="macros">Macros Avancées</option>
                                    <option value="cooper">Test Demi-Cooper</option>
                                    <option value="recovery">Score Récupération</option>
                                    <option value="acwr">Ratio ACWR</option>
                                    <option value="predictor">Prédicteur Performance</option>
                                    <option value="volume">Volume Effectif</option>
                                </select>
                            </div>

                            {faqTool && (
                                <div className="space-y-3 mb-6">
                                    {toolFaqs.map((faq, i) => (
                                        <div key={i} className="flex gap-4 items-start bg-zinc-50 p-4 rounded border border-zinc-200">
                                            <div className="flex-grow space-y-2">
                                                <input
                                                    className="w-full border p-2 rounded text-sm font-bold bg-white focus:outline-none focus:ring-1 focus:ring-[#FF6B00]"
                                                    value={faq.question}
                                                    onChange={(e) => {
                                                        const updated = [...toolFaqs];
                                                        updated[i].question = e.target.value;
                                                        setToolFaqs(updated);
                                                    }}
                                                />
                                                <textarea
                                                    className="w-full border p-2 rounded text-xs bg-white h-20 focus:outline-none focus:ring-1 focus:ring-[#FF6B00]"
                                                    value={faq.answer}
                                                    onChange={(e) => {
                                                        const updated = [...toolFaqs];
                                                        updated[i].answer = e.target.value;
                                                        setToolFaqs(updated);
                                                    }}
                                                />
                                            </div>
                                            <div className="flex flex-col gap-3 pt-2">
                                                <button
                                                    onClick={async () => {
                                                        const key = `tool_${faqTool}_faq`;
                                                        await supabase.from('site_content').upsert({ key, label: `FAQ Outil ${faqTool}`, value: JSON.stringify(toolFaqs) }, { onConflict: 'key' });
                                                        // Update siteContent locally too to avoid sync issues
                                                        fetchData();
                                                        alert('FAQ de l\'outil modifiée avec succès !');
                                                    }}
                                                    className="text-green-600 hover:text-green-800 flex-shrink-0"
                                                    title="Sauvegarder la modification"
                                                >
                                                    <Save size={16} />
                                                </button>
                                                <button
                                                    onClick={async () => {
                                                        const updated = toolFaqs.filter((_, idx) => idx !== i);
                                                        setToolFaqs(updated);
                                                        const key = `tool_${faqTool}_faq`;
                                                        await supabase.from('site_content').upsert({ key, label: `FAQ Outil ${faqTool}`, value: JSON.stringify(updated) }, { onConflict: 'key' });
                                                        fetchData();
                                                    }}
                                                    className="text-red-500 hover:text-red-700 flex-shrink-0"
                                                    title="Supprimer la question"
                                                >
                                                    <Trash2 size={16} />
                                                </button>
                                            </div>
                                        </div>
                                    ))}
                                    {toolFaqs.length === 0 && <p className="text-zinc-400 italic text-sm">Aucune question pour cet outil.</p>}

                                    <div className="bg-zinc-50 p-4 rounded border border-zinc-200 space-y-3">
                                        <h3 className="font-bold text-sm uppercase text-zinc-500">Ajouter une question à l'outil</h3>
                                        <input
                                            value={newToolFaqQ}
                                            onChange={e => setNewToolFaqQ(e.target.value)}
                                            placeholder="Question..."
                                            className="w-full border p-2 rounded text-sm"
                                        />
                                        <textarea
                                            value={newToolFaqA}
                                            onChange={e => setNewToolFaqA(e.target.value)}
                                            placeholder="Réponse..."
                                            className="w-full border p-2 rounded text-sm h-20"
                                        />
                                        <button
                                            disabled={!newToolFaqQ || !newToolFaqA || faqSaving}
                                            onClick={async () => {
                                                if (!newToolFaqQ || !newToolFaqA) return;
                                                setFaqSaving(true);
                                                const updated = [...toolFaqs, { question: newToolFaqQ, answer: newToolFaqA }];
                                                setToolFaqs(updated);
                                                const key = `tool_${faqTool}_faq`;
                                                await supabase.from('site_content').upsert({ key, label: `FAQ Outil ${faqTool}`, value: JSON.stringify(updated) }, { onConflict: 'key' });
                                                fetchData();
                                                setNewToolFaqQ('');
                                                setNewToolFaqA('');
                                                setFaqSaving(false);
                                            }}
                                            className="bg-black text-white px-6 py-2 rounded font-bold uppercase text-xs hover:bg-[#FF6B00] hover:text-black transition disabled:opacity-50"
                                        >
                                            {faqSaving ? 'Sauvegarde...' : '+ Ajouter'}
                                        </button>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                ) : activeTab === 'coach' ? (
                    <div className="space-y-8">
                        {/* INFOS PRINCIPALES */}
                        <div className="bg-white p-6 rounded-lg shadow-sm border border-zinc-200">
                            <h2 className="text-xl font-black mb-6 uppercase">Infos Principales</h2>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {[['coach_name', 'Nom complet'], ['coach_badge', 'Badge (ex: Le Coach)'], ['coach_tagline', 'Tagline (sous le nom)'], ['coach_meta_desc', 'Description SEO'], ['coach_philosophy_title', 'Titre section Philosophie'], ['coach_cta_title', 'Titre section CTA']].map(([key, label]) => (
                                    <div key={key}>
                                        <label className="block text-xs font-black uppercase text-zinc-500 mb-1">{label}</label>
                                        <input value={coachBasics[key] || ''} onChange={e => setCoachBasics(prev => ({ ...prev, [key]: e.target.value }))} className="w-full border border-zinc-200 rounded px-3 py-2 text-sm focus:border-[#FF6B00] outline-none" />
                                    </div>
                                ))}

                                {/* PHOTO DU COACH */}
                                <div className="md:col-span-2 border-t border-zinc-100 pt-6 mt-2">
                                    <label className="block text-xs font-black uppercase text-[#FF6B00] mb-4">Photo Professionnelle (Hero)</label>
                                    <div className="flex flex-col md:flex-row gap-6 items-start">
                                        <div className="w-32 h-44 bg-zinc-100 rounded-lg overflow-hidden border border-zinc-200 relative group flex items-center justify-center">
                                            {coachBasics.coach_image ? (
                                                <img src={coachBasics.coach_image} className="w-full h-full object-cover" alt="Coach" />
                                            ) : (
                                                <span className="text-2xl font-black text-zinc-300">NA</span>
                                            )}
                                        </div>
                                        <div className="flex-1 space-y-4">
                                            <p className="text-xs text-zinc-500 leading-relaxed">
                                                Télécharge une photo de face, idéalement avec un fond sombre pour respecter l'esthétique "Premium Dark" de la page Coach.
                                            </p>
                                            <div className="flex items-center gap-4">
                                                <label className="cursor-pointer bg-black text-white px-4 py-2 rounded text-xs font-bold uppercase hover:bg-[#FF6B00] hover:text-black transition flex items-center gap-2">
                                                    <Plus size={16} /> {coachBasics.coach_image ? 'Changer la photo' : 'Uploader une photo'}
                                                    <input
                                                        type="file"
                                                        accept="image/*"
                                                        onChange={(e) => handleImageUpload(e, (data) => setCoachBasics(prev => ({ ...prev, coach_image: data.image })), {})}
                                                        className="hidden"
                                                    />
                                                </label>
                                                {uploadStatus && <p className="text-xs text-[#FF6B00] font-bold animate-pulse">{uploadStatus}</p>}
                                                {coachBasics.coach_image && (
                                                    <button
                                                        type="button"
                                                        onClick={() => setCoachBasics(prev => ({ ...prev, coach_image: '' }))}
                                                        className="text-red-500 text-xs font-bold uppercase hover:underline"
                                                    >
                                                        Supprimer
                                                    </button>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {[['coach_description', 'Description hero (paragraphe)'], ['coach_cta_title', 'Titre du CTA'], ['coach_cta_desc', 'Texte du CTA']].map(([key, label]) => (
                                    <div key={key} className="md:col-span-2">
                                        <label className="block text-xs font-black uppercase text-zinc-500 mb-1">{label}</label>
                                        <textarea rows={3} value={coachBasics[key] || ''} onChange={e => setCoachBasics(prev => ({ ...prev, [key]: e.target.value }))} className="w-full border border-zinc-200 rounded px-3 py-2 text-sm focus:border-[#FF6B00] outline-none" />
                                    </div>
                                ))}
                            </div>
                            <button onClick={async () => {
                                setCoachSaving(true);
                                for (const [key, value] of Object.entries(coachBasics)) {
                                    await supabase.from('site_content').upsert({ key, value, label: key }, { onConflict: 'key' });
                                }
                                setCoachSaving(false);
                                alert('Infos coach sauvegardées !');
                                fetch('/api/revalidate', { method: 'POST', body: JSON.stringify({ path: '/coach' }) });
                            }} className="mt-4 bg-[#FF6B00] text-black px-6 py-2 rounded font-black uppercase text-sm hover:bg-black hover:text-white transition">
                                {coachSaving ? 'Sauvegarde...' : 'Sauvegarder'}
                            </button>
                        </div>

                        {/* EXPERTISES */}
                        <div className="bg-white p-6 rounded-lg shadow-sm border border-zinc-200">
                            <h2 className="text-xl font-black mb-6 uppercase">Expertises & Formations</h2>
                            <div className="space-y-4 mb-6">
                                {coachCredentials.map((cred, idx) => (
                                    <div key={idx} className="border border-zinc-100 rounded-lg p-4 flex gap-4 items-start">
                                        <div className="flex-1 space-y-2">
                                            <div className="flex gap-3">
                                                <div className="flex-1">
                                                    <label className="block text-xs font-black uppercase text-zinc-400 mb-1">Titre</label>
                                                    <input value={cred.title} onChange={e => { const updated = [...coachCredentials]; updated[idx] = { ...updated[idx], title: e.target.value }; setCoachCredentials(updated); }} className="w-full border border-zinc-200 rounded px-3 py-2 text-sm" />
                                                </div>
                                                <div className="w-36">
                                                    <label className="block text-xs font-black uppercase text-zinc-400 mb-1">Icône</label>
                                                    <select value={cred.icon} onChange={e => { const updated = [...coachCredentials]; updated[idx] = { ...updated[idx], icon: e.target.value }; setCoachCredentials(updated); }} className="w-full border border-zinc-200 rounded px-3 py-2 text-sm">
                                                        {['Award', 'HeartPulse', 'Activity', 'BookOpen', 'Dumbbell', 'Target', 'Zap', 'Shield', 'Star'].map(ic => <option key={ic} value={ic}>{ic}</option>)}
                                                    </select>
                                                </div>
                                            </div>
                                            <div>
                                                <label className="block text-xs font-black uppercase text-zinc-400 mb-1">Description</label>
                                                <textarea rows={2} value={cred.desc} onChange={e => { const updated = [...coachCredentials]; updated[idx] = { ...updated[idx], desc: e.target.value }; setCoachCredentials(updated); }} className="w-full border border-zinc-200 rounded px-3 py-2 text-sm" />
                                            </div>
                                        </div>
                                        <button onClick={() => setCoachCredentials(coachCredentials.filter((_, i) => i !== idx))} className="text-zinc-300 hover:text-red-500 transition mt-1"><Trash2 size={16} /></button>
                                    </div>
                                ))}
                            </div>
                            <button onClick={() => setCoachCredentials([...coachCredentials, { icon: 'Award', title: '', desc: '' }])} className="text-sm font-black uppercase text-[#FF6B00] hover:underline mb-4 block">+ Ajouter une expertise</button>
                            <button onClick={async () => {
                                setCoachSaving(true);
                                await supabase.from('site_content').upsert({ key: 'coach_credentials', label: 'Coach Expertises', value: JSON.stringify(coachCredentials) }, { onConflict: 'key' });
                                setCoachSaving(false);
                                alert('Expertises sauvegardées !');
                                fetch('/api/revalidate', { method: 'POST', body: JSON.stringify({ path: '/coach' }) });
                            }} className="bg-[#FF6B00] text-black px-6 py-2 rounded font-black uppercase text-sm hover:bg-black hover:text-white transition">
                                Sauvegarder les expertises
                            </button>
                        </div>

                        {/* PHILOSOPHIE */}
                        <div className="bg-white p-6 rounded-lg shadow-sm border border-zinc-200">
                            <h2 className="text-xl font-black mb-6 uppercase">Philosophie (3 Piliers)</h2>
                            <div className="space-y-4 mb-6">
                                {coachValues.map((val, idx) => (
                                    <div key={idx} className="border border-zinc-100 rounded-lg p-4 flex gap-4 items-start">
                                        <div className="flex-1 space-y-2">
                                            <div className="flex gap-3">
                                                <div className="w-20">
                                                    <label className="block text-xs font-black uppercase text-zinc-400 mb-1">N°</label>
                                                    <input value={val.number} onChange={e => { const updated = [...coachValues]; updated[idx] = { ...updated[idx], number: e.target.value }; setCoachValues(updated); }} className="w-full border border-zinc-200 rounded px-3 py-2 text-sm" />
                                                </div>
                                                <div className="flex-1">
                                                    <label className="block text-xs font-black uppercase text-zinc-400 mb-1">Titre</label>
                                                    <input value={val.title} onChange={e => { const updated = [...coachValues]; updated[idx] = { ...updated[idx], title: e.target.value }; setCoachValues(updated); }} className="w-full border border-zinc-200 rounded px-3 py-2 text-sm" />
                                                </div>
                                            </div>
                                            <div>
                                                <label className="block text-xs font-black uppercase text-zinc-400 mb-1">Description</label>
                                                <textarea rows={2} value={val.desc} onChange={e => { const updated = [...coachValues]; updated[idx] = { ...updated[idx], desc: e.target.value }; setCoachValues(updated); }} className="w-full border border-zinc-200 rounded px-3 py-2 text-sm" />
                                            </div>
                                        </div>
                                        <button onClick={() => setCoachValues(coachValues.filter((_, i) => i !== idx))} className="text-zinc-300 hover:text-red-500 transition mt-1"><Trash2 size={16} /></button>
                                    </div>
                                ))}
                            </div>
                            <button onClick={() => setCoachValues([...coachValues, { number: `0${coachValues.length + 1}`, title: '', desc: '' }])} className="text-sm font-black uppercase text-[#FF6B00] hover:underline mb-4 block">+ Ajouter un pilier</button>
                            <button onClick={async () => {
                                setCoachSaving(true);
                                await supabase.from('site_content').upsert({ key: 'coach_values', label: 'Coach Philosophie', value: JSON.stringify(coachValues) }, { onConflict: 'key' });
                                setCoachSaving(false);
                                alert('Philosophie sauvegardée !');
                                fetch('/api/revalidate', { method: 'POST', body: JSON.stringify({ path: '/coach' }) });
                            }} className="bg-[#FF6B00] text-black px-6 py-2 rounded font-black uppercase text-sm hover:bg-black hover:text-white transition">
                                Sauvegarder la philosophie
                            </button>
                        </div>
                    </div>
                ) : activeTab === 'messages' ? (
                    <div className="bg-white p-6 rounded-lg shadow-sm border border-zinc-200">
                        <h2 className="text-xl font-black mb-6 uppercase">Vos Messages ({messages.length})</h2>
                        <div className="space-y-4">
                            {messages.length === 0 ? (
                                <p className="text-zinc-500 italic">Aucun message pour le moment.</p>
                            ) : (
                                messages.map(msg => (
                                    <div key={msg.id} className="border-b border-zinc-100 pb-4 last:border-0 relative">
                                        <div className="flex justify-between items-start mb-2">
                                            <div>
                                                <span className="text-[#FF6B00] font-black uppercase text-sm">{msg.name}</span>
                                                <span className="text-zinc-400 text-xs ml-2">({msg.email})</span>
                                            </div>
                                            <span className="text-zinc-400 text-xs">{new Date(msg.created_at).toLocaleDateString()}</span>
                                        </div>
                                        <h3 className="font-bold text-md mb-2">{msg.subject}</h3>
                                        <p className="text-zinc-600 text-sm whitespace-pre-wrap">{msg.message}</p>
                                        <div className="mt-4 flex justify-end">
                                            <button
                                                onClick={() => deleteItem('messages', msg.id)}
                                                className="text-red-500 text-xs font-bold hover:underline flex items-center gap-1"
                                            >
                                                <Trash2 size={12} /> Supprimer
                                            </button>
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>
                    </div>
                ) : (
                    <div className="grid lg:grid-cols-3 gap-8 items-start">

                        {/* LEFT COLUMN: FORM (STRETCHED TO VIEWPORT) */}
                        <div className="lg:col-span-1 lg:sticky lg:top-24 pr-2" style={{ maxHeight: 'calc(100vh - 120px)', overflowY: 'auto' }}>
                            <div className="bg-white p-6 rounded-lg shadow-sm border border-zinc-200">
                                <h2 className="text-xl font-black mb-6 flex items-center gap-2 uppercase">
                                    {editingItem ? <Edit className="text-[#FF6B00]" /> : <Plus className="text-[#FF6B00]" />}
                                    {editingItem ? 'Modifier' : (activeTab === 'articles' ? 'Ajouter Article' : 'Ajouter Produit')}
                                </h2>

                                {activeTab === 'articles' ? (
                                    <form onSubmit={handleArticleSubmit} className="space-y-4">
                                        <div className="space-y-1">
                                            <label className="block text-[10px] font-black uppercase text-zinc-400 flex justify-between">
                                                <span>Titre de l'article / outil (Génère la balise H1)</span>
                                                <span className="text-[#FF6B00] font-bold">Requis (H1 unique)</span>
                                            </label>
                                            <input required name="title" value={articleForm.title} onChange={handleArticleChange} className="w-full border p-2 rounded text-sm focus:ring-1 focus:ring-[#FF6B00] focus:border-[#FF6B00] outline-none" placeholder="Ex: Convertisseur de Vitesse Running" />
                                        </div>
                                        <div className="space-y-1">
                                            <label className="block text-[10px] font-black uppercase text-zinc-400 flex justify-between">
                                                <span>Adresse URL personnalisée / Slug (Optionnel)</span>
                                                <span className="text-zinc-400 font-bold">Généré depuis le titre si vide</span>
                                            </label>
                                            <input name="slug" value={articleForm.slug || ''} onChange={handleArticleChange} className="w-full border p-2 rounded text-sm focus:ring-1 focus:ring-[#FF6B00] focus:border-[#FF6B00] outline-none font-mono text-xs" placeholder="Ex: kathrine-switzer-dossard-261-boston" />
                                        </div>
                                        <div className="grid grid-cols-2 gap-4">
                                            <div className="space-y-1">
                                                <label className="block text-[10px] font-black uppercase text-zinc-400">Catégorie</label>
                                                <input required name="category" value={articleForm.category} onChange={handleArticleChange} className="w-full border p-2 rounded text-sm focus:ring-1 focus:ring-[#FF6B00] focus:border-[#FF6B00] outline-none" placeholder="Ex: Outils, Volume 3..." />
                                            </div>
                                            <div className="space-y-1">
                                                <label className="block text-[10px] font-black uppercase text-zinc-400">Sous-catégorie / Chapitre</label>
                                                <input name="subcategory" value={articleForm.subcategory} onChange={handleArticleChange} className="w-full border p-2 rounded text-sm shrink focus:ring-1 focus:ring-[#FF6B00] focus:border-[#FF6B00] outline-none" placeholder="Ex: Anatomie, Nutrition..." title="Sert de titre de chapitre dans l'encyclopédie" />
                                            </div>
                                        </div>
                                        {/* TOOL HINTS MANAGEMENT (MOVED UP FOR VISIBILITY) */}
                                        {(articleForm.category?.toLowerCase() === 'outils' || articleForm.category?.toLowerCase() === 'outil') && (
                                            <div className="border border-zinc-300 p-3 rounded bg-orange-50/30 space-y-3">
                                                <div className="flex justify-between items-center">
                                                    <h3 className="text-xs font-black uppercase text-[#FF6B00]">Aide de l'outil (Tooltips)</h3>
                                                    <button
                                                        type="button"
                                                        onClick={() => {
                                                            const key = window.prompt("Nom du champ EXACT de l'outil (ex: poids, reps, vma...) :");
                                                            if (key) {
                                                                setArticleForm(prev => ({
                                                                    ...prev,
                                                                    tool_hints: { ...(prev.tool_hints || {}), [key.toLowerCase().trim()]: "" }
                                                                }));
                                                            }
                                                        }}
                                                        className="text-[10px] font-bold uppercase text-zinc-600 hover:text-[#FF6B00] bg-white px-2 py-1 rounded shadow-sm border"
                                                    >
                                                        + Ajouter un champ
                                                    </button>
                                                </div>
                                                <p className="text-[9px] text-zinc-400">Ajoutez des bulles "?" à côté des champs. Utilisez les noms des champs en bas de casse.</p>
                                                <div className="space-y-3">
                                                    {Object.entries(articleForm.tool_hints || {}).map(([key, value]) => (
                                                        <div key={key} className="flex gap-2 items-start bg-white p-2 rounded border border-zinc-100 shadow-sm">
                                                            <div className="flex-1">
                                                                <label className="block text-[10px] font-black uppercase text-[#FF6B00] mb-1">{key}</label>
                                                                <textarea
                                                                    value={value}
                                                                    onChange={(e) => {
                                                                        const updated = { ...articleForm.tool_hints, [key]: e.target.value };
                                                                        setArticleForm({ ...articleForm, tool_hints: updated });
                                                                    }}
                                                                    className="w-full border p-2 rounded text-xs bg-zinc-50 min-h-[50px] focus:border-[#FF6B00] outline-none"
                                                                    placeholder={`Explication pour ${key}...`}
                                                                />
                                                            </div>
                                                            <button
                                                                type="button"
                                                                onClick={() => {
                                                                    const updated = { ...articleForm.tool_hints };
                                                                    delete updated[key];
                                                                    setArticleForm({ ...articleForm, tool_hints: updated });
                                                                }}
                                                                className="text-zinc-300 hover:text-red-500 mt-6"
                                                            >
                                                                <Trash2 size={14} />
                                                            </button>
                                                        </div>
                                                    ))}
                                                    {Object.keys(articleForm.tool_hints || {}).length === 0 && (
                                                        <p className="text-[10px] text-zinc-400 italic text-center py-2">Aucune aide configurée.</p>
                                                    )}
                                                </div>
                                            </div>
                                        )}

                                        <div className="space-y-1">
                                            <label className="block text-[10px] font-black uppercase text-zinc-400">Extrait / Introduction de l'outil (Paragraphe sous le H1)</label>
                                            <textarea required name="excerpt" value={articleForm.excerpt} onChange={handleArticleChange} className="w-full border p-2 rounded text-sm h-20 focus:ring-1 focus:ring-[#FF6B00] focus:border-[#FF6B00] outline-none" placeholder="Court résumé introductif" />
                                        </div>

                                        <div className="space-y-0">
                                            <label className="block text-[10px] font-black uppercase text-zinc-400 flex justify-between mb-1">
                                                <span>Contenu principal (Markdown supporté)</span>
                                                <span className="text-[#FF6B00] font-bold">Raccourcis d'édition en bas</span>
                                            </label>
                                            <textarea id="article-content" required name="content" value={articleForm.content} onChange={handleArticleChange} className="w-full border border-zinc-200 p-2 rounded-t-xl rounded-b-none text-sm h-48 font-mono text-xs focus:ring-1 focus:ring-[#FF6B00] focus:border-[#FF6B00] outline-none" placeholder="Rédigez votre contenu ici..." />
                                            <div className="flex flex-col gap-2.5 sm:flex-row sm:justify-between sm:items-center bg-zinc-50 px-3 py-2.5 rounded-b-xl border-x border-b border-zinc-200 text-xs">
                                                <div className="flex flex-wrap items-center gap-2 text-zinc-500">
                                                    <span className="font-bold text-[10px] text-zinc-400 uppercase mr-1">Raccourcis :</span>
                                                    <span className="font-mono bg-white px-1.5 py-0.5 rounded border border-zinc-100 text-[10px] font-bold text-zinc-600">**Gras**</span>
                                                    <span className="font-mono bg-white px-1.5 py-0.5 rounded border border-zinc-100 text-[10px] italic text-zinc-600">*Italique*</span>
                                                    <span className="font-mono bg-white px-1.5 py-0.5 rounded border border-zinc-100 text-[10px] text-zinc-600">- Liste</span>
                                                </div>
                                                <div className="w-full sm:w-auto flex justify-end">
                                                    <label className="w-full sm:w-auto cursor-pointer bg-white hover:bg-zinc-100 text-zinc-800 border border-zinc-200 hover:border-[#FF6B00] hover:text-[#FF6B00] px-3 py-1.5 rounded-lg flex items-center justify-center gap-1.5 font-bold transition shadow-sm text-[11px] select-none">
                                                        <Plus size={12} strokeWidth={3} className="text-[#FF6B00]" /> Insérer Image
                                                        <input
                                                            type="file"
                                                            accept="image/*"
                                                            className="hidden"
                                                            onChange={async (e) => {
                                                                const file = e.target.files[0];
                                                                if (!file) return;
                                                                const fileName = `content-${Date.now()}.${file.name.split('.').pop()}`;
                                                                const { error } = await supabase.storage.from('images').upload(fileName, file);
                                                                if (error) { alert(error.message); return; }
                                                                const { data } = supabase.storage.from('images').getPublicUrl(fileName);
                                                                const markdown = `\n![Description](${data.publicUrl})\n`;
                                                                
                                                                const textarea = document.getElementById('article-content');
                                                                if (textarea) {
                                                                    const start = textarea.selectionStart;
                                                                    const end = textarea.selectionEnd;
                                                                    setArticleForm(prev => ({
                                                                        ...prev,
                                                                        content: prev.content.substring(0, start) + markdown + prev.content.substring(end)
                                                                    }));
                                                                } else {
                                                                    setArticleForm(prev => ({ ...prev, content: prev.content + markdown }));
                                                                }
                                                            }}
                                                        />
                                                    </label>
                                                </div>
                                            </div>
                                            <div className="bg-zinc-50 border border-zinc-200 rounded-xl p-3 text-xs text-zinc-600 space-y-2 mt-2">
                                                <div className="font-bold text-zinc-800 flex items-center gap-1.5 uppercase text-[10px] tracking-wider">
                                                    <Info size={14} className="text-[#FF6B00]" />
                                                    <span>Structure SEO des Titres (H2 & H3)</span>
                                                </div>
                                                <p className="text-[11px] leading-relaxed text-zinc-500">
                                                    Le titre principal de votre article est déjà généré en <strong className="text-zinc-700">H1</strong>. Pour le corps du texte, utilisez :<br />
                                                    • <code className="bg-zinc-200/60 px-1 py-0.5 rounded font-mono font-bold text-zinc-800">## Mon titre de section</code> pour vos titres principaux (<strong className="text-zinc-700">H2</strong>)<br />
                                                    • <code className="bg-zinc-200/60 px-1 py-0.5 rounded font-mono font-bold text-zinc-800">### Mon sous-titre</code> pour vos sous-sections (<strong className="text-zinc-700">H3</strong>)<br />
                                                    <span className="text-red-500 font-bold block mt-1">⚠️ Ne mettez pas de titre avec un seul dièse (#) ici !</span>
                                                </p>
                                            </div>
                                        </div>


                                        {/* IMAGE UPLOAD ARTICLE */}
                                        <div className="border border-zinc-200 p-2 rounded bg-zinc-50">
                                            <label className="block text-xs font-bold uppercase text-zinc-500 mb-2">Image de l&apos;article</label>
                                            <div className="flex items-center gap-4">
                                                {articleForm.image && <img src={articleForm.image} className="w-16 h-16 object-cover rounded" />}
                                                <input type="file" accept="image/png, image/jpeg, image/webp" onChange={(e) => handleImageUpload(e, setArticleForm, articleForm)} className="text-xs" />
                                            </div>
                                            {uploadStatus && <p className="text-xs text-green-600 font-bold mt-2">{uploadStatus}</p>}
                                            <input type="hidden" name="image" value={articleForm.image} />
                                        </div>

                                        <div className="border border-zinc-200 p-3 rounded bg-zinc-50 space-y-3">
                                            <h3 className="text-xs font-black uppercase text-[#FF6B00]">Appel à l&apos;action (Programme)</h3>
                                            <input name="cta" value={articleForm.cta} onChange={handleArticleChange} className="w-full border p-2 rounded text-sm bg-white font-mono" placeholder="Slug du programme (ex: programme-musculation-ppl)" />

                                            {articleForm.cta && (
                                                <div className="mt-4 space-y-3 p-3 bg-white rounded border border-zinc-100 shadow-sm">
                                                    <h4 className="text-[10px] font-black uppercase tracking-wider text-zinc-500">Textes personnalisés (Optionnel)</h4>
                                                    <p className="text-[10px] text-zinc-400">Si laissés vides, les textes globaux de la Boîte Expert seront utilisés.</p>

                                                    <input
                                                        name="cta_title"
                                                        value={articleForm.cta_title}
                                                        onChange={handleArticleChange}
                                                        className="w-full border p-2 rounded text-sm bg-zinc-50"
                                                        placeholder="Titre (ex: Passez à l'action)"
                                                    />

                                                    <textarea
                                                        name="cta_text"
                                                        value={articleForm.cta_text}
                                                        onChange={handleArticleChange}
                                                        className="w-full border p-2 rounded text-sm bg-zinc-50 min-h-[60px]"
                                                        placeholder="Description persuasive pour ce programme (ex: La lecture ne suffit pas...)"
                                                    />
                                                </div>
                                            )}

                                            <label className="block text-xs font-black uppercase text-zinc-500 mt-2 mb-1">Image du Programme (Optionnel)</label>
                                            <div className="flex gap-4 items-center">
                                                {articleForm.cta_image && (
                                                    <img src={articleForm.cta_image} alt="CTA Preview" className="w-16 h-16 object-contain rounded bg-white shadow-sm border p-1" />
                                                )}
                                                <div className="flex-1">
                                                    <input
                                                        type="file"
                                                        accept="image/*"
                                                        onChange={async (e) => {
                                                            const file = e.target.files[0];
                                                            if (!file) return;
                                                            setUploadStatus('Uploading CTA image...');
                                                            try {
                                                                const fileExt = file.name.split('.').pop();
                                                                const fileName = `cta-${Date.now()}.${fileExt}`;
                                                                const { error } = await supabase.storage.from('images').upload(fileName, file);
                                                                if (error) throw error;
                                                                const { data: { publicUrl } } = supabase.storage.from('images').getPublicUrl(fileName);
                                                                setArticleForm(prev => ({ ...prev, cta_image: publicUrl }));
                                                                setUploadStatus('Upload réussi !');
                                                                setTimeout(() => setUploadStatus(null), 3000);
                                                            } catch (err) {
                                                                alert('Erreur upload: ' + err.message);
                                                                setUploadStatus(null);
                                                            }
                                                        }}
                                                        className="w-full text-sm text-zinc-500 file:mr-4 file:py-1 file:px-3 file:rounded-sm file:border-0 file:text-[10px] file:font-black file:uppercase file:bg-zinc-200 file:text-black hover:file:bg-zinc-300 transition-colors"
                                                        disabled={uploadStatus?.includes('Uploading')}
                                                    />
                                                </div>
                                            </div>
                                        </div>

                                        <div className="border border-zinc-200 p-3 rounded bg-zinc-50 space-y-3">
                                            <h3 className="text-xs font-black uppercase text-[#FF6B00]">Affiliation (Optionnel)</h3>
                                            <input name="affiliate_title" value={articleForm.affiliate_title} onChange={handleArticleChange} className="w-full border p-2 rounded text-sm bg-white" placeholder="Titre du produit Amazon (différent du titre de l'article)" />
                                            <input name="affiliate_link" value={articleForm.affiliate_link} onChange={handleArticleChange} className="w-full border p-2 rounded text-sm bg-white" placeholder="Lien d'affiliation (URL)" />
                                            <textarea name="affiliate_text" value={articleForm.affiliate_text} onChange={handleArticleChange} className="w-full border p-2 rounded text-sm bg-white h-20" placeholder="Texte promotionnel (ex: Profitez de 10% avec le code NA10)" />

                                            <div className="pt-2 border-t border-zinc-200">
                                                <label className="block text-[10px] font-bold uppercase text-zinc-400 mb-2">Image Recommandation (Optionnel)</label>
                                                <div className="flex items-center gap-4">
                                                    {articleForm.affiliate_image && <img src={articleForm.affiliate_image} className="w-12 h-12 object-cover rounded bg-white shadow-sm" />}
                                                    <input
                                                        type="file"
                                                        accept="image/png, image/jpeg, image/webp"
                                                        onChange={(e) => handleImageUpload(e, (val) => setArticleForm({ ...articleForm, affiliate_image: val.image }), articleForm)}
                                                        className="text-[10px]"
                                                    />
                                                </div>
                                            </div>
                                        </div>

                                        <div className="border border-zinc-200 p-3 rounded bg-zinc-50 space-y-3">
                                            <h3 className="text-xs font-black uppercase text-[#FF6B00]">Articles Recommandés Par Défaut (Optionnel)</h3>
                                            <p className="text-[10px] text-zinc-500">Pour forcer l&apos;affichage de certains articles/outils en bas de cette page au lieu de laisser l&apos;aléatoire choisir.</p>
                                            <input name="related_title" value={articleForm.related_title} onChange={handleArticleChange} className="w-full border p-2 rounded text-sm bg-white" placeholder="Titre (ex: La Science de la Force)" />
                                            <input name="related_subtitle" value={articleForm.related_subtitle} onChange={handleArticleChange} className="w-full border p-2 rounded text-sm bg-white" placeholder="Sous-titre" />

                                            <label className="block text-xs font-bold uppercase text-zinc-500 mb-2 mt-4">Sélectionner les recommandations (Publiées uniquement)</label>
                                            <div className="max-h-60 overflow-y-auto border p-2 bg-white rounded space-y-2">
                                                {articles.filter(a => a.is_published && (editingItem ? a.id !== editingItem.id : true)).map(a => (
                                                    <label key={a.id} className="flex items-start gap-3 text-xs cursor-pointer hover:bg-zinc-50 p-2 rounded">
                                                        <input
                                                            type="checkbox"
                                                            className="mt-0.5"
                                                            checked={articleForm.related_articles?.includes(a.id)}
                                                            onChange={(e) => {
                                                                const current = new Set(articleForm.related_articles || []);
                                                                if (e.target.checked) current.add(a.id);
                                                                else current.delete(a.id);
                                                                setArticleForm({ ...articleForm, related_articles: Array.from(current) });
                                                            }}
                                                        />
                                                        <div className="flex flex-col">
                                                            <span className="font-semibold text-zinc-900 leading-tight">{a.title}</span>
                                                            <span className="text-zinc-400 text-[9px] uppercase font-bold tracking-wider mt-0.5">{a.category}</span>
                                                        </div>
                                                    </label>
                                                ))}
                                            </div>
                                        </div>

                                        <input required name="date" value={articleForm.date} onChange={handleArticleChange} className="w-full border p-2 rounded text-sm" />

                                        <div className="flex items-center gap-2 px-1">
                                            <input
                                                type="checkbox"
                                                id="is_published"
                                                checked={articleForm.is_published}
                                                onChange={(e) => setArticleForm({ ...articleForm, is_published: e.target.checked })}
                                                className="w-4 h-4 accent-[#FF6B00]"
                                            />
                                            <label htmlFor="is_published" className="text-xs font-bold uppercase text-zinc-600 cursor-pointer">Publier l'article</label>
                                        </div>

                                        <div className="border border-zinc-200 p-3 rounded bg-[#FF6B00]/5 space-y-3">
                                            <h3 className="text-xs font-black uppercase text-[#FF6B00]">Optimisation SEO (Google)</h3>
                                            <div>
                                                <label className="block text-[10px] font-black uppercase text-zinc-400 mb-1 flex justify-between">
                                                    <span>Titre SEO spécifique (Google Title)</span>
                                                    <span className={`${(articleForm.seo_title?.length >= 50 && articleForm.seo_title?.length <= 60) ? 'text-green-600 font-bold' : (articleForm.seo_title?.length > 60) ? 'text-red-500 font-bold animate-pulse' : 'text-zinc-400'}`}>
                                                        {articleForm.seo_title?.length || 0} / 60 caractères recommandé
                                                    </span>
                                                </label>
                                                <input
                                                    name="seo_title"
                                                    value={articleForm.seo_title || ''}
                                                    onChange={handleArticleChange}
                                                    className="w-full border p-2 rounded text-sm bg-white focus:ring-1 focus:ring-[#FF6B00] focus:border-[#FF6B00] outline-none"
                                                    placeholder="Titre qui apparaîtra sur Google (50-60 chars)"
                                                />
                                            </div>
                                            <div>
                                                <label className="block text-[10px] font-black uppercase text-zinc-400 mb-1 flex justify-between">
                                                    <span>Meta Description SEO (Google Desc)</span>
                                                    <span className={`${(articleForm.seo_description?.length >= 120 && articleForm.seo_description?.length <= 150) ? 'text-green-600 font-bold' : (articleForm.seo_description?.length > 150) ? 'text-red-500 font-bold animate-pulse' : 'text-zinc-400'}`}>
                                                        {articleForm.seo_description?.length || 0} / 150 caractères recommandé
                                                    </span>
                                                </label>
                                                <textarea
                                                    name="seo_description"
                                                    value={articleForm.seo_description || ''}
                                                    onChange={handleArticleChange}
                                                    className="w-full border p-2 rounded text-sm bg-white h-20 focus:ring-1 focus:ring-[#FF6B00] focus:border-[#FF6B00] outline-none"
                                                    placeholder="Description d'affichage sur Google (120-150 chars)"
                                                />
                                            </div>
                                        </div>

                                        <div className="flex gap-2">
                                            {editingItem && (
                                                <button type="button" onClick={cancelEdit} className="w-full bg-zinc-200 text-zinc-600 font-bold py-3 rounded uppercase hover:bg-zinc-300 transition">Annuler</button>
                                            )}
                                            <button type="submit" className="w-full bg-black text-white font-black py-3 rounded uppercase hover:bg-[#FF6B00] hover:text-black transition flex justify-center items-center gap-2">
                                                <Save size={18} /> {editingItem ? 'Mettre à jour' : 'Publier'}
                                            </button>
                                        </div>
                                    </form>
                                ) : (
                                    <form onSubmit={handleProductSubmit} className="space-y-4">
                                        <input required name="title" value={productForm.title} onChange={handleProductChange} className="w-full border p-2 rounded text-sm" placeholder="Nom du produit" />
                                        <input required name="category" value={productForm.category} onChange={handleProductChange} className="w-full border p-2 rounded text-sm" placeholder="Catégorie (ex: Programmes, Nutrition)" />
                                        <div className="grid grid-cols-2 gap-4">
                                            <div>
                                                <label className="block text-[10px] font-black uppercase text-zinc-400 mb-1">Prix Normal (ex: 39€)</label>
                                                <input required name="price" value={productForm.price} onChange={handleProductChange} className="w-full border p-2 rounded text-sm" placeholder="39€" />
                                            </div>
                                            <div>
                                                <label className="block text-[10px] font-black uppercase text-[#FF6B00] mb-1">Prix Promo (Optionnel)</label>
                                                <input name="discount_price" value={productForm.discount_price} onChange={handleProductChange} className="w-full border p-2 rounded text-sm border-[#FF6B00]/30 focus:border-[#FF6B00]" placeholder="29€" />
                                            </div>
                                        </div>
                                        <textarea required name="description" value={productForm.description} onChange={handleProductChange} className="w-full border p-2 rounded text-sm h-20" placeholder="Description" />
                                                               <textarea required name="features" value={productForm.features} onChange={handleProductChange} className="w-full border p-2 rounded text-sm h-20" placeholder="Caractéristiques (séparées par une virgule)" />

                                        <div className="space-y-0">
                                            <label className="block text-[10px] font-black uppercase text-zinc-400 mb-1">Description détaillée (Page Produit)</label>
                                            <textarea id="product-content" name="content" value={productForm.content} onChange={handleProductChange} className="w-full border border-zinc-200 p-2 rounded-t-xl rounded-b-none text-sm h-40 font-mono text-xs focus:ring-1 focus:ring-[#FF6B00] focus:border-[#FF6B00] outline-none" placeholder="Description détaillée (Page Produit) - Markdown supporté" />
                                            <div className="flex flex-col gap-2.5 sm:flex-row sm:justify-between sm:items-center bg-zinc-50 px-3 py-2.5 rounded-b-xl border-x border-b border-zinc-200 text-xs">
                                                <div className="flex flex-wrap items-center gap-2 text-zinc-500">
                                                    <span className="font-bold text-[10px] text-zinc-400 uppercase mr-1">Raccourcis :</span>
                                                    <span className="font-mono bg-white px-1.5 py-0.5 rounded border border-zinc-100 text-[10px] font-bold text-zinc-600">**Gras**</span>
                                                    <span className="font-mono bg-white px-1.5 py-0.5 rounded border border-zinc-100 text-[10px] italic text-zinc-600">*Italique*</span>
                                                    <span className="font-mono bg-white px-1.5 py-0.5 rounded border border-zinc-100 text-[10px] text-zinc-600">## Titre</span>
                                                    <span className="font-mono bg-white px-1.5 py-0.5 rounded border border-zinc-100 text-[10px] text-zinc-600">- Liste</span>
                                                    <span className="font-mono bg-white px-1.5 py-0.5 rounded border border-zinc-100 text-[10px] text-zinc-600">&gt; [!TIP] Bulle Info</span>
                                                </div>
                                                <div className="w-full sm:w-auto flex justify-end">
                                                    <label className="w-full sm:w-auto cursor-pointer bg-white hover:bg-zinc-100 text-zinc-800 border border-zinc-200 hover:border-[#FF6B00] hover:text-[#FF6B00] px-3 py-1.5 rounded-lg flex items-center justify-center gap-1.5 font-bold transition shadow-sm text-[11px] select-none shrink-0">
                                                        <Plus size={12} strokeWidth={3} className="text-[#FF6B00]" /> Insérer Image
                                                        <input
                                                            type="file"
                                                            accept="image/*"
                                                            className="hidden"
                                                            onChange={async (e) => {
                                                                const file = e.target.files[0];
                                                                if (!file) return;
                                                                const fileName = `product-content-${Date.now()}.${file.name.split('.').pop()}`;
                                                                const { error } = await supabase.storage.from('images').upload(fileName, file);
                                                                if (error) { alert(error.message); return; }
                                                                const { data } = supabase.storage.from('images').getPublicUrl(fileName);
                                                                const markdown = `\n![Description](${data.publicUrl})\n`;
                                                                
                                                                const textarea = document.getElementById('product-content');
                                                                if (textarea) {
                                                                    const start = textarea.selectionStart;
                                                                    const end = textarea.selectionEnd;
                                                                    const currentVal = productForm.content || '';
                                                                    setProductForm(prev => ({
                                                                        ...prev,
                                                                        content: currentVal.substring(0, start) + markdown + currentVal.substring(end)
                                                                    }));
                                                                } else {
                                                                    setProductForm(prev => ({ ...prev, content: (prev.content || '') + markdown }));
                                                                }
                                                            }}
                                                        />
                                                    </label>
                                                </div>
                                            </div>
                                        </div>

                                        <input name="stripeurl" value={productForm.stripeurl} onChange={handleProductChange} className="w-full border p-2 rounded text-sm" placeholder="Lien Etsy (Optionnel)" />


                                        {/* IMAGE UPLOAD PRODUCT */}
                                        {/* IMAGE UPLOAD PRODUCT (GALLERY) */}
                                        <div className="border border-zinc-200 p-4 rounded bg-zinc-50">
                                            <label className="block text-xs font-bold uppercase text-zinc-500 mb-4">Galerie d'images (La première sera l'image principale)</label>

                                            {/* Current Images Grid */}
                                            {productForm.images && productForm.images.length > 0 && (
                                                <div className="grid grid-cols-4 gap-4 mb-4">
                                                    {productForm.images.map((img, index) => (
                                                        <div key={index} className="relative group aspect-square">
                                                            <img src={img} className="w-full h-full object-cover rounded border border-zinc-200" />
                                                            <button
                                                                type="button"
                                                                onClick={() => removeImage(index)}
                                                                className="absolute top-1 right-1 bg-red-500 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition"
                                                            >
                                                                <Trash2 size={12} />
                                                            </button>
                                                            {index === 0 && <span className="absolute bottom-1 left-1 bg-black/70 text-white text-[10px] px-2 py-0.5 rounded">Principale</span>}
                                                        </div>
                                                    ))}
                                                </div>
                                            )}

                                            <div className="flex items-center gap-4">
                                                <label className="cursor-pointer bg-white border border-zinc-300 hover:border-[#FF6B00] text-zinc-700 px-4 py-2 rounded text-xs font-bold uppercase transition flex items-center gap-2">
                                                    <Plus size={16} /> Ajouter des photos
                                                    <input
                                                        type="file"
                                                        multiple
                                                        accept="image/png, image/jpeg, image/webp"
                                                        onChange={handleMultipleImageUpload}
                                                        className="hidden"
                                                    />
                                                </label>
                                                {uploadStatus && <p className="text-xs text-green-600 font-bold">{uploadStatus}</p>}
                                            </div>
                                        </div>

                                        {/* PDF UPLOAD (DIGITAL PRODUCT) */}
                                        <div className="border border-zinc-200 p-4 rounded bg-zinc-50 mt-4 mb-4">
                                            <label className="block text-xs font-bold uppercase text-zinc-500 mb-2">Fichier Numérique (PDF)</label>
                                            <div className="flex items-center gap-4">
                                                {productForm.file_path ? (
                                                    <div className="bg-green-100 text-green-700 px-3 py-1 rounded text-xs font-bold flex items-center gap-2">
                                                        <FileText size={14} /> Fichier lié : {productForm.file_path}
                                                        <button
                                                            type="button"
                                                            onClick={() => setProductForm({ ...productForm, file_path: '' })}
                                                            className="ml-2 text-red-500 hover:text-red-700"
                                                        >
                                                            <Trash2 size={12} />
                                                        </button>
                                                    </div>
                                                ) : (
                                                    <span className="text-zinc-400 text-xs italic">Aucun fichier</span>
                                                )}
                                                <label className="cursor-pointer bg-white border border-zinc-300 hover:border-[#FF6B00] text-zinc-700 px-4 py-2 rounded text-xs font-bold uppercase transition flex items-center gap-2">
                                                    <Plus size={16} /> Uploader PDF
                                                    <input
                                                        type="file"
                                                        accept=".pdf,.zip"
                                                        onChange={handleFileUpload}
                                                        className="hidden"
                                                    />
                                                </label>
                                            </div>
                                            <p className="text-[10px] text-zinc-400 mt-2">Ce fichier sera stocké de manière sécurisée et envoyé uniquement après paiement.</p>
                                        </div>

                                        <div className="border border-zinc-200 p-3 rounded bg-[#FF6B00]/5 space-y-3">
                                            <h3 className="text-xs font-black uppercase text-[#FF6B00]">Optimisation SEO (Google)</h3>
                                            <div>
                                                <label className="block text-[10px] font-black uppercase text-zinc-400 mb-1 flex justify-between">
                                                    <span>Titre SEO spécifique (Google Title)</span>
                                                    <span className={`${(productForm.seo_title?.length >= 50 && productForm.seo_title?.length <= 60) ? 'text-green-600 font-bold' : (productForm.seo_title?.length > 60) ? 'text-red-500 font-bold animate-pulse' : 'text-zinc-400'}`}>
                                                        {productForm.seo_title?.length || 0} / 60 caractères recommandé
                                                    </span>
                                                </label>
                                                <input
                                                    name="seo_title"
                                                    value={productForm.seo_title || ''}
                                                    onChange={handleProductChange}
                                                    className="w-full border p-2 rounded text-sm bg-white focus:ring-1 focus:ring-[#FF6B00] focus:border-[#FF6B00] outline-none"
                                                    placeholder="Titre qui apparaîtra sur Google"
                                                />
                                            </div>
                                            <div>
                                                <label className="block text-[10px] font-black uppercase text-zinc-400 mb-1 flex justify-between">
                                                    <span>Meta Description SEO (Google Desc)</span>
                                                    <span className={`${(productForm.seo_description?.length >= 120 && productForm.seo_description?.length <= 150) ? 'text-green-600 font-bold' : (productForm.seo_description?.length > 150) ? 'text-red-500 font-bold animate-pulse' : 'text-zinc-400'}`}>
                                                        {productForm.seo_description?.length || 0} / 150 caractères recommandé
                                                    </span>
                                                </label>
                                                <textarea
                                                    name="seo_description"
                                                    value={productForm.seo_description || ''}
                                                    onChange={handleProductChange}
                                                    className="w-full border p-2 rounded text-sm bg-white h-20 focus:ring-1 focus:ring-[#FF6B00] focus:border-[#FF6B00] outline-none"
                                                    placeholder="Description qui apparaîtra sur Google"
                                                />
                                            </div>
                                        </div>

                                        <div className="flex gap-2">
                                            {editingItem && (
                                                <button type="button" onClick={cancelEdit} className="w-full bg-zinc-200 text-zinc-600 font-bold py-3 rounded uppercase hover:bg-zinc-300 transition">Annuler</button>
                                            )}
                                            <button type="submit" className="w-full bg-black text-white font-black py-3 rounded uppercase hover:bg-[#FF6B00] hover:text-black transition flex justify-center items-center gap-2">
                                                <Save size={18} /> {editingItem ? 'Mettre à jour' : 'Ajouter'}
                                            </button>
                                        </div>
                                    </form>
                                )}
                            </div>
                        </div>

                        {/* RIGHT COLUMN: LIST */}
                        <div className="lg:col-span-2">
                            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
                                <h2 className="text-xl font-black uppercase flex items-center gap-2">
                                    {activeTab === 'articles' ? `Articles (${articles.length})` : `Produits (${products.length})`}
                                    <span className="text-[8px] bg-zinc-100 text-zinc-400 px-1 rounded">v1.1</span>
                                </h2>

                                {activeTab === 'articles' && (
                                    <div className="relative flex-1 max-w-xs">
                                        <input
                                            type="text"
                                            placeholder="Rechercher un article..."
                                            value={searchTerm}
                                            onChange={(e) => setSearchTerm(e.target.value)}
                                            className="w-full pl-9 pr-4 py-2 bg-[#FF6B00]/5 border border-[#FF6B00]/20 rounded-full text-sm focus:border-[#FF6B00] focus:ring-1 focus:ring-[#FF6B00] outline-none transition shadow-sm"
                                        />
                                        <Search className="absolute left-3 top-2.5 text-zinc-400" size={16} />
                                    </div>
                                )}
                            </div>

                            <div className="space-y-4">
                                {activeTab === 'articles' ? (
                                    <div className="space-y-8">
                                        {/* SECTION: PUBLISHED */}
                                        <div className="space-y-4">
                                            <h3 className="text-xs font-black uppercase tracking-widest text-[#FF6B00] bg-[#FF6B00]/5 p-2 rounded flex justify-between items-center">
                                                <span>✓ Articles Publiés</span>
                                                <span className="bg-[#FF6B00] text-black px-2 py-0.5 rounded-full text-[10px]">{articles.filter(a => a.is_published !== false).length}</span>
                                            </h3>
                                            {articles
                                                .filter(a => a.is_published !== false)
                                                .filter(a => {
                                                    const titleMatch = (a.title || '').toLowerCase().includes(searchTerm.toLowerCase());
                                                    const catMatch = (a.category || '').toLowerCase().includes(searchTerm.toLowerCase());
                                                    return titleMatch || catMatch;
                                                })
                                                .map(article => (
                                                    <div key={article.id} className={`bg-white p-4 rounded-lg shadow-sm border flex gap-4 items-start ${editingItem?.id === article.id ? 'border-[#FF6B00] ring-1 ring-[#FF6B00]' : 'border-zinc-200'}`}>
                                                        <img src={article.image} className="w-24 h-24 object-cover rounded bg-zinc-100" />
                                                        <div className="flex-grow">
                                                            <span className="text-[10px] font-black uppercase text-[#FF6B00] bg-[#FF6B00]/10 px-2 py-1 rounded">{article.category}{article.category === 'Outils' && article.subcategory ? ` • ${article.subcategory}` : ''}</span>
                                                            <h3 className="font-bold text-lg mt-2 leading-tight">{article.title}</h3>
                                                            <div className="flex gap-4 mt-2">
                                                                <button onClick={() => handleEdit(article, 'article')} className="text-blue-500 text-xs font-bold hover:underline flex items-center gap-1"><Edit size={12} /> Modifier</button>
                                                                <button onClick={() => deleteItem('articles', article.id)} className="text-red-500 text-xs font-bold hover:underline flex items-center gap-1"><Trash2 size={12} /> Supprimer</button>
                                                            </div>
                                                        </div>
                                                    </div>
                                                ))}
                                        </div>

                                        {/* SECTION: DRAFTS */}
                                        <div className="space-y-4">
                                            <h3 className="text-xs font-black uppercase tracking-widest text-zinc-400 bg-zinc-50 p-2 rounded flex justify-between items-center">
                                                <span>✍️ Brouillons</span>
                                                <span className="bg-zinc-200 text-zinc-600 px-2 py-0.5 rounded-full text-[10px]">{articles.filter(a => a.is_published === false).length}</span>
                                            </h3>
                                            {articles.filter(a => a.is_published === false).length === 0 ? (
                                                <p className="text-zinc-400 text-[10px] italic px-2">Aucun brouillon en cours.</p>
                                            ) : (
                                                articles
                                                    .filter(a => a.is_published === false)
                                                    .filter(a => {
                                                        const titleMatch = (a.title || '').toLowerCase().includes(searchTerm.toLowerCase());
                                                        const catMatch = (a.category || '').toLowerCase().includes(searchTerm.toLowerCase());
                                                        return titleMatch || catMatch;
                                                    })
                                                    .map(article => (
                                                        <div key={article.id} className={`bg-white p-4 rounded-lg shadow-sm border flex gap-4 items-start ${editingItem?.id === article.id ? 'border-[#FF6B00] ring-1 ring-[#FF6B00]' : 'border-zinc-200 opacity-75'}`}>
                                                            <img src={article.image} className="w-24 h-24 object-cover rounded bg-zinc-100 grayscale" />
                                                            <div className="flex-grow">
                                                                <span className="text-[10px] font-black uppercase text-zinc-400 bg-zinc-100 px-2 py-1 rounded">{article.category}{article.category === 'Outils' && article.subcategory ? ` • ${article.subcategory}` : ''}</span>
                                                                <h3 className="font-bold text-lg mt-2 leading-tight text-zinc-500 italic">{article.title}</h3>
                                                                <div className="flex gap-4 mt-2">
                                                                    <button onClick={() => handleEdit(article, 'article')} className="text-blue-500 text-xs font-bold hover:underline flex items-center gap-1"><Edit size={12} /> Modifier</button>
                                                                    <button onClick={() => deleteItem('articles', article.id)} className="text-red-500 text-xs font-bold hover:underline flex items-center gap-1"><Trash2 size={12} /> Supprimer</button>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    ))
                                            )}
                                        </div>
                                    </div>
                                ) : (
                                    products.map(product => (
                                        <div key={product.id} className={`bg-white p-6 rounded-lg shadow-sm border relative ${editingItem?.id === product.id ? 'border-[#FF6B00] ring-1 ring-[#FF6B00]' : 'border-zinc-200'}`}>
                                            <div className="absolute top-4 right-4 flex gap-2">
                                                <button onClick={() => handleEdit(product, 'product')} className="text-blue-500 hover:bg-blue-50 p-2 rounded"><Edit size={18} /></button>
                                                <button onClick={() => deleteItem('products', product.id)} className="text-red-500 hover:bg-red-50 p-2 rounded"><Trash2 size={18} /></button>
                                            </div>
                                            <div className="flex justify-between items-center mb-2">
                                                <div className="flex items-center gap-2">
                                                    {product.discount_price ? (
                                                        <>
                                                            <span className="text-2xl font-black italic text-[#FF6B00]">{product.discount_price}</span>
                                                            <span className="text-sm font-bold text-zinc-400 line-through opacity-50">{product.price}</span>
                                                        </>
                                                    ) : (
                                                        <span className="text-2xl font-black italic text-[#FF6B00]">{product.price}</span>
                                                    )}
                                                </div>
                                                <span className="text-[10px] font-black uppercase text-zinc-400 bg-zinc-100 px-2 py-1 rounded">{product.category || 'Programmes'}</span>
                                            </div>
                                            <h3 className="text-xl font-black uppercase">{product.title}</h3>
                                            <p className="text-zinc-500 text-sm mt-2">{product.description}</p>
                                            <div className="mt-4 flex flex-wrap gap-2">
                                                {product.features && product.features.map((f, i) => (
                                                    <span key={i} className="text-[10px] font-bold bg-zinc-100 px-2 py-1 rounded">{f}</span>
                                                ))}
                                            </div>
                                        </div>
                                    ))
                                )}
                            </div>
                        </div>

                    </div>
                )
                }
            </div >
        </div >
    );
}
