"use client"

import { useQuery } from "convex/react"
import { api } from "@/convex/_generated/api"
import { useParams } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Wine, Beer, Package, PackageCheck, Calendar, Users } from "lucide-react"
import Image from "next/image"
import Link from "next/link"

const DRINK_TYPE_LABELS: Record<string, string> = {
  vino: "Vino",
  cerveza: "Cerveza",
  pisco: "Pisco",
  whisky: "Whisky",
  ron: "Ron",
  vodka: "Vodka",
  tequila: "Tequila",
  gin: "Gin",
  champagne: "Champagne",
  bebida: "Bebida",
  otro: "Otro",
}

const DRINK_TYPE_ICONS: Record<string, string> = {
  vino: "wine",
  cerveza: "beer",
  champagne: "wine",
}

export default function InventarioPublicoPage() {
  const params = useParams()
  const code = params.code as string

  const data = useQuery(api.drinkInventory.getPublicByAccessCode, { accessCode: code })

  if (data === undefined) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-green-50 to-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Cargando inventario...</p>
        </div>
      </div>
    )
  }

  if (data === null) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-green-50 to-white flex items-center justify-center p-4">
        <Card className="max-w-md w-full">
          <CardContent className="p-8 text-center">
            <Wine className="w-16 h-16 mx-auto mb-4 text-gray-300" />
            <h1 className="text-xl font-semibold text-gray-900 mb-2">
              Inventario no encontrado
            </h1>
            <p className="text-gray-600 mb-6">
              El enlace que usaste no es valido o ha expirado.
            </p>
            <Link
              href="/"
              className="text-green-600 hover:text-green-700 font-medium"
            >
              Volver al inicio
            </Link>
          </CardContent>
        </Card>
      </div>
    )
  }

  const { booking, drinks, summary } = data
  const eventDate = new Date(booking.eventDate + "T12:00:00")

  const getStatusBadge = (status: string) => {
    const config: Record<string, { variant: "default" | "secondary" | "outline"; label: string }> = {
      pending_arrival: { variant: "outline", label: "Por llegar" },
      received: { variant: "default", label: "Recibido" },
      completed: { variant: "secondary", label: "Completado" },
    }
    const { variant, label } = config[status] || { variant: "outline", label: status }
    return <Badge variant={variant}>{label}</Badge>
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-green-50 to-white">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-4xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Link href="/" className="flex items-center gap-2">
              <Image
                src="/logo.png"
                alt="Ruka Lefun"
                width={40}
                height={40}
                className="rounded-full"
              />
              <span className="font-semibold text-gray-900">Ruka Lefun</span>
            </Link>
            <Badge variant="outline" className="text-green-700 border-green-300">
              Inventario de Tragos
            </Badge>
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 py-8">
        {/* Info del evento */}
        <Card className="mb-8 border-green-200 bg-green-50/50">
          <CardHeader>
            <CardTitle className="text-xl text-green-800">
              {booking.eventType}
            </CardTitle>
            <div className="flex flex-wrap gap-4 text-sm text-green-700 mt-2">
              <div className="flex items-center gap-1">
                <Users className="w-4 h-4" />
                {booking.clientName}
              </div>
              <div className="flex items-center gap-1">
                <Calendar className="w-4 h-4" />
                {eventDate.toLocaleDateString("es-CL", {
                  weekday: "long",
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </div>
            </div>
          </CardHeader>
        </Card>

        {/* Resumen */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <Card>
            <CardContent className="p-4 text-center">
              <Package className="w-8 h-8 mx-auto mb-2 text-blue-500" />
              <p className="text-2xl font-bold text-gray-900">{summary.totalIn}</p>
              <p className="text-sm text-gray-500">Botellas entrada</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center">
              <Wine className="w-8 h-8 mx-auto mb-2 text-red-500" />
              <p className="text-2xl font-bold text-gray-900">{summary.totalConsumed}</p>
              <p className="text-sm text-gray-500">Consumidas</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center">
              <PackageCheck className="w-8 h-8 mx-auto mb-2 text-green-500" />
              <p className="text-2xl font-bold text-gray-900">{summary.totalReturned}</p>
              <p className="text-sm text-gray-500">Devueltas</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center">
              <Beer className="w-8 h-8 mx-auto mb-2 text-amber-500" />
              <p className="text-2xl font-bold text-gray-900">{summary.pending}</p>
              <p className="text-sm text-gray-500">Pendientes</p>
            </CardContent>
          </Card>
        </div>

        {/* Titulo de la tabla */}
        <div className="mb-4">
          <h2 className="text-lg font-semibold text-gray-900">Detalle del Inventario</h2>
          <p className="text-sm text-gray-500">
            {drinks.length} {drinks.length === 1 ? "item registrado" : "items registrados"}
          </p>
        </div>

        {/* Lista de tragos */}
        {drinks.length === 0 ? (
          <Card>
            <CardContent className="p-12 text-center">
              <Wine className="w-16 h-16 mx-auto mb-4 text-gray-300" />
              <h3 className="text-lg font-semibold text-gray-700 mb-2">Sin tragos registrados</h3>
              <p className="text-gray-500">
                Aun no se han registrado tragos para este evento.
              </p>
            </CardContent>
          </Card>
        ) : (
          <Card>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="bg-gray-50 border-b">
                    <th className="text-left p-4 text-sm font-semibold text-gray-700">Tipo</th>
                    <th className="text-left p-4 text-sm font-semibold text-gray-700">Marca</th>
                    <th className="text-center p-4 text-sm font-semibold text-gray-700">Entrada</th>
                    <th className="text-center p-4 text-sm font-semibold text-gray-700">Consumidas</th>
                    <th className="text-center p-4 text-sm font-semibold text-gray-700">Devueltas</th>
                    <th className="text-center p-4 text-sm font-semibold text-gray-700">Estado</th>
                  </tr>
                </thead>
                <tbody>
                  {drinks.map((drink, index) => (
                    <tr key={index} className="border-b last:border-b-0 hover:bg-gray-50">
                      <td className="p-4">
                        <span className="font-medium">
                          {DRINK_TYPE_LABELS[drink.drinkType] || drink.drinkType}
                        </span>
                      </td>
                      <td className="p-4 text-gray-700">{drink.brand}</td>
                      <td className="p-4 text-center font-semibold">{drink.quantityIn}</td>
                      <td className="p-4 text-center">
                        {drink.quantityConsumed !== undefined && drink.quantityConsumed !== null
                          ? drink.quantityConsumed
                          : "-"}
                      </td>
                      <td className="p-4 text-center">
                        {drink.quantityReturned !== undefined && drink.quantityReturned !== null
                          ? drink.quantityReturned
                          : "-"}
                      </td>
                      <td className="p-4 text-center">{getStatusBadge(drink.status)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>
        )}

        {/* Footer */}
        <div className="mt-8 text-center text-sm text-gray-500">
          <p>
            Este inventario se actualiza en tiempo real.
          </p>
          <p className="mt-1">
            Ruka Lefun - Villarrica, Chile
          </p>
        </div>
      </main>
    </div>
  )
}
