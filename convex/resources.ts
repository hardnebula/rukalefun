import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

// Obtener todos los recursos
export const getAllResources = query({
  handler: async (ctx) => {
    return await ctx.db.query("resources").collect();
  },
});

// Obtener recursos por tipo
export const getResourcesByType = query({
  args: { type: v.string() },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("resources")
      .filter((q) => q.eq(q.field("type"), args.type))
      .collect();
  },
});

// Crear recurso
export const createResource = mutation({
  args: {
    name: v.string(),
    type: v.string(),
    quantity: v.number(),
    available: v.number(),
    pricePerUnit: v.optional(v.number()),
    description: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    return await ctx.db.insert("resources", args);
  },
});

// Actualizar recurso
export const updateResource = mutation({
  args: {
    id: v.id("resources"),
    name: v.optional(v.string()),
    type: v.optional(v.string()),
    quantity: v.optional(v.number()),
    available: v.optional(v.number()),
    pricePerUnit: v.optional(v.number()),
    description: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const { id, ...updates } = args;
    await ctx.db.patch(id, updates);
  },
});

// Eliminar recurso
export const deleteResource = mutation({
  args: { id: v.id("resources") },
  handler: async (ctx, args) => {
    await ctx.db.delete(args.id);
  },
});





