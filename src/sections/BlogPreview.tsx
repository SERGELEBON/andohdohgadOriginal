import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { ArrowRight, Clock } from "lucide-react";
import { supabase } from "@/lib/supabase/supabaseClient";
import { useScrollAnimation } from "@/hooks/useScrollAnimation";

interface BlogArticle {
  id: string;
  slug: string;
  category: string;
  cover_image_url: string;
  published_at: string;
  reading_time: number;
  title: string;
  excerpt: string;
}

export default function BlogPreview() {
  const { ref, isInView } = useScrollAnimation();
  const [articles, setArticles] = useState<BlogArticle[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchRecentArticles();
  }, []);

  const fetchRecentArticles = async () => {
    try {
      const { data, error } = await supabase
        .from('blog_posts')
        .select(`
          id,
          slug,
          category,
          cover_image_url,
          published_at,
          reading_time,
          translations:blog_post_translations!inner(title, excerpt)
        `)
        .eq('status', 'active')
        .eq('blog_post_translations.language', 'fr')
        .not('published_at', 'is', null)
        .lte('published_at', new Date().toISOString())
        .order('published_at', { ascending: false })
        .limit(3);

      if (error) throw error;

      const mappedArticles = (data || []).map((post: any) => ({
        id: post.id,
        slug: post.slug,
        category: post.category,
        cover_image_url: post.cover_image_url || '/images/blog-default.jpg',
        published_at: post.published_at,
        reading_time: post.reading_time || 5,
        title: post.translations?.[0]?.title || 'Sans titre',
        excerpt: post.translations?.[0]?.excerpt || '',
      }));

      setArticles(mappedArticles);
    } catch (error) {
      console.error('Error fetching recent articles:', error);
    } finally {
      setLoading(false);
    }
  };

  const recent = articles;

  if (loading) {
    return (
      <section className="section-padding bg-white">
        <div className="container-lg flex justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
        </div>
      </section>
    );
  }

  if (recent.length === 0) {
    return null; // Ne rien afficher s'il n'y a pas d'articles
  }

  return (
    <section className="section-padding bg-white" ref={ref}>
      <div className="container-lg">
        <div className="flex flex-col sm:flex-row items-start sm:items-end justify-between gap-4 mb-12 lg:mb-16">
          <div>
            <span className="text-xs font-semibold uppercase tracking-[2px] text-secondary mb-3 block">
              {"NOTRE BLOG"}
            </span>
            <h2 className="font-display text-2xl lg:text-4xl font-semibold text-dark">
              {"Dernières actualités et conseils"}
            </h2>
            <span className="gold-underline" />
          </div>
          <Link to="/blog" className="text-link shrink-0">
            {"Voir tous les articles"}
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
          {recent.map((article, i) => (
            <Link
              key={article.slug}
              to={`/blog/${article.slug}`}
              className={`group block bg-white rounded-xl overflow-hidden border border-gray-100 shadow-card hover:shadow-card-hover transition-all duration-500 hover:-translate-y-1 ${
                isInView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
              }`}
              style={{ transitionDelay: `${i * 120}ms` }}
            >
              <div className="aspect-video overflow-hidden">
                <img
                  src={article.cover_image_url}
                  alt={article.title}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                />
              </div>
              <div className="p-6">
                <span className="text-xs font-semibold text-secondary mb-2 block uppercase">
                  {article.category}
                </span>
                <h3 className="font-display text-lg font-semibold text-dark mb-3 group-hover:text-primary transition-colors line-clamp-2">
                  {article.title}
                </h3>
                <p className="text-body text-sm leading-relaxed mb-4 line-clamp-2">
                  {article.excerpt}
                </p>
                <div className="flex items-center gap-4 text-xs text-muted-foreground">
                  <time>{new Date(article.published_at).toLocaleDateString('fr-FR', { year: 'numeric', month: 'long', day: 'numeric' })}</time>
                  <div className="flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    <span>{article.reading_time} min de lecture</span>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
