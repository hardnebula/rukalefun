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
  Trash2,
  ChefHat,
  UtensilsCrossed,
  Camera,
  Music,
  Mic2,
  Palette,
  Phone
} from "lucide-react"
import { toast } from "sonner"

type TabType = "personal" | "asignaciones" | "pagos"

// Categorías de personal con sus configuraciones
const STAFF_CATEGORIES = [
  { id: "Garzón", label: "Garzones", icon: UtensilsCrossed, color: "bg-amber-500", textColor: "text-amber-600" },
  { id: "Cocina", label: "Cocina", icon: ChefHat, color: "bg-orange-500", textColor: "text-orange-600" },
  { id: "Decoración", label: "Decoración", icon: Palette, color: "bg-pink-500", textColor: "text-pink-600" },
  { id: "Fotografía", label: "Fotografía", icon: Camera, color: "bg-blue-500", textColor: "text-blue-600" },
  { id: "DJ", label: "DJ", icon: Music, color: "bg-purple-500", textColor: "text-purple-600" },
  { id: "Animación", label: "Animación", icon: Mic2, color: "bg-green-500", textColor: "text-green-600" },
] as const

type StaffCategory = typeof STAFF_CATEGORIES[number]["id"]

function getCategoryConfig(role: string) {
  return STAFF_CATEGORIES.find(c => c.id === role) || STAFF_CATEGORIES[0]
}

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
  const [searchQuery, setSearchQuery] = useState("")

  if (staff === undefined) {
    return <div className="text-center py-8">Cargando personal...</div>
  }

  // Filtrar por búsqueda
  const filteredStaff = searchQuery
    ? staff.filter(person =>
        person.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        person.phone.includes(searchQuery)
      )
    : staff

  // Agrupar por categoría y ordenar alfabéticamente dentro de cada grupo
  const groupedStaff = STAFF_CATEGORIES.map(category => ({
    ...category,
    members: filteredStaff
      .filter(person => person.role === category.id)
      .sort((a, b) => a.name.localeCompare(b.name, 'es'))
  })).filter(group => group.members.length > 0)

  return (
    <div>
      {/* Header con búsqueda y botón agregar */}
      <div className="flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center mb-6">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 text-gray-500">
            <Users className="w-5 h-5" />
            <span className="font-medium">{staff.length} contactos</span>
          </div>
        </div>
        <div className="flex gap-2 w-full sm:w-auto">
          <div className="relative flex-1 sm:w-64">
            <Input
              placeholder="Buscar por nombre o teléfono..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9"
            />
            <Users className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          </div>
          <Button onClick={() => setIsAddStaffOpen(true)}>
            <UserPlus className="w-4 h-4 sm:mr-2" />
            <span className="hidden sm:inline">Agregar</span>
          </Button>
        </div>
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

      {/* Grid de cards */}
      {groupedStaff.length === 0 ? (
        <div className="text-center py-12 bg-gray-50 rounded-lg">
          <Users className="w-12 h-12 text-gray-300 mx-auto mb-3" />
          <p className="text-gray-500">
            {searchQuery ? "No se encontraron resultados" : "No hay personal registrado"}
          </p>
          {!searchQuery && (
            <Button
              variant="outline"
              className="mt-4"
              onClick={() => setIsAddStaffOpen(true)}
            >
              <UserPlus className="w-4 h-4 mr-2" />
              Agregar personal
            </Button>
          )}
        </div>
      ) : (
        <div className="space-y-8">
          {groupedStaff.map((group) => {
            const Icon = group.icon
            return (
              <div key={group.id}>
                {/* Header del grupo */}
                <div className="flex items-center gap-2 mb-4">
                  <div className={`w-8 h-8 rounded-full ${group.color} flex items-center justify-center`}>
                    <Icon className="w-4 h-4 text-white" />
                  </div>
                  <h3 className="font-semibold text-gray-800 text-lg">{group.label}</h3>
                  <span className="text-sm text-gray-400">({group.members.length})</span>
                </div>

                {/* Grid de cards */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {group.members.map((person) => (
                    <StaffCard
                      key={person._id}
                      person={person}
                      onEdit={() => setEditingStaff(person)}
                    />
                  ))}
                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}

// Componente de card para personal
function StaffCard({ person, onEdit }: { person: any; onEdit: () => void }) {
  const config = getCategoryConfig(person.role)
  const Icon = config.icon
  const initials = person.name
    .split(" ")
    .map((n: string) => n[0])
    .join("")
    .slice(0, 2)
    .toUpperCase()

  return (
    <Card
      className={`cursor-pointer transition-all hover:shadow-md hover:-translate-y-1 ${!person.isActive ? "opacity-60" : ""}`}
      onClick={onEdit}
    >
      <CardContent className="p-4">
        <div className="flex items-start gap-3">
          {/* Avatar grande */}
          <div className={`w-14 h-14 rounded-xl ${config.color} flex items-center justify-center text-white font-bold text-lg flex-shrink-0 shadow-sm`}>
            {initials}
          </div>

          {/* Info */}
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1">
              <h3 className="font-semibold text-gray-900 truncate">{person.name}</h3>
              {!person.isActive && (
                <span className="px-1.5 py-0.5 text-[10px] bg-gray-200 text-gray-500 rounded">
                  Inactivo
                </span>
              )}
            </div>

            <div className="flex items-center gap-1.5 text-sm text-gray-500 mb-2">
              <Phone className="w-3.5 h-3.5" />
              <span className="truncate">{person.phone}</span>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1.5">
                <Icon className={`w-4 h-4 ${config.textColor}`} />
                <span className={`text-xs font-medium ${config.textColor}`}>{config.label}</span>
              </div>
              <span className="font-bold text-green-600 text-sm">
                ${person.ratePerEvent.toLocaleString()}
              </span>
            </div>
          </div>
        </div>

        {/* Acciones */}
        <div className="flex items-center justify-end gap-1 mt-3 pt-3 border-t">
          <Button
            variant="ghost"
            size="sm"
            className="h-8 px-3 text-gray-500 hover:text-blue-600"
            onClick={(e) => { e.stopPropagation(); onEdit(); }}
          >
            <Edit className="w-4 h-4 mr-1" />
            Editar
          </Button>
          <DeleteStaffButton staffId={person._id} />
        </div>
      </CardContent>
    </Card>
  )
}

function StaffForm({ staff, onClose }: { staff?: any, onClose: () => void }) {
  const createStaff = useMutation(api.staff.createStaff)
  const updateStaff = useMutation(api.staff.updateStaff)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [selectedRole, setSelectedRole] = useState(staff?.role || "")

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
          placeholder="Ej: Juan Pérez González"
          required
        />
      </div>

      {/* Selector de rol visual con iconos */}
      <div>
        <Label className="mb-2 block">Categoría *</Label>
        <input type="hidden" name="role" value={selectedRole} />
        <div className="grid grid-cols-3 gap-2">
          {STAFF_CATEGORIES.map((category) => {
            const Icon = category.icon
            const isSelected = selectedRole === category.id
            return (
              <button
                key={category.id}
                type="button"
                onClick={() => setSelectedRole(category.id)}
                className={`flex flex-col items-center gap-1.5 p-3 rounded-lg border-2 transition-all ${
                  isSelected
                    ? `border-blue-500 bg-blue-50 ring-2 ring-offset-1 ring-blue-500`
                    : "border-gray-200 hover:border-gray-300 bg-white"
                }`}
              >
                <div className={`w-8 h-8 rounded-full ${category.color} flex items-center justify-center`}>
                  <Icon className="w-4 h-4 text-white" />
                </div>
                <span className={`text-xs font-medium ${isSelected ? "text-blue-700" : "text-gray-600"}`}>
                  {category.label}
                </span>
              </button>
            )
          })}
        </div>
        {!selectedRole && (
          <p className="text-xs text-red-500 mt-1">Selecciona una categoría</p>
        )}
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div>
          <Label htmlFor="phone">Teléfono *</Label>
          <Input
            id="phone"
            name="phone"
            type="tel"
            defaultValue={staff?.phone}
            placeholder="+56 9 1234 5678"
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
            placeholder="correo@ejemplo.com"
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div>
          <Label htmlFor="ratePerEvent">Tarifa por evento *</Label>
          <div className="relative">
            <span className="absolute left-3 top-2.5 text-gray-500">$</span>
            <Input
              id="ratePerEvent"
              name="ratePerEvent"
              type="number"
              defaultValue={staff?.ratePerEvent}
              className="pl-7"
              placeholder="50000"
              required
            />
          </div>
        </div>
        <div>
          <Label htmlFor="ratePerHour">Tarifa por hora</Label>
          <div className="relative">
            <span className="absolute left-3 top-2.5 text-gray-500">$</span>
            <Input
              id="ratePerHour"
              name="ratePerHour"
              type="number"
              defaultValue={staff?.ratePerHour}
              className="pl-7"
              placeholder="5000"
            />
          </div>
        </div>
      </div>

      <div>
        <Label htmlFor="notes">Notas adicionales</Label>
        <Input
          id="notes"
          name="notes"
          defaultValue={staff?.notes}
          placeholder="Especialidad, disponibilidad, etc."
        />
      </div>

      <div className="flex items-center gap-2 p-3 bg-gray-50 rounded-lg">
        <input
          type="checkbox"
          id="isActive"
          name="isActive"
          value="true"
          defaultChecked={staff?.isActive ?? true}
          className="w-4 h-4 rounded"
        />
        <Label htmlFor="isActive" className="text-sm cursor-pointer">
          Personal activo y disponible para asignaciones
        </Label>
      </div>

      <div className="flex justify-end gap-2 pt-2">
        <Button type="button" variant="outline" onClick={onClose}>
          Cancelar
        </Button>
        <Button type="submit" disabled={isSubmitting || !selectedRole}>
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
          className="max-w-4xl max-h-[90vh] overflow-hidden"
        >
          <DialogHeader>
            <DialogTitle className="text-xl flex items-center gap-2">
              <UserPlus className="w-5 h-5 text-blue-600" />
              Asignar Personal
            </DialogTitle>
            <p className="text-sm text-gray-500">Selecciona un evento y haz click en el personal para asignarlo</p>
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

  const config = getCategoryConfig(assignment.role)
  const Icon = config.icon
  const initials = assignment.staff?.name
    ?.split(" ")
    .map((n: string) => n[0])
    .join("")
    .slice(0, 2)
    .toUpperCase() || "?"

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
    <div className="flex items-center justify-between p-3 bg-white border rounded-lg hover:shadow-sm transition-shadow">
      <div className="flex items-center gap-3 flex-1">
        {/* Avatar */}
        <div className={`w-9 h-9 rounded-full ${config.color} flex items-center justify-center text-white font-medium text-xs flex-shrink-0`}>
          {initials}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <h4 className="font-medium text-gray-900 truncate">{assignment.staff?.name}</h4>
            <Icon className={`w-3.5 h-3.5 ${config.textColor}`} />
            <Badge variant={assignment.confirmedAttendance ? "default" : "secondary"} className="text-xs">
              {assignment.confirmedAttendance ? "Confirmado" : "Pendiente"}
            </Badge>
          </div>
          <div className="flex items-center gap-2 text-xs text-gray-500 mt-0.5">
            <span>{assignment.scheduledStartTime} - {assignment.scheduledEndTime}</span>
            <span>•</span>
            <span className="font-semibold text-green-600">${assignment.amountToPay.toLocaleString()}</span>
          </div>
        </div>
      </div>
      <div className="flex gap-1 ml-2">
        {!assignment.confirmedAttendance ? (
          <Button
            size="sm"
            onClick={() => handleConfirmAttendance(true)}
            className="bg-green-600 hover:bg-green-700 h-8"
          >
            <CheckCircle className="w-4 h-4" />
          </Button>
        ) : (
          <Button
            size="sm"
            variant="outline"
            onClick={() => handleConfirmAttendance(false)}
            className="h-8"
          >
            <XCircle className="w-4 h-4" />
          </Button>
        )}
        <Button
          size="sm"
          variant="ghost"
          onClick={handleDelete}
          disabled={isDeleting}
          className="text-gray-400 hover:text-red-600 h-8"
        >
          <Trash2 className="w-4 h-4" />
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
  const [searchQuery, setSearchQuery] = useState("")
  const [roleFilter, setRoleFilter] = useState("all")

  // Obtener asignaciones existentes para el evento seleccionado
  const existingAssignments = useQuery(
    api.staff.getAssignmentsByBooking,
    selectedBooking ? { bookingId: selectedBooking._id } : "skip"
  )

  // Asignar personal directamente con un click
  const handleQuickAssign = async (person: any) => {
    if (!selectedBooking) return

    setIsSubmitting(true)
    try {
      await createAssignment({
        bookingId: selectedBooking._id,
        staffId: person._id,
        role: person.role,
        scheduledStartTime: selectedBooking.startTime,
        scheduledEndTime: selectedBooking.endTime,
        amountToPay: person.ratePerEvent,
      })
      toast.success(`${person.name} asignado al evento`)
    } catch (error) {
      toast.error("Error al asignar personal")
    } finally {
      setIsSubmitting(false)
    }
  }

  if (!bookings || !staff) {
    return <div className="text-center py-8">Cargando...</div>
  }

  // Filtrar solo eventos futuros o de hoy
  const upcomingBookings = bookings.filter((booking: any) => {
    const eventDate = new Date(booking.eventDate)
    const today = new Date()
    today.setHours(0, 0, 0, 0)
    return eventDate >= today
  }).sort((a: any, b: any) => new Date(a.eventDate).getTime() - new Date(b.eventDate).getTime())

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

  // Agrupar personal disponible por categoría
  const staffByCategory = STAFF_CATEGORIES.map(category => ({
    ...category,
    members: availableStaff.filter((person: any) => person.role === category.id)
  })).filter(group => group.members.length > 0)

  return (
    <div className="flex gap-6 min-h-[500px]">
      {/* Panel Izquierdo: Eventos */}
      <div className="w-1/3 border-r pr-6">
        <h3 className="font-semibold text-gray-800 mb-3 flex items-center gap-2">
          <Calendar className="w-5 h-5 text-blue-600" />
          Selecciona Evento
        </h3>

        <div className="space-y-2 max-h-[450px] overflow-y-auto pr-2">
          {upcomingBookings.length === 0 ? (
            <p className="text-center text-gray-500 py-8 text-sm">No hay eventos próximos</p>
          ) : (
            upcomingBookings.map((booking: any) => {
              const isSelected = selectedBooking?._id === booking._id
              const assignmentCount = isSelected ? (existingAssignments?.length || 0) : 0
              return (
                <div
                  key={booking._id}
                  onClick={() => setSelectedBooking(booking)}
                  className={`p-3 rounded-lg cursor-pointer transition-all ${
                    isSelected
                      ? "bg-blue-50 border-2 border-blue-500"
                      : "bg-gray-50 border-2 border-transparent hover:border-gray-200"
                  }`}
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="min-w-0">
                      <p className="font-medium text-sm truncate">{booking.eventType}</p>
                      <p className="text-xs text-gray-500 truncate">{booking.clientName}</p>
                      <p className="text-xs text-gray-400 mt-1">
                        {new Date(booking.eventDate).toLocaleDateString("es-CL", { weekday: 'short', day: 'numeric', month: 'short' })}
                      </p>
                    </div>
                    {isSelected && (
                      <div className="flex-shrink-0">
                        <CheckCircle className="w-5 h-5 text-blue-600" />
                      </div>
                    )}
                  </div>
                  {isSelected && assignmentCount > 0 && (
                    <p className="text-xs text-blue-600 mt-2">
                      {assignmentCount} asignado{assignmentCount !== 1 ? 's' : ''}
                    </p>
                  )}
                </div>
              )
            })
          )}
        </div>
      </div>

      {/* Panel Derecho: Personal */}
      <div className="flex-1">
        {!selectedBooking ? (
          <div className="h-full flex items-center justify-center">
            <div className="text-center text-gray-400">
              <Users className="w-16 h-16 mx-auto mb-3 opacity-50" />
              <p className="font-medium">Selecciona un evento</p>
              <p className="text-sm">para ver el personal disponible</p>
            </div>
          </div>
        ) : (
          <>
            {/* Info del evento seleccionado */}
            <div className="bg-blue-50 rounded-lg p-4 mb-4">
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="font-semibold text-blue-900">{selectedBooking.eventType}</h3>
                  <p className="text-sm text-blue-700">{selectedBooking.clientName}</p>
                  <div className="flex items-center gap-3 mt-2 text-xs text-blue-600">
                    <span>📅 {new Date(selectedBooking.eventDate).toLocaleDateString("es-CL")}</span>
                    <span>🕐 {selectedBooking.startTime} - {selectedBooking.endTime}</span>
                    <span>👥 {selectedBooking.numberOfGuests} personas</span>
                  </div>
                </div>
              </div>

              {/* Personal ya asignado */}
              {existingAssignments && existingAssignments.length > 0 && (
                <div className="mt-3 pt-3 border-t border-blue-200">
                  <p className="text-xs font-medium text-blue-800 mb-2">Personal asignado:</p>
                  <div className="flex flex-wrap gap-2">
                    {existingAssignments.map((assignment: any) => {
                      const config = getCategoryConfig(assignment.role)
                      return (
                        <span
                          key={assignment._id}
                          className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs text-white ${config.color}`}
                        >
                          {assignment.staff?.name?.split(' ')[0]}
                        </span>
                      )
                    })}
                  </div>
                </div>
              )}
            </div>

            {/* Filtros */}
            <div className="flex gap-2 mb-4">
              <Input
                placeholder="Buscar..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="flex-1 h-9"
              />
              <select
                value={roleFilter}
                onChange={(e) => setRoleFilter(e.target.value)}
                className="px-3 py-1 border border-gray-300 rounded-lg text-sm h-9"
              >
                <option value="all">Todas</option>
                {STAFF_CATEGORIES.map((cat) => (
                  <option key={cat.id} value={cat.id}>{cat.label}</option>
                ))}
              </select>
            </div>

            {/* Lista de personal disponible por categoría */}
            <div className="space-y-4 max-h-[320px] overflow-y-auto pr-2">
              {staffByCategory.length === 0 ? (
                <div className="text-center text-gray-500 py-8">
                  <Users className="w-10 h-10 mx-auto mb-2 opacity-50" />
                  <p className="text-sm">
                    {searchQuery || roleFilter !== "all"
                      ? "No se encontró personal"
                      : "Todo el personal ya está asignado"}
                  </p>
                </div>
              ) : (
                staffByCategory.map((group) => {
                  const Icon = group.icon
                  return (
                    <div key={group.id}>
                      <div className="flex items-center gap-2 mb-2">
                        <div className={`w-6 h-6 rounded-full ${group.color} flex items-center justify-center`}>
                          <Icon className="w-3 h-3 text-white" />
                        </div>
                        <span className="text-sm font-medium text-gray-700">{group.label}</span>
                        <span className="text-xs text-gray-400">({group.members.length})</span>
                      </div>
                      <div className="grid grid-cols-2 gap-2">
                        {group.members.map((person: any) => {
                          const initials = person.name.split(' ').map((n: string) => n[0]).join('').slice(0, 2).toUpperCase()
                          return (
                            <button
                              key={person._id}
                              type="button"
                              onClick={() => handleQuickAssign(person)}
                              disabled={isSubmitting}
                              className="flex items-center gap-2 p-2 rounded-lg border border-gray-200 bg-white hover:border-green-400 hover:bg-green-50 transition-all text-left disabled:opacity-50"
                            >
                              <div className={`w-8 h-8 rounded-full ${group.color} flex items-center justify-center text-white text-xs font-medium flex-shrink-0`}>
                                {initials}
                              </div>
                              <div className="flex-1 min-w-0">
                                <p className="text-sm font-medium truncate">{person.name}</p>
                                <p className="text-xs text-green-600 font-semibold">${person.ratePerEvent.toLocaleString()}</p>
                              </div>
                              <div className="flex-shrink-0 text-green-600">
                                <UserPlus className="w-4 h-4" />
                              </div>
                            </button>
                          )
                        })}
                      </div>
                    </div>
                  )
                })
              )}
            </div>
          </>
        )}
      </div>
    </div>
  )
}

// ============== TAB DE PAGOS ==============

function PagosTab() {
  const pendingPayments = useQuery(api.staff.getPendingPayments)
  const paidPayments = useQuery(api.staff.getPaidPayments)
  const paymentSummary = useQuery(api.staff.getPaymentSummary, {})
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
                        {group.payments.map((payment: any) => {
                          const config = getCategoryConfig(payment.role)
                          const RoleIcon = config.icon
                          const initials = payment.staff?.name?.split(' ').map((n: string) => n[0]).join('').slice(0, 2).toUpperCase() || "?"
                          return (
                            <div key={payment._id} className="flex items-center justify-between p-3 bg-white border rounded-lg hover:shadow-sm transition-shadow">
                              <div className="flex items-center gap-3 flex-1">
                                <div className={`w-9 h-9 rounded-full ${config.color} flex items-center justify-center text-white font-medium text-xs flex-shrink-0`}>
                                  {initials}
                                </div>
                                <div className="flex-1 min-w-0">
                                  <div className="flex items-center gap-2">
                                    <h4 className="font-medium text-sm truncate">{payment.staff?.name}</h4>
                                    <RoleIcon className={`w-3.5 h-3.5 ${config.textColor}`} />
                                    <Badge variant={payment.confirmedAttendance ? "default" : "secondary"} className="text-xs">
                                      {payment.confirmedAttendance ? "Confirmado" : "Pendiente"}
                                    </Badge>
                                  </div>
                                  <p className="text-xs text-gray-500 mt-0.5">
                                    {payment.scheduledStartTime} - {payment.scheduledEndTime}
                                  </p>
                                </div>
                              </div>
                              <div className="flex items-center gap-3 ml-2">
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
                                  Pagar
                                </Button>
                              </div>
                            </div>
                          )
                        })}
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
                        {group.payments.map((payment: any) => {
                          const config = getCategoryConfig(payment.role)
                          const RoleIcon = config.icon
                          const initials = payment.staff?.name?.split(' ').map((n: string) => n[0]).join('').slice(0, 2).toUpperCase() || "?"
                          return (
                            <div key={payment._id} className="flex items-center gap-3 p-3 bg-white border rounded-lg">
                              <div className={`w-9 h-9 rounded-full ${config.color} flex items-center justify-center text-white font-medium text-xs flex-shrink-0`}>
                                {initials}
                              </div>
                              <div className="flex-1 min-w-0">
                                <div className="flex items-center gap-2">
                                  <h4 className="font-medium text-sm truncate">{payment.staff?.name}</h4>
                                  <RoleIcon className={`w-3.5 h-3.5 ${config.textColor}`} />
                                </div>
                                <div className="flex flex-wrap gap-x-3 text-xs text-gray-500 mt-0.5">
                                  <span>{payment.scheduledStartTime} - {payment.scheduledEndTime}</span>
                                  <span>•</span>
                                  <span>{payment.paymentDate ? new Date(payment.paymentDate).toLocaleDateString("es-CL") : "N/A"}</span>
                                  <span>•</span>
                                  <span>{payment.paymentMethod || "Efectivo"}</span>
                                </div>
                              </div>
                              <div className="text-right flex-shrink-0">
                                <p className="font-bold text-green-600">${payment.amountToPay.toLocaleString()}</p>
                              </div>
                            </div>
                          )
                        })}
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
