import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Espacios",
  description: "Descubre nuestros espacios versátiles diseñados para hacer de tu evento una experiencia única. Salones para bodas, eventos corporativos, cumpleaños y celebraciones en Villarrica.",
  keywords: [
    "espacios para eventos",
    "salones villarrica",
    "espacios bodas",
    "salones eventos corporativos",
    "capacidad eventos villarrica",
  ],
  openGraph: {
    title: "Espacios - Ruka Lefún",
    description: "Descubre nuestros espacios versátiles diseñados para hacer de tu evento una experiencia única en Villarrica.",
    url: "https://www.rukalefun.cl/espacios",
    type: "website",
  },
}

export default function EspaciosLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
}
