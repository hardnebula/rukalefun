import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

// Obtener todas las asignaciones de un evento
export const getAssignmentsByBooking = query({
  args: { bookingId: v.id("bookings") },
  handler: async (ctx, args) => {
    const assignments = await ctx.db
      .query("staffAssignments")
      .withIndex("by_booking", (q) => q.eq("bookingId", args.bookingId))
      .collect();

    // Enriquecer con información del personal
    return await Promise.all(
      assignments.map(async (assignment) => {
        const staff = await ctx.db.get(assignment.staffId);
        return { ...assignment, staff };
      })
    );
  },
});

// Obtener asignaciones por estado de pago
export const getAssignmentsByPaymentStatus = query({
  args: { paymentStatus: v.string() },
  handler: async (ctx, args) => {
    const assignments = await ctx.db
      .query("staffAssignments")
      .withIndex("by_payment_status", (q) => q.eq("paymentStatus", args.paymentStatus))
      .collect();

    return await Promise.all(
      assignments.map(async (assignment) => {
        const staff = await ctx.db.get(assignment.staffId);
        const booking = await ctx.db.get(assignment.bookingId);
        return { ...assignment, staff, booking };
      })
    );
  },
});

// Crear asignación de personal a evento
export const createAssignment = mutation({
  args: {
    bookingId: v.id("bookings"),
    staffId: v.id("staff"),
    role: v.string(),
    scheduledStartTime: v.string(),
    scheduledEndTime: v.string(),
    amountToPay: v.number(),
    notes: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const now = Date.now();
    return await ctx.db.insert("staffAssignments", {
      ...args,
      confirmedAttendance: false,
      paymentStatus: "pending",
      createdAt: now,
      updatedAt: now,
    });
  },
});

// Actualizar asignación
export const updateAssignment = mutation({
  args: {
    id: v.id("staffAssignments"),
    role: v.optional(v.string()),
    scheduledStartTime: v.optional(v.string()),
    scheduledEndTime: v.optional(v.string()),
    confirmedAttendance: v.optional(v.boolean()),
    actualStartTime: v.optional(v.string()),
    actualEndTime: v.optional(v.string()),
    hoursWorked: v.optional(v.number()),
    amountToPay: v.optional(v.number()),
    paymentStatus: v.optional(v.string()),
    paymentDate: v.optional(v.string()),
    paymentMethod: v.optional(v.string()),
    notes: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const { id, ...updates } = args;
    await ctx.db.patch(id, {
      ...updates,
      updatedAt: Date.now(),
    });
  },
});

// Confirmar asistencia
export const confirmAttendance = mutation({
  args: {
    id: v.id("staffAssignments"),
    actualStartTime: v.optional(v.string()),
    actualEndTime: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const { id, actualStartTime, actualEndTime } = args;
    
    // Calcular horas trabajadas si se proporcionan ambos tiempos
    let hoursWorked: number | undefined;
    if (actualStartTime && actualEndTime) {
      const start = new Date(`1970-01-01T${actualStartTime}`);
      const end = new Date(`1970-01-01T${actualEndTime}`);
      hoursWorked = (end.getTime() - start.getTime()) / (1000 * 60 * 60);
    }

    await ctx.db.patch(id, {
      confirmedAttendance: true,
      actualStartTime,
      actualEndTime,
      hoursWorked,
      updatedAt: Date.now(),
    });
  },
});

// Registrar pago
export const registerPayment = mutation({
  args: {
    id: v.id("staffAssignments"),
    amountToPay: v.optional(v.number()),
    paymentDate: v.string(),
    paymentMethod: v.string(),
  },
  handler: async (ctx, args) => {
    const { id, amountToPay, paymentDate, paymentMethod } = args;
    
    const updates: any = {
      paymentStatus: "paid",
      paymentDate,
      paymentMethod,
      updatedAt: Date.now(),
    };

    if (amountToPay !== undefined) {
      updates.amountToPay = amountToPay;
    }

    await ctx.db.patch(id, updates);
  },
});

// Eliminar asignación
export const deleteAssignment = mutation({
  args: { id: v.id("staffAssignments") },
  handler: async (ctx, args) => {
    await ctx.db.delete(args.id);
  },
});

// Obtener todas las asignaciones con filtros opcionales
export const getAllAssignments = query({
  args: {
    bookingId: v.optional(v.id("bookings")),
    staffId: v.optional(v.id("staff")),
    paymentStatus: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    let assignments = await ctx.db.query("staffAssignments").collect();

    // Aplicar filtros
    if (args.bookingId) {
      assignments = assignments.filter((a) => a.bookingId === args.bookingId);
    }
    if (args.staffId) {
      assignments = assignments.filter((a) => a.staffId === args.staffId);
    }
    if (args.paymentStatus) {
      assignments = assignments.filter((a) => a.paymentStatus === args.paymentStatus);
    }

    // Enriquecer con información
    return await Promise.all(
      assignments.map(async (assignment) => {
        const staff = await ctx.db.get(assignment.staffId);
        const booking = await ctx.db.get(assignment.bookingId);
        return { ...assignment, staff, booking };
      })
    );
  },
});

