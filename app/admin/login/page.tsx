"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { useMutation, useQuery } from "convex/react"
import { api } from "@/convex/_generated/api"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Lock, User } from "lucide-react"
import Image from "next/image"
import { toast } from "sonner"
import { Toaster } from "@/components/ui/sonner"

export default function AdminLogin() {
  const router = useRouter()
  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")
  const [isLoading, setIsLoading] = useState(false)

  const loginAdmin = useMutation(api.auth.loginAdmin)
  const adminExists = useQuery(api.auth.checkAdminExists)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      const result = await loginAdmin({ username, password })
      
      // Guardar sesión en localStorage
      localStorage.setItem("adminSession", result.sessionId)
      localStorage.setItem("adminName", result.admin.name)
      
      toast.success(`¡Bienvenido, ${result.admin.name}!`)
      
      // Redirigir al dashboard
      setTimeout(() => {
        router.push("/admin")
      }, 500)
    } catch (error: any) {
      toast.error(error.message || "Error al iniciar sesión")
      setPassword("")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-nature-forest via-nature-moss to-nature-lake p-4">
      <Toaster />
      
      <Card className="w-full max-w-md shadow-2xl">
        <CardHeader className="space-y-4 text-center pb-8">
          <div className="flex justify-center">
            <div className="relative h-20 w-20">
              <Image
                src="/Logo.rukalefun.jpg"
                alt="Logo Ruka Lefún"
                fill
                className="object-contain rounded-full"
              />
            </div>
          </div>
          <div>
            <CardTitle className="text-3xl font-bold text-nature-forest">
              Ruka Lefún
            </CardTitle>
            <CardDescription className="text-lg mt-2">
              Panel Administrativo
            </CardDescription>
          </div>
        </CardHeader>

        <CardContent>
          {adminExists === false ? (
            <div className="text-center py-6 space-y-4">
              <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
                <p className="text-amber-800 font-medium">
                  ⚠️ No hay administradores configurados
                </p>
                <p className="text-sm text-amber-600 mt-2">
                  Ejecuta el seed para crear el usuario inicial
                </p>
              </div>
              <div className="bg-gray-50 rounded-lg p-4 text-left">
                <p className="text-sm text-gray-600 font-mono">
                  npx convex run seed:createInitialAdmin
                </p>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="username">Usuario</Label>
                <div className="relative">
                  <User className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <Input
                    id="username"
                    type="text"
                    placeholder="Ingresa tu usuario"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    className="pl-10"
                    required
                    disabled={isLoading}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="password">Contraseña</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <Input
                    id="password"
                    type="password"
                    placeholder="Ingresa tu contraseña"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="pl-10"
                    required
                    disabled={isLoading}
                  />
                </div>
              </div>

              <Button
                type="submit"
                className="w-full bg-nature-forest hover:bg-nature-moss text-white"
                disabled={isLoading}
              >
                {isLoading ? "Iniciando sesión..." : "Iniciar Sesión"}
              </Button>

              <div className="text-center text-sm text-gray-500">
                <p>Acceso exclusivo para administradores</p>
              </div>
            </form>
          )}
        </CardContent>
      </Card>
    </div>
  )
}





