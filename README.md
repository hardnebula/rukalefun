# Ruka Lefún - Centro de Eventos

Sistema completo de gestión y reservas para Ruka Lefún, un centro de eventos ubicado en Villarrica, Chile, rodeado por la naturaleza del sur del país.

## 🌟 Características

### Área Pública (Cliente)

- **Homepage** con hero section impactante y navegación intuitiva
- **Sistema de Agendamiento** con calendario interactivo y disponibilidad en tiempo real
- **Galería Multimedia** con filtros por categoría y lightbox para visualización
- **Página de Espacios** con detalles de capacidad, características y precios
- **Sistema de Cotización** para solicitudes de eventos
- **Diseño Responsive** optimizado para todos los dispositivos

### Área Administrativa

- **Dashboard** con métricas clave y vista general de operaciones
- **Calendario de Eventos** con vista mensual/semanal de todas las reservas
- **Gestión de Reservas** con control de estados y pagos
- **Gestión de Cotizaciones** con seguimiento de conversiones
- **Administración de Espacios** con capacidades y precios
- **Gestión de Galería** para publicar/ocultar imágenes
- **Gestión de Testimonios** de clientes satisfechos

## 🛠️ Stack Tecnológico

- **Framework:** Next.js 14 con App Router
- **Lenguaje:** TypeScript
- **Base de Datos:** Convex (real-time backend)
- **Estilos:** Tailwind CSS
- **Componentes UI:** shadcn/ui
- **Animaciones:** Framer Motion
- **Calendario:** React Big Calendar
- **Lightbox:** Yet Another React Lightbox
- **Notificaciones:** Sonner

## 📦 Instalación

1. **Clonar el repositorio**
```bash
git clone <repository-url>
cd rukalefun
```

2. **Instalar dependencias**
```bash
npm install
```

3. **Configurar Convex**
```bash
npx convex dev
```
Este comando te guiará para crear un proyecto en Convex y generará automáticamente tu URL de Convex.

4. **Configurar variables de entorno**
Crea un archivo `.env.local` en la raíz del proyecto:
```env
NEXT_PUBLIC_CONVEX_URL=tu_url_de_convex_aquí
```

5. **Ejecutar el proyecto en desarrollo**
```bash
npm run dev
```

El sitio estará disponible en `http://localhost:3000`

## 🚀 Comandos Disponibles

```bash
npm run dev          # Inicia el servidor de desarrollo
npm run build        # Compila el proyecto para producción
npm run start        # Inicia el servidor de producción
npm run lint         # Ejecuta el linter
npx convex dev       # Inicia Convex en modo desarrollo
npx convex deploy    # Despliega las funciones de Convex
```

## 📁 Estructura del Proyecto

```
rukalefun/
├── app/
│   ├── (public)/          # Rutas públicas
│   │   ├── page.tsx       # Homepage
│   │   ├── espacios/      # Página de espacios
│   │   ├── galeria/       # Galería de fotos
│   │   ├── reservas/      # Sistema de reservas
│   │   └── contacto/      # Información de contacto
│   ├── admin/             # Área administrativa
│   │   ├── page.tsx       # Dashboard
│   │   ├── calendario/    # Calendario de eventos
│   │   ├── reservas/      # Gestión de reservas
│   │   ├── cotizaciones/  # Gestión de cotizaciones
│   │   ├── espacios/      # Gestión de espacios
│   │   ├── galeria/       # Gestión de galería
│   │   └── testimonios/   # Gestión de testimonios
│   ├── globals.css        # Estilos globales
│   └── layout.tsx         # Layout principal
├── components/
│   ├── layout/            # Componentes de layout
│   │   ├── Navbar.tsx
│   │   ├── Footer.tsx
│   │   └── AdminSidebar.tsx
│   ├── ui/                # Componentes UI reutilizables
│   └── providers/         # Providers de React
├── convex/
│   ├── schema.ts          # Esquema de base de datos
│   ├── bookings.ts        # Funciones de reservas
│   ├── quotes.ts          # Funciones de cotizaciones
│   ├── spaces.ts          # Funciones de espacios
│   ├── gallery.ts         # Funciones de galería
│   └── testimonials.ts    # Funciones de testimonios
├── lib/
│   └── utils.ts           # Utilidades
└── public/                # Archivos estáticos
```

## 🎨 Paleta de Colores

El proyecto usa una paleta inspirada en la naturaleza del sur de Chile:

- **Forest Green:** `#2D5016` - Color primario
- **Moss Green:** `#4A7C30` - Acento
- **Lake Blue:** `#0A5F8C` - Información
- **Sky Blue:** `#87CEEB` - Detalle
- **Wood Brown:** `#8B6F47` - Cálido
- **Stone Gray:** `#757575` - Neutral

## 📱 Características Principales

### Sistema de Reservas
- Calendario interactivo con disponibilidad en tiempo real
- Formulario completo con validación
- Selección de servicios adicionales
- Confirmación automática por email (próximamente)
- Sistema de depósitos y pagos

### Dashboard Administrativo
- Métricas en tiempo real
- Vista de próximos eventos
- Alertas de reservas pendientes
- Gestión completa de estados
- Seguimiento de pagos

### Galería Multimedia
- Organización por categorías
- Lightbox con navegación fluida
- Control de visibilidad público/privado
- Filtros dinámicos

## 🔒 Seguridad

- Validación de datos en cliente y servidor
- Protección contra inyección de código
- Sanitización de inputs
- Control de acceso al área administrativa (por implementar autenticación)

## 📝 Próximas Características

- [ ] Sistema de autenticación para administradores
- [ ] Integración de pagos online
- [ ] Notificaciones por email automáticas
- [ ] Sistema de facturación
- [ ] Reportes y analytics avanzados
- [ ] Integración con Google Calendar
- [ ] Sistema de mensajería interna
- [ ] Multi-idioma (Español/Inglés)

## 🤝 Contribución

Las contribuciones son bienvenidas. Por favor:
1. Fork el proyecto
2. Crea una rama para tu feature (`git checkout -b feature/AmazingFeature`)
3. Commit tus cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abre un Pull Request

## 📄 Licencia

Este proyecto es privado y confidencial. Todos los derechos reservados.

## 📞 Contacto

Ruka Lefún - Villarrica, Chile

- Email: contacto@rukalefun.cl
- WhatsApp: +56 9 XXXX XXXX
- Website: [En construcción]

---

Desarrollado con ❤️ para Ruka Lefún





