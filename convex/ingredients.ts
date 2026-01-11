import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

// ============== INGREDIENTES ==============

// Obtener todos los ingredientes
export const getAllIngredients = query({
  handler: async (ctx) => {
    return await ctx.db
      .query("ingredients")
      .order("desc")
      .collect();
  },
});

// Obtener ingredientes activos
export const getActiveIngredients = query({
  handler: async (ctx) => {
    return await ctx.db
      .query("ingredients")
      .filter((q) => q.eq(q.field("isActive"), true))
      .order("desc")
      .collect();
  },
});

// Obtener ingredientes por categoría
export const getIngredientsByCategory = query({
  args: { category: v.string() },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("ingredients")
      .withIndex("by_category", (q) => q.eq("category", args.category))
      .collect();
  },
});

// Obtener ingredientes por proveedor
export const getIngredientsBySupplier = query({
  args: { supplier: v.string() },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("ingredients")
      .withIndex("by_supplier", (q) => q.eq("supplier", args.supplier))
      .collect();
  },
});

// Obtener ingredientes con stock bajo
export const getLowStockIngredients = query({
  handler: async (ctx) => {
    const allIngredients = await ctx.db.query("ingredients").collect();
    return allIngredients.filter((ingredient) =>
      ingredient.currentStock <= ingredient.minStock && ingredient.isActive
    );
  },
});

// Buscar ingredientes por nombre
export const searchIngredients = query({
  args: { searchTerm: v.string() },
  handler: async (ctx, args) => {
    const allIngredients = await ctx.db.query("ingredients").collect();
    const searchLower = args.searchTerm.toLowerCase();
    return allIngredients.filter((ingredient) =>
      ingredient.name.toLowerCase().includes(searchLower)
    );
  },
});

// Crear ingrediente
export const createIngredient = mutation({
  args: {
    name: v.string(),
    category: v.string(),
    unit: v.string(),
    costPerUnit: v.number(),
    supplier: v.string(),
    supplierContact: v.optional(v.string()),
    currentStock: v.number(),
    minStock: v.number(),
    notes: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const now = Date.now();
    return await ctx.db.insert("ingredients", {
      ...args,
      isActive: true,
      createdAt: now,
      updatedAt: now,
    });
  },
});

// Actualizar ingrediente
export const updateIngredient = mutation({
  args: {
    id: v.id("ingredients"),
    name: v.optional(v.string()),
    category: v.optional(v.string()),
    unit: v.optional(v.string()),
    costPerUnit: v.optional(v.number()),
    supplier: v.optional(v.string()),
    supplierContact: v.optional(v.string()),
    currentStock: v.optional(v.number()),
    minStock: v.optional(v.number()),
    notes: v.optional(v.string()),
    isActive: v.optional(v.boolean()),
  },
  handler: async (ctx, args) => {
    const { id, ...updates } = args;
    await ctx.db.patch(id, {
      ...updates,
      updatedAt: Date.now(),
    });
  },
});

// Ajustar stock
export const adjustStock = mutation({
  args: {
    id: v.id("ingredients"),
    quantity: v.number(),
    operation: v.string(), // "add" o "subtract"
  },
  handler: async (ctx, args) => {
    const ingredient = await ctx.db.get(args.id);
    if (!ingredient) {
      throw new Error("Ingrediente no encontrado");
    }

    let newStock = ingredient.currentStock;
    if (args.operation === "add") {
      newStock += args.quantity;
    } else if (args.operation === "subtract") {
      newStock -= args.quantity;
      if (newStock < 0) {
        throw new Error("Stock no puede ser negativo");
      }
    } else {
      throw new Error("Operación inválida. Debe ser 'add' o 'subtract'");
    }

    await ctx.db.patch(args.id, {
      currentStock: newStock,
      updatedAt: Date.now(),
    });
  },
});

// Eliminar ingrediente
export const deleteIngredient = mutation({
  args: { id: v.id("ingredients") },
  handler: async (ctx, args) => {
    // Verificar si el ingrediente está siendo usado en recetas
    const dishIngredients = await ctx.db
      .query("dishIngredients")
      .withIndex("by_ingredient", (q) => q.eq("ingredientId", args.id))
      .collect();

    if (dishIngredients.length > 0) {
      throw new Error(
        `No se puede eliminar. Este ingrediente está siendo usado en ${dishIngredients.length} receta(s)`
      );
    }

    // Verificar si está en listas de compras activas
    const shoppingListItems = await ctx.db
      .query("shoppingListItems")
      .withIndex("by_ingredient", (q) => q.eq("ingredientId", args.id))
      .collect();

    if (shoppingListItems.length > 0) {
      throw new Error(
        "No se puede eliminar. Este ingrediente está en listas de compras activas"
      );
    }

    await ctx.db.delete(args.id);
  },
});

// Importación masiva de ingredientes
export const bulkImportIngredients = mutation({
  args: {
    ingredients: v.array(v.object({
      name: v.string(),
      category: v.string(),
      unit: v.string(),
      costPerUnit: v.number(),
      supplier: v.string(),
      supplierContact: v.optional(v.string()),
      currentStock: v.number(),
      minStock: v.number(),
      notes: v.optional(v.string()),
    })),
  },
  handler: async (ctx, args) => {
    const now = Date.now();
    const ids = [];

    for (const ingredient of args.ingredients) {
      const id = await ctx.db.insert("ingredients", {
        ...ingredient,
        isActive: true,
        createdAt: now,
        updatedAt: now,
      });
      ids.push(id);
    }

    return { count: ids.length, ids };
  },
});
