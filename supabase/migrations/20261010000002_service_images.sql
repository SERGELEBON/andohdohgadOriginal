-- =====================================================================
-- Images des services modifiables depuis le dashboard admin
-- Idempotent : peut être relancé sans risque.
-- =====================================================================

-- 1. Table : une ligne par service (slug de src/data/services.ts)
CREATE TABLE IF NOT EXISTS public.service_images (
  slug            text PRIMARY KEY CHECK (slug ~ '^[a-z0-9-]{1,64}$'),
  card_image_url  text CHECK (card_image_url IS NULL OR card_image_url ~ '^https://'),
  hero_image_url  text CHECK (hero_image_url IS NULL OR hero_image_url ~ '^https://'),
  updated_at      timestamptz NOT NULL DEFAULT now(),
  updated_by      uuid REFERENCES auth.users(id) ON DELETE SET NULL DEFAULT auth.uid()
);

COMMENT ON TABLE public.service_images IS 'Images personnalisées des services (cartes accueil + en-têtes), gérées par les admins';

-- Horodatage et auteur de la dernière modification
CREATE OR REPLACE FUNCTION public.service_images_touch()
RETURNS trigger
LANGUAGE plpgsql
SET search_path = public
AS $$
BEGIN
  NEW.updated_at := now();
  NEW.updated_by := auth.uid();
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS service_images_touch ON public.service_images;
CREATE TRIGGER service_images_touch
  BEFORE INSERT OR UPDATE ON public.service_images
  FOR EACH ROW EXECUTE FUNCTION public.service_images_touch();

-- 2. RLS : lecture publique, écriture réservée aux admins
ALTER TABLE public.service_images ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Public can read service images" ON public.service_images;
CREATE POLICY "Public can read service images"
  ON public.service_images FOR SELECT
  USING (true);

DROP POLICY IF EXISTS "Admins can manage service images" ON public.service_images;
CREATE POLICY "Admins can manage service images"
  ON public.service_images FOR ALL
  USING (public.is_admin())
  WITH CHECK (public.is_admin());

-- 3. Bucket de stockage : public en lecture, 5 Mo max, images uniquement
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES ('service-images', 'service-images', true, 5242880, ARRAY['image/jpeg', 'image/png', 'image/webp'])
ON CONFLICT (id) DO UPDATE
  SET public = EXCLUDED.public,
      file_size_limit = EXCLUDED.file_size_limit,
      allowed_mime_types = EXCLUDED.allowed_mime_types;

DROP POLICY IF EXISTS "Public can view service images" ON storage.objects;
CREATE POLICY "Public can view service images"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'service-images');

DROP POLICY IF EXISTS "Admins can upload service images" ON storage.objects;
CREATE POLICY "Admins can upload service images"
  ON storage.objects FOR INSERT
  WITH CHECK (bucket_id = 'service-images' AND public.is_admin());

DROP POLICY IF EXISTS "Admins can update service images" ON storage.objects;
CREATE POLICY "Admins can update service images"
  ON storage.objects FOR UPDATE
  USING (bucket_id = 'service-images' AND public.is_admin())
  WITH CHECK (bucket_id = 'service-images' AND public.is_admin());

DROP POLICY IF EXISTS "Admins can delete service images" ON storage.objects;
CREATE POLICY "Admins can delete service images"
  ON storage.objects FOR DELETE
  USING (bucket_id = 'service-images' AND public.is_admin());
