import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Clock, FileText, Phone, CheckCircle } from "lucide-react";
import PageHeader from "@/components/layout/PageHeader";
import { services } from "@/data/services";

const schema = z.object({
  firstName: z.string().min(2, "Minimum 2 caracteres"),
  lastName: z.string().min(2, "Minimum 2 caracteres"),
  email: z.string().email("Email invalide"),
  phone: z.string().min(8, "Telephone invalide"),
  company: z.string().optional(),
  service: z.string().min(1, "Selectionnez un service"),
  date: z.string().min(1, "Selectionnez une date"),
  timeSlot: z.string().min(1, "Selectionnez un creneau"),
  message: z.string().optional(),
});

type FormData = z.infer<typeof schema>;

export default function Appointment() {
  const [status, setStatus] = useState<"idle" | "submitting" | "success" | "error">("idle");
  const { register, handleSubmit, formState: { errors } } = useForm<FormData>({ resolver: zodResolver(schema) });

  const onSubmit = async () => {
    setStatus("submitting");
    setTimeout(() => setStatus("success"), 1500);
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
                  <h3 className="font-display text-2xl font-semibold text-dark mb-3">Demande envoyee !</h3>
                  <p className="text-body max-w-md mx-auto mb-6">Nous avons bien recu votre demande de rendez-vous. Notre equipe vous contactera dans les 24 heures ouvrees pour confirmer votre rendez-vous.</p>
                  <a href="/" className="btn-primary">Retour a l&apos;accueil</a>
                </div>
              ) : (
                <>
                  <h3 className="font-body text-xl font-semibold text-dark mb-6">Formulaire de demande de rendez-vous</h3>
                  <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
                    <div className="grid sm:grid-cols-2 gap-5">
                      <div>
                        <label className="block text-sm font-medium text-dark mb-1.5">Prenom *</label>
                        <input {...register("firstName")} className={`w-full px-4 py-3 border rounded-lg text-sm focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/10 ${errors.firstName ? "border-red-500" : "border-gray-200"}`} />
                        {errors.firstName && <p className="text-red-500 text-xs mt-1">{errors.firstName.message}</p>}
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-dark mb-1.5">Nom *</label>
                        <input {...register("lastName")} className={`w-full px-4 py-3 border rounded-lg text-sm focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/10 ${errors.lastName ? "border-red-500" : "border-gray-200"}`} />
                        {errors.lastName && <p className="text-red-500 text-xs mt-1">{errors.lastName.message}</p>}
                      </div>
                    </div>

                    <div className="grid sm:grid-cols-2 gap-5">
                      <div>
                        <label className="block text-sm font-medium text-dark mb-1.5">Email *</label>
                        <input type="email" {...register("email")} className={`w-full px-4 py-3 border rounded-lg text-sm focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/10 ${errors.email ? "border-red-500" : "border-gray-200"}`} />
                        {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email.message}</p>}
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-dark mb-1.5">Telephone *</label>
                        <input type="tel" {...register("phone")} className={`w-full px-4 py-3 border rounded-lg text-sm focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/10 ${errors.phone ? "border-red-500" : "border-gray-200"}`} />
                        {errors.phone && <p className="text-red-500 text-xs mt-1">{errors.phone.message}</p>}
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-dark mb-1.5">Entreprise</label>
                      <input {...register("company")} className="w-full px-4 py-3 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/10" />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-dark mb-1.5">Service concerne *</label>
                      <select {...register("service")} className={`w-full px-4 py-3 border rounded-lg text-sm focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/10 ${errors.service ? "border-red-500" : "border-gray-200"}`}>
                        <option value="">Selectionnez...</option>
                        {services.map((s) => <option key={s.slug} value={s.slug}>{s.title}</option>)}
                      </select>
                      {errors.service && <p className="text-red-500 text-xs mt-1">{errors.service.message}</p>}
                    </div>

                    <div className="grid sm:grid-cols-2 gap-5">
                      <div>
                        <label className="block text-sm font-medium text-dark mb-1.5">Date souhaitee *</label>
                        <input type="date" {...register("date")} className={`w-full px-4 py-3 border rounded-lg text-sm focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/10 ${errors.date ? "border-red-500" : "border-gray-200"}`} />
                        {errors.date && <p className="text-red-500 text-xs mt-1">{errors.date.message}</p>}
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-dark mb-1.5">Creaneau horaire *</label>
                        <select {...register("timeSlot")} className={`w-full px-4 py-3 border rounded-lg text-sm focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/10 ${errors.timeSlot ? "border-red-500" : "border-gray-200"}`}>
                          <option value="">Selectionnez...</option>
                          <option value="morning">Matin (8h-12h)</option>
                          <option value="afternoon">Apres-midi (12h-17h)</option>
                        </select>
                        {errors.timeSlot && <p className="text-red-500 text-xs mt-1">{errors.timeSlot.message}</p>}
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-dark mb-1.5">Message / Precisions</label>
                      <textarea {...register("message")} rows={4} placeholder="Decrivez brievement votre besoin..." className="w-full px-4 py-3 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/10 resize-y" />
                    </div>

                    <button type="submit" disabled={status === "submitting"} className="btn-primary w-full disabled:opacity-60">
                      {status === "submitting" ? "Envoi en cours..." : "Confirmer la demande"}
                    </button>
                  </form>
                </>
              )}
            </div>

            {/* Info sidebar */}
            <div className="space-y-6">
              {[
                { icon: Clock, title: "Delai de confirmation", text: "Nous vous contacterons sous 24h ouvrees." },
                { icon: FileText, title: "Preparez votre rendez-vous", text: "Ayez a portee de main vos documents comptables recents et vos questions." },
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
