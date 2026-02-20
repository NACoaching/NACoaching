-- =============================================================
-- SCRIPT DE SÉCURISATION DES RLS - NA Coaching
-- Verrouille les tables pour que seul l'admin (authenticated)
-- puisse insérer, modifier et supprimer.
-- Les visiteurs ne peuvent que LIRE (SELECT).
-- =============================================================

-- ========================
-- TABLE: articles
-- ========================
DROP POLICY IF EXISTS "Enable insert access for all users" ON articles;
DROP POLICY IF EXISTS "Enable update access for all users" ON articles;
DROP POLICY IF EXISTS "Enable delete access for all users" ON articles;

-- Lecture publique (pour afficher les articles sur le site)
-- La policy "Enable read access for all users" existe déjà, on la garde.

-- Écriture réservée à l'admin
CREATE POLICY "Admin can insert articles"
  ON articles FOR INSERT TO authenticated WITH CHECK (true);

CREATE POLICY "Admin can update articles"
  ON articles FOR UPDATE TO authenticated
  USING (true) WITH CHECK (true);

CREATE POLICY "Admin can delete articles"
  ON articles FOR DELETE TO authenticated USING (true);


-- ========================
-- TABLE: products
-- ========================
DROP POLICY IF EXISTS "Enable insert access for all users" ON products;
DROP POLICY IF EXISTS "Enable update access for all users" ON products;
DROP POLICY IF EXISTS "Enable delete access for all users" ON products;

CREATE POLICY "Admin can insert products"
  ON products FOR INSERT TO authenticated WITH CHECK (true);

CREATE POLICY "Admin can update products"
  ON products FOR UPDATE TO authenticated
  USING (true) WITH CHECK (true);

CREATE POLICY "Admin can delete products"
  ON products FOR DELETE TO authenticated USING (true);


-- ========================
-- TABLE: site_content
-- ========================
DROP POLICY IF EXISTS "Enable insert access for all users" ON site_content;
DROP POLICY IF EXISTS "Enable update access for all users" ON site_content;
DROP POLICY IF EXISTS "Enable delete access for all users" ON site_content;
DROP POLICY IF EXISTS "Enable insert for all users" ON site_content;
DROP POLICY IF EXISTS "Enable update for all users" ON site_content;
DROP POLICY IF EXISTS "Enable delete for all users" ON site_content;

CREATE POLICY "Admin can insert site_content"
  ON site_content FOR INSERT TO authenticated WITH CHECK (true);

CREATE POLICY "Admin can update site_content"
  ON site_content FOR UPDATE TO authenticated
  USING (true) WITH CHECK (true);

CREATE POLICY "Admin can delete site_content"
  ON site_content FOR DELETE TO authenticated USING (true);


-- ========================
-- TABLE: reviews
-- ========================
-- On retire l'INSERT public. L'API /api/reviews utilise le service_role_key
-- qui contourne le RLS, donc les insertions via l'API continueront de fonctionner.
DROP POLICY IF EXISTS "Allow public insert on reviews" ON reviews;
DROP POLICY IF EXISTS "Enable insert access for all users" ON reviews;
DROP POLICY IF EXISTS "Public can insert reviews" ON reviews;

CREATE POLICY "Admin and service can insert reviews"
  ON reviews FOR INSERT TO authenticated WITH CHECK (true);


-- ========================
-- TABLE: comments
-- ========================
-- Les commentaires sont insérés publiquement via le site (formulaire blog).
-- On vérifie juste que UPDATE et DELETE sont admin-only.
DROP POLICY IF EXISTS "Enable update access for all users" ON comments;
DROP POLICY IF EXISTS "Enable delete access for all users" ON comments;

-- Si la policy insert publique n'existe pas, on la crée
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_policies
        WHERE tablename = 'comments' AND cmd = 'INSERT' AND permissive = 'PERMISSIVE'
    ) THEN
        CREATE POLICY "Public can insert comments"
          ON comments FOR INSERT WITH CHECK (true);
    END IF;
END $$;

CREATE POLICY "Admin can update comments"
  ON comments FOR UPDATE TO authenticated
  USING (true) WITH CHECK (true);

CREATE POLICY "Admin can delete comments"
  ON comments FOR DELETE TO authenticated USING (true);
