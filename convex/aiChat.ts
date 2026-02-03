import { v } from "convex/values";
import { action, query } from "./_generated/server";
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

const CHAT_SYSTEM_PROMPT = `Eres Ruka AI, el asistente inteligente de Ruka Lefún, un centro de eventos ubicado en Villarrica, Chile.

CAPACIDADES:
- Responder preguntas sobre eventos, reservas y cotizaciones
- Proporcionar estadísticas del negocio
- Ayudar con información de clientes
- Dar recomendaciones operativas
- Resumir información de eventos específicos
- Informar sobre menús de eventos (platos, secciones, categorías)
- Detallar servicios contratados para cada evento

CONTEXTO DEL NEGOCIO (datos actualizados en tiempo real):
{businessContext}

INSTRUCCIONES:
- Responde en español chileno, de forma concisa, profesional y útil
- NO uses formato markdown (asteriscos, guiones bajos, etc.). Usa texto plano solamente
- Para énfasis, usa mayúsculas o simplemente estructura bien el texto
- Usa saltos de línea para separar secciones, no listas con guiones
- Si no tienes información suficiente para responder, indícalo claramente
- Usa los datos del contexto para responder con precisión
- Para consultas sobre un evento específico, busca por nombre del cliente o fecha en "proximosEventos"
- Cada evento incluye su menú completo con secciones (ej: "Buffet Principal"), categorías y platos
- Formatea las fechas de forma legible (ej: "15 de enero de 2026")
- Cuando menciones montos, usa formato chileno con punto como separador de miles
- Cuando te pregunten por el menú de un evento, lista los platos de forma clara y organizada
- Sé proactivo sugiriendo información relacionada que pueda ser útil`;

// Query para obtener contexto del negocio
export const getBusinessContext = query({
  handler: async (ctx) => {
    const now = Date.now();
    const today = new Date().toISOString().split("T")[0];

    // Reservas
    const bookings = await ctx.db.query("bookings").collect();
    const upcomingBookings = bookings
      .filter((b) => b.eventDate >= today && b.status !== "cancelled")
      .sort((a, b) => a.eventDate.localeCompare(b.eventDate))
      .slice(0, 10);

    const thisMonthBookings = bookings.filter((b) => {
      const bookingMonth = b.eventDate.substring(0, 7);
      const currentMonth = today.substring(0, 7);
      return bookingMonth === currentMonth && b.status !== "cancelled";
    });

    // Cotizaciones
    const quotes = await ctx.db.query("generatedQuotes").collect();
    const pendingQuotes = quotes.filter((q) => q.status === "pending");
    const recentQuotes = quotes
      .sort((a, b) => (b.createdAt || 0) - (a.createdAt || 0))
      .slice(0, 5);

    // Solicitudes de cotización
    const quoteRequests = await ctx.db.query("quoteRequests").collect();
    const newRequests = quoteRequests.filter((q) => q.status === "new");

    // Estadísticas financieras
    const confirmedBookings = bookings.filter((b) => b.status === "confirmed");
    const completedBookings = bookings.filter((b) => b.status === "completed");
    const totalRevenue = [...confirmedBookings, ...completedBookings].reduce(
      (sum, b) => sum + (b.totalAmount || 0),
      0
    );
    const pendingPayments = confirmedBookings.reduce(
      (sum, b) => sum + (b.balanceRemaining || 0),
      0
    );

    // Personal
    const staff = await ctx.db.query("staff").collect();
    const activeStaff = staff.filter((s) => s.isActive);

    return {
      resumen: {
        totalReservas: bookings.length,
        reservasConfirmadas: confirmedBookings.length,
        reservasCompletadas: completedBookings.length,
        reservasEsteMes: thisMonthBookings.length,
        cotizacionesPendientes: pendingQuotes.length,
        solicitudesNuevas: newRequests.length,
        ingresosTotales: totalRevenue,
        pagosPendientes: pendingPayments,
        personalActivo: activeStaff.length,
      },
      proximosEventos: upcomingBookings.map((b) => ({
        cliente: b.clientName,
        email: b.clientEmail,
        telefono: b.clientPhone,
        fecha: b.eventDate,
        tipo: b.eventType,
        invitados: b.numberOfGuests,
        horario: `${b.startTime} - ${b.endTime}`,
        estado: b.status,
        total: b.totalAmount,
        pagado: b.depositPaid,
        pendiente: b.balanceRemaining,
        servicios: b.services || [],
        solicitudesEspeciales: b.specialRequests || null,
        menu: b.menuSections
          ? b.menuSections.map((section: any) => ({
              seccion: section.name,
              items: section.items.map((item: any) => ({
                categoria: item.category,
                platos: item.dishes,
              })),
            }))
          : null,
      })),
      cotizacionesRecientes: recentQuotes.map((q) => ({
        cliente: q.clientName,
        email: q.clientEmail,
        fecha: q.eventDate,
        tipo: q.eventType,
        invitados: q.numberOfGuests,
        total: q.totalAmount,
        estado: q.status,
        plantilla: q.templateName,
        serviciosIncluidos: q.includedServices || [],
        menu: q.menuSections
          ? q.menuSections.map((section: any) => ({
              seccion: section.name,
              items: section.items.map((item: any) => ({
                categoria: item.category,
                platos: item.dishes,
              })),
            }))
          : null,
      })),
      solicitudesPendientes: newRequests.map((r) => ({
        nombre: r.name,
        email: r.email,
        telefono: r.phone,
        tipoEvento: r.eventType,
        fecha: r.eventDate,
        invitados: r.numberOfGuests,
        fuente: r.source || "web",
      })),
    };
  },
});

// Action principal del chat
export const chat = action({
  args: {
    message: v.string(),
    history: v.array(
      v.object({
        role: v.string(),
        content: v.string(),
      })
    ),
  },
  handler: async (ctx, args) => {
    try {
      // Obtener contexto actualizado del negocio
      const context = await ctx.runQuery(api.aiChat.getBusinessContext);

      // Construir el prompt del sistema con el contexto
      const systemPrompt = CHAT_SYSTEM_PROMPT.replace(
        "{businessContext}",
        JSON.stringify(context, null, 2)
      );

      // Preparar mensajes para la API
      const messages: Array<{
        role: "system" | "user" | "assistant";
        content: string;
      }> = [
        { role: "system", content: systemPrompt },
        ...args.history.map((m) => ({
          role: m.role as "user" | "assistant",
          content: m.content,
        })),
        { role: "user", content: args.message },
      ];

      // Llamar a la API
      const completion = await openai.chat.completions.create({
        model: "deepseek/deepseek-chat",
        messages,
        temperature: 0.7,
        max_tokens: 1500,
      });

      const response = completion.choices[0]?.message?.content;

      if (!response) {
        throw new Error("No se recibió respuesta de la IA");
      }

      return {
        success: true,
        response,
      };
    } catch (error: any) {
      console.error("Error en chat AI:", error);
      return {
        success: false,
        response:
          "Lo siento, hubo un error al procesar tu mensaje. Por favor, intenta de nuevo.",
        error: error.message,
      };
    }
  },
});
