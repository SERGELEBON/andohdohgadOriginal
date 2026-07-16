import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { Menu, X, ChevronDown, ArrowRight, User, LogOut } from "lucide-react";
import { useTranslation } from "react-i18next";
import LanguageSwitcher from "@/components/ui/LanguageSwitcher";
import { services } from "@/data/services";
import { useAuth } from "@/contexts/AuthContext";

const navLinks = [
  { label: "home", href: "/" },
  { label: "about", href: "/a-propos" },
  {
    label: "services",
    href: "/services",
    children: services.map((s) => ({ label: s.title, href: `/services/${s.slug}` })),
  },
  { label: "solutions", href: "/solutions" },
  { label: "documentation", href: "/documentation" },
  { label: "blog", href: "/blog" },
  { label: "contact", href: "/contact" },
];

export default function Header() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const [mobileServicesOpen, setMobileServicesOpen] = useState(false);
  const location = useLocation();
  const { t } = useTranslation();
  const { user, profile, signOut } = useAuth();

  useEffect(() => {
    const onScroll = () => setIsScrolled(window.scrollY > 100);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    setIsMobileOpen(false);
    setActiveDropdown(null);
    setMobileServicesOpen(false);
  }, [location.pathname]);

  useEffect(() => {
    if (isMobileOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => { document.body.style.overflow = ""; };
  }, [isMobileOpen]);

  const isHome = location.pathname === "/";
  const headerBg = isHome && !isScrolled
    ? "bg-transparent"
    : "bg-primary shadow-header";

  return (
    <>
      <header
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${headerBg}`}
      >
        <div className="container-xl flex items-center justify-between h-[70px] lg:h-[80px]">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 z-10">
            <div className="w-14 h-14 lg:w-16 lg:h-16 rounded-full bg-white shadow-lg flex items-center justify-center p-1">
              <img
                src="/images/logo.png"
                alt="Andoh & Dohgad Consulting"
                className="w-full h-full object-contain rounded-full"
              />
            </div>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden lg:flex items-center gap-1">
            {navLinks.map((link) => (
              <div
                key={link.href}
                className="relative"
                onMouseEnter={() => link.children && setActiveDropdown(link.label)}
                onMouseLeave={() => setActiveDropdown(null)}
              >
                <Link
                  to={link.href}
                  className={`flex items-center gap-1 px-3 py-2 text-[15px] font-medium text-white/90 hover:text-white transition-colors rounded-md whitespace-nowrap ${
                    location.pathname === link.href || location.pathname.startsWith(link.href + "/")
                      ? "text-white"
                      : ""
                  }`}
                >
                  {t(`nav.${link.label}`)}
                  {link.children && <ChevronDown className="w-4 h-4" />}
                  {(location.pathname === link.href ||
                    (link.href !== "/" && location.pathname.startsWith(link.href))) && (
                    <span className="absolute bottom-0 left-3 right-3 h-0.5 bg-accent rounded-full" />
                  )}
                </Link>

                {/* Dropdown */}
                {link.children && activeDropdown === link.label && (
                  <div className="absolute top-full left-0 mt-1 w-72 bg-white rounded-lg shadow-dropdown py-2 z-50 animate-in fade-in slide-in-from-top-2 duration-200">
                    {link.children.map((child) => (
                      <Link
                        key={child.href}
                        to={child.href}
                        className="block px-4 py-2.5 text-sm text-gray-700 hover:bg-primary/5 hover:text-primary transition-colors"
                      >
                        {child.label}
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </nav>

          {/* Right section */}
          <div className="hidden lg:flex items-center gap-3">
            <LanguageSwitcher />

            {user ? (
              <div className="flex items-center gap-3">
                <Link
                  to="/mon-compte"
                  className="inline-flex items-center gap-2 px-4 py-2 text-white/90 hover:text-white text-sm font-medium transition-colors"
                >
                  <User className="w-4 h-4" />
                  {profile?.first_name || 'Mon compte'}
                </Link>
                {(profile?.role === 'admin' || user?.email === 'contact@andoh-dohgad.com') && (
                  <Link
                    to="/admin"
                    className="inline-flex items-center gap-2 px-4 py-2.5 bg-purple-600 text-white text-sm font-semibold rounded-lg hover:bg-purple-700 transition-all shadow-md"
                  >
                    👑 Admin
                  </Link>
                )}
                <button
                  onClick={() => signOut()}
                  className="inline-flex items-center gap-2 px-4 py-2 text-white/90 hover:text-white text-sm font-medium transition-colors"
                  title="Déconnexion"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <>
                <Link
                  to="/connexion"
                  className="inline-flex items-center gap-2 px-4 py-2 text-white/90 hover:text-white text-sm font-medium transition-colors"
                >
                  <User className="w-4 h-4" />
                  Connexion
                </Link>
                <Link
                  to="/inscription"
                  className="inline-flex items-center gap-2 px-5 py-2.5 bg-accent text-dark text-sm font-semibold rounded-lg hover:bg-accent/90 transition-all duration-300 hover:-translate-y-0.5"
                >
                  Inscription
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </>
            )}
          </div>

          {/* Mobile menu button */}
          <button
            className="lg:hidden z-50 text-white p-2"
            onClick={() => setIsMobileOpen(!isMobileOpen)}
            aria-label={isMobileOpen ? "Fermer le menu" : "Ouvrir le menu"}
          >
            {isMobileOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </header>

      {/* Mobile Menu Overlay */}
      {isMobileOpen && (
        <div className="fixed inset-0 z-40 bg-primary lg:hidden">
          <div className="flex flex-col items-center justify-center h-full gap-6 pt-20 pb-8 px-6 overflow-y-auto">
            {navLinks.map((link) => (
              <div key={link.href} className="w-full text-center">
                {link.children ? (
                  // Menu déroulant pour Services
                  <div className="w-full">
                    <button
                      onClick={() => setMobileServicesOpen(!mobileServicesOpen)}
                      className="flex items-center justify-center gap-2 text-xl font-medium text-white/90 hover:text-white transition-colors py-2 mx-auto"
                    >
                      {t(`nav.${link.label}`)}
                      <ChevronDown className={`w-5 h-5 transition-transform ${mobileServicesOpen ? 'rotate-180' : ''}`} />
                    </button>
                    {mobileServicesOpen && (
                      <div className="mt-3 space-y-2 bg-white/10 rounded-lg py-3 px-4 backdrop-blur-sm">
                        {link.children.map((child) => (
                          <Link
                            key={child.href}
                            to={child.href}
                            className="block text-base text-white/80 hover:text-white py-2 hover:bg-white/10 rounded transition-colors"
                            onClick={() => setIsMobileOpen(false)}
                          >
                            {child.label}
                          </Link>
                        ))}
                      </div>
                    )}
                  </div>
                ) : (
                  // Lien normal
                  <Link
                    to={link.href}
                    className="text-xl font-medium text-white/90 hover:text-white transition-colors block py-2"
                    onClick={() => setIsMobileOpen(false)}
                  >
                    {t(`nav.${link.label}`)}
                  </Link>
                )}
              </div>
            ))}

            <div className="mt-4">
              <LanguageSwitcher />
            </div>

            {/* Auth buttons for mobile */}
            {user ? (
              <div className="w-full flex flex-col items-center gap-3 mt-4">
                <Link
                  to="/mon-compte"
                  className="inline-flex items-center gap-2 px-6 py-3 text-white/90 hover:text-white text-base font-medium transition-colors"
                  onClick={() => setIsMobileOpen(false)}
                >
                  <User className="w-5 h-5" />
                  {profile?.first_name || 'Mon compte'}
                </Link>
                {(profile?.role === 'admin' || user?.email === 'contact@andoh-dohgad.com') && (
                  <Link
                    to="/admin"
                    className="inline-flex items-center gap-2 px-6 py-3 bg-purple-600 text-white text-base font-semibold rounded-lg hover:bg-purple-700 transition-all shadow-md"
                    onClick={() => setIsMobileOpen(false)}
                  >
                    👑 Admin
                  </Link>
                )}
                <button
                  onClick={() => {
                    signOut();
                    setIsMobileOpen(false);
                  }}
                  className="inline-flex items-center gap-2 px-6 py-3 text-white/90 hover:text-white text-base font-medium transition-colors"
                >
                  <LogOut className="w-5 h-5" />
                  Déconnexion
                </button>
              </div>
            ) : (
              <div className="w-full flex flex-col items-center gap-3 mt-4">
                <Link
                  to="/connexion"
                  className="inline-flex items-center gap-2 px-6 py-3 text-white/90 hover:text-white text-base font-medium transition-colors"
                  onClick={() => setIsMobileOpen(false)}
                >
                  <User className="w-5 h-5" />
                  Connexion
                </Link>
                <Link
                  to="/inscription"
                  className="inline-flex items-center gap-2 px-8 py-3.5 bg-accent text-dark text-base font-semibold rounded-lg hover:bg-accent/90 transition-all"
                  onClick={() => setIsMobileOpen(false)}
                >
                  Inscription
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            )}

            <Link
              to="/rendez-vous"
              className="mt-4 inline-flex items-center gap-2 px-8 py-3.5 bg-accent text-dark text-base font-semibold rounded-lg"
              onClick={() => setIsMobileOpen(false)}
            >
              {t("header.cta")}
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      )}
    </>
  );
}
