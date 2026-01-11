# 🌱 Instrucciones para Poblar la Base de Datos de Ruka Lefún

## Configuración Inicial de Espacios

Los siguientes espacios han sido configurados en el script de seed:

### 1. 🌲 Ceremonia al Aire Libre
- **Capacidad:** 120 personas
- **Área:** 300 m²
- **Precio:** $150,000 por hora
- **Características:**
  - Árboles nativos del sur de Chile
  - Estero natural que cruza el espacio
  - Ambiente natural y tranquilo
  - Ideal para ceremonias
  - Sonido natural del agua
  - Sillas incluidas
  - Decoración rústica disponible

### 2. 🏊 Cocktail al Aire Libre
- **Capacidad:** 100 personas
- **Área:** 250 m²
- **Precio:** $180,000 por hora
- **Características:**
  - Vista a la piscina
  - Mesas y sillas lounge
  - Iluminación ambiente
  - Barra móvil disponible
  - Conexión eléctrica
  - Toldo de sombra
  - Área verde circundante
  - Acceso a baños

### 3. 🎉 Salón de Eventos Principal
- **Capacidad:** 150 personas
- **Área:** 400 m²
- **Precio:** $250,000 por hora
- **Características:**
  - Pista de baile profesional
  - Sistema de sonido incluido
  - Iluminación LED
  - Aire acondicionado
  - Mesas redondas y sillas
  - Escenario elevado
  - Proyector y pantalla
  - Cocina de servicio
  - Baños privados
  - Estacionamiento cercano

## 📝 Cómo Ejecutar el Seed

### Opción 1: Desde la línea de comandos (Recomendado)

1. **Asegúrate de que Convex esté corriendo:**
   ```bash
   npx convex dev
   ```

2. **En otra terminal, ejecuta el script de seed:**
   ```bash
   npx convex run seed:seedAll
   ```

   O puedes ejecutar componentes individuales:
   ```bash
   # Solo espacios
   npx convex run seed:seedSpaces
   
   # Solo testimonios
   npx convex run seed:seedTestimonials
   
   # Solo galería
   npx convex run seed:seedGallery
   ```

### Opción 2: Desde el Dashboard de Convex

1. Ve a https://dashboard.convex.dev
2. Selecciona tu proyecto
3. Ve a la sección "Functions"
4. Busca la función `seed:seedAll`
5. Haz clic en "Run" (sin argumentos)

### Opción 3: Crear una página de admin temporal

Puedes crear una página en `/admin/seed` para ejecutar el seed desde el navegador.

## ✅ Verificación

Después de ejecutar el seed, verifica que todo se haya creado correctamente:

### En el Dashboard de Convex:
1. Ve a la tabla `spaces` - Deberías ver 3 espacios
2. Ve a la tabla `testimonials` - Deberías ver 3 testimonios
3. Ve a la tabla `gallery` - Deberías ver 8 imágenes

### En la Aplicación:
1. **Homepage:** Deberías ver los 3 espacios en la sección "Nuestros Espacios"
2. **Página de Espacios:** Los 3 espacios con todos sus detalles
3. **Galería:** 8 imágenes organizadas por categoría
4. **Testimonios:** 3 reseñas de clientes en la homepage

## 🔄 Resetear Datos

Si necesitas limpiar y volver a poblar los datos:

```bash
# El script automáticamente limpia los datos existentes antes de crear nuevos
npx convex run seed:seedAll
```

## ⚠️ Notas Importantes

1. **El script limpia datos existentes** antes de crear nuevos, para evitar duplicados
2. **Las URLs de imágenes** son de Unsplash y son gratuitas
3. **Los precios** están en pesos chilenos (CLP)
4. **Puedes modificar** cualquier dato después desde el panel administrativo

## 🎨 Personalización

Para modificar los espacios, edita el archivo `/convex/seed.ts`:

```typescript
// Ejemplo: Cambiar el precio de un espacio
pricePerHour: 200000, // En pesos chilenos

// Ejemplo: Agregar más características
features: [
  "Nueva característica 1",
  "Nueva característica 2",
  // ...
]
```

Después de modificar, vuelve a ejecutar:
```bash
npx convex run seed:seedAll
```

## 📊 Datos Incluidos

### Espacios: 3
- Ceremonia al Aire Libre
- Cocktail al Aire Libre  
- Salón de Eventos Principal

### Testimonios: 3
- Boda de María y Juan (5 estrellas)
- Evento Corporativo Tech Solutions (5 estrellas)
- Cumpleaños Familia Rodríguez (5 estrellas)

### Galería: 8 imágenes
- 2 de bodas
- 2 de eventos corporativos
- 2 de espacios/instalaciones
- 2 de celebraciones/cumpleaños

---

**¡Listo!** Tu base de datos de Ruka Lefún está configurada y lista para usar. 🎉





