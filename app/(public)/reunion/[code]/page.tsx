"use client"

import { useState, useRef, useEffect } from "react"
import { useParams } from "next/navigation"
import { useQuery, useMutation } from "convex/react"
import { api } from "@/convex/_generated/api"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import {
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
  Send,
} from "lucide-react"
import { toast } from "sonner"
import { Toaster } from "@/components/ui/sonner"
import Link from "next/link"

// Configuración de roles y sus colores
const ROLE_CONFIG = {
  admin: {
    label: "Administrador",
    color: "bg-purple-100 text-purple-800 border-purple-300",
    bubbleBg: "bg-purple-50 border-purple-200",
    icon: User,
  },
  decoradora: {
    label: "Decoradora",
    color: "bg-pink-100 text-pink-800 border-pink-300",
    bubbleBg: "bg-pink-50 border-pink-200",
    icon: Palette,
  },
  cocina: {
    label: "Cocina",
    color: "bg-orange-100 text-orange-800 border-orange-300",
    bubbleBg: "bg-orange-50 border-orange-200",
    icon: ChefHat,
  },
  dj: {
    label: "DJ",
    color: "bg-blue-100 text-blue-800 border-blue-300",
    bubbleBg: "bg-blue-50 border-blue-200",
    icon: Music,
  },
  fotografia: {
    label: "Fotografía",
    color: "bg-cyan-100 text-cyan-800 border-cyan-300",
    bubbleBg: "bg-cyan-50 border-cyan-200",
    icon: Camera,
  },
  novios: {
    label: "Novios",
    color: "bg-rose-100 text-rose-800 border-rose-300",
    bubbleBg: "bg-rose-50 border-rose-200",
    icon: Heart,
  },
  otro: {
    label: "Otro",
    color: "bg-gray-100 text-gray-800 border-gray-300",
    bubbleBg: "bg-gray-50 border-gray-200",
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

  const scrollRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLTextAreaElement>(null)

  const [sending, setSending] = useState(false)
  const [changingName, setChangingName] = useState(false)
  const [content, setContent] = useState("")
  const [authorName, setAuthorName] = useState(() => {
    if (typeof window !== "undefined") {
      return localStorage.getItem("meetingNotes_publicAuthorName") || ""
    }
    return ""
  })

  // Persist authorName
  useEffect(() => {
    if (typeof window !== "undefined" && authorName) {
      localStorage.setItem("meetingNotes_publicAuthorName", authorName)
    }
  }, [authorName])

  // Auto-scroll when notes change
  useEffect(() => {
    if (scrollRef.current && meetingData?.notes) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight
    }
  }, [meetingData?.notes])

  const handleAddNote = async () => {
    if (!authorName.trim()) {
      setChangingName(true)
      toast.error("Por favor ingresa tu nombre")
      return
    }
    if (!content.trim()) return

    setSending(true)
    try {
      await addNote({
        accessCode,
        authorName: authorName.trim(),
        content: content.trim(),
      })
      setContent("")
      inputRef.current?.focus()
    } catch (error: any) {
      toast.error(error.message || "Error al agregar nota")
      console.error(error)
    } finally {
      setSending(false)
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      handleAddNote()
    }
  }

  // Helper: format date for separators
  const formatDateSeparator = (timestamp: number) => {
    const date = new Date(timestamp)
    const today = new Date()
    const yesterday = new Date()
    yesterday.setDate(yesterday.getDate() - 1)

    if (date.toDateString() === today.toDateString()) return "Hoy"
    if (date.toDateString() === yesterday.toDateString()) return "Ayer"
    return date.toLocaleDateString("es-CL", {
      weekday: "long",
      day: "numeric",
      month: "long",
    })
  }

  const isDifferentDay = (ts1: number, ts2: number) => {
    return new Date(ts1).toDateString() !== new Date(ts2).toDateString()
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

  // Sort notes chronologically (oldest first)
  const sortedNotes = [...notes].sort((a: Note, b: Note) => a.createdAt - b.createdAt)

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

        {/* Notes Section - Chat Style */}
        <Card className="border-rose-200">
          <CardHeader className="bg-gradient-to-r from-rose-50 to-pink-50 border-b border-rose-100">
            <div className="flex items-center gap-2">
              <MessageSquare className="w-5 h-5 text-rose-600" />
              <CardTitle className="text-rose-900">Notas Colaborativas</CardTitle>
            </div>
            <CardDescription>
              Todos los participantes pueden agregar notas y comentarios
            </CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col p-0" style={{ height: "450px" }}>
            {/* Scrollable message area */}
            <div
              ref={scrollRef}
              className="flex-1 overflow-y-auto p-4 space-y-1"
            >
              {sortedNotes.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  <MessageSquare className="w-12 h-12 mx-auto mb-3 opacity-50" />
                  <p>No hay notas todavía.</p>
                  <p className="text-sm">Escribe un mensaje abajo para comenzar.</p>
                </div>
              ) : (
                sortedNotes.map((note: Note, index: number) => {
                  const config = ROLE_CONFIG[note.role as Role] || ROLE_CONFIG.otro
                  const Icon = config.icon
                  const showDateSeparator =
                    index === 0 || isDifferentDay(sortedNotes[index - 1].createdAt, note.createdAt)

                  return (
                    <div key={note._id}>
                      {/* Date separator */}
                      {showDateSeparator && (
                        <div className="flex items-center gap-3 my-3">
                          <div className="flex-1 h-px bg-rose-200" />
                          <span className="text-xs text-rose-400 font-medium px-2">
                            {formatDateSeparator(note.createdAt)}
                          </span>
                          <div className="flex-1 h-px bg-rose-200" />
                        </div>
                      )}

                      {/* Note bubble */}
                      <div className={`p-3 rounded-lg border ${config.bubbleBg} my-1`}>
                        <div className="flex items-center gap-2 flex-wrap">
                          <Badge variant="outline" className={`text-xs ${config.color}`}>
                            <Icon className="w-3 h-3 mr-1" />
                            {config.label}
                          </Badge>
                          <span className="font-medium text-sm">{note.authorName}</span>
                          {note.category && (
                            <Badge variant="secondary" className="text-xs">
                              {NOTE_CATEGORIES.find((c) => c.value === note.category)?.label ||
                                note.category}
                            </Badge>
                          )}
                          <span className="text-xs text-gray-400">
                            {new Date(note.createdAt).toLocaleTimeString("es-CL", {
                              hour: "2-digit",
                              minute: "2-digit",
                            })}
                            {note.updatedAt !== note.createdAt && " (editada)"}
                          </span>
                        </div>
                        <p className="text-sm whitespace-pre-wrap mt-1">{note.content}</p>
                      </div>
                    </div>
                  )
                })
              )}
            </div>

            {/* Input bar - fixed at bottom */}
            <div className="border-t border-rose-100 p-3 bg-rose-50/50">
              {/* Author name prompt */}
              {(!authorName || changingName) && (
                <div className="flex items-center gap-2 mb-2">
                  <Input
                    value={authorName}
                    onChange={(e) => setAuthorName(e.target.value)}
                    placeholder="Tu nombre (ej: María y Juan)"
                    className="flex-1 text-sm"
                    onKeyDown={(e) => {
                      if (e.key === "Enter" && authorName.trim()) {
                        setChangingName(false)
                        inputRef.current?.focus()
                      }
                    }}
                    autoFocus={changingName}
                  />
                  {changingName && authorName.trim() && (
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => setChangingName(false)}
                    >
                      OK
                    </Button>
                  )}
                </div>
              )}

              <div className="flex items-end gap-2">
                <Textarea
                  ref={inputRef}
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder="Escribe una nota o comentario..."
                  disabled={sending}
                  className="flex-1 resize-none min-h-[40px] max-h-[120px]"
                  rows={1}
                />
                <Button
                  onClick={handleAddNote}
                  disabled={!content.trim() || sending}
                  className="bg-rose-600 hover:bg-rose-700 shrink-0"
                  size="icon"
                >
                  {sending ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <Send className="w-4 h-4" />
                  )}
                </Button>
              </div>

              {/* Author info line */}
              {authorName && !changingName && (
                <p className="text-xs text-gray-500 mt-1.5">
                  Enviando como: <strong>{authorName}</strong>{" "}
                  <button
                    className="text-rose-600 hover:underline"
                    onClick={() => setChangingName(true)}
                  >
                    (cambiar)
                  </button>
                </p>
              )}
            </div>
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
