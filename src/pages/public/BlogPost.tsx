import { useParams, useNavigate, Link } from "react-router-dom";
import { useEffect } from "react";
import { Clock, Share2, Facebook, Linkedin, Twitter } from "lucide-react";
import { articles } from "@/data/blog";
import { useScrollAnimation } from "@/hooks/useScrollAnimation";

export default function BlogPost() {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const article = articles.find((a) => a.slug === slug);
  const { ref, isInView } = useScrollAnimation();

  useEffect(() => {
    if (!article) navigate("/blog");
  }, [article, navigate]);

  if (!article) return null;

  const related = articles.filter((a) => a.slug !== slug && a.category === article.category).slice(0, 3);

  return (
    <>
      {/* Article Header */}
      <section className="page-gradient pt-[140px] lg:pt-[170px] pb-12 lg:pb-16">
        <div className="container-md">
          <nav className="flex items-center gap-2 text-white/60 text-sm mb-4">
            <Link to="/" className="hover:text-white transition-colors">Accueil</Link>
            <span>/</span>
            <Link to="/blog" className="hover:text-white transition-colors">Blog</Link>
            <span>/</span>
            <span className="text-white/80">{article.title}</span>
          </nav>
          <span className="inline-block px-3 py-1 bg-white/20 text-white text-xs font-semibold rounded-full mb-4">{article.category}</span>
          <h1 className="font-display text-2xl lg:text-4xl font-bold text-white leading-tight">{article.title}</h1>
          <div className="flex items-center gap-4 text-white/70 text-sm mt-4">
            <span>{article.author}</span>
            <span>{article.date}</span>
            <span className="flex items-center gap-1"><Clock className="w-4 h-4" />{article.readTime}</span>
          </div>
        </div>
      </section>

      {/* Article Content */}
      <section className="section-padding bg-white" ref={ref}>
        <div className="container-sm">
          <div className={`transition-all duration-700 ${isInView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}>
            <img src={article.image} alt={article.title} className="w-full aspect-video object-cover rounded-xl mb-8" />

            <article className="prose prose-lg max-w-none">
              {article.content.split("\n\n").map((paragraph, i) => {
                if (paragraph.startsWith("## ")) {
                  return <h2 key={i} className="font-display text-2xl font-semibold text-dark mt-8 mb-4">{paragraph.replace("## ", "")}</h2>;
                }
                if (paragraph.startsWith("- ")) {
                  return (
                    <ul key={i} className="list-disc pl-6 space-y-2 my-4">
                      {paragraph.split("\n").map((item, j) => (
                        <li key={j} className="text-body">{item.replace("- ", "")}</li>
                      ))}
                    </ul>
                  );
                }
                if (paragraph.match(/^\d+\./)) {
                  return (
                    <ol key={i} className="list-decimal pl-6 space-y-2 my-4">
                      {paragraph.split("\n").map((item, j) => (
                        <li key={j} className="text-body">{item.replace(/^\d+\.\s*/, "")}</li>
                      ))}
                    </ol>
                  );
                }
                return <p key={i} className="text-body leading-relaxed mb-4">{paragraph}</p>;
              })}
            </article>

            {/* Share buttons */}
            <div className="flex items-center gap-3 mt-10 pt-6 border-t border-gray-100">
              <span className="text-sm text-body flex items-center gap-2"><Share2 className="w-4 h-4" />Partager :</span>
              <button className="w-9 h-9 rounded-full bg-primary/10 flex items-center justify-center hover:bg-primary hover:text-white transition-colors text-primary"><Facebook className="w-4 h-4" /></button>
              <button className="w-9 h-9 rounded-full bg-primary/10 flex items-center justify-center hover:bg-primary hover:text-white transition-colors text-primary"><Linkedin className="w-4 h-4" /></button>
              <button className="w-9 h-9 rounded-full bg-primary/10 flex items-center justify-center hover:bg-primary hover:text-white transition-colors text-primary"><Twitter className="w-4 h-4" /></button>
            </div>

            {/* Author bio */}
            <div className="bg-offwhite rounded-xl p-6 mt-8 flex gap-4 items-start">
              <div className="w-14 h-14 rounded-full bg-primary/20 flex items-center justify-center shrink-0">
                <span className="text-primary font-display font-bold text-lg">{article.author.charAt(0)}</span>
              </div>
              <div>
                <h4 className="font-semibold text-dark">{article.author}</h4>
                <p className="text-sm text-body mt-1">Expert chez Andoh & Dohgad Consulting, passionne par l&apos;accompagnement des entreprises africaines.</p>
              </div>
            </div>

            {/* Related articles */}
            {related.length > 0 && (
              <div className="mt-12">
                <h3 className="font-display text-xl font-semibold text-dark mb-6">Articles similaires</h3>
                <div className="space-y-4">
                  {related.map((a) => (
                    <Link key={a.slug} to={`/blog/${a.slug}`} className="flex gap-4 group">
                      <img src={a.image} alt={a.title} className="w-20 h-16 rounded-lg object-cover shrink-0" />
                      <div>
                        <p className="font-medium text-dark group-hover:text-primary transition-colors line-clamp-2">{a.title}</p>
                        <p className="text-xs text-muted-foreground mt-1">{a.date}</p>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </section>
    </>
  );
}
