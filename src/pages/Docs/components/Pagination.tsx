import { SECTIONS } from "../constants";
import { ChevronLeft, ChevronRight } from "lucide-react";

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
        <div className="flex flex-col items-start gap-3">
          <button
            onClick={() => onNavigate(prev.id)}
            className="flex max-w-[200px] items-center gap-1.5 rounded-md border border-gray-500/5 bg-white/2 px-3 py-2 text-right text-[10px] font-semibold tracking-widest text-gray-500 uppercase transition-all hover:border-emerald-500/5 hover:bg-emerald-500/5 hover:text-emerald-500"
          >
            <ChevronLeft className="h-3 w-3 sm:h-4 sm:w-4" />
            <span>Previous</span>
          </button>
          <span className="line-clamp-1 text-sm font-semibold text-gray-400 transition-colors group-hover:text-white">
            {prev.title}
          </span>
        </div>
      ) : (
        <div />
      )}

      {next ? (
        <div className="flex flex-col items-end gap-3">
          <button
            onClick={() => onNavigate(next.id)}
            className="flex max-w-[200px] items-center gap-1.5 rounded-md border border-gray-500/5 bg-white/2 px-3 py-2 text-right text-[10px] font-semibold tracking-widest text-gray-500 uppercase transition-all hover:border-emerald-500/5 hover:bg-emerald-500/5 hover:text-emerald-500"
          >
            <span>Next</span>
            <ChevronRight className="h-3 w-3 sm:h-4 sm:w-4" />
          </button>
          <span className="line-clamp-1 text-sm font-semibold text-gray-400 transition-colors">{next.title}</span>
        </div>
      ) : (
        <div />
      )}
    </div>
  );
}
