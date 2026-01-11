"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ChevronDown, ChevronUp, HelpCircle } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"

interface FAQItem {
  question: string
  answer: string
}

const faqs: FAQItem[] = [
  {
    question: "¿Cuál es la capacidad máxima de sus espacios?",
    answer: "Nuestro centro de eventos puede acomodar hasta 150 personas. Contamos con un salón que ofrece diferentes espacios configurables según las necesidades de cada cliente y tipo de evento."
  },
  {
    question: "¿Incluyen servicios de catering?",
    answer: "Sí, ofrecemos servicios de catering con menús personalizados adaptados a tu evento. Trabajamos exclusivamente con nuestro equipo de cocina para garantizar la calidad y el servicio. No trabajamos con proveedores externos."
  },
  {
    question: "¿Cuánto tiempo de anticipación necesito para reservar?",
    answer: "Recomendamos reservar con al menos 3-6 meses de anticipación para fechas populares (fines de semana, temporada alta). Sin embargo, también podemos acomodar eventos con menos tiempo según disponibilidad."
  },
  {
    question: "¿Qué servicios están incluidos en el arriendo?",
    answer: "El arriendo incluye el uso del espacio, mobiliario básico (mesas y sillas), estacionamiento, WiFi, y acceso a áreas comunes. Servicios adicionales como decoración, audio, iluminación y catering se cotizan por separado."
  },
  {
    question: "¿Puedo visitar las instalaciones antes de reservar?",
    answer: "¡Por supuesto! Agenda una visita con nosotros para conocer nuestros espacios, ver la ubicación y resolver todas tus dudas. Esto te ayudará a visualizar mejor tu evento."
  },
  {
    question: "¿Cuál es la política de cancelación?",
    answer: "Nuestra política de cancelación varía según el tiempo de anticipación. Te proporcionaremos todos los detalles en tu cotización personalizada. Trabajamos con flexibilidad para adaptarnos a situaciones especiales."
  },
  {
    question: "¿Tienen estacionamiento disponible?",
    answer: "Sí, contamos con amplio estacionamiento gratuito para todos tus invitados, con capacidad para más de 50 vehículos."
  },
  {
    question: "¿Ofrecen paquetes todo incluido?",
    answer: "Sí, ofrecemos paquetes personalizados que pueden incluir espacio, catering, decoración, audio/video y más. Contáctanos para armar el paquete perfecto para tu evento."
  }
]

export default function FAQSection() {
  const [openIndex, setOpenIndex] = useState<number | null>(null)

  const toggleFAQ = (index: number) => {
    setOpenIndex(openIndex === index ? null : index)
  }

  return (
    <section className="py-20 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-nature-forest/10 rounded-full mb-4">
            <HelpCircle className="h-8 w-8 text-nature-forest" />
          </div>
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            Preguntas Frecuentes
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Encuentra respuestas a las preguntas más comunes sobre nuestros servicios y espacios
          </p>
        </div>

        <div className="max-w-3xl mx-auto space-y-4">
          {faqs.map((faq, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: index * 0.05 }}
              viewport={{ once: true }}
            >
              <Card className="overflow-hidden hover:shadow-lg transition-shadow">
                <CardHeader
                  className="cursor-pointer hover:bg-gray-50 transition-colors"
                  onClick={() => toggleFAQ(index)}
                >
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-lg font-semibold text-gray-900 pr-4">
                      {faq.question}
                    </CardTitle>
                    {openIndex === index ? (
                      <ChevronUp className="h-5 w-5 text-nature-forest flex-shrink-0" />
                    ) : (
                      <ChevronDown className="h-5 w-5 text-gray-400 flex-shrink-0" />
                    )}
                  </div>
                </CardHeader>
                <AnimatePresence>
                  {openIndex === index && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3 }}
                    >
                      <CardContent className="pt-0 pb-6">
                        <p className="text-gray-600 leading-relaxed">
                          {faq.answer}
                        </p>
                      </CardContent>
                    </motion.div>
                  )}
                </AnimatePresence>
              </Card>
            </motion.div>
          ))}
        </div>

        <div className="text-center mt-12">
          <p className="text-gray-600 mb-4">
            ¿No encontraste la respuesta que buscabas?
          </p>
          <a
            href="/contacto"
            className="text-nature-forest hover:text-nature-moss font-semibold underline"
          >
            Contáctanos directamente
          </a>
        </div>
      </div>
    </section>
  )
}
