import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

// Verificar si existe un usuario admin
export const checkAdminExists = query({
  handler: async (ctx) => {
    const admin = await ctx.db
      .query("admins")
      .first();
    return admin !== null;
  },
});

// Crear el primer usuario admin (solo si no existe ninguno)
export const createInitialAdmin = mutation({
  args: {
    username: v.string(),
    password: v.string(),
    name: v.string(),
  },
  handler: async (ctx, args) => {
    // Verificar que no exista ya un admin
    const existingAdmin = await ctx.db
      .query("admins")
      .first();
    
    if (existingAdmin) {
      throw new Error("Ya existe un administrador");
    }

    // En producción, deberías hashear la contraseña
    // Por ahora usamos texto plano (cambiar en producción)
    const adminId = await ctx.db.insert("admins", {
      username: args.username,
      password: args.password, // TODO: Hashear en producción
      name: args.name,
      isActive: true,
      createdAt: Date.now(),
    });

    return adminId;
  },
});

// Login del administrador
export const loginAdmin = mutation({
  args: {
    username: v.string(),
    password: v.string(),
  },
  handler: async (ctx, args) => {
    const admin = await ctx.db
      .query("admins")
      .filter((q) => 
        q.and(
          q.eq(q.field("username"), args.username),
          q.eq(q.field("password"), args.password), // TODO: Comparar hash en producción
          q.eq(q.field("isActive"), true)
        )
      )
      .first();

    if (!admin) {
      throw new Error("Credenciales inválidas");
    }

    // Crear sesión
    const sessionId = await ctx.db.insert("sessions", {
      adminId: admin._id,
      createdAt: Date.now(),
      expiresAt: Date.now() + (7 * 24 * 60 * 60 * 1000), // 7 días
    });

    return {
      sessionId,
      admin: {
        id: admin._id,
        username: admin.username,
        name: admin.name,
      },
    };
  },
});

// Verificar sesión
export const verifySession = query({
  args: { sessionId: v.id("sessions") },
  handler: async (ctx, args) => {
    const session = await ctx.db.get(args.sessionId);
    
    if (!session) {
      return null;
    }

    // Verificar si la sesión ha expirado
    if (session.expiresAt < Date.now()) {
      return null;
    }

    // Obtener información del admin
    const admin = await ctx.db.get(session.adminId);
    
    if (!admin || !admin.isActive) {
      return null;
    }

    return {
      id: admin._id,
      username: admin.username,
      name: admin.name,
    };
  },
});

// Cerrar sesión
export const logout = mutation({
  args: { sessionId: v.id("sessions") },
  handler: async (ctx, args) => {
    await ctx.db.delete(args.sessionId);
  },
});

// Cambiar contraseña
export const changePassword = mutation({
  args: {
    sessionId: v.id("sessions"),
    currentPassword: v.string(),
    newPassword: v.string(),
  },
  handler: async (ctx, args) => {
    const session = await ctx.db.get(args.sessionId);
    
    if (!session) {
      throw new Error("Sesión inválida");
    }

    const admin = await ctx.db.get(session.adminId);
    
    if (!admin || admin.password !== args.currentPassword) {
      throw new Error("Contraseña actual incorrecta");
    }

    await ctx.db.patch(admin._id, {
      password: args.newPassword, // TODO: Hashear en producción
    });

    return { success: true };
  },
});

