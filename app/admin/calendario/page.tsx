"use client"

import { useState, useMemo } from "react"
import { useQuery, useMutation } from "convex/react"
import { api } from "@/convex/_generated/api"
import { Calendar as BigCalendar, dateFnsLocalizer, View } from "react-big-calendar"
import { format, parse, startOfWeek, getDay } from "date-fns"
import { es } from "date-fns/locale"
import "react-big-calendar/lib/css/react-big-calendar.css"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"
import { Textarea } from "@/components/ui/textarea"
import { Mail, Phone, Users, Clock, MapPin, DollarSign, FileText, Trash2, Save, Edit } from "lucide-react"
import { toast } from "sonner"
import { Toaster } from "@/components/ui/sonner"

const locales = {
  es: es,
}

const localizer = dateFnsLocalizer({
  format,
  parse,
  startOfWeek: () => startOfWeek(new Date(), { locale: es }),
  getDay,
  locales,
})

export default function CalendarioPage() {
  const bookings = useQuery(api.bookings.getAllBookings)
  const meetings = useQuery(api.meetings.getAllMeetings)
  const deleteMeeting = useMutation(api.meetings.deleteMeeting)
  const updateMeeting = useMutation(api.meetings.updateMeeting)
  const [selectedEvent, setSelectedEvent] = useState<any>(null)
  const [dialogOpen, setDialogOpen] = useState(false)
  const [deleting, setDeleting] = useState(false)
  const [editingSummary, setEditingSummary] = useState(false)
  const [summaryText, setSummaryText] = useState("")
  const [saving, setSaving] = useState(false)
  const [view, setView] = useState<View>("month")
  const [date, setDate] = useState(new Date())

  const events = useMemo(() => {
    const bookingEvents = bookings
      ? bookings
          .filter((b) => b.status !== "cancelled")
          .map((booking) => {
            const eventDate = new Date(booking.eventDate)
            const [startHour, startMinute] = booking.startTime.split(":").map(Number)
            const [endHour, endMinute] = booking.endTime.split(":").map(Number)

            const start = new Date(eventDate)
            start.setHours(startHour, startMinute, 0)

            const end = new Date(eventDate)
            end.setHours(endHour, endMinute, 0)

            return {
              id: booking._id,
              title: `${booking.clientName} - ${booking.eventType}`,
              start,
              end,
              resource: booking,
              type: 'booking', // Identificar como reserva
            }
          })
      : []

    const meetingEvents = meetings
      ? meetings
          .filter((m) => m.status === "scheduled")
          .map((meeting) => {
            const eventDate = new Date(meeting.meetingDate)
            const [startHour, startMinute] = meeting.startTime.split(":").map(Number)
            const [endHour, endMinute] = meeting.endTime.split(":").map(Number)

            const start = new Date(eventDate)
            start.setHours(startHour, startMinute, 0)

            const end = new Date(eventDate)
            end.setHours(endHour, endMinute, 0)

            // Agregar indicador de minuta
            const hasMinuta = meeting.meetingSummary && meeting.meetingSummary.trim().length > 0
            const minutaIcon = hasMinuta ? '📝' : '📅'

            return {
              id: meeting._id,
              title: `${minutaIcon} ${meeting.title}`,
              start,
              end,
              resource: meeting,
              type: 'meeting', // Identificar como reunión
            }
          })
      : []

    return [...bookingEvents, ...meetingEvents]
  }, [bookings, meetings])

  const handleSelectEvent = (event: any) => {
    const eventData = { ...event.resource, eventType: event.type }
    setSelectedEvent(eventData)
    setSummaryText(eventData.meetingSummary || "")
    setEditingSummary(false)
    setDialogOpen(true)
  }

  const handleDeleteMeeting = async () => {
    if (!selectedEvent || selectedEvent.eventType !== 'meeting') return

    if (!confirm('¿Estás seguro de que deseas eliminar esta reunión? Esta acción no se puede deshacer.')) {
      return
    }

    setDeleting(true)
    try {
      await deleteMeeting({ id: selectedEvent._id })
      toast.success('Reunión eliminada exitosamente')
      setDialogOpen(false)
      setSelectedEvent(null)
    } catch (error) {
      console.error('Error al eliminar reunión:', error)
      toast.error('Error al eliminar la reunión')
    } finally {
      setDeleting(false)
    }
  }

  const handleSaveSummary = async () => {
    if (!selectedEvent || selectedEvent.eventType !== 'meeting') return

    setSaving(true)
    try {
      await updateMeeting({
        id: selectedEvent._id,
        meetingSummary: summaryText,
      })
      toast.success('Minuta guardada exitosamente')
      setEditingSummary(false)
      // Actualizar el evento seleccionado
      setSelectedEvent({ ...selectedEvent, meetingSummary: summaryText })
    } catch (error) {
      console.error('Error al guardar minuta:', error)
      toast.error('Error al guardar la minuta')
    } finally {
      setSaving(false)
    }
  }

  const getStatusColor = (status: string) => {
    const colors: Record<string, string> = {
      pending: "bg-amber-500",
      confirmed: "bg-green-500",
      completed: "bg-blue-500",
      cancelled: "bg-red-500",
    }
    return colors[status] || "bg-gray-500"
  }

  const getStatusLabel = (status: string) => {
    const labels: Record<string, string> = {
      pending: "Pendiente",
      confirmed: "Confirmado",
      completed: "Completado",
      cancelled: "Cancelado",
    }
    return labels[status] || status
  }

  const eventStyleGetter = (event: any) => {
    // Si es una reunión, usar color púrpura
    if (event.type === 'meeting') {
      return {
        style: { backgroundColor: "#9333ea" }, // Púrpura para reuniones
      }
    }

    // Si es una reserva, usar colores según estado
    const status = event.resource.status
    const colors: Record<string, any> = {
      pending: { backgroundColor: "#f59e0b" },
      confirmed: { backgroundColor: "#10b981" },
      completed: { backgroundColor: "#3b82f6" },
      cancelled: { backgroundColor: "#ef4444" },
    }
    return {
      style: colors[status] || { backgroundColor: "#6b7280" },
    }
  }

  return (
    <div className="p-8">
      <Toaster />
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Calendario de Eventos</h1>
        <p className="text-gray-600">Vista general de todos los eventos programados</p>
      </div>

      {/* Leyenda */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="text-lg">Leyenda</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div>
              <p className="text-xs font-semibold text-gray-500 mb-2">Reservas de Eventos</p>
              <div className="flex flex-wrap gap-4">
                <div className="flex items-center space-x-2">
                  <div className="w-4 h-4 rounded bg-amber-500" />
                  <span className="text-sm">Pendiente</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-4 h-4 rounded bg-green-500" />
                  <span className="text-sm">Confirmado</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-4 h-4 rounded bg-blue-500" />
                  <span className="text-sm">Completado</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-4 h-4 rounded bg-red-500" />
                  <span className="text-sm">Cancelado</span>
                </div>
              </div>
            </div>
            <div>
              <p className="text-xs font-semibold text-gray-500 mb-2">Reuniones</p>
              <div className="space-y-2">
                <div className="flex items-center space-x-2">
                  <div className="w-4 h-4 rounded bg-purple-600" />
                  <span className="text-sm">📅 Reunión Programada</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-4 h-4 rounded bg-purple-600" />
                  <span className="text-sm">📝 Reunión con Minuta</span>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Calendario */}
      <Card>
        <CardContent className="p-6">
          <div style={{ height: "700px" }}>
            <BigCalendar
              localizer={localizer}
              events={events}
              startAccessor="start"
              endAccessor="end"
              culture="es"
              messages={{
                next: "Siguiente",
                previous: "Anterior",
                today: "Hoy",
                month: "Mes",
                week: "Semana",
                day: "Día",
                agenda: "Agenda",
                date: "Fecha",
                time: "Hora",
                event: "Evento",
                noEventsInRange: "No hay eventos en este rango",
              }}
              onSelectEvent={handleSelectEvent}
              eventPropGetter={eventStyleGetter}
              view={view}
              onView={setView}
              date={date}
              onNavigate={setDate}
            />
          </div>
        </CardContent>
      </Card>

      {/* Dialog de Detalles del Evento */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent
          open={dialogOpen}
          onClose={() => setDialogOpen(false)}
          className="max-w-3xl max-h-[90vh] overflow-y-auto"
        >
          {selectedEvent && (
            <>
              <DialogHeader>
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <DialogTitle className="text-2xl">
                      {selectedEvent.eventType === 'meeting' ? selectedEvent.title : selectedEvent.clientName}
                    </DialogTitle>
                    <DialogDescription className="text-base mt-1">
                      {selectedEvent.eventType === 'meeting'
                        ? (selectedEvent.meetingType === 'consulta_inicial' ? 'Consulta Inicial' : 'Planificación del Evento')
                        : selectedEvent.eventType}
                    </DialogDescription>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge
                      variant={selectedEvent.status === "confirmed" || selectedEvent.status === "scheduled" ? "default" : "outline"}
                      className={`text-sm px-3 py-1 ${selectedEvent.eventType === 'meeting' ? 'bg-purple-600' : ''}`}
                    >
                      {selectedEvent.eventType === 'meeting' ? 'Reunión' : getStatusLabel(selectedEvent.status)}
                    </Badge>
                    {selectedEvent.eventType === 'meeting' && (
                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={handleDeleteMeeting}
                        disabled={deleting}
                        className="gap-2"
                      >
                        <Trash2 className="h-4 w-4" />
                        {deleting ? 'Eliminando...' : 'Eliminar'}
                      </Button>
                    )}
                  </div>
                </div>
              </DialogHeader>

              <div className="space-y-4 mt-4">
                {/* Información del Cliente */}
                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle className="text-base font-semibold">Información del Cliente</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    <div className="flex items-center gap-3 text-sm">
                      <Mail className="h-4 w-4 text-gray-500 flex-shrink-0" />
                      <span className="text-gray-700">{selectedEvent.clientEmail}</span>
                    </div>
                    <div className="flex items-center gap-3 text-sm">
                      <Phone className="h-4 w-4 text-gray-500 flex-shrink-0" />
                      <span className="text-gray-700">{selectedEvent.clientPhone}</span>
                    </div>
                    {selectedEvent.eventType === 'meeting' && (
                      <div className="flex items-center gap-3 text-sm">
                        <Users className="h-4 w-4 text-gray-500 flex-shrink-0" />
                        <span className="text-gray-700">{selectedEvent.clientName}</span>
                      </div>
                    )}
                  </CardContent>
                </Card>

                {/* Detalles del Evento o Reunión */}
                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle className="text-base font-semibold">
                      {selectedEvent.eventType === 'meeting' ? 'Detalles de la Reunión' : 'Detalles del Evento'}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="flex items-start gap-3">
                        <Clock className="h-5 w-5 text-blue-600 flex-shrink-0 mt-0.5" />
                        <div>
                          <p className="text-xs text-gray-500 mb-1">Fecha y Horario</p>
                          <p className="text-sm font-medium text-gray-900">
                            {new Date(selectedEvent.eventType === 'meeting' ? selectedEvent.meetingDate : selectedEvent.eventDate).toLocaleDateString("es-CL", {
                              weekday: 'long',
                              year: 'numeric',
                              month: 'long',
                              day: 'numeric'
                            })}
                          </p>
                          <p className="text-sm text-gray-600">
                            {selectedEvent.startTime} - {selectedEvent.endTime}
                          </p>
                        </div>
                      </div>

                      {selectedEvent.eventType === 'booking' && selectedEvent.numberOfGuests && (
                        <div className="flex items-start gap-3">
                          <Users className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
                          <div>
                            <p className="text-xs text-gray-500 mb-1">Invitados</p>
                            <p className="text-sm font-medium text-gray-900">
                              {selectedEvent.numberOfGuests} personas
                            </p>
                          </div>
                        </div>
                      )}

                      {selectedEvent.eventType === 'meeting' && selectedEvent.location && (
                        <div className="flex items-start gap-3">
                          <MapPin className="h-5 w-5 text-purple-600 flex-shrink-0 mt-0.5" />
                          <div>
                            <p className="text-xs text-gray-500 mb-1">Ubicación</p>
                            <p className="text-sm font-medium text-gray-900">
                              {selectedEvent.location}
                            </p>
                          </div>
                        </div>
                      )}

                      {selectedEvent.eventType === 'booking' && selectedEvent.space && (
                        <div className="flex items-start gap-3 col-span-2">
                          <MapPin className="h-5 w-5 text-purple-600 flex-shrink-0 mt-0.5" />
                          <div>
                            <p className="text-xs text-gray-500 mb-1">Espacio</p>
                            <p className="text-sm font-medium text-gray-900">
                              {selectedEvent.space.name}
                            </p>
                          </div>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>

                {/* Agenda (solo para reuniones) */}
                {selectedEvent.eventType === 'meeting' && selectedEvent.agenda && (
                  <Card>
                    <CardHeader className="pb-3">
                      <CardTitle className="text-base font-semibold flex items-center gap-2">
                        <FileText className="h-4 w-4" />
                        Agenda
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm text-gray-700 bg-gray-50 p-3 rounded-md">
                        {selectedEvent.agenda}
                      </p>
                    </CardContent>
                  </Card>
                )}

                {/* Notas (solo para reuniones) */}
                {selectedEvent.eventType === 'meeting' && selectedEvent.notes && (
                  <Card>
                    <CardHeader className="pb-3">
                      <CardTitle className="text-base font-semibold flex items-center gap-2">
                        <FileText className="h-4 w-4" />
                        Notas Previas
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm text-gray-700 bg-gray-50 p-3 rounded-md">
                        {selectedEvent.notes}
                      </p>
                    </CardContent>
                  </Card>
                )}

                {/* Minuta de Reunión (solo para reuniones) */}
                {selectedEvent.eventType === 'meeting' && (
                  <Card className="bg-gradient-to-br from-purple-50 to-indigo-50 border-purple-200">
                    <CardHeader className="pb-3">
                      <div className="flex items-center justify-between">
                        <CardTitle className="text-base font-semibold flex items-center gap-2">
                          <FileText className="h-4 w-4 text-purple-600" />
                          Minuta de Reunión
                        </CardTitle>
                        {!editingSummary && (
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => setEditingSummary(true)}
                            className="gap-2 border-purple-300 text-purple-700 hover:bg-purple-100"
                          >
                            <Edit className="h-4 w-4" />
                            {selectedEvent.meetingSummary ? 'Editar' : 'Agregar'}
                          </Button>
                        )}
                      </div>
                    </CardHeader>
                    <CardContent>
                      {editingSummary ? (
                        <div className="space-y-3">
                          <Textarea
                            value={summaryText}
                            onChange={(e) => setSummaryText(e.target.value)}
                            placeholder="Describe los temas tratados, acuerdos alcanzados, decisiones tomadas, próximos pasos..."
                            className="min-h-[200px] bg-white"
                          />
                          <div className="flex gap-2 justify-end">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => {
                                setEditingSummary(false)
                                setSummaryText(selectedEvent.meetingSummary || "")
                              }}
                              disabled={saving}
                            >
                              Cancelar
                            </Button>
                            <Button
                              size="sm"
                              onClick={handleSaveSummary}
                              disabled={saving}
                              className="gap-2 bg-purple-600 hover:bg-purple-700"
                            >
                              <Save className="h-4 w-4" />
                              {saving ? 'Guardando...' : 'Guardar Minuta'}
                            </Button>
                          </div>
                        </div>
                      ) : selectedEvent.meetingSummary ? (
                        <div className="text-sm text-gray-700 bg-white p-4 rounded-md border border-purple-200 whitespace-pre-wrap">
                          {selectedEvent.meetingSummary}
                        </div>
                      ) : (
                        <p className="text-sm text-gray-500 italic bg-white/50 p-4 rounded-md text-center">
                          No hay minuta registrada. Haz clic en "Agregar" para documentar los temas tratados en esta reunión.
                        </p>
                      )}
                    </CardContent>
                  </Card>
                )}

                {/* Servicios (solo para reservas) */}
                {selectedEvent.eventType === 'booking' && selectedEvent.services && selectedEvent.services.length > 0 && (
                  <Card>
                    <CardHeader className="pb-3">
                      <CardTitle className="text-base font-semibold">Servicios Contratados</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="flex flex-wrap gap-2">
                        {selectedEvent.services.map((service: string, i: number) => (
                          <Badge key={i} variant="outline" className="text-sm">
                            {service}
                          </Badge>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                )}

                {/* Solicitudes Especiales (solo para reservas) */}
                {selectedEvent.eventType === 'booking' && selectedEvent.specialRequests && (
                  <Card>
                    <CardHeader className="pb-3">
                      <CardTitle className="text-base font-semibold flex items-center gap-2">
                        <FileText className="h-4 w-4" />
                        Solicitudes Especiales
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm text-gray-700 bg-gray-50 p-3 rounded-md">
                        {selectedEvent.specialRequests}
                      </p>
                    </CardContent>
                  </Card>
                )}

                {/* Información de Pago (solo para reservas) */}
                {selectedEvent.eventType === 'booking' && (
                  <Card className="bg-gradient-to-br from-blue-50 to-indigo-50 border-blue-200">
                    <CardHeader className="pb-3">
                      <CardTitle className="text-base font-semibold flex items-center gap-2">
                        <DollarSign className="h-4 w-4 text-blue-600" />
                        Información de Pago
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-3 gap-4">
                        <div className="text-center p-3 bg-white rounded-lg">
                          <p className="text-xs text-gray-600 mb-1">Total</p>
                          <p className="text-lg font-bold text-gray-900">
                            ${selectedEvent.totalAmount.toLocaleString()}
                          </p>
                        </div>
                        <div className="text-center p-3 bg-green-50 rounded-lg">
                          <p className="text-xs text-green-700 mb-1">Pagado</p>
                          <p className="text-lg font-bold text-green-700">
                            ${selectedEvent.depositPaid.toLocaleString()}
                          </p>
                        </div>
                        <div className="text-center p-3 bg-amber-50 rounded-lg">
                          <p className="text-xs text-amber-700 mb-1">Pendiente</p>
                          <p className="text-lg font-bold text-amber-700">
                            ${selectedEvent.balanceRemaining.toLocaleString()}
                          </p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                )}
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}




