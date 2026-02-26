import { useState, useEffect } from "react"

/**
 * Hook para gestión de tema claro/oscuro
 */
export function useTheme() {
  const [isDarkTheme, setIsDarkTheme] = useState<boolean>(false)

  useEffect(() => {
    // Cargar preferencia de tema (default/dark)
    try {
      const th = localStorage.getItem("theme")
      const isDark = th === "dark"
      setIsDarkTheme(isDark)
      if (typeof document !== "undefined") {
        document.body.classList.remove("theme-triangulo")
        document.documentElement.classList.toggle("dark", isDark)
      }
    } catch {}
  }, [])

  const toggleTheme = () => {
    const next = !isDarkTheme
    setIsDarkTheme(next)
    try {
      localStorage.setItem("theme", next ? "dark" : "default")
    } catch {}
    if (typeof document !== "undefined") {
      document.documentElement.classList.toggle("dark", next)
    }
  }

  return {
    isDarkTheme,
    toggleTheme,
  }
}
