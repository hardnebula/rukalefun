import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Galería",
  description: "Descubre la magia de los eventos realizados en Ruka Lefún. Galería de fotos de matrimonios, eventos corporativos, cumpleaños y celebraciones en medio de la naturaleza del sur de Chile.",
  keywords: [
    "galería eventos villarrica",
    "fotos matrimonios villarrica",
    "eventos realizados",
    "galería matrimonios",
    "fotos eventos corporativos",
  ],
  openGraph: {
    title: "Galería - Ruka Lefún",
    description: "Descubre la magia de los eventos realizados en Ruka Lefún a través de nuestra galería de fotos.",
    url: "https://www.rukalefun.cl/galeria",
    type: "website",
  },
}

export default function GaleriaLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
}
