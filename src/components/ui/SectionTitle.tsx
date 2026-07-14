interface SectionTitleProps {
  label: string;
  title: string;
  align?: "left" | "center";
  light?: boolean;
}

export default function SectionTitle({ label, title, align = "center", light = false }: SectionTitleProps) {
  return (
    <div className={`mb-12 lg:mb-16 ${align === "center" ? "text-center" : "text-left"}`}>
      <span
        className={`inline-block text-xs font-semibold uppercase tracking-[2px] mb-3 ${
          light ? "text-accent" : "text-secondary"
        }`}
      >
        {label}
      </span>
      <h2
        className={`font-display text-2xl lg:text-4xl font-semibold leading-tight ${
          light ? "text-white" : "text-dark"
        }`}
      >
        {title}
      </h2>
      <span
        className={`gold-underline ${align === "center" ? "mx-auto" : ""}`}
      />
    </div>
  );
}
