import { supabase } from './supabaseClient';

const BUCKET_NAME = 'documents';

export interface UploadResult {
  success: boolean;
  url?: string;
  fileName?: string;
  fileSize?: number;
  error?: string;
}

/**
 * Upload un fichier vers Supabase Storage
 */
export async function uploadDocument(file: File): Promise<UploadResult> {
  try {
    // Générer un nom de fichier unique
    const fileExt = file.name.split('.').pop();
    const fileName = `${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`;
    const filePath = `${fileName}`;

    // Upload du fichier
    const { data, error } = await supabase.storage
      .from(BUCKET_NAME)
      .upload(filePath, file, {
        cacheControl: '3600',
        upsert: false,
      });

    if (error) throw error;

    return {
      success: true,
      url: data.path,
      fileName: file.name,
      fileSize: file.size,
    };
  } catch (error: any) {
    console.error('Error uploading file:', error);
    return {
      success: false,
      error: error.message,
    };
  }
}

/**
 * Supprimer un fichier de Supabase Storage
 */
export async function deleteDocument(filePath: string): Promise<{ success: boolean; error?: string }> {
  try {
    const { error } = await supabase.storage
      .from(BUCKET_NAME)
      .remove([filePath]);

    if (error) throw error;

    return { success: true };
  } catch (error: any) {
    console.error('Error deleting file:', error);
    return {
      success: false,
      error: error.message,
    };
  }
}

/**
 * Générer une URL signée (valide 1h) pour télécharger un fichier
 */
export async function getSignedUrl(filePath: string): Promise<{ url: string | null; error?: string }> {
  try {
    const { data, error } = await supabase.storage
      .from(BUCKET_NAME)
      .createSignedUrl(filePath, 3600); // 1 heure

    if (error) throw error;

    return { url: data.signedUrl };
  } catch (error: any) {
    console.error('Error generating signed URL:', error);
    return {
      url: null,
      error: error.message,
    };
  }
}

/**
 * Obtenir l'URL publique d'un fichier (si le bucket est public)
 */
export function getPublicUrl(filePath: string): string {
  const { data } = supabase.storage
    .from(BUCKET_NAME)
    .getPublicUrl(filePath);

  return data.publicUrl;
}

/**
 * Vérifier si un utilisateur a acheté un document
 */
export async function hasUserPurchasedDocument(docId: string, userId: string): Promise<boolean> {
  try {
    const { data, error } = await supabase
      .from('documentation_purchases')
      .select('id')
      .eq('doc_id', docId)
      .eq('user_id', userId)
      .eq('payment_status', 'completed')
      .single();

    return !error && !!data;
  } catch (error) {
    return false;
  }
}
