import { useRef, useState } from 'react';
import { ImageIcon, Upload, RotateCcw, CheckCircle2, AlertCircle, Loader2, ExternalLink } from 'lucide-react';
import AdminLayout from '@/components/layout/AdminLayout';
import { services } from '@/data/services';
import { supabase } from '@/lib/supabase/supabaseClient';
import { useServiceImages, SERVICE_IMAGES_BUCKET } from '@/hooks/useServiceImages';

type Kind = 'card' | 'hero';

const MAX_SIZE_MB = 5;
const ALLOWED_TYPES = ['image/jpeg', 'image/png', 'image/webp'];
const EXT_BY_TYPE: Record<string, string> = {
  'image/jpeg': 'jpg',
  'image/png': 'png',
  'image/webp': 'webp',
};

const KIND_INFO: Record<Kind, { label: string; help: string; column: 'card_image_url' | 'hero_image_url' }> = {
  card: {
    label: 'Image de la carte',
    help: "Affichée dans la section « Nos Services » de l'accueil. Format conseillé : 1200 × 800 px.",
    column: 'card_image_url',
  },
  hero: {
    label: "Image d'en-tête",
    help: 'Fond du bandeau en haut de la page du service. Format conseillé : 1920 × 600 px, sans texte.',
    column: 'hero_image_url',
  },
};

type Feedback = { type: 'success' | 'error'; message: string } | null;

/** Chemin du fichier dans le bucket à partir de son URL publique (null si image hors bucket). */
function storagePathFromUrl(url: string | null | undefined): string | null {
  if (!url) return null;
  const marker = `/storage/v1/object/public/${SERVICE_IMAGES_BUCKET}/`;
  const i = url.indexOf(marker);
  return i === -1 ? null : decodeURIComponent(url.slice(i + marker.length));
}

function ImageSlot({
  slug,
  kind,
  defaultUrl,
  currentUrl,
  onSaved,
}: {
  slug: string;
  kind: Kind;
  defaultUrl?: string;
  currentUrl?: string | null;
  onSaved: () => Promise<unknown>;
}) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [busy, setBusy] = useState(false);
  const [feedback, setFeedback] = useState<Feedback>(null);
  const info = KIND_INFO[kind];
  const isCustom = Boolean(currentUrl);
  const preview = currentUrl || defaultUrl;

  const handleFile = async (file: File) => {
    setFeedback(null);

    if (!ALLOWED_TYPES.includes(file.type)) {
      setFeedback({ type: 'error', message: 'Format non accepté. Utilisez JPG, PNG ou WebP.' });
      return;
    }
    if (file.size > MAX_SIZE_MB * 1024 * 1024) {
      setFeedback({ type: 'error', message: `Image trop lourde (max ${MAX_SIZE_MB} Mo).` });
      return;
    }

    setBusy(true);
    try {
      // Nom de fichier généré : jamais le nom fourni par l'utilisateur.
      const path = `${slug}/${kind}-${Date.now()}.${EXT_BY_TYPE[file.type]}`;
      const { error: uploadError } = await supabase.storage
        .from(SERVICE_IMAGES_BUCKET)
        .upload(path, file, { cacheControl: '31536000', upsert: false, contentType: file.type });
      if (uploadError) throw uploadError;

      const { data } = supabase.storage.from(SERVICE_IMAGES_BUCKET).getPublicUrl(path);

      const { error: dbError } = await supabase
        .from('service_images')
        .upsert({ slug, [info.column]: data.publicUrl }, { onConflict: 'slug' });
      if (dbError) {
        await supabase.storage.from(SERVICE_IMAGES_BUCKET).remove([path]);
        throw dbError;
      }

      // Nettoyage de l'ancienne image personnalisée (sans bloquer en cas d'échec)
      const oldPath = storagePathFromUrl(currentUrl);
      if (oldPath) await supabase.storage.from(SERVICE_IMAGES_BUCKET).remove([oldPath]);

      await onSaved();
      setFeedback({ type: 'success', message: 'Image mise à jour. Elle est déjà visible sur le site.' });
    } catch (err: any) {
      console.error('Erreur upload image service :', err);
      setFeedback({ type: 'error', message: "L'image n'a pas pu être enregistrée. Réessayez." });
    } finally {
      setBusy(false);
      if (inputRef.current) inputRef.current.value = '';
    }
  };

  const resetToDefault = async () => {
    if (!isCustom) return;
    if (!confirm("Rétablir l'image par défaut pour ce service ?")) return;
    setBusy(true);
    setFeedback(null);
    try {
      const { error } = await supabase
        .from('service_images')
        .update({ [info.column]: null })
        .eq('slug', slug);
      if (error) throw error;

      const oldPath = storagePathFromUrl(currentUrl);
      if (oldPath) await supabase.storage.from(SERVICE_IMAGES_BUCKET).remove([oldPath]);

      await onSaved();
      setFeedback({ type: 'success', message: 'Image par défaut rétablie.' });
    } catch (err) {
      console.error('Erreur réinitialisation image service :', err);
      setFeedback({ type: 'error', message: "Impossible de rétablir l'image par défaut." });
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="flex flex-col">
      <div className="flex items-center justify-between mb-2">
        <h4 className="text-sm font-semibold text-dark">{info.label}</h4>
        <span
          className={`text-[11px] font-medium px-2 py-0.5 rounded-full ${
            isCustom ? 'bg-emerald-50 text-emerald-700' : 'bg-gray-100 text-gray-600'
          }`}
        >
          {isCustom ? 'Personnalisée' : 'Par défaut'}
        </span>
      </div>

      <div
        className={`relative rounded-lg overflow-hidden bg-gray-100 border border-gray-200 ${
          kind === 'card' ? 'aspect-[3/2]' : 'aspect-[16/5]'
        }`}
      >
        {preview ? (
          <img
            src={preview}
            alt={`${info.label} — aperçu`}
            className={`w-full h-full ${kind === 'card' ? 'object-contain p-2' : 'object-cover'}`}
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-gray-400">
            <ImageIcon className="w-8 h-8" />
          </div>
        )}
        {busy && (
          <div className="absolute inset-0 bg-white/70 flex items-center justify-center">
            <Loader2 className="w-6 h-6 text-primary animate-spin" />
          </div>
        )}
      </div>

      <p className="text-xs text-gray-500 mt-2">{info.help}</p>

      <div className="flex flex-wrap gap-2 mt-3">
        <input
          ref={inputRef}
          type="file"
          accept={ALLOWED_TYPES.join(',')}
          className="hidden"
          onChange={(e) => {
            const file = e.target.files?.[0];
            if (file) handleFile(file);
          }}
        />
        <button
          type="button"
          disabled={busy}
          onClick={() => inputRef.current?.click()}
          className="inline-flex items-center gap-2 px-3 py-2 text-sm font-medium rounded-lg bg-primary text-white hover:bg-primary/90 disabled:opacity-50 transition-colors"
        >
          <Upload className="w-4 h-4" />
          Remplacer
        </button>
        {isCustom && (
          <button
            type="button"
            disabled={busy}
            onClick={resetToDefault}
            className="inline-flex items-center gap-2 px-3 py-2 text-sm font-medium rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-50 disabled:opacity-50 transition-colors"
          >
            <RotateCcw className="w-4 h-4" />
            Rétablir par défaut
          </button>
        )}
      </div>

      {feedback && (
        <p
          role="status"
          className={`mt-2 flex items-center gap-1.5 text-xs ${
            feedback.type === 'success' ? 'text-emerald-700' : 'text-red-600'
          }`}
        >
          {feedback.type === 'success' ? <CheckCircle2 className="w-4 h-4" /> : <AlertCircle className="w-4 h-4" />}
          {feedback.message}
        </p>
      )}
    </div>
  );
}

export default function ServiceImagesAdmin() {
  const { images, loading, refresh } = useServiceImages();

  return (
    <AdminLayout>
      <div className="p-6 lg:p-8 mt-6">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-dark mb-2">Images des services</h1>
          <p className="text-gray-600 text-sm">
            Remplacez les images des cartes de la section « Nos Services » et des en-têtes des pages services.
            JPG, PNG ou WebP, {MAX_SIZE_MB} Mo maximum.
          </p>
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-20">
            <Loader2 className="w-8 h-8 text-primary animate-spin" />
          </div>
        ) : (
          <div className="space-y-6">
            {services.map((service) => {
              const Icon = service.icon;
              const row = images[service.slug];
              return (
                <section
                  key={service.slug}
                  className="bg-white rounded-xl border border-gray-100 shadow-sm p-6"
                  aria-labelledby={`svc-${service.slug}`}
                >
                  <div className="flex items-center justify-between gap-4 mb-5">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                        <Icon className="w-5 h-5 text-primary" />
                      </div>
                      <h2 id={`svc-${service.slug}`} className="font-semibold text-dark">
                        {service.title}
                      </h2>
                    </div>
                    <a
                      href={`/services/${service.slug}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 text-xs text-primary hover:underline"
                    >
                      Voir la page <ExternalLink className="w-3.5 h-3.5" />
                    </a>
                  </div>

                  <div className="grid md:grid-cols-2 gap-6">
                    <ImageSlot
                      slug={service.slug}
                      kind="card"
                      defaultUrl={service.image}
                      currentUrl={row?.card_image_url}
                      onSaved={refresh}
                    />
                    <ImageSlot
                      slug={service.slug}
                      kind="hero"
                      defaultUrl={service.heroImage ?? service.image}
                      currentUrl={row?.hero_image_url}
                      onSaved={refresh}
                    />
                  </div>
                </section>
              );
            })}
          </div>
        )}
      </div>
    </AdminLayout>
  );
}
