import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

// ============== PERSONAL (STAFF) ==============

// Obtener todo el personal
export const getAllStaff = query({
  handler: async (ctx) => {
    return await ctx.db
      .query("staff")
      .order("desc")
      .collect();
  },
});

// Obtener personal activo
export const getActiveStaff = query({
  handler: async (ctx) => {
    return await ctx.db
      .query("staff")
      .filter((q) => q.eq(q.field("isActive"), true))
      .order("desc")
      .collect();
  },
});

// Obtener personal por rol
export const getStaffByRole = query({
  args: { role: v.string() },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("staff")
      .filter((q) => q.eq(q.field("role"), args.role))
      .collect();
  },
});

// Crear personal
export const createStaff = mutation({
  args: {
    name: v.string(),
    role: v.string(),
    phone: v.string(),
    email: v.optional(v.string()),
    ratePerEvent: v.number(),
    ratePerHour: v.optional(v.number()),
    notes: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const now = Date.now();
    return await ctx.db.insert("staff", {
      ...args,
      isActive: true,
      createdAt: now,
    });
  },
});

// Actualizar personal
export const updateStaff = mutation({
  args: {
    id: v.id("staff"),
    name: v.optional(v.string()),
    role: v.optional(v.string()),
    phone: v.optional(v.string()),
    email: v.optional(v.string()),
    ratePerEvent: v.optional(v.number()),
    ratePerHour: v.optional(v.number()),
    notes: v.optional(v.string()),
    isActive: v.optional(v.boolean()),
  },
  handler: async (ctx, args) => {
    const { id, ...updates } = args;
    await ctx.db.patch(id, updates);
  },
});

// Eliminar personal
export const deleteStaff = mutation({
  args: { id: v.id("staff") },
  handler: async (ctx, args) => {
    await ctx.db.delete(args.id);
  },
});

// ============== ASIGNACIONES DE PERSONAL ==============

// Obtener todas las asignaciones
export const getAllAssignments = query({
  handler: async (ctx) => {
    const assignments = await ctx.db.query("staffAssignments").collect();
    
    return await Promise.all(
      assignments.map(async (assignment) => {
        const staff = await ctx.db.get(assignment.staffId);
        const booking = await ctx.db.get(assignment.bookingId);
        let space = null;
        if (booking && booking.spaceId) {
          space = await ctx.db.get(booking.spaceId);
        }
        return {
          ...assignment,
          staff,
          booking: booking ? { ...booking, space } : null
        };
      })
    );
  },
});

// Obtener asignaciones por evento
export const getAssignmentsByBooking = query({
  args: { bookingId: v.id("bookings") },
  handler: async (ctx, args) => {
    const assignments = await ctx.db
      .query("staffAssignments")
      .withIndex("by_booking", (q) => q.eq("bookingId", args.bookingId))
      .collect();
    
    return await Promise.all(
      assignments.map(async (assignment) => {
        const staff = await ctx.db.get(assignment.staffId);
        return { ...assignment, staff };
      })
    );
  },
});

// Obtener asignaciones por personal
export const getAssignmentsByStaff = query({
  args: { staffId: v.id("staff") },
  handler: async (ctx, args) => {
    const assignments = await ctx.db
      .query("staffAssignments")
      .withIndex("by_staff", (q) => q.eq("staffId", args.staffId))
      .collect();
    
    return await Promise.all(
      assignments.map(async (assignment) => {
        const booking = await ctx.db.get(assignment.bookingId);
        let space = null;
        if (booking && booking.spaceId) {
          space = await ctx.db.get(booking.spaceId);
        }
        return {
          ...assignment,
          booking: booking ? { ...booking, space } : null
        };
      })
    );
  },
});

// Obtener asignaciones pendientes de pago
export const getPendingPayments = query({
  handler: async (ctx) => {
    const assignments = await ctx.db
      .query("staffAssignments")
      .withIndex("by_payment_status", (q) => q.eq("paymentStatus", "pending"))
      .collect();
    
    return await Promise.all(
      assignments.map(async (assignment) => {
        const staff = await ctx.db.get(assignment.staffId);
        const booking = await ctx.db.get(assignment.bookingId);
        let space = null;
        if (booking && booking.spaceId) {
          space = await ctx.db.get(booking.spaceId);
        }
        return {
          ...assignment,
          staff,
          booking: booking ? { ...booking, space } : null
        };
      })
    );
  },
});

// Obtener pagos realizados
export const getPaidPayments = query({
  handler: async (ctx) => {
    const assignments = await ctx.db
      .query("staffAssignments")
      .withIndex("by_payment_status", (q) => q.eq("paymentStatus", "paid"))
      .order("desc")
      .collect();
    
    return await Promise.all(
      assignments.map(async (assignment) => {
        const staff = await ctx.db.get(assignment.staffId);
        const booking = await ctx.db.get(assignment.bookingId);
        let space = null;
        if (booking && booking.spaceId) {
          space = await ctx.db.get(booking.spaceId);
        }
        return {
          ...assignment,
          staff,
          booking: booking ? { ...booking, space } : null
        };
      })
    );
  },
});

// Crear asignación de personal
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
    confirmedAttendance: v.boolean(),
  },
  handler: async (ctx, args) => {
    await ctx.db.patch(args.id, {
      confirmedAttendance: args.confirmedAttendance,
      updatedAt: Date.now(),
    });
  },
});

// Actualizar estado de pago
export const updatePaymentStatus = mutation({
  args: {
    id: v.id("staffAssignments"),
    paymentStatus: v.string(),
    paymentDate: v.optional(v.string()),
    paymentMethod: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const { id, ...updates } = args;
    await ctx.db.patch(id, {
      ...updates,
      updatedAt: Date.now(),
    });
  },
});

// Eliminar asignación
export const deleteAssignment = mutation({
  args: { id: v.id("staffAssignments") },
  handler: async (ctx, args) => {
    await ctx.db.delete(args.id);
  },
});

// Obtener resumen de pagos por rango de fechas
export const getPaymentSummary = query({
  args: {
    startDate: v.optional(v.string()),
    endDate: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const allAssignments = await ctx.db.query("staffAssignments").collect();
    
    // Filtrar por fechas si se proporcionan
    let filteredAssignments = allAssignments;
    if (args.startDate || args.endDate) {
      const bookingIds = new Set(allAssignments.map(a => a.bookingId));
      const bookings = await Promise.all(
        Array.from(bookingIds).map(id => ctx.db.get(id))
      );
      
      const validBookingIds = new Set(
        bookings
          .filter(b => {
            if (!b) return false;
            if (args.startDate && b.eventDate < args.startDate) return false;
            if (args.endDate && b.eventDate > args.endDate) return false;
            return true;
          })
          .map(b => b!._id)
      );
      
      filteredAssignments = allAssignments.filter(a => 
        validBookingIds.has(a.bookingId)
      );
    }
    
    const summary = {
      totalPending: 0,
      totalPaid: 0,
      totalCancelled: 0,
      countPending: 0,
      countPaid: 0,
      countCancelled: 0,
    };
    
    filteredAssignments.forEach(assignment => {
      if (assignment.paymentStatus === "pending") {
        summary.totalPending += assignment.amountToPay;
        summary.countPending += 1;
      } else if (assignment.paymentStatus === "paid") {
        summary.totalPaid += assignment.amountToPay;
        summary.countPaid += 1;
      } else if (assignment.paymentStatus === "cancelled") {
        summary.totalCancelled += assignment.amountToPay;
        summary.countCancelled += 1;
      }
    });
    
    return summary;
  },
});
