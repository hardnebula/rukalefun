import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Contacto",
  description: "Contáctanos para planificar tu evento perfecto en Ruka Lefún, Villarrica. Estamos disponibles de lunes a domingo de 9:00 a 20:00 hrs. WhatsApp, email y teléfono.",
  keywords: [
    "contacto ruka lefún",
    "teléfono eventos villarrica",
    "whatsapp eventos",
    "ubicación centro eventos",
    "contactar villarrica",
  ],
  openGraph: {
    title: "Contacto - Ruka Lefún",
    description: "Contáctanos para planificar tu evento perfecto en Ruka Lefún, Villarrica.",
    url: "https://www.rukalefun.cl/contacto",
    type: "website",
  },
}

export default function ContactoLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
}
