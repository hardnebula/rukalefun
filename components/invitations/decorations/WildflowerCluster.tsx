"use client";

interface WildflowerClusterProps {
  primaryColor?: string;
  secondaryColor?: string;
  accentColor?: string;
  size?: number;
  density?: "sparse" | "medium" | "dense";
  className?: string;
}

export default function WildflowerCluster({
  primaryColor = "#E8C4C4",
  secondaryColor = "#4A7C59",
  accentColor = "#D4A574",
  size = 100,
  density = "medium",
  className = "",
}: WildflowerClusterProps) {
  const densityConfig = {
    sparse: { flowers: 3, spread: 0.7 },
    medium: { flowers: 4, spread: 0.85 },
    dense: { flowers: 5, spread: 1 },
  };

  const config = densityConfig[density];

  // Small daisy flower
  const Daisy = ({ cx, cy, scale = 1, color }: { cx: number; cy: number; scale?: number; color: string }) => (
    <g transform={`translate(${cx}, ${cy}) scale(${scale})`}>
      {/* Petals */}
      {[0, 45, 90, 135, 180, 225, 270, 315].map((angle) => (
        <ellipse
          key={angle}
          cx="0"
          cy="-6"
          rx="2.5"
          ry="5"
          fill={color}
          opacity="0.9"
          transform={`rotate(${angle})`}
        />
      ))}
      {/* Center */}
      <circle cx="0" cy="0" r="3" fill={accentColor} />
      <circle cx="0" cy="0" r="1.5" fill={secondaryColor} opacity="0.5" />
    </g>
  );

  // Lavender sprig
  const Lavender = ({ cx, cy, scale = 1, rotation = 0 }: { cx: number; cy: number; scale?: number; rotation?: number }) => (
    <g transform={`translate(${cx}, ${cy}) rotate(${rotation}) scale(${scale})`}>
      {/* Stem */}
      <path
        d="M0,20 Q-2,10 0,0"
        stroke={secondaryColor}
        strokeWidth="1"
        fill="none"
      />
      {/* Buds */}
      {[0, 4, 8, 12].map((y, i) => (
        <ellipse
          key={i}
          cx={i % 2 === 0 ? 2 : -2}
          cy={y}
          rx="2"
          ry="3"
          fill={primaryColor}
          opacity={0.7 + i * 0.05}
        />
      ))}
    </g>
  );

  // Small wild rose (5 petals)
  const WildRose = ({ cx, cy, scale = 1, color }: { cx: number; cy: number; scale?: number; color: string }) => (
    <g transform={`translate(${cx}, ${cy}) scale(${scale})`}>
      {/* 5 petals */}
      {[0, 72, 144, 216, 288].map((angle) => (
        <ellipse
          key={angle}
          cx="0"
          cy="-5"
          rx="4"
          ry="6"
          fill={color}
          opacity="0.85"
          transform={`rotate(${angle})`}
        />
      ))}
      {/* Center */}
      <circle cx="0" cy="0" r="2.5" fill={accentColor} />
      {/* Stamens */}
      {[0, 60, 120, 180, 240, 300].map((angle) => (
        <circle
          key={angle}
          cx={Math.sin((angle * Math.PI) / 180) * 1.5}
          cy={Math.cos((angle * Math.PI) / 180) * 1.5}
          r="0.5"
          fill={secondaryColor}
          opacity="0.6"
        />
      ))}
    </g>
  );

  // Baby's breath (small dots)
  const BabysBreath = ({ cx, cy, spread = 8 }: { cx: number; cy: number; spread?: number }) => (
    <g>
      {Array.from({ length: 7 }).map((_, i) => {
        const angle = (i * 51.4) * (Math.PI / 180);
        const r = 3 + (i % 3) * (spread / 3);
        return (
          <circle
            key={i}
            cx={cx + Math.cos(angle) * r}
            cy={cy + Math.sin(angle) * r}
            r={1 + (i % 2) * 0.5}
            fill="white"
            opacity={0.7 + (i % 3) * 0.1}
          />
        );
      })}
    </g>
  );

  // Small filler leaf
  const SmallLeaf = ({ cx, cy, rotation = 0 }: { cx: number; cy: number; rotation?: number }) => (
    <path
      d={`M${cx},${cy} Q${cx + 5},${cy - 8} ${cx + 2},${cy - 15} Q${cx - 3},${cy - 8} ${cx},${cy} Z`}
      fill={secondaryColor}
      opacity="0.7"
      transform={`rotate(${rotation}, ${cx}, ${cy})`}
    />
  );

  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 100 100"
      className={className}
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* Background leaves */}
      <SmallLeaf cx={20} cy={70} rotation={-30} />
      <SmallLeaf cx={80} cy={70} rotation={30} />
      <SmallLeaf cx={50} cy={75} rotation={0} />
      {config.flowers >= 4 && <SmallLeaf cx={35} cy={65} rotation={-15} />}
      {config.flowers >= 5 && <SmallLeaf cx={65} cy={65} rotation={15} />}

      {/* Stems connecting flowers */}
      <path
        d="M50,80 Q40,60 30,45"
        stroke={secondaryColor}
        strokeWidth="1.5"
        fill="none"
        opacity="0.6"
      />
      <path
        d="M50,80 Q60,60 70,45"
        stroke={secondaryColor}
        strokeWidth="1.5"
        fill="none"
        opacity="0.6"
      />
      <path
        d="M50,80 Q50,60 50,35"
        stroke={secondaryColor}
        strokeWidth="1.5"
        fill="none"
        opacity="0.6"
      />

      {/* Flowers arranged naturally */}
      {/* Main daisy - center top */}
      <Daisy cx={50} cy={30} scale={config.spread} color={primaryColor} />

      {/* Wild rose - left */}
      <WildRose cx={30} cy={42} scale={config.spread * 0.9} color={accentColor} />

      {/* Lavender - right */}
      <Lavender cx={70} cy={50} scale={config.spread} rotation={15} />

      {/* Additional flowers for denser configurations */}
      {config.flowers >= 4 && (
        <Daisy cx={60} cy={48} scale={config.spread * 0.7} color={primaryColor} />
      )}

      {config.flowers >= 5 && (
        <WildRose cx={40} cy={55} scale={config.spread * 0.65} color={primaryColor} />
      )}

      {/* Baby's breath filler */}
      <BabysBreath cx={45} cy={40} spread={6 * config.spread} />
      <BabysBreath cx={55} cy={55} spread={5 * config.spread} />
      {config.flowers >= 4 && <BabysBreath cx={35} cy={50} spread={4 * config.spread} />}
    </svg>
  );
}
