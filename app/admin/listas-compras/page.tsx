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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  ShoppingCart,
  Plus,
  Trash2,
  DollarSign,
  Calendar,
  Clock,
  FileText,
} from "lucide-react"
import { toast } from "sonner"

export default function ListasComprasPage() {
  const lists = useQuery(api.shoppingLists.getAllShoppingLists)
  const [filterStatus, setFilterStatus] = useState("all")
  const [isGenerateDialogOpen, setIsGenerateDialogOpen] = useState(false)

  if (lists === undefined) {
    return <div className="text-center py-12">Cargando listas...</div>
  }

  const filteredLists = filterStatus === "all"
    ? lists
    : lists.filter((list) => list.status === filterStatus)

  const pendingLists = lists.filter((l) => l.status === "pending" || l.status === "draft")
  const totalCost = pendingLists.reduce((sum, l) => sum + l.totalEstimatedCost, 0)
  const thisWeek = lists.filter((l) => {
    const eventDate = new Date(l.eventDate)
    const now = new Date()
    const weekFromNow = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000)
    return eventDate >= now && eventDate <= weekFromNow
  })

  return (
    <div className="p-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Listas de Compras</h1>
        <p className="text-gray-600">Gestiona las compras para tus eventos</p>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-3 gap-4 mb-8">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Pendientes</p>
                <p className="text-2xl font-bold text-orange-600">{pendingLists.length}</p>
              </div>
              <Clock className="w-10 h-10 text-orange-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Costo Total</p>
                <p className="text-2xl font-bold text-green-600">${totalCost.toLocaleString()}</p>
              </div>
              <DollarSign className="w-10 h-10 text-green-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Esta Semana</p>
                <p className="text-2xl font-bold text-blue-600">{thisWeek.length}</p>
              </div>
              <Calendar className="w-10 h-10 text-blue-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Actions */}
      <div className="flex justify-between items-center mb-6">
        <select
          value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value)}
          className="px-3 py-2 border rounded-lg"
        >
          <option value="all">Todos</option>
          <option value="draft">Borrador</option>
          <option value="pending">Pendiente</option>
          <option value="completed">Completado</option>
        </select>
        <Button onClick={() => setIsGenerateDialogOpen(true)}>
          <Plus className="w-4 h-4 mr-2" />
          Nueva Lista
        </Button>
      </div>

      {/* Dialog */}
      <Dialog open={isGenerateDialogOpen} onOpenChange={setIsGenerateDialogOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>Nueva Lista de Compras</DialogTitle>
          </DialogHeader>
          <GenerateShoppingListForm onClose={() => setIsGenerateDialogOpen(false)} />
        </DialogContent>
      </Dialog>

      {/* Lists */}
      {filteredLists.length === 0 ? (
        <Card>
          <CardContent className="py-12">
            <div className="text-center">
              <ShoppingCart className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-600 font-medium">No hay listas de compras</p>
              <p className="text-sm text-gray-500 mt-1">Crea tu primera lista</p>
            </div>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {filteredLists.map((list) => (
            <ShoppingListCard key={list._id} list={list} />
          ))}
        </div>
      )}
    </div>
  )
}

function ShoppingListCard({ list }: { list: any }) {
  const deleteList = useMutation(api.shoppingLists.deleteShoppingList)
  const [isDeleting, setIsDeleting] = useState(false)

  const handleDelete = async () => {
    if (!confirm(`¿Eliminar lista para ${list.eventName}?`)) return
    setIsDeleting(true)
    try {
      await deleteList({ id: list._id })
      toast.success("Lista eliminada")
    } catch (error) {
      toast.error("Error al eliminar")
    } finally {
      setIsDeleting(false)
    }
  }

  const statusColors: Record<string, string> = {
    draft: "bg-gray-100 text-gray-800",
    pending: "bg-orange-100 text-orange-800",
    completed: "bg-green-100 text-green-800",
  }

  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardHeader>
        <div className="flex items-start justify-between">
          <div className="flex-1 min-w-0">
            <CardTitle className="text-lg truncate">{list.eventName}</CardTitle>
            <div className="flex items-center gap-2 mt-2">
              <Badge className={statusColors[list.status] || ""}>{list.status}</Badge>
              <span className="text-xs text-gray-500">{list.numberOfGuests} invitados</span>
            </div>
          </div>
          <Button
            variant="ghost"
            size="sm"
            className="h-8 w-8 p-0"
            onClick={handleDelete}
            disabled={isDeleting}
          >
            <Trash2 className="w-4 h-4 text-red-600" />
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-2 text-sm">
          <div className="flex items-center justify-between">
            <span className="text-gray-600">Fecha:</span>
            <span className="font-medium">{new Date(list.eventDate).toLocaleDateString("es-CL")}</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-gray-600">Costo:</span>
            <span className="font-bold text-green-600">${list.totalEstimatedCost.toLocaleString()}</span>
          </div>
        </div>
        <Button
          className="w-full mt-4"
          variant="outline"
          onClick={() => window.location.href = `/admin/listas-compras/${list._id}`}
        >
          <FileText className="w-4 h-4 mr-2" />
          Ver Lista
        </Button>
      </CardContent>
    </Card>
  )
}

function GenerateShoppingListForm({ onClose }: { onClose: () => void }) {
  const bookings = useQuery(api.bookings.getAllBookings)
  const createManualList = useMutation(api.shoppingLists.createManualShoppingList)
  const createBlankList = useMutation(api.shoppingLists.createBlankShoppingList)
  const [selectedBooking, setSelectedBooking] = useState<any>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [activeTab, setActiveTab] = useState("from-booking")

  const handleCreateFromBooking = async () => {
    if (!selectedBooking) {
      toast.error("Selecciona un evento")
      return
    }

    setIsSubmitting(true)
    try {
      const listId = await createManualList({
        bookingId: selectedBooking._id,
        eventName: `${selectedBooking.eventType} - ${selectedBooking.clientName}`,
        eventDate: selectedBooking.eventDate,
        numberOfGuests: selectedBooking.numberOfGuests,
      })
      toast.success("Lista creada")
      window.location.href = `/admin/listas-compras/${listId}`
    } catch (error: any) {
      toast.error(error.message || "Error al crear lista")
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleCreateBlank = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsSubmitting(true)

    const formData = new FormData(e.currentTarget)
    try {
      const listId = await createBlankList({
        eventName: formData.get("eventName") as string,
        eventDate: formData.get("eventDate") as string,
        numberOfGuests: Number(formData.get("numberOfGuests")),
      })
      toast.success("Lista creada")
      window.location.href = `/admin/listas-compras/${listId}`
    } catch (error: any) {
      toast.error(error.message || "Error al crear")
    } finally {
      setIsSubmitting(false)
    }
  }

  if (!bookings) {
    return <div className="text-center py-4">Cargando...</div>
  }

  const upcomingBookings = bookings.filter((booking: any) => {
    const eventDate = new Date(booking.eventDate)
    const today = new Date()
    today.setHours(0, 0, 0, 0)
    return eventDate >= today
  })

  return (
    <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
      <TabsList className="grid w-full grid-cols-2">
        <TabsTrigger value="from-booking">Desde Evento</TabsTrigger>
        <TabsTrigger value="from-scratch">Nueva</TabsTrigger>
      </TabsList>

      <TabsContent value="from-booking" className="space-y-4 mt-4">
        <div>
          <Label>Selecciona el Evento</Label>
          <select
            className="w-full p-3 border rounded-lg mt-2"
            onChange={(e) => {
              const booking = bookings.find((b: any) => b._id === e.target.value)
              setSelectedBooking(booking)
            }}
          >
            <option value="">Seleccionar...</option>
            {upcomingBookings.map((booking: any) => (
              <option key={booking._id} value={booking._id}>
                {booking.eventType} • {booking.clientName} • {new Date(booking.eventDate).toLocaleDateString("es-CL")}
              </option>
            ))}
          </select>
        </div>

        {selectedBooking && (
          <Card className="bg-blue-50 border-blue-200">
            <CardContent className="p-4">
              <h4 className="font-semibold mb-2">{selectedBooking.eventType}</h4>
              <div className="grid grid-cols-2 gap-2 text-sm">
                <div><span className="text-gray-600">Cliente:</span> {selectedBooking.clientName}</div>
                <div><span className="text-gray-600">Invitados:</span> {selectedBooking.numberOfGuests}</div>
                <div><span className="text-gray-600">Fecha:</span> {new Date(selectedBooking.eventDate).toLocaleDateString("es-CL")}</div>
              </div>
            </CardContent>
          </Card>
        )}

        <div className="flex justify-end gap-2 pt-4 border-t">
          <Button variant="outline" onClick={onClose}>Cancelar</Button>
          <Button onClick={handleCreateFromBooking} disabled={!selectedBooking || isSubmitting}>
            {isSubmitting ? "Creando..." : "Crear Lista"}
          </Button>
        </div>
      </TabsContent>

      <TabsContent value="from-scratch" className="space-y-4 mt-4">
        <form onSubmit={handleCreateBlank} className="space-y-4">
          <div>
            <Label htmlFor="eventName">Nombre</Label>
            <Input id="eventName" name="eventName" placeholder="Ej: Cumpleaños..." required className="mt-2" />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="eventDate">Fecha</Label>
              <Input id="eventDate" name="eventDate" type="date" required className="mt-2" />
            </div>
            <div>
              <Label htmlFor="numberOfGuests">Invitados</Label>
              <Input id="numberOfGuests" name="numberOfGuests" type="number" min="1" defaultValue="1" required className="mt-2" />
            </div>
          </div>

          <div className="flex justify-end gap-2 pt-4 border-t">
            <Button type="button" variant="outline" onClick={onClose}>Cancelar</Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Creando..." : "Crear Lista"}
            </Button>
          </div>
        </form>
      </TabsContent>
    </Tabs>
  )
}
