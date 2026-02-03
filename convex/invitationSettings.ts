import { query, mutation } from "./_generated/server";
import { v } from "convex/values";

// Get a specific setting by key
export const get = query({
  args: { key: v.string() },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("invitationSettings")
      .withIndex("by_key", (q) => q.eq("key", args.key))
      .first();
  },
});

// Get all settings
export const getAll = query({
  handler: async (ctx) => {
    return await ctx.db.query("invitationSettings").collect();
  },
});

// Set a setting value (create or update)
export const set = mutation({
  args: { key: v.string(), value: v.string() },
  handler: async (ctx, args) => {
    const existing = await ctx.db
      .query("invitationSettings")
      .withIndex("by_key", (q) => q.eq("key", args.key))
      .first();

    if (existing) {
      await ctx.db.patch(existing._id, {
        value: args.value,
        updatedAt: Date.now()
      });
      return existing._id;
    } else {
      return await ctx.db.insert("invitationSettings", {
        key: args.key,
        value: args.value,
        updatedAt: Date.now()
      });
    }
  },
});

// Get price (convenience query with default value)
export const getPrice = query({
  handler: async (ctx) => {
    const setting = await ctx.db
      .query("invitationSettings")
      .withIndex("by_key", (q) => q.eq("key", "price"))
      .first();
    return setting?.value ? parseInt(setting.value) : 15000; // Default 15.000 CLP
  },
});

// Set price (convenience mutation)
export const setPrice = mutation({
  args: { price: v.number() },
  handler: async (ctx, args) => {
    const existing = await ctx.db
      .query("invitationSettings")
      .withIndex("by_key", (q) => q.eq("key", "price"))
      .first();

    if (existing) {
      await ctx.db.patch(existing._id, {
        value: args.price.toString(),
        updatedAt: Date.now()
      });
    } else {
      await ctx.db.insert("invitationSettings", {
        key: "price",
        value: args.price.toString(),
        updatedAt: Date.now()
      });
    }
  },
});
