import { SECTIONS } from "../constants";

interface PaginationProps {
  currentIndex: number;
  onNavigate: (id: string) => void;
}

export function Pagination({ currentIndex, onNavigate }: PaginationProps) {
  const prev = currentIndex > 0 ? SECTIONS[currentIndex - 1] : null;
  const next = currentIndex < SECTIONS.length - 1 ? SECTIONS[currentIndex + 1] : null;

  return (
    <div className="mt-32 flex items-center justify-between border-t border-white/5 pt-12 pb-20">
      {prev ? (
        <button 
          onClick={() => onNavigate(prev.id)}
          className="group flex max-w-[200px] flex-col items-start gap-3 rounded-xl border border-white/5 bg-white/2 p-5 transition-all hover:border-emerald-500/20 hover:bg-emerald-500/5"
        >
          <div className="flex items-center gap-2 text-[10px] font-semibold uppercase tracking-widest text-gray-500 transition-colors group-hover:text-emerald-500">
            <svg className="h-3 w-3 fill-none stroke-current" strokeWidth="2.5" viewBox="0 0 24 24"><path d="M15 18l-6-6 6-6" /></svg>
            <span>Previous</span>
          </div>
          <span className="text-sm font-semibold text-gray-300 transition-colors group-hover:text-white line-clamp-1">{prev.title}</span>
        </button>
      ) : <div />}

      {next ? (
        <button 
          onClick={() => onNavigate(next.id)}
          className="group flex max-w-[200px] flex-col items-end gap-3 rounded-xl border border-white/5 bg-white/2 p-5 text-right transition-all hover:border-emerald-500/20 hover:bg-emerald-500/5"
        >
          <div className="flex items-center gap-2 text-[10px] font-semibold uppercase tracking-widest text-gray-500 transition-colors group-hover:text-emerald-500">
            <span>Next</span>
            <svg className="h-3 w-3 fill-none stroke-current" strokeWidth="2.5" viewBox="0 0 24 24"><path d="M9 18l6-6-6-6" /></svg>
          </div>
          <span className="text-sm font-semibold text-gray-300 transition-colors group-hover:text-white line-clamp-1">{next.title}</span>
        </button>
      ) : <div />}
    </div>
  );
}
