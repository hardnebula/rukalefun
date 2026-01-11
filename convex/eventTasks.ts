import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

// Obtener tareas por reserva
export const getTasksByBooking = query({
  args: { bookingId: v.id("bookings") },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("eventTasks")
      .withIndex("by_booking", (q) => q.eq("bookingId", args.bookingId))
      .collect();
  },
});

// Crear tarea
export const createTask = mutation({
  args: {
    bookingId: v.id("bookings"),
    title: v.string(),
    description: v.optional(v.string()),
    dueDate: v.string(),
    assignedTo: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    return await ctx.db.insert("eventTasks", {
      ...args,
      isCompleted: false,
      createdAt: Date.now(),
    });
  },
});

// Actualizar tarea
export const updateTask = mutation({
  args: {
    id: v.id("eventTasks"),
    title: v.optional(v.string()),
    description: v.optional(v.string()),
    dueDate: v.optional(v.string()),
    isCompleted: v.optional(v.boolean()),
    assignedTo: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const { id, ...updates } = args;
    await ctx.db.patch(id, updates);
  },
});

// Marcar tarea como completada
export const toggleTaskComplete = mutation({
  args: {
    id: v.id("eventTasks"),
  },
  handler: async (ctx, args) => {
    const task = await ctx.db.get(args.id);
    if (!task) throw new Error("Task not found");
    
    await ctx.db.patch(args.id, {
      isCompleted: !task.isCompleted,
    });
  },
});

// Eliminar tarea
export const deleteTask = mutation({
  args: { id: v.id("eventTasks") },
  handler: async (ctx, args) => {
    await ctx.db.delete(args.id);
  },
});

// Obtener tareas pendientes por fecha
export const getUpcomingTasks = query({
  handler: async (ctx) => {
    const tasks = await ctx.db.query("eventTasks").collect();
    const today = new Date().toISOString().split("T")[0];
    
    return tasks
      .filter((task) => !task.isCompleted && task.dueDate >= today)
      .sort((a, b) => a.dueDate.localeCompare(b.dueDate));
  },
});

// ============== CRONOGRAMA DE EVENTOS (TIMELINE) ==============

// Obtener cronograma por evento
export const getTimelineByBooking = query({
  args: { bookingId: v.id("bookings") },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("eventTimeline")
      .withIndex("by_booking", (q) => q.eq("bookingId", args.bookingId))
      .order("asc")
      .collect();
  },
});

// Crear actividad en el cronograma
export const createTimelineActivity = mutation({
  args: {
    bookingId: v.id("bookings"),
    activityName: v.string(),
    scheduledTime: v.string(),
    duration: v.number(),
    description: v.optional(v.string()),
    order: v.number(),
    notes: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const now = Date.now();
    return await ctx.db.insert("eventTimeline", {
      ...args,
      isCompleted: false,
      createdAt: now,
      updatedAt: now,
    });
  },
});

// Actualizar actividad del cronograma
export const updateTimelineActivity = mutation({
  args: {
    id: v.id("eventTimeline"),
    activityName: v.optional(v.string()),
    scheduledTime: v.optional(v.string()),
    duration: v.optional(v.number()),
    description: v.optional(v.string()),
    order: v.optional(v.number()),
    isCompleted: v.optional(v.boolean()),
    notes: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const { id, ...updates } = args;
    await ctx.db.patch(id, {
      ...updates,
      updatedAt: Date.now(),
    });
  },
});

// Eliminar actividad del cronograma
export const deleteTimelineActivity = mutation({
  args: { id: v.id("eventTimeline") },
  handler: async (ctx, args) => {
    await ctx.db.delete(args.id);
  },
});

// Marcar actividad como completada
export const toggleActivityCompletion = mutation({
  args: {
    id: v.id("eventTimeline"),
    isCompleted: v.boolean(),
  },
  handler: async (ctx, args) => {
    await ctx.db.patch(args.id, {
      isCompleted: args.isCompleted,
      updatedAt: Date.now(),
    });
  },
});

// Reordenar actividades
export const reorderActivities = mutation({
  args: {
    activities: v.array(
      v.object({
        id: v.id("eventTimeline"),
        order: v.number(),
      })
    ),
  },
  handler: async (ctx, args) => {
    const now = Date.now();
    await Promise.all(
      args.activities.map((activity) =>
        ctx.db.patch(activity.id, {
          order: activity.order,
          updatedAt: now,
        })
      )
    );
  },
});

// Crear cronograma predeterminado para un tipo de evento
export const createDefaultTimeline = mutation({
  args: {
    bookingId: v.id("bookings"),
    eventType: v.string(),
  },
  handler: async (ctx, args) => {
    const now = Date.now();
    
    // Cronogramas predeterminados según tipo de evento
    const defaultTimelines: Record<string, Array<{
      activityName: string;
      duration: number;
      description?: string;
    }>> = {
      "Boda": [
        { activityName: "Recepción de invitados", duration: 30, description: "Bienvenida y entrega de detalles" },
        { activityName: "Cóctel", duration: 60, description: "Bebidas y aperitivos" },
        { activityName: "Sesión de fotos", duration: 45, description: "Fotos con familia e invitados" },
        { activityName: "Ingreso a salón", duration: 15, description: "Entrada de novios y padrinos" },
        { activityName: "Cena", duration: 90, description: "Servicio de comida" },
        { activityName: "Brindis y discursos", duration: 30, description: "Palabras de los novios y familiares" },
        { activityName: "Corte de torta", duration: 15, description: "Ceremonia de corte de torta" },
        { activityName: "Baile de novios", duration: 20, description: "Primer baile y bailes con padres" },
        { activityName: "Fiesta", duration: 180, description: "Baile y celebración" },
        { activityName: "Cierre", duration: 15, description: "Despedida y cierre del evento" },
      ],
      "Cumpleaños": [
        { activityName: "Recepción de invitados", duration: 30 },
        { activityName: "Cóctel de bienvenida", duration: 45 },
        { activityName: "Comida", duration: 60 },
        { activityName: "Torta y velas", duration: 20 },
        { activityName: "Baile y animación", duration: 120 },
        { activityName: "Cierre", duration: 15 },
      ],
      "Evento Corporativo": [
        { activityName: "Registro y acreditación", duration: 30 },
        { activityName: "Coffee break", duration: 30 },
        { activityName: "Presentaciones", duration: 90 },
        { activityName: "Almuerzo/Cena", duration: 60 },
        { activityName: "Actividad de integración", duration: 60 },
        { activityName: "Cierre y networking", duration: 30 },
      ],
      "Quinceaños": [
        { activityName: "Recepción de invitados", duration: 30 },
        { activityName: "Cóctel", duration: 45 },
        { activityName: "Sesión de fotos", duration: 30 },
        { activityName: "Ingreso de quinceañera", duration: 15 },
        { activityName: "Vals", duration: 20 },
        { activityName: "Cena", duration: 60 },
        { activityName: "Torta", duration: 15 },
        { activityName: "Baile y fiesta", duration: 150 },
        { activityName: "Cierre", duration: 15 },
      ],
    };

    const template = defaultTimelines[args.eventType] || [
      { activityName: "Recepción de invitados", duration: 30 },
      { activityName: "Actividad principal", duration: 120 },
      { activityName: "Comida", duration: 60 },
      { activityName: "Cierre", duration: 15 },
    ];

    // Crear las actividades con horarios calculados
    const booking = await ctx.db.get(args.bookingId);
    if (!booking) throw new Error("Reserva no encontrada");

    let currentTime = booking.startTime; // formato "HH:MM"
    
    const activities = template.map((activity, index) => {
      const scheduledTime = currentTime;
      
      // Calcular siguiente hora
      const [hours, minutes] = currentTime.split(":").map(Number);
      const totalMinutes = hours * 60 + minutes + activity.duration;
      const newHours = Math.floor(totalMinutes / 60) % 24;
      const newMinutes = totalMinutes % 60;
      currentTime = `${String(newHours).padStart(2, "0")}:${String(newMinutes).padStart(2, "0")}`;

      return {
        bookingId: args.bookingId,
        activityName: activity.activityName,
        scheduledTime,
        duration: activity.duration,
        description: activity.description,
        order: index,
        isCompleted: false,
        createdAt: now,
        updatedAt: now,
      };
    });

    // Insertar todas las actividades
    await Promise.all(
      activities.map((activity) => ctx.db.insert("eventTimeline", activity))
    );

    return { count: activities.length };
  },
});

// Limpiar todo el cronograma de un evento
export const clearTimeline = mutation({
  args: { bookingId: v.id("bookings") },
  handler: async (ctx, args) => {
    const activities = await ctx.db
      .query("eventTimeline")
      .withIndex("by_booking", (q) => q.eq("bookingId", args.bookingId))
      .collect();

    await Promise.all(
      activities.map((activity) => ctx.db.delete(activity._id))
    );

    return { deletedCount: activities.length };
  },
});


