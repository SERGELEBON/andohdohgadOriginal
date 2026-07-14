import { useState } from "react";
import { useForm } from "react-hook-form";
import { Building2, Briefcase, Users, MapPin, Coffee, CheckCircle } from "lucide-react";
import PageHeader from "@/components/layout/PageHeader";
import SectionTitle from "@/components/ui/SectionTitle";
import { useScrollAnimation } from "@/hooks/useScrollAnimation";

const surveys = [
  { id: "creation", icon: Building2, title: "Creation d&apos;entreprise", desc: "Vous souhaitez creer une entreprise ? Ce formulaire nous aide a comprendre votre projet." },
  { id: "service", icon: Briefcase, title: "Service specifique", desc: "Decrivez votre besoin specifique et nous vous proposerons une solution adaptee." },
  { id: "rh", icon: Users, title: "Accompagnement RH", desc: "Vous avez des besoins en ressources humaines ? Evaluez vos problematiques avec nous." },
  { id: "domiciliation", icon: MapPin, title: "Domiciliation", desc: "Demandez une domiciliation commerciale pour votre entreprise." },
  { id: "coworking", icon: Coffee, title: "Co-working", desc: "Interesse par notre espace de co-working ? Dites-nous ce dont vous avez besoin." },
];

const formConfigs: Record<string, { label: string; name: string; type: string; required?: boolean; options?: string[] }[]> = {
  creation: [
    { label: "Type de structure", name: "structure", type: "select", required: true, options: ["SARL", "SAS", "Entreprise Individuelle", "SA", "GIE", "Autre"] },
    { label: "Secteur d&apos;activite", name: "sector", type: "select", required: true, options: ["Commerce", "Services", "Industrie", "Agriculture", "Technologie", "Immobilier", "Autre"] },
    { label: "Description du projet", name: "description", type: "textarea" },
  ],
  service: [
    { label: "Type de service", name: "serviceType", type: "select", required: true, options: ["Comptabilite & Fiscalite", "Ressources Humaines", "Creation d&apos;entreprise", "Conseil Strategique", "Formation", "Co-working"] },
    { label: "Description du besoin *", name: "description", type: "textarea", required: true },
    { label: "Niveau d&apos;urgence", name: "urgency", type: "select", options: ["Faible", "Moyenne", "Elevee", "Critique"] },
  ],
  rh: [
    { label: "Taille de l&apos;entreprise", name: "size", type: "select", required: true, options: ["1-5 employes", "6-20 employes", "21-50 employes", "51-200 employes", "Plus de 200"] },
    { label: "Delai souhaite", name: "timeline", type: "select", options: [" immediat", "1-3 mois", "3-6 mois", "Plus de 6 mois"] },
    { label: "Message", name: "message", type: "textarea" },
  ],
  domiciliation: [
    { label: "Duree souhaitee", name: "duration", type: "select", required: true, options: ["3 mois", "6 mois", "1 an", "Plus d&apos;un an"] },
    { label: "Type de domiciliation", name: "type", type: "select", required: true, options: ["Commerciale", "Siege social", "Both"] },
    { label: "Nom de l&apos;entreprise", name: "companyName", type: "text" },
  ],
  coworking: [
    { label: "Frequence d&apos;utilisation", name: "frequency", type: "select", required: true, options: ["Quotidienne", "Quelques fois par semaine", "Occasionnelle"] },
    { label: "Type d&apos;espace", name: "spaceType", type: "select", required: true, options: ["Bureau individuel", "Open-space", "Salle de reunion"] },
    { label: "Duree previsionnelle", name: "expectedDuration", type: "select", options: ["1 mois", "3 mois", "6 mois", "1 an", "Indeterminee"] },
  ],
};

export default function Surveys() {
  const [activeSurvey, setActiveSurvey] = useState("creation");
  const [status, setStatus] = useState<"idle" | "submitting" | "success">("idle");
  const { register, handleSubmit, reset } = useForm();
  const { ref, isInView } = useScrollAnimation();

  const onSubmit = () => {
    setStatus("submitting");
    setTimeout(() => {
      setStatus("success");
      setTimeout(() => { setStatus("idle"); reset(); }, 3000);
    }, 1500);
  };

  const currentFields = formConfigs[activeSurvey] || [];
  const activeSurveyData = surveys.find((s) => s.id === activeSurvey)!;

  return (
    <>
      <PageHeader title="Sondages & Formulaires" subtitle="Remplissez le formulaire adapte a votre besoin. Nos experts analyseront votre demande et vous recontacteront." breadcrumbs={[{ label: "Accueil", href: "/" }, { label: "Sondages", href: "/sondages" }]} />

      {/* Survey Selection */}
      <section className="section-padding bg-offwhite" ref={ref}>
        <div className="container-lg">
          <SectionTitle label="FORMULAIRES" title="Choisissez votre formulaire" />
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {surveys.map((survey) => {
              const Icon = survey.icon;
              return (
                <button
                  key={survey.id}
                  onClick={() => { setActiveSurvey(survey.id); setStatus("idle"); }}
                  className={`text-left bg-white rounded-xl p-6 border-2 transition-all duration-300 hover:-translate-y-1 hover:shadow-card ${
                    activeSurvey === survey.id ? "border-primary shadow-card" : "border-transparent border-gray-100"
                  } ${isInView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}
                >
                  <Icon className={`w-10 h-10 mb-4 ${activeSurvey === survey.id ? "text-primary" : "text-body"}`} />
                  <h4 className="font-body font-semibold text-dark mb-2">{survey.title}</h4>
                  <p className="text-body text-sm">{survey.desc}</p>
                  <span className="inline-block mt-4 text-primary text-sm font-medium">Commencer &rarr;</span>
                </button>
              );
            })}
          </div>
        </div>
      </section>

      {/* Active Form */}
      <section className="section-padding bg-white">
        <div className="container-md">
          <div className="max-w-2xl mx-auto border border-gray-200 rounded-2xl p-8 lg:p-10">
            {status === "success" ? (
              <div className="text-center py-6">
                <CheckCircle className="w-16 h-16 text-emerald-500 mx-auto mb-4" />
                <h3 className="font-display text-xl font-semibold text-dark mb-2">Merci !</h3>
                <p className="text-body">Votre demande a bien ete transmise. Nous vous contacterons sous 24h.</p>
              </div>
            ) : (
              <>
                <div className="flex items-center gap-3 mb-6">
                  {(() => { const Icon = activeSurveyData.icon; return <Icon className="w-8 h-8 text-primary" />; })()}
                  <h3 className="font-body text-xl font-semibold text-dark">Formulaire — {activeSurveyData.title}</h3>
                </div>
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
                  {currentFields.map((field) => (
                    <div key={field.name}>
                      <label className="block text-sm font-medium text-dark mb-1.5">
                        {field.label} {field.required && "*"}
                      </label>
                      {field.type === "select" ? (
                        <select {...register(field.name, { required: field.required })} className="w-full px-4 py-3 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/10">
                          <option value="">Selectionnez...</option>
                          {field.options?.map((o) => <option key={o} value={o}>{o}</option>)}
                        </select>
                      ) : field.type === "textarea" ? (
                        <textarea {...register(field.name, { required: field.required })} rows={4} className="w-full px-4 py-3 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/10 resize-y" />
                      ) : (
                        <input type={field.type} {...register(field.name, { required: field.required })} className="w-full px-4 py-3 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/10" />
                      )}
                    </div>
                  ))}

                  {/* Common fields */}
                  <div className="grid sm:grid-cols-2 gap-5 pt-4 border-t border-gray-100">
                    <div>
                      <label className="block text-sm font-medium text-dark mb-1.5">Nom *</label>
                      <input {...register("name", { required: true })} className="w-full px-4 py-3 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-primary" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-dark mb-1.5">Email *</label>
                      <input type="email" {...register("email", { required: true })} className="w-full px-4 py-3 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-primary" />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-dark mb-1.5">Telephone *</label>
                    <input type="tel" {...register("phone", { required: true })} className="w-full px-4 py-3 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-primary" />
                  </div>

                  <button type="submit" disabled={status === "submitting"} className="btn-primary w-full">
                    {status === "submitting" ? "Envoi en cours..." : "Envoyer ma demande"}
                  </button>
                </form>
              </>
            )}
          </div>
        </div>
      </section>
    </>
  );
}
