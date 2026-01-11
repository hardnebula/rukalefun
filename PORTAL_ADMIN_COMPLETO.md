# 🎯 Portal Administrativo de Ruka Lefún - Guía Completa

## 📊 Dashboard Principal (`/admin`)

### Estadísticas en Tiempo Real

#### **4 Tarjetas de Métricas Principales:**

1. **Total Reservas**
   - Número total de reservas
   - Cantidad de confirmadas
   - Próximos eventos (30 días)
   - Ícono: 📅 Calendar

2. **Pendientes**
   - Reservas que requieren atención
   - Color: Amarillo (alerta)
   - Ícono: ⏰ Clock

3. **Ingresos Totales**
   - Revenue total generado
   - Pagos pendientes
   - Formato: Pesos chilenos (CLP)
   - Ícono: 💵 DollarSign

4. **Nuevas Cotizaciones**
   - Solicitudes sin responder
   - Color: Azul
   - Ícono: 👥 Users

### Accesos Rápidos (3 Tarjetas Grandes)

1. **Ver Calendario** (Azul)
   - Acceso directo al calendario completo
   - Vista de todos los eventos programados

2. **Gestionar Reservas** (Verde)
   - Administración de reservas y solicitudes
   - Filtros y búsqueda avanzada

3. **Cotizaciones** (Morado)
   - Responder solicitudes de cotización
   - Seguimiento de conversiones

### Próximos Eventos
- Lista de los 5 eventos confirmados más cercanos
- Información: Cliente, tipo de evento, fecha, horario, invitados
- Vista de tarjeta con calendario visual

### Reservas Recientes
- Últimas 5 solicitudes recibidas
- Estado visual con badges
- Acceso rápido a cada reserva

### Alertas Inteligentes
- **Alerta Amarilla:** Reservas pendientes de confirmación
- **Alerta Azul:** Nuevas cotizaciones sin responder
- Botones de acción rápida

---

## 📅 Calendario de Eventos (`/admin/calendario`)

### Funcionalidades:

#### **Vista de Calendario Completo**
- Integración con React Big Calendar
- Vistas disponibles: Mes, Semana, Día, Agenda
- Navegación por fechas
- Idioma: Español

#### **Código de Colores por Estado:**
- 🟡 **Amarillo:** Pendiente
- 🟢 **Verde:** Confirmado
- 🔵 **Azul:** Completado
- 🔴 **Rojo:** Cancelado

#### **Leyenda Visual**
- Explicación de colores en la parte superior
- Fácil identificación de estados

#### **Detalles de Evento (Click)**
Al hacer clic en un evento se muestra:
- Información del cliente (nombre, email, teléfono)
- Tipo de evento
- Fecha y horario
- Número de invitados
- Espacio reservado
- Servicios contratados
- Solicitudes especiales
- Información de pago (total, pagado, pendiente)

#### **Prevención de Conflictos**
- Visualización clara de espacios ocupados
- Detección automática de double-booking

---

## 📋 Gestión de Reservas (`/admin/reservas`)

### Funcionalidades Principales:

#### **Filtros y Búsqueda**
- Búsqueda por: Cliente, Email, Tipo de evento
- Filtro por estado: Todos, Pendiente, Confirmado, Completado, Cancelado
- Resultados en tiempo real

#### **Lista de Reservas**
Cada tarjeta muestra:
- Nombre del cliente con badge de estado
- Fecha completa (día, mes, año)
- Horario (inicio - fin)
- Tipo de evento y número de invitados
- Espacio reservado
- Contacto (email y teléfono)
- Información financiera (si existe)

#### **Acciones Rápidas**
- **Ver Detalles:** Abre modal con información completa
- **Confirmar:** Botón verde para reservas pendientes
- Cambio de estado con un clic

#### **Modal de Detalles Completo**

**Sección 1: Estado**
- Dropdown para cambiar estado
- Opciones: Pendiente, Confirmado, Completado, Cancelado

**Sección 2: Información del Cliente**
- Nombre completo
- Email (clickeable para enviar correo)
- Teléfono (clickeable para llamar)

**Sección 3: Detalles del Evento**
- Tipo de evento
- Número de invitados
- Fecha del evento
- Horario completo

**Sección 4: Servicios**
- Lista de servicios adicionales solicitados
- Badges visuales por cada servicio

**Sección 5: Solicitudes Especiales**
- Notas y requerimientos del cliente
- Área de texto con formato

**Sección 6: Información de Pago**
- Monto total (editable)
- Monto pagado (editable)
- Saldo pendiente (calculado automáticamente)
- Botón para actualizar pagos

---

## 💰 Gestión de Cotizaciones (`/admin/cotizaciones`)

### Funcionalidades:

#### **Filtros**
- Por estado: Nueva, Contactado, Cotizado, Convertida, Rechazada
- Búsqueda por nombre, email o tipo de evento

#### **Lista de Cotizaciones**
Cada tarjeta muestra:
- Nombre del cliente
- Badge de estado
- Badge "¡Nueva!" animado para solicitudes sin leer
- Tipo de evento y número de invitados
- Fecha tentativa (si existe)
- Email y teléfono
- Fecha y hora de recepción

#### **Modal de Detalles**

**Cambio de Estado:**
- Dropdown con 5 estados
- Seguimiento del ciclo de vida de la cotización

**Información de Contacto:**
- Links directos a email
- Links directos a teléfono
- Botón de WhatsApp

**Detalles del Evento:**
- Tipo de evento
- Número de invitados
- Fecha tentativa

**Mensaje del Cliente:**
- Texto completo de la solicitud
- Área destacada para fácil lectura

**Acciones Rápidas:**
- Botón "Enviar Email"
- Botón "WhatsApp"

---

## 🏛️ Gestión de Espacios (`/admin/espacios`)

### Funcionalidades:

#### **Vista de Grid**
- Tarjetas visuales de cada espacio
- Información resumida
- Estado activo/inactivo

#### **Información por Espacio:**
- Nombre del espacio
- Descripción
- Capacidad (personas)
- Área (m²)
- Precio por hora
- Lista de características
- Estado (activo/inactivo)

#### **Acciones:**
- **Crear Nuevo Espacio:** Botón superior derecho
- **Editar Espacio:** Botón en cada tarjeta

#### **Formulario de Creación/Edición:**

**Campos:**
- Nombre del espacio *
- Descripción *
- Capacidad (personas) *
- Área (m²) *
- Precio por hora ($) *
- Características (separadas por comas)
- Checkbox: Espacio activo

**Validación:**
- Campos obligatorios marcados con *
- Números positivos para capacidad y área
- Formato de características explicado

---

## 🖼️ Gestión de Galería (`/admin/galeria`)

### Funcionalidades:

#### **Filtros por Categoría**
- Todas
- Bodas
- Corporativos
- Cumpleaños
- Instalaciones

#### **Grid de Imágenes**
Cada imagen muestra:
- Vista previa
- Título
- Categoría (badge)
- Estado (Público/Oculto)

#### **Acciones por Imagen:**
- **Ocultar/Publicar:** Toggle de visibilidad
- **Eliminar:** Botón rojo con confirmación

#### **Agregar Nueva Imagen:**

**Formulario:**
- Título de la imagen *
- URL de la imagen *
- Categoría (dropdown) *
- Vista previa automática

**Nota:** Instrucción para subir a Imgur/Cloudinary

---

## 💬 Gestión de Testimonios (`/admin/testimonios`)

### Funcionalidades:

#### **Lista de Testimonios**
Cada tarjeta muestra:
- Nombre del cliente
- Tipo de evento
- Calificación (estrellas)
- Comentario completo
- Fecha del evento
- Estado (Público/Oculto)

#### **Acciones:**
- **Ocultar/Publicar:** Control de visibilidad
- **Crear Nuevo:** Botón superior

#### **Formulario de Creación:**

**Campos:**
- Nombre del cliente *
- Tipo de evento *
- Fecha del evento *
- Calificación (1-5 estrellas) *
- Comentario *

**Sistema de Estrellas:**
- Selector visual interactivo
- Click para seleccionar calificación

---

## 📦 Recursos e Inventario (`/admin/recursos`)

### Estado: Próximamente

**Funcionalidades Planificadas:**
- Gestión de mobiliario
- Control de equipamiento A/V
- Inventario de decoración
- Disponibilidad por fecha
- Asignación a eventos

---

## ⚙️ Configuración (`/admin/configuracion`)

### Estado: Próximamente

**Funcionalidades Planificadas:**
- Información de contacto
- Configuración de pagos
- Personalización del sitio
- Usuarios y permisos
- Notificaciones

---

## 📈 Analytics y Reportes (Backend Listo)

### Funciones Disponibles en Convex:

#### **`getDashboardStats`**
Estadísticas completas del dashboard:
- Total de reservas, pendientes, confirmadas
- Reservas del mes actual
- Próximos eventos (30 días)
- Cotizaciones nuevas y totales
- Revenue total y pendiente
- Tasa de conversión
- Espacios activos

#### **`getBookingsByMonth`**
Datos mensuales para gráficos:
- Reservas por mes
- Confirmadas, pendientes, canceladas
- Revenue por mes
- Filtro por año

#### **`getEventTypeStats`**
Análisis de tipos de eventos:
- Eventos más solicitados
- Comparación reservas vs cotizaciones
- Ranking por popularidad

#### **`getSpaceOccupancy`**
Ocupación por espacio:
- Total de reservas por espacio
- Reservas confirmadas
- Revenue generado por espacio

---

## 🔄 Flujo de Trabajo Recomendado

### 1. **Inicio del Día**
```
Dashboard → Revisar alertas → Reservas pendientes
```

### 2. **Gestión de Solicitudes**
```
Cotizaciones nuevas → Contactar cliente → Cambiar a "Contactado"
→ Enviar cotización → Cambiar a "Cotizado"
→ Cliente confirma → Crear reserva → Cambiar a "Convertida"
```

### 3. **Confirmación de Reservas**
```
Reservas pendientes → Verificar disponibilidad (Calendario)
→ Confirmar espacio → Actualizar estado a "Confirmado"
→ Registrar pago inicial → Actualizar información financiera
```

### 4. **Preparación de Eventos**
```
Calendario → Próximos eventos → Verificar detalles
→ Confirmar servicios → Preparar espacio
```

### 5. **Post-Evento**
```
Cambiar estado a "Completado" → Actualizar pago final
→ Solicitar testimonio (opcional)
```

---

## 🎨 Características de UX

### Diseño Consistente
- ✅ Colores de marca (verde naturaleza)
- ✅ Iconografía clara (Lucide icons)
- ✅ Tipografía legible
- ✅ Espaciado generoso

### Feedback Visual
- ✅ Badges de estado con colores
- ✅ Hover effects en tarjetas
- ✅ Transiciones suaves
- ✅ Notificaciones toast (Sonner)

### Responsive
- ✅ Adaptado a tablet y desktop
- ✅ Grid responsivo
- ✅ Sidebar colapsable

### Accesibilidad
- ✅ Alt texts en imágenes
- ✅ Labels en formularios
- ✅ Contraste adecuado
- ✅ Navegación por teclado

---

## 🚀 Próximas Mejoras Sugeridas

### Corto Plazo:
1. **Sistema de Tareas por Evento**
   - Checklist pre-evento
   - Asignación de responsables
   - Recordatorios automáticos

2. **Gestión de Recursos**
   - Inventario completo
   - Asignación a eventos
   - Control de disponibilidad

3. **Reportes Descargables**
   - PDF de reservas
   - Excel de ingresos
   - Estadísticas mensuales

### Mediano Plazo:
1. **Sistema de Notificaciones**
   - Email automático a clientes
   - Recordatorios de eventos
   - Alertas de pagos pendientes

2. **Integración de Pagos**
   - Webpay/Transbank
   - Pagos online
   - Recibos automáticos

3. **Multi-usuario**
   - Roles y permisos
   - Log de actividades
   - Asignación de tareas

### Largo Plazo:
1. **App Móvil**
   - Gestión desde smartphone
   - Notificaciones push
   - Acceso offline

2. **CRM Integrado**
   - Historial de clientes
   - Seguimiento de leads
   - Marketing automation

3. **BI y Analytics Avanzado**
   - Dashboards interactivos
   - Predicción de demanda
   - Análisis de rentabilidad

---

## 📱 Acceso al Portal

**URL:** `https://tu-dominio.com/admin`

**Nota de Seguridad:** 
Actualmente el portal es de acceso abierto. Se recomienda implementar autenticación antes de producción.

---

**Última actualización:** Diciembre 2024
**Versión:** 2.0 - Portal Administrativo Completo





