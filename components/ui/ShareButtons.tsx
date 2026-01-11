"use client"

import { Facebook, Instagram, MessageCircle, Link as LinkIcon } from "lucide-react"
import { Button } from "@/components/ui/button"
import { toast } from "sonner"

interface ShareButtonsProps {
  url?: string
  title?: string
  description?: string
  className?: string
}

export default function ShareButtons({
  url = typeof window !== 'undefined' ? window.location.href : '',
  title = "Ruka Lefún - Centro de Eventos",
  description = "Descubre nuestro centro de eventos en Villarrica",
  className = ""
}: ShareButtonsProps) {

  const shareOnInstagram = () => {
    // Instagram no tiene una API de compartir directo, así que copiamos el link y mostramos instrucciones
    navigator.clipboard.writeText(url)
    toast.success("Enlace copiado. Pégalo en tu historia o publicación de Instagram")
  }

  const shareOnWhatsApp = () => {
    const text = encodeURIComponent(`${title}\n${description}\n\n${url}`)
    const shareUrl = `https://wa.me/?text=${text}`
    window.open(shareUrl, '_blank')
  }

  const shareOnFacebook = () => {
    const shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`
    window.open(shareUrl, '_blank', 'width=600,height=400')
  }

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(url)
      toast.success("¡Enlace copiado al portapapeles!")
    } catch (err) {
      toast.error("No se pudo copiar el enlace")
    }
  }

  return (
    <div className={`flex items-center gap-2 ${className}`}>
      <span className="text-sm opacity-80 mr-2">Compartir:</span>

      <Button
        size="sm"
        onClick={shareOnInstagram}
        className="bg-gradient-to-br from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white border-0 shadow-sm hover:shadow-md transition-all"
        aria-label="Compartir en Instagram"
      >
        <Instagram className="h-4 w-4" />
      </Button>

      <Button
        size="sm"
        onClick={shareOnWhatsApp}
        className="bg-green-500 hover:bg-green-600 text-white border-0 shadow-sm hover:shadow-md transition-all"
        aria-label="Compartir en WhatsApp"
      >
        <MessageCircle className="h-4 w-4" />
      </Button>

      <Button
        size="sm"
        onClick={shareOnFacebook}
        className="bg-blue-600 hover:bg-blue-700 text-white border-0 shadow-sm hover:shadow-md transition-all"
        aria-label="Compartir en Facebook"
      >
        <Facebook className="h-4 w-4" />
      </Button>

      <Button
        size="sm"
        onClick={copyToClipboard}
        className="bg-gray-600 hover:bg-gray-700 text-white border-0 shadow-sm hover:shadow-md transition-all"
        aria-label="Copiar enlace"
      >
        <LinkIcon className="h-4 w-4" />
      </Button>
    </div>
  )
}
