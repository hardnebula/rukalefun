# 🔐 Sistema de Autenticación - Panel Administrativo

## ✅ Implementación Completa

El panel administrativo de Ruka Lefún ahora está **completamente protegido** con un sistema de autenticación. Solo usuarios autorizados pueden acceder.

---

## 🚀 Configuración Inicial

### Paso 1: Crear el Usuario Administrador

Ejecuta este comando para crear el primer usuario admin:

```bash
npx convex run seed:createInitialAdmin
```

**Credenciales por defecto:**
- **Usuario:** `admin`
- **Contraseña:** `rukalefun2024`
- **Nombre:** Administrador Ruka Lefún

### Paso 2: Personalizar Credenciales (Opcional)

Si quieres usar credenciales personalizadas:

```bash
npx convex run seed:createInitialAdmin '{
  "username": "tu_usuario",
  "password": "tu_contraseña_segura",
  "name": "Tu Nombre"
}'
```

---

## 🔑 Cómo Iniciar Sesión

### 1. Acceder a la página de login:
```
http://localhost:3000/admin/login
```

### 2. Ingresar credenciales:
- Usuario: `admin`
- Contraseña: `rukalefun2024`

### 3. ¡Listo!
Serás redirigido al dashboard administrativo.

---

## 🛡️ Seguridad Implementada

### Características de Seguridad:

✅ **Protección de Rutas**
- Todas las rutas `/admin/*` están protegidas
- Solo `/admin/login` es pública
- Redirección automática a login si no hay sesión

✅ **Sistema de Sesiones**
- Sesiones almacenadas en Convex
- Duración: 7 días
- Expiración automática
- Verificación en cada carga de página

✅ **Guard Components**
- `AdminGuard` verifica sesión antes de renderizar
- Pantalla de carga mientras verifica
- Redirección automática si sesión inválida

✅ **Logout Seguro**
- Botón "Cerrar Sesión" en sidebar
- Elimina sesión de base de datos
- Limpia localStorage
- Redirección inmediata a login

---

## 📱 Funcionalidades del Sistema

### En el Sidebar:

**Información del Usuario:**
- Nombre del administrador logueado
- Badge con emoji 👤

**Botón de Logout:**
- Color rojo para identificación clara
- Icono de logout
- Confirmación visual con toast

**Link al Sitio Público:**
- Acceso rápido a la web pública
- Mantiene la sesión administrativa

### En la Página de Login:

**Formulario Elegante:**
- Logo de Ruka Lefún
- Campos con iconos
- Validación de campos
- Estados de carga

**Feedback Visual:**
- Mensajes de éxito/error
- Toast notifications
- Estados de loading

---

## 🔒 Archivos Creados/Modificados

### Nuevos Archivos:

1. **`convex/auth.ts`**
   - Funciones de autenticación
   - Login, logout, verificación de sesión
   - Cambio de contraseña

2. **`app/admin/login/page.tsx`**
   - Página de inicio de sesión
   - Formulario responsive
   - Manejo de errores

3. **`lib/auth.ts`**
   - Utilidades cliente-side
   - Gestión de localStorage
   - Helpers de autenticación

4. **`components/admin/AdminGuard.tsx`**
   - Componente de protección de rutas
   - Verificación de sesión
   - Redirección automática

### Archivos Modificados:

1. **`convex/schema.ts`**
   - Tabla `admins` agregada
   - Tabla `sessions` agregada

2. **`app/admin/layout.tsx`**
   - Integración de AdminGuard
   - Excepción para ruta de login

3. **`components/layout/AdminSidebar.tsx`**
   - Botón de logout
   - Info del usuario
   - Manejo de sesión

4. **`convex/seed.ts`**
   - Función `createInitialAdmin`

---

## 🔐 Estructura de Base de Datos

### Tabla: `admins`
```typescript
{
  _id: Id<"admins">,
  username: string,
  password: string, // En producción: hash
  name: string,
  isActive: boolean,
  createdAt: number
}
```

### Tabla: `sessions`
```typescript
{
  _id: Id<"sessions">,
  adminId: Id<"admins">,
  createdAt: number,
  expiresAt: number
}
```

---

## 🔄 Flujo de Autenticación

```
1. Usuario accede a /admin
   ↓
2. AdminGuard verifica sesión en localStorage
   ↓
3. NO HAY SESIÓN → Redirige a /admin/login
   ↓
4. Usuario ingresa credenciales
   ↓
5. Convex verifica usuario/contraseña
   ↓
6. VÁLIDO → Crea sesión en DB
   ↓
7. Guarda sessionId en localStorage
   ↓
8. Redirige a /admin (dashboard)
   ↓
9. AdminGuard verifica sesión con Convex
   ↓
10. VÁLIDA → Muestra contenido
```

---

## 🛠️ API de Autenticación

### Funciones Convex Disponibles:

#### `auth.loginAdmin`
```typescript
// Login del administrador
loginAdmin({ username: string, password: string })
→ Returns: { sessionId, admin: { id, username, name } }
```

#### `auth.verifySession`
```typescript
// Verificar si sesión es válida
verifySession({ sessionId: string })
→ Returns: { id, username, name } | null
```

#### `auth.logout`
```typescript
// Cerrar sesión
logout({ sessionId: string })
→ Elimina sesión de DB
```

#### `auth.changePassword`
```typescript
// Cambiar contraseña
changePassword({
  sessionId: string,
  currentPassword: string,
  newPassword: string
})
→ Returns: { success: boolean }
```

#### `auth.checkAdminExists`
```typescript
// Verificar si existe admin
checkAdminExists()
→ Returns: boolean
```

---

## ⚠️ Notas de Seguridad

### ⚡ Para Desarrollo (Actual):
- Contraseñas en texto plano
- Solo para ambiente local
- **NO USAR EN PRODUCCIÓN**

### 🔒 Para Producción (Recomendado):

1. **Hashear Contraseñas:**
   ```bash
   npm install bcrypt
   ```
   Implementar hashing en `convex/auth.ts`

2. **Variables de Entorno:**
   - JWT secret
   - Session secrets
   - Configuración segura

3. **HTTPS Obligatorio:**
   - Certificado SSL
   - Cookies seguras

4. **Rate Limiting:**
   - Limitar intentos de login
   - Bloqueo temporal tras fallos

5. **Autenticación de 2 Factores:**
   - SMS o email
   - Aplicación authenticator

---

## 🎯 Próximas Mejoras

### Corto Plazo:
- [ ] Cambiar contraseña desde panel
- [ ] "Recordar sesión" checkbox
- [ ] Recuperación de contraseña

### Mediano Plazo:
- [ ] Múltiples usuarios admin
- [ ] Roles y permisos (admin, staff, viewer)
- [ ] Log de actividades
- [ ] Historial de sesiones

### Largo Plazo:
- [ ] OAuth (Google, Facebook)
- [ ] Autenticación biométrica
- [ ] SSO (Single Sign-On)
- [ ] API keys para integraciones

---

## 🧪 Testing

### Probar el Sistema:

1. **Test de Login:**
```
✓ Login con credenciales correctas
✓ Login con credenciales incorrectas
✓ Login sin usuario existente
```

2. **Test de Protección:**
```
✓ Acceso a /admin sin sesión → redirige a login
✓ Acceso a /admin con sesión válida → muestra dashboard
✓ Acceso a /admin con sesión expirada → redirige a login
```

3. **Test de Logout:**
```
✓ Cerrar sesión elimina sessionId
✓ Tras logout no se puede acceder a /admin
✓ Toast de confirmación aparece
```

---

## 🆘 Solución de Problemas

### Problema: "No puedo iniciar sesión"
**Solución:**
```bash
# 1. Verificar que existe admin
npx convex run auth:checkAdminExists

# 2. Recrear admin si es necesario
npx convex run seed:createInitialAdmin
```

### Problema: "Sesión expirada constantemente"
**Solución:**
- Verificar que Convex está corriendo
- Revisar consola del navegador
- Limpiar localStorage manualmente

### Problema: "Redirige en loop a login"
**Solución:**
```javascript
// En consola del navegador:
localStorage.clear()
// Luego recargar página
```

---

## 📞 Credenciales por Defecto

**⚠️ IMPORTANTE: Cambia estas credenciales después del primer login**

```
Usuario: admin
Contraseña: rukalefun2024
```

**Crear nuevo admin con credenciales personalizadas:**
```bash
npx convex run seed:createInitialAdmin '{
  "username": "nombre_dueno",
  "password": "contraseña_super_segura_123",
  "name": "Dueño Ruka Lefún"
}'
```

---

## ✅ Checklist de Seguridad

Antes de ir a producción:

- [ ] Cambiar contraseña por defecto
- [ ] Implementar hashing de contraseñas
- [ ] Configurar HTTPS
- [ ] Agregar rate limiting
- [ ] Implementar logs de seguridad
- [ ] Configurar backup de sesiones
- [ ] Documentar procedimientos de recuperación
- [ ] Realizar penetration testing

---

**Estado:** ✅ Sistema de autenticación funcional
**Ambiente:** 🧪 Desarrollo (listo para mejorar para producción)
**Última actualización:** Diciembre 2024





