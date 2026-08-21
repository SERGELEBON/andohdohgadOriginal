import { Link } from "react-router-dom";
import { ArrowRight, Clock } from "lucide-react";
import { articles } from "@/data/blog";
import { useScrollAnimation } from "@/hooks/useScrollAnimation";

export default function BlogPreview() {
  const { ref, isInView } = useScrollAnimation();
  const recent = articles.slice(0, 3);

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
                  src={article.image}
                  alt={article.title}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                />
              </div>
              <div className="p-6">
                <span className="text-xs font-semibold text-secondary mb-2 block">
                  {article.category}
                </span>
                <h3 className="font-display text-lg font-semibold text-dark mb-3 group-hover:text-primary transition-colors line-clamp-2">
                  {article.title}
                </h3>
                <p className="text-body text-sm leading-relaxed mb-4 line-clamp-2">
                  {article.excerpt}
                </p>
                <div className="flex items-center gap-4 text-xs text-muted-foreground">
                  <time>{article.date}</time>
                  <div className="flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    <span>{article.readTime} {"min de lecture"}</span>
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
