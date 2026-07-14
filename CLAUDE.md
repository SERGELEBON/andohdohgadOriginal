# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is the **Andoh & Dohgad Consulting** website - a professional consulting firm website built with React 19, TypeScript, Vite, and Tailwind CSS. The site features:
- 14 pages with complex GSAP animations and scroll effects
- Multilingual support (FR/EN/ES) via react-i18next
- Form management with react-hook-form, Zod validation, and EmailJS integration
- shadcn/ui component library with custom extensions

## Common Commands

**Note**: The application code is in the current directory. Run all commands from this directory.

### Development
```bash
npm run dev        # Start dev server on port 3000
npm run build      # TypeScript check + production build
npm run preview    # Preview production build
npm run lint       # Run ESLint
```

### Important Notes
- Dev server runs on port 3000 (configured in vite.config.ts)
- Always run `npm run build` before deployment to catch TypeScript errors
- The build command runs TypeScript check first, then Vite build
- If dependencies are not installed, run `npm install` first

## Architecture

### Routing Structure
- **Router**: React Router v7 with `BrowserRouter`
- **Routes**: 14 routes defined in `src/App.tsx`
  - Static pages: `/`, `/a-propos`, `/services`, `/solutions`, `/documentation`, `/blog`, `/contact`, `/rendez-vous`, `/co-working`, `/sondages`
  - Dynamic routes: `/services/:slug`, `/blog/:slug`
  - Fallback: `*` redirects to Home
- **Scroll behavior**: Auto-scroll to top on route change via `ScrollToTop` component

### Component Architecture

**Layout Components** (`src/components/layout/`)
- `Layout.tsx` - Main wrapper with Header + main + Footer
- `Header.tsx` - Fixed header with scroll-aware background transition
- `Footer.tsx` - 4-column footer with brand, services, navigation, contact
- `PageHeader.tsx` - Reusable page hero with breadcrumbs
- `MobileMenu.tsx` - Full-screen mobile overlay menu

**Section Components** (`src/sections/`)
- Page-specific sections like `HeroSection`, `StatsBar`, `ServicesGrid`, etc.
- Each section is self-contained with its own animations and data

**UI Components** (`src/components/ui/`)
- Mix of shadcn/ui primitives and custom components
- Custom components: `Button`, `SectionTitle`, various card components
- Form components: `FormInput`, `FormSelect`, `FormTextarea` (integrated with react-hook-form)

**Pages** (`src/pages/`)
- Each route has a corresponding page component
- Pages compose sections and handle page-level state

### Data Management

**Static Data Files** (`src/data/`)
- `services.ts` - 6 services with slug, title, description, features, etc.
- `blog.ts` - 6 blog articles with slug, category, content
- `testimonials.ts` - Client testimonials
- `documentation.ts` - Downloadable documents with pricing
- `team.ts` - Team members
- `solutions.ts` - Digital solutions

All data files export typed arrays. Use these for content rendering rather than hardcoding.

### Internationalization (i18n)

- **Library**: react-i18next with browser language detection
- **Languages**: French (default), English, Spanish
- **Configuration**: `src/lib/i18n.ts` contains all translations inline (not separate JSON files)
- **Usage**: `const { t } = useTranslation()` then `t('nav.home')`
- **Language switching**: Updates localStorage and re-renders content
- **Default language**: French (fallbackLng: "fr")

### Form Handling Pattern

All 5 forms follow the same pattern:
1. **Validation**: Zod schema for each form
2. **Form library**: react-hook-form with `@hookform/resolvers/zod`
3. **Submission**: EmailJS to `andoh.dohgad@gmail.com`
4. **States**: `idle → submitting → success | error`
5. **UI**: Form fields use custom Form* components from `src/components/ui/`

Forms: Appointment, Contact, Co-working Registration, Surveys (5 types), Documentation Purchase Modal

### Animation Architecture

**Primary Animation Library**: GSAP with ScrollTrigger plugin for scroll-driven animations
**Secondary**: Framer Motion for page transitions and simple UI animations

**Key Animation Patterns**:
- **Scroll-triggered entrance animations**: GSAP ScrollTrigger with `start: "top 85%"`, `once: true`
- **Character/line reveals**: GSAP timeline animations with stagger
- **Hero sequence**: Complex GSAP timeline on page load
- **Page transitions**: Framer Motion `AnimatePresence`
- **Reduced motion**: Check `prefers-reduced-motion` and disable complex animations

**Custom Hooks**:
- `useScrollAnimation.ts` - GSAP ScrollTrigger setup with cleanup
- `useScrollHeader.ts` - Header background transition on scroll
- `useMediaQuery.ts` - Responsive breakpoint detection
- `useReducedMotion.ts` - Accessibility preference detection

### Styling

**Tailwind Configuration** (`tailwind.config.js`):
- Custom colors: `primary` (#5C0F8B violet), `secondary` (#8B1A1A maroon), `accent` (#F5C518 gold)
- Custom fonts: Playfair Display (display), Inter (body)
- Custom shadows: `card`, `card-hover`, `header`, `dropdown`
- Custom timing functions: `smooth`, `bounce`

**Global Styles** (`src/index.css`):
- Tailwind directives
- CSS variables for theme colors
- Global resets and base styles

**Font Loading**: Google Fonts loaded via `<link>` in `index.html`

### Path Aliases

- `@/*` resolves to `./src/*` (configured in `vite.config.ts` and `tsconfig.json`)
- Use `@/components/...`, `@/lib/...`, etc. for all imports

## Development Guidelines

### Adding New Pages
1. Create page component in `src/pages/`
2. Add route in `src/App.tsx` Routes
3. Add navigation link in `Header.tsx` and i18n translations
4. Use `PageHeader` component for consistent hero section

### Adding New Sections
1. Create section component in `src/sections/`
2. Keep sections self-contained with their own data and animations
3. Use GSAP ScrollTrigger for entrance animations
4. Follow the cascade pattern: label → title → underline → content

### Working with Forms
1. Define Zod schema for validation
2. Use react-hook-form with `@hookform/resolvers/zod`
3. Use custom Form* components for consistent styling
4. Handle states: idle, submitting, success, error
5. EmailJS configuration should be in environment variables (not committed)

### Animation Best Practices
- Use `transform` and `opacity` only for scroll animations (GPU-accelerated)
- Clean up GSAP ScrollTrigger instances on unmount
- Test with `prefers-reduced-motion` enabled
- Reduce complexity on mobile (<768px)
- Use `requestAnimationFrame` throttling for scroll listeners

### Adding shadcn/ui Components
```bash
npx shadcn add <component-name>
```
This adds the component to `src/components/ui/` and updates `components.json`

### Updating Translations
Edit the `resources` object in `src/lib/i18n.ts` for all three languages (fr, en, es)

## Important Patterns

### Component Composition
- Pages compose sections
- Sections compose UI components
- Keep components focused and single-purpose

### Data Flow
- Static data from `src/data/*` files
- Form data via react-hook-form
- No global state management (React Router for navigation, i18n for language)

### Responsive Design
- Mobile-first approach with Tailwind breakpoints
- Mobile menu appears <1024px
- Grid columns adjust: 1 (mobile) → 2 (tablet) → 3 (desktop)
- Complex animations simplified/disabled on mobile

### Accessibility
- Semantic HTML throughout
- ARIA labels on interactive elements
- Keyboard navigation support
- Focus states with gold outline
- Color contrast meets WCAG AA
- Reduced motion support

## File Organization

```
src/
├── components/
│   ├── layout/      # Layout wrappers (Header, Footer, Layout)
│   └── ui/          # Reusable UI components + shadcn/ui
├── sections/        # Page sections (HeroSection, StatsBar, etc.)
├── pages/           # Route-level components
├── data/            # Static data (services, blog, team, etc.)
├── lib/             # Utilities (i18n, utils)
├── hooks/           # Custom React hooks
├── types/           # TypeScript type definitions
├── App.tsx          # Route definitions
├── main.tsx         # Entry point with BrowserRouter
└── index.css        # Global styles + Tailwind
```

## Performance Considerations

- **Code splitting**: Consider lazy loading page components with `React.lazy()` + `Suspense`
- **Image optimization**: Use WebP format, appropriate sizing, `loading="lazy"`
- **Animation performance**: GPU-composited properties only, honor reduced motion
- **Bundle size**: GSAP tree-shakes unused plugins automatically

## Deployment Notes

- Base path is relative (`base: './'` in vite.config.ts)
- Build outputs to `dist/` directory
- Static assets in `public/` are copied as-is
- Environment variables for EmailJS should be configured in deployment platform

## Troubleshooting

### "Cannot find module 'regenerate'" Error
If you encounter Babel-related errors about missing 'regenerate' module, this is caused by the `kimi-plugin-inspect-react` plugin. This plugin has been removed from the project as it's not essential and causes dependency conflicts.

The vite.config.ts should only use `react()` plugin:
```typescript
plugins: [react()],  // NOT: [inspectAttr(), react()]
```

### Port Already in Use
If port 3000 is already in use, Vite will automatically try another port (usually 3001). Check the terminal output for the actual port.

### Language Switching Not Working
If text doesn't change when switching languages, it means the components are using hardcoded text instead of i18n translations. All user-facing text must use the translation system:

```tsx
import { useTranslation } from "react-i18next";

function MyComponent() {
  const { t } = useTranslation();
  return <h1>{t('hero.title')}</h1>;  // NOT: <h1>Hardcoded text</h1>
}
```

All translations are defined in `src/lib/i18n.ts` under the `resources` object for fr/en/es languages.