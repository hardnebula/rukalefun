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
import {
  Plus,
  Edit2,
  Trash2,
  Copy,
  FileText,
  ToggleLeft,
  ToggleRight
} from "lucide-react"
import { toast } from "sonner"

export default function PlantillasCotizacionPage() {
  const templates = useQuery(api.quoteTemplates.getAllTemplates)
  const createTemplate = useMutation(api.quoteTemplates.createTemplate)
  const updateTemplate = useMutation(api.quoteTemplates.updateTemplate)
  const deleteTemplate = useMutation(api.quoteTemplates.deleteTemplate)
  const toggleActive = useMutation(api.quoteTemplates.toggleActive)

  const [isFormOpen, setIsFormOpen] = useState(false)
  const [editingTemplate, setEditingTemplate] = useState<any>(null)
  const [searchTerm, setSearchTerm] = useState("")

  // Estado del formulario
  const [formData, setFormData] = useState({
    name: "",
    eventType: "",
    includedServices: [] as string[],
    additionalServices: [] as string[],
    menuSections: [] as any[],
    pricePerPerson: 0,
    minimumGuests: 100,
    currency: "CLP",
    terms: "",
    signatureName: "Marcelo Mora Jara",
    signatureTitle: "Ruka Lefún",
    signatureLocation: "Villarrica, Chile"
  })

  // Inputs temporales
  const [newService, setNewService] = useState("")
  const [newAdditionalService, setNewAdditionalService] = useState("")
  const [newMenuSection, setNewMenuSection] = useState<{ name: string; items: { category: string; dishes: string[] }[] }>({ name: "", items: [] })
  const [newMenuCategory, setNewMenuCategory] = useState<{ category: string; dishes: string[] }>({ category: "", dishes: [] })
  const [newDish, setNewDish] = useState("")

  const filteredTemplates = templates?.filter(t =>
    t.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    t.eventType.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const resetForm = () => {
    setFormData({
      name: "",
      eventType: "",
      includedServices: [],
      additionalServices: [],
      menuSections: [],
      pricePerPerson: 0,
      minimumGuests: 100,
      currency: "CLP",
      terms: "- La reserva se hace efectiva abonando el 50% del valor total al momento de tomar la decisión de llevar su evento con nosotros y el otro 50%, 10 días antes del evento junto con la confirmación de invitados asistentes.\n\nSolo agregar, nuestro gran compromiso en lograr un momento inolvidable, ocupados de que cada detalle esté cubierto, de manera que ustedes solo se tengan que preocupar de disfrutar de un gran día.",
      signatureName: "Marcelo Mora Jara",
      signatureTitle: "Ruka Lefún",
      signatureLocation: "Villarrica, Chile"
    })
    setEditingTemplate(null)
  }

  const openCreateForm = () => {
    resetForm()
    setIsFormOpen(true)
  }

  const openEditForm = (template: any) => {
    setEditingTemplate(template)
    setFormData({
      name: template.name,
      eventType: template.eventType,
      includedServices: [...template.includedServices],
      additionalServices: [...template.additionalServices],
      menuSections: JSON.parse(JSON.stringify(template.menuSections)),
      pricePerPerson: template.pricePerPerson,
      minimumGuests: template.minimumGuests,
      currency: template.currency,
      terms: template.terms,
      signatureName: template.signatureName,
      signatureTitle: template.signatureTitle,
      signatureLocation: template.signatureLocation
    })
    setIsFormOpen(true)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!formData.name || !formData.eventType) {
      toast.error("Nombre y tipo de evento son requeridos")
      return
    }

    try {
      if (editingTemplate) {
        await updateTemplate({
          id: editingTemplate._id,
          ...formData
        })
        toast.success("Plantilla actualizada")
      } else {
        await createTemplate(formData)
        toast.success("Plantilla creada")
      }
      setIsFormOpen(false)
      resetForm()
    } catch (error) {
      toast.error("Error al guardar plantilla")
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm("¿Eliminar esta plantilla?")) return

    try {
      await deleteTemplate({ id: id as any })
      toast.success("Plantilla eliminada")
    } catch (error) {
      toast.error("Error al eliminar")
    }
  }

  const handleToggleActive = async (id: string) => {
    try {
      await toggleActive({ id: id as any })
      toast.success("Estado actualizado")
    } catch (error) {
      toast.error("Error al actualizar estado")
    }
  }

  // Funciones para agregar items
  const addIncludedService = () => {
    if (newService.trim()) {
      setFormData(prev => ({
        ...prev,
        includedServices: [...prev.includedServices, newService]
      }))
      setNewService("")
    }
  }

  const removeIncludedService = (index: number) => {
    setFormData(prev => ({
      ...prev,
      includedServices: prev.includedServices.filter((_, i) => i !== index)
    }))
  }

  const addAdditionalService = () => {
    if (newAdditionalService.trim()) {
      setFormData(prev => ({
        ...prev,
        additionalServices: [...prev.additionalServices, newAdditionalService]
      }))
      setNewAdditionalService("")
    }
  }

  const removeAdditionalService = (index: number) => {
    setFormData(prev => ({
      ...prev,
      additionalServices: prev.additionalServices.filter((_, i) => i !== index)
    }))
  }

  const addDish = () => {
    if (newDish.trim()) {
      setNewMenuCategory(prev => ({
        ...prev,
        dishes: [...prev.dishes, newDish]
      }))
      setNewDish("")
    }
  }

  const addMenuCategory = () => {
    if (newMenuCategory.category && newMenuCategory.dishes.length > 0) {
      setNewMenuSection(prev => ({
        ...prev,
        items: [...prev.items, { ...newMenuCategory }]
      }))
      setNewMenuCategory({ category: "", dishes: [] })
    }
  }

  const addMenuSection = () => {
    if (newMenuSection.name && newMenuSection.items.length > 0) {
      setFormData(prev => ({
        ...prev,
        menuSections: [...prev.menuSections, { ...newMenuSection }]
      }))
      setNewMenuSection({ name: "", items: [] })
    }
  }

  const removeMenuSection = (index: number) => {
    setFormData(prev => ({
      ...prev,
      menuSections: prev.menuSections.filter((_, i) => i !== index)
    }))
  }

  return (
    <div className="p-8">
      {/* Header */}
      <div className="mb-8 flex justify-between items-start">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Plantillas de Cotización
          </h1>
          <p className="text-gray-600">
            Gestiona plantillas reutilizables para generar cotizaciones rápidamente
          </p>
        </div>
        <Button
          onClick={openCreateForm}
          className="bg-blue-600 hover:bg-blue-700"
        >
          <Plus className="w-5 h-5 mr-2" />
          Nueva Plantilla
        </Button>
      </div>

      {/* Búsqueda */}
      <Card className="mb-6">
        <CardContent className="pt-6">
          <Input
            placeholder="Buscar plantillas..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </CardContent>
      </Card>

      {/* Lista de plantillas */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredTemplates?.map((template) => (
          <Card key={template._id} className={!template.isActive ? "opacity-60" : ""}>
            <CardHeader>
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <CardTitle className="text-lg mb-1">{template.name}</CardTitle>
                  <p className="text-sm text-gray-600">{template.eventType}</p>
                </div>
                <Badge variant={template.isActive ? "default" : "secondary"}>
                  {template.isActive ? "Activa" : "Inactiva"}
                </Badge>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-2 text-sm mb-4">
                <div className="flex justify-between">
                  <span className="text-gray-600">Precio por persona:</span>
                  <span className="font-semibold">
                    ${template.pricePerPerson.toLocaleString()} {template.currency}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Mínimo de invitados:</span>
                  <span>{template.minimumGuests}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Servicios incluidos:</span>
                  <span>{template.includedServices.length}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Secciones de menú:</span>
                  <span>{template.menuSections.length}</span>
                </div>
              </div>

              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleToggleActive(template._id)}
                  className="flex-1"
                >
                  {template.isActive ? (
                    <ToggleRight className="w-4 h-4 mr-1" />
                  ) : (
                    <ToggleLeft className="w-4 h-4 mr-1" />
                  )}
                  {template.isActive ? "Desactivar" : "Activar"}
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => openEditForm(template)}
                >
                  <Edit2 className="w-4 h-4" />
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleDelete(template._id)}
                  className="text-red-600"
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Formulario de plantilla */}
      <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
        <DialogContent open={isFormOpen} onClose={() => setIsFormOpen(false)} className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {editingTemplate ? "Editar Plantilla" : "Nueva Plantilla de Cotización"}
            </DialogTitle>
            <DialogDescription>
              Configura todos los detalles de la plantilla de cotización
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Información básica */}
            <div className="space-y-4">
              <h3 className="font-semibold text-lg">Información Básica</h3>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Nombre de la Plantilla *</Label>
                  <Input
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="Ej: Paseo Familiar DUOC"
                    required
                  />
                </div>
                <div>
                  <Label>Tipo de Evento *</Label>
                  <Input
                    value={formData.eventType}
                    onChange={(e) => setFormData({ ...formData, eventType: e.target.value })}
                    placeholder="Ej: Paseo Familiar"
                    required
                  />
                </div>
              </div>
            </div>

            {/* Servicios Incluidos */}
            <div className="space-y-4">
              <h3 className="font-semibold text-lg">Servicios Incluidos</h3>
              <div className="flex gap-2">
                <Input
                  value={newService}
                  onChange={(e) => setNewService(e.target.value)}
                  placeholder="Agregar servicio..."
                  onKeyPress={(e) => e.key === "Enter" && (e.preventDefault(), addIncludedService())}
                />
                <Button type="button" onClick={addIncludedService}>Agregar</Button>
              </div>
              <div className="border rounded-lg p-4 max-h-40 overflow-y-auto">
                {formData.includedServices.length === 0 ? (
                  <p className="text-sm text-gray-500">No hay servicios agregados</p>
                ) : (
                  <ul className="space-y-2">
                    {formData.includedServices.map((service, i) => (
                      <li key={i} className="flex justify-between items-center text-sm">
                        <span>• {service}</span>
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          onClick={() => removeIncludedService(i)}
                          className="h-6 w-6 p-0"
                        >
                          <Trash2 className="w-3 h-3" />
                        </Button>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </div>

            {/* Servicios Adicionales */}
            <div className="space-y-4">
              <h3 className="font-semibold text-lg">Servicios Adicionales Incluidos</h3>
              <div className="flex gap-2">
                <Input
                  value={newAdditionalService}
                  onChange={(e) => setNewAdditionalService(e.target.value)}
                  placeholder="Agregar servicio adicional..."
                  onKeyPress={(e) => e.key === "Enter" && (e.preventDefault(), addAdditionalService())}
                />
                <Button type="button" onClick={addAdditionalService}>Agregar</Button>
              </div>
              <div className="border rounded-lg p-4 max-h-32 overflow-y-auto">
                {formData.additionalServices.length === 0 ? (
                  <p className="text-sm text-gray-500">No hay servicios adicionales</p>
                ) : (
                  <ul className="space-y-2">
                    {formData.additionalServices.map((service, i) => (
                      <li key={i} className="flex justify-between items-center text-sm">
                        <span>• {service}</span>
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          onClick={() => removeAdditionalService(i)}
                          className="h-6 w-6 p-0"
                        >
                          <Trash2 className="w-3 h-3" />
                        </Button>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </div>

            {/* Menú (simplificado para el formulario) */}
            <div className="space-y-4">
              <h3 className="font-semibold text-lg">Secciones de Menú</h3>
              <p className="text-sm text-gray-600">
                Las secciones de menú se pueden configurar aquí. Por ahora, se mostrarán las existentes.
              </p>
              <div className="border rounded-lg p-4">
                {formData.menuSections.length === 0 ? (
                  <p className="text-sm text-gray-500">No hay secciones de menú configuradas</p>
                ) : (
                  <div className="space-y-2">
                    {formData.menuSections.map((section, i) => (
                      <div key={i} className="flex justify-between items-center p-2 bg-gray-50 rounded">
                        <span className="text-sm font-medium">{section.name}</span>
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          onClick={() => removeMenuSection(i)}
                          className="h-6 w-6 p-0"
                        >
                          <Trash2 className="w-3 h-3" />
                        </Button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Precios */}
            <div className="space-y-4">
              <h3 className="font-semibold text-lg">Precios</h3>
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <Label>Precio por Persona *</Label>
                  <Input
                    type="number"
                    value={formData.pricePerPerson}
                    onChange={(e) => setFormData({ ...formData, pricePerPerson: parseFloat(e.target.value) || 0 })}
                    required
                  />
                </div>
                <div>
                  <Label>Mínimo de Invitados *</Label>
                  <Input
                    type="number"
                    value={formData.minimumGuests}
                    onChange={(e) => setFormData({ ...formData, minimumGuests: parseInt(e.target.value) || 0 })}
                    required
                  />
                </div>
                <div>
                  <Label>Moneda</Label>
                  <Input
                    value={formData.currency}
                    onChange={(e) => setFormData({ ...formData, currency: e.target.value })}
                    placeholder="CLP"
                  />
                </div>
              </div>
            </div>

            {/* Términos */}
            <div className="space-y-4">
              <h3 className="font-semibold text-lg">Términos y Condiciones</h3>
              <Textarea
                value={formData.terms}
                onChange={(e) => setFormData({ ...formData, terms: e.target.value })}
                rows={6}
                placeholder="Términos y condiciones..."
              />
            </div>

            {/* Firma */}
            <div className="space-y-4">
              <h3 className="font-semibold text-lg">Información de Firma</h3>
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <Label>Nombre</Label>
                  <Input
                    value={formData.signatureName}
                    onChange={(e) => setFormData({ ...formData, signatureName: e.target.value })}
                  />
                </div>
                <div>
                  <Label>Título/Empresa</Label>
                  <Input
                    value={formData.signatureTitle}
                    onChange={(e) => setFormData({ ...formData, signatureTitle: e.target.value })}
                  />
                </div>
                <div>
                  <Label>Ubicación</Label>
                  <Input
                    value={formData.signatureLocation}
                    onChange={(e) => setFormData({ ...formData, signatureLocation: e.target.value })}
                  />
                </div>
              </div>
            </div>

            {/* Botones */}
            <div className="flex gap-2 pt-4">
              <Button type="submit" className="flex-1 bg-blue-600 hover:bg-blue-700">
                {editingTemplate ? "Actualizar Plantilla" : "Crear Plantilla"}
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={() => setIsFormOpen(false)}
                className="flex-1"
              >
                Cancelar
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  )
}
