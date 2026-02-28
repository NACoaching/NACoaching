import Link from 'next/link';
import { Dumbbell, Flame, Heart, Gauge, Timer, Activity, BarChart3, Zap, TrendingUp, Calculator, Target, Medal } from 'lucide-react';

const TOOLS = {
    'calculateur-1rm': {
        name: 'Calculateur 1RM',
        href: '/outils/calculateur-1rm',
        icon: Dumbbell,
        cluster: 'muscu',
    },
    'rpe-1rm': {
        name: 'Convertisseur RPE',
        href: '/outils/rpe-1rm',
        icon: Target,
        cluster: 'muscu',
    },
    'volume-effectif': {
        name: 'Volume Effectif',
        href: '/outils/volume-effectif',
        icon: BarChart3,
        cluster: 'muscu',
    },
    'besoins-caloriques': {
        name: 'Besoins Caloriques',
        href: '/outils/besoins-caloriques',
        icon: Flame,
        cluster: 'nutrition',
    },
    'macros-avancees': {
        name: 'Macros Avancées',
        href: '/outils/macros-avancees',
        icon: Calculator,
        cluster: 'nutrition',
    },
    'vma-vo2': {
        name: 'VMA & VO2max',
        href: '/outils/vma-vo2',
        icon: Gauge,
        cluster: 'cardio',
    },
    'frequence-cardiaque': {
        name: 'Zones Cardiaques',
        href: '/outils/frequence-cardiaque',
        icon: Heart,
        cluster: 'cardio',
    },
    'convertisseur-vitesse': {
        name: 'Vitesse / Allure',
        href: '/outils/convertisseur-vitesse',
        icon: Timer,
        cluster: 'cardio',
    },
    'test-demi-cooper': {
        name: 'Test Demi-Cooper',
        href: '/outils/test-demi-cooper',
        icon: Medal,
        cluster: 'cardio',
    },
    'predictateur-performance': {
        name: 'Prédicteur Running',
        href: '/outils/predictateur-performance',
        icon: TrendingUp,
        cluster: 'cardio',
    },
    'acwr': {
        name: 'Charge ACWR',
        href: '/outils/acwr',
        icon: Activity,
        cluster: 'recovery',
    },
    'score-recuperation': {
        name: 'Score Récupération',
        href: '/outils/score-recuperation',
        icon: Zap,
        cluster: 'recovery',
    },
};

const CLUSTER_LABELS = {
    muscu: 'Musculation',
    nutrition: 'Nutrition',
    cardio: 'Running & Cardio',
    recovery: 'Récupération & Charge',
};

/**
 * Affiche les outils complémentaires pour le maillage interne SEO.
 * @param {string} currentTool - Le slug de l'outil actuel (ex: 'calculateur-1rm')
 * @param {number} max - Nombre max d'outils à afficher (default: 4)
 */
export default function RelatedTools({ currentTool, max = 4 }) {
    const current = TOOLS[currentTool];
    if (!current) return null;

    // Priorité 1: outils du même cluster, Priorité 2: outils d'autres clusters
    const sameCluster = Object.entries(TOOLS)
        .filter(([key, t]) => key !== currentTool && t.cluster === current.cluster);
    const otherCluster = Object.entries(TOOLS)
        .filter(([key, t]) => key !== currentTool && t.cluster !== current.cluster);

    const selected = [...sameCluster, ...otherCluster].slice(0, max);

    if (selected.length === 0) return null;

    return (
        <div className="mt-16 pt-12 border-t border-zinc-200">
            <h3 className="text-xl font-black uppercase mb-2 text-black">
                Outils complémentaires
            </h3>
            <p className="text-sm text-zinc-500 mb-6">
                Combine ces outils pour une approche complète de ta progression.
            </p>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {selected.map(([key, tool]) => {
                    const Icon = tool.icon;
                    const clusterLabel = CLUSTER_LABELS[tool.cluster];
                    return (
                        <Link
                            key={key}
                            href={tool.href}
                            className="group bg-white border border-zinc-200 rounded-lg p-4 hover:border-[#FF6B00] hover:shadow-md transition-all"
                        >
                            <div className="flex items-center gap-2 mb-2">
                                <Icon size={18} className="text-[#FF6B00]" />
                                <span className="text-[10px] font-bold uppercase tracking-widest text-zinc-400">{clusterLabel}</span>
                            </div>
                            <div className="text-sm font-bold text-black group-hover:text-[#FF6B00] transition">
                                {tool.name}
                            </div>
                        </Link>
                    );
                })}
            </div>
        </div>
    );
}
