import { BarChart3, LayoutDashboard, Receipt, UserCircle } from "lucide-react";
import type { Solution } from "@/types";

export const solutions: Solution[] = [
  {
    icon: BarChart3,
    title: "Logiciel de comptabilite en ligne",
    description: "Une solution intuitive pour gerer votre comptabilite au quotidien, accessible depuis n'importe quel appareil.",
    features: ["Saisie des ecritures simplifiee", "Etats financiers automatiques", "Export pour le cabinet"],
    status: "Disponible",
  },
  {
    icon: LayoutDashboard,
    title: "Tableaux de bord personnalises",
    description: "Visualisez vos indicateurs cles de performance en temps reel avec des tableaux de bord interactifs.",
    features: ["KPIs personnalisables", "Graphiques interactifs", "Partage avec votre conseiller"],
    status: "Disponible",
  },
  {
    icon: Receipt,
    title: "Module de gestion de paie",
    description: "Simplifiez la preparation de votre paie et vos declarations sociales avec notre module dedie.",
    features: ["Calcul automatique des salaires", "Declarations CNPS integrees", "Fiches de paie generees"],
    status: "Bientot",
  },
  {
    icon: UserCircle,
    title: "Espace client securise",
    description: "Accedez a vos documents, echangez avec votre conseiller et suivez vos missions en temps reel.",
    features: ["Documents centralises", "Messagerie integree", "Notifications en temps reel"],
    status: "Disponible",
  },
];
