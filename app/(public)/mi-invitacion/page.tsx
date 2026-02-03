"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import LoginForm from "@/components/invitations/editor/LoginForm";

export default function MyInvitationPage() {
  const router = useRouter();
  const [isCheckingSession, setIsCheckingSession] = useState(true);

  useEffect(() => {
    // Check if user already has a valid session
    const email = sessionStorage.getItem("invitation_email");
    const code = sessionStorage.getItem("invitation_code");

    if (email && code) {
      // Redirect to editor if already logged in
      router.push("/mi-invitacion/editar");
    } else {
      setIsCheckingSession(false);
    }
  }, [router]);

  const handleLoginSuccess = (email: string, accessCode: string) => {
    router.push("/mi-invitacion/editar");
  };

  if (isCheckingSession) {
    return (
      <div className="min-h-screen bg-[#F8F4ED] flex items-center justify-center">
        <div className="animate-pulse">
          <p className="text-[#4A7C59]">Verificando sesion...</p>
        </div>
      </div>
    );
  }

  return <LoginForm onSuccess={handleLoginSuccess} />;
}
