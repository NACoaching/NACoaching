import { supabase } from '@/lib/supabaseClient';
import OutilsView from '@/components/OutilsView';

export const revalidate = 3600;

export const metadata = {
    title: 'Outils & Calculateurs Sportifs Gratuits | NA Coaching',
    description: 'Accédez à nos outils gratuits pour optimiser votre entraînement : Calculateur 1RM, Besoins Caloriques, VMA, Zones Cardiaques et plus encore.',
};

export default async function OutilsPage() {
    const { data: dbTools } = await supabase
        .from('articles')
        .select('*')
        .eq('category', 'Outils')
        .eq('is_published', true)
        .order('created_at', { ascending: true });

    const tools = dbTools || [];

    return <OutilsView tools={tools} />;
}
