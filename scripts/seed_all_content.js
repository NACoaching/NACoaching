require('dotenv').config({ path: '.env.local' });
const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY);

async function checkAndSeed() {
    const keys = [
        // Hero (already checked but good to have)
        { key: 'hero_title', value: 'NA COACHING', label: 'Titre Principal' },
        { key: 'hero_subtitle', value: 'Coaching sportif haut de gamme basé sur la physiologie et la biomécanique.', label: 'Sous-titre' },
        { key: 'hero_cta_primary', value: 'Commencer l\'entraînement', label: 'Bouton Principal' },
        { key: 'hero_cta_secondary', value: 'Découvrir le Labo', label: 'Bouton Secondaire' },

        // About
        { key: 'about_title', value: 'MON PARCOURS', label: 'Titre "À propos"' },
        { key: 'about_text', value: 'Expert en préparation physique et réathlétisation.', label: 'Texte "À propos"' },

        // Shop
        { key: 'shop_title', value: 'MES PROGRAMMES', label: 'Titre Boutique' },
        { key: 'shop_subtitle', value: 'Atteins tes objectifs avec des programmes validés par la science.', label: 'Sous-titre Boutique' },

        // Legal
        { key: 'legal_mentions', value: 'Mentions Légales par défaut.', label: 'Mentions Légales' },
        { key: 'privacy_policy', value: 'Politique de Confidentialité par défaut.', label: 'Politique de Confidentialité' },

        // Footer
        { key: 'footer_text', value: 'Expertise & Passion', label: 'Texte Pied de Page' },
        { key: 'footer_newsletter_title', value: 'Rejoins le Labo', label: 'Titre Newsletter' },
        { key: 'footer_newsletter_text', value: 'Reçois mes conseils exclusifs directement par email.', label: 'Texte Newsletter' },
        { key: 'footer_follow_title', value: 'Suis-moi', label: 'Titre Réseaux Sociaux' },
        { key: 'footer_copyright', value: '© 2026 NA Coaching', label: 'Copyright' },
        { key: 'footer_sub_copyright', value: 'Tous droits réservés.', label: 'Sous-Copyright' }
    ];

    for (const item of keys) {
        const { data } = await supabase.from('site_content').select('*').eq('key', item.key).single();
        if (!data) {
            console.log(`Inserting: ${item.key}`);
            const { error } = await supabase.from('site_content').insert([item]);
            if (error) console.error(`Error inserting ${item.key}:`, error);
        } else {
            console.log(`Exists: ${item.key}`);
        }
    }
}

checkAndSeed();
