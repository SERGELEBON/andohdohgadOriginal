import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Check, CheckCircle, X, UserPlus } from "lucide-react";
import PageHeader from "@/components/layout/PageHeader";
import SectionTitle from "@/components/ui/SectionTitle";
import { useScrollAnimation } from "@/hooks/useScrollAnimation";

const features = [
  "Bureaux individuels climatises",
  "Espace open-space collaboratif",
  "Salle de réunion équipée",
  "Connexion internet haut debit",
  "Cafeteria et espace detente",
  "Reception du courrier et des appels",
  "Acces 7j/7, 6h-22h",
];

const plans = [
  { name: "Nomade", price: "25 000 FCFA", period: "/mois", features: ["Acces espace commun", "WiFi haut debit", "Cafeteria", "2 jours/semaine"], featured: false },
  { name: "Resident", price: "75 000 FCFA", period: "/mois", features: ["Bureau dedie", "WiFi haut debit", "Cafeteria", "Acces illimite", "Reception courrier", "1h salle de reunion/mois"], featured: true },
  { name: "Domiciliation", price: "15 000 FCFA", period: "/mois", features: ["Adresse commerciale", "Reception courrier", "Notification arrivee", "Renouvellement annuel"], featured: false },
];

const regSchema = z.object({
  name: z.string().min(2),
  email: z.string().email(),
  phone: z.string().min(8),
  spaceType: z.string().min(1),
  plan: z.string().min(1),
  message: z.string().optional(),
});

type RegData = z.infer<typeof regSchema>;

function SpacePresentation() {
  const { ref, isInView } = useScrollAnimation();
  return (
    <section className="section-padding bg-white" ref={ref}>
      <div className="container-lg">
        <div className="grid lg:grid-cols-2 gap-10 lg:gap-16 items-center">
          <div className={`transition-all duration-700 ${isInView ? "opacity-100 -translate-x-0" : "opacity-0 -translate-x-10"}`}>
            <span className="text-xs font-semibold uppercase tracking-[2px] text-secondary mb-3 block">ESPACE DE TRAVAIL</span>
            <h2 className="font-display text-2xl lg:text-4xl font-semibold text-dark mb-6">Votre bureau au coeur d'Abidjan</h2>
            <p className="text-body leading-relaxed mb-6">
              Situe au Plateau, le quartier des affaires d'Abidjan, notre espace de co-working offre un environnement professionnel, moderne et inspirant.
            </p>
            <ul className="space-y-3">
              {features.map((f) => (
                <li key={f} className="flex items-start gap-3">
                  <Check className="w-5 h-5 text-accent shrink-0 mt-0.5" />
                  <span className="text-body">{f}</span>
                </li>
              ))}
            </ul>
          </div>
          <div className={`transition-all duration-700 delay-200 ${isInView ? "opacity-100 translate-x-0" : "opacity-0 translate-x-10"}`}>
            <img src="/images/coworking-main.jpg" alt="Espace de co-working" className="rounded-2xl shadow-xl w-full object-cover aspect-[4/3]" />
          </div>
        </div>
      </div>
    </section>
  );
}

function PricingGrid({ onSelectPlan }: { onSelectPlan: (planName: string) => void }) {
  const { ref, isInView } = useScrollAnimation();
  return (
    <section className="section-padding bg-offwhite" ref={ref}>
      <div className="container-lg">
        <SectionTitle label="NOS FORMULES" title="Choisissez la formule adaptee a vos besoins" />
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
          {plans.map((plan, i) => (
            <div key={plan.name} className={`bg-white rounded-2xl p-8 transition-all duration-500 hover:-translate-y-1 hover:shadow-card-hover relative ${plan.featured ? "border-2 border-accent shadow-lg" : "border border-gray-200"} ${isInView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"}`} style={{ transitionDelay: `${i * 120}ms` }}>
              {plan.featured && <span className="absolute -top-3 left-1/2 -translate-x-1/2 px-4 py-1 bg-accent text-dark text-xs font-bold rounded-full uppercase">Populaire</span>}
              <h3 className="font-display text-xl font-semibold text-dark text-center">{plan.name}</h3>
              <div className="text-center my-6">
                <span className="font-display text-4xl font-bold text-dark">{plan.price}</span>
                <span className="text-body text-sm"> {plan.period}</span>
              </div>
              <ul className="space-y-3 mb-8">
                {plan.features.map((f) => (
                  <li key={f} className="flex items-start gap-2 text-sm text-body"><Check className="w-4 h-4 text-accent shrink-0 mt-0.5" /><span>{f}</span></li>
                ))}
              </ul>
              <button
                onClick={() => onSelectPlan(plan.name)}
                className={`w-full py-3 rounded-lg text-sm font-semibold transition-all ${plan.featured ? "btn-primary" : "border-2 border-primary text-primary hover:bg-primary hover:text-white"}`}
              >
                Choisir cette formule
              </button>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function RegistrationModal({ isOpen, onClose, selectedPlan }: { isOpen: boolean; onClose: () => void; selectedPlan: string }) {
  const [status, setStatus] = useState<"idle" | "submitting" | "success">("idle");
  const { register, handleSubmit, formState: { errors }, setValue } = useForm<RegData>({ resolver: zodResolver(regSchema) });
  const onSubmit = () => { setStatus("submitting"); setTimeout(() => setStatus("success"), 1500); };

  // Set selected plan when component receives it
  if (selectedPlan) {
    setValue("plan", selectedPlan.toLowerCase());
  }

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white rounded-2xl p-8 lg:p-12 max-w-2xl w-full my-8 relative animate-in fade-in zoom-in duration-300">
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 w-10 h-10 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center transition-colors"
          aria-label="Fermer"
        >
          <X className="w-5 h-5 text-gray-600" />
        </button>

        {status === "success" ? (
          <div className="text-center py-6">
            <CheckCircle className="w-16 h-16 text-emerald-500 mx-auto mb-4" />
            <h3 className="font-display text-2xl font-semibold text-dark mb-3">Merci !</h3>
            <p className="text-body mb-6">Notre équipe vous contactera sous 24h pour finaliser votre inscription.</p>
            <button onClick={onClose} className="btn-primary">
              Fermer
            </button>
          </div>
        ) : (
          <>
            <div className="text-center mb-8">
              <div className="w-16 h-16 rounded-full bg-accent/20 flex items-center justify-center mx-auto mb-4">
                <UserPlus className="w-8 h-8 text-accent" />
              </div>
              <h2 className="font-display text-2xl lg:text-3xl font-semibold text-dark mb-2">Créer votre compte co-working</h2>
              <p className="text-body text-sm">Remplissez ce formulaire pour demander l'accès à notre espace.</p>
            </div>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
                <div className="grid sm:grid-cols-2 gap-5">
                  <div>
                    <label className="block text-sm font-medium text-dark mb-1.5">Nom complet *</label>
                    <input {...register("name")} className={`w-full px-4 py-3 border rounded-lg text-sm focus:outline-none focus:border-primary ${errors.name ? "border-red-500" : "border-gray-200"}`} />
                    {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name.message}</p>}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-dark mb-1.5">Email *</label>
                    <input type="email" {...register("email")} className={`w-full px-4 py-3 border rounded-lg text-sm focus:outline-none focus:border-primary ${errors.email ? "border-red-500" : "border-gray-200"}`} />
                    {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email.message}</p>}
                  </div>
                </div>
                <div className="grid sm:grid-cols-2 gap-5">
                  <div>
                    <label className="block text-sm font-medium text-dark mb-1.5">Telephone *</label>
                    <input type="tel" {...register("phone")} className={`w-full px-4 py-3 border rounded-lg text-sm focus:outline-none focus:border-primary ${errors.phone ? "border-red-500" : "border-gray-200"}`} />
                    {errors.phone && <p className="text-red-500 text-xs mt-1">{errors.phone.message}</p>}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-dark mb-1.5">Type d'espace *</label>
                    <select {...register("spaceType")} className={`w-full px-4 py-3 border rounded-lg text-sm focus:outline-none focus:border-primary ${errors.spaceType ? "border-red-500" : "border-gray-200"}`}>
                      <option value="">Selectionnez...</option>
                      <option value="individual">Bureau individuel</option>
                      <option value="open">Open-space</option>
                      <option value="meeting">Salle de reunion</option>
                    </select>
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-dark mb-1.5">Formule souhaitee *</label>
                  <select
                    {...register("plan")}
                    defaultValue={selectedPlan.toLowerCase()}
                    className={`w-full px-4 py-3 border rounded-lg text-sm focus:outline-none focus:border-primary bg-accent/5 ${errors.plan ? "border-red-500" : "border-accent/30"}`}
                  >
                    <option value="">Selectionnez...</option>
                    <option value="nomade">Nomade - 25 000 FCFA/mois</option>
                    <option value="resident">Resident - 75 000 FCFA/mois</option>
                    <option value="domiciliation">Domiciliation - 15 000 FCFA/mois</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-dark mb-1.5">Message</label>
                  <textarea {...register("message")} rows={3} placeholder="Precisez vos besoins..." className="w-full px-4 py-3 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-primary resize-y" />
                </div>
              <button type="submit" disabled={status === "submitting"} className="btn-primary w-full">{status === "submitting" ? "Envoi en cours..." : "Envoyer ma demande"}</button>
            </form>
          </>
        )}
      </div>
    </div>
  );
}

function CTASection({ onOpenModal }: { onOpenModal: () => void }) {
  return (
    <section className="section-padding bg-primary">
      <div className="container-lg text-center">
        <div className="max-w-3xl mx-auto">
          <h2 className="font-display text-2xl lg:text-4xl font-semibold text-white mb-4">
            Prêt à rejoindre notre espace de co-working ?
          </h2>
          <p className="text-white/80 text-lg mb-8">
            Créez votre compte en quelques minutes et bénéficiez d'un espace de travail professionnel au cœur d'Abidjan.
          </p>
          <button
            onClick={onOpenModal}
            className="btn-primary inline-flex items-center gap-3 text-lg px-8 py-4 bg-accent hover:bg-accent-dark text-dark font-bold shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
          >
            <UserPlus className="w-6 h-6" />
            Créer votre compte co-working
          </button>
        </div>
      </div>
    </section>
  );
}

export default function Coworking() {
  const [selectedPlan, setSelectedPlan] = useState<string>("");
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleSelectPlan = (planName: string) => {
    setSelectedPlan(planName);
    setIsModalOpen(true);
  };

  return (
    <>
      <PageHeader title="Co-working & Domiciliation" subtitle="Un espace de travail moderne et professionnel au coeur du Plateau, Abidjan." breadcrumbs={[{ label: "Accueil", href: "/" }, { label: "Co-working", href: "/co-working" }]} />
      <SpacePresentation />
      <PricingGrid onSelectPlan={handleSelectPlan} />
      <CTASection onOpenModal={() => setIsModalOpen(true)} />
      <RegistrationModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        selectedPlan={selectedPlan}
      />
    </>
  );
}
