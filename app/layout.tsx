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
  metadataBase: new URL('https://www.rukalefun.cl'),
  title: {
    default: "Ruka Lefún | Centro de Eventos y Matrimonios en Villarrica, Chile",
    template: "%s | Ruka Lefún - Eventos Villarrica"
  },
  description: "Arrienda salones para matrimonios, cumpleaños y eventos corporativos en Villarrica. Centro de eventos rodeado de naturaleza en la Araucanía. Cotiza gratis.",
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
    url: "https://www.rukalefun.cl",
    siteName: "Ruka Lefún",
    title: "Ruka Lefún | Matrimonios y Eventos en Villarrica, Chile",
    description: "Arrienda salones para matrimonios, cumpleaños y eventos corporativos en Villarrica. Rodeados de naturaleza en la Araucanía. Cotiza gratis.",
    images: [
      {
        url: "/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "Ruka Lefún - Centro de Eventos para Matrimonios en Villarrica Chile",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Ruka Lefún | Eventos y Matrimonios en Villarrica",
    description: "Salones para matrimonios y eventos corporativos rodeados de naturaleza en el sur de Chile. Cotiza gratis.",
    images: ["/og-image.jpg"],
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





