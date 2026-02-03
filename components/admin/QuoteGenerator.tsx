"use client"

import { useState, useRef, useEffect } from "react"
import { useQuery, useMutation } from "convex/react"
import { api } from "@/convex/_generated/api"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"
import { Printer, FileDown, Edit2, Check, Plus, Trash2, Star, CalendarCheck, Clock } from "lucide-react"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { toast } from "sonner"
import { exportQuoteToPDF } from "@/lib/pdfExport"

interface QuoteGeneratorProps {
  open: boolean
  onClose: () => void
  quoteRequest?: any
  quickMode?: boolean
}

export default function QuoteGenerator({ open, onClose, quoteRequest, quickMode = false }: QuoteGeneratorProps) {
  const templates = useQuery(api.quoteTemplates.getActiveTemplates)
  const defaultTemplate = useQuery(api.quoteTemplates.getDefaultTemplate)
  const spaces = useQuery(api.spaces.getAllSpaces)
  const createGeneratedQuote = useMutation(api.generatedQuotes.createGeneratedQuote)
  const convertToBooking = useMutation(api.bookings.convertQuoteToBooking)

  const [selectedTemplateId, setSelectedTemplateId] = useState<string>("")
  const [clientData, setClientData] = useState({
    name: quoteRequest?.name || "",
    date: quoteRequest?.eventDate || "",
    numberOfGuests: quoteRequest?.numberOfGuests || 100,
    email: quoteRequest?.email || "",
    phone: quoteRequest?.phone || "",
  })
  const [showPreview, setShowPreview] = useState(false)
  const [isEditMode, setIsEditMode] = useState(false)
  const [editableQuoteData, setEditableQuoteData] = useState<any>(null)
  const [showTemplateList, setShowTemplateList] = useState(false)
  const [savedQuoteId, setSavedQuoteId] = useState<string | null>(null)

  // Estados para conversión a reserva
  const [showConvertDialog, setShowConvertDialog] = useState(false)
  const [convertFormData, setConvertFormData] = useState({
    startTime: "12:00",
    endTime: "20:00",
    spaceId: "none",
    specialRequests: ""
  })
  const [isConverting, setIsConverting] = useState(false)

  const printRef = useRef<HTMLDivElement>(null)

  const selectedTemplate = templates?.find(t => t._id === selectedTemplateId)

  // Efecto para modo rápido: auto-inicializar con plantilla default
  useEffect(() => {
    if (quickMode && defaultTemplate && open) {
      setSelectedTemplateId(defaultTemplate._id)
      setClientData({
        name: quoteRequest?.name || "",
        date: quoteRequest?.eventDate || new Date().toISOString().split('T')[0],
        numberOfGuests: quoteRequest?.numberOfGuests || 100,
        email: quoteRequest?.email || "",
        phone: quoteRequest?.phone || "",
      })
      // Inicializar datos editables inmediatamente
      setEditableQuoteData({
        ...defaultTemplate,
        includedServices: [...defaultTemplate.includedServices],
        additionalServices: [...defaultTemplate.additionalServices],
        menuSections: JSON.parse(JSON.stringify(defaultTemplate.menuSections)),
      })
      setShowPreview(true)
      setIsEditMode(true)
    }
  }, [quickMode, defaultTemplate, open, quoteRequest])

  // Efecto para pre-seleccionar plantilla default cuando no hay selección
  useEffect(() => {
    if (!quickMode && defaultTemplate && !selectedTemplateId && open) {
      setSelectedTemplateId(defaultTemplate._id)
    }
  }, [defaultTemplate, selectedTemplateId, open, quickMode])

  // Función auxiliar para guardar cotización (usada por handleGenerate y handleSaveAndConvert)
  const saveQuote = async () => {
    if (!selectedTemplate) {
      throw new Error("Selecciona una plantilla")
    }
    if (!clientData.name || !clientData.date) {
      throw new Error("Completa todos los campos")
    }

    const totalAmount = (editableQuoteData?.pricePerPerson || selectedTemplate.pricePerPerson) * clientData.numberOfGuests
    const dataToSave = editableQuoteData || selectedTemplate

    const quoteId = await createGeneratedQuote({
      quoteRequestId: quoteRequest?._id,
      templateId: selectedTemplate._id,
      clientName: clientData.name,
      clientEmail: clientData.email || quoteRequest?.email,
      clientPhone: clientData.phone || quoteRequest?.phone,
      eventDate: clientData.date,
      eventType: selectedTemplate.eventType,
      numberOfGuests: clientData.numberOfGuests,
      templateName: selectedTemplate.name,
      includedServices: dataToSave.includedServices,
      additionalServices: dataToSave.additionalServices,
      menuSections: dataToSave.menuSections,
      pricePerPerson: dataToSave.pricePerPerson,
      minimumGuests: dataToSave.minimumGuests,
      totalAmount: totalAmount,
      currency: selectedTemplate.currency,
    })

    return quoteId
  }

  const handleGenerate = async () => {
    if (!selectedTemplate) {
      toast.error("Selecciona una plantilla")
      return
    }
    if (!clientData.name || !clientData.date) {
      toast.error("Completa todos los campos")
      return
    }

    try {
      const quoteId = await saveQuote()
      setSavedQuoteId(quoteId)

      // Initialize editable quote data with template data
      setEditableQuoteData({
        ...selectedTemplate,
        includedServices: [...selectedTemplate.includedServices],
        additionalServices: [...selectedTemplate.additionalServices],
        menuSections: JSON.parse(JSON.stringify(selectedTemplate.menuSections)),
      })
      setShowPreview(true)
      toast.success("Cotización generada y guardada en el historial")
    } catch (error) {
      console.error("Error saving quote:", error)
      toast.error("Error al guardar la cotización")
    }
  }

  const handlePrint = () => {
    window.print()
  }

  const handleExportPDF = async () => {
    if (!editableQuoteData) return

    try {
      await exportQuoteToPDF({
        clientName: clientData.name,
        eventDate: clientData.date,
        numberOfGuests: clientData.numberOfGuests,
        template: editableQuoteData
      })
      toast.success("PDF generado exitosamente")
    } catch (error) {
      console.error("Error exporting PDF:", error)
      toast.error("Error al generar PDF")
    }
  }

  const handleClose = () => {
    setShowPreview(false)
    setIsEditMode(false)
    setEditableQuoteData(null)
    setSelectedTemplateId("")
    setShowTemplateList(false)
    setSavedQuoteId(null)
    setShowConvertDialog(false)
    setConvertFormData({
      startTime: "12:00",
      endTime: "20:00",
      spaceId: "none",
      specialRequests: ""
    })
    setClientData({
      name: quoteRequest?.name || "",
      date: quoteRequest?.eventDate || "",
      numberOfGuests: quoteRequest?.numberOfGuests || 100,
      email: quoteRequest?.email || "",
      phone: quoteRequest?.phone || "",
    })
    onClose()
  }

  // Función para guardar cotización y abrir diálogo de conversión
  const handleOpenConvertDialog = async () => {
    // Si estamos en modo rápido y no hemos guardado aún, guardar primero
    if (!savedQuoteId && quickMode) {
      try {
        const quoteId = await saveQuote()
        setSavedQuoteId(quoteId)
        toast.success("Cotización guardada")
      } catch (error) {
        toast.error("Error al guardar la cotización")
        return
      }
    }
    setShowConvertDialog(true)
  }

  // Función para convertir cotización a reserva
  const handleConvertToBooking = async () => {
    if (!savedQuoteId) {
      toast.error("Primero debes guardar la cotización")
      return
    }

    setIsConverting(true)
    try {
      await convertToBooking({
        generatedQuoteId: savedQuoteId as any,
        startTime: convertFormData.startTime,
        endTime: convertFormData.endTime,
        spaceId: convertFormData.spaceId !== "none" ? convertFormData.spaceId as any : undefined,
        specialRequests: convertFormData.specialRequests || undefined,
      })
      toast.success("¡Reserva creada exitosamente!")
      setShowConvertDialog(false)
      handleClose()
    } catch (error) {
      console.error("Error converting to booking:", error)
      toast.error("Error al crear la reserva")
    } finally {
      setIsConverting(false)
    }
  }

  if (showPreview && selectedTemplate) {
    return (
      <Dialog open={open} onOpenChange={handleClose}>
        <DialogContent open={open} onClose={handleClose} className="max-w-4xl max-h-[95vh] overflow-y-auto">
          <DialogHeader className="no-print">
            <DialogTitle>Vista Previa de Cotización</DialogTitle>
            <DialogDescription>
              Revisa la cotización antes de imprimir o enviar
            </DialogDescription>
          </DialogHeader>

          {/* Estilos de impresión */}
          <style jsx global>{`
            @media print {
              .no-print {
                display: none !important;
              }

              @page {
                margin: 2cm;
                size: letter portrait;
              }

              body {
                print-color-adjust: exact;
                -webkit-print-color-adjust: exact;
              }

              .quote-container {
                max-width: 100% !important;
                padding: 0 !important;
              }

              h1, h2, h3 {
                page-break-after: avoid;
              }

              ul, ol {
                page-break-inside: avoid;
              }
            }
          `}</style>

          {/* Botones de acción */}
          <div className="space-y-2 mb-4 no-print">
            {/* Botón principal: Convertir a Reserva */}
            {!isEditMode && (
              <Button
                onClick={handleOpenConvertDialog}
                className="w-full bg-orange-600 hover:bg-orange-700 text-lg py-6"
              >
                <CalendarCheck className="w-5 h-5 mr-2" />
                Guardar y Convertir a Reserva
              </Button>
            )}

            <div className="flex gap-2">
              {isEditMode ? (
                <Button
                  onClick={() => setIsEditMode(false)}
                  className="flex-1 bg-blue-600 hover:bg-blue-700"
                >
                  <Check className="w-4 h-4 mr-2" />
                  Finalizar Edición
                </Button>
              ) : (
                <>
                  <Button
                    onClick={() => setIsEditMode(true)}
                    variant="outline"
                    className="flex-1"
                  >
                    <Edit2 className="w-4 h-4 mr-2" />
                    Editar
                  </Button>
                  <Button onClick={() => setShowPreview(false)} variant="outline" className="flex-1">
                    Cambiar Plantilla
                  </Button>
                  <Button onClick={handleExportPDF} className="flex-1 bg-green-600 hover:bg-green-700">
                    <FileDown className="w-4 h-4 mr-2" />
                    PDF
                  </Button>
                  <Button onClick={handlePrint} className="flex-1">
                    <Printer className="w-4 h-4 mr-2" />
                    Imprimir
                  </Button>
                </>
              )}
              <Button onClick={handleClose} variant="outline" className="flex-1">
                Cerrar
              </Button>
            </div>
          </div>

          {/* Vista previa de la cotización */}
          <div ref={printRef} className="quote-container bg-white p-8 rounded-lg">
            {/* Header */}
            <div className="text-center mb-8">
              <div className="flex justify-center mb-4">
                <img
                  src="/Logo.rukalefun.jpg"
                  alt="Ruka Lefún Logo"
                  className="h-16 object-contain"
                />
              </div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                Ruka Lefún
              </h1>
              <h2 className="text-xl text-gray-700 mb-1">
                Cotización {isEditMode ? (
                  <Input
                    value={clientData.name}
                    onChange={(e) => setClientData({ ...clientData, name: e.target.value })}
                    className="inline-block w-auto mx-2 text-xl border-2 border-green-200 focus:border-green-600 focus:ring-green-600 bg-green-50/30"
                  />
                ) : clientData.name}
              </h2>
              <p className="text-gray-600">
                {isEditMode ? (
                  <Input
                    type="date"
                    value={clientData.date}
                    onChange={(e) => setClientData({ ...clientData, date: e.target.value })}
                    className="inline-block w-auto mx-2 border-2 border-green-200 focus:border-green-600 focus:ring-green-600 bg-green-50/30"
                  />
                ) : clientData.date}
              </p>
            </div>

            {/* Número de personas */}
            <div className="text-center mb-8">
              <p className="text-2xl font-semibold text-gray-900">
                {isEditMode ? (
                  <Input
                    type="number"
                    value={clientData.numberOfGuests}
                    onChange={(e) => setClientData({ ...clientData, numberOfGuests: parseInt(e.target.value) || 0 })}
                    className="inline-block w-32 mx-2 text-center text-2xl font-semibold border-2 border-green-200 focus:border-green-600 focus:ring-green-600 bg-green-50/30"
                  />
                ) : clientData.numberOfGuests} personas
              </p>
            </div>

            {/* Servicios Incluidos */}
            {editableQuoteData && editableQuoteData.includedServices.length > 0 && (
              <div className="mb-8">
                <h3 className="text-lg font-bold text-gray-900 mb-4">
                  Servicios Incluidos
                </h3>
                {isEditMode ? (
                  <Textarea
                    value={editableQuoteData.includedServices.join('\n')}
                    onChange={(e) => setEditableQuoteData({
                      ...editableQuoteData,
                      includedServices: e.target.value.split('\n').filter(s => s.trim())
                    })}
                    rows={editableQuoteData.includedServices.length + 2}
                    className="w-full border-2 border-green-200 focus:border-green-600 focus:ring-green-600 bg-green-50/30"
                    placeholder="Un servicio por línea"
                  />
                ) : (
                  <ul className="space-y-2">
                    {editableQuoteData.includedServices.map((service: string, i: number) => (
                      <li key={i} className="flex items-start">
                        <span className="mr-2">•</span>
                        <span className="text-gray-700">{service}</span>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            )}

            {/* Servicios Adicionales */}
            {editableQuoteData && editableQuoteData.additionalServices.length > 0 && (
              <div className="mb-8">
                <h3 className="text-lg font-bold text-gray-900 mb-4">
                  Servicios Adicionales <span className="font-normal">Incluidos</span>
                </h3>
                {isEditMode ? (
                  <Textarea
                    value={editableQuoteData.additionalServices.join('\n')}
                    onChange={(e) => setEditableQuoteData({
                      ...editableQuoteData,
                      additionalServices: e.target.value.split('\n').filter(s => s.trim())
                    })}
                    rows={editableQuoteData.additionalServices.length + 2}
                    className="w-full border-2 border-green-200 focus:border-green-600 focus:ring-green-600 bg-green-50/30"
                    placeholder="Un servicio por línea"
                  />
                ) : (
                  <ul className="space-y-2">
                    {editableQuoteData.additionalServices.map((service: string, i: number) => (
                      <li key={i} className="flex items-start">
                        <span className="mr-2">•</span>
                        <span className="text-gray-700 font-semibold">{service}</span>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            )}

            {/* Menú Sugerido - Editable Inline */}
            {editableQuoteData && (
              <div className="mb-8">
                <h3 className="text-lg font-bold text-gray-900 mb-4">
                  Menú Sugerido
                </h3>
                {editableQuoteData.menuSections.map((section: any, sectionIdx: number) => (
                  <div key={sectionIdx} className={`mb-6 ${isEditMode ? 'border rounded-lg p-4 bg-gray-50' : ''}`}>
                    {/* Nombre de sección */}
                    {isEditMode ? (
                      <div className="flex items-center gap-2 mb-3">
                        <Input
                          value={section.name}
                          onChange={(e) => {
                            const updated = [...editableQuoteData.menuSections]
                            updated[sectionIdx].name = e.target.value
                            setEditableQuoteData({ ...editableQuoteData, menuSections: updated })
                          }}
                          className="font-semibold text-yellow-600 flex-1 border-2 border-green-200 focus:border-green-600 focus:ring-green-600 bg-green-50/30"
                        />
                        <Button
                          size="sm"
                          variant="ghost"
                          className="text-red-500 hover:text-red-700"
                          onClick={() => {
                            const updated = editableQuoteData.menuSections.filter((_: any, i: number) => i !== sectionIdx)
                            setEditableQuoteData({ ...editableQuoteData, menuSections: updated })
                          }}
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    ) : (
                      <h4 className="text-base font-semibold text-yellow-600 mb-3">
                        {section.name}
                      </h4>
                    )}

                    {/* Items de la sección */}
                    {section.items.map((item: any, itemIdx: number) => (
                      <div key={itemIdx} className={`mb-4 ${isEditMode ? 'border-l-2 border-gray-300 pl-4' : ''}`}>
                        {/* Categoría */}
                        {isEditMode ? (
                          <div className="flex items-center gap-2 mb-2">
                            <Input
                              value={item.category}
                              onChange={(e) => {
                                const updated = [...editableQuoteData.menuSections]
                                updated[sectionIdx].items[itemIdx].category = e.target.value
                                setEditableQuoteData({ ...editableQuoteData, menuSections: updated })
                              }}
                              className="font-semibold text-gray-900 text-center border-2 border-green-200 focus:border-green-600 focus:ring-green-600 bg-green-50/30"
                              placeholder="Nombre de categoría"
                            />
                            <Button
                              size="sm"
                              variant="ghost"
                              className="text-red-500 hover:text-red-700"
                              onClick={() => {
                                const updated = [...editableQuoteData.menuSections]
                                updated[sectionIdx].items = updated[sectionIdx].items.filter((_: any, i: number) => i !== itemIdx)
                                setEditableQuoteData({ ...editableQuoteData, menuSections: updated })
                              }}
                            >
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </div>
                        ) : (
                          <p className="font-semibold text-gray-900 mb-2 text-center">
                            {item.category}
                          </p>
                        )}

                        {/* Platos */}
                        {isEditMode ? (
                          <Textarea
                            value={item.dishes.join('\n')}
                            onChange={(e) => {
                              const updated = [...editableQuoteData.menuSections]
                              updated[sectionIdx].items[itemIdx].dishes = e.target.value.split('\n').filter((d: string) => d.trim())
                              setEditableQuoteData({ ...editableQuoteData, menuSections: updated })
                            }}
                            rows={Math.max(item.dishes.length, 2)}
                            className="text-center text-sm border-2 border-green-200 focus:border-green-600 focus:ring-green-600 bg-green-50/30"
                            placeholder="Un plato por línea"
                          />
                        ) : (
                          <div className="text-center text-sm text-gray-700">
                            {item.dishes.map((dish: string, dishIdx: number) => (
                              <p key={dishIdx} className="mb-1">{dish}</p>
                            ))}
                          </div>
                        )}
                      </div>
                    ))}

                    {/* Botón agregar categoría */}
                    {isEditMode && (
                      <Button
                        size="sm"
                        variant="outline"
                        className="mt-2"
                        onClick={() => {
                          const updated = [...editableQuoteData.menuSections]
                          updated[sectionIdx].items.push({
                            category: "Nueva Categoría",
                            dishes: ["Nuevo plato"]
                          })
                          setEditableQuoteData({ ...editableQuoteData, menuSections: updated })
                        }}
                      >
                        <Plus className="w-4 h-4 mr-1" />
                        Agregar Categoría
                      </Button>
                    )}
                  </div>
                ))}

                {/* Botón agregar sección de menú */}
                {isEditMode && (
                  <Button
                    variant="outline"
                    className="w-full"
                    onClick={() => {
                      const updated = [...editableQuoteData.menuSections, {
                        name: "Nueva Sección",
                        items: [{ category: "Categoría", dishes: ["Plato 1"] }]
                      }]
                      setEditableQuoteData({ ...editableQuoteData, menuSections: updated })
                    }}
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    Agregar Sección de Menú
                  </Button>
                )}
              </div>
            )}

            {/* Precio */}
            {editableQuoteData && (
              <div className="mb-8 pt-6 border-t-2 border-gray-200">
                <p className="text-center text-xl">
                  <span className="text-red-600 font-bold">
                    Valor neto por persona $
                    {isEditMode ? (
                      <Input
                        type="number"
                        value={editableQuoteData.pricePerPerson}
                        onChange={(e) => setEditableQuoteData({
                          ...editableQuoteData,
                          pricePerPerson: parseFloat(e.target.value) || 0
                        })}
                        className="inline-block w-32 mx-2 text-center text-red-600 font-bold border-2 border-green-200 focus:border-green-600 focus:ring-green-600 bg-green-50/30"
                      />
                    ) : editableQuoteData.pricePerPerson.toLocaleString()}
                  </span>
                  {editableQuoteData.minimumGuests > 0 && (
                    <span className="text-gray-600 text-sm ml-2">
                      (desde {isEditMode ? (
                        <Input
                          type="number"
                          value={editableQuoteData.minimumGuests}
                          onChange={(e) => setEditableQuoteData({
                            ...editableQuoteData,
                            minimumGuests: parseInt(e.target.value) || 0
                          })}
                          className="inline-block w-20 mx-1 text-center text-sm border-2 border-green-200 focus:border-green-600 focus:ring-green-600 bg-green-50/30"
                        />
                      ) : editableQuoteData.minimumGuests} pers.)
                    </span>
                  )}
                </p>
              </div>
            )}

            {/* Términos y Condiciones */}
            {editableQuoteData && editableQuoteData.terms && (
              <div className="mb-8 text-sm text-gray-700">
                {isEditMode ? (
                  <Textarea
                    value={editableQuoteData.terms}
                    onChange={(e) => setEditableQuoteData({
                      ...editableQuoteData,
                      terms: e.target.value
                    })}
                    rows={6}
                    className="w-full border-2 border-green-200 focus:border-green-600 focus:ring-green-600 bg-green-50/30"
                  />
                ) : (
                  <div className="whitespace-pre-line">{editableQuoteData.terms}</div>
                )}
              </div>
            )}

            {/* Firma */}
            {editableQuoteData && (
              <div className="mb-4 text-sm text-gray-700">
                <p className="mb-2">
                  Gracias por solicitarnos esta cotización, esperamos sea de su agrado.
                </p>
                <p className="font-semibold">{editableQuoteData.signatureName}</p>
                <p className="font-semibold">{editableQuoteData.signatureTitle}</p>
                <p>{editableQuoteData.signatureLocation}</p>
              </div>
            )}
          </div>

          {/* Diálogo de Conversión a Reserva */}
          <Dialog open={showConvertDialog} onOpenChange={setShowConvertDialog}>
            <DialogContent className="max-w-md">
              <DialogHeader>
                <DialogTitle>Convertir a Reserva</DialogTitle>
                <DialogDescription>
                  Completa los datos adicionales para crear la reserva
                </DialogDescription>
              </DialogHeader>

              <div className="space-y-4">
                {/* Resumen */}
                <div className="bg-gray-50 p-4 rounded-lg">
                  <p className="font-semibold">{clientData.name}</p>
                  <p className="text-sm text-gray-600">{clientData.date} • {clientData.numberOfGuests} personas</p>
                </div>

                {/* Horarios */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label>Hora Inicio</Label>
                    <div className="flex items-center">
                      <Clock className="w-4 h-4 mr-2 text-gray-400" />
                      <Input
                        type="time"
                        value={convertFormData.startTime}
                        onChange={(e) => setConvertFormData({ ...convertFormData, startTime: e.target.value })}
                      />
                    </div>
                  </div>
                  <div>
                    <Label>Hora Fin</Label>
                    <div className="flex items-center">
                      <Clock className="w-4 h-4 mr-2 text-gray-400" />
                      <Input
                        type="time"
                        value={convertFormData.endTime}
                        onChange={(e) => setConvertFormData({ ...convertFormData, endTime: e.target.value })}
                      />
                    </div>
                  </div>
                </div>

                {/* Espacio */}
                <div>
                  <Label>Espacio (opcional)</Label>
                  <Select
                    value={convertFormData.spaceId}
                    onValueChange={(value) => setConvertFormData({ ...convertFormData, spaceId: value })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Seleccionar espacio" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="none">Sin espacio asignado</SelectItem>
                      {spaces?.map((space) => (
                        <SelectItem key={space._id} value={space._id}>
                          {space.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Notas especiales */}
                <div>
                  <Label>Notas especiales (opcional)</Label>
                  <Textarea
                    value={convertFormData.specialRequests}
                    onChange={(e) => setConvertFormData({ ...convertFormData, specialRequests: e.target.value })}
                    placeholder="Requerimientos especiales, notas..."
                    rows={3}
                  />
                </div>

                {/* Botones */}
                <div className="flex gap-2 pt-4">
                  <Button
                    onClick={handleConvertToBooking}
                    className="flex-1 bg-orange-600 hover:bg-orange-700"
                    disabled={isConverting}
                  >
                    {isConverting ? "Creando..." : "Crear Reserva"}
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => setShowConvertDialog(false)}
                    className="flex-1"
                  >
                    Cancelar
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </DialogContent>
      </Dialog>
    )
  }

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent open={open} onClose={handleClose} className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Generar Cotización desde Plantilla</DialogTitle>
          <DialogDescription>
            Selecciona una plantilla y completa los datos del cliente
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Selección de plantilla - Simplificada */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <Label>Plantilla</Label>
              {defaultTemplate && selectedTemplate?._id === defaultTemplate._id && (
                <Badge variant="secondary" className="text-xs">
                  <Star className="w-3 h-3 mr-1" />
                  Default
                </Badge>
              )}
            </div>

            {/* Plantilla seleccionada (vista compacta) */}
            {selectedTemplate && !showTemplateList && (
              <Card className="ring-2 ring-blue-600 bg-blue-50 mb-3">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="font-semibold text-gray-900">{selectedTemplate.name}</div>
                      <div className="text-sm text-gray-600">
                        ${selectedTemplate.pricePerPerson.toLocaleString()} por persona
                      </div>
                    </div>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => setShowTemplateList(true)}
                    >
                      Cambiar
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Lista completa de plantillas (colapsable) */}
            {(showTemplateList || !selectedTemplate) && (
              <div className="grid grid-cols-1 gap-3">
                {templates?.map((template) => (
                  <Card
                    key={template._id}
                    className={`cursor-pointer transition-all ${
                      selectedTemplateId === template._id
                        ? "ring-2 ring-blue-600 bg-blue-50"
                        : "hover:bg-gray-50"
                    }`}
                    onClick={() => {
                      setSelectedTemplateId(template._id)
                      setShowTemplateList(false)
                    }}
                  >
                    <CardContent className="p-4">
                      <div className="flex items-start gap-3">
                        <input
                          type="radio"
                          checked={selectedTemplateId === template._id}
                          onChange={() => {
                            setSelectedTemplateId(template._id)
                            setShowTemplateList(false)
                          }}
                          className="mt-1"
                        />
                        <div className="flex-1">
                          <div className="flex items-center gap-2">
                            <span className="font-semibold text-gray-900">{template.name}</span>
                            {template.isDefault && (
                              <Badge variant="secondary" className="text-xs">
                                <Star className="w-3 h-3 mr-1" />
                                Default
                              </Badge>
                            )}
                          </div>
                          <div className="text-sm text-gray-600 mt-1">
                            {template.eventType} • ${template.pricePerPerson.toLocaleString()} por persona
                          </div>
                          <div className="text-xs text-gray-500 mt-1">
                            {template.includedServices.length} servicios • {template.menuSections.length} secciones de menú
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
                {showTemplateList && selectedTemplate && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setShowTemplateList(false)}
                    className="text-gray-500"
                  >
                    Cancelar
                  </Button>
                )}
              </div>
            )}

            {templates?.length === 0 && (
              <p className="text-sm text-gray-500 text-center py-4">
                No hay plantillas activas. Crea una plantilla primero.
              </p>
            )}
          </div>

          {/* Datos del cliente */}
          <div className="space-y-4">
            {/* Campo de nombre destacado */}
            <div className="bg-blue-50 border-2 border-blue-200 rounded-lg p-4">
              <Label className="text-base font-semibold text-blue-800 mb-2 block">
                Nombre del Cliente / Evento *
              </Label>
              <Input
                value={clientData.name}
                onChange={(e) => setClientData({ ...clientData, name: e.target.value })}
                placeholder="Ej: Matrimonio Gonzalez-Perez, Cumpleaños Maria, Empresa ABC..."
                className="text-lg h-12 bg-white border-blue-300 focus:border-blue-500 focus:ring-blue-500"
                autoFocus
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Email</Label>
                <Input
                  type="email"
                  value={clientData.email}
                  onChange={(e) => setClientData({ ...clientData, email: e.target.value })}
                  placeholder="correo@ejemplo.com"
                />
              </div>
              <div>
                <Label>Telefono</Label>
                <Input
                  value={clientData.phone}
                  onChange={(e) => setClientData({ ...clientData, phone: e.target.value })}
                  placeholder="+56 9 1234 5678"
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Fecha del Evento *</Label>
                <Input
                  type="date"
                  value={clientData.date}
                  onChange={(e) => setClientData({ ...clientData, date: e.target.value })}
                />
              </div>
              <div>
                <Label>Numero de Invitados *</Label>
                <Input
                  type="number"
                  value={clientData.numberOfGuests}
                  onChange={(e) => setClientData({ ...clientData, numberOfGuests: parseInt(e.target.value) || 0 })}
                />
              </div>
            </div>
          </div>

          {/* Botones */}
          <div className="flex gap-2 pt-4">
            <Button
              onClick={handleGenerate}
              className="flex-1 bg-blue-600 hover:bg-blue-700"
              disabled={!selectedTemplateId}
            >
              Generar Cotización
            </Button>
            <Button
              onClick={handleClose}
              variant="outline"
              className="flex-1"
            >
              Cancelar
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
