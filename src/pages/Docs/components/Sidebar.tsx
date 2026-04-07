import { SECTIONS } from "../constants";

interface SidebarProps {
  activeSection: string;
  onSectionChange: (id: string) => void;
}

export function Sidebar({ activeSection, onSectionChange }: SidebarProps) {
  return (
    <aside className="sticky top-0 hidden h-screen w-64 shrink-0 overflow-y-auto border-r border-white/5 bg-black/20 p-8 md:block">
      <div className="mb-12 flex flex-col gap-2">
        <span className="text-[10px] leading-none font-semibold tracking-[0.3em] text-emerald-500/60 uppercase">
          Strategy Manual
        </span>
        <span className="text-base leading-none font-semibold tracking-tighter">V1.3 Pulse</span>
      </div>

      <nav className="space-y-1">
        {SECTIONS.map((section) => (
          <button
            key={section.id}
            onClick={() => onSectionChange(section.id)}
            className={`w-full rounded-lg border-emerald-500/20 px-4 py-2.5 text-left text-xs font-semibold tracking-wide transition-all ${
              activeSection === section.id
                ? "border bg-emerald-500/10 text-emerald-400 shadow-sm"
                : "border-none text-gray-500 hover:bg-white/5 hover:text-white"
            }`}
          >
            {section.title}
          </button>
        ))}
      </nav>
    </aside>
  );
}
