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
  ArrowLeft,
  Plus,
  Trash2,
  CheckCircle,
  Circle,
  ChevronRight,
  Edit2,
  X,
  Printer,
  FileSpreadsheet,
} from "lucide-react"
import { toast } from "sonner"
import Link from "next/link"

export default function ShoppingListDetailPage({
  params,
}: {
  params: { id: string }
}) {
  const { id } = params
  const listDetails = useQuery(api.shoppingLists.getShoppingListDetails, { id: id as any })
  const [isAddItemDialogOpen, setIsAddItemDialogOpen] = useState(false)
  const [showDetails, setShowDetails] = useState(false)
  const [filterCategory, setFilterCategory] = useState<string>("all")
  const [filterStatus, setFilterStatus] = useState<string>("all")

  if (listDetails === undefined) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-nature-forest mx-auto mb-4"></div>
          <p className="text-gray-600">Cargando lista...</p>
        </div>
      </div>
    )
  }

  // Aplanar todos los items
  const allItems = Object.values(listDetails.itemsByCategory)
    .flat()
    .sort((a: any, b: any) => (a.isPurchased === b.isPurchased ? 0 : a.isPurchased ? 1 : -1))

  // Categorías únicas
  const uniqueCategories = Array.from(new Set(allItems.map((item: any) => item.category)))

  // Filtrar items
  const filteredItems = allItems.filter((item: any) => {
    const categoryMatch = filterCategory === "all" || item.category === filterCategory
    const statusMatch = filterStatus === "all" ||
      (filterStatus === "pending" && !item.isPurchased) ||
      (filterStatus === "purchased" && item.isPurchased)
    return categoryMatch && statusMatch
  })

  const pendingCount = allItems.filter((item: any) => !item.isPurchased).length
  const totalCount = allItems.length
  const totalCost = allItems.reduce((sum: number, item: any) => sum + (item.estimatedCost || 0), 0)
  const purchasedCost = allItems.filter((i: any) => i.isPurchased).reduce((sum: number, item: any) => sum + (item.estimatedCost || 0), 0)

  const handlePrint = () => window.print()

  const handleExportToExcel = () => {
    const headers = ["Item", "Categoría", "Cantidad", "Unidad", "Costo", "Proveedor", "Estado"]
    const rows = filteredItems.map((item: any) => [
      item.itemName,
      item.category,
      item.quantityOrdered || item.quantityNeeded,
      item.unit,
      item.estimatedCost,
      item.supplier,
      item.isPurchased ? "Comprado" : "Pendiente",
    ])

    rows.push([])
    rows.push(["RESUMEN"])
    rows.push(["Total Costo", "", "", "", totalCost])
    rows.push(["Evento", listDetails.eventName])
    rows.push(["Invitados", listDetails.numberOfGuests])

    const csvContent = [
      headers.join(","),
      ...rows.map(row => row.map(cell => `"${String(cell).replace(/"/g, '""')}"`).join(","))
    ].join("\n")

    const blob = new Blob(["\ufeff" + csvContent], { type: "text/csv;charset=utf-8;" })
    const link = document.createElement("a")
    link.href = URL.createObjectURL(blob)
    link.download = `lista-${listDetails.eventName.replace(/\s+/g, "-")}.csv`
    link.click()
    toast.success("Lista exportada")
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <style jsx global>{`
        @media print {
          .no-print { display: none !important; }
          @page { margin: 1.5cm; }
        }
      `}</style>

      {/* Header */}
      <div className="bg-white border-b sticky top-0 z-10">
        <div className="max-w-2xl mx-auto px-4 py-4">
          <Link href="/admin/listas-compras" className="no-print">
            <Button variant="ghost" size="sm" className="mb-2 -ml-2">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Listas
            </Button>
          </Link>
          <h1 className="text-2xl font-bold text-gray-900">{listDetails.eventName}</h1>
          <div className="flex items-center gap-3 mt-2 text-sm text-gray-600">
            <span>📅 {new Date(listDetails.eventDate).toLocaleDateString("es-CL")}</span>
            <span>👥 {listDetails.numberOfGuests} personas</span>
          </div>
          <div className="mt-3 flex items-center justify-between">
            <span className="text-sm font-medium text-gray-700">
              {pendingCount} de {totalCount} pendientes
            </span>
            <div className="flex items-center gap-2 no-print">
              <Button variant="outline" size="sm" onClick={handleExportToExcel} className="bg-green-50 hover:bg-green-100 border-green-200">
                <FileSpreadsheet className="w-4 h-4 mr-1 text-green-600" />
                Excel
              </Button>
              <Button variant="outline" size="sm" onClick={handlePrint}>
                <Printer className="w-4 h-4 mr-1" />
                Imprimir
              </Button>
              <Button variant="ghost" size="sm" onClick={() => setShowDetails(!showDetails)} className="text-nature-forest">
                {showDetails ? 'Ocultar' : 'Ver'} resumen
                <ChevronRight className={`w-4 h-4 ml-1 transition-transform ${showDetails ? 'rotate-90' : ''}`} />
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Resumen colapsable */}
      {showDetails && (
        <div className="bg-white border-b no-print">
          <div className="max-w-2xl mx-auto px-4 py-4">
            <div className="grid grid-cols-3 gap-3 text-center">
              <div className="p-3 bg-gray-50 rounded-lg">
                <p className="text-xs text-gray-600">Total Estimado</p>
                <p className="text-lg font-bold text-gray-900">${totalCost.toLocaleString()}</p>
              </div>
              <div className="p-3 bg-green-50 rounded-lg">
                <p className="text-xs text-gray-600">Ya Comprado</p>
                <p className="text-lg font-bold text-green-600">${purchasedCost.toLocaleString()}</p>
              </div>
              <div className="p-3 bg-orange-50 rounded-lg">
                <p className="text-xs text-gray-600">Por Comprar</p>
                <p className="text-lg font-bold text-orange-600">${(totalCost - purchasedCost).toLocaleString()}</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Filtros simples */}
      <div className="max-w-2xl mx-auto px-4 py-4 no-print">
        <div className="flex gap-3">
          <select
            value={filterCategory}
            onChange={(e) => setFilterCategory(e.target.value)}
            className="flex-1 p-2 border rounded-lg text-sm"
          >
            <option value="all">Todas las categorías</option>
            {uniqueCategories.map((cat: any) => (
              <option key={cat} value={cat}>{cat}</option>
            ))}
          </select>
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="p-2 border rounded-lg text-sm"
          >
            <option value="all">Todos</option>
            <option value="pending">Pendientes</option>
            <option value="purchased">Comprados</option>
          </select>
        </div>
      </div>

      {/* Lista de items */}
      <div className="max-w-2xl mx-auto px-4 py-2">
        <div className="bg-white rounded-xl shadow-sm overflow-hidden">
          {filteredItems.length === 0 ? (
            <div className="p-12 text-center">
              <p className="text-gray-400 mb-4">
                {allItems.length === 0 ? "Lista vacía" : "No hay items con estos filtros"}
              </p>
              {allItems.length === 0 && (
                <Button onClick={() => setIsAddItemDialogOpen(true)} variant="outline">
                  <Plus className="w-4 h-4 mr-2" />
                  Agregar primer item
                </Button>
              )}
            </div>
          ) : (
            <div className="divide-y divide-gray-100">
              {filteredItems.map((item: any) => (
                <ShoppingListItem key={item._id} item={item} numberOfGuests={listDetails.numberOfGuests} />
              ))}
            </div>
          )}
        </div>

        {/* Botón agregar */}
        {allItems.length > 0 && (
          <Button
            onClick={() => setIsAddItemDialogOpen(true)}
            variant="ghost"
            className="w-full mt-4 text-nature-forest hover:bg-nature-forest/5 no-print"
          >
            <Plus className="w-5 h-5 mr-2" />
            Agregar item
          </Button>
        )}
      </div>

      {/* Dialog agregar item */}
      <Dialog open={isAddItemDialogOpen} onOpenChange={setIsAddItemDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Agregar Item</DialogTitle>
          </DialogHeader>
          <AddItemForm shoppingListId={id as any} onClose={() => setIsAddItemDialogOpen(false)} />
        </DialogContent>
      </Dialog>
    </div>
  )
}

function ShoppingListItem({ item, numberOfGuests }: { item: any; numberOfGuests: number }) {
  const markPurchased = useMutation(api.shoppingLists.markItemAsPurchased)
  const unmarkPurchased = useMutation(api.shoppingLists.unmarkItemAsPurchased)
  const updateItem = useMutation(api.shoppingLists.updateShoppingListItem)
  const deleteItem = useMutation(api.shoppingLists.deleteShoppingListItem)

  const [isEditingQty, setIsEditingQty] = useState(false)
  const [isEditingCost, setIsEditingCost] = useState(false)
  const [quantity, setQuantity] = useState(item.quantityOrdered || item.quantityNeeded)
  const [cost, setCost] = useState(String(item.estimatedCost || 0))

  const handleTogglePurchased = async () => {
    try {
      if (!item.isPurchased) {
        await markPurchased({ id: item._id, actualCost: item.estimatedCost })
        toast.success("Marcado como comprado")
      } else {
        await unmarkPurchased({ id: item._id })
        toast.success("Desmarcado")
      }
    } catch (error) {
      toast.error("Error al actualizar")
    }
  }

  const handleUpdateQuantity = async () => {
    try {
      await updateItem({ id: item._id, quantityOrdered: Number(quantity) })
      setIsEditingQty(false)
      toast.success("Cantidad actualizada")
    } catch (error) {
      toast.error("Error al actualizar")
    }
  }

  const handleUpdateCost = async () => {
    try {
      await updateItem({ id: item._id, estimatedCost: Number(cost) })
      setIsEditingCost(false)
      toast.success("Costo actualizado")
    } catch (error) {
      toast.error("Error al actualizar")
    }
  }

  const handleDelete = async () => {
    if (!confirm(`¿Eliminar ${item.itemName}?`)) return
    try {
      await deleteItem({ id: item._id })
      toast.success("Item eliminado")
    } catch (error) {
      toast.error("Error al eliminar")
    }
  }

  return (
    <div className={`group hover:bg-gray-50 transition-colors ${item.isPurchased ? 'bg-gray-50/50' : ''}`}>
      <div className="flex items-center gap-3 px-4 py-3">
        {/* Checkbox */}
        <button onClick={handleTogglePurchased} className="flex-shrink-0 transition-transform hover:scale-110">
          {item.isPurchased ? (
            <CheckCircle className="w-6 h-6 text-green-600 fill-green-50" />
          ) : (
            <Circle className="w-6 h-6 text-gray-300 hover:text-nature-forest" />
          )}
        </button>

        {/* Contenido */}
        <div className="flex-1 min-w-0">
          <div className="flex items-baseline gap-2">
            <span className={`font-medium ${item.isPurchased ? 'text-gray-400 line-through' : 'text-gray-900'}`}>
              {item.itemName}
            </span>
          </div>

          {/* Cantidad */}
          <div className="mt-1 flex items-center gap-3 flex-wrap">
            {isEditingQty ? (
              <div className="flex items-center gap-1">
                <Input
                  type="number"
                  step="0.01"
                  value={quantity}
                  onChange={(e) => setQuantity(e.target.value)}
                  className="w-16 h-6 text-xs"
                  autoFocus
                />
                <span className="text-xs text-gray-500">{item.unit}</span>
                <Button size="sm" onClick={handleUpdateQuantity} className="h-6 px-2 text-xs">✓</Button>
                <Button size="sm" variant="ghost" onClick={() => setIsEditingQty(false)} className="h-6 px-2 text-xs">✕</Button>
              </div>
            ) : (
              <button
                onClick={() => !item.isPurchased && setIsEditingQty(true)}
                className={`text-sm ${item.isPurchased ? 'text-gray-400' : 'text-gray-600 hover:text-gray-900'}`}
              >
                {quantity} {item.unit}
              </button>
            )}

            <span className="text-gray-300">•</span>

            {/* Costo */}
            {isEditingCost ? (
              <div className="flex items-center gap-1">
                <span className="text-xs">$</span>
                <Input
                  type="number"
                  value={cost}
                  onChange={(e) => setCost(e.target.value)}
                  className="w-20 h-6 text-xs"
                  autoFocus
                />
                <Button size="sm" onClick={handleUpdateCost} className="h-6 px-2 text-xs">✓</Button>
                <Button size="sm" variant="ghost" onClick={() => setIsEditingCost(false)} className="h-6 px-2 text-xs">✕</Button>
              </div>
            ) : (
              <button
                onClick={() => !item.isPurchased && setIsEditingCost(true)}
                className={`text-sm font-semibold ${item.isPurchased ? 'text-gray-400' : 'text-green-600 hover:text-green-700'}`}
              >
                ${Number(cost).toLocaleString()}
              </button>
            )}
          </div>

          {/* Categoría y proveedor */}
          <div className="mt-1.5 flex items-center gap-2">
            <span className="text-xs px-2 py-0.5 bg-gray-100 text-gray-600 rounded">{item.category}</span>
            {item.supplier && item.supplier !== "Sin especificar" && (
              <span className="text-xs px-2 py-0.5 bg-blue-50 text-blue-600 rounded">🏪 {item.supplier}</span>
            )}
          </div>
        </div>

        {/* Eliminar */}
        <Button
          variant="ghost"
          size="sm"
          onClick={handleDelete}
          className="h-8 w-8 p-0 opacity-0 group-hover:opacity-100 transition-opacity no-print"
        >
          <Trash2 className="w-4 h-4 text-red-400" />
        </Button>
      </div>
    </div>
  )
}

function AddItemForm({ shoppingListId, onClose }: { shoppingListId: any; onClose: () => void }) {
  const addItem = useMutation(api.shoppingLists.addManualItem)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsSubmitting(true)

    const formData = new FormData(e.currentTarget)
    const data = {
      shoppingListId,
      itemName: formData.get("itemName") as string,
      category: formData.get("category") as string,
      unit: formData.get("unit") as string,
      quantity: Number(formData.get("quantity")),
      estimatedCost: Number(formData.get("cost")) || 0,
      supplier: formData.get("supplier") as string || "Sin especificar",
    }

    try {
      await addItem(data)
      toast.success("Item agregado")
      onClose()
    } catch (error) {
      toast.error("Error al agregar item")
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <Label htmlFor="itemName">¿Qué necesitas comprar?</Label>
        <Input id="itemName" name="itemName" placeholder="Ej: Tomates, Pollo..." required autoFocus className="text-lg" />
      </div>

      <div className="grid grid-cols-3 gap-3">
        <div>
          <Label htmlFor="quantity">Cantidad</Label>
          <Input id="quantity" name="quantity" type="number" step="0.01" defaultValue="1" required />
        </div>
        <div>
          <Label htmlFor="unit">Unidad</Label>
          <select id="unit" name="unit" className="w-full p-2 border rounded-md h-10" required>
            <option value="kg">kg</option>
            <option value="unidad">unidades</option>
            <option value="litro">litros</option>
            <option value="gramo">gramos</option>
          </select>
        </div>
        <div>
          <Label htmlFor="cost">Costo ($)</Label>
          <Input id="cost" name="cost" type="number" placeholder="0" />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div>
          <Label htmlFor="category">Categoría</Label>
          <select id="category" name="category" className="w-full p-2 border rounded-md">
            <option value="Carnes">Carnes</option>
            <option value="Vegetales">Vegetales</option>
            <option value="Lácteos">Lácteos</option>
            <option value="Granos">Granos</option>
            <option value="Bebidas">Bebidas</option>
            <option value="Condimentos">Condimentos</option>
            <option value="Otros">Otros</option>
          </select>
        </div>
        <div>
          <Label htmlFor="supplier">Proveedor</Label>
          <Input id="supplier" name="supplier" placeholder="Ej: Supermercado" />
        </div>
      </div>

      <div className="flex gap-2 pt-2">
        <Button type="button" variant="outline" onClick={onClose} className="flex-1">Cancelar</Button>
        <Button type="submit" disabled={isSubmitting} className="flex-1 bg-nature-forest hover:bg-nature-moss">
          {isSubmitting ? "Agregando..." : "Agregar"}
        </Button>
      </div>
    </form>
  )
}
