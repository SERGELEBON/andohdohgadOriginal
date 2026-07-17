import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase/supabaseClient';

export interface Document {
  id: string;
  doc_type: 'guides' | 'fiscaux' | 'modeles' | 'notes';
  price: number;
  file_url: string | null;
  file_name: string | null;
  file_size: number | null;
  download_count: number;
  purchase_count: number;
  status: 'draft' | 'active' | 'archived';
  created_at: string;
  updated_at: string;
  translations?: {
    language: string;
    title: string;
    description: string;
  }[];
}

export interface DocumentTranslation {
  doc_id: string;
  language: 'fr' | 'en' | 'es';
  title: string;
  description: string;
}

export function useDocuments(language: string = 'fr') {
  const [documents, setDocuments] = useState<Document[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchDocuments = async () => {
    try {
      setLoading(true);

      const { data, error: fetchError } = await supabase
        .from('documentation')
        .select(`
          *,
          translations:documentation_translations(language, title, description)
        `)
        .eq('status', 'active')
        .order('created_at', { ascending: false });

      if (fetchError) throw fetchError;

      setDocuments(data || []);
      setError(null);
    } catch (err: any) {
      console.error('Error fetching documents:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDocuments();
  }, []);

  return { documents, loading, error, refetch: fetchDocuments };
}

export function useAdminDocuments() {
  const [documents, setDocuments] = useState<Document[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchDocuments = async () => {
    try {
      setLoading(true);

      const { data, error: fetchError } = await supabase
        .from('documentation')
        .select(`
          *,
          translations:documentation_translations(language, title, description)
        `)
        .order('created_at', { ascending: false });

      if (fetchError) throw fetchError;

      setDocuments(data || []);
      setError(null);
    } catch (err: any) {
      console.error('Error fetching documents:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const createDocument = async (documentData: {
    doc_type: string;
    price: number;
    status?: string;
    file_url?: string;
    file_name?: string;
    file_size?: number;
  }, translations: DocumentTranslation[]) => {
    try {
      // 1. Créer le document
      const { data: doc, error: docError } = await supabase
        .from('documentation')
        .insert([documentData])
        .select()
        .single();

      if (docError) throw docError;

      // 2. Créer les traductions
      const translationsWithDocId = translations.map(t => ({
        ...t,
        doc_id: doc.id,
      }));

      const { error: transError } = await supabase
        .from('documentation_translations')
        .insert(translationsWithDocId);

      if (transError) throw transError;

      await fetchDocuments();
      return { success: true, data: doc };
    } catch (err: any) {
      console.error('Error creating document:', err);
      return { success: false, error: err.message };
    }
  };

  const updateDocument = async (
    id: string,
    documentData: Partial<Document>,
    translations?: DocumentTranslation[]
  ) => {
    try {
      // 1. Mettre à jour le document
      const { error: docError } = await supabase
        .from('documentation')
        .update(documentData)
        .eq('id', id);

      if (docError) throw docError;

      // 2. Mettre à jour les traductions si fournies
      if (translations) {
        for (const trans of translations) {
          await supabase
            .from('documentation_translations')
            .upsert({
              doc_id: id,
              language: trans.language,
              title: trans.title,
              description: trans.description,
            }, {
              onConflict: 'doc_id,language'
            });
        }
      }

      await fetchDocuments();
      return { success: true };
    } catch (err: any) {
      console.error('Error updating document:', err);
      return { success: false, error: err.message };
    }
  };

  const deleteDocument = async (id: string) => {
    try {
      const { error } = await supabase
        .from('documentation')
        .delete()
        .eq('id', id);

      if (error) throw error;

      await fetchDocuments();
      return { success: true };
    } catch (err: any) {
      console.error('Error deleting document:', err);
      return { success: false, error: err.message };
    }
  };

  useEffect(() => {
    fetchDocuments();
  }, []);

  return {
    documents,
    loading,
    error,
    createDocument,
    updateDocument,
    deleteDocument,
    refetch: fetchDocuments,
  };
}
