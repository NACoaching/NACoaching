-- Insert default values for Product Page Customization if they don't exist
INSERT INTO site_content (key, value, label) VALUES
('product_page_back_link', 'Retour à la boutique', 'Lien retour boutique'),
('product_page_features_title', 'Ce que tu vas obtenir', 'Titre de la liste des caractéristiques'),
('product_page_subtitle', 'Programme Digital', 'Sous-titre (au-dessus du titre)'),
('product_page_cta', 'Acheter maintenant', 'Bouton d''achat')
ON CONFLICT (key) DO NOTHING;
