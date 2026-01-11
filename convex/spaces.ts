import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

// Obtener todos los espacios activos
export const getAllSpaces = query({
  handler: async (ctx) => {
    return await ctx.db
      .query("spaces")
      .filter((q) => q.eq(q.field("isActive"), true))
      .collect();
  },
});

// Obtener un espacio por ID
export const getSpaceById = query({
  args: { id: v.id("spaces") },
  handler: async (ctx, args) => {
    return await ctx.db.get(args.id);
  },
});

// Crear un nuevo espacio
export const createSpace = mutation({
  args: {
    name: v.string(),
    description: v.string(),
    capacity: v.number(),
    area: v.number(),
    features: v.array(v.string()),
    images: v.array(v.string()),
    pricePerHour: v.number(),
    isActive: v.boolean(),
  },
  handler: async (ctx, args) => {
    return await ctx.db.insert("spaces", args);
  },
});

// Actualizar un espacio
export const updateSpace = mutation({
  args: {
    id: v.id("spaces"),
    name: v.optional(v.string()),
    description: v.optional(v.string()),
    capacity: v.optional(v.number()),
    area: v.optional(v.number()),
    features: v.optional(v.array(v.string())),
    images: v.optional(v.array(v.string())),
    pricePerHour: v.optional(v.number()),
    isActive: v.optional(v.boolean()),
  },
  handler: async (ctx, args) => {
    const { id, ...updates } = args;
    await ctx.db.patch(id, updates);
  },
});





