import { useState, useEffect, type ReactNode } from "react";
import { Link } from "@tanstack/react-router";
import {
  Search,
  ShoppingBag,
  User,
  Heart,
  Menu,
  X,
  Instagram,
  Facebook,
  Youtube,
} from "lucide-react";
import { announcements, navLinks, logo } from "@/data/products";

export default function Layout({ children }: { children: ReactNode }) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isVisible, setIsVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      setIsScrolled(currentScrollY > 40);

      if (currentScrollY <= 40) {
        setIsVisible(true);
      } else if (currentScrollY > lastScrollY) {
        setIsVisible(false); // Hide on scroll down
      } else {
        setIsVisible(true); // Show when scrolling towards top
      }
      setLastScrollY(currentScrollY);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [lastScrollY]);

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col">
      {/* Announcement marquee */}
      <div className="bg-announce text-announce-foreground overflow-hidden shrink-0">
        <div className="flex animate-marquee whitespace-nowrap py-2 text-xs tracking-wide">
          {[...announcements, ...announcements, ...announcements, ...announcements].map((a, i) => (
            <span key={i} className="mx-10 inline-flex items-center font-medium">
              <span className="mr-10 opacity-50">◆</span>
              {a}
            </span>
          ))}
        </div>
      </div>

      {/* Header */}
      <header
        className={`shrink-0 sticky top-0 z-40 transition-all duration-300 transform ease-in-out ${
          isScrolled
            ? "bg-card/95 text-foreground border-b border-border/50 shadow-md backdrop-blur-md"
            : "bg-muted/40 text-foreground border-b border-border/20 backdrop-blur-md"
        } ${isVisible ? "translate-y-0" : "-translate-y-full"}`}
      >
        <div
          className={`mx-auto max-w-[1400px] relative flex items-center justify-between px-6 transition-all duration-300 ${
            isScrolled ? "py-3.5" : "py-5"
          }`}
        >
          {/* Left Column */}
          <div className="flex items-center gap-4 z-10">
            {/* Hamburger menu - mobile only */}
            <button
              className={`lg:hidden transition-colors ${
                isScrolled ? "text-white hover:text-white/80" : "text-foreground hover:text-primary"
              }`}
              onClick={() => setIsMobileMenuOpen(true)}
              aria-label="Open Menu"
            >
              <Menu className="h-5 w-5" />
            </button>
            {/* Search - desktop only */}
            <button
              className={`hidden lg:inline-flex items-center gap-2 text-sm transition-colors ${
                isScrolled
                  ? "text-white hover:text-white/80"
                  : "text-foreground/80 hover:text-foreground"
              }`}
              aria-label="Search"
            >
              <Search className="h-5 w-5" />
            </button>
          </div>

          {/* Centered Logo */}
          <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-10">
            <Link to="/" className="flex items-center justify-center">
              <img
                src={logo}
                alt="VASSIO Logo"
                className={`w-auto object-contain transition-all duration-300 ${
                  isScrolled ? "brightness-0 invert h-6 md:h-8" : "h-7 md:h-9"
                }`}
              />
            </Link>
          </div>

          {/* Right Column */}
          <div className="flex items-center gap-4 sm:gap-5 z-10">
            {/* Search - mobile only */}
            <button
              className={`lg:hidden transition-colors ${
                isScrolled
                  ? "text-white hover:text-white/80"
                  : "text-foreground/80 hover:text-foreground"
              }`}
              aria-label="Search"
            >
              <Search className="h-5 w-5" />
            </button>
            {/* Wishlist */}
            <button
              aria-label="Wishlist"
              className={`transition-colors ${
                isScrolled
                  ? "text-white hover:text-white/80"
                  : "text-foreground/80 hover:text-foreground"
              }`}
            >
              <Heart className="h-5 w-5" />
            </button>
            {/* Cart */}
            <button
              aria-label="Cart"
              className={`relative transition-colors ${
                isScrolled
                  ? "text-white hover:text-white/80"
                  : "text-foreground/80 hover:text-foreground"
              }`}
            >
              <ShoppingBag className="h-5 w-5" />
              <span
                className={`absolute -right-2 -top-2 grid h-4 w-4 place-items-center rounded-full text-[10px] font-bold transition-all duration-300 ${
                  isScrolled ? "bg-primary-foreground text-primary" : "bg-announce text-announce-foreground"
                }`}
              >
                0
              </span>
            </button>
          </div>
        </div>

        {/* Nav (Desktop) */}
        {!isScrolled && (
          <nav className="hidden lg:block border-t border-border/30 animate-in fade-in duration-300">
            <ul className="mx-auto flex max-w-[1400px] flex-wrap items-center justify-center gap-x-7 gap-y-2 px-6 py-3.5 text-[11px] font-semibold uppercase tracking-[0.2em] text-foreground/85">
              {navLinks.map((l) => (
                <li key={l}>
                  <Link
                    to="/"
                    className={`hover:text-primary transition-colors ${l === "Last Chance" ? "text-announce" : ""}`}
                  >
                    {l}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        )}
      </header>

      {/* Mobile Drawer Navigation */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 z-50 flex lg:hidden animate-in fade-in duration-200">
          {/* Overlay */}
          <div
            className="fixed inset-0 bg-black/60 backdrop-blur-sm"
            onClick={() => setIsMobileMenuOpen(false)}
          />
          {/* Drawer content */}
          <div className="relative flex flex-col w-full max-w-[300px] h-full bg-background p-6 shadow-2xl border-r border-border/40 animate-in slide-in-from-left duration-250">
            <div className="flex items-center justify-between pb-6 border-b border-border/20">
              <img
                src={logo}
                alt="VASSIO Logo"
                className="h-6 w-auto object-contain"
              />
              <button
                onClick={() => setIsMobileMenuOpen(false)}
                className="hover:text-primary transition-colors"
                aria-label="Close Menu"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <nav className="mt-8 flex-1">
              <ul className="space-y-6 text-sm font-semibold uppercase tracking-[0.15em] text-foreground/90">
                {navLinks.map((l) => (
                  <li key={l}>
                    <Link
                      to="/"
                      onClick={() => setIsMobileMenuOpen(false)}
                      className="block hover:text-primary transition-colors"
                    >
                      {l}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>

            <div className="border-t border-border/20 pt-6 mt-auto">
              <div className="flex justify-center gap-6 text-foreground/75">
                <a href="#" aria-label="Instagram" className="hover:text-primary transition-colors">
                  <Instagram className="h-5 w-5" />
                </a>
                <a href="#" aria-label="Facebook" className="hover:text-primary transition-colors">
                  <Facebook className="h-5 w-5" />
                </a>
                <a href="#" aria-label="Youtube" className="hover:text-primary transition-colors">
                  <Youtube className="h-5 w-5" />
                </a>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Main content body */}
      <main className="flex-1">{children}</main>

      {/* Footer */}
      <footer className="bg-primary text-primary-foreground shrink-0 mt-auto">
        <div className="mx-auto max-w-[1400px] px-6 py-12 md:py-20">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-x-6 gap-y-10 lg:gap-12">
            {/* Brand column */}
            <div className="col-span-2 lg:col-span-1">
              <img
                src={logo}
                alt="VASSIO Logo"
                className="h-8 w-auto brightness-0 invert object-contain"
              />
              <p className="mt-6 text-sm leading-relaxed text-primary-foreground/70 max-w-xs">
                Vassio brings warmth, craft and calm into your home — discover furniture, planters,
                decor, bedding, bath and kitchen essentials.
              </p>
              <div className="mt-6 flex gap-4 text-primary-foreground/80">
                <a href="#" aria-label="Instagram" className="hover:text-white transition-colors">
                  <Instagram className="h-4 w-4" />
                </a>
                <a href="#" aria-label="Facebook" className="hover:text-white transition-colors">
                  <Facebook className="h-4 w-4" />
                </a>
                <a href="#" aria-label="Youtube" className="hover:text-white transition-colors">
                  <Youtube className="h-4 w-4" />
                </a>
              </div>
            </div>

            {/* Quick Links */}
            <div className="col-span-1">
              <p className="text-xs uppercase tracking-[0.2em] font-bold">Quick Links</p>
              <ul className="mt-6 space-y-3.5 text-sm text-primary-foreground/70">
                {navLinks.map((l) => (
                  <li key={l}>
                    <Link to="/" className="hover:text-white transition-colors">
                      {l}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Support */}
            <div className="col-span-1">
              <p className="text-xs uppercase tracking-[0.2em] font-bold">Support</p>
              <ul className="mt-6 space-y-3.5 text-sm text-primary-foreground/70">
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    FAQs
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    Shipping & Delivery
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    Returns & Refunds
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    Privacy Policy
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    Terms of Service
                  </a>
                </li>
              </ul>
            </div>

            {/* Newsletter */}
            <div className="col-span-2 lg:col-span-1">
              <p className="text-xs uppercase tracking-[0.2em] font-bold">Newsletter</p>
              <p className="mt-6 text-sm text-primary-foreground/70 leading-relaxed">
                Subscribe to receive inspiration, updates, and exclusive access to new launches.
              </p>
              <form className="mt-5 flex gap-2" onSubmit={(e) => e.preventDefault()}>
                <input
                  type="email"
                  placeholder="Your email address"
                  className="flex-1 border-b border-primary-foreground/45 bg-transparent py-2.5 text-sm placeholder:text-primary-foreground/40 focus:border-primary-foreground focus:outline-none transition-colors"
                  required
                />
                <button
                  type="submit"
                  className="bg-accent text-accent-foreground px-5 py-2.5 text-[10px] font-semibold uppercase tracking-[0.2em] hover:bg-accent/90 transition duration-300"
                >
                  Join
                </button>
              </form>
            </div>
          </div>

          {/* Copyright line */}
          <div className="mt-10 md:mt-16 border-t border-primary-foreground/15 pt-6 md:pt-8 text-center text-xs text-primary-foreground/50">
            © {new Date().getFullYear()} Vassio. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
}
