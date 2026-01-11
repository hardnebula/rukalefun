import { v } from "convex/values";
import { mutation } from "./_generated/server";

// Script para crear plantilla de matrimonio
export const seedWeddingTemplate = mutation({
  handler: async (ctx) => {
    const now = Date.now();

    const weddingTemplate = await ctx.db.insert("quoteTemplates", {
      name: "Matrimonio Completo",
      eventType: "Matrimonio",
      isActive: true,

      // Servicios incluidos
      includedServices: [
        "Salón con capacidad para 150 personas",
        "Mesa Novios+Bancos",
        "Sillas Chiavari+Bancos",
        "Vajilla",
        "Copas",
        "Cubiertos",
        "Mantelería",
        "Bar Equipado",
        "Equipo de garzones",
        "Decoración Interior",
        "Mesones Exteriores",
        "Baños de dama",
        "Baño Varones",
        "Áreas verdes",
        "Áreas de esparcimiento",
        "Leche Asada con Salsa de comida",
        "Cocinas",
        "Internet WiFi",
        "Generador de emergencia",
        "Estacionamiento Privado"
      ],

      // Servicios adicionales incluidos
      additionalServices: [
        "Diseñadora y Ceremonia",
        "Fotografía",
        "Diseñadora y ceremonia en todos los espacios",
        "Dj Profesional",
        "Amplificación interior e Exterior"
      ],

      // Menú sugerido
      menuSections: [
        {
          name: "Menú Buffet (Degustación)",
          items: [
            {
              category: "Cóctel - Tables Rústica",
              dishes: [
                "Queso",
                "Jamón Serrano",
                "Frutas Secas",
                "Nueces",
                "Salami",
                "Chorizo"
              ]
            },
            {
              category: "Buffet de Ensaladas",
              dishes: [
                "Cangrejo Alpinintado",
                "Encurtido de Pollo y Queso",
                "Pico de Gallo"
              ]
            },
            {
              category: "Pizza Bar",
              dishes: [
                "Napolitana",
                "Pollo BBQ",
                "Variedad de Jugos",
                "Cebolla Caramelizada",
                "Chorizo"
              ]
            },
            {
              category: "Buffet Principal Salón Rústico",
              dishes: [
                "Lomo de Res con salsa de Ciruela",
                "Salmón a las finas Hierbas con salsa de champignons",
                "Papas Manfreto",
                "Variedad de Ensaladas",
                "Sopa o Crema"
              ]
            },
            {
              category: "Postres Buffet",
              dishes: [
                "Mousse de Frambuesa",
                "Mousse de Maracuyá",
                "Frutas de la estación"
              ]
            },
            {
              category: "Estación en todo el evento",
              dishes: [
                "Café, Te e Infusiones"
              ]
            },
            {
              category: "Rincón del Bajón",
              dishes: [
                "Completo con palta",
                "Calcetines"
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
      terms: `Servicios Incluidos a Contratar dentro de 30 días:
• Cóctel 300
• Buffet De Lúpia servicio artesanal

Decoración: Se incluye Mesa, manteles, camino, lanas falsas, servilletas y vajilla apropiadas para la ocasión. Todo lo adicional que se quiera agregar es por cuenta de quien contrata el servicio. Las decoraciones de mesas tiene arreglos florales en centro de mesa. Las decoraciones generales, pero no incluye globos de mesa. Silla de plástica vestida como corresponda.

Un mes antes del evento, realizamos dos visitas una al espacio logístico de Rukalefún, donde usted conocerá todo y haremos detalle de todo lo que se entregará y una visita al espacio de menú, donde verán el armado de menú y una degustación de todo lo que incluye. También probaremos una copa para su mejor controlar una cultura saludable con componentes.

Es importante mencionar que declinamos en producciones de todos nuestros eventos y para ello, RUKALEFÚN cuenta con un Operador de Renap, además de Tener una declaración de llevar su evento contribuyendo significativamente. Si no estás de acuerdo con el 50%, Tu casa del evento podrás con tu confirmación de invitados asistentes. Para formalizar esta puesta, sólo contando con culturas necesarias antes de una semana.

Todo lo anterior hace que tus decisiones de evento sean organizado y controlando, en nuestro caso. Puesto que consideran las condiciones que se necesitan antes de todo. Pero consideran los que necesitan tener tu espacio en contraste.

En importante mencionar que declinamos en producciones de todos nuestros eventos y para ello, RUKALEFÚN está a disposición de hacer tu evento con carácter amistoso... por el largo de que se tengo foco, caño, que empezaron con nuestros visitantes y nos sean espaldados en una oficina. Ya que se conoce que los trabajos propios menores no se conocen como viene.

Reflexión:

Al tener el tiempo y lograr tus resultados excelentes busca durante incansables, más trabajes un espacio desde, las has poder. Autoriza y visitara tiempo el tiempo cada visita tiempos con tu estudio dentro de estos momentos podrá cada ser sus eventos finos pronto.

Gracias por solicitarnos esta cotización, esperamos sea de su agrado.`,

      // Información de firma
      signatureName: "Marcelo Mora Jara",
      signatureTitle: "RukaLefún",
      signatureLocation: "Villarrica, Chile",

      createdAt: now,
      updatedAt: now,
    });

    return { id: weddingTemplate, message: "Plantilla de Matrimonio creada exitosamente" };
  },
});
