import { Link } from "react-router-dom";
import { Home, ArrowLeft, Search } from "lucide-react";

export default function NotFound() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-primary via-primary-dark to-secondary flex items-center justify-center px-4">
      <div className="max-w-2xl w-full text-center">
        {/* Logo */}
        <div className="mb-8">
          <div className="w-24 h-24 mx-auto rounded-full bg-white shadow-2xl flex items-center justify-center p-2 mb-6">
            <img
              src="/images/logo.png"
              alt="Andoh & Dohgad Consulting"
              className="w-full h-full object-contain rounded-full"
            />
          </div>
        </div>

        {/* 404 */}
        <h1 className="font-display text-9xl font-bold text-white mb-4">
          404
        </h1>

        {/* Message */}
        <h2 className="font-display text-3xl font-semibold text-white mb-4">
          Page introuvable
        </h2>
        <p className="text-white/80 text-lg mb-8 max-w-md mx-auto">
          Désolé, la page que vous recherchez n'existe pas ou a été déplacée.
        </p>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
          <Link
            to="/"
            className="inline-flex items-center gap-2 px-6 py-3 bg-accent text-dark font-semibold rounded-lg hover:bg-accent/90 transition-all duration-300 shadow-lg hover:shadow-xl"
          >
            <Home className="w-5 h-5" />
            Retour à l'accueil
          </Link>
          <Link
            to="/contact"
            className="inline-flex items-center gap-2 px-6 py-3 bg-white/10 text-white font-semibold rounded-lg hover:bg-white/20 border border-white/30 transition-all duration-300"
          >
            <Search className="w-5 h-5" />
            Nous contacter
          </Link>
        </div>

        {/* Liens utiles */}
        <div className="mt-12 pt-8 border-t border-white/20">
          <p className="text-white/60 text-sm mb-4">Pages populaires :</p>
          <div className="flex flex-wrap gap-3 justify-center">
            <Link to="/services" className="text-white/80 hover:text-white text-sm underline">
              Nos Services
            </Link>
            <span className="text-white/40">•</span>
            <Link to="/a-propos" className="text-white/80 hover:text-white text-sm underline">
              À propos
            </Link>
            <span className="text-white/40">•</span>
            <Link to="/blog" className="text-white/80 hover:text-white text-sm underline">
              Blog
            </Link>
            <span className="text-white/40">•</span>
            <Link to="/rendez-vous" className="text-white/80 hover:text-white text-sm underline">
              Prendre rendez-vous
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}