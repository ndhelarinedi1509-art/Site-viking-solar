export default function Loading() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-bg-primary">
      <svg
        width="64"
        height="64"
        viewBox="0 0 32 32"
        fill="none"
        className="animate-spin-slow"
        aria-label="Chargement en cours"
      >
        <circle
          cx="16"
          cy="16"
          r="14"
          stroke="#22C55E"
          strokeWidth="2.5"
          strokeDasharray="88"
          strokeLinecap="round"
          className="opacity-80"
        />
        <path
          d="M16 6 L18 14 L26 16 L18 18 L16 26 L14 18 L6 16 L14 14 Z"
          fill="#22C55E"
          className="origin-center animate-pulse-glow"
        />
      </svg>
    </main>
  );
}