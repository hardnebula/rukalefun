"use client"

import { useState } from "react"
import { useQuery, useMutation } from "convex/react"
import { api } from "@/convex/_generated/api"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Star, Plus, Eye, EyeOff } from "lucide-react"
import { toast } from "sonner"
import { Toaster } from "@/components/ui/sonner"

export default function TestimoniosPage() {
  const testimonials = useQuery(api.testimonials.getAllTestimonials)
  const createTestimonial = useMutation(api.testimonials.createTestimonial)
  const updateVisibility = useMutation(api.testimonials.updateTestimonialVisibility)

  const [dialogOpen, setDialogOpen] = useState(false)
  const [formData, setFormData] = useState({
    clientName: "",
    eventType: "",
    rating: 5,
    comment: "",
    eventDate: "",
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    try {
      await createTestimonial({
        ...formData,
        isPublic: true,
      })
      toast.success("Testimonio agregado")
      setDialogOpen(false)
      setFormData({
        clientName: "",
        eventType: "",
        rating: 5,
        comment: "",
        eventDate: "",
      })
    } catch (error) {
      toast.error("Error al agregar testimonio")
    }
  }

  const toggleVisibility = async (id: string, currentStatus: boolean) => {
    try {
      await updateVisibility({ id: id as any, isPublic: !currentStatus })
      toast.success(
        currentStatus ? "Testimonio ocultado" : "Testimonio publicado"
      )
    } catch (error) {
      toast.error("Error al actualizar")
    }
  }

  return (
    <div className="p-8">
      <Toaster />
      
      {/* Header */}
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Testimonios</h1>
          <p className="text-gray-600">
            Gestiona las reseñas y testimonios de tus clientes
          </p>
        </div>
        <Button onClick={() => setDialogOpen(true)}>
          <Plus className="h-4 w-4 mr-2" />
          Nuevo Testimonio
        </Button>
      </div>

      {/* Lista de Testimonios */}
      {!testimonials ? (
        <Card>
          <CardContent className="p-8 text-center">
            <p className="text-gray-500">Cargando testimonios...</p>
          </CardContent>
        </Card>
      ) : testimonials.length > 0 ? (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {testimonials.map((testimonial) => (
            <Card key={testimonial._id}>
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div>
                    <CardTitle className="flex items-center space-x-2">
                      <span>{testimonial.clientName}</span>
                      {!testimonial.isPublic && (
                        <Badge variant="destructive">Oculto</Badge>
                      )}
                    </CardTitle>
                    <p className="text-sm text-gray-600 mt-1">
                      {testimonial.eventType}
                    </p>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Rating */}
                <div className="flex items-center space-x-1">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star
                      key={i}
                      className={`h-5 w-5 ${
                        i < testimonial.rating
                          ? "fill-amber-400 text-amber-400"
                          : "text-gray-300"
                      }`}
                    />
                  ))}
                </div>

                {/* Comentario */}
                <p className="text-gray-700 italic">&quot;{testimonial.comment}&quot;</p>

                {/* Fecha */}
                <p className="text-sm text-gray-500">
                  Evento:{" "}
                  {new Date(testimonial.eventDate).toLocaleDateString("es-CL")}
                </p>

                {/* Acciones */}
                <div className="flex gap-2 pt-2">
                  <Button
                    size="sm"
                    variant="outline"
                    className="flex-1"
                    onClick={() =>
                      toggleVisibility(testimonial._id, testimonial.isPublic)
                    }
                  >
                    {testimonial.isPublic ? (
                      <>
                        <EyeOff className="h-4 w-4 mr-1" />
                        Ocultar
                      </>
                    ) : (
                      <>
                        <Eye className="h-4 w-4 mr-1" />
                        Publicar
                      </>
                    )}
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <Card>
          <CardContent className="p-12 text-center">
            <h3 className="text-lg font-semibold mb-2">No hay testimonios</h3>
            <p className="text-gray-600 mb-4">
              Agrega testimonios de tus clientes satisfechos
            </p>
            <Button onClick={() => setDialogOpen(true)}>
              <Plus className="h-4 w-4 mr-2" />
              Agregar Primer Testimonio
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Dialog Crear */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Agregar Testimonio</DialogTitle>
          </DialogHeader>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Label htmlFor="clientName">Nombre del Cliente *</Label>
              <Input
                id="clientName"
                value={formData.clientName}
                onChange={(e) =>
                  setFormData({ ...formData, clientName: e.target.value })
                }
                required
              />
            </div>

            <div>
              <Label htmlFor="eventType">Tipo de Evento *</Label>
              <Input
                id="eventType"
                value={formData.eventType}
                onChange={(e) =>
                  setFormData({ ...formData, eventType: e.target.value })
                }
                required
                placeholder="Ej: Boda, Evento Corporativo"
              />
            </div>

            <div>
              <Label htmlFor="eventDate">Fecha del Evento *</Label>
              <Input
                id="eventDate"
                type="date"
                value={formData.eventDate}
                onChange={(e) =>
                  setFormData({ ...formData, eventDate: e.target.value })
                }
                required
              />
            </div>

            <div>
              <Label htmlFor="rating">Calificación *</Label>
              <div className="flex items-center space-x-2 mt-2">
                {Array.from({ length: 5 }).map((_, i) => (
                  <button
                    key={i}
                    type="button"
                    onClick={() => setFormData({ ...formData, rating: i + 1 })}
                  >
                    <Star
                      className={`h-8 w-8 cursor-pointer transition-colors ${
                        i < formData.rating
                          ? "fill-amber-400 text-amber-400"
                          : "text-gray-300 hover:text-amber-200"
                      }`}
                    />
                  </button>
                ))}
              </div>
            </div>

            <div>
              <Label htmlFor="comment">Comentario *</Label>
              <Textarea
                id="comment"
                value={formData.comment}
                onChange={(e) =>
                  setFormData({ ...formData, comment: e.target.value })
                }
                required
                rows={4}
                placeholder="Escribe el testimonio del cliente..."
              />
            </div>

            <div className="flex justify-end space-x-3 pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => {
                  setDialogOpen(false)
                  setFormData({
                    clientName: "",
                    eventType: "",
                    rating: 5,
                    comment: "",
                    eventDate: "",
                  })
                }}
              >
                Cancelar
              </Button>
              <Button type="submit">Agregar Testimonio</Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  )
}





