import { useState } from "react";
import { Link, Outlet } from "react-router-dom";
import { Menu, X } from "lucide-react";
import { Logo } from "../Logo";

const NAV_LINKS = [
  { to: "/dashboard", label: "Dashboard" },
  { to: "/lab", label: "Strategy Lab" },
  { to: "/docs", label: "Docs" },
  { to: "/api", label: "API" },
  { href: "https://github.com/chochodev/candlecore", label: "GitHub" },
];

function Navigation({ variant, onClose }: { variant: "desktop" | "mobile"; onClose?: () => void }) {
  const isMobile = variant === "mobile";
  const navClass = isMobile ? "flex flex-col gap-2" : "hidden items-center gap-1 md:flex";
  const linkClass = isMobile
    ? "flex items-center justify-between rounded-xl bg-gray-900 px-4 py-3 text-sm font-medium text-white transition-colors hover:bg-gray-800"
    : "rounded-full px-4 py-2 text-sm font-medium text-gray-400 transition-all hover:bg-gray-800/50 hover:text-white";

  return (
    <nav className={navClass}>
      {NAV_LINKS.map((link) => {
        if (link.href) {
          return (
            <a
              key={link.label}
              href={link.href}
              target="_blank"
              rel="noopener noreferrer"
              className={linkClass}
            >
              {link.label}
            </a>
          );
        }

        return (
          <Link key={link.to} to={link.to!} onClick={onClose} className={linkClass}>
            {link.label}
          </Link>
        );
      })}
    </nav>
  );
}

export function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <>
      <header className="sticky top-0 z-50 w-full border-b border-gray-800/50 bg-gray-900/80 backdrop-blur-xl">
        <div className="container mx-auto flex h-16 max-w-screen-2xl items-center justify-between px-4 md:px-6">
          {/* Logo & Brand */}
          <Link to="/" className="group flex items-center gap-2.5">
            <div className="relative flex h-9 w-9 shrink-0 items-center justify-center overflow-hidden rounded-xl bg-linear-to-br from-emerald-500 to-emerald-600 transition-transform duration-200 group-hover:scale-110">
              <Logo className="h-5 w-5 text-white" />
              <div className="absolute inset-0 bg-linear-to-t from-black/20 to-transparent"></div>
            </div>
            <div className="flex flex-col">
              <span className="font-gellix text-base leading-none font-bold text-white md:text-lg">
                Candlecore
              </span>
              <span className="hidden text-[10px] text-gray-400 sm:block">Trading Engine</span>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <Navigation variant="desktop" />

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="flex h-9 w-9 items-center justify-center rounded-full bg-gray-800/50 text-gray-400 transition-colors hover:bg-gray-800 hover:text-white md:hidden"
          >
            {isMenuOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>

        {/* Mobile Navigation Menu */}
        {isMenuOpen && (
          <div className="border-t border-gray-800 bg-gray-950 p-4 md:hidden">
            <Navigation variant="mobile" onClose={() => setIsMenuOpen(false)} />
          </div>
        )}
      </header>
      <Outlet />
    </>
  );
}
