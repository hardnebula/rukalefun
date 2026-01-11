"use client"

import { useState } from "react"
import { useAction } from "convex/react"
import { api } from "@/convex/_generated/api"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {
  Sparkles,
  ShoppingCart,
  Clock,
  CheckSquare,
  FileText,
  Loader2,
  AlertCircle,
} from "lucide-react"
import { toast } from "sonner"

interface AIEventAssistantProps {
  bookingId: string
  open: boolean
  onOpenChange: (open: boolean) => void
}

type AssistantMode = "menu" | "shopping" | "timeline" | "checklist" | "summary"

export default function AIEventAssistant({
  bookingId,
  open,
  onOpenChange,
}: AIEventAssistantProps) {
  const [mode, setMode] = useState<AssistantMode>("menu")
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState<any>(null)

  const generateShoppingList = useAction(api.aiEventAssistant.generateShoppingList)
  const generateTimeline = useAction(api.aiEventAssistant.generateEventTimeline)
  const generateChecklist = useAction(api.aiEventAssistant.generateEventChecklist)
  const generateSummary = useAction(api.aiEventAssistant.generateEventSummary)

  const handleGenerate = async (type: AssistantMode) => {
    setLoading(true)
    setMode(type)
    setResult(null)

    try {
      let response

      switch (type) {
        case "shopping":
          response = await generateShoppingList({ bookingId: bookingId as any })
          break
        case "timeline":
          response = await generateTimeline({ bookingId: bookingId as any })
          break
        case "checklist":
          response = await generateChecklist({ bookingId: bookingId as any })
          break
        case "summary":
          response = await generateSummary({ bookingId: bookingId as any })
          break
      }

      if (response?.success) {
        setResult(response.data)
        toast.success("¡Generado exitosamente!")
      } else {
        toast.error("Error al generar contenido")
      }
    } catch (error: any) {
      console.error("Error:", error)
      toast.error(error.message || "Error al generar contenido")
    } finally {
      setLoading(false)
    }
  }

  const renderMenu = () => (
    <div className="grid grid-cols-2 gap-4 p-4">
      <Card
        className="cursor-pointer hover:shadow-lg transition-all hover:border-blue-500"
        onClick={() => handleGenerate("shopping")}
      >
        <CardContent className="p-6 text-center">
          <ShoppingCart className="w-12 h-12 mx-auto mb-3 text-blue-600" />
          <h3 className="font-semibold text-lg mb-2">Lista de Compras</h3>
          <p className="text-sm text-gray-600">
            Genera una lista completa basada en el menú y número de invitados
          </p>
        </CardContent>
      </Card>

      <Card
        className="cursor-pointer hover:shadow-lg transition-all hover:border-purple-500"
        onClick={() => handleGenerate("timeline")}
      >
        <CardContent className="p-6 text-center">
          <Clock className="w-12 h-12 mx-auto mb-3 text-purple-600" />
          <h3 className="font-semibold text-lg mb-2">Cronología</h3>
          <p className="text-sm text-gray-600">
            Crea un timeline detallado del evento desde preparación hasta cierre
          </p>
        </CardContent>
      </Card>

      <Card
        className="cursor-pointer hover:shadow-lg transition-all hover:border-green-500"
        onClick={() => handleGenerate("checklist")}
      >
        <CardContent className="p-6 text-center">
          <CheckSquare className="w-12 h-12 mx-auto mb-3 text-green-600" />
          <h3 className="font-semibold text-lg mb-2">Checklist</h3>
          <p className="text-sm text-gray-600">
            Revisa detalles pendientes y confirmaciones necesarias
          </p>
        </CardContent>
      </Card>

      <Card
        className="cursor-pointer hover:shadow-lg transition-all hover:border-orange-500"
        onClick={() => handleGenerate("summary")}
      >
        <CardContent className="p-6 text-center">
          <FileText className="w-12 h-12 mx-auto mb-3 text-orange-600" />
          <h3 className="font-semibold text-lg mb-2">Resumen Ejecutivo</h3>
          <p className="text-sm text-gray-600">
            Genera un resumen completo del evento para compartir con el equipo
          </p>
        </CardContent>
      </Card>
    </div>
  )

  const renderShoppingList = () => {
    if (!result) return null

    return (
      <div className="space-y-4">
        {result.categories?.map((category: any, idx: number) => (
          <Card key={idx}>
            <CardHeader className="pb-3">
              <CardTitle className="text-lg">{category.name}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {category.items.map((item: any, itemIdx: number) => (
                  <div
                    key={itemIdx}
                    className="flex items-start justify-between border-b pb-2 last:border-0"
                  >
                    <div className="flex-1">
                      <p className="font-medium">{item.name}</p>
                      {item.notes && (
                        <p className="text-xs text-gray-500 mt-1">{item.notes}</p>
                      )}
                    </div>
                    <div className="flex items-center gap-2 ml-4">
                      <span className="text-sm font-semibold">
                        {item.quantity} {item.unit}
                      </span>
                      <Badge
                        variant={
                          item.priority === "HIGH"
                            ? "destructive"
                            : item.priority === "MEDIUM"
                            ? "default"
                            : "secondary"
                        }
                        className="text-xs"
                      >
                        {item.priority}
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        ))}

        {result.summary && (
          <Card className="bg-blue-50 border-blue-200">
            <CardContent className="p-4">
              <h4 className="font-semibold mb-2">Resumen</h4>
              <p className="text-sm">
                <strong>Total de items:</strong> {result.summary.totalItems}
              </p>
              {result.summary.estimatedBudget && (
                <p className="text-sm">
                  <strong>Presupuesto estimado:</strong> {result.summary.estimatedBudget}
                </p>
              )}
              {result.summary.notes && (
                <p className="text-sm mt-2 text-gray-700">{result.summary.notes}</p>
              )}
            </CardContent>
          </Card>
        )}
      </div>
    )
  }

  const renderTimeline = () => {
    if (!result) return null

    return (
      <div className="space-y-4">
        <div className="relative border-l-2 border-purple-300 ml-4 pl-6 space-y-6">
          {result.timeline?.map((event: any, idx: number) => (
            <div key={idx} className="relative">
              <div
                className={`absolute -left-[29px] w-4 h-4 rounded-full ${
                  event.priority === "HIGH"
                    ? "bg-red-500"
                    : event.priority === "MEDIUM"
                    ? "bg-yellow-500"
                    : "bg-green-500"
                }`}
              />
              <div className="bg-white border rounded-lg p-4 shadow-sm hover:shadow-md transition-shadow">
                <div className="flex items-start justify-between mb-2">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-lg font-bold text-purple-600">
                        {event.time}
                      </span>
                      <Badge variant="outline" className="text-xs">
                        {event.duration} min
                      </Badge>
                    </div>
                    <h4 className="font-semibold text-base">{event.title}</h4>
                  </div>
                </div>
                <p className="text-sm text-gray-700 mb-2">{event.description}</p>
                <div className="flex items-center gap-2 text-xs text-gray-500">
                  <span>👤 {event.responsible}</span>
                </div>
              </div>
            </div>
          ))}
        </div>

        {result.summary && (
          <Card className="bg-purple-50 border-purple-200">
            <CardContent className="p-4">
              <h4 className="font-semibold mb-2">Resumen del Timeline</h4>
              <p className="text-sm mb-2">
                <strong>Duración total:</strong> {result.summary.totalDuration}
              </p>
              {result.summary.criticalMoments?.length > 0 && (
                <div className="mt-2">
                  <strong className="text-sm">Momentos críticos:</strong>
                  <ul className="list-disc list-inside text-sm mt-1">
                    {result.summary.criticalMoments.map((moment: string, idx: number) => (
                      <li key={idx}>{moment}</li>
                    ))}
                  </ul>
                </div>
              )}
              {result.summary.notes && (
                <p className="text-sm mt-2 text-gray-700">{result.summary.notes}</p>
              )}
            </CardContent>
          </Card>
        )}
      </div>
    )
  }

  const renderChecklist = () => {
    if (!result) return null

    return (
      <div className="space-y-4">
        {result.summary && (
          <Card className="bg-gradient-to-r from-blue-50 to-green-50 border-blue-200">
            <CardContent className="p-4">
              <h4 className="font-semibold mb-3">Estado General</h4>
              <div className="grid grid-cols-2 gap-3 mb-3">
                <div>
                  <p className="text-xs text-gray-600">Preparación</p>
                  <p className="text-2xl font-bold text-green-600">
                    {result.summary.overallReadiness}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-gray-600">Tareas</p>
                  <p className="text-sm">
                    <span className="text-green-600 font-semibold">
                      {result.summary.completed}
                    </span>{" "}
                    / {result.summary.totalTasks}
                  </p>
                </div>
              </div>
              {result.summary.criticalIssues?.length > 0 && (
                <div className="mt-3 p-2 bg-red-50 border border-red-200 rounded">
                  <div className="flex items-start gap-2">
                    <AlertCircle className="w-4 h-4 text-red-600 mt-0.5" />
                    <div className="flex-1">
                      <p className="text-xs font-semibold text-red-600 mb-1">
                        Issues Críticos:
                      </p>
                      <ul className="list-disc list-inside text-xs text-red-700">
                        {result.summary.criticalIssues.map((issue: string, idx: number) => (
                          <li key={idx}>{issue}</li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        )}

        {result.categories?.map((category: any, idx: number) => (
          <Card key={idx}>
            <CardHeader className="pb-3">
              <CardTitle className="text-lg">{category.name}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {category.items.map((item: any, itemIdx: number) => (
                  <div
                    key={itemIdx}
                    className={`p-3 rounded-lg border ${
                      item.status === "DONE"
                        ? "bg-green-50 border-green-200"
                        : item.status === "PENDING"
                        ? "bg-yellow-50 border-yellow-200"
                        : "bg-red-50 border-red-200"
                    }`}
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <span
                            className={`w-2 h-2 rounded-full ${
                              item.status === "DONE"
                                ? "bg-green-500"
                                : item.status === "PENDING"
                                ? "bg-yellow-500"
                                : "bg-red-500"
                            }`}
                          />
                          <p className="font-medium text-sm">{item.task}</p>
                        </div>
                        {item.notes && (
                          <p className="text-xs text-gray-600 ml-4">{item.notes}</p>
                        )}
                        {item.deadline && (
                          <p className="text-xs text-gray-500 ml-4 mt-1">
                            📅 {item.deadline}
                          </p>
                        )}
                      </div>
                      <Badge
                        variant={
                          item.priority === "HIGH"
                            ? "destructive"
                            : item.priority === "MEDIUM"
                            ? "default"
                            : "secondary"
                        }
                        className="text-xs shrink-0"
                      >
                        {item.priority}
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    )
  }

  const renderSummary = () => {
    if (!result) return null

    return (
      <div className="space-y-4">
        <Card className="bg-gradient-to-r from-orange-50 to-yellow-50">
          <CardContent className="p-6">
            <h3 className="text-xl font-bold mb-3">Overview</h3>
            <p className="text-gray-700 leading-relaxed">{result.overview}</p>
          </CardContent>
        </Card>

        <div className="grid grid-cols-2 gap-4">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base">Logística</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2 text-sm">
              <div>
                <span className="text-gray-600">Lugar:</span>{" "}
                <span className="font-medium">{result.logistics?.venue}</span>
              </div>
              <div>
                <span className="text-gray-600">Fecha:</span>{" "}
                <span className="font-medium">{result.logistics?.date}</span>
              </div>
              <div>
                <span className="text-gray-600">Horario:</span>{" "}
                <span className="font-medium">{result.logistics?.time}</span>
              </div>
              <div>
                <span className="text-gray-600">Invitados:</span>{" "}
                <span className="font-medium">{result.logistics?.guestCount}</span>
              </div>
              <div>
                <span className="text-gray-600">Duración:</span>{" "}
                <span className="font-medium">{result.logistics?.duration}</span>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base">Financiero</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-600">Total:</span>
                <span className="font-bold text-green-600">
                  ${result.financial?.total?.toLocaleString()}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Pagado:</span>
                <span className="font-medium">
                  ${result.financial?.paid?.toLocaleString()}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Pendiente:</span>
                <span className="font-medium text-orange-600">
                  ${result.financial?.pending?.toLocaleString()}
                </span>
              </div>
              <div className="pt-2 border-t">
                <Badge variant="outline">{result.financial?.status}</Badge>
              </div>
            </CardContent>
          </Card>
        </div>

        {result.team?.length > 0 && (
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base">Equipo Asignado</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {result.team.map((member: any, idx: number) => (
                  <div
                    key={idx}
                    className="flex items-center justify-between p-2 bg-gray-50 rounded"
                  >
                    <div>
                      <p className="font-medium text-sm">{member.name}</p>
                      <p className="text-xs text-gray-600">{member.role}</p>
                    </div>
                    <span className="text-sm font-semibold text-green-600">
                      ${member.cost?.toLocaleString()}
                    </span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {result.highlights?.length > 0 && (
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base">Puntos Destacados</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2">
                {result.highlights.map((highlight: string, idx: number) => (
                  <li key={idx} className="flex items-start gap-2">
                    <span className="text-green-500 mt-1">✓</span>
                    <span className="text-sm">{highlight}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        )}

        {result.considerations?.length > 0 && (
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base">Consideraciones Especiales</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2">
                {result.considerations.map((consideration: string, idx: number) => (
                  <li key={idx} className="flex items-start gap-2">
                    <span className="text-orange-500 mt-1">⚠</span>
                    <span className="text-sm">{consideration}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        )}

        {result.nextSteps?.length > 0 && (
          <Card className="border-blue-200 bg-blue-50">
            <CardHeader className="pb-3">
              <CardTitle className="text-base">Próximos Pasos</CardTitle>
            </CardHeader>
            <CardContent>
              <ol className="space-y-2 list-decimal list-inside">
                {result.nextSteps.map((step: string, idx: number) => (
                  <li key={idx} className="text-sm text-gray-700">
                    {step}
                  </li>
                ))}
              </ol>
            </CardContent>
          </Card>
        )}
      </div>
    )
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-2xl">
            <Sparkles className="w-7 h-7 text-purple-600" />
            Ruka AI - Asistente de Eventos
          </DialogTitle>
        </DialogHeader>

        <div className="mt-4">
          {loading ? (
            <div className="flex flex-col items-center justify-center py-20">
              <Loader2 className="w-12 h-12 text-purple-600 animate-spin mb-4" />
              <p className="text-gray-600">Generando contenido con IA...</p>
              <p className="text-sm text-gray-500 mt-2">Esto puede tomar unos segundos</p>
            </div>
          ) : (
            <>
              {mode === "menu" && renderMenu()}
              {mode === "shopping" && result && (
                <>
                  <Button
                    variant="ghost"
                    onClick={() => {
                      setMode("menu")
                      setResult(null)
                    }}
                    className="mb-4"
                  >
                    ← Volver al menú
                  </Button>
                  {renderShoppingList()}
                </>
              )}
              {mode === "timeline" && result && (
                <>
                  <Button
                    variant="ghost"
                    onClick={() => {
                      setMode("menu")
                      setResult(null)
                    }}
                    className="mb-4"
                  >
                    ← Volver al menú
                  </Button>
                  {renderTimeline()}
                </>
              )}
              {mode === "checklist" && result && (
                <>
                  <Button
                    variant="ghost"
                    onClick={() => {
                      setMode("menu")
                      setResult(null)
                    }}
                    className="mb-4"
                  >
                    ← Volver al menú
                  </Button>
                  {renderChecklist()}
                </>
              )}
              {mode === "summary" && result && (
                <>
                  <Button
                    variant="ghost"
                    onClick={() => {
                      setMode("menu")
                      setResult(null)
                    }}
                    className="mb-4"
                  >
                    ← Volver al menú
                  </Button>
                  {renderSummary()}
                </>
              )}
            </>
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}
