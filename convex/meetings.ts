import { v } from "convex/values";
import { mutation, query, action, internalMutation, internalQuery, internalAction } from "./_generated/server";
import { internal } from "./_generated/api";

// ============ QUERIES ============

// Obtener todas las reuniones
export const getAllMeetings = query({
  handler: async (ctx) => {
    const meetings = await ctx.db.query("meetings").collect();
    
    // Enriquecer con información del booking si existe
    return await Promise.all(
      meetings.map(async (meeting) => {
        const booking = meeting.bookingId 
          ? await ctx.db.get(meeting.bookingId) 
          : null;
        return { ...meeting, booking };
      })
    );
  },
});

// Obtener una reunión específica
export const getMeeting = query({
  args: { id: v.id("meetings") },
  handler: async (ctx, args) => {
    const meeting = await ctx.db.get(args.id);
    if (!meeting) return null;

    const booking = meeting.bookingId 
      ? await ctx.db.get(meeting.bookingId) 
      : null;
    
    return { ...meeting, booking };
  },
});

// Query interna para usar en actions
export const getMeetingInternal = internalQuery({
  args: { id: v.id("meetings") },
  handler: async (ctx, args) => {
    return await ctx.db.get(args.id);
  },
});

// Query pública para obtener reunión por ID (usada por actions externas)
export const getMeetingById = query({
  args: { id: v.id("meetings") },
  handler: async (ctx, args) => {
    return await ctx.db.get(args.id);
  },
});

// Obtener reuniones por booking
export const getMeetingsByBooking = query({
  args: { bookingId: v.id("bookings") },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("meetings")
      .withIndex("by_booking", (q) => q.eq("bookingId", args.bookingId))
      .collect();
  },
});

// Obtener reuniones por rango de fechas
export const getMeetingsByDateRange = query({
  args: {
    startDate: v.string(),
    endDate: v.string(),
  },
  handler: async (ctx, args) => {
    const meetings = await ctx.db
      .query("meetings")
      .filter((q) =>
        q.and(
          q.gte(q.field("meetingDate"), args.startDate),
          q.lte(q.field("meetingDate"), args.endDate)
        )
      )
      .collect();

    return await Promise.all(
      meetings.map(async (meeting) => {
        const booking = meeting.bookingId 
          ? await ctx.db.get(meeting.bookingId) 
          : null;
        return { ...meeting, booking };
      })
    );
  },
});

// Obtener reuniones próximas (siguiente semana)
export const getUpcomingMeetings = query({
  handler: async (ctx) => {
    const now = new Date();
    const nextWeek = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000);
    
    const today = now.toISOString().split('T')[0];
    const endDate = nextWeek.toISOString().split('T')[0];

    const meetings = await ctx.db
      .query("meetings")
      .filter((q) =>
        q.and(
          q.gte(q.field("meetingDate"), today),
          q.lte(q.field("meetingDate"), endDate),
          q.eq(q.field("status"), "scheduled")
        )
      )
      .collect();

    return await Promise.all(
      meetings.map(async (meeting) => {
        const booking = meeting.bookingId 
          ? await ctx.db.get(meeting.bookingId) 
          : null;
        return { ...meeting, booking };
      })
    );
  },
});

// ============ MUTATIONS ============

// Crear una nueva reunión
export const createMeeting = mutation({
  args: {
    bookingId: v.optional(v.id("bookings")),
    title: v.string(),
    meetingType: v.union(
      v.literal("consulta_inicial"),
      v.literal("planificacion_evento")
    ),
    meetingDate: v.string(),
    startTime: v.string(),
    endTime: v.string(),
    clientName: v.string(),
    clientEmail: v.string(),
    clientPhone: v.string(),
    notes: v.optional(v.string()),
    agenda: v.optional(v.string()),
    location: v.optional(v.string()),
    createdBy: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const now = Date.now();
    
    return await ctx.db.insert("meetings", {
      ...args,
      status: "scheduled",
      reminderSent: false,
      createdAt: now,
      updatedAt: now,
    });
  },
});

// Actualizar una reunión
export const updateMeeting = mutation({
  args: {
    id: v.id("meetings"),
    title: v.optional(v.string()),
    meetingType: v.optional(v.union(
      v.literal("consulta_inicial"),
      v.literal("planificacion_evento")
    )),
    meetingDate: v.optional(v.string()),
    startTime: v.optional(v.string()),
    endTime: v.optional(v.string()),
    clientName: v.optional(v.string()),
    clientEmail: v.optional(v.string()),
    clientPhone: v.optional(v.string()),
    notes: v.optional(v.string()),
    agenda: v.optional(v.string()),
    location: v.optional(v.string()),
    meetingSummary: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const { id, ...updates } = args;

    return await ctx.db.patch(id, {
      ...updates,
      updatedAt: Date.now(),
    });
  },
});

// Actualizar estado de reunión
export const updateMeetingStatus = mutation({
  args: {
    id: v.id("meetings"),
    status: v.union(
      v.literal("scheduled"),
      v.literal("completed"),
      v.literal("cancelled"),
      v.literal("rescheduled")
    ),
  },
  handler: async (ctx, args) => {
    return await ctx.db.patch(args.id, {
      status: args.status,
      updatedAt: Date.now(),
    });
  },
});

// Eliminar reunión
export const deleteMeeting = mutation({
  args: { id: v.id("meetings") },
  handler: async (ctx, args) => {
    return await ctx.db.delete(args.id);
  },
});

// Marcar recordatorio como enviado (internal mutation)
export const markReminderSent = internalMutation({
  args: { id: v.id("meetings") },
  handler: async (ctx, args) => {
    return await ctx.db.patch(args.id, {
      reminderSent: true,
      reminderSentAt: Date.now(),
    });
  },
});

// ============ ACTIONS (para emails) ============

// Enviar recordatorio de reunión
export const sendMeetingReminder = internalAction({
  args: { meetingId: v.id("meetings") },
  handler: async (ctx, args) => {
    const meeting: any = await ctx.runQuery(internal.meetings.getMeetingInternal, {
      id: args.meetingId,
    });

    if (!meeting || meeting.reminderSent) {
      return { success: false, reason: "Meeting not found or reminder already sent" };
    }

    const emailHtml = generateEmailTemplate(meeting);

    try {
      const response: any = await fetch("https://api.resend.com/emails", {
        method: "POST",
        headers: {
          Authorization: "Bearer " + (process.env.RESEND_API_KEY || ""),
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          from: process.env.NOTIFICATION_EMAIL_FROM || "noreply@rukalefun.com",
          to: meeting.clientEmail,
          subject: "Recordatorio: Reunión - " + meeting.title,
          html: emailHtml,
        }),
      });

      if (response.ok) {
        await ctx.runMutation(internal.meetings.markReminderSent, {
          id: args.meetingId,
        });
        return { success: true };
      } else {
        const error: any = await response.text();
        console.error("Error sending email:", error);
        return { success: false, reason: error };
      }
    } catch (error) {
      console.error("Error sending meeting reminder:", error);
      return { success: false, reason: String(error) };
    }
  },
});

// Revisar y enviar recordatorios pendientes
export const checkAndSendReminders = internalMutation({
  handler: async (ctx) => {
    const now = new Date();
    const tomorrow = new Date(now.getTime() + 24 * 60 * 60 * 1000);
    const tomorrowStr = tomorrow.toISOString().split('T')[0];

    const meetings = await ctx.db
      .query("meetings")
      .filter((q) =>
        q.and(
          q.eq(q.field("meetingDate"), tomorrowStr),
          q.eq(q.field("status"), "scheduled"),
          q.eq(q.field("reminderSent"), false)
        )
      )
      .collect();

    console.log("Found " + meetings.length + " meetings to send reminders for");

    for (const meeting of meetings) {
      try {
        await ctx.scheduler.runAfter(0, internal.meetings.sendMeetingReminder, {
          meetingId: meeting._id,
        });
      } catch (error) {
        console.error("Error scheduling reminder for meeting " + meeting._id + ":", error);
      }
    }

    return { count: meetings.length };
  },
});

// ============ HELPER FUNCTIONS ============

function generateEmailTemplate(meeting: any): string {
  const meetingDate = new Date(meeting.meetingDate);
  const formattedDate = meetingDate.toLocaleDateString("es-CL", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  const meetingTypeLabel = meeting.meetingType === "consulta_inicial" 
    ? "Consulta Inicial" 
    : "Planificación del Evento";

  return "<html><body><h2>Recordatorio de Reunión</h2><p>Hola " + meeting.clientName + 
    ",</p><p>Te recordamos que tienes una reunión programada:</p><ul><li>Título: " + 
    meeting.title + "</li><li>Tipo: " + meetingTypeLabel + "</li><li>Fecha: " + 
    formattedDate + "</li><li>Hora: " + meeting.startTime + " - " + meeting.endTime + 
    "</li>" + (meeting.location ? "<li>Ubicación: " + meeting.location + "</li>" : "") + 
    "</ul>" + (meeting.agenda ? "<p>Agenda: " + meeting.agenda + "</p>" : "") + 
    "<p>¡Te esperamos!</p><p>Equipo Ruka Lefún</p></body></html>";
}
