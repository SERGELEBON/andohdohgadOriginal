import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase/supabaseClient';

export interface CMSContent {
  id: string;
  section_key: string;
  content: Record<string, any>;
  images?: Record<string, string>;
  active: boolean;
}

export function useCMSContent(sectionKey: string) {
  const [content, setContent] = useState<CMSContent | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchContent();
  }, [sectionKey]);

  const fetchContent = async () => {
    try {
      const { data, error } = await supabase
        .from('cms_content')
        .select('*')
        .eq('section_key', sectionKey)
        .eq('active', true)
        .single();

      if (error) throw error;
      setContent(data);
    } catch (error) {
      console.error(`CMS content error for ${sectionKey}:`, error);
    } finally {
      setLoading(false);
    }
  };

  return { content, loading, refresh: fetchContent };
}
