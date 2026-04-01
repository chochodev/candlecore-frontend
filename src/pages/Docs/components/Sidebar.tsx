import { SECTIONS } from "../constants";

interface SidebarProps {
  activeSection: string;
  onSectionChange: (id: string) => void;
}

export function Sidebar({ activeSection, onSectionChange }: SidebarProps) {
  return (
    <aside className="w-64 shrink-0 border-r border-white/5 bg-black/20 p-8 hidden md:block overflow-y-auto">
      <div className="mb-12 flex flex-col gap-2">
        <span className="text-[10px] font-semibold uppercase tracking-[0.3em] text-emerald-500/60 leading-none">Strategy Manual</span>
        <span className="text-base font-semibold tracking-tighter leading-none">V1.3 Pulse</span>
      </div>
      
      <nav className="space-y-1">
        {SECTIONS.map((section) => (
          <button
            key={section.id}
            onClick={() => onSectionChange(section.id)}
            className={`w-full text-left px-4 py-2.5 rounded-lg text-[11px] font-semibold tracking-wide transition-all ${
              activeSection === section.id 
              ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 shadow-sm" 
              : "text-gray-500 hover:text-white hover:bg-white/5"
            }`}
          >
            {section.title}
          </button>
        ))}
      </nav>
    </aside>
  );
}
