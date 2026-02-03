"use client";

import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import Link from "next/link";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Heart,
  Sparkles,
  Share2,
  Palette,
  Users,
  CheckCircle,
  ArrowRight,
  Gift,
} from "lucide-react";

export default function InvitacionesPage() {
  const price = useQuery(api.invitationSettings.getPrice);
  const formattedPrice = price ? price.toLocaleString("es-CL") : "15.000";

  const features = [
    {
      icon: Palette,
      title: "Disenos Personalizables",
      description: "Elige entre 3 plantillas elegantes y personaliza colores",
    },
    {
      icon: Share2,
      title: "Comparte Facilmente",
      description: "Un link unico para compartir con todos tus invitados",
    },
    {
      icon: Users,
      title: "Confirmacion Integrada",
      description: "Tus invitados confirman asistencia directamente",
    },
    {
      icon: Sparkles,
      title: "Galeria de Fotos",
      description: "Sube hasta 6 fotos de la pareja",
    },
  ];

  const templates = [
    {
      id: "classic",
      name: "Clasica",
      tagline: "Elegante y atemporal",
      colorDots: ["#2D5016", "#E8C4C4", "#F5E6D3"],
      colorName: "Rosas clasicas",
      bgColor: "bg-[#F8FBF8]",
      borderColor: "border-[#2D5016]",
      textColor: "text-[#2D5016]",
      accentColor: "#2D5016",
    },
    {
      id: "romantic",
      name: "Romantica",
      tagline: "Suave y delicado",
      colorDots: ["#D4A5A5", "#E8C4C4", "#F5E6D3"],
      colorName: "Flores silvestres",
      bgColor: "bg-[#FDF8F8]",
      borderColor: "border-[#E8C4C4]",
      textColor: "text-[#B88B8B]",
      accentColor: "#D4A5A5",
    },
    {
      id: "modern",
      name: "Moderna",
      tagline: "Minimalista y sofisticado",
      colorDots: ["#4A4A4A", "#C9A962", "#F5F5F5"],
      colorName: "Geometrico",
      bgColor: "bg-[#FAFAFA]",
      borderColor: "border-[#E5E5E5]",
      textColor: "text-[#4A4A4A]",
      accentColor: "#C9A962",
    },
  ];

  const faqs = [
    {
      q: "¿Como funciona?",
      a: "Creas tu invitacion en minutos, la personalizas con tus datos y fotos, y obtienes un link unico para compartir con tus invitados.",
    },
    {
      q: "¿Es gratis si tengo reserva en Ruka Lefun?",
      a: "¡Si! Si tienes una reserva confirmada con nosotros, la invitacion digital es completamente gratis.",
    },
    {
      q: "¿Puedo editar la invitacion despues de crearla?",
      a: "Por supuesto. Tendras un codigo de acceso para editar tu invitacion cuando quieras.",
    },
    {
      q: "¿Cuantos invitados pueden ver la invitacion?",
      a: "No hay limite. Puedes compartir el link con todos los invitados que quieras.",
    },
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative pt-32 pb-20 bg-gradient-to-br from-[#F8F4ED] via-white to-[#F8F4ED] overflow-hidden">
        <div className="absolute inset-0 opacity-5">
          <div className="absolute top-20 left-10 w-64 h-64 bg-pink-300 rounded-full blur-3xl" />
          <div className="absolute bottom-20 right-10 w-64 h-64 bg-green-300 rounded-full blur-3xl" />
        </div>

        <div className="container mx-auto px-4 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center max-w-3xl mx-auto"
          >
            <Badge className="mb-4 bg-pink-100 text-pink-700 border-pink-200">
              <Heart className="w-3 h-3 mr-1" />
              Invitaciones Digitales
            </Badge>

            <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
              Invitaciones de Matrimonio{" "}
              <span className="text-[#4A7C59]">Digitales</span>
            </h1>

            <p className="text-xl text-gray-600 mb-8">
              Crea tu invitacion de matrimonio personalizada en minutos. Comparte un
              link unico con tus invitados y recibe confirmaciones de asistencia.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-8">
              <Link href="/invitaciones/crear">
                <Button
                  size="lg"
                  className="bg-[#4A7C59] hover:bg-[#3d6649] text-white text-lg px-8 shadow-lg"
                >
                  <Heart className="mr-2 h-5 w-5" />
                  Crear Mi Invitacion
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
            </div>

            {/* Free with booking badge */}
            <div className="inline-flex items-center gap-2 bg-green-50 border border-green-200 rounded-full px-5 py-2.5">
              <Gift className="w-5 h-5 text-green-600" />
              <span className="text-green-700 font-medium">
                Gratis si tienes reserva en Ruka Lefun
              </span>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Features */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Todo lo que Necesitas
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Una invitacion digital completa con todas las funciones para tu matrimonio
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <motion.div
                  key={feature.title}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  viewport={{ once: true }}
                >
                  <Card className="h-full text-center hover:shadow-lg transition-shadow">
                    <CardContent className="pt-6">
                      <div className="w-12 h-12 bg-[#4A7C59]/10 rounded-full flex items-center justify-center mx-auto mb-4">
                        <Icon className="w-6 h-6 text-[#4A7C59]" />
                      </div>
                      <h3 className="font-semibold text-gray-900 mb-2">
                        {feature.title}
                      </h3>
                      <p className="text-sm text-gray-600">{feature.description}</p>
                    </CardContent>
                  </Card>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Templates Preview */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Elige tu Plantilla
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Podras cambiarla despues si lo deseas
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6 max-w-4xl mx-auto">
            {templates.map((template, index) => (
              <motion.div
                key={template.id}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
              >
                <Card className={`overflow-hidden hover:shadow-xl transition-all cursor-pointer border-2 ${template.borderColor} hover:border-[#2D5016]`}>
                  {/* Preview Card */}
                  <div className={`${template.bgColor} p-6 relative`}>
                    {/* Decorative top element */}
                    <div className="flex justify-center mb-4">
                      <svg width="80" height="24" viewBox="0 0 80 24" className="opacity-60">
                        <path
                          d="M0 12 Q20 0 40 12 Q60 24 80 12"
                          fill="none"
                          stroke={template.accentColor}
                          strokeWidth="1"
                        />
                        <circle cx="20" cy="8" r="3" fill={template.accentColor} opacity="0.5" />
                        <circle cx="40" cy="12" r="4" fill={template.accentColor} opacity="0.7" />
                        <circle cx="60" cy="8" r="3" fill={template.accentColor} opacity="0.5" />
                      </svg>
                    </div>

                    {/* Names */}
                    <div className={`text-center ${template.textColor}`}>
                      <p className="font-serif text-xl italic">Maria</p>
                      <p className="text-sm my-1">&</p>
                      <p className="font-serif text-xl italic">Juan</p>
                    </div>

                    {/* Decorative bottom element */}
                    <div className="flex justify-center mt-4">
                      <svg width="60" height="16" viewBox="0 0 60 16" className="opacity-60">
                        <path
                          d="M0 8 Q15 16 30 8 Q45 0 60 8"
                          fill="none"
                          stroke={template.accentColor}
                          strokeWidth="1"
                        />
                      </svg>
                    </div>
                  </div>

                  {/* Info */}
                  <CardContent className="p-4 bg-white">
                    <div className="flex items-start justify-between">
                      <div>
                        <h3 className="font-semibold text-gray-900">{template.name}</h3>
                        <p className="text-sm text-gray-500">{template.tagline}</p>
                      </div>
                      {template.id === "romantic" && (
                        <Sparkles className="w-4 h-4 text-amber-400" />
                      )}
                      {template.id === "modern" && (
                        <div className="w-4 h-4 rounded bg-gray-200 flex items-center justify-center">
                          <div className="w-2 h-2 bg-gray-400 rounded-sm" />
                        </div>
                      )}
                    </div>

                    {/* Color dots */}
                    <div className="flex items-center gap-2 mt-3">
                      {template.colorDots.map((color, i) => (
                        <div
                          key={i}
                          className="w-5 h-5 rounded-full border border-gray-200"
                          style={{ backgroundColor: color }}
                        />
                      ))}
                      <span className="text-xs text-gray-400 ml-1">{template.colorName}</span>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <Card className="overflow-hidden border-0 shadow-2xl">
              <div className="grid md:grid-cols-2">
                {/* Left side - Price */}
                <div className="bg-gradient-to-br from-[#F5EFE6] via-[#E8DFCA] to-[#D4C4B0] p-8 md:p-12 flex flex-col justify-center items-center text-center">
                  <span className="text-sm uppercase tracking-widest text-[#8B7355] mb-4">Invitacion Digital</span>
                  <div className="mb-6">
                    <span className="text-5xl md:text-6xl font-bold text-[#2D5016]">${formattedPrice}</span>
                    <span className="text-xl text-[#5c4a3a] ml-2">CLP</span>
                  </div>
                  <p className="text-[#8B7355] mb-8">Pago unico, sin suscripcion</p>

                  {/* Divider */}
                  <div className="w-full flex items-center gap-4 mb-8">
                    <div className="flex-1 h-px bg-[#8B7355]/30"></div>
                    <span className="text-[#8B7355] text-sm">o</span>
                    <div className="flex-1 h-px bg-[#8B7355]/30"></div>
                  </div>

                  {/* Free badge */}
                  <div className="bg-white/80 backdrop-blur rounded-2xl p-6 w-full">
                    <div className="flex items-center justify-center gap-2 mb-2">
                      <Gift className="w-6 h-6 text-[#2D5016]" />
                      <span className="text-2xl font-bold text-[#2D5016]">GRATIS</span>
                    </div>
                    <p className="text-sm text-[#5c4a3a]">
                      Si tienes reserva en Ruka Lefun
                    </p>
                  </div>
                </div>

                {/* Right side - Features */}
                <div className="p-8 md:p-12 bg-white">
                  <h3 className="text-xl font-bold text-gray-900 mb-6">Todo incluido</h3>

                  <div className="grid grid-cols-2 gap-4 mb-8">
                    {[
                      { icon: Palette, text: "Variedad de plantillas" },
                      { icon: Sparkles, text: "Colores personalizados" },
                      { icon: Users, text: "Confirmacion de asistencia" },
                      { icon: Share2, text: "Link unico" },
                    ].map((item) => {
                      const Icon = item.icon;
                      return (
                        <div key={item.text} className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl">
                          <div className="w-10 h-10 bg-[#2D5016]/10 rounded-full flex items-center justify-center flex-shrink-0">
                            <Icon className="w-5 h-5 text-[#2D5016]" />
                          </div>
                          <span className="text-sm text-gray-700">{item.text}</span>
                        </div>
                      );
                    })}
                  </div>

                  <ul className="space-y-3 mb-8">
                    {[
                      "Galeria de hasta 6 fotos",
                      "Edicion ilimitada",
                      "Sin fecha de expiracion",
                      "Soporte incluido",
                    ].map((item) => (
                      <li key={item} className="flex items-center gap-2">
                        <CheckCircle className="w-5 h-5 text-[#2D5016] flex-shrink-0" />
                        <span className="text-gray-600">{item}</span>
                      </li>
                    ))}
                  </ul>

                  <Link href="/invitaciones/crear" className="block">
                    <Button className="w-full bg-[#2D5016] hover:bg-[#1f3a0f] text-white py-6 text-lg shadow-lg">
                      <Heart className="mr-2 h-5 w-5" />
                      Crear Mi Invitacion
                    </Button>
                  </Link>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Preguntas Frecuentes
            </h2>
          </div>

          <div className="max-w-2xl mx-auto space-y-4">
            {faqs.map((faq, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: index * 0.1 }}
                viewport={{ once: true }}
              >
                <Card>
                  <CardContent className="p-6">
                    <h3 className="font-semibold text-gray-900 mb-2">{faq.q}</h3>
                    <p className="text-gray-600">{faq.a}</p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 bg-gradient-to-br from-[#4A7C59] to-[#2D5016] text-white">
        <div className="container mx-auto px-4 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <Heart className="w-16 h-16 mx-auto mb-6 opacity-80" />
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              ¿Listo para Crear tu Invitacion?
            </h2>
            <p className="text-xl text-white/90 mb-8 max-w-2xl mx-auto">
              En solo unos minutos tendras tu invitacion digital lista para
              compartir con todos tus invitados.
            </p>
            <Link href="/invitaciones/crear">
              <Button
                size="lg"
                className="bg-white text-[#4A7C59] hover:bg-white/90 text-lg px-8"
              >
                Comenzar Ahora
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
