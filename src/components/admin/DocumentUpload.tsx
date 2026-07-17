import { useState, useCallback } from 'react';
import { Upload, File, X, CheckCircle, AlertCircle } from 'lucide-react';
import { uploadDocument } from '@/lib/supabase/storage';

interface DocumentUploadProps {
  onUploadSuccess: (fileUrl: string, fileName: string, fileSize: number) => void;
  onUploadError?: (error: string) => void;
}

export default function DocumentUpload({ onUploadSuccess, onUploadError }: DocumentUploadProps) {
  const [file, setFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploadStatus, setUploadStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [error, setError] = useState<string | null>(null);

  const acceptedTypes = [
    'application/pdf',
    'application/vnd.ms-excel',
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    'application/msword',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  ];

  const acceptedExtensions = '.pdf,.doc,.docx,.xls,.xlsx';

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      validateAndSetFile(selectedFile);
    }
  };

  const validateAndSetFile = (selectedFile: File) => {
    // Vérifier le type
    if (!acceptedTypes.includes(selectedFile.type)) {
      setError('Type de fichier non autorisé. Formats acceptés : PDF, DOC, DOCX, XLS, XLSX');
      setUploadStatus('error');
      return;
    }

    // Vérifier la taille (max 50 MB)
    const maxSize = 50 * 1024 * 1024; // 50 MB
    if (selectedFile.size > maxSize) {
      setError('Le fichier est trop volumineux. Taille maximale : 50 MB');
      setUploadStatus('error');
      return;
    }

    setFile(selectedFile);
    setError(null);
    setUploadStatus('idle');
  };

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    const droppedFile = e.dataTransfer.files?.[0];
    if (droppedFile) {
      validateAndSetFile(droppedFile);
    }
  }, []);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
  }, []);

  const handleUpload = async () => {
    if (!file) return;

    setUploading(true);
    setUploadProgress(0);
    setUploadStatus('idle');

    // Simuler progression (Supabase ne fournit pas de progression native)
    const progressInterval = setInterval(() => {
      setUploadProgress(prev => {
        if (prev >= 90) {
          clearInterval(progressInterval);
          return 90;
        }
        return prev + 10;
      });
    }, 200);

    const result = await uploadDocument(file);

    clearInterval(progressInterval);
    setUploadProgress(100);

    if (result.success && result.url && result.fileName && result.fileSize !== undefined) {
      setUploadStatus('success');
      onUploadSuccess(result.url, result.fileName, result.fileSize);
    } else {
      setUploadStatus('error');
      setError(result.error || 'Erreur lors de l\'upload');
      if (onUploadError) {
        onUploadError(result.error || 'Erreur inconnue');
      }
    }

    setUploading(false);
  };

  const handleRemove = () => {
    setFile(null);
    setUploadProgress(0);
    setUploadStatus('idle');
    setError(null);
  };

  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return `${parseFloat((bytes / Math.pow(k, i)).toFixed(2))} ${sizes[i]}`;
  };

  return (
    <div className="space-y-4">
      {/* Zone de drop */}
      {!file && (
        <div
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-primary transition-colors cursor-pointer"
        >
          <input
            type="file"
            id="file-upload"
            className="hidden"
            accept={acceptedExtensions}
            onChange={handleFileChange}
          />
          <label htmlFor="file-upload" className="cursor-pointer">
            <Upload className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <p className="text-sm text-gray-600 mb-2">
              <span className="text-primary font-medium">Cliquez pour choisir</span> ou glissez-déposez un fichier
            </p>
            <p className="text-xs text-gray-500">
              PDF, DOC, DOCX, XLS, XLSX (max 50 MB)
            </p>
          </label>
        </div>
      )}

      {/* Fichier sélectionné */}
      {file && (
        <div className="border border-gray-200 rounded-lg p-4">
          <div className="flex items-start gap-3">
            <File className="w-10 h-10 text-primary flex-shrink-0" />
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between mb-1">
                <p className="text-sm font-medium text-gray-900 truncate">{file.name}</p>
                {uploadStatus === 'idle' && !uploading && (
                  <button
                    onClick={handleRemove}
                    className="text-gray-400 hover:text-gray-600 flex-shrink-0"
                  >
                    <X className="w-4 h-4" />
                  </button>
                )}
                {uploadStatus === 'success' && (
                  <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0" />
                )}
                {uploadStatus === 'error' && (
                  <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0" />
                )}
              </div>
              <p className="text-xs text-gray-500">{formatFileSize(file.size)}</p>

              {/* Barre de progression */}
              {uploading && (
                <div className="mt-2">
                  <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-primary transition-all duration-300"
                      style={{ width: `${uploadProgress}%` }}
                    />
                  </div>
                  <p className="text-xs text-gray-500 mt-1">{uploadProgress}%</p>
                </div>
              )}

              {/* Statuts */}
              {uploadStatus === 'success' && (
                <p className="text-xs text-green-600 mt-2">✓ Fichier uploadé avec succès</p>
              )}
              {uploadStatus === 'error' && error && (
                <p className="text-xs text-red-600 mt-2">✗ {error}</p>
              )}
            </div>
          </div>

          {/* Bouton d'upload */}
          {uploadStatus === 'idle' && !uploading && (
            <button
              onClick={handleUpload}
              className="mt-3 w-full btn-primary py-2 text-sm"
            >
              Uploader le fichier
            </button>
          )}
        </div>
      )}

      {/* Erreur globale */}
      {uploadStatus === 'error' && error && !file && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-start gap-2">
          <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
          <p className="text-sm text-red-800">{error}</p>
        </div>
      )}
    </div>
  );
}
