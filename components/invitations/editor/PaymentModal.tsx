"use client";

import { useRouter } from "next/navigation";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { CheckCircle, CreditCard, Edit } from "lucide-react";
import { Id } from "@/convex/_generated/dataModel";

interface PaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  invitationId: Id<"weddingInvitations">;
}

export default function PaymentModal({
  isOpen,
  onClose,
  invitationId,
}: PaymentModalProps) {
  const router = useRouter();
  const price = useQuery(api.invitationSettings.getPrice);

  const formattedPrice = price
    ? new Intl.NumberFormat("es-CL", {
        style: "currency",
        currency: "CLP",
        minimumFractionDigits: 0,
      }).format(price)
    : "...";

  const handleGoToPayment = () => {
    router.push(`/invitaciones/pago?id=${invitationId}`);
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader className="text-center">
          <div className="mx-auto w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4">
            <CheckCircle className="w-8 h-8 text-green-600" />
          </div>
          <DialogTitle className="text-xl text-center">
            ¡Cambios guardados!
          </DialogTitle>
          <DialogDescription className="text-center">
            Para publicar tu invitacion y desbloquear todas las funciones,
            completa el pago.
          </DialogDescription>
        </DialogHeader>

        <div className="my-6 p-4 bg-[#4A7C59]/10 rounded-lg text-center">
          <p className="text-sm text-gray-600 mb-1">Precio de la invitacion</p>
          <p className="text-3xl font-bold text-[#2D5016]">{formattedPrice}</p>
          <p className="text-xs text-gray-500 mt-1">Pago unico, sin suscripcion</p>
        </div>

        <div className="space-y-3">
          <Button
            onClick={handleGoToPayment}
            className="w-full bg-[#4A7C59] hover:bg-[#3d6649] gap-2"
          >
            <CreditCard className="w-4 h-4" />
            Ir a Pagar
          </Button>
          <Button
            onClick={onClose}
            variant="outline"
            className="w-full border-gray-300 gap-2"
          >
            <Edit className="w-4 h-4" />
            Seguir Editando
          </Button>
        </div>

        <p className="text-xs text-gray-500 text-center mt-4">
          Despues del pago podras publicar tu invitacion y subir fotos
        </p>
      </DialogContent>
    </Dialog>
  );
}
