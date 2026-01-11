"use client"

import AdminSidebar from "@/components/layout/AdminSidebar"
import AdminGuard from "@/components/admin/AdminGuard"
import { usePathname } from "next/navigation"

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const pathname = usePathname()
  
  // No proteger la página de login
  if (pathname === "/admin/login") {
    return <>{children}</>
  }

  return (
    <AdminGuard>
      <div className="flex h-screen overflow-hidden">
        <AdminSidebar />
        <main className="flex-1 overflow-y-auto bg-gray-50">
          {children}
        </main>
      </div>
    </AdminGuard>
  )
}

