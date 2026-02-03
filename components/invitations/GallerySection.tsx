"use client";

import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import { X, CaretLeft, CaretRight, Camera } from "@phosphor-icons/react";
import { FloralDivider, FloralCorner, SingleRose, MinimalFlower } from "./decorations";
import type { FloralStyle } from "./decorations";

interface Photo {
  storageId: string;
  url: string | null;
  caption?: string;
  order: number;
}

interface GallerySectionProps {
  photos: Photo[];
  colors: {
    primary: string;
    secondary: string;
    background: string;
    text: string;
    accent?: string;
  };
  floralStyle?: FloralStyle;
}

export default function GallerySection({ photos, colors, floralStyle = "rose" }: GallerySectionProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
  const accentColor = colors.accent || colors.secondary;

  const sortedPhotos = [...photos].sort((a, b) => a.order - b.order);
  const validPhotos = sortedPhotos.filter((p) => p.url);

  const goToSlide = useCallback((index: number) => {
    setCurrentIndex(index);
  }, []);

  const goNext = useCallback(() => {
    setCurrentIndex((prev) => (prev + 1) % validPhotos.length);
  }, [validPhotos.length]);

  const goPrev = useCallback(() => {
    setCurrentIndex((prev) => (prev - 1 + validPhotos.length) % validPhotos.length);
  }, [validPhotos.length]);

  // Auto-advance carousel
  useEffect(() => {
    if (validPhotos.length <= 1 || selectedIndex !== null) return;
    const timer = setInterval(goNext, 5000);
    return () => clearInterval(timer);
  }, [validPhotos.length, selectedIndex, goNext]);

  if (validPhotos.length === 0) {
    return null;
  }

  const openLightbox = (index: number) => setSelectedIndex(index);
  const closeLightbox = () => setSelectedIndex(null);

  // Get visible photos (3 at a time, with wraparound)
  const getVisiblePhotos = () => {
    const result = [];
    for (let i = -1; i <= 1; i++) {
      const index = (currentIndex + i + validPhotos.length) % validPhotos.length;
      result.push({ photo: validPhotos[index], position: i, actualIndex: index });
    }
    return result;
  };

  const visiblePhotos = getVisiblePhotos();

  // Camera icon with floral accent
  const CameraWithFloral = () => (
    <div className="relative">
      <div
        className="w-16 h-16 rounded-full flex items-center justify-center"
        style={{ backgroundColor: `${colors.secondary}20` }}
      >
        <Camera size={32} weight="light" color={colors.primary} />
      </div>
      {/* Small floral accent */}
      {floralStyle === "rose" && (
        <div className="absolute -right-2 -top-1 opacity-70">
          <SingleRose
            primaryColor={colors.secondary}
            secondaryColor={colors.primary}
            size={22}
            variant="bud"
            withLeaves={false}
          />
        </div>
      )}
      {floralStyle === "wildflower" && (
        <svg className="absolute -right-2 -top-1" width="18" height="18" viewBox="0 0 18 18">
          {[0, 72, 144, 216, 288].map((angle) => (
            <ellipse
              key={angle}
              cx="9"
              cy="5"
              rx="2"
              ry="4"
              fill={colors.secondary}
              opacity="0.75"
              transform={`rotate(${angle}, 9, 9)`}
            />
          ))}
          <circle cx="9" cy="9" r="2.5" fill={accentColor} />
        </svg>
      )}
      {floralStyle === "minimal" && (
        <div className="absolute -right-1 top-0 opacity-60">
          <MinimalFlower
            color={colors.primary}
            accentColor={colors.secondary}
            size={18}
            strokeWidth={0.7}
            variant="linear"
            filled={false}
          />
        </div>
      )}
    </div>
  );

  return (
    <section
      className="min-h-screen flex flex-col items-center justify-center px-4 py-16 overflow-hidden relative"
      style={{ backgroundColor: colors.background }}
    >
      {/* Background floral corners */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 0.4 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="absolute top-6 left-6 w-20 h-20"
        >
          <FloralCorner
            variant="topLeft"
            floralStyle={floralStyle}
            primaryColor={colors.secondary}
            secondaryColor={colors.primary}
            accentColor={accentColor}
            size={85}
          />
        </motion.div>
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 0.4 }}
          transition={{ duration: 0.8, delay: 0.1 }}
          viewport={{ once: true }}
          className="absolute top-6 right-6 w-20 h-20"
        >
          <FloralCorner
            variant="topRight"
            floralStyle={floralStyle}
            primaryColor={colors.secondary}
            secondaryColor={colors.primary}
            accentColor={accentColor}
            size={85}
          />
        </motion.div>
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 0.4 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          viewport={{ once: true }}
          className="absolute bottom-6 left-6 w-20 h-20"
        >
          <FloralCorner
            variant="bottomLeft"
            floralStyle={floralStyle}
            primaryColor={colors.secondary}
            secondaryColor={colors.primary}
            accentColor={accentColor}
            size={85}
          />
        </motion.div>
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 0.4 }}
          transition={{ duration: 0.8, delay: 0.3 }}
          viewport={{ once: true }}
          className="absolute bottom-6 right-6 w-20 h-20"
        >
          <FloralCorner
            variant="bottomRight"
            floralStyle={floralStyle}
            primaryColor={colors.secondary}
            secondaryColor={colors.primary}
            accentColor={accentColor}
            size={85}
          />
        </motion.div>
      </div>

      {/* Header with Camera Icon and Floral Decorations */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        viewport={{ once: true }}
        className="text-center mb-8"
      >
        {/* Camera Icon with floral accent */}
        <div className="flex justify-center mb-6">
          <CameraWithFloral />
        </div>

        <h2
          className="font-script text-4xl sm:text-5xl mb-2"
          style={{ color: colors.text }}
        >
          Nuestra Historia
        </h2>
        <p
          className="text-sm uppercase tracking-widest mb-4"
          style={{ color: colors.primary }}
        >
          Momentos juntos
        </p>

        {/* Floral divider under header */}
        <div className="flex justify-center">
          <FloralDivider
            floralStyle={floralStyle}
            variant="simple"
            primaryColor={colors.secondary}
            secondaryColor={colors.primary}
            accentColor={accentColor}
            width={200}
          />
        </div>
      </motion.div>

      {/* Carousel Container */}
      <div className="w-full max-w-6xl mx-auto relative">
        {/* Navigation Arrows */}
        {validPhotos.length > 1 && (
          <>
            <button
              onClick={goPrev}
              className="absolute left-2 md:left-4 top-1/2 -translate-y-1/2 z-20 p-2 rounded-full transition-all hover:scale-110"
              style={{
                backgroundColor: colors.background,
                boxShadow: `0 2px 10px ${colors.primary}30`
              }}
            >
              <CaretLeft size={24} weight="bold" color={colors.primary} />
            </button>
            <button
              onClick={goNext}
              className="absolute right-2 md:right-4 top-1/2 -translate-y-1/2 z-20 p-2 rounded-full transition-all hover:scale-110"
              style={{
                backgroundColor: colors.background,
                boxShadow: `0 2px 10px ${colors.primary}30`
              }}
            >
              <CaretRight size={24} weight="bold" color={colors.primary} />
            </button>
          </>
        )}

        {/* Photos Carousel */}
        <div className="flex items-center justify-center gap-4 md:gap-6 px-12 md:px-16 py-8">
          <AnimatePresence mode="popLayout">
            {visiblePhotos.map(({ photo, position, actualIndex }) => (
              <motion.div
                key={`${photo.storageId}-${position}`}
                layout
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{
                  opacity: position === 0 ? 1 : 0.7,
                  scale: position === 0 ? 1 : 0.85,
                  zIndex: position === 0 ? 10 : 5,
                }}
                exit={{ opacity: 0, scale: 0.8 }}
                transition={{ duration: 0.4, ease: "easeInOut" }}
                className={`relative cursor-pointer flex-shrink-0 ${
                  position === 0
                    ? "w-[280px] h-[350px] md:w-[350px] md:h-[420px]"
                    : "w-[200px] h-[250px] md:w-[280px] md:h-[350px] hidden sm:block"
                }`}
                onClick={() => openLightbox(actualIndex)}
              >
                {/* Colored Border Frame with floral accent for center photo */}
                <div
                  className="absolute inset-0 rounded-xl"
                  style={{
                    padding: "8px",
                    background: position === 0
                      ? `linear-gradient(135deg, ${colors.secondary}60, ${colors.primary}40)`
                      : `${colors.secondary}40`,
                  }}
                >
                  <div
                    className="w-full h-full rounded-lg overflow-hidden"
                    style={{ backgroundColor: colors.background }}
                  >
                    <div className="relative w-full h-full">
                      <Image
                        src={photo.url!}
                        alt={photo.caption || `Foto ${actualIndex + 1}`}
                        fill
                        className="object-cover"
                      />
                    </div>
                  </div>
                </div>

                {/* Small floral accent on active photo */}
                {position === 0 && (
                  <>
                    <div className="absolute -top-2 -left-2 opacity-60 z-20">
                      {floralStyle === "rose" && (
                        <SingleRose
                          primaryColor={colors.secondary}
                          secondaryColor={colors.primary}
                          size={28}
                          variant="bud"
                          withLeaves={false}
                        />
                      )}
                      {floralStyle === "wildflower" && (
                        <svg width="24" height="24" viewBox="0 0 24 24">
                          {[0, 72, 144, 216, 288].map((angle) => (
                            <ellipse
                              key={angle}
                              cx="12"
                              cy="7"
                              rx="2.5"
                              ry="5"
                              fill={colors.secondary}
                              opacity="0.8"
                              transform={`rotate(${angle}, 12, 12)`}
                            />
                          ))}
                          <circle cx="12" cy="12" r="3" fill={accentColor} />
                        </svg>
                      )}
                      {floralStyle === "minimal" && (
                        <MinimalFlower
                          color={colors.primary}
                          accentColor={colors.secondary}
                          size={24}
                          strokeWidth={0.8}
                          variant="linear"
                          filled={false}
                        />
                      )}
                    </div>
                    <div className="absolute -bottom-2 -right-2 opacity-60 z-20">
                      {floralStyle === "rose" && (
                        <SingleRose
                          primaryColor={colors.secondary}
                          secondaryColor={colors.primary}
                          size={28}
                          variant="bud"
                          withLeaves={false}
                        />
                      )}
                      {floralStyle === "wildflower" && (
                        <svg width="24" height="24" viewBox="0 0 24 24">
                          {[0, 72, 144, 216, 288].map((angle) => (
                            <ellipse
                              key={angle}
                              cx="12"
                              cy="7"
                              rx="2.5"
                              ry="5"
                              fill={colors.secondary}
                              opacity="0.8"
                              transform={`rotate(${angle}, 12, 12)`}
                            />
                          ))}
                          <circle cx="12" cy="12" r="3" fill={accentColor} />
                        </svg>
                      )}
                      {floralStyle === "minimal" && (
                        <MinimalFlower
                          color={colors.primary}
                          accentColor={colors.secondary}
                          size={24}
                          strokeWidth={0.8}
                          variant="linear"
                          filled={false}
                        />
                      )}
                    </div>
                  </>
                )}
              </motion.div>
            ))}
          </AnimatePresence>
        </div>

        {/* Dot Indicators */}
        {validPhotos.length > 1 && (
          <div className="flex justify-center gap-2 mt-6">
            {validPhotos.map((_, index) => (
              <button
                key={index}
                onClick={() => goToSlide(index)}
                className="w-2.5 h-2.5 rounded-full transition-all duration-300"
                style={{
                  backgroundColor: index === currentIndex
                    ? colors.primary
                    : `${colors.secondary}50`,
                  transform: index === currentIndex ? "scale(1.2)" : "scale(1)",
                }}
              />
            ))}
          </div>
        )}
      </div>

      {/* Lightbox */}
      <AnimatePresence>
        {selectedIndex !== null && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 p-4"
            onClick={closeLightbox}
          >
            {/* Close button */}
            <button
              onClick={closeLightbox}
              className="absolute top-4 right-4 p-2 rounded-full bg-white/10 hover:bg-white/20 transition-colors"
            >
              <X size={24} weight="bold" className="text-white" />
            </button>

            {/* Navigation */}
            {validPhotos.length > 1 && (
              <>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setSelectedIndex((selectedIndex - 1 + validPhotos.length) % validPhotos.length);
                  }}
                  className="absolute left-4 p-2 rounded-full bg-white/10 hover:bg-white/20 transition-colors"
                >
                  <CaretLeft size={24} weight="bold" className="text-white" />
                </button>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setSelectedIndex((selectedIndex + 1) % validPhotos.length);
                  }}
                  className="absolute right-4 p-2 rounded-full bg-white/10 hover:bg-white/20 transition-colors"
                >
                  <CaretRight size={24} weight="bold" className="text-white" />
                </button>
              </>
            )}

            {/* Image */}
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="relative max-w-4xl max-h-[80vh] w-full h-full"
              onClick={(e) => e.stopPropagation()}
            >
              <Image
                src={validPhotos[selectedIndex].url!}
                alt={validPhotos[selectedIndex].caption || "Foto"}
                fill
                className="object-contain"
              />
              {validPhotos[selectedIndex].caption && (
                <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/60 to-transparent">
                  <p className="text-white text-center">
                    {validPhotos[selectedIndex].caption}
                  </p>
                </div>
              )}
            </motion.div>

            {/* Dots indicator */}
            <div className="absolute bottom-4 left-0 right-0 flex justify-center gap-2">
              {validPhotos.map((_, index) => (
                <button
                  key={index}
                  onClick={(e) => {
                    e.stopPropagation();
                    setSelectedIndex(index);
                  }}
                  className={`w-2 h-2 rounded-full transition-colors ${
                    index === selectedIndex ? "bg-white" : "bg-white/40"
                  }`}
                />
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
