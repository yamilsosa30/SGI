import { useState } from "react"
import { authFetch } from "@/lib/api-client"
import { parseEsNumber } from "@/lib/utils"

/**
 * Hook para gestión de compras
 */
export function usePurchases() {
  const [purchases, setPurchases] = useState<any[]>([])

  const loadPurchases = async () => {
    try {
      const res = await authFetch("http://localhost:8080/api/purchases")
      if (!res.ok) throw new Error(`HTTP ${res.status}`)
      const data = await res.json()
      setPurchases(data)
    } catch (e) {
      console.error("Error cargando compras", e)
    }
  }

  const createPurchase = async (newPurchase: any) => {
    if (!newPurchase.supplierId || newPurchase.items.length === 0) {
      throw new Error("Completa proveedor e ítems")
    }
    
    const body = {
      supplierId: Number(newPurchase.supplierId),
      items: newPurchase.items.map((it: any) => ({ 
        productId: Number(it.productId), 
        quantity: Number(it.qty), 
        cost: parseEsNumber(it.cost) 
      })),
    }
    
    const res = await authFetch("http://localhost:8080/api/purchases", { 
      method: "POST", 
      headers: { "Content-Type": "application/json" }, 
      body: JSON.stringify(body) 
    })
    
    if (!res.ok) throw new Error(`HTTP ${res.status}`)
    await loadPurchases()
  }

  const completePurchase = async (id: number) => {
    const res = await authFetch(`http://localhost:8080/api/purchases/${id}/complete`, { method: "PUT" })
    if (!res.ok) throw new Error(`HTTP ${res.status}`)
    await loadPurchases()
  }

  const cancelPurchase = async (id: number) => {
    const res = await authFetch(`http://localhost:8080/api/purchases/${id}/cancel`, { method: "PUT" })
    if (!res.ok) throw new Error(`HTTP ${res.status}`)
    await loadPurchases()
  }

  return {
    purchases,
    loadPurchases,
    createPurchase,
    completePurchase,
    cancelPurchase,
  }
}
