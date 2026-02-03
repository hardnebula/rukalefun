"use client"

import { useState, useRef, useEffect } from "react"
import { useQuery, useMutation } from "convex/react"
import { api } from "@/convex/_generated/api"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  ArrowLeft,
  Plus,
  Trash2,
  CheckCircle,
  Circle,
  ChevronRight,
  ChevronDown,
  Printer,
  FileSpreadsheet,
  Search,
  X,
} from "lucide-react"
import { toast } from "sonner"
import Link from "next/link"

// Items comunes para agregar rápido
const QUICK_ADD_ITEMS = [
  { name: "Tomates", category: "Vegetales", unit: "kg" },
  { name: "Cebolla", category: "Vegetales", unit: "kg" },
  { name: "Ajo", category: "Vegetales", unit: "unidad" },
  { name: "Pollo", category: "Carnes", unit: "kg" },
  { name: "Carne molida", category: "Carnes", unit: "kg" },
  { name: "Cerdo", category: "Carnes", unit: "kg" },
  { name: "Arroz", category: "Granos", unit: "kg" },
  { name: "Aceite", category: "Condimentos", unit: "litro" },
  { name: "Sal", category: "Condimentos", unit: "kg" },
  { name: "Leche", category: "Lácteos", unit: "litro" },
  { name: "Queso", category: "Lácteos", unit: "kg" },
  { name: "Huevos", category: "Lácteos", unit: "unidad" },
  { name: "Pan", category: "Panadería", unit: "unidad" },
  { name: "Vino", category: "Bebidas", unit: "unidad" },
  { name: "Cerveza", category: "Bebidas", unit: "unidad" },
  { name: "Bebidas", category: "Bebidas", unit: "unidad" },
]

// Detectar categoría automáticamente
const detectCategory = (itemName: string): string => {
  const name = itemName.toLowerCase()

  if (/pollo|carne|cerdo|res|cordero|pescado|mariscos|chorizo|tocino|jamón/.test(name)) return "Carnes"
  if (/tomate|cebolla|ajo|lechuga|zanahoria|papa|pepino|pimiento|zapallo|acelga|espinaca|brócoli|coliflor|apio|champiñón/.test(name)) return "Vegetales"
  if (/leche|queso|crema|yogurt|mantequilla|huevo/.test(name)) return "Lácteos"
  if (/arroz|fideo|pasta|pan|harina|avena|quinoa|legumbre|poroto|lenteja|garbanzo/.test(name)) return "Granos"
  if (/vino|cerveza|bebida|jugo|agua|pisco|ron|vodka|whisky|espumante|champagne/.test(name)) return "Bebidas"
  if (/sal|aceite|vinagre|azúcar|pimienta|orégano|comino|merkén|ají|salsa|mayonesa|mostaza|ketchup/.test(name)) return "Condimentos"
  if (/manzana|naranja|plátano|limón|frutilla|uva|pera|durazno|fruta/.test(name)) return "Frutas"
  if (/servilleta|vaso|plato|cubierto|mantel|decoración|vela/.test(name)) return "Otros"

  return "Otros"
}

// Detectar unidad automáticamente
const detectUnit = (itemName: string): string => {
  const name = itemName.toLowerCase()

  // Líquidos -> litro
  if (/leche|aceite|jugo|agua|crema|salsa|vino|cerveza/.test(name)) return "litro"
  // Productos que se pesan -> kg
  if (/carne|pollo|cerdo|pescado|tomate|cebolla|papa|zanahoria|lechuga|fruta|verdura|arroz|azucar|harina|sal/.test(name)) return "kg"

  // Por defecto, unidades (huevos, pan, botellas, longanizas, etc.)
  return "unidad"
}

// Parser inteligente de texto natural
interface ParsedItem {
  name: string
  quantity: number
  unit: string
  unitPrice: number | null  // precio por unidad
  totalPrice: number | null // precio total
  category: string
}

const parseNaturalInput = (input: string): ParsedItem => {
  const text = input.toLowerCase().trim()

  let quantity = 1
  let unit = "unidad" // default cuando no se especifica
  let unitPrice: number | null = null
  let totalPrice: number | null = null
  let name = input.trim()

  // Patrones para detectar cantidad y unidad al inicio
  // Unidades largas (seguras de matchear)
  const longUnits = "kilos|kilo|kg|gramos|gramo|litros|litro|unidades|unidad|docena|doc"
  // Unidades cortas requieren que NO les siga una letra (para evitar "3 longanizas" -> "3l onganizas")
  const shortUnits = "gr(?![a-z])|g(?![a-z])|lt(?![a-z])|l(?![a-z])|un(?![a-z])|u(?![a-z])"
  const unitPattern = `${longUnits}|${shortUnits}`

  // Patrón 1: número + unidad explícita: "2kg tomate", "2 kg tomate", "2kg de tomate"
  const qtyUnitStartPattern = new RegExp(`^(\\d+(?:[.,]\\d+)?)\\s*(${unitPattern})s?\\s*(?:de\\s+)?`, "i")
  const qtyUnitMatch = text.match(qtyUnitStartPattern)

  let matched = false
  if (qtyUnitMatch) {
    quantity = parseFloat(qtyUnitMatch[1].replace(",", "."))
    unit = normalizeUnit(qtyUnitMatch[2])
    name = input.slice(qtyUnitMatch[0].length).trim()
    matched = true
  }

  if (!matched) {
    // Patrón 2: "tomate 2kg" o "tomate 2 kg" (unidad al final)
    const qtyUnitEndPattern = new RegExp(`\\s+(\\d+(?:[.,]\\d+)?)\\s*(${unitPattern})s?\\s*$`, "i")
    const endMatch = text.match(qtyUnitEndPattern)
    if (endMatch) {
      quantity = parseFloat(endMatch[1].replace(",", "."))
      unit = normalizeUnit(endMatch[2])
      name = input.slice(0, text.indexOf(endMatch[0])).trim()
      matched = true
    }
  }

  if (!matched) {
    // Patrón 3: solo número al inicio seguido de espacio + palabra: "3 longanizas" -> qty=3, unit=unidad, name=longanizas
    const qtyOnlyPattern = /^(\d+(?:[.,]\d+)?)\s+([a-zA-ZáéíóúñÁÉÍÓÚÑ])/
    const qtyOnlyMatch = text.match(qtyOnlyPattern)
    if (qtyOnlyMatch) {
      quantity = parseFloat(qtyOnlyMatch[1].replace(",", "."))
      unit = "unidad"
      // El nombre empieza donde empieza la palabra (después del número y espacio)
      const nameStartIndex = text.indexOf(qtyOnlyMatch[2])
      name = input.slice(nameStartIndex).trim()
    }
  }

  // Detectar precios
  // "a 1500 el kg", "a $1500/kg", "a 1500 c/u", "$1500 el kilo"
  const unitPricePattern = /(?:a\s+)?\$?\s*(\d+(?:[.,]\d+)?)\s*(?:el|por|\/|c\/u|cada|x)\s*(?:kg|kilo|litro|lt|unidad|u)?/i
  const unitPriceMatch = text.match(unitPricePattern)

  if (unitPriceMatch) {
    unitPrice = parseFloat(unitPriceMatch[1].replace(",", "."))
    // Remover el precio del nombre
    name = name.replace(new RegExp(unitPriceMatch[0].replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'i'), '').trim()
  }

  // Precio total: "$3000", "3000 pesos", "$3.000"
  if (!unitPrice) {
    const totalPricePattern = /\$?\s*(\d{1,3}(?:[.,]\d{3})*|\d+)\s*(?:pesos)?$/i
    const totalPriceMatch = text.match(totalPricePattern)
    if (totalPriceMatch) {
      const priceStr = totalPriceMatch[1].replace(/\./g, "").replace(",", ".")
      totalPrice = parseFloat(priceStr)
      name = name.replace(new RegExp(totalPriceMatch[0].replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'i'), '').trim()
    }
  }

  // Limpiar el nombre
  name = name
    .replace(/^de\s+/i, "")
    .replace(/\s+a\s*$/i, "")
    .replace(/\s+/g, " ")
    .trim()

  // Capitalizar primera letra
  name = name.charAt(0).toUpperCase() + name.slice(1)

  // Calcular costo total
  let finalCost = 0
  if (unitPrice) {
    finalCost = Math.round(quantity * unitPrice)
  } else if (totalPrice) {
    finalCost = totalPrice
  }

  return {
    name,
    quantity,
    unit,
    unitPrice,
    totalPrice: finalCost,
    category: detectCategory(name)
  }
}

// Normalizar unidades
const normalizeUnit = (unit: string): string => {
  const u = unit.toLowerCase()
  if (/^(kg|kilo|kilos)$/.test(u)) return "kg"
  if (/^(g|gr|gramo|gramos)$/.test(u)) return "gramo"
  if (/^(lt|l|litro|litros)$/.test(u)) return "litro"
  if (/^(u|un|unidad|unidades)$/.test(u)) return "unidad"
  if (/^(doc|docena)$/.test(u)) return "docena"
  return "unidad"
}

export default function ShoppingListDetailPage({
  params,
}: {
  params: { id: string }
}) {
  const { id } = params
  const listDetails = useQuery(api.shoppingLists.getShoppingListDetails, { id: id as any })
  const addItem = useMutation(api.shoppingLists.addManualItem)

  const [showDetails, setShowDetails] = useState(false)
  const [filterCategory, setFilterCategory] = useState<string>("all")
  const [filterStatus, setFilterStatus] = useState<string>("all")

  // Quick add state
  const [quickAddValue, setQuickAddValue] = useState("")
  const [isAdding, setIsAdding] = useState(false)
  const [showSuggestions, setShowSuggestions] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)

  // Parse input en tiempo real para mostrar preview
  const parsedItem = quickAddValue.trim() ? parseNaturalInput(quickAddValue) : null

  // Filtrar sugerencias basadas en input (solo si no parece texto complejo con precios)
  const hasComplexInput = /\d.*[a$]|\$/.test(quickAddValue)
  const suggestions = quickAddValue.length > 0 && !hasComplexInput
    ? QUICK_ADD_ITEMS.filter(item =>
        item.name.toLowerCase().includes(quickAddValue.toLowerCase())
      ).slice(0, 5)
    : []

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

  // Aplanar todos los items (itemsByCategory es ahora un array de { category, items })
  const allItems = listDetails.itemsByCategory
    .flatMap((c: any) => c.items)
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

  // Quick add handler - usa parser inteligente
  const handleQuickAdd = async (itemName?: string, itemCategory?: string, itemUnit?: string, itemQty?: number) => {
    setIsAdding(true)

    try {
      let name: string
      let category: string
      let unit: string
      let quantity: number
      let cost: number

      if (itemName) {
        // Agregar desde botones rápidos o sugerencias
        name = itemName
        category = itemCategory || detectCategory(itemName)
        unit = itemUnit || detectUnit(itemName)
        quantity = itemQty || 1
        cost = 0
      } else if (parsedItem) {
        // Usar el parser inteligente
        name = parsedItem.name
        category = parsedItem.category
        unit = parsedItem.unit
        quantity = parsedItem.quantity
        cost = parsedItem.totalPrice || 0
      } else {
        setIsAdding(false)
        return
      }

      await addItem({
        shoppingListId: id as any,
        itemName: name,
        category,
        unit,
        quantity,
        estimatedCost: cost,
        supplier: "Sin especificar",
      })

      const costText = cost > 0 ? ` - $${cost.toLocaleString()}` : ""
      toast.success(`${name} (${quantity} ${unit})${costText} agregado`)
      setQuickAddValue("")
      setShowSuggestions(false)
      inputRef.current?.focus()
    } catch (error) {
      toast.error("Error al agregar")
    } finally {
      setIsAdding(false)
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && quickAddValue.trim()) {
      e.preventDefault()
      handleQuickAdd()
    }
    if (e.key === "Escape") {
      setShowSuggestions(false)
    }
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

      {/* Quick Add Bar con Parser Inteligente */}
      <div className="bg-white border-b sticky top-[140px] z-10 no-print">
        <div className="max-w-2xl mx-auto px-4 py-3">
          {/* Input principal */}
          <div className="flex gap-2">
            <div className="relative flex-1">
              <div className="flex items-center bg-gray-100 rounded-lg border-2 border-transparent focus-within:border-nature-forest focus-within:bg-white transition-all">
                <Plus className="w-5 h-5 text-gray-400 ml-3" />
                <input
                  ref={inputRef}
                  type="text"
                  value={quickAddValue}
                  onChange={(e) => {
                    setQuickAddValue(e.target.value)
                    setShowSuggestions(e.target.value.length > 0)
                  }}
                  onKeyDown={handleKeyDown}
                  onFocus={() => setShowSuggestions(quickAddValue.length > 0)}
                  placeholder="Ej: 2kg tomates a 1500 el kg"
                  className="flex-1 bg-transparent px-3 py-2.5 text-sm outline-none"
                />
                {quickAddValue && (
                  <button
                    onClick={() => {
                      setQuickAddValue("")
                      setShowSuggestions(false)
                    }}
                    className="p-2 text-gray-400 hover:text-gray-600"
                  >
                    <X className="w-4 h-4" />
                  </button>
                )}
              </div>

              {/* Sugerencias dropdown */}
              {showSuggestions && suggestions.length > 0 && (
                <div className="absolute top-full left-0 right-0 mt-1 bg-white rounded-lg shadow-lg border z-20 overflow-hidden">
                  {suggestions.map((item, idx) => (
                    <button
                      key={idx}
                      onClick={() => handleQuickAdd(item.name, item.category, item.unit)}
                      className="w-full px-4 py-2.5 text-left hover:bg-gray-50 flex items-center justify-between transition-colors"
                    >
                      <span className="font-medium">{item.name}</span>
                      <span className="text-xs text-gray-400">{item.category}</span>
                    </button>
                  ))}
                </div>
              )}
            </div>

            <Button
              onClick={() => handleQuickAdd()}
              disabled={!quickAddValue.trim() || isAdding}
              className="bg-nature-forest hover:bg-nature-moss px-4"
            >
              {isAdding ? "..." : "Agregar"}
            </Button>
          </div>

          {/* Preview de lo parseado */}
          {parsedItem && quickAddValue.trim() && (
            <div className="mt-2 p-2 bg-green-50 border border-green-200 rounded-lg flex items-center justify-between text-sm">
              <div className="flex items-center gap-3">
                <span className="font-medium text-green-800">{parsedItem.name}</span>
                <span className="text-green-600">{parsedItem.quantity} {parsedItem.unit}</span>
                <span className="text-xs px-2 py-0.5 bg-green-100 text-green-700 rounded">{parsedItem.category}</span>
              </div>
              {parsedItem.totalPrice !== null && parsedItem.totalPrice > 0 && (
                <span className="font-semibold text-green-700">${parsedItem.totalPrice.toLocaleString()}</span>
              )}
            </div>
          )}

          {/* Tip */}
          {!quickAddValue && (
            <p className="mt-2 text-xs text-gray-400">
              💡 Escribe natural: &quot;2kg tomates a 1500 el kg&quot;, &quot;3 litros leche $2400&quot;, &quot;pollo entero $5000&quot;
            </p>
          )}
        </div>
      </div>

      {/* Items Rápidos */}
      <div className="bg-gray-50 border-b no-print">
        <div className="max-w-2xl mx-auto px-4 py-3">
          <p className="text-xs text-gray-500 mb-2">Agregar rápido:</p>
          <div className="flex flex-wrap gap-2">
            {QUICK_ADD_ITEMS.slice(0, 10).map((item, idx) => (
              <button
                key={idx}
                onClick={() => handleQuickAdd(item.name, item.category, item.unit)}
                disabled={isAdding}
                className="px-3 py-1.5 text-xs bg-white border rounded-full hover:bg-nature-forest hover:text-white hover:border-nature-forest transition-all disabled:opacity-50"
              >
                + {item.name}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Filtros simples */}
      <div className="max-w-2xl mx-auto px-4 py-4 no-print">
        <div className="flex gap-3">
          <select
            value={filterCategory}
            onChange={(e) => setFilterCategory(e.target.value)}
            className="flex-1 p-2 border rounded-lg text-sm bg-white"
          >
            <option value="all">Todas las categorías</option>
            {uniqueCategories.map((cat: any) => (
              <option key={cat} value={cat}>{cat}</option>
            ))}
          </select>
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="p-2 border rounded-lg text-sm bg-white"
          >
            <option value="all">Todos</option>
            <option value="pending">Pendientes</option>
            <option value="purchased">Comprados</option>
          </select>
        </div>
      </div>

      {/* Lista de items */}
      <div className="max-w-2xl mx-auto px-4 py-2 pb-8">
        <div className="bg-white rounded-xl shadow-sm overflow-hidden">
          {filteredItems.length === 0 ? (
            <div className="p-12 text-center">
              <p className="text-gray-400 mb-2">
                {allItems.length === 0 ? "Lista vacía" : "No hay items con estos filtros"}
              </p>
              {allItems.length === 0 && (
                <p className="text-sm text-gray-500">
                  Escribe algo como &quot;2kg de carne a 8000 el kg&quot; arriba
                </p>
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
      </div>
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
