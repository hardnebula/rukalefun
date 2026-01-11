import Script from 'next/script'

interface OrganizationSchemaProps {
  name?: string
  url?: string
  logo?: string
  description?: string
  address?: {
    streetAddress?: string
    addressLocality: string
    addressRegion: string
    addressCountry: string
  }
  telephone?: string
  email?: string
  sameAs?: string[]
}

export function OrganizationSchema({
  name = "Ruka Lefún",
  url = "https://www.rukalefun.cl",
  logo = "https://www.rukalefun.cl/Logo.rukalefun.jpg",
  description = "Centro de eventos rodeado por la naturaleza del sur de Chile en Villarrica",
  address = {
    addressLocality: "Villarrica",
    addressRegion: "Región de La Araucanía",
    addressCountry: "CL"
  },
  telephone = "+56983614062",
  email = "contacto@rukalefun.cl",
  sameAs = []
}: OrganizationSchemaProps) {
  const schema = {
    "@context": "https://schema.org",
    "@type": "EventVenue",
    "@id": url,
    "name": name,
    "url": url,
    "logo": {
      "@type": "ImageObject",
      "url": logo
    },
    "description": description,
    "address": {
      "@type": "PostalAddress",
      ...address
    },
    "telephone": telephone,
    "email": email,
    "sameAs": sameAs,
    "priceRange": "$$",
    "amenityFeature": [
      {
        "@type": "LocationFeatureSpecification",
        "name": "Estacionamiento",
        "value": true
      },
      {
        "@type": "LocationFeatureSpecification",
        "name": "WiFi",
        "value": true
      },
      {
        "@type": "LocationFeatureSpecification",
        "name": "Accesibilidad",
        "value": true
      }
    ],
    "publicAccess": true,
    "smokingAllowed": false
  }

  return (
    <Script
      id="organization-schema"
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  )
}

interface LocalBusinessSchemaProps {
  name?: string
  description?: string
  address?: {
    streetAddress?: string
    addressLocality: string
    addressRegion: string
    postalCode?: string
    addressCountry: string
  }
  telephone?: string
  url?: string
  image?: string
  priceRange?: string
  openingHours?: string[]
}

export function LocalBusinessSchema({
  name = "Ruka Lefún",
  description = "Centro de eventos para bodas, eventos corporativos y celebraciones en Villarrica",
  address = {
    addressLocality: "Villarrica",
    addressRegion: "Región de La Araucanía",
    addressCountry: "CL"
  },
  telephone = "+56983614062",
  url = "https://www.rukalefun.cl",
  image = "https://www.rukalefun.cl/Logo.rukalefun.jpg",
  priceRange = "$$",
  openingHours = [
    "Mo-Su 09:00-20:00"
  ]
}: LocalBusinessSchemaProps) {
  const schema = {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    "name": name,
    "description": description,
    "address": {
      "@type": "PostalAddress",
      ...address
    },
    "telephone": telephone,
    "url": url,
    "image": image,
    "priceRange": priceRange,
    "openingHoursSpecification": openingHours.map(hours => {
      const [days, time] = hours.split(' ')
      const [open, close] = time.split('-')
      return {
        "@type": "OpeningHoursSpecification",
        "dayOfWeek": days.includes('-')
          ? days.split('-').map(d => {
              const dayMap: {[key: string]: string} = {
                'Mo': 'Monday', 'Tu': 'Tuesday', 'We': 'Wednesday',
                'Th': 'Thursday', 'Fr': 'Friday', 'Sa': 'Saturday', 'Su': 'Sunday'
              }
              return dayMap[d]
            })
          : [days],
        "opens": open,
        "closes": close
      }
    }),
    "geo": {
      "@type": "GeoCoordinates",
      "latitude": "-39.3225416452404",
      "longitude": "-72.12688614902275"
    }
  }

  return (
    <Script
      id="local-business-schema"
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  )
}

interface BreadcrumbSchemaProps {
  items: Array<{
    name: string
    url: string
  }>
}

export function BreadcrumbSchema({ items }: BreadcrumbSchemaProps) {
  const schema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": items.map((item, index) => ({
      "@type": "ListItem",
      "position": index + 1,
      "name": item.name,
      "item": item.url
    }))
  }

  return (
    <Script
      id="breadcrumb-schema"
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  )
}

interface WebsiteSchemaProps {
  name?: string
  url?: string
  description?: string
  searchUrl?: string
}

export function WebsiteSchema({
  name = "Ruka Lefún",
  url = "https://www.rukalefun.cl",
  description = "Centro de eventos en Villarrica, Chile",
  searchUrl = "https://www.rukalefun.cl/search?q={search_term_string}"
}: WebsiteSchemaProps) {
  const schema = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "name": name,
    "url": url,
    "description": description,
    "potentialAction": {
      "@type": "SearchAction",
      "target": searchUrl,
      "query-input": "required name=search_term_string"
    }
  }

  return (
    <Script
      id="website-schema"
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  )
}
