import { useState } from "react";
import { FileText, X, CheckCircle } from "lucide-react";
import PageHeader from "@/components/layout/PageHeader";
import SectionTitle from "@/components/ui/SectionTitle";
import { documents } from "@/data/documentation";
import { useScrollAnimation } from "@/hooks/useScrollAnimation";

const filters = ["Tous", "Guides", "Fiscaux", "Modeles", "Notes"];

export default function Documentation() {
  const [activeFilter, setActiveFilter] = useState("Tous");
  const [selectedDoc, setSelectedDoc] = useState<typeof documents[0] | null>(null);
  const [showSuccess, setShowSuccess] = useState(false);
  const { ref, isInView } = useScrollAnimation();

  const filtered = activeFilter === "Tous" ? documents : documents.filter((d) => d.type === activeFilter);

  const handlePurchase = () => {
    setShowSuccess(true);
    setTimeout(() => {
      setShowSuccess(false);
      setSelectedDoc(null);
    }, 3000);
  };

  return (
    <>
      <PageHeader
        title="Documentation"
        subtitle="Des guides pratiques, notes fiscales et modeles professionnels elabores par nos experts."
        breadcrumbs={[{ label: "Accueil", href: "/" }, { label: "Documentation", href: "/documentation" }]}
      />

      <section className="section-padding bg-offwhite" ref={ref}>
        <div className="container-lg">
          <SectionTitle label="RESSOURCES" title="Documents et guides pratiques" />

          {/* Filter tabs */}
          <div className="flex flex-wrap gap-2 mb-10 justify-center">
            {filters.map((f) => (
              <button
                key={f}
                onClick={() => setActiveFilter(f)}
                className={`px-5 py-2 rounded-lg text-sm font-medium transition-all duration-300 ${
                  activeFilter === f
                    ? "bg-primary text-white"
                    : "bg-white text-primary border border-primary/20 hover:bg-primary/5"
                }`}
              >
                {f}
              </button>
            ))}
          </div>

          {/* Document Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {filtered.map((doc, i) => (
              <div
                key={doc.id}
                className={`bg-white border border-gray-200 rounded-xl p-6 transition-all duration-400 hover:border-primary/40 hover:shadow-card ${isInView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}
                style={{ transitionDelay: `${i * 80}ms` }}
              >
                <FileText className="w-10 h-10 text-primary mb-4" />
                <span className="inline-block px-2.5 py-0.5 bg-primary/10 text-primary text-xs font-semibold rounded-full mb-3">
                  {doc.type}
                </span>
                <h4 className="font-body text-base font-semibold text-dark mb-2 line-clamp-2">{doc.title}</h4>
                <p className="text-body text-sm line-clamp-2 mb-4">{doc.description}</p>
                <div className="flex items-center justify-between">
                  <span className="text-accent font-bold text-lg">{doc.price}</span>
                  <button
                    onClick={() => setSelectedDoc(doc)}
                    className="btn-primary text-xs px-4 py-2"
                  >
                    Acheter
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Purchase Modal */}
      {selectedDoc && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/50" onClick={() => { setSelectedDoc(null); setShowSuccess(false); }} />
          <div className="relative bg-white rounded-2xl p-8 max-w-md w-full shadow-2xl z-10">
            <button onClick={() => { setSelectedDoc(null); setShowSuccess(false); }} className="absolute top-4 right-4 text-gray-400 hover:text-gray-600">
              <X className="w-5 h-5" />
            </button>

            {!showSuccess ? (
              <>
                <FileText className="w-12 h-12 text-primary mb-4" />
                <h3 className="font-display text-xl font-semibold text-dark mb-1">{selectedDoc.title}</h3>
                <p className="text-accent font-bold text-xl mb-6">{selectedDoc.price}</p>

                <div className="space-y-3 mb-6">
                  <input type="text" placeholder="Nom complet" className="w-full px-4 py-3 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/10" />
                  <input type="email" placeholder="Email" className="w-full px-4 py-3 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/10" />
                  <input type="tel" placeholder="Telephone" className="w-full px-4 py-3 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/10" />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <button onClick={handlePurchase} className="btn-primary text-xs py-2.5">Payer par carte</button>
                  <button onClick={handlePurchase} className="btn-secondary text-xs py-2.5">Mobile Money</button>
                </div>
              </>
            ) : (
              <div className="text-center py-6">
                <CheckCircle className="w-16 h-16 text-emerald-500 mx-auto mb-4" />
                <h3 className="font-display text-xl font-semibold text-dark mb-2">Merci !</h3>
                <p className="text-body text-sm">Vous recevrez le document par email dans les prochaines minutes.</p>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
}
