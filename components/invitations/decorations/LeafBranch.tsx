"use client";

interface LeafBranchProps {
  color?: string;
  size?: number;
  direction?: "left" | "right" | "up" | "down";
  variant?: "simple" | "detailed" | "eucalyptus";
  className?: string;
}

export default function LeafBranch({
  color = "#4A7C59",
  size = 80,
  direction = "right",
  variant = "simple",
  className = "",
}: LeafBranchProps) {
  // Calculate rotation based on direction
  const getRotation = () => {
    switch (direction) {
      case "left":
        return "rotate(180, 50, 50)";
      case "up":
        return "rotate(-90, 50, 50)";
      case "down":
        return "rotate(90, 50, 50)";
      default:
        return "";
    }
  };

  // Simple branch with basic leaves
  const SimpleBranch = () => (
    <g transform={getRotation()}>
      {/* Main stem */}
      <path
        d="M10,50 Q40,48 90,50"
        stroke={color}
        strokeWidth="2"
        fill="none"
        opacity="0.8"
      />

      {/* Leaves along the stem */}
      <ellipse cx="25" cy="45" rx="10" ry="5" fill={color} opacity="0.7" transform="rotate(-20, 25, 45)" />
      <ellipse cx="30" cy="55" rx="8" ry="4" fill={color} opacity="0.6" transform="rotate(25, 30, 55)" />
      <ellipse cx="50" cy="43" rx="12" ry="5" fill={color} opacity="0.75" transform="rotate(-15, 50, 43)" />
      <ellipse cx="55" cy="57" rx="10" ry="4" fill={color} opacity="0.65" transform="rotate(20, 55, 57)" />
      <ellipse cx="75" cy="45" rx="11" ry="5" fill={color} opacity="0.7" transform="rotate(-10, 75, 45)" />
      <ellipse cx="80" cy="55" rx="9" ry="4" fill={color} opacity="0.6" transform="rotate(15, 80, 55)" />
    </g>
  );

  // Detailed branch with leaf veins
  const DetailedBranch = () => (
    <g transform={getRotation()}>
      {/* Main stem */}
      <path
        d="M5,50 Q35,45 65,48 Q85,50 95,50"
        stroke={color}
        strokeWidth="2.5"
        fill="none"
        opacity="0.8"
      />

      {/* Detailed leaves with veins */}
      {/* Leaf 1 */}
      <g transform="translate(20, 40) rotate(-25)">
        <path d="M0,0 Q8,-12 0,-20 Q-8,-12 0,0 Z" fill={color} opacity="0.75" />
        <path d="M0,0 L0,-18" stroke={`${color}90`} strokeWidth="0.5" fill="none" />
        <path d="M0,-6 L-3,-10" stroke={`${color}60`} strokeWidth="0.3" fill="none" />
        <path d="M0,-10 L3,-14" stroke={`${color}60`} strokeWidth="0.3" fill="none" />
      </g>

      {/* Leaf 2 */}
      <g transform="translate(28, 58) rotate(20)">
        <path d="M0,0 Q6,-10 0,-16 Q-6,-10 0,0 Z" fill={color} opacity="0.65" />
        <path d="M0,0 L0,-14" stroke={`${color}90`} strokeWidth="0.4" fill="none" />
      </g>

      {/* Leaf 3 */}
      <g transform="translate(48, 38) rotate(-18)">
        <path d="M0,0 Q10,-14 0,-24 Q-10,-14 0,0 Z" fill={color} opacity="0.8" />
        <path d="M0,0 L0,-22" stroke={`${color}90`} strokeWidth="0.5" fill="none" />
        <path d="M0,-8 L-4,-12" stroke={`${color}60`} strokeWidth="0.3" fill="none" />
        <path d="M0,-14 L4,-18" stroke={`${color}60`} strokeWidth="0.3" fill="none" />
      </g>

      {/* Leaf 4 */}
      <g transform="translate(52, 60) rotate(25)">
        <path d="M0,0 Q7,-11 0,-18 Q-7,-11 0,0 Z" fill={color} opacity="0.7" />
        <path d="M0,0 L0,-16" stroke={`${color}90`} strokeWidth="0.4" fill="none" />
      </g>

      {/* Leaf 5 */}
      <g transform="translate(75, 42) rotate(-12)">
        <path d="M0,0 Q9,-13 0,-22 Q-9,-13 0,0 Z" fill={color} opacity="0.75" />
        <path d="M0,0 L0,-20" stroke={`${color}90`} strokeWidth="0.5" fill="none" />
        <path d="M0,-7 L-3,-11" stroke={`${color}60`} strokeWidth="0.3" fill="none" />
        <path d="M0,-13 L3,-17" stroke={`${color}60`} strokeWidth="0.3" fill="none" />
      </g>

      {/* Leaf 6 */}
      <g transform="translate(78, 58) rotate(18)">
        <path d="M0,0 Q6,-9 0,-15 Q-6,-9 0,0 Z" fill={color} opacity="0.65" />
        <path d="M0,0 L0,-13" stroke={`${color}90`} strokeWidth="0.4" fill="none" />
      </g>
    </g>
  );

  // Eucalyptus style branch
  const EucalyptusBranch = () => (
    <g transform={getRotation()}>
      {/* Thin, elegant stem */}
      <path
        d="M5,50 Q30,48 55,50 Q80,52 95,50"
        stroke={color}
        strokeWidth="1.5"
        fill="none"
        opacity="0.7"
      />

      {/* Eucalyptus-style round leaves */}
      <circle cx="18" cy="43" r="7" fill={color} opacity="0.6" />
      <circle cx="22" cy="57" r="6" fill={color} opacity="0.55" />
      <circle cx="38" cy="40" r="8" fill={color} opacity="0.65" />
      <circle cx="42" cy="60" r="7" fill={color} opacity="0.6" />
      <circle cx="58" cy="42" r="9" fill={color} opacity="0.7" />
      <circle cx="62" cy="58" r="7" fill={color} opacity="0.6" />
      <circle cx="78" cy="44" r="8" fill={color} opacity="0.65" />
      <circle cx="82" cy="56" r="6" fill={color} opacity="0.55" />

      {/* Subtle veins/accents */}
      <ellipse cx="38" cy="40" rx="2" ry="4" fill={`${color}40`} />
      <ellipse cx="58" cy="42" rx="2" ry="5" fill={`${color}40`} />
      <ellipse cx="78" cy="44" rx="2" ry="4" fill={`${color}40`} />
    </g>
  );

  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 100 100"
      className={className}
      xmlns="http://www.w3.org/2000/svg"
    >
      {variant === "simple" && <SimpleBranch />}
      {variant === "detailed" && <DetailedBranch />}
      {variant === "eucalyptus" && <EucalyptusBranch />}
    </svg>
  );
}
