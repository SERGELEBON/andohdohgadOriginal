import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Clock, Send } from "lucide-react";
import PageHeader from "@/components/layout/PageHeader";
import { supabase } from "@/lib/supabase/supabaseClient";
import { useScrollAnimation } from "@/hooks/useScrollAnimation";

const categories = ["Tous", "fiscalite", "rh", "strategie", "comptabilite", "entrepreneuriat", "reglementation"];

const categoryLabels: Record<string, string> = {
  fiscalite: "Fiscalité",
  rh: "RH",
  strategie: "Stratégie",
  comptabilite: "Comptabilité",
  entrepreneuriat: "Entrepreneuriat",
  reglementation: "Réglementation",
};

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

export default function Blog() {
  const [activeCat, setActiveCat] = useState("Tous");
  const [articles, setArticles] = useState<BlogArticle[]>([]);
  const [loading, setLoading] = useState(true);
  const { ref, isInView } = useScrollAnimation();

  useEffect(() => {
    fetchArticles();
  }, []);

  const fetchArticles = async () => {
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
        .order('published_at', { ascending: false });

      if (error) throw error;

      // Map data to flatten structure
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
      console.error('Error fetching articles:', error);
    } finally {
      setLoading(false);
    }
  };

  const filtered = activeCat === "Tous"
    ? articles
    : articles.filter((a) => a.category === activeCat);

  if (loading) {
    return (
      <>
        <PageHeader
          title="Blog & Actualités"
          subtitle="Conseils, analyses et actualités pour les entrepreneurs et dirigeants d'entreprise."
          breadcrumbs={[{ label: "Accueil", href: "/" }, { label: "Blog", href: "/blog" }]}
        />
        <section className="section-padding bg-offwhite">
          <div className="container-lg flex justify-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
          </div>
        </section>
      </>
    );
  }

  return (
    <>
      <PageHeader
        title="Blog & Actualités"
        subtitle="Conseils, analyses et actualités pour les entrepreneurs et dirigeants d'entreprise."
        breadcrumbs={[{ label: "Accueil", href: "/" }, { label: "Blog", href: "/blog" }]}
      />

      <section className="section-padding bg-offwhite" ref={ref}>
        <div className="container-lg">
          <div className="grid lg:grid-cols-[1fr_320px] gap-10">
            {/* Main */}
            <div>
              {/* Category filter */}
              <div className="flex flex-wrap gap-2 mb-8">
                {categories.map((c) => (
                  <button
                    key={c}
                    onClick={() => setActiveCat(c)}
                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                      activeCat === c
                        ? "bg-primary text-white"
                        : "bg-white text-primary border border-primary/20 hover:bg-primary/5"
                    }`}
                  >
                    {c === "Tous" ? c : categoryLabels[c] || c}
                  </button>
                ))}
              </div>

              {/* Articles grid */}
              {filtered.length === 0 ? (
                <div className="text-center py-12">
                  <p className="text-gray-500">Aucun article disponible pour le moment.</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {filtered.map((article, i) => (
                    <Link
                      key={article.id}
                      to={`/blog/${article.slug}`}
                      className={`group bg-white rounded-xl overflow-hidden border border-gray-100 shadow-card hover:shadow-card-hover transition-all duration-500 hover:-translate-y-1 ${
                        isInView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
                      }`}
                      style={{ transitionDelay: `${i * 100}ms` }}
                    >
                      <div className="aspect-video overflow-hidden bg-gray-100">
                        <img
                          src={article.cover_image_url}
                          alt={article.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                          onError={(e) => {
                            (e.target as HTMLImageElement).src = '/images/blog-default.jpg';
                          }}
                        />
                      </div>
                      <div className="p-5">
                        <span className="inline-block px-2.5 py-0.5 bg-primary/10 text-primary text-xs font-semibold rounded-full mb-2">
                          {categoryLabels[article.category] || article.category}
                        </span>
                        <h3 className="font-display text-base font-semibold text-dark mb-2 line-clamp-2 group-hover:text-primary transition-colors">
                          {article.title}
                        </h3>
                        <p className="text-body text-sm line-clamp-2 mb-3">{article.excerpt}</p>
                        <div className="flex items-center gap-3 text-xs text-muted-foreground">
                          <span>{new Date(article.published_at).toLocaleDateString('fr-FR')}</span>
                          <span className="flex items-center gap-1">
                            <Clock className="w-3 h-3" />
                            {article.reading_time} min
                          </span>
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              )}
            </div>

            {/* Sidebar */}
            <aside className="space-y-6">
              {/* Newsletter */}
              <div className="bg-white rounded-xl p-6 shadow-card">
                <h4 className="font-body font-semibold text-dark mb-2">Newsletter</h4>
                <p className="text-body text-sm mb-4">
                  Recevez nos derniers articles directement dans votre boîte mail.
                </p>
                <div className="flex gap-2">
                  <input
                    type="email"
                    placeholder="Votre email"
                    className="flex-1 px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-primary"
                  />
                  <button className="btn-primary px-3 py-2">
                    <Send className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Recent articles */}
              <div className="bg-white rounded-xl p-6 shadow-card">
                <h4 className="font-body font-semibold text-dark mb-4">Articles récents</h4>
                <div className="space-y-3">
                  {articles.slice(0, 5).map((a) => (
                    <Link key={a.id} to={`/blog/${a.slug}`} className="flex gap-3 group">
                      <img
                        src={a.cover_image_url}
                        alt={a.title}
                        className="w-14 h-14 rounded-lg object-cover shrink-0"
                        onError={(e) => {
                          (e.target as HTMLImageElement).src = '/images/blog-default.jpg';
                        }}
                      />
                      <div>
                        <p className="text-sm font-medium text-dark line-clamp-2 group-hover:text-primary transition-colors">
                          {a.title}
                        </p>
                        <p className="text-xs text-muted-foreground mt-1">
                          {new Date(a.published_at).toLocaleDateString('fr-FR')}
                        </p>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>

              {/* Categories */}
              <div className="bg-white rounded-xl p-6 shadow-card">
                <h4 className="font-body font-semibold text-dark mb-4">Catégories</h4>
                <div className="flex flex-wrap gap-2">
                  {categories.filter((c) => c !== "Tous").map((c) => {
                    const count = articles.filter((a) => a.category === c).length;
                    return (
                      <button
                        key={c}
                        onClick={() => setActiveCat(c)}
                        className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all ${
                          activeCat === c
                            ? "bg-primary text-white"
                            : "bg-gray-100 text-body hover:bg-primary/10 hover:text-primary"
                        }`}
                      >
                        {categoryLabels[c] || c} ({count})
                      </button>
                    );
                  })}
                </div>
              </div>
            </aside>
          </div>
        </div>
      </section>
    </>
  );
}
