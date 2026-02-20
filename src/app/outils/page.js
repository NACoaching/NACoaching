import AnimWrapper from "@/components/AnimWrapper";
import Link from "next/link";
import { ChevronRight, Dumbbell, Flame, Gauge, Activity, Heart } from "lucide-react";

export const metadata = {
    title: 'Outils & Calculateurs Sportifs Gratuits | NA Coaching',
    description: 'Accédez à nos outils gratuits pour optimiser votre entraînement : Calculateur 1RM, Besoins Caloriques, VMA, Zones Cardiaques et plus encore.',
};

const tools = [
    {
        title: "Calculateur 1RM",
        description: "Estimez votre charge maximale (1RM) pour calibrer vos séances de force.",
        href: "/outils/calculateur-1rm",
        icon: Dumbbell,
        color: "text-blue-500",
        bg: "bg-blue-50"
    },
    {
        title: "Calculateur Calories (TDEE)",
        description: "Définissez vos besoins journaliers pour perdre du gras ou prendre du muscle.",
        href: "/outils/besoins-caloriques",
        icon: Flame,
        color: "text-orange-500",
        bg: "bg-orange-50"
    },
    {
        title: "Convertisseur Vitesse / Allure",
        description: "Passez facilement des km/h aux min/km pour vos séances de fractionné.",
        href: "/outils/convertisseur-vitesse",
        icon: Gauge,
        color: "text-green-500",
        bg: "bg-green-50"
    },
    {
        title: "VMA & VO2max",
        description: "Estimez votre potentiel aérobie et vos prédictions de performance.",
        href: "/outils/vma-vo2",
        icon: Activity,
        color: "text-purple-500",
        bg: "bg-purple-50"
    },
    {
        title: "Zones Fréquence Cardiaque",
        description: "Calculez vos zones d'intensité (Karvonen) pour un entraînement ciblé.",
        href: "/outils/frequence-cardiaque",
        icon: Heart,
        color: "text-red-500",
        bg: "bg-red-50"
    }
];

export default function OutilsPage() {
    return (
        <section className="pt-32 pb-20 min-h-screen bg-zinc-50">
            <div className="max-w-7xl mx-auto px-6">
                <AnimWrapper>
                    <div className="text-center mb-16">
                        <h1 className="text-5xl font-black uppercase mb-4 text-[#FF6B00]">Les Outils du Coach</h1>
                        <p className="text-zinc-500 max-w-xl mx-auto text-lg">
                            Des calculateurs précis et gratuits pour vous accompagner dans votre progression athlétique.
                        </p>
                    </div>
                </AnimWrapper>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {tools.map((tool, index) => (
                        <AnimWrapper key={index} delay={index * 0.1}>
                            <Link href={tool.href} className="group block h-full">
                                <div className="bg-white text-zinc-900 p-8 rounded-2xl border border-zinc-200 shadow-sm hover:shadow-md transition-all duration-300 h-full flex flex-col hover:-translate-y-1">
                                    <div className={`w-14 h-14 ${tool.bg} ${tool.color} rounded-xl flex items-center justify-center mb-6 text-2xl`}>
                                        <tool.icon size={28} strokeWidth={1.5} />
                                    </div>

                                    <h3 className="text-2xl font-black uppercase mb-3 text-zinc-900 group-hover:text-[#FF6B00] transition-colors">
                                        {tool.title}
                                    </h3>

                                    <p className="text-zinc-500 mb-6 flex-grow leading-relaxed">
                                        {tool.description}
                                    </p>

                                    <div className="flex items-center gap-2 font-bold uppercase text-sm text-zinc-900 group-hover:gap-3 transition-all">
                                        Utiliser l'outil <ChevronRight size={16} className="text-[#FF6B00]" />
                                    </div>
                                </div>
                            </Link>
                        </AnimWrapper>
                    ))}
                </div>

                {/* SEO Text for the Hub Page */}
                <div className="mt-20 max-w-4xl mx-auto prose prose-zinc text-center">
                    <h2 className="text-3xl font-black uppercase mb-6 text-zinc-900">Pourquoi utiliser mes outils de coaching ?</h2>
                    <p className="text-zinc-600">
                        La progression sportive ne doit rien au hasard. Que vous soyez pratiquant de musculation, coureur à pied ou athlète hybride,
                        la quantification de la charge et l'ajustement de l'intensité sont les clés de la réussite.
                        Ces outils sont ceux que j'utilise quotidiennement avec mes athlètes pour planifier leurs saisons.
                    </p>
                </div>
            </div>
        </section>
    );
}
