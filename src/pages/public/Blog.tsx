import { useState } from "react";
import { Link } from "react-router-dom";
import { Clock, Send } from "lucide-react";
import PageHeader from "@/components/layout/PageHeader";
import { articles } from "@/data/blog";
import { useScrollAnimation } from "@/hooks/useScrollAnimation";

const categories = ["Tous", "Comptabilite", "Fiscalite", "RH", "Strategie", "Reglementation", "Entrepreneuriat"];

export default function Blog() {
  const [activeCat, setActiveCat] = useState("Tous");
  const { ref, isInView } = useScrollAnimation();

  const filtered = activeCat === "Tous" ? articles : articles.filter((a) => a.category === activeCat);

  return (
    <>
      <PageHeader
        title="Blog & Actualites"
        subtitle="Conseils, analyses et actualites pour les entrepreneurs et dirigeants d'entreprise."
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
                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${activeCat === c ? "bg-primary text-white" : "bg-white text-primary border border-primary/20 hover:bg-primary/5"}`}
                  >
                    {c}
                  </button>
                ))}
              </div>

              {/* Articles grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {filtered.map((article, i) => (
                  <Link
                    key={article.slug}
                    to={`/blog/${article.slug}`}
                    className={`group bg-white rounded-xl overflow-hidden border border-gray-100 shadow-card hover:shadow-card-hover transition-all duration-500 hover:-translate-y-1 ${isInView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}
                    style={{ transitionDelay: `${i * 100}ms` }}
                  >
                    <div className="aspect-video overflow-hidden">
                      <img src={article.image} alt={article.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                    </div>
                    <div className="p-5">
                      <span className="inline-block px-2.5 py-0.5 bg-primary/10 text-primary text-xs font-semibold rounded-full mb-2">{article.category}</span>
                      <h3 className="font-display text-base font-semibold text-dark mb-2 line-clamp-2 group-hover:text-primary transition-colors">{article.title}</h3>
                      <p className="text-body text-sm line-clamp-2 mb-3">{article.excerpt}</p>
                      <div className="flex items-center gap-3 text-xs text-muted-foreground">
                        <span>{article.date}</span>
                        <span className="flex items-center gap-1"><Clock className="w-3 h-3" />{article.readTime}</span>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </div>

            {/* Sidebar */}
            <aside className="space-y-6">
              {/* Newsletter */}
              <div className="bg-white rounded-xl p-6 shadow-card">
                <h4 className="font-body font-semibold text-dark mb-2">Newsletter</h4>
                <p className="text-body text-sm mb-4">Recevez nos derniers articles directement dans votre boite mail.</p>
                <div className="flex gap-2">
                  <input type="email" placeholder="Votre email" className="flex-1 px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-primary" />
                  <button className="btn-primary px-3 py-2"><Send className="w-4 h-4" /></button>
                </div>
              </div>

              {/* Recent articles */}
              <div className="bg-white rounded-xl p-6 shadow-card">
                <h4 className="font-body font-semibold text-dark mb-4">Articles recents</h4>
                <div className="space-y-3">
                  {articles.slice(0, 5).map((a) => (
                    <Link key={a.slug} to={`/blog/${a.slug}`} className="flex gap-3 group">
                      <img src={a.image} alt={a.title} className="w-14 h-14 rounded-lg object-cover shrink-0" />
                      <div>
                        <p className="text-sm font-medium text-dark line-clamp-2 group-hover:text-primary transition-colors">{a.title}</p>
                        <p className="text-xs text-muted-foreground mt-1">{a.date}</p>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>

              {/* Categories */}
              <div className="bg-white rounded-xl p-6 shadow-card">
                <h4 className="font-body font-semibold text-dark mb-4">Categories</h4>
                <div className="flex flex-wrap gap-2">
                  {categories.filter((c) => c !== "Tous").map((c) => (
                    <button
                      key={c}
                      onClick={() => setActiveCat(c)}
                      className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all ${activeCat === c ? "bg-primary text-white" : "bg-gray-100 text-body hover:bg-primary/10 hover:text-primary"}`}
                    >
                      {c} ({articles.filter((a) => a.category === c).length})
                    </button>
                  ))}
                </div>
              </div>
            </aside>
          </div>
        </div>
      </section>
    </>
  );
}
