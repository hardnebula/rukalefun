"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Calendar, Users, Star, Camera, Sparkles, MapPin } from "lucide-react"
import Link from "next/link"
import { motion } from "framer-motion"
import { useQuery } from "convex/react"
import { api } from "@/convex/_generated/api"
import FAQSection from "@/components/sections/FAQSection"

export default function HomePage() {
  const testimonials = useQuery(api.testimonials.getPublicTestimonials)
  const spaces = useQuery(api.spaces.getAllSpaces)

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative h-screen flex items-center justify-center overflow-hidden">
        {/* Background Image */}
        <div className="absolute inset-0 z-0">
          <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/40 to-black/60 z-10" />
          <img
            src="https://images.unsplash.com/photo-1464366400600-7168b8af9bc3?q=80&w=2400"
            alt="Centro de eventos Ruka Lefún rodeado de naturaleza"
            className="w-full h-full object-cover"
          />
        </div>

        {/* Hero Content */}
        <div className="relative z-20 text-center px-4 max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h1 className="text-5xl md:text-7xl font-bold text-white mb-6">
              Ruka Lefún
            </h1>
            <p className="text-xl md:text-2xl text-white/90 mb-8">
              Centro de eventos rodeado por la naturaleza del sur de Chile
            </p>
            <p className="text-lg text-white/80 mb-10 max-w-2xl mx-auto">
              En el corazón de Villarrica, creamos experiencias inolvidables para tus momentos más especiales
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Link href="/reservas">
                <Button size="lg" className="bg-gradient-nature hover:opacity-90 text-white text-lg px-8 w-full sm:w-auto shadow-xl transition-all hover:scale-105">
                  <Calendar className="mr-2 h-5 w-5" />
                  Reservar Ahora
                </Button>
              </Link>
              <Link href="/galeria">
                <Button 
                  size="lg" 
                  className="bg-white/10 backdrop-blur-sm hover:bg-white/20 text-white border-2 border-white text-lg px-8 w-full sm:w-auto"
                >
                  <Camera className="mr-2 h-5 w-5" />
                  Ver Galería
                </Button>
              </Link>
            </div>
          </motion.div>
        </div>

        {/* Scroll Indicator */}
        <div className="absolute bottom-10 left-1/2 transform -translate-x-1/2 z-20">
          <div className="animate-bounce">
            <div className="w-6 h-10 border-2 border-white rounded-full flex items-start justify-center p-2">
              <div className="w-1 h-3 bg-white rounded-full" />
            </div>
          </div>
        </div>
      </section>

      {/* ¿Por qué elegirnos? */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              El Lugar Perfecto para tu Evento
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Combinamos naturaleza, elegancia y servicio excepcional para crear momentos inolvidables
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              viewport={{ once: true }}
            >
              <Card className="text-center h-full hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="mx-auto bg-gradient-to-br from-nature-forest/10 to-nature-moss/10 w-16 h-16 rounded-full flex items-center justify-center mb-4">
                    <MapPin className="h-8 w-8 text-nature-forest" />
                  </div>
                  <CardTitle>Ubicación Privilegiada</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-base">
                    Rodeados por la naturaleza del sur de Chile en Villarrica, con vistas espectaculares y aire puro.
                  </CardDescription>
                </CardContent>
              </Card>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              viewport={{ once: true }}
            >
              <Card className="text-center h-full hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="mx-auto bg-nature-lake/10 w-16 h-16 rounded-full flex items-center justify-center mb-4">
                    <Users className="h-8 w-8 text-nature-lake" />
                  </div>
                  <CardTitle>Espacios Versátiles</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-base">
                    Salones adaptables para bodas, eventos corporativos, cumpleaños y celebraciones de todo tipo.
                  </CardDescription>
                </CardContent>
              </Card>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              viewport={{ once: true }}
            >
              <Card className="text-center h-full hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="mx-auto bg-amber-500/10 w-16 h-16 rounded-full flex items-center justify-center mb-4">
                    <Sparkles className="h-8 w-8 text-amber-500" />
                  </div>
                  <CardTitle>Servicio Integral</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-base">
                    Catering, decoración, audio y video. Todo lo que necesitas para que tu evento sea perfecto.
                  </CardDescription>
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Espacios Disponibles */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Nuestros Espacios
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Cada espacio diseñado para crear la atmósfera perfecta para tu celebración
            </p>
          </div>

          {spaces && spaces.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {spaces.slice(0, 3).map((space, index) => {
                const fallbackImages = [
                  "https://images.unsplash.com/photo-1441974231531-c6227db76b6e?q=80&w=800",
                  "https://images.unsplash.com/photo-1505236858219-8359eb29e329?q=80&w=800",
                  "https://images.unsplash.com/photo-1519167758481-83f29da8dbc6?q=80&w=800"
                ];
                return (
                <motion.div
                  key={space._id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  viewport={{ once: true }}
                >
                  <Card className="overflow-hidden hover:shadow-xl transition-shadow">
                    <div className="h-48 relative overflow-hidden group">
                      <img 
                        src={space.images?.[0] || fallbackImages[index % fallbackImages.length]} 
                        alt={space.name}
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                      />
                    </div>
                    <CardHeader>
                      <CardTitle>{space.name}</CardTitle>
                      <CardDescription className="line-clamp-3">{space.description}</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <Link href={`/espacios#${space._id}`} className="block">
                        <Button className="w-full bg-gradient-nature hover:opacity-90 text-white shadow-lg transition-all">
                          Ver Detalles
                        </Button>
                      </Link>
                    </CardContent>
                  </Card>
                </motion.div>
              )})}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[1, 2, 3].map((i) => (
                <Card key={i} className="overflow-hidden">
                  <div className="h-48 bg-gray-200 animate-pulse" />
                  <CardHeader>
                    <div className="h-6 bg-gray-200 animate-pulse rounded" />
                    <div className="h-4 bg-gray-200 animate-pulse rounded mt-2" />
                  </CardHeader>
                </Card>
              ))}
            </div>
          )}

          <div className="text-center mt-12">
            <Link href="/espacios">
              <Button size="lg" className="bg-gradient-nature hover:opacity-90 text-white shadow-lg transition-all">
                Ver Todos los Espacios
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <FAQSection />

      {/* Testimonios */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Lo Que Dicen Nuestros Clientes
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              La satisfacción de nuestros clientes es nuestra mayor recompensa
            </p>
          </div>

          {testimonials && testimonials.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
              {testimonials.slice(0, 3).map((testimonial, index) => (
                <motion.div
                  key={testimonial._id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  viewport={{ once: true }}
                >
                  <Card className="h-full">
                    <CardHeader>
                      <div className="flex items-center space-x-1 mb-2">
                        {Array.from({ length: 5 }).map((_, i) => (
                          <Star
                            key={i}
                            className={`h-4 w-4 ${
                              i < testimonial.rating
                                ? "fill-amber-400 text-amber-400"
                                : "text-gray-300"
                            }`}
                          />
                        ))}
                      </div>
                      <CardTitle className="text-lg">{testimonial.clientName}</CardTitle>
                      <CardDescription>{testimonial.eventType}</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <p className="text-gray-600 italic">"{testimonial.comment}"</p>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          ) : (
            <div className="text-center text-gray-500">
              <p>Cargando testimonios...</p>
            </div>
          )}
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-20 bg-gradient-to-br from-nature-forest via-nature-moss to-nature-emerald text-white relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/5 to-transparent"></div>
        <div className="container mx-auto px-4 text-center relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl md:text-5xl font-bold mb-6">
              ¿Listo para Tu Evento Perfecto?
            </h2>
            <p className="text-xl text-white/90 mb-10 max-w-2xl mx-auto">
              Contáctanos hoy y comencemos a planificar el evento de tus sueños en Ruka Lefún
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Link href="/reservas">
                <Button size="lg" className="bg-white hover:bg-white/90 text-nature-forest text-lg px-8 w-full sm:w-auto">
                  <Calendar className="mr-2 h-5 w-5" />
                  Solicitar Cotización
                </Button>
              </Link>
              <Link href="/contacto">
                <Button 
                  size="lg" 
                  className="bg-white/10 backdrop-blur-sm hover:bg-white/20 text-white border-2 border-white text-lg px-8 w-full sm:w-auto"
                >
                  Contactar
                </Button>
              </Link>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  )
}

