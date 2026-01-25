"use client"

import { useState, useRef } from "react"
import { useQuery, useMutation } from "convex/react"
import { api } from "@/convex/_generated/api"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Select } from "@/components/ui/select"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Users, Calendar, Clock, MapPin, Phone, Mail, DollarSign, Plus, Trash2, Sparkles } from "lucide-react"
import { toast } from "sonner"
import EventTimeline from "@/components/admin/EventTimeline"
import AIEventAssistant from "@/components/admin/AIEventAssistant"
import DrinkInventory from "@/components/admin/DrinkInventory"

export default function ReservasAdminPage() {
  const bookings = useQuery(api.bookings.getAllBookings)
  const updateStatus = useMutation(api.bookings.updateBookingStatus)
  const updatePayment = useMutation(api.bookings.updateBookingPayment)
  const addPayment = useMutation(api.bookings.addPayment)
  const removePayment = useMutation(api.bookings.removePayment)
  const createBooking = useMutation(api.bookings.createBooking)
  const checkAvailability = useMutation(api.bookings.checkAvailability)
  const deleteBooking = useMutation(api.bookings.deleteBooking)
  const updateBookingMenu = useMutation(api.bookings.updateBookingMenu)

  const [selectedBooking, setSelectedBooking] = useState<any>(null)

  // Get meetings for selected booking
  const relatedMeetings = useQuery(
    api.meetings.getMeetingsByBooking,
    selectedBooking ? { bookingId: selectedBooking._id } : "skip"
  )
  const [dialogOpen, setDialogOpen] = useState(false)
  const [createDialogOpen, setCreateDialogOpen] = useState(false)
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [bookingToDelete, setBookingToDelete] = useState<any>(null)
  const [filterStatus, setFilterStatus] = useState("all")
  const [searchTerm, setSearchTerm] = useState("")
  const [activeTab, setActiveTab] = useState<"info" | "timeline" | "menu" | "tragos">("info")
  const [aiAssistantOpen, setAiAssistantOpen] = useState(false)

  const [paymentData, setPaymentData] = useState({
    totalAmount: 0,
    depositPaid: 0,
  })

  // Estado para nuevo pago/abono
  const [newPayment, setNewPayment] = useState({
    amount: "",
    date: new Date().toISOString().split("T")[0],
    method: "efectivo",
    notes: "",
  })

  const [menuData, setMenuData] = useState<any[]>([
    {
      name: "",
      items: [
        {
          category: "",
          dishes: [""],
        },
      ],
    },
  ])


  const filteredBookings = bookings?.filter((booking) => {
    const matchesStatus = filterStatus === "all" || booking.status === filterStatus
    const matchesSearch =
      searchTerm === "" ||
      booking.clientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      booking.clientEmail.toLowerCase().includes(searchTerm.toLowerCase()) ||
      booking.eventType.toLowerCase().includes(searchTerm.toLowerCase())
    return matchesStatus && matchesSearch
  })

  const handleStatusChange = async (bookingId: string, newStatus: string) => {
    try {
      await updateStatus({ id: bookingId as any, status: newStatus })
      toast.success("Estado actualizado correctamente")
    } catch (error) {
      toast.error("Error al actualizar el estado")
    }
  }

  const handlePaymentUpdate = async () => {
    if (!selectedBooking) return

    try {
      await updatePayment({
        id: selectedBooking._id,
        totalAmount: paymentData.totalAmount,
        depositPaid: paymentData.depositPaid,
      })
      toast.success("Información de pago actualizada")
      setDialogOpen(false)
    } catch (error) {
      toast.error("Error al actualizar el pago")
    }
  }

  const handleDeleteBooking = async () => {
    if (!bookingToDelete) return

    try {
      await deleteBooking({ id: bookingToDelete._id as any })
      toast.success("Reserva eliminada correctamente")
      setDeleteDialogOpen(false)
      setDialogOpen(false)
      setBookingToDelete(null)
      setSelectedBooking(null)
    } catch (error) {
      toast.error("Error al eliminar la reserva")
    }
  }

  const handleMenuUpdate = async () => {
    if (!selectedBooking) return

    // Validar que el menú tenga contenido
    const validMenu = menuData.filter(section =>
      section.name &&
      section.items.some((item: any) =>
        item.category && item.dishes.some((d: string) => d.trim())
      )
    )

    if (validMenu.length === 0) {
      toast.error("Por favor completa al menos una sección de menú")
      return
    }

    try {
      await updateBookingMenu({
        id: selectedBooking._id,
        menuSections: validMenu,
      })
      toast.success("Menú actualizado correctamente")
    } catch (error) {
      toast.error("Error al actualizar el menú")
    }
  }


  const openBookingDetails = (booking: any) => {
    setSelectedBooking(booking)
    setPaymentData({
      totalAmount: booking.totalAmount,
      depositPaid: booking.depositPaid,
    })
    // Inicializar menuData con el menú del booking si existe
    if (booking.menuSections && booking.menuSections.length > 0) {
      setMenuData(booking.menuSections)
    } else {
      setMenuData([
        {
          name: "",
          items: [
            {
              category: "",
              dishes: [""],
            },
          ],
        },
      ])
    }
    setDialogOpen(true)
  }

  const getStatusBadge = (status: string) => {
    const variants: Record<string, "default" | "secondary" | "destructive" | "outline"> = {
      pending: "outline",
      confirmed: "default",
      completed: "secondary",
    }
    const labels: Record<string, string> = {
      pending: "Pendiente",
      confirmed: "Confirmado",
      completed: "Completado",
    }
    return (
      <Badge variant={variants[status] || "outline"}>
        {labels[status] || status}
      </Badge>
    )
  }

  return (
    <div className="p-8">
      {/* Header */}
      <div className="mb-8 flex justify-between items-start">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Gestión de Reservas</h1>
          <p className="text-gray-600">
            Administra todas las reservas y solicitudes de eventos
          </p>
        </div>
        <Button 
          size="lg" 
          className="bg-blue-600 hover:bg-blue-700"
          onClick={() => setCreateDialogOpen(true)}
        >
          <Plus className="w-5 h-5 mr-2" />
          Crear Nueva Reserva
        </Button>
      </div>

      {/* Modal de Crear Reserva */}
      <Dialog open={createDialogOpen} onOpenChange={setCreateDialogOpen}>
        <DialogContent 
          open={createDialogOpen} 
          onClose={() => setCreateDialogOpen(false)}
          className="max-w-3xl max-h-[90vh] overflow-y-auto"
        >
          <DialogHeader>
            <DialogTitle>Crear Nueva Reserva</DialogTitle>
            <DialogDescription>
              Completa la información del evento y cliente
            </DialogDescription>
          </DialogHeader>
            <CreateBookingForm 
              onClose={() => setCreateDialogOpen(false)}
              createBooking={createBooking}
              checkAvailability={checkAvailability}
            />
        </DialogContent>
      </Dialog>

      <div className="hidden">
      </div>

      {/* Filtros */}
      <Card className="mb-6">
        <CardContent className="pt-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <Input
                placeholder="Buscar por cliente, email o tipo de evento..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <div className="w-full md:w-48">
              <select 
                value={filterStatus} 
                onChange={(e) => setFilterStatus(e.target.value)}
                className="w-full p-2 border rounded"
              >
                <option value="all">Todos los estados</option>
                <option value="pending">Pendiente</option>
                <option value="confirmed">Confirmado</option>
                <option value="completed">Completado</option>
              </select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Lista de Reservas */}
      <div className="grid grid-cols-1 gap-4">
        {!filteredBookings ? (
          <Card>
            <CardContent className="p-8 text-center">
              <p className="text-gray-500">Cargando reservas...</p>
            </CardContent>
          </Card>
        ) : filteredBookings.length > 0 ? (
          filteredBookings.map((booking) => (
            <Card key={booking._id} className="hover:shadow-lg transition-shadow">
              <CardContent className="p-6">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-center space-x-3 mb-3">
                      <h3 className="text-lg font-semibold">{booking.clientName}</h3>
                      {getStatusBadge(booking.status)}
                      {booking.eventSummary && (
                        <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-300">
                          📄 Con resumen
                        </Badge>
                      )}
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
                      <div className="flex items-center text-gray-600">
                        <Calendar className="h-4 w-4 mr-2" />
                        <span>
                          {new Date(booking.eventDate).toLocaleDateString("es-CL", {
                            weekday: "long",
                            year: "numeric",
                            month: "long",
                            day: "numeric",
                          })}
                        </span>
                      </div>
                      <div className="flex items-center text-gray-600">
                        <Clock className="h-4 w-4 mr-2" />
                        <span>
                          {booking.startTime} - {booking.endTime}
                        </span>
                      </div>
                      <div className="flex items-center text-gray-600">
                        <Users className="h-4 w-4 mr-2" />
                        <span>{booking.eventType} - {booking.numberOfGuests} invitados</span>
                      </div>
                      {booking.space && (
                        <div className="flex items-center text-gray-600">
                          <MapPin className="h-4 w-4 mr-2" />
                          <span>{booking.space.name}</span>
                        </div>
                      )}
                    </div>

                    <div className="mt-3 flex items-center space-x-4 text-sm">
                      <div className="flex items-center text-gray-600">
                        <Mail className="h-4 w-4 mr-1" />
                        <span>{booking.clientEmail}</span>
                      </div>
                      <div className="flex items-center text-gray-600">
                        <Phone className="h-4 w-4 mr-1" />
                        <span>{booking.clientPhone}</span>
                      </div>
                    </div>

                    {booking.totalAmount > 0 && (
                      <div className="mt-3 flex items-center space-x-4 text-sm">
                        <div className="flex items-center text-gray-700">
                          <DollarSign className="h-4 w-4 mr-1" />
                          <span>
                            Total: ${booking.totalAmount.toLocaleString()} | 
                            Pagado: ${booking.depositPaid.toLocaleString()} | 
                            Pendiente: ${booking.balanceRemaining.toLocaleString()}
                          </span>
                        </div>
                      </div>
                    )}
                  </div>

                  <div className="flex flex-col space-y-2">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => openBookingDetails(booking)}
                    >
                      Ver Detalles
                    </Button>

                    {booking.status === "pending" && (
                      <Button
                        size="sm"
                        onClick={() => handleStatusChange(booking._id, "confirmed")}
                        className="bg-green-600 hover:bg-green-700"
                      >
                        Confirmar
                      </Button>
                    )}

                    <Button
                      size="sm"
                      variant="destructive"
                      onClick={(e) => {
                        e.stopPropagation()
                        setBookingToDelete(booking)
                        setDeleteDialogOpen(true)
                      }}
                    >
                      <Trash2 className="h-4 w-4 mr-2" />
                      Eliminar
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        ) : (
          <Card>
            <CardContent className="p-8 text-center">
              <p className="text-gray-500">No se encontraron reservas</p>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Dialog de Detalles */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent
          open={dialogOpen}
          onClose={() => setDialogOpen(false)}
          className="max-w-4xl max-h-[85vh] overflow-y-auto"
        >
          {selectedBooking && (
            <>
              <DialogHeader className="no-print">
                <div className="flex items-start justify-between">
                  <div>
                    <DialogTitle>Detalles de la Reserva</DialogTitle>
                    <DialogDescription>
                      Información completa y gestión de la reserva
                    </DialogDescription>
                  </div>
                  <Button
                    onClick={() => setAiAssistantOpen(true)}
                    className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
                  >
                    <Sparkles className="w-4 h-4 mr-2" />
                    Asistente IA
                  </Button>
                </div>
              </DialogHeader>

              {/* Tab Navigation */}
              <div className="border-b border-gray-200 no-print">
                <div className="flex gap-4">
                  <button
                    onClick={() => setActiveTab("info")}
                    className={`px-4 py-2 font-medium border-b-2 transition-colors ${
                      activeTab === "info"
                        ? "border-blue-600 text-blue-600"
                        : "border-transparent text-gray-600 hover:text-gray-900"
                    }`}
                  >
                    Información
                  </button>
                  <button
                    onClick={() => setActiveTab("timeline")}
                    className={`px-4 py-2 font-medium border-b-2 transition-colors ${
                      activeTab === "timeline"
                        ? "border-blue-600 text-blue-600"
                        : "border-transparent text-gray-600 hover:text-gray-900"
                    }`}
                  >
                    Cronograma
                  </button>
                  <button
                    onClick={() => setActiveTab("menu")}
                    className={`px-4 py-2 font-medium border-b-2 transition-colors ${
                      activeTab === "menu"
                        ? "border-blue-600 text-blue-600"
                        : "border-transparent text-gray-600 hover:text-gray-900"
                    }`}
                  >
                    Menú del Evento
                  </button>
                  <button
                    onClick={() => setActiveTab("tragos")}
                    className={`px-4 py-2 font-medium border-b-2 transition-colors ${
                      activeTab === "tragos"
                        ? "border-blue-600 text-blue-600"
                        : "border-transparent text-gray-600 hover:text-gray-900"
                    }`}
                  >
                    Tragos
                  </button>
                </div>
              </div>

              {/* Tab Content - Info */}
              {activeTab === "info" && (
                <div className="space-y-6">
                {/* Estado */}
                <div>
                  <Label>Estado de la Reserva</Label>
                  <select
                    value={selectedBooking.status}
                    onChange={(e) => handleStatusChange(selectedBooking._id, e.target.value)}
                    className="mt-2 w-full p-2 border rounded"
                  >
                    <option value="pending">Pendiente</option>
                    <option value="confirmed">Confirmado</option>
                    <option value="completed">Completado</option>
                  </select>
                </div>

                {/* Información del Cliente */}
                <div>
                  <h4 className="font-semibold mb-3">Información del Cliente</h4>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <Label className="text-xs text-gray-500">Nombre</Label>
                      <p>{selectedBooking.clientName}</p>
                    </div>
                    <div>
                      <Label className="text-xs text-gray-500">Email</Label>
                      <p>{selectedBooking.clientEmail}</p>
                    </div>
                    <div>
                      <Label className="text-xs text-gray-500">Teléfono</Label>
                      <p>{selectedBooking.clientPhone}</p>
                    </div>
                  </div>
                </div>

                {/* Detalles del Evento */}
                <div>
                  <h4 className="font-semibold mb-3">Detalles del Evento</h4>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <Label className="text-xs text-gray-500">Tipo de Evento</Label>
                      <p>{selectedBooking.eventType}</p>
                    </div>
                    <div>
                      <Label className="text-xs text-gray-500">Número de Invitados</Label>
                      <p>{selectedBooking.numberOfGuests} personas</p>
                    </div>
                    <div>
                      <Label className="text-xs text-gray-500">Fecha</Label>
                      <p>{new Date(selectedBooking.eventDate).toLocaleDateString("es-CL")}</p>
                    </div>
                    <div>
                      <Label className="text-xs text-gray-500">Horario</Label>
                      <p>{selectedBooking.startTime} - {selectedBooking.endTime}</p>
                    </div>
                  </div>
                </div>

                {/* Servicios */}
                {selectedBooking.services?.length > 0 && (
                  <div>
                    <Label className="mb-2 block">Servicios Solicitados</Label>
                    <div className="flex flex-wrap gap-2">
                      {selectedBooking.services.map((service: string, i: number) => (
                        <Badge key={i} variant="outline">{service}</Badge>
                      ))}
                    </div>
                  </div>
                )}

                {/* Solicitudes Especiales */}
                {selectedBooking.specialRequests && (
                  <div>
                    <Label className="mb-2 block">Solicitudes Especiales</Label>
                    <p className="text-sm text-gray-700 bg-gray-50 p-3 rounded">
                      {selectedBooking.specialRequests}
                    </p>
                  </div>
                )}

                {/* Información de Pago */}
                <div className="border-t pt-4">
                  <h4 className="font-semibold mb-3">Información de Pago</h4>

                  {/* Resumen */}
                  <div className="grid grid-cols-3 gap-2 mb-4">
                    <div className="bg-gray-50 p-3 rounded text-center">
                      <p className="text-xs text-gray-500">Total</p>
                      <p className="text-lg font-bold">${selectedBooking.totalAmount.toLocaleString()}</p>
                    </div>
                    <div className="bg-green-50 p-3 rounded text-center">
                      <p className="text-xs text-gray-500">Pagado</p>
                      <p className="text-lg font-bold text-green-600">${selectedBooking.depositPaid.toLocaleString()}</p>
                    </div>
                    <div className="bg-amber-50 p-3 rounded text-center">
                      <p className="text-xs text-gray-500">Pendiente</p>
                      <p className="text-lg font-bold text-amber-600">${selectedBooking.balanceRemaining.toLocaleString()}</p>
                    </div>
                  </div>

                  {/* Editar monto total */}
                  <div className="flex gap-2 mb-4">
                    <Input
                      type="number"
                      value={paymentData.totalAmount}
                      onChange={(e) => setPaymentData({ ...paymentData, totalAmount: parseFloat(e.target.value) || 0 })}
                      className="flex-1"
                      placeholder="Monto total"
                    />
                    <Button variant="outline" size="sm" onClick={handlePaymentUpdate}>
                      Actualizar Total
                    </Button>
                  </div>

                  {/* Historial de pagos */}
                  <div className="mb-4">
                    <Label className="text-xs text-gray-500 mb-2 block">Historial de Abonos</Label>
                    {selectedBooking.paymentHistory && selectedBooking.paymentHistory.length > 0 ? (
                      <div className="border rounded-lg overflow-hidden">
                        <table className="w-full text-sm">
                          <thead className="bg-gray-50">
                            <tr>
                              <th className="text-left p-2 font-medium">Fecha</th>
                              <th className="text-left p-2 font-medium">Monto</th>
                              <th className="text-left p-2 font-medium">Método</th>
                              <th className="w-8"></th>
                            </tr>
                          </thead>
                          <tbody>
                            {selectedBooking.paymentHistory.map((payment: any, index: number) => (
                              <tr key={index} className="border-t hover:bg-gray-50 group">
                                <td className="p-2">{new Date(payment.date).toLocaleDateString("es-CL")}</td>
                                <td className="p-2 font-medium text-green-600">${payment.amount.toLocaleString()}</td>
                                <td className="p-2 text-gray-600">{payment.method || "-"}</td>
                                <td className="p-2">
                                  <button
                                    onClick={async () => {
                                      if (confirm("¿Eliminar este abono?")) {
                                        try {
                                          await removePayment({ id: selectedBooking._id, paymentIndex: index })
                                          toast.success("Abono eliminado")
                                        } catch (error) {
                                          toast.error("Error al eliminar")
                                        }
                                      }
                                    }}
                                    className="text-red-500 hover:text-red-600 opacity-0 group-hover:opacity-100"
                                  >
                                    <Trash2 className="w-4 h-4" />
                                  </button>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    ) : (
                      <p className="text-sm text-gray-400 text-center py-3 bg-gray-50 rounded">
                        No hay abonos registrados
                      </p>
                    )}
                  </div>

                  {/* Agregar nuevo abono */}
                  <div className="bg-green-50 border border-green-200 rounded-lg p-3">
                    <Label className="text-xs text-green-700 mb-2 block font-medium">Registrar Nuevo Abono</Label>
                    <div className="grid grid-cols-2 gap-2 mb-2">
                      <Input
                        type="number"
                        placeholder="Monto"
                        value={newPayment.amount}
                        onChange={(e) => setNewPayment({ ...newPayment, amount: e.target.value })}
                      />
                      <Input
                        type="date"
                        value={newPayment.date}
                        onChange={(e) => setNewPayment({ ...newPayment, date: e.target.value })}
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-2 mb-2">
                      <select
                        value={newPayment.method}
                        onChange={(e) => setNewPayment({ ...newPayment, method: e.target.value })}
                        className="p-2 border rounded-md text-sm"
                      >
                        <option value="efectivo">Efectivo</option>
                        <option value="transferencia">Transferencia</option>
                        <option value="tarjeta">Tarjeta</option>
                        <option value="cheque">Cheque</option>
                      </select>
                      <Input
                        placeholder="Nota (opcional)"
                        value={newPayment.notes}
                        onChange={(e) => setNewPayment({ ...newPayment, notes: e.target.value })}
                      />
                    </div>
                    <Button
                      onClick={async () => {
                        if (!newPayment.amount || parseFloat(newPayment.amount) <= 0) {
                          toast.error("Ingresa un monto válido")
                          return
                        }
                        try {
                          await addPayment({
                            id: selectedBooking._id,
                            amount: parseFloat(newPayment.amount),
                            date: newPayment.date,
                            method: newPayment.method,
                            notes: newPayment.notes || undefined,
                          })
                          toast.success("Abono registrado")
                          setNewPayment({
                            amount: "",
                            date: new Date().toISOString().split("T")[0],
                            method: "efectivo",
                            notes: "",
                          })
                        } catch (error) {
                          toast.error("Error al registrar abono")
                        }
                      }}
                      className="w-full bg-green-600 hover:bg-green-700"
                      size="sm"
                    >
                      <Plus className="w-4 h-4 mr-1" />
                      Agregar Abono
                    </Button>
                  </div>
                </div>

                {/* Reuniones Vinculadas */}
                <div className="border-t pt-4">
                  <h4 className="font-semibold mb-3">Reuniones Vinculadas</h4>
                  {relatedMeetings === undefined ? (
                    <p className="text-sm text-gray-500">Cargando...</p>
                  ) : relatedMeetings && relatedMeetings.length > 0 ? (
                    <div className="space-y-3">
                      {relatedMeetings.map((meeting: any) => (
                        <div
                          key={meeting._id}
                          className="p-3 bg-purple-50 border border-purple-200 rounded-lg"
                        >
                          <div className="flex items-start justify-between">
                            <div>
                              <p className="font-semibold text-sm">{meeting.title}</p>
                              <p className="text-xs text-purple-700 mt-1">
                                {meeting.meetingType === "consulta_inicial"
                                  ? "Consulta Inicial"
                                  : "Planificación del Evento"}
                              </p>
                              <p className="text-xs text-gray-600 mt-1">
                                📅 {new Date(meeting.meetingDate).toLocaleDateString("es-CL")} - ⏰{" "}
                                {meeting.startTime}
                              </p>
                              {meeting.location && (
                                <p className="text-xs text-gray-600">📍 {meeting.location}</p>
                              )}
                            </div>
                            <Badge variant="outline">{meeting.status}</Badge>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-6 bg-gray-50 rounded-lg border-2 border-dashed">
                      <p className="text-sm text-gray-500">No hay reuniones vinculadas a esta reserva</p>
                      <p className="text-xs text-gray-400 mt-1">
                        Puedes crear reuniones desde la sección Reuniones
                      </p>
                    </div>
                  )}
                </div>
                </div>
              )}

              {/* Tab Content - Timeline */}
              {activeTab === "timeline" && (
                <EventTimeline bookingId={selectedBooking._id} booking={selectedBooking} />
              )}

              {/* Tab Content - Menu */}
              {activeTab === "menu" && (
                <div className="space-y-6">
                  {/* Visualización del Menú Guardado */}
                  {selectedBooking.menuSections && selectedBooking.menuSections.length > 0 && (
                    <div>
                      <h4 className="font-bold mb-6 text-xl">Menú Sugerido</h4>
                      <div className="space-y-8 mb-6">
                        {selectedBooking.menuSections.map((section: any, sectionIndex: number) => (
                          <div key={sectionIndex} className="space-y-6">
                            <h5 className="font-semibold text-lg text-amber-600">{section.name}</h5>
                            <div className="space-y-6">
                              {section.items.map((item: any, itemIndex: number) => (
                                <div key={itemIndex} className="text-center space-y-2">
                                  <p className="font-bold text-base text-gray-900">{item.category}</p>
                                  <div className="space-y-1">
                                    {item.dishes.map((dish: string, dishIndex: number) => (
                                      <p key={dishIndex} className="text-gray-700 text-sm">{dish}</p>
                                    ))}
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Formulario de Edición */}
                  <div className="border-t pt-6">
                    <h4 className="font-semibold mb-3 text-lg">Editar Menú</h4>
                    <div className="bg-blue-50 p-4 rounded-lg mb-4">
                      <p className="text-sm text-blue-800">
                        Configura el menú del evento para poder generar automáticamente la lista de compras.
                      </p>
                    </div>

                    {menuData.map((section, sectionIndex) => (
                    <div key={sectionIndex} className="border rounded-lg p-4 space-y-4">
                      <div className="flex items-center justify-between">
                        <Label>Sección de Menú {sectionIndex + 1}</Label>
                        {menuData.length > 1 && (
                          <Button
                            size="sm"
                            variant="destructive"
                            onClick={() => {
                              const newMenu = menuData.filter((_, i) => i !== sectionIndex)
                              setMenuData(newMenu)
                            }}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        )}
                      </div>

                      <div>
                        <Label>Nombre de la Sección</Label>
                        <Input
                          placeholder="Ej: Almuerzo 13:00 hrs, Cena Buffet"
                          value={section.name}
                          onChange={(e) => {
                            const newMenu = [...menuData]
                            newMenu[sectionIndex].name = e.target.value
                            setMenuData(newMenu)
                          }}
                        />
                      </div>

                      <div className="space-y-3">
                        <Label>Categorías y Platos</Label>
                        {section.items.map((item: any, itemIndex: number) => (
                          <div key={itemIndex} className="border-l-2 border-gray-300 pl-4 space-y-2">
                            <div className="flex items-center justify-between">
                              <Input
                                placeholder="Categoría (Ej: Principal, Ensaladas, Postres)"
                                value={item.category}
                                onChange={(e) => {
                                  const newMenu = [...menuData]
                                  newMenu[sectionIndex].items[itemIndex].category = e.target.value
                                  setMenuData(newMenu)
                                }}
                                className="flex-1"
                              />
                              {section.items.length > 1 && (
                                <Button
                                  size="sm"
                                  variant="ghost"
                                  onClick={() => {
                                    const newMenu = [...menuData]
                                    newMenu[sectionIndex].items = newMenu[sectionIndex].items.filter(
                                      (_: any, i: number) => i !== itemIndex
                                    )
                                    setMenuData(newMenu)
                                  }}
                                >
                                  <Trash2 className="h-4 w-4" />
                                </Button>
                              )}
                            </div>

                            <div className="space-y-1">
                              {item.dishes.map((dish: string, dishIndex: number) => (
                                <div key={dishIndex} className="flex items-center gap-2">
                                  <Input
                                    placeholder="Nombre del plato"
                                    value={dish}
                                    onChange={(e) => {
                                      const newMenu = [...menuData]
                                      newMenu[sectionIndex].items[itemIndex].dishes[dishIndex] = e.target.value
                                      setMenuData(newMenu)
                                    }}
                                    className="flex-1"
                                  />
                                  <Button
                                    size="sm"
                                    variant="ghost"
                                    onClick={() => {
                                      const newMenu = [...menuData]
                                      if (item.dishes.length > 1) {
                                        newMenu[sectionIndex].items[itemIndex].dishes = item.dishes.filter(
                                          (_: string, i: number) => i !== dishIndex
                                        )
                                      }
                                      setMenuData(newMenu)
                                    }}
                                  >
                                    <Trash2 className="h-4 w-4" />
                                  </Button>
                                </div>
                              ))}
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => {
                                  const newMenu = [...menuData]
                                  newMenu[sectionIndex].items[itemIndex].dishes.push("")
                                  setMenuData(newMenu)
                                }}
                                className="w-full mt-1"
                              >
                                <Plus className="h-4 w-4 mr-2" />
                                Añadir Plato
                              </Button>
                            </div>
                          </div>
                        ))}

                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => {
                            const newMenu = [...menuData]
                            newMenu[sectionIndex].items.push({
                              category: "",
                              dishes: [""],
                            })
                            setMenuData(newMenu)
                          }}
                          className="w-full"
                        >
                          <Plus className="h-4 w-4 mr-2" />
                          Añadir Categoría
                        </Button>
                      </div>
                    </div>
                  ))}

                  <Button
                    variant="outline"
                    onClick={() => {
                      setMenuData([
                        ...menuData,
                        {
                          name: "",
                          items: [
                            {
                              category: "",
                              dishes: [""],
                            },
                          ],
                        },
                      ])
                    }}
                    className="w-full"
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Añadir Sección de Menú
                  </Button>

                  <Button onClick={handleMenuUpdate} className="w-full">
                    Guardar Menú
                  </Button>
                  </div>
                </div>
              )}

              {/* Tab Content - Tragos */}
              {activeTab === "tragos" && (
                <DrinkInventory
                  bookingId={selectedBooking._id}
                  guestAccessCode={selectedBooking.guestAccessCode}
                />
              )}
            </>
          )}
        </DialogContent>
      </Dialog>

      {/* Dialog de Confirmación de Eliminación */}
      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirmar Eliminación</DialogTitle>
            <DialogDescription>
              ¿Estás seguro que deseas eliminar esta reserva?
            </DialogDescription>
          </DialogHeader>

          {bookingToDelete && (
            <div className="space-y-4">
              <div className="bg-gray-50 p-4 rounded-lg">
                <p className="font-medium">{bookingToDelete.clientName}</p>
                <p className="text-sm text-gray-600">{bookingToDelete.eventType}</p>
                <p className="text-sm text-gray-600">
                  {new Date(bookingToDelete.eventDate).toLocaleDateString("es-CL")} - {bookingToDelete.numberOfGuests} invitados
                </p>
              </div>

              <p className="text-sm text-gray-600">
                Esta acción no se puede deshacer. La reserva será eliminada permanentemente.
              </p>

              <div className="flex gap-2 justify-end">
                <Button
                  variant="outline"
                  onClick={() => {
                    setDeleteDialogOpen(false)
                    setBookingToDelete(null)
                  }}
                >
                  Cancelar
                </Button>
                <Button
                  variant="destructive"
                  onClick={handleDeleteBooking}
                >
                  <Trash2 className="h-4 w-4 mr-2" />
                  Eliminar Definitivamente
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* AI Event Assistant */}
      {selectedBooking && (
        <AIEventAssistant
          bookingId={selectedBooking._id}
          open={aiAssistantOpen}
          onOpenChange={setAiAssistantOpen}
        />
      )}
    </div>
  )
}

// Componente para Crear Nueva Reserva
function CreateBookingForm({ onClose, createBooking, checkAvailability }: any) {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [selectedServices, setSelectedServices] = useState<string[]>([])
  const [availabilityChecked, setAvailabilityChecked] = useState(false)
  const [isAvailable, setIsAvailable] = useState(false)
  const formRef = useRef<HTMLFormElement>(null)

  const servicesList = [
    "Catering",
    "Decoración",
    "Audio y Video",
    "Fotografía",
    "DJ",
    "Animación",
    "Mobiliario adicional",
    "Servicio de bar",
  ]

  const handleServiceToggle = (service: string) => {
    setSelectedServices(prev =>
      prev.includes(service)
        ? prev.filter(s => s !== service)
        : [...prev, service]
    )
  }

  const handleCheckAvailability = async () => {
    if (!formRef.current) return

    const formData = new FormData(formRef.current)

    const eventDate = formData.get("eventDate") as string
    const startTime = formData.get("startTime") as string
    const endTime = formData.get("endTime") as string

    if (!eventDate || !startTime || !endTime) {
      toast.error("Por favor completa fecha y horarios")
      return
    }

    try {
      const result = await checkAvailability({
        eventDate,
        startTime,
        endTime,
      })

      if (result.available) {
        setIsAvailable(true)
        setAvailabilityChecked(true)
        toast.success("¡Espacio disponible! Puedes continuar con la reserva")
      } else {
        setIsAvailable(false)
        setAvailabilityChecked(true)
        toast.error("El espacio no está disponible en ese horario")
      }
    } catch (error) {
      toast.error("Error al verificar disponibilidad")
    }
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    if (!availabilityChecked || !isAvailable) {
      toast.error("Por favor verifica la disponibilidad primero")
      return
    }

    setIsSubmitting(true)

    const formData = new FormData(e.currentTarget)
    const data = {
      clientName: formData.get("clientName") as string,
      clientEmail: formData.get("clientEmail") as string,
      clientPhone: formData.get("clientPhone") as string,
      eventType: formData.get("eventType") as string,
      eventDate: formData.get("eventDate") as string,
      startTime: formData.get("startTime") as string,
      endTime: formData.get("endTime") as string,
      numberOfGuests: Number(formData.get("numberOfGuests")),
      estimatedGuests: Number(formData.get("estimatedGuests")),
      services: selectedServices,
      specialRequests: formData.get("specialRequests") as string || undefined,
    }

    try {
      await createBooking(data)
      toast.success("Reserva creada exitosamente")
      onClose()
    } catch (error) {
      toast.error("Error al crear la reserva")
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <form ref={formRef} onSubmit={handleSubmit} className="space-y-6">
      {/* Información del Evento */}
      <div className="space-y-4">
        <h3 className="font-semibold text-lg border-b pb-2">Información del Evento</h3>
        
        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label htmlFor="eventDate">Fecha del Evento *</Label>
            <Input 
              id="eventDate" 
              name="eventDate" 
              type="date" 
              required 
              className="mt-1"
              onChange={() => setAvailabilityChecked(false)}
            />
          </div>
          <div>
            <Label htmlFor="eventType">Tipo de Evento *</Label>
            <select 
              id="eventType" 
              name="eventType" 
              className="w-full p-2 border rounded mt-1"
              required
            >
              <option value="">Seleccionar tipo</option>
              <option value="Boda">Boda</option>
              <option value="Cumpleaños">Cumpleaños</option>
              <option value="Evento Corporativo">Evento Corporativo</option>
              <option value="Aniversario">Aniversario</option>
              <option value="Quinceaños">Quinceaños</option>
              <option value="Baby Shower">Baby Shower</option>
              <option value="Otro">Otro</option>
            </select>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label htmlFor="startTime">Hora de Inicio *</Label>
            <Input 
              id="startTime" 
              name="startTime" 
              type="time" 
              required 
              className="mt-1"
              onChange={() => setAvailabilityChecked(false)}
            />
          </div>
          <div>
            <Label htmlFor="endTime">Hora de Término *</Label>
            <Input 
              id="endTime" 
              name="endTime" 
              type="time" 
              required 
              className="mt-1"
              onChange={() => setAvailabilityChecked(false)}
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label htmlFor="numberOfGuests">Número de Invitados *</Label>
            <Input 
              id="numberOfGuests" 
              name="numberOfGuests" 
              type="number" 
              min="1"
              required 
              className="mt-1"
            />
          </div>
          <div>
            <Label htmlFor="estimatedGuests">Invitados Estimados *</Label>
            <Input 
              id="estimatedGuests" 
              name="estimatedGuests" 
              type="number" 
              min="1"
              required 
              className="mt-1"
            />
          </div>
        </div>

        {/* Botón de verificar disponibilidad */}
        <div className="flex items-center gap-3">
          <Button 
            type="button" 
            variant="outline" 
            onClick={handleCheckAvailability}
            className="flex-1"
          >
            Verificar Disponibilidad
          </Button>
          {availabilityChecked && (
            <Badge variant={isAvailable ? "default" : "destructive"}>
              {isAvailable ? "✓ Disponible" : "✗ No disponible"}
            </Badge>
          )}
        </div>
      </div>

      {/* Información del Cliente */}
      <div className="space-y-4">
        <h3 className="font-semibold text-lg border-b pb-2">Información del Cliente</h3>
        
        <div>
          <Label htmlFor="clientName">Nombre Completo *</Label>
          <Input 
            id="clientName" 
            name="clientName" 
            required 
            className="mt-1"
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label htmlFor="clientEmail">Email *</Label>
            <Input 
              id="clientEmail" 
              name="clientEmail" 
              type="email" 
              required 
              className="mt-1"
            />
          </div>
          <div>
            <Label htmlFor="clientPhone">Teléfono *</Label>
            <Input 
              id="clientPhone" 
              name="clientPhone" 
              type="tel" 
              required 
              className="mt-1"
            />
          </div>
        </div>
      </div>

      {/* Servicios */}
      <div className="space-y-4">
        <div className="flex justify-between items-center border-b pb-2">
          <h3 className="font-semibold text-lg">Servicios</h3>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => {
              if (selectedServices.length === servicesList.length) {
                setSelectedServices([])
              } else {
                setSelectedServices([...servicesList])
              }
            }}
          >
            {selectedServices.length === servicesList.length ? "Deseleccionar Todos" : "Seleccionar Todos"}
          </Button>
        </div>
        <div className="grid grid-cols-2 gap-3">
          {servicesList.map((service) => (
            <label key={service} className="flex items-center space-x-2 cursor-pointer">
              <input
                type="checkbox"
                checked={selectedServices.includes(service)}
                onChange={() => handleServiceToggle(service)}
                className="w-4 h-4"
              />
              <span className="text-sm">{service}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Solicitudes Especiales */}
      <div>
        <Label htmlFor="specialRequests">Solicitudes Especiales</Label>
        <Textarea 
          id="specialRequests" 
          name="specialRequests" 
          rows={3}
          className="mt-1"
          placeholder="Cualquier requerimiento especial para el evento..."
        />
      </div>

      {/* Botones */}
      <div className="flex justify-end gap-3 pt-4 border-t">
        <Button type="button" variant="outline" onClick={onClose}>
          Cancelar
        </Button>
        <Button 
          type="submit" 
          disabled={isSubmitting || !availabilityChecked || !isAvailable}
          className="bg-blue-600 hover:bg-blue-700"
        >
          {isSubmitting ? "Creando..." : "Crear Reserva"}
        </Button>
      </div>
    </form>
  )
}
