import { Link } from "react-router-dom";
import { Logo } from "../Logo";

export function Header() {
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

          {/* CTA Button */}
          <a
            href="http://localhost:8080/api/v1/health"
            target="_blank"
            rel="noopener noreferrer"
            className="ml-2 inline-flex items-center gap-2 rounded-full bg-emerald-500 px-4 py-2 text-sm font-semibold text-white shadow-md shadow-emerald-500/10 transition-all hover:bg-emerald-600 hover:shadow-lg hover:shadow-emerald-500/15"
          >
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-white opacity-75"></span>
              <span className="relative inline-flex h-2 w-2 rounded-full bg-white"></span>
            </span>
            <span className="hidden sm:inline">API Live</span>
            <span className="sm:hidden">Live</span>
          </a>
        </nav>

        {/* Mobile Menu Button */}
        <button className="flex h-9 w-9 items-center justify-center rounded-full bg-gray-800/50 text-gray-400 transition-colors hover:bg-gray-800 hover:text-white md:hidden">
          <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>
      </div>
    </header>
  );
}
