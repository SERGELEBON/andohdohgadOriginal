import { BarChart3, LayoutDashboard, Receipt, UserCircle } from "lucide-react";
import type { Solution } from "@/types";

export const solutions: Solution[] = [
  {
    icon: BarChart3,
    title: "Logiciel de comptabilité en ligne",
    description: "Une solution intuitive pour gérer votre comptabilité au quotidien, accessible depuis n'importe quel appareil.",
    features: ["Saisie des écritures simplifiée", "États financiers automatiques", "Export pour le cabinet"],
    status: "Disponible",
  },
  {
    icon: LayoutDashboard,
    title: "Tableaux de bord personnalisés",
    description: "Visualisez vos indicateurs clés de performance en temps réel avec des tableaux de bord interactifs.",
    features: ["KPIs personnalisables", "Graphiques interactifs", "Partage avec votre conseiller"],
    status: "Disponible",
  },
  {
    icon: Receipt,
    title: "Module de gestion de paie",
    description: "Simplifiez la préparation de votre paie et vos déclarations sociales avec notre module dédié.",
    features: ["Calcul automatique des salaires", "Déclarations CNPS intégrées", "Fiches de paie générées"],
    status: "Bientot",
  },
  {
    icon: UserCircle,
    title: "Espace client sécurisé",
    description: "Accédez à vos documents, échangez avec votre conseiller et suivez vos missions en temps réel.",
    features: ["Documents centralisés", "Messagerie intégrée", "Notifications en temps réel"],
    status: "Disponible",
  },
];
