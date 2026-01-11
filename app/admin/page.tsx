"use client"

import { useQuery } from "convex/react"
import { api } from "@/convex/_generated/api"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Calendar, DollarSign, Users, Clock, TrendingUp, AlertCircle } from "lucide-react"
import Link from "next/link"
import { Button } from "@/components/ui/button"

export default function AdminDashboard() {
  const bookings = useQuery(api.bookings.getAllBookings)
  const quotes = useQuery(api.quotes.getAllQuotes)
  const spaces = useQuery(api.spaces.getAllSpaces)
  const dashboardStats = useQuery(api.analytics.getDashboardStats)

  // Calcular estadísticas (con fallback a cálculo manual)
  const stats = dashboardStats || {
    bookings: {
      total: bookings?.length || 0,
      pending: bookings?.filter((b) => b.status === "pending").length || 0,
      confirmed: bookings?.filter((b) => b.status === "confirmed").length || 0,
      upcoming: 0,
    },
    quotes: {
      new: quotes?.filter((q) => q.status === "new").length || 0,
    },
    revenue: {
      total: bookings?.reduce((sum, b) => sum + (b.totalAmount || 0), 0) || 0,
      pending: bookings?.reduce((sum, b) => sum + (b.balanceRemaining || 0), 0) || 0,
    },
  }

  // Próximos eventos (los 5 más cercanos)
  const upcomingEvents = bookings
    ?.filter((b) => b.status === "confirmed")
    .sort((a, b) => a.eventDate.localeCompare(b.eventDate))
    .slice(0, 5)

  // Reservas recientes
  const recentBookings = bookings
    ?.sort((a, b) => b.createdAt - a.createdAt)
    .slice(0, 5)

  // Cotizaciones recientes
  const recentQuotes = quotes
    ?.filter((q) => q.status === "new" || q.status === "contacted")
    .sort((a, b) => b.createdAt - a.createdAt)
    .slice(0, 5)

  const getStatusBadge = (status: string) => {
    const variants: Record<string, "default" | "secondary" | "destructive" | "outline"> = {
      pending: "outline",
      confirmed: "default",
      cancelled: "destructive",
      completed: "secondary",
    }
    const labels: Record<string, string> = {
      pending: "Pendiente",
      confirmed: "Confirmado",
      cancelled: "Cancelado",
      completed: "Completado",
    }
    return (
      <Badge variant={variants[status] || "outline"}>
        {labels[status] || status}
      </Badge>
    )
  }

  return (
    <div className="p-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Dashboard</h1>
        <p className="text-gray-600">
          Vista general de tu centro de eventos
        </p>
      </div>

      {/* Estadísticas */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <Card className="hover:shadow-lg transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Reservas</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.bookings.total}</div>
            <p className="text-xs text-muted-foreground mt-1">
              {stats.bookings.confirmed} confirmadas
            </p>
            {stats.bookings.upcoming > 0 && (
              <p className="text-xs text-green-600 mt-1">
                {stats.bookings.upcoming} próximos 30 días
              </p>
            )}
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pendientes</CardTitle>
            <Clock className="h-4 w-4 text-amber-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-amber-600">{stats.bookings.pending}</div>
            <p className="text-xs text-muted-foreground mt-1">
              Requieren atención
            </p>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Ingresos Totales</CardTitle>
            <DollarSign className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${stats.revenue.total.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground mt-1">
              ${stats.revenue.pending.toLocaleString()} pendiente
            </p>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Nuevas Cotizaciones</CardTitle>
            <Users className="h-4 w-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">{stats.quotes.new}</div>
            <p className="text-xs text-muted-foreground mt-1">
              Sin responder
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Próximos Eventos */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Próximos Eventos</CardTitle>
                <CardDescription>Eventos confirmados más cercanos</CardDescription>
              </div>
              <Button size="sm" variant="outline" asChild>
                <Link href="/admin/calendario">Ver Calendario</Link>
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            {upcomingEvents && upcomingEvents.length > 0 ? (
              <div className="space-y-4">
                {upcomingEvents.map((booking) => (
                  <div
                    key={booking._id}
                    className="flex items-start space-x-4 p-3 rounded-lg bg-gray-50 hover:bg-gray-100 transition-colors"
                  >
                    <div className="bg-nature-forest text-white rounded-lg p-2 text-center min-w-[60px]">
                      <div className="text-xs font-medium">
                        {new Date(booking.eventDate).toLocaleDateString("es-CL", {
                          month: "short",
                        })}
                      </div>
                      <div className="text-2xl font-bold">
                        {new Date(booking.eventDate).getDate()}
                      </div>
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="font-semibold text-sm truncate">
                        {booking.clientName}
                      </h4>
                      <p className="text-sm text-gray-600">{booking.eventType}</p>
                      <div className="flex items-center space-x-2 mt-1 text-xs text-gray-500">
                        <Clock className="h-3 w-3" />
                        <span>
                          {booking.startTime} - {booking.endTime}
                        </span>
                        <Users className="h-3 w-3 ml-2" />
                        <span>{booking.numberOfGuests} personas</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 text-gray-500">
                <Calendar className="h-12 w-12 mx-auto mb-3 opacity-20" />
                <p>No hay eventos confirmados próximos</p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Reservas Recientes */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Reservas Recientes</CardTitle>
                <CardDescription>Últimas solicitudes recibidas</CardDescription>
              </div>
              <Button size="sm" variant="outline" asChild>
                <Link href="/admin/reservas">Ver Todas</Link>
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            {recentBookings && recentBookings.length > 0 ? (
              <div className="space-y-4">
                {recentBookings.map((booking) => (
                  <div
                    key={booking._id}
                    className="flex items-start justify-between p-3 rounded-lg bg-gray-50 hover:bg-gray-100 transition-colors"
                  >
                    <div className="flex-1">
                      <div className="flex items-center space-x-2 mb-1">
                        <h4 className="font-semibold text-sm">{booking.clientName}</h4>
                        {getStatusBadge(booking.status)}
                      </div>
                      <p className="text-sm text-gray-600">{booking.eventType}</p>
                      <p className="text-xs text-gray-500 mt-1">
                        {new Date(booking.eventDate).toLocaleDateString("es-CL")}
                      </p>
                    </div>
                    <Button size="sm" variant="ghost" asChild>
                      <Link href={`/admin/reservas`}>Ver</Link>
                    </Button>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 text-gray-500">
                <AlertCircle className="h-12 w-12 mx-auto mb-3 opacity-20" />
                <p>No hay reservas recientes</p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Cotizaciones Pendientes */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Cotizaciones Pendientes</CardTitle>
                <CardDescription>Solicitudes que requieren respuesta</CardDescription>
              </div>
              <Button size="sm" variant="outline" asChild>
                <Link href="/admin/cotizaciones">Ver Todas</Link>
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            {recentQuotes && recentQuotes.length > 0 ? (
              <div className="space-y-4">
                {recentQuotes.map((quote) => (
                  <div
                    key={quote._id}
                    className="flex items-start justify-between p-3 rounded-lg bg-gray-50 hover:bg-gray-100 transition-colors"
                  >
                    <div className="flex-1">
                      <div className="flex items-center space-x-2 mb-1">
                        <h4 className="font-semibold text-sm">{quote.name}</h4>
                        {quote.status === "new" && (
                          <Badge className="bg-blue-600 text-white">
                            Nueva
                          </Badge>
                        )}
                      </div>
                      <p className="text-sm text-gray-600">{quote.eventType}</p>
                      <div className="flex items-center space-x-2 mt-1 text-xs text-gray-500">
                        <Users className="h-3 w-3" />
                        <span>{quote.numberOfGuests} invitados</span>
                        {quote.eventDate && (
                          <>
                            <Calendar className="h-3 w-3 ml-2" />
                            <span>{new Date(quote.eventDate).toLocaleDateString("es-CL")}</span>
                          </>
                        )}
                      </div>
                    </div>
                    <Button size="sm" variant="ghost" asChild>
                      <Link href="/admin/cotizaciones">Ver</Link>
                    </Button>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 text-gray-500">
                <DollarSign className="h-12 w-12 mx-auto mb-3 opacity-20" />
                <p>No hay cotizaciones pendientes</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>


      {/* Alertas y Acciones Rápidas */}
      {stats.bookings.pending > 0 && (
        <Card className="mt-8 border-amber-200 bg-amber-50">
          <CardHeader>
            <div className="flex items-center space-x-2">
              <AlertCircle className="h-5 w-5 text-amber-600" />
              <CardTitle className="text-amber-900">Atención Requerida</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <p className="text-amber-800 mb-4">
              Tienes {stats.bookings.pending} reserva(s) pendiente(s) de confirmación.
            </p>
            <Button size="sm" asChild>
              <Link href="/admin/reservas">Revisar Reservas Pendientes</Link>
            </Button>
          </CardContent>
        </Card>
      )}

      {stats.quotes.new > 0 && (
        <Card className="mt-4 border-blue-200 bg-blue-50">
          <CardHeader>
            <div className="flex items-center space-x-2">
              <TrendingUp className="h-5 w-5 text-blue-600" />
              <CardTitle className="text-blue-900">Nuevas Oportunidades</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <p className="text-blue-800 mb-4">
              Tienes {stats.quotes.new} solicitud(es) de cotización nuevas.
            </p>
            <Button size="sm" asChild>
              <Link href="/admin/cotizaciones">Ver Cotizaciones</Link>
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  )
}

