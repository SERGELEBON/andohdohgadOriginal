import { useState } from 'react';
import { X, ChevronDown, ChevronUp } from 'lucide-react';
import DocumentUpload from './DocumentUpload';
import type { Document } from '@/hooks/useDocuments';

interface DocumentFormProps {
  document?: Document | null;
  onSubmit: (data: DocumentFormData) => Promise<void>;
  onCancel: () => void;
}

export interface DocumentFormData {
  doc_type: 'guides' | 'fiscaux' | 'modeles' | 'notes';
  price: number;
  status: 'draft' | 'active' | 'archived';
  file_url?: string;
  file_name?: string;
  file_size?: number;
  translations: {
    language: 'fr' | 'en' | 'es';
    title: string;
    description: string;
  }[];
}

export default function DocumentForm({ document, onSubmit, onCancel }: DocumentFormProps) {
  const isEditing = !!document;

  // État du formulaire
  const [docType, setDocType] = useState<string>(document?.doc_type || 'guides');
  const [price, setPrice] = useState<string>(document?.price?.toString() || '');
  const [status, setStatus] = useState<string>(document?.status || 'draft');

  // Traductions
  const [titleFr, setTitleFr] = useState(
    document?.translations?.find(t => t.language === 'fr')?.title || ''
  );
  const [descFr, setDescFr] = useState(
    document?.translations?.find(t => t.language === 'fr')?.description || ''
  );
  const [titleEn, setTitleEn] = useState(
    document?.translations?.find(t => t.language === 'en')?.title || ''
  );
  const [descEn, setDescEn] = useState(
    document?.translations?.find(t => t.language === 'en')?.description || ''
  );
  const [titleEs, setTitleEs] = useState(
    document?.translations?.find(t => t.language === 'es')?.title || ''
  );
  const [descEs, setDescEs] = useState(
    document?.translations?.find(t => t.language === 'es')?.description || ''
  );

  // Fichier
  const [fileUrl, setFileUrl] = useState(document?.file_url || '');
  const [fileName, setFileName] = useState(document?.file_name || '');
  const [fileSize, setFileSize] = useState(document?.file_size || 0);

  // UI
  const [showTranslations, setShowTranslations] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleUploadSuccess = (url: string, name: string, size: number) => {
    setFileUrl(url);
    setFileName(name);
    setFileSize(size);
  };

  const validate = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!titleFr.trim()) {
      newErrors.titleFr = 'Le titre en français est obligatoire';
    }

    if (!descFr.trim()) {
      newErrors.descFr = 'La description en français est obligatoire';
    }

    if (!price || parseFloat(price) < 0) {
      newErrors.price = 'Le prix doit être supérieur ou égal à 0';
    }

    if (!isEditing && !fileUrl) {
      newErrors.file = 'Veuillez uploader un fichier';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validate()) return;

    setSubmitting(true);

    const translations = [
      { language: 'fr' as const, title: titleFr, description: descFr },
    ];

    if (titleEn && descEn) {
      translations.push({ language: 'en' as const, title: titleEn, description: descEn });
    }

    if (titleEs && descEs) {
      translations.push({ language: 'es' as const, title: titleEs, description: descEs });
    }

    const formData: DocumentFormData = {
      doc_type: docType as any,
      price: parseFloat(price),
      status: status as any,
      translations,
    };

    if (fileUrl) {
      formData.file_url = fileUrl;
      formData.file_name = fileName;
      formData.file_size = fileSize;
    }

    try {
      await onSubmit(formData);
    } catch (error) {
      console.error('Error submitting form:', error);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-black/50">
      <div className="relative bg-white rounded-2xl w-full max-w-3xl max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
          <h2 className="text-xl font-bold text-dark">
            {isEditing ? 'Modifier le document' : 'Nouveau document'}
          </h2>
          <button
            onClick={onCancel}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Body */}
        <form onSubmit={handleSubmit} className="p-6 overflow-y-auto max-h-[calc(90vh-140px)]">
          <div className="space-y-6">
            {/* Français (obligatoire) */}
            <div>
              <h3 className="text-lg font-semibold text-dark mb-4">🇫🇷 Français (obligatoire)</h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Titre *
                  </label>
                  <input
                    type="text"
                    value={titleFr}
                    onChange={(e) => setTitleFr(e.target.value)}
                    className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent ${
                      errors.titleFr ? 'border-red-500' : 'border-gray-300'
                    }`}
                    placeholder="Guide de la création d'entreprise..."
                  />
                  {errors.titleFr && (
                    <p className="text-xs text-red-600 mt-1">{errors.titleFr}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Description *
                  </label>
                  <textarea
                    value={descFr}
                    onChange={(e) => setDescFr(e.target.value)}
                    rows={3}
                    className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent ${
                      errors.descFr ? 'border-red-500' : 'border-gray-300'
                    }`}
                    placeholder="Toutes les étapes, les coûts et les délais..."
                  />
                  {errors.descFr && (
                    <p className="text-xs text-red-600 mt-1">{errors.descFr}</p>
                  )}
                </div>
              </div>
            </div>

            {/* Catégorie et Prix */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Catégorie *
                </label>
                <select
                  value={docType}
                  onChange={(e) => setDocType(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                >
                  <option value="guides">Guides</option>
                  <option value="fiscaux">Fiscaux</option>
                  <option value="modeles">Modèles</option>
                  <option value="notes">Notes</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Prix (FCFA) *
                </label>
                <input
                  type="number"
                  value={price}
                  onChange={(e) => setPrice(e.target.value)}
                  min="0"
                  step="100"
                  className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent ${
                    errors.price ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="5000"
                />
                {errors.price && (
                  <p className="text-xs text-red-600 mt-1">{errors.price}</p>
                )}
              </div>
            </div>

            {/* Statut */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Statut
              </label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
              >
                <option value="draft">Brouillon</option>
                <option value="active">Actif</option>
                <option value="archived">Archivé</option>
              </select>
            </div>

            {/* Upload fichier */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Fichier {!isEditing && '*'}
              </label>
              {fileUrl ? (
                <div className="flex items-center gap-2 p-3 bg-green-50 border border-green-200 rounded-lg">
                  <span className="text-sm text-green-700">✓ {fileName}</span>
                  <button
                    type="button"
                    onClick={() => {
                      setFileUrl('');
                      setFileName('');
                      setFileSize(0);
                    }}
                    className="ml-auto text-red-600 hover:text-red-700 text-xs"
                  >
                    Supprimer
                  </button>
                </div>
              ) : (
                <DocumentUpload onUploadSuccess={handleUploadSuccess} />
              )}
              {errors.file && (
                <p className="text-xs text-red-600 mt-1">{errors.file}</p>
              )}
            </div>

            {/* Traductions (accordéon) */}
            <div>
              <button
                type="button"
                onClick={() => setShowTranslations(!showTranslations)}
                className="flex items-center justify-between w-full p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
              >
                <span className="text-sm font-medium text-gray-700">
                  Traductions (EN, ES) - Optionnel
                </span>
                {showTranslations ? (
                  <ChevronUp className="w-5 h-5 text-gray-500" />
                ) : (
                  <ChevronDown className="w-5 h-5 text-gray-500" />
                )}
              </button>

              {showTranslations && (
                <div className="mt-4 space-y-6 p-4 border border-gray-200 rounded-lg">
                  {/* English */}
                  <div>
                    <h4 className="text-sm font-semibold text-gray-700 mb-3">🇬🇧 English</h4>
                    <div className="space-y-3">
                      <input
                        type="text"
                        value={titleEn}
                        onChange={(e) => setTitleEn(e.target.value)}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                        placeholder="Business Creation Guide..."
                      />
                      <textarea
                        value={descEn}
                        onChange={(e) => setDescEn(e.target.value)}
                        rows={2}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                        placeholder="All the steps, costs and deadlines..."
                      />
                    </div>
                  </div>

                  {/* Español */}
                  <div>
                    <h4 className="text-sm font-semibold text-gray-700 mb-3">🇪🇸 Español</h4>
                    <div className="space-y-3">
                      <input
                        type="text"
                        value={titleEs}
                        onChange={(e) => setTitleEs(e.target.value)}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                        placeholder="Guía de Creación de Empresas..."
                      />
                      <textarea
                        value={descEs}
                        onChange={(e) => setDescEs(e.target.value)}
                        rows={2}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                        placeholder="Todos los pasos, costos y plazos..."
                      />
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </form>

        {/* Footer */}
        <div className="sticky bottom-0 bg-white border-t border-gray-200 px-6 py-4 flex items-center justify-end gap-3">
          <button
            type="button"
            onClick={onCancel}
            className="px-5 py-2 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
            disabled={submitting}
          >
            Annuler
          </button>
          <button
            onClick={handleSubmit}
            className="btn-primary px-6 py-2"
            disabled={submitting}
          >
            {submitting ? 'Enregistrement...' : isEditing ? 'Mettre à jour' : 'Créer'}
          </button>
        </div>
      </div>
    </div>
  );
}
