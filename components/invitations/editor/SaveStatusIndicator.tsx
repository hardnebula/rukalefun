"use client";

import { Check, Loader2, Cloud, AlertCircle } from "lucide-react";

export type SaveStatus = "saved" | "saving" | "unsaved" | "error";

interface SaveStatusIndicatorProps {
  status: SaveStatus;
  className?: string;
}

export default function SaveStatusIndicator({
  status,
  className = "",
}: SaveStatusIndicatorProps) {
  const config = {
    saved: {
      icon: Check,
      text: "Guardado",
      className: "text-green-600",
    },
    saving: {
      icon: Loader2,
      text: "Guardando...",
      className: "text-blue-600",
      animate: true,
    },
    unsaved: {
      icon: Cloud,
      text: "Sin guardar",
      className: "text-amber-600",
    },
    error: {
      icon: AlertCircle,
      text: "Error al guardar",
      className: "text-red-600",
    },
  };

  const { icon: Icon, text, className: statusClassName, animate } = config[status] as {
    icon: typeof Check;
    text: string;
    className: string;
    animate?: boolean;
  };

  return (
    <div className={`flex items-center gap-1.5 text-sm ${statusClassName} ${className}`}>
      <Icon className={`w-4 h-4 ${animate ? "animate-spin" : ""}`} />
      <span>{text}</span>
    </div>
  );
}
