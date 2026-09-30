import { Link } from "react-router-dom";

interface PageHeaderProps {
  title: string;
  subtitle: string;
  breadcrumbs: { label: string; href: string }[];
  backgroundImage?: string;
}

export default function PageHeader({ title, subtitle, breadcrumbs, backgroundImage }: PageHeaderProps) {
  return (
    <section className="relative overflow-hidden pt-[140px] lg:pt-[170px] pb-16 lg:pb-20">
      {/* Background Image or Gradient */}
      {backgroundImage ? (
        <>
          {/* Background Image */}
          <div className="absolute inset-0 z-0">
            <img
              src={backgroundImage}
              alt={title}
              className="w-full h-full object-cover"
            />
          </div>
          {/* Dark overlay for readability */}
          <div className="absolute inset-0 z-[1] bg-gradient-to-r from-primary/95 via-primary/85 to-primary/75" />
        </>
      ) : (
        /* Default gradient background */
        <div className="absolute inset-0 z-0 page-gradient" />
      )}

      {/* Decorative shape */}
      <div className="absolute bottom-0 left-0 w-40 h-40 opacity-10 pointer-events-none z-[2]">
        <svg viewBox="0 0 300 260" fill="none">
          <path d="M150 260L300 0H0L150 260Z" fill="#7B3FA0" />
        </svg>
      </div>

      <div className="container-lg relative z-10">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 text-white/60 text-sm mb-4">
          {breadcrumbs.map((crumb, i) => (
            <span key={crumb.href} className="flex items-center gap-2">
              {i > 0 && <span>/</span>}
              {i === breadcrumbs.length - 1 ? (
                <span className="text-white/80">{crumb.label}</span>
              ) : (
                <Link to={crumb.href} className="hover:text-white transition-colors">
                  {crumb.label}
                </Link>
              )}
            </span>
          ))}
        </nav>

        <h1 className="font-display text-3xl lg:text-[42px] font-bold text-white leading-tight max-w-2xl">
          {title}
        </h1>
        <p className="text-white/75 text-base lg:text-lg mt-3 max-w-xl leading-relaxed">
          {subtitle}
        </p>
      </div>
    </section>
  );
}
