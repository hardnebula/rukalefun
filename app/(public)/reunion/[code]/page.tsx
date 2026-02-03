"use client"

import { useState } from "react"
import { useParams } from "next/navigation"
import { useQuery, useMutation } from "convex/react"
import { api } from "@/convex/_generated/api"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  Plus,
  Save,
  Calendar,
  Clock,
  MapPin,
  User,
  Users,
  Heart,
  MessageSquare,
  Sparkles,
  Loader2,
  AlertCircle,
  ChefHat,
  Palette,
  Music,
  Camera,
  MoreHorizontal,
} from "lucide-react"
import { toast } from "sonner"
import { Toaster } from "@/components/ui/sonner"
import Link from "next/link"

// Configuración de roles y sus colores
const ROLE_CONFIG = {
  admin: {
    label: "Administrador",
    color: "bg-purple-100 text-purple-800 border-purple-300",
    icon: User,
  },
  decoradora: {
    label: "Decoradora",
    color: "bg-pink-100 text-pink-800 border-pink-300",
    icon: Palette,
  },
  cocina: {
    label: "Cocina",
    color: "bg-orange-100 text-orange-800 border-orange-300",
    icon: ChefHat,
  },
  dj: {
    label: "DJ",
    color: "bg-blue-100 text-blue-800 border-blue-300",
    icon: Music,
  },
  fotografia: {
    label: "Fotografía",
    color: "bg-cyan-100 text-cyan-800 border-cyan-300",
    icon: Camera,
  },
  novios: {
    label: "Novios",
    color: "bg-red-100 text-red-800 border-red-300",
    icon: Heart,
  },
  otro: {
    label: "Otro",
    color: "bg-gray-100 text-gray-800 border-gray-300",
    icon: MoreHorizontal,
  },
} as const

type Role = keyof typeof ROLE_CONFIG

// Categorías de notas
const NOTE_CATEGORIES = [
  { value: "menu", label: "Menú" },
  { value: "decoracion", label: "Decoración" },
  { value: "timeline", label: "Cronograma" },
  { value: "musica", label: "Música" },
  { value: "fotografia", label: "Fotografía" },
  { value: "logistica", label: "Logística" },
  { value: "presupuesto", label: "Presupuesto" },
  { value: "otro", label: "Otro" },
]

export default function ReunionPublicaPage() {
  const params = useParams()
  const accessCode = params.code as string

  const meetingData = useQuery(api.meetingNotes.getMeetingByAccessCode, { accessCode })
  const addNote = useMutation(api.meetingNotes.addNoteFromPublic)

  const [showForm, setShowForm] = useState(false)
  const [saving, setSaving] = useState(false)
  const [formData, setFormData] = useState({
    authorName: "",
    content: "",
    category: "",
  })

  const handleAddNote = async () => {
    if (!formData.authorName.trim() || !formData.content.trim()) {
      toast.error("Por favor completa tu nombre y el contenido de la nota")
      return
    }

    setSaving(true)
    try {
      await addNote({
        accessCode,
        authorName: formData.authorName,
        content: formData.content,
        category: formData.category || undefined,
      })
      toast.success("Nota agregada exitosamente")
      setFormData({ ...formData, content: "", category: "" })
      setShowForm(false)
    } catch (error: any) {
      toast.error(error.message || "Error al agregar nota")
      console.error(error)
    } finally {
      setSaving(false)
    }
  }

  // Loading state
  if (meetingData === undefined) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-rose-50 to-white flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-12 h-12 animate-spin text-rose-500 mx-auto mb-4" />
          <p className="text-gray-600">Cargando información de la reunión...</p>
        </div>
      </div>
    )
  }

  // Invalid code
  if (meetingData === null) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-rose-50 to-white flex items-center justify-center p-4">
        <Card className="max-w-md w-full">
          <CardContent className="pt-8 text-center">
            <AlertCircle className="w-16 h-16 text-red-400 mx-auto mb-4" />
            <h1 className="text-2xl font-bold text-gray-900 mb-2">Código no válido</h1>
            <p className="text-gray-600 mb-6">
              El código de acceso no es válido o ha sido revocado. Por favor verifica el enlace con el organizador del evento.
            </p>
            <Link href="/">
              <Button className="bg-rose-600 hover:bg-rose-700">
                Ir al inicio
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    )
  }

  const { meeting, booking, notes } = meetingData

  // Define note type
  type Note = (typeof notes)[number]

  // Group notes by role
  const groupedNotes = notes.reduce<Record<Role, Note[]>>(
    (acc: Record<Role, Note[]>, note: Note) => {
      if (!acc[note.role as Role]) {
        acc[note.role as Role] = []
      }
      acc[note.role as Role].push(note)
      return acc
    },
    {} as Record<Role, Note[]>
  )

  return (
    <div className="min-h-screen bg-gradient-to-b from-rose-50 to-white">
      <Toaster />

      {/* Header */}
      <header className="bg-white shadow-sm border-b border-rose-100">
        <div className="max-w-4xl mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Heart className="w-8 h-8 text-rose-500" />
              <div>
                <h1 className="text-xl font-bold text-gray-900">Portal de Reunión</h1>
                <p className="text-sm text-gray-500">Ruka Lefún</p>
              </div>
            </div>
            <Badge className="bg-rose-100 text-rose-800 border-rose-300">
              {meeting.meetingType === "consulta_inicial" ? "Consulta Inicial" : "Planificación"}
            </Badge>
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 py-8 space-y-8">
        {/* Meeting Info Card */}
        <Card className="border-rose-200">
          <CardHeader className="bg-gradient-to-r from-rose-50 to-pink-50 border-b border-rose-100">
            <CardTitle className="text-2xl text-rose-900">{meeting.title}</CardTitle>
            <CardDescription>Información de la reunión</CardDescription>
          </CardHeader>
          <CardContent className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex items-center gap-3">
                <Calendar className="w-5 h-5 text-rose-500" />
                <div>
                  <p className="text-xs text-gray-500">Fecha</p>
                  <p className="font-medium">
                    {new Date(meeting.meetingDate).toLocaleDateString("es-CL", {
                      weekday: "long",
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <Clock className="w-5 h-5 text-rose-500" />
                <div>
                  <p className="text-xs text-gray-500">Horario</p>
                  <p className="font-medium">{meeting.startTime} - {meeting.endTime}</p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <User className="w-5 h-5 text-rose-500" />
                <div>
                  <p className="text-xs text-gray-500">Cliente</p>
                  <p className="font-medium">{meeting.clientName}</p>
                </div>
              </div>

              {meeting.location && (
                <div className="flex items-center gap-3">
                  <MapPin className="w-5 h-5 text-rose-500" />
                  <div>
                    <p className="text-xs text-gray-500">Ubicación</p>
                    <p className="font-medium">{meeting.location}</p>
                  </div>
                </div>
              )}
            </div>

            {/* Booking info */}
            {booking && (
              <div className="mt-4 p-4 bg-blue-50 rounded-lg border border-blue-200">
                <div className="flex items-center gap-2 mb-2">
                  <Users className="w-5 h-5 text-blue-600" />
                  <h4 className="font-semibold text-blue-900">Evento Vinculado</h4>
                </div>
                <p className="text-sm text-blue-800">
                  <strong>{booking.eventType}</strong> - {new Date(booking.eventDate).toLocaleDateString("es-CL")}
                </p>
                <p className="text-sm text-blue-700">{booking.numberOfGuests} invitados</p>
              </div>
            )}

            {/* Agenda */}
            {meeting.agenda && (
              <div className="mt-4 p-4 bg-gray-50 rounded-lg border">
                <h4 className="font-semibold text-gray-900 mb-2">Agenda</h4>
                <p className="text-sm text-gray-700 whitespace-pre-wrap">{meeting.agenda}</p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* AI Summary */}
        {meeting.aiGeneratedSummary && (
          <Card className="border-purple-200">
            <CardHeader className="bg-gradient-to-r from-purple-50 to-blue-50 border-b border-purple-100">
              <div className="flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-purple-600" />
                <CardTitle className="text-purple-900">Resumen de la Reunión</CardTitle>
              </div>
              {meeting.aiSummaryGeneratedAt && (
                <CardDescription>
                  Generado el {new Date(meeting.aiSummaryGeneratedAt).toLocaleString("es-CL")}
                </CardDescription>
              )}
            </CardHeader>
            <CardContent className="p-6">
              <p className="text-sm text-gray-700 whitespace-pre-wrap">{meeting.aiGeneratedSummary}</p>
            </CardContent>
          </Card>
        )}

        {/* Notes Section */}
        <Card className="border-rose-200">
          <CardHeader className="bg-gradient-to-r from-rose-50 to-pink-50 border-b border-rose-100">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <MessageSquare className="w-5 h-5 text-rose-600" />
                <CardTitle className="text-rose-900">Notas Colaborativas</CardTitle>
              </div>
              <Button
                onClick={() => setShowForm(!showForm)}
                className="bg-rose-600 hover:bg-rose-700"
              >
                <Plus className="w-4 h-4 mr-2" />
                Agregar Nota
              </Button>
            </div>
            <CardDescription>
              Todos los participantes pueden agregar notas y comentarios
            </CardDescription>
          </CardHeader>
          <CardContent className="p-6 space-y-6">
            {/* Add Note Form */}
            {showForm && (
              <div className="p-4 bg-rose-50 rounded-lg border border-rose-200 space-y-4">
                <h4 className="font-semibold text-rose-900">Nueva Nota</h4>

                <div>
                  <Label>Tu Nombre *</Label>
                  <Input
                    value={formData.authorName}
                    onChange={(e) => setFormData({ ...formData, authorName: e.target.value })}
                    placeholder="Ej: María y Juan"
                  />
                </div>

                <div>
                  <Label>Categoría (opcional)</Label>
                  <Select
                    value={formData.category}
                    onValueChange={(value) => setFormData({ ...formData, category: value })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Seleccionar categoría" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="">Sin categoría</SelectItem>
                      {NOTE_CATEGORIES.map((cat) => (
                        <SelectItem key={cat.value} value={cat.value}>
                          {cat.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label>Tu Nota *</Label>
                  <Textarea
                    value={formData.content}
                    onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                    placeholder="Escribe aquí tu nota, pregunta o comentario..."
                    rows={4}
                  />
                </div>

                <div className="flex justify-end gap-2">
                  <Button variant="outline" onClick={() => setShowForm(false)}>
                    Cancelar
                  </Button>
                  <Button
                    onClick={handleAddNote}
                    disabled={saving}
                    className="bg-rose-600 hover:bg-rose-700"
                  >
                    {saving ? (
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    ) : (
                      <Save className="w-4 h-4 mr-2" />
                    )}
                    Guardar Nota
                  </Button>
                </div>
              </div>
            )}

            {/* Notes List */}
            {notes.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                <MessageSquare className="w-12 h-12 mx-auto mb-3 opacity-50" />
                <p>No hay notas todavía.</p>
                <p className="text-sm">Sé el primero en agregar una nota.</p>
              </div>
            ) : (
              <div className="space-y-6">
                {Object.entries(groupedNotes).map(([role, roleNotes]) => {
                  const config = ROLE_CONFIG[role as Role]
                  const Icon = config.icon
                  const notesArray = roleNotes as Note[]

                  return (
                    <div key={role} className="space-y-2">
                      <div className="flex items-center gap-2">
                        <Icon className="w-5 h-5" />
                        <h4 className="font-semibold">{config.label}</h4>
                        <Badge variant="outline" className={config.color}>
                          {notesArray?.length || 0}
                        </Badge>
                      </div>

                      {notesArray?.map((note: Note) => (
                        <div
                          key={note._id}
                          className={`p-4 rounded-lg border ${config.color}`}
                        >
                          <div className="flex items-center gap-2 mb-2">
                            <span className="font-medium">{note.authorName}</span>
                            {note.category && (
                              <Badge variant="secondary" className="text-xs">
                                {NOTE_CATEGORIES.find((c) => c.value === note.category)?.label ||
                                  note.category}
                              </Badge>
                            )}
                          </div>
                          <p className="text-sm whitespace-pre-wrap">{note.content}</p>
                          <p className="text-xs text-gray-500 mt-2">
                            {new Date(note.createdAt).toLocaleString("es-CL")}
                            {note.updatedAt !== note.createdAt && " (editada)"}
                          </p>
                        </div>
                      ))}
                    </div>
                  )
                })}
              </div>
            )}
          </CardContent>
        </Card>
      </main>

      {/* Footer */}
      <footer className="bg-rose-50 border-t border-rose-100 py-8 mt-12">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <Heart className="w-8 h-8 text-rose-400 mx-auto mb-3" />
          <p className="text-gray-600 text-sm">
            Portal de reuniones de <strong>Ruka Lefún</strong>
          </p>
          <p className="text-gray-500 text-xs mt-1">
            Centro de Eventos - Villarrica, Chile
          </p>
        </div>
      </footer>
    </div>
  )
}
