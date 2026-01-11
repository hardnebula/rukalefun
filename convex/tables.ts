import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

// ===== QUERIES =====

// Obtener todas las mesas
export const getAllTables = query({
  handler: async (ctx) => {
    return await ctx.db.query("tables").order("asc").collect();
  },
});

// Obtener mesas activas
export const getActiveTables = query({
  handler: async (ctx) => {
    return await ctx.db
      .query("tables")
      .filter((q) => q.eq(q.field("isActive"), true))
      .order("asc")
      .collect();
  },
});

// Obtener mesa por ID
export const getTableById = query({
  args: { id: v.id("tables") },
  handler: async (ctx, args) => {
    return await ctx.db.get(args.id);
  },
});

// Obtener asignaciones de mesas para un evento
export const getTableAssignmentsByBooking = query({
  args: { bookingId: v.id("bookings") },
  handler: async (ctx, args) => {
    const assignments = await ctx.db
      .query("tableAssignments")
      .withIndex("by_booking", (q) => q.eq("bookingId", args.bookingId))
      .collect();

    // Enriquecer con información de la mesa
    return await Promise.all(
      assignments.map(async (assignment) => {
        const table = assignment.tableId ? await ctx.db.get(assignment.tableId) : null;
        return { ...assignment, table };
      })
    );
  },
});

// Obtener resumen de ocupación de mesas por evento
export const getTableOccupancyByBooking = query({
  args: { bookingId: v.id("bookings") },
  handler: async (ctx, args) => {
    const tables = await ctx.db.query("tables").collect();
    const assignments = await ctx.db
      .query("tableAssignments")
      .withIndex("by_booking", (q) => q.eq("bookingId", args.bookingId))
      .collect();

    return tables.map((table) => {
      const tableAssignments = assignments.filter((a) => a.tableId === table._id);
      const occupiedSeats = tableAssignments.length;
      const availableSeats = table.capacity - occupiedSeats;

      return {
        table,
        occupiedSeats,
        availableSeats,
        guests: tableAssignments,
        percentage: (occupiedSeats / table.capacity) * 100,
      };
    });
  },
});

// ===== MUTATIONS =====

// Crear mesa
export const createTable = mutation({
  args: {
    tableNumber: v.number(),
    title: v.optional(v.string()),
    capacity: v.number(),
    shape: v.string(),
    position: v.optional(v.object({ x: v.number(), y: v.number() })),
    notes: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    return await ctx.db.insert("tables", {
      ...args,
      isActive: true,
      createdAt: Date.now(),
    });
  },
});

// Actualizar mesa
export const updateTable = mutation({
  args: {
    id: v.id("tables"),
    tableNumber: v.optional(v.number()),
    title: v.optional(v.string()),
    capacity: v.optional(v.number()),
    shape: v.optional(v.string()),
    position: v.optional(v.object({ x: v.number(), y: v.number() })),
    isActive: v.optional(v.boolean()),
    notes: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const { id, ...updates } = args;
    await ctx.db.patch(id, updates);
  },
});

// Eliminar mesa
export const deleteTable = mutation({
  args: { id: v.id("tables") },
  handler: async (ctx, args) => {
    // Verificar que no tenga asignaciones
    const assignments = await ctx.db
      .query("tableAssignments")
      .withIndex("by_table", (q) => q.eq("tableId", args.id))
      .collect();

    if (assignments.length > 0) {
      throw new Error("No se puede eliminar una mesa con invitados asignados");
    }

    await ctx.db.delete(args.id);
  },
});

// Crear asignación de invitado a mesa
export const assignGuestToTable = mutation({
  args: {
    bookingId: v.id("bookings"),
    tableId: v.id("tables"),
    guestName: v.string(),
    dietaryRestrictions: v.optional(v.string()),
    isConfirmed: v.optional(v.boolean()),
    notes: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const now = Date.now();

    // Verificar capacidad de la mesa
    const table = await ctx.db.get(args.tableId);
    if (!table) throw new Error("Mesa no encontrada");

    const currentAssignments = await ctx.db
      .query("tableAssignments")
      .withIndex("by_booking_and_table", (q) =>
        q.eq("bookingId", args.bookingId).eq("tableId", args.tableId)
      )
      .collect();

    if (currentAssignments.length >= table.capacity) {
      throw new Error(`La mesa ${table.tableNumber} está llena`);
    }

    return await ctx.db.insert("tableAssignments", {
      bookingId: args.bookingId,
      tableId: args.tableId,
      guestName: args.guestName,
      dietaryRestrictions: args.dietaryRestrictions,
      isConfirmed: args.isConfirmed ?? false,
      notes: args.notes,
      createdAt: now,
      updatedAt: now,
    });
  },
});

// Actualizar asignación de invitado
export const updateGuestAssignment = mutation({
  args: {
    id: v.id("tableAssignments"),
    guestName: v.optional(v.string()),
    tableId: v.optional(v.id("tables")),
    dietaryRestrictions: v.optional(v.string()),
    isConfirmed: v.optional(v.boolean()),
    notes: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const { id, tableId, ...updates } = args;
    const assignment = await ctx.db.get(id);
    if (!assignment) throw new Error("Asignación no encontrada");

    // Si se cambia de mesa, verificar capacidad
    if (tableId && tableId !== assignment.tableId) {
      const newTable = await ctx.db.get(tableId);
      if (!newTable) throw new Error("Mesa no encontrada");

      const currentAssignments = await ctx.db
        .query("tableAssignments")
        .withIndex("by_booking_and_table", (q) =>
          q.eq("bookingId", assignment.bookingId).eq("tableId", tableId)
        )
        .collect();

      if (currentAssignments.length >= newTable.capacity) {
        throw new Error(`La mesa ${newTable.tableNumber} está llena`);
      }

      await ctx.db.patch(id, {
        tableId,
        ...updates,
        updatedAt: Date.now(),
      });
    } else {
      await ctx.db.patch(id, {
        ...updates,
        updatedAt: Date.now(),
      });
    }
  },
});

// Eliminar asignación de invitado
export const removeGuestAssignment = mutation({
  args: { id: v.id("tableAssignments") },
  handler: async (ctx, args) => {
    await ctx.db.delete(args.id);
  },
});

// Función para crear mesas iniciales (seed)
export const seedTables = mutation({
  handler: async (ctx) => {
    const now = Date.now();
    const tablesToCreate = [];

    // Crear 20 mesas redondas de 8 personas (capacidad 160)
    for (let i = 1; i <= 20; i++) {
      tablesToCreate.push({
        tableNumber: i,
        capacity: 8,
        shape: "redonda",
        isActive: i <= 19, // Las primeras 19 mesas activas (152 personas)
        notes: i === 20 ? "Mesa de reserva" : undefined,
        createdAt: now,
      });
    }

    // Insertar todas las mesas
    const insertedTables = await Promise.all(
      tablesToCreate.map((table) => ctx.db.insert("tables", table))
    );

    return {
      message: `${insertedTables.length} mesas creadas exitosamente`,
      tables: insertedTables.length,
    };
  },
});

// Asignación automática de invitados a mesas (distribuir equitativamente)
export const autoAssignGuests = mutation({
  args: {
    bookingId: v.id("bookings"),
    guestNames: v.array(v.string()),
  },
  handler: async (ctx, args) => {
    const tables = await ctx.db
      .query("tables")
      .filter((q) => q.eq(q.field("isActive"), true))
      .order("asc")
      .collect();

    if (tables.length === 0) {
      throw new Error("No hay mesas disponibles");
    }

    const now = Date.now();
    let currentTableIndex = 0;
    const assignments = [];

    for (const guestName of args.guestNames) {
      // Verificar capacidad de la mesa actual
      const currentTable = tables[currentTableIndex];
      const currentAssignments = await ctx.db
        .query("tableAssignments")
        .withIndex("by_booking_and_table", (q) =>
          q.eq("bookingId", args.bookingId).eq("tableId", currentTable._id)
        )
        .collect();

      // Si la mesa está llena, pasar a la siguiente
      if (currentAssignments.length >= currentTable.capacity) {
        currentTableIndex++;
        if (currentTableIndex >= tables.length) {
          throw new Error("No hay suficiente capacidad en las mesas");
        }
      }

      // Asignar invitado a la mesa actual
      const assignmentId = await ctx.db.insert("tableAssignments", {
        bookingId: args.bookingId,
        tableId: tables[currentTableIndex]._id,
        guestName,
        isConfirmed: false,
        createdAt: now,
        updatedAt: now,
      });

      assignments.push(assignmentId);
    }

    return {
      message: `${assignments.length} invitados asignados automáticamente`,
      assignments: assignments.length,
    };
  },
});
