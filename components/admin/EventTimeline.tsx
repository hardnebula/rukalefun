"use client"

import { useState, useRef, useEffect } from "react"
import { useQuery, useMutation } from "convex/react"
import { api } from "@/convex/_generated/api"
import { Button } from "@/components/ui/button"
import { Trash2, Printer } from "lucide-react"
import { toast } from "sonner"

interface EventTimelineProps {
  bookingId: string
  booking: any
}

export default function EventTimeline({ bookingId, booking }: EventTimelineProps) {
  const timeline = useQuery(api.eventTasks.getTimelineByBooking, { bookingId: bookingId as any })
  const createActivity = useMutation(api.eventTasks.createTimelineActivity)
  const updateActivity = useMutation(api.eventTasks.updateTimelineActivity)
  const deleteActivity = useMutation(api.eventTasks.deleteTimelineActivity)

  // Estado para nueva fila
  const [newRow, setNewRow] = useState({ time: "", activity: "", notes: "" })
  const timeInputRef = useRef<HTMLInputElement>(null)

  // Agregar nueva actividad
  const handleAddRow = async () => {
    if (!newRow.activity.trim()) return

    try {
      const nextOrder = timeline ? Math.max(...timeline.map(a => a.order), -1) + 1 : 0
      await createActivity({
        bookingId: bookingId as any,
        activityName: newRow.activity,
        scheduledTime: newRow.time || "00:00",
        duration: 30,
        description: newRow.notes || undefined,
        order: nextOrder,
      })
      setNewRow({ time: "", activity: "", notes: "" })
      timeInputRef.current?.focus()
    } catch (error) {
      toast.error("Error al agregar")
    }
  }

  // Enter para agregar
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && newRow.activity.trim()) {
      e.preventDefault()
      handleAddRow()
    }
  }

  // Actualizar actividad existente
  const handleUpdate = async (id: string, field: string, value: string) => {
    try {
      const updates: any = {}
      if (field === "time") updates.scheduledTime = value
      if (field === "activity") updates.activityName = value
      if (field === "notes") updates.description = value
      await updateActivity({ id: id as any, ...updates })
    } catch (error) {
      toast.error("Error al actualizar")
    }
  }

  // Eliminar
  const handleDelete = async (id: string) => {
    try {
      await deleteActivity({ id: id as any })
    } catch (error) {
      toast.error("Error al eliminar")
    }
  }

  // Imprimir
  const handlePrint = () => window.print()

  return (
    <div className="py-4">
      <style jsx global>{`
        @media print {
          .no-print { display: none !important; }
          @page { margin: 1.5cm; }
          table { border-collapse: collapse; width: 100%; }
          th, td { border: 1px solid #333 !important; padding: 8px !important; }
          th { background: #f3f4f6 !important; }
          input { border: none !important; background: transparent !important; }
        }
      `}</style>

      {/* Header */}
      <div className="flex items-center justify-between mb-4 no-print">
        <div>
          <h3 className="text-lg font-semibold text-gray-900">Cronograma</h3>
          <p className="text-sm text-gray-500">
            {timeline?.length || 0} actividades
          </p>
        </div>
        <Button variant="outline" size="sm" onClick={handlePrint}>
          <Printer className="w-4 h-4 mr-1" />
          Imprimir
        </Button>
      </div>

      {/* Tabla tipo Excel */}
      <div className="border rounded-lg overflow-hidden bg-white">
        <table className="w-full">
          <thead>
            <tr className="bg-gray-100 border-b">
              <th className="text-left p-3 text-sm font-semibold text-gray-700 w-24">Hora</th>
              <th className="text-left p-3 text-sm font-semibold text-gray-700">Actividad</th>
              <th className="text-left p-3 text-sm font-semibold text-gray-700 w-1/3">Notas</th>
              <th className="w-10 no-print"></th>
            </tr>
          </thead>
          <tbody>
            {/* Filas existentes */}
            {timeline?.map((activity) => (
              <TimelineRow
                key={activity._id}
                activity={activity}
                onUpdate={handleUpdate}
                onDelete={handleDelete}
              />
            ))}

            {/* Nueva fila (siempre visible) */}
            <tr className="border-t bg-green-50/50 no-print">
              <td className="p-1">
                <input
                  ref={timeInputRef}
                  type="time"
                  value={newRow.time}
                  onChange={(e) => setNewRow({ ...newRow, time: e.target.value })}
                  onKeyDown={handleKeyDown}
                  className="w-full p-2 border-0 bg-transparent focus:ring-2 focus:ring-green-500 rounded"
                  placeholder="00:00"
                />
              </td>
              <td className="p-1">
                <input
                  type="text"
                  value={newRow.activity}
                  onChange={(e) => setNewRow({ ...newRow, activity: e.target.value })}
                  onKeyDown={handleKeyDown}
                  className="w-full p-2 border-0 bg-transparent focus:ring-2 focus:ring-green-500 rounded"
                  placeholder="+ Nueva actividad (Enter para agregar)"
                />
              </td>
              <td className="p-1">
                <input
                  type="text"
                  value={newRow.notes}
                  onChange={(e) => setNewRow({ ...newRow, notes: e.target.value })}
                  onKeyDown={handleKeyDown}
                  className="w-full p-2 border-0 bg-transparent focus:ring-2 focus:ring-green-500 rounded"
                  placeholder="Notas..."
                />
              </td>
              <td className="p-1">
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={handleAddRow}
                  disabled={!newRow.activity.trim()}
                  className="h-8 w-8 p-0 text-green-600"
                >
                  +
                </Button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      {/* Tip */}
      <p className="text-xs text-gray-400 mt-2 text-center no-print">
        Escribe y presiona Enter para agregar. Edita directamente las celdas.
      </p>
    </div>
  )
}

// Componente de fila individual (editable inline)
function TimelineRow({
  activity,
  onUpdate,
  onDelete,
}: {
  activity: any
  onUpdate: (id: string, field: string, value: string) => void
  onDelete: (id: string) => void
}) {
  const [values, setValues] = useState({
    time: activity.scheduledTime,
    activity: activity.activityName,
    notes: activity.description || "",
  })

  // Actualizar al perder foco si cambió
  const handleBlur = (field: string) => {
    const originalValue =
      field === "time" ? activity.scheduledTime :
      field === "activity" ? activity.activityName :
      activity.description || ""

    if (values[field as keyof typeof values] !== originalValue) {
      onUpdate(activity._id, field, values[field as keyof typeof values])
    }
  }

  return (
    <tr className="border-t hover:bg-gray-50 group">
      <td className="p-1">
        <input
          type="time"
          value={values.time}
          onChange={(e) => setValues({ ...values, time: e.target.value })}
          onBlur={() => handleBlur("time")}
          className="w-full p-2 border-0 bg-transparent hover:bg-gray-100 focus:bg-white focus:ring-2 focus:ring-blue-500 rounded font-medium"
        />
      </td>
      <td className="p-1">
        <input
          type="text"
          value={values.activity}
          onChange={(e) => setValues({ ...values, activity: e.target.value })}
          onBlur={() => handleBlur("activity")}
          className="w-full p-2 border-0 bg-transparent hover:bg-gray-100 focus:bg-white focus:ring-2 focus:ring-blue-500 rounded"
        />
      </td>
      <td className="p-1">
        <input
          type="text"
          value={values.notes}
          onChange={(e) => setValues({ ...values, notes: e.target.value })}
          onBlur={() => handleBlur("notes")}
          className="w-full p-2 border-0 bg-transparent hover:bg-gray-100 focus:bg-white focus:ring-2 focus:ring-blue-500 rounded text-gray-600 text-sm"
          placeholder="..."
        />
      </td>
      <td className="p-1 no-print">
        <Button
          size="sm"
          variant="ghost"
          onClick={() => onDelete(activity._id)}
          className="h-8 w-8 p-0 opacity-0 group-hover:opacity-100 text-red-500 hover:text-red-600 hover:bg-red-50"
        >
          <Trash2 className="w-4 h-4" />
        </Button>
      </td>
    </tr>
  )
}
