import { Link } from "react-router-dom";
import { Phone, Mail, MapPin, Facebook, Linkedin } from "lucide-react";
import { services } from "@/data/services";

const navLabels: Record<string, string> = {"home": "Accueil", "about": "À propos", "services": "Nos Services", "solutions": "Nos Solutions", "request": "Demande de service", "documentation": "Nos Documents", "blog": "Blog", "contact": "Contact", "appointment": "Prendre rendez-vous", "coworking": "Co-working"};

const navLinks = [
  { label: "home", href: "/" },
  { label: "about", href: "/a-propos" },
  { label: "solutions", href: "/solutions" },
  { label: "documentation", href: "/documentation" },
  { label: "blog", href: "/blog" },
  { label: "contact", href: "/contact" },
  { label: "appointment", href: "/rendez-vous" },
  { label: "coworking", href: "/co-working" },
  { label: "request", href: "/demande-service" },
];

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-primary text-white relative overflow-hidden">
      {/* World Map Background - All Continents */}
      <div className="absolute inset-0 opacity-[0.15] pointer-events-none overflow-hidden">
        <svg viewBox="0 0 1200 600" className="absolute w-full h-full min-w-full" preserveAspectRatio="xMidYMid slice" fill="none" xmlns="http://www.w3.org/2000/svg">

          {/* Afrique - Highlighted in gold */}
          <path d="M 580 180 L 590 170 L 605 165 L 620 168 L 632 175 L 642 188 L 650 205 L 655 225 L 658 245 L 658 265 L 656 285 L 652 305 L 648 325 L 645 345 L 644 365 L 645 385 L 648 405 L 653 423 L 660 438 L 668 450 L 675 460 L 680 468 L 683 475 L 684 482 L 682 488 L 678 493 L 672 497 L 665 500 L 658 502 L 650 503 L 642 503 L 634 502 L 626 500 L 618 497 L 610 493 L 602 488 L 594 482 L 587 475 L 581 468 L 576 460 L 572 450 L 569 438 L 567 425 L 566 410 L 566 395 L 567 380 L 569 365 L 572 350 L 576 335 L 580 320 L 584 305 L 587 290 L 589 275 L 590 260 L 590 245 L 588 230 L 585 215 L 581 200 L 577 188 L 573 178 L 570 172 L 568 168 L 567 166 L 568 165 L 571 166 L 575 170 L 578 176 Z" fill="#F5C518" fillOpacity="0.4" stroke="#F5C518" strokeWidth="2" strokeOpacity="0.6"/>

          {/* Europe */}
          <path d="M 580 140 L 595 138 L 610 140 L 625 145 L 638 152 L 648 162 L 655 173 L 658 185 L 657 197 L 653 208 L 647 217 L 640 224 L 632 229 L 623 232 L 614 233 L 605 232 L 596 229 L 588 224 L 581 217 L 575 208 L 571 197 L 569 185 L 569 173 L 571 162 L 575 152 Z" fill="white" fillOpacity="0.3" stroke="white" strokeWidth="1.5" strokeOpacity="0.5"/>

          {/* Asie */}
          <path d="M 685 150 L 710 145 L 735 143 L 760 145 L 785 150 L 808 158 L 828 170 L 845 185 L 858 203 L 868 223 L 875 245 L 878 268 L 878 291 L 875 314 L 868 335 L 858 354 L 845 370 L 828 383 L 808 393 L 785 400 L 760 403 L 735 403 L 710 400 L 688 393 L 668 383 L 651 370 L 638 354 L 628 335 L 622 314 L 619 291 L 619 268 L 622 245 L 628 223 L 638 203 L 651 185 L 668 170 Z" fill="white" fillOpacity="0.3" stroke="white" strokeWidth="1.5" strokeOpacity="0.5"/>

          {/* Amérique du Nord */}
          <path d="M 180 120 L 205 115 L 230 113 L 255 115 L 278 122 L 298 133 L 315 148 L 328 166 L 338 187 L 345 210 L 348 234 L 348 258 L 345 281 L 338 303 L 328 323 L 315 340 L 298 354 L 278 364 L 255 371 L 230 374 L 205 374 L 180 371 L 157 364 L 137 354 L 120 340 L 107 323 L 97 303 L 90 281 L 87 258 L 87 234 L 90 210 L 97 187 L 107 166 L 120 148 L 137 133 L 157 122 Z" fill="white" fillOpacity="0.3" stroke="white" strokeWidth="1.5" strokeOpacity="0.5"/>

          {/* Amérique du Sud */}
          <path d="M 280 360 L 295 358 L 310 360 L 323 365 L 334 373 L 342 384 L 348 397 L 351 412 L 352 428 L 351 444 L 348 459 L 342 473 L 334 485 L 323 494 L 310 500 L 295 503 L 280 503 L 265 500 L 252 494 L 241 485 L 233 473 L 227 459 L 224 444 L 223 428 L 224 412 L 227 397 L 233 384 L 241 373 L 252 365 L 265 358 Z" fill="white" fillOpacity="0.3" stroke="white" strokeWidth="1.5" strokeOpacity="0.5"/>

          {/* Océanie/Australie */}
          <path d="M 880 380 L 905 378 L 930 380 L 953 386 L 973 396 L 990 410 L 1003 427 L 1012 447 L 1017 469 L 1018 492 L 1015 514 L 1008 535 L 997 553 L 983 568 L 965 579 L 945 586 L 923 589 L 900 588 L 877 583 L 856 574 L 838 561 L 823 545 L 812 526 L 805 505 L 802 483 L 802 460 L 805 438 L 812 417 L 823 399 L 838 384 L 856 373 L 877 366 Z" fill="white" fillOpacity="0.3" stroke="white" strokeWidth="1.5" strokeOpacity="0.5"/>

          {/* Antarctique */}
          <path d="M 200 540 L 300 535 L 400 533 L 500 535 L 600 538 L 700 540 L 800 542 L 900 543 L 1000 542 L 1000 570 L 900 572 L 800 573 L 700 573 L 600 572 L 500 570 L 400 568 L 300 567 L 200 568 Z" fill="white" fillOpacity="0.3" stroke="white" strokeWidth="1.5" strokeOpacity="0.5"/>

          {/* Groenland */}
          <path d="M 370 50 L 385 48 L 400 50 L 413 55 L 423 63 L 430 74 L 434 87 L 435 101 L 433 115 L 428 128 L 420 139 L 410 147 L 398 152 L 385 154 L 372 152 L 360 147 L 350 139 L 342 128 L 337 115 L 335 101 L 336 87 L 340 74 L 347 63 L 357 55 Z" fill="white" fillOpacity="0.3" stroke="white" strokeWidth="1.5" strokeOpacity="0.5"/>

          {/* Madagascar */}
          <path d="M 670 420 L 675 418 L 680 420 L 683 424 L 684 430 L 683 438 L 680 446 L 675 452 L 670 454 L 665 452 L 662 446 L 661 438 L 662 430 L 665 424 Z" fill="#F5C518" fillOpacity="0.3" stroke="#F5C518" strokeWidth="1" strokeOpacity="0.5"/>

          {/* Point sur Côte d'Ivoire */}
          <circle cx="570" cy="295" r="5" fill="#F5C518" fillOpacity="0.9"/>
          <circle cx="570" cy="295" r="8" fill="none" stroke="#F5C518" strokeWidth="2" strokeOpacity="0.6"/>
        </svg>
      </div>

      <div className="container-xl pt-16 lg:pt-24 pb-8 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 lg:gap-8">
          {/* Brand Column */}
          <div className="lg:col-span-1">
            <Link to="/" className="inline-block mb-4">
              <div className="w-16 h-16 lg:w-20 lg:h-20 rounded-full bg-white shadow-lg flex items-center justify-center p-1">
                <img
                  src="/images/logo.png"
                  alt="Andoh & Dohgad Consulting"
                  className="w-full h-full object-contain rounded-full"
                />
              </div>
            </Link>
            <p className="text-white/70 text-sm italic mb-6 font-display">
              &ldquo;{"Grandir sans visibilité est un risque."}&rdquo;
            </p>
            <div className="flex items-center gap-4">
              <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" className="w-9 h-9 rounded-full border border-white/30 flex items-center justify-center hover:bg-accent hover:border-accent transition-all duration-300 group">
                <Facebook className="w-4 h-4 text-white/80 group-hover:text-dark" />
              </a>
              <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" className="w-9 h-9 rounded-full border border-white/30 flex items-center justify-center hover:bg-accent hover:border-accent transition-all duration-300 group">
                <Linkedin className="w-4 h-4 text-white/80 group-hover:text-dark" />
              </a>
              <a href="https://wa.me/2250709577530" target="_blank" rel="noopener noreferrer" className="w-9 h-9 rounded-full border border-white/30 flex items-center justify-center hover:bg-accent hover:border-accent transition-all duration-300 group">
                <svg className="w-4 h-4 text-white/80 group-hover:text-dark" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                </svg>
              </a>
            </div>
          </div>

          {/* Services Column */}
          <div>
            <h4 className="text-white font-semibold text-base mb-5 font-body">
              {"Nos Services"}
            </h4>
            <ul className="space-y-2.5">
              {services.map((s) => (
                <li key={s.slug}>
                  <Link
                    to={`/services/${s.slug}`}
                    className="text-white/70 text-sm hover:text-accent hover:translate-x-1 inline-block transition-all duration-300"
                  >
                    {s.title}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Navigation Column */}
          <div>
            <h4 className="text-white font-semibold text-base mb-5 font-body">
              {"Navigation"}
            </h4>
            <ul className="space-y-2.5">
              {navLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    to={link.href}
                    className="text-white/70 text-sm hover:text-accent hover:translate-x-1 inline-block transition-all duration-300"
                  >
                    {navLabels[link.label]}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Column */}
          <div>
            <h4 className="text-white font-semibold text-base mb-5 font-body">
              {"Contact"}
            </h4>
            <ul className="space-y-3.5">
              <li className="flex items-start gap-3">
                <Phone className="w-4 h-4 text-accent mt-0.5 shrink-0" />
                <div className="text-white/70 text-sm space-y-1">
                  <p>+225 07 09 57 75 30</p>
                  <p>+225 07 09 20 46 62</p>
                </div>
              </li>
              <li className="flex items-start gap-3">
                <Mail className="w-4 h-4 text-accent mt-0.5 shrink-0" />
                <a
                  href="mailto:andoh.dohgad@gmail.com"
                  className="text-white/70 text-sm hover:text-accent transition-colors"
                >
                  andoh.dohgad@gmail.com
                </a>
              </li>
              <li className="flex items-start gap-3">
                <MapPin className="w-4 h-4 text-accent mt-0.5 shrink-0" />
                <p className="text-white/70 text-sm">
                  AfricaWorks, Plateau Rue du Commerce, Abidjan
                </p>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-12 pt-6 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-white/50 text-xs">
            &copy; {currentYear} Andoh & Dohgad Consulting. {"Tous droits réservés"}.
          </p>
          <div className="flex items-center gap-4">
            <Link
              to="/mentions-legales"
              className="text-white/50 text-xs hover:text-white/70 transition-colors"
            >
              {"Mentions légales"}
            </Link>
            <Link
              to="/politique-confidentialite"
              className="text-white/50 text-xs hover:text-white/70 transition-colors"
            >
              {"Politique de confidentialité"}
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
