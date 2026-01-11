import Link from "next/link"
import Image from "next/image"
import { Facebook, Instagram, Mail, MapPin, Phone, Clock, Heart } from "lucide-react"

export default function Footer() {
  return (
    <footer className="bg-nature-forest text-white">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8">
          {/* Información del Centro */}
          <div className="lg:col-span-2">
            <div className="flex items-center space-x-3 mb-4">
              <div className="relative h-12 w-12 flex-shrink-0">
                <Image
                  src="/Logo.rukalefun.jpg"
                  alt="Logo Ruka Lefún"
                  fill
                  className="object-contain rounded-full"
                />
              </div>
              <h3 className="text-xl font-bold">Ruka Lefún</h3>
            </div>
            <p className="text-gray-300 text-sm mb-4">
              Centro de eventos rodeado por la naturaleza del sur de Chile en Villarrica.
              El lugar perfecto para tu evento especial.
            </p>

            {/* Horario */}
            <div className="flex items-start space-x-2 text-sm text-gray-300 mb-4">
              <Clock className="h-5 w-5 mt-0.5 flex-shrink-0" />
              <div>
                <p className="font-semibold text-white">Horario de Atención</p>
                <p>Lunes a Domingo</p>
                <p>9:00 - 20:00 hrs</p>
              </div>
            </div>
          </div>

          {/* Enlaces Rápidos */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Navegación</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/" className="text-gray-300 hover:text-white transition-colors text-sm">
                  Inicio
                </Link>
              </li>
              <li>
                <Link href="/espacios" className="text-gray-300 hover:text-white transition-colors text-sm">
                  Espacios
                </Link>
              </li>
              <li>
                <Link href="/galeria" className="text-gray-300 hover:text-white transition-colors text-sm">
                  Galería
                </Link>
              </li>
              <li>
                <Link href="/reservas" className="text-gray-300 hover:text-white transition-colors text-sm">
                  Cotizaciones
                </Link>
              </li>
              <li>
                <Link href="/contacto" className="text-gray-300 hover:text-white transition-colors text-sm">
                  Contacto
                </Link>
              </li>
            </ul>
          </div>

          {/* Servicios */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Servicios</h3>
            <ul className="space-y-2 text-sm text-gray-300">
              <li>Bodas</li>
              <li>Eventos Corporativos</li>
              <li>Cumpleaños</li>
              <li>Aniversarios</li>
              <li>Graduaciones</li>
              <li>Baby Showers</li>
            </ul>
          </div>

          {/* Contacto y Redes */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Contacto</h3>
            <ul className="space-y-3 mb-6">
              <li className="flex items-start space-x-2">
                <MapPin className="h-5 w-5 mt-0.5 flex-shrink-0" />
                <span className="text-gray-300 text-sm">
                  Villarrica, Araucanía
                </span>
              </li>
              <li className="flex items-center space-x-2">
                <Phone className="h-5 w-5 flex-shrink-0" />
                <a href="tel:+56983614062" className="text-gray-300 hover:text-white text-sm transition-colors">
                  +56 9 8361 4062
                </a>
              </li>
              <li className="flex items-center space-x-2">
                <Mail className="h-5 w-5 flex-shrink-0" />
                <a href="mailto:contacto@rukalefun.cl" className="text-gray-300 hover:text-white text-sm transition-colors">
                  contacto@rukalefun.cl
                </a>
              </li>
            </ul>

            {/* Redes Sociales */}
            <div>
              <h4 className="text-sm font-semibold mb-3">Síguenos</h4>
              <div className="flex space-x-3">
                <a
                  href="https://facebook.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-white/10 hover:bg-white/20 p-2 rounded-full transition-colors"
                  aria-label="Facebook"
                >
                  <Facebook className="h-4 w-4" />
                </a>
                <a
                  href="https://instagram.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-white/10 hover:bg-white/20 p-2 rounded-full transition-colors"
                  aria-label="Instagram"
                >
                  <Instagram className="h-4 w-4" />
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-white/10 mt-10 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-gray-400 text-sm text-center md:text-left">
              &copy; {new Date().getFullYear()} Ruka Lefún. Todos los derechos reservados.
            </p>
            <div className="flex items-center gap-6 text-sm">
              <a
                href="https://share.google/DiCu8Xxuq2Z2BPSdt"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-300 hover:text-white transition-colors"
              >
                Ver en Mapa
              </a>
              <a
                href="https://wa.me/56983614062"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-300 hover:text-white transition-colors"
              >
                WhatsApp
              </a>
            </div>
            <p className="text-gray-400 text-sm flex items-center gap-1">
              Hecho con <Heart className="h-3 w-3 fill-red-500 text-red-500" /> para Ruka Lefún
            </p>
          </div>
        </div>
      </div>
    </footer>
  )
}

