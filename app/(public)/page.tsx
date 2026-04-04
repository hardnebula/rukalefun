"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Calendar, Users, Star, Camera, Sparkles, MapPin, Heart, Gift, ArrowRight, Play, MessageCircle, Send, Bookmark } from "lucide-react"
import Link from "next/link"
import Image from "next/image"
import { motion } from "framer-motion"
import { useQuery } from "convex/react"
import { api } from "@/convex/_generated/api"
import FAQSection from "@/components/sections/FAQSection"
import FloralCorner from "@/components/invitations/decorations/FloralCorner"
import LeafBranch from "@/components/invitations/decorations/LeafBranch"
import { LocalBusinessSchema } from "@/components/seo/StructuredData"

export default function HomePage() {
  const testimonials = useQuery(api.testimonials.getPublicTestimonials)
  const spaces = useQuery(api.spaces.getAllSpaces)

  return (
    <div className="min-h-screen">
      {/* Schema.org LocalBusiness para SEO local */}
      <LocalBusinessSchema />

      {/* Hero Section */}
      <section
        className="relative h-screen flex items-center justify-center overflow-hidden"
        aria-label="Bienvenida"
      >
        {/* Background Image */}
        <div className="absolute inset-0 z-0">
          <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/40 to-black/60 z-10" />
          <img
            src="/Ceremonia/Ceremonia al aire libre.webp"
            alt="Centro de eventos Ruka Lefún en Villarrica - salón para matrimonios y eventos corporativos rodeado de naturaleza"
            className="w-full h-full object-cover"
            loading="eager"
            fetchPriority="high"
          />
        </div>

        {/* Hero Content */}
        <div className="relative z-20 text-center px-4 max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <p className="text-sm md:text-base uppercase tracking-[0.3em] text-white/70 mb-4 font-light">
              Centro de Eventos · Villarrica, Chile
            </p>
            <h1 className="font-serif text-6xl md:text-8xl font-bold text-white mb-4 leading-tight" style={{ textShadow: "0 2px 20px rgba(0,0,0,0.3)" }}>
              Ruka Lefún
            </h1>
            <div className="flex items-center justify-center gap-4 mb-6">
              <div className="h-px w-16 bg-white/40" />
              <div className="w-1.5 h-1.5 rounded-full bg-white/60" />
              <div className="h-px w-16 bg-white/40" />
            </div>
            <p className="text-xl md:text-2xl font-light text-white/90 mb-8 tracking-wide">
              Matrimonios, eventos corporativos y celebraciones en el sur de Chile
            </p>
            <p className="text-base md:text-lg text-white/75 mb-10 max-w-2xl mx-auto leading-relaxed">
              Salones rodeados de naturaleza para crear experiencias inolvidables en la Araucanía
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
      <section className="py-24 bg-white" aria-labelledby="porque-elegirnos">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <p className="text-sm uppercase tracking-[0.25em] text-nature-forest font-medium mb-3">Por qué elegirnos</p>
            <h2 id="porque-elegirnos" className="font-serif text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              El Lugar Perfecto para tu Evento
            </h2>
            <p className="text-lg text-gray-500 max-w-2xl mx-auto leading-relaxed">
              Combinamos naturaleza, elegancia y servicio excepcional para crear momentos inolvidables en Villarrica
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {[
              {
                icon: MapPin,
                color: "text-nature-forest",
                bg: "bg-gradient-to-br from-nature-forest/10 to-nature-moss/10",
                title: "Ubicación Privilegiada",
                desc: "Rodeados por la naturaleza del sur de Chile en Villarrica, con vistas espectaculares y aire puro.",
                delay: 0,
              },
              {
                icon: Users,
                color: "text-nature-teal",
                bg: "bg-gradient-to-br from-nature-teal/10 to-nature-lake/10",
                title: "Espacios Versátiles",
                desc: "Salones adaptables para matrimonios, eventos corporativos, cumpleaños y celebraciones de todo tipo.",
                delay: 0.1,
              },
              {
                icon: Sparkles,
                color: "text-amber-600",
                bg: "bg-gradient-to-br from-amber-500/10 to-amber-600/10",
                title: "Servicio Integral",
                desc: "Catering, decoración, audio y video. Todo lo que necesitas para que tu evento sea perfecto.",
                delay: 0.2,
              },
            ].map(({ icon: Icon, color, bg, title, desc, delay }) => (
              <motion.div
                key={title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay }}
                viewport={{ once: true }}
              >
                <Card className="text-center h-full border border-gray-100 hover:border-nature-forest/20 hover:shadow-xl transition-all duration-300 cursor-default group">
                  <CardHeader className="pb-3">
                    <div className={`mx-auto ${bg} w-20 h-20 rounded-2xl flex items-center justify-center mb-5 group-hover:scale-110 transition-transform duration-300`}>
                      <Icon className={`h-9 w-9 ${color}`} />
                    </div>
                    <CardTitle className="font-serif text-xl text-gray-900">{title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-500 text-base leading-relaxed">{desc}</p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Espacios Disponibles */}
      <section className="py-24 bg-[#f8f6f2]" aria-labelledby="nuestros-espacios">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <p className="text-sm uppercase tracking-[0.25em] text-nature-forest font-medium mb-3">Nuestros espacios</p>
            <h2 id="nuestros-espacios" className="font-serif text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              Espacios para Cada Evento
            </h2>
            <p className="text-lg text-gray-500 max-w-2xl mx-auto leading-relaxed">
              Salones y áreas al aire libre diseñados para matrimonios, cumpleaños y eventos corporativos
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
                // Use local images for spaces
                const getSpaceImage = () => {
                  if (space.name.toLowerCase().includes("principal")) {
                    return "/Salon Principal/SalonPrincipal.webp";
                  }
                  if (space.name.toLowerCase().includes("ceremonia")) {
                    return "/Ceremonia/Ceremonia al aire libre.webp";
                  }
                  if (space.name.toLowerCase().includes("cocktail")) {
                    return "/cocktail/Cocktail al aire libre.webp";
                  }
                  return space.images?.[0] || fallbackImages[index % fallbackImages.length];
                };
                return (
                <motion.div
                  key={space._id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  viewport={{ once: true }}
                >
                  <Card className="overflow-hidden hover:shadow-2xl transition-all duration-300 cursor-pointer border border-gray-100 hover:border-nature-forest/20 group" itemScope itemType="https://schema.org/Place">
                    <div className="h-56 relative overflow-hidden">
                      <img
                        src={getSpaceImage()}
                        alt={`${space.name} - espacio para eventos en Ruka Lefún Villarrica`}
                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                        loading="lazy"
                        itemProp="image"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                    </div>
                    <CardHeader className="pb-3">
                      <CardTitle className="font-serif text-xl" itemProp="name">{space.name}</CardTitle>
                      <CardDescription className="line-clamp-2 text-sm leading-relaxed" itemProp="description">{space.description}</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <Link href={`/espacios#${space._id}`} className="block">
                        <Button className="w-full bg-gradient-nature hover:opacity-90 text-white shadow-md transition-all duration-200 cursor-pointer">
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

      {/* Video Promocional - Instagram Style */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Left side - Content */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
              className="text-center lg:text-left order-2 lg:order-1"
            >
              <div className="inline-flex items-center gap-2 bg-nature-forest/10 text-nature-forest rounded-full px-4 py-1.5 text-sm font-medium mb-6">
                <Play className="w-4 h-4" />
                Mira Nuestro Espacio
              </div>
              <h2 className="font-serif text-4xl md:text-5xl font-bold text-gray-900 mb-6">
                Vive la Experiencia Ruka Lefún
              </h2>
              <p className="text-lg text-gray-600 mb-8 max-w-lg">
                Descubre por que somos el lugar favorito para celebrar los momentos mas importantes.
                Naturaleza, elegancia y un servicio excepcional te esperan.
              </p>
              <div className="flex flex-wrap gap-4 mb-8 justify-center lg:justify-start">
                <div className="flex items-center gap-2 bg-gray-100 rounded-full px-4 py-2 text-sm">
                  <MapPin className="w-4 h-4 text-nature-forest" />
                  <span className="text-gray-700">Villarrica, Chile</span>
                </div>
                <div className="flex items-center gap-2 bg-gray-100 rounded-full px-4 py-2 text-sm">
                  <Users className="w-4 h-4 text-nature-lake" />
                  <span className="text-gray-700">Hasta 200 personas</span>
                </div>
              </div>
              <Link href="/reservas">
                <Button size="lg" className="bg-gradient-nature hover:opacity-90 text-white shadow-lg cursor-pointer transition-all duration-200">
                  Reserva Tu Evento
                  <ArrowRight className="w-5 h-5 ml-2" />
                </Button>
              </Link>
            </motion.div>

            {/* Right side - Phone Mockup Instagram Style */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              viewport={{ once: true }}
              className="relative flex justify-center order-1 lg:order-2"
            >
              {/* Phone Frame - Minimal design */}
              <div className="relative w-[320px] md:w-[380px]">
                {/* Phone frame - thin border */}
                <div className="bg-gray-200 rounded-[2.5rem] p-1 shadow-2xl">
                  {/* Screen */}
                  <div className="bg-white rounded-[2.3rem] overflow-hidden">
                    {/* Instagram Header */}
                    <div className="flex items-center justify-between px-4 py-3 border-b border-gray-100">
                      <div className="flex items-center gap-3">
                        {/* Profile pic with gradient border */}
                        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-nature-forest via-nature-moss to-nature-teal p-[2px]">
                          <div className="w-full h-full rounded-full bg-white p-[2px]">
                            <div className="w-full h-full rounded-full bg-nature-forest flex items-center justify-center">
                              <span className="text-white text-xs font-bold">RL</span>
                            </div>
                          </div>
                        </div>
                        <div>
                          <p className="text-sm font-semibold text-gray-900">rukalefun</p>
                          <p className="text-xs text-gray-500">Villarrica, Chile</p>
                        </div>
                      </div>
                      <div className="flex gap-1">
                        <div className="w-1 h-1 bg-gray-900 rounded-full" />
                        <div className="w-1 h-1 bg-gray-900 rounded-full" />
                        <div className="w-1 h-1 bg-gray-900 rounded-full" />
                      </div>
                    </div>

                    {/* Video Container - Full width */}
                    <div className="relative aspect-[9/16] bg-black">
                      <iframe
                        src="https://www.youtube.com/embed/1XrG-Wv4awU?autoplay=1&mute=1&loop=1&playlist=1XrG-Wv4awU&controls=1&showinfo=0&rel=0&modestbranding=1&playsinline=1"
                        title="Video promocional Ruka Lefun"
                        className="absolute inset-0 w-full h-full"
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        allowFullScreen
                      />
                    </div>

                    {/* Instagram Actions */}
                    <div className="px-4 py-3">
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-5">
                          <Heart className="w-7 h-7 text-gray-900 cursor-pointer hover:text-red-500 transition-colors" />
                          <MessageCircle className="w-7 h-7 text-gray-900 cursor-pointer hover:text-gray-600 transition-colors" />
                          <Send className="w-7 h-7 text-gray-900 cursor-pointer hover:text-gray-600 transition-colors" />
                        </div>
                        <Bookmark className="w-7 h-7 text-gray-900 cursor-pointer hover:text-gray-600 transition-colors" />
                      </div>
                      <p className="text-sm font-semibold text-gray-900 mb-1">2,547 Me gusta</p>
                      <p className="text-sm text-gray-900">
                        <span className="font-semibold">rukalefun</span>{" "}
                        <span className="text-gray-700">El lugar perfecto para tus eventos mas especiales</span>
                      </p>
                      <p className="text-xs text-gray-400 mt-1">Ver los 48 comentarios</p>
                    </div>

                    {/* Home indicator */}
                    <div className="flex justify-center pb-2">
                      <div className="w-28 h-1 bg-gray-300 rounded-full" />
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Invitaciones Digitales - Phone Mockup Section */}
      <section className="py-20 relative overflow-hidden">
        {/* Background with diagonal stripes */}
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-[#faf8f5]" />
          <svg className="absolute right-0 top-0 h-full w-2/3 opacity-50" viewBox="0 0 400 600" preserveAspectRatio="none">
            <path d="M100,0 L400,0 L400,600 L0,600 Z" fill="#D4C4B0" />
            <path d="M200,150 L400,80 L400,400 L100,500 Z" fill="#2D5016" />
          </svg>

          {/* Elementos florales decorativos - esquina superior izquierda */}
          <div className="absolute top-4 left-4 opacity-30 hidden lg:block">
            <FloralCorner
              variant="topLeft"
              floralStyle="rose"
              size={160}
              primaryColor="#D4C4B0"
              secondaryColor="#2D5016"
              accentColor="#8B6F47"
            />
          </div>

          {/* Rama decorativa - lado izquierdo medio */}
          <div className="absolute top-1/3 -left-4 opacity-25 hidden lg:block">
            <LeafBranch
              direction="right"
              variant="eucalyptus"
              color="#2D5016"
              size={100}
            />
          </div>

          {/* Elemento floral sutil - parte inferior */}
          <div className="absolute bottom-8 left-1/4 opacity-20 hidden md:block">
            <LeafBranch
              direction="up"
              variant="simple"
              color="#D4C4B0"
              size={80}
            />
          </div>
        </div>

        <div className="container mx-auto px-4 relative z-10">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Left side - Content */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
              className="text-center lg:text-left"
            >
              <div className="inline-flex items-center gap-2 bg-[#2D5016]/10 text-[#2D5016] rounded-full px-4 py-1.5 text-sm font-medium mb-6">
                <Heart className="w-4 h-4" />
                Nuevo Servicio
              </div>
              <h2 className="font-serif text-4xl md:text-5xl font-bold text-gray-900 mb-6">
                Invitaciones de Matrimonio Digitales
              </h2>
              <p className="text-lg text-gray-600 mb-8 max-w-lg">
                Sorprende a tus invitados con una invitacion interactiva.
                Comparte un link unico y recibe confirmaciones de asistencia al instante.
              </p>
              <div className="flex flex-wrap gap-4 mb-8 justify-center lg:justify-start">
                <div className="flex items-center gap-2 bg-white shadow-md rounded-full px-4 py-2 text-sm">
                  <Gift className="w-4 h-4 text-[#2D5016]" />
                  <span className="text-gray-700">Gratis con tu reserva</span>
                </div>
                <div className="flex items-center gap-2 bg-white shadow-md rounded-full px-4 py-2 text-sm">
                  <Sparkles className="w-4 h-4 text-[#D4C4B0]" />
                  <span className="text-gray-700">Personalizable</span>
                </div>
              </div>
              <Link href="/invitaciones">
                <Button size="lg" className="bg-[#2D5016] hover:bg-[#1f3a0f] text-white shadow-lg">
                  Crear Mi Invitacion
                  <ArrowRight className="w-5 h-5 ml-2" />
                </Button>
              </Link>
            </motion.div>

            {/* Right side - Phone Mockup */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              viewport={{ once: true }}
              className="relative flex justify-center"
            >
              {/* Scroll indicator - notification style */}
              <div className="absolute left-12 top-1/4 hidden lg:flex flex-col items-center gap-2 z-10">
                <motion.div
                  animate={{ opacity: [0.7, 1, 0.7] }}
                  transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }}
                  className="relative"
                >
                  <div className="bg-[#2D5016] text-white rounded-full px-4 py-2 text-sm font-medium shadow-lg">
                    Desliza
                  </div>
                </motion.div>
                {/* Scroll line indicator */}
                <div className="w-[3px] h-10 rounded-full bg-white/30 relative overflow-hidden">
                  <motion.div
                    animate={{ y: [0, 24, 0] }}
                    transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                    className="w-full h-4 rounded-full bg-white"
                  />
                </div>
              </div>

              {/* Phone Frame - Minimal design */}
              <div className="relative w-[320px] md:w-[380px]">
                {/* Phone frame - thin border */}
                <div className="bg-gray-200 rounded-[2.5rem] p-1 shadow-2xl">
                  {/* Screen with scrollable invitation preview */}
                  <div className="bg-[#faf7f2] rounded-[2.3rem] overflow-hidden h-[580px] md:h-[640px]">
                      <div className="h-full overflow-y-auto scrollbar-hide">
                        {/* Section 1: Welcome */}
                        <div
                          className="min-h-full w-full bg-cover bg-center relative flex items-center justify-center"
                          style={{
                            backgroundImage: "url('https://images.unsplash.com/photo-1529634806980-85c3dd6d34ac?q=80&w=800')",
                          }}
                        >
                          <div className="absolute inset-0 bg-black/40" />
                          <div className="relative text-white p-6 text-center">
                            <p className="text-xs uppercase tracking-[0.3em] mb-6 opacity-80">Nuestro Matrimonio</p>
                            <h3 className="font-script text-5xl mb-1">Josefa</h3>
                            <span className="text-2xl opacity-70">&</span>
                            <h3 className="font-script text-5xl mb-6">Fernando</h3>
                            <div className="flex items-center justify-center gap-2 mb-6">
                              <div className="h-px w-8 bg-white/40" />
                              <Heart className="w-5 h-5 opacity-60" />
                              <div className="h-px w-8 bg-white/40" />
                            </div>
                            <p className="text-base opacity-90">15 de Marzo, 2025</p>
                          </div>
                        </div>

                        {/* Section 2: Countdown */}
                        <div className="min-h-full w-full bg-[#faf7f2] flex flex-col items-center justify-center p-6">
                          <p className="text-sm uppercase tracking-[0.2em] text-[#2D5016] mb-4">Faltan</p>
                          <div className="flex justify-center gap-4 mb-6">
                            {[
                              { value: "45", label: "Dias" },
                              { value: "12", label: "Hrs" },
                              { value: "30", label: "Min" },
                            ].map((item) => (
                              <div key={item.label} className="text-center">
                                <div className="text-3xl font-light text-[#5c4a3a]">{item.value}</div>
                                <div className="text-xs uppercase tracking-wider text-[#2D5016]">{item.label}</div>
                              </div>
                            ))}
                          </div>
                          <div className="max-w-[200px] text-center border-t border-[#2D5016]/20 pt-4">
                            <p className="text-sm italic text-[#5c4a3a]/80 leading-relaxed">
                              &ldquo;Nada es eterno, salvo un beso sincero y una copa compartida&rdquo;
                            </p>
                          </div>
                        </div>

                        {/* Section 3: Ceremonia */}
                        <div className="min-h-full w-full bg-[#f5f0e8] flex flex-col items-center justify-center p-6">
                          <p className="text-sm uppercase tracking-[0.3em] text-[#2D5016] mb-6">Ceremonia</p>
                          <div className="w-14 h-14 rounded-full bg-[#d4c4b0]/30 flex items-center justify-center mb-4">
                            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#2D5016" strokeWidth="1.5">
                              <path d="M12 2L14 8H20L15 12L17 18L12 14L7 18L9 12L4 8H10L12 2Z" />
                            </svg>
                          </div>
                          <h4 className="font-script text-3xl text-[#5c4a3a] mb-2">Iglesia San Jose</h4>
                          <p className="text-sm text-[#2D5016] mb-1">Sabado 15 de Marzo</p>
                          <p className="text-sm text-[#2D5016] mb-4">16:00 hrs</p>
                          <button className="text-sm uppercase tracking-wider text-[#2D5016] border border-[#2D5016]/40 rounded-full px-5 py-2">
                            Ver Mapa
                          </button>
                        </div>

                        {/* Section 4: Celebracion */}
                        <div className="min-h-full w-full bg-[#faf7f2] flex flex-col items-center justify-center p-6">
                          <p className="text-sm uppercase tracking-[0.3em] text-[#2D5016] mb-6">Celebracion</p>
                          <div className="w-14 h-14 rounded-full bg-[#d4c4b0]/30 flex items-center justify-center mb-4">
                            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#2D5016" strokeWidth="1.5">
                              <path d="M12 2C8 2 5 5.5 5 9.5c0 4 3 6.5 7 6.5s7-2.5 7-6.5C19 5.5 16 2 12 2z" />
                              <path d="M12 16v6" />
                              <path d="M10 22h4" />
                            </svg>
                          </div>
                          <h4 className="font-script text-3xl text-[#5c4a3a] mb-2">Ruka Lefun</h4>
                          <p className="text-sm text-[#2D5016]/80 text-center mb-1">Centro de Eventos</p>
                          <p className="text-sm text-[#2D5016] mb-1">Sabado 15 de Marzo</p>
                          <p className="text-sm text-[#2D5016] mb-4">18:00 hrs</p>
                          <button className="text-sm uppercase tracking-wider text-[#2D5016] border border-[#2D5016]/40 rounded-full px-5 py-2">
                            Ver Mapa
                          </button>
                        </div>

                        {/* Section 5: Fiesta */}
                        <div className="min-h-full w-full bg-[#f5f0e8] flex flex-col items-center justify-center p-6">
                          <p className="text-sm uppercase tracking-[0.3em] text-[#2D5016] mb-6">¡Vamos a Celebrar!</p>
                          <div className="flex flex-col gap-4 w-full max-w-[220px]">
                            <div className="flex items-center gap-3 bg-[#d4c4b0]/20 rounded-xl p-3">
                              <div className="w-12 h-12 rounded-full bg-[#d4c4b0]/40 flex items-center justify-center flex-shrink-0">
                                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#2D5016" strokeWidth="1.5">
                                  <circle cx="8" cy="18" r="3" />
                                  <circle cx="18" cy="16" r="3" />
                                  <path d="M11 18V6l10-2v12" />
                                </svg>
                              </div>
                              <div>
                                <p className="text-sm font-medium text-[#5c4a3a]">Musica & Baile</p>
                                <p className="text-xs text-[#2D5016]/70">¡A bailar!</p>
                              </div>
                            </div>
                            <div className="flex items-center gap-3 bg-[#d4c4b0]/20 rounded-xl p-3">
                              <div className="w-12 h-12 rounded-full bg-[#d4c4b0]/40 flex items-center justify-center flex-shrink-0">
                                <svg width="24" height="24" viewBox="0 0 48 48" fill="none" stroke="#2D5016" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                                  <path d="M18 6H30L28.5 12L33 42L24 36L15 42L19.5 12L18 6Z" fill="#2D5016" fillOpacity="0.2" />
                                  <path d="M18 6H30L28.5 12L33 42L24 36L15 42L19.5 12L18 6Z" />
                                  <path d="M18 6L24 12L30 6" />
                                  <path d="M21 18L24 22L27 18" strokeWidth="1" />
                                </svg>
                              </div>
                              <div>
                                <p className="text-sm font-medium text-[#5c4a3a]">Dresscode</p>
                                <p className="text-xs text-[#2D5016]/70">Formal elegante</p>
                              </div>
                            </div>
                            <div className="flex items-center gap-3 bg-[#d4c4b0]/20 rounded-xl p-3">
                              <div className="w-12 h-12 rounded-full bg-[#d4c4b0]/40 flex items-center justify-center flex-shrink-0">
                                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#2D5016" strokeWidth="1.5">
                                  <path d="M12 2C8 2 5 6 5 10c0 3 2 5 4 6v4h6v-4c2-1 4-3 4-6 0-4-3-8-7-8z" />
                                  <path d="M9 22h6" />
                                  <path d="M12 10v3" />
                                  <path d="M10.5 11.5h3" />
                                </svg>
                              </div>
                              <div>
                                <p className="text-sm font-medium text-[#5c4a3a]">Tips</p>
                                <p className="text-xs text-[#2D5016]/70">Trae abrigo</p>
                              </div>
                            </div>
                          </div>
                        </div>

                        {/* Section 6: Confirmacion */}
                        <div className="min-h-full w-full bg-[#faf7f2] flex flex-col items-center justify-center p-6">
                          <p className="text-sm uppercase tracking-[0.3em] text-[#2D5016] mb-4">Confirma tu Asistencia</p>
                          <div className="w-14 h-14 rounded-full bg-[#d4c4b0]/30 flex items-center justify-center mb-4">
                            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#2D5016" strokeWidth="1.5">
                              <path d="M9 12l2 2 4-4" />
                              <circle cx="12" cy="12" r="10" />
                            </svg>
                          </div>
                          <h4 className="font-script text-3xl text-[#5c4a3a] mb-4">¿Asistiras?</h4>
                          <p className="text-sm text-[#2D5016]/80 text-center mb-4 leading-relaxed">
                            Por favor confirma antes del<br />1 de Marzo, 2025
                          </p>
                          <button className="bg-[#2D5016] text-white text-sm uppercase tracking-wider rounded-full px-6 py-2.5">
                            Confirmar
                          </button>
                        </div>
                      </div>
                    {/* Home indicator */}
                    <div className="flex justify-center pb-2 pt-2">
                      <div className="w-28 h-1 bg-gray-300 rounded-full" />
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <FAQSection />

      {/* Testimonios */}
      <section className="py-24 bg-white" aria-labelledby="testimonios">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <p className="text-sm uppercase tracking-[0.25em] text-nature-forest font-medium mb-3">Testimonios</p>
            <h2 id="testimonios" className="font-serif text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              Lo Que Dicen Nuestros Clientes
            </h2>
            <p className="text-lg text-gray-500 max-w-2xl mx-auto leading-relaxed">
              Matrimonios y eventos que superaron expectativas en Villarrica
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
                  itemScope
                  itemType="https://schema.org/Review"
                >
                  <Card className="h-full border border-gray-100 hover:shadow-lg transition-shadow duration-300 relative overflow-hidden">
                    <div className="absolute top-4 left-5 text-6xl font-serif text-nature-forest/10 leading-none select-none">&ldquo;</div>
                    <CardHeader className="pb-3 pt-8">
                      <div className="flex items-center space-x-1 mb-3" itemProp="reviewRating" itemScope itemType="https://schema.org/Rating">
                        <meta itemProp="ratingValue" content={String(testimonial.rating)} />
                        <meta itemProp="bestRating" content="5" />
                        {Array.from({ length: 5 }).map((_, i) => (
                          <Star
                            key={i}
                            className={`h-4 w-4 ${
                              i < testimonial.rating
                                ? "fill-amber-400 text-amber-400"
                                : "text-gray-200"
                            }`}
                          />
                        ))}
                      </div>
                      <p className="text-gray-600 italic text-sm leading-relaxed" itemProp="reviewBody">&ldquo;{testimonial.comment}&rdquo;</p>
                    </CardHeader>
                    <CardContent className="pt-0">
                      <div className="flex items-center gap-3 pt-4 border-t border-gray-100">
                        <div className="w-9 h-9 rounded-full bg-gradient-to-br from-nature-forest to-nature-moss flex items-center justify-center flex-shrink-0">
                          <span className="text-white text-xs font-bold">{testimonial.clientName.charAt(0)}</span>
                        </div>
                        <div>
                          <p className="font-semibold text-gray-900 text-sm" itemProp="author">{testimonial.clientName}</p>
                          <p className="text-xs text-gray-400">{testimonial.eventType}</p>
                        </div>
                      </div>
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
      <section className="py-24 bg-gradient-to-br from-nature-forest via-nature-moss to-nature-emerald text-white relative overflow-hidden" aria-labelledby="cta-reserva">
        <div className="absolute inset-0 bg-[url('/Ceremonia/Ceremonia al aire libre.webp')] bg-cover bg-center opacity-10"></div>
        <div className="absolute inset-0 bg-gradient-to-br from-nature-forest/95 via-nature-moss/90 to-nature-emerald/95"></div>
        <div className="container mx-auto px-4 text-center relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <p className="text-sm uppercase tracking-[0.3em] text-white/60 mb-4">Reserva tu evento</p>
            <h2 id="cta-reserva" className="font-serif text-4xl md:text-6xl font-bold mb-6 leading-tight">
              Cotiza tu Evento en Villarrica
            </h2>
            <div className="flex items-center justify-center gap-4 mb-8">
              <div className="h-px w-16 bg-white/30" />
              <div className="w-1.5 h-1.5 rounded-full bg-white/50" />
              <div className="h-px w-16 bg-white/30" />
            </div>
            <p className="text-xl text-white/85 mb-10 max-w-2xl mx-auto leading-relaxed">
              Reserva tu matrimonio, cumpleaños o evento corporativo en Ruka Lefún
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

