"use client"

import { useState } from "react"
import { useQuery } from "convex/react"
import { api } from "@/convex/_generated/api"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import Link from "next/link"
import Lightbox from "yet-another-react-lightbox"
import "yet-another-react-lightbox/styles.css"
import { motion } from "framer-motion"
import Breadcrumbs from "@/components/ui/Breadcrumbs"
import ShareButtons from "@/components/ui/ShareButtons"
import { Toaster } from "@/components/ui/sonner"

export default function GaleriaPage() {
  const gallery = useQuery(api.gallery.getPublicGallery)
  const [selectedCategory, setSelectedCategory] = useState<string>("all")
  const [lightboxOpen, setLightboxOpen] = useState(false)
  const [lightboxIndex, setLightboxIndex] = useState(0)

  const categories = [
    { id: "all", label: "Todos" },
    { id: "boda", label: "Bodas" },
    { id: "corporativo", label: "Corporativos" },
    { id: "cumpleanos", label: "Cumpleaños" },
    { id: "espacio", label: "Instalaciones" },
  ]

  const filteredGallery =
    selectedCategory === "all"
      ? gallery
      : gallery?.filter((item) => item.category === selectedCategory)

  const slides = filteredGallery?.map((item) => ({
    src: item.imageUrl,
    title: item.title,
  })) || []

  const openLightbox = (index: number) => {
    setLightboxIndex(index)
    setLightboxOpen(true)
  }

  return (
    <div className="min-h-screen pt-20">
      <Toaster />
      <div className="container mx-auto px-4">
        <Breadcrumbs items={[{ label: "Galería", href: "/galeria" }]} />
      </div>
      {/* Hero */}
      <section className="bg-gradient-to-br from-nature-forest via-nature-moss to-nature-emerald text-white py-16 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/5 to-transparent"></div>
        <div className="container mx-auto px-4 text-center relative z-10">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Galería</h1>
          <p className="text-xl text-white/90 max-w-2xl mx-auto mb-6">
            Descubre la magia de los eventos realizados en Ruka Lefún
          </p>
          <div className="flex justify-center">
            <ShareButtons
              title="Galería - Ruka Lefún"
              description="Descubre la magia de nuestros eventos en Villarrica"
              className="bg-white/10 backdrop-blur-sm px-4 py-2 rounded-lg"
            />
          </div>
        </div>
      </section>

      {/* Filtros */}
      <section className="py-8 border-b bg-white sticky top-20 z-10">
        <div className="container mx-auto px-4">
          <div className="flex flex-wrap gap-3 justify-center">
            {categories.map((category) => (
              <Button
                key={category.id}
                variant={selectedCategory === category.id ? "default" : "outline"}
                onClick={() => setSelectedCategory(category.id)}
                className={selectedCategory === category.id ? "bg-nature-forest" : ""}
              >
                {category.label}
              </Button>
            ))}
          </div>
        </div>
      </section>

      {/* Galería */}
      <section className="py-12 bg-gray-50">
        <div className="container mx-auto px-4">
          {!gallery ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {Array.from({ length: 9 }).map((_, i) => (
                <div key={i} className="aspect-square bg-gray-200 rounded-lg animate-pulse" />
              ))}
            </div>
          ) : filteredGallery && filteredGallery.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredGallery.map((item, index) => (
                <motion.div
                  key={item._id}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.3, delay: index * 0.05 }}
                  className="relative group cursor-pointer overflow-hidden rounded-lg shadow-lg hover:shadow-xl transition-shadow"
                  onClick={() => openLightbox(index)}
                >
                  <div className="aspect-square relative">
                    <img
                      src={item.thumbnailUrl || item.imageUrl}
                      alt={item.title}
                      className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                    <div className="absolute bottom-0 left-0 right-0 p-4 text-white transform translate-y-full group-hover:translate-y-0 transition-transform duration-300">
                      <h3 className="font-semibold text-lg mb-1">{item.title}</h3>
                      <Badge variant="secondary" className="capitalize">
                        {item.category}
                      </Badge>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          ) : (
            <div className="space-y-6">
              <div className="text-center py-10">
                <p className="text-gray-500 text-lg mb-6">
                  Próximamente agregaremos más fotos de eventos realizados.
                </p>
                <p className="text-sm text-gray-400">
                  Mientras tanto, aquí hay algunas imágenes de referencia:
                </p>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {Array.from({ length: 9 }).map((_, i) => {
                  const placeholderImages = [
                    "https://images.unsplash.com/photo-1519225421980-715cb0215aed?q=80&w=800",
                    "https://images.unsplash.com/photo-1511795409834-ef04bbd61622?q=80&w=800",
                    "https://images.unsplash.com/photo-1464366400600-7168b8af9bc3?q=80&w=800",
                    "https://images.unsplash.com/photo-1478146896981-b80fe463b330?q=80&w=800",
                    "https://images.unsplash.com/photo-1519167758481-83f29da8dbc6?q=80&w=800",
                    "https://images.unsplash.com/photo-1505236858219-8359eb29e329?q=80&w=800",
                    "https://images.unsplash.com/photo-1515934751635-c81c6bc9a2d8?q=80&w=800",
                    "https://images.unsplash.com/photo-1470229722913-7c0e2dbbafd3?q=80&w=800",
                    "https://images.unsplash.com/photo-1465495976277-4387d4b0b4c6?q=80&w=800"
                  ];
                  const titles = [
                    "Boda al aire libre",
                    "Evento corporativo",
                    "Celebración en la naturaleza",
                    "Conferencia y seminarios",
                    "Ceremonia especial",
                    "Salón de eventos",
                    "Fiesta y celebración",
                    "Paisaje natural",
                    "Espacio para eventos"
                  ];
                  return (
                    <motion.div
                      key={i}
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ duration: 0.3, delay: i * 0.05 }}
                      className="relative group cursor-pointer overflow-hidden rounded-lg shadow-lg hover:shadow-xl transition-shadow"
                    >
                      <div className="aspect-square relative">
                        <img
                          src={placeholderImages[i]}
                          alt={titles[i]}
                          className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                        <div className="absolute bottom-0 left-0 right-0 p-4 text-white transform translate-y-full group-hover:translate-y-0 transition-transform duration-300">
                          <h3 className="font-semibold text-lg">{titles[i]}</h3>
                        </div>
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      </section>

      {/* Lightbox */}
      <Lightbox
        open={lightboxOpen}
        close={() => setLightboxOpen(false)}
        index={lightboxIndex}
        slides={slides}
      />

      {/* CTA */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-4">¿Te Inspiraste?</h2>
          <p className="text-lg text-gray-600 mb-8 max-w-2xl mx-auto">
            Crea tus propios recuerdos inolvidables en Ruka Lefún
          </p>
            <Link href="/reservas">
              <Button size="lg" className="bg-gradient-nature hover:opacity-90 text-white shadow-lg transition-all">
                Reservar Ahora
              </Button>
            </Link>
        </div>
      </section>
    </div>
  )
}

