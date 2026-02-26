import { useState } from "react"
import { authFetch } from "@/lib/api-client"

type DashboardStats = {
  dailySales: number
  totalProducts: number
  lowStock: number
  pendingOrders: number
}

/**
 * Hook para gestión del dashboard con estadísticas y alertas
 */
export function useDashboard() {
  const [dashboardStats, setDashboardStats] = useState<DashboardStats>({
    dailySales: 0,
    totalProducts: 0,
    lowStock: 0,
    pendingOrders: 0,
  })
  const [recentSales, setRecentSales] = useState<any[]>([])
  const [alerts, setAlerts] = useState<Array<{ 
    id: number
    type: string
    message: string
    priority: string
    productId?: number 
  }>>([])

  const loadDashboard = async () => {
    try {
      const [totalRes, todayRes, productsRes, lowRes, pendCountRes, alertsRes] = await Promise.all([
        authFetch("http://localhost:8080/api/sales/total-today"),
        authFetch("http://localhost:8080/api/sales/today"),
        authFetch("http://localhost:8080/api/products"),
        authFetch("http://localhost:8080/api/products/low-stock"),
        authFetch("http://localhost:8080/api/purchases/pending-count"),
        authFetch("http://localhost:8080/api/dashboard/alerts"),
      ])
      
      const [totalToday, todaySales, products, low, pendCount, alertsList] = await Promise.all([
        totalRes.ok ? totalRes.json() : Promise.resolve(0),
        todayRes.ok ? todayRes.json() : Promise.resolve([]),
        productsRes.ok ? productsRes.json() : Promise.resolve([]),
        lowRes.ok ? lowRes.json() : Promise.resolve([]),
        pendCountRes.ok ? pendCountRes.json() : Promise.resolve(0),
        alertsRes.ok ? alertsRes.json() : Promise.resolve([]),
      ])
      
      // Procesar el valor de ventas diarias correctamente
      let dailySalesValue = 0
      if (totalToday !== null && totalToday !== undefined) {
        if (typeof totalToday === 'number') {
          dailySalesValue = totalToday
        } else if (typeof totalToday === 'string') {
          dailySalesValue = parseFloat(totalToday) || 0
        } else if (typeof totalToday === 'object') {
          const objValue = Object.values(totalToday)[0]
          if (objValue !== undefined) {
            dailySalesValue = Number(objValue) || 0
          }
        }
      }
      
      setAlerts(Array.isArray(alertsList) ? alertsList : [])
      
      // Ventas recientes: ordenar por fecha desc y tomar 10
      const recent = Array.isArray(todaySales)
        ? [...todaySales].sort((a: any, b: any) => 
            new Date(b.saleDate).getTime() - new Date(a.saleDate).getTime()
          ).slice(0, 10)
        : []
      setRecentSales(recent)
      
      setDashboardStats({
        dailySales: dailySalesValue,
        totalProducts: Array.isArray(products) ? products.length : 0,
        lowStock: Array.isArray(low) ? low.length : 0,
        pendingOrders: Number(pendCount || 0),
      })
    } catch (e) {
      console.error("Error cargando dashboard", e)
    }
  }

  const resolveAlert = async (alertId: number, alertType: string) => {
    try {
      const res = await authFetch(
        `http://localhost:8080/api/dashboard/alerts/resolve/${alertId}?type=${alertType}`,
        { method: "PUT" }
      )
      if (!res.ok) {
        console.error("Error al resolver alerta:", await res.text())
      } else {
        // Recargar alertas
        await loadDashboard()
      }
    } catch (err) {
      console.error("Error al resolver alerta:", err)
    }
  }

  return {
    dashboardStats,
    recentSales,
    alerts,
    loadDashboard,
    resolveAlert,
  }
}
