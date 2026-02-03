"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import { Check, Loader2, Heart, UserPlus, MessageSquare } from "lucide-react";

interface RSVPSectionProps {
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

export default function RSVPSection({
  invitationId,
  rsvpMessage,
  rsvpDeadline,
  colors,
}: RSVPSectionProps) {
  const [formData, setFormData] = useState({
    guestName: "",
    guestEmail: "",
    guestPhone: "",
    numberOfGuests: 1,
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

  if (isDeadlinePassed) {
    return (
      <section
        id="rsvp-section"
        className="min-h-screen flex flex-col items-center justify-center px-4 py-16"
        style={{ backgroundColor: colors.background }}
      >
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center"
        >
          <h2
            className="font-serif text-3xl mb-4"
            style={{ color: colors.text }}
          >
            Confirmacion de Asistencia
          </h2>
          <p style={{ color: colors.primary }}>
            El plazo para confirmar asistencia ha finalizado.
          </p>
        </motion.div>
      </section>
    );
  }

  if (isSubmitted) {
    return (
      <section
        id="rsvp-section"
        className="min-h-screen flex flex-col items-center justify-center px-4 py-16"
        style={{ backgroundColor: colors.background }}
      >
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="text-center max-w-md"
        >
          <div
            className="w-20 h-20 mx-auto mb-6 rounded-full flex items-center justify-center"
            style={{ backgroundColor: colors.primary }}
          >
            <Check className="w-10 h-10" style={{ color: colors.background }} />
          </div>
          <h2
            className="font-serif text-3xl mb-4"
            style={{ color: colors.text }}
          >
            ¡Gracias por confirmar!
          </h2>
          <p className="mb-2" style={{ color: colors.primary }}>
            {formData.willAttend
              ? "Nos alegra mucho que puedas acompañarnos en este dia tan especial."
              : "Lamentamos que no puedas acompañarnos, pero agradecemos tu respuesta."}
          </p>
          <Heart
            className="w-8 h-8 mx-auto mt-6"
            style={{ color: colors.secondary }}
            fill={colors.secondary}
          />
        </motion.div>
      </section>
    );
  }

  return (
    <section
      id="rsvp-section"
      className="min-h-screen flex flex-col items-center justify-center px-4 py-16"
      style={{ backgroundColor: colors.background }}
    >
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        viewport={{ once: true }}
        className="text-center mb-8"
      >
        <h2
          className="font-serif text-3xl sm:text-4xl md:text-5xl mb-4"
          style={{ color: colors.text }}
        >
          Confirma tu Asistencia
        </h2>
        {rsvpMessage && (
          <p
            className="max-w-md mx-auto"
            style={{ color: colors.primary }}
          >
            {rsvpMessage}
          </p>
        )}
        {rsvpDeadline && (
          <p
            className="text-sm mt-4"
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
      </motion.div>

      <motion.form
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.2 }}
        viewport={{ once: true }}
        onSubmit={handleSubmit}
        className="w-full max-w-md mx-auto space-y-6"
      >
        {/* Will Attend Toggle */}
        <div className="flex justify-center gap-4 mb-8">
          <button
            type="button"
            onClick={() => setFormData({ ...formData, willAttend: true })}
            className="flex-1 py-3 px-6 rounded-full text-sm font-medium transition-all"
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
            className="flex-1 py-3 px-6 rounded-full text-sm font-medium transition-all"
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
            className="block text-sm font-medium mb-2"
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
            className="w-full px-4 py-3 rounded-lg border focus:outline-none focus:ring-2 transition-all"
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
            className="block text-sm font-medium mb-2"
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
            className="w-full px-4 py-3 rounded-lg border focus:outline-none focus:ring-2 transition-all"
            style={{
              borderColor: `${colors.primary}50`,
              backgroundColor: colors.background,
              color: colors.text,
            }}
            placeholder="tu@email.com"
          />
        </div>

        {/* Phone */}
        <div>
          <label
            className="block text-sm font-medium mb-2"
            style={{ color: colors.text }}
          >
            Telefono (opcional)
          </label>
          <input
            type="tel"
            value={formData.guestPhone}
            onChange={(e) =>
              setFormData({ ...formData, guestPhone: e.target.value })
            }
            className="w-full px-4 py-3 rounded-lg border focus:outline-none focus:ring-2 transition-all"
            style={{
              borderColor: `${colors.primary}50`,
              backgroundColor: colors.background,
              color: colors.text,
            }}
            placeholder="+56 9 1234 5678"
          />
        </div>

        {/* Number of Guests */}
        {formData.willAttend && (
          <div>
            <label
              className="block text-sm font-medium mb-2"
              style={{ color: colors.text }}
            >
              <UserPlus size={16} className="inline mr-2" />
              Numero de asistentes
            </label>
            <select
              value={formData.numberOfGuests}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  numberOfGuests: parseInt(e.target.value),
                })
              }
              className="w-full px-4 py-3 rounded-lg border focus:outline-none focus:ring-2 transition-all"
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

        {/* Dietary Restrictions */}
        {formData.willAttend && (
          <div>
            <label
              className="block text-sm font-medium mb-2"
              style={{ color: colors.text }}
            >
              Restricciones alimentarias (opcional)
            </label>
            <input
              type="text"
              value={formData.dietaryRestrictions}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  dietaryRestrictions: e.target.value,
                })
              }
              className="w-full px-4 py-3 rounded-lg border focus:outline-none focus:ring-2 transition-all"
              style={{
                borderColor: `${colors.primary}50`,
                backgroundColor: colors.background,
                color: colors.text,
              }}
              placeholder="Vegetariano, sin gluten, etc."
            />
          </div>
        )}

        {/* Message */}
        <div>
          <label
            className="block text-sm font-medium mb-2"
            style={{ color: colors.text }}
          >
            <MessageSquare size={16} className="inline mr-2" />
            Mensaje para los novios (opcional)
          </label>
          <textarea
            value={formData.message}
            onChange={(e) =>
              setFormData({ ...formData, message: e.target.value })
            }
            rows={3}
            className="w-full px-4 py-3 rounded-lg border focus:outline-none focus:ring-2 transition-all resize-none"
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
          className="w-full py-4 rounded-full text-lg font-medium transition-all hover:scale-105 disabled:opacity-50 disabled:hover:scale-100 flex items-center justify-center gap-2"
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
              Confirmar Asistencia
            </>
          )}
        </button>
      </motion.form>
    </section>
  );
}
