import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Clock, FileText, Phone, CheckCircle } from "lucide-react";
import PageHeader from "@/components/layout/PageHeader";
import { services } from "@/data/services";
import SubmitErrorBox from "@/components/ui/SubmitErrorBox";
import { submitAppointment, whatsappFallbackUrl } from "@/lib/supabase/submissions";

const TIME_SLOTS: Record<string, string> = {
  morning: "Matin (8h-12h)",
  afternoon: "Après-midi (12h-17h)",
};

const schema = z.object({
  firstName: z.string().min(2, "Minimum 2 caractères"),
  lastName: z.string().min(2, "Minimum 2 caractères"),
  email: z.string().email("Email invalide"),
  phone: z.string().min(8, "Téléphone invalide"),
  company: z.string().optional(),
  service: z.string().min(1, "Sélectionnez un service"),
  date: z.string().min(1, "Sélectionnez une date"),
  timeSlot: z.string().min(1, "Sélectionnez un créneau"),
  message: z.string().optional(),
});

type FormData = z.infer<typeof schema>;

export default function Appointment() {
  const [status, setStatus] = useState<"idle" | "submitting" | "success" | "error">("idle");
  const [whatsappUrl, setWhatsappUrl] = useState("");
  const { register, handleSubmit, formState: { errors } } = useForm<FormData>({ resolver: zodResolver(schema) });

  const onSubmit = async (data: FormData) => {
    setStatus("submitting");
    const serviceLabel = data.service === "autre"
      ? "Autre / Demande générale"
      : services.find((s) => s.slug === data.service)?.title ?? data.service;
    const result = await submitAppointment({ ...data, service: serviceLabel });
    if (result.ok) {
      setStatus("success");
      return;
    }
    setWhatsappUrl(whatsappFallbackUrl([
      "Bonjour Andoh & Dohgad, je souhaite prendre rendez-vous (le formulaire du site n'a pas fonctionné) :",
      `Nom : ${data.firstName} ${data.lastName}`,
      `Email : ${data.email}`,
      `Téléphone : ${data.phone}`,
      data.company ? `Entreprise : ${data.company}` : "",
      `Service : ${serviceLabel}`,
      `Date souhaitée : ${data.date} – ${TIME_SLOTS[data.timeSlot] ?? data.timeSlot}`,
      data.message ? `Message : ${data.message}` : "",
    ]));
    setStatus("error");
  };

  return (
    <>
      <PageHeader
        title="Prendre rendez-vous"
        subtitle="Remplissez le formulaire ci-dessous et nous vous contacterons pour confirmer votre rendez-vous."
        breadcrumbs={[{ label: "Accueil", href: "/" }, { label: "Rendez-vous", href: "/rendez-vous" }]}
      />

      <section className="section-padding bg-white">
        <div className="container-lg">
          <div className="grid lg:grid-cols-[60%_40%] gap-10 lg:gap-16">
            {/* Form */}
            <div>
              {status === "success" ? (
                <div className="text-center py-12">
                  <CheckCircle className="w-16 h-16 text-emerald-500 mx-auto mb-4" />
                  <h3 className="font-display text-2xl font-semibold text-dark mb-3">Demande envoyée !</h3>
                  <p className="text-body max-w-md mx-auto mb-6">Nous avons bien reçu votre demande de rendez-vous. Notre équipe vous contactera dans les 24 heures ouvrées pour confirmer votre rendez-vous.</p>
                  <a href="/" className="btn-primary">Retour à l'accueil</a>
                </div>
              ) : (
                <>
                  <h3 className="font-body text-xl font-semibold text-dark mb-6">Formulaire de demande de rendez-vous</h3>
                  {status === "error" && <SubmitErrorBox whatsappUrl={whatsappUrl} />}
                  <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-5">
                    <div className="grid sm:grid-cols-2 gap-5">
                      <div>
                        <label htmlFor="rdv-firstName" className="block text-sm font-medium text-dark mb-1.5">Prénom *</label>
                        <input id="rdv-firstName" required aria-required="true" aria-invalid={errors.firstName ? "true" : "false"} aria-describedby={errors.firstName ? "rdv-firstName-error" : undefined} {...register("firstName")} className={`w-full px-4 py-3 border rounded-lg text-sm focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/10 ${errors.firstName ? "border-red-500" : "border-gray-200"}`} />
                        {errors.firstName && <p id="rdv-firstName-error" role="alert" className="text-red-500 text-xs mt-1">{errors.firstName.message}</p>}
                      </div>
                      <div>
                        <label htmlFor="rdv-lastName" className="block text-sm font-medium text-dark mb-1.5">Nom *</label>
                        <input id="rdv-lastName" required aria-required="true" aria-invalid={errors.lastName ? "true" : "false"} aria-describedby={errors.lastName ? "rdv-lastName-error" : undefined} {...register("lastName")} className={`w-full px-4 py-3 border rounded-lg text-sm focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/10 ${errors.lastName ? "border-red-500" : "border-gray-200"}`} />
                        {errors.lastName && <p id="rdv-lastName-error" role="alert" className="text-red-500 text-xs mt-1">{errors.lastName.message}</p>}
                      </div>
                    </div>

                    <div className="grid sm:grid-cols-2 gap-5">
                      <div>
                        <label htmlFor="rdv-email" className="block text-sm font-medium text-dark mb-1.5">Email *</label>
                        <input type="email" id="rdv-email" required aria-required="true" aria-invalid={errors.email ? "true" : "false"} aria-describedby={errors.email ? "rdv-email-error" : undefined} {...register("email")} className={`w-full px-4 py-3 border rounded-lg text-sm focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/10 ${errors.email ? "border-red-500" : "border-gray-200"}`} />
                        {errors.email && <p id="rdv-email-error" role="alert" className="text-red-500 text-xs mt-1">{errors.email.message}</p>}
                      </div>
                      <div>
                        <label htmlFor="rdv-phone" className="block text-sm font-medium text-dark mb-1.5">Téléphone *</label>
                        <input type="tel" id="rdv-phone" required aria-required="true" aria-invalid={errors.phone ? "true" : "false"} aria-describedby={errors.phone ? "rdv-phone-error" : undefined} {...register("phone")} className={`w-full px-4 py-3 border rounded-lg text-sm focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/10 ${errors.phone ? "border-red-500" : "border-gray-200"}`} />
                        {errors.phone && <p id="rdv-phone-error" role="alert" className="text-red-500 text-xs mt-1">{errors.phone.message}</p>}
                      </div>
                    </div>

                    <div>
                      <label htmlFor="rdv-company" className="block text-sm font-medium text-dark mb-1.5">Entreprise</label>
                      <input id="rdv-company" {...register("company")} className="w-full px-4 py-3 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/10" />
                    </div>

                    <div>
                      <label htmlFor="rdv-service" className="block text-sm font-medium text-dark mb-1.5">Service concerné *</label>
                      <select id="rdv-service" required aria-required="true" aria-invalid={errors.service ? "true" : "false"} aria-describedby={errors.service ? "rdv-service-error" : undefined} {...register("service")} className={`w-full px-4 py-3 border rounded-lg text-sm focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/10 ${errors.service ? "border-red-500" : "border-gray-200"}`}>
                        <option value="">Sélectionnez...</option>
                        {services.map((s) => <option key={s.slug} value={s.slug}>{s.title}</option>)}
                        <option value="autre">Autre / Demande générale</option>
                      </select>
                      {errors.service && <p id="rdv-service-error" role="alert" className="text-red-500 text-xs mt-1">{errors.service.message}</p>}
                    </div>

                    <div className="grid sm:grid-cols-2 gap-5">
                      <div>
                        <label htmlFor="rdv-date" className="block text-sm font-medium text-dark mb-1.5">Date souhaitée *</label>
                        <input type="date" id="rdv-date" required aria-required="true" aria-invalid={errors.date ? "true" : "false"} aria-describedby={errors.date ? "rdv-date-error" : undefined} {...register("date")} className={`w-full px-4 py-3 border rounded-lg text-sm focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/10 ${errors.date ? "border-red-500" : "border-gray-200"}`} />
                        {errors.date && <p id="rdv-date-error" role="alert" className="text-red-500 text-xs mt-1">{errors.date.message}</p>}
                      </div>
                      <div>
                        <label htmlFor="rdv-timeSlot" className="block text-sm font-medium text-dark mb-1.5">Créneau horaire *</label>
                        <select id="rdv-timeSlot" required aria-required="true" aria-invalid={errors.timeSlot ? "true" : "false"} aria-describedby={errors.timeSlot ? "rdv-timeSlot-error" : undefined} {...register("timeSlot")} className={`w-full px-4 py-3 border rounded-lg text-sm focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/10 ${errors.timeSlot ? "border-red-500" : "border-gray-200"}`}>
                          <option value="">Sélectionnez...</option>
                          {Object.entries(TIME_SLOTS).map(([value, label]) => <option key={value} value={value}>{label}</option>)}
                        </select>
                        {errors.timeSlot && <p id="rdv-timeSlot-error" role="alert" className="text-red-500 text-xs mt-1">{errors.timeSlot.message}</p>}
                      </div>
                    </div>

                    <div>
                      <label htmlFor="rdv-message" className="block text-sm font-medium text-dark mb-1.5">Message / Précisions</label>
                      <textarea id="rdv-message" {...register("message")} rows={4} placeholder="Décrivez brièvement votre besoin..." className="w-full px-4 py-3 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/10 resize-y" />
                    </div>

                    <button type="submit" disabled={status === "submitting"} className="btn-primary w-full disabled:opacity-60">
                      {status === "submitting" ? "Envoi en cours..." : status === "error" ? "Réessayer l'envoi" : "Confirmer la demande"}
                    </button>
                  </form>
                </>
              )}
            </div>

            {/* Info sidebar */}
            <div className="space-y-6">
              {[
                { icon: Clock, title: "Délai de confirmation", text: "Nous vous contacterons sous 24h ouvrées." },
                { icon: FileText, title: "Préparez votre rendez-vous", text: "Ayez à portée de main vos documents comptables récents et vos questions." },
                { icon: Phone, title: "Besoin d'urgence ?", text: "+225 07 09 57 75 30", isLink: true },
              ].map((item) => (
                <div key={item.title} className="bg-offwhite rounded-xl p-6">
                  <item.icon className="w-8 h-8 text-primary mb-3" />
                  <h4 className="font-semibold text-dark mb-1">{item.title}</h4>
                  {item.isLink ? (
                    <a href="tel:+2250709577530" className="text-primary font-medium hover:underline">{item.text}</a>
                  ) : (
                    <p className="text-body text-sm">{item.text}</p>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
