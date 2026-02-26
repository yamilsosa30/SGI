import { useState } from "react"
import { authFetch } from "@/lib/api-client"

/**
 * Hook para gestión de proveedores (CRUD completo)
 */
export function useSuppliers() {
  const [suppliers, setSuppliers] = useState<any[]>([])
  const [loadingSuppliers, setLoadingSuppliers] = useState(false)
  const [suppliersError, setSuppliersError] = useState("")

  const loadSuppliers = async () => {
    try {
      setLoadingSuppliers(true)
      setSuppliersError("")
      const res = await authFetch("http://localhost:8080/api/suppliers")
      if (!res.ok) throw new Error(`HTTP ${res.status}`)
      const data = await res.json()
      setSuppliers(data)
    } catch (e) {
      console.error(e)
      setSuppliersError("Error al cargar proveedores")
    } finally {
      setLoadingSuppliers(false)
    }
  }

  const createSupplier = async (newSupplier: any) => {
    const payload = {
      name: newSupplier.name.trim(),
      phone: newSupplier.phone?.trim() || "",
      email: newSupplier.email?.trim() || "",
      address: newSupplier.address?.trim() || "",
    }
    
    const res = await authFetch("http://localhost:8080/api/suppliers", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    })
    
    if (!res.ok) {
      const msg = await res.text()
      throw new Error(msg || `HTTP ${res.status}`)
    }
    
    await loadSuppliers()
  }

  const updateSupplier = async (editSupplier: any) => {
    const payload = {
      name: editSupplier.name.trim(),
      phone: (editSupplier.phone ?? "").trim(),
      email: (editSupplier.email ?? "").trim(),
      address: (editSupplier.address ?? "").trim(),
    }
    
    const res = await authFetch(`http://localhost:8080/api/suppliers/${editSupplier.id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    })
    
    if (!res.ok) {
      const msg = await res.text()
      throw new Error(msg || `HTTP ${res.status}`)
    }
    
    await loadSuppliers()
  }

  const deleteSupplier = async (id: number) => {
    const res = await authFetch(`http://localhost:8080/api/suppliers/${id}`, { method: "DELETE" })
    if (res.status !== 204) {
      const msg = await res.text()
      if (!res.ok) throw new Error(msg || `HTTP ${res.status}`)
    }
    await loadSuppliers()
  }

  return {
    suppliers,
    loadingSuppliers,
    suppliersError,
    loadSuppliers,
    createSupplier,
    updateSupplier,
    deleteSupplier,
  }
}
