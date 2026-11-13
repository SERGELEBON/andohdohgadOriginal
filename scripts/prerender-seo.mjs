// Après `vite build` : crée dist/<page>.html pour chaque page publique (servie à /<page>
// par Netlify et par Vercel grâce à "cleanUrls"),
// avec son propre titre, sa description, son lien canonique et ses balises Open Graph.
// Facebook, WhatsApp et LinkedIn ne lisent pas le JavaScript : ils lisent ce HTML.
import { readFileSync, writeFileSync, mkdirSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const dist = join(root, "dist");
const { siteUrl, pages } = JSON.parse(readFileSync(join(root, "src/data/seo-pages.json"), "utf8"));
const base = readFileSync(join(dist, "index.html"), "utf8");

// Pages privées : pas de version pré-rendue
const SKIP = new Set(["/connexion", "/mon-compte"]);

const esc = (s) => s.replace(/&/g, "&amp;").replace(/"/g, "&quot;").replace(/</g, "&lt;");

function render(path, { title, description, canonical }) {
  const url = siteUrl + (canonical ?? (path === "/" ? "/" : path));
  const set = (html, re, value) => {
    if (!re.test(html)) throw new Error(`Balise introuvable dans index.html : ${re}`);
    return html.replace(re, value);
  };
  let html = base;
  html = set(html, /<title>[^<]*<\/title>/, `<title>${esc(title)}</title>`);
  html = set(html, /(<meta name="description" content=")[^"]*(")/, `$1${esc(description)}$2`);
  html = set(html, /(<link rel="canonical" href=")[^"]*(")/, `$1${url}$2`);
  html = set(html, /(<meta property="og:url" content=")[^"]*(")/, `$1${url}$2`);
  html = set(html, /(<meta property="og:title" content=")[^"]*(")/, `$1${esc(title)}$2`);
  html = set(html, /(<meta property="og:description" content=")[^"]*(")/, `$1${esc(description)}$2`);
  html = set(html, /(<meta name="twitter:title" content=")[^"]*(")/, `$1${esc(title)}$2`);
  html = set(html, /(<meta name="twitter:description" content=")[^"]*(")/, `$1${esc(description)}$2`);
  return html;
}

let n = 0;
for (const [path, meta] of Object.entries(pages)) {
  if (SKIP.has(path)) continue;
  const html = render(path, meta);
  const file = path === "/" ? join(dist, "index.html") : join(dist, `${path.slice(1)}.html`);
  mkdirSync(dirname(file), { recursive: true });
  writeFileSync(file, html);
  n++;
}
console.log(`prerender-seo : ${n} pages avec titre, description, canonical et Open Graph propres.`);
