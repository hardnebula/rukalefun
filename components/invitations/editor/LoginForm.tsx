"use client";

import { useState } from "react";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import Link from "next/link";
import { Mail, Key, Loader2, AlertCircle, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import FloralTop from "../decorations/FloralTop";

interface LoginFormProps {
  onSuccess: (email: string, accessCode: string) => void;
}

export default function LoginForm({ onSuccess }: LoginFormProps) {
  const [email, setEmail] = useState("");
  const [accessCode, setAccessCode] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [errorType, setErrorType] = useState<string | null>(null);
  const [isVerifying, setIsVerifying] = useState(false);

  // Query to verify access
  const verification = useQuery(
    api.weddingInvitations.verifyAccess,
    email && accessCode.length === 6
      ? { email: email.trim(), accessCode: accessCode.toUpperCase() }
      : "skip"
  );

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setErrorType(null);

    if (!email.trim()) {
      setError("Por favor ingresa tu email");
      return;
    }

    if (accessCode.length !== 6) {
      setError("El codigo debe tener 6 caracteres");
      return;
    }

    setIsVerifying(true);

    // Wait for verification
    if (verification?.valid) {
      sessionStorage.setItem("invitation_email", email.trim());
      sessionStorage.setItem("invitation_code", accessCode.toUpperCase());
      onSuccess(email.trim(), accessCode.toUpperCase());
    } else if (verification && !verification.valid) {
      setError("Email o codigo incorrecto");
      setErrorType("invalid");
      setIsVerifying(false);
    }
  };

  // Check verification result
  if (verification?.valid && isVerifying) {
    sessionStorage.setItem("invitation_email", email.trim());
    sessionStorage.setItem("invitation_code", accessCode.toUpperCase());
    onSuccess(email.trim(), accessCode.toUpperCase());
  }

  return (
    <div className="min-h-screen bg-[#F8F4ED] flex flex-col items-center justify-center px-4 py-12">
      {/* Top decoration */}
      <div className="w-full max-w-md mb-8">
        <FloralTop primaryColor="#4A7C59" secondaryColor="#E8C4C4" />
      </div>

      <div className="w-full max-w-md bg-white rounded-2xl shadow-lg p-8">
        <div className="text-center mb-8">
          <h1 className="font-script text-4xl text-[#2D5016] mb-2">
            Mi Invitacion
          </h1>
          <p className="text-[#4A7C59] text-sm">
            Ingresa tus credenciales para editar tu invitacion
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Email */}
          <div className="space-y-2">
            <Label htmlFor="email" className="text-[#2D5016]">
              Email
            </Label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-[#4A7C59]" />
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="tu@email.com"
                className="pl-10 border-[#4A7C59]/30 focus:border-[#4A7C59]"
                required
              />
            </div>
          </div>

          {/* Access Code */}
          <div className="space-y-2">
            <Label htmlFor="code" className="text-[#2D5016]">
              Codigo de Acceso
            </Label>
            <div className="relative">
              <Key className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-[#4A7C59]" />
              <Input
                id="code"
                type="text"
                value={accessCode}
                onChange={(e) =>
                  setAccessCode(e.target.value.toUpperCase().slice(0, 6))
                }
                placeholder="ABC123"
                className="pl-10 border-[#4A7C59]/30 focus:border-[#4A7C59] uppercase tracking-widest text-center font-mono"
                maxLength={6}
                required
              />
            </div>
            <p className="text-xs text-gray-500 text-center">
              El codigo de 6 caracteres que te enviaron
            </p>
          </div>

          {/* Error */}
          {error && (
            <div className="flex items-center gap-2 p-3 bg-red-50 text-red-600 rounded-lg text-sm">
              <AlertCircle className="w-4 h-4" />
              {error}
            </div>
          )}

          {/* Submit */}
          <Button
            type="submit"
            className="w-full bg-[#4A7C59] hover:bg-[#3d6649] text-white"
            disabled={isVerifying}
          >
            {isVerifying ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Verificando...
              </>
            ) : (
              "Acceder a mi Invitacion"
            )}
          </Button>
        </form>

        <div className="mt-8 pt-6 border-t border-gray-200 text-center space-y-4">
          <div className="p-4 bg-[#4A7C59]/5 rounded-lg">
            <p className="text-sm text-[#4A7C59] font-medium mb-2">
              ¿No tienes invitacion?
            </p>
            <Link href="/invitaciones/crear">
              <Button
                type="button"
                variant="outline"
                className="w-full border-[#4A7C59] text-[#4A7C59] hover:bg-[#4A7C59]/10"
              >
                <Plus className="w-4 h-4 mr-2" />
                Crear Mi Invitacion
              </Button>
            </Link>
          </div>
          <p className="text-xs text-gray-500">
            ¿Problemas para acceder? Contacta al equipo de Ruka Lefun
          </p>
        </div>
      </div>
    </div>
  );
}
