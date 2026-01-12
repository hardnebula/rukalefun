"use client"

import { useState } from "react"
import { useQuery, useMutation } from "convex/react"
import { api } from "@/convex/_generated/api"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import {
  Calendar,
  Clock,
  Users,
  MapPin,
  Mail,
  Phone,
  DollarSign,
  FileText,
  Search,
  Filter,
  CheckCircle,
  TrendingUp,
  Package,
  Edit,
  Save
} from "lucide-react"
import { toast } from "sonner"

export default function HistorialPage() {
  const allBookings = useQuery(api.bookings.getAllBookings)
  const updateEventSummary = useMutation(api.bookings.updateEventSummary)

  const [selectedEvent, setSelectedEvent] = useState<any>(null)
  const [dialogOpen, setDialogOpen] = useState(false)
  const [searchTerm, setSearchTerm] = useState("")
  const [filterYear, setFilterYear] = useState("all")

  // Estado para edición del resumen
  const [editingSummary, setEditingSummary] = useState(false)
  const [summaryText, setSummaryText] = useState("")
  const [savingSummary, setSavingSummary] = useState(false)

  // Filtrar solo eventos completados
  const completedEvents = allBookings?.filter(booking => booking.status === "completed")

  // Obtener años únicos de eventos completados
  const availableYears = Array.from(
    new Set(
      completedEvents?.map(event => new Date(event.eventDate).getFullYear()) || []
    )
  ).sort((a, b) => b - a)

  // Aplicar filtros
  const filteredEvents = completedEvents?.filter(event => {
    const matchesSearch =
      event.clientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      event.eventType.toLowerCase().includes(searchTerm.toLowerCase())

    const matchesYear =
      filterYear === "all" ||
      new Date(event.eventDate).getFullYear().toString() === filterYear

    return matchesSearch && matchesYear
  })

  // Estadísticas
  const stats = {
    total: completedEvents?.length || 0,
    conResumen: completedEvents?.filter(e => e.eventSummary).length || 0,
    sinResumen: completedEvents?.filter(e => !e.eventSummary).length || 0,
    ingresosTotal: completedEvents?.reduce((sum, e) => sum + e.totalAmount, 0) || 0,
  }

  const handleViewDetails = (event: any) => {
    setSelectedEvent(event)
    setSummaryText(event.eventSummary || "")
    setEditingSummary(false)
    setDialogOpen(true)
  }

  const handleSaveSummary = async () => {
    if (!selectedEvent) return

    setSavingSummary(true)
    try {
      await updateEventSummary({
        id: selectedEvent._id,
        eventSummary: summaryText,
      })
      toast.success("Resumen guardado exitosamente")
      setEditingSummary(false)
      setSelectedEvent({ ...selectedEvent, eventSummary: summaryText })
    } catch (error) {
      console.error("Error al guardar resumen:", error)
      toast.error("Error al guardar el resumen")
    } finally {
      setSavingSummary(false)
    }
  }

  return (
    <div className="p-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Historial de Eventos</h1>
        <p className="text-gray-600">Eventos completados y sus resúmenes</p>
      </div>

      {/* Estadísticas */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">Total Eventos</p>
                <p className="text-3xl font-bold text-gray-900">{stats.total}</p>
              </div>
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                <CheckCircle className="w-6 h-6 text-blue-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">Con Resumen</p>
                <p className="text-3xl font-bold text-green-900">{stats.conResumen}</p>
                <p className="text-xs text-gray-500 mt-1">
                  {stats.total > 0 ? Math.round((stats.conResumen / stats.total) * 100) : 0}% del total
                </p>
              </div>
              <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                <FileText className="w-6 h-6 text-green-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">Sin Resumen</p>
                <p className="text-3xl font-bold text-amber-900">{stats.sinResumen}</p>
                <p className="text-xs text-gray-500 mt-1">Pendientes</p>
              </div>
              <div className="w-12 h-12 bg-amber-100 rounded-full flex items-center justify-center">
                <Package className="w-6 h-6 text-amber-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">Ingresos Totales</p>
                <p className="text-2xl font-bold text-gray-900">
                  ${stats.ingresosTotal.toLocaleString()}
                </p>
              </div>
              <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center">
                <TrendingUp className="w-6 h-6 text-purple-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filtros */}
      <Card className="mb-6">
        <CardContent className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label className="text-sm font-medium mb-2 flex items-center gap-2">
                <Search className="w-4 h-4" />
                Buscar
              </Label>
              <Input
                placeholder="Buscar por cliente o tipo de evento..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <div>
              <Label className="text-sm font-medium mb-2 flex items-center gap-2">
                <Filter className="w-4 h-4" />
                Filtrar por Año
              </Label>
              <select
                value={filterYear}
                onChange={(e) => setFilterYear(e.target.value)}
                className="w-full p-2 border rounded-md"
              >
                <option value="all">Todos los años</option>
                {availableYears.map(year => (
                  <option key={year} value={year.toString()}>{year}</option>
                ))}
              </select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Lista de Eventos */}
      <div className="space-y-4">
        {!filteredEvents ? (
          <Card>
            <CardContent className="p-8 text-center">
              <p className="text-gray-500">Cargando eventos...</p>
            </CardContent>
          </Card>
        ) : filteredEvents.length > 0 ? (
          filteredEvents.map((event) => (
            <Card
              key={event._id}
              className="hover:shadow-lg transition-shadow cursor-pointer"
              onClick={() => handleViewDetails(event)}
            >
              <CardContent className="p-6">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-3">
                      <h3 className="text-xl font-semibold text-gray-900">
                        {event.clientName}
                      </h3>
                      <Badge className="bg-blue-100 text-blue-800">
                        Completado
                      </Badge>
                      {event.eventSummary ? (
                        <Badge variant="outline" className="bg-green-50 text-green-700 border-green-300">
                          ✓ Con resumen
                        </Badge>
                      ) : (
                        <Badge variant="outline" className="bg-amber-50 text-amber-700 border-amber-300">
                          ⚠ Sin resumen
                        </Badge>
                      )}
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-sm mb-3">
                      <div className="flex items-center text-gray-600">
                        <Calendar className="h-4 w-4 mr-2" />
                        <span>
                          {new Date(event.eventDate).toLocaleDateString("es-CL", {
                            weekday: "long",
                            year: "numeric",
                            month: "long",
                            day: "numeric",
                          })}
                        </span>
                      </div>
                      <div className="flex items-center text-gray-600">
                        <Clock className="h-4 w-4 mr-2" />
                        <span>{event.startTime} - {event.endTime}</span>
                      </div>
                      <div className="flex items-center text-gray-600">
                        <Users className="h-4 w-4 mr-2" />
                        <span>{event.eventType} - {event.numberOfGuests} invitados</span>
                      </div>
                    </div>

                    <div className="flex items-center gap-4 text-sm">
                      <div className="flex items-center text-gray-600">
                        <DollarSign className="h-4 w-4 mr-1" />
                        <span>Total: ${event.totalAmount.toLocaleString()}</span>
                      </div>
                      {event.eventSummary && (
                        <div className="flex items-center text-green-700">
                          <FileText className="h-4 w-4 mr-1" />
                          <span>Ver resumen completo</span>
                        </div>
                      )}
                    </div>
                  </div>

                  <Button
                    variant="outline"
                    size="sm"
                    onClick={(e) => {
                      e.stopPropagation()
                      handleViewDetails(event)
                    }}
                  >
                    Ver Detalles
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))
        ) : (
          <Card>
            <CardContent className="p-12 text-center">
              <FileText className="h-16 w-16 mx-auto mb-4 text-gray-300" />
              <h3 className="text-lg font-semibold mb-2">No hay eventos completados</h3>
              <p className="text-gray-600">
                {searchTerm || filterYear !== "all"
                  ? "No se encontraron eventos con los filtros aplicados"
                  : "Los eventos completados aparecerán aquí"}
              </p>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Dialog de Detalles */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-2xl">Detalles del Evento Completado</DialogTitle>
          </DialogHeader>

          {selectedEvent && (
            <div className="space-y-6">
              {/* Información del Cliente */}
              <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                <h4 className="font-semibold text-blue-900 mb-3">Información del Cliente</h4>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <p className="text-xs text-blue-700 mb-1">Nombre</p>
                    <p className="font-medium text-blue-900">{selectedEvent.clientName}</p>
                  </div>
                  <div>
                    <p className="text-xs text-blue-700 mb-1">Email</p>
                    <p className="font-medium text-blue-900">{selectedEvent.clientEmail}</p>
                  </div>
                  <div>
                    <p className="text-xs text-blue-700 mb-1">Teléfono</p>
                    <p className="font-medium text-blue-900">{selectedEvent.clientPhone}</p>
                  </div>
                  <div>
                    <p className="text-xs text-blue-700 mb-1">Tipo de Evento</p>
                    <p className="font-medium text-blue-900">{selectedEvent.eventType}</p>
                  </div>
                </div>
              </div>

              {/* Detalles del Evento */}
              <div className="grid grid-cols-2 gap-4">
                <div className="p-4 bg-gray-50 rounded-lg border">
                  <div className="flex items-center gap-2 mb-2">
                    <Calendar className="w-4 h-4 text-gray-600" />
                    <p className="text-xs text-gray-600">Fecha</p>
                  </div>
                  <p className="font-semibold">
                    {new Date(selectedEvent.eventDate).toLocaleDateString("es-CL", {
                      weekday: "long",
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })}
                  </p>
                </div>
                <div className="p-4 bg-gray-50 rounded-lg border">
                  <div className="flex items-center gap-2 mb-2">
                    <Clock className="w-4 h-4 text-gray-600" />
                    <p className="text-xs text-gray-600">Horario</p>
                  </div>
                  <p className="font-semibold">
                    {selectedEvent.startTime} - {selectedEvent.endTime}
                  </p>
                </div>
                <div className="p-4 bg-gray-50 rounded-lg border">
                  <div className="flex items-center gap-2 mb-2">
                    <Users className="w-4 h-4 text-gray-600" />
                    <p className="text-xs text-gray-600">Invitados</p>
                  </div>
                  <p className="font-semibold">{selectedEvent.numberOfGuests} personas</p>
                </div>
                <div className="p-4 bg-gray-50 rounded-lg border">
                  <div className="flex items-center gap-2 mb-2">
                    <DollarSign className="w-4 h-4 text-gray-600" />
                    <p className="text-xs text-gray-600">Total</p>
                  </div>
                  <p className="font-semibold">${selectedEvent.totalAmount.toLocaleString()}</p>
                </div>
              </div>

              {/* Servicios Contratados */}
              {selectedEvent.services && selectedEvent.services.length > 0 && (
                <div>
                  <h4 className="font-semibold mb-3">Servicios Contratados</h4>
                  <div className="flex flex-wrap gap-2">
                    {selectedEvent.services.map((service: string, idx: number) => (
                      <Badge key={idx} variant="outline">
                        {service}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}

              {/* Notas y Solicitudes Especiales */}
              {(selectedEvent.notes || selectedEvent.specialRequests) && (
                <div className="space-y-3">
                  {selectedEvent.specialRequests && (
                    <div className="p-4 bg-amber-50 rounded-lg border border-amber-200">
                      <h4 className="font-semibold text-amber-900 mb-2">Solicitudes Especiales</h4>
                      <p className="text-sm text-amber-800 whitespace-pre-wrap">
                        {selectedEvent.specialRequests}
                      </p>
                    </div>
                  )}
                  {selectedEvent.notes && (
                    <div className="p-4 bg-gray-50 rounded-lg border">
                      <h4 className="font-semibold text-gray-900 mb-2">Notas</h4>
                      <p className="text-sm text-gray-700 whitespace-pre-wrap">
                        {selectedEvent.notes}
                      </p>
                    </div>
                  )}
                </div>
              )}

              {/* Resumen del Evento */}
              <div className="border-t pt-6">
                <div className="bg-blue-50 p-4 rounded-lg mb-4">
                  <p className="text-sm text-blue-800">
                    <strong>Historial del Evento:</strong> Documenta aquí lo que sucedió en el evento: éxitos, observaciones,
                    imprevistos, sugerencias de mejora para futuros eventos similares.
                  </p>
                </div>

                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <FileText className="w-5 h-5 text-blue-600" />
                      <h4 className="font-semibold text-lg">Resumen del Evento</h4>
                    </div>
                    {!editingSummary ? (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setEditingSummary(true)}
                        className="border-blue-300 text-blue-700 hover:bg-blue-50"
                      >
                        <Edit className="w-4 h-4 mr-2" />
                        Editar
                      </Button>
                    ) : (
                      <div className="flex gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => {
                            setEditingSummary(false)
                            setSummaryText(selectedEvent.eventSummary || "")
                          }}
                        >
                          Cancelar
                        </Button>
                        <Button
                          size="sm"
                          onClick={handleSaveSummary}
                          disabled={savingSummary}
                          className="bg-blue-600 hover:bg-blue-700"
                        >
                          <Save className="w-4 h-4 mr-2" />
                          {savingSummary ? "Guardando..." : "Guardar"}
                        </Button>
                      </div>
                    )}
                  </div>

                  {editingSummary ? (
                    <Textarea
                      value={summaryText}
                      onChange={(e) => setSummaryText(e.target.value)}
                      placeholder="Escribe aquí el resumen del evento: cómo salió todo, qué funcionó bien, qué se puede mejorar, anécdotas destacadas, feedback del cliente, observaciones del equipo, etc."
                      rows={15}
                      className="w-full"
                    />
                  ) : (
                    <div className="min-h-[200px] p-4 bg-gray-50 rounded border">
                      {selectedEvent.eventSummary ? (
                        <p className="text-sm text-gray-700 whitespace-pre-wrap">
                          {selectedEvent.eventSummary}
                        </p>
                      ) : (
                        <p className="text-sm text-gray-400 italic">
                          No hay resumen registrado. Haz clic en &quot;Editar&quot; para agregar uno.
                        </p>
                      )}
                    </div>
                  )}
                </div>
              </div>

              {/* Información de Pago */}
              <div className="bg-purple-50 p-4 rounded-lg border border-purple-200">
                <h4 className="font-semibold text-purple-900 mb-3">Información de Pago</h4>
                <div className="grid grid-cols-3 gap-4 text-sm">
                  <div>
                    <p className="text-xs text-purple-700 mb-1">Total del Evento</p>
                    <p className="font-bold text-purple-900 text-lg">
                      ${selectedEvent.totalAmount.toLocaleString()}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-purple-700 mb-1">Pagado</p>
                    <p className="font-bold text-green-700 text-lg">
                      ${selectedEvent.depositPaid.toLocaleString()}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-purple-700 mb-1">Saldo</p>
                    <p className="font-bold text-gray-700 text-lg">
                      ${selectedEvent.balanceRemaining.toLocaleString()}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}
