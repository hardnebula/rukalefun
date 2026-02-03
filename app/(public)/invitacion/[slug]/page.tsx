"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { useQuery, useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import InvitationPreview from "@/components/invitations/InvitationPreview";
import { Loader2 } from "lucide-react";
import FloralTop from "@/components/invitations/decorations/FloralTop";

export default function InvitationPage() {
  const params = useParams();
  const slug = params.slug as string;
  const [hasIncrementedView, setHasIncrementedView] = useState(false);

  const invitation = useQuery(api.weddingInvitations.getBySlug, { slug });
  const incrementViewCount = useMutation(api.weddingInvitations.incrementViewCount);

  // Increment view count once
  useEffect(() => {
    if (invitation && !hasIncrementedView) {
      incrementViewCount({ slug });
      setHasIncrementedView(true);
    }
  }, [invitation, hasIncrementedView, incrementViewCount, slug]);

  // Loading state
  if (invitation === undefined) {
    return (
      <div className="min-h-screen bg-[#F8F4ED] flex flex-col items-center justify-center">
        <Loader2 className="w-10 h-10 text-[#4A7C59] animate-spin mb-4" />
        <p className="text-[#4A7C59]">Cargando invitacion...</p>
      </div>
    );
  }

  // Not found state
  if (!invitation) {
    return (
      <div className="min-h-screen bg-[#F8F4ED] flex flex-col items-center justify-center px-4">
        <div className="w-full max-w-md mb-8">
          <FloralTop primaryColor="#4A7C59" secondaryColor="#E8C4C4" />
        </div>
        <h1 className="font-script text-4xl text-[#2D5016] mb-4 text-center">
          Invitacion no encontrada
        </h1>
        <p className="text-[#4A7C59] text-center max-w-md">
          La invitacion que buscas no existe o aun no ha sido publicada.
          Por favor verifica el enlace.
        </p>
      </div>
    );
  }

  return <InvitationPreview invitation={invitation} />;
}
