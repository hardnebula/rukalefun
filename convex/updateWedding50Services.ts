import { mutation } from "./_generated/server";
import { v } from "convex/values";

// Script para actualizar servicios de la plantilla matrimonio 50
export const updateWedding50Services = mutation({
  args: { templateId: v.id("quoteTemplates") },
  handler: async (ctx, args) => {
    await ctx.db.patch(args.templateId, {
      includedServices: [
        "Salón con capacidad para 150 personas",
        "Mesas",
        "Sillas Chiavari Blancas",
        "Vajilla",
        "Cubiertos",
        "Copas",
        "Bar equipado",
        "Menú buffet",
        "Chef y equipo de cocina",
        "Equipo de garzones",
        "Iluminación Exterior",
        "Espacio de Ceremonia",
        "Salón de Baile",
        "Bola Disco",
        "Máquina de Humo",
        "Tiras Led Colores",
        "Luces Ada en Salón de comida",
        "Áreas verdes",
        "Piscina",
        "Internet WiFi",
        "Generador de emergencia",
        "Estacionamiento Privado"
      ],
      additionalServices: [
        "Maestro de Ceremonia",
        "Fotógrafo",
        "Diseñadora y decoración en todos los espacios",
        "DJ profesional",
        "Amplificación Interior & Exterior",
        "BONUS: Cámara 360 (si contratan dentro de 30 días)",
        "BONUS: Barril 30 Lt de cerveza artesanal (si contratan dentro de 30 días)"
      ],
      updatedAt: Date.now(),
    });

    return { message: "Servicios actualizados exitosamente" };
  },
});
