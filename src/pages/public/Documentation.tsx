import { useState } from "react";
import { FileText, X, CheckCircle, CreditCard, Smartphone } from "lucide-react";
import PageHeader from "@/components/layout/PageHeader";
import SectionTitle from "@/components/ui/SectionTitle";
import { useDocuments, type Document } from "@/hooks/useDocuments";
import { useScrollAnimation } from "@/hooks/useScrollAnimation";

const filterMapping: Record<string, string> = {
  "Tous": "all",
  "Guides": "guides",
  "Fiscaux": "fiscaux",
  "Modeles": "modeles",
  "Notes": "notes",
};

const categoryLabels: Record<string, string> = {
  guides: "Guides",
  fiscaux: "Fiscaux",
  modeles: "Modèles",
  notes: "Notes",
};

export default function Documentation() {
  const currentLanguage = 'fr';
  
  const { documents, loading } = useDocuments(currentLanguage);
  const [activeFilter, setActiveFilter] = useState("Tous");
  const [selectedDoc, setSelectedDoc] = useState<Document | null>(null);
  const [customerName, setCustomerName] = useState("");
  const [customerEmail, setCustomerEmail] = useState("");
  const [customerPhone, setCustomerPhone] = useState("");
  const { ref, isInView } = useScrollAnimation();

  // Filtrer les documents
  const filtered = activeFilter === "Tous"
    ? documents
    : documents.filter((d) => d.doc_type === filterMapping[activeFilter]);

  const handleWhatsAppPayment = (method: "carte" | "mobile") => {
    if (!selectedDoc) return;

    const docTitle = selectedDoc.translations?.find(t => t.language === currentLanguage)?.title ||
                     selectedDoc.translations?.find(t => t.language === 'fr')?.title || 
                     "Document";
    
    const paymentMethod = method === "carte" ? "Carte bancaire" : "Mobile Money";
    
    const message = `Bonjour, je souhaite acheter le document "${docTitle}" au prix de ${selectedDoc.price?.toLocaleString()} FCFA.

*Mode de paiement souhaité :* ${paymentMethod}

*Mes informations :*
- Nom : ${customerName || "À renseigner"}
- Email : ${customerEmail || "À renseigner"}
- Téléphone : ${customerPhone || "À renseigner"}

Merci de me communiquer les instructions de paiement.`;

    const whatsappUrl = `https://wa.me/2250709577530?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, '_blank');
    
    // Fermer la modal après redirection
    setTimeout(() => {
      setSelectedDoc(null);
      setCustomerName("");
      setCustomerEmail("");
      setCustomerPhone("");
    }, 500);
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
            {Object.keys(filterMapping).map((f) => (
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

          {/* Loading state */}
          {loading ? (
            <div className="flex items-center justify-center py-20">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
            </div>
          ) : (
            /* Document Grid */
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
              {filtered.map((doc, i) => {
                const translation = doc.translations?.find(t => t.language === currentLanguage) ||
                                    doc.translations?.find(t => t.language === 'fr');
                return (
                  <div
                    key={doc.id}
                    className={`bg-white border border-gray-200 rounded-xl p-6 transition-all duration-400 hover:border-primary/40 hover:shadow-card ${isInView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}
                    style={{ transitionDelay: `${i * 80}ms` }}
                  >
                    <FileText className="w-10 h-10 text-primary mb-4" />
                    <span className="inline-block px-2.5 py-0.5 bg-primary/10 text-primary text-xs font-semibold rounded-full mb-3">
                      {categoryLabels[doc.doc_type]}
                    </span>
                    <h4 className="font-body text-base font-semibold text-dark mb-2 line-clamp-2">
                      {translation?.title || 'Sans titre'}
                    </h4>
                    <p className="text-body text-sm line-clamp-2 mb-4">
                      {translation?.description || ''}
                    </p>
                    <div className="flex items-center justify-between">
                      <span className="text-accent font-bold text-lg">{doc.price?.toLocaleString()} FCFA</span>
                      <button
                        onClick={() => setSelectedDoc(doc)}
                        className="btn-primary text-xs px-4 py-2"
                      >
                        Acheter
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </section>

      {/* Purchase Modal */}
      {selectedDoc && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/50" onClick={() => {
            setSelectedDoc(null);
            setCustomerName("");
            setCustomerEmail("");
            setCustomerPhone("");
          }} />
          <div className="relative bg-white rounded-2xl p-8 max-w-md w-full shadow-2xl z-10">
            <button onClick={() => {
              setSelectedDoc(null);
              setCustomerName("");
              setCustomerEmail("");
              setCustomerPhone("");
            }} className="absolute top-4 right-4 text-gray-400 hover:text-gray-600">
              <X className="w-5 h-5" />
            </button>

            <FileText className="w-12 h-12 text-primary mb-4" />
            <h3 className="font-display text-xl font-semibold text-dark mb-1">
              {selectedDoc.translations?.find(t => t.language === currentLanguage)?.title ||
               selectedDoc.translations?.find(t => t.language === 'fr')?.title}
            </h3>
            <p className="text-accent font-bold text-xl mb-6">{selectedDoc.price?.toLocaleString()} FCFA</p>

            <div className="space-y-3 mb-6">
              <input
                type="text"
                placeholder="Nom complet"
                value={customerName}
                onChange={(e) => setCustomerName(e.target.value)}
                className="w-full px-4 py-3 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/10"
              />
              <input
                type="email"
                placeholder="Email"
                value={customerEmail}
                onChange={(e) => setCustomerEmail(e.target.value)}
                className="w-full px-4 py-3 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/10"
              />
              <input
                type="tel"
                placeholder="Téléphone"
                value={customerPhone}
                onChange={(e) => setCustomerPhone(e.target.value)}
                className="w-full px-4 py-3 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/10"
              />
            </div>

            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
              <p className="text-sm text-blue-800">
                <strong>📱 Paiement via WhatsApp</strong><br/>
                Vous serez redirigé vers WhatsApp pour finaliser votre achat avec notre équipe.
              </p>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <button
                onClick={() => handleWhatsAppPayment("carte")}
                className="btn-primary text-xs py-3 flex items-center justify-center gap-2"
              >
                <CreditCard className="w-4 h-4" />
                Carte bancaire
              </button>
              <button
                onClick={() => handleWhatsAppPayment("mobile")}
                className="btn-secondary text-xs py-3 flex items-center justify-center gap-2"
              >
                <Smartphone className="w-4 h-4" />
                Mobile Money
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
