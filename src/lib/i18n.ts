import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import LanguageDetector from "i18next-browser-languagedetector";

const resources = {
  fr: {
    translation: {
      nav: {
        home: "Accueil",
        about: "À propos",
        services: "Nos Services",
        solutions: "Nos Solutions",
        documentation: "Nos Documents",
        blog: "Blog",
        contact: "Contact",
        appointment: "Prendre rendez-vous",
        coworking: "Co-working",
        surveys: "Sondages",
      },
      header: {
        cta: "Prendre rendez-vous",
      },
      footer: {
        tagline: "Grandir sans visibilite est un risque.",
        services: "Nos Services",
        navigation: "Navigation",
        contact: "Contact",
        phone: "Telephone",
        email: "Email",
        address: "Adresse",
        hours: "Horaires",
        rights: "Tous droits reserves",
        legal: "Mentions legales",
        privacy: "Politique de confidentialite",
      },
      buttons: {
        learnMore: "En savoir plus",
        contactUs: "Nous contacter",
        appointment: "Prendre rendez-vous",
        discover: "Decouvrir nos services",
        send: "Envoyer",
        submit: "Confirmer",
        buy: "Acheter",
        seeAll: "Voir tous les articles",
        backHome: "Retour a l'accueil",
      },
      form: {
        firstName: "Prenom",
        lastName: "Nom",
        email: "Email",
        phone: "Telephone",
        company: "Entreprise",
        service: "Service concerne",
        date: "Date souhaitee",
        timeSlot: "Creaneau horaire",
        message: "Message",
        subject: "Sujet",
        required: "Ce champ est requis",
        invalidEmail: "Email invalide",
        minChars: "Minimum {{count}} caracteres",
        success: "Votre message a bien ete envoye !",
        error: "Une erreur est survenue. Veuillez reessayer.",
      },
      languages: {
        fr: "Français",
        en: "English",
        es: "Espanol",
      },
      hero: {
        label: "Cabinet de Conseil Multidisciplinaire",
        title: "Passer de la survie à la croissance",
        subtitle: "Andoh & Dohgad Consulting accompagne les entrepreneurs ivoiriens dans la structuration, la gestion et la croissance de leurs entreprises.",
        cta1: "Découvrir nos services",
        cta2: "Prendre rendez-vous",
      },
      home: {
        ctaTitle: "Prêt à structurer votre entreprise et accélérer votre croissance ?",
        ctaButton: "Nous contacter",
      },
    },
  },
  en: {
    translation: {
      nav: {
        home: "Home",
        about: "About",
        services: "Our Services",
        solutions: "Our Solutions",
        documentation: "Our Documents",
        blog: "Blog",
        contact: "Contact",
        appointment: "Book appointment",
        coworking: "Co-working",
        surveys: "Surveys",
      },
      header: {
        cta: "Book appointment",
      },
      footer: {
        tagline: "Growing without visibility is a risk.",
        services: "Our Services",
        navigation: "Navigation",
        contact: "Contact",
        phone: "Phone",
        email: "Email",
        address: "Address",
        hours: "Hours",
        rights: "All rights reserved",
        legal: "Legal notices",
        privacy: "Privacy policy",
      },
      buttons: {
        learnMore: "Learn more",
        contactUs: "Contact us",
        appointment: "Book appointment",
        discover: "Discover our services",
        send: "Send",
        submit: "Submit",
        buy: "Buy",
        seeAll: "See all articles",
        backHome: "Back to home",
      },
      form: {
        firstName: "First name",
        lastName: "Last name",
        email: "Email",
        phone: "Phone",
        company: "Company",
        service: "Service",
        date: "Preferred date",
        timeSlot: "Time slot",
        message: "Message",
        subject: "Subject",
        required: "This field is required",
        invalidEmail: "Invalid email",
        minChars: "Minimum {{count}} characters",
        success: "Your message has been sent successfully!",
        error: "An error occurred. Please try again.",
      },
      languages: {
        fr: "French",
        en: "English",
        es: "Spanish",
      },

      hero: {
        label: "Multidisciplinary Consulting Firm",
        title: "From survival to growth",
        subtitle: "Andoh & Dohgad Consulting supports Ivorian entrepreneurs in structuring, managing and growing their businesses.",
        cta1: "Discover our services",
        cta2: "Book appointment",
      },
      home: {
        ctaTitle: "Ready to structure your business and accelerate your growth?",
        ctaButton: "Contact us",
      },
    },
  },
  es: {
    translation: {
      nav: {
        home: "Inicio",
        about: "Nosotros",
        services: "Nuestros Servicios",
        solutions: "Nuestras Soluciones",
        documentation: "Nuestros Documentos",
        blog: "Blog",
        contact: "Contacto",
        appointment: "Pedir cita",
        coworking: "Co-working",
        surveys: "Encuestas",
      },
      header: {
        cta: "Pedir cita",
      },
      footer: {
        tagline: "Crecer sin visibilidad es un riesgo.",
        services: "Nuestros Servicios",
        navigation: "Navegacion",
        contact: "Contacto",
        phone: "Telefono",
        email: "Correo electronico",
        address: "Direccion",
        hours: "Horario",
        rights: "Todos los derechos reservados",
        legal: "Avisos legales",
        privacy: "Politica de privacidad",
      },
      buttons: {
        learnMore: "Saber mas",
        contactUs: "Contactarnos",
        appointment: "Pedir cita",
        discover: "Descubrir nuestros servicios",
        send: "Enviar",
        submit: "Confirmar",
        buy: "Comprar",
        seeAll: "Ver todos los articulos",
        backHome: "Volver al inicio",
      },
      form: {
        firstName: "Nombre",
        lastName: "Apellido",
        email: "Correo electronico",
        phone: "Telefono",
        company: "Empresa",
        service: "Servicio",
        date: "Fecha deseada",
        timeSlot: "Franja horaria",
        message: "Mensaje",
        subject: "Asunto",
        required: "Este campo es obligatorio",
        invalidEmail: "Correo invalido",
        minChars: "Minimo {{count}} caracteres",
        success: "Su mensaje ha sido enviado correctamente!",
        error: "Se produjo un error. Por favor intente de nuevo.",
      },
      languages: {
        fr: "Frances",
        en: "Ingles",
        es: "Espanol",
      },
      hero: {
        label: "Firma de Consultoría Multidisciplinaria",
        title: "De la supervivencia al crecimiento",
        subtitle: "Andoh & Dohgad Consulting apoya a los empresarios marfileños en la estructuración, gestión y crecimiento de sus negocios.",
        cta1: "Descubrir nuestros servicios",
        cta2: "Pedir cita",
      },
      home: {
        ctaTitle: "¿Listo para estructurar su empresa y acelerar su crecimiento?",
        ctaButton: "Contactarnos",
      },
    },
  },
};

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources,
    fallbackLng: "fr", // Si une clé manque en EN/ES, utiliser FR
    lng: "fr",
    interpolation: {
      escapeValue: false,
    },
    detection: {
      order: ["localStorage", "navigator"],
      caches: ["localStorage"],
    },
    // Configuration pour éviter les erreurs de clés manquantes
    returnNull: false, // Ne jamais retourner null
    returnEmptyString: false, // Ne jamais retourner une chaîne vide
    returnObjects: false, // Ne pas retourner des objets
    saveMissing: false, // Ne pas sauvegarder les clés manquantes
    missingKeyHandler: (lng, ns, key) => {
      // Logger les clés manquantes en dev
      if (import.meta.env.DEV) {
        console.warn(`[i18n] Missing translation: ${lng}.${ns}.${key}`);
      }
    },
  });

export default i18n;
