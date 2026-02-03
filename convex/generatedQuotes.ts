import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

// Crear una cotización generada
export const createGeneratedQuote = mutation({
  args: {
    quoteRequestId: v.optional(v.id("quoteRequests")),
    templateId: v.id("quoteTemplates"),
    clientName: v.string(),
    clientEmail: v.optional(v.string()),
    clientPhone: v.optional(v.string()),
    eventDate: v.string(),
    eventType: v.string(),
    numberOfGuests: v.number(),
    templateName: v.string(),
    includedServices: v.array(v.string()),
    additionalServices: v.array(v.string()),
    menuSections: v.array(v.object({
      name: v.string(),
      items: v.array(v.object({
        category: v.string(),
        dishes: v.array(v.string()),
      })),
    })),
    pricePerPerson: v.number(),
    minimumGuests: v.number(),
    totalAmount: v.number(),
    currency: v.string(),
    generatedBy: v.optional(v.string()),
    notes: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const now = Date.now();
    const twoWeeksInMs = 14 * 24 * 60 * 60 * 1000; // 2 semanas en milisegundos
    const expiresAt = now + twoWeeksInMs;

    const quoteId = await ctx.db.insert("generatedQuotes", {
      quoteRequestId: args.quoteRequestId,
      templateId: args.templateId,
      clientName: args.clientName,
      clientEmail: args.clientEmail,
      clientPhone: args.clientPhone,
      eventDate: args.eventDate,
      eventType: args.eventType,
      numberOfGuests: args.numberOfGuests,
      templateName: args.templateName,
      includedServices: args.includedServices,
      additionalServices: args.additionalServices,
      menuSections: args.menuSections,
      pricePerPerson: args.pricePerPerson,
      minimumGuests: args.minimumGuests,
      totalAmount: args.totalAmount,
      currency: args.currency,
      status: "pending",
      expiresAt: expiresAt, // Expira en 2 semanas
      generatedBy: args.generatedBy,
      notes: args.notes,
      createdAt: now,
      updatedAt: now,
    });

    // Si hay un quoteRequestId, actualizar el estado de la solicitud a "quoted"
    if (args.quoteRequestId) {
      await ctx.db.patch(args.quoteRequestId, {
        status: "quoted",
      });
    }

    return quoteId;
  },
});

// Obtener todas las cotizaciones generadas (incluye días restantes para expirar)
export const getAllGeneratedQuotes = query({
  handler: async (ctx) => {
    const quotes = await ctx.db.query("generatedQuotes").order("desc").collect();
    const now = Date.now();

    // Agregar información de expiración a cada cotización
    return quotes.map(quote => {
      let daysUntilExpiry = null;
      let isExpired = false;

      if (quote.expiresAt && quote.status === "pending") {
        const msUntilExpiry = quote.expiresAt - now;
        daysUntilExpiry = Math.ceil(msUntilExpiry / (24 * 60 * 60 * 1000));
        isExpired = msUntilExpiry <= 0;
      }

      return {
        ...quote,
        daysUntilExpiry,
        isExpired: isExpired && quote.status === "pending",
      };
    });
  },
});

// Marcar cotizaciones expiradas (llamar periódicamente o al cargar)
export const markExpiredQuotes = mutation({
  handler: async (ctx) => {
    const now = Date.now();
    const pendingQuotes = await ctx.db
      .query("generatedQuotes")
      .withIndex("by_status", (q) => q.eq("status", "pending"))
      .collect();

    let expiredCount = 0;
    for (const quote of pendingQuotes) {
      if (quote.expiresAt && quote.expiresAt <= now) {
        await ctx.db.patch(quote._id, {
          status: "expired",
          updatedAt: now,
        });
        expiredCount++;
      }
    }

    return { expiredCount };
  },
});

// Obtener una cotización por ID
export const getGeneratedQuote = query({
  args: { id: v.id("generatedQuotes") },
  handler: async (ctx, args) => {
    return await ctx.db.get(args.id);
  },
});

// Obtener cotizaciones con filtros
export const getFilteredQuotes = query({
  args: {
    status: v.optional(v.string()),
    startDate: v.optional(v.string()),
    endDate: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    let quotes;

    if (args.status && args.status !== "all") {
      const status = args.status; // TypeScript narrowing
      quotes = await ctx.db
        .query("generatedQuotes")
        .withIndex("by_status", (q) => q.eq("status", status))
        .order("desc")
        .collect();
    } else {
      quotes = await ctx.db.query("generatedQuotes").order("desc").collect();
    }

    // Filtrar por rango de fechas si se proporciona
    if (args.startDate || args.endDate) {
      return quotes.filter((quote) => {
        if (args.startDate && quote.eventDate < args.startDate) return false;
        if (args.endDate && quote.eventDate > args.endDate) return false;
        return true;
      });
    }

    return quotes;
  },
});

// Obtener estadísticas de conversión
export const getConversionStats = query({
  handler: async (ctx) => {
    const allQuotes = await ctx.db.query("generatedQuotes").collect();

    const total = allQuotes.length;
    const converted = allQuotes.filter(q => q.status === "converted").length;
    const pending = allQuotes.filter(q => q.status === "pending").length;
    const declined = allQuotes.filter(q => q.status === "declined").length;
    const expired = allQuotes.filter(q => q.status === "expired").length;

    const conversionRate = total > 0 ? ((converted / total) * 100).toFixed(2) : "0.00";

    // Calcular ingresos totales de cotizaciones convertidas
    const totalRevenue = allQuotes
      .filter(q => q.status === "converted")
      .reduce((sum, q) => sum + q.totalAmount, 0);

    // Calcular ingresos potenciales (pending)
    const potentialRevenue = allQuotes
      .filter(q => q.status === "pending")
      .reduce((sum, q) => sum + q.totalAmount, 0);

    return {
      total,
      converted,
      pending,
      declined,
      expired,
      conversionRate: parseFloat(conversionRate),
      totalRevenue,
      potentialRevenue,
    };
  },
});

// Marcar cotización como convertida a reserva
export const markAsConverted = mutation({
  args: {
    quoteId: v.id("generatedQuotes"),
    bookingId: v.id("bookings"),
  },
  handler: async (ctx, args) => {
    await ctx.db.patch(args.quoteId, {
      status: "converted",
      bookingId: args.bookingId,
      convertedAt: Date.now(),
      updatedAt: Date.now(),
    });

    // Actualizar también la solicitud original si existe
    const quote = await ctx.db.get(args.quoteId);
    if (quote?.quoteRequestId) {
      await ctx.db.patch(quote.quoteRequestId, {
        status: "converted",
      });
    }
  },
});

// Actualizar estado de cotización
export const updateQuoteStatus = mutation({
  args: {
    quoteId: v.id("generatedQuotes"),
    status: v.string(),
    notes: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const updates: any = {
      status: args.status,
      updatedAt: Date.now(),
    };

    if (args.notes !== undefined) {
      updates.notes = args.notes;
    }

    await ctx.db.patch(args.quoteId, updates);

    // Actualizar también la solicitud original si existe
    const quote = await ctx.db.get(args.quoteId);
    if (quote?.quoteRequestId) {
      await ctx.db.patch(quote.quoteRequestId, {
        status: args.status === "converted" ? "converted" : "quoted",
      });
    }
  },
});

// Eliminar cotización
export const deleteGeneratedQuote = mutation({
  args: {
    quoteId: v.id("generatedQuotes"),
  },
  handler: async (ctx, args) => {
    await ctx.db.delete(args.quoteId);
  },
});

// Obtener cotizaciones por cliente
export const getQuotesByClient = query({
  args: {
    clientEmail: v.string(),
  },
  handler: async (ctx, args) => {
    const quotes = await ctx.db
      .query("generatedQuotes")
      .withIndex("by_client_email", (q) => q.eq("clientEmail", args.clientEmail))
      .collect();
    return quotes;
  },
});
