import { v } from "convex/values";
import { mutation } from "./_generated/server";

// Script para crear plantilla de matrimonio 50 personas
export const seedWedding50Template = mutation({
  handler: async (ctx) => {
    const now = Date.now();

    const wedding50Template = await ctx.db.insert("quoteTemplates", {
      name: "Matrimonio 50 Personas - Buffet Completo",
      eventType: "Matrimonio",
      isActive: true,

      // Servicios incluidos
      includedServices: [
        "Salón con capacidad",
        "Mesa Novios",
        "Sillas Chiavari",
        "Vajilla completa",
        "Copas de todo tipo",
        "Cubiertos",
        "Mantelería",
        "Bar Equipado",
        "Equipo de garzones profesional",
        "Decoración Interior",
        "Mesones Exteriores",
        "Baños completos",
        "Áreas verdes",
        "Áreas de esparcimiento",
        "Cocinas equipadas",
        "Internet WiFi",
        "Generador de emergencia",
        "Estacionamiento Privado"
      ],

      // Servicios adicionales incluidos
      additionalServices: [
        "Diseñadora y Ceremonia",
        "Fotografía profesional",
        "DJ Profesional",
        "Amplificación interior e exterior"
      ],

      // Menú sugerido
      menuSections: [
        {
          name: "Menú Buffet (Sugerido)",
          items: [
            {
              category: "Cóctel - Tablas Rústica",
              dishes: [
                "Queso",
                "Aceitunas",
                "Frutas Secas",
                "Jamón Serrano",
                "Frutillas",
                "Salame",
                "Crostini"
              ]
            },
            {
              category: "Cóctel Caliente",
              dishes: [
                "Ceviche de Salmón",
                "Camarones Apanados",
                "Empanaditas de Pino y Queso",
                "Brochetas de Pollo"
              ]
            },
            {
              category: "Bebidas Cóctel",
              dishes: [
                "Pisco Sour",
                "Espumante",
                "Cerveza Artesanal",
                "Variedad de Jugos",
                "Bebidas Gaseosas",
                "Aguas Saborizadas"
              ]
            },
            {
              category: "Buffet Principal, Salón Rústico",
              dishes: [
                "Lomo de Res con salsas de Champiñón",
                "Salmón a las Finas Hierbas con salsa de mariscos",
                "Papas Rústicas",
                "Variedad de Ensaladas (muy abundante)"
              ]
            },
            {
              category: "Bebidas",
              dishes: [
                "Vino Cabernet Sauvignon"
              ]
            },
            {
              category: "Postres Buffet",
              dishes: [
                "Mousse de Frambuesas",
                "Mousse de Maracuyá",
                "Leche Asada"
              ]
            },
            {
              category: "Estación en todo el evento",
              dishes: [
                "Café, Té e Infusiones"
              ]
            },
            {
              category: "Rincón del Bajón",
              dishes: [
                "Sopaipillas con pebre",
                "Consomé"
              ]
            }
          ]
        }
      ],

      // Pricing
      pricePerPerson: 80000,
      minimumGuests: 50,
      currency: "CLP",

      // Términos y condiciones
      terms: `CONDICIONES COMERCIALES:

• Valor neto por persona: $80.000
• Valor neto por persona: $70.000 (desde 80 personas)

FORMA DE PAGO:
- La reserva se hace efectiva abonando el 50% del valor total al momento de confirmar el evento
- El 50% restante, 10 días antes del evento junto con la confirmación de invitados asistentes

SERVICIOS INCLUIDOS:
Todos los servicios mencionados en la cotización están incluidos en el precio por persona. La decoración básica de mesas incluye manteles, caminos, servilletas y vajilla apropiada para la ocasión.

DEGUSTACIÓN:
Un mes antes del evento, realizamos una visita al espacio de Ruka Lefún donde conocerán las instalaciones y realizaremos una degustación completa del menú seleccionado.

IMPORTANTE:
Nuestro compromiso es hacer de su evento un momento inolvidable, ocupándonos de cada detalle para que ustedes solo se preocupen de disfrutar este día especial.

Gracias por considerar Ruka Lefún para su matrimonio.`,

      // Información de firma
      signatureName: "Marcelo Mora Jara",
      signatureTitle: "Ruka Lefún",
      signatureLocation: "Villarrica, Chile",

      createdAt: now,
      updatedAt: now,
    });

    return { id: wedding50Template, message: "Plantilla de Matrimonio 50 personas creada exitosamente" };
  },
});
