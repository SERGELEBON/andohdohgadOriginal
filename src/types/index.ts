import type { LucideIcon } from "lucide-react";

export interface Service {
  slug: string;
  icon: LucideIcon;
  title: string;
  shortDescription: string;
  fullDescription: string;
  problematics: string[];
  valueProposition: string;
  process: { step: string; title: string; description: string }[];
  features: string[];
}

export interface Article {
  slug: string;
  category: string;
  title: string;
  excerpt: string;
  content: string;
  author: string;
  date: string;
  readTime: string;
  image: string;
}

export interface Testimonial {
  quote: string;
  author: string;
  role: string;
  rating: number;
}

export interface Document {
  id: string;
  type: string;
  title: string;
  description: string;
  price: string;
}

export interface TeamMember {
  photo: string;
  name: string;
  role: string;
  bio: string;
}

export interface Solution {
  icon: LucideIcon;
  title: string;
  description: string;
  features: string[];
  status: "Disponible" | "Bientot";
}

export interface SurveyField {
  name: string;
  label: string;
  type: "text" | "email" | "tel" | "select" | "textarea" | "checkbox" | "number";
  required?: boolean;
  options?: { value: string; label: string }[];
  placeholder?: string;
}

export interface Survey {
  id: string;
  icon: LucideIcon;
  title: string;
  description: string;
  fields: SurveyField[];
}

export interface NavLink {
  label: string;
  href: string;
  children?: { label: string; href: string }[];
}
