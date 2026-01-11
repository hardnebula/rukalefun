# Sistema de Gestión de Reservas y Eventos - Ruka Lefún

## Resumen de Cambios

Se ha implementado un **sistema completo de gestión de reservas** que permite crear, gestionar y visualizar eventos desde el portal de administración, con integración total al calendario.

## 🎯 Características Principales

### 1. **Crear Nuevas Reservas**
Desde el portal de administración puedes crear reservas/eventos completamente funcionales:

#### Información que se solicita:
- **Espacio:** Selección del espacio disponible (Ceremonia, Cocktail, Salón)
- **Fecha y horarios:** Fecha completa, hora de inicio y hora de término
- **Tipo de evento:** Boda, cumpleaños, corporativo, etc.
- **Invitados:** Número confirmado y estimado
- **Cliente:** Nombre, email, teléfono
- **Servicios:** Catering, decoración, audio/video, fotografía, DJ, animación, etc.
- **Solicitudes especiales:** Campo de texto libre

#### Verificación de Disponibilidad:
- ✅ Antes de crear, **verifica automáticamente** si el espacio está disponible
- ❌ No permite crear reservas en horarios ocupados
- ✨ Muestra badge visual de disponibilidad

### 2. **Gestión de Reservas Existentes**

#### Estados de Reserva:
- **Pendiente** 🟡: Recién creada, esperando confirmación
- **Confirmado** 🟢: Reserva confirmada y activa
- **Completado** 🔵: Evento ya realizado
- **Cancelado** 🔴: Reserva cancelada

#### Acciones Disponibles:
- Ver detalles completos
- Cambiar estado
- Actualizar información de pago
- Confirmar con un clic

### 3. **Búsqueda y Filtros**
- Buscar por nombre de cliente, email o tipo de evento
- Filtrar por estado (todos, pendiente, confirmado, completado, cancelado)
- Resultados en tiempo real

### 4. **Gestión de Pagos**
Para cada reserva puedes:
- Definir monto total del evento
- Registrar pagos parciales/anticipo
- Ver saldo pendiente calculado automáticamente
- Actualizar información de pago en cualquier momento

### 5. **Integración con Calendario**
- **Automática:** Todas las reservas creadas aparecen instantáneamente en el calendario
- **Colores por estado:**
  - Pendiente: 🟡 Naranja
  - Confirmado: 🟢 Verde
  - Completado: 🔵 Azul
  - Cancelado: 🔴 Rojo (no se muestra)
- **Vista completa:** Mes, semana, día y agenda
- **Detalles al hacer clic:** Ver información completa del evento desde el calendario

### 6. **Integración con Personal**
Las reservas creadas están disponibles para:
- Asignar personal en la sección "Recursos"
- Ver qué eventos tienen personal asignado
- Gestionar pagos al personal por evento

## 🚀 Flujo de Trabajo Completo

### Crear un Nuevo Evento

1. **Ve a Reservas** (`/admin/reservas`)
2. **Haz clic en "Crear Nueva Reserva"** (botón azul arriba a la derecha)
3. **Completa la información:**
   - Selecciona el espacio
   - Define fecha y horarios
   - Tipo de evento y número de invitados
   - Datos del cliente
   - Servicios requeridos
4. **Verifica disponibilidad:**
   - Haz clic en "Verificar Disponibilidad"
   - Espera confirmación ✓ o error ✗
5. **Crea la reserva:**
   - Si está disponible, haz clic en "Crear Reserva"
   - Recibirás confirmación de éxito

### Gestionar Reserva Existente

1. **Ve a Reservas** (`/admin/reservas`)
2. **Busca o filtra** la reserva que necesitas
3. **Haz clic en "Ver Detalles"**
4. **Gestiona:**
   - Cambiar estado (pendiente → confirmado)
   - Actualizar información de pago
   - Ver todos los detalles del cliente y evento

### Ver en Calendario

1. **Ve a Calendario** (`/admin/calendario`)
2. **Visualiza todos los eventos:**
   - Vista mensual, semanal o diaria
   - Eventos con colores según su estado
3. **Haz clic en un evento** para ver detalles completos

### Asignar Personal

1. **Ve a Recursos** (`/admin/recursos`)
2. **Tab "Asignaciones"**
3. **Haz clic en "Asignar Personal a Evento"**
4. **Selecciona:**
   - El evento (creado en Reservas)
   - El personal
   - Rol y horarios
   - Monto a pagar

## 📊 Conexiones del Sistema

```
┌──────────────┐
│   RESERVAS   │  ← Crear y gestionar eventos
└──────┬───────┘
       │
       ├──────────▶ ┌─────────────┐
       │            │  CALENDARIO  │  ← Visualización automática
       │            └─────────────┘
       │
       ├──────────▶ ┌─────────────┐
       │            │   RECURSOS   │  ← Asignar personal
       │            └─────────────┘
       │
       └──────────▶ ┌─────────────┐
                    │    PAGOS     │  ← Gestión financiera
                    └─────────────┘
```

## 🎨 Interfaz Mejorada

### Página de Reservas
- **Botón destacado:** "Crear Nueva Reserva" (azul, visible)
- **Tarjetas de reserva:** Información completa en formato visual
- **Badges de estado:** Colores distintivos
- **Acciones rápidas:** Confirmar con un clic

### Formulario de Creación
- **Organizado en secciones:**
  1. Información del Evento
  2. Información del Cliente
  3. Servicios
  4. Solicitudes Especiales
- **Validación en tiempo real**
- **Verificación de disponibilidad obligatoria**
- **Indicadores visuales claros**

## ⚙️ Funcionalidades Técnicas

### Validación de Disponibilidad
- Verifica conflictos de horario antes de crear
- Compara con reservas existentes del mismo espacio y fecha
- Evita doble reserva del mismo espacio

### Estados Inteligentes
- El sistema no muestra eventos cancelados en el calendario
- Los estados se actualizan en tiempo real
- Sincronización automática entre vistas

### Cálculos Automáticos
- **Saldo pendiente** = Total - Pagado
- **Capacidad del espacio** se muestra al seleccionar
- **Duración del evento** calculada automáticamente

## 📝 Ejemplo Práctico

### Caso: Boda de Ana y Carlos

1. **Crear reserva:**
   - Espacio: Salón de Eventos Principal
   - Fecha: 20 de Enero 2025
   - Horario: 18:00 - 02:00
   - Invitados: 120 personas
   - Cliente: Ana García, ana@email.com, +56912345678
   - Servicios: Catering, Decoración, DJ, Fotografía
   - Monto total: $2,500,000

2. **Verificar disponibilidad:**
   - ✅ Espacio disponible
   - Crear reserva con éxito

3. **Aparece automáticamente en:**
   - Lista de Reservas (estado: Pendiente 🟡)
   - Calendario (20 de Enero, color naranja)

4. **Confirmar reserva:**
   - Cambiar estado a "Confirmado"
   - Actualizar pago: Anticipo $500,000
   - Saldo pendiente: $2,000,000

5. **Asignar personal:**
   - 2 Garzones
   - 2 Personal de Cocina
   - 1 DJ
   - 1 Fotógrafo
   - 1 Diseño/Decoración

6. **El día del evento:**
   - Confirmar asistencia del personal
   - Registrar pagos al personal

7. **Después del evento:**
   - Cambiar estado a "Completado"
   - Registrar pago final del cliente
   - Cerrar evento

## 🔧 Archivos Modificados

### Frontend
- **`/app/admin/reservas/page.tsx`** - Página completa de gestión con formulario de creación
- **`/app/admin/calendario/page.tsx`** - Ya integrado (sin cambios necesarios)

### Backend
- **`/convex/bookings.ts`** - Ya tiene todas las funciones necesarias:
  - `createBooking` - Crear nueva reserva
  - `getAllBookings` - Obtener todas las reservas
  - `updateBookingStatus` - Cambiar estado
  - `updateBookingPayment` - Actualizar pagos
  - `checkAvailability` - Verificar disponibilidad

## ✨ Beneficios del Sistema

1. **Todo en un lugar:** No necesitas herramientas externas
2. **Sincronización automática:** Reservas → Calendario → Personal
3. **Prevención de errores:** No permite doble reserva
4. **Flujo completo:** Desde creación hasta pago final
5. **Visual e intuitivo:** Colores, badges, iconos
6. **Búsqueda rápida:** Encuentra cualquier reserva en segundos
7. **Gestión financiera:** Control de pagos por reserva y personal

## 🎯 Próximos Pasos Recomendados

1. Crear algunas reservas de prueba
2. Ver cómo aparecen en el calendario
3. Asignar personal a esos eventos
4. Probar el flujo completo de gestión
5. Registrar pagos y marcar como completado

El sistema está completamente operativo y listo para usar en producción. 🚀

