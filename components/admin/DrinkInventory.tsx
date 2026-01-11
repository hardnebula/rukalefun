"use client"

import { useState } from "react"
import { useQuery, useMutation } from "convex/react"
import { api } from "@/convex/_generated/api"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent } from "@/components/ui/card"
import { Plus, Trash2, Wine, Beer, Check, PackageCheck, Package } from "lucide-react"
import { toast } from "sonner"

interface DrinkInventoryProps {
  bookingId: string
}

const DRINK_TYPES = [
  { value: "vino", label: "Vino" },
  { value: "cerveza", label: "Cerveza" },
  { value: "pisco", label: "Pisco" },
  { value: "whisky", label: "Whisky" },
  { value: "ron", label: "Ron" },
  { value: "vodka", label: "Vodka" },
  { value: "champagne", label: "Champagne" },
  { value: "otro", label: "Otro" },
]

const DRINK_TYPE_LABELS: Record<string, string> = {
  vino: "Vino",
  cerveza: "Cerveza",
  pisco: "Pisco",
  whisky: "Whisky",
  ron: "Ron",
  vodka: "Vodka",
  champagne: "Champagne",
  otro: "Otro",
}

export default function DrinkInventory({ bookingId }: DrinkInventoryProps) {
  const drinks = useQuery(api.drinkInventory.getByBooking, { bookingId: bookingId as any })
  const summary = useQuery(api.drinkInventory.getSummary, { bookingId: bookingId as any })

  const createDrink = useMutation(api.drinkInventory.create)
  const updateDrink = useMutation(api.drinkInventory.update)
  const removeDrink = useMutation(api.drinkInventory.remove)
  const markAsReceived = useMutation(api.drinkInventory.markAsReceived)
  const updateExitCount = useMutation(api.drinkInventory.updateExitCount)
  const markAllReceived = useMutation(api.drinkInventory.markAllAsReceived)

  const [addDialogOpen, setAddDialogOpen] = useState(false)
  const [exitDialogOpen, setExitDialogOpen] = useState(false)
  const [selectedDrink, setSelectedDrink] = useState<any>(null)

  const [newDrink, setNewDrink] = useState({
    drinkType: "vino",
    brand: "",
    quantityIn: 1,
    entryNotes: "",
  })

  const [exitData, setExitData] = useState({
    quantityConsumed: 0,
    quantityReturned: 0,
    exitNotes: "",
  })

  const handleAddDrink = async () => {
    if (!newDrink.brand.trim()) {
      toast.error("Ingresa la marca del trago")
      return
    }
    if (newDrink.quantityIn < 1) {
      toast.error("La cantidad debe ser al menos 1")
      return
    }

    try {
      await createDrink({
        bookingId: bookingId as any,
        drinkType: newDrink.drinkType,
        brand: newDrink.brand,
        quantityIn: newDrink.quantityIn,
        entryNotes: newDrink.entryNotes || undefined,
      })
      toast.success("Trago agregado")
      setAddDialogOpen(false)
      setNewDrink({ drinkType: "vino", brand: "", quantityIn: 1, entryNotes: "" })
    } catch (error) {
      toast.error("Error al agregar trago")
    }
  }

  const handleMarkReceived = async (id: string) => {
    try {
      await markAsReceived({ id: id as any })
      toast.success("Marcado como recibido")
    } catch (error) {
      toast.error("Error al actualizar")
    }
  }

  const handleMarkAllReceived = async () => {
    try {
      const result = await markAllReceived({ bookingId: bookingId as any })
      toast.success(`${result.updated} tragos marcados como recibidos`)
    } catch (error) {
      toast.error("Error al actualizar")
    }
  }

  const openExitDialog = (drink: any) => {
    setSelectedDrink(drink)
    setExitData({
      quantityConsumed: drink.quantityConsumed || 0,
      quantityReturned: drink.quantityReturned || 0,
      exitNotes: drink.exitNotes || "",
    })
    setExitDialogOpen(true)
  }

  const handleUpdateExit = async () => {
    if (!selectedDrink) return

    const total = exitData.quantityConsumed + exitData.quantityReturned
    if (total > selectedDrink.quantityIn) {
      toast.error(`El total (${total}) no puede superar la cantidad de entrada (${selectedDrink.quantityIn})`)
      return
    }

    try {
      await updateExitCount({
        id: selectedDrink._id as any,
        quantityConsumed: exitData.quantityConsumed,
        quantityReturned: exitData.quantityReturned,
        exitNotes: exitData.exitNotes || undefined,
      })
      toast.success("Salida registrada")
      setExitDialogOpen(false)
      setSelectedDrink(null)
    } catch (error) {
      toast.error("Error al registrar salida")
    }
  }

  const handleDelete = async (id: string) => {
    try {
      await removeDrink({ id: id as any })
      toast.success("Trago eliminado")
    } catch (error) {
      toast.error("Error al eliminar")
    }
  }

  const getStatusBadge = (status: string) => {
    const config: Record<string, { variant: "default" | "secondary" | "outline"; label: string }> = {
      pending_arrival: { variant: "outline", label: "Por llegar" },
      received: { variant: "default", label: "Recibido" },
      completed: { variant: "secondary", label: "Completado" },
    }
    const { variant, label } = config[status] || { variant: "outline", label: status }
    return <Badge variant={variant}>{label}</Badge>
  }

  const pendingCount = drinks?.filter((d) => d.status === "pending_arrival").length || 0

  return (
    <div className="py-4 space-y-6">
      {/* Resumen */}
      {summary && summary.itemCount > 0 && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Card>
            <CardContent className="p-4 text-center">
              <Package className="w-8 h-8 mx-auto mb-2 text-blue-500" />
              <p className="text-2xl font-bold text-gray-900">{summary.totalIn}</p>
              <p className="text-sm text-gray-500">Botellas entrada</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center">
              <Wine className="w-8 h-8 mx-auto mb-2 text-red-500" />
              <p className="text-2xl font-bold text-gray-900">{summary.totalConsumed}</p>
              <p className="text-sm text-gray-500">Consumidas</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center">
              <PackageCheck className="w-8 h-8 mx-auto mb-2 text-green-500" />
              <p className="text-2xl font-bold text-gray-900">{summary.totalReturned}</p>
              <p className="text-sm text-gray-500">Devueltas</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center">
              <Beer className="w-8 h-8 mx-auto mb-2 text-amber-500" />
              <p className="text-2xl font-bold text-gray-900">{summary.pending}</p>
              <p className="text-sm text-gray-500">Pendientes</p>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Acciones */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold text-gray-900">Inventario de Tragos</h3>
          <p className="text-sm text-gray-500">
            {drinks?.length || 0} items registrados
          </p>
        </div>
        <div className="flex gap-2">
          {pendingCount > 0 && (
            <Button variant="outline" size="sm" onClick={handleMarkAllReceived}>
              <Check className="w-4 h-4 mr-1" />
              Recibir todos ({pendingCount})
            </Button>
          )}
          <Button size="sm" onClick={() => setAddDialogOpen(true)}>
            <Plus className="w-4 h-4 mr-1" />
            Agregar Trago
          </Button>
        </div>
      </div>

      {/* Lista de tragos */}
      {drinks === undefined ? (
        <div className="text-center py-8 text-gray-500">Cargando...</div>
      ) : drinks.length === 0 ? (
        <Card>
          <CardContent className="p-12 text-center">
            <Wine className="w-16 h-16 mx-auto mb-4 text-gray-300" />
            <h3 className="text-lg font-semibold text-gray-700 mb-2">Sin tragos registrados</h3>
            <p className="text-gray-500 mb-4">Agrega los tragos que traen los clientes al evento</p>
            <Button onClick={() => setAddDialogOpen(true)}>
              <Plus className="w-4 h-4 mr-1" />
              Agregar primer trago
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="border rounded-lg overflow-hidden bg-white">
          <table className="w-full">
            <thead>
              <tr className="bg-gray-100 border-b">
                <th className="text-left p-3 text-sm font-semibold text-gray-700">Tipo</th>
                <th className="text-left p-3 text-sm font-semibold text-gray-700">Marca</th>
                <th className="text-center p-3 text-sm font-semibold text-gray-700 w-24">Entrada</th>
                <th className="text-center p-3 text-sm font-semibold text-gray-700 w-24">Consumidas</th>
                <th className="text-center p-3 text-sm font-semibold text-gray-700 w-24">Devueltas</th>
                <th className="text-center p-3 text-sm font-semibold text-gray-700 w-28">Estado</th>
                <th className="w-24"></th>
              </tr>
            </thead>
            <tbody>
              {drinks.map((drink) => (
                <tr key={drink._id} className="border-t hover:bg-gray-50 group">
                  <td className="p-3">
                    <span className="font-medium">{DRINK_TYPE_LABELS[drink.drinkType] || drink.drinkType}</span>
                  </td>
                  <td className="p-3 text-gray-700">{drink.brand}</td>
                  <td className="p-3 text-center font-semibold">{drink.quantityIn}</td>
                  <td className="p-3 text-center">
                    {drink.quantityConsumed !== undefined ? drink.quantityConsumed : "-"}
                  </td>
                  <td className="p-3 text-center">
                    {drink.quantityReturned !== undefined ? drink.quantityReturned : "-"}
                  </td>
                  <td className="p-3 text-center">{getStatusBadge(drink.status)}</td>
                  <td className="p-3">
                    <div className="flex gap-1 justify-end">
                      {drink.status === "pending_arrival" && (
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => handleMarkReceived(drink._id)}
                          className="h-8 text-green-600 hover:text-green-700 hover:bg-green-50"
                          title="Marcar como recibido"
                        >
                          <Check className="w-4 h-4" />
                        </Button>
                      )}
                      {drink.status === "received" && (
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => openExitDialog(drink)}
                          className="h-8 text-blue-600 hover:text-blue-700 hover:bg-blue-50"
                          title="Registrar salida"
                        >
                          <PackageCheck className="w-4 h-4" />
                        </Button>
                      )}
                      {drink.status === "completed" && (
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => openExitDialog(drink)}
                          className="h-8 text-gray-600 hover:text-gray-700 hover:bg-gray-50"
                          title="Editar salida"
                        >
                          <PackageCheck className="w-4 h-4" />
                        </Button>
                      )}
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => handleDelete(drink._id)}
                        className="h-8 opacity-0 group-hover:opacity-100 text-red-500 hover:text-red-600 hover:bg-red-50"
                        title="Eliminar"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Dialog Agregar */}
      <Dialog open={addDialogOpen} onOpenChange={setAddDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Agregar Trago</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div>
              <Label>Tipo de Trago</Label>
              <select
                value={newDrink.drinkType}
                onChange={(e) => setNewDrink({ ...newDrink, drinkType: e.target.value })}
                className="w-full mt-1 p-2 border rounded-md"
              >
                {DRINK_TYPES.map((type) => (
                  <option key={type.value} value={type.value}>
                    {type.label}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <Label>Marca</Label>
              <Input
                value={newDrink.brand}
                onChange={(e) => setNewDrink({ ...newDrink, brand: e.target.value })}
                placeholder="Ej: Casillero del Diablo"
                className="mt-1"
              />
            </div>
            <div>
              <Label>Cantidad (botellas)</Label>
              <Input
                type="number"
                min={1}
                value={newDrink.quantityIn}
                onChange={(e) => setNewDrink({ ...newDrink, quantityIn: parseInt(e.target.value) || 1 })}
                className="mt-1"
              />
            </div>
            <div>
              <Label>Notas (opcional)</Label>
              <Textarea
                value={newDrink.entryNotes}
                onChange={(e) => setNewDrink({ ...newDrink, entryNotes: e.target.value })}
                placeholder="Observaciones..."
                className="mt-1"
                rows={2}
              />
            </div>
          </div>
          <div className="flex justify-end gap-3">
            <Button variant="outline" onClick={() => setAddDialogOpen(false)}>
              Cancelar
            </Button>
            <Button onClick={handleAddDrink}>Agregar</Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Dialog Salida */}
      <Dialog open={exitDialogOpen} onOpenChange={setExitDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Registrar Salida</DialogTitle>
          </DialogHeader>
          {selectedDrink && (
            <div className="space-y-4 py-4">
              <div className="p-3 bg-gray-50 rounded-lg">
                <p className="font-medium">{DRINK_TYPE_LABELS[selectedDrink.drinkType]} - {selectedDrink.brand}</p>
                <p className="text-sm text-gray-600">Entrada: {selectedDrink.quantityIn} botellas</p>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Consumidas</Label>
                  <Input
                    type="number"
                    min={0}
                    max={selectedDrink.quantityIn}
                    value={exitData.quantityConsumed}
                    onChange={(e) => setExitData({ ...exitData, quantityConsumed: parseInt(e.target.value) || 0 })}
                    className="mt-1"
                  />
                </div>
                <div>
                  <Label>Devueltas</Label>
                  <Input
                    type="number"
                    min={0}
                    max={selectedDrink.quantityIn}
                    value={exitData.quantityReturned}
                    onChange={(e) => setExitData({ ...exitData, quantityReturned: parseInt(e.target.value) || 0 })}
                    className="mt-1"
                  />
                </div>
              </div>
              {exitData.quantityConsumed + exitData.quantityReturned > selectedDrink.quantityIn && (
                <p className="text-sm text-red-500">
                  El total no puede superar {selectedDrink.quantityIn} botellas
                </p>
              )}
              <div>
                <Label>Notas de salida (opcional)</Label>
                <Textarea
                  value={exitData.exitNotes}
                  onChange={(e) => setExitData({ ...exitData, exitNotes: e.target.value })}
                  placeholder="Observaciones..."
                  className="mt-1"
                  rows={2}
                />
              </div>
            </div>
          )}
          <div className="flex justify-end gap-3">
            <Button variant="outline" onClick={() => setExitDialogOpen(false)}>
              Cancelar
            </Button>
            <Button
              onClick={handleUpdateExit}
              disabled={exitData.quantityConsumed + exitData.quantityReturned > (selectedDrink?.quantityIn || 0)}
            >
              Guardar
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
