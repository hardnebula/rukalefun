import { v } from "convex/values";
import { action } from "./_generated/server";
import { api } from "./_generated/api";
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

// ============== SYSTEM PROMPTS ==============

const EVENT_ASSISTANT_PROMPT = `Eres Ruka AI, el Asistente Inteligente de Planificación de Eventos para Ruka Lefún.

Tu rol es ayudar a organizar y planificar eventos de manera profesional y detallada.

CARACTERÍSTICAS:
- Eres experto en eventos sociales y corporativos en Chile
- Conoces las mejores prácticas de la industria de eventos
- Eres detallado, organizado y práctico
- Generas contenido accionable y útil
- Usas un tono profesional pero amigable

IDIOMA: Español chileno

FORMATO: Siempre retornas JSON estructurado según lo solicitado.`;

// ============== ACTION 1: GENERAR LISTA DE COMPRAS ==============

export const generateShoppingList = action({
  args: {
    bookingId: v.id("bookings"),
  },
  handler: async (ctx, args) => {
    // 1. Obtener datos del evento
    const booking: any = await ctx.runQuery(api.bookings.getBooking, {
      id: args.bookingId,
    });

    if (!booking) {
      throw new Error("Evento no encontrado");
    }

    // 2. Preparar prompt
    const menuInfo = booking.menuSections
      ? booking.menuSections.map((section: any) => {
          return `${section.name}:\n${section.items
            .map((item: any) => `  - ${item.category}: ${item.dishes.join(", ")}`)
            .join("\n")}`;
        }).join("\n\n")
      : "No hay menú configurado";

    const userPrompt = `Genera una lista de compras completa y detallada para este evento:

INFORMACIÓN DEL EVENTO:
- Tipo: ${booking.eventType}
- Fecha: ${booking.eventDate}
- Horario: ${booking.startTime} - ${booking.endTime}
- Número de invitados: ${booking.numberOfGuests}
- Invitados estimados: ${booking.estimatedGuests}
- Servicios contratados: ${booking.services?.join(", ") || "Ninguno"}
- Solicitudes especiales: ${booking.specialRequests || "Ninguna"}

MENÚ DEL EVENTO:
${menuInfo}

INSTRUCCIONES:
1. Analiza el menú y calcula ingredientes necesarios para ${booking.numberOfGuests} personas
2. Incluye items operacionales (hielo, vasos, servilletas, desechables, etc.)
3. Considera el tipo de evento y sus necesidades específicas
4. Organiza por categorías lógicas
5. Sugiere cantidades aproximadas basadas en la experiencia de la industria

Retorna JSON con esta estructura:
{
  "categories": [
    {
      "name": "Nombre de categoría",
      "items": [
        {
          "name": "Nombre del item",
          "quantity": "Cantidad estimada",
          "unit": "Unidad (kg, unidades, litros, etc.)",
          "priority": "HIGH | MEDIUM | LOW",
          "notes": "Notas adicionales si aplica"
        }
      ]
    }
  ],
  "summary": {
    "totalItems": 0,
    "estimatedBudget": "Estimación muy general si es posible",
    "notes": "Notas generales sobre la lista"
  }
}`;

    try {
      const completion = await openai.chat.completions.create({
        model: "deepseek/deepseek-chat",
        messages: [
          { role: "system", content: EVENT_ASSISTANT_PROMPT },
          { role: "user", content: userPrompt },
        ],
        temperature: 0.3,
        max_tokens: 4000,
        response_format: { type: "json_object" },
      });

      const content = completion.choices[0]?.message?.content;
      if (!content) {
        throw new Error("AI no retornó contenido");
      }

      const result = JSON.parse(content);
      return {
        success: true,
        data: result,
      };
    } catch (error: any) {
      console.error("Error generando lista de compras:", error);
      throw new Error(`Error: ${error.message}`);
    }
  },
});

// ============== ACTION 2: GENERAR CRONOLOGÍA DEL EVENTO ==============

export const generateEventTimeline = action({
  args: {
    bookingId: v.id("bookings"),
  },
  handler: async (ctx, args) => {
    const booking: any = await ctx.runQuery(api.bookings.getBooking, {
      id: args.bookingId,
    });

    if (!booking) {
      throw new Error("Evento no encontrado");
    }

    const userPrompt = `Crea una cronología detallada y profesional para este evento:

INFORMACIÓN DEL EVENTO:
- Tipo: ${booking.eventType}
- Fecha: ${booking.eventDate}
- Horario del evento: ${booking.startTime} - ${booking.endTime}
- Número de invitados: ${booking.numberOfGuests}
- Servicios: ${booking.services?.join(", ") || "Ninguno"}

INSTRUCCIONES:
1. Crea un timeline completo desde preparación hasta cierre
2. Incluye:
   - Preparación del espacio (2-3 horas antes)
   - Llegada del personal
   - Montaje de mesas y decoración
   - Preparación de cocina
   - Recepción de invitados
   - Servicio de comida/bebidas
   - Actividades principales
   - Limpieza y cierre
3. Sé específico con los horarios
4. Adapta al tipo de evento (boda, corporativo, cumpleaños, etc.)

Retorna JSON con esta estructura:
{
  "timeline": [
    {
      "time": "HH:MM",
      "title": "Título de la actividad",
      "description": "Descripción breve",
      "responsible": "Quién se encarga (Personal, Garzones, DJ, etc.)",
      "duration": "Duración estimada en minutos",
      "priority": "HIGH | MEDIUM | LOW"
    }
  ],
  "summary": {
    "totalDuration": "Duración total en horas",
    "criticalMoments": ["Momento 1", "Momento 2"],
    "notes": "Notas generales del timeline"
  }
}`;

    try {
      const completion = await openai.chat.completions.create({
        model: "deepseek/deepseek-chat",
        messages: [
          { role: "system", content: EVENT_ASSISTANT_PROMPT },
          { role: "user", content: userPrompt },
        ],
        temperature: 0.4,
        max_tokens: 3000,
        response_format: { type: "json_object" },
      });

      const content = completion.choices[0]?.message?.content;
      if (!content) {
        throw new Error("AI no retornó contenido");
      }

      const result = JSON.parse(content);
      return {
        success: true,
        data: result,
      };
    } catch (error: any) {
      console.error("Error generando cronología:", error);
      throw new Error(`Error: ${error.message}`);
    }
  },
});

// ============== ACTION 3: CHECKLIST DE DETALLES PENDIENTES ==============

export const generateEventChecklist = action({
  args: {
    bookingId: v.id("bookings"),
  },
  handler: async (ctx, args) => {
    const booking: any = await ctx.runQuery(api.bookings.getBooking, {
      id: args.bookingId,
    });

    if (!booking) {
      throw new Error("Evento no encontrado");
    }

    // Verificar asignaciones de personal
    const staffAssignments: any = await ctx.runQuery(
      api.staff.getAssignmentsByBooking,
      { bookingId: args.bookingId }
    );

    // Verificar lista de compras
    const shoppingList: any = await ctx.runQuery(
      api.shoppingLists.getShoppingListByBooking,
      { bookingId: args.bookingId }
    );

    const userPrompt = `Analiza este evento y genera un checklist completo de detalles pendientes y confirmaciones necesarias:

INFORMACIÓN DEL EVENTO:
- Tipo: ${booking.eventType}
- Fecha: ${booking.eventDate}
- Horario: ${booking.startTime} - ${booking.endTime}
- Invitados: ${booking.numberOfGuests}
- Estado: ${booking.status}
- Servicios: ${booking.services?.join(", ") || "Ninguno"}
- Total: $${booking.totalAmount}
- Depósito pagado: $${booking.depositPaid}
- Balance restante: $${booking.balanceRemaining}

PERSONAL ASIGNADO:
${staffAssignments && staffAssignments.length > 0
  ? staffAssignments.map((a: any) => `- ${a.staff?.name} (${a.role})`).join("\n")
  : "- No hay personal asignado aún"}

LISTA DE COMPRAS:
${shoppingList
  ? `- ${shoppingList.items?.length || 0} items, $${shoppingList.totalEstimatedCost || 0} estimado`
  : "- No hay lista de compras creada"}

MENÚ:
${booking.menuSections?.length > 0 ? "Configurado" : "No configurado"}

INSTRUCCIONES:
1. Identifica qué está completo y qué falta
2. Genera un checklist organizado por categorías
3. Marca prioridades
4. Sugiere fechas límite para tareas pendientes

Retorna JSON con esta estructura:
{
  "categories": [
    {
      "name": "Categoría (Ej: Pagos, Personal, Logística, etc.)",
      "items": [
        {
          "task": "Descripción de la tarea",
          "status": "DONE | PENDING | MISSING",
          "priority": "HIGH | MEDIUM | LOW",
          "deadline": "Fecha sugerida o null",
          "notes": "Notas adicionales"
        }
      ]
    }
  ],
  "summary": {
    "totalTasks": 0,
    "completed": 0,
    "pending": 0,
    "missing": 0,
    "overallReadiness": "Porcentaje estimado de preparación",
    "criticalIssues": ["Lista de issues críticos si los hay"]
  }
}`;

    try {
      const completion = await openai.chat.completions.create({
        model: "deepseek/deepseek-chat",
        messages: [
          { role: "system", content: EVENT_ASSISTANT_PROMPT },
          { role: "user", content: userPrompt },
        ],
        temperature: 0.2,
        max_tokens: 3000,
        response_format: { type: "json_object" },
      });

      const content = completion.choices[0]?.message?.content;
      if (!content) {
        throw new Error("AI no retornó contenido");
      }

      const result = JSON.parse(content);
      return {
        success: true,
        data: result,
      };
    } catch (error: any) {
      console.error("Error generando checklist:", error);
      throw new Error(`Error: ${error.message}`);
    }
  },
});

// ============== ACTION 4: RESUMEN EJECUTIVO ==============

export const generateEventSummary = action({
  args: {
    bookingId: v.id("bookings"),
  },
  handler: async (ctx, args) => {
    const booking: any = await ctx.runQuery(api.bookings.getBooking, {
      id: args.bookingId,
    });

    if (!booking) {
      throw new Error("Evento no encontrado");
    }

    const staffAssignments: any = await ctx.runQuery(
      api.staff.getAssignmentsByBooking,
      { bookingId: args.bookingId }
    );

    const userPrompt = `Genera un resumen ejecutivo profesional y completo de este evento:

DATOS DEL EVENTO:
- Tipo: ${booking.eventType}
- Cliente: ${booking.clientName}
- Email: ${booking.clientEmail}
- Teléfono: ${booking.clientPhone}
- Fecha: ${booking.eventDate}
- Horario: ${booking.startTime} - ${booking.endTime}
- Invitados: ${booking.numberOfGuests} (estimados: ${booking.estimatedGuests})
- Estado: ${booking.status}

FINANCIERO:
- Total: $${booking.totalAmount}
- Depósito: $${booking.depositPaid}
- Balance: $${booking.balanceRemaining}

SERVICIOS:
${booking.services?.join(", ") || "Ninguno"}

PERSONAL ASIGNADO:
${staffAssignments && staffAssignments.length > 0
  ? staffAssignments.map((a: any) => `- ${a.staff?.name} (${a.role}) - $${a.amountToPay}`).join("\n")
  : "No hay personal asignado"}

MENÚ:
${booking.menuSections
  ? booking.menuSections.map((s: any) => s.name).join(", ")
  : "No configurado"}

SOLICITUDES ESPECIALES:
${booking.specialRequests || "Ninguna"}

INSTRUCCIONES:
Genera un resumen ejecutivo profesional que incluya:
1. Overview del evento
2. Detalles logísticos clave
3. Resumen financiero
4. Equipo asignado
5. Consideraciones especiales
6. Próximos pasos o recordatorios

Retorna JSON con esta estructura:
{
  "overview": "Párrafo resumen del evento",
  "logistics": {
    "venue": "Ruka Lefún",
    "date": "Fecha formateada",
    "time": "Horario",
    "guestCount": 0,
    "duration": "Duración en horas"
  },
  "financial": {
    "total": 0,
    "paid": 0,
    "pending": 0,
    "status": "Estado de pagos"
  },
  "team": [
    {
      "name": "Nombre",
      "role": "Rol",
      "cost": 0
    }
  ],
  "highlights": ["Punto destacado 1", "Punto 2"],
  "considerations": ["Consideración 1", "Consideración 2"],
  "nextSteps": ["Paso 1", "Paso 2"]
}`;

    try {
      const completion = await openai.chat.completions.create({
        model: "deepseek/deepseek-chat",
        messages: [
          { role: "system", content: EVENT_ASSISTANT_PROMPT },
          { role: "user", content: userPrompt },
        ],
        temperature: 0.3,
        max_tokens: 3000,
        response_format: { type: "json_object" },
      });

      const content = completion.choices[0]?.message?.content;
      if (!content) {
        throw new Error("AI no retornó contenido");
      }

      const result = JSON.parse(content);
      return {
        success: true,
        data: result,
      };
    } catch (error: any) {
      console.error("Error generando resumen:", error);
      throw new Error(`Error: ${error.message}`);
    }
  },
});
