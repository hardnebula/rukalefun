// Cliente-side auth utilities

export function getAdminSession(): string | null {
  if (typeof window === "undefined") return null
  return localStorage.getItem("adminSession")
}

export function getAdminName(): string | null {
  if (typeof window === "undefined") return null
  return localStorage.getItem("adminName")
}

export function clearAdminSession() {
  if (typeof window === "undefined") return
  localStorage.removeItem("adminSession")
  localStorage.removeItem("adminName")
}

export function isAuthenticated(): boolean {
  return getAdminSession() !== null
}





