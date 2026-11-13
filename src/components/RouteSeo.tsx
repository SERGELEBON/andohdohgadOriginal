import { useEffect } from "react";
import { useLocation } from "react-router-dom";

/**
 * Titre + description + canonical + Open Graph + Twitter, par page.
 * À placer UNE fois dans le Layout public (voir README).
 */
import seo from "@/data/seo-pages.json";

const SITE_URL = seo.siteUrl; // domaine final : modifier dans src/data/seo-pages.json
const SITE_NAME = seo.siteName;
const OG_IMAGE = `${SITE_URL}/og-image.jpg`; // image 1200x630 dans /public

type Meta = { title: string; description: string; canonical?: string };

const PAGES: Record<string, Meta> = seo.pages;

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
  const url = SITE_URL + (meta.canonical ?? (path === "/" ? "/" : path.replace(/\/$/, "")));
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
