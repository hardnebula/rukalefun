import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

// Obtener todas las solicitudes de cotización
export const getAllQuotes = query({
  handler: async (ctx) => {
    return await ctx.db.query("quoteRequests").order("desc").collect();
  },
});

// Obtener cotizaciones por estado
export const getQuotesByStatus = query({
  args: { status: v.string() },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("quoteRequests")
      .withIndex("by_status", (q) => q.eq("status", args.status))
      .collect();
  },
});

// Crear solicitud de cotización
export const createQuoteRequest = mutation({
  args: {
    name: v.string(),
    email: v.string(),
    phone: v.string(),
    eventType: v.string(),
    eventDate: v.optional(v.string()),
    numberOfGuests: v.number(),
    message: v.optional(v.string()),
    source: v.optional(v.string()), // "web" | "whatsapp"
  },
  handler: async (ctx, args) => {
    return await ctx.db.insert("quoteRequests", {
      ...args,
      source: args.source || "web",
      status: "new",
      createdAt: Date.now(),
    });
  },
});

// Actualizar estado de cotización
export const updateQuoteStatus = mutation({
  args: {
    id: v.id("quoteRequests"),
    status: v.string(),
  },
  handler: async (ctx, args) => {
    await ctx.db.patch(args.id, { status: args.status });
  },
});

// Eliminar cotización
export const deleteQuote = mutation({
  args: {
    id: v.id("quoteRequests"),
  },
  handler: async (ctx, args) => {
    await ctx.db.delete(args.id);
  },
});

