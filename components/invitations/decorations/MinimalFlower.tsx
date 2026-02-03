"use client";

interface MinimalFlowerProps {
  color?: string;
  accentColor?: string;
  size?: number;
  strokeWidth?: number;
  variant?: "simple" | "geometric" | "linear";
  filled?: boolean;
  className?: string;
}

export default function MinimalFlower({
  color = "#2D3748",
  accentColor = "#E2B659",
  size = 50,
  strokeWidth = 1.5,
  variant = "geometric",
  filled = false,
  className = "",
}: MinimalFlowerProps) {
  const SimpleFlower = () => (
    <g>
      {/* 6 simple petals */}
      {[0, 60, 120, 180, 240, 300].map((angle) => (
        <ellipse
          key={angle}
          cx="50"
          cy="35"
          rx="6"
          ry="12"
          stroke={color}
          strokeWidth={strokeWidth}
          fill={filled ? `${color}20` : "none"}
          transform={`rotate(${angle}, 50, 50)`}
        />
      ))}
      {/* Center circle */}
      <circle
        cx="50"
        cy="50"
        r="5"
        stroke={color}
        strokeWidth={strokeWidth}
        fill={filled ? accentColor : "none"}
      />
    </g>
  );

  const GeometricFlower = () => (
    <g>
      {/* Hexagonal petals */}
      {[0, 60, 120, 180, 240, 300].map((angle) => (
        <path
          key={angle}
          d="M50,25 L55,35 L55,45 L50,50 L45,45 L45,35 Z"
          stroke={color}
          strokeWidth={strokeWidth}
          fill={filled ? `${color}15` : "none"}
          strokeLinejoin="round"
          transform={`rotate(${angle}, 50, 50)`}
        />
      ))}
      {/* Inner hexagon */}
      <path
        d="M50,42 L54,45 L54,50 L50,53 L46,50 L46,45 Z"
        stroke={color}
        strokeWidth={strokeWidth * 0.8}
        fill={filled ? accentColor : "none"}
        strokeLinejoin="round"
      />
      {/* Center dot */}
      <circle cx="50" cy="48" r="2" fill={color} />
    </g>
  );

  const LinearFlower = () => (
    <g>
      {/* Radiating lines with dots */}
      {[0, 45, 90, 135, 180, 225, 270, 315].map((angle) => (
        <g key={angle} transform={`rotate(${angle}, 50, 50)`}>
          <line
            x1="50"
            y1="50"
            x2="50"
            y2="25"
            stroke={color}
            strokeWidth={strokeWidth}
            strokeLinecap="round"
          />
          <circle
            cx="50"
            cy="23"
            r="2.5"
            stroke={color}
            strokeWidth={strokeWidth * 0.6}
            fill={filled ? accentColor : "none"}
          />
        </g>
      ))}
      {/* Center circle */}
      <circle
        cx="50"
        cy="50"
        r="6"
        stroke={color}
        strokeWidth={strokeWidth}
        fill={filled ? `${color}20` : "none"}
      />
      <circle
        cx="50"
        cy="50"
        r="2"
        fill={color}
      />
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
      {variant === "simple" && <SimpleFlower />}
      {variant === "geometric" && <GeometricFlower />}
      {variant === "linear" && <LinearFlower />}
    </svg>
  );
}
