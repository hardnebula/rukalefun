import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Contacto y Ubicación en Villarrica",
  description: "Escríbenos por WhatsApp, email o teléfono. Atención lunes a domingo de 9:00 a 20:00 hrs. Te ayudamos a planificar tu evento en Villarrica.",
  keywords: [
    "contacto ruka lefún",
    "ubicación centro eventos villarrica",
    "whatsapp eventos villarrica",
    "teléfono ruka lefún",
    "como llegar centro eventos villarrica",
  ],
  openGraph: {
    type: "website",
    locale: "es_CL",
    url: "https://www.lefun.cl/contacto",
    siteName: "Ruka Lefún",
    title: "Contacto y Ubicación | Ruka Lefún Villarrica",
    description: "Escríbenos por WhatsApp, email o teléfono. Atención lunes a domingo de 9:00 a 20:00 hrs. Te ayudamos a planificar tu evento en Villarrica.",
    images: [
      {
        url: "/og-image.webp",
        width: 1200,
        height: 630,
        alt: "Ruka Lefún Centro de Eventos - Villarrica, Araucanía, Chile",
        type: "image/webp",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    site: "@rukalefun",
    title: "Contacto y Ubicación | Ruka Lefún Villarrica",
    description: "WhatsApp, email o teléfono. Atención lunes a domingo 9:00–20:00 hrs. Planifica tu evento en Villarrica.",
    images: ["/og-image.webp"],
  },
}

export default function ContactoLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
}
