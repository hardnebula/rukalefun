import { query } from "./_generated/server";
import { v } from "convex/values";

// Estadísticas generales del dashboard
export const getDashboardStats = query({
  handler: async (ctx) => {
    const bookings = await ctx.db.query("bookings").collect();
    const quotes = await ctx.db.query("quoteRequests").collect();
    const spaces = await ctx.db.query("spaces").collect();
    
    const now = Date.now();
    const today = new Date().toISOString().split("T")[0];
    const thisMonth = new Date().toISOString().substring(0, 7);
    
    // Estadísticas de reservas
    const totalBookings = bookings.length;
    const pendingBookings = bookings.filter((b) => b.status === "pending").length;
    const confirmedBookings = bookings.filter((b) => b.status === "confirmed").length;
    const thisMonthBookings = bookings.filter((b) => b.eventDate.startsWith(thisMonth)).length;
    
    // Estadísticas de cotizaciones
    const newQuotes = quotes.filter((q) => q.status === "new").length;
    const totalQuotes = quotes.length;
    const thisMonthQuotes = quotes.filter((q) => {
      const quoteMonth = new Date(q.createdAt).toISOString().substring(0, 7);
      return quoteMonth === thisMonth;
    }).length;
    
    // Estadísticas financieras
    const totalRevenue = bookings.reduce((sum, b) => sum + (b.totalAmount || 0), 0);
    const pendingPayments = bookings.reduce((sum, b) => sum + (b.balanceRemaining || 0), 0);
    const thisMonthRevenue = bookings
      .filter((b) => b.eventDate.startsWith(thisMonth))
      .reduce((sum, b) => sum + (b.totalAmount || 0), 0);
    
    // Próximos eventos (próximos 30 días)
    const futureDate = new Date();
    futureDate.setDate(futureDate.getDate() + 30);
    const futureDateStr = futureDate.toISOString().split("T")[0];
    
    const upcomingEvents = bookings.filter(
      (b) => b.eventDate >= today && b.eventDate <= futureDateStr && b.status === "confirmed"
    ).length;
    
    // Tasa de conversión
    const conversionRate = totalQuotes > 0
      ? ((confirmedBookings / totalQuotes) * 100).toFixed(1)
      : "0";
    
    // Espacios más populares
    const spaceBookings: Record<string, number> = {};
    bookings.forEach((b) => {
      const spaceId = b.spaceId;
      if (spaceId) {
        spaceBookings[spaceId] = (spaceBookings[spaceId] || 0) + 1;
      }
    });
    
    return {
      bookings: {
        total: totalBookings,
        pending: pendingBookings,
        confirmed: confirmedBookings,
        thisMonth: thisMonthBookings,
        upcoming: upcomingEvents,
      },
      quotes: {
        total: totalQuotes,
        new: newQuotes,
        thisMonth: thisMonthQuotes,
      },
      revenue: {
        total: totalRevenue,
        pending: pendingPayments,
        thisMonth: thisMonthRevenue,
      },
      conversion: {
        rate: parseFloat(conversionRate),
      },
      spaces: {
        total: spaces.length,
        active: spaces.filter((s) => s.isActive).length,
      },
    };
  },
});

// Eventos por mes (para gráficos)
export const getBookingsByMonth = query({
  args: { year: v.optional(v.number()) },
  handler: async (ctx, args) => {
    const year = args.year || new Date().getFullYear();
    const bookings = await ctx.db.query("bookings").collect();
    
    const monthlyData = Array.from({ length: 12 }, (_, i) => ({
      month: i + 1,
      confirmed: 0,
      pending: 0,
      cancelled: 0,
      revenue: 0,
    }));
    
    bookings.forEach((booking) => {
      const bookingYear = new Date(booking.eventDate).getFullYear();
      if (bookingYear === year) {
        const month = new Date(booking.eventDate).getMonth();
        monthlyData[month][booking.status as keyof typeof monthlyData[0]] += 1;
        monthlyData[month].revenue += booking.totalAmount || 0;
      }
    });
    
    return monthlyData;
  },
});

// Tipos de eventos más solicitados
export const getEventTypeStats = query({
  handler: async (ctx) => {
    const bookings = await ctx.db.query("bookings").collect();
    const quotes = await ctx.db.query("quoteRequests").collect();
    
    const eventTypes: Record<string, { bookings: number; quotes: number }> = {};
    
    bookings.forEach((b) => {
      if (!eventTypes[b.eventType]) {
        eventTypes[b.eventType] = { bookings: 0, quotes: 0 };
      }
      eventTypes[b.eventType].bookings += 1;
    });
    
    quotes.forEach((q) => {
      if (!eventTypes[q.eventType]) {
        eventTypes[q.eventType] = { bookings: 0, quotes: 0 };
      }
      eventTypes[q.eventType].quotes += 1;
    });
    
    return Object.entries(eventTypes).map(([type, stats]) => ({
      type,
      ...stats,
      total: stats.bookings + stats.quotes,
    })).sort((a, b) => b.total - a.total);
  },
});

// Ocupación por espacio
export const getSpaceOccupancy = query({
  handler: async (ctx) => {
    const spaces = await ctx.db.query("spaces").collect();
    const bookings = await ctx.db.query("bookings").collect();
    
    return await Promise.all(
      spaces.map(async (space) => {
        const spaceBookings = bookings.filter(
          (b) => b.spaceId === space._id && b.status !== "cancelled"
        );
        
        return {
          spaceId: space._id,
          spaceName: space.name,
          totalBookings: spaceBookings.length,
          confirmedBookings: spaceBookings.filter((b) => b.status === "confirmed").length,
          revenue: spaceBookings.reduce((sum, b) => sum + (b.totalAmount || 0), 0),
        };
      })
    );
  },
});





