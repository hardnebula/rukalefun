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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"
import {
  Users,
  Calendar,
  Mail,
  Phone,
  MessageSquare,
  Trash2,
  FileText,
  Sparkles,
  PhoneCall,
  FileCheck,
  CheckCircle2,
  XCircle,
  History,
  TrendingUp,
  DollarSign,
  Clock,
  Eye,
  MessageCircle,
} from "lucide-react"
import { toast } from "sonner"
import { Toaster } from "@/components/ui/sonner"
import QuoteGenerator from "@/components/admin/QuoteGenerator"

export default function CotizacionesPage() {
  // Queries y mutations para cotizaciones
  const quotes = useQuery(api.quotes.getAllQuotes)
  const updateQuoteStatus = useMutation(api.quotes.updateQuoteStatus)
  const deleteQuote = useMutation(api.quotes.deleteQuote)
  // Queries y mutations para historial de cotizaciones generadas
  const conversionStats = useQuery(api.generatedQuotes.getConversionStats)
  const generatedQuotes = useQuery(api.generatedQuotes.getAllGeneratedQuotes)
  const updateGeneratedQuoteStatus = useMutation(api.generatedQuotes.updateQuoteStatus)
  const deleteGeneratedQuote = useMutation(api.generatedQuotes.deleteGeneratedQuote)
  const convertToBooking = useMutation(api.bookings.convertQuoteToBooking)

  // Estados para cotizaciones
  const [selectedQuote, setSelectedQuote] = useState<any>(null)
  const [dialogOpen, setDialogOpen] = useState(false)
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [quoteToDelete, setQuoteToDelete] = useState<any>(null)
  const [filterStatus, setFilterStatus] = useState("all")
  const [searchTerm, setSearchTerm] = useState("")
  const [generatorOpen, setGeneratorOpen] = useState(false)
  const [quoteForGenerator, setQuoteForGenerator] = useState<any>(null)
  const [quickMode, setQuickMode] = useState(false)

  // Estados para historial de cotizaciones
  const [historySearchTerm, setHistorySearchTerm] = useState("")
  const [historyFilterStatus, setHistoryFilterStatus] = useState("all")
  const [selectedGeneratedQuote, setSelectedGeneratedQuote] = useState<any>(null)
  const [historyDialogOpen, setHistoryDialogOpen] = useState(false)
  const [deleteHistoryDialogOpen, setDeleteHistoryDialogOpen] = useState(false)
  const [quoteToDeleteFromHistory, setQuoteToDeleteFromHistory] = useState<any>(null)
  const [convertDialogOpen, setConvertDialogOpen] = useState(false)
  const [convertFormData, setConvertFormData] = useState({
    startTime: "12:00",
    endTime: "20:00",
    specialRequests: ""
  })

  // Funciones para cotizaciones
  const filteredQuotes = quotes?.filter((quote) => {
    const matchesStatus = filterStatus === "all" || quote.status === filterStatus
    const matchesSearch =
      searchTerm === "" ||
      quote.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      quote.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      quote.eventType.toLowerCase().includes(searchTerm.toLowerCase())
    return matchesStatus && matchesSearch
  })

  const handleStatusChange = async (quoteId: string, newStatus: string) => {
    try {
      await updateQuoteStatus({ id: quoteId as any, status: newStatus })
      toast.success("Estado actualizado correctamente")
    } catch (error) {
      toast.error("Error al actualizar el estado")
    }
  }

  const handleDeleteQuote = async () => {
    if (!quoteToDelete) return

    try {
      await deleteQuote({ id: quoteToDelete._id as any })
      toast.success("Cotización eliminada correctamente")
      setDeleteDialogOpen(false)
      setDialogOpen(false)
      setQuoteToDelete(null)
      setSelectedQuote(null)
    } catch (error) {
      toast.error("Error al eliminar la cotización")
    }
  }

  const getStatusBadge = (status: string) => {
    const statusConfig: Record<string, {
      label: string
      iconName: string
      bgColor: string
      textColor: string
      borderColor: string
    }> = {
      new: {
        label: "Nueva",
        iconName: "sparkles",
        bgColor: "bg-blue-50",
        textColor: "text-blue-700",
        borderColor: "border-blue-200"
      },
      contacted: {
        label: "Contactado",
        iconName: "phoneCall",
        bgColor: "bg-purple-50",
        textColor: "text-purple-700",
        borderColor: "border-purple-200"
      },
      quoted: {
        label: "Cotizado",
        iconName: "fileCheck",
        bgColor: "bg-orange-50",
        textColor: "text-orange-700",
        borderColor: "border-orange-200"
      },
      converted: {
        label: "Convertida",
        iconName: "checkCircle",
        bgColor: "bg-green-50",
        textColor: "text-green-700",
        borderColor: "border-green-200"
      },
      declined: {
        label: "Rechazada",
        iconName: "xCircle",
        bgColor: "bg-red-50",
        textColor: "text-red-700",
        borderColor: "border-red-200"
      },
    }

    const config = statusConfig[status] || {
      label: status,
      iconName: "",
      bgColor: "bg-gray-50",
      textColor: "text-gray-700",
      borderColor: "border-gray-200"
    }

    const getIcon = (iconName: string) => {
      switch(iconName) {
        case "sparkles": return <Sparkles className="w-3.5 h-3.5" />
        case "phoneCall": return <PhoneCall className="w-3.5 h-3.5" />
        case "fileCheck": return <FileCheck className="w-3.5 h-3.5" />
        case "checkCircle": return <CheckCircle2 className="w-3.5 h-3.5" />
        case "xCircle": return <XCircle className="w-3.5 h-3.5" />
        default: return null
      }
    }

    return (
      <div
        className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full border ${config.bgColor} ${config.textColor} ${config.borderColor} font-medium text-xs`}
      >
        {getIcon(config.iconName)}
        {config.label}
      </div>
    )
  }

  // Funciones para historial de cotizaciones
  const filteredGeneratedQuotes = generatedQuotes?.filter((quote) => {
    const matchesStatus = historyFilterStatus === "all" || quote.status === historyFilterStatus
    const matchesSearch =
      historySearchTerm === "" ||
      quote.clientName.toLowerCase().includes(historySearchTerm.toLowerCase()) ||
      quote.clientEmail?.toLowerCase().includes(historySearchTerm.toLowerCase()) ||
      quote.eventType.toLowerCase().includes(historySearchTerm.toLowerCase())
    return matchesStatus && matchesSearch
  })

  const handleGeneratedQuoteStatusChange = async (quoteId: string, newStatus: string) => {
    try {
      await updateGeneratedQuoteStatus({ quoteId: quoteId as any, status: newStatus })

      // Actualizar el estado local de la cotización seleccionada
      if (selectedGeneratedQuote && selectedGeneratedQuote._id === quoteId) {
        setSelectedGeneratedQuote({
          ...selectedGeneratedQuote,
          status: newStatus,
          updatedAt: Date.now()
        })
      }

      toast.success("Estado actualizado correctamente")
    } catch (error) {
      toast.error("Error al actualizar el estado")
    }
  }

  const handleDeleteGeneratedQuote = async () => {
    if (!quoteToDeleteFromHistory) return

    try {
      await deleteGeneratedQuote({ quoteId: quoteToDeleteFromHistory._id as any })
      toast.success("Cotización eliminada correctamente")
      setDeleteHistoryDialogOpen(false)
      setHistoryDialogOpen(false)
      setQuoteToDeleteFromHistory(null)
      setSelectedGeneratedQuote(null)
    } catch (error) {
      toast.error("Error al eliminar la cotización")
    }
  }

  const handleConvertToBooking = async () => {
    if (!selectedGeneratedQuote) return

    try {
      const bookingId = await convertToBooking({
        generatedQuoteId: selectedGeneratedQuote._id as any,
        startTime: convertFormData.startTime,
        endTime: convertFormData.endTime,
        specialRequests: convertFormData.specialRequests || undefined,
      })

      toast.success("¡Cotización convertida a reserva exitosamente!")
      setConvertDialogOpen(false)
      setHistoryDialogOpen(false)
      setSelectedGeneratedQuote(null)
      setConvertFormData({
        startTime: "12:00",
        endTime: "20:00",
        specialRequests: ""
      })
    } catch (error: any) {
      toast.error(error.message || "Error al convertir la cotización")
    }
  }

  // Función helper para encontrar la cotización generada vinculada a una solicitud
  const findLinkedGeneratedQuote = (quoteRequestId: string) => {
    return generatedQuotes?.find(gq =>
      gq.quoteRequestId === quoteRequestId && gq.status === "pending"
    )
  }

  const getGeneratedQuoteStatusBadge = (status: string) => {
    const statusConfig: Record<string, {
      label: string
      icon: any
      className: string
    }> = {
      pending: {
        label: "Pendiente",
        icon: Clock,
        className: "bg-yellow-50 text-yellow-700 border-yellow-200"
      },
      converted: {
        label: "Convertida",
        icon: CheckCircle2,
        className: "bg-green-50 text-green-700 border-green-200"
      },
      declined: {
        label: "Rechazada",
        icon: XCircle,
        className: "bg-red-50 text-red-700 border-red-200"
      },
      expired: {
        label: "Expirada",
        icon: Clock,
        className: "bg-gray-50 text-gray-700 border-gray-200"
      },
    }

    const config = statusConfig[status] || statusConfig.pending
    const Icon = config.icon

    return (
      <div className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full border ${config.className} font-medium text-xs`}>
        <Icon className="w-3.5 h-3.5" />
        {config.label}
      </div>
    )
  }

  return (
    <div className="p-8">
      <Toaster />

      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Cotizaciones
        </h1>
        <p className="text-gray-600">
          Gestiona solicitudes de cotización e historial
        </p>
      </div>

      <Tabs defaultValue="solicitudes" className="space-y-6">
        <TabsList>
          <TabsTrigger value="solicitudes">
            <FileText className="w-4 h-4 mr-2" />
            Solicitudes de Cotización
          </TabsTrigger>
          <TabsTrigger value="historial">
            <History className="w-4 h-4 mr-2" />
            Historial de Cotizaciones
          </TabsTrigger>
        </TabsList>

        {/* Tab: Solicitudes */}
        <TabsContent value="solicitudes" className="space-y-6">
          <div className="flex justify-end gap-2">
            <Button
              onClick={() => {
                setQuoteForGenerator(null)
                setQuickMode(true)
                setGeneratorOpen(true)
              }}
              className="bg-green-600 hover:bg-green-700"
            >
              <Sparkles className="w-5 h-5 mr-2" />
              Cotización Rápida
            </Button>
          </div>

          {/* Filtros */}
          <Card>
            <CardContent className="pt-6">
              <div className="flex flex-col md:flex-row gap-4">
                <div className="flex-1">
                  <Input
                    placeholder="Buscar por nombre, email o tipo de evento..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
                <div className="w-full md:w-48">
                  <Select value={filterStatus} onValueChange={setFilterStatus}>
                    <SelectTrigger>
                      <SelectValue placeholder="Todos los estados" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Todos los estados</SelectItem>
                      <SelectItem value="new">Nueva</SelectItem>
                      <SelectItem value="contacted">Contactado</SelectItem>
                      <SelectItem value="quoted">Cotizado</SelectItem>
                      <SelectItem value="converted">Convertida</SelectItem>
                      <SelectItem value="declined">Rechazada</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Lista de Cotizaciones */}
          <div className="grid grid-cols-1 gap-4">
            {!filteredQuotes ? (
              <Card>
                <CardContent className="p-8 text-center">
                  <p className="text-gray-500">Cargando cotizaciones...</p>
                </CardContent>
              </Card>
            ) : filteredQuotes.length > 0 ? (
              filteredQuotes.map((quote) => {
                const borderColorMap: Record<string, string> = {
                  new: "border-l-4 border-l-blue-500",
                  contacted: "border-l-4 border-l-purple-500",
                  quoted: "border-l-4 border-l-orange-500",
                  converted: "border-l-4 border-l-green-500",
                  declined: "border-l-4 border-l-red-500"
                }
                const borderClass = borderColorMap[quote.status] || "border-l-4 border-l-gray-300"

                return (
                  <Card
                    key={quote._id}
                    className={`hover:shadow-lg transition-all cursor-pointer ${borderClass} hover:scale-[1.01]`}
                    onClick={() => {
                      setSelectedQuote(quote)
                      setDialogOpen(true)
                    }}
                  >
                  <CardContent className="p-6">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-3 flex-wrap">
                          <h3 className="text-lg font-semibold text-gray-900">{quote.name}</h3>
                          {getStatusBadge(quote.status)}
                          {quote.status === "new" && (
                            <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-gradient-to-r from-blue-500 to-blue-600 text-white text-xs font-bold animate-pulse shadow-md">
                              <Sparkles className="w-3 h-3" />
                              ¡NUEVA!
                            </div>
                          )}
                          {quote.source === "whatsapp" && (
                            <Badge variant="outline" className="border-green-500 text-green-700 text-xs">
                              <MessageCircle className="w-3 h-3 mr-1" />
                              WhatsApp
                            </Badge>
                          )}
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
                          <div className="flex items-center text-gray-600">
                            <Users className="h-4 w-4 mr-2" />
                            <span>
                              {quote.eventType} - {quote.numberOfGuests} invitados
                            </span>
                          </div>
                          {quote.eventDate && (
                            <div className="flex items-center text-gray-600">
                              <Calendar className="h-4 w-4 mr-2" />
                              <span>
                                {new Date(quote.eventDate).toLocaleDateString("es-CL")}
                              </span>
                            </div>
                          )}
                          <div className="flex items-center text-gray-600">
                            <Mail className="h-4 w-4 mr-2" />
                            <span>{quote.email}</span>
                          </div>
                          <div className="flex items-center text-gray-600">
                            <Phone className="h-4 w-4 mr-2" />
                            <span>{quote.phone}</span>
                          </div>
                        </div>

                        <div className="mt-3 text-xs text-gray-500">
                          Recibida: {new Date(quote.createdAt).toLocaleDateString("es-CL")} a las{" "}
                          {new Date(quote.createdAt).toLocaleTimeString("es-CL")}
                        </div>
                      </div>

                      <div className="flex flex-col space-y-2">
                        {/* Botón de conversión rápida si hay cotización generada vinculada */}
                        {(quote.status === "quoted" || quote.status === "converted") && (() => {
                          const linkedQuote = findLinkedGeneratedQuote(quote._id)
                          return linkedQuote ? (
                            <Button
                              size="sm"
                              className="bg-green-600 hover:bg-green-700"
                              onClick={(e) => {
                                e.stopPropagation()
                                setSelectedGeneratedQuote(linkedQuote)
                                setConvertDialogOpen(true)
                              }}
                            >
                              <CheckCircle2 className="h-4 w-4 mr-2" />
                              Convertir a Reserva
                            </Button>
                          ) : null
                        })()}

                        <Button
                          size="sm"
                          className="bg-green-600 hover:bg-green-700 text-white"
                          onClick={(e) => {
                            e.stopPropagation()
                            setQuoteForGenerator(quote)
                            setQuickMode(true)
                            setGeneratorOpen(true)
                          }}
                        >
                          <Sparkles className="h-4 w-4 mr-2" />
                          Rápida
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          className="bg-blue-50 hover:bg-blue-100 text-blue-700"
                          onClick={(e) => {
                            e.stopPropagation()
                            setQuoteForGenerator(quote)
                            setQuickMode(false)
                            setGeneratorOpen(true)
                          }}
                        >
                          <FileText className="h-4 w-4 mr-2" />
                          Con Edición
                        </Button>
                        {quote.status === "new" && (
                          <Button
                            size="sm"
                            onClick={(e) => {
                              e.stopPropagation()
                              handleStatusChange(quote._id, "contacted")
                            }}
                          >
                            Marcar como Contactado
                          </Button>
                        )}
                        {quote.status === "declined" && (
                          <Button
                            size="sm"
                            variant="destructive"
                            onClick={(e) => {
                              e.stopPropagation()
                              setQuoteToDelete(quote)
                              setDeleteDialogOpen(true)
                            }}
                          >
                            <Trash2 className="h-4 w-4 mr-2" />
                            Eliminar
                          </Button>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
                )
              })
            ) : (
              <Card>
                <CardContent className="p-8 text-center">
                  <p className="text-gray-500">No se encontraron cotizaciones</p>
                </CardContent>
              </Card>
            )}
          </div>
        </TabsContent>

        {/* Tab: Historial */}
        <TabsContent value="historial" className="space-y-6">
          {/* Estadísticas de Conversión */}
          {conversionStats && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">
                    Total Cotizaciones
                  </CardTitle>
                  <FileText className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{conversionStats.total}</div>
                  <p className="text-xs text-muted-foreground">
                    Cotizaciones generadas
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">
                    Tasa de Conversión
                  </CardTitle>
                  <TrendingUp className="h-4 w-4 text-green-600" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-green-600">
                    {conversionStats.conversionRate}%
                  </div>
                  <p className="text-xs text-muted-foreground">
                    {conversionStats.converted} de {conversionStats.total} convertidas
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">
                    Ingresos Generados
                  </CardTitle>
                  <DollarSign className="h-4 w-4 text-green-600" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-green-600">
                    ${conversionStats.totalRevenue.toLocaleString()}
                  </div>
                  <p className="text-xs text-muted-foreground">
                    De cotizaciones convertidas
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">
                    Ingresos Potenciales
                  </CardTitle>
                  <Clock className="h-4 w-4 text-yellow-600" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-yellow-600">
                    ${conversionStats.potentialRevenue.toLocaleString()}
                  </div>
                  <p className="text-xs text-muted-foreground">
                    {conversionStats.pending} cotizaciones pendientes
                  </p>
                </CardContent>
              </Card>
            </div>
          )}

          {/* Filtros */}
          <Card>
            <CardContent className="pt-6">
              <div className="flex flex-col md:flex-row gap-4">
                <div className="flex-1">
                  <Input
                    placeholder="Buscar por cliente, email o tipo de evento..."
                    value={historySearchTerm}
                    onChange={(e) => setHistorySearchTerm(e.target.value)}
                  />
                </div>
                <div className="w-full md:w-48">
                  <Select value={historyFilterStatus} onValueChange={setHistoryFilterStatus}>
                    <SelectTrigger>
                      <SelectValue placeholder="Filtrar por estado" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Todos los estados</SelectItem>
                      <SelectItem value="pending">Pendiente</SelectItem>
                      <SelectItem value="converted">Convertida</SelectItem>
                      <SelectItem value="declined">Rechazada</SelectItem>
                      <SelectItem value="expired">Expirada</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Lista de Cotizaciones Generadas */}
          <div className="grid grid-cols-1 gap-4">
            {!filteredGeneratedQuotes ? (
              <Card>
                <CardContent className="p-8 text-center">
                  <p className="text-gray-500">Cargando historial...</p>
                </CardContent>
              </Card>
            ) : filteredGeneratedQuotes.length > 0 ? (
              filteredGeneratedQuotes.map((quote) => {
                const borderColorMap: Record<string, string> = {
                  pending: "border-l-4 border-l-yellow-500",
                  converted: "border-l-4 border-l-green-500",
                  declined: "border-l-4 border-l-red-500",
                  expired: "border-l-4 border-l-gray-500"
                }
                const borderClass = borderColorMap[quote.status] || "border-l-4 border-l-gray-300"

                return (
                  <Card
                    key={quote._id}
                    className={`hover:shadow-lg transition-all cursor-pointer ${borderClass} hover:scale-[1.01]`}
                    onClick={() => {
                      setSelectedGeneratedQuote(quote)
                      setHistoryDialogOpen(true)
                    }}
                  >
                    <CardContent className="p-6">
                      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-3 flex-wrap">
                            <h3 className="text-lg font-semibold text-gray-900">{quote.clientName}</h3>
                            {getGeneratedQuoteStatusBadge(quote.status)}
                            {/* Indicador de expiración */}
                            {quote.status === "pending" && quote.daysUntilExpiry !== null && (
                              <Badge
                                variant="outline"
                                className={`text-xs ${
                                  quote.daysUntilExpiry <= 3
                                    ? "border-red-500 text-red-600 bg-red-50"
                                    : quote.daysUntilExpiry <= 7
                                    ? "border-orange-500 text-orange-600 bg-orange-50"
                                    : "border-gray-400 text-gray-600"
                                }`}
                              >
                                <Clock className="w-3 h-3 mr-1" />
                                {quote.isExpired
                                  ? "Expirada"
                                  : quote.daysUntilExpiry === 1
                                  ? "1 día restante"
                                  : `${quote.daysUntilExpiry} días restantes`
                                }
                              </Badge>
                            )}
                          </div>

                          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 text-sm">
                            <div className="flex items-center text-gray-600">
                              <FileText className="h-4 w-4 mr-2" />
                              <span>{quote.templateName}</span>
                            </div>
                            <div className="flex items-center text-gray-600">
                              <Users className="h-4 w-4 mr-2" />
                              <span>{quote.numberOfGuests} invitados</span>
                            </div>
                            <div className="flex items-center text-gray-600">
                              <Calendar className="h-4 w-4 mr-2" />
                              <span>{new Date(quote.eventDate).toLocaleDateString("es-CL")}</span>
                            </div>
                            {quote.clientEmail && (
                              <div className="flex items-center text-gray-600">
                                <Mail className="h-4 w-4 mr-2" />
                                <span className="truncate">{quote.clientEmail}</span>
                              </div>
                            )}
                            <div className="flex items-center text-gray-600">
                              <DollarSign className="h-4 w-4 mr-2" />
                              <span className="font-semibold">${quote.totalAmount.toLocaleString()}</span>
                            </div>
                          </div>

                          <div className="mt-3 text-xs text-gray-500">
                            Generada: {new Date(quote.createdAt).toLocaleDateString("es-CL")} a las{" "}
                            {new Date(quote.createdAt).toLocaleTimeString("es-CL")}
                          </div>
                        </div>

                        <div className="flex flex-col space-y-2">
                          {quote.status === "pending" && (
                            <Button
                              size="sm"
                              className="bg-green-600 hover:bg-green-700"
                              onClick={(e) => {
                                e.stopPropagation()
                                setSelectedGeneratedQuote(quote)
                                setConvertDialogOpen(true)
                              }}
                            >
                              <CheckCircle2 className="h-4 w-4 mr-2" />
                              Convertir a Reserva
                            </Button>
                          )}
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={(e) => {
                              e.stopPropagation()
                              setSelectedGeneratedQuote(quote)
                              setHistoryDialogOpen(true)
                            }}
                          >
                            <Eye className="h-4 w-4 mr-2" />
                            Ver Detalles
                          </Button>
                          <Button
                            size="sm"
                            variant="destructive"
                            onClick={(e) => {
                              e.stopPropagation()
                              setQuoteToDeleteFromHistory(quote)
                              setDeleteHistoryDialogOpen(true)
                            }}
                          >
                            <Trash2 className="h-4 w-4 mr-2" />
                            Eliminar
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                )
              })
            ) : (
              <Card>
                <CardContent className="p-8 text-center">
                  <p className="text-gray-500">No se encontraron cotizaciones en el historial</p>
                </CardContent>
              </Card>
            )}
          </div>
        </TabsContent>

      </Tabs>

      {/* Dialog de Detalles de Cotización */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-w-2xl">
          {selectedQuote && (
            <>
              <DialogHeader>
                <DialogTitle>Detalles de la Cotización</DialogTitle>
                <DialogDescription>
                  Información completa de la solicitud
                </DialogDescription>
              </DialogHeader>

              <div className="space-y-6">
                {/* Estado */}
                <div>
                  <label className="block text-sm font-medium mb-2">
                    Estado
                  </label>
                  <Select
                    value={selectedQuote.status}
                    onValueChange={(value) => handleStatusChange(selectedQuote._id, value)}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="new">Nueva</SelectItem>
                      <SelectItem value="contacted">Contactado</SelectItem>
                      <SelectItem value="quoted">Cotizado</SelectItem>
                      <SelectItem value="converted">Convertida</SelectItem>
                      <SelectItem value="declined">Rechazada</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Información del Cliente */}
                <div>
                  <h4 className="font-semibold mb-3">Información de Contacto</h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex items-center space-x-2">
                      <span className="font-medium">Nombre:</span>
                      <span>{selectedQuote.name}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Mail className="h-4 w-4" />
                      <a
                        href={`mailto:${selectedQuote.email}`}
                        className="text-blue-600 hover:underline"
                      >
                        {selectedQuote.email}
                      </a>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Phone className="h-4 w-4" />
                      <a
                        href={`tel:${selectedQuote.phone}`}
                        className="text-blue-600 hover:underline"
                      >
                        {selectedQuote.phone}
                      </a>
                    </div>
                    <div className="flex items-center space-x-2">
                      <a
                        href={`https://wa.me/${selectedQuote.phone.replace(/\D/g, "")}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-green-600 hover:underline"
                      >
                        Contactar por WhatsApp
                      </a>
                    </div>
                  </div>
                </div>

                {/* Detalles del Evento */}
                <div>
                  <h4 className="font-semibold mb-3">Detalles del Evento</h4>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="text-gray-500">Tipo de Evento:</span>
                      <p className="font-medium">{selectedQuote.eventType}</p>
                    </div>
                    <div>
                      <span className="text-gray-500">Número de Invitados:</span>
                      <p className="font-medium">{selectedQuote.numberOfGuests} personas</p>
                    </div>
                    {selectedQuote.eventDate && (
                      <div>
                        <span className="text-gray-500">Fecha Tentativa:</span>
                        <p className="font-medium">
                          {new Date(selectedQuote.eventDate).toLocaleDateString("es-CL")}
                        </p>
                      </div>
                    )}
                  </div>
                </div>

                {/* Mensaje */}
                {selectedQuote.message && (
                  <div>
                    <h4 className="font-semibold mb-2 flex items-center">
                      <MessageSquare className="h-4 w-4 mr-2" />
                      Mensaje
                    </h4>
                    <p className="text-sm text-gray-700 bg-gray-50 p-4 rounded">
                      {selectedQuote.message}
                    </p>
                  </div>
                )}

                {/* Información de Recepción */}
                <div className="border-t pt-4">
                  <p className="text-xs text-gray-500">
                    Solicitud recibida el{" "}
                    {new Date(selectedQuote.createdAt).toLocaleDateString("es-CL")} a las{" "}
                    {new Date(selectedQuote.createdAt).toLocaleTimeString("es-CL")}
                  </p>
                </div>

                {/* Acciones Rápidas */}
                <div className="flex gap-2 justify-between">
                  <div className="flex gap-2 flex-wrap">
                    <Button
                      variant="outline"
                      onClick={() => window.open(`mailto:${selectedQuote.email}`, "_blank")}
                    >
                      <Mail className="h-4 w-4 mr-2" />
                      Enviar Email
                    </Button>
                    <Button
                      variant="outline"
                      onClick={() =>
                        window.open(
                          `https://wa.me/${selectedQuote.phone.replace(/\D/g, "")}`,
                          "_blank"
                        )
                      }
                    >
                      <Phone className="h-4 w-4 mr-2" />
                      WhatsApp
                    </Button>

                    {/* Botón de conversión rápida si hay cotización generada vinculada */}
                    {(selectedQuote.status === "quoted" || selectedQuote.status === "converted") && (() => {
                      const linkedQuote = findLinkedGeneratedQuote(selectedQuote._id)
                      return linkedQuote ? (
                        <Button
                          className="bg-green-600 hover:bg-green-700"
                          onClick={() => {
                            setSelectedGeneratedQuote(linkedQuote)
                            setConvertDialogOpen(true)
                            setDialogOpen(false)
                          }}
                        >
                          <CheckCircle2 className="h-4 w-4 mr-2" />
                          Convertir a Reserva
                        </Button>
                      ) : null
                    })()}
                  </div>

                  {selectedQuote.status === "declined" && (
                    <Button
                      variant="destructive"
                      onClick={() => {
                        setQuoteToDelete(selectedQuote)
                        setDeleteDialogOpen(true)
                      }}
                    >
                      <Trash2 className="h-4 w-4 mr-2" />
                      Eliminar
                    </Button>
                  )}
                </div>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>

      {/* Dialog de Confirmación de Eliminación */}
      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirmar Eliminación</DialogTitle>
            <DialogDescription>
              ¿Estás seguro que deseas eliminar esta cotización?
            </DialogDescription>
          </DialogHeader>

          {quoteToDelete && (
            <div className="space-y-4">
              <div className="bg-gray-50 p-4 rounded-lg">
                <p className="font-medium">{quoteToDelete.name}</p>
                <p className="text-sm text-gray-600">{quoteToDelete.email}</p>
                <p className="text-sm text-gray-600">{quoteToDelete.eventType}</p>
              </div>

              <p className="text-sm text-gray-600">
                Esta acción no se puede deshacer. La cotización será eliminada permanentemente.
              </p>

              <div className="flex gap-2 justify-end">
                <Button
                  variant="outline"
                  onClick={() => {
                    setDeleteDialogOpen(false)
                    setQuoteToDelete(null)
                  }}
                >
                  Cancelar
                </Button>
                <Button
                  variant="destructive"
                  onClick={handleDeleteQuote}
                >
                  <Trash2 className="h-4 w-4 mr-2" />
                  Eliminar Definitivamente
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Dialog de Detalles de Cotización Generada */}
      <Dialog open={historyDialogOpen} onOpenChange={setHistoryDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          {selectedGeneratedQuote && (
            <>
              <DialogHeader>
                <DialogTitle>Detalles de la Cotización Generada</DialogTitle>
                <DialogDescription>
                  Información completa de la cotización generada
                </DialogDescription>
              </DialogHeader>

              <div className="space-y-6">
                {/* Estado */}
                <div>
                  <label className="block text-sm font-medium mb-2">
                    Estado
                  </label>
                  <Select
                    value={selectedGeneratedQuote.status}
                    onValueChange={(value) => handleGeneratedQuoteStatusChange(selectedGeneratedQuote._id, value)}
                  >
                    <SelectTrigger className="w-full">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="pending">Pendiente</SelectItem>
                      <SelectItem value="converted">Convertida</SelectItem>
                      <SelectItem value="declined">Rechazada</SelectItem>
                      <SelectItem value="expired">Expirada</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Información del Cliente */}
                <div>
                  <h4 className="font-semibold mb-3">Información del Cliente</h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex items-center space-x-2">
                      <span className="font-medium">Nombre:</span>
                      <span>{selectedGeneratedQuote.clientName}</span>
                    </div>
                    {selectedGeneratedQuote.clientEmail && (
                      <div className="flex items-center space-x-2">
                        <Mail className="h-4 w-4" />
                        <span>{selectedGeneratedQuote.clientEmail}</span>
                      </div>
                    )}
                    {selectedGeneratedQuote.clientPhone && (
                      <div className="flex items-center space-x-2">
                        <Phone className="h-4 w-4" />
                        <span>{selectedGeneratedQuote.clientPhone}</span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Detalles del Evento */}
                <div>
                  <h4 className="font-semibold mb-3">Detalles del Evento</h4>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="text-gray-500">Plantilla:</span>
                      <p className="font-medium">{selectedGeneratedQuote.templateName}</p>
                    </div>
                    <div>
                      <span className="text-gray-500">Tipo de Evento:</span>
                      <p className="font-medium">{selectedGeneratedQuote.eventType}</p>
                    </div>
                    <div>
                      <span className="text-gray-500">Fecha:</span>
                      <p className="font-medium">
                        {new Date(selectedGeneratedQuote.eventDate).toLocaleDateString("es-CL")}
                      </p>
                    </div>
                    <div>
                      <span className="text-gray-500">Invitados:</span>
                      <p className="font-medium">{selectedGeneratedQuote.numberOfGuests} personas</p>
                    </div>
                  </div>
                </div>

                {/* Pricing */}
                <div>
                  <h4 className="font-semibold mb-3">Detalles de Precio</h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Precio por persona:</span>
                      <span className="font-medium">${selectedGeneratedQuote.pricePerPerson.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Número de invitados:</span>
                      <span className="font-medium">{selectedGeneratedQuote.numberOfGuests}</span>
                    </div>
                    <div className="flex justify-between border-t pt-2">
                      <span className="font-semibold">Total:</span>
                      <span className="font-semibold text-lg text-green-600">
                        ${selectedGeneratedQuote.totalAmount.toLocaleString()} {selectedGeneratedQuote.currency}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Servicios */}
                <div>
                  <h4 className="font-semibold mb-3">Servicios Incluidos</h4>
                  <ul className="list-disc list-inside text-sm space-y-1">
                    {selectedGeneratedQuote.includedServices.map((service: string, i: number) => (
                      <li key={i} className="text-gray-700">{service}</li>
                    ))}
                  </ul>
                </div>

                {/* Servicios Adicionales */}
                {selectedGeneratedQuote.additionalServices?.length > 0 && (
                  <div>
                    <h4 className="font-semibold mb-3">Servicios Adicionales</h4>
                    <ul className="list-disc list-inside text-sm space-y-1">
                      {selectedGeneratedQuote.additionalServices.map((service: string, i: number) => (
                        <li key={i} className="text-gray-700">{service}</li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Menú del Evento */}
                {selectedGeneratedQuote.menuSections?.length > 0 && (
                  <div>
                    <h4 className="font-semibold mb-3">Menú del Evento</h4>
                    <div className="space-y-4">
                      {selectedGeneratedQuote.menuSections.map((section: any, sectionIndex: number) => (
                        <div key={sectionIndex} className="border rounded-lg p-4 bg-gray-50">
                          <h5 className="font-medium text-sm mb-3 text-blue-700">{section.name}</h5>
                          <div className="space-y-3">
                            {section.items.map((item: any, itemIndex: number) => (
                              <div key={itemIndex} className="pl-3">
                                <p className="text-sm font-medium text-gray-700 mb-1">{item.category}</p>
                                <ul className="list-disc list-inside text-sm space-y-1 pl-2">
                                  {item.dishes.map((dish: string, dishIndex: number) => (
                                    <li key={dishIndex} className="text-gray-600">{dish}</li>
                                  ))}
                                </ul>
                              </div>
                            ))}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Metadata */}
                <div className="border-t pt-4 text-xs text-gray-500">
                  <p>Generada: {new Date(selectedGeneratedQuote.createdAt).toLocaleString("es-CL")}</p>
                  {selectedGeneratedQuote.convertedAt && (
                    <p>Convertida: {new Date(selectedGeneratedQuote.convertedAt).toLocaleString("es-CL")}</p>
                  )}
                </div>

                {/* Botones de acción */}
                <div className="flex justify-between pt-4 border-t">
                  {selectedGeneratedQuote.status === "pending" && (
                    <Button
                      className="bg-green-600 hover:bg-green-700"
                      onClick={() => setConvertDialogOpen(true)}
                    >
                      <CheckCircle2 className="h-4 w-4 mr-2" />
                      Convertir a Reserva
                    </Button>
                  )}
                  <Button
                    variant="destructive"
                    onClick={() => {
                      setQuoteToDeleteFromHistory(selectedGeneratedQuote)
                      setDeleteHistoryDialogOpen(true)
                    }}
                    className={selectedGeneratedQuote.status === "pending" ? "" : "ml-auto"}
                  >
                    <Trash2 className="h-4 w-4 mr-2" />
                    Eliminar Cotización
                  </Button>
                </div>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>

      {/* Dialog de Confirmación de Eliminación de Historial */}
      <Dialog open={deleteHistoryDialogOpen} onOpenChange={setDeleteHistoryDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirmar Eliminación</DialogTitle>
            <DialogDescription>
              ¿Estás seguro que deseas eliminar esta cotización del historial?
            </DialogDescription>
          </DialogHeader>

          {quoteToDeleteFromHistory && (
            <div className="space-y-4">
              <div className="bg-gray-50 p-4 rounded-lg">
                <p className="font-medium">{quoteToDeleteFromHistory.clientName}</p>
                <p className="text-sm text-gray-600">{quoteToDeleteFromHistory.templateName}</p>
                <p className="text-sm text-gray-600">
                  ${quoteToDeleteFromHistory.totalAmount.toLocaleString()} - {quoteToDeleteFromHistory.numberOfGuests} invitados
                </p>
              </div>

              <p className="text-sm text-gray-600">
                Esta acción no se puede deshacer. La cotización será eliminada permanentemente del historial.
              </p>

              <div className="flex gap-2 justify-end">
                <Button
                  variant="outline"
                  onClick={() => {
                    setDeleteHistoryDialogOpen(false)
                    setQuoteToDeleteFromHistory(null)
                  }}
                >
                  Cancelar
                </Button>
                <Button
                  variant="destructive"
                  onClick={handleDeleteGeneratedQuote}
                >
                  <Trash2 className="h-4 w-4 mr-2" />
                  Eliminar Definitivamente
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Dialog de Conversión a Reserva */}
      <Dialog open={convertDialogOpen} onOpenChange={setConvertDialogOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>Convertir Cotización a Reserva</DialogTitle>
            <DialogDescription>
              Completa los detalles adicionales para crear la reserva
            </DialogDescription>
          </DialogHeader>

          {selectedGeneratedQuote && (
            <div className="space-y-4">
              {/* Información del evento */}
              <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                <p className="font-medium text-blue-900">{selectedGeneratedQuote.clientName}</p>
                <p className="text-sm text-blue-700">{selectedGeneratedQuote.eventType}</p>
                <p className="text-sm text-blue-700">
                  {selectedGeneratedQuote.numberOfGuests} invitados - ${selectedGeneratedQuote.totalAmount.toLocaleString()}
                </p>
                <p className="text-sm text-blue-700">
                  Fecha: {new Date(selectedGeneratedQuote.eventDate).toLocaleDateString("es-CL")}
                </p>
              </div>

              {/* Formulario */}
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label>Hora de Inicio *</Label>
                    <Input
                      type="time"
                      value={convertFormData.startTime}
                      onChange={(e) => setConvertFormData({ ...convertFormData, startTime: e.target.value })}
                    />
                  </div>
                  <div>
                    <Label>Hora de Término *</Label>
                    <Input
                      type="time"
                      value={convertFormData.endTime}
                      onChange={(e) => setConvertFormData({ ...convertFormData, endTime: e.target.value })}
                    />
                  </div>
                </div>

                <div>
                  <Label>Solicitudes Especiales (Opcional)</Label>
                  <Textarea
                    value={convertFormData.specialRequests}
                    onChange={(e) => setConvertFormData({ ...convertFormData, specialRequests: e.target.value })}
                    placeholder="Cualquier solicitud especial del cliente..."
                    rows={3}
                  />
                </div>
              </div>

              {/* Info */}
              <div className="bg-green-50 p-3 rounded-lg border border-green-200">
                <p className="text-sm text-green-800">
                  ✓ El menú de la cotización se transferirá automáticamente a la reserva
                </p>
              </div>

              {/* Botones */}
              <div className="flex gap-2 justify-end">
                <Button
                  variant="outline"
                  onClick={() => setConvertDialogOpen(false)}
                >
                  Cancelar
                </Button>
                <Button
                  className="bg-green-600 hover:bg-green-700"
                  onClick={handleConvertToBooking}
                >
                  <CheckCircle2 className="h-4 w-4 mr-2" />
                  Crear Reserva
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Generador de Cotizaciones */}
      <QuoteGenerator
        open={generatorOpen}
        onClose={() => {
          setGeneratorOpen(false)
          setQuoteForGenerator(null)
          setQuickMode(false)
        }}
        quoteRequest={quoteForGenerator}
        quickMode={quickMode}
      />

    </div>
  )
}
