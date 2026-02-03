"use client"

import { useState } from "react"
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
  Plus,
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
} from "lucide-react"
import { toast } from "sonner"

// Tipos de roles y sus colores
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

  const [showForm, setShowForm] = useState(false)
  const [editingNote, setEditingNote] = useState<string | null>(null)
  const [filterRole, setFilterRole] = useState<string>("all")
  const [generatingCode, setGeneratingCode] = useState(false)
  const [generatingSummary, setGeneratingSummary] = useState(false)

  // Form state
  const [formData, setFormData] = useState({
    role: "admin" as Role,
    authorName: "",
    content: "",
    category: "",
  })

  // Edit form state
  const [editData, setEditData] = useState({
    content: "",
    category: "",
  })

  const handleAddNote = async () => {
    if (!formData.authorName.trim() || !formData.content.trim()) {
      toast.error("Por favor completa nombre y contenido")
      return
    }

    try {
      await addNote({
        meetingId,
        role: formData.role,
        authorName: formData.authorName,
        content: formData.content,
        category: formData.category || undefined,
      })
      toast.success("Nota agregada")
      setFormData({ ...formData, content: "", category: "" })
      setShowForm(false)
    } catch (error) {
      toast.error("Error al agregar nota")
      console.error(error)
    }
  }

  const handleUpdateNote = async (noteId: Id<"meetingNotes">) => {
    try {
      await updateNote({
        noteId,
        content: editData.content,
        category: editData.category || undefined,
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

  // Filter notes by role
  const filteredNotes = notes?.filter((note: Note) => {
    if (filterRole === "all") return true
    return note.role === filterRole
  })

  // Group notes by role for display
  const groupedNotes = filteredNotes?.reduce<Record<Role, Note[]>>(
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
    <div className="space-y-6">
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

      {/* Botón IA y filtros */}
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

        <div className="flex gap-2">
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
          <Button onClick={() => setShowForm(!showForm)} className="bg-purple-600 hover:bg-purple-700">
            <Plus className="w-4 h-4 mr-2" />
            Nueva Nota
          </Button>
        </div>
      </div>

      {/* Formulario de nueva nota */}
      {showForm && (
        <div className="p-4 bg-purple-50 rounded-lg border border-purple-200 space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <Label>Rol *</Label>
              <Select
                value={formData.role}
                onValueChange={(value: Role) => setFormData({ ...formData, role: value })}
              >
                <SelectTrigger>
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
            </div>
            <div>
              <Label>Tu Nombre *</Label>
              <Input
                value={formData.authorName}
                onChange={(e) => setFormData({ ...formData, authorName: e.target.value })}
                placeholder="Ej: María García"
              />
            </div>
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
            <Label>Nota *</Label>
            <Textarea
              value={formData.content}
              onChange={(e) => setFormData({ ...formData, content: e.target.value })}
              placeholder="Escribe tu nota aquí..."
              rows={3}
            />
          </div>
          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={() => setShowForm(false)}>
              Cancelar
            </Button>
            <Button onClick={handleAddNote} className="bg-purple-600 hover:bg-purple-700">
              <Save className="w-4 h-4 mr-2" />
              Guardar Nota
            </Button>
          </div>
        </div>
      )}

      {/* Lista de notas */}
      {!notes ? (
        <div className="text-center py-8 text-gray-500">Cargando notas...</div>
      ) : notes.length === 0 ? (
        <div className="text-center py-8 text-gray-500">
          No hay notas todavía. Haz clic en &quot;Nueva Nota&quot; para agregar una.
        </div>
      ) : (
        <div className="space-y-4">
          {Object.entries(groupedNotes || {}).map(([role, roleNotes]) => {
            const config = ROLE_CONFIG[role as Role]
            const Icon = config.icon
            const notesArray = roleNotes as Note[]

            return (
              <div key={role} className="space-y-2">
                <div className="flex items-center gap-2">
                  <Icon className="w-5 h-5" />
                  <h4 className="font-semibold">{config.label}</h4>
                  <Badge variant="outline" className={config.color}>
                    {notesArray?.length || 0} notas
                  </Badge>
                </div>

                {notesArray?.map((note: Note) => (
                  <div
                    key={note._id}
                    className={`p-4 rounded-lg border ${config.color} bg-opacity-50`}
                  >
                    {editingNote === note._id ? (
                      <div className="space-y-3">
                        <Select
                          value={editData.category}
                          onValueChange={(value) => setEditData({ ...editData, category: value })}
                        >
                          <SelectTrigger className="w-full">
                            <SelectValue placeholder="Categoría" />
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
                        <Textarea
                          value={editData.content}
                          onChange={(e) => setEditData({ ...editData, content: e.target.value })}
                          rows={3}
                        />
                        <div className="flex justify-end gap-2">
                          <Button size="sm" variant="outline" onClick={() => setEditingNote(null)}>
                            <X className="w-4 h-4 mr-1" />
                            Cancelar
                          </Button>
                          <Button
                            size="sm"
                            onClick={() => handleUpdateNote(note._id)}
                            className="bg-purple-600 hover:bg-purple-700"
                          >
                            <Save className="w-4 h-4 mr-1" />
                            Guardar
                          </Button>
                        </div>
                      </div>
                    ) : (
                      <>
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-1">
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
                          <div className="flex gap-1 ml-2">
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={() => {
                                setEditingNote(note._id)
                                setEditData({
                                  content: note.content,
                                  category: note.category || "",
                                })
                              }}
                            >
                              <Edit className="w-4 h-4" />
                            </Button>
                            <Button
                              size="sm"
                              variant="ghost"
                              className="text-red-600 hover:text-red-700"
                              onClick={() => handleDeleteNote(note._id)}
                            >
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </div>
                        </div>
                      </>
                    )}
                  </div>
                ))}
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
