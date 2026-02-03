"use client";

import { motion } from "framer-motion";
import { Church, Sparkle, MapPin, ArrowSquareOut } from "@phosphor-icons/react";
import { FloralCorner, FloralDivider, SingleRose, MinimalFlower } from "./decorations";
import type { FloralStyle } from "./decorations";

interface EventDetailsSectionProps {
  ceremonyDate: string;
  ceremonyTime: string;
  ceremonyLocation: string;
  ceremonyAddress: string;
  ceremonyMapsUrl?: string;
  celebrationDate?: string;
  celebrationTime?: string;
  celebrationLocation?: string;
  celebrationAddress?: string;
  celebrationMapsUrl?: string;
  colors: {
    primary: string;
    secondary: string;
    background: string;
    text: string;
    accent?: string;
  };
  floralStyle?: FloralStyle;
}

export default function EventDetailsSection({
  ceremonyDate,
  ceremonyTime,
  ceremonyLocation,
  ceremonyAddress,
  ceremonyMapsUrl,
  celebrationDate,
  celebrationTime,
  celebrationLocation,
  celebrationAddress,
  celebrationMapsUrl,
  colors,
  floralStyle = "rose",
}: EventDetailsSectionProps) {
  const accentColor = colors.accent || colors.secondary;

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("es-CL", {
      weekday: "long",
      day: "numeric",
      month: "long",
    });
  };

  const formatTime = (time: string) => {
    const [hours, minutes] = time.split(":");
    return `${hours}:${minutes} hrs`;
  };

  // Church/Ceremony Icon with floral decoration
  const CeremonyIcon = () => (
    <div className="relative">
      <Church size={48} color={colors.primary} weight="light" />
      {/* Small floral accent */}
      {floralStyle === "rose" && (
        <div className="absolute -right-2 -top-2 opacity-70">
          <SingleRose
            primaryColor={colors.secondary}
            secondaryColor={colors.primary}
            size={18}
            variant="bud"
            withLeaves={false}
          />
        </div>
      )}
      {floralStyle === "wildflower" && (
        <svg className="absolute -right-2 -top-2" width="14" height="14" viewBox="0 0 14 14">
          {[0, 72, 144, 216, 288].map((angle) => (
            <ellipse
              key={angle}
              cx="7"
              cy="4"
              rx="1.5"
              ry="3"
              fill={colors.secondary}
              opacity="0.7"
              transform={`rotate(${angle}, 7, 7)`}
            />
          ))}
          <circle cx="7" cy="7" r="2" fill={accentColor} />
        </svg>
      )}
      {floralStyle === "minimal" && (
        <div className="absolute -right-1 -top-1 opacity-60">
          <MinimalFlower
            color={colors.primary}
            accentColor={colors.secondary}
            size={14}
            strokeWidth={0.6}
            variant="linear"
            filled={false}
          />
        </div>
      )}
    </div>
  );

  // Party/Celebration Icon with floral decoration
  const CelebrationIcon = () => (
    <div className="relative">
      <Sparkle size={48} color={colors.primary} weight="light" />
      {/* Small floral accent */}
      {floralStyle === "rose" && (
        <div className="absolute -left-2 -top-2 opacity-70">
          <SingleRose
            primaryColor={colors.secondary}
            secondaryColor={colors.primary}
            size={18}
            variant="bud"
            withLeaves={false}
          />
        </div>
      )}
      {floralStyle === "wildflower" && (
        <svg className="absolute -left-2 -top-2" width="14" height="14" viewBox="0 0 14 14">
          {[0, 72, 144, 216, 288].map((angle) => (
            <ellipse
              key={angle}
              cx="7"
              cy="4"
              rx="1.5"
              ry="3"
              fill={colors.secondary}
              opacity="0.7"
              transform={`rotate(${angle}, 7, 7)`}
            />
          ))}
          <circle cx="7" cy="7" r="2" fill={accentColor} />
        </svg>
      )}
      {floralStyle === "minimal" && (
        <div className="absolute -left-1 -top-1 opacity-60">
          <MinimalFlower
            color={colors.primary}
            accentColor={colors.secondary}
            size={14}
            strokeWidth={0.6}
            variant="linear"
            filled={false}
          />
        </div>
      )}
    </div>
  );

  const EventCard = ({
    title,
    icon,
    date,
    time,
    location,
    address,
    mapsUrl,
    delay,
  }: {
    title: string;
    icon: React.ReactNode;
    date: string;
    time?: string;
    location: string;
    address: string;
    mapsUrl?: string;
    delay: number;
  }) => (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      whileHover={{
        scale: 1.02,
        y: -5,
        boxShadow: `0 20px 40px ${colors.secondary}30`,
      }}
      transition={{ duration: 0.6, delay }}
      viewport={{ once: true }}
      className="text-center p-8 sm:p-10 rounded-2xl relative overflow-hidden cursor-pointer"
      style={{
        backgroundColor: `${colors.secondary}15`,
        border: `1px solid ${colors.secondary}40`,
        transition: "box-shadow 0.3s ease",
      }}
    >
      {/* Floral corner decorations on card */}
      <div className="absolute top-0 left-0 w-16 h-16 opacity-40">
        <FloralCorner
          variant="topLeft"
          floralStyle={floralStyle}
          primaryColor={colors.secondary}
          secondaryColor={colors.primary}
          accentColor={accentColor}
          size={70}
        />
      </div>
      <div className="absolute bottom-0 right-0 w-16 h-16 opacity-40">
        <FloralCorner
          variant="bottomRight"
          floralStyle={floralStyle}
          primaryColor={colors.secondary}
          secondaryColor={colors.primary}
          accentColor={accentColor}
          size={70}
        />
      </div>

      {/* Icon with decorative circle */}
      <div className="relative mx-auto mb-8 w-24 h-24">
        <motion.div
          className="absolute inset-0 rounded-full"
          style={{ backgroundColor: `${colors.secondary}30` }}
          animate={{ scale: [1, 1.08, 1] }}
          transition={{
            duration: 3,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
        <div
          className="absolute inset-2 rounded-full flex items-center justify-center"
          style={{ backgroundColor: colors.background }}
        >
          {icon}
        </div>
      </div>

      {/* Title */}
      <h3
        className="font-script text-3xl sm:text-4xl mb-6"
        style={{ color: colors.text }}
      >
        {title}
      </h3>

      {/* Floral divider */}
      <div className="flex justify-center mb-6">
        <FloralDivider
          floralStyle={floralStyle}
          variant="simple"
          primaryColor={colors.secondary}
          secondaryColor={colors.primary}
          accentColor={accentColor}
          width={150}
        />
      </div>

      {/* Date */}
      <div className="mb-2">
        <p
          className="text-sm uppercase tracking-wider capitalize font-medium"
          style={{ color: colors.primary }}
        >
          {formatDate(date)}
        </p>
      </div>

      {/* Time */}
      {time && (
        <div className="mb-6">
          <p
            className="text-2xl font-serif"
            style={{ color: colors.text }}
          >
            {formatTime(time)}
          </p>
        </div>
      )}

      {/* Location */}
      <div className="mb-6">
        <p
          className="font-serif text-xl font-medium mb-2"
          style={{ color: colors.text }}
        >
          {location}
        </p>
        <p
          className="text-sm opacity-70"
          style={{ color: colors.text }}
        >
          {address}
        </p>
      </div>

      {/* Maps Link */}
      {mapsUrl && (
        <a
          href={mapsUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 px-6 py-3 rounded-full text-sm font-medium transition-all hover:scale-105 hover:shadow-lg"
          style={{
            backgroundColor: colors.primary,
            color: colors.background,
          }}
        >
          <MapPin size={16} weight="bold" />
          Como llegar
          <ArrowSquareOut size={14} weight="bold" />
        </a>
      )}
    </motion.div>
  );

  return (
    <section
      className="min-h-screen flex flex-col items-center justify-center px-4 py-16 relative"
      style={{ backgroundColor: colors.background }}
    >
      {/* Background floral corners */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 0.5 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="absolute top-8 left-8 w-24 h-24"
        >
          <FloralCorner
            variant="topLeft"
            floralStyle={floralStyle}
            primaryColor={colors.secondary}
            secondaryColor={colors.primary}
            accentColor={accentColor}
            size={100}
          />
        </motion.div>
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 0.5 }}
          transition={{ duration: 0.8, delay: 0.1 }}
          viewport={{ once: true }}
          className="absolute top-8 right-8 w-24 h-24"
        >
          <FloralCorner
            variant="topRight"
            floralStyle={floralStyle}
            primaryColor={colors.secondary}
            secondaryColor={colors.primary}
            accentColor={accentColor}
            size={100}
          />
        </motion.div>
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 0.5 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          viewport={{ once: true }}
          className="absolute bottom-8 left-8 w-24 h-24"
        >
          <FloralCorner
            variant="bottomLeft"
            floralStyle={floralStyle}
            primaryColor={colors.secondary}
            secondaryColor={colors.primary}
            accentColor={accentColor}
            size={100}
          />
        </motion.div>
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 0.5 }}
          transition={{ duration: 0.8, delay: 0.3 }}
          viewport={{ once: true }}
          className="absolute bottom-8 right-8 w-24 h-24"
        >
          <FloralCorner
            variant="bottomRight"
            floralStyle={floralStyle}
            primaryColor={colors.secondary}
            secondaryColor={colors.primary}
            accentColor={accentColor}
            size={100}
          />
        </motion.div>
      </div>

      {/* Section Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        viewport={{ once: true }}
        className="text-center mb-12"
      >
        {/* Top floral divider */}
        <div className="flex justify-center mb-6">
          <FloralDivider
            floralStyle={floralStyle}
            variant="elaborate"
            primaryColor={colors.secondary}
            secondaryColor={colors.primary}
            accentColor={accentColor}
            width={280}
          />
        </div>

        <h2
          className="font-script text-4xl sm:text-5xl md:text-6xl mb-4"
          style={{ color: colors.text }}
        >
          Ceremonia & Celebracion
        </h2>

        <p
          className="text-sm uppercase tracking-widest"
          style={{ color: colors.primary }}
        >
          Te esperamos
        </p>
      </motion.div>

      {/* Cards Grid */}
      <div className="w-full max-w-5xl mx-auto px-4">
        <div className={`grid gap-8 ${celebrationLocation ? "md:grid-cols-2" : "max-w-md mx-auto"}`}>
          {/* Ceremony Card */}
          <EventCard
            title="Ceremonia"
            icon={<CeremonyIcon />}
            date={ceremonyDate}
            time={ceremonyTime}
            location={ceremonyLocation}
            address={ceremonyAddress}
            mapsUrl={ceremonyMapsUrl}
            delay={0.2}
          />

          {/* Celebration Card */}
          {celebrationLocation && (
            <EventCard
              title="Celebracion"
              icon={<CelebrationIcon />}
              date={celebrationDate || ceremonyDate}
              time={celebrationTime}
              location={celebrationLocation}
              address={celebrationAddress || ""}
              mapsUrl={celebrationMapsUrl}
              delay={0.4}
            />
          )}
        </div>
      </div>

      {/* Bottom decorative element */}
      <motion.div
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        transition={{ duration: 0.8, delay: 0.6 }}
        viewport={{ once: true }}
        className="mt-16"
      >
        <div className="flex items-center justify-center gap-4">
          <div className="h-px w-16" style={{ backgroundColor: `${colors.primary}40` }} />
          <svg width="24" height="24" viewBox="0 0 24 24" fill={colors.secondary} className="opacity-60">
            <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
          </svg>
          <div className="h-px w-16" style={{ backgroundColor: `${colors.primary}40` }} />
        </div>
      </motion.div>
    </section>
  );
}
