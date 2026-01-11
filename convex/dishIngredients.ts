import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

// ============== MAPEO DE PLATOS A INGREDIENTES (RECETAS) ==============

// Obtener ingredientes de un plato
export const getIngredientsByDish = query({
  args: { dishName: v.string() },
  handler: async (ctx, args) => {
    const mappings = await ctx.db
      .query("dishIngredients")
      .withIndex("by_dish", (q) => q.eq("dishName", args.dishName))
      .collect();

    // Enriquecer con información del ingrediente
    return await Promise.all(
      mappings.map(async (mapping) => {
        const ingredient = await ctx.db.get(mapping.ingredientId);
        return { ...mapping, ingredient };
      })
    );
  },
});

// Obtener platos que usan un ingrediente
export const getDishesByIngredient = query({
  args: { ingredientId: v.id("ingredients") },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("dishIngredients")
      .withIndex("by_ingredient", (q) => q.eq("ingredientId", args.ingredientId))
      .collect();
  },
});

// Obtener todos los mapeos (para UI de configuración)
export const getAllDishMappings = query({
  handler: async (ctx) => {
    const mappings = await ctx.db.query("dishIngredients").collect();

    // Enriquecer con información del ingrediente
    return await Promise.all(
      mappings.map(async (mapping) => {
        const ingredient = await ctx.db.get(mapping.ingredientId);
        return { ...mapping, ingredient };
      })
    );
  },
});

// Obtener lista de platos únicos de todas las plantillas
export const getAllUniqueDishes = query({
  handler: async (ctx) => {
    const templates = await ctx.db.query("quoteTemplates").collect();
    const dishesSet = new Set<string>();

    templates.forEach((template) => {
      template.menuSections.forEach((section) => {
        section.items.forEach((item) => {
          item.dishes.forEach((dish) => {
            dishesSet.add(dish);
          });
        });
      });
    });

    return Array.from(dishesSet).sort();
  },
});

// Obtener platos sin mapeo de ingredientes
export const getUnmappedDishes = query({
  handler: async (ctx) => {
    // Obtener todos los platos únicos
    const templates = await ctx.db.query("quoteTemplates").collect();
    const allDishesSet = new Set<string>();

    templates.forEach((template) => {
      template.menuSections.forEach((section) => {
        section.items.forEach((item) => {
          item.dishes.forEach((dish) => {
            allDishesSet.add(dish);
          });
        });
      });
    });

    // Obtener platos que ya tienen mapeos
    const mappings = await ctx.db.query("dishIngredients").collect();
    const mappedDishesSet = new Set(mappings.map((m) => m.dishName));

    // Encontrar diferencia
    const unmappedDishes = Array.from(allDishesSet).filter(
      (dish) => !mappedDishesSet.has(dish)
    );

    return unmappedDishes.sort();
  },
});

// Agregar ingrediente a un plato
export const addDishIngredient = mutation({
  args: {
    dishName: v.string(),
    ingredientId: v.id("ingredients"),
    quantityPerServing: v.number(),
    unit: v.string(),
    notes: v.optional(v.string()),
    source: v.optional(v.union(
      v.literal("manual"),
      v.literal("ai-generated"),
      v.literal("ai-verified")
    )),
    aiConfidence: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    // Verificar que el ingrediente existe
    const ingredient = await ctx.db.get(args.ingredientId);
    if (!ingredient) {
      throw new Error("Ingrediente no encontrado");
    }

    // Verificar si ya existe este mapeo
    const existing = await ctx.db
      .query("dishIngredients")
      .withIndex("by_dish", (q) => q.eq("dishName", args.dishName))
      .collect();

    const duplicate = existing.find((m) => m.ingredientId === args.ingredientId);
    if (duplicate) {
      throw new Error("Este ingrediente ya está asociado a este plato");
    }

    const now = Date.now();
    return await ctx.db.insert("dishIngredients", {
      dishName: args.dishName,
      ingredientId: args.ingredientId,
      quantityPerServing: args.quantityPerServing,
      unit: args.unit,
      notes: args.notes,
      source: args.source || "manual",
      aiConfidence: args.aiConfidence,
      createdAt: now,
      updatedAt: now,
    });
  },
});

// Actualizar mapeo de ingrediente
export const updateDishIngredient = mutation({
  args: {
    id: v.id("dishIngredients"),
    dishName: v.optional(v.string()),
    ingredientId: v.optional(v.id("ingredients")),
    quantityPerServing: v.optional(v.number()),
    unit: v.optional(v.string()),
    notes: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const { id, ...updates } = args;

    // Si se está cambiando el ingrediente, verificar que existe
    if (updates.ingredientId) {
      const ingredient = await ctx.db.get(updates.ingredientId);
      if (!ingredient) {
        throw new Error("Ingrediente no encontrado");
      }
    }

    await ctx.db.patch(id, updates);
  },
});

// Eliminar mapeo de ingrediente
export const deleteDishIngredient = mutation({
  args: { id: v.id("dishIngredients") },
  handler: async (ctx, args) => {
    await ctx.db.delete(args.id);
  },
});

// Agregar múltiples ingredientes a un plato de una vez
export const bulkAddIngredientsForDish = mutation({
  args: {
    dishName: v.string(),
    ingredients: v.array(v.object({
      ingredientId: v.id("ingredients"),
      quantityPerServing: v.number(),
      unit: v.string(),
      notes: v.optional(v.string()),
      source: v.optional(v.union(
        v.literal("manual"),
        v.literal("ai-generated"),
        v.literal("ai-verified")
      )),
      aiConfidence: v.optional(v.number()),
    })),
  },
  handler: async (ctx, args) => {
    const now = Date.now();
    const ids = [];

    for (const ingredient of args.ingredients) {
      // Verificar que el ingrediente existe
      const ing = await ctx.db.get(ingredient.ingredientId);
      if (!ing) {
        throw new Error(`Ingrediente ${ingredient.ingredientId} no encontrado`);
      }

      const id = await ctx.db.insert("dishIngredients", {
        dishName: args.dishName,
        ingredientId: ingredient.ingredientId,
        quantityPerServing: ingredient.quantityPerServing,
        unit: ingredient.unit,
        notes: ingredient.notes,
        source: ingredient.source || "manual",
        aiConfidence: ingredient.aiConfidence,
        createdAt: now,
        updatedAt: now,
      });
      ids.push(id);
    }

    return { count: ids.length, ids };
  },
});

// Eliminar todos los ingredientes de un plato
export const deleteAllIngredientsForDish = mutation({
  args: { dishName: v.string() },
  handler: async (ctx, args) => {
    const mappings = await ctx.db
      .query("dishIngredients")
      .withIndex("by_dish", (q) => q.eq("dishName", args.dishName))
      .collect();

    for (const mapping of mappings) {
      await ctx.db.delete(mapping._id);
    }

    return { deleted: mappings.length };
  },
});

// ============== FUNCIONES PARA IA ==============

// Obtener mappings para múltiples platos (para caché de IA)
export const getMappingsForDishes = query({
  args: { dishNames: v.array(v.string()) },
  handler: async (ctx, args) => {
    const mappings = [];

    for (const dishName of args.dishNames) {
      const dishMappings = await ctx.db
        .query("dishIngredients")
        .withIndex("by_dish", (q) => q.eq("dishName", dishName))
        .collect();

      if (dishMappings.length > 0) {
        const ingredients = await Promise.all(
          dishMappings.map(async (m) => {
            const ingredient = await ctx.db.get(m.ingredientId);
            return {
              name: ingredient?.name || "",
              category: ingredient?.category || "Otros",
              quantityPerServing: m.quantityPerServing,
              unit: m.unit,
              confidence: m.aiConfidence || 100,
              notes: m.notes,
            };
          })
        );

        mappings.push({
          dishName,
          ingredients,
          source: dishMappings[0].source || "manual",
        });
      }
    }

    return mappings;
  },
});

// Crear mapping (versión simplificada para IA)
export const create = mutation({
  args: {
    dishName: v.string(),
    ingredientId: v.id("ingredients"),
    quantityPerServing: v.number(),
    unit: v.string(),
    source: v.union(
      v.literal("manual"),
      v.literal("ai-generated"),
      v.literal("ai-verified")
    ),
    aiConfidence: v.optional(v.number()),
    notes: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    return await ctx.db.insert("dishIngredients", {
      ...args,
      createdAt: Date.now(),
      updatedAt: Date.now(),
    });
  },
});
