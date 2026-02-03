import { v } from "convex/values";
import { query, mutation, action, internalQuery, internalMutation } from "./_generated/server";
import { internal } from "./_generated/api";

// Tipo de roles disponibles
export const roleValues = v.union(
  v.literal("admin"),
  v.literal("decoradora"),
  v.literal("cocina"),
  v.literal("dj"),
  v.literal("fotografia"),
  v.literal("novios"),
  v.literal("otro")
);

// ============== QUERIES ==============

// Obtener todas las notas de una reunión
export const getNotesByMeeting = query({
  args: { meetingId: v.id("meetings") },
  handler: async (ctx, args) => {
    const notes = await ctx.db
      .query("meetingNotes")
      .withIndex("by_meeting", (q) => q.eq("meetingId", args.meetingId))
      .collect();

    return notes.sort((a, b) => b.createdAt - a.createdAt);
  },
});

// Obtener notas filtradas por rol
export const getNotesByRole = query({
  args: {
    meetingId: v.id("meetings"),
    role: roleValues,
  },
  handler: async (ctx, args) => {
    const notes = await ctx.db
      .query("meetingNotes")
      .withIndex("by_role", (q) =>
        q.eq("meetingId", args.meetingId).eq("role", args.role)
      )
      .collect();

    return notes.sort((a, b) => b.createdAt - a.createdAt);
  },
});

// Obtener reunión y notas por código de acceso (portal público)
export const getMeetingByAccessCode = query({
  args: { accessCode: v.string() },
  handler: async (ctx, args) => {
    const meeting = await ctx.db
      .query("meetings")
      .withIndex("by_access_code", (q) => q.eq("notesAccessCode", args.accessCode))
      .first();

    if (!meeting) {
      return null;
    }

    const notes = await ctx.db
      .query("meetingNotes")
      .withIndex("by_meeting", (q) => q.eq("meetingId", meeting._id))
      .collect();

    // Si tiene booking vinculado, obtenerlo
    let booking = null;
    if (meeting.bookingId) {
      booking = await ctx.db.get(meeting.bookingId);
    }

    return {
      meeting: {
        _id: meeting._id,
        title: meeting.title,
        meetingType: meeting.meetingType,
        meetingDate: meeting.meetingDate,
        startTime: meeting.startTime,
        endTime: meeting.endTime,
        clientName: meeting.clientName,
        location: meeting.location,
        agenda: meeting.agenda,
        aiGeneratedSummary: meeting.aiGeneratedSummary,
        aiSummaryGeneratedAt: meeting.aiSummaryGeneratedAt,
      },
      booking: booking
        ? {
            eventType: booking.eventType,
            eventDate: booking.eventDate,
            numberOfGuests: booking.numberOfGuests,
          }
        : null,
      notes: notes.sort((a, b) => b.createdAt - a.createdAt),
    };
  },
});

// ============== MUTATIONS ==============

// Agregar una nota
export const addNote = mutation({
  args: {
    meetingId: v.id("meetings"),
    role: roleValues,
    authorName: v.string(),
    content: v.string(),
    category: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const now = Date.now();

    const noteId = await ctx.db.insert("meetingNotes", {
      meetingId: args.meetingId,
      role: args.role,
      authorName: args.authorName,
      content: args.content,
      category: args.category,
      createdAt: now,
      updatedAt: now,
    });

    return noteId;
  },
});

// Actualizar una nota
export const updateNote = mutation({
  args: {
    noteId: v.id("meetingNotes"),
    content: v.optional(v.string()),
    category: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const { noteId, ...updates } = args;

    const existingNote = await ctx.db.get(noteId);
    if (!existingNote) {
      throw new Error("Nota no encontrada");
    }

    await ctx.db.patch(noteId, {
      ...updates,
      updatedAt: Date.now(),
    });

    return noteId;
  },
});

// Eliminar una nota
export const deleteNote = mutation({
  args: { noteId: v.id("meetingNotes") },
  handler: async (ctx, args) => {
    const note = await ctx.db.get(args.noteId);
    if (!note) {
      throw new Error("Nota no encontrada");
    }

    await ctx.db.delete(args.noteId);
    return { success: true };
  },
});

// Generar código de acceso para novios
export const generateAccessCode = mutation({
  args: { meetingId: v.id("meetings") },
  handler: async (ctx, args) => {
    const meeting = await ctx.db.get(args.meetingId);
    if (!meeting) {
      throw new Error("Reunión no encontrada");
    }

    // Generar código alfanumérico de 8 caracteres
    const characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
    let code = "";
    for (let i = 0; i < 8; i++) {
      code += characters.charAt(Math.floor(Math.random() * characters.length));
    }

    // Verificar que no exista ya
    const existing = await ctx.db
      .query("meetings")
      .withIndex("by_access_code", (q) => q.eq("notesAccessCode", code))
      .first();

    if (existing) {
      // En el raro caso de colisión, intentar de nuevo
      for (let i = 0; i < 8; i++) {
        code += characters.charAt(Math.floor(Math.random() * characters.length));
      }
    }

    await ctx.db.patch(args.meetingId, {
      notesAccessCode: code,
      updatedAt: Date.now(),
    });

    return code;
  },
});

// Revocar código de acceso
export const revokeAccessCode = mutation({
  args: { meetingId: v.id("meetings") },
  handler: async (ctx, args) => {
    const meeting = await ctx.db.get(args.meetingId);
    if (!meeting) {
      throw new Error("Reunión no encontrada");
    }

    await ctx.db.patch(args.meetingId, {
      notesAccessCode: undefined,
      updatedAt: Date.now(),
    });

    return { success: true };
  },
});

// Agregar nota desde portal público (solo rol novios)
export const addNoteFromPublic = mutation({
  args: {
    accessCode: v.string(),
    authorName: v.string(),
    content: v.string(),
    category: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    // Buscar reunión por código de acceso
    const meeting = await ctx.db
      .query("meetings")
      .withIndex("by_access_code", (q) => q.eq("notesAccessCode", args.accessCode))
      .first();

    if (!meeting) {
      throw new Error("Código de acceso inválido");
    }

    const now = Date.now();

    const noteId = await ctx.db.insert("meetingNotes", {
      meetingId: meeting._id,
      role: "novios", // Forzado a rol novios
      authorName: args.authorName,
      content: args.content,
      category: args.category,
      createdAt: now,
      updatedAt: now,
    });

    return noteId;
  },
});

// Guardar resumen generado por IA
export const saveAISummary = mutation({
  args: {
    meetingId: v.id("meetings"),
    summary: v.string(),
  },
  handler: async (ctx, args) => {
    const meeting = await ctx.db.get(args.meetingId);
    if (!meeting) {
      throw new Error("Reunión no encontrada");
    }

    await ctx.db.patch(args.meetingId, {
      aiGeneratedSummary: args.summary,
      aiSummaryGeneratedAt: Date.now(),
      updatedAt: Date.now(),
    });

    return { success: true };
  },
});

// ============== INTERNAL QUERIES ==============

// Query interna para obtener reunión
export const getMeetingInternal = internalQuery({
  args: { id: v.id("meetings") },
  handler: async (ctx, args) => {
    return await ctx.db.get(args.id);
  },
});

// Query interna para obtener notas
export const getNotesByMeetingInternal = internalQuery({
  args: { meetingId: v.id("meetings") },
  handler: async (ctx, args) => {
    const notes = await ctx.db
      .query("meetingNotes")
      .withIndex("by_meeting", (q) => q.eq("meetingId", args.meetingId))
      .collect();
    return notes;
  },
});

// Mutation interna para guardar resumen IA
export const saveAISummaryInternal = internalMutation({
  args: {
    meetingId: v.id("meetings"),
    summary: v.string(),
  },
  handler: async (ctx, args) => {
    const meeting = await ctx.db.get(args.meetingId);
    if (!meeting) {
      throw new Error("Reunión no encontrada");
    }

    await ctx.db.patch(args.meetingId, {
      aiGeneratedSummary: args.summary,
      aiSummaryGeneratedAt: Date.now(),
      updatedAt: Date.now(),
    });

    return { success: true };
  },
});

// ============== ACTIONS ==============

// Generar resumen con IA
export const generateMeetingSummary = action({
  args: { meetingId: v.id("meetings") },
  returns: v.string(),
  handler: async (ctx, args): Promise<string> => {
    // Obtener la reunión usando query interna
    const meeting: { title: string; meetingType: string; meetingDate: string; clientName: string } | null = await ctx.runQuery(internal.meetingNotes.getMeetingInternal, {
      id: args.meetingId,
    });

    if (!meeting) {
      throw new Error("Reunión no encontrada");
    }

    // Obtener todas las notas usando query interna
    const notes: Array<{ role: string; authorName: string; content: string }> = await ctx.runQuery(internal.meetingNotes.getNotesByMeetingInternal, {
      meetingId: args.meetingId,
    });

    if (notes.length === 0) {
      throw new Error("No hay notas para generar resumen");
    }

    // Preparar el contenido para la IA
    const notesContent: string = notes
      .map((note) =>
        `[${note.role.toUpperCase()}] ${note.authorName}: ${note.content}`
      )
      .join("\n\n");

    const prompt: string = `Eres un asistente de planificación de eventos. Analiza las siguientes notas de una reunión de planificación y genera un resumen ejecutivo.

INFORMACIÓN DE LA REUNIÓN:
- Título: ${meeting.title}
- Tipo: ${meeting.meetingType === "consulta_inicial" ? "Consulta Inicial" : "Planificación del Evento"}
- Fecha: ${meeting.meetingDate}
- Cliente: ${meeting.clientName}

NOTAS DE LOS PARTICIPANTES:
${notesContent}

Por favor genera un resumen estructurado que incluya:
1. **Puntos clave discutidos**: Los temas principales tratados
2. **Decisiones tomadas**: Acuerdos o decisiones concretas
3. **Pendientes por resolver**: Temas que quedaron sin definir
4. **Próximos pasos**: Acciones a realizar
5. **Notas importantes**: Detalles relevantes mencionados por cada rol

Usa un tono profesional pero amigable. El resumen debe ser conciso pero completo.`;

    // Llamar a OpenAI
    const openaiApiKey = process.env.OPENAI_API_KEY;
    if (!openaiApiKey) {
      throw new Error("OPENAI_API_KEY no está configurada");
    }

    const response: Response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${openaiApiKey}`,
      },
      body: JSON.stringify({
        model: "gpt-4o-mini",
        messages: [
          {
            role: "system",
            content:
              "Eres un asistente experto en planificación de eventos, especialmente bodas y celebraciones. Tu trabajo es crear resúmenes claros y útiles de reuniones de planificación.",
          },
          { role: "user", content: prompt },
        ],
        max_tokens: 2000,
        temperature: 0.7,
      }),
    });

    if (!response.ok) {
      const error = await response.text();
      throw new Error(`Error de OpenAI: ${error}`);
    }

    const data: { choices: Array<{ message?: { content?: string } }> } = await response.json();
    const summary: string | undefined = data.choices[0]?.message?.content;

    if (!summary) {
      throw new Error("No se pudo generar el resumen");
    }

    // Guardar el resumen usando mutation interna
    await ctx.runMutation(internal.meetingNotes.saveAISummaryInternal, {
      meetingId: args.meetingId,
      summary: summary,
    });

    return summary;
  },
});
