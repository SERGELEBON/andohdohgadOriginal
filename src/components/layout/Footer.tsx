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
      {/* Africa Map Background */}
      <div className="absolute inset-0 opacity-[0.07] pointer-events-none flex items-center justify-end pr-12">
        <svg viewBox="0 0 800 900" className="w-full h-full max-w-2xl" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M400 100C420 95 440 92 455 95C470 98 480 105 490 115C500 125 510 140 520 155C530 170 540 185 545 200C550 215 552 230 548 245C544 260 535 275 525 288C515 301 503 312 495 325C487 338 483 353 482 368C481 383 483 398 490 412C497 426 508 439 520 450C532 461 545 470 555 482C565 494 572 509 575 525C578 541 577 558 572 574C567 590 558 605 547 618C536 631 523 642 512 655C501 668 492 683 488 700C484 717 485 735 490 752C495 769 504 785 515 799C526 813 539 825 550 838C561 851 570 865 575 880L570 885C565 870 555 857 544 844C533 831 520 819 508 806C496 793 486 779 480 763C474 747 472 730 475 713C478 696 485 680 495 666C505 652 517 640 528 627C539 614 549 600 555 585C561 570 563 554 561 538C559 522 553 507 544 494C535 481 524 470 512 460C500 450 487 441 478 429C469 417 463 403 461 388C459 373 461 358 465 343C469 328 475 314 484 301C493 288 504 276 513 263C522 250 529 236 532 221C535 206 534 191 530 177C526 163 519 150 510 139C501 128 490 119 478 112C466 105 453 100 439 98C425 96 410 97 396 100C382 103 368 108 356 116C344 124 333 134 325 146C317 158 311 172 308 187C305 202 305 218 308 233C311 248 317 262 326 275C335 288 346 299 358 308C370 317 383 324 395 333C407 342 418 353 426 366C434 379 439 394 441 410C443 426 442 442 438 458C434 474 427 489 418 503C409 517 398 530 388 544C378 558 369 573 363 589C357 605 354 622 355 639C356 656 360 673 368 688C376 703 387 717 400 729C413 741 428 751 443 760C458 769 473 777 486 787C499 797 510 809 518 823L512 827C503 814 491 803 478 794C465 785 451 777 437 769C423 761 409 752 397 741C385 730 375 717 368 703C361 689 357 674 356 658C355 642 357 626 363 611C369 596 377 582 387 569C397 556 408 544 418 531C428 518 437 504 444 489C451 474 456 458 458 442C460 426 459 410 455 395C451 380 444 366 434 354C424 342 412 332 399 324C386 316 372 310 359 302C346 294 334 285 324 274C314 263 306 250 301 236C296 222 294 207 295 192C296 177 300 162 307 149C314 136 323 124 334 114C345 104 358 96 371 90C384 84 398 80 412 78C426 76 441 76 455 79Z" fill="white" fillOpacity="0.8"/>
          <ellipse cx="420" cy="380" rx="8" ry="8" fill="#F5C518" fillOpacity="0.9"/>
          <text x="420" y="415" fontSize="16" fill="#F5C518" fillOpacity="0.9" textAnchor="middle" fontWeight="600">Côte d'Ivoire</text>
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
