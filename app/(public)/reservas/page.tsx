"use client"

import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Calendar, Users, Clock, MapPin, ChevronDown, ChevronUp, FileText } from "lucide-react"
import { useQuery, useMutation } from "convex/react"
import { api } from "@/convex/_generated/api"
import { toast } from "sonner"
import { Toaster } from "@/components/ui/sonner"
import Breadcrumbs from "@/components/ui/Breadcrumbs"

export default function ReservasPage() {
  const createQuote = useMutation(api.quotes.createQuoteRequest)

  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isFormOpen, setIsFormOpen] = useState(true)

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    eventType: "",
    eventDate: "",
    numberOfGuests: "",
    message: "",
  })

  const eventTypes = [
    "Matrimonio",
    "Evento Corporativo",
    "Cumpleaños",
    "Aniversario",
    "Graduación",
    "Baby Shower",
    "Otro",
  ]


  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      await createQuote({
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        eventType: formData.eventType,
        eventDate: formData.eventDate || undefined,
        numberOfGuests: parseInt(formData.numberOfGuests) || 0,
        message: formData.message || undefined,
      })
      toast.success("Solicitud de cotización enviada con éxito. Nos contactaremos pronto.")

      // Reset form
      setFormData({
        name: "",
        email: "",
        phone: "",
        eventType: "",
        eventDate: "",
        numberOfGuests: "",
        message: "",
      })
      setIsFormOpen(false)
    } catch (error) {
      toast.error("Hubo un error al enviar tu solicitud. Intenta nuevamente.")
      console.error(error)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="min-h-screen pt-20">
      <Toaster />
      <div className="container mx-auto px-4">
        <Breadcrumbs items={[{ label: "Cotizaciones", href: "/reservas" }]} />
      </div>
      
      {/* Hero */}
      <section className="bg-gradient-to-br from-nature-forest via-nature-moss to-nature-emerald text-white py-16 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/5 to-transparent"></div>
        <div className="container mx-auto px-4 text-center relative z-10">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Solicita tu Cotización</h1>
          <p className="text-xl text-white/90 max-w-2xl mx-auto">
            Completa el formulario y nos contactaremos contigo con una cotización personalizada
          </p>
        </div>
      </section>

      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Sidebar Izquierda */}
          <div className="lg:col-span-1 space-y-6">
            {/* Proceso de Cotización */}
            <Card className="shadow-lg">
              <CardHeader className="bg-gradient-to-br from-nature-forest to-nature-moss text-white">
                <CardTitle className="flex items-center gap-2">
                  <FileText className="w-5 h-5" />
                  Proceso de Cotización
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-6 space-y-4">
                <div className="flex items-start space-x-3">
                  <div className="bg-nature-forest text-white w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 font-bold text-sm">
                    1
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900">Envía tu solicitud</h4>
                    <p className="text-sm text-gray-600">Completa el formulario con los detalles de tu evento</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="bg-nature-moss text-white w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 font-bold text-sm">
                    2
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900">Recibe tu cotización</h4>
                    <p className="text-sm text-gray-600">Te enviaremos una cotización personalizada en 24-48 horas</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="bg-nature-emerald text-white w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 font-bold text-sm">
                    3
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900">Visita el lugar</h4>
                    <p className="text-sm text-gray-600">Agenda una visita para conocer nuestras instalaciones</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="bg-nature-forest text-white w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 font-bold text-sm">
                    4
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900">Confirma tu evento</h4>
                    <p className="text-sm text-gray-600">Acepta la cotización, firma el contrato y reserva tu fecha</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Contacto Directo */}
            <Card className="shadow-lg">
              <CardHeader className="bg-gradient-to-br from-nature-emerald to-nature-moss text-white">
                <CardTitle>Contacto Directo</CardTitle>
              </CardHeader>
              <CardContent className="pt-6 space-y-4">
                <div className="flex items-center space-x-3 text-sm">
                  <MapPin className="h-5 w-5 text-nature-forest flex-shrink-0" />
                  <span className="text-gray-700">Villarrica, Chile</span>
                </div>
                <div className="flex items-center space-x-3 text-sm">
                  <Clock className="h-5 w-5 text-nature-forest flex-shrink-0" />
                  <span className="text-gray-700">Lun-Dom: 9:00 - 20:00</span>
                </div>
                <a href="https://wa.me/56983614062" target="_blank" rel="noopener noreferrer" className="block">
                  <Button className="w-full bg-green-600 hover:bg-green-700 text-white shadow-lg transition-all">
                    💬 Contactar por WhatsApp
                  </Button>
                </a>
              </CardContent>
            </Card>

            {/* Imagen del Lugar */}
            <Card className="overflow-hidden shadow-lg">
              <div className="h-64">
                <img 
                  src="https://images.unsplash.com/photo-1464366400600-7168b8af9bc3?q=80&w=800"
                  alt="Centro de eventos Ruka Lefún"
                  className="w-full h-full object-cover"
                />
              </div>
            </Card>
          </div>

          {/* Formulario Colapsable - Derecha */}
          <div className="lg:col-span-2">
            <Card className="shadow-xl">
              <CardHeader 
                className="cursor-pointer hover:bg-gray-50 transition-colors"
                onClick={() => setIsFormOpen(!isFormOpen)}
              >
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="flex items-center gap-2">
                      <FileText className="w-5 h-5 text-nature-forest" />
                      Formulario de Cotización
                    </CardTitle>
                    <CardDescription className="mt-2">
                      {isFormOpen 
                        ? "Completa los datos de tu evento para recibir una cotización personalizada"
                        : "Haz clic aquí para abrir el formulario y solicitar tu cotización"
                      }
                    </CardDescription>
                  </div>
                  <Button variant="ghost" size="sm" className="ml-4">
                    {isFormOpen ? (
                      <ChevronUp className="h-6 w-6 text-nature-forest" />
                    ) : (
                      <ChevronDown className="h-6 w-6 text-nature-forest" />
                    )}
                  </Button>
                </div>
              </CardHeader>

              {isFormOpen && (
                <CardContent className="pt-6 animate-in slide-in-from-top-4 duration-300">
                  <form onSubmit={handleSubmit} className="space-y-6">
                    {/* Información Personal */}
                    <div className="space-y-4">
                      <h3 className="font-semibold text-lg text-nature-forest border-b pb-2">
                        Información de Contacto
                      </h3>
                      
                      <div>
                        <Label htmlFor="name">Nombre Completo *</Label>
                        <Input
                          id="name"
                          value={formData.name}
                          onChange={(e) =>
                            setFormData({ ...formData, name: e.target.value })
                          }
                          required
                          className="mt-1"
                        />
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor="email">Email *</Label>
                          <Input
                            id="email"
                            type="email"
                            value={formData.email}
                            onChange={(e) =>
                              setFormData({ ...formData, email: e.target.value })
                            }
                            required
                            className="mt-1"
                          />
                        </div>
                        <div>
                          <Label htmlFor="phone">Teléfono *</Label>
                          <Input
                            id="phone"
                            type="tel"
                            value={formData.phone}
                            onChange={(e) =>
                              setFormData({ ...formData, phone: e.target.value })
                            }
                            required
                            className="mt-1"
                          />
                        </div>
                      </div>
                    </div>

                    {/* Detalles del Evento */}
                    <div className="space-y-4">
                      <h3 className="font-semibold text-lg text-nature-forest border-b pb-2">
                        Detalles del Evento
                      </h3>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor="eventType">Tipo de Evento *</Label>
                          <select
                            id="eventType"
                            value={formData.eventType}
                            onChange={(e) =>
                              setFormData({ ...formData, eventType: e.target.value })
                            }
                            required
                            className="mt-1 flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                          >
                            <option value="">Seleccionar...</option>
                            {eventTypes.map((type) => (
                              <option key={type} value={type}>
                                {type}
                              </option>
                            ))}
                          </select>
                        </div>

                        <div>
                          <Label htmlFor="numberOfGuests">Número de Invitados *</Label>
                          <Input
                            id="numberOfGuests"
                            type="number"
                            min="1"
                            value={formData.numberOfGuests}
                            onChange={(e) =>
                              setFormData({ ...formData, numberOfGuests: e.target.value })
                            }
                            required
                            className="mt-1"
                          />
                        </div>
                      </div>

                      <div>
                        <Label htmlFor="eventDate">Fecha Tentativa (Opcional)</Label>
                        <Input
                          id="eventDate"
                          type="date"
                          value={formData.eventDate}
                          onChange={(e) =>
                            setFormData({ ...formData, eventDate: e.target.value })
                          }
                          min={new Date().toISOString().split("T")[0]}
                          className="mt-1"
                        />
                      </div>
                    </div>

                    {/* Mensaje */}
                    <div>
                      <Label htmlFor="message">Mensaje o Solicitudes Especiales</Label>
                      <Textarea
                        id="message"
                        value={formData.message}
                        onChange={(e) =>
                          setFormData({ ...formData, message: e.target.value })
                        }
                        rows={4}
                        placeholder="Cuéntanos más sobre tu evento..."
                        className="mt-1"
                      />
                    </div>

                    <div className="pt-4 space-y-4">
                      <Button
                        type="submit"
                        size="lg"
                        className="w-full bg-gradient-nature hover:opacity-90 text-white shadow-lg transition-all disabled:opacity-50"
                        disabled={isSubmitting}
                      >
                        {isSubmitting ? "Enviando..." : "✉️ Solicitar Cotización"}
                      </Button>

                      <p className="text-sm text-gray-500 text-center">
                        * Campos obligatorios. Nos pondremos en contacto contigo dentro de 24-48 horas.
                      </p>
                    </div>
                  </form>
                </CardContent>
              )}

              {!isFormOpen && (
                <CardContent className="pt-0 pb-6">
                  <div className="text-center py-8">
                    <FileText className="w-16 h-16 mx-auto text-nature-moss mb-4 opacity-50" />
                    <p className="text-gray-600 mb-4">
                      Haz clic en el encabezado para abrir el formulario
                    </p>
                    <Button
                      onClick={() => setIsFormOpen(true)}
                      className="bg-gradient-nature hover:opacity-90 text-white"
                    >
                      Abrir Formulario
                    </Button>
                  </div>
                </CardContent>
              )}
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
