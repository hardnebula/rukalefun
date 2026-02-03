"use client";

import { Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Heart,
  Copy,
  CheckCircle,
  Key,
  Link as LinkIcon,
  Edit,
  Loader2,
} from "lucide-react";
import { toast } from "sonner";
import { Toaster } from "@/components/ui/sonner";

function InvitacionCreadaContent() {
  const searchParams = useSearchParams();
  const invitationId = searchParams.get("id");
  const accessCode = searchParams.get("code");
  const slug = searchParams.get("slug");

  const baseUrl = typeof window !== "undefined" ? window.location.origin : "";
  const invitationUrl = `${baseUrl}/invitacion/${slug}`;
  const editorUrl = `${baseUrl}/mi-invitacion`;

  const copyToClipboard = async (text: string, label: string) => {
    await navigator.clipboard.writeText(text);
    toast.success(`${label} copiado al portapapeles`);
  };

  if (!accessCode || !slug) {
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

  return (
    <div className="min-h-screen bg-[#F8F4ED] pt-24 pb-12 px-4">
      <Toaster />
      <div className="max-w-2xl mx-auto">
        {/* Success Animation */}
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: "spring", duration: 0.5 }}
          className="text-center mb-8"
        >
          <div className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <CheckCircle className="w-14 h-14 text-green-500" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            ¡Invitacion Creada!
          </h1>
          <p className="text-gray-600">
            Tu invitacion digital esta lista. Guarda estos datos importantes.
          </p>
        </motion.div>

        {/* Credentials Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <Card className="shadow-lg border-2 border-green-200">
            <CardContent className="p-6 space-y-6">
              {/* Access Code */}
              <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
                <div className="flex items-center gap-2 text-amber-800 mb-2">
                  <Key className="w-5 h-5" />
                  <span className="font-semibold">
                    Codigo de Acceso (IMPORTANTE)
                  </span>
                </div>
                <p className="text-sm text-amber-700 mb-3">
                  Guarda este codigo para editar tu invitacion
                </p>
                <div className="flex items-center gap-2">
                  <code className="flex-1 bg-white border-2 border-amber-300 rounded-lg px-4 py-3 text-2xl font-mono tracking-widest text-center font-bold">
                    {accessCode}
                  </code>
                  <Button
                    size="icon"
                    variant="outline"
                    onClick={() => copyToClipboard(accessCode, "Codigo")}
                    className="h-12 w-12"
                  >
                    <Copy className="w-5 h-5" />
                  </Button>
                </div>
              </div>

              {/* Invitation Link */}
              <div className="bg-gray-50 rounded-lg p-4">
                <div className="flex items-center gap-2 text-gray-700 mb-2">
                  <LinkIcon className="w-5 h-5" />
                  <span className="font-semibold">Link de tu Invitacion</span>
                </div>
                <p className="text-sm text-gray-500 mb-3">
                  Comparte este link con tus invitados (una vez publicada)
                </p>
                <div className="flex items-center gap-2">
                  <code className="flex-1 bg-white border rounded-lg px-3 py-2 text-sm truncate">
                    {invitationUrl}
                  </code>
                  <Button
                    size="icon"
                    variant="outline"
                    onClick={() => copyToClipboard(invitationUrl, "Link")}
                  >
                    <Copy className="w-4 h-4" />
                  </Button>
                </div>
              </div>

              {/* Editor Link */}
              <div className="bg-gray-50 rounded-lg p-4">
                <div className="flex items-center gap-2 text-gray-700 mb-2">
                  <Edit className="w-5 h-5" />
                  <span className="font-semibold">Link del Editor</span>
                </div>
                <p className="text-sm text-gray-500 mb-3">
                  Accede aqui para personalizar tu invitacion
                </p>
                <div className="flex items-center gap-2">
                  <code className="flex-1 bg-white border rounded-lg px-3 py-2 text-sm truncate">
                    {editorUrl}
                  </code>
                  <Button
                    size="icon"
                    variant="outline"
                    onClick={() => copyToClipboard(editorUrl, "Link del editor")}
                  >
                    <Copy className="w-4 h-4" />
                  </Button>
                </div>
              </div>

              {/* Instructions */}
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <h3 className="font-semibold text-blue-800 mb-2">
                  Proximos Pasos
                </h3>
                <ol className="list-decimal list-inside space-y-2 text-sm text-blue-700">
                  <li>
                    Ve a{" "}
                    <Link
                      href="/mi-invitacion"
                      className="underline font-medium"
                    >
                      /mi-invitacion
                    </Link>
                  </li>
                  <li>Ingresa tu email y el codigo de acceso</li>
                  <li>Personaliza textos, agrega fotos y ajusta colores</li>
                  <li>Cuando estes listo, publica tu invitacion</li>
                  <li>Comparte el link con tus invitados</li>
                </ol>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-3">
                <Link href="/mi-invitacion" className="flex-1">
                  <Button className="w-full bg-[#4A7C59] hover:bg-[#3d6649]">
                    <Edit className="w-4 h-4 mr-2" />
                    Editar Mi Invitacion
                  </Button>
                </Link>
                <Link href="/" className="flex-1">
                  <Button variant="outline" className="w-full">
                    Volver al Inicio
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Share reminder */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="mt-6 text-center text-sm text-gray-500"
        >
          <Heart className="w-4 h-4 inline mr-1" />
          Recuerda: tu invitacion no sera visible para tus invitados hasta que
          la publiques desde el editor.
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

export default function InvitacionCreadaPage() {
  return (
    <Suspense fallback={<LoadingFallback />}>
      <InvitacionCreadaContent />
    </Suspense>
  );
}
