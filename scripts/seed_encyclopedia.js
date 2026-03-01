require('dotenv').config({ path: '.env.local' });
const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
const readline = require('readline');

// We use the Service Role key to bypass RLS policies for bulk import
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
// FALLBACK: If the user runs this, they'll use their ANON_KEY (RLS must be disabled for 'articles' or run via SQL dashboard if they don't have SERVICE_ROLE)
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

async function parseAndSeed() {
    console.log('🔄 Démarrage du parsing du fichier texte des idées...');

    const fileStream = fs.createReadStream('./scripts/extracted_ideas.txt');
    const rl = readline.createInterface({
        input: fileStream,
        crlfDelay: Infinity
    });

    const articlesToInsert = [];
    let currentVolume = 'Non Classé';
    let currentSubcategory = 'Général';

    // Read line by line
    for await (const line of rl) {
        const text = line.trim();
        if (!text) continue;

        // Detect Volumes
        if (text.toUpperCase().startsWith('VOLUME')) {
            currentVolume = text;
            continue;
        }

        // Detect Subcategories (often marked with icons like ✅, 🚀, 🏋️, etc. or just bold titles if we had formatting)
        // In our raw text, they seem to be standalone lines before lists.
        // E.g. "✅ Sujets de Base & Déjà Abordés"
        if (text.match(/^[✅🚀🏋️👟🧠🍽️⚕️💊].*/)) {
            currentSubcategory = text.replace(/^[✅🚀🏋️👟🧠🍽️⚕️💊]\s*/, '').trim();
            continue;
        }

        // Detect articles (usually "Titre : Description [Tag]")
        // E.g. "Sommeil : Importance globale, lumière bleue... [Posté]"
        if (text.includes(' : ') || text.includes(' :')) {
            const parts = text.split(' : ');
            const titlePart = parts[0].trim();
            let descPart = parts.slice(1).join(' : ').trim();

            let subcatTag = currentSubcategory;

            // Extract tags like [Posté], [Nouveau], [Expert]
            const tagMatch = descPart.match(/\[(.*?)\]/);
            if (tagMatch) {
                subcatTag = tagMatch[1]; // Overwrite subcategory with the specific tag if present
                descPart = descPart.replace(/\[.*?\]/g, '').trim();
            }

            articlesToInsert.push({
                title: titlePart,
                category: currentVolume,
                subcategory: subcatTag,
                excerpt: descPart.substring(0, 150) + (descPart.length > 150 ? '...' : ''),
                content: `## Introduction\n\n${descPart}\n\n## Les Points Clés\n- Point 1\n- Point 2\n\n## Conclusion\nRésumé du concept.`,
                is_published: false,
                date: new Date().toLocaleDateString('fr-FR', { day: 'numeric', month: 'short', year: 'numeric' })
            });
        }
    }

    console.log(`📊 Bilan du parsing : ${articlesToInsert.length} articles détectés dans ${new Set(articlesToInsert.map(a => a.category)).size} Volumes.`);

    if (articlesToInsert.length === 0) {
        console.log('❌ Aucun article trouvé, vérifiez le format du fichier texte.');
        return;
    }

    // Insert in batches of 100 to avoid Supabase payload limits
    const BATCH_SIZE = 100;
    console.log(`🚀 Début de l'insertion dans Supabase par lots de ${BATCH_SIZE}...`);

    for (let i = 0; i < articlesToInsert.length; i += BATCH_SIZE) {
        const batch = articlesToInsert.slice(i, i + BATCH_SIZE);
        console.log(`⏳ Insertion des articles ${i + 1} à ${i + batch.length}...`);

        const { data, error } = await supabase.from('articles').insert(batch);

        if (error) {
            console.error(`❌ Erreur lors de l'insertion du lot ${i / BATCH_SIZE + 1} :`, error.message);
        }
    }

    console.log('✅ Importation terminée avec succès !');
}

parseAndSeed();
