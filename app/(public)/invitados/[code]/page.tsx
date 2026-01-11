"use client"

import { useState } from "react"
import { useQuery, useMutation } from "convex/react"
import { api } from "@/convex/_generated/api"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import {
  Plus,
  Trash2,
  CheckCircle,
  Circle,
  Calendar,
  Users,
  Utensils,
  PartyPopper,
} from "lucide-react"
import { toast } from "sonner"
import { Toaster } from "@/components/ui/sonner"
import Image from "next/image"
import Link from "next/link"

export default function GuestPortalPage({ params }: { params: { code: string } }) {
  const { code } = params
  const event = useQuery(api.guestPortal.getEventByAccessCode, { code })
  const guests = useQuery(api.guestPortal.getGuestsByAccessCode, { code })
  const addGuest = useMutation(api.guestPortal.addGuestByAccessCode)
  const updateConfirmation = useMutation(api.guestPortal.updateGuestConfirmation)
  const removeGuest = useMutation(api.guestPortal.removeGuestByAccessCode)

  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)

  // Estado de carga
  if (event === undefined || guests === undefined) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-green-50 to-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Cargando...</p>
        </div>
      </div>
    )
  }

  // Código inválido
  if (event === null) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-red-50 to-white flex items-center justify-center p-4">
        <div className="text-center max-w-md">
          <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <span className="text-4xl">🔒</span>
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Código no válido</h1>
          <p className="text-gray-600 mb-6">
            El código de acceso no existe o ha expirado. Por favor verifica con los organizadores del evento.
          </p>
          <Link href="/">
            <Button variant="outline">Volver al inicio</Button>
          </Link>
        </div>
      </div>
    )
  }

  const confirmedCount = guests.filter(g => g.isConfirmed).length
  const pendingCount = guests.length - confirmedCount

  const handleAddGuest = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsSubmitting(true)

    const formData = new FormData(e.currentTarget)
    try {
      await addGuest({
        code,
        guestName: formData.get("guestName") as string,
        dietaryRestrictions: formData.get("dietary") as string || undefined,
        notes: formData.get("notes") as string || undefined,
      })
      toast.success("Invitado agregado")
      setIsAddDialogOpen(false)
    } catch (error: any) {
      toast.error(error.message || "Error al agregar")
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleToggleConfirm = async (guestId: any, currentStatus: boolean) => {
    try {
      await updateConfirmation({
        code,
        guestId,
        isConfirmed: !currentStatus,
      })
      toast.success(currentStatus ? "Confirmación removida" : "Asistencia confirmada")
    } catch (error) {
      toast.error("Error al actualizar")
    }
  }

  const handleRemoveGuest = async (guestId: any, guestName: string) => {
    if (!confirm(`¿Eliminar a ${guestName} de la lista?`)) return
    try {
      await removeGuest({ code, guestId })
      toast.success("Invitado eliminado")
    } catch (error) {
      toast.error("Error al eliminar")
    }
  }

  // Formatear fecha
  const eventDate = new Date(event.eventDate)
  const formattedDate = eventDate.toLocaleDateString("es-CL", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  })

  return (
    <div className="min-h-screen bg-gradient-to-b from-green-50 to-white">
      <Toaster />

      {/* Header con logo */}
      <header className="bg-white/80 backdrop-blur-sm border-b sticky top-0 z-10">
        <div className="max-w-2xl mx-auto px-4 py-3 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <div className="relative w-10 h-10">
              <Image
                src="/Logo.rukalefun.jpg"
                alt="Ruka Lefún"
                fill
                className="object-contain rounded-full"
              />
            </div>
            <span className="font-semibold text-green-800">Ruka Lefún</span>
          </Link>
        </div>
      </header>

      {/* Info del evento */}
      <div className="bg-gradient-to-r from-green-600 to-green-700 text-white">
        <div className="max-w-2xl mx-auto px-4 py-8 text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-white/20 rounded-full mb-4">
            <PartyPopper className="w-8 h-8" />
          </div>
          <h1 className="text-3xl font-bold mb-2">{event.eventType}</h1>
          <p className="text-green-100 text-lg mb-1">{event.clientName}</p>
          <div className="flex items-center justify-center gap-2 text-green-100">
            <Calendar className="w-4 h-4" />
            <span className="capitalize">{formattedDate}</span>
          </div>
        </div>
      </div>

      {/* Resumen */}
      <div className="max-w-2xl mx-auto px-4 -mt-6">
        <div className="bg-white rounded-xl shadow-lg p-4 grid grid-cols-3 gap-4 text-center">
          <div>
            <p className="text-2xl font-bold text-gray-900">{guests.length}</p>
            <p className="text-xs text-gray-500">Total</p>
          </div>
          <div>
            <p className="text-2xl font-bold text-green-600">{confirmedCount}</p>
            <p className="text-xs text-gray-500">Confirmados</p>
          </div>
          <div>
            <p className="text-2xl font-bold text-orange-500">{pendingCount}</p>
            <p className="text-xs text-gray-500">Pendientes</p>
          </div>
        </div>
      </div>

      {/* Lista de invitados */}
      <div className="max-w-2xl mx-auto px-4 py-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-gray-900">Lista de Invitados</h2>
          <Button onClick={() => setIsAddDialogOpen(true)} size="sm">
            <Plus className="w-4 h-4 mr-1" />
            Agregar
          </Button>
        </div>

        {guests.length === 0 ? (
          <div className="bg-white rounded-xl shadow-sm p-12 text-center">
            <Users className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-600 font-medium mb-2">No hay invitados aún</p>
            <p className="text-sm text-gray-500 mb-4">
              Agrega invitados para llevar el control de asistencia
            </p>
            <Button onClick={() => setIsAddDialogOpen(true)}>
              <Plus className="w-4 h-4 mr-2" />
              Agregar primer invitado
            </Button>
          </div>
        ) : (
          <div className="bg-white rounded-xl shadow-sm overflow-hidden divide-y">
            {guests.map((guest) => (
              <div key={guest._id} className="p-4 flex items-center gap-3 group hover:bg-gray-50">
                {/* Checkbox de confirmación */}
                <button
                  onClick={() => handleToggleConfirm(guest._id, guest.isConfirmed)}
                  className="flex-shrink-0 transition-transform hover:scale-110"
                >
                  {guest.isConfirmed ? (
                    <CheckCircle className="w-6 h-6 text-green-600 fill-green-50" />
                  ) : (
                    <Circle className="w-6 h-6 text-gray-300 hover:text-green-500" />
                  )}
                </button>

                {/* Info del invitado */}
                <div className="flex-1 min-w-0">
                  <p className={`font-medium ${guest.isConfirmed ? 'text-gray-900' : 'text-gray-600'}`}>
                    {guest.guestName}
                  </p>
                  <div className="flex items-center gap-2 flex-wrap">
                    {guest.dietaryRestrictions && (
                      <span className="text-xs px-2 py-0.5 bg-orange-100 text-orange-700 rounded inline-flex items-center gap-1">
                        <Utensils className="w-3 h-3" />
                        {guest.dietaryRestrictions}
                      </span>
                    )}
                    {guest.tableName && (
                      <span className="text-xs px-2 py-0.5 bg-blue-100 text-blue-700 rounded">
                        {guest.tableName}
                      </span>
                    )}
                    {guest.notes && (
                      <span className="text-xs text-gray-500">{guest.notes}</span>
                    )}
                  </div>
                </div>

                {/* Botón eliminar */}
                <button
                  onClick={() => handleRemoveGuest(guest._id, guest.guestName)}
                  className="p-2 text-gray-400 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        )}

        {/* Leyenda */}
        <div className="mt-4 text-center text-xs text-gray-500">
          Toca el círculo para confirmar asistencia
        </div>
      </div>

      {/* Dialog agregar invitado */}
      <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Agregar Invitado</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleAddGuest} className="space-y-4">
            <div>
              <Label htmlFor="guestName">Nombre completo</Label>
              <Input
                id="guestName"
                name="guestName"
                placeholder="Ej: María García"
                required
                autoFocus
                className="mt-1"
              />
            </div>
            <div>
              <Label htmlFor="dietary">Restricciones alimentarias (opcional)</Label>
              <Input
                id="dietary"
                name="dietary"
                placeholder="Ej: Vegetariano, sin gluten..."
                className="mt-1"
              />
            </div>
            <div>
              <Label htmlFor="notes">Notas (opcional)</Label>
              <Input
                id="notes"
                name="notes"
                placeholder="Ej: Tío del novio"
                className="mt-1"
              />
            </div>
            <div className="flex gap-2 pt-2">
              <Button type="button" variant="outline" onClick={() => setIsAddDialogOpen(false)} className="flex-1">
                Cancelar
              </Button>
              <Button type="submit" disabled={isSubmitting} className="flex-1 bg-green-600 hover:bg-green-700">
                {isSubmitting ? "Agregando..." : "Agregar"}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>

      {/* Footer */}
      <footer className="max-w-2xl mx-auto px-4 py-8 text-center text-sm text-gray-500">
        <p>Portal de invitados de Ruka Lefún</p>
        <p className="text-xs mt-1">Código: {code.toUpperCase()}</p>
      </footer>
    </div>
  )
}
