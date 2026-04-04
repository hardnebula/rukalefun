"use client"

import { useState, useRef, useEffect, useCallback } from "react"
import { useQuery, useMutation, useAction } from "convex/react"
import { api } from "@/convex/_generated/api"
import { Id } from "@/convex/_generated/dataModel"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  Trash2,
  Edit,
  Save,
  X,
  Link2,
  Link2Off,
  Copy,
  Sparkles,
  Loader2,
  User,
  Palette,
  ChefHat,
  Music,
  Camera,
  Heart,
  MoreHorizontal,
  Send,
} from "lucide-react"
import { toast } from "sonner"

// Tipos de roles y sus colores
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
    color: "bg-red-100 text-red-800 border-red-300",
    bubbleBg: "bg-red-50 border-red-200",
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

interface MeetingNotesProps {
  meetingId: Id<"meetings">
  accessCode?: string | null
}

export default function MeetingNotes({ meetingId, accessCode }: MeetingNotesProps) {
  const notes = useQuery(api.meetingNotes.getNotesByMeeting, { meetingId })
  const addNote = useMutation(api.meetingNotes.addNote)
  const updateNote = useMutation(api.meetingNotes.updateNote)
  const deleteNote = useMutation(api.meetingNotes.deleteNote)
  const generateAccessCode = useMutation(api.meetingNotes.generateAccessCode)
  const revokeAccessCode = useMutation(api.meetingNotes.revokeAccessCode)
  const generateSummary = useAction(api.meetingNotes.generateMeetingSummary)

  const scrollRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLTextAreaElement>(null)

  const [editingNote, setEditingNote] = useState<string | null>(null)
  const [filterRole, setFilterRole] = useState<string>("all")
  const [generatingCode, setGeneratingCode] = useState(false)
  const [generatingSummary, setGeneratingSummary] = useState(false)
  const [sending, setSending] = useState(false)
  const [changingName, setChangingName] = useState(false)

  // Input state - persisted via localStorage
  const [role, setRole] = useState<Role>(() => {
    if (typeof window !== "undefined") {
      return (localStorage.getItem("meetingNotes_adminRole") as Role) || "admin"
    }
    return "admin"
  })
  const [authorName, setAuthorName] = useState(() => {
    if (typeof window !== "undefined") {
      return localStorage.getItem("meetingNotes_adminAuthorName") || ""
    }
    return ""
  })
  const [content, setContent] = useState("")

  // Edit form state
  const [editData, setEditData] = useState({
    content: "",
    category: "sin_categoria",
  })

  // Persist role and authorName
  useEffect(() => {
    if (typeof window !== "undefined") {
      localStorage.setItem("meetingNotes_adminRole", role)
    }
  }, [role])

  useEffect(() => {
    if (typeof window !== "undefined" && authorName) {
      localStorage.setItem("meetingNotes_adminAuthorName", authorName)
    }
  }, [authorName])

  // Auto-scroll to bottom when notes change
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight
    }
  }, [notes])

  const handleAddNote = useCallback(async () => {
    if (!authorName.trim()) {
      setChangingName(true)
      toast.error("Por favor ingresa tu nombre")
      return
    }
    if (!content.trim()) return

    setSending(true)
    try {
      await addNote({
        meetingId,
        role,
        authorName: authorName.trim(),
        content: content.trim(),
      })
      setContent("")
      inputRef.current?.focus()
    } catch (error) {
      toast.error("Error al agregar nota")
      console.error(error)
    } finally {
      setSending(false)
    }
  }, [addNote, meetingId, role, authorName, content])

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      handleAddNote()
    }
  }

  const handleUpdateNote = async (noteId: Id<"meetingNotes">) => {
    try {
      await updateNote({
        noteId,
        content: editData.content,
        category: (editData.category && editData.category !== "sin_categoria") ? editData.category : undefined,
      })
      toast.success("Nota actualizada")
      setEditingNote(null)
    } catch (error) {
      toast.error("Error al actualizar nota")
      console.error(error)
    }
  }

  const handleDeleteNote = async (noteId: Id<"meetingNotes">) => {
    if (!confirm("¿Eliminar esta nota?")) return

    try {
      await deleteNote({ noteId })
      toast.success("Nota eliminada")
    } catch (error) {
      toast.error("Error al eliminar nota")
      console.error(error)
    }
  }

  const handleGenerateAccessCode = async () => {
    setGeneratingCode(true)
    try {
      const code = await generateAccessCode({ meetingId })
      toast.success(`Código generado: ${code}`)
    } catch (error) {
      toast.error("Error al generar código")
      console.error(error)
    } finally {
      setGeneratingCode(false)
    }
  }

  const handleRevokeAccessCode = async () => {
    if (!confirm("¿Revocar el código de acceso? Los novios ya no podrán acceder.")) return

    try {
      await revokeAccessCode({ meetingId })
      toast.success("Código revocado")
    } catch (error) {
      toast.error("Error al revocar código")
      console.error(error)
    }
  }

  const handleCopyCode = () => {
    if (accessCode) {
      navigator.clipboard.writeText(accessCode)
      toast.success("Código copiado al portapapeles")
    }
  }

  const handleCopyLink = () => {
    if (accessCode) {
      const url = `${window.location.origin}/reunion/${accessCode}`
      navigator.clipboard.writeText(url)
      toast.success("Enlace copiado al portapapeles")
    }
  }

  const handleGenerateSummary = async () => {
    if (!notes || notes.length === 0) {
      toast.error("No hay notas para generar resumen")
      return
    }

    setGeneratingSummary(true)
    try {
      await generateSummary({ meetingId })
      toast.success("Resumen generado exitosamente")
    } catch (error: any) {
      toast.error(error.message || "Error al generar resumen")
      console.error(error)
    } finally {
      setGeneratingSummary(false)
    }
  }

  // Define note type
  type Note = NonNullable<typeof notes>[number]

  // Sort notes chronologically (oldest first) and filter
  const sortedNotes = notes
    ? [...notes]
        .filter((note: Note) => filterRole === "all" || note.role === filterRole)
        .sort((a: Note, b: Note) => a.createdAt - b.createdAt)
    : null

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

  // Helper: check if two timestamps are on different dates
  const isDifferentDay = (ts1: number, ts2: number) => {
    const d1 = new Date(ts1)
    const d2 = new Date(ts2)
    return d1.toDateString() !== d2.toDateString()
  }

  return (
    <div className="space-y-4">
      {/* Header con código de acceso */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 p-4 bg-gray-50 rounded-lg border">
        <div>
          <h4 className="font-semibold text-gray-900">Acceso para Novios</h4>
          <p className="text-sm text-gray-600">
            Genera un código para que los novios puedan ver y agregar notas
          </p>
        </div>
        <div className="flex items-center gap-2">
          {accessCode ? (
            <>
              <Badge variant="outline" className="text-lg font-mono px-3 py-1">
                {accessCode}
              </Badge>
              <Button size="sm" variant="outline" onClick={handleCopyCode}>
                <Copy className="w-4 h-4" />
              </Button>
              <Button size="sm" variant="outline" onClick={handleCopyLink}>
                <Link2 className="w-4 h-4 mr-1" />
                Copiar enlace
              </Button>
              <Button size="sm" variant="destructive" onClick={handleRevokeAccessCode}>
                <Link2Off className="w-4 h-4" />
              </Button>
            </>
          ) : (
            <Button
              onClick={handleGenerateAccessCode}
              disabled={generatingCode}
              className="bg-green-600 hover:bg-green-700"
            >
              {generatingCode ? (
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              ) : (
                <Link2 className="w-4 h-4 mr-2" />
              )}
              Generar Código
            </Button>
          )}
        </div>
      </div>

      {/* Toolbar: Filtro + Resumen IA */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="flex items-center gap-2">
          <Label className="text-sm">Filtrar por rol:</Label>
          <Select value={filterRole} onValueChange={setFilterRole}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Todos los roles" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todos</SelectItem>
              {Object.entries(ROLE_CONFIG).map(([key, config]) => (
                <SelectItem key={key} value={key}>
                  {config.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <Button
          onClick={handleGenerateSummary}
          disabled={generatingSummary || !notes || notes.length === 0}
          variant="outline"
          className="border-purple-300 text-purple-700 hover:bg-purple-50"
        >
          {generatingSummary ? (
            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
          ) : (
            <Sparkles className="w-4 h-4 mr-2" />
          )}
          Generar Resumen IA
        </Button>
      </div>

      {/* Chat thread container */}
      <div className="border rounded-lg flex flex-col bg-white">
        {/* Scrollable message area */}
        <div
          ref={scrollRef}
          className="flex-1 overflow-y-auto p-4 space-y-1 max-h-[500px] min-h-[200px]"
        >
          {!sortedNotes ? (
            <div className="text-center py-8 text-gray-500">Cargando notas...</div>
          ) : sortedNotes.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              {notes && notes.length > 0
                ? "No hay notas con este filtro."
                : "No hay notas todavía. Escribe un mensaje abajo para comenzar."}
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
                      <div className="flex-1 h-px bg-gray-200" />
                      <span className="text-xs text-gray-500 font-medium px-2">
                        {formatDateSeparator(note.createdAt)}
                      </span>
                      <div className="flex-1 h-px bg-gray-200" />
                    </div>
                  )}

                  {/* Note bubble */}
                  {editingNote === note._id ? (
                    // Inline edit mode
                    <div className={`p-3 rounded-lg border ${config.bubbleBg} my-2 space-y-2`}>
                      <Select
                        value={editData.category}
                        onValueChange={(value) => setEditData({ ...editData, category: value })}
                      >
                        <SelectTrigger className="w-full">
                          <SelectValue placeholder="Categoría" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="sin_categoria">Sin categoría</SelectItem>
                          {NOTE_CATEGORIES.map((cat) => (
                            <SelectItem key={cat.value} value={cat.value}>
                              {cat.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <Textarea
                        value={editData.content}
                        onChange={(e) => setEditData({ ...editData, content: e.target.value })}
                        rows={3}
                        autoFocus
                      />
                      <div className="flex justify-end gap-2">
                        <Button size="sm" variant="outline" onClick={() => setEditingNote(null)}>
                          <X className="w-3 h-3 mr-1" />
                          Cancelar
                        </Button>
                        <Button
                          size="sm"
                          onClick={() => handleUpdateNote(note._id)}
                          className="bg-purple-600 hover:bg-purple-700"
                        >
                          <Save className="w-3 h-3 mr-1" />
                          Guardar
                        </Button>
                      </div>
                    </div>
                  ) : (
                    // Normal bubble
                    <div className={`group p-3 rounded-lg border ${config.bubbleBg} my-1 relative`}>
                      <div className="flex items-start gap-2">
                        <div className="flex-1 min-w-0">
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

                        {/* Hover actions */}
                        <div className="hidden group-hover:flex items-center gap-0.5 shrink-0">
                          <Button
                            size="sm"
                            variant="ghost"
                            className="h-7 w-7 p-0"
                            onClick={() => {
                              setEditingNote(note._id)
                              setEditData({
                                content: note.content,
                                category: note.category || "sin_categoria",
                              })
                            }}
                          >
                            <Edit className="w-3.5 h-3.5" />
                          </Button>
                          <Button
                            size="sm"
                            variant="ghost"
                            className="h-7 w-7 p-0 text-red-600 hover:text-red-700"
                            onClick={() => handleDeleteNote(note._id)}
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              )
            })
          )}
        </div>

        {/* Input bar - always visible */}
        <div className="border-t p-3 bg-gray-50 rounded-b-lg">
          {/* Author name prompt */}
          {(!authorName || changingName) && (
            <div className="flex items-center gap-2 mb-2">
              <Input
                value={authorName}
                onChange={(e) => setAuthorName(e.target.value)}
                placeholder="Tu nombre (ej: María García)"
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
            {/* Role selector */}
            <Select value={role} onValueChange={(v: Role) => setRole(v)}>
              <SelectTrigger className="w-[140px] shrink-0">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {Object.entries(ROLE_CONFIG).map(([key, config]) => (
                  <SelectItem key={key} value={key}>
                    {config.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            {/* Message textarea */}
            <Textarea
              ref={inputRef}
              value={content}
              onChange={(e) => setContent(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Escribe una nota..."
              disabled={sending}
              className="flex-1 resize-none min-h-[40px] max-h-[120px]"
              rows={1}
            />

            {/* Send button */}
            <Button
              onClick={handleAddNote}
              disabled={!content.trim() || sending}
              className="bg-purple-600 hover:bg-purple-700 shrink-0"
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
                className="text-purple-600 hover:underline"
                onClick={() => setChangingName(true)}
              >
                (cambiar)
              </button>
            </p>
          )}
        </div>
      </div>
    </div>
  )
}
