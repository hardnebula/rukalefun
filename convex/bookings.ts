import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

// Obtener todas las reservas
export const getAllBookings = query({
  handler: async (ctx) => {
    const bookings = await ctx.db.query("bookings").collect();
    // Enriquecer con información del espacio
    return await Promise.all(
      bookings.map(async (booking) => {
        const space = booking.spaceId ? await ctx.db.get(booking.spaceId) : null;
        return { ...booking, space };
      })
    );
  },
});

// Obtener una reserva por ID
export const getBooking = query({
  args: { id: v.id("bookings") },
  handler: async (ctx, args) => {
    const booking = await ctx.db.get(args.id);
    if (!booking) return null;

    const space = booking.spaceId ? await ctx.db.get(booking.spaceId) : null;
    return { ...booking, space };
  },
});

// Obtener reservas por rango de fechas
export const getBookingsByDateRange = query({
  args: {
    startDate: v.string(),
    endDate: v.string(),
  },
  handler: async (ctx, args) => {
    const bookings = await ctx.db
      .query("bookings")
      .filter((q) =>
        q.and(
          q.gte(q.field("eventDate"), args.startDate),
          q.lte(q.field("eventDate"), args.endDate)
        )
      )
      .collect();
    
    return await Promise.all(
      bookings.map(async (booking) => {
        const space = booking.spaceId ? await ctx.db.get(booking.spaceId) : null;
        return { ...booking, space };
      })
    );
  },
});

// Obtener reservas por espacio
export const getBookingsBySpace = query({
  args: { spaceId: v.id("spaces") },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("bookings")
      .withIndex("by_space", (q) => q.eq("spaceId", args.spaceId))
      .collect();
  },
});

// Crear una nueva reserva
export const createBooking = mutation({
  args: {
    spaceId: v.optional(v.id("spaces")),
    clientName: v.string(),
    clientEmail: v.string(),
    clientPhone: v.string(),
    eventType: v.string(),
    eventDate: v.string(),
    startTime: v.string(),
    endTime: v.string(),
    numberOfGuests: v.number(),
    estimatedGuests: v.number(),
    services: v.array(v.string()),
    specialRequests: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const now = Date.now();
    return await ctx.db.insert("bookings", {
      ...args,
      status: "pending",
      totalAmount: 0,
      depositPaid: 0,
      balanceRemaining: 0,
      createdAt: now,
      updatedAt: now,
    });
  },
});

// Actualizar estado de reserva
export const updateBookingStatus = mutation({
  args: {
    id: v.id("bookings"),
    status: v.string(),
  },
  handler: async (ctx, args) => {
    await ctx.db.patch(args.id, {
      status: args.status,
      updatedAt: Date.now(),
    });
  },
});

// Actualizar información de pago
export const updateBookingPayment = mutation({
  args: {
    id: v.id("bookings"),
    totalAmount: v.optional(v.number()),
    depositPaid: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    const { id, totalAmount, depositPaid } = args;
    const booking = await ctx.db.get(id);
    if (!booking) throw new Error("Booking not found");

    const newTotal = totalAmount ?? booking.totalAmount;
    const newDeposit = depositPaid ?? booking.depositPaid;
    const balance = newTotal - newDeposit;

    await ctx.db.patch(id, {
      totalAmount: newTotal,
      depositPaid: newDeposit,
      balanceRemaining: balance,
      updatedAt: Date.now(),
    });
  },
});

// Agregar un pago/abono al historial
export const addPayment = mutation({
  args: {
    id: v.id("bookings"),
    amount: v.number(),
    date: v.string(),
    method: v.optional(v.string()),
    notes: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const booking = await ctx.db.get(args.id);
    if (!booking) throw new Error("Reserva no encontrada");

    const currentHistory = booking.paymentHistory || [];
    const newPayment = {
      amount: args.amount,
      date: args.date,
      method: args.method,
      notes: args.notes,
    };

    const newDepositPaid = booking.depositPaid + args.amount;
    const newBalance = booking.totalAmount - newDepositPaid;

    await ctx.db.patch(args.id, {
      paymentHistory: [...currentHistory, newPayment],
      depositPaid: newDepositPaid,
      balanceRemaining: newBalance,
      updatedAt: Date.now(),
    });
  },
});

// Eliminar un pago del historial
export const removePayment = mutation({
  args: {
    id: v.id("bookings"),
    paymentIndex: v.number(),
  },
  handler: async (ctx, args) => {
    const booking = await ctx.db.get(args.id);
    if (!booking) throw new Error("Reserva no encontrada");

    const currentHistory = booking.paymentHistory || [];
    if (args.paymentIndex < 0 || args.paymentIndex >= currentHistory.length) {
      throw new Error("Índice de pago inválido");
    }

    const removedPayment = currentHistory[args.paymentIndex];
    const newHistory = currentHistory.filter((_, i) => i !== args.paymentIndex);
    const newDepositPaid = booking.depositPaid - removedPayment.amount;
    const newBalance = booking.totalAmount - newDepositPaid;

    await ctx.db.patch(args.id, {
      paymentHistory: newHistory,
      depositPaid: newDepositPaid,
      balanceRemaining: newBalance,
      updatedAt: Date.now(),
    });
  },
});

// Verificar disponibilidad (verifica la fecha, no el espacio)
export const checkAvailability = mutation({
  args: {
    eventDate: v.string(),
    startTime: v.string(),
    endTime: v.string(),
  },
  handler: async (ctx, args) => {
    const bookings = await ctx.db
      .query("bookings")
      .filter((q) =>
        q.and(
          q.eq(q.field("eventDate"), args.eventDate),
          q.neq(q.field("status"), "cancelled")
        )
      )
      .collect();

    // Verificar si hay conflicto de horarios
    const hasConflict = bookings.some((booking) => {
      return !(
        args.endTime <= booking.startTime || args.startTime >= booking.endTime
      );
    });

    return { available: !hasConflict, conflictingBookings: hasConflict ? bookings : [] };
  },
});

// Eliminar una reserva
export const deleteBooking = mutation({
  args: {
    id: v.id("bookings"),
  },
  handler: async (ctx, args) => {
    // Verificar que la reserva existe
    const booking = await ctx.db.get(args.id);
    if (!booking) {
      throw new Error("Reserva no encontrada");
    }

    // Eliminar todas las asignaciones de personal asociadas a esta reserva
    const staffAssignments = await ctx.db
      .query("staffAssignments")
      .withIndex("by_booking", (q) => q.eq("bookingId", args.id))
      .collect();

    // Eliminar cada asignación (esto también elimina los registros de pago)
    for (const assignment of staffAssignments) {
      await ctx.db.delete(assignment._id);
    }

    // Eliminar la reserva
    await ctx.db.delete(args.id);
  },
});

// Actualizar menú de la reserva
export const updateBookingMenu = mutation({
  args: {
    id: v.id("bookings"),
    menuSections: v.array(v.object({
      name: v.string(),
      items: v.array(v.object({
        category: v.string(),
        dishes: v.array(v.string()),
      })),
    })),
  },
  handler: async (ctx, args) => {
    const booking = await ctx.db.get(args.id);
    if (!booking) {
      throw new Error("Reserva no encontrada");
    }

    await ctx.db.patch(args.id, {
      menuSections: args.menuSections,
      updatedAt: Date.now(),
    });

    return args.id;
  },
});

// Convertir cotización a reserva con transferencia automática de menú
export const convertQuoteToBooking = mutation({
  args: {
    generatedQuoteId: v.id("generatedQuotes"),
    startTime: v.string(),
    endTime: v.string(),
    spaceId: v.optional(v.id("spaces")),
    specialRequests: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    // 1. Obtener la cotización generada
    const quote = await ctx.db.get(args.generatedQuoteId);
    if (!quote) {
      throw new Error("Cotización no encontrada");
    }

    // Verificar que no esté ya convertida
    if (quote.status === "converted") {
      throw new Error("Esta cotización ya fue convertida a reserva");
    }

    // 2. Crear la reserva con todos los datos de la cotización
    const bookingId = await ctx.db.insert("bookings", {
      // Vinculación a cotización original
      generatedQuoteId: args.generatedQuoteId,

      // Datos del cliente (desde cotización)
      clientName: quote.clientName,
      clientEmail: quote.clientEmail || "",
      clientPhone: quote.clientPhone || "",

      // Datos del evento (desde cotización)
      eventType: quote.eventType,
      eventDate: quote.eventDate,
      numberOfGuests: quote.numberOfGuests,
      estimatedGuests: quote.numberOfGuests,

      // Servicios (combinar incluidos y adicionales)
      services: [...quote.includedServices, ...quote.additionalServices],

      // Menú (transferencia automática desde cotización)
      menuSections: quote.menuSections,

      // Información adicional
      startTime: args.startTime,
      endTime: args.endTime,
      spaceId: args.spaceId,
      specialRequests: args.specialRequests,
      notes: `Creado desde cotización generada: ${quote.templateName}`,

      // Estado y finanzas
      status: "pending",
      totalAmount: quote.totalAmount,
      depositPaid: 0,
      balanceRemaining: quote.totalAmount,

      // Timestamps
      createdAt: Date.now(),
      updatedAt: Date.now(),
    });

    // 3. Marcar la cotización como convertida
    await ctx.db.patch(args.generatedQuoteId, {
      status: "converted",
      bookingId: bookingId,
      convertedAt: Date.now(),
      updatedAt: Date.now(),
    });

    // 4. Si existe quote request original, actualizar también
    if (quote.quoteRequestId) {
      await ctx.db.patch(quote.quoteRequestId, {
        status: "converted",
      });
    }

    return bookingId;
  },
});

// Actualizar resumen del evento (para historial)
export const updateEventSummary = mutation({
  args: {
    id: v.id("bookings"),
    eventSummary: v.string(),
  },
  handler: async (ctx, args) => {
    await ctx.db.patch(args.id, {
      eventSummary: args.eventSummary,
      updatedAt: Date.now(),
    });
  },
});
