/**
 * Decorative animated jungle elements: floating leaves, fireflies, coins, fog.
 * All absolute-positioned, pointer-events-none. Safe to drop into any section.
 */
export function JungleLeaf({
  className = "",
  color = "oklch(0.55 0.2 145)",
  size = 60,
  delay = 0,
}: {
  className?: string;
  color?: string;
  size?: number;
  delay?: number;
}) {
  return (
    <svg
      className={`absolute pointer-events-none animate-leaf-float ${className}`}
      style={{ animationDelay: `${delay}s`, width: size, height: size }}
      viewBox="0 0 64 64"
      fill="none"
      aria-hidden
    >
      <defs>
        <radialGradient id={`lf-${delay}`} cx="35%" cy="35%" r="70%">
          <stop offset="0" stopColor="oklch(0.85 0.24 130)" />
          <stop offset="0.5" stopColor={color} />
          <stop offset="1" stopColor="oklch(0.18 0.06 155)" />
        </radialGradient>
      </defs>
      <path
        d="M32 4 C 14 12 6 30 8 52 C 30 54 50 42 58 20 C 50 14 42 8 32 4 Z"
        fill={`url(#lf-${delay})`}
        stroke="oklch(0.15 0.05 155)"
        strokeWidth="0.8"
      />
      <path
        d="M14 46 Q 30 30 54 20"
        stroke="oklch(0.86 0.17 90 / 0.5)"
        strokeWidth="0.8"
        fill="none"
      />
      <path d="M20 42 L 28 34 M 26 48 L 34 40 M 32 50 L 42 40" stroke="oklch(0.86 0.17 90 / 0.35)" strokeWidth="0.6" fill="none" />
    </svg>
  );
}

export function Firefly({
  className = "",
  delay = 0,
  size = 6,
}: {
  className?: string;
  delay?: number;
  size?: number;
}) {
  return (
    <span
      className={`absolute pointer-events-none animate-firefly rounded-full ${className}`}
      style={{
        animationDelay: `${delay}s`,
        width: size,
        height: size,
        background: "radial-gradient(circle, oklch(0.95 0.2 100) 0%, oklch(0.82 0.17 90 / 0.7) 40%, transparent 70%)",
        boxShadow: "0 0 12px oklch(0.86 0.17 90 / 0.9), 0 0 24px oklch(0.86 0.24 130 / 0.5)",
      }}
      aria-hidden
    />
  );
}

export function GoldCoin({
  className = "",
  size = 32,
  delay = 0,
}: {
  className?: string;
  size?: number;
  delay?: number;
}) {
  return (
    <div
      className={`absolute pointer-events-none animate-coin-spin ${className}`}
      style={{ animationDelay: `${delay}s`, width: size, height: size }}
      aria-hidden
    >
      <div
        className="w-full h-full rounded-full"
        style={{
          background: "radial-gradient(circle at 30% 30%, oklch(0.95 0.16 95), oklch(0.72 0.17 78) 50%, oklch(0.42 0.14 60))",
          boxShadow: "0 0 20px oklch(0.86 0.17 90 / 0.7), inset -2px -3px 6px oklch(0.3 0.1 60 / 0.8)",
          border: "1.5px solid oklch(0.55 0.14 60)",
        }}
      />
    </div>
  );
}

/**
 * Ambient scene: fireflies + drifting fog + leaves along edges.
 * Use inside a `relative overflow-hidden` container.
 */
export function JungleAmbient() {
  return (
    <>
      {/* Fog */}
      <div
        aria-hidden
        className="absolute inset-0 pointer-events-none animate-fog opacity-30 mix-blend-screen"
        style={{
          backgroundImage:
            "radial-gradient(ellipse at 20% 40%, oklch(0.5 0.1 145 / 0.4), transparent 50%)," +
            "radial-gradient(ellipse at 80% 60%, oklch(0.6 0.14 130 / 0.35), transparent 55%)",
        }}
      />
      {/* Fireflies */}
      <Firefly className="top-[15%] left-[8%]" delay={0} />
      <Firefly className="top-[35%] left-[85%]" delay={1.2} size={5} />
      <Firefly className="top-[65%] left-[15%]" delay={2.5} size={7} />
      <Firefly className="top-[80%] left-[75%]" delay={3.8} />
      <Firefly className="top-[25%] left-[55%]" delay={4.5} size={4} />
      <Firefly className="top-[50%] left-[92%]" delay={1.8} />
      {/* Leaves along corners */}
      <JungleLeaf className="top-[-10px] left-[-15px] rotate-[-20deg]" size={90} delay={0} />
      <JungleLeaf className="top-[10%] right-[-25px] rotate-[135deg]" size={70} delay={1.5} color="oklch(0.6 0.22 135)" />
      <JungleLeaf className="bottom-[15%] left-[-20px] rotate-[75deg]" size={80} delay={3} />
      <JungleLeaf className="bottom-[-10px] right-[5%] rotate-[200deg]" size={100} delay={2} color="oklch(0.5 0.2 150)" />
    </>
  );
}
