"use client"

import { useState } from "react"
import { useQuery, useMutation } from "convex/react"
import { api } from "@/convex/_generated/api"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Plus, Eye, EyeOff, Trash2 } from "lucide-react"
import { toast } from "sonner"
import { Toaster } from "@/components/ui/sonner"

export default function GaleriaAdminPage() {
  const gallery = useQuery(api.gallery.getAllGalleryItems)
  const addItem = useMutation(api.gallery.addGalleryItem)
  const updateItem = useMutation(api.gallery.updateGalleryItem)
  const deleteItem = useMutation(api.gallery.deleteGalleryItem)

  const [dialogOpen, setDialogOpen] = useState(false)
  const [selectedCategory, setSelectedCategory] = useState("all")

  const [formData, setFormData] = useState({
    title: "",
    imageUrl: "",
    category: "boda",
  })

  const categories = [
    { id: "all", label: "Todas" },
    { id: "boda", label: "Matrimonios" },
    { id: "corporativo", label: "Corporativos" },
    { id: "cumpleanos", label: "Cumpleaños" },
    { id: "espacio", label: "Instalaciones" },
  ]

  const filteredGallery =
    selectedCategory === "all"
      ? gallery
      : gallery?.filter((item) => item.category === selectedCategory)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    try {
      await addItem({
        title: formData.title,
        imageUrl: formData.imageUrl,
        category: formData.category,
        isPublic: true,
        order: Date.now(),
      })
      toast.success("Imagen agregada a la galería")
      setDialogOpen(false)
      setFormData({ title: "", imageUrl: "", category: "boda" })
    } catch (error) {
      toast.error("Error al agregar la imagen")
    }
  }

  const toggleVisibility = async (id: string, currentStatus: boolean) => {
    try {
      await updateItem({ id: id as any, isPublic: !currentStatus })
      toast.success(
        currentStatus ? "Imagen ocultada del público" : "Imagen publicada"
      )
    } catch (error) {
      toast.error("Error al actualizar")
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm("¿Estás seguro de eliminar esta imagen?")) return

    try {
      await deleteItem({ id: id as any })
      toast.success("Imagen eliminada")
    } catch (error) {
      toast.error("Error al eliminar")
    }
  }

  return (
    <div className="p-8">
      <Toaster />
      
      {/* Header */}
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Gestión de Galería</h1>
          <p className="text-gray-600">
            Administra las imágenes visibles en la galería pública
          </p>
        </div>
        <Button onClick={() => setDialogOpen(true)}>
          <Plus className="h-4 w-4 mr-2" />
          Nueva Imagen
        </Button>
      </div>

      {/* Filtros */}
      <Card className="mb-6">
        <CardContent className="pt-6">
          <div className="flex flex-wrap gap-3">
            {categories.map((cat) => (
              <Button
                key={cat.id}
                variant={selectedCategory === cat.id ? "default" : "outline"}
                onClick={() => setSelectedCategory(cat.id)}
              >
                {cat.label}
              </Button>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Galería */}
      {!filteredGallery ? (
        <Card>
          <CardContent className="p-8 text-center">
            <p className="text-gray-500">Cargando galería...</p>
          </CardContent>
        </Card>
      ) : filteredGallery.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredGallery.map((item) => (
            <Card key={item._id} className="overflow-hidden">
              <div className="relative aspect-square bg-gray-200">
                <img
                  src={item.imageUrl}
                  alt={item.title}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    e.currentTarget.src = "https://via.placeholder.com/400"
                  }}
                />
                {!item.isPublic && (
                  <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                    <Badge variant="destructive">Oculto</Badge>
                  </div>
                )}
              </div>
              <CardContent className="p-4">
                <h3 className="font-semibold text-sm mb-2 truncate">{item.title}</h3>
                <Badge variant="outline" className="capitalize text-xs">
                  {item.category}
                </Badge>
                <div className="flex gap-2 mt-4">
                  <Button
                    size="sm"
                    variant="outline"
                    className="flex-1"
                    onClick={() => toggleVisibility(item._id, item.isPublic)}
                  >
                    {item.isPublic ? (
                      <>
                        <EyeOff className="h-4 w-4 mr-1" />
                        Ocultar
                      </>
                    ) : (
                      <>
                        <Eye className="h-4 w-4 mr-1" />
                        Publicar
                      </>
                    )}
                  </Button>
                  <Button
                    size="sm"
                    variant="destructive"
                    onClick={() => handleDelete(item._id)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <Card>
          <CardContent className="p-12 text-center">
            <h3 className="text-lg font-semibold mb-2">No hay imágenes</h3>
            <p className="text-gray-600 mb-4">
              Agrega imágenes para mostrar en la galería
            </p>
            <Button onClick={() => setDialogOpen(true)}>
              <Plus className="h-4 w-4 mr-2" />
              Agregar Primera Imagen
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Dialog Agregar */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Agregar Imagen a la Galería</DialogTitle>
          </DialogHeader>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Label htmlFor="title">Título *</Label>
              <Input
                id="title"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                required
                placeholder="Ej: Matrimonio de Maria y Juan"
              />
            </div>

            <div>
              <Label htmlFor="imageUrl">URL de la Imagen *</Label>
              <Input
                id="imageUrl"
                type="url"
                value={formData.imageUrl}
                onChange={(e) => setFormData({ ...formData, imageUrl: e.target.value })}
                required
                placeholder="https://..."
              />
              <p className="text-xs text-gray-500 mt-1">
                Sube la imagen a un servicio como Imgur o Cloudinary y pega la URL
              </p>
            </div>

            <div>
              <Label htmlFor="category">Categoria *</Label>
              <Select
                value={formData.category}
                onValueChange={(value) => setFormData({ ...formData, category: value })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Seleccionar categoria" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="boda">Matrimonios</SelectItem>
                  <SelectItem value="corporativo">Corporativos</SelectItem>
                  <SelectItem value="cumpleanos">Cumpleanos</SelectItem>
                  <SelectItem value="espacio">Instalaciones</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Vista previa */}
            {formData.imageUrl && (
              <div>
                <Label>Vista Previa</Label>
                <div className="mt-2 aspect-video bg-gray-100 rounded overflow-hidden">
                  <img
                    src={formData.imageUrl}
                    alt="Preview"
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      e.currentTarget.src = "https://via.placeholder.com/400"
                    }}
                  />
                </div>
              </div>
            )}

            <div className="flex justify-end space-x-3 pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => {
                  setDialogOpen(false)
                  setFormData({ title: "", imageUrl: "", category: "boda" })
                }}
              >
                Cancelar
              </Button>
              <Button type="submit">Agregar Imagen</Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  )
}





