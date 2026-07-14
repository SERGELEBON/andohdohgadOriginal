import {
  Calculator, Users, Building2, TrendingUp, GraduationCap, MapPin,
} from "lucide-react";
import type { Service } from "@/types";

export const services: Service[] = [
  {
    slug: "comptable-fiscal",
    icon: Calculator,
    title: "Accompagnement comptable et fiscal",
    shortDescription:
      "Tenue comptable, declarations fiscales, optimisation fiscale et conseil personnalise pour maitriser votre environnement financier.",
    fullDescription:
      "Andoh & Dohgad Consulting vous accompagne dans la gestion de votre comptabilite et de vos obligations fiscales. Notre equipe d'experts assure la tenue de vos livres, l'etablissement de vos etats financiers et le respect de vos declarations aupres des autorites competentes.",
    problematics: [
      "Tenue comptable irreguliere",
      "Conformite fiscale incertaine",
      "Optimisation fiscale insuffisante",
      "Manque de visibilite financiere",
    ],
    valueProposition:
      "Notre expertise approfondie de la fiscalite ivoirienne et notre approche personnalisee nous permettent de vous offrir des solutions adaptees a votre secteur d'activite et a votre taille.",
    process: [
      { step: "01", title: "Diagnostic financier", description: "Analyse complete de votre situation comptable et fiscale actuelle" },
      { step: "02", title: "Mise en conformite", description: "Regularisation et mise a jour de vos declarations" },
      { step: "03", title: "Accompagnement mensuel", description: "Tenue comptable reguliere et declarations periodiques" },
      { step: "04", title: "Rapport et recommandations", description: "Etats financiers et conseils d'optimisation" },
    ],
    features: [
      "Tenue comptable et etablissement des etats financiers",
      "Declarations fiscales et sociales (DGI, CNPS)",
      "Optimisation fiscale et planification patrimoniale",
      "Assistance lors des controles fiscaux",
    ],
  },
  {
    slug: "ressources-humaines",
    icon: Users,
    title: "Gestion des ressources humaines",
    shortDescription:
      "Recrutement, paie, formation, gestion des talents et conformite sociale pour batir des equipes performantes.",
    fullDescription:
      "Nous offrons des solutions completes en gestion des ressources humaines pour vous aider a recruter, former et retenir les meilleurs talents tout en assurant la conformite avec la legislation du travail.",
    problematics: [
      "Difficultes de recrutement",
      "Gestion de paie complexe",
      "Non-conformite sociale",
      "Turnover eleve",
    ],
    valueProposition:
      "Notre connaissance du marche de l'emploi ivoirien et notre methodologie eprouvee en gestion des talents font de nous un partenaire RH de choix.",
    process: [
      { step: "01", title: "Audit RH", description: "Evaluation complete de votre fonction RH" },
      { step: "02", title: "Plan d'action", description: "Elaboration de strategies RH adaptees" },
      { step: "03", title: "Mise en oeuvre", description: "Deploiement des solutions identifiees" },
      { step: "04", title: "Suivi et ajustement", description: "Evaluation et optimisation continue" },
    ],
    features: [
      "Recrutement et selection de profils",
      "Gestion de la paie et des declarations sociales",
      "Formation et developpement des competences",
      "Conseil en organisation et management",
    ],
  },
  {
    slug: "creation-entreprise",
    icon: Building2,
    title: "Creation et structuration d'entreprise",
    shortDescription:
      "Du choix du statut juridique aux formalites d'immatriculation, nous vous guidons dans chaque etape de votre creation.",
    fullDescription:
      "Vous avez un projet entrepreneurial ? Nous vous guidons de A a Z dans la creation de votre entreprise, du choix du statut juridique a l'immatriculation finale.",
    problematics: [
      "Statut juridique mal adapte",
      "Formalites complexes",
      "Manque de conseil structure",
      "Delai de creation long",
    ],
    valueProposition:
      "Notre experience dans l'accompagnement de plus de 200 creations d'entreprise nous permet d'anticiper les obstacles et d'accelerer vos demarches.",
    process: [
      { step: "01", title: "Etude de faisabilite", description: "Analyse de votre projet et du marche" },
      { step: "02", title: "Choix de la structure", description: "Selection du statut juridique optimal" },
      { step: "03", title: "Constitution du dossier", description: "Preparation et depot des documents" },
      { step: "04", title: "Immatriculation", description: "Obtention du RCCM et lancement" },
    ],
    features: [
      "Choix du statut juridique adapte",
      "Verification de la denomination sociale",
      "Constitution du dossier et formalites",
      "Immatriculation au RCCM et a la DGI",
    ],
  },
  {
    slug: "conseil-strategique",
    icon: TrendingUp,
    title: "Conseil et accompagnement strategique",
    shortDescription:
      "Analyse de marche, planification strategique, tableaux de bord et conseil en gestion pour des decisions eclairees.",
    fullDescription:
      "Nos consultants en strategie vous aident a definir une vision claire, a etablir des objectifs mesurables et a mettre en place les outils de pilotage necessaires.",
    problematics: [
      "Strategie floue",
      "Croissance sans plan",
      "Manque d'indicateurs",
      "Concurrence agressive",
    ],
    valueProposition:
      "Une approche basee sur les donnees et l'experience terrain pour des recommandations actionnables et mesurables.",
    process: [
      { step: "01", title: "Diagnostic strategique", description: "Analyse approfondie de votre positionnement" },
      { step: "02", title: "Atelier de co-construction", description: "Elaboration collaborative de la strategie" },
      { step: "03", title: "Plan d'action detaille", description: "Definition des initiatives et des echeances" },
      { step: "04", title: "Suivi mensuel", description: "Accompagnement et ajustements reguliers" },
    ],
    features: [
      "Diagnostic strategique et financier",
      "Elaboration de business plans",
      "Tableaux de bord et indicateurs de performance",
      "Conseil en gestion et organisation",
    ],
  },
  {
    slug: "formation",
    icon: GraduationCap,
    title: "Formation et renforcement de capacites",
    shortDescription:
      "Programmes de formation sur mesure en comptabilite, gestion, fiscalite et entrepreneuriat pour vos equipes.",
    fullDescription:
      "Nos programmes de formation pratiques couvrent la comptabilite, la fiscalite, la gestion et l'entrepreneuriat. Formations en presentiel et en ligne disponibles.",
    problematics: [
      "Manque de competences internes",
      "Formation trop theorique",
      "Besoin de montee en competence rapide",
    ],
    valueProposition:
      "Des formateurs praticiens, des cas concrets et des supports pedagogiques adaptes au contexte africain.",
    process: [
      { step: "01", title: "Identification des besoins", description: "Evaluation des ecarts de competences" },
      { step: "02", title: "Conception du programme", description: "Developpement de contenus sur mesure" },
      { step: "03", title: "Animation", description: "Sessions interactives et pratiques" },
      { step: "04", title: "Evaluation des acquis", description: "Mesure de l'impact et certification" },
    ],
    features: [
      "Formation en comptabilite et gestion",
      "Seminaires de fiscalite pratique",
      "Ateliers entrepreneuriat et creation d'entreprise",
      "Formations sur mesure en entreprise",
    ],
  },
  {
    slug: "coworking-domiciliation",
    icon: MapPin,
    title: "Co-working & Domiciliation d'entreprise",
    shortDescription:
      "Espaces de travail modernes, domiciliation commerciale et accompagnement entrepreneurial au coeur d'Abidjan.",
    fullDescription:
      "Beneficiez d'un espace de travail professionnel au coeur du Plateau et d'un service de domiciliation commerciale pour legitimer votre presence a Abidjan.",
    problematics: [
      "Pas de bureau professionnel",
      "Besoin d'une adresse commerciale",
      "Environnement de travail isole",
      "Cout d'un bureau trop eleve",
    ],
    valueProposition:
      "Un espace moderne, une communaute d'entrepreneurs et un accompagnement professionnel integre — tout ce dont vous avez besoin pour vous concentrer sur votre coeur de metier.",
    process: [
      { step: "01", title: "Visite des locaux", description: "Decouverte de nos espaces de travail" },
      { step: "02", title: "Choix de la formule", description: "Selection selon vos besoins" },
      { step: "03", title: "Contractualisation", description: "Signature et formalites" },
      { step: "04", title: "Installation", description: "Mise a disposition et accompagnement" },
    ],
    features: [
      "Bureaux individuels et espaces partages",
      "Salle de reunion et espace detente",
      "Domiciliation commerciale avec reception du courrier",
      "Accompagnement entrepreneurial inclus",
    ],
  },
];
