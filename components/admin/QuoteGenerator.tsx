"use client"

import { useState, useRef } from "react"
import { useQuery, useMutation } from "convex/react"
import { api } from "@/convex/_generated/api"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"
import { Printer, FileDown, Edit2, Check } from "lucide-react"
import { Textarea } from "@/components/ui/textarea"
import { toast } from "sonner"
import { exportQuoteToPDF } from "@/lib/pdfExport"

interface QuoteGeneratorProps {
  open: boolean
  onClose: () => void
  quoteRequest?: any
}

export default function QuoteGenerator({ open, onClose, quoteRequest }: QuoteGeneratorProps) {
  const templates = useQuery(api.quoteTemplates.getActiveTemplates)
  const createGeneratedQuote = useMutation(api.generatedQuotes.createGeneratedQuote)
  const [selectedTemplateId, setSelectedTemplateId] = useState<string>("")
  const [clientData, setClientData] = useState({
    name: quoteRequest?.name || "",
    date: quoteRequest?.eventDate || "",
    numberOfGuests: quoteRequest?.numberOfGuests || 100,
  })
  const [showPreview, setShowPreview] = useState(false)
  const [isEditMode, setIsEditMode] = useState(false)
  const [editableQuoteData, setEditableQuoteData] = useState<any>(null)
  const printRef = useRef<HTMLDivElement>(null)

  const selectedTemplate = templates?.find(t => t._id === selectedTemplateId)

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
      // Calculate total amount
      const totalAmount = selectedTemplate.pricePerPerson * clientData.numberOfGuests

      // Save generated quote to database
      await createGeneratedQuote({
        quoteRequestId: quoteRequest?._id,
        templateId: selectedTemplate._id,
        clientName: clientData.name,
        clientEmail: quoteRequest?.email,
        clientPhone: quoteRequest?.phone,
        eventDate: clientData.date,
        eventType: selectedTemplate.eventType,
        numberOfGuests: clientData.numberOfGuests,
        templateName: selectedTemplate.name,
        includedServices: selectedTemplate.includedServices,
        additionalServices: selectedTemplate.additionalServices,
        menuSections: selectedTemplate.menuSections,
        pricePerPerson: selectedTemplate.pricePerPerson,
        minimumGuests: selectedTemplate.minimumGuests,
        totalAmount: totalAmount,
        currency: selectedTemplate.currency,
      })

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
    setClientData({
      name: quoteRequest?.name || "",
      date: quoteRequest?.eventDate || "",
      numberOfGuests: quoteRequest?.numberOfGuests || 100,
    })
    onClose()
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
          <div className="flex gap-2 mb-4 no-print">
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
                  Editar Contenido
                </Button>
                <Button onClick={() => setShowPreview(false)} variant="outline" className="flex-1">
                  Cambiar Plantilla
                </Button>
                <Button onClick={handleExportPDF} className="flex-1 bg-green-600 hover:bg-green-700">
                  <FileDown className="w-4 h-4 mr-2" />
                  Exportar PDF
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
                    className="inline-block w-auto mx-2 text-xl"
                  />
                ) : clientData.name}
              </h2>
              <p className="text-gray-600">
                {isEditMode ? (
                  <Input
                    type="date"
                    value={clientData.date}
                    onChange={(e) => setClientData({ ...clientData, date: e.target.value })}
                    className="inline-block w-auto mx-2"
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
                    className="inline-block w-32 mx-2 text-center text-2xl font-semibold"
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
                    className="w-full"
                    placeholder="Un servicio por línea"
                  />
                ) : (
                  <ul className="space-y-2">
                    {editableQuoteData.includedServices.map((service, i) => (
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
                    className="w-full"
                    placeholder="Un servicio por línea"
                  />
                ) : (
                  <ul className="space-y-2">
                    {editableQuoteData.additionalServices.map((service, i) => (
                      <li key={i} className="flex items-start">
                        <span className="mr-2">•</span>
                        <span className="text-gray-700 font-semibold">{service}</span>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            )}

            {/* Menú Sugerido */}
            {editableQuoteData && editableQuoteData.menuSections.length > 0 && (
              <div className="mb-8">
                <h3 className="text-lg font-bold text-gray-900 mb-4">
                  Menú Sugerido
                </h3>
                {editableQuoteData.menuSections.map((section, sectionIdx) => (
                  <div key={sectionIdx} className="mb-6">
                    <h4 className="text-base font-semibold text-yellow-600 mb-3">
                      {section.name}
                    </h4>
                    {section.items.map((item, itemIdx) => (
                      <div key={itemIdx} className="mb-4">
                        <p className="font-semibold text-gray-900 mb-2 text-center">
                          {item.category}
                        </p>
                        <div className="text-center text-sm text-gray-700">
                          {item.dishes.map((dish, dishIdx) => (
                            <p key={dishIdx} className="mb-1">{dish}</p>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                ))}
                {isEditMode && (
                  <p className="text-xs text-gray-500 italic">
                    Nota: Para editar el menú completo, vuelve a cambiar la plantilla
                  </p>
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
                        className="inline-block w-32 mx-2 text-center text-red-600 font-bold"
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
                          className="inline-block w-20 mx-1 text-center text-sm"
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
                    className="w-full"
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
          {/* Selección de plantilla */}
          <div>
            <Label className="mb-2 block">Seleccionar Plantilla *</Label>
            <div className="grid grid-cols-1 gap-3">
              {templates?.map((template) => (
                <Card
                  key={template._id}
                  className={`cursor-pointer transition-all ${
                    selectedTemplateId === template._id
                      ? "ring-2 ring-blue-600 bg-blue-50"
                      : "hover:bg-gray-50"
                  }`}
                  onClick={() => setSelectedTemplateId(template._id)}
                >
                  <CardContent className="p-4">
                    <div className="flex items-start gap-3">
                      <input
                        type="radio"
                        checked={selectedTemplateId === template._id}
                        onChange={() => setSelectedTemplateId(template._id)}
                        className="mt-1"
                      />
                      <div className="flex-1">
                        <div className="font-semibold text-gray-900">{template.name}</div>
                        <div className="text-sm text-gray-600 mt-1">
                          {template.eventType} • ${template.pricePerPerson.toLocaleString()} por persona
                        </div>
                        <div className="text-xs text-gray-500 mt-1">
                          {template.includedServices.length} servicios incluidos • {template.menuSections.length} secciones de menú
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {templates?.length === 0 && (
              <p className="text-sm text-gray-500 text-center py-4">
                No hay plantillas activas. Crea una plantilla primero.
              </p>
            )}
          </div>

          {/* Datos del cliente */}
          <div className="space-y-4">
            <h3 className="font-semibold">Datos del Cliente</h3>
            <div>
              <Label>Nombre del Cliente *</Label>
              <Input
                value={clientData.name}
                onChange={(e) => setClientData({ ...clientData, name: e.target.value })}
                placeholder="Nombre del evento o cliente"
              />
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
                <Label>Número de Invitados *</Label>
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
