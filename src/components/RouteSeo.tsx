import { useEffect } from "react";
import { useLocation } from "react-router-dom";

/**
 * Titre + description + canonical + Open Graph + Twitter, par page.
 * À placer UNE fois dans le Layout public (voir README).
 */
const SITE_URL = "https://andoh-dohgad.netlify.app"; // ← mettre le domaine final ici
const SITE_NAME = "Andoh & Dohgad Consulting";
const OG_IMAGE = `${SITE_URL}/og-image.jpg`; // image 1200x630 dans /public

type Meta = { title: string; description: string };

const PAGES: Record<string, Meta> = {
  "/": {
    title: "Andoh & Dohgad Consulting — Cabinet de conseil en Côte d'Ivoire",
    description:
      "Cabinet de conseil multidisciplinaire à Abidjan : comptabilité, fiscalité, ressources humaines, création d'entreprise et co-working.",
  },
  "/a-propos": {
    title: "À propos — Andoh & Dohgad Consulting",
    description:
      "Découvrez notre cabinet, notre équipe et nos valeurs : un accompagnement de proximité pour les entreprises en Côte d'Ivoire.",
  },
  "/services": {
    title: "Nos services — Comptabilité, fiscalité, RH | Andoh & Dohgad",
    description:
      "Accompagnement comptable et fiscal, gestion RH, création d'entreprise, conseil stratégique et formation. Découvrez tous nos services.",
  },
  "/solutions": {
    title: "Solutions digitales & ERP — Andoh & Dohgad Consulting",
    description:
      "Nos solutions de gestion : comptabilité, paie, RH et gestion commerciale dans un espace sécurisé. ERP bientôt disponible.",
  },
  "/documentation": {
    title: "Documentation & ressources — Andoh & Dohgad Consulting",
    description:
      "Guides, modèles et ressources pratiques en comptabilité, fiscalité et RH pour les entreprises ivoiriennes.",
  },
  "/blog": {
    title: "Blog & actualités — Andoh & Dohgad Consulting",
    description:
      "Actualités fiscales, conseils comptables et RH, et analyses pour entrepreneurs en Côte d'Ivoire.",
  },
  "/rendez-vous": {
    title: "Prendre rendez-vous — Andoh & Dohgad Consulting",
    description:
      "Réservez un rendez-vous avec un conseiller : choisissez le service, la date et le créneau horaire. Confirmation sous 24h ouvrées.",
  },
  "/co-working": {
    title: "Co-working & domiciliation à Abidjan — Andoh & Dohgad",
    description:
      "Espaces de co-working équipés et domiciliation d'entreprise à Abidjan. Réservez votre poste ou votre bureau.",
  },
  "/demande-service": {
    title: "Demande de service — Andoh & Dohgad Consulting",
    description:
      "Décrivez votre besoin et recevez une proposition adaptée de nos experts en comptabilité, fiscalité et RH.",
  },
  "/sondages": {
    title: "Demande de service — Andoh & Dohgad Consulting",
    description:
      "Décrivez votre besoin et recevez une proposition adaptée de nos experts en comptabilité, fiscalité et RH.",
  },
  "/contact": {
    title: "Contact — Andoh & Dohgad Consulting",
    description:
      "Contactez notre cabinet par téléphone, WhatsApp ou via le formulaire. Réponse rapide de nos conseillers.",
  },
  "/mentions-legales": {
    title: "Mentions légales — Andoh & Dohgad Consulting",
    description: "Mentions légales du site Andoh & Dohgad Consulting.",
  },
  "/politique-confidentialite": {
    title: "Politique de confidentialité — Andoh & Dohgad Consulting",
    description: "Comment Andoh & Dohgad Consulting collecte, utilise et protège vos données personnelles.",
  },
  "/connexion": { title: "Connexion — Andoh & Dohgad Consulting", description: "Connectez-vous à votre espace client." },
  "/mon-compte": { title: "Mon compte — Andoh & Dohgad Consulting", description: "Gérez votre espace client." },
};

const ADMIN_TITLES: Record<string, string> = {
  "/admin": "Tableau de bord",
  "/admin/demandes-service": "Demandes de service",
  "/admin/appointments": "Rendez-vous",
  "/admin/messages": "Messages",
  "/admin/blog": "Blog",
  "/admin/users": "Utilisateurs",
  "/admin/settings": "Paramètres",
  "/admin/cms": "Contenu du site",
  "/admin/services": "Images services",
  "/admin/coworking": "Co-working",
  "/admin/documents": "Documents",
  "/admin/docs": "Achats docs",
};

const NOINDEX = ["/connexion", "/inscription", "/forgot-password", "/reset-password", "/auth/callback", "/mon-compte", "/admin"];

function setMeta(attr: "name" | "property", key: string, content: string) {
  let el = document.head.querySelector<HTMLMetaElement>(`meta[${attr}="${key}"]`);
  if (!el) {
    el = document.createElement("meta");
    el.setAttribute(attr, key);
    document.head.appendChild(el);
  }
  el.setAttribute("content", content);
}

function setCanonical(href: string) {
  let link = document.head.querySelector<HTMLLinkElement>('link[rel="canonical"]');
  if (!link) {
    link = document.createElement("link");
    link.rel = "canonical";
    document.head.appendChild(link);
  }
  link.href = href;
}

/** Pour les pages dynamiques (service, article) : <Seo title=... description=... /> dans la page. */
function applySeo(path: string, meta: Meta, image = OG_IMAGE) {
  const url = SITE_URL + (path === "/" ? "/" : path.replace(/\/$/, ""));
  document.title = meta.title;
  setMeta("name", "description", meta.description);
  setCanonical(url);
  setMeta("property", "og:type", "website");
  setMeta("property", "og:site_name", SITE_NAME);
  setMeta("property", "og:locale", "fr_FR");
  setMeta("property", "og:title", meta.title);
  setMeta("property", "og:description", meta.description);
  setMeta("property", "og:url", url);
  setMeta("property", "og:image", image);
  setMeta("name", "twitter:card", "summary_large_image");
  setMeta("name", "twitter:title", meta.title);
  setMeta("name", "twitter:description", meta.description);
  setMeta("name", "twitter:image", image);
  setMeta("name", "robots", NOINDEX.some((p) => path.startsWith(p)) ? "noindex, nofollow" : "index, follow");
}

let pageSeoPath = "";

export function Seo({ title, description, image }: { title: string; description: string; image?: string }) {
  const { pathname } = useLocation();
  useEffect(() => {
    pageSeoPath = pathname; // empêche RouteSeo d'écraser ces métas
    applySeo(pathname, { title, description }, image);
  }, [pathname, title, description, image]);
  return null;
}

export default function RouteSeo() {
  const { pathname } = useLocation();
  useEffect(() => {
    if (pageSeoPath === pathname) return; // la page a déjà ses propres métas (<Seo />)
    if (pathname.startsWith("/admin")) {
      const label = ADMIN_TITLES[pathname.replace(/\/$/, "")];
      applySeo(pathname, {
        title: `${label ? label + " — " : ""}Administration | Andoh & Dohgad`,
        description: "Espace d'administration Andoh & Dohgad Consulting.",
      });
      return;
    }
    const base = "/" + (pathname.split("/")[1] ?? "");
    const meta = PAGES[pathname.replace(/\/$/, "") || "/"] ?? PAGES[base] ?? PAGES["/"];
    applySeo(pathname, meta);
  }, [pathname]);
  return null;
}
