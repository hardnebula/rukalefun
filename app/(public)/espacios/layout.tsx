import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Salones y Espacios para Eventos en Villarrica",
  description: "Salones interiores y exteriores para matrimonios, eventos corporativos y celebraciones en Villarrica. Capacidad flexible, naturaleza y todo incluido.",
  keywords: [
    "salones para eventos villarrica",
    "espacios matrimonios villarrica",
    "salones eventos corporativos villarrica",
    "arriendo salón villarrica",
    "capacidad eventos villarrica",
  ],
  openGraph: {
    type: "website",
    locale: "es_CL",
    url: "https://www.lefun.cl/espacios",
    siteName: "Ruka Lefún",
    title: "Salones y Espacios para Eventos | Ruka Lefún",
    description: "Salones interiores y exteriores para matrimonios, eventos corporativos y celebraciones en Villarrica. Capacidad flexible, naturaleza y todo incluido.",
    images: [
      {
        url: "/Salon Principal/SalonPrincipal.webp",
        width: 1200,
        height: 630,
        alt: "Salón principal de Ruka Lefún decorado para evento en Villarrica",
        type: "image/webp",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    site: "@rukalefun",
    title: "Salones y Espacios para Eventos | Ruka Lefún",
    description: "Salones interiores y exteriores para matrimonios y eventos en Villarrica. Capacidad flexible y naturaleza.",
    images: ["/Salon Principal/SalonPrincipal.webp"],
  },
}

export default function EspaciosLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
}
