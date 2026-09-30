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
      {/* Globe Background - Full footer */}
      <div className="absolute inset-0 opacity-[0.08] pointer-events-none overflow-hidden">
        <svg viewBox="0 0 600 600" className="absolute w-full h-full min-w-full" preserveAspectRatio="xMidYMid slice" fill="none" xmlns="http://www.w3.org/2000/svg">
          {/* Globe circle */}
          <circle cx="300" cy="300" r="250" stroke="white" strokeWidth="2" fill="none" opacity="0.3"/>

          {/* Latitude lines */}
          <ellipse cx="300" cy="300" rx="250" ry="80" stroke="white" strokeWidth="1.5" fill="none" opacity="0.25"/>
          <ellipse cx="300" cy="300" rx="250" ry="150" stroke="white" strokeWidth="1.5" fill="none" opacity="0.25"/>
          <line x1="50" y1="300" x2="550" y2="300" stroke="white" strokeWidth="1.5" opacity="0.3"/>
          <ellipse cx="300" cy="300" rx="250" ry="220" stroke="white" strokeWidth="1.5" fill="none" opacity="0.25"/>

          {/* Longitude lines */}
          <ellipse cx="300" cy="300" rx="80" ry="250" stroke="white" strokeWidth="1.5" fill="none" opacity="0.25"/>
          <ellipse cx="300" cy="300" rx="150" ry="250" stroke="white" strokeWidth="1.5" fill="none" opacity="0.25"/>
          <line x1="300" y1="50" x2="300" y2="550" stroke="white" strokeWidth="1.5" opacity="0.3"/>

          {/* Africa continent (simplified) */}
          <path d="M 320 180 C 325 175 335 175 345 180 C 355 185 365 195 372 210 C 380 225 385 245 387 265 C 389 285 388 305 385 325 C 382 345 377 365 375 385 C 373 405 373 425 378 442 C 383 459 392 473 402 485 C 412 497 423 507 430 520 C 432 515 433 510 432 505 C 430 490 425 475 418 462 C 411 449 402 437 395 424 C 388 411 383 397 382 382 C 381 367 383 352 388 338 C 393 324 400 311 407 298 C 414 285 420 272 423 258 C 426 244 426 229 423 215 C 420 201 414 188 406 177 C 398 166 388 157 377 151 C 366 145 354 142 342 142 C 330 142 318 145 308 151 C 298 157 290 166 284 177 C 278 188 274 201 273 215 C 272 229 273 243 277 256 C 281 269 287 281 295 292 C 303 303 312 313 320 324 C 328 335 335 347 340 360 C 345 373 348 387 348 402 C 348 417 346 432 341 446 C 336 460 329 473 320 484 C 311 495 300 504 288 510 L 295 515 C 308 508 320 498 330 486 C 340 474 348 460 353 445 C 358 430 361 414 361 398 C 361 382 358 366 353 351 C 348 336 340 322 331 309 C 322 296 312 284 303 272 C 294 260 286 247 281 233 C 276 219 273 204 273 189 C 273 174 276 159 282 145 C 288 131 296 118 307 108 C 318 98 331 91 345 88 C 359 85 374 85 388 89 C 402 93 415 100 426 110 C 437 120 445 133 450 147 C 455 161 457 176 456 191 C 455 206 451 221 445 235 C 439 249 431 262 422 274 C 413 286 404 297 397 310 C 390 323 385 337 383 352 C 381 367 382 383 386 398 C 390 413 397 427 406 439 C 415 451 426 461 437 470 C 437 463 436 456 433 449 C 426 433 416 419 405 407 C 394 395 382 385 373 372 C 364 359 358 344 356 328 C 354 312 355 296 360 281 C 365 266 373 252 383 240 C 393 228 405 218 417 210 C 429 202 442 196 455 193 L 450 188 C 437 191 425 197 414 205 C 403 213 393 223 385 235 C 377 247 371 260 367 275 C 363 290 361 306 362 322 C 363 338 367 354 374 368 C 381 382 390 395 401 406 C 412 417 424 426 435 437 C 438 440 440 444 442 448 L 438 445 C 426 435 415 424 405 411 C 395 398 387 384 382 369 C 377 354 375 338 377 322 C 379 306 384 291 392 277 C 400 263 410 251 422 241 C 434 231 447 223 461 218 L 457 213 C 443 218 430 226 419 236 C 408 246 399 258 393 272 C 387 286 383 301 382 317 C 381 333 383 349 388 364 C 393 379 401 393 411 405 C 421 417 433 427 445 436 L 442 433 C 430 424 419 413 410 401 C 401 389 394 376 390 362 C 386 348 385 333 387 318 C 389 303 394 289 402 276 C 410 263 420 252 432 243 L 428 239 C 416 248 406 259 399 272 C 392 285 388 300 387 315 C 386 330 388 346 393 360 C 398 374 406 387 416 398 L 413 395 C 403 384 396 371 392 357 C 388 343 387 328 389 313 C 391 298 396 284 404 272 L 401 269 C 393 281 388 295 387 310 C 386 325 388 340 393 354 L 390 351 C 385 337 383 322 385 307 L 382 305 C 380 320 382 335 388 349 L 320 180 Z" fill="white" opacity="0.5"/>

          {/* Africa highlight dot */}
          <circle cx="340" cy="320" r="6" fill="#F5C518" opacity="0.8"/>

          {/* Connection lines from globe to world */}
          <line x1="340" y1="320" x2="200" y2="200" stroke="#F5C518" strokeWidth="1" strokeDasharray="4 4" opacity="0.4"/>
          <line x1="340" y1="320" x2="480" y2="250" stroke="#F5C518" strokeWidth="1" strokeDasharray="4 4" opacity="0.4"/>
          <line x1="340" y1="320" x2="420" y2="450" stroke="#F5C518" strokeWidth="1" strokeDasharray="4 4" opacity="0.4"/>
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
