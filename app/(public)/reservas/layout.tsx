import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Cotizaciones y Reservas",
  description: "Solicita tu cotización personalizada para tu evento en Ruka Lefún. Completa el formulario y nos contactaremos contigo en 24-48 horas con los mejores precios para tu celebración.",
  keywords: [
    "cotización eventos villarrica",
    "reservar eventos",
    "solicitar presupuesto matrimonio",
    "cotizar evento corporativo",
    "reservas ruka lefún",
  ],
  openGraph: {
    title: "Cotizaciones y Reservas - Ruka Lefún",
    description: "Solicita tu cotización personalizada y reserva tu fecha para el evento perfecto en Ruka Lefún.",
    url: "https://www.rukalefun.cl/reservas",
    type: "website",
  },
}

export default function ReservasLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
}
