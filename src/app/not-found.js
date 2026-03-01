
import Link from 'next/link';
import { ArrowLeft, Home } from 'lucide-react';

export default function NotFound() {
    return (
        <div className="min-h-screen bg-zinc-50 flex items-center justify-center text-center px-6">
            <div className="max-w-md w-full bg-white p-8 rounded-lg border border-zinc-200 shadow-xl relative overflow-hidden">

                {/* Decorative Background Elements */}
                <div className="absolute top-0 left-0 w-full h-2 bg-[#FF6B00]"></div>
                <div className="absolute -right-10 -top-10 w-24 h-24 bg-[#FF6B00]/10 rounded-full blur-xl"></div>
                <div className="absolute -left-10 -bottom-10 w-32 h-32 bg-black/5 rounded-full blur-xl"></div>

                <h1 className="text-8xl font-black text-[#FF6B00] mb-4">404</h1>
                <h2 className="text-2xl font-black uppercase mb-4">Oups, ce muscle n'existe pas !</h2>
                <p className="text-zinc-700 mb-8 leading-relaxed">
                    Il semblerait que tu aies cherché à travailler une zone inconnue.
                    Reviens aux fondamentaux avant de te blesser.
                </p>

                <div className="flex flex-col gap-3">
                    <Link
                        href="/"
                        className="bg-black text-white py-4 rounded font-bold uppercase tracking-widest hover:bg-[#FF6B00] hover:text-black transition flex items-center justify-center gap-2 group"
                    >
                        <Home size={18} /> Retour à l'accueil
                    </Link>
                    <Link
                        href="/labo"
                        className="bg-zinc-100 text-zinc-900 py-4 rounded font-bold uppercase tracking-widest hover:bg-zinc-200 transition flex items-center justify-center gap-2"
                    >
                        <ArrowLeft size={18} /> Voir le Labo
                    </Link>
                    <div className="grid grid-cols-2 gap-3 mt-2">
                        <Link href="/outils" className="bg-zinc-50 border border-zinc-200 text-zinc-700 py-3 rounded font-bold uppercase text-xs tracking-widest hover:border-[#FF6B00] hover:text-[#FF6B00] transition text-center">
                            Outils gratuits
                        </Link>
                        <Link href="/boutique" className="bg-zinc-50 border border-zinc-200 text-zinc-700 py-3 rounded font-bold uppercase text-xs tracking-widest hover:border-[#FF6B00] hover:text-[#FF6B00] transition text-center">
                            Boutique
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
}
