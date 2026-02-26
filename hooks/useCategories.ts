import { useState } from "react"
import { authFetch } from "@/lib/api-client"

/**
 * Hook para manejar las categorías de productos.
 */
export function useCategories() {
  const [categories, setCategories] = useState<any[]>([])
  const [loadingCats, setLoadingCats] = useState(false)
  const [catsError, setCatsError] = useState("")

  const loadCategories = async () => {
    try {
      setLoadingCats(true)
      setCatsError("")
      const res = await authFetch("http://localhost:8080/api/categories")
      if (!res.ok) throw new Error(`Error ${res.status}`)
      const data = await res.json()
      setCategories(data)
    } catch (e) {
      console.error(e)
      setCatsError("No pude cargar las categorías")
    } finally {
      setLoadingCats(false)
    }
  }

  const createCategory = async (name: string, description: string) => {
    const res = await authFetch("http://localhost:8080/api/categories", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name: name.trim(), description: description.trim() }),
    })
    if (!res.ok) {
      const msg = await res.text()
      throw new Error(msg || `Error ${res.status}`)
    }
    await loadCategories()
  }

  const updateCategory = async (id: number, name: string, description: string) => {
    const res = await authFetch(`http://localhost:8080/api/categories/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name: name.trim(), description: description.trim() }),
    })
    if (!res.ok) {
      const msg = await res.text()
      throw new Error(msg || `Error ${res.status}`)
    }
    await loadCategories()
  }

  const deleteCategory = async (id: number) => {
    const res = await authFetch(`http://localhost:8080/api/categories/${id}`, { method: "DELETE" })
    if (res.status === 204) {
      await loadCategories()
      return
    }
    const text = await res.text()
    if (!res.ok) throw new Error(text || `Error ${res.status}`)
  }

  return {
    categories,
    loadingCats,
    catsError,
    loadCategories,
    createCategory,
    updateCategory,
    deleteCategory,
  }
}
