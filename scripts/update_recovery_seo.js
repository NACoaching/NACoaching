require('dotenv').config({ path: '.env.local' });
const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

const recoveryContent = `
<h2>Pourquoi évaluer sa Récupération (Readiness) ?</h2>
<p>La <strong>Readiness (ou état de préparation)</strong> est la capacité de votre corps à fournir un effort maximal ou optimal un jour donné. Mesurer cet état via un <strong>Score de Récupération</strong> permet de prévenir la stagnation, maximiser les gains de force ou d'endurance, et éviter les blessures.</p>
<ul>
<li>📉 <strong>Prévenir le surentraînement :</strong> En ajustant votre volume ou votre intensité lorsque vous êtes fatigué, vous évitez l'épuisement nerveux et hormonal.</li>
<li>📈 <strong>Maximiser les performances :</strong> Pousser fort (record personnel) uniquement les jours où tous les voyants sont au vert (sommeil, absence de stress) garantit de meilleurs résultats.</li>
<li>🧠 <strong>Développer l'écoute de son corps :</strong> Prendre 60 secondes pour évaluer ses douleurs musculaires et sa motivation aide à conscientiser sa fatigue réelle.</li>
</ul>

<h2>Comment fonctionne l'échelle de Hooper-Mackinnon ?</h2>
<p>L'échelle utilisée dans ce calculateur s'inspire de méthodes scientifiquement validées pour le suivi des athlètes. Elle quantifie la fatigue subjective sur 5 piliers fondamentaux :</p>
<ol>
<li><strong>Le Sommeil :</strong> Le facteur numéro 1 de l'anabolisme musculaire et de la récupération nerveuse.</li>
<li><strong>Le Stress :</strong> Le corps ne fait pas la différence entre un stress physique (squat lourd) et un stress mental (journée difficile au travail). Un excès de cortisol inhibe la récupération.</li>
<li><strong>La Fatigue Globale :</strong> Le niveau d'énergie perçu lors du réveil et la léthargie.</li>
<li><strong>Les Courbatures (DOMS) :</strong> Les dommages musculaires nécessitent du temps (48 à 72h) pour être réparés par la synthèse protéique.</li>
<li><strong>L'Humeur / Motivation :</strong> Un indicateur puissant de la récupération du Système Nerveux Central (SNC). Une baisse drastique d'envie d'aller s'entraîner est souvent un signal d'alarme.</li>
</ol>

<h2>Que faire selon mon Score ?</h2>
<p>L'objectif de ce calculateur n'est pas de vous interdire de faire du sport, mais <strong>d'autoréguler</strong> votre séance :</p>
<ul>
<li><strong>Score > 8/10 :</strong> Allez chercher un RP (Record Personnel), ajoutez une série, montez l'intensité (RPE 9-10).</li>
<li><strong>Score 6-8/10 :</strong> Maintenez l'entraînement prévu sans dépasser les limites (RPE 7-8).</li>
<li><strong>Score &lt; 6/10 :</strong> Option 1 : Séance allégée (Deload), diminuez le volume (nombre de séries) de 30-50%. Option 2 : Journée de repos complet ou récupération active (marche, yoga).</li>
</ul>
`;

async function run() {
    console.log('Update Recovery Tool SEO content...');

    // Check if the row exists in the articles table where cta = /outils/score-recuperation
    const { data: toolArticles, error: fetchError } = await supabase
        .from('articles')
        .select('id, title, content')
        .eq('cta', '/outils/score-recuperation')
        .order('id', { ascending: true });

    if (fetchError || !toolArticles || toolArticles.length === 0) {
        console.error('Error fetching tool article. Attempting to create one if it does not exist.', fetchError);

        // If not found, maybe we should create it?
        // Let's actually create it if missing so the user can edit it in admin.
        const { data: newArticle, error: insertError } = await supabase
            .from('articles')
            .insert([{
                title: 'Score de Récupération — Évaluez Votre Readiness',
                slug: 'outil-score-recuperation',
                category: 'Outils',
                cta: '/outils/score-recuperation',
                content: recoveryContent.trim(),
                is_published: true,
                excerpt: 'Évaluez votre état de forme quotidien (sommeil, stress, fatigue) pour savoir si vous devez pousser ou récupérer. Outil gratuit.'
            }])
            .select('*');

        if (insertError) {
            console.error('Error creating article:', insertError);
        } else {
            console.log('Created new article for tool:', newArticle);
        }
        return;
    }

    const targetArticle = toolArticles[0];

    const { error: updateError } = await supabase
        .from('articles')
        .update({ content: recoveryContent.trim() })
        .eq('id', targetArticle.id);

    if (updateError) {
        console.error('Error updating content:', updateError);
    } else {
        console.log('Successfully updated content for tool article:', targetArticle.title);
    }
}

run();
