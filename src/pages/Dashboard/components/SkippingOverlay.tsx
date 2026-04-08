export function SkippingOverlay() {
  return (
    <div className="absolute inset-0 z-50 flex items-center justify-center bg-black/60 animate-in fade-in">
      <div className="flex flex-col items-center gap-5">
        <svg className="h-5 w-5 animate-spin" viewBox="0 0 20 20">
          <circle cx="10" cy="10" r="8" fill="none" stroke="rgba(16,185,129,0.15)" strokeWidth="1.5" />
          <path d="M10 2 A8 8 0 0 1 18 10" fill="none" stroke="#10b981" strokeWidth="1.5" strokeLinecap="round" />
        </svg>
        <div className="text-center">
          <p className="font-mono text-[13px] text-white">Searching for signal</p>
          <p className="font-mono text-[11px] text-gray-600">Scanning 17,000+ candles</p>
        </div>
      </div>
    </div>
  );
}
