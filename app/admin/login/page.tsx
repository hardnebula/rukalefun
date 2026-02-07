"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Lock, Mail } from "lucide-react"
import Image from "next/image"
import { toast } from "sonner"
import { Toaster } from "@/components/ui/sonner"
import { authClient } from "@/lib/auth-client"

export default function AdminLogin() {
  const router = useRouter()
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      const result = await authClient.signIn.email({
        email,
        password,
      })

      if (result.error) {
        toast.error(result.error.message || "Error al iniciar sesion")
        setPassword("")
        return
      }

      toast.success("Bienvenido!")
      setTimeout(() => {
        router.push("/admin")
      }, 500)
    } catch (error: any) {
      toast.error(error.message || "Error al iniciar sesion")
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
                alt="Logo Ruka Lefun"
                fill
                className="object-contain rounded-full"
              />
            </div>
          </div>
          <div>
            <CardTitle className="text-3xl font-bold text-nature-forest">
              Ruka Lefun
            </CardTitle>
            <CardDescription className="text-lg mt-2">
              Panel Administrativo
            </CardDescription>
          </div>
        </CardHeader>

        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Input
                  id="email"
                  type="email"
                  placeholder="Ingresa tu email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="pl-10"
                  required
                  disabled={isLoading}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">Contrasena</Label>
              <div className="relative">
                <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Input
                  id="password"
                  type="password"
                  placeholder="Ingresa tu contrasena"
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
              {isLoading ? "Iniciando sesion..." : "Iniciar Sesion"}
            </Button>

            <div className="text-center text-sm text-gray-500">
              <p>Acceso exclusivo para administradores</p>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
