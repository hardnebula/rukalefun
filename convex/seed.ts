import { mutation } from "./_generated/server";
import { v } from "convex/values";

// Script para poblar datos iniciales de Ruka Lefún
export const seedSpaces = mutation({
  handler: async (ctx) => {
    // Verificar si ya existen espacios
    const existingSpaces = await ctx.db.query("spaces").collect();
    
    if (existingSpaces.length > 0) {
      console.log("Los espacios ya existen. Limpiando...");
      // Opcional: limpiar espacios existentes
      for (const space of existingSpaces) {
        await ctx.db.delete(space._id);
      }
    }

    // 1. Ceremonia al Aire Libre
    const ceremoniaId = await ctx.db.insert("spaces", {
      name: "Ceremonia al Aire Libre",
      description: "Un espacio mágico rodeado de árboles nativos y atravesado por un hermoso estero. El lugar perfecto para una ceremonia íntima en conexión con la naturaleza.",
      capacity: 120,
      area: 300,
      features: [
        "Árboles nativos del sur de Chile",
        "Estero natural",
        "Ambiente natural y tranquilo",
        "Ideal para ceremonias",
        "Sonido natural del agua",
        "Sillas incluidas",
        "Decoración rústica disponible"
      ],
      images: [
        "https://images.unsplash.com/photo-1519225421980-715cb0215aed?q=80&w=1200",
        "https://images.unsplash.com/photo-1464366400600-7168b8af9bc3?q=80&w=1200"
      ],
      pricePerHour: 150000,
      isActive: true,
    });

    // 2. Cocktail al Aire Libre
    const cocktailId = await ctx.db.insert("spaces", {
      name: "Cocktail al Aire Libre",
      description: "Espacio exclusivo junto a la piscina, perfecto para cocktails y recepciones. Un ambiente elegante y relajado para celebrar con tus invitados.",
      capacity: 100,
      area: 250,
      features: [
        "Vista a la piscina",
        "Mesas y sillas lounge",
        "Iluminación ambiente",
        "Barra móvil disponible",
        "Conexión eléctrica",
        "Toldo de sombra",
        "Área verde circundante",
        "Acceso a baños"
      ],
      images: [
        "https://images.unsplash.com/photo-1478146896981-b80fe463b330?q=80&w=1200",
        "https://images.unsplash.com/photo-1505236858219-8359eb29e329?q=80&w=1200"
      ],
      pricePerHour: 180000,
      isActive: true,
    });

    // 3. Salón de Eventos
    const salonId = await ctx.db.insert("spaces", {
      name: "Salón de Eventos Principal",
      description: "Amplio salón techado con capacidad para 150 personas, equipado con pista de baile y todo lo necesario para tu celebración. Elegancia y funcionalidad en un mismo espacio.",
      capacity: 150,
      area: 400,
      features: [
        "Pista de baile profesional",
        "Sistema de sonido incluido",
        "Iluminación LED",
        "Aire acondicionado",
        "Mesas redondas y sillas",
        "Escenario elevado",
        "Proyector y pantalla",
        "Cocina de servicio",
        "Baños privados",
        "Estacionamiento cercano"
      ],
      images: [
        "https://images.unsplash.com/photo-1519167758481-83f29da8dbc6?q=80&w=1200",
        "https://images.unsplash.com/photo-1464366400600-7168b8af9bc3?q=80&w=1200"
      ],
      pricePerHour: 250000,
      isActive: true,
    });

    console.log("✅ Espacios creados exitosamente:");
    console.log("- Ceremonia al Aire Libre:", ceremoniaId);
    console.log("- Cocktail al Aire Libre:", cocktailId);
    console.log("- Salón de Eventos Principal:", salonId);

    return {
      success: true,
      spaces: [ceremoniaId, cocktailId, salonId],
      message: "Los 3 espacios de Ruka Lefún han sido configurados correctamente"
    };
  },
});

// Script para agregar testimonios de ejemplo
export const seedTestimonials = mutation({
  handler: async (ctx) => {
    const existingTestimonials = await ctx.db.query("testimonials").collect();
    
    if (existingTestimonials.length > 0) {
      console.log("Ya existen testimonios. Limpiando...");
      for (const testimonial of existingTestimonials) {
        await ctx.db.delete(testimonial._id);
      }
    }

    // Testimonios de ejemplo
    await ctx.db.insert("testimonials", {
      clientName: "María y Juan",
      eventType: "Boda",
      rating: 5,
      comment: "Ruka Lefún superó todas nuestras expectativas. La ceremonia junto al estero fue mágica, rodeados de naturaleza. El equipo fue increíblemente profesional y atento a cada detalle. ¡Un lugar simplemente perfecto para nuestro día especial!",
      eventDate: "2024-11-15",
      isPublic: true,
      createdAt: Date.now(),
    });

    await ctx.db.insert("testimonials", {
      clientName: "Empresa Tech Solutions",
      eventType: "Evento Corporativo",
      rating: 5,
      comment: "Organizamos nuestro evento anual en el Salón Principal y fue un éxito total. Las instalaciones son de primera, el ambiente es único y la ubicación perfecta. Nuestro equipo quedó encantado con la experiencia.",
      eventDate: "2024-10-20",
      isPublic: true,
      createdAt: Date.now(),
    });

    await ctx.db.insert("testimonials", {
      clientName: "Familia Rodríguez",
      eventType: "Cumpleaños",
      rating: 5,
      comment: "Celebramos los 50 años de mi mamá en el área de cocktail junto a la piscina. El espacio es hermoso, el servicio impecable y el entorno natural hace que todo sea más especial. Totalmente recomendado.",
      eventDate: "2024-09-30",
      isPublic: true,
      createdAt: Date.now(),
    });

    console.log("✅ Testimonios creados exitosamente");

    return {
      success: true,
      message: "3 testimonios de ejemplo han sido agregados"
    };
  },
});

// Script completo para poblar todo
export const seedAll = mutation({
  handler: async (ctx) => {
    console.log("🌱 Iniciando seed completo de Ruka Lefún...");
    
    // Limpiar datos existentes
    const existingSpaces = await ctx.db.query("spaces").collect();
    const existingTestimonials = await ctx.db.query("testimonials").collect();

    for (const space of existingSpaces) {
      await ctx.db.delete(space._id);
    }
    for (const testimonial of existingTestimonials) {
      await ctx.db.delete(testimonial._id);
    }

    // ESPACIOS
    console.log("📍 Creando espacios...");
    
    await ctx.db.insert("spaces", {
      name: "Ceremonia al Aire Libre",
      description: "Un espacio mágico rodeado de árboles nativos y atravesado por un hermoso estero. El lugar perfecto para una ceremonia íntima en conexión con la naturaleza.",
      capacity: 120,
      area: 300,
      features: [
        "Árboles nativos del sur de Chile",
        "Estero natural",
        "Ambiente natural y tranquilo",
        "Ideal para ceremonias",
        "Sonido natural del agua",
        "Sillas incluidas",
        "Decoración rústica disponible"
      ],
      images: [
        "https://images.unsplash.com/photo-1441974231531-c6227db76b6e?q=80&w=1200",
        "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?q=80&w=1200"
      ],
      pricePerHour: 150000,
      isActive: true,
    });

    await ctx.db.insert("spaces", {
      name: "Cocktail al Aire Libre",
      description: "Espacio exclusivo junto a la piscina, perfecto para cocktails y recepciones. Un ambiente elegante y relajado para celebrar con tus invitados.",
      capacity: 100,
      area: 250,
      features: [
        "Vista a la piscina",
        "Mesas y sillas lounge",
        "Iluminación ambiente",
        "Barra móvil disponible",
        "Conexión eléctrica",
        "Toldo de sombra",
        "Área verde circundante",
        "Acceso a baños"
      ],
      images: [
        "https://images.unsplash.com/photo-1478146896981-b80fe463b330?q=80&w=1200",
        "https://images.unsplash.com/photo-1505236858219-8359eb29e329?q=80&w=1200"
      ],
      pricePerHour: 180000,
      isActive: true,
    });

    await ctx.db.insert("spaces", {
      name: "Salón de Eventos Principal",
      description: "Amplio salón techado con capacidad para 150 personas, equipado con pista de baile y todo lo necesario para tu celebración. Elegancia y funcionalidad en un mismo espacio.",
      capacity: 150,
      area: 400,
      features: [
        "Pista de baile profesional",
        "Sistema de sonido incluido",
        "Iluminación LED",
        "Aire acondicionado",
        "Mesas redondas y sillas",
        "Escenario elevado",
        "Proyector y pantalla",
        "Cocina de servicio",
        "Baños privados",
        "Estacionamiento cercano"
      ],
      images: [
        "https://images.unsplash.com/photo-1519167758481-83f29da8dbc6?q=80&w=1200",
        "https://images.unsplash.com/photo-1464366400600-7168b8af9bc3?q=80&w=1200"
      ],
      pricePerHour: 250000,
      isActive: true,
    });

    // TESTIMONIOS
    console.log("💬 Creando testimonios...");

    await ctx.db.insert("testimonials", {
      clientName: "María y Juan",
      eventType: "Boda",
      rating: 5,
      comment: "Ruka Lefún superó todas nuestras expectativas. La ceremonia junto al estero fue mágica, rodeados de naturaleza. El equipo fue increíblemente profesional y atento a cada detalle. ¡Un lugar simplemente perfecto para nuestro día especial!",
      eventDate: "2024-11-15",
      isPublic: true,
      createdAt: Date.now(),
    });

    await ctx.db.insert("testimonials", {
      clientName: "Empresa Tech Solutions",
      eventType: "Evento Corporativo",
      rating: 5,
      comment: "Organizamos nuestro evento anual en el Salón Principal y fue un éxito total. Las instalaciones son de primera, el ambiente es único y la ubicación perfecta. Nuestro equipo quedó encantado con la experiencia.",
      eventDate: "2024-10-20",
      isPublic: true,
      createdAt: Date.now(),
    });

    await ctx.db.insert("testimonials", {
      clientName: "Familia Rodríguez",
      eventType: "Cumpleaños",
      rating: 5,
      comment: "Celebramos los 50 años de mi mamá en el área de cocktail junto a la piscina. El espacio es hermoso, el servicio impecable y el entorno natural hace que todo sea más especial. Totalmente recomendado.",
      eventDate: "2024-09-30",
      isPublic: true,
      createdAt: Date.now(),
    });

    console.log("✅ Seed completo finalizado exitosamente!");
    console.log("📊 Resumen:");
    console.log("   - 3 espacios creados");
    console.log("   - 3 testimonios agregados");

    return {
      success: true,
      message: "✅ Base de datos de Ruka Lefún poblada completamente: 3 espacios y 3 testimonios"
    };
  },
});

// Script para agregar personal de ejemplo
export const seedStaff = mutation({
  handler: async (ctx) => {
    const existingStaff = await ctx.db.query("staff").collect();
    
    if (existingStaff.length > 0) {
      console.log("Ya existe personal registrado. Limpiando...");
      for (const person of existingStaff) {
        await ctx.db.delete(person._id);
      }
    }

    const now = Date.now();

    // Personal de ejemplo - Garzones
    await ctx.db.insert("staff", {
      name: "Carlos Mendoza",
      role: "Garzón",
      phone: "+56983614062",
      email: "carlos.mendoza@example.com",
      ratePerEvent: 45000,
      ratePerHour: 6000,
      notes: "Experiencia de 5 años en eventos",
      isActive: true,
      createdAt: now,
    });

    await ctx.db.insert("staff", {
      name: "Jorge Ramírez",
      role: "Garzón",
      phone: "+56956789012",
      email: "jorge.ramirez@example.com",
      ratePerEvent: 42000,
      ratePerHour: 5800,
      notes: "Servicio de mesas especializado",
      isActive: true,
      createdAt: now,
    });

    // Personal de Cocina
    await ctx.db.insert("staff", {
      name: "Ana Martínez",
      role: "Cocina",
      phone: "+56923456789",
      email: "ana.martinez@example.com",
      ratePerEvent: 60000,
      ratePerHour: 8000,
      notes: "Chef con especialidad en eventos, 10 años de experiencia",
      isActive: true,
      createdAt: now,
    });

    await ctx.db.insert("staff", {
      name: "Roberto Flores",
      role: "Cocina",
      phone: "+56978901234",
      email: "roberto.flores@example.com",
      ratePerEvent: 55000,
      ratePerHour: 7500,
      notes: "Ayudante de cocina, manejo de catering para eventos",
      isActive: true,
      createdAt: now,
    });

    // Personal de Diseño
    await ctx.db.insert("staff", {
      name: "María López",
      role: "Diseño",
      phone: "+56945678901",
      email: "maria.lopez@example.com",
      ratePerEvent: 80000,
      notes: "Diseñadora y decoradora de eventos, especialidad en bodas",
      isActive: true,
      createdAt: now,
    });

    await ctx.db.insert("staff", {
      name: "Valentina Torres",
      role: "Diseño",
      phone: "+56989012345",
      email: "valentina.torres@example.com",
      ratePerEvent: 75000,
      notes: "Montaje y decoración de eventos, ambientación floral",
      isActive: true,
      createdAt: now,
    });

    // DJ
    await ctx.db.insert("staff", {
      name: "Pedro González",
      role: "DJ",
      phone: "+56934567890",
      email: "pedro.gonzalez@example.com",
      ratePerEvent: 120000,
      notes: "DJ profesional con equipos propios, amplio repertorio musical",
      isActive: true,
      createdAt: now,
    });

    await ctx.db.insert("staff", {
      name: "Diego Silva",
      role: "DJ",
      phone: "+56990123456",
      email: "diego.silva@example.com",
      ratePerEvent: 100000,
      notes: "DJ especializado en eventos corporativos y bodas",
      isActive: true,
      createdAt: now,
    });

    // Animación
    await ctx.db.insert("staff", {
      name: "Patricia Silva",
      role: "Animación",
      phone: "+56967890123",
      email: "patricia.silva@example.com",
      ratePerEvent: 90000,
      notes: "Animadora infantil, show de títeres y juegos",
      isActive: true,
      createdAt: now,
    });

    await ctx.db.insert("staff", {
      name: "Marcelo Vega",
      role: "Animación",
      phone: "+56901234567",
      email: "marcelo.vega@example.com",
      ratePerEvent: 85000,
      notes: "Animador de eventos, maestro de ceremonias",
      isActive: true,
      createdAt: now,
    });

    // Fotografía
    await ctx.db.insert("staff", {
      name: "Claudia Rojas",
      role: "Fotografía",
      phone: "+56912345098",
      email: "claudia.rojas@example.com",
      ratePerEvent: 150000,
      notes: "Fotógrafa profesional de bodas y eventos, entrega digital incluida",
      isActive: true,
      createdAt: now,
    });

    await ctx.db.insert("staff", {
      name: "Fernando Morales",
      role: "Fotografía",
      phone: "+56923456109",
      email: "fernando.morales@example.com",
      ratePerEvent: 140000,
      notes: "Fotógrafo y videógrafo, álbum digital y video resumen",
      isActive: true,
      createdAt: now,
    });

    console.log("✅ Personal creado exitosamente");

    return {
      success: true,
      message: "12 personas agregadas al personal: 2 garzones, 2 cocina, 2 diseño, 2 DJ, 2 animación, 2 fotografía"
    };
  },
});

// Crear usuario administrador inicial
export const createInitialAdmin = mutation({
  args: {
    username: v.optional(v.string()),
    password: v.optional(v.string()),
    name: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    // Verificar que no exista ya un admin
    const existingAdmin = await ctx.db.query("admins").first();
    
    if (existingAdmin) {
      return {
        success: false,
        message: "❌ Ya existe un administrador registrado"
      };
    }

    // Credenciales por defecto
    const username = args.username || "admin";
    const password = args.password || "rukalefun2024";
    const name = args.name || "Administrador Ruka Lefún";

    const adminId = await ctx.db.insert("admins", {
      username,
      password, // En producción, hashear esto
      name,
      isActive: true,
      createdAt: Date.now(),
    });

    console.log("✅ Usuario administrador creado:");
    console.log("   Usuario:", username);
    console.log("   Contraseña:", password);
    console.log("   Nombre:", name);

    return {
      success: true,
      message: `✅ Administrador creado con éxito\n   Usuario: ${username}\n   Contraseña: ${password}\n   ⚠️  Cambia la contraseña después del primer login`,
      credentials: {
        username,
        password,
        name
      }
    };
  },
});

