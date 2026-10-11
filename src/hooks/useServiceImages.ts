import { useCallback, useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase/supabaseClient';

/**
 * Images des services personnalisées depuis le dashboard admin.
 * Table `service_images` (lecture publique, écriture admin via RLS).
 * Si aucune image n'est définie pour un service, le site garde l'image
 * par défaut déclarée dans `src/data/services.ts`.
 */
export interface ServiceImageRow {
  slug: string;
  card_image_url: string | null;
  hero_image_url: string | null;
  updated_at: string;
}

export type ServiceImagesMap = Record<string, ServiceImageRow>;

export const SERVICE_IMAGES_BUCKET = 'service-images';

// Cache partagé entre les composants : une seule requête par chargement de page.
let cache: ServiceImagesMap | null = null;
let inflight: Promise<ServiceImagesMap> | null = null;
const listeners = new Set<(map: ServiceImagesMap) => void>();

async function loadServiceImages(force = false): Promise<ServiceImagesMap> {
  if (cache && !force) return cache;
  if (inflight && !force) return inflight;

  inflight = (async () => {
    const { data, error } = await supabase
      .from('service_images')
      .select('slug, card_image_url, hero_image_url, updated_at');

    if (error) {
      // En cas d'erreur, le site continue avec les images par défaut.
      console.warn('service_images indisponible, images par défaut utilisées :', error.message);
      return cache ?? {};
    }

    const map: ServiceImagesMap = {};
    for (const row of (data ?? []) as ServiceImageRow[]) map[row.slug] = row;
    cache = map;
    listeners.forEach((fn) => fn(map));
    return map;
  })();

  try {
    return await inflight;
  } finally {
    inflight = null;
  }
}

export function useServiceImages() {
  const [images, setImages] = useState<ServiceImagesMap>(cache ?? {});
  const [loading, setLoading] = useState(cache === null);

  useEffect(() => {
    let mounted = true;
    const onChange = (map: ServiceImagesMap) => mounted && setImages(map);
    listeners.add(onChange);
    loadServiceImages().then((map) => {
      if (!mounted) return;
      setImages(map);
      setLoading(false);
    });
    return () => {
      mounted = false;
      listeners.delete(onChange);
    };
  }, []);

  const refresh = useCallback(() => loadServiceImages(true), []);

  return { images, loading, refresh };
}

/** Image de la carte (accueil) : personnalisée sinon par défaut. */
export function cardImageFor(slug: string, fallback: string | undefined, images: ServiceImagesMap) {
  return images[slug]?.card_image_url || fallback;
}

/** Image d'en-tête (page du service) : personnalisée sinon par défaut. */
export function heroImageFor(slug: string, fallback: string | undefined, images: ServiceImagesMap) {
  return images[slug]?.hero_image_url || fallback;
}
