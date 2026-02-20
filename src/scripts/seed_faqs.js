import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import path from 'path';

// Load env vars
dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
    console.error("Missing Supabase credentials in .env.local");
    process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function main() {
    console.log("Adding faqs column to products if it doesn't exist...");
    // Hack: Supabase API doesn't do schema migrations easily via client without RPC.
    // Assuming the user might not have run the SQL script, we can't easily add a column here.
    // Wait, let's just attempt to update the site_faq in site_content first.

    console.log("Setting up Global Homepage FAQs...");
    const globalFaqs = [
        { question: "Le coaching sportif est-il adapté aux débutants ?", answer: "Absolument. En tant que Master EOPS, j'adapte chaque séance à votre niveau initial, vos antécédents et vos objectifs personnels pour une progression sécurisée." },
        { question: "Comment se déroule le suivi à distance ?", answer: "Via une application dédiée, vous recevez vos programmes vidéo, planifiez vos séances et nous communiquons quotidiennement. Un bilan est fait chaque semaine." },
        { question: "Proposez-vous des programmes de réathlétisation ?", answer: "Oui, c'est mon expertise première. Si vous sortez d'une blessure (croisés, entorse, déchirure), nous établirons un protocole scientifique pour un retour au sport optimal." }
    ];

    const { error: error1 } = await supabase
        .from('site_content')
        .upsert({ key: 'site_faq', value: JSON.stringify(globalFaqs) }, { onConflict: 'key' });

    if (error1) {
        console.error("Failed to add site_faq", error1);
    } else {
        console.log("✅ site_faq added to site_content");
    }

    // Since we may not have the 'faqs' column in products table, we'll tell the user how to add it.
    // Alternatively, I can try to update an existing product just to see if the column exists.

    const { data: products } = await supabase.from('products').select('id, title').limit(1);
    if (products && products.length > 0) {
        const productFaqs = [
            { question: "Combien de temps dure ce programme ?", answer: "Il est conçu pour être suivi sur un cycle de 12 semaines, avec 3 à 4 séances par semaine." },
            { question: "Ai-je besoin de matériel ?", answer: "Une paire d'haltères, un élastique et un banc suffisent pour la majorité des exercices." }
        ];

        const { error: error2 } = await supabase.from('products').update({ faqs: productFaqs }).eq('id', products[0].id);
        if (error2) {
            console.error("Failed to update product faqs. Ensure you ran the SQL Script to add the faqs column!", error2.message);
        } else {
            console.log(`✅ faqs added to product ${products[0].title}`);
        }
    }
}

main();
