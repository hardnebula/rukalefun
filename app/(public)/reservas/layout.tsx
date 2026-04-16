import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Cotiza tu Evento en Villarrica",
  description: "Completa el formulario y recibe tu presupuesto personalizado en menos de 48 horas. Matrimonios, eventos corporativos y celebraciones en Villarrica.",
  keywords: [
    "cotizar evento villarrica",
    "presupuesto matrimonio villarrica",
    "reservar salón villarrica",
    "cotización evento corporativo villarrica",
    "reservas ruka lefún",
  ],
  openGraph: {
    type: "website",
    locale: "es_CL",
    url: "https://www.lefun.cl/reservas",
    siteName: "Ruka Lefún",
    title: "Cotiza tu Evento en Villarrica | Ruka Lefún",
    description: "Completa el formulario y recibe tu presupuesto personalizado en menos de 48 horas. Matrimonios, eventos corporativos y celebraciones en Villarrica.",
    images: [
      {
        url: "/og-image.webp",
        width: 1200,
        height: 630,
        alt: "Ceremonia al aire libre en Ruka Lefún, Centro de Eventos en Villarrica",
        type: "image/webp",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    site: "@rukalefun",
    title: "Cotiza tu Evento en Villarrica | Ruka Lefún",
    description: "Recibe tu presupuesto personalizado en menos de 48 horas. Matrimonios y eventos en Villarrica.",
    images: ["/og-image.webp"],
  },
}

export default function ReservasLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
}
