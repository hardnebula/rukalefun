"use client"

import { useState } from "react"
import { useQuery, useMutation } from "convex/react"
import { api } from "@/convex/_generated/api"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { 
  Users, 
  UserPlus, 
  Calendar, 
  DollarSign, 
  CheckCircle, 
  XCircle,
  Clock,
  Edit,
  Trash2
} from "lucide-react"
import { toast } from "sonner"

type TabType = "personal" | "asignaciones" | "pagos"

export default function RecursosPage() {
  const [activeTab, setActiveTab] = useState<TabType>("personal")
  const [isAddStaffOpen, setIsAddStaffOpen] = useState(false)
  const [isAddAssignmentOpen, setIsAddAssignmentOpen] = useState(false)

  return (
    <div className="p-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Gestión de Personal</h1>
        <p className="text-gray-600">
          Administra la nómina de garzones y personal para eventos
        </p>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 mb-6 border-b">
        <button
          onClick={() => setActiveTab("personal")}
          className={`px-4 py-2 font-medium transition-colors ${
            activeTab === "personal"
              ? "text-blue-600 border-b-2 border-blue-600"
              : "text-gray-600 hover:text-gray-900"
          }`}
        >
          <Users className="inline-block w-4 h-4 mr-2" />
          Personal
        </button>
        <button
          onClick={() => setActiveTab("asignaciones")}
          className={`px-4 py-2 font-medium transition-colors ${
            activeTab === "asignaciones"
              ? "text-blue-600 border-b-2 border-blue-600"
              : "text-gray-600 hover:text-gray-900"
          }`}
        >
          <Calendar className="inline-block w-4 h-4 mr-2" />
          Asignaciones
        </button>
        <button
          onClick={() => setActiveTab("pagos")}
          className={`px-4 py-2 font-medium transition-colors ${
            activeTab === "pagos"
              ? "text-blue-600 border-b-2 border-blue-600"
              : "text-gray-600 hover:text-gray-900"
          }`}
        >
          <DollarSign className="inline-block w-4 h-4 mr-2" />
          Pagos
        </button>
      </div>

      {/* Tab Content */}
      {activeTab === "personal" && <PersonalTab />}
      {activeTab === "asignaciones" && <AsignacionesTab />}
      {activeTab === "pagos" && <PagosTab />}
    </div>
  )
}

// ============== TAB DE PERSONAL ==============

function PersonalTab() {
  const staff = useQuery(api.staff.getAllStaff)
  const [isAddStaffOpen, setIsAddStaffOpen] = useState(false)
  const [editingStaff, setEditingStaff] = useState<any>(null)

  if (staff === undefined) {
    return <div className="text-center py-8">Cargando personal...</div>
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <div>
          <p className="text-sm text-gray-600">
            Total: {staff.length} personas
          </p>
        </div>
        <Button onClick={() => setIsAddStaffOpen(true)}>
          <UserPlus className="w-4 h-4 mr-2" />
          Agregar Personal
        </Button>
      </div>

      {/* Modal de Agregar/Editar Personal */}
      <Dialog open={isAddStaffOpen || !!editingStaff} onOpenChange={(open) => {
        setIsAddStaffOpen(open)
        if (!open) setEditingStaff(null)
      }}>
        <DialogContent 
          open={isAddStaffOpen || !!editingStaff}
          onClose={() => {
            setIsAddStaffOpen(false)
            setEditingStaff(null)
          }}
        >
          <DialogHeader>
            <DialogTitle>
              {editingStaff ? "Editar Personal" : "Agregar Personal"}
            </DialogTitle>
          </DialogHeader>
          <StaffForm 
            staff={editingStaff}
            onClose={() => {
              setIsAddStaffOpen(false)
              setEditingStaff(null)
            }}
          />
        </DialogContent>
      </Dialog>

      <div className="hidden">
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-3">
        {staff.map((person) => (
          <Card key={person._id} className="hover:shadow-md transition-shadow">
            <CardContent className="p-4">
              <div className="flex items-start justify-between mb-2">
                <div className="flex-1 min-w-0">
                  <h3 className="text-base font-semibold truncate">{person.name}</h3>
                  <div className="flex items-center gap-1.5 mt-1">
                    <Badge variant="outline" className="text-xs">{person.role}</Badge>
                    <Badge variant={person.isActive ? "default" : "secondary"} className="text-xs">
                      {person.isActive ? "Activo" : "Inactivo"}
                    </Badge>
                  </div>
                </div>
                <div className="flex gap-1 ml-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-8 w-8 p-0"
                    onClick={() => setEditingStaff(person)}
                  >
                    <Edit className="w-4 h-4" />
                  </Button>
                  <DeleteStaffButton staffId={person._id} />
                </div>
              </div>
              
              <div className="space-y-1 text-xs">
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Teléfono:</span>
                  <span className="font-medium">{person.phone}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Tarifa/evento:</span>
                  <span className="font-semibold text-green-600">${person.ratePerEvent.toLocaleString()}</span>
                </div>
                {person.ratePerHour && (
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600">Tarifa/hora:</span>
                    <span className="font-medium">${person.ratePerHour.toLocaleString()}</span>
                  </div>
                )}
              </div>
              
              {person.notes && (
                <p className="text-xs text-gray-500 mt-2 line-clamp-2">{person.notes}</p>
              )}
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}

function StaffForm({ staff, onClose }: { staff?: any, onClose: () => void }) {
  const createStaff = useMutation(api.staff.createStaff)
  const updateStaff = useMutation(api.staff.updateStaff)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsSubmitting(true)

    const formData = new FormData(e.currentTarget)
    const data = {
      name: formData.get("name") as string,
      role: formData.get("role") as string,
      phone: formData.get("phone") as string,
      email: formData.get("email") as string || undefined,
      ratePerEvent: Number(formData.get("ratePerEvent")),
      ratePerHour: formData.get("ratePerHour") 
        ? Number(formData.get("ratePerHour")) 
        : undefined,
      notes: formData.get("notes") as string || undefined,
      isActive: formData.get("isActive") === "true",
    }

    try {
      if (staff) {
        await updateStaff({ id: staff._id, ...data })
        toast.success("Personal actualizado exitosamente")
      } else {
        await createStaff(data)
        toast.success("Personal agregado exitosamente")
      }
      onClose()
    } catch (error) {
      toast.error("Error al guardar personal")
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <Label htmlFor="name">Nombre completo *</Label>
        <Input 
          id="name" 
          name="name" 
          defaultValue={staff?.name}
          required 
        />
      </div>
      <div>
        <Label htmlFor="role">Rol *</Label>
        <select 
          id="role" 
          name="role" 
          defaultValue={staff?.role}
          className="w-full p-2 border rounded"
          required
        >
          <option value="">Seleccionar rol</option>
          <option value="Garzón">Garzón</option>
          <option value="Cocina">Cocina</option>
          <option value="Diseño">Diseño</option>
          <option value="DJ">DJ</option>
          <option value="Animación">Animación</option>
          <option value="Fotografía">Fotografía</option>
        </select>
      </div>
      <div>
        <Label htmlFor="phone">Teléfono *</Label>
        <Input 
          id="phone" 
          name="phone" 
          type="tel"
          defaultValue={staff?.phone}
          required 
        />
      </div>
      <div>
        <Label htmlFor="email">Email</Label>
        <Input 
          id="email" 
          name="email" 
          type="email"
          defaultValue={staff?.email}
        />
      </div>
      <div>
        <Label htmlFor="ratePerEvent">Tarifa por evento *</Label>
        <Input 
          id="ratePerEvent" 
          name="ratePerEvent" 
          type="number"
          defaultValue={staff?.ratePerEvent}
          required 
        />
      </div>
      <div>
        <Label htmlFor="ratePerHour">Tarifa por hora (opcional)</Label>
        <Input 
          id="ratePerHour" 
          name="ratePerHour" 
          type="number"
          defaultValue={staff?.ratePerHour}
        />
      </div>
      <div>
        <Label htmlFor="notes">Notas</Label>
        <Input 
          id="notes" 
          name="notes"
          defaultValue={staff?.notes}
        />
      </div>
      <div className="flex items-center gap-2">
        <input 
          type="checkbox" 
          id="isActive" 
          name="isActive"
          value="true"
          defaultChecked={staff?.isActive ?? true}
          className="w-4 h-4"
        />
        <Label htmlFor="isActive">Personal activo</Label>
      </div>
      <div className="flex justify-end gap-2">
        <Button type="button" variant="outline" onClick={onClose}>
          Cancelar
        </Button>
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? "Guardando..." : (staff ? "Actualizar" : "Agregar")}
        </Button>
      </div>
    </form>
  )
}

function DeleteStaffButton({ staffId }: { staffId: any }) {
  const deleteStaff = useMutation(api.staff.deleteStaff)
  const [isDeleting, setIsDeleting] = useState(false)

  const handleDelete = async () => {
    if (!confirm("¿Estás seguro de eliminar este personal?")) return
    
    setIsDeleting(true)
    try {
      await deleteStaff({ id: staffId })
      toast.success("Personal eliminado")
    } catch (error) {
      toast.error("Error al eliminar personal")
    } finally {
      setIsDeleting(false)
    }
  }

  return (
    <Button
      variant="ghost"
      size="sm"
      className="h-8 w-8 p-0"
      onClick={handleDelete}
      disabled={isDeleting}
    >
      <Trash2 className="w-4 h-4 text-red-600" />
    </Button>
  )
}

// ============== TAB DE ASIGNACIONES ==============

function AsignacionesTab() {
  const assignments = useQuery(api.staff.getAllAssignments)
  const [isAddAssignmentOpen, setIsAddAssignmentOpen] = useState(false)

  if (assignments === undefined) {
    return <div className="text-center py-8">Cargando asignaciones...</div>
  }

  // Agrupar por evento
  const assignmentsByBooking = assignments.reduce((acc: any, assignment: any) => {
    const bookingId = assignment.booking?._id
    if (!bookingId) return acc
    
    if (!acc[bookingId]) {
      acc[bookingId] = {
        booking: assignment.booking,
        assignments: []
      }
    }
    acc[bookingId].assignments.push(assignment)
    return acc
  }, {})

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <div>
          <p className="text-sm text-gray-600">
            Total asignaciones: {assignments.length}
          </p>
        </div>
        <Button onClick={() => setIsAddAssignmentOpen(true)}>
          <UserPlus className="w-4 h-4 mr-2" />
          Asignar Personal a Evento
        </Button>
      </div>

      {/* Modal de Asignar Personal */}
      <Dialog open={isAddAssignmentOpen} onOpenChange={setIsAddAssignmentOpen}>
        <DialogContent 
          open={isAddAssignmentOpen}
          onClose={() => setIsAddAssignmentOpen(false)}
          className="max-w-2xl max-h-[90vh] overflow-y-auto"
        >
          <DialogHeader>
            <DialogTitle className="text-xl">🎯 Asignar Personal al Evento</DialogTitle>
          </DialogHeader>
          <AssignmentForm onClose={() => setIsAddAssignmentOpen(false)} />
        </DialogContent>
      </Dialog>

      <div className="hidden">
      </div>

      <div className="space-y-6">
        {Object.values(assignmentsByBooking).map((group: any) => (
          <Card key={group.booking._id}>
            <CardHeader>
              <CardTitle className="text-lg">
                {group.booking.eventType} - {group.booking.clientName}
              </CardTitle>
              <p className="text-sm text-gray-600">
                {new Date(group.booking.eventDate).toLocaleDateString("es-CL")} | 
                {group.booking.startTime} - {group.booking.endTime} | 
                {group.booking.space?.name}
              </p>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {group.assignments.map((assignment: any) => (
                  <AssignmentCard key={assignment._id} assignment={assignment} />
                ))}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}

function AssignmentCard({ assignment }: { assignment: any }) {
  const confirmAttendance = useMutation(api.staff.confirmAttendance)
  const deleteAssignment = useMutation(api.staff.deleteAssignment)
  const [isDeleting, setIsDeleting] = useState(false)

  const handleConfirmAttendance = async (confirmed: boolean) => {
    try {
      await confirmAttendance({
        id: assignment._id,
        confirmedAttendance: confirmed
      })
      toast.success(confirmed ? "Asistencia confirmada" : "Asistencia cancelada")
    } catch (error) {
      toast.error("Error al actualizar asistencia")
    }
  }

  const handleDelete = async () => {
    if (!confirm("¿Eliminar esta asignación?")) return
    setIsDeleting(true)
    try {
      await deleteAssignment({ id: assignment._id })
      toast.success("Asignación eliminada")
    } catch (error) {
      toast.error("Error al eliminar")
    } finally {
      setIsDeleting(false)
    }
  }

  return (
    <div className="flex items-center justify-between p-4 border rounded-lg">
      <div className="flex-1">
        <div className="flex items-center gap-2 mb-1">
          <h4 className="font-semibold">{assignment.staff?.name}</h4>
          <Badge variant="outline">{assignment.role}</Badge>
          <Badge variant={assignment.confirmedAttendance ? "default" : "secondary"}>
            {assignment.confirmedAttendance ? (
              <>
                <CheckCircle className="w-3 h-3 mr-1" />
                Confirmado
              </>
            ) : (
              <>
                <Clock className="w-3 h-3 mr-1" />
                Pendiente
              </>
            )}
          </Badge>
        </div>
        <div className="text-sm text-gray-600">
          <span>{assignment.scheduledStartTime} - {assignment.scheduledEndTime}</span>
          <span className="mx-2">•</span>
          <span className="font-medium">${assignment.amountToPay.toLocaleString()}</span>
        </div>
        {assignment.notes && (
          <p className="text-sm text-gray-500 mt-1">{assignment.notes}</p>
        )}
      </div>
      <div className="flex gap-2">
        {!assignment.confirmedAttendance && (
          <Button
            size="sm"
            onClick={() => handleConfirmAttendance(true)}
          >
            <CheckCircle className="w-4 h-4 mr-1" />
            Confirmar
          </Button>
        )}
        {assignment.confirmedAttendance && (
          <Button
            size="sm"
            variant="outline"
            onClick={() => handleConfirmAttendance(false)}
          >
            <XCircle className="w-4 h-4 mr-1" />
            Cancelar
          </Button>
        )}
        <Button
          size="sm"
          variant="outline"
          onClick={handleDelete}
          disabled={isDeleting}
        >
          <Trash2 className="w-4 h-4 text-red-600" />
        </Button>
      </div>
    </div>
  )
}

function AssignmentForm({ onClose }: { onClose: () => void }) {
  const bookings = useQuery(api.bookings.getAllBookings)
  const staff = useQuery(api.staff.getActiveStaff)
  const createAssignment = useMutation(api.staff.createAssignment)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [selectedBooking, setSelectedBooking] = useState<any>(null)
  const [selectedStaff, setSelectedStaff] = useState<any>(null)
  const [searchQuery, setSearchQuery] = useState("")
  const [roleFilter, setRoleFilter] = useState("all")

  // Obtener asignaciones existentes para el evento seleccionado
  const existingAssignments = useQuery(
    api.staff.getAssignmentsByBooking,
    selectedBooking ? { bookingId: selectedBooking._id } : "skip"
  )

  const [formData, setFormData] = useState({
    role: "",
    scheduledStartTime: "",
    scheduledEndTime: "",
    amountToPay: 0,
    notes: "",
  })

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (!selectedBooking || !selectedStaff) {
      toast.error("Selecciona un evento y un personal")
      return
    }

    setIsSubmitting(true)

    const data = {
      bookingId: selectedBooking._id,
      staffId: selectedStaff._id,
      role: formData.role,
      scheduledStartTime: formData.scheduledStartTime,
      scheduledEndTime: formData.scheduledEndTime,
      amountToPay: formData.amountToPay,
      notes: formData.notes || undefined,
    }

    try {
      await createAssignment(data)
      toast.success("Personal asignado exitosamente")
      onClose()
    } catch (error) {
      toast.error("Error al asignar personal")
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleStaffSelect = (person: any) => {
    setSelectedStaff(person)
    // Auto-completar datos
    setFormData(prev => ({
      ...prev,
      role: person.role,
      amountToPay: person.ratePerEvent,
      scheduledStartTime: selectedBooking?.startTime || "",
      scheduledEndTime: selectedBooking?.endTime || "",
    }))
  }

  if (!bookings || !staff) {
    return <div className="text-center py-4">Cargando...</div>
  }

  // Filtrar solo eventos futuros o de hoy
  const upcomingBookings = bookings.filter((booking: any) => {
    const eventDate = new Date(booking.eventDate)
    const today = new Date()
    today.setHours(0, 0, 0, 0)
    return eventDate >= today
  })

  // Filtrar personal ya asignado al evento seleccionado
  const assignedStaffIds = new Set(
    existingAssignments?.map((assignment: any) => assignment.staffId) || []
  )
  const availableStaff = staff.filter((person: any) => {
    const notAssigned = !assignedStaffIds.has(person._id)
    const matchesSearch = person.name.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesRole = roleFilter === "all" || person.role === roleFilter
    return notAssigned && matchesSearch && matchesRole
  })

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Selección de Evento */}
      <div>
        <Label className="text-lg font-semibold mb-3 block flex items-center gap-2">
          <Calendar className="w-5 h-5 text-blue-600" />
          Paso 1: Selecciona el Evento
        </Label>

        <div className="grid grid-cols-1 gap-3 max-h-64 overflow-y-auto pr-2">
          {upcomingBookings.length === 0 ? (
            <p className="text-center text-gray-500 py-8">No hay eventos próximos</p>
          ) : (
            upcomingBookings.map((booking: any) => (
              <Card
                key={booking._id}
                className={`cursor-pointer transition-all hover:shadow-md ${
                  selectedBooking?._id === booking._id
                    ? "ring-2 ring-blue-500 bg-blue-50"
                    : "hover:border-blue-300"
                }`}
                onClick={() => {
                  setSelectedBooking(booking)
                  setSelectedStaff(null)
                  setFormData(prev => ({
                    ...prev,
                    scheduledStartTime: booking.startTime,
                    scheduledEndTime: booking.endTime,
                  }))
                }}
              >
                <CardContent className="p-4">
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="font-semibold text-base truncate">{booking.eventType}</h3>
                        <Badge variant="outline" className="text-xs">{booking.status}</Badge>
                      </div>
                      <p className="text-sm text-gray-600 truncate">{booking.clientName}</p>
                      <div className="flex items-center gap-4 mt-2 text-xs text-gray-500">
                        <span>📅 {new Date(booking.eventDate).toLocaleDateString("es-CL")}</span>
                        <span>🕐 {booking.startTime} - {booking.endTime}</span>
                        <span>👥 {booking.numberOfGuests} personas</span>
                      </div>
                    </div>
                    {selectedBooking?._id === booking._id && (
                      <CheckCircle className="w-6 h-6 text-blue-600 flex-shrink-0" />
                    )}
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </div>
      </div>

      {/* Selección de Personal */}
      <div className={!selectedBooking ? "opacity-50 pointer-events-none" : ""}>
        <Label className="text-lg font-semibold mb-3 block flex items-center gap-2">
          <Users className="w-5 h-5 text-green-600" />
          Paso 2: Selecciona el Personal
        </Label>

        {!selectedBooking ? (
          <p className="text-center text-gray-400 py-8 border-2 border-dashed rounded-lg">
            Primero selecciona un evento
          </p>
        ) : (
          <>
            {/* Filtros y búsqueda */}
            <div className="flex gap-2 mb-3">
              <Input
                placeholder="🔍 Buscar por nombre..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="flex-1"
              />
              <select
                value={roleFilter}
                onChange={(e) => setRoleFilter(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-lg text-sm"
              >
                <option value="all">Todos los roles</option>
                <option value="Garzón">Garzón</option>
                <option value="Cocina">Cocina</option>
                <option value="Diseño">Diseño</option>
                <option value="DJ">DJ</option>
                <option value="Animación">Animación</option>
                <option value="Fotografía">Fotografía</option>
              </select>
            </div>

            {existingAssignments && existingAssignments.length > 0 && (
              <p className="text-xs text-blue-600 bg-blue-50 p-2 rounded mb-3">
                ℹ️ {existingAssignments.length} persona{existingAssignments.length !== 1 ? 's' : ''} ya asignada{existingAssignments.length !== 1 ? 's' : ''}
                {availableStaff.length > 0 && ` • ${availableStaff.length} disponible${availableStaff.length !== 1 ? 's' : ''}`}
              </p>
            )}

            <div className="grid grid-cols-2 gap-3 max-h-80 overflow-y-auto pr-2">
              {availableStaff.length === 0 ? (
                <div className="col-span-2 text-center text-gray-500 py-8">
                  {searchQuery || roleFilter !== "all"
                    ? "No se encontró personal con los filtros aplicados"
                    : "Todo el personal ya está asignado a este evento"}
                </div>
              ) : (
                availableStaff.map((person: any) => (
                  <Card
                    key={person._id}
                    className={`cursor-pointer transition-all hover:shadow-md ${
                      selectedStaff?._id === person._id
                        ? "ring-2 ring-green-500 bg-green-50"
                        : "hover:border-green-300"
                    }`}
                    onClick={() => handleStaffSelect(person)}
                  >
                    <CardContent className="p-3">
                      <div className="flex items-start gap-2">
                        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-green-400 to-blue-500 flex items-center justify-center text-white font-bold text-sm flex-shrink-0">
                          {person.name.split(' ').map((n: string) => n[0]).join('').slice(0, 2)}
                        </div>
                        <div className="flex-1 min-w-0">
                          <h4 className="font-semibold text-sm truncate">{person.name}</h4>
                          <Badge variant="outline" className="text-xs mt-1">{person.role}</Badge>
                          <div className="mt-2 space-y-0.5">
                            <p className="text-xs text-gray-600">📞 {person.phone}</p>
                            <p className="text-xs font-semibold text-green-600">
                              ${person.ratePerEvent.toLocaleString()}/evento
                            </p>
                          </div>
                        </div>
                        {selectedStaff?._id === person._id && (
                          <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0" />
                        )}
                      </div>
                    </CardContent>
                  </Card>
                ))
              )}
            </div>
          </>
        )}
      </div>

      {/* Detalles de la Asignación */}
      <div className={`border-t pt-4 ${!selectedStaff ? "opacity-50 pointer-events-none" : ""}`}>
        <Label className="text-lg font-semibold mb-3 block flex items-center gap-2">
          <Edit className="w-5 h-5 text-purple-600" />
          Paso 3: Detalles de la Asignación
        </Label>

        {!selectedStaff ? (
          <p className="text-center text-gray-400 py-8 border-2 border-dashed rounded-lg">
            Primero selecciona un evento y un personal
          </p>
        ) : (
          <div className="space-y-4">
            <div>
              <Label htmlFor="role" className="text-sm font-medium">Rol en este evento *</Label>
              <select
                id="role"
                value={formData.role}
                onChange={(e) => setFormData(prev => ({ ...prev, role: e.target.value }))}
                className="w-full p-2 border border-gray-300 rounded-lg mt-1"
                required
              >
                <option value="">Seleccionar rol...</option>
                <option value="Garzón">Garzón</option>
                <option value="Cocina">Cocina</option>
                <option value="Diseño">Diseño</option>
                <option value="DJ">DJ</option>
                <option value="Animación">Animación</option>
                <option value="Fotografía">Fotografía</option>
              </select>
              <p className="text-xs text-gray-500 mt-1">Se auto-completa, pero puedes cambiarlo si es necesario</p>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <Label htmlFor="scheduledStartTime" className="text-sm font-medium">Hora inicio *</Label>
                <Input
                  id="scheduledStartTime"
                  type="time"
                  value={formData.scheduledStartTime}
                  onChange={(e) => setFormData(prev => ({ ...prev, scheduledStartTime: e.target.value }))}
                  className="mt-1"
                  required
                />
              </div>
              <div>
                <Label htmlFor="scheduledEndTime" className="text-sm font-medium">Hora fin *</Label>
                <Input
                  id="scheduledEndTime"
                  type="time"
                  value={formData.scheduledEndTime}
                  onChange={(e) => setFormData(prev => ({ ...prev, scheduledEndTime: e.target.value }))}
                  className="mt-1"
                  required
                />
              </div>
            </div>

            <div>
              <Label htmlFor="amountToPay" className="text-sm font-medium">Monto a pagar *</Label>
              <div className="relative mt-1">
                <span className="absolute left-3 top-2.5 text-gray-500">$</span>
                <Input
                  id="amountToPay"
                  type="number"
                  value={formData.amountToPay}
                  onChange={(e) => setFormData(prev => ({ ...prev, amountToPay: Number(e.target.value) }))}
                  className="pl-7"
                  placeholder="0"
                  required
                />
              </div>
              <p className="text-xs text-gray-500 mt-1">Se auto-completa con la tarifa estándar</p>
            </div>

            <div>
              <Label htmlFor="notes" className="text-sm font-medium">Notas adicionales</Label>
              <Input
                id="notes"
                value={formData.notes}
                onChange={(e) => setFormData(prev => ({ ...prev, notes: e.target.value }))}
                className="mt-1"
                placeholder="Ej: Llegar 30 min antes, traer uniforme especial..."
              />
            </div>
          </div>
        )}
      </div>

      {/* Botones */}
      <div className="flex justify-between items-center gap-3 pt-4 border-t bg-gray-50 -mx-6 -mb-6 px-6 py-4 rounded-b-lg">
        <div className="text-sm text-gray-600">
          {selectedBooking && selectedStaff ? (
            <span className="font-medium text-green-600">✓ Listo para asignar</span>
          ) : (
            <span>Completa los pasos para continuar</span>
          )}
        </div>
        <div className="flex gap-2">
          <Button type="button" variant="outline" onClick={onClose}>
            Cancelar
          </Button>
          <Button
            type="submit"
            disabled={isSubmitting || !selectedBooking || !selectedStaff || !formData.role}
            className="bg-gradient-to-r from-blue-600 to-green-600 hover:from-blue-700 hover:to-green-700"
          >
            {isSubmitting ? "Asignando..." : "✓ Asignar Personal"}
          </Button>
        </div>
      </div>
    </form>
  )
}

// ============== TAB DE PAGOS ==============

function PagosTab() {
  const pendingPayments = useQuery(api.staff.getPendingPayments)
  const paidPayments = useQuery(api.staff.getPaidPayments)
  const paymentSummary = useQuery(api.staff.getPaymentSummary)
  const updatePaymentStatus = useMutation(api.staff.updatePaymentStatus)
  const [viewMode, setViewMode] = useState<"pending" | "paid">("pending")

  const handleMarkAsPaid = async (assignmentId: any) => {
    try {
      await updatePaymentStatus({
        id: assignmentId,
        paymentStatus: "paid",
        paymentDate: new Date().toISOString().split('T')[0],
        paymentMethod: "Efectivo", // Podrías agregar un diálogo para seleccionar
      })
      toast.success("Pago registrado exitosamente")
    } catch (error) {
      toast.error("Error al registrar pago")
    }
  }

  if (pendingPayments === undefined || paidPayments === undefined || paymentSummary === undefined) {
    return <div className="text-center py-8">Cargando pagos...</div>
  }

  // Agrupar pagos pendientes por evento
  const pendingByBooking = pendingPayments.reduce((acc: any, payment: any) => {
    const bookingId = payment.booking?._id
    if (!bookingId) return acc

    if (!acc[bookingId]) {
      acc[bookingId] = {
        booking: payment.booking,
        payments: []
      }
    }
    acc[bookingId].payments.push(payment)
    return acc
  }, {})

  // Agrupar pagos realizados por evento
  const paidByBooking = paidPayments.reduce((acc: any, payment: any) => {
    const bookingId = payment.booking?._id
    if (!bookingId) return acc

    if (!acc[bookingId]) {
      acc[bookingId] = {
        booking: payment.booking,
        payments: []
      }
    }
    acc[bookingId].payments.push(payment)
    return acc
  }, {})

  return (
    <div>
      {/* Resumen */}
      <div className="grid grid-cols-3 gap-4 mb-8">
        <Card className="cursor-pointer hover:shadow-lg transition-shadow" onClick={() => setViewMode("pending")}>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Pagos Pendientes</p>
                <p className="text-2xl font-bold text-orange-600">
                  ${paymentSummary.totalPending.toLocaleString()}
                </p>
                <p className="text-xs text-gray-500">{paymentSummary.countPending} asignaciones</p>
              </div>
              <Clock className="w-10 h-10 text-orange-600" />
            </div>
          </CardContent>
        </Card>

        <Card className="cursor-pointer hover:shadow-lg transition-shadow" onClick={() => setViewMode("paid")}>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Pagos Realizados</p>
                <p className="text-2xl font-bold text-green-600">
                  ${paymentSummary.totalPaid.toLocaleString()}
                </p>
                <p className="text-xs text-gray-500">{paymentSummary.countPaid} asignaciones</p>
              </div>
              <CheckCircle className="w-10 h-10 text-green-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total</p>
                <p className="text-2xl font-bold text-gray-900">
                  ${(paymentSummary.totalPending + paymentSummary.totalPaid).toLocaleString()}
                </p>
                <p className="text-xs text-gray-500">
                  {paymentSummary.countPending + paymentSummary.countPaid} asignaciones
                </p>
              </div>
              <DollarSign className="w-10 h-10 text-gray-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Toggle entre Pendientes y Realizados */}
      <div className="flex gap-2 mb-6 border-b">
        <button
          onClick={() => setViewMode("pending")}
          className={`px-4 py-2 font-medium transition-colors ${
            viewMode === "pending"
              ? "text-orange-600 border-b-2 border-orange-600"
              : "text-gray-600 hover:text-gray-900"
          }`}
        >
          <Clock className="inline-block w-4 h-4 mr-2" />
          Pendientes ({paymentSummary.countPending})
        </button>
        <button
          onClick={() => setViewMode("paid")}
          className={`px-4 py-2 font-medium transition-colors ${
            viewMode === "paid"
              ? "text-green-600 border-b-2 border-green-600"
              : "text-gray-600 hover:text-gray-900"
          }`}
        >
          <CheckCircle className="inline-block w-4 h-4 mr-2" />
          Realizados ({paymentSummary.countPaid})
        </button>
      </div>

      {/* Lista de pagos pendientes */}
      {viewMode === "pending" && (
        <div>
          {Object.keys(pendingByBooking).length === 0 ? (
            <Card>
              <CardContent className="py-12">
                <div className="text-center">
                  <CheckCircle className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                  <p className="text-gray-600 font-medium">No hay pagos pendientes</p>
                  <p className="text-sm text-gray-500 mt-1">¡Todos los pagos están al día!</p>
                </div>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-6">
              {Object.values(pendingByBooking).map((group: any) => {
                const totalPending = group.payments.reduce((sum: number, p: any) => sum + p.amountToPay, 0)
                return (
                  <Card key={group.booking._id} className="border-l-4 border-l-orange-500">
                    <CardHeader className="bg-orange-50/50">
                      <div className="flex items-start justify-between">
                        <div>
                          <CardTitle className="text-lg">
                            {group.booking.eventType} - {group.booking.clientName}
                          </CardTitle>
                          <p className="text-sm text-gray-600 mt-1">
                            📅 {new Date(group.booking.eventDate).toLocaleDateString("es-CL")} |
                            ⏰ {group.booking.startTime} - {group.booking.endTime}
                            {group.booking.space?.name && ` | 📍 ${group.booking.space.name}`}
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="text-xs text-gray-600">Total pendiente</p>
                          <p className="text-xl font-bold text-orange-600">${totalPending.toLocaleString()}</p>
                          <p className="text-xs text-gray-500">{group.payments.length} pago{group.payments.length !== 1 ? 's' : ''}</p>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent className="pt-4">
                      <div className="space-y-3">
                        {group.payments.map((payment: any) => (
                          <div key={payment._id} className="flex items-center justify-between p-3 border rounded-lg hover:bg-gray-50 transition-colors">
                            <div className="flex-1">
                              <div className="flex items-center gap-2 mb-1">
                                <h4 className="font-semibold text-sm">{payment.staff?.name}</h4>
                                <Badge variant="outline" className="text-xs">{payment.role}</Badge>
                                <Badge variant={payment.confirmedAttendance ? "default" : "secondary"} className="text-xs">
                                  {payment.confirmedAttendance ? "Confirmado" : "Sin confirmar"}
                                </Badge>
                              </div>
                              <p className="text-xs text-gray-500">
                                {payment.scheduledStartTime} - {payment.scheduledEndTime}
                              </p>
                            </div>
                            <div className="flex items-center gap-3">
                              <p className="text-lg font-bold text-gray-900">
                                ${payment.amountToPay.toLocaleString()}
                              </p>
                              <Button
                                onClick={() => handleMarkAsPaid(payment._id)}
                                disabled={!payment.confirmedAttendance}
                                size="sm"
                                className="bg-green-600 hover:bg-green-700"
                              >
                                <CheckCircle className="w-4 h-4 mr-1" />
                                Marcar Pagado
                              </Button>
                            </div>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                )
              })}
            </div>
          )}
        </div>
      )}

      {/* Lista de pagos realizados */}
      {viewMode === "paid" && (
        <div>
          {Object.keys(paidByBooking).length === 0 ? (
            <Card>
              <CardContent className="py-12">
                <div className="text-center">
                  <DollarSign className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                  <p className="text-gray-600 font-medium">No hay pagos realizados aún</p>
                  <p className="text-sm text-gray-500 mt-1">Los pagos completados aparecerán aquí</p>
                </div>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-6">
              {Object.values(paidByBooking).map((group: any) => {
                const totalPaid = group.payments.reduce((sum: number, p: any) => sum + p.amountToPay, 0)
                return (
                  <Card key={group.booking._id} className="border-l-4 border-l-green-500">
                    <CardHeader className="bg-green-50/50">
                      <div className="flex items-start justify-between">
                        <div>
                          <CardTitle className="text-lg flex items-center gap-2">
                            <CheckCircle className="w-5 h-5 text-green-600" />
                            {group.booking.eventType} - {group.booking.clientName}
                          </CardTitle>
                          <p className="text-sm text-gray-600 mt-1">
                            📅 {new Date(group.booking.eventDate).toLocaleDateString("es-CL")} |
                            ⏰ {group.booking.startTime} - {group.booking.endTime}
                            {group.booking.space?.name && ` | 📍 ${group.booking.space.name}`}
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="text-xs text-gray-600">Total pagado</p>
                          <p className="text-xl font-bold text-green-600">${totalPaid.toLocaleString()}</p>
                          <p className="text-xs text-gray-500">{group.payments.length} pago{group.payments.length !== 1 ? 's' : ''}</p>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent className="pt-4">
                      <div className="space-y-3">
                        {group.payments.map((payment: any) => (
                          <div key={payment._id} className="p-3 border border-green-200 rounded-lg bg-green-50/30">
                            <div className="flex items-start justify-between">
                              <div className="flex-1">
                                <div className="flex items-center gap-2 mb-2">
                                  <h4 className="font-semibold text-sm">{payment.staff?.name}</h4>
                                  <Badge variant="outline" className="text-xs bg-white">{payment.role}</Badge>
                                </div>

                                <div className="grid grid-cols-2 gap-x-4 gap-y-1.5 text-xs">
                                  <div>
                                    <span className="text-gray-600">Horario:</span>
                                    <span className="ml-2 font-medium">
                                      {payment.scheduledStartTime} - {payment.scheduledEndTime}
                                    </span>
                                  </div>
                                  <div>
                                    <span className="text-gray-600">Fecha de pago:</span>
                                    <span className="ml-2 font-medium">
                                      {payment.paymentDate ? new Date(payment.paymentDate).toLocaleDateString("es-CL") : "N/A"}
                                    </span>
                                  </div>
                                  <div>
                                    <span className="text-gray-600">Método:</span>
                                    <span className="ml-2 font-medium">
                                      {payment.paymentMethod || "Efectivo"}
                                    </span>
                                  </div>
                                  <div>
                                    <span className="text-gray-600">Monto:</span>
                                    <span className="ml-2 font-bold text-green-600">
                                      ${payment.amountToPay.toLocaleString()}
                                    </span>
                                  </div>
                                </div>

                                {payment.notes && (
                                  <div className="mt-2 text-xs">
                                    <span className="text-gray-600">Notas:</span>
                                    <p className="text-gray-700 mt-0.5">{payment.notes}</p>
                                  </div>
                                )}
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                )
              })}
            </div>
          )}
        </div>
      )}
    </div>
  )
}
