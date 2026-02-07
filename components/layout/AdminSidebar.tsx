"use client"

import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import Image from "next/image"
import {
  LayoutDashboard,
  Calendar,
  CalendarCheck,
  FileText,
  DollarSign,
  Settings,
  ChevronLeft,
  LogOut,
  Users,
  ShoppingCart,
  History,
  UserCog,
  Grid3X3,
  Heart,
} from "lucide-react"
import { cn } from "@/lib/utils"
import { useState } from "react"
import { authClient } from "@/lib/auth-client"
import { Button } from "@/components/ui/button"
import { toast } from "sonner"
import { Toaster } from "@/components/ui/sonner"

const menuItems = [
  { title: "Dashboard", href: "/admin", icon: LayoutDashboard },
  { title: "Calendario", href: "/admin/calendario", icon: Calendar },
  { title: "Cotizaciones", href: "/admin/cotizaciones", icon: DollarSign },
  { title: "Reservas", href: "/admin/reservas", icon: FileText },
  { title: "Reuniones", href: "/admin/reuniones", icon: CalendarCheck },
  { title: "Personal", href: "/admin/personal", icon: UserCog },
  { title: "Mesas", href: "/admin/mesas", icon: Grid3X3 },
  { title: "Listas de Compras", href: "/admin/listas-compras", icon: ShoppingCart },
  { title: "Historial", href: "/admin/historial", icon: History },
  { title: "Invitaciones", href: "/admin/invitaciones", icon: Heart },
  { title: "Configuracion", href: "/admin/configuracion", icon: Settings },
]

export default function AdminSidebar() {
  const pathname = usePathname()
  const router = useRouter()
  const [isCollapsed, setIsCollapsed] = useState(false)
  const { data: session } = authClient.useSession()
  const adminName = session?.user?.name

  const handleLogout = async () => {
    try {
      await authClient.signOut()
      toast.success("Sesion cerrada correctamente")
      router.push("/admin/login")
    } catch (error) {
      console.error("Error al cerrar sesion:", error)
      toast.error("Error al cerrar sesion")
    }
  }

  return (
    <>
      <Toaster />
      <aside
        className={cn(
          "bg-white border-r border-gray-200 transition-all duration-300 flex flex-col",
          isCollapsed ? "w-16" : "w-64"
        )}
      >
      {/* Header */}
      <div className="h-20 flex items-center justify-between px-4 border-b border-gray-200">
        {!isCollapsed ? (
          <Link href="/admin" className="flex items-center space-x-2">
            <div className="relative h-10 w-10 flex-shrink-0">
              <Image
                src="/Logo.rukalefun.jpg"
                alt="Logo Ruka Lefun"
                fill
                className="object-contain rounded-full"
              />
            </div>
            <span className="text-lg font-bold text-nature-forest">Ruka Admin</span>
          </Link>
        ) : (
          <Link href="/admin" className="flex items-center justify-center w-full">
            <div className="relative h-8 w-8">
              <Image
                src="/Logo.rukalefun.jpg"
                alt="Logo Ruka Lefun"
                fill
                className="object-contain rounded-full"
              />
            </div>
          </Link>
        )}
        <button
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
        >
          <ChevronLeft
            className={cn(
              "h-5 w-5 transition-transform",
              isCollapsed && "rotate-180"
            )}
          />
        </button>
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto py-4">
        <ul className="space-y-1 px-3">
          {menuItems.map((item) => {
            const Icon = item.icon
            const isActive = pathname === item.href

            return (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className={cn(
                    "flex items-center space-x-3 px-3 py-2.5 rounded-lg transition-colors",
                    isActive
                      ? "bg-nature-forest text-white"
                      : "text-gray-700 hover:bg-gray-100"
                  )}
                  title={isCollapsed ? item.title : undefined}
                >
                  <Icon className="h-5 w-5 flex-shrink-0" />
                  {!isCollapsed && (
                    <span className="text-sm font-medium">{item.title}</span>
                  )}
                </Link>
              </li>
            )
          })}
        </ul>
      </nav>

      {/* Footer */}
      <div className="border-t border-gray-200 p-4 space-y-3">
        {!isCollapsed && (
          <>
            {/* Nombre del admin */}
            {adminName && (
              <div className="text-xs text-gray-600 bg-gray-100 rounded-lg p-2">
                <p className="font-medium truncate">👤 {adminName}</p>
              </div>
            )}

            {/* Boton de logout */}
            <Button
              onClick={handleLogout}
              variant="outline"
              className="w-full text-red-600 hover:text-red-700 hover:bg-red-50"
              size="sm"
            >
              <LogOut className="h-4 w-4 mr-2" />
              Cerrar Sesion
            </Button>

            {/* Link al sitio publico */}
            <div className="text-xs text-gray-500 text-center">
              <Link
                href="/"
                className="text-nature-moss hover:text-nature-forest transition-colors"
              >
                ← Volver al sitio publico
              </Link>
            </div>
          </>
        )}

        {isCollapsed && (
          <button
            onClick={handleLogout}
            className="w-full p-2 rounded-lg hover:bg-red-50 text-red-600 transition-colors"
            title="Cerrar sesion"
          >
            <LogOut className="h-5 w-5 mx-auto" />
          </button>
        )}
      </div>
    </aside>
    </>
  )
}
