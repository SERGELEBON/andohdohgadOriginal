import { useState, useRef } from 'react';
import { supabase } from '@/lib/supabase/supabaseClient';
import { Upload, X, Loader2, CheckCircle } from 'lucide-react';

interface ImageUploadProps {
  currentImageUrl?: string;
  onImageUploaded: (url: string) => void;
  bucket?: 'blog-images' | 'site-images';
  acceptedFormats?: string;
  maxSizeMB?: number;
}

export default function ImageUpload({
  currentImageUrl,
  onImageUploaded,
  bucket = 'blog-images',
  acceptedFormats = 'image/jpeg,image/png,image/webp,image/gif',
  maxSizeMB = 5,
}: ImageUploadProps) {
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [previewUrl, setPreviewUrl] = useState(currentImageUrl || '');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validation du type de fichier
    if (!acceptedFormats.split(',').includes(file.type)) {
      alert(`Format non supporté. Formats acceptés : ${acceptedFormats}`);
      return;
    }

    // Validation de la taille
    const fileSizeMB = file.size / (1024 * 1024);
    if (fileSizeMB > maxSizeMB) {
      alert(`Le fichier est trop volumineux (${fileSizeMB.toFixed(1)}MB). Taille max : ${maxSizeMB}MB`);
      return;
    }

    // Preview locale immédiate
    const localPreview = URL.createObjectURL(file);
    setPreviewUrl(localPreview);

    await uploadFile(file);
  };

  const uploadFile = async (file: File) => {
    try {
      setUploading(true);
      setUploadProgress(0);

      // Générer un nom de fichier unique
      const fileExt = file.name.split('.').pop();
      const fileName = `${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`;
      const filePath = `${fileName}`;

      // Simulation de progression (Supabase ne fournit pas de vraie progression)
      const progressInterval = setInterval(() => {
        setUploadProgress((prev) => Math.min(prev + 10, 90));
      }, 200);

      // Upload vers Supabase Storage
      const { error } = await supabase.storage
        .from(bucket)
        .upload(filePath, file, {
          cacheControl: '3600',
          upsert: false,
        });

      clearInterval(progressInterval);
      setUploadProgress(100);

      if (error) throw error;

      // Obtenir l'URL publique
      const { data: { publicUrl } } = supabase.storage
        .from(bucket)
        .getPublicUrl(filePath);

      setPreviewUrl(publicUrl);
      onImageUploaded(publicUrl);

      setTimeout(() => {
        setUploadProgress(0);
      }, 1000);
    } catch (error: any) {
      console.error('Error uploading image:', error);
      alert(`Erreur lors de l'upload : ${error.message}`);
      setPreviewUrl(currentImageUrl || '');
    } finally {
      setUploading(false);
    }
  };

  const handleRemove = () => {
    setPreviewUrl('');
    onImageUploaded('');
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <div className="space-y-3">
      {/* Input caché */}
      <input
        ref={fileInputRef}
        type="file"
        accept={acceptedFormats}
        onChange={handleFileSelect}
        className="hidden"
        disabled={uploading}
      />

      {/* Preview de l'image */}
      {previewUrl && (
        <div className="relative group">
          <img
            src={previewUrl}
            alt="Preview"
            className="w-full h-48 object-cover rounded-lg border border-gray-200"
            onError={(e) => {
              e.currentTarget.src = 'https://via.placeholder.com/400x200?text=Image+non+trouvée';
            }}
          />
          <button
            type="button"
            onClick={handleRemove}
            className="absolute top-2 right-2 p-1.5 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
            title="Supprimer l'image"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Bouton Upload */}
      <button
        type="button"
        onClick={() => fileInputRef.current?.click()}
        disabled={uploading}
        className="w-full px-4 py-3 border-2 border-dashed border-gray-300 rounded-lg hover:border-primary hover:bg-primary/5 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
      >
        <div className="flex items-center justify-center gap-2">
          {uploading ? (
            <>
              <Loader2 className="w-5 h-5 animate-spin text-primary" />
              <span className="text-sm text-gray-700">Upload en cours... {uploadProgress}%</span>
            </>
          ) : uploadProgress === 100 ? (
            <>
              <CheckCircle className="w-5 h-5 text-green-600" />
              <span className="text-sm text-green-600">Upload réussi !</span>
            </>
          ) : (
            <>
              <Upload className="w-5 h-5 text-gray-400" />
              <span className="text-sm text-gray-700">
                {previewUrl ? 'Changer l\'image' : 'Uploader une image'}
              </span>
            </>
          )}
        </div>
      </button>

      {/* Info */}
      <p className="text-xs text-gray-500 text-center">
        Formats acceptés : JPG, PNG, WebP, GIF • Max {maxSizeMB}MB
      </p>

      {/* Barre de progression */}
      {uploading && uploadProgress > 0 && uploadProgress < 100 && (
        <div className="w-full bg-gray-200 rounded-full h-1.5 overflow-hidden">
          <div
            className="bg-primary h-full transition-all duration-300"
            style={{ width: `${uploadProgress}%` }}
          />
        </div>
      )}
    </div>
  );
}
