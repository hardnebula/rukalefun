"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { useQuery } from "convex/react"
import { api } from "@/convex/_generated/api"
import { getAdminSession } from "@/lib/auth"
import { Loader2 } from "lucide-react"

export default function AdminGuard({ children }: { children: React.ReactNode }) {
  const router = useRouter()
  const [isChecking, setIsChecking] = useState(true)
  const sessionId = getAdminSession()
  
  const session = useQuery(
    api.auth.verifySession,
    sessionId ? { sessionId: sessionId as any } : "skip"
  )

  useEffect(() => {
    if (!sessionId) {
      // No hay sesión, redirigir a login
      router.push("/admin/login")
      return
    }

    if (session === undefined) {
      // Todavía cargando
      return
    }

    if (session === null) {
      // Sesión inválida o expirada
      localStorage.removeItem("adminSession")
      localStorage.removeItem("adminName")
      router.push("/admin/login")
      return
    }

    // Sesión válida
    setIsChecking(false)
  }, [sessionId, session, router])

  if (isChecking || !session) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin text-nature-forest mx-auto mb-4" />
          <p className="text-gray-600">Verificando acceso...</p>
        </div>
      </div>
    )
  }

  return <>{children}</>
}

