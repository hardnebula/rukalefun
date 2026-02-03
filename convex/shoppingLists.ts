import { v } from "convex/values";
import { mutation, query, internalMutation } from "./_generated/server";

// ============== LISTAS DE COMPRAS ==============

// Obtener todas las listas de compras
export const getAllShoppingLists = query({
  handler: async (ctx) => {
    const lists = await ctx.db.query("shoppingLists").order("desc").collect();

    // Enriquecer con información del booking
    return await Promise.all(
      lists.map(async (list) => {
        const booking = await ctx.db.get(list.bookingId);
        return { ...list, booking };
      })
    );
  },
});

// Obtener listas por estado
export const getShoppingListsByStatus = query({
  args: { status: v.string() },
  handler: async (ctx, args) => {
    const lists = await ctx.db
      .query("shoppingLists")
      .withIndex("by_status", (q) => q.eq("status", args.status))
      .order("desc")
      .collect();

    return await Promise.all(
      lists.map(async (list) => {
        const booking = await ctx.db.get(list.bookingId);
        return { ...list, booking };
      })
    );
  },
});

// Obtener lista por booking
export const getShoppingListByBooking = query({
  args: { bookingId: v.id("bookings") },
  handler: async (ctx, args) => {
    const lists = await ctx.db
      .query("shoppingLists")
      .withIndex("by_booking", (q) => q.eq("bookingId", args.bookingId))
      .collect();

    if (lists.length === 0) {
      return null;
    }

    const list = lists[0]; // Tomar la primera (debería haber solo una por booking)
    const booking = await ctx.db.get(list.bookingId);
    return { ...list, booking };
  },
});

// Obtener detalles de una lista con items agrupados por categoría
export const getShoppingListDetails = query({
  args: { id: v.id("shoppingLists") },
  handler: async (ctx, args) => {
    const list = await ctx.db.get(args.id);
    if (!list) {
      throw new Error("Lista de compras no encontrada");
    }

    const booking = await ctx.db.get(list.bookingId);
    const items = await ctx.db
      .query("shoppingListItems")
      .withIndex("by_shopping_list", (q) => q.eq("shoppingListId", args.id))
      .collect();

    // Enriquecer items con información del ingrediente
    const enrichedItems = await Promise.all(
      items.map(async (item) => {
        if (item.ingredientId) {
          const ingredient = await ctx.db.get(item.ingredientId);
          return { ...item, ingredient };
        }
        return item;
      })
    );

    // Agrupar por categoría como array (evita problemas con caracteres especiales en keys)
    const categoryMap = new Map<string, typeof enrichedItems>();
    enrichedItems.forEach((item) => {
      if (!categoryMap.has(item.category)) {
        categoryMap.set(item.category, []);
      }
      categoryMap.get(item.category)!.push(item);
    });

    // Convertir a array de objetos para evitar caracteres acentuados como field names
    const itemsByCategory = Array.from(categoryMap.entries()).map(([category, categoryItems]) => ({
      category,
      items: categoryItems,
    }));

    return {
      ...list,
      booking,
      items: enrichedItems,
      itemsByCategory,
    };
  },
});

// Resumen de costos de una lista
export const getShoppingListCostSummary = query({
  args: { id: v.id("shoppingLists") },
  handler: async (ctx, args) => {
    const items = await ctx.db
      .query("shoppingListItems")
      .withIndex("by_shopping_list", (q) => q.eq("shoppingListId", args.id))
      .collect();

    const totalEstimated = items.reduce((sum, item) => sum + item.estimatedCost, 0);
    const totalActual = items.reduce(
      (sum, item) => sum + (item.actualCost || 0),
      0
    );
    const variance = totalActual - totalEstimated;
    const percentVariance =
      totalEstimated > 0 ? (variance / totalEstimated) * 100 : 0;

    // Por categoría
    const byCategory: Record<
      string,
      { estimated: number; actual: number; count: number }
    > = {};
    items.forEach((item) => {
      if (!byCategory[item.category]) {
        byCategory[item.category] = { estimated: 0, actual: 0, count: 0 };
      }
      byCategory[item.category].estimated += item.estimatedCost;
      byCategory[item.category].actual += item.actualCost || 0;
      byCategory[item.category].count += 1;
    });

    // Por proveedor
    const bySupplier: Record<
      string,
      { estimated: number; actual: number; count: number }
    > = {};
    items.forEach((item) => {
      if (!bySupplier[item.supplier]) {
        bySupplier[item.supplier] = { estimated: 0, actual: 0, count: 0 };
      }
      bySupplier[item.supplier].estimated += item.estimatedCost;
      bySupplier[item.supplier].actual += item.actualCost || 0;
      bySupplier[item.supplier].count += 1;
    });

    return {
      totalEstimated,
      totalActual,
      variance,
      percentVariance,
      byCategory: Object.entries(byCategory).map(([category, data]) => ({
        category,
        ...data,
      })),
      bySupplier: Object.entries(bySupplier).map(([supplier, data]) => ({
        supplier,
        ...data,
      })),
      itemCount: items.length,
      purchasedCount: items.filter((i) => i.isPurchased).length,
      pendingCount: items.filter((i) => !i.isPurchased).length,
    };
  },
});

// AUTO-GENERACIÓN: Generar lista de compras desde booking
export const generateShoppingListFromBooking = mutation({
  args: {
    bookingId: v.id("bookings"),
    bufferPercentage: v.optional(v.number()), // Default 10%
  },
  handler: async (ctx, args) => {
    const buffer = (args.bufferPercentage || 10) / 100;

    // 1. Obtener información del booking
    const booking = await ctx.db.get(args.bookingId);
    if (!booking) {
      throw new Error("Reserva no encontrada");
    }

    // 2. Obtener menú (PRIORIDAD: cotización vinculada > menú del booking)
    let menuSections: any;
    let generatedQuoteId = booking.generatedQuoteId;

    // PRIORIZAR menú de la cotización original si existe vinculación
    if (booking.generatedQuoteId) {
      const quote = await ctx.db.get(booking.generatedQuoteId);
      if (quote && quote.menuSections && quote.menuSections.length > 0) {
        menuSections = quote.menuSections;
        generatedQuoteId = quote._id;
      } else {
        // Fallback al menú del booking
        menuSections = booking.menuSections;
      }
    } else if (booking.menuSections && booking.menuSections.length > 0) {
      // No hay cotización vinculada, usar menú del booking
      menuSections = booking.menuSections;
    } else {
      // Último intento: buscar cotización por bookingId (legacy)
      const generatedQuotes = await ctx.db
        .query("generatedQuotes")
        .withIndex("by_booking", (q) => q.eq("bookingId", args.bookingId))
        .collect();

      if (generatedQuotes.length > 0) {
        const quote = generatedQuotes[0];
        menuSections = quote.menuSections;
        generatedQuoteId = quote._id;
      } else {
        throw new Error(
          "No se encontró un menú en esta reserva ni una cotización asociada. Crea una lista manual."
        );
      }
    }

    // 3. Extraer todos los platos únicos del menú
    const dishesSet = new Set<string>();
    menuSections.forEach((section: any) => {
      section.items.forEach((item: any) => {
        item.dishes.forEach((dish: string) => {
          dishesSet.add(dish);
        });
      });
    });

    const dishes = Array.from(dishesSet);

    // 4. Calcular ingredientes necesarios
    const ingredientMap: Record<
      string,
      {
        ingredientId: string;
        name: string;
        category: string;
        unit: string;
        quantity: number;
        supplier: string;
        costPerUnit: number;
        estimatedCost: number;
      }
    > = {};

    let unmappedDishes: string[] = [];

    for (const dishName of dishes) {
      // Obtener la receta del plato
      const dishIngredients = await ctx.db
        .query("dishIngredients")
        .withIndex("by_dish", (q) => q.eq("dishName", dishName))
        .collect();

      if (dishIngredients.length === 0) {
        unmappedDishes.push(dishName);
        continue;
      }

      // Calcular cantidad de cada ingrediente
      for (const dishIngredient of dishIngredients) {
        const ingredient = await ctx.db.get(dishIngredient.ingredientId);
        if (!ingredient) continue;

        const quantity =
          dishIngredient.quantityPerServing *
          booking.numberOfGuests *
          (1 + buffer);

        const key = dishIngredient.ingredientId;

        if (ingredientMap[key]) {
          // Agregar a cantidad existente
          ingredientMap[key].quantity += quantity;
          ingredientMap[key].estimatedCost =
            ingredientMap[key].quantity * ingredient.costPerUnit;
        } else {
          // Nuevo ingrediente
          ingredientMap[key] = {
            ingredientId: dishIngredient.ingredientId,
            name: ingredient.name,
            category: ingredient.category,
            unit: dishIngredient.unit,
            quantity: quantity,
            supplier: ingredient.supplier,
            costPerUnit: ingredient.costPerUnit,
            estimatedCost: quantity * ingredient.costPerUnit,
          };
        }
      }
    }

    // 5. Calcular costo total
    const totalCost = Object.values(ingredientMap).reduce(
      (sum, item) => sum + item.estimatedCost,
      0
    );

    // 6. Crear registro de lista de compras
    const now = Date.now();
    const notes =
      unmappedDishes.length > 0
        ? `Platos sin mapeo de ingredientes: ${unmappedDishes.join(", ")}`
        : undefined;

    const shoppingListId = await ctx.db.insert("shoppingLists", {
      bookingId: args.bookingId,
      generatedQuoteId: generatedQuoteId,
      eventName: `${booking.eventType} - ${booking.clientName}`,
      eventDate: booking.eventDate,
      numberOfGuests: booking.numberOfGuests,
      status: "draft",
      totalEstimatedCost: totalCost,
      notes: notes,
      createdAt: now,
      updatedAt: now,
    });

    // 7. Crear items de la lista (batch)
    for (const item of Object.values(ingredientMap)) {
      await ctx.db.insert("shoppingListItems", {
        shoppingListId,
        ingredientId: item.ingredientId as any,
        itemName: item.name,
        category: item.category,
        unit: item.unit,
        quantityNeeded: item.quantity,
        quantityOrdered: item.quantity,
        estimatedCost: item.estimatedCost,
        supplier: item.supplier,
        isPurchased: false,
        isManualItem: false,
        createdAt: now,
        updatedAt: now,
      });
    }

    return {
      shoppingListId,
      itemsGenerated: Object.keys(ingredientMap).length,
      unmappedDishes: unmappedDishes,
    };
  },
});

// Crear lista manual
export const createManualShoppingList = mutation({
  args: {
    bookingId: v.id("bookings"),
    eventName: v.string(),
    eventDate: v.string(),
    numberOfGuests: v.number(),
  },
  handler: async (ctx, args) => {
    const now = Date.now();
    return await ctx.db.insert("shoppingLists", {
      ...args,
      generatedQuoteId: undefined,
      status: "draft",
      totalEstimatedCost: 0,
      createdAt: now,
      updatedAt: now,
    });
  },
});

// Crear lista desde cero (sin booking asociado)
export const createBlankShoppingList = mutation({
  args: {
    eventName: v.string(),
    eventDate: v.string(),
    numberOfGuests: v.number(),
    notes: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    // Crear un booking dummy para mantener la integridad referencial
    const now = Date.now();
    const dummyBookingId = await ctx.db.insert("bookings", {
      spaceId: undefined,
      generatedQuoteId: undefined,
      clientName: "Lista Manual",
      clientEmail: "manual@rukalefun.com",
      clientPhone: "000000000",
      eventType: args.eventName,
      eventDate: args.eventDate,
      startTime: "00:00",
      endTime: "23:59",
      numberOfGuests: args.numberOfGuests,
      estimatedGuests: args.numberOfGuests,
      status: "draft",
      totalAmount: 0,
      depositPaid: 0,
      balanceRemaining: 0,
      services: [],
      notes: "Booking creado automáticamente para lista de compras manual",
      createdAt: now,
      updatedAt: now,
    });

    const listId = await ctx.db.insert("shoppingLists", {
      bookingId: dummyBookingId,
      generatedQuoteId: undefined,
      eventName: args.eventName,
      eventDate: args.eventDate,
      numberOfGuests: args.numberOfGuests,
      status: "draft",
      totalEstimatedCost: 0,
      notes: args.notes,
      createdBy: "manual",
      createdAt: now,
      updatedAt: now,
    });

    return listId;
  },
});

// Actualizar estado de la lista
export const updateShoppingListStatus = mutation({
  args: {
    id: v.id("shoppingLists"),
    status: v.string(),
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

// Agregar item manual a la lista
export const addManualItem = mutation({
  args: {
    shoppingListId: v.id("shoppingLists"),
    itemName: v.string(),
    category: v.string(),
    unit: v.string(),
    quantity: v.number(),
    supplier: v.string(),
    estimatedCost: v.number(),
    costType: v.optional(v.string()),
    costPerUnit: v.optional(v.number()),
    notes: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const now = Date.now();
    const itemId = await ctx.db.insert("shoppingListItems", {
      shoppingListId: args.shoppingListId,
      ingredientId: undefined,
      itemName: args.itemName,
      category: args.category,
      unit: args.unit,
      quantityNeeded: args.quantity,
      quantityOrdered: args.quantity,
      estimatedCost: args.estimatedCost,
      costType: args.costType,
      costPerUnit: args.costPerUnit,
      supplier: args.supplier,
      isPurchased: false,
      notes: args.notes,
      isManualItem: true,
      createdAt: now,
      updatedAt: now,
    });

    // Actualizar costo total de la lista
    await updateListTotalCost(ctx, args.shoppingListId);

    return itemId;
  },
});

// Actualizar item de lista
export const updateShoppingListItem = mutation({
  args: {
    id: v.id("shoppingListItems"),
    quantityOrdered: v.optional(v.number()),
    estimatedCost: v.optional(v.number()),
    costType: v.optional(v.string()),
    costPerUnit: v.optional(v.number()),
    actualCost: v.optional(v.number()),
    supplier: v.optional(v.string()),
    notes: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const { id, ...updates } = args;
    const item = await ctx.db.get(id);
    if (!item) {
      throw new Error("Item no encontrado");
    }

    await ctx.db.patch(id, {
      ...updates,
      updatedAt: Date.now(),
    });

    // Actualizar costo total de la lista
    await updateListTotalCost(ctx, item.shoppingListId);
  },
});

// Marcar item como comprado
export const markItemAsPurchased = mutation({
  args: {
    id: v.id("shoppingListItems"),
    actualCost: v.optional(v.number()),
    purchasedDate: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const item = await ctx.db.get(args.id);
    if (!item) {
      throw new Error("Item no encontrado");
    }

    await ctx.db.patch(args.id, {
      isPurchased: true,
      actualCost: args.actualCost || item.estimatedCost,
      purchasedDate: args.purchasedDate || new Date().toISOString().split("T")[0],
      updatedAt: Date.now(),
    });

    // Actualizar costo total de la lista
    await updateListTotalCost(ctx, item.shoppingListId);
  },
});

// Desmarcar item como comprado
export const unmarkItemAsPurchased = mutation({
  args: {
    id: v.id("shoppingListItems"),
  },
  handler: async (ctx, args) => {
    const item = await ctx.db.get(args.id);
    if (!item) {
      throw new Error("Item no encontrado");
    }

    await ctx.db.patch(args.id, {
      isPurchased: false,
      actualCost: undefined,
      purchasedDate: undefined,
      updatedAt: Date.now(),
    });

    // Actualizar costo total de la lista
    await updateListTotalCost(ctx, item.shoppingListId);
  },
});

// Eliminar item de lista
export const deleteShoppingListItem = mutation({
  args: { id: v.id("shoppingListItems") },
  handler: async (ctx, args) => {
    const item = await ctx.db.get(args.id);
    if (!item) {
      throw new Error("Item no encontrado");
    }

    const shoppingListId = item.shoppingListId;
    await ctx.db.delete(args.id);

    // Actualizar costo total de la lista
    await updateListTotalCost(ctx, shoppingListId);
  },
});

// Completar lista de compras (actualiza inventario)
export const completeShoppingList = mutation({
  args: { id: v.id("shoppingLists") },
  handler: async (ctx, args) => {
    const list = await ctx.db.get(args.id);
    if (!list) {
      throw new Error("Lista no encontrada");
    }

    // Obtener todos los items
    const items = await ctx.db
      .query("shoppingListItems")
      .withIndex("by_shopping_list", (q) => q.eq("shoppingListId", args.id))
      .collect();

    // Actualizar inventario (solo items con ingredientId)
    const lowStockWarnings: string[] = [];

    for (const item of items) {
      if (item.ingredientId && !item.isManualItem) {
        const ingredient = await ctx.db.get(item.ingredientId);
        if (ingredient) {
          const quantityToSubtract = item.quantityOrdered || item.quantityNeeded;
          const newStock = ingredient.currentStock - quantityToSubtract;

          if (newStock < 0) {
            throw new Error(
              `Stock insuficiente para ${ingredient.name}. Stock actual: ${ingredient.currentStock}, necesario: ${quantityToSubtract}`
            );
          }

          await ctx.db.patch(item.ingredientId, {
            currentStock: newStock,
            updatedAt: Date.now(),
          });

          // Verificar stock bajo
          if (newStock <= ingredient.minStock) {
            lowStockWarnings.push(
              `${ingredient.name}: ${newStock} ${ingredient.unit} (mínimo: ${ingredient.minStock})`
            );
          }
        }
      }
    }

    // Actualizar estado de la lista
    await ctx.db.patch(args.id, {
      status: "completed",
      updatedAt: Date.now(),
    });

    return {
      success: true,
      lowStockWarnings,
    };
  },
});

// Eliminar lista de compras
export const deleteShoppingList = mutation({
  args: { id: v.id("shoppingLists") },
  handler: async (ctx, args) => {
    // Eliminar todos los items primero
    const items = await ctx.db
      .query("shoppingListItems")
      .withIndex("by_shopping_list", (q) => q.eq("shoppingListId", args.id))
      .collect();

    for (const item of items) {
      await ctx.db.delete(item._id);
    }

    // Eliminar la lista
    await ctx.db.delete(args.id);
  },
});

// Actualizar resultados de auditoría (internal - solo llamado desde acciones)
export const updateAuditResults = internalMutation({
  args: {
    id: v.id("shoppingLists"),
    auditFlags: v.array(v.object({
      severity: v.union(v.literal("LOW"), v.literal("MEDIUM"), v.literal("HIGH")),
      title: v.string(),
      description: v.string(),
    })),
    auditStatus: v.union(v.literal("GREEN"), v.literal("YELLOW"), v.literal("RED")),
    auditedAt: v.number(),
    auditModel: v.string(),
  },
  handler: async (ctx, args) => {
    const { id, ...updates } = args;
    await ctx.db.patch(id, {
      ...updates,
      updatedAt: Date.now(),
    });
  },
});

// Función auxiliar para actualizar el costo total de la lista
async function updateListTotalCost(
  ctx: any,
  shoppingListId: string
) {
  const items = await ctx.db
    .query("shoppingListItems")
    .withIndex("by_shopping_list", (q: any) => q.eq("shoppingListId", shoppingListId as any))
    .collect();

  const totalCost = items.reduce((sum: number, item: any) => sum + item.estimatedCost, 0);

  await ctx.db.patch(shoppingListId as any, {
    totalEstimatedCost: totalCost,
    updatedAt: Date.now(),
  });
}

// ============== CREAR LISTA DESDE RESULTADOS DE IA ==============

export const createShoppingListFromAI = mutation({
  args: {
    bookingId: v.id("bookings"),
    ingredients: v.array(v.object({
      name: v.string(),
      category: v.string(),
      unit: v.string(),
      quantity: v.number(),
      dishes: v.array(v.string()),
      source: v.string(),
      confidence: v.optional(v.number()),
    })),
    saveMappings: v.optional(v.boolean()), // Si guardar mappings para futura reutilización
  },
  handler: async (ctx, args) => {
    const booking = await ctx.db.get(args.bookingId);
    if (!booking) {
      throw new Error("Booking no encontrado");
    }

    // 1. Crear la shopping list
    const shoppingListId = await ctx.db.insert("shoppingLists", {
      bookingId: args.bookingId,
      eventName: `${booking.clientName} - ${booking.eventType}`,
      eventDate: booking.eventDate,
      numberOfGuests: booking.numberOfGuests,
      status: "draft",
      totalEstimatedCost: 0,
      notes: "Generada automáticamente con IA",
      createdBy: "IA",
      createdAt: Date.now(),
      updatedAt: Date.now(),
    });

    // 2. Crear los items de la lista
    let totalCost = 0;

    for (const ing of args.ingredients) {
      // Buscar o crear el ingrediente
      let ingredient = await ctx.db
        .query("ingredients")
        .filter((q) => q.eq(q.field("name"), ing.name))
        .first();

      let ingredientId = ingredient?._id;

      if (!ingredient) {
        // Crear nuevo ingrediente
        ingredientId = await ctx.db.insert("ingredients", {
          name: ing.name,
          category: ing.category,
          unit: ing.unit,
          costPerUnit: 0, // El admin deberá actualizarlo
          supplier: "Por definir",
          currentStock: 0,
          minStock: 0,
          isActive: true,
          createdAt: Date.now(),
          updatedAt: Date.now(),
        });
      }

      const estimatedCost = (ingredient?.costPerUnit || 0) * ing.quantity;
      totalCost += estimatedCost;

      // Crear item en la lista
      await ctx.db.insert("shoppingListItems", {
        shoppingListId,
        ingredientId,
        itemName: ing.name,
        category: ing.category,
        unit: ing.unit,
        quantityNeeded: ing.quantity,
        estimatedCost,
        supplier: ingredient?.supplier || "Por definir",
        isPurchased: false,
        isManualItem: false,
        createdAt: Date.now(),
        updatedAt: Date.now(),
      });

      // 3. Guardar mappings si se solicitó
      if (args.saveMappings && ingredientId && ing.dishes.length > 0) {
        for (const dishName of ing.dishes) {
          // Verificar si ya existe el mapping
          const existing = await ctx.db
            .query("dishIngredients")
            .withIndex("by_dish", (q) => q.eq("dishName", dishName))
            .filter((q) => q.eq(q.field("ingredientId"), ingredientId))
            .first();

          if (!existing) {
            // Calcular cantidad por porción
            const quantityPerServing = ing.quantity / booking.numberOfGuests;

            await ctx.db.insert("dishIngredients", {
              dishName,
              ingredientId,
              quantityPerServing,
              unit: ing.unit,
              source: ing.source === "ai-generated" ? "ai-generated" : "manual",
              aiConfidence: ing.confidence,
              notes: `Generado automáticamente por IA`,
              createdAt: Date.now(),
              updatedAt: Date.now(),
            });
          }
        }
      }
    }

    // 4. Actualizar el costo total de la lista
    await ctx.db.patch(shoppingListId, {
      totalEstimatedCost: totalCost,
    });

    return shoppingListId;
  },
});
