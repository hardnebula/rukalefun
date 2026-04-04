"use client"

import { useState, useRef } from "react"
import { useQuery, useMutation } from "convex/react"
import { api } from "@/convex/_generated/api"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Trash2, Printer, Plus, User } from "lucide-react"
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

  const [newRow, setNewRow] = useState({ time: "", activity: "", notes: "" })
  const [showAddForm, setShowAddForm] = useState(false)
  const timeInputRef = useRef<HTMLInputElement>(null)

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
      setShowAddForm(false)
    } catch (error) {
      toast.error("Error al agregar")
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && newRow.activity.trim()) {
      e.preventDefault()
      handleAddRow()
    }
    if (e.key === "Escape") {
      setShowAddForm(false)
      setNewRow({ time: "", activity: "", notes: "" })
    }
  }

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

  const handleDelete = async (id: string) => {
    try {
      await deleteActivity({ id: id as any })
    } catch (error) {
      toast.error("Error al eliminar")
    }
  }

  const handlePrint = () => window.print()

  return (
    <div className="py-4">
      <style jsx global>{`
        @media print {
          .no-print { display: none !important; }
          @page { margin: 1.5cm; }
        }
      `}</style>

      {/* Header */}
      <div className="flex items-center justify-between mb-6 no-print">
        <div>
          <h3 className="text-lg font-semibold text-gray-900">Cronograma</h3>
          <p className="text-sm text-gray-500">
            {timeline?.length || 0} actividades
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => {
              setShowAddForm(true)
              setTimeout(() => timeInputRef.current?.focus(), 100)
            }}
          >
            <Plus className="w-4 h-4 mr-1" />
            Agregar
          </Button>
          <Button variant="outline" size="sm" onClick={handlePrint}>
            <Printer className="w-4 h-4 mr-1" />
            Imprimir
          </Button>
        </div>
      </div>

      {/* Visual timeline */}
      <div className="relative border-l-2 border-purple-300 ml-4 pl-6 space-y-4">
        {timeline?.map((activity) => (
          <TimelineCard
            key={activity._id}
            activity={activity}
            onUpdate={handleUpdate}
            onDelete={handleDelete}
          />
        ))}

        {/* Add new activity form */}
        {showAddForm && (
          <div className="relative no-print">
            <div className="absolute -left-[29px] w-4 h-4 rounded-full bg-green-500 border-2 border-white shadow" />
            <div className="bg-green-50 border border-green-200 border-dashed rounded-lg p-4 space-y-3">
              <div className="flex items-center gap-3">
                <input
                  ref={timeInputRef}
                  type="time"
                  value={newRow.time}
                  onChange={(e) => setNewRow({ ...newRow, time: e.target.value })}
                  onKeyDown={handleKeyDown}
                  className="w-24 px-2 py-1.5 border border-green-300 rounded-md text-lg font-bold text-purple-600 bg-white focus:ring-2 focus:ring-green-500 focus:outline-none"
                />
                <input
                  type="text"
                  value={newRow.activity}
                  onChange={(e) => setNewRow({ ...newRow, activity: e.target.value })}
                  onKeyDown={handleKeyDown}
                  className="flex-1 px-2 py-1.5 border border-green-300 rounded-md font-semibold bg-white focus:ring-2 focus:ring-green-500 focus:outline-none"
                  placeholder="Nombre de la actividad"
                />
              </div>
              <input
                type="text"
                value={newRow.notes}
                onChange={(e) => setNewRow({ ...newRow, notes: e.target.value })}
                onKeyDown={handleKeyDown}
                className="w-full px-2 py-1.5 border border-green-300 rounded-md text-sm text-gray-600 bg-white focus:ring-2 focus:ring-green-500 focus:outline-none"
                placeholder="Descripción o notas (opcional)"
              />
              <div className="flex justify-end gap-2">
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => {
                    setShowAddForm(false)
                    setNewRow({ time: "", activity: "", notes: "" })
                  }}
                >
                  Cancelar
                </Button>
                <Button
                  size="sm"
                  onClick={handleAddRow}
                  disabled={!newRow.activity.trim()}
                  className="bg-green-600 hover:bg-green-700 text-white"
                >
                  <Plus className="w-4 h-4 mr-1" />
                  Agregar
                </Button>
              </div>
            </div>
          </div>
        )}

        {/* Empty state */}
        {timeline?.length === 0 && !showAddForm && (
          <div className="relative">
            <div className="absolute -left-[29px] w-4 h-4 rounded-full bg-gray-300" />
            <div className="text-sm text-gray-400 py-4">
              No hay actividades. Haz clic en &quot;Agregar&quot; para crear la primera.
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

function TimelineCard({
  activity,
  onUpdate,
  onDelete,
}: {
  activity: any
  onUpdate: (id: string, field: string, value: string) => void
  onDelete: (id: string) => void
}) {
  const [editingTime, setEditingTime] = useState(false)
  const [values, setValues] = useState({
    time: activity.scheduledTime,
    activity: activity.activityName,
    notes: activity.description || "",
  })

  const handleBlur = (field: string) => {
    const originalValue =
      field === "time" ? activity.scheduledTime :
      field === "activity" ? activity.activityName :
      activity.description || ""

    if (values[field as keyof typeof values] !== originalValue) {
      onUpdate(activity._id, field, values[field as keyof typeof values])
    }
    if (field === "time") setEditingTime(false)
  }

  return (
    <div className="relative group">
      <div className="absolute -left-[29px] w-4 h-4 rounded-full bg-red-500 border-2 border-white shadow" />
      <div className="bg-white border rounded-lg p-4 shadow-sm hover:shadow-md transition-shadow">
        <div className="flex items-start justify-between">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1">
              {editingTime ? (
                <input
                  type="time"
                  value={values.time}
                  onChange={(e) => setValues({ ...values, time: e.target.value })}
                  onBlur={() => handleBlur("time")}
                  autoFocus
                  className="text-lg font-bold text-purple-600 border border-purple-300 rounded px-1 py-0.5 w-28 focus:ring-2 focus:ring-purple-500 focus:outline-none"
                />
              ) : (
                <span
                  onClick={() => setEditingTime(true)}
                  className="text-lg font-bold text-purple-600 cursor-pointer hover:bg-purple-50 rounded px-1 py-0.5 -ml-1"
                >
                  {values.time || "00:00"}
                </span>
              )}
              <Badge variant="outline" className="text-xs shrink-0">
                {activity.duration} min
              </Badge>
            </div>
            <input
              type="text"
              value={values.activity}
              onChange={(e) => setValues({ ...values, activity: e.target.value })}
              onBlur={() => handleBlur("activity")}
              className="font-semibold text-base bg-transparent border-0 p-0 w-full focus:ring-0 focus:outline-none hover:bg-gray-50 rounded px-1 -ml-1 cursor-text"
            />
          </div>
          <Button
            size="sm"
            variant="ghost"
            onClick={() => onDelete(activity._id)}
            className="h-8 w-8 p-0 opacity-0 group-hover:opacity-100 text-red-500 hover:text-red-600 hover:bg-red-50 shrink-0 no-print"
          >
            <Trash2 className="w-4 h-4" />
          </Button>
        </div>
        <input
          type="text"
          value={values.notes}
          onChange={(e) => setValues({ ...values, notes: e.target.value })}
          onBlur={() => handleBlur("notes")}
          className="text-sm text-gray-700 bg-transparent border-0 p-0 w-full mt-1 focus:ring-0 focus:outline-none hover:bg-gray-50 rounded px-1 -ml-1 cursor-text"
          placeholder="Agregar descripción..."
        />
      </div>
    </div>
  )
}
