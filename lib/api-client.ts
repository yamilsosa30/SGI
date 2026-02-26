/**
 * Cliente API centralizado con autenticación JWT
 * Gestiona automáticamente los tokens y redirecciones
 */

/**
 * Obtiene la URL base de la API según el entorno
 */
function getApiBase(): string {
  if (typeof window === "undefined") return "http://localhost:8080"
  const host = window.location.hostname
  return `http://${host}:8080`
}

/**
 * Realiza una petición HTTP con autenticación automática
 * - Agrega el token JWT si está disponible
 * - Maneja respuestas 401 (no autorizado) redirigiendo a login
 * - Normaliza URLs relativas y absolutas
 */
export async function authFetch(input: string, init: RequestInit = {}): Promise<Response> {
  const base = getApiBase()
  const tk = typeof window !== "undefined" ? localStorage.getItem("pos_token") : null
  const headers = { 
    ...(init.headers || {}), 
    ...(tk ? { Authorization: `Bearer ${tk}` } : {}) 
  }
  
  let url = input
  if (url.startsWith("/")) {
    url = base + url
  } else if (url.startsWith("http://localhost:8080")) {
    url = url.replace("http://localhost:8080", base)
  } else if (url.startsWith("http://127.0.0.1:8080")) {
    url = url.replace("http://127.0.0.1:8080", base)
  }
  
  const res = await fetch(url, { ...init, headers })
  
  // Manejar respuesta no autorizada
  if (res.status === 401) {
    if (typeof window !== "undefined") {
      localStorage.removeItem("pos_token")
      localStorage.removeItem("pos_role")
      localStorage.removeItem("pos_username")
      window.location.href = "/login"
    }
    throw new Error("Unauthorized")
  }
  
  return res
}
