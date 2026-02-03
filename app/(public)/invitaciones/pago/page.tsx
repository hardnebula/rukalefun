"use client";

import { Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import Link from "next/link";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Heart,
  Copy,
  CreditCard,
  Clock,
  MessageCircle,
  Key,
  Calendar,
  Loader2,
} from "lucide-react";
import { toast } from "sonner";
import { Toaster } from "@/components/ui/sonner";

function PagoPendienteContent() {
  const searchParams = useSearchParams();
  const invitationId = searchParams.get("id") as Id<"weddingInvitations"> | null;

  const invitation = useQuery(
    api.weddingInvitations.getForPayment,
    invitationId ? { id: invitationId } : "skip"
  );
  const price = useQuery(api.invitationSettings.getPrice);

  const formattedPrice = price ? price.toLocaleString("es-CL") : "15.000";

  const copyToClipboard = async (text: string, label: string) => {
    await navigator.clipboard.writeText(text);
    toast.success(`${label} copiado al portapapeles`);
  };

  // WhatsApp message
  const whatsappMessage = encodeURIComponent(
    `Hola! Acabo de crear mi invitacion de matrimonio digital y quiero coordinar el pago.\n\nCodigo: ${invitation?.accessCode || ""}\nNombres: ${invitation?.person1Name || ""} & ${invitation?.person2Name || ""}`
  );
  const whatsappLink = `https://wa.me/56912345678?text=${whatsappMessage}`; // Replace with actual WhatsApp number

  if (!invitationId) {
    return (
      <div className="min-h-screen bg-[#F8F4ED] pt-32 pb-12 px-4">
        <div className="max-w-md mx-auto text-center">
          <Heart className="w-16 h-16 mx-auto text-gray-300 mb-4" />
          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            Invitacion no encontrada
          </h1>
          <p className="text-gray-600 mb-6">
            No pudimos encontrar los datos de tu invitacion.
          </p>
          <Link href="/invitaciones/crear">
            <Button className="bg-[#4A7C59] hover:bg-[#3d6649]">
              Crear Nueva Invitacion
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  if (invitation === undefined) {
    return (
      <div className="min-h-screen bg-[#F8F4ED] pt-32 pb-12 px-4">
        <div className="max-w-md mx-auto text-center">
          <Loader2 className="w-12 h-12 mx-auto animate-spin text-[#4A7C59] mb-4" />
          <p className="text-gray-600">Cargando...</p>
        </div>
      </div>
    );
  }

  if (!invitation) {
    return (
      <div className="min-h-screen bg-[#F8F4ED] pt-32 pb-12 px-4">
        <div className="max-w-md mx-auto text-center">
          <Heart className="w-16 h-16 mx-auto text-gray-300 mb-4" />
          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            Invitacion no encontrada
          </h1>
          <p className="text-gray-600 mb-6">
            La invitacion que buscas no existe o fue eliminada.
          </p>
          <Link href="/invitaciones/crear">
            <Button className="bg-[#4A7C59] hover:bg-[#3d6649]">
              Crear Nueva Invitacion
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  // If already paid, redirect to success
  if (invitation.isPaid) {
    return (
      <div className="min-h-screen bg-[#F8F4ED] pt-32 pb-12 px-4">
        <div className="max-w-md mx-auto text-center">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Heart className="w-8 h-8 text-green-500" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            ¡Tu invitacion ya esta activa!
          </h1>
          <p className="text-gray-600 mb-6">
            Ya puedes acceder a editar tu invitacion.
          </p>
          <Link href="/mi-invitacion">
            <Button className="bg-[#4A7C59] hover:bg-[#3d6649]">
              Ir al Editor
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F8F4ED] pt-24 pb-12 px-4">
      <Toaster />
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <div className="w-20 h-20 bg-amber-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Clock className="w-10 h-10 text-amber-500" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Desbloquea tu Invitacion
          </h1>
          <p className="text-gray-600">
            Tu invitacion esta lista. Completa el pago para poder compartirla con tus invitados.
          </p>
        </motion.div>

        {/* Invitation Summary */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <Card className="shadow-lg mb-6">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold text-gray-900">
                  Tu Invitacion
                </h2>
                <Badge variant="outline" className="text-amber-600 border-amber-300">
                  Pendiente de pago
                </Badge>
              </div>

              <div className="bg-gray-50 rounded-lg p-4 mb-4">
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-gray-500">Pareja</span>
                    <p className="font-medium text-gray-900">
                      {invitation.person1Name} & {invitation.person2Name}
                    </p>
                  </div>
                  <div>
                    <span className="text-gray-500">Fecha del evento</span>
                    <p className="font-medium text-gray-900 flex items-center gap-1">
                      <Calendar className="w-4 h-4" />
                      {new Date(invitation.eventDate).toLocaleDateString("es-CL")}
                    </p>
                  </div>
                </div>
              </div>

              {/* Access Code */}
              <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
                <div className="flex items-center gap-2 text-amber-800 mb-2">
                  <Key className="w-5 h-5" />
                  <span className="font-semibold">Tu Codigo de Acceso</span>
                </div>
                <p className="text-sm text-amber-700 mb-3">
                  Guardalo - lo necesitaras cuando se active tu invitacion
                </p>
                <div className="flex items-center gap-2">
                  <code className="flex-1 bg-white border border-amber-300 rounded-lg px-4 py-2 text-xl font-mono tracking-widest text-center font-bold">
                    {invitation.accessCode}
                  </code>
                  <Button
                    size="icon"
                    variant="outline"
                    onClick={() =>
                      copyToClipboard(invitation.accessCode, "Codigo")
                    }
                  >
                    <Copy className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Payment Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <Card className="shadow-lg border-2 border-[#4A7C59]">
            <CardContent className="p-6">
              <div className="text-center mb-6">
                <CreditCard className="w-12 h-12 mx-auto text-[#4A7C59] mb-3" />
                <h2 className="text-2xl font-bold text-gray-900">
                  ${formattedPrice} CLP
                </h2>
                <p className="text-gray-500">Pago unico</p>
              </div>

              {/* Payment Options Placeholder */}
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
                <h3 className="font-semibold text-blue-800 mb-2">
                  Integracion de Pago Proximamente
                </h3>
                <p className="text-sm text-blue-700">
                  Estamos trabajando en habilitar el pago en linea. Por ahora,
                  puedes coordinar el pago por WhatsApp.
                </p>
              </div>

              {/* WhatsApp Button */}
              <a
                href={whatsappLink}
                target="_blank"
                rel="noopener noreferrer"
                className="block"
              >
                <Button className="w-full bg-green-500 hover:bg-green-600 text-white mb-4">
                  <MessageCircle className="w-5 h-5 mr-2" />
                  Coordinar Pago por WhatsApp
                </Button>
              </a>

              <div className="text-center text-sm text-gray-500">
                <p>
                  Una vez confirmado el pago, podras publicar y compartir
                  tu invitacion con todos tus invitados.
                </p>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Help Text */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="mt-6 text-center"
        >
          <p className="text-sm text-gray-500 mb-4">
            ¿Tienes una reserva confirmada en Ruka Lefun?
            <br />
            <Link
              href="/contacto"
              className="text-[#4A7C59] underline font-medium"
            >
              Contactanos
            </Link>{" "}
            para activar tu invitacion gratis.
          </p>
          <Link href="/">
            <Button variant="ghost" className="text-gray-500">
              Volver al Inicio
            </Button>
          </Link>
        </motion.div>
      </div>
    </div>
  );
}

function LoadingFallback() {
  return (
    <div className="min-h-screen bg-[#F8F4ED] pt-32 pb-12 px-4">
      <div className="max-w-md mx-auto text-center">
        <Loader2 className="w-12 h-12 mx-auto animate-spin text-[#4A7C59] mb-4" />
        <p className="text-gray-600">Cargando...</p>
      </div>
    </div>
  );
}

export default function PagoPendientePage() {
  return (
    <Suspense fallback={<LoadingFallback />}>
      <PagoPendienteContent />
    </Suspense>
  );
}
