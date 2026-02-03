"use client";

import { useState } from "react";
import { useMutation, useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Heart,
  Mail,
  Calendar,
  MapPin,
  Loader2,
  ArrowLeft,
  ArrowRight,
  Check,
  Sparkles,
  Gift,
} from "lucide-react";
import { invitationTemplates } from "@/components/invitations/templates";
import { FloralTop, FloralDivider, SingleRose, MinimalFlower } from "@/components/invitations/decorations";

interface FormData {
  // Step 1: Basic Info
  person1Name: string;
  person2Name: string;
  ownerEmail: string;
  eventDate: string;
  // Step 2: Ceremony
  ceremonyDate: string;
  ceremonyTime: string;
  ceremonyLocation: string;
  ceremonyAddress: string;
  // Step 3: Celebration (optional)
  celebrationLocation: string;
  celebrationAddress: string;
  // Step 4: Template
  templateId: string;
}

const initialFormData: FormData = {
  person1Name: "",
  person2Name: "",
  ownerEmail: "",
  eventDate: "",
  ceremonyDate: "",
  ceremonyTime: "",
  ceremonyLocation: "",
  ceremonyAddress: "",
  celebrationLocation: "Ruka Lefun",
  celebrationAddress: "Villarrica, Chile",
  templateId: "classic",
};

export default function CrearInvitacionPage() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState<FormData>(initialFormData);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const createInvitation = useMutation(api.weddingInvitations.createPublic);
  const price = useQuery(api.invitationSettings.getPrice);

  // Check if email has booking (for showing free badge)
  const bookingCheck = useQuery(
    api.weddingInvitations.checkEmailHasBooking,
    formData.ownerEmail.length > 5 ? { email: formData.ownerEmail } : "skip"
  );

  const totalSteps = 4;

  const updateField = (field: keyof FormData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const canProceed = (): boolean => {
    switch (step) {
      case 1:
        return (
          formData.person1Name.trim() !== "" &&
          formData.person2Name.trim() !== "" &&
          formData.ownerEmail.includes("@") &&
          formData.eventDate !== ""
        );
      case 2:
        return (
          formData.ceremonyDate !== "" &&
          formData.ceremonyTime !== "" &&
          formData.ceremonyLocation.trim() !== "" &&
          formData.ceremonyAddress.trim() !== ""
        );
      case 3:
        return true; // Celebration is optional
      case 4:
        return formData.templateId !== "";
      default:
        return false;
    }
  };

  const handleNext = () => {
    if (step < totalSteps) {
      setStep(step + 1);
    }
  };

  const handleBack = () => {
    if (step > 1) {
      setStep(step - 1);
    }
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    setError(null);

    try {
      const result = await createInvitation({
        person1Name: formData.person1Name.trim(),
        person2Name: formData.person2Name.trim(),
        ownerEmail: formData.ownerEmail.trim(),
        eventDate: formData.eventDate,
        ceremonyDate: formData.ceremonyDate,
        ceremonyTime: formData.ceremonyTime,
        ceremonyLocation: formData.ceremonyLocation.trim(),
        ceremonyAddress: formData.ceremonyAddress.trim(),
        celebrationLocation: formData.celebrationLocation.trim() || undefined,
        celebrationAddress: formData.celebrationAddress.trim() || undefined,
        templateId: formData.templateId,
      });

      // Store credentials in session for editor access
      sessionStorage.setItem("invitation_email", formData.ownerEmail.trim());
      sessionStorage.setItem("invitation_code", result.accessCode);

      // Redirect based on payment status
      if (result.hasFreeAccess) {
        // Free access - go to success page
        router.push(
          `/invitaciones/creada?id=${result.id}&code=${result.accessCode}&slug=${result.slug}`
        );
      } else {
        // Needs payment - go to editor first so they can preview before paying
        router.push("/mi-invitacion/editar");
      }
    } catch (err) {
      setError("Error al crear la invitacion. Por favor intenta de nuevo.");
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F8F4ED] pt-24 pb-12 px-4">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <Badge className="mb-4 bg-pink-100 text-pink-700 border-pink-200">
            <Heart className="w-3 h-3 mr-1" />
            Crear Invitacion
          </Badge>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Crea tu Invitacion Digital
          </h1>
          <p className="text-gray-600">
            Completa los datos para crear tu invitacion personalizada
          </p>
        </div>

        {/* Progress Bar */}
        <div className="mb-8">
          <div className="flex justify-between mb-2">
            {[1, 2, 3, 4].map((s) => (
              <div
                key={s}
                className={`flex items-center justify-center w-10 h-10 rounded-full border-2 transition-colors ${
                  s === step
                    ? "bg-[#4A7C59] border-[#4A7C59] text-white"
                    : s < step
                    ? "bg-green-500 border-green-500 text-white"
                    : "bg-white border-gray-300 text-gray-400"
                }`}
              >
                {s < step ? <Check className="w-5 h-5" /> : s}
              </div>
            ))}
          </div>
          <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
            <div
              className="h-full bg-[#4A7C59] transition-all duration-300"
              style={{ width: `${((step - 1) / (totalSteps - 1)) * 100}%` }}
            />
          </div>
          <div className="flex justify-between mt-2 text-xs text-gray-500">
            <span>Datos</span>
            <span>Ceremonia</span>
            <span>Celebracion</span>
            <span>Plantilla</span>
          </div>
        </div>

        {/* Form Card */}
        <Card className="shadow-lg">
          <CardContent className="p-6">
            <AnimatePresence mode="wait">
              {/* Step 1: Basic Info */}
              {step === 1 && (
                <motion.div
                  key="step1"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="space-y-6"
                >
                  <div className="text-center mb-6">
                    <Heart className="w-12 h-12 mx-auto text-pink-400 mb-2" />
                    <h2 className="text-xl font-semibold text-gray-900">
                      Informacion de la Pareja
                    </h2>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="person1Name">Nombre 1 *</Label>
                      <Input
                        id="person1Name"
                        value={formData.person1Name}
                        onChange={(e) =>
                          updateField("person1Name", e.target.value)
                        }
                        placeholder="Ej: Maria"
                      />
                    </div>
                    <div>
                      <Label htmlFor="person2Name">Nombre 2 *</Label>
                      <Input
                        id="person2Name"
                        value={formData.person2Name}
                        onChange={(e) =>
                          updateField("person2Name", e.target.value)
                        }
                        placeholder="Ej: Juan"
                      />
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="ownerEmail">Email de contacto *</Label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                      <Input
                        id="ownerEmail"
                        type="email"
                        value={formData.ownerEmail}
                        onChange={(e) =>
                          updateField("ownerEmail", e.target.value)
                        }
                        placeholder="tu@email.com"
                        className="pl-10"
                      />
                    </div>
                    <p className="text-xs text-gray-500 mt-1">
                      Este email se usara para acceder a editar tu invitacion
                    </p>
                    {bookingCheck?.hasBooking && (
                      <div className="mt-2 flex items-center gap-2 text-green-600 text-sm">
                        <Gift className="w-4 h-4" />
                        <span>
                          ¡Tienes reserva! Tu invitacion sera gratis
                        </span>
                      </div>
                    )}
                  </div>

                  <div>
                    <Label htmlFor="eventDate">Fecha del evento *</Label>
                    <div className="relative">
                      <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                      <Input
                        id="eventDate"
                        type="date"
                        value={formData.eventDate}
                        onChange={(e) => {
                          updateField("eventDate", e.target.value);
                          if (!formData.ceremonyDate) {
                            updateField("ceremonyDate", e.target.value);
                          }
                        }}
                        className="pl-10"
                      />
                    </div>
                  </div>
                </motion.div>
              )}

              {/* Step 2: Ceremony */}
              {step === 2 && (
                <motion.div
                  key="step2"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="space-y-6"
                >
                  <div className="text-center mb-6">
                    <Sparkles className="w-12 h-12 mx-auto text-amber-400 mb-2" />
                    <h2 className="text-xl font-semibold text-gray-900">
                      Datos de la Ceremonia
                    </h2>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="ceremonyDate">Fecha *</Label>
                      <Input
                        id="ceremonyDate"
                        type="date"
                        value={formData.ceremonyDate}
                        onChange={(e) =>
                          updateField("ceremonyDate", e.target.value)
                        }
                      />
                    </div>
                    <div>
                      <Label htmlFor="ceremonyTime">Hora *</Label>
                      <Input
                        id="ceremonyTime"
                        type="time"
                        value={formData.ceremonyTime}
                        onChange={(e) =>
                          updateField("ceremonyTime", e.target.value)
                        }
                      />
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="ceremonyLocation">Lugar *</Label>
                    <div className="relative">
                      <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                      <Input
                        id="ceremonyLocation"
                        value={formData.ceremonyLocation}
                        onChange={(e) =>
                          updateField("ceremonyLocation", e.target.value)
                        }
                        placeholder="Ej: Iglesia San Jose"
                        className="pl-10"
                      />
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="ceremonyAddress">Direccion *</Label>
                    <Input
                      id="ceremonyAddress"
                      value={formData.ceremonyAddress}
                      onChange={(e) =>
                        updateField("ceremonyAddress", e.target.value)
                      }
                      placeholder="Ej: Av. Principal 123, Villarrica"
                    />
                  </div>
                </motion.div>
              )}

              {/* Step 3: Celebration */}
              {step === 3 && (
                <motion.div
                  key="step3"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="space-y-6"
                >
                  <div className="text-center mb-6">
                    <Heart className="w-12 h-12 mx-auto text-[#4A7C59] mb-2" />
                    <h2 className="text-xl font-semibold text-gray-900">
                      Datos de la Celebracion
                    </h2>
                    <p className="text-sm text-gray-500">
                      Opcional - Puedes dejarlo en blanco si es en el mismo lugar
                    </p>
                  </div>

                  <div>
                    <Label htmlFor="celebrationLocation">Lugar</Label>
                    <div className="relative">
                      <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                      <Input
                        id="celebrationLocation"
                        value={formData.celebrationLocation}
                        onChange={(e) =>
                          updateField("celebrationLocation", e.target.value)
                        }
                        placeholder="Ej: Ruka Lefun"
                        className="pl-10"
                      />
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="celebrationAddress">Direccion</Label>
                    <Input
                      id="celebrationAddress"
                      value={formData.celebrationAddress}
                      onChange={(e) =>
                        updateField("celebrationAddress", e.target.value)
                      }
                      placeholder="Ej: Camino a Pucon Km 5"
                    />
                  </div>
                </motion.div>
              )}

              {/* Step 4: Template */}
              {step === 4 && (
                <motion.div
                  key="step4"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="space-y-6"
                >
                  <div className="text-center mb-6">
                    <Sparkles className="w-12 h-12 mx-auto text-purple-400 mb-2" />
                    <h2 className="text-xl font-semibold text-gray-900">
                      Elige tu Plantilla
                    </h2>
                    <p className="text-sm text-gray-500">
                      Podras cambiarla despues si lo deseas
                    </p>
                  </div>

                  <div className="grid sm:grid-cols-3 gap-4">
                    {Object.values(invitationTemplates).map((template) => {
                      const isSelected = formData.templateId === template.id;
                      const templateDescriptions: Record<string, { title: string; subtitle: string; floralDesc: string }> = {
                        classic: {
                          title: "Clasica",
                          subtitle: "Elegante y atemporal",
                          floralDesc: "Rosas clasicas"
                        },
                        romantic: {
                          title: "Romantica",
                          subtitle: "Suave y delicado",
                          floralDesc: "Flores silvestres"
                        },
                        modern: {
                          title: "Moderna",
                          subtitle: "Minimalista y sofisticado",
                          floralDesc: "Geometrico"
                        }
                      };
                      const desc = templateDescriptions[template.id] || templateDescriptions.classic;

                      return (
                        <button
                          key={template.id}
                          type="button"
                          onClick={() => updateField("templateId", template.id)}
                          className={`
                            relative rounded-2xl border-2 transition-all text-left overflow-hidden group
                            ${isSelected
                              ? "border-[#4A7C59] ring-2 ring-[#4A7C59]/20 shadow-lg"
                              : "border-gray-200 hover:border-gray-300 hover:shadow-md"}
                          `}
                        >
                          {/* Mini Preview Card */}
                          <div
                            className="h-36 relative overflow-hidden"
                            style={{ backgroundColor: template.colors.background }}
                          >
                            {/* Floral decoration preview */}
                            <div className="absolute inset-x-0 top-0 flex justify-center transform scale-50 origin-top">
                              <div className="w-full max-w-[200px]">
                                <FloralTop
                                  primaryColor={template.colors.primary}
                                  secondaryColor={template.colors.secondary}
                                  accentColor={template.colors.accent}
                                  floralStyle={template.floralStyle}
                                  animate={false}
                                />
                              </div>
                            </div>

                            {/* Sample text preview */}
                            <div className="absolute inset-0 flex flex-col items-center justify-center pt-4">
                              <span
                                className="font-script text-lg"
                                style={{ color: template.colors.text }}
                              >
                                Maria
                              </span>
                              <span
                                className="font-script text-sm"
                                style={{ color: template.colors.primary }}
                              >
                                &
                              </span>
                              <span
                                className="font-script text-lg"
                                style={{ color: template.colors.text }}
                              >
                                Juan
                              </span>
                            </div>

                            {/* Floral divider at bottom */}
                            <div className="absolute inset-x-0 bottom-1 flex justify-center transform scale-40 origin-bottom">
                              <FloralDivider
                                floralStyle={template.floralStyle}
                                variant="simple"
                                primaryColor={template.colors.secondary}
                                secondaryColor={template.colors.primary}
                                accentColor={template.colors.accent}
                                width={150}
                              />
                            </div>

                            {/* Selected indicator */}
                            {isSelected && (
                              <div className="absolute top-2 right-2 w-6 h-6 bg-[#4A7C59] rounded-full flex items-center justify-center shadow-md">
                                <Check className="w-3 h-3 text-white" />
                              </div>
                            )}
                          </div>

                          {/* Template info */}
                          <div className="p-3 bg-white">
                            <div className="flex items-start justify-between gap-2">
                              <div>
                                <h4 className="font-semibold text-gray-900 text-sm">{desc.title}</h4>
                                <p className="text-xs text-gray-500">{desc.subtitle}</p>
                              </div>

                              {/* Floral style indicator */}
                              <div className="flex-shrink-0">
                                {template.floralStyle === "rose" && (
                                  <SingleRose
                                    primaryColor={template.colors.secondary}
                                    secondaryColor={template.colors.primary}
                                    size={24}
                                    variant="half"
                                    withLeaves={false}
                                  />
                                )}
                                {template.floralStyle === "wildflower" && (
                                  <div className="w-6 h-6 flex items-center justify-center">
                                    <svg width="20" height="20" viewBox="0 0 28 28">
                                      {[0, 72, 144, 216, 288].map((angle) => (
                                        <ellipse
                                          key={angle}
                                          cx="14"
                                          cy="8"
                                          rx="3"
                                          ry="6"
                                          fill={template.colors.secondary}
                                          opacity="0.85"
                                          transform={`rotate(${angle}, 14, 14)`}
                                        />
                                      ))}
                                      <circle cx="14" cy="14" r="4" fill={template.colors.accent || template.colors.primary} />
                                    </svg>
                                  </div>
                                )}
                                {template.floralStyle === "minimal" && (
                                  <MinimalFlower
                                    color={template.colors.primary}
                                    accentColor={template.colors.secondary}
                                    size={24}
                                    strokeWidth={1}
                                    variant="geometric"
                                    filled={false}
                                  />
                                )}
                              </div>
                            </div>

                            {/* Color swatches */}
                            <div className="flex items-center gap-1 mt-2">
                              <div
                                className="w-4 h-4 rounded-full border border-gray-200 shadow-sm"
                                style={{ backgroundColor: template.colors.primary }}
                                title="Primario"
                              />
                              <div
                                className="w-4 h-4 rounded-full border border-gray-200 shadow-sm"
                                style={{ backgroundColor: template.colors.secondary }}
                                title="Secundario"
                              />
                              <div
                                className="w-4 h-4 rounded-full border border-gray-200 shadow-sm"
                                style={{ backgroundColor: template.colors.background }}
                                title="Fondo"
                              />
                              <span className="text-xs text-gray-400 ml-1">{desc.floralDesc}</span>
                            </div>
                          </div>
                        </button>
                      );
                    })}
                  </div>

                  {/* Summary */}
                  <div className="mt-8 p-4 bg-gray-50 rounded-lg">
                    <h3 className="font-semibold text-gray-900 mb-3">
                      Resumen de tu Invitacion
                    </h3>
                    <div className="space-y-2 text-sm">
                      <p>
                        <span className="text-gray-500">Pareja:</span>{" "}
                        <span className="font-medium">
                          {formData.person1Name} & {formData.person2Name}
                        </span>
                      </p>
                      <p>
                        <span className="text-gray-500">Fecha:</span>{" "}
                        <span className="font-medium">
                          {formData.eventDate
                            ? new Date(formData.eventDate).toLocaleDateString(
                                "es-CL",
                                {
                                  weekday: "long",
                                  year: "numeric",
                                  month: "long",
                                  day: "numeric",
                                }
                              )
                            : "-"}
                        </span>
                      </p>
                      <p>
                        <span className="text-gray-500">Email:</span>{" "}
                        <span className="font-medium">{formData.ownerEmail}</span>
                      </p>
                    </div>

                    {bookingCheck?.hasBooking ? (
                      <div className="mt-4 p-3 bg-green-50 border border-green-200 rounded-lg">
                        <div className="flex items-center gap-2 text-green-700">
                          <Gift className="w-5 h-5" />
                          <span className="font-semibold">
                            ¡Tu invitacion es gratis!
                          </span>
                        </div>
                        <p className="text-sm text-green-600 mt-1">
                          Detectamos tu reserva confirmada
                        </p>
                      </div>
                    ) : (
                      <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                        <p className="text-sm text-blue-700">
                          <span className="font-semibold">
                            Precio para compartir: ${price?.toLocaleString("es-CL") || "15.000"}{" "}
                            CLP
                          </span>
                          <br />
                          Podras editar y subir fotos gratis. El pago es solo para compartir tu invitacion.
                        </p>
                      </div>
                    )}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Error */}
            {error && (
              <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
                {error}
              </div>
            )}

            {/* Navigation Buttons */}
            <div className="flex justify-between mt-8 pt-6 border-t">
              <Button
                type="button"
                variant="outline"
                onClick={handleBack}
                disabled={step === 1 || isSubmitting}
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Atras
              </Button>

              {step < totalSteps ? (
                <Button
                  type="button"
                  onClick={handleNext}
                  disabled={!canProceed()}
                  className="bg-[#4A7C59] hover:bg-[#3d6649]"
                >
                  Siguiente
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              ) : (
                <Button
                  type="button"
                  onClick={handleSubmit}
                  disabled={!canProceed() || isSubmitting}
                  className="bg-[#4A7C59] hover:bg-[#3d6649]"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Creando...
                    </>
                  ) : (
                    <>
                      <Heart className="w-4 h-4 mr-2" />
                      Crear Invitacion
                    </>
                  )}
                </Button>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
