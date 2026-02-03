"use client";

import SingleRose from "./SingleRose";
import MinimalFlower from "./MinimalFlower";

type FloralStyle = "rose" | "wildflower" | "minimal";
type DividerVariant = "simple" | "elaborate";

interface FloralDividerProps {
  floralStyle?: FloralStyle;
  variant?: DividerVariant;
  primaryColor?: string;
  secondaryColor?: string;
  accentColor?: string;
  width?: number;
  className?: string;
}

export default function FloralDivider({
  floralStyle = "rose",
  variant = "simple",
  primaryColor = "#E8C4C4",
  secondaryColor = "#4A7C59",
  accentColor = "#D4A574",
  width = 300,
  className = "",
}: FloralDividerProps) {
  const height = variant === "elaborate" ? 60 : 40;

  // Rose style divider
  const RoseDivider = () => (
    <g>
      {/* Center flower */}
      <g transform={`translate(${150 - 20}, ${height / 2 - 20})`}>
        <SingleRose
          primaryColor={primaryColor}
          secondaryColor={secondaryColor}
          size={40}
          variant={variant === "elaborate" ? "full" : "half"}
          withLeaves={false}
        />
      </g>

      {/* Left branch */}
      <path
        d={`M20,${height / 2} Q70,${height / 2 - 5} 120,${height / 2}`}
        stroke={secondaryColor}
        strokeWidth="1.5"
        fill="none"
        opacity="0.6"
      />
      {/* Right branch */}
      <path
        d={`M180,${height / 2} Q230,${height / 2 - 5} 280,${height / 2}`}
        stroke={secondaryColor}
        strokeWidth="1.5"
        fill="none"
        opacity="0.6"
      />

      {/* Leaves */}
      <ellipse cx="50" cy={height / 2 - 3} rx="12" ry="5" fill={secondaryColor} opacity="0.5" transform={`rotate(-15, 50, ${height / 2 - 3})`} />
      <ellipse cx="85" cy={height / 2} rx="10" ry="4" fill={secondaryColor} opacity="0.6" transform={`rotate(10, 85, ${height / 2})`} />
      <ellipse cx="215" cy={height / 2} rx="10" ry="4" fill={secondaryColor} opacity="0.6" transform={`rotate(-10, 215, ${height / 2})`} />
      <ellipse cx="250" cy={height / 2 - 3} rx="12" ry="5" fill={secondaryColor} opacity="0.5" transform={`rotate(15, 250, ${height / 2 - 3})`} />

      {/* Small accent flowers */}
      {variant === "elaborate" && (
        <>
          <g transform={`translate(60, ${height / 2 - 8})`}>
            <SingleRose primaryColor={primaryColor} secondaryColor={secondaryColor} size={18} variant="bud" withLeaves={false} />
          </g>
          <g transform={`translate(222, ${height / 2 - 8})`}>
            <SingleRose primaryColor={primaryColor} secondaryColor={secondaryColor} size={18} variant="bud" withLeaves={false} />
          </g>
        </>
      )}

      {/* End decorations */}
      <circle cx="15" cy={height / 2} r="3" fill={accentColor} opacity="0.6" />
      <circle cx="285" cy={height / 2} r="3" fill={accentColor} opacity="0.6" />
    </g>
  );

  // Wildflower style divider
  const WildflowerDivider = () => (
    <g>
      {/* Center floral cluster */}
      <g transform={`translate(130, ${height / 2 - 15})`}>
        {/* Central daisy */}
        {[0, 45, 90, 135, 180, 225, 270, 315].map((angle) => (
          <ellipse
            key={angle}
            cx="20"
            cy="15"
            rx="3"
            ry="7"
            fill={primaryColor}
            opacity="0.85"
            transform={`rotate(${angle}, 20, 15)`}
          />
        ))}
        <circle cx="20" cy="15" r="4" fill={accentColor} />
      </g>

      {/* Curved stems */}
      <path
        d={`M30,${height / 2} Q80,${height / 2 - 8} 130,${height / 2}`}
        stroke={secondaryColor}
        strokeWidth="1.2"
        fill="none"
        opacity="0.5"
      />
      <path
        d={`M170,${height / 2} Q220,${height / 2 - 8} 270,${height / 2}`}
        stroke={secondaryColor}
        strokeWidth="1.2"
        fill="none"
        opacity="0.5"
      />

      {/* Small wildflowers */}
      {[60, 100, 200, 240].map((x, i) => (
        <g key={x} transform={`translate(${x}, ${height / 2 - 4})`}>
          {[0, 72, 144, 216, 288].map((angle) => (
            <ellipse
              key={angle}
              cx="0"
              cy="-3"
              rx="1.5"
              ry="3.5"
              fill={i % 2 === 0 ? primaryColor : accentColor}
              opacity="0.7"
              transform={`rotate(${angle})`}
            />
          ))}
          <circle cx="0" cy="0" r="1.5" fill={secondaryColor} opacity="0.5" />
        </g>
      ))}

      {/* Scattered small leaves */}
      <path d={`M45,${height / 2 + 2} Q50,${height / 2 - 5} 55,${height / 2 + 2}`} fill={secondaryColor} opacity="0.4" />
      <path d={`M245,${height / 2 + 2} Q250,${height / 2 - 5} 255,${height / 2 + 2}`} fill={secondaryColor} opacity="0.4" />

      {/* Baby's breath dots */}
      <circle cx="75" cy={height / 2 - 2} r="1.2" fill="white" opacity="0.6" />
      <circle cx="115" cy={height / 2 + 2} r="1" fill="white" opacity="0.5" />
      <circle cx="185" cy={height / 2 + 2} r="1" fill="white" opacity="0.5" />
      <circle cx="225" cy={height / 2 - 2} r="1.2" fill="white" opacity="0.6" />

      {variant === "elaborate" && (
        <>
          {/* Additional lavender sprigs */}
          <g transform={`translate(40, ${height / 2 + 5}) rotate(-20)`}>
            {[0, 3, 6, 9].map((y) => (
              <ellipse key={y} cx={y % 2 === 0 ? 1 : -1} cy={-y} rx="1.5" ry="2.5" fill={primaryColor} opacity="0.6" />
            ))}
          </g>
          <g transform={`translate(260, ${height / 2 + 5}) rotate(20)`}>
            {[0, 3, 6, 9].map((y) => (
              <ellipse key={y} cx={y % 2 === 0 ? 1 : -1} cy={-y} rx="1.5" ry="2.5" fill={primaryColor} opacity="0.6" />
            ))}
          </g>
        </>
      )}

      {/* End dots */}
      <circle cx="20" cy={height / 2} r="2.5" fill={accentColor} opacity="0.5" />
      <circle cx="280" cy={height / 2} r="2.5" fill={accentColor} opacity="0.5" />
    </g>
  );

  // Minimal style divider
  const MinimalDivider = () => (
    <g>
      {/* Clean horizontal lines */}
      <line
        x1="20"
        y1={height / 2}
        x2="120"
        y2={height / 2}
        stroke={primaryColor}
        strokeWidth="1"
        opacity="0.3"
      />
      <line
        x1="180"
        y1={height / 2}
        x2="280"
        y2={height / 2}
        stroke={primaryColor}
        strokeWidth="1"
        opacity="0.3"
      />

      {/* Center geometric flower */}
      <g transform={`translate(130, ${height / 2 - 15})`}>
        <MinimalFlower
          color={primaryColor}
          accentColor={accentColor}
          size={40}
          strokeWidth={1}
          variant="geometric"
          filled={false}
        />
      </g>

      {/* Small geometric accents */}
      <circle cx="50" cy={height / 2} r="3" stroke={primaryColor} strokeWidth="0.8" fill="none" opacity="0.4" />
      <circle cx="250" cy={height / 2} r="3" stroke={primaryColor} strokeWidth="0.8" fill="none" opacity="0.4" />

      {variant === "elaborate" && (
        <>
          {/* Additional small flowers */}
          <g transform={`translate(75, ${height / 2 - 10})`}>
            <MinimalFlower
              color={primaryColor}
              accentColor={accentColor}
              size={20}
              strokeWidth={0.6}
              variant="linear"
              filled={false}
            />
          </g>
          <g transform={`translate(205, ${height / 2 - 10})`}>
            <MinimalFlower
              color={primaryColor}
              accentColor={accentColor}
              size={20}
              strokeWidth={0.6}
              variant="linear"
              filled={false}
            />
          </g>

          {/* Thin connecting lines */}
          <line x1="90" y1={height / 2 - 3} x2="120" y2={height / 2} stroke={primaryColor} strokeWidth="0.5" opacity="0.2" />
          <line x1="180" y1={height / 2} x2="210" y2={height / 2 - 3} stroke={primaryColor} strokeWidth="0.5" opacity="0.2" />
        </>
      )}

      {/* End decorations */}
      <rect x="15" y={height / 2 - 2} width="4" height="4" stroke={accentColor} strokeWidth="0.5" fill="none" transform={`rotate(45, 17, ${height / 2})`} />
      <rect x="281" y={height / 2 - 2} width="4" height="4" stroke={accentColor} strokeWidth="0.5" fill="none" transform={`rotate(45, 283, ${height / 2})`} />
    </g>
  );

  return (
    <svg
      width={width}
      height={height}
      viewBox={`0 0 300 ${height}`}
      className={className}
      xmlns="http://www.w3.org/2000/svg"
      preserveAspectRatio="xMidYMid meet"
    >
      {floralStyle === "rose" && <RoseDivider />}
      {floralStyle === "wildflower" && <WildflowerDivider />}
      {floralStyle === "minimal" && <MinimalDivider />}
    </svg>
  );
}
