import { useParams, Link } from "react-router-dom";
import { Seo } from "@/components/RouteSeo";
import { useEffect, useState, type ReactNode } from "react";
import { Clock, Share2, Facebook, Linkedin, Twitter } from "lucide-react";
import { supabase } from "@/lib/supabase/supabaseClient";

const categoryLabels: Record<string, string> = {
  fiscalite: "Fiscalité",
  rh: "RH",
  strategie: "Stratégie",
  comptabilite: "Comptabilité",
  entrepreneuriat: "Entrepreneuriat",
  reglementation: "Réglementation",
};

const DEFAULT_IMAGE = "/images/blog-fiscalite.jpg";
const categoryImage = (category: string) => `/images/blog-${category}.jpg`;
const AUTHOR = "Andoh & Dohgad Consulting";

interface Article {
  id: string;
  slug: string;
  category: string;
  cover_image_url: string;
  published_at: string;
  reading_time: number;
  title: string;
  excerpt: string;
  content: string;
  tags: string[];
}

interface RelatedArticle {
  slug: string;
  title: string;
  cover_image_url: string;
  published_at: string;
}

const pickFr = (translations: any[] | null | undefined) =>
  translations?.find((t) => t.language === "fr") || translations?.[0] || {};

const formatDate = (iso: string) =>
  new Date(iso).toLocaleDateString("fr-FR", { year: "numeric", month: "long", day: "numeric" });

// Rendu inline du Markdown : **gras**, *italique*, [lien](url)
function renderInline(text: string): ReactNode[] {
  const parts = text.split(/(\*\*[^*]+\*\*|\*[^*]+\*|\[[^\]]+\]\([^)]+\))/g);
  return parts.map((part, i) => {
    if (/^\*\*[^*]+\*\*$/.test(part)) return <strong key={i}>{part.slice(2, -2)}</strong>;
    if (/^\*[^*]+\*$/.test(part)) return <em key={i}>{part.slice(1, -1)}</em>;
    const link = part.match(/^\[([^\]]+)\]\(([^)]+)\)$/);
    if (link) {
      return (
        <a key={i} href={link[2]} target="_blank" rel="noopener noreferrer" className="text-primary underline">
          {link[1]}
        </a>
      );
    }
    return part;
  });
}

// Rendu des blocs Markdown : titres, listes, paragraphes
function renderMarkdown(content: string): ReactNode[] {
  return content
    .replace(/\r\n/g, "\n")
    .split(/\n\s*\n/)
    .map((block) => block.trim())
    .filter(Boolean)
    .map((block, i) => {
      if (block.startsWith("### ")) {
        return <h3 key={i} className="font-display text-xl font-semibold text-dark mt-6 mb-3">{renderInline(block.slice(4))}</h3>;
      }
      if (block.startsWith("## ")) {
        return <h2 key={i} className="font-display text-2xl font-semibold text-dark mt-8 mb-4">{renderInline(block.slice(3))}</h2>;
      }
      if (block.startsWith("# ")) {
        return <h2 key={i} className="font-display text-2xl font-semibold text-dark mt-8 mb-4">{renderInline(block.slice(2))}</h2>;
      }
      const lines = block.split("\n");
      if (lines.every((l) => /^[-*]\s+/.test(l))) {
        return (
          <ul key={i} className="list-disc pl-6 space-y-2 my-4">
            {lines.map((l, j) => <li key={j} className="text-body">{renderInline(l.replace(/^[-*]\s+/, ""))}</li>)}
          </ul>
        );
      }
      if (lines.every((l) => /^\d+\.\s+/.test(l))) {
        return (
          <ol key={i} className="list-decimal pl-6 space-y-2 my-4">
            {lines.map((l, j) => <li key={j} className="text-body">{renderInline(l.replace(/^\d+\.\s+/, ""))}</li>)}
          </ol>
        );
      }
      return (
        <p key={i} className="text-body leading-relaxed mb-4">
          {lines.map((l, j) => (
            <span key={j}>
              {renderInline(l)}
              {j < lines.length - 1 && <br />}
            </span>
          ))}
        </p>
      );
    });
}

export default function BlogPost() {
  const { slug } = useParams<{ slug: string }>();
  const [article, setArticle] = useState<Article | null>(null);
  const [related, setRelated] = useState<RelatedArticle[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;

    const fetchArticle = async () => {
      setLoading(true);
      try {
        const { data: post, error } = await supabase
          .from("blog_posts")
          .select(`
            id,
            slug,
            category,
            cover_image_url,
            published_at,
            reading_time,
            translations:blog_post_translations(language, title, excerpt, content, tags)
          `)
          .eq("slug", slug)
          .eq("status", "active")
          .not("published_at", "is", null)
          .maybeSingle();

        if (error) throw error;
        if (cancelled) return;

        if (!post) {
          setArticle(null);
          return;
        }

        const t = pickFr(post.translations);
        setArticle({
          id: post.id,
          slug: post.slug,
          category: post.category,
          cover_image_url: post.cover_image_url || categoryImage(post.category),
          published_at: post.published_at,
          reading_time: post.reading_time || 5,
          title: t.title || "Sans titre",
          excerpt: t.excerpt || "",
          content: t.content || "",
          tags: t.tags || [],
        });

        // Articles similaires (même catégorie, publiés)
        const { data: rel } = await supabase
          .from("blog_posts")
          .select(`slug, cover_image_url, published_at, translations:blog_post_translations(language, title)`)
          .eq("status", "active")
          .eq("category", post.category)
          .neq("id", post.id)
          .not("published_at", "is", null)
          .lte("published_at", new Date().toISOString())
          .order("published_at", { ascending: false })
          .limit(3);

        if (!cancelled) {
          setRelated(
            (rel || []).map((r: any) => ({
              slug: r.slug,
              title: pickFr(r.translations).title || "Sans titre",
              cover_image_url: r.cover_image_url || categoryImage(post.category),
              published_at: r.published_at,
            }))
          );
        }
      } catch (err) {
        console.error("Erreur lors du chargement de l'article:", err);
        if (!cancelled) setArticle(null);
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    fetchArticle();
    window.scrollTo(0, 0);
    return () => {
      cancelled = true;
    };
  }, [slug]);

  if (loading) {
    return (
      <section className="page-gradient pt-[140px] lg:pt-[170px] pb-24">
        <div className="container-md flex justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white"></div>
        </div>
      </section>
    );
  }

  if (!article) {
    return (
      <section className="section-padding bg-white pt-[160px]">
        <div className="container-md text-center">
          <h1 className="font-display text-2xl lg:text-3xl font-semibold text-dark mb-4">Article introuvable</h1>
          <p className="text-body mb-6">Cet article n'existe pas ou n'est plus disponible.</p>
          <Link to="/blog" className="btn-primary inline-flex">Voir tous les articles</Link>
        </div>
      </section>
    );
  }

  const shareUrl = typeof window !== "undefined" ? encodeURIComponent(window.location.href) : "";
  const shareText = encodeURIComponent(article.title);
  const categoryLabel = categoryLabels[article.category] || article.category;

  return (
    <>
      <Seo
        title={`${article.title} — Blog Andoh & Dohgad`}
        description={article.excerpt || `${article.title} — article du blog Andoh & Dohgad Consulting.`}
        image={article.cover_image_url?.startsWith("http") ? article.cover_image_url : undefined}
      />
      {/* En-tête de l'article */}
      <section className="page-gradient pt-[140px] lg:pt-[170px] pb-12 lg:pb-16">
        <div className="container-md">
          <nav className="flex flex-wrap items-center gap-2 text-white/60 text-sm mb-4">
            <Link to="/" className="hover:text-white transition-colors">Accueil</Link>
            <span>/</span>
            <Link to="/blog" className="hover:text-white transition-colors">Blog</Link>
            <span>/</span>
            <span className="text-white/80 line-clamp-1">{article.title}</span>
          </nav>
          <span className="inline-block px-3 py-1 bg-white/20 text-white text-xs font-semibold rounded-full mb-4">{categoryLabel}</span>
          <h1 className="font-display text-2xl lg:text-4xl font-bold text-white leading-tight">{article.title}</h1>
          <div className="flex flex-wrap items-center gap-4 text-white/70 text-sm mt-4">
            <span>{AUTHOR}</span>
            <span>{formatDate(article.published_at)}</span>
            <span className="flex items-center gap-1"><Clock className="w-4 h-4" />{article.reading_time} min de lecture</span>
          </div>
        </div>
      </section>

      {/* Contenu */}
      <section className="section-padding bg-white">
        <div className="container-sm">
          <img
            src={article.cover_image_url}
            alt={article.title}
            className="w-full aspect-video object-cover rounded-xl mb-8"
            onError={(e) => {
              (e.target as HTMLImageElement).src = DEFAULT_IMAGE;
            }}
          />

          {article.excerpt && (
            <p className="text-lg text-dark font-medium leading-relaxed mb-6">{article.excerpt}</p>
          )}

          <article className="max-w-none">{renderMarkdown(article.content)}</article>

          {article.tags.length > 0 && (
            <div className="flex flex-wrap gap-2 mt-8">
              {article.tags.map((tag) => (
                <span key={tag} className="px-3 py-1 bg-primary/10 text-primary text-xs font-medium rounded-full">
                  #{tag}
                </span>
              ))}
            </div>
          )}

          {/* Partage */}
          <div className="flex items-center gap-3 mt-10 pt-6 border-t border-gray-100">
            <span className="text-sm text-body flex items-center gap-2"><Share2 className="w-4 h-4" />Partager :</span>
            <a href={`https://www.facebook.com/sharer/sharer.php?u=${shareUrl}`} target="_blank" rel="noopener noreferrer" aria-label="Partager sur Facebook" className="w-9 h-9 rounded-full bg-primary/10 flex items-center justify-center hover:bg-primary hover:text-white transition-colors text-primary"><Facebook className="w-4 h-4" /></a>
            <a href={`https://www.linkedin.com/sharing/share-offsite/?url=${shareUrl}`} target="_blank" rel="noopener noreferrer" aria-label="Partager sur LinkedIn" className="w-9 h-9 rounded-full bg-primary/10 flex items-center justify-center hover:bg-primary hover:text-white transition-colors text-primary"><Linkedin className="w-4 h-4" /></a>
            <a href={`https://wa.me/?text=${shareText}%20${shareUrl}`} target="_blank" rel="noopener noreferrer" aria-label="Partager sur WhatsApp" className="w-9 h-9 rounded-full bg-primary/10 flex items-center justify-center hover:bg-primary hover:text-white transition-colors text-primary"><svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M17.47 14.38c-.3-.15-1.76-.87-2.03-.97-.27-.1-.47-.15-.67.15-.2.3-.77.97-.94 1.16-.17.2-.35.22-.64.07-.3-.15-1.26-.46-2.39-1.47-.88-.79-1.48-1.76-1.65-2.06-.17-.3-.02-.46.13-.6.13-.14.3-.35.45-.52.15-.17.2-.3.3-.5.1-.2.05-.37-.03-.52-.07-.15-.67-1.61-.92-2.2-.24-.58-.49-.5-.67-.51h-.57c-.2 0-.52.07-.79.37-.27.3-1.04 1.02-1.04 2.48s1.07 2.88 1.21 3.07c.15.2 2.1 3.2 5.08 4.49.71.3 1.26.49 1.69.63.71.22 1.36.19 1.87.12.57-.09 1.76-.72 2.01-1.41.25-.7.25-1.29.17-1.41-.07-.13-.27-.2-.57-.35M12.05 21.8h-.01a9.87 9.87 0 0 1-5.03-1.38l-.36-.21-3.74.98 1-3.65-.24-.37a9.86 9.86 0 0 1-1.51-5.26c0-5.45 4.44-9.88 9.89-9.88a9.82 9.82 0 0 1 6.99 2.9 9.83 9.83 0 0 1 2.89 6.99c0 5.45-4.44 9.88-9.88 9.88m8.41-18.3A11.82 11.82 0 0 0 12.05 0C5.5 0 .16 5.34.16 11.89c0 2.1.55 4.14 1.59 5.95L.06 24l6.3-1.65a11.88 11.88 0 0 0 5.68 1.45h.01c6.55 0 11.89-5.34 11.89-11.89 0-3.18-1.24-6.16-3.48-8.41"/></svg></a>
            <a href={`https://twitter.com/intent/tweet?url=${shareUrl}&text=${shareText}`} target="_blank" rel="noopener noreferrer" aria-label="Partager sur X" className="w-9 h-9 rounded-full bg-primary/10 flex items-center justify-center hover:bg-primary hover:text-white transition-colors text-primary"><Twitter className="w-4 h-4" /></a>
          </div>

          {/* Auteur */}
          <div className="bg-offwhite rounded-xl p-6 mt-8 flex gap-4 items-start">
            <div className="w-14 h-14 rounded-full bg-primary/20 flex items-center justify-center shrink-0">
              <span className="text-primary font-display font-bold text-lg">A</span>
            </div>
            <div>
              <h4 className="font-semibold text-dark">{AUTHOR}</h4>
              <p className="text-sm text-body mt-1">Cabinet de conseil qui accompagne les entrepreneurs ivoiriens dans la structuration, la gestion et la croissance de leurs entreprises.</p>
            </div>
          </div>

          {/* Articles similaires */}
          {related.length > 0 && (
            <div className="mt-12">
              <h3 className="font-display text-xl font-semibold text-dark mb-6">Articles similaires</h3>
              <div className="space-y-4">
                {related.map((a) => (
                  <Link key={a.slug} to={`/blog/${a.slug}`} className="flex gap-4 group">
                    <img
                      src={a.cover_image_url}
                      alt={a.title}
                      className="w-20 h-16 rounded-lg object-cover shrink-0"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = DEFAULT_IMAGE;
                      }}
                    />
                    <div>
                      <p className="font-medium text-dark group-hover:text-primary transition-colors line-clamp-2">{a.title}</p>
                      <p className="text-xs text-muted-foreground mt-1">{formatDate(a.published_at)}</p>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          )}
        </div>
      </section>
    </>
  );
}
