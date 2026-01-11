"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { MapPin, Phone, Mail, Clock } from "lucide-react"
import Breadcrumbs from "@/components/ui/Breadcrumbs"

export default function ContactoPage() {
  return (
    <div className="min-h-screen pt-20">
      <div className="container mx-auto px-4">
        <Breadcrumbs items={[{ label: "Contacto", href: "/contacto" }]} />
      </div>
      {/* Hero */}
      <section className="bg-gradient-to-br from-nature-forest via-nature-moss to-nature-emerald text-white py-16 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/5 to-transparent"></div>
        <div className="container mx-auto px-4 text-center relative z-10">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Contacto</h1>
          <p className="text-xl text-white/90 max-w-2xl mx-auto">
            Estamos aquí para ayudarte a planificar tu evento perfecto
          </p>
        </div>
      </section>

      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 max-w-6xl mx-auto">
            {/* Información de Contacto */}
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Información de Contacto</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="flex items-start space-x-4">
                    <div className="bg-nature-forest/10 p-3 rounded-lg">
                      <MapPin className="h-6 w-6 text-nature-forest" />
                    </div>
                    <div>
                      <h3 className="font-semibold mb-1">Ubicación</h3>
                      <p className="text-gray-600">
                        Villarrica, Región de La Araucanía<br />
                        Chile
                      </p>
                      <a
                        href="https://share.google/DiCu8Xxuq2Z2BPSdt"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-sm text-nature-forest hover:text-nature-moss font-medium mt-1 inline-block"
                      >
                        Ver en mapa →
                      </a>
                    </div>
                  </div>

                  <div className="flex items-start space-x-4">
                    <div className="bg-nature-forest/10 p-3 rounded-lg">
                      <Phone className="h-6 w-6 text-nature-forest" />
                    </div>
                    <div>
                      <h3 className="font-semibold mb-1">Teléfono</h3>
                      <a
                        href="tel:+56983614062"
                        className="text-gray-600 hover:text-nature-forest font-medium block mb-1"
                      >
                        +56 9 8361 4062
                      </a>
                      <a
                        href="https://wa.me/56983614062"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 text-green-600 hover:text-green-700 font-medium"
                      >
                        <svg className="h-4 w-4" viewBox="0 0 24 24" fill="currentColor">
                          <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/>
                        </svg>
                        Escribir por WhatsApp
                      </a>
                    </div>
                  </div>

                  <div className="flex items-start space-x-4">
                    <div className="bg-nature-forest/10 p-3 rounded-lg">
                      <Mail className="h-6 w-6 text-nature-forest" />
                    </div>
                    <div>
                      <h3 className="font-semibold mb-1">Email</h3>
                      <a
                        href="mailto:contacto@rukalefun.cl"
                        className="text-gray-600 hover:text-nature-moss"
                      >
                        contacto@rukalefun.cl
                      </a>
                    </div>
                  </div>

                  <div className="flex items-start space-x-4">
                    <div className="bg-nature-forest/10 p-3 rounded-lg">
                      <Clock className="h-6 w-6 text-nature-forest" />
                    </div>
                    <div>
                      <h3 className="font-semibold mb-1">Horario de Atención</h3>
                      <p className="text-gray-600">
                        Lunes a Domingo<br />
                        9:00 - 20:00 hrs
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Mapa Interactivo */}
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>¿Cómo Llegar?</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="aspect-video bg-gray-200 rounded-lg overflow-hidden mb-4 shadow-lg">
                    <iframe
                      src="https://www.google.com/maps/embed?pb=!1m17!1m12!1m3!1d3119.234!2d-72.12688614902275!3d-39.3225416452404!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m2!1m1!2zMznCsDE5JzIxLjEiUyA3MsKwMDcnMzYuOCJX!5e0!3m2!1ses!2scl!4v1234567890!5m2!1ses!2scl"
                      width="100%"
                      height="100%"
                      style={{ border: 0 }}
                      allowFullScreen
                      loading="lazy"
                      referrerPolicy="no-referrer-when-downgrade"
                      title="Ubicación Ruka Lefún - Villarrica"
                    />
                  </div>
                  <p className="text-sm text-gray-600 mb-3">
                    Rodeados por la naturaleza del sur de Chile, con fácil acceso desde Villarrica y ciudades cercanas.
                  </p>
                  <div className="flex flex-wrap gap-3">
                    <a
                      href="https://share.google/DiCu8Xxuq2Z2BPSdt"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 px-4 py-2 bg-nature-forest hover:bg-nature-moss text-white rounded-lg font-medium transition-colors shadow-md hover:shadow-lg"
                    >
                      <MapPin className="h-4 w-4" />
                      Abrir en Google Maps
                    </a>
                    <a
                      href="https://waze.com/ul?ll=-39.3225416452404,-72.12688614902275&navigate=yes"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg font-medium transition-colors shadow-md hover:shadow-lg"
                    >
                      <svg className="h-4 w-4" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M12 0C7.8 0 4.4 3.4 4.4 7.6c0 5.4 7.6 16.4 7.6 16.4s7.6-11 7.6-16.4C19.6 3.4 16.2 0 12 0zm0 10.3c-1.5 0-2.7-1.2-2.7-2.7S10.5 5 12 5s2.7 1.2 2.7 2.7-1.2 2.6-2.7 2.6z"/>
                      </svg>
                      Abrir en Waze
                    </a>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Nuestro Entorno Natural</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="aspect-video rounded-lg overflow-hidden shadow-lg">
                    <img
                      src="https://images.unsplash.com/photo-1441974231531-c6227db76b6e?q=80&w=1200"
                      alt="Naturaleza del sur de Chile"
                      className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
                    />
                  </div>
                  <p className="text-sm text-gray-600 mt-4">
                    Un espacio único rodeado de bosques nativos y la belleza natural de la Región de La Araucanía.
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}

