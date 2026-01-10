export function Logo({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
      {/* C shape */}
      <path
        d="M16 4C9.373 4 4 9.373 4 16C4 22.627 9.373 28 16 28"
        stroke="currentColor"
        strokeWidth="2.5"
        strokeLinecap="round"
      />
      {/* Candlestick elements */}
      <rect x="18" y="10" width="3" height="12" rx="1" fill="currentColor" />
      <rect x="23" y="14" width="3" height="8" rx="1" fill="currentColor" />
      <line x1="19.5" y1="8" x2="19.5" y2="24" stroke="currentColor" strokeWidth="1.5" />
      <line x1="24.5" y1="12" x2="24.5" y2="24" stroke="currentColor" strokeWidth="1.5" />
    </svg>
  );
}
