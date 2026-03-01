const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
require('dotenv').config({ path: '.env.local' });

const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY);

async function fixCategories() {
    console.log("Fetching all Encyclopedia articles to generate SQL update script...");

    const { data: articles, error } = await supabase
        .from('articles')
        .select('id, title, category')
        .eq('is_published', false);

    if (error) {
        console.error("Error fetching articles:", error);
        return;
    }

    const keywordsV2 = ["ENDURANCE", "CARDIO", "VMA", "VO2", "COURIR", "COURSE", "MARATHON", "FOOT", "SOCCER", "CYCLISME", "VÉLO", "NATATION", "SOUFFLE", "FOND", "STAMINA", "ALLURE", "SPRINT", "AÉROBIE", "INTERMITTENT", "AEROBIE", "ANAEROBIE"];
    const keywordsV3 = ["SANTÉ", "SANTE", "LONGÉVITÉ", "LONGEVITE", "NUTRITION", "HABITUDE", "MENTAL", "MINDSET", "ROUTINE", "LIFESTYLE", "BLESSURE", "DOULEUR", "RÉCUP", "RECUP", "SOMMEIL", "STRESS", "JEÛN", "JEUN", "RÉGIME", "REGIME", "DIÈTE", "DIETE", "ALIMENT", "GLUCIDE", "LIPIDE", "PROTÉIN", "PROTEIN", "VITAMINE", "HYDRATATION", "ÂGE", "AGE", "SENIOR", "FEMME", "CYCLE", "HORMON"];
    const keywordsV1 = ["FORCE", "MUSCUL", "HYPERTROPHIE", "SQUAT", "BENCH", "DEADLIFT", "SOULEVÉ", "RPE", "RIR", "VOLUME", "TENSION", "CHARGE", "REP", "ÉCHEC", "ECHEC", "MÉCANIQUE"];

    let countVol1 = 0;
    let countVol2 = 0;
    let countVol3 = 0;
    let roundRobin = 0;

    let sqlStatements = `-- Auto-generated script to perfectly rebalance Encyclopedia Volumes\n\n`;

    for (const article of articles) {
        let newCategory = article.category;
        const titleUpper = article.title.toUpperCase();

        let isV1 = keywordsV1.some(kw => titleUpper.includes(kw));
        let isV2 = keywordsV2.some(kw => titleUpper.includes(kw));
        let isV3 = keywordsV3.some(kw => titleUpper.includes(kw));

        // Use strict semantic matches first
        if (isV1 && !isV2 && !isV3) {
            newCategory = "Volume 1 : La Science de la Force";
        } else if (isV3 && !isV1 && !isV2) {
            newCategory = "Volume 3 : La Science de la Santé";
        } else if (isV2 && !isV1 && !isV3) {
            newCategory = "Volume 2 : La Science de l'Endurance";
        } else {
            // Unmatched or mixed topics are evenly distributed to balance the encyclopedia
            roundRobin = (roundRobin % 3) + 1;
            if (roundRobin === 1) newCategory = "Volume 1 : La Science de la Force";
            if (roundRobin === 2) newCategory = "Volume 2 : La Science de l'Endurance";
            if (roundRobin === 3) newCategory = "Volume 3 : La Science de la Santé";
        }

        if (newCategory !== article.category) {
            // Escape single quotes for SQL
            sqlStatements += `UPDATE articles SET category = '${newCategory.replace(/'/g, "''")}' WHERE id = '${article.id}';\n`;

            if (newCategory.includes('Volume 1')) countVol1++;
            if (newCategory.includes('Volume 2')) countVol2++;
            if (newCategory.includes('Volume 3')) countVol3++;
        } else {
            if (newCategory.includes('Volume 1')) countVol1++;
            if (newCategory.includes('Volume 2')) countVol2++;
            if (newCategory.includes('Volume 3')) countVol3++;
        }
    }

    fs.writeFileSync('scripts/rebalance_encyclopedia.sql', sqlStatements);

    console.log(`\nSQL Script 'scripts/rebalance_encyclopedia.sql' generated successfully!`);
    console.log(`\nEstimated Final Balances after running SQL:`);
    console.log(`- Volume 1: ${countVol1} articles (${Math.round((countVol1 / articles.length) * 100)}%)`);
    console.log(`- Volume 2: ${countVol2} articles (${Math.round((countVol2 / articles.length) * 100)}%)`);
    console.log(`- Volume 3: ${countVol3} articles (${Math.round((countVol3 / articles.length) * 100)}%)`);
}

fixCategories();
