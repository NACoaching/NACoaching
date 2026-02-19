require('dotenv').config({ path: '.env.local' });
const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY; // Using anon key is fine if RLS allows anon inserts/updates or if we have service role.
// Actually, for admin tasks, service role key is better if RLS is strict, but usually anon key + policies work if user is authenticated or if policies are open.
// However, in a script context without Auth user, I might need SERVICE_ROLE_KEY if RLS blocks anon writes.
// Let's check .env.local again to see if we have a SERVICE_ROLE_KEY.
// The view_file output of .env.local only showed ANON_KEY.
// Ideally usage of anon key works if RLS allows it. But RLS usually requires an authenticated user for writes.
// If RLS is enabled on site_content and only allows authenticated users to write, this script might fail with anon key unless I sign in or use service role.
// I don't see a service role key in .env.local.
// I will try with Anon key. If it fails due to RLS, I might have to ask user for Service Role Key or instruct them to use the UI button (which they are already logged in).
// Wait, the user said "j'aimerais que TU préremplisse".
// If I use anon key, I am "anon".
// Let's try. If it fails, I'll have to use the UI method instruction again but explaining "I can't do it from here without your session".
// OR, I can temporarily disable RLS? No, that's risky and I can't do it easily without SQL.
// I can execute SQL via `npx supabase db execute` but that failed earlier.
// Actually, the `add_tool_content.sql` script I tried to run handles the insertion via SQL which bypasses RLS if run as postgres/admin.
// The error for `npx supabase db execute` was `unknown flag: --file`.
// Ah! maybe the command synopsis is different?
// `npx supabase db execute --help` might show the correct flag.
// Usually it is `supabase db reset` or `supabase migration up`. `db execute` might read from stdin?
// Let's try `cat scripts/add_tool_content.sql | npx supabase db execute`.
// But first, let's try the node script, maybe RLS is open or I can use what I have.

const supabase = createClient(supabaseUrl, supabaseKey);

const defaultContent = [
    // 1RM
    { key: 'tool_1rm_title', label: 'Titre Outil 1RM', value: `Calculateur 1RM - Calculez votre charge maximale en musculation` },
    { key: 'tool_1rm_intro', label: 'Intro Outil 1RM', value: `Estimez votre 1RM (Répétition Maximale) pour mieux calibrer vos entraînements de force et d'hypertrophie. Basé sur les formules de Brzycki et Epley.` },
    {
        key: 'tool_1rm_content', label: 'Contenu SEO Outil 1RM', value: `
<h2>Pourquoi calculer son 1RM ?</h2>
<p>Le <strong>1RM (One Repetition Maximum)</strong> est la charge maximale que vous pouvez soulever sur une seule répétition avec une technique correcte. C'est une donnée fondamentale pour structurer un programme de force.</p>
<ul>
<li>📈 <strong>Calibrer l'intensité :</strong> Les programmes utilisent souvent des pourcentages du 1RM (ex: 70% pour l'hypertrophie, 85%+ pour la force).</li>
<li>🚀 <strong>Mesurer la progression :</strong> Tester son 1RM régulièrement permet de valider les gains de force.</li>
<li>⚠️ <strong>Prévenir les blessures :</strong> Utiliser des charges adaptées évite le surmenage inutile.</li>
</ul>
<h2>Comment utiliser ce calculateur ?</h2>
<p>Entrez une charge que vous maîtrisez sur un exercice (ex: Développé couché) et le nombre de répétitions réalisées avant l'échec technique. L'outil vous donnera une estimation fiable de votre max.</p>
        `.trim()
    },

    // Calories
    { key: 'tool_calories_title', label: 'Titre Outil Calories', value: `Calculateur de Besoins Caloriques Journaliers (TDEE)` },
    { key: 'tool_calories_intro', label: 'Intro Outil Calories', value: `Déterminez vos besoins énergétiques quotidiens (Maintien, Sèche, Prise de masse) selon votre métabolisme de base et votre niveau d'activité.` },
    {
        key: 'tool_calories_content', label: 'Contenu SEO Outil Calories', value: `
<h2>Comprendre ses besoins caloriques</h2>
<p>Pour atteindre vos objectifs physiques, l'alimentation est clé. Ce calculateur estime votre <strong>Dépense Énergétique Journalière Totale (TDEE)</strong> en fonction de votre profil.</p>
<h3>Les différents objectifs :</h3>
<ul>
<li>🔥 <strong>Sèche (Déficit calorique) :</strong> Consommer moins de calories que vous n'en brûlez pour perdre du gras tout en préservant le muscle.</li>
<li>⚖️ <strong>Maintien :</strong> L'apport calorique idéal pour stabiliser votre poids actuel.</li>
<li>💪 <strong>Prise de masse (Surplus calorique) :</strong> Un léger surplus pour maximiser la construction musculaire.</li>
</ul>
<p>N'oubliez pas que ces chiffres sont des estimations : ajustez en fonction de votre évolution sur la balance et dans le miroir !</p>
        `.trim()
    },

    // Speed
    { key: 'tool_speed_title', label: 'Titre Outil Vitesse', value: `Convertisseur Vitesse : km/h, min/km et m/s` },
    { key: 'tool_speed_intro', label: 'Intro Outil Vitesse', value: `Passez facilement des km/h aux allures de course (min/km) pour planifier vos entraînements de running et trail.` },
    {
        key: 'tool_speed_content', label: 'Contenu SEO Outil Vitesse', value: `
<h2>Pourquoi convertir ses allures ?</h2>
<p>En course à pied, on parle souvent en <strong>minutes par kilomètre (min/km)</strong>, alors que les tapis de course ou les montres affichent parfois des <strong>km/h</strong>. Ce convertisseur unifie tout !</p>
<ul>
<li>🏃 <strong>Précision à l'entraînement :</strong> Respectez exactement les allures demandées par votre plan (VMA, endurance fondamentale, seuil).</li>
<li>⏱️ <strong>Gestion de course :</strong> Calculez vos temps de passage prévisionnels sur 10km, semi ou marathon.</li>
</ul>
<p>Un outil indispensable pour tout coureur soucieux de sa performance.</p>
        `.trim()
    },

    // VMA
    { key: 'tool_vma_title', label: 'Titre Outil VMA/VO2', value: `Estimation VMA & VO2max - Test de Cooper` },
    { key: 'tool_vma_intro', label: 'Intro Outil VMA/VO2', value: `Évaluez votre Vitesse Maximale Aérobie (VMA) et votre VO2max à partir de vos performances sur le terrain (Test de Cooper, Demi-Cooper).` },
    {
        key: 'tool_vma_content', label: 'Contenu SEO Outil VMA/VO2', value: `
<h2>Qu'est-ce que la VMA ?</h2>
<p>La <strong>Vitesse Maximale Aérobie (VMA)</strong> est la vitesse de course à laquelle votre consommation d'oxygène est maximale (VO2max). C'est le "moteur" du coureur d'endurance.</p>
<ul>
<li>📊 <strong>Base de l'entraînement :</strong> Toutes vos séances (fractionné, seuil, endurance) se calculent en % de VMA.</li>
<li>🏆 <strong>Prédicteur de performance :</strong> Une VMA élevée est corrélée à de meilleures performances sur du fond et demi-fond.</li>
</ul>
<p>Utilisez ce calculateur après un test terrain (comme un 6 minutes à fond) pour obtenir vos zones d'entraînement précises.</p>
        `.trim()
    },

    // HR
    { key: 'tool_hr_title', label: 'Titre Outil FC', value: `Calculateur de Zones de Fréquence Cardiaque` },
    { key: 'tool_hr_intro', label: 'Intro Outil FC', value: `Définissez vos 5 zones d'intensité cardiaque (de l'échauffement à l'effort maximal) basées sur votre FC Max et FC de repos.` },
    {
        key: 'tool_hr_content', label: 'Contenu SEO Outil FC', value: `
<h2>S'entraîner au cardio-fréquencemètre</h2>
<p>Connaître ses zones cardiaques permet de cibler les bonnes filières énergétiques et d'éviter le surentraînement (ou le sous-entraînement).</p>
<ul>
<li>💙 <strong>Zone 1-2 (Endurance Fondamentale) :</strong> L'allure d'aisance respiratoire, idéale pour la récupération et le volume. Brûle principalement les graisses.</li>
<li>💚 <strong>Zone 3 (Seuil Aérobie) :</strong> Travail du rythme, prépare aux courses type marathon.</li>
<li>🧡 <strong>Zone 4 (Seuil Anaérobie) :</strong> Effort intense mais tenable, pour repousser la fatigue.</li>
<li>❤️ <strong>Zone 5 (VMA / Sprint) :</strong> Effort maximal, pour développer la puissance du moteur.</li>
</ul>
<p>La méthode de Karvonen utilisée ici prend en compte votre <strong>fréquence cardiaque de repos</strong> pour plus de précision que le simple "220 - âge".</p>
        `.trim()
    }
];

async function run() {
    console.log('Starting population...');
    const { data, error } = await supabase.from('site_content').upsert(defaultContent, { onConflict: 'key' }).select();

    if (error) {
        console.error('Error inserting data:', error);
    } else {
        console.log('Success! Data inserted:', data.length);
    }
}

run();
