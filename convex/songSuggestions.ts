import { query, mutation } from "./_generated/server";
import { v } from "convex/values";

// Submit a song suggestion (public - for guests)
export const submitSuggestion = mutation({
  args: {
    invitationId: v.id("weddingInvitations"),
    guestName: v.string(),
    songTitle: v.string(),
    artist: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const invitation = await ctx.db.get(args.invitationId);
    if (!invitation || !invitation.isActive) {
      throw new Error("Invitación no encontrada");
    }

    const id = await ctx.db.insert("songSuggestions", {
      invitationId: args.invitationId,
      guestName: args.guestName,
      songTitle: args.songTitle,
      artist: args.artist,
      createdAt: Date.now(),
    });

    return id;
  },
});

// Get all song suggestions for an invitation (for couples/admin)
export const getByInvitation = query({
  args: { invitationId: v.id("weddingInvitations") },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("songSuggestions")
      .withIndex("by_invitation", (q) => q.eq("invitationId", args.invitationId))
      .order("desc")
      .collect();
  },
});

// Get song suggestions count for an invitation
export const getCountByInvitation = query({
  args: { invitationId: v.id("weddingInvitations") },
  handler: async (ctx, args) => {
    const suggestions = await ctx.db
      .query("songSuggestions")
      .withIndex("by_invitation", (q) => q.eq("invitationId", args.invitationId))
      .collect();
    return suggestions.length;
  },
});

// Delete a song suggestion (admin/couple)
export const remove = mutation({
  args: { id: v.id("songSuggestions") },
  handler: async (ctx, args) => {
    await ctx.db.delete(args.id);
  },
});
