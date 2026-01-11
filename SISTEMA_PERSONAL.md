# Sistema de Gestión de Personal - Ruka Lefún

## Resumen de Cambios

El apartado de **Recursos** del portal de administración ha sido transformado en un sistema completo de **Gestión de Personal** para manejar la nómina de garzones y personal que trabajan en los eventos.

## Características Principales

### 1. **Gestión de Personal** (Tab Personal)
- Registro completo de garzones, cocina, diseño, DJ, animación, fotografía, etc.
- Información de contacto (teléfono, email)
- Tarifas por evento y por hora
- Estado activo/inactivo
- Notas adicionales sobre cada persona
- Editar y eliminar personal

### 2. **Asignaciones por Evento** (Tab Asignaciones)
- Asignar personal a eventos específicos
- Definir rol para cada asignación
- Horarios programados (inicio y fin)
- Monto a pagar por asignación
- Confirmar o cancelar asistencia
- Ver todas las asignaciones agrupadas por evento
- Eliminar asignaciones

### 3. **Gestión de Pagos** (Tab Pagos)
- Resumen visual de pagos:
  - Pagos pendientes (total y cantidad)
  - Pagos realizados (total y cantidad)
  - Total general
- Lista de pagos pendientes con detalles del evento
- Marcar pagos como realizados
- Solo se pueden marcar como pagados si la asistencia está confirmada

## Cómo Usar el Sistema

### Agregar Personal

1. Ve a la sección **Recursos** en el portal de administración
2. En el tab **Personal**, haz clic en "Agregar Personal"
3. Completa el formulario:
   - Nombre completo (requerido)
   - Rol (requerido) - Selecciona entre: **Garzón**, **Cocina**, **Diseño**, **DJ**, **Animación**, **Fotografía**
   - Teléfono (requerido)
   - Email (opcional)
   - Tarifa por evento (requerido)
   - Tarifa por hora (opcional)
   - Notas (opcional)
   - Estado activo (por defecto marcado)
4. Haz clic en "Agregar"

### Asignar Personal a un Evento

1. Ve al tab **Asignaciones**
2. Haz clic en "Asignar Personal a Evento"
3. Completa el formulario:
   - Selecciona el evento
   - Selecciona la persona del personal
   - Define el rol específico para este evento
   - Define horarios (hora inicio y hora fin)
   - Define el monto a pagar
   - Agrega notas si es necesario
4. Haz clic en "Asignar"

### Confirmar Asistencia

1. En el tab **Asignaciones**, busca la asignación correspondiente
2. Haz clic en el botón "Confirmar" junto a la asignación
3. Una vez confirmada, el estado cambiará a "Confirmado"
4. Puedes cancelar la confirmación haciendo clic en "Cancelar"

### Registrar Pagos

1. Ve al tab **Pagos**
2. Verás un resumen de todos los pagos (pendientes, realizados, total)
3. En la lista de pagos pendientes, cada item muestra:
   - Nombre del personal
   - Evento asociado
   - Fecha y horarios
   - Monto a pagar
   - Estado de confirmación de asistencia
4. Solo puedes marcar como pagado si la asistencia está confirmada
5. Haz clic en "Marcar Pagado" para registrar el pago
6. El sistema registrará automáticamente la fecha actual

## Poblar Datos de Ejemplo

Para probar el sistema con datos de ejemplo:

1. Abre la consola de Convex (https://dashboard.convex.dev)
2. Selecciona tu proyecto
3. Ve a la sección "Functions"
4. Ejecuta la función: `seed:seedStaff`
5. Esto agregará 12 personas de ejemplo al sistema (2 por cada rol: Garzón, Cocina, Diseño, DJ, Animación, Fotografía)

## Estructura de la Base de Datos

### Tabla `staff` (Personal)
- `name`: Nombre completo
- `role`: Rol general (Garzón, Cocina, Diseño, DJ, Animación, Fotografía)
- `phone`: Teléfono de contacto
- `email`: Email (opcional)
- `ratePerEvent`: Tarifa estándar por evento
- `ratePerHour`: Tarifa por hora (opcional)
- `notes`: Notas adicionales
- `isActive`: Estado activo/inactivo
- `createdAt`: Fecha de creación

### Tabla `staffAssignments` (Asignaciones)
- `bookingId`: ID del evento/reserva
- `staffId`: ID del personal asignado
- `role`: Rol específico para este evento
- `scheduledStartTime`: Hora de inicio programada
- `scheduledEndTime`: Hora de fin programada
- `confirmedAttendance`: Si confirmó asistencia (boolean)
- `actualStartTime`: Hora real de inicio (opcional)
- `actualEndTime`: Hora real de fin (opcional)
- `hoursWorked`: Horas trabajadas (opcional)
- `amountToPay`: Monto a pagar por esta asignación
- `paymentStatus`: Estado del pago (pending, paid, cancelled)
- `paymentDate`: Fecha del pago (cuando se marcó como pagado)
- `paymentMethod`: Método de pago (efectivo, transferencia, etc.)
- `notes`: Notas adicionales
- `createdAt`: Fecha de creación
- `updatedAt`: Última actualización

## Flujo de Trabajo Recomendado

1. **Antes del evento**:
   - Registra todo tu personal en el sistema
   - Crea el evento/reserva en la sección de Reservas
   - Asigna el personal necesario al evento
   - Define horarios y montos a pagar

2. **Día del evento**:
   - Confirma la asistencia de cada persona cuando llegue
   - Puedes actualizar horarios reales si es necesario

3. **Después del evento**:
   - Ve a la sección de Pagos
   - Revisa los pagos pendientes
   - Marca como pagado cuando realices cada pago
   - El sistema registra automáticamente la fecha

## Notas Importantes

- Solo puedes marcar un pago como realizado si la asistencia está confirmada
- Las asignaciones están vinculadas a eventos específicos
- Puedes tener la misma persona asignada a múltiples eventos
- El estado "activo" del personal te permite mantener un historial sin eliminar registros
- Los montos a pagar se definen por asignación (no necesariamente la tarifa estándar)

## Archivos Modificados/Creados

1. **Nuevo archivo backend**: `/convex/staff.ts`
   - Contiene todas las queries y mutations para personal y asignaciones

2. **Actualizado**: `/app/admin/recursos/page.tsx`
   - Interfaz completa con 3 tabs (Personal, Asignaciones, Pagos)
   - Formularios para agregar/editar personal
   - Sistema de confirmación de asistencia
   - Gestión de pagos

3. **Actualizado**: `/convex/seed.ts`
   - Nueva función `seedStaff()` para datos de ejemplo

4. **Actualizado**: `/components/providers/ConvexProvider.tsx`
   - Agregado componente Toaster para notificaciones

## Soporte

Si tienes dudas o necesitas modificaciones adicionales al sistema, no dudes en preguntar.

