import { Link } from "react-router-dom";
import { Phone, Mail, MapPin, Facebook, Linkedin } from "lucide-react";
import { useTranslation } from "react-i18next";
import { services } from "@/data/services";

const navLinks = [
  { label: "home", href: "/" },
  { label: "about", href: "/a-propos" },
  { label: "solutions", href: "/solutions" },
  { label: "documentation", href: "/documentation" },
  { label: "blog", href: "/blog" },
  { label: "contact", href: "/contact" },
  { label: "appointment", href: "/rendez-vous" },
  { label: "coworking", href: "/co-working" },
  { label: "surveys", href: "/sondages" },
];

export default function Footer() {
  const { t } = useTranslation();
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-primary text-white relative overflow-hidden">
      {/* Decorative triangle */}
      <div className="absolute bottom-0 right-0 w-64 h-64 opacity-10 pointer-events-none">
        <svg viewBox="0 0 300 260" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M150 0L300 260H0L150 0Z" fill="#7B3FA0" />
        </svg>
      </div>

      <div className="container-xl pt-16 lg:pt-24 pb-8 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 lg:gap-8">
          {/* Brand Column */}
          <div className="lg:col-span-1">
            <Link to="/" className="inline-block mb-4">
              <img
                src="/images/logo.png"
                alt="Andoh & Dohgad Consulting"
                className="h-16 lg:h-20 w-auto rounded-xl"
              />
            </Link>
            <p className="text-white/70 text-sm italic mb-6 font-display">
              &ldquo;{t("footer.tagline")}&rdquo;
            </p>
            <div className="flex items-center gap-4">
              <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" className="w-9 h-9 rounded-full border border-white/30 flex items-center justify-center hover:bg-accent hover:border-accent transition-all duration-300 group">
                <Facebook className="w-4 h-4 text-white/80 group-hover:text-dark" />
              </a>
              <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" className="w-9 h-9 rounded-full border border-white/30 flex items-center justify-center hover:bg-accent hover:border-accent transition-all duration-300 group">
                <Linkedin className="w-4 h-4 text-white/80 group-hover:text-dark" />
              </a>
              <a href="https://wa.me/2250709577530" target="_blank" rel="noopener noreferrer" className="w-9 h-9 rounded-full border border-white/30 flex items-center justify-center hover:bg-accent hover:border-accent transition-all duration-300 group">
                <svg className="w-4 h-4 text-white/80 group-hover:text-dark" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                </svg>
              </a>
            </div>
          </div>

          {/* Services Column */}
          <div>
            <h4 className="text-white font-semibold text-base mb-5 font-body">
              {t("footer.services")}
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
              {t("footer.navigation")}
            </h4>
            <ul className="space-y-2.5">
              {navLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    to={link.href}
                    className="text-white/70 text-sm hover:text-accent hover:translate-x-1 inline-block transition-all duration-300"
                  >
                    {t(`nav.${link.label}`)}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Column */}
          <div>
            <h4 className="text-white font-semibold text-base mb-5 font-body">
              {t("footer.contact")}
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
            &copy; {currentYear} Andoh & Dohgad Consulting. {t("footer.rights")}.
          </p>
          <div className="flex items-center gap-4">
            <span className="text-white/50 text-xs hover:text-white/70 cursor-pointer transition-colors">
              {t("footer.legal")}
            </span>
            <span className="text-white/50 text-xs hover:text-white/70 cursor-pointer transition-colors">
              {t("footer.privacy")}
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
}
