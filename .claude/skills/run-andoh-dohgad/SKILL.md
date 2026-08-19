---
name: run-andoh-dohgad
description: Run, test, and screenshot the Andoh & Dohgad Consulting website (React/Vite multilingual consulting site)
---

# Run: Andoh & Dohgad Consulting Website

This is a React 19 + Vite + TypeScript consulting website with multilingual support (FR/EN/ES), GSAP animations, and shadcn/ui components. The site features 14 pages including services, blog, contact forms, and documentation. The driver script uses Playwright to launch the app in headless Chromium, navigate through key pages, and capture screenshots for verification.

## Prerequisites

**Node.js packages** (install if missing):
```bash
npm install
```

**Playwright with Chromium** (already installed as dev dependency):
```bash
npx playwright install chromium
```

No system packages required beyond Node.js runtime.

## Build

Optional — the driver runs against the dev server, which serves unbundled source. To verify production build:

```bash
npm run build
npm run preview  # Serves production build on port 4173
```

## Run (Agent Path)

**Start the dev server** (background):
```bash
npm run dev &
sleep 3  # Wait for server startup
```

**Run the driver** to test navigation and capture screenshots:
```bash
node .claude/skills/run-andoh-dohgad/driver.mjs
```

**What the driver does**:
1. Launches headless Chromium (1280x720 viewport, French locale)
2. Tests homepage load and title verification
3. Navigates to /services, /a-propos, /contact pages
4. Verifies contact form presence
5. Attempts language switcher test
6. Tests mobile viewport (375x667)
7. Saves screenshots to `.claude/skills/run-andoh-dohgad/screenshots/`

**Output**:
```
🚀 Launching browser...
📄 Loading homepage...
   Title: Andoh & Dohgad Consulting — Cabinet de Conseil Multidisciplinaire
   ✓ Screenshot: 01-homepage.png
📄 Testing navigation to Services...
   ✓ Screenshot: 02-services.png
...
✅ All tests passed!
📸 Screenshots saved to: /home/serge/Téléchargements/dohgahnew/.claude/skills/run-andoh-dohgad/screenshots
```

**Screenshots**:
- `01-homepage.png` — Full homepage with hero, stats, services preview
- `02-services.png` — Services grid page
- `03-about.png` — About page with team
- `04-contact.png` — Contact form
- `05-english.png` — English version (if language switcher found)
- `06-mobile.png` — Mobile viewport
- `error.png` — Captured on failure

**Environment variables**:
- `BASE_URL` — Default `http://localhost:3000`
- `HEADLESS=false` — Show browser window (for debugging)

**Stop the server**:
```bash
pkill -f "vite"
```

## Run (Human Path)

For manual testing with a visible browser window:

```bash
npm run dev
# Opens dev server on http://localhost:3000
# Visit in browser, Ctrl+C to stop
```

Or with the driver in headed mode:
```bash
HEADLESS=false node .claude/skills/run-andoh-dohgad/driver.mjs
```

## Direct Testing of Components

To test specific components or pages without the full app:

1. **Import and render a component** in a test file:
```typescript
import { render } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import HomePage from './src/pages/HomePage';

const { container } = render(
  <BrowserRouter>
    <HomePage />
  </BrowserRouter>
);
```

2. **Test specific data** (services, blog posts, etc.):
```bash
node -e "import('./src/data/services.ts').then(m => console.log(m.services))"
```

3. **Verify translations**:
```bash
node -e "import('./src/lib/i18n.ts').then(m => console.log(m.resources.fr.translation.hero))"
```

## Tests

No test suite configured yet. The driver serves as an integration smoke test.

## Gotchas

1. **Language switcher not in header by default** — The homepage might render the language selector in a different location or trigger (button, dropdown, footer). The driver attempts to find it but will skip if not found. Check the actual Header component implementation for the selector location.

2. **GSAP animations can delay content** — The site uses GSAP ScrollTrigger and timeline animations. Screenshots are taken after a 2-second delay to allow entrance animations to complete. If testing interactions that trigger animations, add similar delays.

3. **Port 3000 must be available** — Vite defaults to port 3000. If occupied, Vite will auto-increment to 3001, 3002, etc. Check the dev server output for the actual URL and set `BASE_URL` accordingly:
   ```bash
   BASE_URL=http://localhost:3001 node .claude/skills/run-andoh-dohgad/driver.mjs
   ```

4. **EmailJS integration requires env vars** — Contact forms use EmailJS but credentials are not in the repo. Form submission will fail without proper configuration. The driver only checks for form presence, not submission success.

5. **Supabase auth backend** — The app has auth-related code (AuthContext, AuthCallback) but may not be fully configured for local development. Authentication flows are not tested by the driver.

## Troubleshooting

**Error: `net::ERR_CONNECTION_REFUSED` on `http://localhost:3000`**
→ Dev server not running. Start it first:
```bash
npm run dev
```

**Error: `Executable doesn't exist at /home/user/.cache/ms-playwright/chromium-1234/chrome-linux/chrome`**
→ Playwright browsers not installed:
```bash
npx playwright install chromium
```

**Screenshots show blank white page**
→ Increase wait time in driver (GSAP animations may need longer). Edit `driver.mjs` and increase `await wait(2000)` to `await wait(4000)`.

**Error: `Cannot find module 'playwright'`**
→ Install Playwright as dev dependency:
```bash
npm install -D playwright
```

**Port already in use error**
→ Another process is using port 3000:
```bash
# Find and kill process on port 3000
lsof -ti:3000 | xargs kill -9
# Or use a different port
PORT=3001 npm run dev
```

**Language switcher test skipped**
→ Expected behavior if the language switcher UI has changed. The driver gracefully skips this test. To fix, update the selector in `driver.mjs` to match the actual language switcher button.

## Project Structure Reference

- **Entry point**: `src/main.tsx` (mounts React app with BrowserRouter)
- **Routes**: `src/App.tsx` (14 routes defined)
- **Pages**: `src/pages/` (one component per route)
- **Sections**: `src/sections/` (reusable page sections)
- **Data**: `src/data/` (services, blog, team, etc.)
- **i18n**: `src/lib/i18n.ts` (all translations inline)
- **Forms**: Use react-hook-form + Zod + EmailJS pattern

## Next Steps After Running

1. **Verify screenshots** — Look at the images in `screenshots/` to confirm visual rendering
2. **Test specific flows** — Modify `driver.mjs` to add custom navigation or form interactions
3. **Add assertions** — Convert driver from smoke test to proper test suite with assertions
4. **Test forms** — Add EmailJS test credentials and verify form submission
5. **Test auth flow** — Configure Supabase locally and test signup/login