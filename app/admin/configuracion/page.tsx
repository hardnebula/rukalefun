"use client"

import { useState, useEffect } from "react"
import { useQuery, useMutation } from "convex/react"
import { api } from "@/convex/_generated/api"
import Link from "next/link"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"
import {
  Settings,
  MapPin,
  Users,
  DollarSign,
  Plus,
  Star,
  Eye,
  EyeOff,
  Calendar,
  Package,
  BookOpen,
  ClipboardList,
  FileText,
  CheckCircle,
  ShoppingCart,
  PartyPopper,
  CheckCheck,
  ArrowRight,
  Clock,
  MessageSquare,
  ListChecks,
  BarChart3,
  Heart,
  Save,
  Loader2,
} from "lucide-react"
import { toast } from "sonner"

type TabType = "dashboard" | "espacios" | "testimonios" | "invitaciones" | "guia"

export default function ConfiguracionPage() {
  const [activeTab, setActiveTab] = useState<TabType>("dashboard")

  useEffect(() => {
    const handleTabChange = (event: any) => {
      setActiveTab(event.detail as TabType)
    }

    window.addEventListener('changeTab', handleTabChange)
    return () => window.removeEventListener('changeTab', handleTabChange)
  }, [])

  return (
    <div className="p-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Configuración</h1>
        <p className="text-gray-600">
          Gestiona espacios, testimonios y configuración general del sistema
        </p>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 mb-6 border-b">
        <button
          onClick={() => setActiveTab("dashboard")}
          className={`px-4 py-2 font-medium transition-colors ${
            activeTab === "dashboard"
              ? "text-blue-600 border-b-2 border-blue-600"
              : "text-gray-600 hover:text-gray-900"
          }`}
        >
          <Settings className="inline-block w-4 h-4 mr-2" />
          Dashboard
        </button>
        <button
          onClick={() => setActiveTab("espacios")}
          className={`px-4 py-2 font-medium transition-colors ${
            activeTab === "espacios"
              ? "text-blue-600 border-b-2 border-blue-600"
              : "text-gray-600 hover:text-gray-900"
          }`}
        >
          <MapPin className="inline-block w-4 h-4 mr-2" />
          Espacios
        </button>
        <button
          onClick={() => setActiveTab("testimonios")}
          className={`px-4 py-2 font-medium transition-colors ${
            activeTab === "testimonios"
              ? "text-blue-600 border-b-2 border-blue-600"
              : "text-gray-600 hover:text-gray-900"
          }`}
        >
          <Star className="inline-block w-4 h-4 mr-2" />
          Testimonios
        </button>
        <button
          onClick={() => setActiveTab("invitaciones")}
          className={`px-4 py-2 font-medium transition-colors ${
            activeTab === "invitaciones"
              ? "text-blue-600 border-b-2 border-blue-600"
              : "text-gray-600 hover:text-gray-900"
          }`}
        >
          <Heart className="inline-block w-4 h-4 mr-2" />
          Invitaciones
        </button>
        <button
          onClick={() => setActiveTab("guia")}
          className={`px-4 py-2 font-medium transition-colors ${
            activeTab === "guia"
              ? "text-blue-600 border-b-2 border-blue-600"
              : "text-gray-600 hover:text-gray-900"
          }`}
        >
          <BookOpen className="inline-block w-4 h-4 mr-2" />
          Guía de Workflow
        </button>
      </div>

      {/* Tab Content */}
      {activeTab === "dashboard" && <DashboardTab />}
      {activeTab === "espacios" && <EspaciosTab />}
      {activeTab === "testimonios" && <TestimoniosTab />}
      {activeTab === "invitaciones" && <InvitacionesTab />}
      {activeTab === "guia" && <GuiaWorkflowTab />}
    </div>
  )
}

// ============== TAB DE DASHBOARD ==============

function DashboardTab() {
  const spaces = useQuery(api.spaces.getAllSpaces)
  const testimonials = useQuery(api.testimonials.getAllTestimonials)
  const bookings = useQuery(api.bookings.getAllBookings)
  const staff = useQuery(api.staff.getAllStaff)

  const stats = {
    espacios: spaces?.length || 0,
    espaciosActivos: spaces?.filter(s => s.isActive).length || 0,
    testimonios: testimonials?.length || 0,
    testimoniosPublicos: testimonials?.filter(t => t.isPublic).length || 0,
    reservasActivas: bookings?.filter(b => b.status === "confirmed").length || 0,
    personal: staff?.length || 0,
    personalActivo: staff?.filter(s => s.isActive).length || 0,
  }

  return (
    <div className="space-y-6">
      {/* Resumen General */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">Espacios</p>
                <p className="text-3xl font-bold text-gray-900">{stats.espacios}</p>
                <p className="text-xs text-gray-500 mt-1">
                  {stats.espaciosActivos} activos
                </p>
              </div>
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                <MapPin className="w-6 h-6 text-blue-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">Testimonios</p>
                <p className="text-3xl font-bold text-gray-900">{stats.testimonios}</p>
                <p className="text-xs text-gray-500 mt-1">
                  {stats.testimoniosPublicos} públicos
                </p>
              </div>
              <div className="w-12 h-12 bg-amber-100 rounded-full flex items-center justify-center">
                <Star className="w-6 h-6 text-amber-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">Personal</p>
                <p className="text-3xl font-bold text-gray-900">{stats.personal}</p>
                <p className="text-xs text-gray-500 mt-1">
                  {stats.personalActivo} activos
                </p>
              </div>
              <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                <Users className="w-6 h-6 text-green-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Información del Sistema */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Settings className="w-5 h-5" />
            Información del Sistema
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h4 className="font-semibold text-gray-900 mb-3">Gestión de Espacios</h4>
              <p className="text-sm text-gray-600 mb-2">
                Administra los espacios disponibles de tu centro de eventos. Define capacidad, 
                características y precios.
              </p>
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => {
                  const event = new CustomEvent('changeTab', { detail: 'espacios' })
                  window.dispatchEvent(event)
                }}
              >
                <MapPin className="w-4 h-4 mr-2" />
                Ir a Espacios
              </Button>
            </div>

            <div>
              <h4 className="font-semibold text-gray-900 mb-3">Gestión de Testimonios</h4>
              <p className="text-sm text-gray-600 mb-2">
                Gestiona las reseñas y testimonios de tus clientes. Publica u oculta 
                testimonios según sea necesario.
              </p>
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => {
                  const event = new CustomEvent('changeTab', { detail: 'testimonios' })
                  window.dispatchEvent(event)
                }}
              >
                <Star className="w-4 h-4 mr-2" />
                Ir a Testimonios
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Estadísticas Rápidas */}
      <Card>
        <CardHeader>
          <CardTitle>Estadísticas Rápidas</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-blue-50 p-4 rounded-lg">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-blue-900">Capacidad Total</span>
                <Users className="w-5 h-5 text-blue-600" />
              </div>
              <p className="text-2xl font-bold text-blue-900">
                {spaces?.reduce((sum, space) => sum + space.capacity, 0) || 0}
              </p>
              <p className="text-xs text-blue-700 mt-1">personas</p>
            </div>

            <div className="bg-green-50 p-4 rounded-lg">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-green-900">Área Total</span>
                <MapPin className="w-5 h-5 text-green-600" />
              </div>
              <p className="text-2xl font-bold text-green-900">
                {spaces?.reduce((sum, space) => sum + space.area, 0) || 0}
              </p>
              <p className="text-xs text-green-700 mt-1">m²</p>
            </div>

            <div className="bg-amber-50 p-4 rounded-lg">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-amber-900">Calificación Promedio</span>
                <Star className="w-5 h-5 text-amber-600" />
              </div>
              <p className="text-2xl font-bold text-amber-900">
                {testimonials && testimonials.length > 0
                  ? (testimonials.reduce((sum, t) => sum + t.rating, 0) / testimonials.length).toFixed(1)
                  : "0.0"}
              </p>
              <p className="text-xs text-amber-700 mt-1">de 5 estrellas</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Acceso Rápido */}
      <Card>
        <CardHeader>
          <CardTitle>Acceso Rápido</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <Button variant="outline" className="h-auto flex-col py-4" asChild>
              <a href="/admin/reservas">
                <DollarSign className="w-8 h-8 mb-2" />
                <span className="text-sm">Reservas</span>
              </a>
            </Button>
            <Button variant="outline" className="h-auto flex-col py-4" asChild>
              <a href="/admin/recursos">
                <Package className="w-8 h-8 mb-2" />
                <span className="text-sm">Personal</span>
              </a>
            </Button>
            <Button variant="outline" className="h-auto flex-col py-4" asChild>
              <a href="/admin/calendario">
                <Calendar className="w-8 h-8 mb-2" />
                <span className="text-sm">Calendario</span>
              </a>
            </Button>
            <Button variant="outline" className="h-auto flex-col py-4" asChild>
              <a href="/admin/galeria">
                <Eye className="w-8 h-8 mb-2" />
                <span className="text-sm">Galería</span>
              </a>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

// ============== TAB DE ESPACIOS ==============

function EspaciosTab() {
  const spaces = useQuery(api.spaces.getAllSpaces)
  const createSpace = useMutation(api.spaces.createSpace)
  const updateSpace = useMutation(api.spaces.updateSpace)

  const [dialogOpen, setDialogOpen] = useState(false)
  const [isEditing, setIsEditing] = useState(false)
  const [selectedSpace, setSelectedSpace] = useState<any>(null)

  const [formData, setFormData] = useState({
    name: "",
    description: "",
    capacity: 0,
    area: 0,
    features: "",
    pricePerHour: 0,
    isActive: true,
  })

  const resetForm = () => {
    setFormData({
      name: "",
      description: "",
      capacity: 0,
      area: 0,
      features: "",
      pricePerHour: 0,
      isActive: true,
    })
    setIsEditing(false)
    setSelectedSpace(null)
  }

  const handleCreate = () => {
    resetForm()
    setDialogOpen(true)
  }

  const handleEdit = (space: any) => {
    setSelectedSpace(space)
    setFormData({
      name: space.name,
      description: space.description,
      capacity: space.capacity,
      area: space.area,
      features: space.features.join(", "),
      pricePerHour: space.pricePerHour,
      isActive: space.isActive,
    })
    setIsEditing(true)
    setDialogOpen(true)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    try {
      const featuresArray = formData.features
        .split(",")
        .map((f) => f.trim())
        .filter((f) => f)

      if (isEditing && selectedSpace) {
        await updateSpace({
          id: selectedSpace._id,
          name: formData.name,
          description: formData.description,
          capacity: formData.capacity,
          area: formData.area,
          features: featuresArray,
          pricePerHour: formData.pricePerHour,
          isActive: formData.isActive,
        })
        toast.success("Espacio actualizado correctamente")
      } else {
        await createSpace({
          name: formData.name,
          description: formData.description,
          capacity: formData.capacity,
          area: formData.area,
          features: featuresArray,
          images: [],
          pricePerHour: formData.pricePerHour,
          isActive: formData.isActive,
        })
        toast.success("Espacio creado correctamente")
      }

      setDialogOpen(false)
      resetForm()
    } catch (error) {
      toast.error("Error al guardar el espacio")
      console.error(error)
    }
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <p className="text-sm text-gray-600">
          Total: {spaces?.length || 0} espacios
        </p>
        <Button onClick={handleCreate}>
          <Plus className="h-4 w-4 mr-2" />
          Nuevo Espacio
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {!spaces ? (
          <Card>
            <CardContent className="p-8 text-center">
              <p className="text-gray-500">Cargando espacios...</p>
            </CardContent>
          </Card>
        ) : spaces.length > 0 ? (
          spaces.map((space) => (
            <Card key={space._id} className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div>
                    <CardTitle className="flex items-center space-x-2">
                      <span>{space.name}</span>
                      {!space.isActive && <Badge variant="destructive">Inactivo</Badge>}
                    </CardTitle>
                    <p className="text-sm text-gray-600 mt-2">{space.description}</p>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="grid grid-cols-3 gap-4">
                    <div className="text-center">
                      <div className="flex items-center justify-center mb-1">
                        <Users className="h-5 w-5 text-blue-600" />
                      </div>
                      <div className="text-sm text-gray-500">Capacidad</div>
                      <div className="font-semibold">{space.capacity}</div>
                    </div>
                    <div className="text-center">
                      <div className="flex items-center justify-center mb-1">
                        <MapPin className="h-5 w-5 text-blue-600" />
                      </div>
                      <div className="text-sm text-gray-500">Área</div>
                      <div className="font-semibold">{space.area} m²</div>
                    </div>
                    <div className="text-center">
                      <div className="flex items-center justify-center mb-1">
                        <DollarSign className="h-5 w-5 text-blue-600" />
                      </div>
                      <div className="text-sm text-gray-500">Precio/Hora</div>
                      <div className="font-semibold">${space.pricePerHour.toLocaleString()}</div>
                    </div>
                  </div>

                  {space.features.length > 0 && (
                    <div>
                      <div className="text-sm font-medium mb-2">Características:</div>
                      <div className="flex flex-wrap gap-2">
                        {space.features.map((feature: string, i: number) => (
                          <Badge key={i} variant="outline">
                            {feature}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  )}

                  <Button
                    variant="outline"
                    className="w-full"
                    onClick={() => handleEdit(space)}
                  >
                    Editar Espacio
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))
        ) : (
          <Card className="lg:col-span-2">
            <CardContent className="p-12 text-center">
              <MapPin className="h-16 w-16 mx-auto mb-4 text-gray-300" />
              <h3 className="text-lg font-semibold mb-2">No hay espacios registrados</h3>
              <p className="text-gray-600 mb-4">
                Comienza creando tu primer espacio
              </p>
              <Button onClick={handleCreate}>
                <Plus className="h-4 w-4 mr-2" />
                Crear Primer Espacio
              </Button>
            </CardContent>
          </Card>
        )}
      </div>

      <Dialog open={dialogOpen} onOpenChange={(open) => {
        setDialogOpen(open)
        if (!open) resetForm()
      }}>
        <DialogContent 
          open={dialogOpen}
          onClose={() => {
            setDialogOpen(false)
            resetForm()
          }}
          className="max-w-2xl max-h-[80vh] overflow-y-auto"
        >
          <DialogHeader>
            <DialogTitle>
              {isEditing ? "Editar Espacio" : "Crear Nuevo Espacio"}
            </DialogTitle>
            <DialogDescription>
              {isEditing
                ? "Actualiza la información del espacio"
                : "Completa los datos del nuevo espacio"}
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Label htmlFor="name">Nombre del Espacio *</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                required
                placeholder="Ej: Salón Principal"
              />
            </div>

            <div>
              <Label htmlFor="description">Descripción *</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) =>
                  setFormData({ ...formData, description: e.target.value })
                }
                required
                rows={3}
                placeholder="Describe el espacio..."
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="capacity">Capacidad (personas) *</Label>
                <Input
                  id="capacity"
                  type="number"
                  min="1"
                  value={formData.capacity}
                  onChange={(e) =>
                    setFormData({ ...formData, capacity: parseInt(e.target.value) || 0 })
                  }
                  required
                />
              </div>
              <div>
                <Label htmlFor="area">Área (m²) *</Label>
                <Input
                  id="area"
                  type="number"
                  min="1"
                  value={formData.area}
                  onChange={(e) =>
                    setFormData({ ...formData, area: parseInt(e.target.value) || 0 })
                  }
                  required
                />
              </div>
            </div>

            <div>
              <Label htmlFor="pricePerHour">Precio por Hora ($) *</Label>
              <Input
                id="pricePerHour"
                type="number"
                min="0"
                value={formData.pricePerHour}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    pricePerHour: parseInt(e.target.value) || 0,
                  })
                }
                required
              />
            </div>

            <div>
              <Label htmlFor="features">Características (separadas por comas)</Label>
              <Textarea
                id="features"
                value={formData.features}
                onChange={(e) => setFormData({ ...formData, features: e.target.value })}
                rows={3}
                placeholder="Ej: WiFi, Aire Acondicionado, Proyector, Cocina"
              />
              <p className="text-xs text-gray-500 mt-1">
                Separa cada característica con una coma
              </p>
            </div>

            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                id="isActive"
                checked={formData.isActive}
                onChange={(e) =>
                  setFormData({ ...formData, isActive: e.target.checked })
                }
                className="rounded border-gray-300"
              />
              <Label htmlFor="isActive" className="cursor-pointer">
                Espacio activo y visible para clientes
              </Label>
            </div>

            <div className="flex justify-end space-x-3 pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => {
                  setDialogOpen(false)
                  resetForm()
                }}
              >
                Cancelar
              </Button>
              <Button type="submit">
                {isEditing ? "Actualizar" : "Crear"} Espacio
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  )
}

// ============== TAB DE TESTIMONIOS ==============

function TestimoniosTab() {
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
    <div>
      <div className="flex justify-between items-center mb-6">
        <p className="text-sm text-gray-600">
          Total: {testimonials?.length || 0} testimonios
        </p>
        <Button onClick={() => setDialogOpen(true)}>
          <Plus className="h-4 w-4 mr-2" />
          Nuevo Testimonio
        </Button>
      </div>

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

                <p className="text-gray-700 italic">&ldquo;{testimonial.comment}&rdquo;</p>

                <p className="text-sm text-gray-500">
                  Evento:{" "}
                  {new Date(testimonial.eventDate).toLocaleDateString("es-CL")}
                </p>

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
            <Star className="h-16 w-16 mx-auto mb-4 text-gray-300" />
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

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent
          open={dialogOpen}
          onClose={() => setDialogOpen(false)}
        >
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

// ============== TAB DE INVITACIONES ==============

function InvitacionesTab() {
  const price = useQuery(api.invitationSettings.getPrice);
  const setPrice = useMutation(api.invitationSettings.setPrice);

  const [priceInput, setPriceInput] = useState<string>("");
  const [isSaving, setIsSaving] = useState(false);

  // Initialize price input when data loads
  useEffect(() => {
    if (price !== undefined && priceInput === "") {
      setPriceInput(price.toString());
    }
  }, [price, priceInput]);

  const handleSavePrice = async () => {
    const newPrice = parseInt(priceInput);
    if (isNaN(newPrice) || newPrice < 0) {
      toast.error("Ingresa un precio valido");
      return;
    }

    setIsSaving(true);
    try {
      await setPrice({ price: newPrice });
      toast.success("Precio actualizado correctamente");
    } catch (error) {
      toast.error("Error al guardar el precio");
      console.error(error);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Info Card */}
      <Card className="border-pink-200 bg-pink-50">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-pink-800">
            <Heart className="w-5 h-5" />
            Invitaciones Digitales de Boda
          </CardTitle>
        </CardHeader>
        <CardContent className="text-pink-700">
          <p className="text-sm">
            Las invitaciones digitales son un servicio SaaS self-service. Los clientes pueden
            crear sus invitaciones desde la pagina publica{" "}
            <a href="/invitaciones" className="underline font-medium" target="_blank">
              /invitaciones
            </a>
            .
          </p>
          <ul className="mt-3 space-y-1 text-sm">
            <li>• <strong>Clientes con reserva confirmada:</strong> Acceso gratis automatico</li>
            <li>• <strong>Clientes sin reserva:</strong> Deben pagar el precio configurado</li>
          </ul>
        </CardContent>
      </Card>

      {/* Price Configuration */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <DollarSign className="w-5 h-5 text-green-600" />
            Configuracion de Precio
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="price">Precio de Invitacion Digital (CLP)</Label>
            <div className="flex items-center gap-3 mt-2">
              <div className="relative flex-1 max-w-xs">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">$</span>
                <Input
                  id="price"
                  type="number"
                  min="0"
                  value={priceInput}
                  onChange={(e) => setPriceInput(e.target.value)}
                  className="pl-8"
                  placeholder="15000"
                />
              </div>
              <Button
                onClick={handleSavePrice}
                disabled={isSaving}
                className="bg-nature-forest hover:bg-nature-forest-dark"
              >
                {isSaving ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Guardando...
                  </>
                ) : (
                  <>
                    <Save className="w-4 h-4 mr-2" />
                    Guardar
                  </>
                )}
              </Button>
            </div>
            <p className="text-xs text-gray-500 mt-2">
              Este es el precio que pagaran los clientes que no tengan reserva confirmada.
              El precio actual es: <strong>${price?.toLocaleString("es-CL") || "15.000"} CLP</strong>
            </p>
          </div>

          <div className="bg-gray-50 rounded-lg p-4">
            <h4 className="font-medium text-gray-900 mb-2">Nota sobre pagos</h4>
            <p className="text-sm text-gray-600">
              Actualmente los pagos se coordinan manualmente por WhatsApp. Una vez recibido
              el pago, puedes marcar la invitacion como &quot;Pagada&quot; desde la seccion de
              administracion de invitaciones.
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Quick Links */}
      <Card>
        <CardHeader>
          <CardTitle>Accesos Rapidos</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Button variant="outline" className="h-auto flex-col py-4" asChild>
              <a href="/admin/invitaciones">
                <Heart className="w-8 h-8 mb-2 text-pink-500" />
                <span className="text-sm">Gestionar Invitaciones</span>
              </a>
            </Button>
            <Button variant="outline" className="h-auto flex-col py-4" asChild>
              <a href="/invitaciones" target="_blank">
                <Eye className="w-8 h-8 mb-2 text-blue-500" />
                <span className="text-sm">Ver Pagina Publica</span>
              </a>
            </Button>
            <Button variant="outline" className="h-auto flex-col py-4" asChild>
              <a href="/invitaciones/crear" target="_blank">
                <Plus className="w-8 h-8 mb-2 text-green-500" />
                <span className="text-sm">Probar Creacion</span>
              </a>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

// ============== TAB DE GUÍA DE WORKFLOW ==============

function GuiaWorkflowTab() {
  const workflowSteps = [
    {
      number: 1,
      title: "Captación del Cliente",
      icon: ClipboardList,
      description: "El cliente completa el formulario de solicitud de cotización en la web",
      actions: [
        "Sistema guarda solicitud con estado 'new'",
        "Dashboard muestra alerta de nueva cotización",
        "Información capturada: tipo de evento, fecha, invitados, servicios deseados"
      ],
      location: "/admin/cotizaciones",
      color: "bg-blue-50 border-blue-200 text-blue-900"
    },
    {
      number: 2,
      title: "Generación de Cotización",
      icon: FileText,
      description: "Admin responde la solicitud y genera cotización profesional",
      actions: [
        "Marcar solicitud como 'contactado'",
        "Seleccionar plantilla según tipo de evento",
        "Personalizar servicios, menú y precios",
        "Sistema genera cotización automáticamente",
        "Estado: 'pending' (esperando respuesta del cliente)"
      ],
      location: "/admin/cotizaciones",
      color: "bg-purple-50 border-purple-200 text-purple-900"
    },
    {
      number: 3,
      title: "Conversión a Reserva",
      icon: CheckCircle,
      description: "Cliente acepta → Admin convierte cotización a reserva confirmada",
      actions: [
        "Click en 'Convertir a Reserva'",
        "Sistema transfiere automáticamente: menú, cliente, servicios",
        "Estado inicial: 'pending' (requiere confirmación final)",
        "Vinculación automática: cotización ↔ reserva"
      ],
      location: "/admin/reservas",
      color: "bg-green-50 border-green-200 text-green-900"
    },
    {
      number: 4,
      title: "Confirmación y Configuración",
      icon: Settings,
      description: "Admin confirma la reserva y configura información de pago",
      actions: [
        "Verificar disponibilidad de fecha/espacio",
        "Registrar monto total del evento",
        "Registrar anticipo recibido",
        "Sistema calcula saldo pendiente automáticamente",
        "Cambiar estado a 'confirmed'",
        "Reserva aparece en calendario (color verde)"
      ],
      location: "/admin/reservas",
      color: "bg-emerald-50 border-emerald-200 text-emerald-900"
    },
    {
      number: 5,
      title: "Reuniones de Planificación",
      icon: Calendar,
      description: "Programar y documentar reuniones con el cliente",
      actions: [
        "Crear reunión vinculada a la reserva",
        "Tipos: 'Consulta Inicial' o 'Planificación del Evento'",
        "Definir fecha, hora, ubicación y agenda",
        "Después de reunión: registrar MINUTA",
        "Minuta incluye: temas tratados, acuerdos, próximos pasos",
        "Aparece en calendario con 📝 si tiene minuta"
      ],
      location: "/admin/reuniones",
      color: "bg-indigo-50 border-indigo-200 text-indigo-900"
    },
    {
      number: 6,
      title: "Configuración Detallada",
      icon: ListChecks,
      description: "Configurar menú, cronograma y detalles específicos del evento",
      actions: [
        "Tab 'Menú': Editar/refinar platos por secciones",
        "Tab 'Cronograma': Programar actividades con horarios",
        "Ejemplos: Recepción 18:00, Ceremonia 19:00, Cena 20:00",
        "Actualizar servicios contratados si hay cambios",
        "Registrar notas y solicitudes especiales"
      ],
      location: "/admin/reservas",
      color: "bg-amber-50 border-amber-200 text-amber-900"
    },
    {
      number: 7,
      title: "Lista de Compras",
      icon: ShoppingCart,
      description: "Generar lista de compras con análisis automático de IA",
      actions: [
        "Crear lista desde la reserva",
        "Sistema analiza menú: ingredientes y cantidades",
        "IA audita: 🟢 OK / 🟡 Mejoras / 🔴 Problemas",
        "Registrar proveedores y costos",
        "Estados: draft → pending → sent → completed"
      ],
      location: "/admin/listas-compras",
      color: "bg-orange-50 border-orange-200 text-orange-900"
    },
    {
      number: 8,
      title: "Asignación de Personal",
      icon: Users,
      description: "Asignar personal necesario para el evento",
      actions: [
        "Asignar: garzones, cocineros, DJ, decorador, etc.",
        "Definir horarios de trabajo (inicio - fin)",
        "Registrar montos a pagar",
        "Personal confirma asistencia",
        "Sistema calcula total de pagos automáticamente"
      ],
      location: "/admin/recursos",
      color: "bg-pink-50 border-pink-200 text-pink-900"
    },
    {
      number: 9,
      title: "Ejecución del Evento",
      icon: PartyPopper,
      description: "Día del evento - Admin tiene acceso a toda la información",
      actions: [
        "Revisar cronograma completo",
        "Verificar personal asignado y presente",
        "Confirmar lista de compras verificada",
        "Actualizar notas en tiempo real si hay cambios",
        "Supervisar ejecución según plan"
      ],
      location: "/admin/calendario",
      color: "bg-rose-50 border-rose-200 text-rose-900"
    },
    {
      number: 10,
      title: "Post-Evento y Cierre",
      icon: CheckCheck,
      description: "Finalizar el evento y cerrar todos los pendientes",
      actions: [
        "Marcar reserva como 'completed'",
        "Registrar RESUMEN del evento (tab Resumen del Evento)",
        "Documentar: éxitos, observaciones, mejoras, feedback",
        "Confirmar pagos a personal (pending → paid)",
        "Registrar método y fecha de pago",
        "Cerrar lista de compras con costos reales",
        "Solicitar testimonios del cliente (opcional)",
        "Evento guardado en Historial con resumen completo ✓"
      ],
      location: "/admin/reservas → /admin/historial",
      color: "bg-teal-50 border-teal-200 text-teal-900"
    }
  ]

  const estadosReserva = [
    { estado: "pending", color: "bg-yellow-100 text-yellow-800", descripcion: "Requiere confirmación" },
    { estado: "confirmed", color: "bg-green-100 text-green-800", descripcion: "Confirmada y planificando" },
    { estado: "completed", color: "bg-blue-100 text-blue-800", descripcion: "Evento completado" }
  ]

  const estadosCotizacion = [
    { estado: "new", color: "bg-blue-100 text-blue-800", descripcion: "Recién recibida" },
    { estado: "contacted", color: "bg-purple-100 text-purple-800", descripcion: "Cliente contactado" },
    { estado: "quoted", color: "bg-indigo-100 text-indigo-800", descripcion: "Cotización enviada" },
    { estado: "converted", color: "bg-green-100 text-green-800", descripcion: "Convertida a reserva" },
    { estado: "declined", color: "bg-red-100 text-red-800", descripcion: "Cliente rechazó" }
  ]

  return (
    <div className="space-y-6">
      {/* Resumen Visual */}
      <Card className="border-2 border-nature-forest">
        <CardHeader className="bg-nature-forest text-white">
          <CardTitle className="flex items-center gap-2">
            <BarChart3 className="w-6 h-6" />
            Resumen del Flujo
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          <div className="flex flex-wrap items-center justify-center gap-2 text-sm">
            <Badge variant="outline" className="px-3 py-1">📋 Solicitud</Badge>
            <ArrowRight className="w-4 h-4 text-gray-400" />
            <Badge variant="outline" className="px-3 py-1">💼 Cotización</Badge>
            <ArrowRight className="w-4 h-4 text-gray-400" />
            <Badge variant="outline" className="px-3 py-1">✅ Reserva</Badge>
            <ArrowRight className="w-4 h-4 text-gray-400" />
            <Badge variant="outline" className="px-3 py-1">🎯 Confirmación</Badge>
            <ArrowRight className="w-4 h-4 text-gray-400" />
            <Badge variant="outline" className="px-3 py-1">📅 Reuniones</Badge>
            <ArrowRight className="w-4 h-4 text-gray-400" />
            <Badge variant="outline" className="px-3 py-1">🔧 Configuración</Badge>
            <ArrowRight className="w-4 h-4 text-gray-400" />
            <Badge variant="outline" className="px-3 py-1">📦 Lista Compras</Badge>
            <ArrowRight className="w-4 h-4 text-gray-400" />
            <Badge variant="outline" className="px-3 py-1">👥 Personal</Badge>
            <ArrowRight className="w-4 h-4 text-gray-400" />
            <Badge variant="outline" className="px-3 py-1">🎉 Evento</Badge>
            <ArrowRight className="w-4 h-4 text-gray-400" />
            <Badge variant="outline" className="px-3 py-1">✔️ Cierre</Badge>
          </div>
        </CardContent>
      </Card>

      {/* Estados del Sistema */}
      <div className="grid md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <Clock className="w-5 h-5 text-nature-forest" />
              Estados de Reserva
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            {estadosReserva.map((item) => (
              <div key={item.estado} className="flex items-center justify-between p-2 border rounded">
                <Badge className={item.color}>{item.estado}</Badge>
                <span className="text-sm text-gray-600">{item.descripcion}</span>
              </div>
            ))}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <DollarSign className="w-5 h-5 text-nature-forest" />
              Estados de Cotización
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            {estadosCotizacion.map((item) => (
              <div key={item.estado} className="flex items-center justify-between p-2 border rounded">
                <Badge className={item.color}>{item.estado}</Badge>
                <span className="text-sm text-gray-600">{item.descripcion}</span>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      {/* Pasos del Workflow */}
      <div className="space-y-6">
        <h3 className="text-xl font-bold text-gray-900">Pasos Detallados</h3>

        {workflowSteps.map((step) => {
          const Icon = step.icon
          return (
            <Card key={step.number} className={`border-2 ${step.color.replace('bg-', 'border-').replace('-50', '-200')}`}>
              <CardHeader className={step.color}>
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center font-bold text-lg">
                      {step.number}
                    </div>
                    <div>
                      <CardTitle className="flex items-center gap-2">
                        <Icon className="w-5 h-5" />
                        {step.title}
                      </CardTitle>
                      <p className="text-sm mt-1 opacity-90">{step.description}</p>
                    </div>
                  </div>
                  <Badge variant="outline" className="bg-white">
                    {step.location}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="pt-4">
                <ul className="space-y-2">
                  {step.actions.map((action, idx) => (
                    <li key={idx} className="flex items-start gap-2">
                      <CheckCircle className="w-4 h-4 text-nature-forest mt-0.5 flex-shrink-0" />
                      <span className="text-sm text-gray-700">{action}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          )
        })}
      </div>

      {/* Información Adicional */}
      <Card className="bg-gray-50">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MessageSquare className="w-5 h-5 text-nature-forest" />
            Puntos Clave del Sistema
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="p-3 bg-white rounded border">
            <h4 className="font-semibold text-sm mb-1">🔗 Vinculación Automática</h4>
            <p className="text-sm text-gray-600">Las cotizaciones, reservas y reuniones se vinculan automáticamente. El menú y los datos del cliente se transfieren sin necesidad de re-ingresarlos.</p>
          </div>

          <div className="p-3 bg-white rounded border">
            <h4 className="font-semibold text-sm mb-1">🤖 Inteligencia Artificial</h4>
            <p className="text-sm text-gray-600">El sistema usa IA para analizar listas de compras, generar sugerencias y auditar la operacionalidad de los eventos.</p>
          </div>

          <div className="p-3 bg-white rounded border">
            <h4 className="font-semibold text-sm mb-1">💰 Cálculos Automáticos</h4>
            <p className="text-sm text-gray-600">Saldos pendientes, totales de pagos a personal y costos de compras se calculan automáticamente en tiempo real.</p>
          </div>

          <div className="p-3 bg-white rounded border">
            <h4 className="font-semibold text-sm mb-1">📅 Calendario Centralizado</h4>
            <p className="text-sm text-gray-600">Todas las reservas y reuniones aparecen en un calendario único con códigos de color según estado y tipo.</p>
          </div>

          <div className="p-3 bg-white rounded border">
            <h4 className="font-semibold text-sm mb-1">📝 Minutas de Reunión</h4>
            <p className="text-sm text-gray-600">Cada reunión puede documentarse con minutas detalladas: temas tratados, acuerdos alcanzados y próximos pasos.</p>
          </div>

          <div className="p-3 bg-white rounded border">
            <h4 className="font-semibold text-sm mb-1">📄 Historial de Eventos</h4>
            <p className="text-sm text-gray-600">Todos los eventos completados se guardan con resúmenes detallados: qué funcionó bien, qué mejorar, feedback del cliente y observaciones del equipo para referencia futura.</p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
