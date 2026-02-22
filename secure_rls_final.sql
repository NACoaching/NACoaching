-- =============================================================
-- SCRIPT DE SÉCURISATION DÉFINITIVE DES RLS (NA Coaching)
-- Verrouille les tables pour que seul l'admin (utilisateur authentifié)
-- puisse insérer, modifier et supprimer des données sensibles.
-- =============================================================

-- 1. NETTOYAGE DES ANCIENNES POLITIQUES INSECURES (S'il y en a)
DO $$
DECLARE
    pol record;
BEGIN
    FOR pol IN
        SELECT policyname, tablename
        FROM pg_policies
        WHERE tablename IN ('articles', 'products', 'site_content')
          AND cmd IN ('INSERT', 'UPDATE', 'DELETE')
    LOOP
        EXECUTE format('DROP POLICY IF EXISTS %I ON %I', pol.policyname, pol.tablename);
    END LOOP;
END
$$;

-- 2. ARTICLES
-- Autoriser les operations (INSERT/UPDATE/DELETE) UNIQUEMENT pour 'authenticated' (l'admin)
CREATE POLICY "Admin can insert articles" ON articles FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY "Admin can update articles" ON articles FOR UPDATE TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "Admin can delete articles" ON articles FOR DELETE TO authenticated USING (true);

-- 3. PRODUITS
-- Autoriser les operations (INSERT/UPDATE/DELETE) UNIQUEMENT pour 'authenticated' (l'admin)
CREATE POLICY "Admin can insert products" ON products FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY "Admin can update products" ON products FOR UPDATE TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "Admin can delete products" ON products FOR DELETE TO authenticated USING (true);

-- 4. SITE_CONTENT (Textes du site, héros, footer, etc.)
-- Autoriser les operations (INSERT/UPDATE/DELETE) UNIQUEMENT pour 'authenticated' (l'admin)
CREATE POLICY "Admin can insert site_content" ON site_content FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY "Admin can update site_content" ON site_content FOR UPDATE TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "Admin can delete site_content" ON site_content FOR DELETE TO authenticated USING (true);

-- (La lecture "SELECT" reste publique pour tout le site grace aux autres policies déjà en place)
