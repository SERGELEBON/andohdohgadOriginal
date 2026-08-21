import { useState, useEffect, useRef } from "react";
import { useSearchParams } from "react-router-dom";
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
// MAPPING SERVICE SLUG -> SURVEY TYPE
// ==========================================
const serviceToSurveyMap: Record<string, SurveyType> = {
  "creation-entreprise": "creation",
  "ressources-humaines": "rh",
  "coworking-domiciliation": "domiciliation",
  "comptable-fiscal": "service",
  "conseil-strategique": "service",
  "formation": "service",
};

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

// Schemas de validation Zod (inchangés)
const creationSchema = z.object({
  name: z.string().min(1, "Nom requis"),
  email: z.string().email("Email invalide"),
  phone: z.string().min(8, "Numéro invalide"),
  companyName: z.string().min(2, "Nom de l'entreprise requis"),
  structure: z.string().min(1, "Type de structure requis"),
  sector: z.string().min(2, "Secteur d'activité requis"),
  capital: z.string().min(1, "Capital requis"),
  partnerCount: z.string().min(1, "Nombre d'associés requis"),
  employeeCount: z.string().min(1, "Nombre d'employés requis"),
  registrationAddress: z.string().min(5, "Adresse de domiciliation requise"),
  hasBusinessPlan: z.string().min(1, "Réponse requise"),
  description: z.string().min(20, "Description trop courte (min 20 caractères)"),
});

const serviceSchema = z.object({
  name: z.string().min(1, "Nom requis"),
  email: z.string().email("Email invalide"),
  phone: z.string().min(8, "Numéro invalide"),
  company: z.string().min(2, "Nom de l'entreprise requis"),
  serviceType: z.string().min(1, "Type de service requis"),
  urgency: z.string().min(1, "Niveau d'urgence requis"),
  budget: z.string().min(1, "Budget requis"),
  description: z.string().min(20, "Description trop courte (min 20 caractères)"),
});

const rhSchema = z.object({
  name: z.string().min(1, "Nom requis"),
  email: z.string().email("Email invalide"),
  phone: z.string().min(8, "Numéro invalide"),
  company: z.string().min(2, "Nom de l'entreprise requis"),
  employeeCount: z.string().min(1, "Nombre d'employés requis"),
  rhNeed: z.string().min(1, "Besoin RH requis"),
  urgency: z.string().min(1, "Niveau d'urgence requis"),
  description: z.string().min(20, "Description trop courte (min 20 caractères)"),
});

const domiciliationSchema = z.object({
  name: z.string().min(1, "Nom requis"),
  email: z.string().email("Email invalide"),
  phone: z.string().min(8, "Numéro invalide"),
  companyName: z.string().min(2, "Nom de l'entreprise requis"),
  structure: z.string().min(1, "Type de structure requis"),
  duration: z.string().min(1, "Durée requise"),
  additionalServices: z.string().optional(),
  description: z.string().min(20, "Description trop courte (min 20 caractères)"),
});

const coworkingSchema = z.object({
  name: z.string().min(1, "Nom requis"),
  email: z.string().email("Email invalide"),
  phone: z.string().min(8, "Numéro invalide"),
  spaceType: z.string().min(1, "Type d'espace requis"),
  duration: z.string().min(1, "Durée requise"),
  peopleCount: z.string().min(1, "Nombre de personnes requis"),
  equipmentNeeds: z.string().optional(),
  description: z.string().min(20, "Description trop courte (min 20 caractères)"),
});

type CreationFormData = z.infer<typeof creationSchema>;
type ServiceFormData = z.infer<typeof serviceSchema>;
type RHFormData = z.infer<typeof rhSchema>;
type DomiciliationFormData = z.infer<typeof domiciliationSchema>;
type CoworkingFormData = z.infer<typeof coworkingSchema>;
type FormData = CreationFormData | ServiceFormData | RHFormData | DomiciliationFormData | CoworkingFormData;

type SubmissionStatus = "idle" | "submitting" | "success" | "error";

export default function Surveys() {
  const [searchParams] = useSearchParams();
  const formRef = useRef<HTMLDivElement>(null);
  const [activeSurvey, setActiveSurvey] = useState<SurveyType>("creation");
  const [status, setStatus] = useState<SubmissionStatus>("idle");
  const [errorMessage, setErrorMessage] = useState("");
  const { ref, isInView } = useScrollAnimation();

  // Auto-select survey based on URL param
  useEffect(() => {
    const serviceSlug = searchParams.get("service");
    if (serviceSlug && serviceToSurveyMap[serviceSlug]) {
      setActiveSurvey(serviceToSurveyMap[serviceSlug]);
      
      // Auto-scroll to form after a short delay
      setTimeout(() => {
        formRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
      }, 300);
    }
  }, [searchParams]);

  const currentSchema =
    activeSurvey === "creation" ? creationSchema :
    activeSurvey === "service" ? serviceSchema :
    activeSurvey === "rh" ? rhSchema :
    activeSurvey === "domiciliation" ? domiciliationSchema :
    coworkingSchema;

  const { register, handleSubmit, formState: { errors }, reset } = useForm<FormData>({
    resolver: zodResolver(currentSchema),
  });

  const onSubmit = async (data: FormData) => {
    setStatus("submitting");
    setErrorMessage("");

    try {
      const timeoutPromise = new Promise((_, reject) =>
        setTimeout(() => reject(new Error("Supabase timeout")), 5000)
      );

      const insertPromise = supabase.from("surveys").insert([
        {
          survey_type: activeSurvey,
          form_data: data,
          email: data.email,
          name: data.name,
          phone: data.phone,
          status: "pending",
        },
      ]);

      try {
        await Promise.race([insertPromise, timeoutPromise]);
        console.log("✅ Données enregistrées dans Supabase");
      } catch (supabaseError) {
        console.warn("Supabase submission failed/timeout, continuing with EmailJS:", supabaseError);
      }

      // Tentative d'envoi EmailJS (non-bloquant, optionnel)
      try {
        await emailjs.send(
          "service_fqsdqil",
          "template_rq4a5uc",
          {
            survey_type: activeSurvey,
            to_email: "andoh.dohgad@gmail.com",
            ...data,
          },
          "sFZh4sYFqQ3rh0nDd"
        );
        console.log("✅ Email de notification envoyé");
      } catch (emailError) {
        console.warn("⚠️ EmailJS failed (non-critical):", emailError);
      }

      setStatus("success");
      reset();

      setTimeout(() => {
        setStatus("idle");
      }, 5000);
    } catch (error) {
      console.error("Submission error:", error);
      setStatus("error");
      setErrorMessage(
        "Une erreur est survenue lors de l'envoi. Veuillez réessayer ou nous contacter directement."
      );
    }
  };

  const currentFields = 
    activeSurvey === "creation" ? [
      { name: "name", label: "Votre nom complet", type: "text", required: true, placeholder: "Ex: Jean Kouassi" },
      { name: "email", label: "Votre email", type: "email", required: true, placeholder: "Ex: jean@example.com" },
      { name: "phone", label: "Votre téléphone", type: "tel", required: true, placeholder: "Ex: +225 07 XX XX XX XX" },
      { name: "companyName", label: "Nom de l'entreprise", type: "text", required: true, placeholder: "Ex: SARL Kouassi Consulting" },
      { name: "structure", label: "Forme juridique", type: "select", required: true, options: ["SARL", "SARLU", "SA", "SAS", "Entreprise Individuelle", "GIE", "Autre"] },
      { name: "sector", label: "Secteur d'activité", type: "text", required: true, placeholder: "Ex: Commerce, Services, IT..." },
      { name: "capital", label: "Capital social envisagé", type: "text", required: true, placeholder: "Ex: 1 000 000 FCFA" },
      { name: "partnerCount", label: "Nombre d'associés", type: "select", required: true, options: ["1 (Associé unique)", "2", "3 à 5", "Plus de 5"] },
      { name: "employeeCount", label: "Nombre d'employés prévus", type: "select", required: true, options: ["Aucun", "1 à 5", "6 à 10", "11 à 20", "Plus de 20"] },
      { name: "registrationAddress", label: "Adresse de domiciliation", type: "text", required: true, placeholder: "Ex: Abidjan, Cocody Riviera 3" },
      { name: "hasBusinessPlan", label: "Avez-vous un business plan ?", type: "select", required: true, options: ["Oui, complet", "En cours de rédaction", "Non, j'ai besoin d'aide"] },
      { name: "description", label: "Description de votre projet", type: "textarea", required: true, placeholder: "Décrivez brièvement votre projet d'entreprise, vos objectifs, votre marché cible..." },
    ] :
    activeSurvey === "service" ? [
      { name: "name", label: "Votre nom complet", type: "text", required: true, placeholder: "Ex: Marie Touré" },
      { name: "email", label: "Votre email", type: "email", required: true, placeholder: "Ex: marie@example.com" },
      { name: "phone", label: "Votre téléphone", type: "tel", required: true, placeholder: "Ex: +225 07 XX XX XX XX" },
      { name: "company", label: "Nom de votre entreprise", type: "text", required: true, placeholder: "Ex: SARL Touré Services" },
      { name: "serviceType", label: "Type de service", type: "select", required: true, options: ["Comptabilité & Fiscalité", "Conseil stratégique", "Formation professionnelle", "Audit interne", "Autre"] },
      { name: "urgency", label: "Niveau d'urgence", type: "select", required: true, options: ["Très urgent (< 1 semaine)", "Urgent (1-2 semaines)", "Normal (3-4 semaines)", "Pas urgent"] },
      { name: "budget", label: "Budget estimé", type: "select", required: true, options: ["< 500 000 FCFA", "500 000 - 1 000 000 FCFA", "1 000 000 - 3 000 000 FCFA", "> 3 000 000 FCFA", "À discuter"] },
      { name: "description", label: "Description de votre besoin", type: "textarea", required: true, placeholder: "Décrivez en détail votre besoin, le contexte, les résultats attendus..." },
    ] :
    activeSurvey === "rh" ? [
      { name: "name", label: "Votre nom complet", type: "text", required: true, placeholder: "Ex: Paul Diabaté" },
      { name: "email", label: "Votre email", type: "email", required: true, placeholder: "Ex: paul@example.com" },
      { name: "phone", label: "Votre téléphone", type: "tel", required: true, placeholder: "Ex: +225 07 XX XX XX XX" },
      { name: "company", label: "Nom de votre entreprise", type: "text", required: true, placeholder: "Ex: SARL Diabaté & Fils" },
      { name: "employeeCount", label: "Nombre d'employés actuels", type: "select", required: true, options: ["1 à 5", "6 à 10", "11 à 20", "21 à 50", "Plus de 50"] },
      { name: "rhNeed", label: "Besoin RH principal", type: "select", required: true, options: ["Recrutement", "Formation", "Gestion de la paie", "Politique RH", "Conflit interne", "Évaluation des performances", "Autre"] },
      { name: "urgency", label: "Niveau d'urgence", type: "select", required: true, options: ["Très urgent (< 1 semaine)", "Urgent (1-2 semaines)", "Normal (3-4 semaines)", "Pas urgent"] },
      { name: "description", label: "Description de votre problématique RH", type: "textarea", required: true, placeholder: "Décrivez votre situation, les défis rencontrés, vos attentes..." },
    ] :
    activeSurvey === "domiciliation" ? [
      { name: "name", label: "Votre nom complet", type: "text", required: true, placeholder: "Ex: Aya Koné" },
      { name: "email", label: "Votre email", type: "email", required: true, placeholder: "Ex: aya@example.com" },
      { name: "phone", label: "Votre téléphone", type: "tel", required: true, placeholder: "Ex: +225 07 XX XX XX XX" },
      { name: "companyName", label: "Nom de l'entreprise", type: "text", required: true, placeholder: "Ex: SARL Koné Trading" },
      { name: "structure", label: "Forme juridique", type: "select", required: true, options: ["SARL", "SARLU", "SA", "SAS", "Entreprise Individuelle", "GIE", "Autre"] },
      { name: "duration", label: "Durée de domiciliation souhaitée", type: "select", required: true, options: ["6 mois", "1 an", "2 ans", "3 ans", "À discuter"] },
      { name: "additionalServices", label: "Services additionnels", type: "select", required: false, options: ["Aucun", "Gestion du courrier", "Ligne téléphonique", "Salle de réunion", "Plusieurs services"] },
      { name: "description", label: "Informations complémentaires", type: "textarea", required: true, placeholder: "Décrivez votre activité, vos besoins spécifiques..." },
    ] :
    [
      { name: "name", label: "Votre nom complet", type: "text", required: true, placeholder: "Ex: Kevin Bamba" },
      { name: "email", label: "Votre email", type: "email", required: true, placeholder: "Ex: kevin@example.com" },
      { name: "phone", label: "Votre téléphone", type: "tel", required: true, placeholder: "Ex: +225 07 XX XX XX XX" },
      { name: "spaceType", label: "Type d'espace", type: "select", required: true, options: ["Bureau privé", "Poste de travail", "Salle de réunion", "Open space", "Plusieurs espaces"] },
      { name: "duration", label: "Durée souhaitée", type: "select", required: true, options: ["À l'heure", "À la journée", "À la semaine", "Au mois", "À l'année", "À discuter"] },
      { name: "peopleCount", label: "Nombre de personnes", type: "select", required: true, options: ["1", "2", "3 à 5", "6 à 10", "Plus de 10"] },
      { name: "equipmentNeeds", label: "Besoins en équipements", type: "select", required: false, options: ["Aucun", "Ordinateur", "Imprimante", "Projecteur", "Connexion internet haut débit", "Plusieurs équipements"] },
      { name: "description", label: "Informations complémentaires", type: "textarea", required: true, placeholder: "Décrivez votre activité, vos besoins spécifiques, vos horaires..." },
    ];

  return (
    <>
      <PageHeader
        title="Demande de service"
        subtitle="Remplissez le formulaire correspondant à votre besoin"
        breadcrumbs={[
          { label: "Accueil", href: "/" },
          { label: "Demande de service", href: "#" },
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
                    
                    // Auto-scroll to form
                    setTimeout(() => {
                      formRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
                    }, 100);
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
                  <p className="text-sm text-body">{survey.desc}</p>
                </button>
              );
            })}
          </div>
        </div>
      </section>

      {/* Form Section */}
      <section className="section-padding bg-white" ref={formRef}>
        <div className="container-md">
          <div className="bg-white rounded-2xl shadow-card p-6 lg:p-10 border border-gray-100">
            <div className="flex items-start gap-4 mb-6">
              {(() => {
                const ActiveIcon = surveys.find((s) => s.id === activeSurvey)?.icon || Building2;
                return <ActiveIcon className="w-8 h-8 text-primary shrink-0 mt-1" />;
              })()}
              <div>
                <h3 className="font-display text-2xl font-semibold text-dark mb-2">
                  {surveys.find((s) => s.id === activeSurvey)?.title}
                </h3>
                <p className="text-body text-sm">
                  {surveys.find((s) => s.id === activeSurvey)?.desc}
                </p>
              </div>
            </div>

            {status === "success" ? (
              <div className="bg-green-50 border border-green-200 rounded-lg p-6 text-center">
                <CheckCircle className="w-12 h-12 text-green-500 mx-auto mb-3" />
                <h4 className="font-semibold text-green-800 mb-2">
                  Formulaire envoyé avec succès !
                </h4>
                <p className="text-sm text-green-700">
                  Nous avons bien reçu votre demande et nous vous contacterons dans les plus brefs délais.
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  {currentFields.map((field) => (
                    <div key={field.name} className={field.type === "textarea" ? "md:col-span-2" : ""}>
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

                {status === "error" && (
                  <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-start gap-3">
                    <AlertCircle className="w-5 h-5 text-red-500 shrink-0 mt-0.5" />
                    <p className="text-sm text-red-700">{errorMessage}</p>
                  </div>
                )}

                <button
                  type="submit"
                  disabled={status === "submitting"}
                  className="btn-primary w-full sm:w-auto px-8 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {status === "submitting" ? "Envoi en cours..." : "Envoyer ma demande"}
                </button>
              </form>
            )}
          </div>
        </div>
      </section>
    </>
  );
}
