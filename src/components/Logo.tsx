export function Logo() {
  return (
    <svg viewBox="0 0 100 100" className="h-11 w-11" aria-hidden="true">
      <defs>
        <linearGradient id="magneto-logo-gradient" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#38bdf8" />
          <stop offset="45%" stopColor="#8b5cf6" />
          <stop offset="100%" stopColor="#f472b6" />
        </linearGradient>
      </defs>
      <path
        d="M26 24 C26 14 34 8 50 32 C66 8 74 14 74 24 L74 72 C74 82 66 88 50 64 C34 88 26 82 26 72"
        fill="none"
        stroke="url(#magneto-logo-gradient)"
        strokeWidth="10"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M36 40 C36 30 64 30 64 40"
        fill="none"
        stroke="url(#magneto-logo-gradient)"
        strokeWidth="10"
        strokeLinecap="round"
      />
    </svg>
  );
}
