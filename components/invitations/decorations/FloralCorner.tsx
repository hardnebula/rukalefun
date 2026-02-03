"use client";

import SingleRose from "./SingleRose";
import WildflowerCluster from "./WildflowerCluster";
import MinimalFlower from "./MinimalFlower";

type CornerVariant = "topLeft" | "topRight" | "bottomLeft" | "bottomRight";
type FloralStyle = "rose" | "wildflower" | "minimal";

interface FloralCornerProps {
  variant?: CornerVariant;
  floralStyle?: FloralStyle;
  primaryColor?: string;
  secondaryColor?: string;
  accentColor?: string;
  size?: number;
  className?: string;
}

export default function FloralCorner({
  variant = "topLeft",
  floralStyle = "rose",
  primaryColor = "#E8C4C4",
  secondaryColor = "#4A7C59",
  accentColor = "#D4A574",
  size = 120,
  className = "",
}: FloralCornerProps) {
  // Calculate transform based on corner variant
  const getTransform = () => {
    switch (variant) {
      case "topLeft":
        return "";
      case "topRight":
        return "scaleX(-1)";
      case "bottomLeft":
        return "scaleY(-1)";
      case "bottomRight":
        return "scale(-1, -1)";
      default:
        return "";
    }
  };

  // Rose-based corner decoration
  const RoseCorner = () => (
    <g>
      {/* Main curved branch */}
      <path
        d="M0,0 Q30,10 45,35 Q55,55 50,80"
        stroke={secondaryColor}
        strokeWidth="2"
        fill="none"
        opacity="0.7"
      />
      {/* Secondary branch */}
      <path
        d="M0,30 Q20,35 35,50"
        stroke={secondaryColor}
        strokeWidth="1.5"
        fill="none"
        opacity="0.6"
      />

      {/* Leaves along the branch */}
      <ellipse cx="15" cy="12" rx="10" ry="5" fill={secondaryColor} opacity="0.6" transform="rotate(-25, 15, 12)" />
      <ellipse cx="32" cy="28" rx="12" ry="6" fill={secondaryColor} opacity="0.7" transform="rotate(-10, 32, 28)" />
      <ellipse cx="45" cy="55" rx="10" ry="5" fill={secondaryColor} opacity="0.6" transform="rotate(15, 45, 55)" />
      <ellipse cx="12" cy="38" rx="8" ry="4" fill={secondaryColor} opacity="0.5" transform="rotate(-35, 12, 38)" />

      {/* Main rose */}
      <g transform="translate(40, 65)">
        <SingleRose
          primaryColor={primaryColor}
          secondaryColor={secondaryColor}
          size={45}
          variant="full"
          withLeaves={false}
        />
      </g>

      {/* Small rose bud */}
      <g transform="translate(15, 15)">
        <SingleRose
          primaryColor={primaryColor}
          secondaryColor={secondaryColor}
          size={25}
          variant="bud"
          withLeaves={false}
        />
      </g>

      {/* Small accent flowers */}
      <circle cx="28" cy="45" r="4" fill={accentColor} opacity="0.7" />
      <circle cx="28" cy="45" r="2" fill={secondaryColor} opacity="0.4" />
    </g>
  );

  // Wildflower corner
  const WildflowerCorner = () => (
    <g>
      {/* Organic branch */}
      <path
        d="M0,5 Q25,15 40,40 Q50,60 45,85"
        stroke={secondaryColor}
        strokeWidth="1.5"
        fill="none"
        opacity="0.6"
      />
      <path
        d="M5,0 Q15,20 30,35"
        stroke={secondaryColor}
        strokeWidth="1"
        fill="none"
        opacity="0.5"
      />

      {/* Scattered small leaves */}
      <path d="M10,8 Q18,3 22,12 Q14,15 10,8 Z" fill={secondaryColor} opacity="0.6" />
      <path d="M25,22 Q33,17 37,26 Q29,29 25,22 Z" fill={secondaryColor} opacity="0.5" />
      <path d="M40,45 Q48,40 52,49 Q44,52 40,45 Z" fill={secondaryColor} opacity="0.6" />

      {/* Main wildflower cluster */}
      <g transform="translate(30, 55)">
        <WildflowerCluster
          primaryColor={primaryColor}
          secondaryColor={secondaryColor}
          accentColor={accentColor}
          size={55}
          density="medium"
        />
      </g>

      {/* Small accent flowers */}
      <g transform="translate(10, 15)">
        {/* Small daisy */}
        {[0, 72, 144, 216, 288].map((angle) => (
          <ellipse
            key={angle}
            cx="0"
            cy="-4"
            rx="2"
            ry="4"
            fill={primaryColor}
            opacity="0.8"
            transform={`rotate(${angle})`}
          />
        ))}
        <circle cx="0" cy="0" r="2" fill={accentColor} />
      </g>

      {/* Baby's breath dots */}
      <circle cx="18" cy="30" r="1.5" fill="white" opacity="0.7" />
      <circle cx="35" cy="40" r="1" fill="white" opacity="0.6" />
      <circle cx="22" cy="42" r="1.2" fill="white" opacity="0.65" />
    </g>
  );

  // Minimal geometric corner
  const MinimalCorner = () => (
    <g>
      {/* Clean geometric lines */}
      <path
        d="M0,0 L0,60 M0,0 L60,0"
        stroke={primaryColor}
        strokeWidth="1"
        fill="none"
        opacity="0.3"
      />
      <path
        d="M0,20 L40,20 L40,0"
        stroke={primaryColor}
        strokeWidth="0.5"
        fill="none"
        opacity="0.2"
      />

      {/* Main geometric flower */}
      <g transform="translate(25, 25)">
        <MinimalFlower
          color={primaryColor}
          accentColor={accentColor}
          size={35}
          strokeWidth={1}
          variant="geometric"
          filled={false}
        />
      </g>

      {/* Accent geometric elements */}
      <g transform="translate(60, 60)">
        <MinimalFlower
          color={primaryColor}
          accentColor={accentColor}
          size={20}
          strokeWidth={0.8}
          variant="linear"
          filled={false}
        />
      </g>

      {/* Small dots */}
      <circle cx="50" cy="10" r="2" stroke={primaryColor} strokeWidth="0.5" fill="none" />
      <circle cx="10" cy="50" r="2" stroke={primaryColor} strokeWidth="0.5" fill="none" />

      {/* Corner accent */}
      <rect x="5" y="5" width="10" height="10" stroke={accentColor} strokeWidth="0.5" fill="none" opacity="0.4" />
    </g>
  );

  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 100 100"
      className={className}
      style={{ transform: getTransform() }}
      xmlns="http://www.w3.org/2000/svg"
    >
      {floralStyle === "rose" && <RoseCorner />}
      {floralStyle === "wildflower" && <WildflowerCorner />}
      {floralStyle === "minimal" && <MinimalCorner />}
    </svg>
  );
}
