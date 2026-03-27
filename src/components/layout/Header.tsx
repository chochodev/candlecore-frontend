import { useState } from "react";
import { Link } from "react-router-dom";
import { Menu, X, Github, ExternalLink, Zap, Target } from "lucide-react";
import { Logo } from "../Logo";

export function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  return (
    <header className="sticky top-0 z-50 w-full border-b border-gray-800/50 bg-gray-900/80 backdrop-blur-xl">
      <div className="container mx-auto flex h-16 max-w-screen-2xl items-center justify-between px-4 md:px-6">
        {/* Logo & Brand */}
        <Link to="/" className="group flex items-center gap-2.5">
          <div className="relative flex h-9 w-9 shrink-0 items-center justify-center overflow-hidden rounded-xl bg-linear-to-br from-emerald-500 to-emerald-600 transition-transform duration-200 group-hover:scale-110">
            <Logo className="h-5 w-5 text-white" />
            <div className="absolute inset-0 bg-linear-to-t from-black/20 to-transparent"></div>
          </div>
          <div className="flex flex-col">
            <span className="font-gellix text-base leading-none font-bold text-white md:text-lg">Candlecore</span>
            <span className="hidden text-[10px] text-gray-400 sm:block">Trading Engine</span>
          </div>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden items-center gap-1 md:flex">
          <Link
            to="/dashboard"
            className="rounded-full px-4 py-2 text-sm font-medium text-gray-400 transition-all hover:bg-gray-800/50 hover:text-white"
          >
            Dashboard
          </Link>
          <Link
            to="/lab"
            className="rounded-full px-4 py-2 text-sm font-medium text-gray-400 transition-all hover:bg-gray-800/50 hover:text-white"
          >
            Strategy Lab
          </Link>
          <Link
            to="/docs"
            className="rounded-full px-4 py-2 text-sm font-medium text-gray-400 transition-all hover:bg-gray-800/50 hover:text-white"
          >
            Docs
          </Link>
          <Link
            to="/api"
            className="rounded-full px-4 py-2 text-sm font-medium text-gray-400 transition-all hover:bg-gray-800/50 hover:text-white"
          >
            API
          </Link>
          <a
            href="https://github.com/chochodev/candlecore"
            target="_blank"
            rel="noopener noreferrer"
            className="rounded-full px-4 py-2 text-sm font-medium text-gray-400 transition-all hover:bg-gray-800/50 hover:text-white"
          >
            GitHub
          </a>
        </nav>

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
          <nav className="flex flex-col gap-2">
            <Link
              to="/dashboard"
              onClick={() => setIsMenuOpen(false)}
              className="flex items-center justify-between rounded-xl bg-gray-900 px-4 py-3 text-sm font-medium text-white"
            >
              Dashboard
              <Target size={16} className="text-emerald-500" />
            </Link>
            <Link
              to="/lab"
              onClick={() => setIsMenuOpen(false)}
              className="flex items-center justify-between rounded-xl bg-gray-900 px-4 py-3 text-sm font-medium text-white"
            >
              Strategy Lab
              <Zap size={16} className="text-amber-500" />
            </Link>
            <Link
              to="/api"
              onClick={() => setIsMenuOpen(false)}
              className="flex items-center justify-between rounded-xl bg-gray-900 px-4 py-3 text-sm font-medium text-white"
            >
              API Status
              <div className="h-1.5 w-1.5 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]" />
            </Link>
            <a
              href="https://github.com/chochodev/candlecore"
              className="flex items-center justify-between rounded-xl bg-gray-900 px-4 py-3 text-sm font-medium text-gray-400"
            >
              GitHub Source
              <Github size={16} />
            </a>
          </nav>
        </div>
      )}
    </header>
  );
}
