import { v } from "convex/values";
import { action, internalMutation, internalQuery } from "./_generated/server";
import { api, internal } from "./_generated/api";
import OpenAI from "openai";

// Configurar OpenAI SDK para usar OpenRouter
const openai = new OpenAI({
  apiKey: process.env.OPENROUTER_API_KEY,
  baseURL: "https://openrouter.ai/api/v1",
  defaultHeaders: {
    "HTTP-Referer": "https://rukalefun.com",
    "X-Title": "Rukalefun Event Management",
  },
});

// AUDIT SYSTEM PROMPT
const AUDIT_SYSTEM_PROMPT = `Eres Ruka AI, un Auditor de Operaciones de Eventos para un centro de eventos profesional.

Tu rol NO ES generar contenido o listas de compras.
Tu rol ES detectar riesgos operacionales, omisiones e inconsistencias en datos de eventos existentes.

Debes analizar los datos proporcionados de manera objetiva y conservadora.

ÁREAS DE ENFOQUE:
- Eventos con costos estimados faltantes o en cero
- Listas de compras incompletas o vacías
- Falta de suministros operacionales básicos (hielo, vasos, servilletas, desechables)
- Inconsistencias entre:
  - número de invitados
  - duración del evento
  - estilo de servicio
  - configuración del menú
- Eventos próximos con items operacionales sin resolver

REGLAS ESTRICTAS:
- NO crees nuevos items.
- NO estimes cantidades.
- NO modifiques datos.
- NO sugieras compras.
- NO expliques teoría.
- NO uses lenguaje conversacional.

REQUISITOS DE SALIDA:
- Si se encuentran problemas, retorna una lista de flags de auditoría.
- Cada flag debe incluir:
  - severity: LOW | MEDIUM | HIGH
  - title: corto y preciso (en español)
  - description: una oración concisa explicando el riesgo (en español)

- Si no se detectan problemas, responde exactamente:
  "No se detectaron problemas operacionales."

TONO:
Profesional, neutral, factual.

IDIOMA:
Todos los títulos y descripciones deben estar en ESPAÑOL.`;

// ============== ACTION: AUDIT SHOPPING LIST ==============
export const auditShoppingList = action({
  args: {
    shoppingListId: v.id("shoppingLists"),
  },
  handler: async (ctx, args) => {
    // 1. Get shopping list details
    const list: any = await ctx.runQuery(api.shoppingLists.getShoppingListDetails, {
      id: args.shoppingListId,
    });

    if (!list) {
      throw new Error("Lista de compras no encontrada");
    }

    // 2. Get booking details
    const booking: any = await ctx.runQuery(api.bookings.getBooking, {
      id: list.bookingId,
    });

    if (!booking) {
      throw new Error("Evento no encontrado");
    }

    // 3. Prepare audit data payload
    const eventData = {
      id: booking._id,
      name: booking.eventType,
      clientName: booking.clientName,
      date: booking.eventDate,
      guestCount: booking.numberOfGuests,
      estimatedGuests: booking.estimatedGuests,
      durationHours: calculateEventDuration(booking.startTime, booking.endTime),
      serviceStyle: booking.services || [],
      estimatedCost: booking.totalAmount || 0,
    };

    const menuData = booking.menuSections ? {
      sections: booking.menuSections.length,
      totalDishes: booking.menuSections.reduce((sum: number, section: any) => {
        return sum + section.items.reduce((s: number, item: any) => s + item.dishes.length, 0);
      }, 0),
      categories: booking.menuSections.map((s: any) => s.name),
    } : null;

    const shoppingListData = {
      itemCount: list.items?.length || 0,
      totalEstimatedCost: list.totalEstimatedCost || 0,
      categories: Object.keys(list.itemsByCategory || {}),
      purchasedCount: list.items?.filter((i: any) => i.isPurchased).length || 0,
      pendingCount: list.items?.filter((i: any) => !i.isPurchased).length || 0,
    };

    // 4. Build audit prompt
    const userPrompt = `Analiza este evento y lista de compras para detectar riesgos operacionales:

DATOS DEL EVENTO:
- Nombre: ${eventData.name}
- Cliente: ${eventData.clientName}
- Fecha: ${eventData.date}
- Invitados: ${eventData.guestCount} (estimados: ${eventData.estimatedGuests})
- Duración: ${eventData.durationHours} horas
- Servicios: ${eventData.serviceStyle.join(", ") || "Ninguno especificado"}
- Costo Estimado: $${eventData.estimatedCost}

DATOS DEL MENÚ:
${menuData ? `- Secciones: ${menuData.sections}
- Total de Platos: ${menuData.totalDishes}
- Categorías: ${menuData.categories.join(", ")}` : "- No hay menú configurado"}

DATOS DE LISTA DE COMPRAS:
- Total de Items: ${shoppingListData.itemCount}
- Costo Estimado: $${shoppingListData.totalEstimatedCost}
- Categorías: ${shoppingListData.categories.join(", ") || "Ninguna"}
- Comprados: ${shoppingListData.purchasedCount}
- Pendientes: ${shoppingListData.pendingCount}

Retorna JSON ESTRICTO con esta estructura (títulos y descripciones en ESPAÑOL):
{
  "issues": [
    {
      "severity": "LOW" | "MEDIUM" | "HIGH",
      "title": "Título corto en español",
      "description": "Descripción de una oración en español"
    }
  ]
}

Si no hay problemas, retorna:
{
  "issues": []
}`;

    // 5. Call AI for audit
    let auditFlags: any[] = [];
    let auditStatus: "GREEN" | "YELLOW" | "RED" = "GREEN";

    try {
      const completion = await openai.chat.completions.create({
        model: "deepseek/deepseek-chat",
        messages: [
          { role: "system", content: AUDIT_SYSTEM_PROMPT },
          { role: "user", content: userPrompt },
        ],
        temperature: 0.1, // Low temperature for consistent, conservative auditing
        max_tokens: 2000,
        response_format: { type: "json_object" },
      });

      const content = completion.choices[0]?.message?.content;
      if (!content) {
        throw new Error("AI did not return content");
      }

      const aiResponse = JSON.parse(content);
      auditFlags = aiResponse.issues || [];

      // Determine audit status based on severity
      const hasHigh = auditFlags.some((flag: any) => flag.severity === "HIGH");
      const hasMediumOrLow = auditFlags.some((flag: any) =>
        flag.severity === "MEDIUM" || flag.severity === "LOW"
      );

      if (hasHigh) {
        auditStatus = "RED";
      } else if (hasMediumOrLow) {
        auditStatus = "YELLOW";
      } else {
        auditStatus = "GREEN";
      }

      // 6. Save audit results to database
      await ctx.runMutation(internal.shoppingLists.updateAuditResults, {
        id: args.shoppingListId,
        auditFlags: auditFlags,
        auditStatus: auditStatus,
        auditedAt: Date.now(),
        auditModel: "deepseek/deepseek-chat",
      });

      return {
        success: true,
        auditStatus,
        issuesFound: auditFlags.length,
        issues: auditFlags,
      };

    } catch (error: any) {
      console.error("Error during audit:", error);
      throw new Error(`Audit failed: ${error.message}`);
    }
  },
});

// Helper function to calculate event duration in hours
function calculateEventDuration(startTime: string, endTime: string): number {
  try {
    const [startHour, startMin] = startTime.split(":").map(Number);
    const [endHour, endMin] = endTime.split(":").map(Number);

    const startMinutes = startHour * 60 + startMin;
    const endMinutes = endHour * 60 + endMin;

    return Math.round((endMinutes - startMinutes) / 60 * 10) / 10; // Round to 1 decimal
  } catch {
    return 0;
  }
}
