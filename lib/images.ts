// Banco de imágenes genéricas de Unsplash para el centro de eventos

export const eventImages = {
  // Imágenes de naturaleza y paisajes del sur de Chile
  nature: [
    "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?q=80&w=1600", // Montañas
    "https://images.unsplash.com/photo-1441974231531-c6227db76b6e?q=80&w=1600", // Bosque
    "https://images.unsplash.com/photo-1464366400600-7168b8af9bc3?q=80&w=1600", // Naturaleza
    "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?q=80&w=1600", // Lago y montañas
  ],

  // Imágenes de bodas
  weddings: [
    "https://images.unsplash.com/photo-1519167758481-83f29da8dbc6?q=80&w=1200", // Boda al aire libre
    "https://images.unsplash.com/photo-1511285560929-80b456fea0bc?q=80&w=1200", // Decoración de boda
    "https://images.unsplash.com/photo-1519225421980-715cb0215aed?q=80&w=1200", // Mesa de boda
    "https://images.unsplash.com/photo-1464366400600-7168b8af9bc3?q=80&w=1200", // Ceremonia exterior
  ],

  // Imágenes de eventos corporativos
  corporate: [
    "https://images.unsplash.com/photo-1511795409834-ef04bbd61622?q=80&w=1200", // Evento corporativo
    "https://images.unsplash.com/photo-1505236858219-8359eb29e329?q=80&w=1200", // Salón de eventos
    "https://images.unsplash.com/photo-1478146896981-b80fe463b330?q=80&w=1200", // Conferencia
  ],

  // Imágenes de celebraciones
  celebrations: [
    "https://images.unsplash.com/photo-1464366400600-7168b8af9bc3?q=80&w=1200", // Celebración
    "https://images.unsplash.com/photo-1515934751635-c81c6bc9a2d8?q=80&w=1200", // Fiesta
    "https://images.unsplash.com/photo-1465495976277-4387d4b0b4c6?q=80&w=1200", // Cumpleaños
  ],

  // Imágenes de espacios/venues
  venues: [
    "https://images.unsplash.com/photo-1519167758481-83f29da8dbc6?q=80&w=1200",
    "https://images.unsplash.com/photo-1464366400600-7168b8af9bc3?q=80&w=1200",
    "https://images.unsplash.com/photo-1478146896981-b80fe463b330?q=80&w=1200",
    "https://images.unsplash.com/photo-1505236858219-8359eb29e329?q=80&w=1200",
  ],

  // Hero images
  hero: [
    "https://images.unsplash.com/photo-1464366400600-7168b8af9bc3?q=80&w=2400",
    "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?q=80&w=2400",
    "https://images.unsplash.com/photo-1519167758481-83f29da8dbc6?q=80&w=2400",
  ],
}

export const getRandomImage = (category: keyof typeof eventImages) => {
  const images = eventImages[category]
  return images[Math.floor(Math.random() * images.length)]
}

export const getImageByIndex = (category: keyof typeof eventImages, index: number) => {
  const images = eventImages[category]
  return images[index % images.length]
}





