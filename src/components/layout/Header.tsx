import { useState, useEffect, useRef, useCallback } from "react";
import { Link, useLocation } from "react-router-dom";
import { Menu, X, ChevronDown, ArrowRight, User, LogOut } from "lucide-react";
import { services } from "@/data/services";
import { useAuth } from "@/contexts/AuthContext";

const navLabels: Record<string, string> = {"home": "Accueil", "about": "À propos", "services": "Nos Services", "solutions": "Nos Solutions", "request": "Demande de service", "documentation": "Nos Documents", "blog": "Blog", "contact": "Contact", "appointment": "Prendre rendez-vous", "coworking": "Co-working"};

type NavLink = {
  label: string;
  href: string;
  children?: { label: string; href: string }[];
};

const navLinks: NavLink[] = [
  { label: "home", href: "/" },
  { label: "about", href: "/a-propos" },
  {
    label: "services",
    href: "/services",
    children: services.map((s) => ({ label: s.title, href: `/services/${s.slug}` })),
  },
  { label: "solutions", href: "/solutions" },
  { label: "documentation", href: "/documentation" },
  { label: "coworking", href: "/co-working" },
  { label: "blog", href: "/blog" },
  { label: "contact", href: "/contact" },
];

// Délai avant fermeture du sous-menu : laisse le temps à la souris
// de passer du lien au panneau sans que celui-ci disparaisse.
const CLOSE_DELAY_MS = 200;

export default function Header() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const [mobileServicesOpen, setMobileServicesOpen] = useState(false);
  const closeTimer = useRef<number | null>(null);
  const dropdownRef = useRef<HTMLDivElement | null>(null);
  const location = useLocation();
  const { user, profile, signOut } = useAuth();

  const isActive = (href: string) =>
    href === "/" ? location.pathname === "/" : location.pathname === href || location.pathname.startsWith(href + "/");

  const cancelClose = useCallback(() => {
    if (closeTimer.current !== null) {
      window.clearTimeout(closeTimer.current);
      closeTimer.current = null;
    }
  }, []);

  const openDropdown = useCallback((label: string) => {
    cancelClose();
    setActiveDropdown(label);
  }, [cancelClose]);

  const scheduleClose = useCallback(() => {
    cancelClose();
    closeTimer.current = window.setTimeout(() => setActiveDropdown(null), CLOSE_DELAY_MS);
  }, [cancelClose]);

  useEffect(() => {
    const onScroll = () => setIsScrolled(window.scrollY > 100);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Fermeture des menus à chaque changement de page
  useEffect(() => {
    setIsMobileOpen(false);
    setActiveDropdown(null);
    setMobileServicesOpen(false);
  }, [location.pathname]);

  // Sous-menu desktop : fermeture par Échap ou clic à l'extérieur
  useEffect(() => {
    if (!activeDropdown) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") setActiveDropdown(null);
    };
    const onPointerDown = (e: PointerEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setActiveDropdown(null);
      }
    };
    document.addEventListener("keydown", onKeyDown);
    document.addEventListener("pointerdown", onPointerDown);
    return () => {
      document.removeEventListener("keydown", onKeyDown);
      document.removeEventListener("pointerdown", onPointerDown);
    };
  }, [activeDropdown]);

  // Menu mobile : bloque le défilement de la page et se ferme avec Échap
  useEffect(() => {
    if (!isMobileOpen) return;
    document.body.style.overflow = "hidden";
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") setIsMobileOpen(false);
    };
    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.body.style.overflow = "";
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [isMobileOpen]);

  useEffect(() => cancelClose, [cancelClose]);

  const isHome = location.pathname === "/";
  const headerBg = isHome && !isScrolled
    ? "bg-primary/90 backdrop-blur-sm"
    : "bg-primary shadow-header";

  return (
    <>
      <header
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${headerBg}`}
      >
        <div className="container-xl flex items-center justify-between h-[70px] lg:h-[80px]">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 z-10" aria-label="Andoh & Dohgad Consulting — Accueil">
            <div className="w-14 h-14 lg:w-16 lg:h-16 rounded-full bg-white shadow-lg flex items-center justify-center p-1">
              <img
                src="/images/logo.png"
                alt="Andoh & Dohgad Consulting"
                className="w-full h-full object-contain rounded-full"
              />
            </div>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden lg:flex items-center gap-1" aria-label="Navigation principale">
            {navLinks.map((link) => {
              const active = isActive(link.href);

              if (!link.children) {
                return (
                  <Link
                    key={link.href}
                    to={link.href}
                    aria-current={active ? "page" : undefined}
                    className={`relative flex items-center px-3 py-2 text-[15px] font-medium transition-colors rounded-md whitespace-nowrap ${
                      active ? "text-white font-semibold" : "text-white/90 hover:text-white"
                    }`}
                  >
                    {navLabels[link.label]}
                    {active && <span className="absolute bottom-0 left-3 right-3 h-0.5 bg-accent rounded-full" />}
                  </Link>
                );
              }

              const open = activeDropdown === link.label;
              const panelId = `submenu-${link.label}`;

              return (
                <div
                  key={link.href}
                  ref={dropdownRef}
                  className="relative"
                  onMouseEnter={() => openDropdown(link.label)}
                  onMouseLeave={scheduleClose}
                  onBlur={(e) => {
                    if (!e.currentTarget.contains(e.relatedTarget as Node | null)) scheduleClose();
                  }}
                >
                  <div className="flex items-center">
                    <Link
                      to={link.href}
                      aria-current={active ? "page" : undefined}
                      className={`relative flex items-center pl-3 pr-1 py-2 text-[15px] font-medium transition-colors rounded-md whitespace-nowrap ${
                        active ? "text-white font-semibold" : "text-white/90 hover:text-white"
                      }`}
                    >
                      {navLabels[link.label]}
                      {active && <span className="absolute bottom-0 left-3 right-1 h-0.5 bg-accent rounded-full" />}
                    </Link>
                    {/* Bouton dédié : ouvre le sous-menu au clic, au toucher (tablettes) et au clavier */}
                    <button
                      type="button"
                      aria-haspopup="true"
                      aria-expanded={open}
                      aria-controls={panelId}
                      aria-label={`${open ? "Fermer" : "Ouvrir"} le sous-menu ${navLabels[link.label]}`}
                      onClick={() => (open ? setActiveDropdown(null) : openDropdown(link.label))}
                      className="p-1.5 mr-1 rounded-md text-white/90 hover:text-white hover:bg-white/10 transition-colors"
                    >
                      <ChevronDown className={`w-4 h-4 transition-transform duration-200 ${open ? "rotate-180" : ""}`} />
                    </button>
                  </div>

                  {/* pt-3 : zone tampon invisible, la souris ne « tombe » plus dans un vide entre le lien et le panneau */}
                  <div
                    id={panelId}
                    className={`absolute left-0 top-full pt-3 z-50 transition-all duration-200 ${
                      open ? "opacity-100 visible translate-y-0" : "opacity-0 invisible -translate-y-1 pointer-events-none"
                    }`}
                  >
                    <div className="w-80 bg-white rounded-xl shadow-dropdown ring-1 ring-black/5 overflow-hidden">
                      <ul className="py-2">
                        {link.children.map((child) => {
                          const childActive = location.pathname === child.href;
                          return (
                            <li key={child.href}>
                              <Link
                                to={child.href}
                                aria-current={childActive ? "page" : undefined}
                                tabIndex={open ? 0 : -1}
                                className={`block px-4 py-2.5 text-sm transition-colors ${
                                  childActive
                                    ? "bg-primary/5 text-primary font-semibold border-l-2 border-accent"
                                    : "text-gray-700 hover:bg-primary/5 hover:text-primary"
                                }`}
                              >
                                {child.label}
                              </Link>
                            </li>
                          );
                        })}
                      </ul>
                      <Link
                        to={link.href}
                        tabIndex={open ? 0 : -1}
                        className="flex items-center justify-between px-4 py-3 bg-gray-50 border-t border-gray-100 text-sm font-semibold text-primary hover:bg-primary/5 transition-colors"
                      >
                        Voir tous nos services
                        <ArrowRight className="w-4 h-4" />
                      </Link>
                    </div>
                  </div>
                </div>
              );
            })}
          </nav>

          {/* Right section : visible uniquement pour un utilisateur connecté (admin) */}
          <div className="hidden lg:flex items-center gap-3">
            {user ? (
              <div className="flex items-center gap-3">
                <Link
                  to="/mon-compte"
                  className="inline-flex items-center gap-2 px-4 py-2 text-white/90 hover:text-white text-sm font-medium transition-colors"
                >
                  <User className="w-4 h-4" />
                  {profile?.first_name || 'Compte'}
                </Link>
                {profile?.role === 'admin' && (
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
                  aria-label="Déconnexion"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            ) : null}
          </div>

          {/* Mobile menu button */}
          <button
            type="button"
            className="lg:hidden z-50 text-white p-2"
            onClick={() => setIsMobileOpen(!isMobileOpen)}
            aria-label={isMobileOpen ? "Fermer le menu" : "Ouvrir le menu"}
            aria-expanded={isMobileOpen}
            aria-controls="mobile-menu"
          >
            {isMobileOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </header>

      {/* Mobile Menu Overlay
          Le conteneur défile (overflow-y-auto) et le contenu utilise min-h-full :
          quand le sous-menu Services est déplié, rien n'est coupé en haut de l'écran. */}
      {isMobileOpen && (
        <div id="mobile-menu" className="fixed inset-0 z-40 bg-primary lg:hidden overflow-y-auto overscroll-contain">
          <nav
            aria-label="Navigation mobile"
            className="min-h-full flex flex-col items-center justify-center gap-4 pt-24 pb-10 px-6"
          >
            {navLinks.map((link) => (
              <div key={link.href} className="w-full max-w-sm text-center">
                {link.children ? (
                  <div className="w-full">
                    <button
                      type="button"
                      onClick={() => setMobileServicesOpen(!mobileServicesOpen)}
                      aria-expanded={mobileServicesOpen}
                      aria-controls="mobile-submenu-services"
                      className={`flex items-center justify-center gap-2 text-xl font-medium transition-colors py-2 mx-auto ${
                        isActive(link.href) ? "text-white font-semibold" : "text-white/90 hover:text-white"
                      }`}
                    >
                      {navLabels[link.label]}
                      <ChevronDown className={`w-5 h-5 transition-transform duration-200 ${mobileServicesOpen ? 'rotate-180' : ''}`} />
                    </button>
                    {mobileServicesOpen && (
                      <div
                        id="mobile-submenu-services"
                        className="mt-2 bg-white/10 rounded-xl py-2 px-2 backdrop-blur-sm text-left"
                      >
                        {link.children.map((child) => (
                          <Link
                            key={child.href}
                            to={child.href}
                            aria-current={location.pathname === child.href ? "page" : undefined}
                            className="block text-base text-white/85 hover:text-white py-2.5 px-3 hover:bg-white/10 rounded-lg transition-colors"
                          >
                            {child.label}
                          </Link>
                        ))}
                        <Link
                          to={link.href}
                          className="mt-1 flex items-center justify-between text-base font-semibold text-accent py-2.5 px-3 border-t border-white/15 hover:bg-white/10 rounded-lg transition-colors"
                        >
                          Voir tous nos services
                          <ArrowRight className="w-4 h-4" />
                        </Link>
                      </div>
                    )}
                  </div>
                ) : (
                  <Link
                    to={link.href}
                    aria-current={isActive(link.href) ? "page" : undefined}
                    className={`text-xl font-medium transition-colors block py-2 ${
                      isActive(link.href) ? "text-white font-semibold" : "text-white/90 hover:text-white"
                    }`}
                  >
                    {navLabels[link.label]}
                  </Link>
                )}
              </div>
            ))}

            {/* Compte connecté (mobile) — la connexion admin se fait via /connexion, non exposée aux visiteurs */}
            {user ? (
              <div className="w-full flex flex-col items-center gap-3 mt-4">
                <Link
                  to="/mon-compte"
                  className="inline-flex items-center gap-2 px-6 py-3 text-white/90 hover:text-white text-base font-medium transition-colors"
                >
                  <User className="w-5 h-5" />
                  {profile?.first_name || 'Compte'}
                </Link>
                {profile?.role === 'admin' && (
                  <Link
                    to="/admin"
                    className="inline-flex items-center gap-2 px-6 py-3 bg-purple-600 text-white text-base font-semibold rounded-lg hover:bg-purple-700 transition-all shadow-md"
                  >
                    👑 Admin
                  </Link>
                )}
                <button
                  type="button"
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
            ) : null}

            <Link
              to="/rendez-vous"
              className="mt-4 inline-flex items-center gap-2 px-8 py-3.5 bg-accent text-dark text-base font-semibold rounded-lg"
            >
              {"Prendre rendez-vous"}
              <ArrowRight className="w-4 h-4" />
            </Link>
          </nav>
        </div>
      )}
    </>
  );
}
