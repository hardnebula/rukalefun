import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

// Obtener todas las plantillas
export const getAllTemplates = query({
  handler: async (ctx) => {
    return await ctx.db.query("quoteTemplates").collect();
  },
});

// Obtener plantillas activas
export const getActiveTemplates = query({
  handler: async (ctx) => {
    return await ctx.db
      .query("quoteTemplates")
      .withIndex("by_active", (q) => q.eq("isActive", true))
      .collect();
  },
});

// Obtener plantilla por ID
export const getTemplateById = query({
  args: { id: v.id("quoteTemplates") },
  handler: async (ctx, args) => {
    return await ctx.db.get(args.id);
  },
});

// Obtener plantillas por tipo de evento
export const getTemplatesByEventType = query({
  args: { eventType: v.string() },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("quoteTemplates")
      .withIndex("by_event_type", (q) => q.eq("eventType", args.eventType))
      .collect();
  },
});

// Crear plantilla
export const createTemplate = mutation({
  args: {
    name: v.string(),
    eventType: v.string(),
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
    currency: v.string(),
    terms: v.string(),
    signatureName: v.string(),
    signatureTitle: v.string(),
    signatureLocation: v.string(),
  },
  handler: async (ctx, args) => {
    const now = Date.now();
    return await ctx.db.insert("quoteTemplates", {
      ...args,
      isActive: true,
      createdAt: now,
      updatedAt: now,
    });
  },
});

// Actualizar plantilla
export const updateTemplate = mutation({
  args: {
    id: v.id("quoteTemplates"),
    name: v.optional(v.string()),
    eventType: v.optional(v.string()),
    isActive: v.optional(v.boolean()),
    includedServices: v.optional(v.array(v.string())),
    additionalServices: v.optional(v.array(v.string())),
    menuSections: v.optional(v.array(v.object({
      name: v.string(),
      items: v.array(v.object({
        category: v.string(),
        dishes: v.array(v.string()),
      })),
    }))),
    pricePerPerson: v.optional(v.number()),
    minimumGuests: v.optional(v.number()),
    currency: v.optional(v.string()),
    terms: v.optional(v.string()),
    signatureName: v.optional(v.string()),
    signatureTitle: v.optional(v.string()),
    signatureLocation: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const { id, ...updates } = args;
    await ctx.db.patch(id, {
      ...updates,
      updatedAt: Date.now(),
    });
  },
});

// Eliminar plantilla
export const deleteTemplate = mutation({
  args: { id: v.id("quoteTemplates") },
  handler: async (ctx, args) => {
    await ctx.db.delete(args.id);
  },
});

// Toggle activo/inactivo
export const toggleActive = mutation({
  args: { id: v.id("quoteTemplates") },
  handler: async (ctx, args) => {
    const template = await ctx.db.get(args.id);
    if (!template) throw new Error("Plantilla no encontrada");

    await ctx.db.patch(args.id, {
      isActive: !template.isActive,
      updatedAt: Date.now(),
    });
  },
});
