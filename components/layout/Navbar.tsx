"use client"

import Link from "next/link"
import { useState, useEffect } from "react"
import { Menu, X, Calendar, Home, Mail, Heart } from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import Image from "next/image"

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20)
    }
    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  const navLinks = [
    { href: "/", label: "Inicio", icon: Home },
    { href: "/espacios", label: "Espacios", icon: Home },
    { href: "/reservas", label: "Cotizaciones", icon: Calendar },
    { href: "/invitaciones", label: "Invitaciones", icon: Heart },
    { href: "/contacto", label: "Contacto", icon: Mail },
  ]

  return (
    <nav
      className={cn(
        "fixed z-50 transition-all duration-300",
        isScrolled
          ? "top-0 left-0 right-0 bg-white/95 backdrop-blur-md shadow-lg border-b border-gray-100"
          : "top-4 left-4 right-4 bg-black/20 backdrop-blur-sm rounded-2xl border border-white/10"
      )}
    >
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16 md:h-18">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-3">
            <div className="relative h-12 w-12 flex-shrink-0">
              <Image
                src="/Logo.rukalefun.jpg"
                alt="Logo Ruka Lefún"
                fill
                className="object-contain rounded-full"
                priority
              />
            </div>
            <div className={cn(
              "text-xl md:text-2xl font-bold transition-colors whitespace-nowrap",
              isScrolled ? "text-nature-forest" : "text-white"
            )}>
              Ruka Lefún
            </div>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  "text-sm font-medium transition-colors",
                  isScrolled 
                    ? "text-gray-700 hover:text-nature-forest" 
                    : "text-white hover:text-white/80"
                )}
              >
                {link.label}
              </Link>
            ))}
            <Link href="/reservas">
              <Button size="sm" className="bg-gradient-nature hover:opacity-90 text-white shadow-lg transition-all">
                Reservar
              </Button>
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden p-2 cursor-pointer rounded-lg hover:bg-white/10 transition-colors"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            aria-label={isMobileMenuOpen ? "Cerrar menú" : "Abrir menú"}
          >
            {isMobileMenuOpen ? (
              <X className={cn("h-6 w-6", isScrolled ? "text-gray-700" : "text-white")} />
            ) : (
              <Menu className={cn("h-6 w-6", isScrolled ? "text-gray-700" : "text-white")} />
            )}
          </button>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden py-4 bg-white rounded-lg shadow-lg mb-4">
            <div className="flex flex-col space-y-4 px-4">
              {navLinks.map((link) => {
                const Icon = link.icon
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    className="flex items-center space-x-2 text-gray-700 hover:text-nature-moss transition-colors"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    <Icon className="h-5 w-5" />
                    <span>{link.label}</span>
                  </Link>
                )
              })}
              <Link href="/reservas">
                <Button className="bg-gradient-nature hover:opacity-90 text-white w-full shadow-lg transition-all">
                  Reservar
                </Button>
              </Link>
            </div>
          </div>
        )}
      </div>
    </nav>
  )
}

