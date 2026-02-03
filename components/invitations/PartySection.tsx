"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import { MusicNotes, Lightbulb, Sparkle } from "@phosphor-icons/react";

interface PartySectionProps {
  invitationId?: Id<"weddingInvitations">;
  dressCode?: string;
  dressCodeDescription?: string;
  additionalNotes?: string;
  colors: {
    primary: string;
    secondary: string;
    background: string;
    text: string;
  };
}

export default function PartySection({
  invitationId,
  dressCode,
  dressCodeDescription,
  additionalNotes,
  colors,
}: PartySectionProps) {
  const [showSongModal, setShowSongModal] = useState(false);
  const [guestName, setGuestName] = useState("");
  const [songTitle, setSongTitle] = useState("");
  const [artist, setArtist] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const submitSuggestion = useMutation(api.songSuggestions.submitSuggestion);

  const handleSubmitSong = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!invitationId || !guestName.trim() || !songTitle.trim()) return;

    setIsSubmitting(true);
    try {
      await submitSuggestion({
        invitationId,
        guestName: guestName.trim(),
        songTitle: songTitle.trim(),
        artist: artist.trim() || undefined,
      });
      setSubmitted(true);
      setTimeout(() => {
        setShowSongModal(false);
        setSubmitted(false);
        setGuestName("");
        setSongTitle("");
        setArtist("");
      }, 2000);
    } catch (error) {
      console.error("Error submitting song:", error);
    } finally {
      setIsSubmitting(false);
    }
  };
  // Phosphor Icons - tamaño grande para mejor visibilidad
  const MusicIcon = () => (
    <MusicNotes size={48} weight="duotone" />
  );

  const DressCodeIcon = () => (
    <svg width="48" height="48" viewBox="0 0 48 48" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      {/* Corbata elegante */}
      <path d="M18 6H30L28.5 12L33 42L24 36L15 42L19.5 12L18 6Z" fill="currentColor" fillOpacity="0.2" />
      <path d="M18 6H30L28.5 12L33 42L24 36L15 42L19.5 12L18 6Z" />
      <path d="M18 6L24 12L30 6" />
      <path d="M21 18L24 22L27 18" strokeWidth="1" />
    </svg>
  );

  const TipsIcon = () => (
    <Sparkle size={48} weight="duotone" />
  );

  const cards = [
    {
      icon: <MusicIcon />,
      title: "Musica & Baile",
      description: "Preparate para celebrar con nosotros en la pista de baile",
      show: true,
      hasButton: true,
      buttonText: "Sugerir Cancion",
      onButtonClick: () => setShowSongModal(true),
    },
    {
      icon: <DressCodeIcon />,
      title: "Codigo de Vestimenta",
      description: dressCode || "Formal elegante",
      subdescription: dressCodeDescription,
      show: true,
    },
    {
      icon: <TipsIcon />,
      title: "Tips para el Dia",
      description: additionalNotes || "El evento sera al aire libre, traer abrigo para la noche",
      show: true,
    },
  ].filter((card) => card.show);

  return (
    <section
      className="min-h-screen flex flex-col items-center justify-center px-4 py-16 relative overflow-hidden"
      style={{ backgroundColor: colors.background }}
    >
      {/* Decorative background pattern */}
      <div className="absolute inset-0 pointer-events-none opacity-5">
        <div className="absolute inset-0" style={{
          backgroundImage: `radial-gradient(${colors.primary} 1px, transparent 1px)`,
          backgroundSize: '40px 40px'
        }} />
      </div>

      {/* Floating decorations */}
      <div className="absolute inset-0 pointer-events-none">
        <motion.div
          animate={{ rotate: [0, 360] }}
          transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
          className="absolute top-16 right-16 opacity-10"
        >
          <svg width="60" height="60" viewBox="0 0 60 60" fill={colors.primary}>
            <path d="M30 0L32 28L60 30L32 32L30 60L28 32L0 30L28 28L30 0Z" />
          </svg>
        </motion.div>
        <motion.div
          animate={{ rotate: [360, 0] }}
          transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
          className="absolute bottom-24 left-12 opacity-10"
        >
          <svg width="40" height="40" viewBox="0 0 40 40" fill={colors.secondary}>
            <path d="M20 0L22 18L40 20L22 22L20 40L18 22L0 20L18 18L20 0Z" />
          </svg>
        </motion.div>
      </div>

      {/* Section Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        viewport={{ once: true }}
        className="text-center mb-12 relative z-10"
      >
        {/* Top ornament */}
        <div className="flex items-center justify-center gap-3 mb-6">
          <div className="h-px w-12 sm:w-20" style={{ backgroundColor: `${colors.primary}50` }} />
          <svg width="24" height="24" viewBox="0 0 24 24" fill={colors.secondary}>
            <path d="M12 2L14 10L22 12L14 14L12 22L10 14L2 12L10 10L12 2Z" />
          </svg>
          <div className="h-px w-12 sm:w-20" style={{ backgroundColor: `${colors.primary}50` }} />
        </div>

        <h2
          className="font-script text-4xl sm:text-5xl md:text-6xl mb-4"
          style={{ color: colors.text }}
        >
          ¡Vamos a Celebrar!
        </h2>

        <p
          className="text-sm uppercase tracking-widest"
          style={{ color: colors.primary }}
        >
          Detalles importantes
        </p>
      </motion.div>

      {/* Cards */}
      <div className="w-full max-w-6xl mx-auto px-4 relative z-10">
        <div className="grid sm:grid-cols-1 md:grid-cols-3 gap-8 items-stretch">
          {cards.map((card, index) => (
            <motion.div
              key={card.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.15 }}
              viewport={{ once: true }}
              className="group relative h-full"
            >
              {/* Card background with gradient border effect */}
              <div
                className="absolute inset-0 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                style={{
                  background: `linear-gradient(135deg, ${colors.secondary}50, ${colors.primary}30)`,
                  transform: 'translate(6px, 6px)',
                }}
              />

              <div
                className="relative rounded-3xl p-10 text-center transition-all duration-300 group-hover:-translate-y-2 group-hover:shadow-2xl h-full flex flex-col"
                style={{
                  backgroundColor: colors.background,
                  border: `2px solid ${colors.secondary}50`,
                  boxShadow: `0 8px 32px ${colors.primary}15`,
                }}
              >
                {/* Icon Container - más grande */}
                <div
                  className="w-28 h-28 mx-auto mb-8 rounded-2xl flex items-center justify-center transition-all duration-300 group-hover:scale-110 group-hover:rotate-3"
                  style={{
                    backgroundColor: `${colors.secondary}20`,
                    color: colors.primary,
                    boxShadow: `0 4px 16px ${colors.secondary}30`,
                  }}
                >
                  {card.icon}
                </div>

                {/* Title - más grande */}
                <h3
                  className="font-script text-3xl mb-4"
                  style={{ color: colors.text }}
                >
                  {card.title}
                </h3>

                {/* Decorative line - más visible */}
                <div className="flex items-center justify-center gap-3 mb-6">
                  <div className="h-px w-10" style={{ backgroundColor: `${colors.secondary}70` }} />
                  <div className="w-3 h-3 rounded-full" style={{ backgroundColor: colors.secondary }} />
                  <div className="h-px w-10" style={{ backgroundColor: `${colors.secondary}70` }} />
                </div>

                {/* Description - texto más grande */}
                <p
                  className="text-base leading-relaxed flex-grow"
                  style={{ color: colors.text, opacity: 0.9 }}
                >
                  {card.description}
                </p>

                {/* Sub-description */}
                {card.subdescription && (
                  <p
                    className="text-sm mt-6 italic px-5 py-3 rounded-xl"
                    style={{
                      color: colors.primary,
                      backgroundColor: `${colors.secondary}15`,
                      border: `1px solid ${colors.secondary}30`,
                    }}
                  >
                    {card.subdescription}
                  </p>
                )}

                {/* Button for song suggestion - más grande */}
                {card.hasButton && invitationId && (
                  <button
                    onClick={card.onButtonClick}
                    className="mt-8 px-8 py-3.5 rounded-full text-base font-semibold transition-all duration-300 hover:scale-105 active:scale-95 shadow-lg hover:shadow-xl"
                    style={{
                      backgroundColor: colors.primary,
                      color: colors.background,
                    }}
                  >
                    {card.buttonText}
                  </button>
                )}
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Bottom decorative element */}
      <motion.div
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        transition={{ duration: 0.8, delay: 0.5 }}
        viewport={{ once: true }}
        className="mt-16 relative z-10"
      >
        <div className="flex items-center justify-center gap-4">
          <motion.div
            animate={{ scale: [1, 1.2, 1] }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill={colors.secondary} className="opacity-40">
              <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
            </svg>
          </motion.div>
          <div className="h-px w-20" style={{ backgroundColor: `${colors.primary}40` }} />
          <span
            className="font-script text-3xl"
            style={{ color: colors.primary }}
          >
            ♡
          </span>
          <div className="h-px w-20" style={{ backgroundColor: `${colors.primary}40` }} />
          <motion.div
            animate={{ scale: [1, 1.2, 1] }}
            transition={{ duration: 2, repeat: Infinity, delay: 0.5 }}
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill={colors.secondary} className="opacity-40">
              <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
            </svg>
          </motion.div>
        </div>
      </motion.div>

      {/* Song Suggestion Modal */}
      <AnimatePresence>
        {showSongModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
            style={{ backgroundColor: "rgba(0,0,0,0.5)" }}
            onClick={() => !isSubmitting && setShowSongModal(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="w-full max-w-md rounded-2xl p-6 shadow-2xl"
              style={{ backgroundColor: colors.background }}
              onClick={(e) => e.stopPropagation()}
            >
              {submitted ? (
                <motion.div
                  initial={{ scale: 0.8 }}
                  animate={{ scale: 1 }}
                  className="text-center py-8"
                >
                  <div
                    className="w-16 h-16 mx-auto mb-4 rounded-full flex items-center justify-center"
                    style={{ backgroundColor: `${colors.secondary}30` }}
                  >
                    <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke={colors.primary} strokeWidth="2">
                      <path d="M20 6L9 17l-5-5" />
                    </svg>
                  </div>
                  <h3 className="font-script text-2xl mb-2" style={{ color: colors.text }}>
                    ¡Gracias!
                  </h3>
                  <p className="text-sm" style={{ color: colors.text, opacity: 0.7 }}>
                    Tu sugerencia ha sido enviada
                  </p>
                </motion.div>
              ) : (
                <>
                  {/* Modal Header */}
                  <div className="text-center mb-6">
                    <div
                      className="w-20 h-20 mx-auto mb-4 rounded-2xl flex items-center justify-center"
                      style={{ backgroundColor: `${colors.secondary}25`, color: colors.primary }}
                    >
                      <MusicNotes size={40} weight="duotone" />
                    </div>
                    <h3 className="font-script text-2xl mb-1" style={{ color: colors.text }}>
                      Sugiere una Cancion
                    </h3>
                    <p className="text-sm" style={{ color: colors.text, opacity: 0.7 }}>
                      ¿Que cancion no puede faltar en la fiesta?
                    </p>
                  </div>

                  {/* Form */}
                  <form onSubmit={handleSubmitSong} className="space-y-4">
                    <div>
                      <label
                        className="block text-sm font-medium mb-1.5"
                        style={{ color: colors.text }}
                      >
                        Tu nombre *
                      </label>
                      <input
                        type="text"
                        value={guestName}
                        onChange={(e) => setGuestName(e.target.value)}
                        placeholder="Escribe tu nombre"
                        required
                        className="w-full px-4 py-2.5 rounded-lg border text-sm focus:outline-none focus:ring-2 transition-all"
                        style={{
                          borderColor: `${colors.secondary}40`,
                          backgroundColor: colors.background,
                          color: colors.text,
                        }}
                      />
                    </div>

                    <div>
                      <label
                        className="block text-sm font-medium mb-1.5"
                        style={{ color: colors.text }}
                      >
                        Nombre de la cancion *
                      </label>
                      <input
                        type="text"
                        value={songTitle}
                        onChange={(e) => setSongTitle(e.target.value)}
                        placeholder="Ej: Felices los 4"
                        required
                        className="w-full px-4 py-2.5 rounded-lg border text-sm focus:outline-none focus:ring-2 transition-all"
                        style={{
                          borderColor: `${colors.secondary}40`,
                          backgroundColor: colors.background,
                          color: colors.text,
                        }}
                      />
                    </div>

                    <div>
                      <label
                        className="block text-sm font-medium mb-1.5"
                        style={{ color: colors.text }}
                      >
                        Artista (opcional)
                      </label>
                      <input
                        type="text"
                        value={artist}
                        onChange={(e) => setArtist(e.target.value)}
                        placeholder="Ej: Maluma"
                        className="w-full px-4 py-2.5 rounded-lg border text-sm focus:outline-none focus:ring-2 transition-all"
                        style={{
                          borderColor: `${colors.secondary}40`,
                          backgroundColor: colors.background,
                          color: colors.text,
                        }}
                      />
                    </div>

                    {/* Buttons */}
                    <div className="flex gap-3 pt-2">
                      <button
                        type="button"
                        onClick={() => setShowSongModal(false)}
                        disabled={isSubmitting}
                        className="flex-1 px-4 py-2.5 rounded-lg text-sm font-medium transition-all hover:opacity-80"
                        style={{
                          backgroundColor: `${colors.secondary}20`,
                          color: colors.text,
                        }}
                      >
                        Cancelar
                      </button>
                      <button
                        type="submit"
                        disabled={isSubmitting || !guestName.trim() || !songTitle.trim()}
                        className="flex-1 px-4 py-2.5 rounded-lg text-sm font-medium transition-all hover:opacity-90 disabled:opacity-50"
                        style={{
                          backgroundColor: colors.primary,
                          color: colors.background,
                        }}
                      >
                        {isSubmitting ? "Enviando..." : "Enviar"}
                      </button>
                    </div>
                  </form>
                </>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
