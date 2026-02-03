"use client";

interface SingleRoseProps {
  primaryColor?: string;
  secondaryColor?: string;
  size?: number;
  variant?: "bud" | "half" | "full";
  className?: string;
  withLeaves?: boolean;
}

export default function SingleRose({
  primaryColor = "#E8C4C4",
  secondaryColor = "#4A7C59",
  size = 60,
  variant = "full",
  className = "",
  withLeaves = true,
}: SingleRoseProps) {
  // Variant determines number of petal layers and openness
  const petalConfig = {
    bud: { layers: 2, scale: 0.6, openness: 0.3 },
    half: { layers: 3, scale: 0.8, openness: 0.6 },
    full: { layers: 4, scale: 1, openness: 1 },
  };

  const config = petalConfig[variant];

  // Helper to create a more intense color for inner petals
  const darkenColor = (color: string, amount: number = 0.15) => {
    const hex = color.replace("#", "");
    const r = Math.max(0, parseInt(hex.slice(0, 2), 16) - Math.floor(255 * amount));
    const g = Math.max(0, parseInt(hex.slice(2, 4), 16) - Math.floor(255 * amount));
    const b = Math.max(0, parseInt(hex.slice(4, 6), 16) - Math.floor(255 * amount));
    return `rgb(${r}, ${g}, ${b})`;
  };

  const lightenColor = (color: string, amount: number = 0.15) => {
    const hex = color.replace("#", "");
    const r = Math.min(255, parseInt(hex.slice(0, 2), 16) + Math.floor(255 * amount));
    const g = Math.min(255, parseInt(hex.slice(2, 4), 16) + Math.floor(255 * amount));
    const b = Math.min(255, parseInt(hex.slice(4, 6), 16) + Math.floor(255 * amount));
    return `rgb(${r}, ${g}, ${b})`;
  };

  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 100 100"
      className={className}
      xmlns="http://www.w3.org/2000/svg"
    >
      <defs>
        <radialGradient id={`roseGradient-${variant}`} cx="50%" cy="50%" r="60%">
          <stop offset="0%" stopColor={darkenColor(primaryColor, 0.1)} />
          <stop offset="100%" stopColor={primaryColor} />
        </radialGradient>
      </defs>

      {/* Leaves (behind the flower) */}
      {withLeaves && (
        <g opacity="0.9">
          {/* Left leaf */}
          <path
            d="M50,65 Q30,70 20,85 Q35,75 50,70 Z"
            fill={secondaryColor}
            opacity="0.8"
          />
          <path
            d="M50,67 Q35,72 30,80"
            stroke={lightenColor(secondaryColor, 0.1)}
            strokeWidth="0.5"
            fill="none"
            opacity="0.6"
          />
          {/* Right leaf */}
          <path
            d="M50,65 Q70,70 80,85 Q65,75 50,70 Z"
            fill={secondaryColor}
            opacity="0.8"
          />
          <path
            d="M50,67 Q65,72 70,80"
            stroke={lightenColor(secondaryColor, 0.1)}
            strokeWidth="0.5"
            fill="none"
            opacity="0.6"
          />
        </g>
      )}

      {/* Rose petals - outer layer */}
      {config.layers >= 1 && (
        <g opacity="0.85">
          {/* Outer petals - 5 petals around */}
          <path
            d="M50,20 Q65,25 70,40 Q65,55 50,50 Q55,35 50,20 Z"
            fill={primaryColor}
            transform={`rotate(0, 50, 50) scale(${config.scale})`}
            style={{ transformOrigin: "50px 50px" }}
          />
          <path
            d="M50,20 Q65,25 70,40 Q65,55 50,50 Q55,35 50,20 Z"
            fill={primaryColor}
            transform={`rotate(72, 50, 50) scale(${config.scale})`}
            style={{ transformOrigin: "50px 50px" }}
          />
          <path
            d="M50,20 Q65,25 70,40 Q65,55 50,50 Q55,35 50,20 Z"
            fill={primaryColor}
            transform={`rotate(144, 50, 50) scale(${config.scale})`}
            style={{ transformOrigin: "50px 50px" }}
          />
          <path
            d="M50,20 Q65,25 70,40 Q65,55 50,50 Q55,35 50,20 Z"
            fill={primaryColor}
            transform={`rotate(216, 50, 50) scale(${config.scale})`}
            style={{ transformOrigin: "50px 50px" }}
          />
          <path
            d="M50,20 Q65,25 70,40 Q65,55 50,50 Q55,35 50,20 Z"
            fill={primaryColor}
            transform={`rotate(288, 50, 50) scale(${config.scale})`}
            style={{ transformOrigin: "50px 50px" }}
          />
        </g>
      )}

      {/* Second layer of petals - slightly smaller and rotated */}
      {config.layers >= 2 && (
        <g opacity="0.9">
          <path
            d="M50,25 Q62,30 65,42 Q60,52 50,48 Q54,38 50,25 Z"
            fill={darkenColor(primaryColor, 0.05)}
            transform={`rotate(36, 50, 50) scale(${config.scale * 0.9})`}
            style={{ transformOrigin: "50px 50px" }}
          />
          <path
            d="M50,25 Q62,30 65,42 Q60,52 50,48 Q54,38 50,25 Z"
            fill={darkenColor(primaryColor, 0.05)}
            transform={`rotate(108, 50, 50) scale(${config.scale * 0.9})`}
            style={{ transformOrigin: "50px 50px" }}
          />
          <path
            d="M50,25 Q62,30 65,42 Q60,52 50,48 Q54,38 50,25 Z"
            fill={darkenColor(primaryColor, 0.05)}
            transform={`rotate(180, 50, 50) scale(${config.scale * 0.9})`}
            style={{ transformOrigin: "50px 50px" }}
          />
          <path
            d="M50,25 Q62,30 65,42 Q60,52 50,48 Q54,38 50,25 Z"
            fill={darkenColor(primaryColor, 0.05)}
            transform={`rotate(252, 50, 50) scale(${config.scale * 0.9})`}
            style={{ transformOrigin: "50px 50px" }}
          />
          <path
            d="M50,25 Q62,30 65,42 Q60,52 50,48 Q54,38 50,25 Z"
            fill={darkenColor(primaryColor, 0.05)}
            transform={`rotate(324, 50, 50) scale(${config.scale * 0.9})`}
            style={{ transformOrigin: "50px 50px" }}
          />
        </g>
      )}

      {/* Third layer - inner petals */}
      {config.layers >= 3 && (
        <g opacity="0.95">
          <path
            d="M50,30 Q58,35 60,44 Q56,50 50,48 Q52,40 50,30 Z"
            fill={darkenColor(primaryColor, 0.1)}
            transform="rotate(18, 50, 50)"
            style={{ transformOrigin: "50px 50px" }}
          />
          <path
            d="M50,30 Q58,35 60,44 Q56,50 50,48 Q52,40 50,30 Z"
            fill={darkenColor(primaryColor, 0.1)}
            transform="rotate(90, 50, 50)"
            style={{ transformOrigin: "50px 50px" }}
          />
          <path
            d="M50,30 Q58,35 60,44 Q56,50 50,48 Q52,40 50,30 Z"
            fill={darkenColor(primaryColor, 0.1)}
            transform="rotate(162, 50, 50)"
            style={{ transformOrigin: "50px 50px" }}
          />
          <path
            d="M50,30 Q58,35 60,44 Q56,50 50,48 Q52,40 50,30 Z"
            fill={darkenColor(primaryColor, 0.1)}
            transform="rotate(234, 50, 50)"
            style={{ transformOrigin: "50px 50px" }}
          />
          <path
            d="M50,30 Q58,35 60,44 Q56,50 50,48 Q52,40 50,30 Z"
            fill={darkenColor(primaryColor, 0.1)}
            transform="rotate(306, 50, 50)"
            style={{ transformOrigin: "50px 50px" }}
          />
        </g>
      )}

      {/* Fourth layer - innermost petals (full bloom only) */}
      {config.layers >= 4 && (
        <g opacity="1">
          <path
            d="M50,35 Q55,38 56,45 Q54,48 50,47 Q51,42 50,35 Z"
            fill={darkenColor(primaryColor, 0.15)}
            transform="rotate(0, 50, 50)"
            style={{ transformOrigin: "50px 50px" }}
          />
          <path
            d="M50,35 Q55,38 56,45 Q54,48 50,47 Q51,42 50,35 Z"
            fill={darkenColor(primaryColor, 0.15)}
            transform="rotate(90, 50, 50)"
            style={{ transformOrigin: "50px 50px" }}
          />
          <path
            d="M50,35 Q55,38 56,45 Q54,48 50,47 Q51,42 50,35 Z"
            fill={darkenColor(primaryColor, 0.15)}
            transform="rotate(180, 50, 50)"
            style={{ transformOrigin: "50px 50px" }}
          />
          <path
            d="M50,35 Q55,38 56,45 Q54,48 50,47 Q51,42 50,35 Z"
            fill={darkenColor(primaryColor, 0.15)}
            transform="rotate(270, 50, 50)"
            style={{ transformOrigin: "50px 50px" }}
          />
        </g>
      )}

      {/* Center of the rose */}
      <circle
        cx="50"
        cy="48"
        r={3 * config.scale}
        fill={darkenColor(primaryColor, 0.2)}
      />

      {/* Inner center spiral suggestion */}
      <path
        d="M49,48 Q50,46 51,48 Q50,50 49,48"
        fill={darkenColor(primaryColor, 0.25)}
        opacity="0.8"
      />
    </svg>
  );
}
