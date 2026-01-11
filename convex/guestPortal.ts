import { v } from "convex/values"
import { query, mutation } from "./_generated/server"

// Generar código de acceso único
function generateAccessCode(): string {
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789" // Sin caracteres confusos (0,O,1,I,l)
  let code = ""
  for (let i = 0; i < 8; i++) {
    code += chars.charAt(Math.floor(Math.random() * chars.length))
  }
  return code
}

// Obtener evento por código de acceso (público)
export const getEventByAccessCode = query({
  args: { code: v.string() },
  handler: async (ctx, args) => {
    const booking = await ctx.db
      .query("bookings")
      .withIndex("by_guest_access_code", (q) => q.eq("guestAccessCode", args.code.toUpperCase()))
      .first()

    if (!booking) {
      return null
    }

    // Solo devolver info necesaria (no datos sensibles)
    return {
      _id: booking._id,
      eventType: booking.eventType,
      eventDate: booking.eventDate,
      clientName: booking.clientName,
      numberOfGuests: booking.numberOfGuests,
      estimatedGuests: booking.estimatedGuests,
    }
  },
})

// Obtener invitados del evento (público)
export const getGuestsByAccessCode = query({
  args: { code: v.string() },
  handler: async (ctx, args) => {
    const booking = await ctx.db
      .query("bookings")
      .withIndex("by_guest_access_code", (q) => q.eq("guestAccessCode", args.code.toUpperCase()))
      .first()

    if (!booking) {
      return []
    }

    // Obtener todas las asignaciones de mesas para este evento
    const assignments = await ctx.db
      .query("tableAssignments")
      .withIndex("by_booking", (q) => q.eq("bookingId", booking._id))
      .collect()

    // Enriquecer con info de mesa
    const tables = await ctx.db.query("tables").collect()
    const tableMap = new Map(tables.map(t => [t._id.toString(), t]))

    return assignments.map(a => {
      const table = a.tableId ? tableMap.get(a.tableId.toString()) : null
      return {
        _id: a._id,
        guestName: a.guestName,
        dietaryRestrictions: a.dietaryRestrictions,
        isConfirmed: a.isConfirmed,
        notes: a.notes,
        tableName: table ? (table.title || `Mesa ${table.tableNumber}`) : null,
      }
    })
  },
})

// Agregar invitado (público - via código de acceso)
export const addGuestByAccessCode = mutation({
  args: {
    code: v.string(),
    guestName: v.string(),
    dietaryRestrictions: v.optional(v.string()),
    notes: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const booking = await ctx.db
      .query("bookings")
      .withIndex("by_guest_access_code", (q) => q.eq("guestAccessCode", args.code.toUpperCase()))
      .first()

    if (!booking) {
      throw new Error("Código de acceso inválido")
    }

    // Crear asignación sin mesa asignada
    const assignmentId = await ctx.db.insert("tableAssignments", {
      bookingId: booking._id,
      tableId: undefined as any, // Sin mesa asignada inicialmente
      guestName: args.guestName,
      dietaryRestrictions: args.dietaryRestrictions,
      isConfirmed: false,
      notes: args.notes,
      createdAt: Date.now(),
      updatedAt: Date.now(),
    })

    return assignmentId
  },
})

// Actualizar confirmación de invitado (público)
export const updateGuestConfirmation = mutation({
  args: {
    code: v.string(),
    guestId: v.id("tableAssignments"),
    isConfirmed: v.boolean(),
  },
  handler: async (ctx, args) => {
    // Verificar que el código es válido
    const booking = await ctx.db
      .query("bookings")
      .withIndex("by_guest_access_code", (q) => q.eq("guestAccessCode", args.code.toUpperCase()))
      .first()

    if (!booking) {
      throw new Error("Código de acceso inválido")
    }

    // Verificar que el invitado pertenece a este evento
    const guest = await ctx.db.get(args.guestId)
    if (!guest || guest.bookingId.toString() !== booking._id.toString()) {
      throw new Error("Invitado no encontrado")
    }

    await ctx.db.patch(args.guestId, {
      isConfirmed: args.isConfirmed,
      updatedAt: Date.now(),
    })
  },
})

// Eliminar invitado (público)
export const removeGuestByAccessCode = mutation({
  args: {
    code: v.string(),
    guestId: v.id("tableAssignments"),
  },
  handler: async (ctx, args) => {
    const booking = await ctx.db
      .query("bookings")
      .withIndex("by_guest_access_code", (q) => q.eq("guestAccessCode", args.code.toUpperCase()))
      .first()

    if (!booking) {
      throw new Error("Código de acceso inválido")
    }

    const guest = await ctx.db.get(args.guestId)
    if (!guest || guest.bookingId.toString() !== booking._id.toString()) {
      throw new Error("Invitado no encontrado")
    }

    await ctx.db.delete(args.guestId)
  },
})

// === FUNCIONES ADMIN ===

// Generar código de acceso para un evento (admin)
export const generateGuestAccessCode = mutation({
  args: { bookingId: v.id("bookings") },
  handler: async (ctx, args) => {
    const booking = await ctx.db.get(args.bookingId)
    if (!booking) {
      throw new Error("Reserva no encontrada")
    }

    // Si ya tiene código, devolverlo
    if (booking.guestAccessCode) {
      return booking.guestAccessCode
    }

    // Generar nuevo código único
    let code = generateAccessCode()
    let attempts = 0

    // Verificar que sea único
    while (attempts < 10) {
      const existing = await ctx.db
        .query("bookings")
        .withIndex("by_guest_access_code", (q) => q.eq("guestAccessCode", code))
        .first()

      if (!existing) break
      code = generateAccessCode()
      attempts++
    }

    await ctx.db.patch(args.bookingId, {
      guestAccessCode: code,
      updatedAt: Date.now(),
    })

    return code
  },
})

// Regenerar código de acceso (admin)
export const regenerateGuestAccessCode = mutation({
  args: { bookingId: v.id("bookings") },
  handler: async (ctx, args) => {
    const booking = await ctx.db.get(args.bookingId)
    if (!booking) {
      throw new Error("Reserva no encontrada")
    }

    let code = generateAccessCode()
    let attempts = 0

    while (attempts < 10) {
      const existing = await ctx.db
        .query("bookings")
        .withIndex("by_guest_access_code", (q) => q.eq("guestAccessCode", code))
        .first()

      if (!existing) break
      code = generateAccessCode()
      attempts++
    }

    await ctx.db.patch(args.bookingId, {
      guestAccessCode: code,
      updatedAt: Date.now(),
    })

    return code
  },
})

// Revocar acceso (admin)
export const revokeGuestAccessCode = mutation({
  args: { bookingId: v.id("bookings") },
  handler: async (ctx, args) => {
    await ctx.db.patch(args.bookingId, {
      guestAccessCode: undefined,
      updatedAt: Date.now(),
    })
  },
})
