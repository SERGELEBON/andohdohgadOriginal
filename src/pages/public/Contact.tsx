import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Phone, Mail, MapPin, Clock, Facebook, Linkedin, CheckCircle } from "lucide-react";
import PageHeader from "@/components/layout/PageHeader";
import CTABanner from "@/sections/CTABanner";
import { useScrollAnimation } from "@/hooks/useScrollAnimation";

const schema = z.object({
  name: z.string().min(2, "Minimum 2 caracteres"),
  email: z.string().email("Email invalide"),
  subject: z.string().min(1, "Selectionnez un sujet"),
  message: z.string().min(20, "Minimum 20 caracteres"),
});

type FormData = z.infer<typeof schema>;

function ContactForm() {
  const [status, setStatus] = useState<"idle" | "submitting" | "success">("idle");
  const { register, handleSubmit, formState: { errors } } = useForm<FormData>({ resolver: zodResolver(schema) });
  const onSubmit = () => { setStatus("submitting"); setTimeout(() => setStatus("success"), 1500); };

  return (
    <div>
      {status === "success" ? (
        <div className="text-center py-12">
          <CheckCircle className="w-16 h-16 text-emerald-500 mx-auto mb-4" />
          <h3 className="font-display text-2xl font-semibold text-dark mb-3">Message envoye !</h3>
          <p className="text-body">Votre message a bien ete envoye. Nous vous repondrons dans les plus brefs delais.</p>
        </div>
      ) : (
        <>
          <h3 className="font-body text-xl font-semibold text-dark mb-6">Envoyez-nous un message</h3>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            <div className="grid sm:grid-cols-2 gap-5">
              <div>
                <label className="block text-sm font-medium text-dark mb-1.5">Nom *</label>
                <input {...register("name")} className={`w-full px-4 py-3 border rounded-lg text-sm focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/10 ${errors.name ? "border-red-500" : "border-gray-200"}`} />
                {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name.message}</p>}
              </div>
              <div>
                <label className="block text-sm font-medium text-dark mb-1.5">Email *</label>
                <input type="email" {...register("email")} className={`w-full px-4 py-3 border rounded-lg text-sm focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/10 ${errors.email ? "border-red-500" : "border-gray-200"}`} />
                {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email.message}</p>}
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-dark mb-1.5">Sujet *</label>
              <select {...register("subject")} className={`w-full px-4 py-3 border rounded-lg text-sm focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/10 ${errors.subject ? "border-red-500" : "border-gray-200"}`}>
                <option value="">Selectionnez...</option>
                <option value="info">Demande d&apos;information</option>
                <option value="appointment">Demande de rendez-vous</option>
                <option value="accounting">Service comptable</option>
                <option value="hr">Service RH</option>
                <option value="coworking">Co-working</option>
                <option value="other">Autre</option>
              </select>
              {errors.subject && <p className="text-red-500 text-xs mt-1">{errors.subject.message}</p>}
            </div>
            <div>
              <label className="block text-sm font-medium text-dark mb-1.5">Message *</label>
              <textarea {...register("message")} rows={6} placeholder="Decrivez votre demande en detail..." className={`w-full px-4 py-3 border rounded-lg text-sm focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/10 resize-y ${errors.message ? "border-red-500" : "border-gray-200"}`} />
              {errors.message && <p className="text-red-500 text-xs mt-1">{errors.message.message}</p>}
            </div>
            <button type="submit" disabled={status === "submitting"} className="btn-primary w-full">{status === "submitting" ? "Envoi en cours..." : "Envoyer le message"}</button>
          </form>
        </>
      )}
    </div>
  );
}

function ContactInfo() {
  return (
    <div className="space-y-6">
      <div className="bg-offwhite rounded-xl p-6">
        <h4 className="font-body font-semibold text-dark mb-5">Nos coordonnees</h4>
        <ul className="space-y-4">
          {[
            { icon: Phone, label: "Telephone", values: ["+225 07 09 57 75 30", "+225 07 09 20 46 62"], link: "tel:+2250709577530" },
            { icon: Mail, label: "Email", values: ["andoh.dohgad@gmail.com"], link: "mailto:andoh.dohgad@gmail.com" },
            { icon: MapPin, label: "Adresse", values: ["AfricaWorks, Plateau Rue du Commerce, Abidjan"] },
            { icon: Clock, label: "Horaires", values: ["Lundi - Vendredi : 8h00 - 17h00", "Samedi : 9h00 - 12h00"] },
          ].map((item) => (
            <li key={item.label} className="flex items-start gap-3">
              <item.icon className="w-5 h-5 text-primary shrink-0 mt-0.5" />
              <div>
                <span className="text-xs text-muted-foreground uppercase tracking-wider">{item.label}</span>
                <div className="text-sm text-dark mt-0.5 space-y-0.5">
                  {item.values.map((v, i) => item.link ? (
                    <a key={i} href={item.link} className="block hover:text-primary transition-colors">{v}</a>
                  ) : (
                    <p key={i}>{v}</p>
                  ))}
                </div>
              </div>
            </li>
          ))}
        </ul>
      </div>

      {/* Social */}
      <div className="bg-offwhite rounded-xl p-6">
        <h4 className="font-body font-semibold text-dark mb-4">Suivez-nous</h4>
        <div className="flex items-center gap-3">
          {[
            { icon: Facebook, href: "https://facebook.com" },
            { icon: Linkedin, href: "https://linkedin.com" },
          ].map((social, i) => (
            <a key={i} href={social.href} target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-full bg-primary flex items-center justify-center hover:bg-accent transition-colors group">
              <social.icon className="w-4 h-4 text-white group-hover:text-dark" />
            </a>
          ))}
          <a href="https://wa.me/2250709577530" target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-full bg-primary flex items-center justify-center hover:bg-accent transition-colors group">
            <svg className="w-4 h-4 text-white group-hover:text-dark" viewBox="0 0 24 24" fill="currentColor"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" /></svg>
          </a>
        </div>
      </div>

      {/* Map */}
      <div className="rounded-xl overflow-hidden h-[250px]">
        <iframe
          src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3972.1!2d-4.02!3d5.33!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zNcKwMTknNDguMCJOIDTCsDAxJzEyLjAiVw!5e0!3m2!1sfr!2sci!4v1"
          width="100%"
          height="100%"
          style={{ border: 0 }}
          allowFullScreen
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
          title="Carte Andoh & Dohgad Consulting"
        />
      </div>
    </div>
  );
}

export default function Contact() {
  const { ref, isInView } = useScrollAnimation();
  return (
    <>
      <PageHeader title="Contactez-nous" subtitle="Notre equipe est a votre disposition pour repondre a toutes vos questions." breadcrumbs={[{ label: "Accueil", href: "/" }, { label: "Contact", href: "/contact" }]} />
      <section className="section-padding bg-white" ref={ref}>
        <div className="container-lg">
          <div className={`grid lg:grid-cols-[55%_45%] gap-10 lg:gap-16 transition-all duration-700 ${isInView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}>
            <ContactForm />
            <ContactInfo />
          </div>
        </div>
      </section>
      <CTABanner title="Vous preferez prendre rendez-vous directement ?" buttonText="Prendre rendez-vous" buttonLink="/rendez-vous" />
    </>
  );
}
