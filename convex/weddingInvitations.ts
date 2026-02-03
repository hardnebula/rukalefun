import { query, mutation } from "./_generated/server";
import { v } from "convex/values";

// ============================================
// PUBLIC QUERIES/MUTATIONS (for guests)
// ============================================

// Get invitation by slug (public view)
export const getBySlug = query({
  args: { slug: v.string() },
  handler: async (ctx, args) => {
    const invitation = await ctx.db
      .query("weddingInvitations")
      .withIndex("by_slug", (q) => q.eq("slug", args.slug))
      .first();

    if (!invitation || !invitation.isPublished || !invitation.isActive) {
      return null;
    }

    // Get photo URLs
    const photosWithUrls = await Promise.all(
      invitation.photos.map(async (photo) => ({
        ...photo,
        url: await ctx.storage.getUrl(photo.storageId),
      }))
    );

    return {
      ...invitation,
      photos: photosWithUrls,
    };
  },
});

// Increment view count
export const incrementViewCount = mutation({
  args: { slug: v.string() },
  handler: async (ctx, args) => {
    const invitation = await ctx.db
      .query("weddingInvitations")
      .withIndex("by_slug", (q) => q.eq("slug", args.slug))
      .first();

    if (invitation) {
      await ctx.db.patch(invitation._id, {
        viewCount: invitation.viewCount + 1,
      });
    }
  },
});

// Submit RSVP
export const submitRsvp = mutation({
  args: {
    invitationId: v.id("weddingInvitations"),
    guestName: v.string(),
    guestEmail: v.optional(v.string()),
    guestPhone: v.optional(v.string()),
    numberOfGuests: v.number(),
    additionalGuests: v.optional(v.array(v.string())),
    willAttend: v.boolean(),
    dietaryRestrictions: v.optional(v.string()),
    message: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const invitation = await ctx.db.get(args.invitationId);
    if (!invitation || !invitation.rsvpEnabled) {
      throw new Error("RSVP not available for this invitation");
    }

    // Check deadline
    if (invitation.rsvpDeadline) {
      const deadline = new Date(invitation.rsvpDeadline);
      if (new Date() > deadline) {
        throw new Error("RSVP deadline has passed");
      }
    }

    // Filter out empty additional guest names
    const additionalGuests = args.additionalGuests?.filter(name => name.trim() !== "") || [];

    const rsvpId = await ctx.db.insert("weddingRsvps", {
      invitationId: args.invitationId,
      guestName: args.guestName,
      guestEmail: args.guestEmail,
      guestPhone: args.guestPhone,
      numberOfGuests: args.numberOfGuests,
      additionalGuests: additionalGuests.length > 0 ? additionalGuests : undefined,
      willAttend: args.willAttend,
      dietaryRestrictions: args.dietaryRestrictions,
      message: args.message,
      createdAt: Date.now(),
    });

    return rsvpId;
  },
});

// ============================================
// COUPLE QUERIES/MUTATIONS (with accessCode)
// ============================================

// Check if email has active booking (for free access)
export const checkEmailHasBooking = query({
  args: { email: v.string() },
  handler: async (ctx, args) => {
    const email = args.email.toLowerCase();

    // Check for confirmed booking with this email
    const booking = await ctx.db
      .query("bookings")
      .filter((q) =>
        q.and(
          q.eq(q.field("clientEmail"), email),
          q.eq(q.field("status"), "confirmed")
        )
      )
      .first();

    return {
      hasBooking: !!booking,
      bookingId: booking?._id,
      clientName: booking?.clientName
    };
  },
});

// Verify access (email + code)
export const verifyAccess = query({
  args: {
    email: v.string(),
    accessCode: v.string(),
  },
  handler: async (ctx, args) => {
    const invitation = await ctx.db
      .query("weddingInvitations")
      .withIndex("by_access_code", (q) => q.eq("accessCode", args.accessCode))
      .first();

    if (!invitation) {
      return { valid: false, invitation: null, error: "not_found" };
    }

    if (invitation.ownerEmail.toLowerCase() !== args.email.toLowerCase()) {
      return { valid: false, invitation: null, error: "invalid_credentials" };
    }

    // Get photo URLs
    const photosWithUrls = await Promise.all(
      invitation.photos.map(async (photo) => ({
        ...photo,
        url: await ctx.storage.getUrl(photo.storageId),
      }))
    );

    return {
      valid: true,
      invitation: {
        ...invitation,
        photos: photosWithUrls,
      },
      error: null,
    };
  },
});

// Get invitation for editing (requires valid access)
export const getByAccessCode = query({
  args: { accessCode: v.string() },
  handler: async (ctx, args) => {
    const invitation = await ctx.db
      .query("weddingInvitations")
      .withIndex("by_access_code", (q) => q.eq("accessCode", args.accessCode))
      .first();

    if (!invitation) {
      return null;
    }

    // Get photo URLs
    const photosWithUrls = await Promise.all(
      invitation.photos.map(async (photo) => ({
        ...photo,
        url: await ctx.storage.getUrl(photo.storageId),
      }))
    );

    // Get RSVPs
    const rsvps = await ctx.db
      .query("weddingRsvps")
      .withIndex("by_invitation", (q) => q.eq("invitationId", invitation._id))
      .collect();

    return {
      ...invitation,
      photos: photosWithUrls,
      rsvps,
    };
  },
});

// Update invitation (couple editing)
export const updateInvitation = mutation({
  args: {
    accessCode: v.string(),
    ownerEmail: v.string(),
    // Updatable fields
    person1Name: v.optional(v.string()),
    person2Name: v.optional(v.string()),
    welcomeText: v.optional(v.string()),
    loveQuote: v.optional(v.string()),
    loveQuoteAuthor: v.optional(v.string()),
    ceremonyDate: v.optional(v.string()),
    ceremonyTime: v.optional(v.string()),
    ceremonyLocation: v.optional(v.string()),
    ceremonyAddress: v.optional(v.string()),
    ceremonyMapsUrl: v.optional(v.string()),
    celebrationDate: v.optional(v.string()),
    celebrationTime: v.optional(v.string()),
    celebrationLocation: v.optional(v.string()),
    celebrationAddress: v.optional(v.string()),
    celebrationMapsUrl: v.optional(v.string()),
    dressCode: v.optional(v.string()),
    dressCodeDescription: v.optional(v.string()),
    additionalNotes: v.optional(v.string()),
    rsvpDeadline: v.optional(v.string()),
    rsvpMessage: v.optional(v.string()),
    giftRegistryEnabled: v.optional(v.boolean()),
    giftRegistryTitle: v.optional(v.string()),
    giftRegistryMessage: v.optional(v.string()),
    giftRegistryLinks: v.optional(v.array(v.object({
      name: v.string(),
      url: v.optional(v.string()),
      description: v.optional(v.string()),
    }))),
    templateId: v.optional(v.string()),
    customColors: v.optional(v.object({
      primary: v.string(),
      secondary: v.string(),
      background: v.string(),
      text: v.string(),
    })),
  },
  handler: async (ctx, args) => {
    const invitation = await ctx.db
      .query("weddingInvitations")
      .withIndex("by_access_code", (q) => q.eq("accessCode", args.accessCode))
      .first();

    if (!invitation) {
      throw new Error("Invitation not found");
    }

    if (invitation.ownerEmail.toLowerCase() !== args.ownerEmail.toLowerCase()) {
      throw new Error("Unauthorized");
    }

    const { accessCode, ownerEmail, ...updates } = args;

    // Filter out undefined values
    const filteredUpdates: Record<string, unknown> = {};
    for (const [key, value] of Object.entries(updates)) {
      if (value !== undefined) {
        filteredUpdates[key] = value;
      }
    }

    await ctx.db.patch(invitation._id, {
      ...filteredUpdates,
      updatedAt: Date.now(),
    });

    return invitation._id;
  },
});

// Publish invitation
export const publishInvitation = mutation({
  args: {
    accessCode: v.string(),
    ownerEmail: v.string(),
  },
  handler: async (ctx, args) => {
    const invitation = await ctx.db
      .query("weddingInvitations")
      .withIndex("by_access_code", (q) => q.eq("accessCode", args.accessCode))
      .first();

    if (!invitation) {
      throw new Error("Invitation not found");
    }

    if (invitation.ownerEmail.toLowerCase() !== args.ownerEmail.toLowerCase()) {
      throw new Error("Unauthorized");
    }

    await ctx.db.patch(invitation._id, {
      isPublished: true,
      updatedAt: Date.now(),
    });

    return invitation.slug;
  },
});

// Unpublish invitation
export const unpublishInvitation = mutation({
  args: {
    accessCode: v.string(),
    ownerEmail: v.string(),
  },
  handler: async (ctx, args) => {
    const invitation = await ctx.db
      .query("weddingInvitations")
      .withIndex("by_access_code", (q) => q.eq("accessCode", args.accessCode))
      .first();

    if (!invitation) {
      throw new Error("Invitation not found");
    }

    if (invitation.ownerEmail.toLowerCase() !== args.ownerEmail.toLowerCase()) {
      throw new Error("Unauthorized");
    }

    await ctx.db.patch(invitation._id, {
      isPublished: false,
      updatedAt: Date.now(),
    });
  },
});

// Update photos order
export const updatePhotosOrder = mutation({
  args: {
    accessCode: v.string(),
    ownerEmail: v.string(),
    photos: v.array(v.object({
      storageId: v.id("_storage"),
      caption: v.optional(v.string()),
      order: v.number(),
    })),
  },
  handler: async (ctx, args) => {
    const invitation = await ctx.db
      .query("weddingInvitations")
      .withIndex("by_access_code", (q) => q.eq("accessCode", args.accessCode))
      .first();

    if (!invitation) {
      throw new Error("Invitation not found");
    }

    if (invitation.ownerEmail.toLowerCase() !== args.ownerEmail.toLowerCase()) {
      throw new Error("Unauthorized");
    }

    await ctx.db.patch(invitation._id, {
      photos: args.photos,
      updatedAt: Date.now(),
    });
  },
});

// Add photo
export const addPhoto = mutation({
  args: {
    accessCode: v.string(),
    ownerEmail: v.string(),
    storageId: v.id("_storage"),
    caption: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const invitation = await ctx.db
      .query("weddingInvitations")
      .withIndex("by_access_code", (q) => q.eq("accessCode", args.accessCode))
      .first();

    if (!invitation) {
      throw new Error("Invitation not found");
    }

    if (invitation.ownerEmail.toLowerCase() !== args.ownerEmail.toLowerCase()) {
      throw new Error("Unauthorized");
    }

    if (invitation.photos.length >= 6) {
      throw new Error("Maximum 6 photos allowed");
    }

    const newPhoto = {
      storageId: args.storageId,
      caption: args.caption,
      order: invitation.photos.length,
    };

    await ctx.db.patch(invitation._id, {
      photos: [...invitation.photos, newPhoto],
      updatedAt: Date.now(),
    });
  },
});

// Remove photo
export const removePhoto = mutation({
  args: {
    accessCode: v.string(),
    ownerEmail: v.string(),
    storageId: v.id("_storage"),
  },
  handler: async (ctx, args) => {
    const invitation = await ctx.db
      .query("weddingInvitations")
      .withIndex("by_access_code", (q) => q.eq("accessCode", args.accessCode))
      .first();

    if (!invitation) {
      throw new Error("Invitation not found");
    }

    if (invitation.ownerEmail.toLowerCase() !== args.ownerEmail.toLowerCase()) {
      throw new Error("Unauthorized");
    }

    // Delete from storage
    await ctx.storage.delete(args.storageId);

    // Update photos array
    const updatedPhotos = invitation.photos
      .filter((p) => p.storageId !== args.storageId)
      .map((p, index) => ({ ...p, order: index }));

    await ctx.db.patch(invitation._id, {
      photos: updatedPhotos,
      updatedAt: Date.now(),
    });
  },
});

// ============================================
// ADMIN QUERIES/MUTATIONS
// ============================================

// Get all invitations
export const getAll = query({
  handler: async (ctx) => {
    const invitations = await ctx.db.query("weddingInvitations").collect();

    // Get RSVP counts and booking info for each
    const enriched = await Promise.all(
      invitations.map(async (inv) => {
        const rsvps = await ctx.db
          .query("weddingRsvps")
          .withIndex("by_invitation", (q) => q.eq("invitationId", inv._id))
          .collect();

        const booking = inv.bookingId ? await ctx.db.get(inv.bookingId) : null;

        const confirmedGuests = rsvps
          .filter((r) => r.willAttend)
          .reduce((sum, r) => sum + r.numberOfGuests, 0);

        return {
          ...inv,
          rsvpCount: rsvps.length,
          confirmedGuests,
          declinedGuests: rsvps.filter((r) => !r.willAttend).length,
          booking,
        };
      })
    );

    return enriched;
  },
});

// Get single invitation with full details (admin)
export const getById = query({
  args: { id: v.id("weddingInvitations") },
  handler: async (ctx, args) => {
    const invitation = await ctx.db.get(args.id);
    if (!invitation) return null;

    // Get photo URLs
    const photosWithUrls = await Promise.all(
      invitation.photos.map(async (photo) => ({
        ...photo,
        url: await ctx.storage.getUrl(photo.storageId),
      }))
    );

    // Get RSVPs
    const rsvps = await ctx.db
      .query("weddingRsvps")
      .withIndex("by_invitation", (q) => q.eq("invitationId", invitation._id))
      .collect();

    // Get booking if linked
    const booking = invitation.bookingId
      ? await ctx.db.get(invitation.bookingId)
      : null;

    return {
      ...invitation,
      photos: photosWithUrls,
      rsvps,
      booking,
    };
  },
});

// Generate unique access code
function generateAccessCode(): string {
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789"; // Exclude confusing chars
  let code = "";
  for (let i = 0; i < 6; i++) {
    code += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return code;
}

// Generate slug from names
function generateSlug(name1: string, name2: string): string {
  const normalize = (str: string) =>
    str
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/[^a-z0-9]/g, "");

  const year = new Date().getFullYear();
  return `${normalize(name1)}-${normalize(name2)}-${year}`;
}

// Create new invitation (admin) - automatically paid/free
export const create = mutation({
  args: {
    person1Name: v.string(),
    person2Name: v.string(),
    ownerEmail: v.string(),
    eventDate: v.string(),
    ceremonyDate: v.string(),
    ceremonyTime: v.string(),
    ceremonyLocation: v.string(),
    ceremonyAddress: v.string(),
    celebrationLocation: v.string(),
    celebrationAddress: v.string(),
    bookingId: v.optional(v.id("bookings")),
    templateId: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    // Generate unique slug
    let slug = generateSlug(args.person1Name, args.person2Name);
    let existingSlug = await ctx.db
      .query("weddingInvitations")
      .withIndex("by_slug", (q) => q.eq("slug", slug))
      .first();

    let counter = 1;
    while (existingSlug) {
      slug = `${generateSlug(args.person1Name, args.person2Name)}-${counter}`;
      existingSlug = await ctx.db
        .query("weddingInvitations")
        .withIndex("by_slug", (q) => q.eq("slug", slug))
        .first();
      counter++;
    }

    // Generate unique access code
    let accessCode = generateAccessCode();
    let existingCode = await ctx.db
      .query("weddingInvitations")
      .withIndex("by_access_code", (q) => q.eq("accessCode", accessCode))
      .first();

    while (existingCode) {
      accessCode = generateAccessCode();
      existingCode = await ctx.db
        .query("weddingInvitations")
        .withIndex("by_access_code", (q) => q.eq("accessCode", accessCode))
        .first();
    }

    const id = await ctx.db.insert("weddingInvitations", {
      slug,
      accessCode,
      ownerEmail: args.ownerEmail.toLowerCase(),
      person1Name: args.person1Name,
      person2Name: args.person2Name,
      eventDate: args.eventDate,
      templateId: args.templateId || "classic",
      ceremonyDate: args.ceremonyDate,
      ceremonyTime: args.ceremonyTime,
      ceremonyLocation: args.ceremonyLocation,
      ceremonyAddress: args.ceremonyAddress,
      celebrationLocation: args.celebrationLocation,
      celebrationAddress: args.celebrationAddress,
      photos: [],
      rsvpEnabled: true,
      bookingId: args.bookingId,
      // Admin-created invitations are always paid/free
      isPaid: true,
      paymentStatus: args.bookingId ? "free_booking" : "paid",
      linkedBookingId: args.bookingId,
      isActive: true,
      isPublished: false,
      viewCount: 0,
      createdAt: Date.now(),
      updatedAt: Date.now(),
    });

    return { id, slug, accessCode };
  },
});

// ============================================
// PUBLIC CREATION (Self-service)
// ============================================

// Create invitation from public form (checks for booking for free access)
export const createPublic = mutation({
  args: {
    person1Name: v.string(),
    person2Name: v.string(),
    ownerEmail: v.string(),
    eventDate: v.string(),
    ceremonyDate: v.string(),
    ceremonyTime: v.string(),
    ceremonyLocation: v.string(),
    ceremonyAddress: v.string(),
    celebrationLocation: v.optional(v.string()),
    celebrationAddress: v.optional(v.string()),
    templateId: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const email = args.ownerEmail.toLowerCase();

    // Check if user has active booking (for free access)
    const activeBooking = await ctx.db
      .query("bookings")
      .filter((q) =>
        q.and(
          q.eq(q.field("clientEmail"), email),
          q.eq(q.field("status"), "confirmed")
        )
      )
      .first();

    const hasFreeAccess = !!activeBooking;

    // Generate unique slug
    let slug = generateSlug(args.person1Name, args.person2Name);
    let existingSlug = await ctx.db
      .query("weddingInvitations")
      .withIndex("by_slug", (q) => q.eq("slug", slug))
      .first();

    let counter = 1;
    while (existingSlug) {
      slug = `${generateSlug(args.person1Name, args.person2Name)}-${counter}`;
      existingSlug = await ctx.db
        .query("weddingInvitations")
        .withIndex("by_slug", (q) => q.eq("slug", slug))
        .first();
      counter++;
    }

    // Generate unique access code
    let accessCode = generateAccessCode();
    let existingCode = await ctx.db
      .query("weddingInvitations")
      .withIndex("by_access_code", (q) => q.eq("accessCode", accessCode))
      .first();

    while (existingCode) {
      accessCode = generateAccessCode();
      existingCode = await ctx.db
        .query("weddingInvitations")
        .withIndex("by_access_code", (q) => q.eq("accessCode", accessCode))
        .first();
    }

    const id = await ctx.db.insert("weddingInvitations", {
      slug,
      accessCode,
      ownerEmail: email,
      person1Name: args.person1Name,
      person2Name: args.person2Name,
      eventDate: args.eventDate,
      templateId: args.templateId || "classic",
      ceremonyDate: args.ceremonyDate,
      ceremonyTime: args.ceremonyTime,
      ceremonyLocation: args.ceremonyLocation,
      ceremonyAddress: args.ceremonyAddress,
      celebrationLocation: args.celebrationLocation,
      celebrationAddress: args.celebrationAddress,
      photos: [],
      rsvpEnabled: true,
      // Payment status based on booking
      isPaid: hasFreeAccess,
      paymentStatus: hasFreeAccess ? "free_booking" : "pending",
      linkedBookingId: activeBooking?._id,
      isActive: true,
      isPublished: false,
      viewCount: 0,
      createdAt: Date.now(),
      updatedAt: Date.now(),
    });

    return {
      id,
      slug,
      accessCode,
      hasFreeAccess,
      bookingId: activeBooking?._id,
    };
  },
});

// Get invitation by ID for payment page (public - limited info)
export const getForPayment = query({
  args: { id: v.id("weddingInvitations") },
  handler: async (ctx, args) => {
    const invitation = await ctx.db.get(args.id);
    if (!invitation) return null;

    // Return only essential info for payment page
    return {
      _id: invitation._id,
      person1Name: invitation.person1Name,
      person2Name: invitation.person2Name,
      eventDate: invitation.eventDate,
      isPaid: invitation.isPaid,
      paymentStatus: invitation.paymentStatus,
      accessCode: invitation.accessCode,
      slug: invitation.slug,
    };
  },
});

// Delete invitation (admin)
export const remove = mutation({
  args: { id: v.id("weddingInvitations") },
  handler: async (ctx, args) => {
    const invitation = await ctx.db.get(args.id);
    if (!invitation) {
      throw new Error("Invitation not found");
    }

    // Delete all photos from storage
    for (const photo of invitation.photos) {
      try {
        await ctx.storage.delete(photo.storageId);
      } catch {
        // Ignore errors for missing files
      }
    }

    // Delete all RSVPs
    const rsvps = await ctx.db
      .query("weddingRsvps")
      .withIndex("by_invitation", (q) => q.eq("invitationId", args.id))
      .collect();

    for (const rsvp of rsvps) {
      await ctx.db.delete(rsvp._id);
    }

    // Delete invitation
    await ctx.db.delete(args.id);
  },
});

// Toggle active status (admin)
export const toggleActive = mutation({
  args: { id: v.id("weddingInvitations") },
  handler: async (ctx, args) => {
    const invitation = await ctx.db.get(args.id);
    if (!invitation) {
      throw new Error("Invitation not found");
    }

    await ctx.db.patch(args.id, {
      isActive: !invitation.isActive,
      updatedAt: Date.now(),
    });
  },
});

// Get RSVPs for an invitation (admin)
export const getRsvps = query({
  args: { invitationId: v.id("weddingInvitations") },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("weddingRsvps")
      .withIndex("by_invitation", (q) => q.eq("invitationId", args.invitationId))
      .collect();
  },
});

// Delete RSVP (admin)
export const deleteRsvp = mutation({
  args: { rsvpId: v.id("weddingRsvps") },
  handler: async (ctx, args) => {
    await ctx.db.delete(args.rsvpId);
  },
});

// Mark invitation as paid (admin - for manual payments)
export const markAsPaid = mutation({
  args: {
    id: v.id("weddingInvitations"),
    amount: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    const invitation = await ctx.db.get(args.id);
    if (!invitation) {
      throw new Error("Invitation not found");
    }

    await ctx.db.patch(args.id, {
      isPaid: true,
      paymentStatus: "paid",
      paymentAmount: args.amount,
      paymentDate: Date.now(),
      updatedAt: Date.now(),
    });
  },
});

// Link invitation to booking (admin - for free access)
export const linkToBooking = mutation({
  args: {
    invitationId: v.id("weddingInvitations"),
    bookingId: v.id("bookings"),
  },
  handler: async (ctx, args) => {
    const invitation = await ctx.db.get(args.invitationId);
    if (!invitation) {
      throw new Error("Invitation not found");
    }

    const booking = await ctx.db.get(args.bookingId);
    if (!booking) {
      throw new Error("Booking not found");
    }

    await ctx.db.patch(args.invitationId, {
      bookingId: args.bookingId,
      linkedBookingId: args.bookingId,
      isPaid: true,
      paymentStatus: "free_booking",
      updatedAt: Date.now(),
    });

    return { success: true };
  },
});

// Get active bookings for linking (admin)
export const getActiveBookings = query({
  handler: async (ctx) => {
    const bookings = await ctx.db
      .query("bookings")
      .filter((q) => q.eq(q.field("status"), "confirmed"))
      .collect();

    return bookings.map((b) => ({
      _id: b._id,
      clientName: b.clientName,
      clientEmail: b.clientEmail,
      eventDate: b.eventDate,
      eventType: b.eventType,
    }));
  },
});
