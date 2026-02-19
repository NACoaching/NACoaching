-- Ajoute les permissions manquantes (UPDATE/DELETE) pour les Articles et Produits

-- PRODUCTS: Enable UPDATE
-- Permet la mise à jour des produits pour tous (ou pour les utilisateurs authentifiés si le RLS est configuré pour check auth)
-- Pour la cohérence avec les autres politiques de "simplification", on utilise USING(true)
CREATE POLICY "Enable update access for all users"
ON products FOR UPDATE
USING (true)
WITH CHECK (true);

-- ARTICLES: Enable UPDATE
CREATE POLICY "Enable update access for all users"
ON articles FOR UPDATE
USING (true)
WITH CHECK (true);

-- ARTICLES: Enable DELETE (au cas où il manquerait)
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1
        FROM pg_policies
        WHERE tablename = 'articles'
        AND policyname = 'Enable delete access for all users'
    ) THEN
        CREATE POLICY "Enable delete access for all users"
        ON articles FOR DELETE
        USING (true);
    END IF;
END $$;
