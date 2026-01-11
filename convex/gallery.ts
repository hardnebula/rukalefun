import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

// Obtener todas las imágenes públicas de la galería
export const getPublicGallery = query({
  handler: async (ctx) => {
    return await ctx.db
      .query("gallery")
      .withIndex("by_public", (q) => q.eq("isPublic", true))
      .order("desc")
      .collect();
  },
});

// Obtener imágenes por categoría
export const getGalleryByCategory = query({
  args: { category: v.string() },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("gallery")
      .withIndex("by_category", (q) => q.eq("category", args.category))
      .filter((q) => q.eq(q.field("isPublic"), true))
      .collect();
  },
});

// Obtener todas las imágenes (admin)
export const getAllGalleryItems = query({
  handler: async (ctx) => {
    return await ctx.db.query("gallery").collect();
  },
});

// Agregar imagen a la galería
export const addGalleryItem = mutation({
  args: {
    title: v.string(),
    imageUrl: v.string(),
    thumbnailUrl: v.optional(v.string()),
    category: v.string(),
    eventDate: v.optional(v.string()),
    isPublic: v.boolean(),
    order: v.number(),
  },
  handler: async (ctx, args) => {
    return await ctx.db.insert("gallery", args);
  },
});

// Actualizar imagen de la galería
export const updateGalleryItem = mutation({
  args: {
    id: v.id("gallery"),
    title: v.optional(v.string()),
    category: v.optional(v.string()),
    isPublic: v.optional(v.boolean()),
    order: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    const { id, ...updates } = args;
    await ctx.db.patch(id, updates);
  },
});

// Eliminar imagen de la galería
export const deleteGalleryItem = mutation({
  args: { id: v.id("gallery") },
  handler: async (ctx, args) => {
    await ctx.db.delete(args.id);
  },
});





