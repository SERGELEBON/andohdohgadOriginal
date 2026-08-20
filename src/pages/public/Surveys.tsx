import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import emailjs from "emailjs-com";
import { Building2, Briefcase, Users, MapPin, Coffee, CheckCircle, AlertCircle, User, Mail, Phone } from "lucide-react";
import PageHeader from "@/components/layout/PageHeader";
import SectionTitle from "@/components/ui/SectionTitle";
import { useScrollAnimation } from "@/hooks/useScrollAnimation";
import { supabase } from "@/lib/supabase/supabaseClient";

// ==========================================
// TYPES & SCHEMAS
// ==========================================

type SurveyType = "creation" | "service" | "rh" | "domiciliation" | "coworking";

const surveys = [
  {
    id: "creation" as SurveyType,
    icon: Building2,
    title: "Création d'entreprise",
    desc: "Vous souhaitez créer une entreprise ? Ce formulaire nous aide à comprendre votre projet."
  },
  {
    id: "service" as SurveyType,
    icon: Briefcase,
    title: "Service spécifique",
    desc: "Décrivez votre besoin spécifique et nous vous proposerons une solution adaptée."
  },
  {
    id: "rh" as SurveyType,
    icon: Users,
    title: "Accompagnement RH",
    desc: "Vous avez des besoins en ressources humaines ? Évaluez vos problématiques avec nous."
  },
  {
    id: "domiciliation" as SurveyType,
    icon: MapPin,
    title: "Domiciliation",
    desc: "Demandez une domiciliation commerciale pour votre entreprise."
  },
  {
    id: "coworking" as SurveyType,
    icon: Coffee,
    title: "Co-working",
    desc: "Intéressé par notre espace de co-working ? Dites-nous ce dont vous avez besoin."
  },
];

// Schémas de validation Zod par type de formulaire
const creationSchema = z.object({
  // Informations personnelles
  name: z.string().min(2, "Minimum 2 caractères"),
  email: z.string().email("Email invalide"),
  phone: z.string().min(8, "Numéro de téléphone invalide"),

  // Informations entreprise
  companyName: z.string().min(2, "Nom d'entreprise requis"),
  structure: z.string().min(1, "Type de structure requis"),
  sector: z.string().min(1, "Secteur d'activité requis"),
  capital: z.string().optional(),
  partnerCount: z.string().optional(),
  employeeCount: z.string().optional(),
  registrationAddress: z.string().optional(),
  hasBusinessPlan: z.string().optional(),
  description: z.string().min(10, "Décrivez votre projet (minimum 10 caractères)"),
});

const serviceSchema = z.object({
  name: z.string().min(2, "Minimum 2 caractères"),
  email: z.string().email("Email invalide"),
  phone: z.string().min(8, "Numéro de téléphone invalide"),
  serviceType: z.string().min(1, "Type de service requis"),
  description: z.string().min(10, "Description requise (minimum 10 caractères)"),
  urgency: z.string().optional(),
  budget: z.string().optional(),
});

const rhSchema = z.object({
  name: z.string().min(2, "Minimum 2 caractères"),
  email: z.string().email("Email invalide"),
  phone: z.string().min(8, "Numéro de téléphone invalide"),
  companyName: z.string().min(2, "Nom d'entreprise requis"),
  size: z.string().min(1, "Taille de l'entreprise requise"),
  timeline: z.string().optional(),
  needType: z.string().optional(),
  message: z.string().optional(),
});

const domiciliationSchema = z.object({
  name: z.string().min(2, "Minimum 2 caractères"),
  email: z.string().email("Email invalide"),
  phone: z.string().min(8, "Numéro de téléphone invalide"),
  companyName: z.string().min(2, "Nom d'entreprise requis"),
  duration: z.string().min(1, "Durée requise"),
  type: z.string().min(1, "Type de domiciliation requis"),
  hasRCCM: z.string().optional(),
  message: z.string().optional(),
});

const coworkingSchema = z.object({
  name: z.string().min(2, "Minimum 2 caractères"),
  email: z.string().email("Email invalide"),
  phone: z.string().min(8, "Numéro de téléphone invalide"),
  frequency: z.string().min(1, "Fréquence requise"),
  spaceType: z.string().min(1, "Type d'espace requis"),
  expectedDuration: z.string().optional(),
  peopleCount: z.string().optional(),
  message: z.string().optional(),
});

type CreationFormData = z.infer<typeof creationSchema>;
type ServiceFormData = z.infer<typeof serviceSchema>;
type RhFormData = z.infer<typeof rhSchema>;
type DomiciliationFormData = z.infer<typeof domiciliationSchema>;
type CoworkingFormData = z.infer<typeof coworkingSchema>;

type FormData = CreationFormData | ServiceFormData | RhFormData | DomiciliationFormData | CoworkingFormData;

// ==========================================
// CONFIGURATION DES CHAMPS
// ==========================================

const formConfigs: Record<SurveyType, Array<{
  label: string;
  name: string;
  type: "text" | "email" | "tel" | "select" | "textarea" | "number";
  required?: boolean;
  options?: string[];
  placeholder?: string;
  icon?: any;
}>> = {
  creation: [
    {
      label: "Nom de l'entreprise",
      name: "companyName",
      type: "text",
      required: true,
      placeholder: "Ex: Andoh Consulting SARL",
      icon: Building2
    },
    {
      label: "Type de structure juridique",
      name: "structure",
      type: "select",
      required: true,
      options: ["SARL", "SAS", "Entreprise Individuelle", "SA", "GIE", "SCI", "SASU", "Autre"]
    },
    {
      label: "Secteur d'activité",
      name: "sector",
      type: "select",
      required: true,
      options: [
        "Commerce général",
        "Services aux entreprises",
        "Industrie & Manufacturing",
        "Agriculture & Agro-alimentaire",
        "Technologies & IT",
        "Immobilier & Construction",
        "Santé & Bien-être",
        "Éducation & Formation",
        "Transport & Logistique",
        "Tourisme & Hôtellerie",
        "Autre"
      ]
    },
    {
      label: "Capital social prévisionnel",
      name: "capital",
      type: "select",
      options: [
        "Moins de 1 million FCFA",
        "1 - 5 millions FCFA",
        "5 - 10 millions FCFA",
        "10 - 50 millions FCFA",
        "Plus de 50 millions FCFA",
        "Non défini"
      ]
    },
    {
      label: "Nombre d'associés prévus",
      name: "partnerCount",
      type: "select",
      options: ["1 (entreprise individuelle)", "2", "3-5", "6-10", "Plus de 10"]
    },
    {
      label: "Nombre d'employés prévus (1ère année)",
      name: "employeeCount",
      type: "select",
      options: ["0 (auto-entrepreneur)", "1-5", "6-10", "11-20", "Plus de 20"]
    },
    {
      label: "Avez-vous déjà une adresse de siège ?",
      name: "registrationAddress",
      type: "select",
      options: ["Oui, j'ai une adresse", "Non, besoin de domiciliation", "Pas encore décidé"]
    },
    {
      label: "Avez-vous un business plan ?",
      name: "hasBusinessPlan",
      type: "select",
      options: ["Oui, finalisé", "En cours d'élaboration", "Non, besoin d'aide", "Pas encore commencé"]
    },
    {
      label: "Description détaillée du projet",
      name: "description",
      type: "textarea",
      required: true,
      placeholder: "Décrivez votre activité, vos objectifs, votre marché cible, vos besoins d'accompagnement..."
    },
  ],
  service: [
    {
      label: "Type de service",
      name: "serviceType",
      type: "select",
      required: true,
      options: [
        "Comptabilité & Fiscalité",
        "Ressources Humaines",
        "Création d'entreprise",
        "Conseil Stratégique",
        "Formation professionnelle",
        "Audit & Contrôle",
        "Co-working & Domiciliation",
        "Autre"
      ]
    },
    {
      label: "Description détaillée du besoin",
      name: "description",
      type: "textarea",
      required: true,
      placeholder: "Décrivez précisément votre besoin, vos attentes et vos contraintes..."
    },
    {
      label: "Niveau d'urgence",
      name: "urgency",
      type: "select",
      options: ["Faible (plus de 3 mois)", "Moyenne (1-3 mois)", "Élevée (moins d'1 mois)", "Critique (immédiat)"]
    },
    {
      label: "Budget prévisionnel",
      name: "budget",
      type: "select",
      options: [
        "Moins de 500 000 FCFA",
        "500 000 - 1 million FCFA",
        "1 - 5 millions FCFA",
        "Plus de 5 millions FCFA",
        "À discuter"
      ]
    },
  ],
  rh: [
    {
      label: "Nom de l'entreprise",
      name: "companyName",
      type: "text",
      required: true,
      placeholder: "Nom de votre entreprise"
    },
    {
      label: "Taille de l'entreprise",
      name: "size",
      type: "select",
      required: true,
      options: ["1-5 employés", "6-20 employés", "21-50 employés", "51-200 employés", "Plus de 200 employés"]
    },
    {
      label: "Type de besoin RH",
      name: "needType",
      type: "select",
      options: [
        "Recrutement",
        "Formation du personnel",
        "Gestion de la paie",
        "Politique RH & Réglementation",
        "Gestion des conflits",
        "Audit RH",
        "Autre"
      ]
    },
    {
      label: "Délai souhaité",
      name: "timeline",
      type: "select",
      options: ["Immédiat", "1-3 mois", "3-6 mois", "Plus de 6 mois"]
    },
    {
      label: "Détails complémentaires",
      name: "message",
      type: "textarea",
      placeholder: "Précisez vos besoins, contraintes, objectifs..."
    },
  ],
  domiciliation: [
    {
      label: "Nom de l'entreprise",
      name: "companyName",
      type: "text",
      required: true,
      placeholder: "Nom de votre entreprise"
    },
    {
      label: "Durée souhaitée",
      name: "duration",
      type: "select",
      required: true,
      options: ["3 mois", "6 mois", "1 an", "2 ans", "Plus de 2 ans"]
    },
    {
      label: "Type de domiciliation",
      name: "type",
      type: "select",
      required: true,
      options: ["Commerciale uniquement", "Siège social", "Les deux (Commerciale + Siège)"]
    },
    {
      label: "Avez-vous déjà un RCCM ?",
      name: "hasRCCM",
      type: "select",
      options: ["Oui", "Non, en cours", "Non, besoin d'aide pour l'obtenir"]
    },
    {
      label: "Informations complémentaires",
      name: "message",
      type: "textarea",
      placeholder: "Services additionnels souhaités, besoins spécifiques..."
    },
  ],
  coworking: [
    {
      label: "Fréquence d'utilisation",
      name: "frequency",
      type: "select",
      required: true,
      options: ["Quotidienne (5j/semaine)", "Régulière (2-4j/semaine)", "Occasionnelle (1j/semaine)", "Ponctuelle (à la demande)"]
    },
    {
      label: "Type d'espace",
      name: "spaceType",
      type: "select",
      required: true,
      options: ["Bureau individuel", "Poste en open-space", "Salle de réunion", "Combinaison (Bureau + Salle)"]
    },
    {
      label: "Durée prévisionnelle",
      name: "expectedDuration",
      type: "select",
      options: ["1 mois (essai)", "3 mois", "6 mois", "1 an", "Indéterminée"]
    },
    {
      label: "Nombre de personnes",
      name: "peopleCount",
      type: "select",
      options: ["1 personne", "2 personnes", "3-5 personnes", "Plus de 5 personnes"]
    },
    {
      label: "Besoins et services additionnels",
      name: "message",
      type: "textarea",
      placeholder: "Wifi, imprimante, parking, services de secrétariat, autres besoins..."
    },
  ],
};

// ==========================================
// COMPOSANT PRINCIPAL
// ==========================================

export default function Surveys() {
  const [activeSurvey, setActiveSurvey] = useState<SurveyType>("creation");
  const [status, setStatus] = useState<"idle" | "submitting" | "success" | "error">("idle");
  const [errorMessage, setErrorMessage] = useState("");
  const { ref, isInView } = useScrollAnimation();

  // Déterminer le schéma en fonction du formulaire actif
  const getSchema = () => {
    switch (activeSurvey) {
      case "creation": return creationSchema;
      case "service": return serviceSchema;
      case "rh": return rhSchema;
      case "domiciliation": return domiciliationSchema;
      case "coworking": return coworkingSchema;
    }
  };

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(getSchema()),
  });

  const onSubmit = async (data: FormData) => {
    try {
      setStatus("submitting");
      setErrorMessage("");

      // 1. Essayer de sauvegarder dans Supabase (avec timeout)
      try {
        const timeoutPromise = new Promise((_, reject) =>
          setTimeout(() => reject(new Error('Supabase timeout')), 5000)
        );

        const insertPromise = supabase
          .from('surveys')
          .insert([
            {
              survey_type: activeSurvey,
              form_data: data,
              email: data.email,
              name: data.name,
              phone: data.phone,
            },
          ]);

        await Promise.race([insertPromise, timeoutPromise]);
        console.log("✅ Sauvegarde Supabase réussie");
      } catch (dbError) {
        console.warn("⚠️ Supabase indisponible, passage à EmailJS uniquement:", dbError);
        // Continuer avec EmailJS même si Supabase timeout
      }

      // 2. Envoyer email via EmailJS (prioritaire)
      const emailParams = {
        survey_type: surveys.find(s => s.id === activeSurvey)?.title,
        from_name: data.name,
        from_email: data.email,
        from_phone: data.phone,
        form_data: JSON.stringify(data, null, 2),
        to_email: 'andoh.dohgad@gmail.com',
      };

      try {
        await emailjs.send(
          import.meta.env.VITE_EMAILJS_SERVICE_ID || '',
          import.meta.env.VITE_EMAILJS_TEMPLATE_ID || '',
          emailParams,
          import.meta.env.VITE_EMAILJS_PUBLIC_KEY || ''
        );
        console.log("✅ Email envoyé avec succès");
      } catch (emailError) {
        console.error("❌ Erreur EmailJS:", emailError);
        throw new Error("Impossible d'envoyer l'email. Vérifiez votre connexion internet.");
      }

      setStatus("success");
      setTimeout(() => {
        setStatus("idle");
        reset();
      }, 5000);

    } catch (error: any) {
      console.error("❌ Erreur soumission:", error);
      setStatus("error");
      setErrorMessage(
        error.message ||
        "Erreur de connexion. Vérifiez votre internet et réessayez."
      );
    }
  };

  const currentFields = formConfigs[activeSurvey] || [];
  const activeSurveyData = surveys.find((s) => s.id === activeSurvey)!;

  return (
    <>
      <PageHeader
        title="Demande de service"
        subtitle="Remplissez le formulaire adapté à votre besoin. Nos experts analyseront votre demande et vous recontacteront sous 24h."
        breadcrumbs={[
          { label: "Accueil", href: "/" },
          { label: "Demande de service", href: "/demande-service" },
        ]}
      />

      {/* Survey Selection */}
      <section className="section-padding bg-offwhite" ref={ref}>
        <div className="container-lg">
          <SectionTitle
            label="FORMULAIRES"
            title="Choisissez votre formulaire"
          />
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {surveys.map((survey) => {
              const Icon = survey.icon;
              const isActive = activeSurvey === survey.id;
              return (
                <button
                  key={survey.id}
                  onClick={() => {
                    setActiveSurvey(survey.id);
                    setStatus("idle");
                    setErrorMessage("");
                    reset();
                  }}
                  className={`text-left bg-white rounded-xl p-6 border-2 transition-all duration-300 hover:-translate-y-1 hover:shadow-card ${
                    isActive
                      ? "border-primary shadow-card"
                      : "border-gray-100 hover:border-gray-200"
                  } ${isInView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}
                  style={{
                    transitionDelay: `${surveys.indexOf(survey) * 100}ms`,
                  }}
                >
                  <Icon
                    className={`w-10 h-10 mb-4 transition-colors ${
                      isActive ? "text-primary" : "text-body"
                    }`}
                  />
                  <h4 className="font-body font-semibold text-dark mb-2">
                    {survey.title}
                  </h4>
                  <p className="text-body text-sm leading-relaxed">
                    {survey.desc}
                  </p>
                  <span className="inline-block mt-4 text-primary text-sm font-medium">
                    {isActive ? "Sélectionné ✓" : "Commencer →"}
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      </section>

      {/* Active Form */}
      <section className="section-padding bg-white">
        <div className="container-md">
          <div className="max-w-2xl mx-auto border border-gray-200 rounded-2xl p-8 lg:p-10 shadow-sm">
            {status === "success" ? (
              <div className="text-center py-8">
                <CheckCircle className="w-20 h-20 text-emerald-500 mx-auto mb-6" />
                <h3 className="font-display text-2xl font-semibold text-dark mb-3">
                  Merci pour votre demande !
                </h3>
                <p className="text-body mb-6">
                  Votre demande concernant <strong>{activeSurveyData.title}</strong> a bien été transmise.
                  <br />
                  Nos experts analyseront votre dossier et vous recontacteront sous 24h.
                </p>
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 text-left">
                  <p className="text-sm text-blue-900 font-medium mb-2">
                    📧 Confirmation envoyée
                  </p>
                  <p className="text-xs text-blue-700">
                    Un email de confirmation vous a été envoyé. Si vous ne le recevez pas, vérifiez vos spams ou contactez-nous directement.
                  </p>
                </div>
                <button
                  onClick={() => {
                    setStatus("idle");
                    reset();
                  }}
                  className="mt-6 btn-primary"
                >
                  Nouvelle demande
                </button>
              </div>
            ) : (
              <>
                <div className="flex items-center gap-3 mb-6 pb-6 border-b border-gray-100">
                  {(() => {
                    const Icon = activeSurveyData.icon;
                    return <Icon className="w-8 h-8 text-primary" />;
                  })()}
                  <div>
                    <h3 className="font-body text-xl font-semibold text-dark">
                      {activeSurveyData.title}
                    </h3>
                    <p className="text-sm text-body">
                      Tous les champs marqués d'un * sont obligatoires
                    </p>
                  </div>
                </div>

                {status === "error" && (
                  <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-start gap-3">
                    <AlertCircle className="w-5 h-5 text-red-600 shrink-0 mt-0.5" />
                    <div>
                      <p className="text-sm font-medium text-red-800">
                        Erreur lors de l'envoi
                      </p>
                      <p className="text-xs text-red-700 mt-1">
                        {errorMessage || "Une erreur est survenue. Veuillez réessayer."}
                      </p>
                    </div>
                  </div>
                )}

                <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                  {/* Champs spécifiques au formulaire */}
                  <div className="space-y-5">
                    {currentFields.map((field) => (
                      <div key={field.name}>
                        <label className="block text-sm font-medium text-dark mb-2">
                          {field.label} {field.required && <span className="text-red-500">*</span>}
                        </label>

                        {field.type === "select" ? (
                          <select
                            {...register(field.name as any)}
                            className={`w-full px-4 py-3 border rounded-lg text-sm focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/10 transition-all ${
                              errors[field.name as keyof FormData]
                                ? "border-red-500"
                                : "border-gray-200"
                            }`}
                          >
                            <option value="">Sélectionnez...</option>
                            {field.options?.map((option) => (
                              <option key={option} value={option}>
                                {option}
                              </option>
                            ))}
                          </select>
                        ) : field.type === "textarea" ? (
                          <textarea
                            {...register(field.name as any)}
                            rows={4}
                            placeholder={field.placeholder}
                            className={`w-full px-4 py-3 border rounded-lg text-sm focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/10 resize-y transition-all ${
                              errors[field.name as keyof FormData]
                                ? "border-red-500"
                                : "border-gray-200"
                            }`}
                          />
                        ) : (
                          <input
                            type={field.type}
                            {...register(field.name as any)}
                            placeholder={field.placeholder}
                            className={`w-full px-4 py-3 border rounded-lg text-sm focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/10 transition-all ${
                              errors[field.name as keyof FormData]
                                ? "border-red-500"
                                : "border-gray-200"
                            }`}
                          />
                        )}

                        {errors[field.name as keyof FormData] && (
                          <p className="text-red-500 text-xs mt-1.5 flex items-center gap-1">
                            <AlertCircle className="w-3 h-3" />
                            {errors[field.name as keyof FormData]?.message as string}
                          </p>
                        )}
                      </div>
                    ))}
                  </div>

                  {/* Champs communs (Nom, Email, Téléphone) */}
                  <div className="pt-6 border-t border-gray-100">
                    <h4 className="text-sm font-semibold text-dark mb-4">
                      Vos coordonnées
                    </h4>
                    <div className="grid sm:grid-cols-2 gap-5">
                      <div>
                        <label className="block text-sm font-medium text-dark mb-2">
                          Nom complet <span className="text-red-500">*</span>
                        </label>
                        <div className="relative">
                          <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-body" />
                          <input
                            type="text"
                            {...register("name")}
                            placeholder="Votre nom"
                            className={`w-full pl-10 pr-4 py-3 border rounded-lg text-sm focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/10 ${
                              errors.name ? "border-red-500" : "border-gray-200"
                            }`}
                          />
                        </div>
                        {errors.name && (
                          <p className="text-red-500 text-xs mt-1.5 flex items-center gap-1">
                            <AlertCircle className="w-3 h-3" />
                            {errors.name.message}
                          </p>
                        )}
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-dark mb-2">
                          Email <span className="text-red-500">*</span>
                        </label>
                        <div className="relative">
                          <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-body" />
                          <input
                            type="email"
                            {...register("email")}
                            placeholder="votre.email@example.com"
                            className={`w-full pl-10 pr-4 py-3 border rounded-lg text-sm focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/10 ${
                              errors.email ? "border-red-500" : "border-gray-200"
                            }`}
                          />
                        </div>
                        {errors.email && (
                          <p className="text-red-500 text-xs mt-1.5 flex items-center gap-1">
                            <AlertCircle className="w-3 h-3" />
                            {errors.email.message}
                          </p>
                        )}
                      </div>
                    </div>

                    <div className="mt-5">
                      <label className="block text-sm font-medium text-dark mb-2">
                        Téléphone <span className="text-red-500">*</span>
                      </label>
                      <div className="relative">
                        <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-body" />
                        <input
                          type="tel"
                          {...register("phone")}
                          placeholder="+225 07 XX XX XX XX"
                          className={`w-full pl-10 pr-4 py-3 border rounded-lg text-sm focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/10 ${
                            errors.phone ? "border-red-500" : "border-gray-200"
                          }`}
                        />
                      </div>
                      {errors.phone && (
                        <p className="text-red-500 text-xs mt-1.5 flex items-center gap-1">
                          <AlertCircle className="w-3 h-3" />
                          {errors.phone.message}
                        </p>
                      )}
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={status === "submitting"}
                    className="btn-primary w-full disabled:opacity-60 disabled:cursor-not-allowed transition-all"
                  >
                    {status === "submitting" ? (
                      <span className="flex items-center justify-center gap-2">
                        <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                          <circle
                            className="opacity-25"
                            cx="12"
                            cy="12"
                            r="10"
                            stroke="currentColor"
                            strokeWidth="4"
                            fill="none"
                          />
                          <path
                            className="opacity-75"
                            fill="currentColor"
                            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                          />
                        </svg>
                        Envoi en cours...
                      </span>
                    ) : (
                      "Envoyer ma demande"
                    )}
                  </button>

                  <p className="text-xs text-gray-500 text-center">
                    En envoyant ce formulaire, vous acceptez d'être recontacté par Andoh & Dohgad Consulting.
                  </p>
                </form>
              </>
            )}
          </div>
        </div>
      </section>
    </>
  );
}
