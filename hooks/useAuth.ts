import { useState, useEffect } from "react"

export type UserRole = "ADMIN" | "CASHIER" | ""

/**
 * Hook para gestión de autenticación y sesión
 */
export function useAuth() {
  const [authRole, setAuthRole] = useState<UserRole>("")
  const [authUsername, setAuthUsername] = useState<string>("")

  useEffect(() => {
    // Cargar sesión desde localStorage
    const tk = typeof window !== "undefined" ? localStorage.getItem("pos_token") : null
    const role = typeof window !== "undefined" ? (localStorage.getItem("pos_role") as any) : null
    const username = typeof window !== "undefined" ? localStorage.getItem("pos_username") : null
    
    if (!tk || !role) {
      if (typeof window !== "undefined") window.location.href = "/login"
      return
    }
    
    setAuthRole(role === "ADMIN" || role === "CASHIER" ? role : "")
    setAuthUsername(username || "")
  }, [])

  const handleLogout = () => {
    try {
      localStorage.removeItem("pos_token")
      localStorage.removeItem("pos_role")
      localStorage.removeItem("pos_username")
    } catch {}
    if (typeof window !== "undefined") window.location.href = "/login"
  }

  return {
    authRole,
    authUsername,
    handleLogout,
  }
}
