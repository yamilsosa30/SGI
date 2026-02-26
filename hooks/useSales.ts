import { useState } from "react"
import { authFetch } from "@/lib/api-client"

/**
 * Hook para gestión de ventas e historial
 */
export function useSales() {
  const [salesHistory, setSalesHistory] = useState<any[]>([])
  const [loadingSalesHistory, setLoadingSalesHistory] = useState<boolean>(false)
  const [salesHistoryError, setSalesHistoryError] = useState<string>("")

  const loadSalesHistory = async (salesStartDate: string, salesEndDate: string) => {
    if (!salesStartDate || !salesEndDate) {
      setSalesHistoryError("Selecciona fechas válidas")
      return
    }
    if (salesStartDate > salesEndDate) {
      setSalesHistoryError("La fecha 'Desde' no puede ser mayor que 'Hasta'")
      return
    }
    try {
      setLoadingSalesHistory(true)
      setSalesHistoryError("")
      const url = `http://localhost:8080/api/sales/date-range?startDate=${encodeURIComponent(salesStartDate)}&endDate=${encodeURIComponent(salesEndDate)}`
      const res = await authFetch(url)
      if (!res.ok) {
        const text = await res.text()
        throw new Error(`HTTP ${res.status} - ${text}`)
      }
      const data = await res.json()
      setSalesHistory(data)
    } catch (e) {
      console.error(e)
      setSalesHistoryError(e instanceof Error ? e.message : "Error al cargar ventas")
    } finally {
      setLoadingSalesHistory(false)
    }
  }

  const deleteSale = async (id: number) => {
    const res = await authFetch(`http://localhost:8080/api/sales/${id}`, { method: "DELETE" })
    if (!(res.ok || res.status === 204)) {
      const t = await res.text()
      throw new Error(t || `HTTP ${res.status}`)
    }
  }

  return {
    salesHistory,
    loadingSalesHistory,
    salesHistoryError,
    loadSalesHistory,
    deleteSale,
  }
}
