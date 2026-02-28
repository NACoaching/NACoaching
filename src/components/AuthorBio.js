import Image from 'next/image';
import Link from 'next/link';
import { Award, BookOpen } from 'lucide-react';

export default function AuthorBio({ name, tagline, imageUrl }) {
    const authorName = name || 'Nolwen Albanesi';
    const authorTagline = tagline || 'Coach Sportif · Master EOPS · Spécialiste Performance & Réathlétisation';
    const authorImage = imageUrl || '/logo.png';

    return (
        <div className="mt-16 pt-8 border-t border-zinc-200">
            <div className="flex items-start gap-5 bg-zinc-50 rounded-xl p-6 border border-zinc-100">
                <div className="shrink-0 w-16 h-16 rounded-full overflow-hidden bg-zinc-200 border-2 border-[#FF6B00]">
                    <Image
                        src={authorImage}
                        alt={authorName}
                        width={64}
                        height={64}
                        className="object-cover w-full h-full"
                    />
                </div>
                <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                        <span className="text-[10px] font-black uppercase tracking-widest text-zinc-400">Rédigé par</span>
                    </div>
                    <Link href="/coach" className="text-lg font-black uppercase text-black hover:text-[#FF6B00] transition">
                        {authorName}
                    </Link>
                    <p className="text-sm text-zinc-500 mt-1 leading-relaxed">{authorTagline}</p>
                    <div className="flex items-center gap-4 mt-3">
                        <span className="inline-flex items-center gap-1.5 text-xs font-bold text-zinc-400">
                            <Award size={14} className="text-[#FF6B00]" />
                            Master EOPS
                        </span>
                        <span className="inline-flex items-center gap-1.5 text-xs font-bold text-zinc-400">
                            <BookOpen size={14} className="text-[#FF6B00]" />
                            Vulgarisation scientifique
                        </span>
                    </div>
                </div>
            </div>
        </div>
    );
}
