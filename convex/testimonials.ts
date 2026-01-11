import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

// Obtener testimonios públicos
export const getPublicTestimonials = query({
  handler: async (ctx) => {
    return await ctx.db
      .query("testimonials")
      .withIndex("by_public", (q) => q.eq("isPublic", true))
      .order("desc")
      .collect();
  },
});

// Obtener todos los testimonios (admin)
export const getAllTestimonials = query({
  handler: async (ctx) => {
    return await ctx.db.query("testimonials").order("desc").collect();
  },
});

// Crear testimonio
export const createTestimonial = mutation({
  args: {
    clientName: v.string(),
    eventType: v.string(),
    rating: v.number(),
    comment: v.string(),
    eventDate: v.string(),
    isPublic: v.boolean(),
  },
  handler: async (ctx, args) => {
    return await ctx.db.insert("testimonials", {
      ...args,
      createdAt: Date.now(),
    });
  },
});

// Actualizar visibilidad de testimonio
export const updateTestimonialVisibility = mutation({
  args: {
    id: v.id("testimonials"),
    isPublic: v.boolean(),
  },
  handler: async (ctx, args) => {
    await ctx.db.patch(args.id, { isPublic: args.isPublic });
  },
});





