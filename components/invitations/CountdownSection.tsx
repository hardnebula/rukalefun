"use client";

import { motion } from "framer-motion";
import { useCountdown } from "./hooks/useCountdown";
import { FloralDivider, SingleRose, MinimalFlower } from "./decorations";
import type { FloralStyle } from "./decorations";

interface CountdownSectionProps {
  person1Name: string;
  person2Name: string;
  eventDate: string;
  loveQuote?: string;
  loveQuoteAuthor?: string;
  colors: {
    primary: string;
    secondary: string;
    background: string;
    text: string;
    accent?: string;
  };
  floralStyle?: FloralStyle;
}

export default function CountdownSection({
  person1Name,
  person2Name,
  eventDate,
  loveQuote,
  loveQuoteAuthor,
  colors,
  floralStyle = "rose",
}: CountdownSectionProps) {
  const { days, hours, minutes, seconds, isExpired } = useCountdown(eventDate);
  const accentColor = colors.accent || colors.secondary;

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("es-CL", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  // Small decorative element between countdown units
  const CountdownSeparatorFlower = () => {
    if (floralStyle === "rose") {
      return (
        <div className="mx-1 opacity-40 hidden sm:block">
          <SingleRose
            primaryColor={colors.secondary}
            secondaryColor={colors.primary}
            size={14}
            variant="bud"
            withLeaves={false}
          />
        </div>
      );
    }
    if (floralStyle === "wildflower") {
      return (
        <svg width="12" height="12" viewBox="0 0 12 12" className="mx-1 opacity-50 hidden sm:block">
          {[0, 72, 144, 216, 288].map((angle) => (
            <ellipse
              key={angle}
              cx="6"
              cy="3"
              rx="1.2"
              ry="2.5"
              fill={colors.secondary}
              opacity="0.8"
              transform={`rotate(${angle}, 6, 6)`}
            />
          ))}
          <circle cx="6" cy="6" r="1.5" fill={accentColor} />
        </svg>
      );
    }
    return (
      <div className="mx-1 opacity-40 hidden sm:block">
        <MinimalFlower
          color={colors.primary}
          accentColor={colors.secondary}
          size={12}
          strokeWidth={0.6}
          variant="linear"
          filled={false}
        />
      </div>
    );
  };

  const CountdownUnit = ({
    value,
    label,
  }: {
    value: number;
    label: string;
  }) => (
    <div className="text-center w-16 sm:w-20 md:w-24">
      <div
        className="text-4xl sm:text-5xl md:text-6xl font-serif font-light"
        style={{
          color: colors.text,
          fontVariantNumeric: "tabular-nums",
          fontFeatureSettings: '"tnum"',
        }}
      >
        {value.toString().padStart(2, "0")}
      </div>
      <span
        className="block text-[10px] sm:text-xs uppercase tracking-[0.2em] mt-2"
        style={{ color: colors.primary }}
      >
        {label}
      </span>
    </div>
  );

  const Separator = () => (
    <span
      className="text-2xl sm:text-3xl font-light self-start mt-3"
      style={{ color: `${colors.primary}40` }}
    >
      :
    </span>
  );

  return (
    <section
      className="min-h-screen flex flex-col items-center justify-center px-6 py-16"
      style={{ backgroundColor: colors.background }}
    >
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        viewport={{ once: true }}
        className="text-center max-w-2xl mx-auto w-full"
      >
        {/* Section title */}
        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-xs uppercase tracking-[0.3em] mb-8"
          style={{ color: colors.primary }}
        >
          Nuestro Matrimonio
        </motion.p>

        {/* Names */}
        <h2
          className="font-script text-4xl sm:text-5xl md:text-6xl mb-3"
          style={{ color: colors.text }}
        >
          {person1Name} & {person2Name}
        </h2>

        {/* Floral divider instead of simple line */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          whileInView={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          viewport={{ once: true }}
          className="flex justify-center mb-6"
        >
          <FloralDivider
            floralStyle={floralStyle}
            variant="simple"
            primaryColor={colors.secondary}
            secondaryColor={colors.primary}
            accentColor={accentColor}
            width={250}
          />
        </motion.div>

        {/* Date */}
        <p
          className="text-base sm:text-lg font-serif capitalize mb-16"
          style={{ color: colors.primary }}
        >
          {formatDate(eventDate)}
        </p>

        {/* Countdown */}
        {!isExpired ? (
          <div className="mb-16">
            <p
              className="text-xs uppercase tracking-[0.2em] mb-6"
              style={{ color: `${colors.text}80` }}
            >
              Faltan
            </p>
            <div className="flex justify-center items-start">
              <CountdownUnit value={days} label="Dias" />
              <div className="flex flex-col items-center">
                <Separator />
                <CountdownSeparatorFlower />
              </div>
              <CountdownUnit value={hours} label="Horas" />
              <div className="flex flex-col items-center">
                <Separator />
                <CountdownSeparatorFlower />
              </div>
              <CountdownUnit value={minutes} label="Min" />
              <div className="flex flex-col items-center">
                <Separator />
                <CountdownSeparatorFlower />
              </div>
              <CountdownUnit value={seconds} label="Seg" />
            </div>
          </div>
        ) : (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="mb-16"
          >
            <p
              className="text-2xl font-script"
              style={{ color: colors.primary }}
            >
              ¡El gran dia ha llegado!
            </p>
          </motion.div>
        )}

        {/* Love Quote with floral accents */}
        {loveQuote && (
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.5 }}
            viewport={{ once: true }}
            className="max-w-md mx-auto pt-12 relative"
          >
            {/* Small floral accent above quote */}
            <div className="flex justify-center mb-6">
              <FloralDivider
                floralStyle={floralStyle}
                variant="simple"
                primaryColor={colors.secondary}
                secondaryColor={colors.primary}
                accentColor={accentColor}
                width={180}
              />
            </div>

            <blockquote
              className="text-base sm:text-lg font-serif italic leading-relaxed"
              style={{ color: `${colors.text}cc` }}
            >
              &ldquo;{loveQuote}&rdquo;
            </blockquote>
            {loveQuoteAuthor && (
              <p
                className="mt-4 text-xs uppercase tracking-[0.15em]"
                style={{ color: colors.primary }}
              >
                — {loveQuoteAuthor}
              </p>
            )}
          </motion.div>
        )}
      </motion.div>
    </section>
  );
}
