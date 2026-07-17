-- ===============================================
-- FIX : Renommer les colonnes pour correspondre au code frontend
-- Date : 2026-07-17
-- ===============================================

-- ===============================================
-- 1. TABLE appointments : date → appointment_date
-- ===============================================

-- Renommer la colonne 'date' en 'appointment_date'
ALTER TABLE public.appointments
RENAME COLUMN date TO appointment_date;

-- Vérifier que ça a fonctionné
SELECT column_name, data_type
FROM information_schema.columns
WHERE table_schema = 'public'
  AND table_name = 'appointments'
  AND column_name IN ('date', 'appointment_date');

-- ===============================================
-- 2. TABLE documentation_purchases : Vérifier la relation
-- ===============================================

-- Vérifier quel est le nom exact de la table documentation
SELECT table_name
FROM information_schema.tables
WHERE table_schema = 'public'
  AND table_name LIKE '%doc%';

-- Si la table s'appelle 'documentation', créer une clé étrangère
-- (seulement si elle n'existe pas déjà)
DO $$
BEGIN
  -- Vérifier si la table documentation existe
  IF EXISTS (
    SELECT 1 FROM information_schema.tables
    WHERE table_schema = 'public' AND table_name = 'documentation'
  ) THEN
    -- Ajouter une colonne doc_id si elle n'existe pas
    IF NOT EXISTS (
      SELECT 1 FROM information_schema.columns
      WHERE table_schema = 'public'
        AND table_name = 'documentation_purchases'
        AND column_name = 'doc_id'
    ) THEN
      ALTER TABLE public.documentation_purchases
      ADD COLUMN doc_id UUID REFERENCES public.documentation(id);
    END IF;
  END IF;
END $$;

-- ===============================================
-- 3. VÉRIFICATIONS FINALES
-- ===============================================

-- Lister toutes les colonnes de appointments
SELECT column_name, data_type, is_nullable
FROM information_schema.columns
WHERE table_schema = 'public' AND table_name = 'appointments'
ORDER BY ordinal_position;

-- Lister toutes les colonnes de documentation_purchases
SELECT column_name, data_type, is_nullable
FROM information_schema.columns
WHERE table_schema = 'public' AND table_name = 'documentation_purchases'
ORDER BY ordinal_position;

-- Lister toutes les foreign keys de documentation_purchases
SELECT
  tc.constraint_name,
  tc.table_name,
  kcu.column_name,
  ccu.table_name AS foreign_table_name,
  ccu.column_name AS foreign_column_name
FROM information_schema.table_constraints AS tc
JOIN information_schema.key_column_usage AS kcu
  ON tc.constraint_name = kcu.constraint_name
JOIN information_schema.constraint_column_usage AS ccu
  ON ccu.constraint_name = tc.constraint_name
WHERE tc.constraint_type = 'FOREIGN KEY'
  AND tc.table_schema = 'public'
  AND tc.table_name = 'documentation_purchases';
