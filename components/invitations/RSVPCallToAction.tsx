"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { EnvelopeSimple, X } from "@phosphor-icons/react";
import { useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import { Check, Loader2, Heart, UserPlus, MessageSquare } from "lucide-react";

interface RSVPCallToActionProps {
  invitationId: Id<"weddingInvitations">;
  rsvpMessage?: string;
  rsvpDeadline?: string;
  colors: {
    primary: string;
    secondary: string;
    background: string;
    text: string;
  };
}

export default function RSVPCallToAction({
  invitationId,
  rsvpMessage,
  rsvpDeadline,
  colors,
}: RSVPCallToActionProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    guestName: "",
    guestEmail: "",
    guestPhone: "",
    numberOfGuests: 1,
    additionalGuests: [] as string[],
    willAttend: true,
    dietaryRestrictions: "",
    message: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const submitRsvp = useMutation(api.weddingInvitations.submitRsvp);

  const isDeadlinePassed = rsvpDeadline
    ? new Date(rsvpDeadline) < new Date()
    : false;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!formData.guestName.trim()) {
      setError("Por favor ingresa tu nombre");
      return;
    }

    setIsSubmitting(true);

    try {
      await submitRsvp({
        invitationId,
        guestName: formData.guestName.trim(),
        guestEmail: formData.guestEmail.trim() || undefined,
        guestPhone: formData.guestPhone.trim() || undefined,
        numberOfGuests: formData.numberOfGuests,
        additionalGuests: formData.additionalGuests.length > 0 ? formData.additionalGuests : undefined,
        willAttend: formData.willAttend,
        dietaryRestrictions: formData.dietaryRestrictions.trim() || undefined,
        message: formData.message.trim() || undefined,
      });
      setIsSubmitted(true);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Error al enviar confirmacion"
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const closeModal = () => {
    setIsModalOpen(false);
    if (isSubmitted) {
      // Reset form after closing if submitted
      setFormData({
        guestName: "",
        guestEmail: "",
        guestPhone: "",
        numberOfGuests: 1,
        additionalGuests: [],
        willAttend: true,
        dietaryRestrictions: "",
        message: "",
      });
      setIsSubmitted(false);
    }
  };

  return (
    <>
      <section
        className="py-16 px-4"
        style={{ backgroundColor: colors.background }}
      >
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="max-w-2xl mx-auto text-center"
        >
          {/* Decorative line */}
          <div className="flex items-center justify-center gap-3 mb-8">
            <div className="h-px w-16" style={{ backgroundColor: `${colors.primary}40` }} />
            <div
              className="w-3 h-3 rotate-45"
              style={{ backgroundColor: colors.secondary }}
            />
            <div className="h-px w-16" style={{ backgroundColor: `${colors.primary}40` }} />
          </div>

          {/* Icon */}
          <motion.div
            initial={{ scale: 0.8 }}
            whileInView={{ scale: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            viewport={{ once: true }}
            className="mb-6"
          >
            <div
              className="w-20 h-20 mx-auto rounded-full flex items-center justify-center"
              style={{ backgroundColor: `${colors.secondary}25` }}
            >
              <EnvelopeSimple size={40} weight="light" color={colors.primary} />
            </div>
          </motion.div>

          {/* Text */}
          <h3
            className="font-script text-3xl sm:text-4xl mb-3"
            style={{ color: colors.text }}
          >
            Tu presencia es importante
          </h3>
          <p
            className="text-sm mb-8 max-w-md mx-auto"
            style={{ color: colors.text, opacity: 0.8 }}
          >
            Nos encantaria contar contigo en este dia tan especial. Por favor, confirma tu asistencia.
          </p>

          {/* Button */}
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => setIsModalOpen(true)}
            className="inline-flex items-center gap-3 px-8 py-4 rounded-full text-lg font-medium transition-all shadow-lg hover:shadow-xl"
            style={{
              backgroundColor: colors.primary,
              color: colors.background,
              boxShadow: `0 4px 20px ${colors.primary}40`,
            }}
          >
            <EnvelopeSimple size={24} weight="fill" />
            Confirmar Asistencia
          </motion.button>

          {/* Decorative line */}
          <div className="flex items-center justify-center gap-3 mt-8">
            <div className="h-px w-16" style={{ backgroundColor: `${colors.primary}40` }} />
            <div
              className="w-3 h-3 rotate-45"
              style={{ backgroundColor: colors.secondary }}
            />
            <div className="h-px w-16" style={{ backgroundColor: `${colors.primary}40` }} />
          </div>
        </motion.div>
      </section>

      {/* Modal */}
      <AnimatePresence>
        {isModalOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
            style={{ backgroundColor: "rgba(0,0,0,0.5)" }}
            onClick={(e) => {
              if (e.target === e.currentTarget) closeModal();
            }}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="w-full max-w-md max-h-[90vh] overflow-y-auto rounded-2xl shadow-2xl relative"
              style={{ backgroundColor: colors.background }}
            >
              {/* Close button */}
              <button
                onClick={closeModal}
                className="absolute top-4 right-4 p-2 rounded-full hover:bg-black/10 transition-colors z-10"
              >
                <X size={24} color={colors.text} />
              </button>

              <div className="p-6 sm:p-8">
                {/* Deadline passed */}
                {isDeadlinePassed ? (
                  <div className="text-center py-8">
                    <h2
                      className="font-script text-2xl mb-4"
                      style={{ color: colors.text }}
                    >
                      Confirmacion de Asistencia
                    </h2>
                    <p style={{ color: colors.primary }}>
                      El plazo para confirmar asistencia ha finalizado.
                    </p>
                  </div>
                ) : isSubmitted ? (
                  /* Success state */
                  <motion.div
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    className="text-center py-8"
                  >
                    <div
                      className="w-16 h-16 mx-auto mb-6 rounded-full flex items-center justify-center"
                      style={{ backgroundColor: colors.primary }}
                    >
                      <Check className="w-8 h-8" style={{ color: colors.background }} />
                    </div>
                    <h2
                      className="font-script text-2xl mb-4"
                      style={{ color: colors.text }}
                    >
                      ¡Gracias por confirmar!
                    </h2>
                    <p className="mb-2 text-sm" style={{ color: colors.primary }}>
                      {formData.willAttend
                        ? "Nos alegra mucho que puedas acompanarnos en este dia tan especial."
                        : "Lamentamos que no puedas acompanarnos, pero agradecemos tu respuesta."}
                    </p>
                    <Heart
                      className="w-6 h-6 mx-auto mt-6"
                      style={{ color: colors.secondary }}
                      fill={colors.secondary}
                    />
                  </motion.div>
                ) : (
                  /* Form */
                  <>
                    <div className="text-center mb-6">
                      <h2
                        className="font-script text-2xl sm:text-3xl mb-2"
                        style={{ color: colors.text }}
                      >
                        Confirma tu Asistencia
                      </h2>
                      {rsvpMessage && (
                        <p
                          className="text-sm"
                          style={{ color: colors.primary }}
                        >
                          {rsvpMessage}
                        </p>
                      )}
                      {rsvpDeadline && (
                        <p
                          className="text-xs mt-2"
                          style={{ color: colors.text, opacity: 0.7 }}
                        >
                          Confirmar antes del{" "}
                          {new Date(rsvpDeadline).toLocaleDateString("es-CL", {
                            day: "numeric",
                            month: "long",
                            year: "numeric",
                          })}
                        </p>
                      )}
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-4">
                      {/* Will Attend Toggle */}
                      <div className="flex gap-3 mb-6">
                        <button
                          type="button"
                          onClick={() => setFormData({ ...formData, willAttend: true })}
                          className="flex-1 py-2.5 px-4 rounded-full text-sm font-medium transition-all"
                          style={{
                            backgroundColor: formData.willAttend
                              ? colors.primary
                              : "transparent",
                            color: formData.willAttend ? colors.background : colors.text,
                            border: `2px solid ${colors.primary}`,
                          }}
                        >
                          ¡Asistire!
                        </button>
                        <button
                          type="button"
                          onClick={() =>
                            setFormData({ ...formData, willAttend: false, numberOfGuests: 1 })
                          }
                          className="flex-1 py-2.5 px-4 rounded-full text-sm font-medium transition-all"
                          style={{
                            backgroundColor: !formData.willAttend
                              ? colors.primary
                              : "transparent",
                            color: !formData.willAttend ? colors.background : colors.text,
                            border: `2px solid ${colors.primary}`,
                          }}
                        >
                          No podre asistir
                        </button>
                      </div>

                      {/* Name */}
                      <div>
                        <label
                          className="block text-sm font-medium mb-1.5"
                          style={{ color: colors.text }}
                        >
                          Nombre completo *
                        </label>
                        <input
                          type="text"
                          value={formData.guestName}
                          onChange={(e) =>
                            setFormData({ ...formData, guestName: e.target.value })
                          }
                          className="w-full px-4 py-2.5 rounded-lg border focus:outline-none focus:ring-2 transition-all text-sm"
                          style={{
                            borderColor: `${colors.primary}50`,
                            backgroundColor: colors.background,
                            color: colors.text,
                          }}
                          placeholder="Tu nombre"
                          required
                        />
                      </div>

                      {/* Email */}
                      <div>
                        <label
                          className="block text-sm font-medium mb-1.5"
                          style={{ color: colors.text }}
                        >
                          Email (opcional)
                        </label>
                        <input
                          type="email"
                          value={formData.guestEmail}
                          onChange={(e) =>
                            setFormData({ ...formData, guestEmail: e.target.value })
                          }
                          className="w-full px-4 py-2.5 rounded-lg border focus:outline-none focus:ring-2 transition-all text-sm"
                          style={{
                            borderColor: `${colors.primary}50`,
                            backgroundColor: colors.background,
                            color: colors.text,
                          }}
                          placeholder="tu@email.com"
                        />
                      </div>

                      {/* Number of Guests */}
                      {formData.willAttend && (
                        <div>
                          <label
                            className="block text-sm font-medium mb-1.5"
                            style={{ color: colors.text }}
                          >
                            <UserPlus size={14} className="inline mr-1.5" />
                            Numero de asistentes
                          </label>
                          <select
                            value={formData.numberOfGuests}
                            onChange={(e) => {
                              const newCount = parseInt(e.target.value);
                              const currentAdditional = formData.additionalGuests;
                              let newAdditional = [...currentAdditional];

                              if (newCount > 1) {
                                // Adjust array size for additional guests (newCount - 1 because main guest is separate)
                                const additionalCount = newCount - 1;
                                if (newAdditional.length < additionalCount) {
                                  // Add empty strings for new guests
                                  while (newAdditional.length < additionalCount) {
                                    newAdditional.push("");
                                  }
                                } else {
                                  // Trim array if needed
                                  newAdditional = newAdditional.slice(0, additionalCount);
                                }
                              } else {
                                newAdditional = [];
                              }

                              setFormData({
                                ...formData,
                                numberOfGuests: newCount,
                                additionalGuests: newAdditional,
                              });
                            }}
                            className="w-full px-4 py-2.5 rounded-lg border focus:outline-none focus:ring-2 transition-all text-sm"
                            style={{
                              borderColor: `${colors.primary}50`,
                              backgroundColor: colors.background,
                              color: colors.text,
                            }}
                          >
                            {[1, 2, 3, 4, 5].map((num) => (
                              <option key={num} value={num}>
                                {num} {num === 1 ? "persona" : "personas"}
                              </option>
                            ))}
                          </select>
                        </div>
                      )}

                      {/* Additional Guest Names */}
                      {formData.willAttend && formData.numberOfGuests > 1 && (
                        <div className="space-y-3">
                          <label
                            className="block text-sm font-medium"
                            style={{ color: colors.text }}
                          >
                            Nombres de acompañantes
                          </label>
                          {formData.additionalGuests.map((guest, index) => (
                            <input
                              key={index}
                              type="text"
                              value={guest}
                              onChange={(e) => {
                                const newAdditional = [...formData.additionalGuests];
                                newAdditional[index] = e.target.value;
                                setFormData({
                                  ...formData,
                                  additionalGuests: newAdditional,
                                });
                              }}
                              className="w-full px-4 py-2.5 rounded-lg border focus:outline-none focus:ring-2 transition-all text-sm"
                              style={{
                                borderColor: `${colors.primary}50`,
                                backgroundColor: colors.background,
                                color: colors.text,
                              }}
                              placeholder={`Acompañante ${index + 1}`}
                            />
                          ))}
                        </div>
                      )}

                      {/* Message */}
                      <div>
                        <label
                          className="block text-sm font-medium mb-1.5"
                          style={{ color: colors.text }}
                        >
                          <MessageSquare size={14} className="inline mr-1.5" />
                          Mensaje para los novios (opcional)
                        </label>
                        <textarea
                          value={formData.message}
                          onChange={(e) =>
                            setFormData({ ...formData, message: e.target.value })
                          }
                          rows={2}
                          className="w-full px-4 py-2.5 rounded-lg border focus:outline-none focus:ring-2 transition-all resize-none text-sm"
                          style={{
                            borderColor: `${colors.primary}50`,
                            backgroundColor: colors.background,
                            color: colors.text,
                          }}
                          placeholder="Escribe un mensaje..."
                        />
                      </div>

                      {/* Error */}
                      {error && (
                        <p className="text-red-500 text-sm text-center">{error}</p>
                      )}

                      {/* Submit Button */}
                      <button
                        type="submit"
                        disabled={isSubmitting}
                        className="w-full py-3 rounded-full text-base font-medium transition-all hover:scale-[1.02] disabled:opacity-50 disabled:hover:scale-100 flex items-center justify-center gap-2"
                        style={{
                          backgroundColor: colors.primary,
                          color: colors.background,
                        }}
                      >
                        {isSubmitting ? (
                          <>
                            <Loader2 className="w-5 h-5 animate-spin" />
                            Enviando...
                          </>
                        ) : (
                          <>
                            <Heart className="w-5 h-5" />
                            Confirmar
                          </>
                        )}
                      </button>
                    </form>
                  </>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
