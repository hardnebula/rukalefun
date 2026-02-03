import { query, mutation } from "./_generated/server";
import { v } from "convex/values";

// Obtener inventario público por código de acceso (para clientes)
export const getPublicByAccessCode = query({
  args: { accessCode: v.string() },
  handler: async (ctx, args) => {
    // Buscar la reserva por código de acceso
    const booking = await ctx.db
      .query("bookings")
      .withIndex("by_guest_access_code", (q) => q.eq("guestAccessCode", args.accessCode))
      .first();

    if (!booking) {
      return null;
    }

    // Obtener el inventario de tragos
    const drinks = await ctx.db
      .query("drinkInventory")
      .withIndex("by_booking", (q) => q.eq("bookingId", booking._id))
      .collect();

    // Calcular resumen
    let totalIn = 0;
    let totalConsumed = 0;
    let totalReturned = 0;

    drinks.forEach((item) => {
      totalIn += item.quantityIn;
      totalConsumed += item.quantityConsumed || 0;
      totalReturned += item.quantityReturned || 0;
    });

    return {
      booking: {
        clientName: booking.clientName,
        eventType: booking.eventType,
        eventDate: booking.eventDate,
      },
      drinks: drinks.map((d) => ({
        drinkType: d.drinkType,
        brand: d.brand,
        quantityIn: d.quantityIn,
        quantityConsumed: d.quantityConsumed,
        quantityReturned: d.quantityReturned,
        status: d.status,
      })),
      summary: {
        totalIn,
        totalConsumed,
        totalReturned,
        pending: totalIn - totalConsumed - totalReturned,
      },
    };
  },
});

// Obtener todos los tragos de una reserva
export const getByBooking = query({
  args: { bookingId: v.id("bookings") },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("drinkInventory")
      .withIndex("by_booking", (q) => q.eq("bookingId", args.bookingId))
      .collect();
  },
});

// Obtener resumen/totales de una reserva
export const getSummary = query({
  args: { bookingId: v.id("bookings") },
  handler: async (ctx, args) => {
    const items = await ctx.db
      .query("drinkInventory")
      .withIndex("by_booking", (q) => q.eq("bookingId", args.bookingId))
      .collect();

    let totalIn = 0;
    let totalConsumed = 0;
    let totalReturned = 0;
    const byType: Record<string, { count: number; totalIn: number; totalConsumed: number; totalReturned: number }> = {};

    items.forEach((item) => {
      const consumed = item.quantityConsumed || 0;
      const returned = item.quantityReturned || 0;

      totalIn += item.quantityIn;
      totalConsumed += consumed;
      totalReturned += returned;

      if (!byType[item.drinkType]) {
        byType[item.drinkType] = { count: 0, totalIn: 0, totalConsumed: 0, totalReturned: 0 };
      }
      byType[item.drinkType].count += 1;
      byType[item.drinkType].totalIn += item.quantityIn;
      byType[item.drinkType].totalConsumed += consumed;
      byType[item.drinkType].totalReturned += returned;
    });

    return {
      totalIn,
      totalConsumed,
      totalReturned,
      pending: totalIn - totalConsumed - totalReturned,
      itemCount: items.length,
      completedCount: items.filter((i) => i.status === "completed").length,
      byType: Object.entries(byType).map(([type, data]) => ({ type, ...data })),
    };
  },
});

// Crear nuevo item de inventario (entrada)
export const create = mutation({
  args: {
    bookingId: v.id("bookings"),
    drinkType: v.string(),
    brand: v.string(),
    quantityIn: v.number(),
    entryNotes: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const now = Date.now();
    return await ctx.db.insert("drinkInventory", {
      bookingId: args.bookingId,
      drinkType: args.drinkType,
      brand: args.brand,
      quantityIn: args.quantityIn,
      entryNotes: args.entryNotes,
      status: "pending_arrival",
      createdAt: now,
      updatedAt: now,
    });
  },
});

// Marcar como recibido
export const markAsReceived = mutation({
  args: {
    id: v.id("drinkInventory"),
    quantityIn: v.optional(v.number()),
    entryNotes: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const updates: Record<string, unknown> = {
      status: "received",
      updatedAt: Date.now(),
    };
    if (args.quantityIn !== undefined) {
      updates.quantityIn = args.quantityIn;
    }
    if (args.entryNotes !== undefined) {
      updates.entryNotes = args.entryNotes;
    }
    await ctx.db.patch(args.id, updates);
  },
});

// Registrar salida (consumo y devolución)
export const updateExitCount = mutation({
  args: {
    id: v.id("drinkInventory"),
    quantityConsumed: v.number(),
    quantityReturned: v.number(),
    exitNotes: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const item = await ctx.db.get(args.id);
    if (!item) {
      throw new Error("Item no encontrado");
    }

    // Validar que consumidas + devueltas no excedan la entrada
    if (args.quantityConsumed + args.quantityReturned > item.quantityIn) {
      throw new Error("La suma de consumidas y devueltas no puede superar la cantidad de entrada");
    }

    await ctx.db.patch(args.id, {
      quantityConsumed: args.quantityConsumed,
      quantityReturned: args.quantityReturned,
      exitNotes: args.exitNotes,
      status: "completed",
      updatedAt: Date.now(),
    });
  },
});

// Actualizar item
export const update = mutation({
  args: {
    id: v.id("drinkInventory"),
    drinkType: v.optional(v.string()),
    brand: v.optional(v.string()),
    quantityIn: v.optional(v.number()),
    entryNotes: v.optional(v.string()),
    status: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const { id, ...updates } = args;
    const filteredUpdates: Record<string, unknown> = { updatedAt: Date.now() };

    if (updates.drinkType !== undefined) filteredUpdates.drinkType = updates.drinkType;
    if (updates.brand !== undefined) filteredUpdates.brand = updates.brand;
    if (updates.quantityIn !== undefined) filteredUpdates.quantityIn = updates.quantityIn;
    if (updates.entryNotes !== undefined) filteredUpdates.entryNotes = updates.entryNotes;
    if (updates.status !== undefined) filteredUpdates.status = updates.status;

    await ctx.db.patch(id, filteredUpdates);
  },
});

// Eliminar item
export const remove = mutation({
  args: { id: v.id("drinkInventory") },
  handler: async (ctx, args) => {
    await ctx.db.delete(args.id);
  },
});

// Marcar todos como recibidos para una reserva
export const markAllAsReceived = mutation({
  args: { bookingId: v.id("bookings") },
  handler: async (ctx, args) => {
    const items = await ctx.db
      .query("drinkInventory")
      .withIndex("by_booking", (q) => q.eq("bookingId", args.bookingId))
      .collect();

    const pendingItems = items.filter((item) => item.status === "pending_arrival");
    const now = Date.now();

    for (const item of pendingItems) {
      await ctx.db.patch(item._id, {
        status: "received",
        updatedAt: now,
      });
    }

    return { updated: pendingItems.length };
  },
});
