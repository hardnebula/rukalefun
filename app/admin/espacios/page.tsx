"use client"

import { useState } from "react"
import { useQuery, useMutation } from "convex/react"
import { api } from "@/convex/_generated/api"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"
import { Users, MapPin, DollarSign, Plus } from "lucide-react"
import { toast } from "sonner"
import { Toaster } from "@/components/ui/sonner"

export default function EspaciosAdminPage() {
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
    <div className="p-8">
      <Toaster />
      
      {/* Header */}
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Gestión de Espacios</h1>
          <p className="text-gray-600">
            Administra los espacios disponibles en tu centro de eventos
          </p>
        </div>
        <Button onClick={handleCreate}>
          <Plus className="h-4 w-4 mr-2" />
          Nuevo Espacio
        </Button>
      </div>

      {/* Lista de Espacios */}
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
                  {/* Características principales */}
                  <div className="grid grid-cols-3 gap-4">
                    <div className="text-center">
                      <div className="flex items-center justify-center mb-1">
                        <Users className="h-5 w-5 text-nature-forest" />
                      </div>
                      <div className="text-sm text-gray-500">Capacidad</div>
                      <div className="font-semibold">{space.capacity}</div>
                    </div>
                    <div className="text-center">
                      <div className="flex items-center justify-center mb-1">
                        <MapPin className="h-5 w-5 text-nature-forest" />
                      </div>
                      <div className="text-sm text-gray-500">Área</div>
                      <div className="font-semibold">{space.area} m²</div>
                    </div>
                    <div className="text-center">
                      <div className="flex items-center justify-center mb-1">
                        <DollarSign className="h-5 w-5 text-nature-forest" />
                      </div>
                      <div className="text-sm text-gray-500">Precio/Hora</div>
                      <div className="font-semibold">${space.pricePerHour.toLocaleString()}</div>
                    </div>
                  </div>

                  {/* Características */}
                  {space.features.length > 0 && (
                    <div>
                      <div className="text-sm font-medium mb-2">Características:</div>
                      <div className="flex flex-wrap gap-2">
                        {space.features.map((feature, i) => (
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

      {/* Dialog Crear/Editar */}
      <Dialog open={dialogOpen} onOpenChange={(open) => {
        setDialogOpen(open)
        if (!open) resetForm()
      }}>
        <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
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





