"use client";

import { motion } from "framer-motion";
import { FloralTop, FloralBottom, FloralCorner, SingleRose, MinimalFlower, WildflowerCluster } from "./decorations";
import type { FloralStyle } from "./decorations";

interface WelcomeSectionProps {
  person1Name: string;
  person2Name: string;
  welcomeText?: string;
  colors: {
    primary: string;
    secondary: string;
    background: string;
    text: string;
    accent?: string;
  };
  floralStyle?: FloralStyle;
}

export default function WelcomeSection({
  person1Name,
  person2Name,
  welcomeText,
  colors,
  floralStyle = "rose",
}: WelcomeSectionProps) {
  const accentColor = colors.accent || colors.secondary;

  // Small decorative flower for accents
  const SmallAccentFlower = () => {
    if (floralStyle === "rose") {
      return (
        <SingleRose
          primaryColor={colors.secondary}
          secondaryColor={colors.primary}
          size={20}
          variant="bud"
          withLeaves={false}
        />
      );
    }
    if (floralStyle === "wildflower") {
      return (
        <svg width="20" height="20" viewBox="0 0 20 20">
          {[0, 72, 144, 216, 288].map((angle) => (
            <ellipse
              key={angle}
              cx="10"
              cy="6"
              rx="2"
              ry="4"
              fill={colors.secondary}
              opacity="0.8"
              transform={`rotate(${angle}, 10, 10)`}
            />
          ))}
          <circle cx="10" cy="10" r="2.5" fill={accentColor} />
        </svg>
      );
    }
    return (
      <MinimalFlower
        color={colors.primary}
        accentColor={colors.secondary}
        size={20}
        strokeWidth={0.8}
        variant="linear"
        filled={false}
      />
    );
  };

  return (
    <section
      className="min-h-screen flex flex-col items-center justify-center px-6 py-12 relative overflow-hidden"
      style={{ backgroundColor: colors.background }}
    >
      {/* Background floral corners */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {/* Top left floral corner */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="absolute top-4 left-4 w-28 h-28 sm:w-36 sm:h-36 opacity-60"
        >
          <FloralCorner
            variant="topLeft"
            floralStyle={floralStyle}
            primaryColor={colors.secondary}
            secondaryColor={colors.primary}
            accentColor={accentColor}
            size={150}
          />
        </motion.div>

        {/* Top right floral corner */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, delay: 0.3 }}
          className="absolute top-4 right-4 w-28 h-28 sm:w-36 sm:h-36 opacity-60"
        >
          <FloralCorner
            variant="topRight"
            floralStyle={floralStyle}
            primaryColor={colors.secondary}
            secondaryColor={colors.primary}
            accentColor={accentColor}
            size={150}
          />
        </motion.div>

        {/* Bottom left floral corner */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="absolute bottom-4 left-4 w-28 h-28 sm:w-36 sm:h-36 opacity-60"
        >
          <FloralCorner
            variant="bottomLeft"
            floralStyle={floralStyle}
            primaryColor={colors.secondary}
            secondaryColor={colors.primary}
            accentColor={accentColor}
            size={150}
          />
        </motion.div>

        {/* Bottom right floral corner */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, delay: 0.5 }}
          className="absolute bottom-4 right-4 w-28 h-28 sm:w-36 sm:h-36 opacity-60"
        >
          <FloralCorner
            variant="bottomRight"
            floralStyle={floralStyle}
            primaryColor={colors.secondary}
            secondaryColor={colors.primary}
            accentColor={accentColor}
            size={150}
          />
        </motion.div>
      </div>

      {/* Top floral decoration */}
      <div className="absolute top-0 inset-x-0 flex justify-center">
        <div className="w-full max-w-xl">
          <FloralTop
            primaryColor={colors.primary}
            secondaryColor={colors.secondary}
            accentColor={accentColor}
            floralStyle={floralStyle}
            animate={true}
          />
        </div>
      </div>

      {/* Main content */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1, delay: 0.2 }}
        className="text-center z-10 max-w-2xl mx-auto"
      >
        {/* Ornamental top line with small flowers */}
        <motion.div
          initial={{ scaleX: 0 }}
          animate={{ scaleX: 1 }}
          transition={{ duration: 0.8, delay: 0.3 }}
          className="flex items-center justify-center gap-4 mb-8"
        >
          <div className="h-px w-16 sm:w-24" style={{ backgroundColor: colors.primary }} />
          <SmallAccentFlower />
          <div className="h-px w-16 sm:w-24" style={{ backgroundColor: colors.primary }} />
        </motion.div>

        {welcomeText && (
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="text-sm uppercase tracking-[0.3em] mb-6"
            style={{ color: colors.primary }}
          >
            {welcomeText}
          </motion.p>
        )}

        {/* Wedding rings icon */}
        <motion.div
          initial={{ opacity: 0, scale: 0 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, delay: 0.5 }}
          className="mb-6"
        >
          <svg width="60" height="40" viewBox="0 0 60 40" className="mx-auto" fill="none" stroke={colors.primary} strokeWidth="1.5">
            <circle cx="20" cy="20" r="12" />
            <circle cx="40" cy="20" r="12" />
            <path d="M28 20 Q30 15, 32 20" strokeWidth="1" />
          </svg>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, delay: 0.6 }}
        >
          {/* First name with small decorative flower */}
          <div className="relative inline-block">
            <h1
              className="font-script text-5xl sm:text-6xl md:text-7xl lg:text-8xl leading-tight"
              style={{ color: colors.text }}
            >
              {person1Name}
            </h1>
            {/* Small flower accent near name */}
            <motion.div
              initial={{ opacity: 0, scale: 0 }}
              animate={{ opacity: 0.6, scale: 1 }}
              transition={{ duration: 0.5, delay: 1 }}
              className="absolute -right-6 top-0 hidden sm:block"
            >
              <SmallAccentFlower />
            </motion.div>
          </div>

          {/* Decorative ampersand with ornaments */}
          <div className="flex items-center justify-center gap-4 my-4">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: "3rem" }}
              transition={{ duration: 0.6, delay: 0.8 }}
              className="h-px sm:w-16"
              style={{ backgroundColor: colors.secondary }}
            />
            <span
              className="font-script text-4xl sm:text-5xl md:text-6xl"
              style={{ color: colors.primary }}
            >
              &
            </span>
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: "3rem" }}
              transition={{ duration: 0.6, delay: 0.8 }}
              className="h-px sm:w-16"
              style={{ backgroundColor: colors.secondary }}
            />
          </div>

          {/* Second name with small decorative flower */}
          <div className="relative inline-block">
            <h1
              className="font-script text-5xl sm:text-6xl md:text-7xl lg:text-8xl leading-tight"
              style={{ color: colors.text }}
            >
              {person2Name}
            </h1>
            {/* Small flower accent near name */}
            <motion.div
              initial={{ opacity: 0, scale: 0 }}
              animate={{ opacity: 0.6, scale: 1 }}
              transition={{ duration: 0.5, delay: 1.1 }}
              className="absolute -left-6 bottom-0 hidden sm:block"
            >
              <SmallAccentFlower />
            </motion.div>
          </div>
        </motion.div>

        {/* Ornamental bottom line */}
        <motion.div
          initial={{ scaleX: 0 }}
          animate={{ scaleX: 1 }}
          transition={{ duration: 0.8, delay: 1 }}
          className="flex items-center justify-center gap-4 mt-8"
        >
          <div className="h-px w-12 sm:w-20" style={{ backgroundColor: colors.primary }} />
          <svg width="24" height="24" viewBox="0 0 24 24" fill={colors.secondary} className="opacity-60">
            <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
          </svg>
          <div className="h-px w-12 sm:w-20" style={{ backgroundColor: colors.primary }} />
        </motion.div>

        {/* Scroll indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 1.5 }}
          className="mt-16"
        >
          <motion.div
            animate={{ y: [0, 8, 0] }}
            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
            className="flex flex-col items-center cursor-pointer"
            style={{ color: colors.primary }}
            onClick={() => {
              const nextSection = document.querySelector("section:nth-of-type(2)");
              if (nextSection) nextSection.scrollIntoView({ behavior: "smooth" });
            }}
          >
            <span className="text-[11px] uppercase tracking-[0.25em] mb-2 opacity-60 font-light">
              Desliza
            </span>
            <svg
              width="20"
              height="28"
              viewBox="0 0 20 28"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="opacity-50"
            >
              <path d="M10 0 L10 24" />
              <path d="M3 17 L10 24 L17 17" />
            </svg>
          </motion.div>
        </motion.div>
      </motion.div>

      {/* Bottom floral decoration */}
      <div className="absolute bottom-0 inset-x-0 flex justify-center">
        <div className="w-full max-w-xl">
          <FloralBottom
            primaryColor={colors.primary}
            secondaryColor={colors.secondary}
            accentColor={accentColor}
            floralStyle={floralStyle}
            animate={true}
          />
        </div>
      </div>
    </section>
  );
}
