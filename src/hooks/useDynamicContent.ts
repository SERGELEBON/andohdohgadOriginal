import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase/client';

// Hook générique pour charger n'importe quelle table
export function useDynamicContent<T>(
  tableName: string,
  options: {
    orderBy?: string;
    ascending?: boolean;
    limit?: number;
    filter?: Record<string, any>;
  } = {}
) {
  const [data, setData] = useState<T[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    fetchData();
  }, [tableName]);

  const fetchData = async () => {
    try {
      setLoading(true);
      let query = supabase.from(tableName).select('*');

      // Apply filters
      if (options.filter) {
        Object.entries(options.filter).forEach(([key, value]) => {
          query = query.eq(key, value);
        });
      }

      // Apply ordering
      if (options.orderBy) {
        query = query.order(options.orderBy, { ascending: options.ascending ?? true });
      }

      // Apply limit
      if (options.limit) {
        query = query.limit(options.limit);
      }

      const { data: result, error } = await query;

      if (error) throw error;
      setData(result as T[]);
    } catch (err) {
      setError(err as Error);
      console.error(`Error fetching ${tableName}:`, err);
    } finally {
      setLoading(false);
    }
  };

  const refetch = () => fetchData();

  return { data, loading, error, refetch };
}

// Hooks spécifiques pour chaque type de contenu
export function useServices() {
  return useDynamicContent<Service>('services', {
    filter: { active: true },
    orderBy: 'display_order',
    ascending: true,
  });
}

export function useSolutions() {
  return useDynamicContent<Solution>('solutions', {
    filter: { active: true },
    orderBy: 'display_order',
    ascending: true,
  });
}

export function useTeamMembers() {
  return useDynamicContent<TeamMember>('team_members', {
    filter: { active: true },
    orderBy: 'display_order',
    ascending: true,
  });
}

export function useTestimonials() {
  return useDynamicContent<Testimonial>('testimonials', {
    filter: { active: true },
    orderBy: 'display_order',
    ascending: true,
  });
}

export function useDocumentation(category?: string) {
  return useDynamicContent<Documentation>('documentation', {
    filter: category ? { active: true, category } : { active: true },
    orderBy: 'display_order',
    ascending: true,
  });
}

export function useSiteStats() {
  return useDynamicContent<SiteStat>('site_stats', {
    filter: { active: true },
    orderBy: 'display_order',
    ascending: true,
  });
}

export function usePartners() {
  return useDynamicContent<Partner>('partners', {
    filter: { active: true },
    orderBy: 'display_order',
    ascending: true,
  });
}

export function useFAQ(category?: string) {
  return useDynamicContent<FAQ>('faq', {
    filter: category ? { active: true, category } : { active: true },
    orderBy: 'display_order',
    ascending: true,
  });
}

// Types
export interface Service {
  id: string;
  slug: string;
  title_fr: string;
  title_en?: string;
  title_es?: string;
  short_description_fr: string;
  short_description_en?: string;
  short_description_es?: string;
  long_description_fr: string;
  long_description_en?: string;
  long_description_es?: string;
  icon: string;
  features: string[];
  image_url?: string;
  active: boolean;
  display_order: number;
  created_at: string;
  updated_at: string;
}

export interface Solution {
  id: string;
  slug: string;
  title_fr: string;
  title_en?: string;
  title_es?: string;
  description_fr: string;
  description_en?: string;
  description_es?: string;
  icon: string;
  features: string[];
  image_url?: string;
  active: boolean;
  display_order: number;
  created_at: string;
  updated_at: string;
}

export interface TeamMember {
  id: string;
  name: string;
  role_fr: string;
  role_en?: string;
  role_es?: string;
  bio_fr?: string;
  bio_en?: string;
  bio_es?: string;
  image_url?: string;
  linkedin_url?: string;
  email?: string;
  active: boolean;
  display_order: number;
  created_at: string;
  updated_at: string;
}

export interface Testimonial {
  id: string;
  author_name: string;
  author_role: string;
  author_company?: string;
  author_image?: string;
  content_fr: string;
  content_en?: string;
  content_es?: string;
  rating: number;
  active: boolean;
  display_order: number;
  created_at: string;
  updated_at: string;
}

export interface Documentation {
  id: string;
  title_fr: string;
  title_en?: string;
  title_es?: string;
  description_fr: string;
  description_en?: string;
  description_es?: string;
  category: string;
  file_url: string;
  file_size?: string;
  pages?: number;
  price: number;
  preview_url?: string;
  cover_image?: string;
  active: boolean;
  downloads_count: number;
  display_order: number;
  created_at: string;
  updated_at: string;
}

export interface SiteStat {
  id: string;
  key: string;
  value_number?: number;
  value_text?: string;
  label_fr: string;
  label_en?: string;
  label_es?: string;
  icon?: string;
  active: boolean;
  display_order: number;
  updated_at: string;
}

export interface Partner {
  id: string;
  name: string;
  logo_url: string;
  website_url?: string;
  active: boolean;
  display_order: number;
  created_at: string;
}

export interface FAQ {
  id: string;
  question_fr: string;
  question_en?: string;
  question_es?: string;
  answer_fr: string;
  answer_en?: string;
  answer_es?: string;
  category?: string;
  active: boolean;
  display_order: number;
  created_at: string;
}
