"use client"

import { useState } from "react"
import { useQuery, useMutation } from "convex/react"
import { api } from "@/convex/_generated/api"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Plus, Trash2, Save, Edit, FileText, Mail, Phone, Users, Clock, MapPin } from "lucide-react"
import { toast } from "sonner"
import { Toaster } from "@/components/ui/sonner"

export default function ReunionesPage() {
  const meetings = useQuery(api.meetings.getAllMeetings)
  const bookings = useQuery(api.bookings.getAllBookings)
  const createMeeting = useMutation(api.meetings.createMeeting)
  const updateMeeting = useMutation(api.meetings.updateMeeting)
  const deleteMeeting = useMutation(api.meetings.deleteMeeting)

  const [dialogOpen, setDialogOpen] = useState(false)
  const [detailsDialogOpen, setDetailsDialogOpen] = useState(false)
  const [selectedMeeting, setSelectedMeeting] = useState<any>(null)
  const [editingSummary, setEditingSummary] = useState(false)
  const [summaryText, setSummaryText] = useState("")
  const [saving, setSaving] = useState(false)
  const [deleting, setDeleting] = useState(false)
  const [selectedBooking, setSelectedBooking] = useState<any>(null)
  const [formData, setFormData] = useState({
    title: "",
    meetingType: "consulta_inicial" as "consulta_inicial" | "planificacion_evento",
    meetingDate: "",
    startTime: "",
    endTime: "",
    clientName: "",
    clientEmail: "",
    clientPhone: "",
    notes: "",
    agenda: "",
    location: "",
    bookingId: "none" as string | undefined,
  })

  const handleBookingSelect = (bookingId: string) => {
    if (bookingId === "none") {
      setSelectedBooking(null)
      setFormData({
        ...formData,
        bookingId: undefined,
        clientName: "",
        clientEmail: "",
        clientPhone: "",
        title: "",
      })
      return
    }

    const booking = bookings?.find((b) => b._id === bookingId)
    setSelectedBooking(booking)

    if (booking) {
      setFormData({
        ...formData,
        bookingId: bookingId,
        clientName: booking.clientName,
        clientEmail: booking.clientEmail,
        clientPhone: booking.clientPhone,
        title: `Reunión - ${booking.eventType}`,
      })
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    try {
      await createMeeting({
        bookingId: formData.bookingId && formData.bookingId !== "none" ? (formData.bookingId as any) : undefined,
        title: formData.title,
        meetingType: formData.meetingType,
        meetingDate: formData.meetingDate,
        startTime: formData.startTime,
        endTime: formData.endTime,
        clientName: formData.clientName,
        clientEmail: formData.clientEmail,
        clientPhone: formData.clientPhone,
        notes: formData.notes || undefined,
        agenda: formData.agenda || undefined,
        location: formData.location || undefined,
      })

      toast.success("Reunión creada exitosamente")
      setDialogOpen(false)
      setSelectedBooking(null)
      setFormData({
        title: "",
        meetingType: "consulta_inicial",
        meetingDate: "",
        startTime: "",
        endTime: "",
        clientName: "",
        clientEmail: "",
        clientPhone: "",
        notes: "",
        agenda: "",
        location: "",
        bookingId: "none",
      })
    } catch (error) {
      toast.error("Error al crear la reunión")
      console.error(error)
    }
  }

  const handleViewDetails = (meeting: any) => {
    setSelectedMeeting(meeting)
    setSummaryText(meeting.meetingSummary || "")
    setEditingSummary(false)
    setDetailsDialogOpen(true)
  }

  const handleSaveSummary = async () => {
    if (!selectedMeeting) return

    setSaving(true)
    try {
      await updateMeeting({
        id: selectedMeeting._id,
        meetingSummary: summaryText,
      })
      toast.success('Minuta guardada exitosamente')
      setEditingSummary(false)
      setSelectedMeeting({ ...selectedMeeting, meetingSummary: summaryText })
    } catch (error) {
      console.error('Error al guardar minuta:', error)
      toast.error('Error al guardar la minuta')
    } finally {
      setSaving(false)
    }
  }

  const handleDeleteMeeting = async () => {
    if (!selectedMeeting) return

    if (!confirm('¿Estás seguro de que deseas eliminar esta reunión? Esta acción no se puede deshacer.')) {
      return
    }

    setDeleting(true)
    try {
      await deleteMeeting({ id: selectedMeeting._id })
      toast.success('Reunión eliminada exitosamente')
      setDetailsDialogOpen(false)
      setSelectedMeeting(null)
    } catch (error) {
      console.error('Error al eliminar reunión:', error)
      toast.error('Error al eliminar la reunión')
    } finally {
      setDeleting(false)
    }
  }

  return (
    <div className="p-8">
      <Toaster />
      <div className="mb-8 flex justify-between items-start">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Gestión de Reuniones</h1>
          <p className="text-gray-600">Administra reuniones con clientes sobre sus eventos</p>
        </div>
        <Button
          size="lg"
          className="bg-purple-600 hover:bg-purple-700"
          onClick={() => setDialogOpen(true)}
        >
          <Plus className="w-5 h-5 mr-2" />
          Nueva Reunión
        </Button>
      </div>

      <Card>
        <CardContent className="p-8">
          {!meetings ? (
            <p className="text-center text-gray-500">Cargando reuniones...</p>
          ) : meetings.length > 0 ? (
            <div className="space-y-4">
              {meetings.map((meeting) => {
                const hasMinuta = meeting.meetingSummary && meeting.meetingSummary.trim().length > 0
                return (
                  <div
                    key={meeting._id}
                    className="p-4 border rounded-lg hover:shadow-md transition-shadow cursor-pointer"
                    onClick={() => handleViewDetails(meeting)}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <h3 className="font-semibold text-lg">{meeting.title}</h3>
                          {hasMinuta && (
                            <Badge variant="outline" className="bg-purple-50 text-purple-700 border-purple-300">
                              📝 Con minuta
                            </Badge>
                          )}
                        </div>
                        <p className="text-sm text-gray-600 mt-1">{meeting.clientName}</p>
                        <p className="text-sm text-gray-600">
                          📅 {new Date(meeting.meetingDate).toLocaleDateString("es-CL")} - ⏰ {meeting.startTime}
                        </p>
                        {meeting.booking && (
                          <div className="mt-2 p-2 bg-blue-50 border border-blue-200 rounded inline-block">
                            <p className="text-xs font-semibold text-blue-900">
                              🔗 Vinculada con: {meeting.booking.eventType}
                            </p>
                            <p className="text-xs text-blue-700">
                              Evento: {new Date(meeting.booking.eventDate).toLocaleDateString("es-CL")}
                            </p>
                          </div>
                        )}
                      </div>
                      <Badge className="ml-3">{meeting.status}</Badge>
                    </div>
                  </div>
                )
              })}
            </div>
          ) : (
            <p className="text-center text-gray-500">No hay reuniones programadas</p>
          )}
        </CardContent>
      </Card>

      {/* Dialog para crear nueva reunión */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Nueva Reunión</DialogTitle>
          </DialogHeader>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              {/* Vinculación con Reserva */}
              <div className="col-span-2">
                <Label htmlFor="bookingId">Vincular con Reserva (Opcional)</Label>
                <Select
                  value={formData.bookingId}
                  onValueChange={handleBookingSelect}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Seleccionar reserva existente (opcional)" />
                  </SelectTrigger>
                  <SelectContent className="z-[10000]">
                    <SelectItem value="none">Ninguna (reunión independiente)</SelectItem>
                    {bookings?.map((booking) => (
                      <SelectItem key={booking._id} value={booking._id}>
                        {booking.eventType} - {booking.clientName} ({new Date(booking.eventDate).toLocaleDateString("es-CL")})
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {selectedBooking && (
                  <div className="mt-2 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                    <p className="text-xs font-semibold text-blue-900 mb-1">✓ Vinculado con:</p>
                    <p className="text-sm text-blue-800">
                      {selectedBooking.eventType} - {selectedBooking.clientName}
                    </p>
                    <p className="text-xs text-blue-600 mt-1">
                      📅 {new Date(selectedBooking.eventDate).toLocaleDateString("es-CL")} | 👥 {selectedBooking.numberOfGuests} invitados
                    </p>
                  </div>
                )}
              </div>

              {/* Título */}
              <div className="col-span-2">
                <Label htmlFor="title">Título de la Reunión *</Label>
                <Input
                  id="title"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  placeholder="Ej: Consulta inicial evento matrimonio"
                  required
                />
              </div>

              {/* Tipo de reunión */}
              <div>
                <Label htmlFor="meetingType">Tipo de Reunión *</Label>
                <Select
                  value={formData.meetingType}
                  onValueChange={(value: "consulta_inicial" | "planificacion_evento") =>
                    setFormData({ ...formData, meetingType: value })
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Selecciona el tipo de reunión" />
                  </SelectTrigger>
                  <SelectContent className="z-[10000]">
                    <SelectItem value="consulta_inicial">Consulta Inicial</SelectItem>
                    <SelectItem value="planificacion_evento">Planificación del Evento</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Fecha */}
              <div>
                <Label htmlFor="meetingDate">Fecha *</Label>
                <Input
                  id="meetingDate"
                  type="date"
                  value={formData.meetingDate}
                  onChange={(e) => setFormData({ ...formData, meetingDate: e.target.value })}
                  required
                />
              </div>

              {/* Hora inicio */}
              <div>
                <Label htmlFor="startTime">Hora Inicio *</Label>
                <Input
                  id="startTime"
                  type="time"
                  value={formData.startTime}
                  onChange={(e) => setFormData({ ...formData, startTime: e.target.value })}
                  required
                />
              </div>

              {/* Hora fin */}
              <div>
                <Label htmlFor="endTime">Hora Fin *</Label>
                <Input
                  id="endTime"
                  type="time"
                  value={formData.endTime}
                  onChange={(e) => setFormData({ ...formData, endTime: e.target.value })}
                  required
                />
              </div>

              {/* Nombre del cliente */}
              <div className="col-span-2">
                <Label htmlFor="clientName">Nombre del Cliente *</Label>
                <Input
                  id="clientName"
                  value={formData.clientName}
                  onChange={(e) => setFormData({ ...formData, clientName: e.target.value })}
                  placeholder="Juan Pérez"
                  required
                />
              </div>

              {/* Email del cliente */}
              <div>
                <Label htmlFor="clientEmail">Email del Cliente *</Label>
                <Input
                  id="clientEmail"
                  type="email"
                  value={formData.clientEmail}
                  onChange={(e) => setFormData({ ...formData, clientEmail: e.target.value })}
                  placeholder="cliente@email.com"
                  required
                />
              </div>

              {/* Teléfono del cliente */}
              <div>
                <Label htmlFor="clientPhone">Teléfono del Cliente *</Label>
                <Input
                  id="clientPhone"
                  type="tel"
                  value={formData.clientPhone}
                  onChange={(e) => setFormData({ ...formData, clientPhone: e.target.value })}
                  placeholder="+56 9 1234 5678"
                  required
                />
              </div>

              {/* Ubicación */}
              <div className="col-span-2">
                <Label htmlFor="location">Ubicación</Label>
                <Input
                  id="location"
                  value={formData.location}
                  onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                  placeholder="Oficina Ruka Lefún / Videollamada / Otro"
                />
              </div>

              {/* Agenda */}
              <div className="col-span-2">
                <Label htmlFor="agenda">Agenda</Label>
                <Textarea
                  id="agenda"
                  value={formData.agenda}
                  onChange={(e) => setFormData({ ...formData, agenda: e.target.value })}
                  placeholder="Puntos a tratar en la reunión..."
                  rows={3}
                />
              </div>

              {/* Notas */}
              <div className="col-span-2">
                <Label htmlFor="notes">Notas Adicionales</Label>
                <Textarea
                  id="notes"
                  value={formData.notes}
                  onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                  placeholder="Información adicional sobre la reunión..."
                  rows={3}
                />
              </div>
            </div>

            <div className="flex justify-end gap-3 pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => setDialogOpen(false)}
              >
                Cancelar
              </Button>
              <Button type="submit" className="bg-purple-600 hover:bg-purple-700">
                Crear Reunión
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>

      {/* Dialog para ver detalles de reunión */}
      <Dialog open={detailsDialogOpen} onOpenChange={setDetailsDialogOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <div className="flex items-center justify-between">
              <DialogTitle className="text-2xl">Detalles de la Reunión</DialogTitle>
              <Button
                variant="destructive"
                size="sm"
                onClick={handleDeleteMeeting}
                disabled={deleting}
              >
                <Trash2 className="w-4 h-4 mr-2" />
                {deleting ? "Eliminando..." : "Eliminar Reunión"}
              </Button>
            </div>
          </DialogHeader>

          {selectedMeeting && (
            <div className="space-y-6">
              {/* Información básica */}
              <div className="grid grid-cols-2 gap-4 p-4 bg-purple-50 rounded-lg border border-purple-200">
                <div className="col-span-2">
                  <h3 className="font-semibold text-lg text-purple-900">{selectedMeeting.title}</h3>
                  <Badge className="mt-2">{selectedMeeting.status}</Badge>
                </div>

                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4 text-purple-600" />
                  <div>
                    <p className="text-xs text-gray-500">Fecha y Hora</p>
                    <p className="text-sm font-medium">
                      {new Date(selectedMeeting.meetingDate).toLocaleDateString("es-CL")}
                    </p>
                    <p className="text-sm text-gray-600">
                      {selectedMeeting.startTime} - {selectedMeeting.endTime}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <Users className="w-4 h-4 text-purple-600" />
                  <div>
                    <p className="text-xs text-gray-500">Cliente</p>
                    <p className="text-sm font-medium">{selectedMeeting.clientName}</p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <Mail className="w-4 h-4 text-purple-600" />
                  <div>
                    <p className="text-xs text-gray-500">Email</p>
                    <p className="text-sm">{selectedMeeting.clientEmail}</p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <Phone className="w-4 h-4 text-purple-600" />
                  <div>
                    <p className="text-xs text-gray-500">Teléfono</p>
                    <p className="text-sm">{selectedMeeting.clientPhone}</p>
                  </div>
                </div>

                {selectedMeeting.location && (
                  <div className="col-span-2 flex items-center gap-2">
                    <MapPin className="w-4 h-4 text-purple-600" />
                    <div>
                      <p className="text-xs text-gray-500">Ubicación</p>
                      <p className="text-sm">{selectedMeeting.location}</p>
                    </div>
                  </div>
                )}
              </div>

              {/* Vinculación con reserva */}
              {selectedMeeting.booking && (
                <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                  <h4 className="font-semibold text-blue-900 mb-2">🔗 Vinculada con Reserva</h4>
                  <div className="space-y-1">
                    <p className="text-sm text-blue-800">
                      <strong>Evento:</strong> {selectedMeeting.booking.eventType}
                    </p>
                    <p className="text-sm text-blue-700">
                      <strong>Fecha del Evento:</strong> {new Date(selectedMeeting.booking.eventDate).toLocaleDateString("es-CL")}
                    </p>
                    <p className="text-sm text-blue-700">
                      <strong>Invitados:</strong> {selectedMeeting.booking.numberOfGuests}
                    </p>
                  </div>
                </div>
              )}

              {/* Agenda */}
              {selectedMeeting.agenda && (
                <div className="p-4 bg-gray-50 rounded-lg border">
                  <h4 className="font-semibold text-gray-900 mb-2">Agenda</h4>
                  <p className="text-sm text-gray-700 whitespace-pre-wrap">{selectedMeeting.agenda}</p>
                </div>
              )}

              {/* Notas */}
              {selectedMeeting.notes && (
                <div className="p-4 bg-gray-50 rounded-lg border">
                  <h4 className="font-semibold text-gray-900 mb-2">Notas Adicionales</h4>
                  <p className="text-sm text-gray-700 whitespace-pre-wrap">{selectedMeeting.notes}</p>
                </div>
              )}

              {/* Minuta de la reunión */}
              <div className="p-4 bg-purple-50 rounded-lg border border-purple-200">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <FileText className="w-5 h-5 text-purple-600" />
                    <h4 className="font-semibold text-purple-900">Minuta de la Reunión</h4>
                  </div>
                  {!editingSummary ? (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setEditingSummary(true)}
                      className="border-purple-300 text-purple-700 hover:bg-purple-100"
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
                          setSummaryText(selectedMeeting.meetingSummary || "")
                        }}
                      >
                        Cancelar
                      </Button>
                      <Button
                        size="sm"
                        onClick={handleSaveSummary}
                        disabled={saving}
                        className="bg-purple-600 hover:bg-purple-700"
                      >
                        <Save className="w-4 h-4 mr-2" />
                        {saving ? "Guardando..." : "Guardar"}
                      </Button>
                    </div>
                  )}
                </div>

                {editingSummary ? (
                  <Textarea
                    value={summaryText}
                    onChange={(e) => setSummaryText(e.target.value)}
                    placeholder="Escribe aquí los temas tratados en la reunión, acuerdos alcanzados, próximos pasos, etc."
                    rows={10}
                    className="w-full"
                  />
                ) : (
                  <div className="min-h-[100px] p-3 bg-white rounded border">
                    {selectedMeeting.meetingSummary ? (
                      <p className="text-sm text-gray-700 whitespace-pre-wrap">
                        {selectedMeeting.meetingSummary}
                      </p>
                    ) : (
                      <p className="text-sm text-gray-400 italic">
                        No hay minuta registrada. Haz clic en "Editar" para agregar una.
                      </p>
                    )}
                  </div>
                )}
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}
