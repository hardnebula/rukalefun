"use client"

import { useQuery } from "convex/react"
import { api } from "@/convex/_generated/api"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import Link from "next/link"
import { motion, AnimatePresence } from "framer-motion"
import Breadcrumbs from "@/components/ui/Breadcrumbs"
import ShareButtons from "@/components/ui/ShareButtons"
import { Toaster } from "@/components/ui/sonner"
import { useState, useEffect } from "react"
import { ChevronLeft, ChevronRight, MapPin, Users, Maximize2, Calendar } from "lucide-react"

export default function EspaciosPage() {
  const spaces = useQuery(api.spaces.getAllSpaces)
  const [currentSlide, setCurrentSlide] = useState(0)

  // Auto-advance carousel
  useEffect(() => {
    if (!spaces || spaces.length === 0) return

    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % spaces.length)
    }, 8000) // Change slide every 8 seconds

    return () => clearInterval(timer)
  }, [spaces])

  const nextSlide = () => {
    if (spaces) {
      setCurrentSlide((prev) => (prev + 1) % spaces.length)
    }
  }

  const prevSlide = () => {
    if (spaces) {
      setCurrentSlide((prev) => (prev - 1 + spaces.length) % spaces.length)
    }
  }

  const currentSpace = spaces?.[currentSlide]

  return (
    <div className="min-h-screen pt-20">
      <Toaster />
      <div className="container mx-auto px-4">
        <Breadcrumbs items={[{ label: "Espacios", href: "/espacios" }]} />
      </div>

      {/* Hero */}
      <section className="bg-gradient-to-br from-nature-forest via-nature-moss to-nature-emerald text-white py-12 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/5 to-transparent"></div>
        <div className="container mx-auto px-4 text-center relative z-10">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Ruka Lefún Centro de Eventos</h1>
          <p className="text-xl text-white/90 max-w-3xl mx-auto mb-6">
            Un espacio natural completo para tu evento, donde todos nuestros ambientes trabajan en conjunto para crear experiencias memorables
          </p>
          <div className="flex justify-center">
            <ShareButtons
              title="Centro de Eventos - Ruka Lefún"
              description="Descubre nuestro centro de eventos en Villarrica"
              className="bg-white/10 backdrop-blur-sm px-4 py-2 rounded-lg"
            />
          </div>
        </div>
      </section>

      {/* Carousel Section */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          {!spaces ? (
            // Loading state
            <div className="max-w-7xl mx-auto">
              <div className="grid md:grid-cols-5 gap-0 rounded-2xl overflow-hidden">
                <div className="md:col-span-3 h-[400px] md:h-[600px] bg-gray-200 animate-pulse" />
                <div className="md:col-span-2 md:h-[600px] bg-gray-100 animate-pulse" />
              </div>
            </div>
          ) : spaces.length > 0 ? (
            <div className="max-w-7xl mx-auto">
              {/* Carousel Container - Split Screen */}
              <div className="relative overflow-hidden rounded-2xl shadow-2xl bg-white">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={currentSlide}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.5 }}
                    className="grid md:grid-cols-5"
                  >
                    {/* Left Side - Image (60%) */}
                    <div className="md:col-span-3 relative h-[400px] md:h-[600px] overflow-hidden bg-gray-100">
                      <motion.img
                        initial={{ scale: 1.1 }}
                        animate={{ scale: 1 }}
                        transition={{ duration: 0.7 }}
                        src={currentSpace?.images?.[0] || "https://images.unsplash.com/photo-1441974231531-c6227db76b6e?q=80&w=1200"}
                        alt={currentSpace?.name}
                        className="w-full h-full object-cover object-center"
                      />

                      {/* Navigation Buttons - On Image */}
                      <button
                        onClick={prevSlide}
                        className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/90 backdrop-blur-sm hover:bg-white text-nature-forest p-3 rounded-full transition-all shadow-lg z-10"
                        aria-label="Anterior"
                      >
                        <ChevronLeft className="h-6 w-6" />
                      </button>
                      <button
                        onClick={nextSlide}
                        className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/90 backdrop-blur-sm hover:bg-white text-nature-forest p-3 rounded-full transition-all shadow-lg z-10"
                        aria-label="Siguiente"
                      >
                        <ChevronRight className="h-6 w-6" />
                      </button>

                      {/* Indicators - Bottom of Image */}
                      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-2 z-10">
                        {spaces.map((_, index) => (
                          <button
                            key={index}
                            onClick={() => setCurrentSlide(index)}
                            className={`h-2 rounded-full transition-all ${
                              index === currentSlide
                                ? "w-8 bg-white shadow-lg"
                                : "w-2 bg-white/60 hover:bg-white/80"
                            }`}
                            aria-label={`Ir al espacio ${index + 1}`}
                          />
                        ))}
                      </div>
                    </div>

                    {/* Right Side - Content (40%) */}
                    <div className="md:col-span-2 flex flex-col justify-center p-8 md:p-12 bg-white md:min-h-[600px]">
                      <div className="space-y-6">
                        {/* Space Name */}
                        <motion.div
                          initial={{ opacity: 0, x: 20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: 0.2 }}
                        >
                          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">
                            {currentSpace?.name}
                          </h2>
                          <div className="w-20 h-1 bg-gradient-nature rounded-full" />
                        </motion.div>

                        {/* Space Description */}
                        <motion.p
                          initial={{ opacity: 0, x: 20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: 0.3 }}
                          className="text-base md:text-lg text-gray-600 leading-relaxed"
                        >
                          {currentSpace?.description}
                        </motion.p>

                        {/* Space Details */}
                        <motion.div
                          initial={{ opacity: 0, x: 20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: 0.4 }}
                          className="grid grid-cols-2 gap-4"
                        >
                          <div className="flex items-center gap-3 bg-gradient-to-br from-nature-forest/5 to-nature-moss/5 p-4 rounded-xl border border-nature-forest/10">
                            <div className="bg-nature-forest/10 p-2 rounded-lg">
                              <Users className="h-5 w-5 text-nature-forest" />
                            </div>
                            <div>
                              <p className="text-xs text-gray-500 font-medium">Capacidad</p>
                              <p className="text-lg font-bold text-gray-900">{currentSpace?.capacity}</p>
                            </div>
                          </div>
                          <div className="flex items-center gap-3 bg-gradient-to-br from-nature-lake/5 to-nature-sky/5 p-4 rounded-xl border border-nature-lake/10">
                            <div className="bg-nature-lake/10 p-2 rounded-lg">
                              <Maximize2 className="h-5 w-5 text-nature-lake" />
                            </div>
                            <div>
                              <p className="text-xs text-gray-500 font-medium">Área</p>
                              <p className="text-lg font-bold text-gray-900">{currentSpace?.area} m²</p>
                            </div>
                          </div>
                        </motion.div>

                        {/* Features */}
                        <motion.div
                          initial={{ opacity: 0, x: 20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: 0.5 }}
                          className="space-y-3"
                        >
                          <h3 className="text-sm font-semibold text-gray-700 uppercase tracking-wide">
                            Características
                          </h3>
                          <div className="flex flex-wrap gap-2">
                            {currentSpace?.features.slice(0, 8).map((feature, i) => (
                              <Badge
                                key={i}
                                variant="outline"
                                className="bg-white border-nature-forest/20 text-nature-forest hover:bg-nature-forest/5"
                              >
                                {feature}
                              </Badge>
                            ))}
                          </div>
                        </motion.div>

                        {/* CTA Button */}
                        <motion.div
                          initial={{ opacity: 0, x: 20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: 0.6 }}
                          className="pt-4"
                        >
                          <Link href="/reservas">
                            <Button
                              size="lg"
                              className="w-full bg-gradient-nature hover:opacity-90 text-white shadow-lg transition-all hover:shadow-xl"
                            >
                              <Calendar className="mr-2 h-5 w-5" />
                              Reservar Este Espacio
                            </Button>
                          </Link>
                        </motion.div>
                      </div>
                    </div>
                  </motion.div>
                </AnimatePresence>
              </div>

              {/* Info Note */}
              <div className="text-center mt-8 bg-white rounded-xl p-6 shadow-md">
                <p className="text-gray-600 text-sm md:text-base">
                  <span className="font-semibold text-nature-forest">Nota:</span> Todos nuestros espacios están incluidos en tu reserva y trabajan en conjunto para crear la experiencia perfecta.
                </p>
              </div>
            </div>
          ) : (
            <div className="text-center py-20">
              <p className="text-gray-500 text-lg">
                Los espacios estarán disponibles próximamente.
              </p>
            </div>
          )}
        </div>
      </section>

      {/* Servicios Incluidos */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-5xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-bold text-center mb-4">
              Servicios Incluidos en el Centro de Eventos
            </h2>
            <p className="text-center text-gray-600 mb-12 text-lg">
              Todos estos servicios están disponibles en tu reserva
            </p>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="text-center group">
                <div className="bg-nature-forest/10 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:bg-nature-forest/20 transition-colors">
                  <svg className="h-10 w-10 text-nature-forest" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <h3 className="font-semibold text-lg mb-2">Estacionamiento Amplio</h3>
                <p className="text-sm text-gray-600">Espacio seguro y cómodo para todos tus invitados</p>
              </div>

              <div className="text-center group">
                <div className="bg-nature-forest/10 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:bg-nature-forest/20 transition-colors">
                  <svg className="h-10 w-10 text-nature-forest" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.111 16.404a5.5 5.5 0 017.778 0M12 20h.01m-7.08-7.071c3.904-3.905 10.236-3.905 14.141 0M1.394 9.393c5.857-5.857 15.355-5.857 21.213 0" />
                  </svg>
                </div>
                <h3 className="font-semibold text-lg mb-2">WiFi de Alta Velocidad</h3>
                <p className="text-sm text-gray-600">Internet rápido y estable en todas las áreas</p>
              </div>

              <div className="text-center group">
                <div className="bg-nature-forest/10 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:bg-nature-forest/20 transition-colors">
                  <svg className="h-10 w-10 text-nature-forest" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                  </svg>
                </div>
                <h3 className="font-semibold text-lg mb-2">Mobiliario Completo</h3>
                <p className="text-sm text-gray-600">Mesas, sillas y equipamiento básico incluido</p>
              </div>

              <div className="text-center group">
                <div className="bg-nature-forest/10 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:bg-nature-forest/20 transition-colors">
                  <svg className="h-10 w-10 text-nature-forest" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707" />
                  </svg>
                </div>
                <h3 className="font-semibold text-lg mb-2">Entorno Natural</h3>
                <p className="text-sm text-gray-600">Rodeado de naturaleza y paisajes hermosos</p>
              </div>

              <div className="text-center group">
                <div className="bg-nature-forest/10 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:bg-nature-forest/20 transition-colors">
                  <svg className="h-10 w-10 text-nature-forest" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                  </svg>
                </div>
                <h3 className="font-semibold text-lg mb-2">Seguridad</h3>
                <p className="text-sm text-gray-600">Personal capacitado y medidas de seguridad</p>
              </div>

              <div className="text-center group">
                <div className="bg-nature-forest/10 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:bg-nature-forest/20 transition-colors">
                  <svg className="h-10 w-10 text-nature-forest" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                  </svg>
                </div>
                <h3 className="font-semibold text-lg mb-2">Atención Personalizada</h3>
                <p className="text-sm text-gray-600">Personal dedicado para tu evento</p>
              </div>
            </div>

            {/* CTA adicional */}
            <div className="mt-12 bg-gradient-to-r from-nature-forest/10 to-nature-emerald/10 rounded-2xl p-8 text-center">
              <h3 className="text-2xl font-bold mb-4">¿Listo para celebrar tu evento?</h3>
              <p className="text-gray-600 mb-6 max-w-2xl mx-auto">
                Todos nuestros espacios trabajan en conjunto para crear la experiencia perfecta.
                Consulta disponibilidad y personaliza tu evento según tus necesidades.
              </p>
              <Link href="/reservas">
                <Button
                  size="lg"
                  variant="outline"
                  className="border-nature-forest text-nature-forest hover:bg-nature-forest hover:text-white"
                >
                  Solicitar Cotización
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
