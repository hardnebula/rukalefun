"use client";

import { motion } from "framer-motion";
import SingleRose from "./SingleRose";
import WildflowerCluster from "./WildflowerCluster";
import MinimalFlower from "./MinimalFlower";

type FloralStyle = "rose" | "wildflower" | "minimal";

interface FloralBottomProps {
  primaryColor?: string;
  secondaryColor?: string;
  accentColor?: string;
  floralStyle?: FloralStyle;
  className?: string;
  animate?: boolean;
}

export default function FloralBottom({
  primaryColor = "#4A7C59",
  secondaryColor = "#E8C4C4",
  accentColor = "#D4A574",
  floralStyle = "rose",
  className = "",
  animate = true,
}: FloralBottomProps) {
  const Wrapper = animate ? motion.div : "div";
  const animationProps = animate
    ? {
        initial: { opacity: 0, y: 20 },
        whileInView: { opacity: 1, y: 0 },
        transition: { duration: 0.8, ease: "easeOut" },
        viewport: { once: true },
      }
    : {};

  // Rose style bottom decoration
  const RoseDecoration = () => (
    <svg
      viewBox="0 0 400 120"
      className={`w-full ${className}`}
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* Left Branch */}
      <g>
        {/* Main curved stem going up */}
        <path
          d="M0,50 Q50,60 100,45 Q140,30 170,40"
          stroke={primaryColor}
          strokeWidth="2"
          fill="none"
          opacity="0.7"
        />
        {/* Secondary stem */}
        <path
          d="M20,30 Q50,40 85,35"
          stroke={primaryColor}
          strokeWidth="1.2"
          fill="none"
          opacity="0.5"
        />

        {/* Leaves along stem */}
        <ellipse cx="35" cy="55" rx="14" ry="6" fill={primaryColor} opacity="0.6" transform="rotate(20, 35, 55)" />
        <ellipse cx="70" cy="48" rx="12" ry="5" fill={primaryColor} opacity="0.65" transform="rotate(-10, 70, 48)" />
        <ellipse cx="110" cy="40" rx="13" ry="5" fill={primaryColor} opacity="0.55" transform="rotate(5, 110, 40)" />
        <ellipse cx="45" cy="35" rx="10" ry="4" fill={primaryColor} opacity="0.5" transform="rotate(-15, 45, 35)" />

        {/* Main rose */}
        <g transform="translate(145, 15)">
          <SingleRose
            primaryColor={secondaryColor}
            secondaryColor={primaryColor}
            size={45}
            variant="full"
            withLeaves={false}
          />
        </g>

        {/* Small rose bud */}
        <g transform="translate(70, 10)">
          <SingleRose
            primaryColor={secondaryColor}
            secondaryColor={primaryColor}
            size={22}
            variant="bud"
            withLeaves={false}
          />
        </g>
      </g>

      {/* Right Branch - mirrored */}
      <g transform="translate(400, 0) scale(-1, 1)">
        {/* Main curved stem */}
        <path
          d="M0,50 Q50,60 100,45 Q140,30 170,40"
          stroke={primaryColor}
          strokeWidth="2"
          fill="none"
          opacity="0.7"
        />
        {/* Secondary stem */}
        <path
          d="M20,30 Q50,40 85,35"
          stroke={primaryColor}
          strokeWidth="1.2"
          fill="none"
          opacity="0.5"
        />

        {/* Leaves along stem */}
        <ellipse cx="35" cy="55" rx="14" ry="6" fill={primaryColor} opacity="0.6" transform="rotate(20, 35, 55)" />
        <ellipse cx="70" cy="48" rx="12" ry="5" fill={primaryColor} opacity="0.65" transform="rotate(-10, 70, 48)" />
        <ellipse cx="110" cy="40" rx="13" ry="5" fill={primaryColor} opacity="0.55" transform="rotate(5, 110, 40)" />
        <ellipse cx="45" cy="35" rx="10" ry="4" fill={primaryColor} opacity="0.5" transform="rotate(-15, 45, 35)" />

        {/* Main rose */}
        <g transform="translate(145, 15)">
          <SingleRose
            primaryColor={secondaryColor}
            secondaryColor={primaryColor}
            size={45}
            variant="full"
            withLeaves={false}
          />
        </g>

        {/* Small rose bud */}
        <g transform="translate(70, 10)">
          <SingleRose
            primaryColor={secondaryColor}
            secondaryColor={primaryColor}
            size={22}
            variant="bud"
            withLeaves={false}
          />
        </g>
      </g>

      {/* Center decoration */}
      <g transform="translate(200, 70)">
        {/* Small leaves pointing down */}
        <ellipse cx="-15" cy="10" rx="8" ry="4" fill={primaryColor} opacity="0.5" transform="rotate(30, -15, 10)" />
        <ellipse cx="15" cy="10" rx="8" ry="4" fill={primaryColor} opacity="0.5" transform="rotate(-30, 15, 10)" />
      </g>

      {/* Accent dots */}
      <circle cx="195" cy="35" r="3" fill={accentColor} opacity="0.6" />
      <circle cx="205" cy="35" r="3" fill={accentColor} opacity="0.6" />
      <circle cx="120" cy="75" r="2" fill={secondaryColor} opacity="0.5" />
      <circle cx="280" cy="75" r="2" fill={secondaryColor} opacity="0.5" />
    </svg>
  );

  // Wildflower style bottom
  const WildflowerDecoration = () => (
    <svg
      viewBox="0 0 400 120"
      className={`w-full ${className}`}
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* Organic stems */}
      <path
        d="M20,60 Q60,70 100,55 Q140,40 175,50"
        stroke={primaryColor}
        strokeWidth="1.5"
        fill="none"
        opacity="0.5"
      />
      <path
        d="M380,60 Q340,70 300,55 Q260,40 225,50"
        stroke={primaryColor}
        strokeWidth="1.5"
        fill="none"
        opacity="0.5"
      />

      {/* Left wildflower cluster */}
      <g transform="translate(50, 20)">
        <WildflowerCluster
          primaryColor={secondaryColor}
          secondaryColor={primaryColor}
          accentColor={accentColor}
          size={60}
          density="medium"
        />
      </g>

      {/* Right wildflower cluster */}
      <g transform="translate(290, 20)">
        <WildflowerCluster
          primaryColor={secondaryColor}
          secondaryColor={primaryColor}
          accentColor={accentColor}
          size={60}
          density="medium"
        />
      </g>

      {/* Center small flowers */}
      <g transform="translate(185, 50)">
        {[0, 72, 144, 216, 288].map((angle) => (
          <ellipse
            key={angle}
            cx="15"
            cy="15"
            rx="3"
            ry="7"
            fill={secondaryColor}
            opacity="0.75"
            transform={`rotate(${angle}, 15, 15)`}
          />
        ))}
        <circle cx="15" cy="15" r="4" fill={accentColor} />
      </g>

      {/* Scattered small leaves */}
      <path d="M130,55 Q138,45 146,55 Q138,58 130,55 Z" fill={primaryColor} opacity="0.4" />
      <path d="M254,55 Q262,45 270,55 Q262,58 254,55 Z" fill={primaryColor} opacity="0.4" />

      {/* Baby's breath */}
      {[75, 110, 145, 255, 290, 325].map((x, i) => (
        <circle
          key={i}
          cx={x}
          cy={75 + (i % 2) * 10}
          r={1.2 + (i % 2) * 0.5}
          fill="white"
          opacity={0.5 + (i % 3) * 0.1}
        />
      ))}

      {/* Small lavender sprigs */}
      <g transform="translate(160, 85) rotate(15)">
        {[0, 3, 6].map((y, i) => (
          <ellipse
            key={i}
            cx={i % 2 === 0 ? 1.5 : -1.5}
            cy={-y}
            rx="2"
            ry="3"
            fill={secondaryColor}
            opacity="0.55"
          />
        ))}
      </g>
      <g transform="translate(240, 85) rotate(-15)">
        {[0, 3, 6].map((y, i) => (
          <ellipse
            key={i}
            cx={i % 2 === 0 ? 1.5 : -1.5}
            cy={-y}
            rx="2"
            ry="3"
            fill={secondaryColor}
            opacity="0.55"
          />
        ))}
      </g>

      {/* Accent dots */}
      <circle cx="180" cy="95" r="2.5" fill={accentColor} opacity="0.5" />
      <circle cx="220" cy="95" r="2.5" fill={accentColor} opacity="0.5" />
    </svg>
  );

  // Minimal style bottom
  const MinimalDecoration = () => (
    <svg
      viewBox="0 0 400 100"
      className={`w-full ${className}`}
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* Clean horizontal lines */}
      <line
        x1="30"
        y1="35"
        x2="150"
        y2="35"
        stroke={primaryColor}
        strokeWidth="1"
        opacity="0.25"
      />
      <line
        x1="250"
        y1="35"
        x2="370"
        y2="35"
        stroke={primaryColor}
        strokeWidth="1"
        opacity="0.25"
      />

      {/* Angled accent lines */}
      <line
        x1="40"
        y1="55"
        x2="80"
        y2="35"
        stroke={primaryColor}
        strokeWidth="0.5"
        opacity="0.2"
      />
      <line
        x1="360"
        y1="55"
        x2="320"
        y2="35"
        stroke={primaryColor}
        strokeWidth="0.5"
        opacity="0.2"
      />

      {/* Left geometric flower */}
      <g transform="translate(55, 40)">
        <MinimalFlower
          color={primaryColor}
          accentColor={secondaryColor}
          size={35}
          strokeWidth={0.8}
          variant="linear"
          filled={false}
        />
      </g>

      {/* Right geometric flower */}
      <g transform="translate(310, 40)">
        <MinimalFlower
          color={primaryColor}
          accentColor={secondaryColor}
          size={35}
          strokeWidth={0.8}
          variant="linear"
          filled={false}
        />
      </g>

      {/* Center decoration */}
      <g transform="translate(175, 25)">
        <MinimalFlower
          color={primaryColor}
          accentColor={secondaryColor}
          size={50}
          strokeWidth={1}
          variant="geometric"
          filled={false}
        />
      </g>

      {/* Small accent circles */}
      <circle cx="120" cy="55" r="3" stroke={primaryColor} strokeWidth="0.6" fill="none" opacity="0.25" />
      <circle cx="280" cy="55" r="3" stroke={primaryColor} strokeWidth="0.6" fill="none" opacity="0.25" />

      {/* Diamond accents */}
      <rect
        x="150"
        y="25"
        width="6"
        height="6"
        stroke={secondaryColor}
        strokeWidth="0.6"
        fill="none"
        transform="rotate(45, 153, 28)"
        opacity="0.35"
      />
      <rect
        x="244"
        y="25"
        width="6"
        height="6"
        stroke={secondaryColor}
        strokeWidth="0.6"
        fill="none"
        transform="rotate(45, 247, 28)"
        opacity="0.35"
      />

      {/* Subtle dots */}
      <circle cx="100" cy="35" r="1.5" fill={primaryColor} opacity="0.25" />
      <circle cx="300" cy="35" r="1.5" fill={primaryColor} opacity="0.25" />
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
