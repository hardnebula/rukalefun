import type { Metadata } from "next"
import { Inter, Playfair_Display, Cormorant_Garamond } from "next/font/google"
import "./globals.css"
import { ConvexProvider } from "@/components/providers/ConvexProvider"
import { OrganizationSchema, WebsiteSchema } from "@/components/seo/StructuredData"

const inter = Inter({ subsets: ["latin"] })

const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-playfair",
})

const cormorant = Cormorant_Garamond({
  subsets: ["latin"],
  variable: "--font-script",
  weight: ["300", "400", "500", "600"],
  style: ["normal", "italic"],
})

export const metadata: Metadata = {
  metadataBase: new URL('https://www.lefun.cl'),
  title: {
    default: "Ruka Lefún | Matrimonios y Eventos en Villarrica, Chile",
    template: "%s | Ruka Lefún"
  },
  description: "Salones para matrimonios, eventos corporativos y celebraciones en Villarrica, rodeados de naturaleza en la Araucanía. ¡Cotiza gratis y reserva tu fecha!",
  keywords: [
    "centro de eventos villarrica",
    "matrimonios villarrica",
    "salón de eventos araucanía",
    "arriendo salón matrimonio villarrica",
    "eventos corporativos villarrica",
    "cumpleaños villarrica",
    "fiestas villarrica chile",
    "centro eventos sur de chile",
    "matrimonios araucanía",
    "ruka lefún"
  ],
  authors: [{ name: "Ruka Lefún" }],
  creator: "Ruka Lefún",
  publisher: "Ruka Lefún",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  openGraph: {
    type: "website",
    locale: "es_CL",
    url: "https://www.lefun.cl",
    siteName: "Ruka Lefún",
    title: "Ruka Lefún | Matrimonios y Eventos en Villarrica",
    description: "Salones rodeados de naturaleza en la Araucanía para matrimonios, eventos corporativos y celebraciones. ¡Cotiza gratis y reserva tu fecha!",
    images: [
      {
        url: "/og-image.webp",
        width: 1200,
        height: 630,
        alt: "Ceremonia al aire libre en Ruka Lefún, Centro de Eventos en Villarrica, Chile",
        type: "image/webp",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    site: "@rukalefun",
    creator: "@rukalefun",
    title: "Ruka Lefún | Matrimonios y Eventos en Villarrica",
    description: "Salones rodeados de naturaleza en la Araucanía para matrimonios y eventos. ¡Cotiza gratis!",
    images: [
      {
        url: "/og-image.webp",
        alt: "Ceremonia al aire libre en Ruka Lefún, Centro de Eventos en Villarrica",
      }
    ],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  icons: {
    icon: "/Logo.rukalefun.jpg",
    apple: "/Logo.rukalefun.jpg",
    shortcut: "/Logo.rukalefun.jpg",
  },
  verification: {
    // google: 'your-google-verification-code',
    // yandex: 'your-yandex-verification-code',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="es">
      <body className={`${inter.className} ${playfair.variable} ${cormorant.variable}`}>
        <OrganizationSchema />
        <WebsiteSchema />
        <ConvexProvider>
          {children}
        </ConvexProvider>
      </body>
    </html>
  )
}





