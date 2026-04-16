// Server Component — opts all admin pages out of static prerendering at build time.
// Required because AdminGuard uses authClient.useSession() which calls fetch('/api/auth/session')
// with a relative URL that fails when there is no host (build time).
export const dynamic = "force-dynamic"

import AdminLayoutClient from "./AdminLayoutClient"

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <AdminLayoutClient>{children}</AdminLayoutClient>
}
