import {
  Calculator, Users, Building2, TrendingUp, GraduationCap, MapPin,
} from "lucide-react";
import type { Service } from "@/types";

export const services: Service[] = [
  {
    slug: "comptable-fiscal",
    icon: Calculator,
    image: "/images/services/comptalink.jpg",
    heroImage: "/images/blog-fiscalite.jpg",
    title: "Accompagnement comptable et fiscal",
    shortDescription:
      "Tenue comptable, déclarations fiscales, optimisation fiscale et conseil personnalise pour maîtriser votre environnement financier.",
    fullDescription:
      "Andoh & Dohgad Consulting vous accompagne dans la gestion de votre comptabilité et de vos obligations fiscales. Notre équipe d'experts assure la tenue de vos livres, l'établissement de vos états financiers et le respect de vos déclarations auprès des autorités compétentes.",
    problematics: [
      "Tenue comptable irrégulière",
      "Conformité fiscale incertaine",
      "Optimisation fiscale insuffisante",
      "Manque de visibilité financière",
    ],
    valueProposition:
      "Notre expertise approfondie de la fiscalité ivoirienne et notre approche personnalisée nous permettent de vous offrir des solutions adaptées à votre secteur d'activité et à votre taille.",
    process: [
      { step: "01", title: "Diagnostic financier", description: "Analyse complète de votre situation comptable et fiscale actuelle" },
      { step: "02", title: "Mise en conformité", description: "Régularisation et mise à jour de vos déclarations" },
      { step: "03", title: "Accompagnement mensuel", description: "Tenue comptable régulière et déclarations périodiques" },
      { step: "04", title: "Rapport et recommandations", description: "États financiers et conseils d'optimisation" },
    ],
    features: [
      "Tenue comptable et établissement des états financiers",
      "Déclarations fiscales et sociales (DGI, CNPS)",
      "Optimisation fiscale et planification patrimoniale",
      "Assistance lors des contrôles fiscaux",
    ],
  },
  {
    slug: "ressources-humaines",
    icon: Users,
    image: "/images/services/peopleflow.jpg",
    heroImage: "/images/about-team.jpg",
    title: "Gestion des ressources humaines",
    shortDescription:
      "Recrutement, paie, formation, gestion des talents et conformité sociale pour bâtir des équipes performantes.",
    fullDescription:
      "Nous offrons des solutions complètes en gestion des ressources humaines pour vous aider à recruter, former et retenir les meilleurs talents tout en assurant la conformité avec la législation du travail.",
    problematics: [
      "Difficultés de recrutement",
      "Gestion de paie complexe",
      "Non-conformité sociale",
      "Turnover élevé",
    ],
    valueProposition:
      "Notre connaissance du marche de l'emploi ivoirien et notre méthodologie éprouvée en gestion des talents font de nous un partenaire RH de choix.",
    process: [
      { step: "01", title: "Audit RH", description: "Évaluation complète de votre fonction RH" },
      { step: "02", title: "Plan d'action", description: "Élaboration de stratégies RH adaptées" },
      { step: "03", title: "Mise en oeuvre", description: "Déploiement des solutions identifiées" },
      { step: "04", title: "Suivi et ajustement", description: "Évaluation et optimisation continue" },
    ],
    features: [
      "Recrutement et sélection de profils",
      "Gestion de la paie et des déclarations sociales",
      "Formation et développement des compétences",
      "Conseil en organisation et management",
    ],
  },
  {
    slug: "creation-entreprise",
    icon: Building2,
    image: "/images/services/boostart.jpg",
    heroImage: "/images/value-proposition.jpg",
    title: "Création et structuration d'entreprise",
    shortDescription:
      "Du choix du statut juridique aux formalités d'immatriculation, nous vous guidons dans chaque étape de votre création.",
    fullDescription:
      "Vous avez un projet entrepreneurial ? Nous vous guidons de A à Z dans la création de votre entreprise, du choix du statut juridique à l'immatriculation finale.",
    problematics: [
      "Statut juridique mal adapte",
      "Formalités complexes",
      "Manque de conseil structure",
      "Délai de création long",
    ],
    valueProposition:
      "Notre expérience dans l'accompagnement de plus de 200 créations d'entreprise nous permet d'anticiper les obstacles et d'accélérer vos démarches.",
    process: [
      { step: "01", title: "Étude de faisabilité", description: "Analyse de votre projet et du marche" },
      { step: "02", title: "Choix de la structure", description: "Sélection du statut juridique optimal" },
      { step: "03", title: "Constitution du dossier", description: "Préparation et dépôt des documents" },
      { step: "04", title: "Immatriculation", description: "Obtention du RCCM et lancement" },
    ],
    features: [
      "Choix du statut juridique adapte",
      "Vérification de la dénomination sociale",
      "Constitution du dossier et formalités",
      "Immatriculation au RCCM et à la DGI",
    ],
  },
  {
    slug: "conseil-strategique",
    icon: TrendingUp,
    image: "/images/services/synergia.jpg",
    heroImage: "/images/blog-strategie.jpg",
    title: "Conseil et accompagnement stratégique",
    shortDescription:
      "Analyse de marche, planification stratégique, tableaux de bord et conseil en gestion pour des décisions éclairées.",
    fullDescription:
      "Nos consultants en stratégie vous aident à définir une vision claire, à établir des objectifs mesurables et à mettre en place les outils de pilotage nécessaires.",
    problematics: [
      "Stratégie floue",
      "Croissance sans plan",
      "Manque d'indicateurs",
      "Concurrence agressive",
    ],
    valueProposition:
      "Une approche basée sur les données et l'expérience terrain pour des recommandations actionnables et mesurables.",
    process: [
      { step: "01", title: "Diagnostic stratégique", description: "Analyse approfondie de votre positionnement" },
      { step: "02", title: "Atelier de co-construction", description: "Élaboration collaborative de la stratégie" },
      { step: "03", title: "Plan d'action détaillé", description: "Définition des initiatives et des échéances" },
      { step: "04", title: "Suivi mensuel", description: "Accompagnement et ajustements réguliers" },
    ],
    features: [
      "Diagnostic stratégique et financier",
      "Élaboration de business plans",
      "Tableaux de bord et indicateurs de performance",
      "Conseil en gestion et organisation",
    ],
  },
  {
    slug: "formation",
    icon: GraduationCap,
    image: "/images/services/taxoptima.jpg",
    heroImage: "/images/blog-entrepreneuriat.jpg",
    title: "Formation et renforcement de capacités",
    shortDescription:
      "Programmes de formation sur mesure en comptabilité, gestion, fiscalité et entrepreneuriat pour vos équipes.",
    fullDescription:
      "Nos programmes de formation pratiques couvrent la comptabilité, la fiscalité, la gestion et l'entrepreneuriat. Formations en présentiel et en ligne disponibles.",
    problematics: [
      "Manque de compétences internes",
      "Formation trop théorique",
      "Besoin de montée en compétence rapide",
    ],
    valueProposition:
      "Des formateurs praticiens, des cas concrets et des supports pédagogiques adaptes au contexte africain.",
    process: [
      { step: "01", title: "Identification des besoins", description: "Évaluation des écarts de compétences" },
      { step: "02", title: "Conception du programme", description: "Développement de contenus sur mesure" },
      { step: "03", title: "Animation", description: "Sessions interactives et pratiques" },
      { step: "04", title: "Évaluation des acquis", description: "Mesure de l'impact et certification" },
    ],
    features: [
      "Formation en comptabilité et gestion",
      "Séminaires de fiscalité pratique",
      "Ateliers entrepreneuriat et création d'entreprise",
      "Formations sur mesure en entreprise",
    ],
  },
  {
    slug: "coworking-domiciliation",
    icon: MapPin,
    image: "/images/services/synergia.jpg",
    heroImage: "/images/coworking-main.jpg",
    title: "Co-working & Domiciliation d'entreprise",
    shortDescription:
      "Espaces de travail modernes, domiciliation commerciale et accompagnement entrepreneurial au coeur d'Abidjan.",
    fullDescription:
      "Bénéficiez d'un espace de travail professionnel au coeur du Plateau et d'un service de domiciliation commerciale pour légitimer votre présence à Abidjan.",
    problematics: [
      "Pas de bureau professionnel",
      "Besoin d'une adresse commerciale",
      "Environnement de travail isole",
      "Cout d'un bureau trop élevé",
    ],
    valueProposition:
      "Un espace moderne, une communauté d'entrepreneurs et un accompagnement professionnel intégré — tout ce dont vous avez besoin pour vous concentrer sur votre coeur de métier.",
    process: [
      { step: "01", title: "Visite des locaux", description: "Découverte de nos espaces de travail" },
      { step: "02", title: "Choix de la formule", description: "Sélection selon vos besoins" },
      { step: "03", title: "Contractualisation", description: "Signature et formalités" },
      { step: "04", title: "Installation", description: "Mise a disposition et accompagnement" },
    ],
    features: [
      "Bureaux individuels et espaces partages",
      "Salle de réunion et espace détente",
      "Domiciliation commerciale avec réception du courrier",
      "Accompagnement entrepreneurial inclus",
    ],
  },
];
