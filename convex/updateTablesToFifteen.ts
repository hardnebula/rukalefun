import { mutation } from "./_generated/server";

// Script para actualizar mesas a 15 con capacidad de 10 personas
export const updateTablesToFifteen = mutation({
  handler: async (ctx) => {
    // Eliminar todas las mesas existentes
    const existingTables = await ctx.db.query("tables").collect();
    for (const table of existingTables) {
      await ctx.db.delete(table._id);
    }

    const now = Date.now();
    const tablesToCreate = [];

    // Crear 15 mesas redondas de 10 personas (capacidad 150)
    for (let i = 1; i <= 15; i++) {
      tablesToCreate.push({
        tableNumber: i,
        capacity: 10,
        shape: "redonda",
        isActive: true,
        notes: undefined,
        createdAt: now,
      });
    }

    // Insertar todas las mesas
    const insertedTables = await Promise.all(
      tablesToCreate.map((table) => ctx.db.insert("tables", table))
    );

    return {
      message: `${insertedTables.length} mesas creadas exitosamente (10 personas cada una)`,
      tables: insertedTables.length,
      totalCapacity: insertedTables.length * 10,
    };
  },
});
