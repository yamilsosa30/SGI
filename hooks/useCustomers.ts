import { useState } from "react"
import { authFetch } from "@/lib/api-client"
import { parseEsNumber } from "@/lib/utils"

/**
 * Hook para manejar los clientes y sus cuentas corrientes.
 */
export function useCustomers() {
  const [customers, setCustomers] = useState<any[]>([])
  const [loadingCustomers, setLoadingCustomers] = useState(false)
  const [customersError, setCustomersError] = useState("")

  const loadCustomers = async () => {
    try {
      setLoadingCustomers(true)
      setCustomersError("")
      const res = await authFetch("http://localhost:8080/api/customers")
      if (!res.ok) throw new Error(`Error ${res.status}`)
      const data = await res.json()
      setCustomers(data)
    } catch (e) {
      console.error(e)
      setCustomersError("No pude cargar los clientes")
    } finally {
      setLoadingCustomers(false)
    }
  }

  const createCustomer = async (newCustomer: any) => {
    const payload: any = {
      name: newCustomer.name.trim(),
      phone: newCustomer.phone?.trim() || "",
      email: newCustomer.email?.trim() || "",
      address: newCustomer.address?.trim() || "",
    }
    
    if (newCustomer.creditLimit !== "") {
      const limitNum = parseEsNumber(newCustomer.creditLimit)
      if (!Number.isFinite(limitNum)) {
        throw new Error("El límite de crédito no es válido. Usá el formato 1.234,56")
      }
      payload.creditLimit = limitNum
    }

    const res = await authFetch("http://localhost:8080/api/customers", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    })
    
    if (!res.ok) {
      const msg = await res.text()
      throw new Error(msg || `Error ${res.status}`)
    }
    
    await loadCustomers()
  }

  const updateCustomer = async (editCustomer: any) => {
    const payload: any = {
      name: editCustomer.name.trim(),
      phone: (editCustomer.phone ?? "").trim(),
      email: (editCustomer.email ?? "").trim(),
      address: (editCustomer.address ?? "").trim(),
    }
    
    if (editCustomer.creditLimit !== "") {
      const limitNum = parseEsNumber(editCustomer.creditLimit)
      if (!Number.isFinite(limitNum)) {
        throw new Error("El límite de crédito no es válido. Usá el formato 1.234,56")
      }
      payload.creditLimit = limitNum
    }

    const res = await authFetch(`http://localhost:8080/api/customers/${editCustomer.id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    })
    
    if (!res.ok) {
      const msg = await res.text()
      throw new Error(msg || `Error ${res.status}`)
    }
    
    await loadCustomers()
  }

  const deleteCustomer = async (id: number) => {
    const res = await authFetch(`http://localhost:8080/api/customers/${id}`, { method: "DELETE" })
    if (res.status !== 204) {
      const msg = await res.text()
      if (!res.ok) throw new Error(msg || `Error ${res.status}`)
    }
    await loadCustomers()
  }

  return {
    customers,
    loadingCustomers,
    customersError,
    loadCustomers,
    createCustomer,
    updateCustomer,
    deleteCustomer,
  }
}
