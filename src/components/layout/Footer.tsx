import { Link } from "react-router-dom";
import { Phone, Mail, MapPin } from "lucide-react";
import SocialLinks from "@/components/layout/SocialLinks";
import { services } from "@/data/services";

const navLabels: Record<string, string> = {"home": "Accueil", "about": "À propos", "services": "Nos Services", "solutions": "Nos Solutions", "request": "Demande de service", "documentation": "Nos Documents", "blog": "Blog", "contact": "Contact", "appointment": "Prendre rendez-vous", "coworking": "Co-working"};

const navLinks = [
  { label: "home", href: "/" },
  { label: "about", href: "/a-propos" },
  { label: "solutions", href: "/solutions" },
  { label: "documentation", href: "/documentation" },
  { label: "blog", href: "/blog" },
  { label: "contact", href: "/contact" },
  { label: "appointment", href: "/rendez-vous" },
  { label: "coworking", href: "/co-working" },
  { label: "request", href: "/demande-service" },
];

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-primary text-white relative overflow-hidden">
      {/* Fond : carte du monde (Natural Earth, domaine public) — Côte d'Ivoire en doré, point sur Abidjan */}
      <div
        aria-hidden="true"
        className="absolute inset-0 pointer-events-none bg-no-repeat bg-center bg-cover opacity-[0.18]"
        style={{ backgroundImage: "url('/images/world-map.svg')" }}
      />

      <div className="container-xl pt-16 lg:pt-24 pb-8 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 lg:gap-8">
          {/* Brand Column */}
          <div className="lg:col-span-1">
            <Link to="/" className="inline-block mb-4">
              <div className="w-16 h-16 lg:w-20 lg:h-20 rounded-full bg-white shadow-lg flex items-center justify-center p-1">
                <img
                  src="/images/logo.png"
                  alt="Andoh & Dohgad Consulting"
                  className="w-full h-full object-contain rounded-full"
                />
              </div>
            </Link>
            <p className="text-white/70 text-sm italic mb-6 font-display">
              &ldquo;{"Grandir sans visibilité est un risque."}&rdquo;
            </p>
            <SocialLinks />
          </div>

          {/* Services Column */}
          <div>
            <h4 className="text-white font-semibold text-base mb-5 font-body">
              {"Nos Services"}
            </h4>
            <ul className="space-y-2.5">
              {services.map((s) => (
                <li key={s.slug}>
                  <Link
                    to={`/services/${s.slug}`}
                    className="text-white/70 text-sm hover:text-accent hover:translate-x-1 inline-block transition-all duration-300"
                  >
                    {s.title}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Navigation Column */}
          <div>
            <h4 className="text-white font-semibold text-base mb-5 font-body">
              {"Navigation"}
            </h4>
            <ul className="space-y-2.5">
              {navLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    to={link.href}
                    className="text-white/70 text-sm hover:text-accent hover:translate-x-1 inline-block transition-all duration-300"
                  >
                    {navLabels[link.label]}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Column */}
          <div>
            <h4 className="text-white font-semibold text-base mb-5 font-body">
              {"Contact"}
            </h4>
            <ul className="space-y-3.5">
              <li className="flex items-start gap-3">
                <Phone className="w-4 h-4 text-accent mt-0.5 shrink-0" />
                <div className="text-white/70 text-sm space-y-1">
                  <p>+225 07 09 57 75 30</p>
                  <p>+225 07 09 20 46 62</p>
                </div>
              </li>
              <li className="flex items-start gap-3">
                <Mail className="w-4 h-4 text-accent mt-0.5 shrink-0" />
                <a
                  href="mailto:andoh.dohgad@gmail.com"
                  className="text-white/70 text-sm hover:text-accent transition-colors"
                >
                  andoh.dohgad@gmail.com
                </a>
              </li>
              <li className="flex items-start gap-3">
                <MapPin className="w-4 h-4 text-accent mt-0.5 shrink-0" />
                <p className="text-white/70 text-sm">
                  AfricaWorks, Plateau Rue du Commerce, Abidjan
                </p>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-12 pt-6 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-white/50 text-xs">
            &copy; {currentYear} Andoh & Dohgad Consulting. {"Tous droits réservés"}.
          </p>
          <div className="flex items-center gap-4">
            <Link
              to="/mentions-legales"
              className="text-white/50 text-xs hover:text-white/70 transition-colors"
            >
              {"Mentions légales"}
            </Link>
            <Link
              to="/politique-confidentialite"
              className="text-white/50 text-xs hover:text-white/70 transition-colors"
            >
              {"Politique de confidentialité"}
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
