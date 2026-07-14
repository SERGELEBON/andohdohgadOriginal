import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { supabase } from '@/lib/supabase/client';
import AdminLayout from '@/components/layout/AdminLayout';
import ImageUpload from '@/components/admin/ImageUpload';
import { Save, ArrowLeft, Eye } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';

interface BlogForm {
  slug: string;
  category: 'fiscalite' | 'rh' | 'strategie' | 'comptabilite' | 'entrepreneuriat' | 'reglementation';
  cover_image_url: string;
  status: 'draft' | 'active';
  reading_time: number;

  // Traductions
  title_fr: string;
  title_en: string;
  title_es: string;
  excerpt_fr: string;
  excerpt_en: string;
  excerpt_es: string;
  content_fr: string;
  content_en: string;
  content_es: string;
  tags_fr: string[];
  tags_en: string[];
  tags_es: string[];
}

export default function BlogEditor() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { profile } = useAuth();
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState<BlogForm>({
    slug: '',
    category: 'fiscalite',
    cover_image_url: '',
    status: 'draft',
    reading_time: 5,
    title_fr: '',
    title_en: '',
    title_es: '',
    excerpt_fr: '',
    excerpt_en: '',
    excerpt_es: '',
    content_fr: '',
    content_en: '',
    content_es: '',
    tags_fr: [],
    tags_en: [],
    tags_es: [],
  });

  useEffect(() => {
    if (id) {
      fetchPost();
    }
  }, [id]);

  const fetchPost = async () => {
    try {
      // Fetch post with all translations
      const { data: post, error: postError } = await supabase
        .from('blog_posts')
        .select('*')
        .eq('id', id)
        .single();

      if (postError) throw postError;

      // Fetch translations
      const { data: translations, error: transError } = await supabase
        .from('blog_post_translations')
        .select('*')
        .eq('post_id', id);

      if (transError) throw transError;

      // Map translations to form
      const frTrans = translations?.find(t => t.language === 'fr');
      const enTrans = translations?.find(t => t.language === 'en');
      const esTrans = translations?.find(t => t.language === 'es');

      setForm({
        slug: post.slug,
        category: post.category,
        cover_image_url: post.cover_image_url || '',
        status: post.status,
        reading_time: post.reading_time || 5,
        title_fr: frTrans?.title || '',
        title_en: enTrans?.title || '',
        title_es: esTrans?.title || '',
        excerpt_fr: frTrans?.excerpt || '',
        excerpt_en: enTrans?.excerpt || '',
        excerpt_es: esTrans?.excerpt || '',
        content_fr: frTrans?.content || '',
        content_en: enTrans?.content || '',
        content_es: esTrans?.content || '',
        tags_fr: frTrans?.tags || [],
        tags_en: enTrans?.tags || [],
        tags_es: esTrans?.tags || [],
      });
    } catch (error) {
      console.error('Error fetching post:', error);
      alert('Erreur lors du chargement de l\'article');
    }
  };

  const generateSlug = (title: string) => {
    return title
      .toLowerCase()
      .normalize('NFD')
      .replace(/[̀-ͯ]/g, '')
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '');
  };

  const handleTitleChange = (value: string) => {
    setForm({
      ...form,
      title_fr: value,
      slug: generateSlug(value),
    });
  };

  const calculateReadingTime = (content: string): number => {
    const wordsPerMinute = 200;
    const wordCount = content.trim().split(/\s+/).length;
    return Math.max(1, Math.ceil(wordCount / wordsPerMinute));
  };

  const handleSave = async (publish: boolean = false) => {
    if (!form.title_fr || !form.content_fr) {
      alert('Le titre et le contenu français sont obligatoires');
      return;
    }

    setLoading(true);
    try {
      const readingTime = calculateReadingTime(form.content_fr);
      const status = publish ? 'active' : 'draft';

      const postData = {
        slug: form.slug,
        category: form.category,
        cover_image_url: form.cover_image_url || null,
        status,
        reading_time: readingTime,
        author_id: profile?.id,
        published_at: publish ? new Date().toISOString() : null,
      };

      let postId = id;

      if (id) {
        // Update existing post
        const { error } = await supabase
          .from('blog_posts')
          .update(postData)
          .eq('id', id);

        if (error) throw error;
      } else {
        // Create new post
        const { data, error } = await supabase
          .from('blog_posts')
          .insert([postData])
          .select()
          .single();

        if (error) throw error;
        postId = data.id;
      }

      // Upsert translations
      const translations = [
        {
          post_id: postId,
          language: 'fr',
          title: form.title_fr,
          excerpt: form.excerpt_fr,
          content: form.content_fr,
          tags: form.tags_fr,
        },
        {
          post_id: postId,
          language: 'en',
          title: form.title_en || form.title_fr,
          excerpt: form.excerpt_en || form.excerpt_fr,
          content: form.content_en || form.content_fr,
          tags: form.tags_en,
        },
        {
          post_id: postId,
          language: 'es',
          title: form.title_es || form.title_fr,
          excerpt: form.excerpt_es || form.excerpt_fr,
          content: form.content_es || form.content_fr,
          tags: form.tags_es,
        },
      ];

      for (const trans of translations) {
        const { error } = await supabase
          .from('blog_post_translations')
          .upsert(trans, { onConflict: 'post_id,language' });

        if (error) throw error;
      }

      alert(id ? 'Article mis à jour avec succès' : 'Article créé avec succès');
      if (!id) {
        navigate('/admin/blog');
      }
    } catch (error: any) {
      console.error('Error saving post:', error);
      alert(`Erreur lors de l'enregistrement: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <AdminLayout>
      <div className="p-6 lg:p-8">
        {/* Header */}
        <div className="mb-8 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button
              onClick={() => navigate('/admin/blog')}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
            <div>
              <h1 className="text-2xl font-bold text-dark">
                {id ? 'Éditer l\'article' : 'Nouvel article'}
              </h1>
              <p className="text-gray-600">
                {form.slug && `/${form.slug}`}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => handleSave(false)}
              disabled={loading}
              className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50"
            >
              <Save className="w-4 h-4 inline mr-2" />
              Enregistrer brouillon
            </button>
            <button
              onClick={() => handleSave(true)}
              disabled={loading}
              className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors disabled:opacity-50"
            >
              <Eye className="w-4 h-4 inline mr-2" />
              Publier
            </button>
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Français */}
            <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
              <h2 className="text-lg font-semibold text-dark mb-4">🇫🇷 Français</h2>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Titre *
                  </label>
                  <input
                    type="text"
                    value={form.title_fr}
                    onChange={(e) => handleTitleChange(e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                    placeholder="Titre de l'article"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Extrait
                  </label>
                  <textarea
                    value={form.excerpt_fr}
                    onChange={(e) => setForm({ ...form, excerpt_fr: e.target.value })}
                    rows={3}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                    placeholder="Résumé court de l'article"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Contenu * (Markdown)
                  </label>
                  <textarea
                    value={form.content_fr}
                    onChange={(e) => setForm({ ...form, content_fr: e.target.value })}
                    rows={20}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent font-mono text-sm"
                    placeholder="Contenu de l'article (Markdown supporté)"
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    Temps de lecture estimé : {calculateReadingTime(form.content_fr)} min
                  </p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Tags (séparés par des virgules)
                  </label>
                  <input
                    type="text"
                    value={form.tags_fr.join(', ')}
                    onChange={(e) => setForm({ ...form, tags_fr: e.target.value.split(',').map(t => t.trim()).filter(Boolean) })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                    placeholder="fiscalité, PME, Côte d'Ivoire"
                  />
                </div>
              </div>
            </div>

            {/* Anglais */}
            <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
              <h2 className="text-lg font-semibold text-dark mb-4">🇬🇧 English (optionnel)</h2>

              <div className="space-y-4">
                <input
                  type="text"
                  value={form.title_en}
                  onChange={(e) => setForm({ ...form, title_en: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                  placeholder="Title"
                />
                <textarea
                  value={form.excerpt_en}
                  onChange={(e) => setForm({ ...form, excerpt_en: e.target.value })}
                  rows={3}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                  placeholder="Excerpt"
                />
                <textarea
                  value={form.content_en}
                  onChange={(e) => setForm({ ...form, content_en: e.target.value })}
                  rows={15}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg font-mono text-sm"
                  placeholder="Content (Markdown)"
                />
                <input
                  type="text"
                  value={form.tags_en.join(', ')}
                  onChange={(e) => setForm({ ...form, tags_en: e.target.value.split(',').map(t => t.trim()).filter(Boolean) })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                  placeholder="Tags (comma separated)"
                />
              </div>
            </div>

            {/* Espagnol */}
            <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
              <h2 className="text-lg font-semibold text-dark mb-4">🇪🇸 Español (opcional)</h2>

              <div className="space-y-4">
                <input
                  type="text"
                  value={form.title_es}
                  onChange={(e) => setForm({ ...form, title_es: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                  placeholder="Título"
                />
                <textarea
                  value={form.excerpt_es}
                  onChange={(e) => setForm({ ...form, excerpt_es: e.target.value })}
                  rows={3}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                  placeholder="Extracto"
                />
                <textarea
                  value={form.content_es}
                  onChange={(e) => setForm({ ...form, content_es: e.target.value })}
                  rows={15}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg font-mono text-sm"
                  placeholder="Contenido (Markdown)"
                />
                <input
                  type="text"
                  value={form.tags_es.join(', ')}
                  onChange={(e) => setForm({ ...form, tags_es: e.target.value.split(',').map(t => t.trim()).filter(Boolean) })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                  placeholder="Etiquetas (separadas por comas)"
                />
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Paramètres */}
            <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
              <h3 className="font-semibold text-dark mb-4">Paramètres</h3>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Slug
                  </label>
                  <input
                    type="text"
                    value={form.slug}
                    onChange={(e) => setForm({ ...form, slug: e.target.value })}
                    className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Catégorie
                  </label>
                  <select
                    value={form.category}
                    onChange={(e) => setForm({ ...form, category: e.target.value as any })}
                    className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg"
                  >
                    <option value="fiscalite">Fiscalité</option>
                    <option value="rh">Ressources Humaines</option>
                    <option value="strategie">Stratégie</option>
                    <option value="comptabilite">Comptabilité</option>
                    <option value="entrepreneuriat">Entrepreneuriat</option>
                    <option value="reglementation">Réglementation</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Statut
                  </label>
                  <select
                    value={form.status}
                    onChange={(e) => setForm({ ...form, status: e.target.value as any })}
                    className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg"
                  >
                    <option value="draft">Brouillon</option>
                    <option value="active">Publié</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Image */}
            <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
              <h3 className="font-semibold text-dark mb-4">Image à la une</h3>

              <ImageUpload
                currentImageUrl={form.cover_image_url}
                onImageUploaded={(url) => setForm({ ...form, cover_image_url: url })}
                bucket="blog-images"
                maxSizeMB={5}
              />

              {/* URL manuelle (optionnel) */}
              <div className="mt-4 pt-4 border-t border-gray-200">
                <label className="block text-xs text-gray-600 mb-2">
                  Ou coller une URL d'image :
                </label>
                <input
                  type="text"
                  value={form.cover_image_url}
                  onChange={(e) => setForm({ ...form, cover_image_url: e.target.value })}
                  className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg"
                  placeholder="https://..."
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}
