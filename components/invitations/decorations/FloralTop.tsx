"use client";

import { motion } from "framer-motion";
import SingleRose from "./SingleRose";
import WildflowerCluster from "./WildflowerCluster";
import MinimalFlower from "./MinimalFlower";
import LeafBranch from "./LeafBranch";

type FloralStyle = "rose" | "wildflower" | "minimal";

interface FloralTopProps {
  primaryColor?: string;
  secondaryColor?: string;
  accentColor?: string;
  floralStyle?: FloralStyle;
  className?: string;
  animate?: boolean;
}

export default function FloralTop({
  primaryColor = "#4A7C59",
  secondaryColor = "#E8C4C4",
  accentColor = "#D4A574",
  floralStyle = "rose",
  className = "",
  animate = true,
}: FloralTopProps) {
  const Wrapper = animate ? motion.div : "div";
  const animationProps = animate
    ? {
        initial: { opacity: 0, y: -20 },
        whileInView: { opacity: 1, y: 0 },
        transition: { duration: 0.8, ease: "easeOut" },
        viewport: { once: true },
      }
    : {};

  // Rose style - elegant with detailed roses
  const RoseDecoration = () => (
    <svg
      viewBox="0 0 400 160"
      className={`w-full ${className}`}
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* Left Branch with elegant curve */}
      <g>
        {/* Main curved stem */}
        <path
          d="M0,100 Q50,80 100,90 Q150,100 180,80"
          stroke={primaryColor}
          strokeWidth="2.5"
          fill="none"
          opacity="0.7"
        />
        {/* Secondary stem */}
        <path
          d="M20,120 Q60,100 100,105"
          stroke={primaryColor}
          strokeWidth="1.5"
          fill="none"
          opacity="0.5"
        />

        {/* Leaves along stems */}
        <ellipse cx="40" cy="92" rx="18" ry="8" fill={primaryColor} opacity="0.6" transform="rotate(-25, 40, 92)" />
        <ellipse cx="75" cy="95" rx="15" ry="6" fill={primaryColor} opacity="0.7" transform="rotate(10, 75, 95)" />
        <ellipse cx="120" cy="90" rx="16" ry="7" fill={primaryColor} opacity="0.55" transform="rotate(-15, 120, 90)" />
        <ellipse cx="50" cy="115" rx="12" ry="5" fill={primaryColor} opacity="0.5" transform="rotate(20, 50, 115)" />

        {/* Main rose - left side */}
        <g transform="translate(150, 50)">
          <SingleRose
            primaryColor={secondaryColor}
            secondaryColor={primaryColor}
            size={55}
            variant="full"
            withLeaves={false}
          />
        </g>

        {/* Small rose bud */}
        <g transform="translate(65, 65)">
          <SingleRose
            primaryColor={secondaryColor}
            secondaryColor={primaryColor}
            size={28}
            variant="bud"
            withLeaves={false}
          />
        </g>
      </g>

      {/* Right Branch - mirrored */}
      <g transform="translate(400, 0) scale(-1, 1)">
        {/* Main curved stem */}
        <path
          d="M0,100 Q50,80 100,90 Q150,100 180,80"
          stroke={primaryColor}
          strokeWidth="2.5"
          fill="none"
          opacity="0.7"
        />
        {/* Secondary stem */}
        <path
          d="M20,120 Q60,100 100,105"
          stroke={primaryColor}
          strokeWidth="1.5"
          fill="none"
          opacity="0.5"
        />

        {/* Leaves along stems */}
        <ellipse cx="40" cy="92" rx="18" ry="8" fill={primaryColor} opacity="0.6" transform="rotate(-25, 40, 92)" />
        <ellipse cx="75" cy="95" rx="15" ry="6" fill={primaryColor} opacity="0.7" transform="rotate(10, 75, 95)" />
        <ellipse cx="120" cy="90" rx="16" ry="7" fill={primaryColor} opacity="0.55" transform="rotate(-15, 120, 90)" />
        <ellipse cx="50" cy="115" rx="12" ry="5" fill={primaryColor} opacity="0.5" transform="rotate(20, 50, 115)" />

        {/* Main rose - right side */}
        <g transform="translate(150, 50)">
          <SingleRose
            primaryColor={secondaryColor}
            secondaryColor={primaryColor}
            size={55}
            variant="full"
            withLeaves={false}
          />
        </g>

        {/* Small rose bud */}
        <g transform="translate(65, 65)">
          <SingleRose
            primaryColor={secondaryColor}
            secondaryColor={primaryColor}
            size={28}
            variant="bud"
            withLeaves={false}
          />
        </g>
      </g>

      {/* Center decoration */}
      <g transform="translate(200, 25)">
        {/* Small center flower */}
        <SingleRose
          primaryColor={secondaryColor}
          secondaryColor={primaryColor}
          size={35}
          variant="half"
          withLeaves={false}
        />
      </g>

      {/* Small accent dots */}
      <circle cx="190" cy="90" r="4" fill={accentColor} opacity="0.6" />
      <circle cx="210" cy="90" r="4" fill={accentColor} opacity="0.6" />
      <circle cx="100" cy="70" r="3" fill={secondaryColor} opacity="0.5" />
      <circle cx="300" cy="70" r="3" fill={secondaryColor} opacity="0.5" />
    </svg>
  );

  // Wildflower style - natural and varied
  const WildflowerDecoration = () => (
    <svg
      viewBox="0 0 400 160"
      className={`w-full ${className}`}
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* Organic flowing stems */}
      <g>
        <path
          d="M10,130 Q40,100 80,110 Q120,120 150,100 Q170,85 185,90"
          stroke={primaryColor}
          strokeWidth="1.8"
          fill="none"
          opacity="0.6"
        />
        <path
          d="M0,100 Q30,90 60,95 Q100,100 130,85"
          stroke={primaryColor}
          strokeWidth="1.2"
          fill="none"
          opacity="0.45"
        />
      </g>

      {/* Right side stems */}
      <g transform="translate(400, 0) scale(-1, 1)">
        <path
          d="M10,130 Q40,100 80,110 Q120,120 150,100 Q170,85 185,90"
          stroke={primaryColor}
          strokeWidth="1.8"
          fill="none"
          opacity="0.6"
        />
        <path
          d="M0,100 Q30,90 60,95 Q100,100 130,85"
          stroke={primaryColor}
          strokeWidth="1.2"
          fill="none"
          opacity="0.45"
        />
      </g>

      {/* Left wildflower cluster */}
      <g transform="translate(20, 55)">
        <WildflowerCluster
          primaryColor={secondaryColor}
          secondaryColor={primaryColor}
          accentColor={accentColor}
          size={70}
          density="dense"
        />
      </g>

      {/* Right wildflower cluster */}
      <g transform="translate(310, 55)">
        <WildflowerCluster
          primaryColor={secondaryColor}
          secondaryColor={primaryColor}
          accentColor={accentColor}
          size={70}
          density="dense"
        />
      </g>

      {/* Scattered small leaves */}
      <path d="M120,100 Q130,85 140,100 Q130,105 120,100 Z" fill={primaryColor} opacity="0.5" />
      <path d="M260,100 Q270,85 280,100 Q270,105 260,100 Z" fill={primaryColor} opacity="0.5" />

      {/* Center decoration */}
      <g transform="translate(170, 50)">
        {/* Small daisy cluster */}
        {[0, 45, 90, 135, 180, 225, 270, 315].map((angle) => (
          <ellipse
            key={angle}
            cx="30"
            cy="30"
            rx="4"
            ry="10"
            fill={secondaryColor}
            opacity="0.8"
            transform={`rotate(${angle}, 30, 30)`}
          />
        ))}
        <circle cx="30" cy="30" r="6" fill={accentColor} />
      </g>

      {/* Baby's breath scatter */}
      {[60, 95, 130, 270, 305, 340].map((x, i) => (
        <circle
          key={i}
          cx={x}
          cy={70 + (i % 3) * 15}
          r={1.5 + (i % 2)}
          fill="white"
          opacity={0.5 + (i % 3) * 0.15}
        />
      ))}

      {/* Lavender sprigs */}
      <g transform="translate(150, 110) rotate(-15)">
        {[0, 4, 8, 12].map((y, i) => (
          <ellipse
            key={i}
            cx={i % 2 === 0 ? 2 : -2}
            cy={-y}
            rx="2.5"
            ry="4"
            fill={secondaryColor}
            opacity="0.6"
          />
        ))}
      </g>
      <g transform="translate(250, 110) rotate(15)">
        {[0, 4, 8, 12].map((y, i) => (
          <ellipse
            key={i}
            cx={i % 2 === 0 ? 2 : -2}
            cy={-y}
            rx="2.5"
            ry="4"
            fill={secondaryColor}
            opacity="0.6"
          />
        ))}
      </g>
    </svg>
  );

  // Minimal style - clean and geometric
  const MinimalDecoration = () => (
    <svg
      viewBox="0 0 400 120"
      className={`w-full ${className}`}
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* Clean horizontal lines */}
      <line
        x1="30"
        y1="80"
        x2="150"
        y2="80"
        stroke={primaryColor}
        strokeWidth="1"
        opacity="0.25"
      />
      <line
        x1="250"
        y1="80"
        x2="370"
        y2="80"
        stroke={primaryColor}
        strokeWidth="1"
        opacity="0.25"
      />

      {/* Angled accent lines */}
      <line
        x1="40"
        y1="60"
        x2="80"
        y2="80"
        stroke={primaryColor}
        strokeWidth="0.5"
        opacity="0.2"
      />
      <line
        x1="360"
        y1="60"
        x2="320"
        y2="80"
        stroke={primaryColor}
        strokeWidth="0.5"
        opacity="0.2"
      />

      {/* Left geometric flower */}
      <g transform="translate(50, 30)">
        <MinimalFlower
          color={primaryColor}
          accentColor={secondaryColor}
          size={45}
          strokeWidth={1}
          variant="geometric"
          filled={false}
        />
      </g>

      {/* Right geometric flower */}
      <g transform="translate(305, 30)">
        <MinimalFlower
          color={primaryColor}
          accentColor={secondaryColor}
          size={45}
          strokeWidth={1}
          variant="geometric"
          filled={false}
        />
      </g>

      {/* Center main flower */}
      <g transform="translate(175, 15)">
        <MinimalFlower
          color={primaryColor}
          accentColor={secondaryColor}
          size={60}
          strokeWidth={1.2}
          variant="linear"
          filled={false}
        />
      </g>

      {/* Small accent circles */}
      <circle cx="120" cy="50" r="4" stroke={primaryColor} strokeWidth="0.8" fill="none" opacity="0.3" />
      <circle cx="280" cy="50" r="4" stroke={primaryColor} strokeWidth="0.8" fill="none" opacity="0.3" />

      {/* Diamond accents */}
      <rect
        x="150"
        y="85"
        width="8"
        height="8"
        stroke={secondaryColor}
        strokeWidth="0.8"
        fill="none"
        transform="rotate(45, 154, 89)"
        opacity="0.4"
      />
      <rect
        x="242"
        y="85"
        width="8"
        height="8"
        stroke={secondaryColor}
        strokeWidth="0.8"
        fill="none"
        transform="rotate(45, 246, 89)"
        opacity="0.4"
      />

      {/* Subtle dots */}
      <circle cx="100" cy="80" r="2" fill={primaryColor} opacity="0.3" />
      <circle cx="300" cy="80" r="2" fill={primaryColor} opacity="0.3" />
    </svg>
  );

  return (
    <Wrapper {...animationProps}>
      {floralStyle === "rose" && <RoseDecoration />}
      {floralStyle === "wildflower" && <WildflowerDecoration />}
      {floralStyle === "minimal" && <MinimalDecoration />}
    </Wrapper>
  );
}
