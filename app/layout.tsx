import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { ConvexProvider } from "@/components/providers/ConvexProvider"
import { OrganizationSchema, WebsiteSchema } from "@/components/seo/StructuredData"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  metadataBase: new URL('https://www.rukalefun.cl'),
  title: {
    default: "Ruka Lefún - Centro de Eventos Villarrica",
    template: "%s | Ruka Lefún"
  },
  description: "Centro de eventos rodeado por la naturaleza del sur de Chile en Villarrica. El lugar perfecto para bodas, eventos corporativos y celebraciones especiales.",
  keywords: [
    "centro de eventos villarrica",
    "eventos villarrica",
    "bodas villarrica",
    "eventos corporativos chile",
    "salón de eventos",
    "matrimonios sur de chile",
    "centro de eventos araucanía",
    "celebraciones villarrica",
    "eventos naturaleza chile",
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
    title: "Ruka Lefún - Centro de Eventos Villarrica",
    description: "Centro de eventos rodeado por la naturaleza del sur de Chile en Villarrica. El lugar perfecto para bodas, eventos corporativos y celebraciones especiales.",
    images: [
      {
        url: "/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "Ruka Lefún - Centro de Eventos",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Ruka Lefún - Centro de Eventos Villarrica",
    description: "Centro de eventos rodeado por la naturaleza del sur de Chile en Villarrica.",
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
      <body className={inter.className}>
        <OrganizationSchema />
        <WebsiteSchema />
        <ConvexProvider>
          {children}
        </ConvexProvider>
      </body>
    </html>
  )
}





