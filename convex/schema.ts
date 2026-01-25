import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  // Espacios disponibles en el centro de eventos
  spaces: defineTable({
    name: v.string(),
    description: v.string(),
    capacity: v.number(),
    area: v.number(), // metros cuadrados
    features: v.array(v.string()),
    images: v.array(v.string()),
    pricePerHour: v.number(),
    isActive: v.boolean(),
  }),

  // Reservas y eventos
  bookings: defineTable({
    spaceId: v.optional(v.id("spaces")), // Opcional - todos los espacios están incluidos
    generatedQuoteId: v.optional(v.id("generatedQuotes")), // Vinculación a cotización original
    clientName: v.string(),
    clientEmail: v.string(),
    clientPhone: v.string(),
    eventType: v.string(), // boda, corporativo, cumpleaños, etc.
    eventDate: v.string(),
    startTime: v.string(),
    endTime: v.string(),
    numberOfGuests: v.number(),
    estimatedGuests: v.number(),
    status: v.string(), // pending, confirmed, completed
    totalAmount: v.number(),
    depositPaid: v.number(),
    balanceRemaining: v.number(),
    // Historial de pagos/abonos
    paymentHistory: v.optional(v.array(v.object({
      amount: v.number(),
      date: v.string(), // YYYY-MM-DD
      method: v.optional(v.string()), // efectivo, transferencia, tarjeta
      notes: v.optional(v.string()),
    }))),
    services: v.array(v.string()), // catering, decoración, audio/video, etc.
    specialRequests: v.optional(v.string()),
    notes: v.optional(v.string()),
    // Menú del evento (heredado de cotización si existe)
    menuSections: v.optional(v.array(v.object({
      name: v.string(),
      items: v.array(v.object({
        category: v.string(),
        dishes: v.array(v.string()),
      })),
    }))),
    // Resumen del evento (para historial post-evento)
    eventSummary: v.optional(v.string()),
    // Código de acceso para portal de invitados (para novios)
    guestAccessCode: v.optional(v.string()),
    createdAt: v.number(),
    updatedAt: v.number(),
  }).index("by_space", ["spaceId"])
    .index("by_date", ["eventDate"])
    .index("by_status", ["status"])
    .index("by_generated_quote", ["generatedQuoteId"])
    .index("by_guest_access_code", ["guestAccessCode"]),

  // Solicitudes de cotización
  quoteRequests: defineTable({
    name: v.string(),
    email: v.string(),
    phone: v.string(),
    eventType: v.string(),
    eventDate: v.optional(v.string()),
    numberOfGuests: v.number(),
    message: v.optional(v.string()),
    status: v.string(), // new, contacted, quoted, converted, declined
    source: v.optional(v.string()), // "web" | "whatsapp" - origen de la solicitud
    createdAt: v.number(),
  }).index("by_status", ["status"]),

  // Historial de cotizaciones generadas
  generatedQuotes: defineTable({
    quoteRequestId: v.optional(v.id("quoteRequests")), // Vinculado a solicitud original (opcional)
    templateId: v.id("quoteTemplates"), // Plantilla usada
    clientName: v.string(),
    clientEmail: v.optional(v.string()),
    clientPhone: v.optional(v.string()),
    eventDate: v.string(),
    eventType: v.string(),
    numberOfGuests: v.number(),

    // Datos de la cotización al momento de generarla (snapshot)
    templateName: v.string(),
    includedServices: v.array(v.string()),
    additionalServices: v.array(v.string()),
    menuSections: v.array(v.object({
      name: v.string(),
      items: v.array(v.object({
        category: v.string(),
        dishes: v.array(v.string()),
      })),
    })),
    pricePerPerson: v.number(),
    minimumGuests: v.number(),
    totalAmount: v.number(), // precio calculado total
    currency: v.string(),

    // Seguimiento de conversión
    status: v.string(), // pending, converted, declined, expired
    bookingId: v.optional(v.id("bookings")), // Si se convirtió en reserva
    convertedAt: v.optional(v.number()), // Fecha de conversión
    expiresAt: v.optional(v.number()), // Fecha de expiración (2 semanas después de creación)

    // Metadata
    generatedBy: v.optional(v.string()), // Admin que generó
    notes: v.optional(v.string()),
    createdAt: v.number(),
    updatedAt: v.number(),
  }).index("by_status", ["status"])
    .index("by_client_email", ["clientEmail"])
    .index("by_event_date", ["eventDate"])
    .index("by_booking", ["bookingId"])
    .index("by_quote_request", ["quoteRequestId"]),

  // Plantillas de cotización
  quoteTemplates: defineTable({
    name: v.string(), // nombre de la plantilla, ej: "Paseo Familiar", "Boda Premium"
    eventType: v.string(), // tipo de evento
    isActive: v.boolean(),
    isDefault: v.optional(v.boolean()), // plantilla por defecto para cotización rápida

    // Servicios incluidos
    includedServices: v.array(v.string()),

    // Servicios adicionales incluidos
    additionalServices: v.array(v.string()),

    // Menú sugerido - array de secciones de menú
    menuSections: v.array(v.object({
      name: v.string(), // ej: "Almuerzo Campestre 13:00 hrs"
      items: v.array(v.object({
        category: v.string(), // ej: "Principal", "Buffet de Ensaladas"
        dishes: v.array(v.string()), // lista de platos
      })),
    })),

    // Pricing
    pricePerPerson: v.number(),
    minimumGuests: v.number(),
    currency: v.string(), // CLP, USD, etc

    // Términos y condiciones
    terms: v.string(),

    // Información de firma
    signatureName: v.string(),
    signatureTitle: v.string(),
    signatureLocation: v.string(),

    createdAt: v.number(),
    updatedAt: v.number(),
  }).index("by_event_type", ["eventType"])
    .index("by_active", ["isActive"]),

  // Galería de fotos
  gallery: defineTable({
    title: v.string(),
    imageUrl: v.string(),
    thumbnailUrl: v.optional(v.string()),
    category: v.string(), // boda, corporativo, cumpleaños, espacio, etc.
    eventDate: v.optional(v.string()),
    isPublic: v.boolean(),
    order: v.number(),
  }).index("by_category", ["category"])
    .index("by_public", ["isPublic"]),

  // Recursos e inventario
  resources: defineTable({
    name: v.string(),
    type: v.string(), // mobiliario, audio/video, decoración, etc.
    quantity: v.number(),
    available: v.number(),
    pricePerUnit: v.optional(v.number()),
    description: v.optional(v.string()),
  }),

  // Personal y garzones
  staff: defineTable({
    name: v.string(),
    role: v.string(), // Garzón, Cocina, Diseño, DJ, Animación, Fotografía
    phone: v.string(),
    email: v.optional(v.string()),
    ratePerEvent: v.number(), // tarifa por evento
    ratePerHour: v.optional(v.number()), // tarifa por hora (opcional)
    notes: v.optional(v.string()),
    isActive: v.boolean(),
    createdAt: v.number(),
  }),

  // Asignación de personal a eventos
  staffAssignments: defineTable({
    bookingId: v.id("bookings"),
    staffId: v.id("staff"),
    role: v.string(), // rol específico para este evento
    scheduledStartTime: v.string(),
    scheduledEndTime: v.string(),
    confirmedAttendance: v.boolean(),
    actualStartTime: v.optional(v.string()),
    actualEndTime: v.optional(v.string()),
    hoursWorked: v.optional(v.number()),
    amountToPay: v.number(),
    paymentStatus: v.string(), // pending, paid, cancelled
    paymentDate: v.optional(v.string()),
    paymentMethod: v.optional(v.string()), // efectivo, transferencia, etc.
    notes: v.optional(v.string()),
    createdAt: v.number(),
    updatedAt: v.number(),
  }).index("by_booking", ["bookingId"])
    .index("by_staff", ["staffId"])
    .index("by_payment_status", ["paymentStatus"]),

  // Tareas y checklist por evento
  eventTasks: defineTable({
    bookingId: v.id("bookings"),
    title: v.string(),
    description: v.optional(v.string()),
    dueDate: v.string(),
    isCompleted: v.boolean(),
    assignedTo: v.optional(v.string()),
    createdAt: v.number(),
  }).index("by_booking", ["bookingId"]),

  // Cronograma/Timeline del evento
  eventTimeline: defineTable({
    bookingId: v.id("bookings"),
    activityName: v.string(),
    scheduledTime: v.string(), // formato "HH:MM"
    duration: v.number(), // minutos
    description: v.optional(v.string()),
    order: v.number(),
    isCompleted: v.boolean(),
    notes: v.optional(v.string()),
    createdAt: v.number(),
    updatedAt: v.number(),
  }).index("by_booking", ["bookingId"]),

  // Testimonios
  testimonials: defineTable({
    clientName: v.string(),
    eventType: v.string(),
    rating: v.number(),
    comment: v.string(),
    eventDate: v.string(),
    isPublic: v.boolean(),
    createdAt: v.number(),
  }).index("by_public", ["isPublic"]),

  // Administradores
  admins: defineTable({
    username: v.string(),
    password: v.string(), // En producción, usar hash
    name: v.string(),
    isActive: v.boolean(),
    createdAt: v.number(),
  }),

  // Sesiones de administradores
  sessions: defineTable({
    adminId: v.id("admins"),
    createdAt: v.number(),
    expiresAt: v.number(),
  }).index("by_admin", ["adminId"]),

  // Mesas del salón
  tables: defineTable({
    tableNumber: v.number(), // Número de mesa
    title: v.optional(v.string()), // Título personalizado de la mesa
    capacity: v.number(), // Capacidad máxima de personas
    shape: v.string(), // redonda, rectangular, cuadrada
    position: v.optional(v.object({
      x: v.number(), // posición X en el plano
      y: v.number(), // posición Y en el plano
    })),
    isActive: v.boolean(), // Si está disponible para uso
    notes: v.optional(v.string()),
    createdAt: v.number(),
  }),

  // Asignación de invitados a mesas por evento
  tableAssignments: defineTable({
    bookingId: v.id("bookings"), // Evento/reserva
    tableId: v.optional(v.id("tables")), // Mesa asignada (opcional - puede estar sin asignar)
    guestName: v.string(), // Nombre del invitado
    dietaryRestrictions: v.optional(v.string()), // Restricciones alimentarias
    isConfirmed: v.boolean(), // Si el invitado confirmó asistencia
    notes: v.optional(v.string()),
    // Tracking de origen (importación desde RSVP)
    sourceRsvpId: v.optional(v.id("weddingRsvps")),
    guestIndex: v.optional(v.number()), // 0=principal, 1,2,3...=acompañantes
    createdAt: v.number(),
    updatedAt: v.number(),
  }).index("by_booking", ["bookingId"])
    .index("by_table", ["tableId"])
    .index("by_booking_and_table", ["bookingId", "tableId"])
    .index("by_source_rsvp", ["sourceRsvpId"]),

  // Inventario de tragos de clientes (botellas que traen los novios)
  drinkInventory: defineTable({
    bookingId: v.id("bookings"),
    drinkType: v.string(), // vino, pisco, whisky, cerveza, ron, vodka, champagne, otro
    brand: v.string(), // Marca del trago
    quantityIn: v.number(), // Botellas que entran
    quantityConsumed: v.optional(v.number()), // Botellas consumidas
    quantityReturned: v.optional(v.number()), // Botellas devueltas
    status: v.string(), // pending_arrival, received, completed
    entryNotes: v.optional(v.string()),
    exitNotes: v.optional(v.string()),
    createdAt: v.number(),
    updatedAt: v.number(),
  }).index("by_booking", ["bookingId"]),

  // Catálogo de ingredientes
  ingredients: defineTable({
    name: v.string(),
    category: v.string(), // "Carnes", "Vegetales", "Lácteos", "Granos", "Condimentos", "Bebidas"
    unit: v.string(), // "kg", "unidad", "litro", "gramo"
    costPerUnit: v.number(),
    supplier: v.string(),
    supplierContact: v.optional(v.string()),
    currentStock: v.number(),
    minStock: v.number(),
    notes: v.optional(v.string()),
    isActive: v.boolean(),
    createdAt: v.number(),
    updatedAt: v.number(),
  }).index("by_category", ["category"])
    .index("by_supplier", ["supplier"])
    .index("by_active", ["isActive"]),

  // Mapeo de platos a ingredientes (recetas)
  dishIngredients: defineTable({
    dishName: v.string(),
    ingredientId: v.id("ingredients"),
    quantityPerServing: v.number(),
    unit: v.string(),
    notes: v.optional(v.string()),
    // Campos para IA
    source: v.union(
      v.literal("manual"),
      v.literal("ai-generated"),
      v.literal("ai-verified")
    ),
    aiConfidence: v.optional(v.number()), // 0-100
    createdAt: v.number(),
    updatedAt: v.number(),
  }).index("by_dish", ["dishName"])
    .index("by_ingredient", ["ingredientId"]),

  // Listas de compras por evento
  shoppingLists: defineTable({
    bookingId: v.id("bookings"),
    generatedQuoteId: v.optional(v.id("generatedQuotes")),
    eventName: v.string(),
    eventDate: v.string(),
    numberOfGuests: v.number(),
    status: v.string(), // "draft", "pending", "sent", "completed"
    totalEstimatedCost: v.number(),
    notes: v.optional(v.string()),
    createdBy: v.optional(v.string()),
    // Audit fields
    auditFlags: v.optional(v.array(v.object({
      severity: v.union(v.literal("LOW"), v.literal("MEDIUM"), v.literal("HIGH")),
      title: v.string(),
      description: v.string(),
    }))),
    auditStatus: v.optional(v.union(
      v.literal("GREEN"),
      v.literal("YELLOW"),
      v.literal("RED")
    )),
    auditedAt: v.optional(v.number()),
    auditModel: v.optional(v.string()),
    createdAt: v.number(),
    updatedAt: v.number(),
  }).index("by_booking", ["bookingId"])
    .index("by_status", ["status"])
    .index("by_event_date", ["eventDate"])
    .index("by_audit_status", ["auditStatus"]),

  // Items de lista de compras
  shoppingListItems: defineTable({
    shoppingListId: v.id("shoppingLists"),
    ingredientId: v.optional(v.id("ingredients")),
    itemName: v.string(),
    category: v.string(),
    unit: v.string(),
    quantityNeeded: v.number(),
    quantityOrdered: v.optional(v.number()),
    estimatedCost: v.number(),
    actualCost: v.optional(v.number()),
    // Sistema de costos flexible
    costType: v.optional(v.string()), // "total", "perUnit", "perKg"
    costPerUnit: v.optional(v.number()), // Precio unitario (por botella, por kg, etc.)
    supplier: v.string(),
    isPurchased: v.boolean(),
    purchasedDate: v.optional(v.string()),
    notes: v.optional(v.string()),
    isManualItem: v.boolean(),
    createdAt: v.number(),
    updatedAt: v.number(),
  }).index("by_shopping_list", ["shoppingListId"])
    .index("by_ingredient", ["ingredientId"])
    .index("by_category", ["shoppingListId", "category"])
    .index("by_purchased", ["shoppingListId", "isPurchased"]),

  // Historial de generaciones con IA
  aiShoppingListGenerations: defineTable({
    bookingId: v.id("bookings"),
    eventName: v.string(),
    eventType: v.string(),
    numberOfGuests: v.number(),
    // Menú analizado (snapshot)
    menuSections: v.array(v.object({
      name: v.string(),
      items: v.array(v.object({
        category: v.string(),
        dishes: v.array(v.string()),
      })),
    })),
    // Resultado de la IA (JSON)
    aiResponse: v.string(), // JSON stringificado
    // Metadata de generación
    model: v.string(),
    promptVersion: v.string(),
    totalTokens: v.optional(v.number()),
    // Estado
    status: v.string(), // "pending", "approved", "rejected"
    approvedBy: v.optional(v.string()),
    // Resultado final
    shoppingListId: v.optional(v.id("shoppingLists")),
    createdAt: v.number(),
    updatedAt: v.number(),
  }).index("by_booking", ["bookingId"])
    .index("by_status", ["status"]),

  // Invitaciones de boda
  weddingInvitations: defineTable({
    // Identificadores
    slug: v.string(), // URL publica: /invitacion/javier-francisca
    accessCode: v.string(), // Codigo para editar (6 caracteres)
    ownerEmail: v.string(), // Email de los novios

    // Info pareja
    person1Name: v.string(),
    person2Name: v.string(),

    // Fecha del evento
    eventDate: v.string(),

    // Plantilla seleccionada
    templateId: v.string(), // "classic" | "romantic" | "modern"

    // Textos personalizables
    welcomeText: v.optional(v.string()),
    loveQuote: v.optional(v.string()),
    loveQuoteAuthor: v.optional(v.string()),

    // Ceremonia
    ceremonyDate: v.string(),
    ceremonyTime: v.string(),
    ceremonyLocation: v.string(),
    ceremonyAddress: v.string(),
    ceremonyMapsUrl: v.optional(v.string()),

    // Celebracion
    celebrationDate: v.optional(v.string()),
    celebrationTime: v.optional(v.string()),
    celebrationLocation: v.optional(v.string()),
    celebrationAddress: v.optional(v.string()),
    celebrationMapsUrl: v.optional(v.string()),

    // Galeria (Convex Storage IDs)
    photos: v.array(v.object({
      storageId: v.id("_storage"),
      caption: v.optional(v.string()),
      order: v.number(),
    })),

    // Fiesta
    dressCode: v.optional(v.string()),
    dressCodeDescription: v.optional(v.string()),
    additionalNotes: v.optional(v.string()),

    // RSVP
    rsvpEnabled: v.boolean(),
    rsvpDeadline: v.optional(v.string()),
    rsvpMessage: v.optional(v.string()),

    // Lista de regalos
    giftRegistryEnabled: v.optional(v.boolean()),
    giftRegistryTitle: v.optional(v.string()), // Ej: "Mesa de Regalos"
    giftRegistryMessage: v.optional(v.string()), // Mensaje personalizado
    giftRegistryLinks: v.optional(v.array(v.object({
      name: v.string(), // Ej: "Novios Falabella", "Novios Paris", "Transferencia"
      url: v.optional(v.string()), // URL del registro
      description: v.optional(v.string()), // Info adicional (ej: datos bancarios)
    }))),

    // Colores personalizados (override de plantilla)
    customColors: v.optional(v.object({
      primary: v.string(),
      secondary: v.string(),
      background: v.string(),
      text: v.string(),
    })),

    // Vinculacion con booking (opcional)
    bookingId: v.optional(v.id("bookings")),

    // === CAMPOS PARA MODELO SAAS ===
    // Estado de pago
    isPaid: v.boolean(), // true si pago o tiene reserva gratis
    paymentStatus: v.optional(v.union(
      v.literal("pending"),      // Esperando pago
      v.literal("paid"),         // Pagado
      v.literal("free_booking")  // Gratis por tener reserva
    )),
    paymentAmount: v.optional(v.number()),  // Monto pagado (si aplica)
    paymentDate: v.optional(v.number()),    // Timestamp del pago
    linkedBookingId: v.optional(v.id("bookings")), // Reserva que otorga acceso gratis

    // Metadata
    isActive: v.boolean(),
    isPublished: v.boolean(), // Visible publicamente
    viewCount: v.number(),
    createdAt: v.number(),
    updatedAt: v.number(),
  })
    .index("by_slug", ["slug"])
    .index("by_access_code", ["accessCode"])
    .index("by_owner_email", ["ownerEmail"])
    .index("by_booking", ["bookingId"])
    .index("by_payment_status", ["paymentStatus"]),

  // Configuracion de invitaciones (precios, etc)
  invitationSettings: defineTable({
    key: v.string(),        // "price", "currency", etc.
    value: v.string(),      // Valor de la configuracion
    updatedAt: v.number(),
  }).index("by_key", ["key"]),

  // RSVPs de invitados
  weddingRsvps: defineTable({
    invitationId: v.id("weddingInvitations"),
    guestName: v.string(),
    guestEmail: v.optional(v.string()),
    guestPhone: v.optional(v.string()),
    numberOfGuests: v.number(),
    willAttend: v.boolean(),
    dietaryRestrictions: v.optional(v.string()),
    message: v.optional(v.string()),
    createdAt: v.number(),
    // Tracking de importación a mesas
    importedToTables: v.optional(v.boolean()),
    importedAt: v.optional(v.number()),
    tableAssignmentIds: v.optional(v.array(v.id("tableAssignments"))),
  }).index("by_invitation", ["invitationId"]),

  // Sugerencias de canciones de invitados
  songSuggestions: defineTable({
    invitationId: v.id("weddingInvitations"),
    guestName: v.string(),
    songTitle: v.string(),
    artist: v.optional(v.string()),
    createdAt: v.number(),
  }).index("by_invitation", ["invitationId"]),

  // Reuniones con clientes
  meetings: defineTable({
    // Vinculación opcional a reserva
    bookingId: v.optional(v.id("bookings")),

    // Información de la reunión
    title: v.string(),
    meetingType: v.union(
      v.literal("consulta_inicial"),
      v.literal("planificacion_evento")
    ),

    // Fecha y hora
    meetingDate: v.string(), // formato YYYY-MM-DD
    startTime: v.string(),   // formato HH:MM
    endTime: v.string(),     // formato HH:MM

    // Información del cliente
    clientName: v.string(),
    clientEmail: v.string(),
    clientPhone: v.string(),

    // Estado y seguimiento
    status: v.union(
      v.literal("scheduled"),
      v.literal("completed"),
      v.literal("cancelled"),
      v.literal("rescheduled")
    ),

    // Notas y detalles
    notes: v.optional(v.string()),
    agenda: v.optional(v.string()),
    location: v.optional(v.string()), // "oficina", "virtual", "en sitio"

    // Minuta de reunión (resumen de temas tratados)
    meetingSummary: v.optional(v.string()),

    // Sistema de recordatorios
    reminderSent: v.boolean(),
    reminderSentAt: v.optional(v.number()),

    // Metadatos
    createdBy: v.optional(v.string()),
    createdAt: v.number(),
    updatedAt: v.number(),
  }).index("by_booking", ["bookingId"])
    .index("by_date", ["meetingDate"])
    .index("by_status", ["status"])
    .index("by_client_email", ["clientEmail"])
    .index("by_type", ["meetingType"]),
});
