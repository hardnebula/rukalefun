"use client"

import { useState } from "react"
import { useQuery, useMutation } from "convex/react"
import { api } from "@/convex/_generated/api"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Textarea } from "@/components/ui/textarea"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import {
  Users,
  Plus,
  Trash2,
  UserPlus,
  UserMinus,
  CheckCircle2,
  XCircle,
  Edit2,
  Printer,
  Share2,
  Copy,
  ExternalLink,
  RefreshCw,
} from "lucide-react"
import { toast } from "sonner"
import jsPDF from "jspdf"
import autoTable from "jspdf-autotable"

export default function MesasPage() {
  const tables = useQuery(api.tables.getAllTables)
  const bookings = useQuery(api.bookings.getAllBookings)
  const createTable = useMutation(api.tables.createTable)
  const updateTable = useMutation(api.tables.updateTable)
  const assignGuest = useMutation(api.tables.assignGuestToTable)
  const removeGuest = useMutation(api.tables.removeGuestAssignment)
  const updateGuest = useMutation(api.tables.updateGuestAssignment)
  const generateAccessCode = useMutation(api.guestPortal.generateGuestAccessCode)

  const [selectedBooking, setSelectedBooking] = useState<string>("")
  const [isShareDialogOpen, setIsShareDialogOpen] = useState(false)
  const [isGeneratingCode, setIsGeneratingCode] = useState(false)
  const [isAddGuestOpen, setIsAddGuestOpen] = useState(false)
  const [isEditGuestOpen, setIsEditGuestOpen] = useState(false)
  const [selectedTable, setSelectedTable] = useState<any>(null)
  const [editingGuest, setEditingGuest] = useState<any>(null)
  const [editingTableTitle, setEditingTableTitle] = useState<string | null>(null)
  const [tableTitleValue, setTableTitleValue] = useState("")

  const [guestFormData, setGuestFormData] = useState({
    guestName: "",
    dietaryRestrictions: "",
    isConfirmed: false,
    notes: ""
  })

  const tableAssignments = useQuery(
    api.tables.getTableAssignmentsByBooking,
    selectedBooking ? { bookingId: selectedBooking as any } : "skip"
  )

  const tableOccupancy = useQuery(
    api.tables.getTableOccupancyByBooking,
    selectedBooking ? { bookingId: selectedBooking as any } : "skip"
  )

  const confirmedBookings = bookings?.filter(b => b.status === "confirmed") || []
  const selectedBookingData = confirmedBookings.find(b => b._id === selectedBooking)

  const resetGuestForm = () => {
    setGuestFormData({
      guestName: "",
      dietaryRestrictions: "",
      isConfirmed: false,
      notes: ""
    })
  }

  const openAddGuest = (table: any) => {
    setSelectedTable(table)
    resetGuestForm()
    setIsAddGuestOpen(true)
  }

  const openEditGuest = (guest: any) => {
    setEditingGuest(guest)
    setGuestFormData({
      guestName: guest.guestName,
      dietaryRestrictions: guest.dietaryRestrictions || "",
      isConfirmed: guest.isConfirmed,
      notes: guest.notes || ""
    })
    setIsEditGuestOpen(true)
  }

  const handleAddGuest = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!selectedTable || !selectedBooking) return

    try {
      await assignGuest({
        bookingId: selectedBooking as any,
        tableId: selectedTable._id,
        guestName: guestFormData.guestName,
        dietaryRestrictions: guestFormData.dietaryRestrictions || undefined,
        isConfirmed: guestFormData.isConfirmed,
        notes: guestFormData.notes || undefined,
      })
      toast.success("Invitado agregado")
      setIsAddGuestOpen(false)
      resetGuestForm()
    } catch (error: any) {
      toast.error(error.message || "Error al agregar invitado")
    }
  }

  const handleEditGuest = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!editingGuest) return

    try {
      await updateGuest({
        id: editingGuest._id,
        guestName: guestFormData.guestName,
        dietaryRestrictions: guestFormData.dietaryRestrictions || undefined,
        isConfirmed: guestFormData.isConfirmed,
        notes: guestFormData.notes || undefined,
      })
      toast.success("Invitado actualizado")
      setIsEditGuestOpen(false)
      setEditingGuest(null)
      resetGuestForm()
    } catch (error: any) {
      toast.error(error.message || "Error al actualizar invitado")
    }
  }

  const handleRemoveGuest = async (assignmentId: string) => {
    if (!confirm("¿Remover este invitado de la mesa?")) return

    try {
      await removeGuest({ id: assignmentId as any })
      toast.success("Invitado removido")
    } catch (error: any) {
      toast.error(error.message || "Error al remover invitado")
    }
  }

  const startEditingTableTitle = (tableId: string, currentTitle?: string) => {
    setEditingTableTitle(tableId)
    setTableTitleValue(currentTitle || "")
  }

  const saveTableTitle = async (tableId: string) => {
    try {
      await updateTable({
        id: tableId as any,
        title: tableTitleValue || undefined,
      })
      toast.success("Título actualizado")
      setEditingTableTitle(null)
    } catch (error: any) {
      toast.error("Error al actualizar título")
    }
  }

  const cancelEditingTitle = () => {
    setEditingTableTitle(null)
    setTableTitleValue("")
  }

  const totalAssigned = tableAssignments?.length || 0
  const totalGuests = selectedBookingData?.numberOfGuests || 0
  const remainingGuests = totalGuests - totalAssigned

  const generatePDF = () => {
    if (!selectedBookingData || !tableOccupancy) {
      toast.error("Selecciona un evento primero")
      return
    }

    const doc = new jsPDF()
    const pageWidth = doc.internal.pageSize.getWidth()

    // Header
    doc.setFontSize(20)
    doc.setFont("helvetica", "bold")
    doc.text("Ruka Lefún - Organización de Mesas", pageWidth / 2, 20, { align: "center" })

    // Event info
    doc.setFontSize(12)
    doc.setFont("helvetica", "normal")
    doc.text(`Evento: ${selectedBookingData.clientName}`, 14, 35)
    doc.text(`Fecha: ${selectedBookingData.eventDate}`, 14, 42)
    doc.text(`Total de Invitados: ${totalGuests}`, 14, 49)
    doc.text(`Asignados: ${totalAssigned}`, 14, 56)
    doc.text(`Pendientes: ${remainingGuests}`, 14, 63)

    // Summary line
    doc.setDrawColor(200, 200, 200)
    doc.line(14, 68, pageWidth - 14, 68)

    let yPosition = 78

    // Table details
    const tablesWithGuests = tableOccupancy.filter(t => t.occupiedSeats > 0)

    tablesWithGuests.forEach((tableData, index) => {
      // Check if we need a new page
      if (yPosition > 250) {
        doc.addPage()
        yPosition = 20
      }

      // Table header
      doc.setFontSize(14)
      doc.setFont("helvetica", "bold")
      const tableName = tableData.table.title || `Mesa ${tableData.table.tableNumber}`
      doc.text(tableName, 14, yPosition)
      doc.setFontSize(10)
      doc.setFont("helvetica", "normal")
      doc.text(`${tableData.occupiedSeats}/${tableData.table.capacity} personas`, pageWidth - 14, yPosition, { align: "right" })

      yPosition += 8

      // Guests table
      if (tableData.guests.length > 0) {
        const tableRows = tableData.guests.map((guest: any) => [
          guest.guestName,
          guest.isConfirmed ? "✓ Confirmado" : "Pendiente",
          guest.dietaryRestrictions || "-",
          guest.notes || "-"
        ])

        autoTable(doc, {
          startY: yPosition,
          head: [["Invitado", "Estado", "Restricciones", "Notas"]],
          body: tableRows,
          theme: "grid",
          headStyles: {
            fillColor: [45, 80, 22],
            textColor: [255, 255, 255],
            fontSize: 9,
            fontStyle: "bold"
          },
          bodyStyles: {
            fontSize: 8
          },
          columnStyles: {
            0: { cellWidth: 50 },
            1: { cellWidth: 30 },
            2: { cellWidth: 45 },
            3: { cellWidth: 55 }
          },
          margin: { left: 14, right: 14 }
        })

        yPosition = (doc as any).lastAutoTable.finalY + 10
      }
    })

    // Footer on last page
    const pageCount = doc.getNumberOfPages()
    for (let i = 1; i <= pageCount; i++) {
      doc.setPage(i)
      doc.setFontSize(8)
      doc.setFont("helvetica", "italic")
      doc.text(
        `Página ${i} de ${pageCount} - Generado el ${new Date().toLocaleDateString("es-CL")}`,
        pageWidth / 2,
        doc.internal.pageSize.getHeight() - 10,
        { align: "center" }
      )
    }

    // Save PDF
    const fileName = `Mesas_${selectedBookingData.clientName.replace(/\s+/g, "_")}_${new Date().toISOString().split("T")[0]}.pdf`
    doc.save(fileName)

    toast.success("PDF generado exitosamente")
  }

  return (
    <div className="p-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Organización de Mesas
        </h1>
        <p className="text-gray-600">
          Gestiona la distribución de invitados en las mesas del salón (15 mesas • 10 personas c/u)
        </p>
      </div>

      {/* Selección de evento */}
      <Card className="mb-8">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Seleccionar Evento</CardTitle>
            {selectedBooking && (
              <div className="flex items-center gap-2">
                <Button
                  onClick={() => setIsShareDialogOpen(true)}
                  variant="outline"
                  className="flex items-center gap-2 text-green-600 border-green-200 hover:bg-green-50"
                >
                  <Share2 className="w-4 h-4" />
                  Compartir con Novios
                </Button>
                <Button
                  onClick={generatePDF}
                  variant="outline"
                  className="flex items-center gap-2"
                >
                  <Printer className="w-4 h-4" />
                  Imprimir
                </Button>
              </div>
            )}
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label>Evento Confirmado</Label>
              <Select value={selectedBooking} onValueChange={setSelectedBooking}>
                <SelectTrigger>
                  <SelectValue placeholder="Selecciona un evento..." />
                </SelectTrigger>
                <SelectContent>
                  {confirmedBookings.map((booking) => (
                    <SelectItem key={booking._id} value={booking._id}>
                      {booking.clientName} - {booking.eventDate} ({booking.numberOfGuests} invitados)
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {selectedBookingData && (
              <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
                <div className="text-sm font-medium text-blue-900 mb-2">
                  {selectedBookingData.clientName}
                </div>
                <div className="grid grid-cols-3 gap-4 text-sm">
                  <div>
                    <div className="text-blue-600 font-medium">Total Invitados</div>
                    <div className="text-2xl font-bold text-blue-900">{totalGuests}</div>
                  </div>
                  <div>
                    <div className="text-green-600 font-medium">Asignados</div>
                    <div className="text-2xl font-bold text-green-900">{totalAssigned}</div>
                  </div>
                  <div>
                    <div className="text-orange-600 font-medium">Pendientes</div>
                    <div className="text-2xl font-bold text-orange-900">{remainingGuests}</div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Vista de mesas */}
      {selectedBooking && tableOccupancy && (
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4">
          {tableOccupancy.map(({ table, occupiedSeats, availableSeats, guests, percentage }) => (
            <Card
              key={table._id}
              className={`${
                occupiedSeats === table.capacity
                  ? "border-red-500 bg-red-50"
                  : occupiedSeats > 0
                  ? "border-blue-500 bg-blue-50"
                  : "border-gray-200"
              } transition-all hover:shadow-lg`}
            >
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between mb-1">
                  {editingTableTitle === table._id ? (
                    <div className="flex gap-1 flex-1">
                      <Input
                        value={tableTitleValue}
                        onChange={(e) => setTableTitleValue(e.target.value)}
                        onBlur={() => saveTableTitle(table._id)}
                        onKeyDown={(e) => {
                          if (e.key === "Enter") saveTableTitle(table._id)
                          if (e.key === "Escape") cancelEditingTitle()
                        }}
                        placeholder="Título de la mesa"
                        className="h-7 text-sm"
                        autoFocus
                      />
                    </div>
                  ) : (
                    <div className="flex items-center gap-2 flex-1">
                      <CardTitle className="text-lg">
                        {table.title || `Mesa ${table.tableNumber}`}
                      </CardTitle>
                      <button
                        onClick={() => startEditingTableTitle(table._id, table.title)}
                        className="p-1 hover:bg-blue-100 rounded transition-colors"
                        title="Editar nombre de mesa"
                      >
                        <Edit2 className="w-3.5 h-3.5 text-blue-600" />
                      </button>
                    </div>
                  )}
                  <Badge
                    variant={occupiedSeats === table.capacity ? "destructive" : "default"}
                    className={occupiedSeats === 0 ? "bg-gray-400" : ""}
                  >
                    {occupiedSeats}/{table.capacity}
                  </Badge>
                </div>
                {table.title && (
                  <div className="text-xs text-gray-500">Mesa {table.tableNumber}</div>
                )}
                <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
                  <div
                    className={`h-2 rounded-full transition-all ${
                      percentage === 100
                        ? "bg-red-500"
                        : percentage > 0
                        ? "bg-blue-500"
                        : "bg-gray-300"
                    }`}
                    style={{ width: `${percentage}%` }}
                  />
                </div>
              </CardHeader>

              <CardContent>
                {/* Lista de invitados */}
                <div className="space-y-1 mb-3 max-h-32 overflow-y-auto">
                  {guests.map((guest) => (
                    <div
                      key={guest._id}
                      className="flex items-center justify-between text-xs bg-white rounded p-2 group"
                    >
                      <div className="flex items-center gap-1 flex-1 min-w-0">
                        {guest.isConfirmed ? (
                          <CheckCircle2 className="w-3 h-3 text-green-600 flex-shrink-0" />
                        ) : (
                          <XCircle className="w-3 h-3 text-gray-400 flex-shrink-0" />
                        )}
                        <span className="truncate">{guest.guestName}</span>
                      </div>
                      <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button
                          onClick={() => openEditGuest(guest)}
                          className="p-1 hover:bg-blue-100 rounded"
                        >
                          <Edit2 className="w-3 h-3 text-blue-600" />
                        </button>
                        <button
                          onClick={() => handleRemoveGuest(guest._id)}
                          className="p-1 hover:bg-red-100 rounded"
                        >
                          <Trash2 className="w-3 h-3 text-red-600" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Botón agregar invitado */}
                <Button
                  onClick={() => openAddGuest(table)}
                  disabled={occupiedSeats >= table.capacity}
                  variant="outline"
                  size="sm"
                  className="w-full"
                >
                  <UserPlus className="w-4 h-4 mr-1" />
                  {occupiedSeats >= table.capacity ? "Mesa Llena" : "Agregar"}
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {!selectedBooking && (
        <Card>
          <CardContent className="py-12">
            <div className="text-center text-gray-500">
              <Users className="w-16 h-16 mx-auto mb-4 text-gray-300" />
              <p className="text-lg font-medium mb-2">Selecciona un evento</p>
              <p className="text-sm">Elige un evento confirmado para comenzar a organizar las mesas</p>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Dialog: Agregar Invitado */}
      <Dialog open={isAddGuestOpen} onOpenChange={setIsAddGuestOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              Agregar Invitado - Mesa {selectedTable?.tableNumber}
            </DialogTitle>
          </DialogHeader>

          <form onSubmit={handleAddGuest} className="space-y-4">
            <div>
              <Label>Nombre del Invitado *</Label>
              <Input
                value={guestFormData.guestName}
                onChange={(e) => setGuestFormData({ ...guestFormData, guestName: e.target.value })}
                placeholder="Nombre completo"
                required
              />
            </div>

            <div>
              <Label>Restricciones Alimentarias</Label>
              <Input
                value={guestFormData.dietaryRestrictions}
                onChange={(e) => setGuestFormData({ ...guestFormData, dietaryRestrictions: e.target.value })}
                placeholder="Ej: Vegetariano, celíaco, etc."
              />
            </div>

            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="confirmed"
                checked={guestFormData.isConfirmed}
                onChange={(e) => setGuestFormData({ ...guestFormData, isConfirmed: e.target.checked })}
                className="rounded"
              />
              <Label htmlFor="confirmed" className="cursor-pointer">
                Asistencia confirmada
              </Label>
            </div>

            <div>
              <Label>Notas (opcional)</Label>
              <Textarea
                value={guestFormData.notes}
                onChange={(e) => setGuestFormData({ ...guestFormData, notes: e.target.value })}
                placeholder="Notas adicionales..."
                rows={2}
              />
            </div>

            <div className="flex gap-2 pt-4">
              <Button type="submit" className="flex-1 bg-blue-600 hover:bg-blue-700">
                Agregar Invitado
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={() => setIsAddGuestOpen(false)}
                className="flex-1"
              >
                Cancelar
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>

      {/* Dialog: Editar Invitado */}
      <Dialog open={isEditGuestOpen} onOpenChange={setIsEditGuestOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Editar Invitado</DialogTitle>
          </DialogHeader>

          <form onSubmit={handleEditGuest} className="space-y-4">
            <div>
              <Label>Nombre del Invitado *</Label>
              <Input
                value={guestFormData.guestName}
                onChange={(e) => setGuestFormData({ ...guestFormData, guestName: e.target.value })}
                placeholder="Nombre completo"
                required
              />
            </div>

            <div>
              <Label>Restricciones Alimentarias</Label>
              <Input
                value={guestFormData.dietaryRestrictions}
                onChange={(e) => setGuestFormData({ ...guestFormData, dietaryRestrictions: e.target.value })}
                placeholder="Ej: Vegetariano, celíaco, etc."
              />
            </div>

            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="confirmed-edit"
                checked={guestFormData.isConfirmed}
                onChange={(e) => setGuestFormData({ ...guestFormData, isConfirmed: e.target.checked })}
                className="rounded"
              />
              <Label htmlFor="confirmed-edit" className="cursor-pointer">
                Asistencia confirmada
              </Label>
            </div>

            <div>
              <Label>Notas (opcional)</Label>
              <Textarea
                value={guestFormData.notes}
                onChange={(e) => setGuestFormData({ ...guestFormData, notes: e.target.value })}
                placeholder="Notas adicionales..."
                rows={2}
              />
            </div>

            <div className="flex gap-2 pt-4">
              <Button type="submit" className="flex-1 bg-blue-600 hover:bg-blue-700">
                Actualizar
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={() => setIsEditGuestOpen(false)}
                className="flex-1"
              >
                Cancelar
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>

      {/* Dialog: Compartir con Novios */}
      <Dialog open={isShareDialogOpen} onOpenChange={setIsShareDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Share2 className="w-5 h-5 text-green-600" />
              Compartir con Novios
            </DialogTitle>
          </DialogHeader>
          <ShareWithCoupleContent
            bookingId={selectedBooking}
            bookingData={selectedBookingData}
            onClose={() => setIsShareDialogOpen(false)}
          />
        </DialogContent>
      </Dialog>
    </div>
  )
}

// Componente separado para el contenido del dialog de compartir
function ShareWithCoupleContent({
  bookingId,
  bookingData,
  onClose,
}: {
  bookingId: string
  bookingData: any
  onClose: () => void
}) {
  const generateAccessCode = useMutation(api.guestPortal.generateGuestAccessCode)
  const [isGenerating, setIsGenerating] = useState(false)
  const [accessCode, setAccessCode] = useState<string | null>(bookingData?.guestAccessCode || null)

  const handleGenerateCode = async () => {
    if (!bookingId) return
    setIsGenerating(true)
    try {
      const code = await generateAccessCode({ bookingId: bookingId as any })
      setAccessCode(code)
      toast.success("Código generado")
    } catch (error) {
      toast.error("Error al generar código")
    } finally {
      setIsGenerating(false)
    }
  }

  const shareUrl = accessCode
    ? `${typeof window !== "undefined" ? window.location.origin : ""}/invitados/${accessCode}`
    : null

  const handleCopyLink = () => {
    if (shareUrl) {
      navigator.clipboard.writeText(shareUrl)
      toast.success("Link copiado al portapapeles")
    }
  }

  const handleCopyCode = () => {
    if (accessCode) {
      navigator.clipboard.writeText(accessCode)
      toast.success("Código copiado")
    }
  }

  return (
    <div className="space-y-4">
      <p className="text-sm text-gray-600">
        Genera un link para que los novios puedan agregar y confirmar invitados directamente.
      </p>

      {!accessCode ? (
        <div className="text-center py-6">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Share2 className="w-8 h-8 text-green-600" />
          </div>
          <p className="text-gray-600 mb-4">Este evento aún no tiene un código de acceso</p>
          <Button
            onClick={handleGenerateCode}
            disabled={isGenerating}
            className="bg-green-600 hover:bg-green-700"
          >
            {isGenerating ? (
              <>
                <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                Generando...
              </>
            ) : (
              <>
                <Share2 className="w-4 h-4 mr-2" />
                Generar Link de Acceso
              </>
            )}
          </Button>
        </div>
      ) : (
        <div className="space-y-4">
          {/* Código */}
          <div>
            <Label className="text-xs text-gray-500">Código de Acceso</Label>
            <div className="flex items-center gap-2 mt-1">
              <code className="flex-1 bg-gray-100 px-3 py-2 rounded-lg font-mono text-lg tracking-wider">
                {accessCode}
              </code>
              <Button variant="outline" size="sm" onClick={handleCopyCode}>
                <Copy className="w-4 h-4" />
              </Button>
            </div>
          </div>

          {/* Link */}
          <div>
            <Label className="text-xs text-gray-500">Link para Compartir</Label>
            <div className="flex items-center gap-2 mt-1">
              <Input
                value={shareUrl || ""}
                readOnly
                className="text-sm"
              />
              <Button variant="outline" size="sm" onClick={handleCopyLink}>
                <Copy className="w-4 h-4" />
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => window.open(shareUrl!, "_blank")}
              >
                <ExternalLink className="w-4 h-4" />
              </Button>
            </div>
          </div>

          {/* Instrucciones */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
            <p className="text-sm text-blue-800">
              <strong>Comparte este link con los novios.</strong> Ellos podrán:
            </p>
            <ul className="text-sm text-blue-700 mt-2 space-y-1 ml-4 list-disc">
              <li>Ver la lista de invitados</li>
              <li>Agregar nuevos invitados</li>
              <li>Marcar confirmaciones de asistencia</li>
            </ul>
          </div>

          {/* Regenerar */}
          <Button
            variant="ghost"
            size="sm"
            onClick={handleGenerateCode}
            disabled={isGenerating}
            className="w-full text-gray-500"
          >
            <RefreshCw className={`w-4 h-4 mr-2 ${isGenerating ? "animate-spin" : ""}`} />
            Regenerar código (invalida el anterior)
          </Button>
        </div>
      )}
    </div>
  )
}
