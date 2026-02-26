"use client"

import React from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { BarChart3, TrendingUp, AlertTriangle } from "lucide-react"

interface ReportsViewProps {
  dashboardStats: { dailySales: number; lowStock: number }
  isAdmin?: boolean
}

// Helper fetch con Authorization y base de API dinámica
const authFetch = async (input: string, init: RequestInit = {}) => {
  const getApiBase = () => {
    if (typeof window === "undefined") return "http://localhost:8080"
    const host = window.location.hostname
    return `http://${host}:8080`
  }
  const base = getApiBase()
  const tk = typeof window !== "undefined" ? localStorage.getItem("pos_token") : null
  const headers = { ...(init.headers || {}), ...(tk ? { Authorization: `Bearer ${tk}` } : {}) }
  let url = input
  if (url.startsWith("/")) {
    url = base + url
  } else if (url.startsWith("http://localhost:8080")) {
    url = url.replace("http://localhost:8080", base)
  } else if (url.startsWith("http://127.0.0.1:8080")) {
    url = url.replace("http://127.0.0.1:8080", base)
  }
  return fetch(url, { ...init, headers })
}

export default function ReportsView({ dashboardStats, isAdmin = false }: ReportsViewProps) {
  const [topProducts, setTopProducts] = React.useState<Array<{ productId:number; name:string; totalQuantity:number; totalRevenue:number }>>([])
  const [loadingTop, setLoadingTop] = React.useState(false)
  const [errorTop, setErrorTop] = React.useState("")
  const [backupMsg, setBackupMsg] = React.useState("")
  // Reporte ventas (PDF)
  const [period, setPeriod] = React.useState<'DAILY'|'WEEKLY'|'MONTHLY'|'YEARLY'>('DAILY')
  const [fromDate, setFromDate] = React.useState<string>("")
  const [toDate, setToDate] = React.useState<string>("")
  const [downloading, setDownloading] = React.useState(false)
  const [downloadError, setDownloadError] = React.useState("")

  const downloadProfitPdf = async () => {
    try {
      setDownloading(true)
      setDownloadError("")
      const params = new URLSearchParams()
      params.set('period', period)
      if (fromDate) params.set('from', fromDate)
      if (toDate) params.set('to', toDate)
      const res = await authFetch(`/api/reports/profit-summary.pdf?${params.toString()}`, { headers: { 'Accept': 'application/pdf' } })
      if (!res.ok) {
        const t = await res.text()
        throw new Error(t || `HTTP ${res.status}`)
      }
      const blob = await res.blob()
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `ganancias-${period.toLowerCase()}.pdf`
      document.body.appendChild(a)
      a.click()
      a.remove()
      URL.revokeObjectURL(url)
    } catch (e:any) {
      console.error(e)
      setDownloadError('No fue posible generar el PDF de ganancias')
    } finally {
      setDownloading(false)
    }
  }

  const downloadSalesPdf = async () => {
    try {
      setDownloading(true)
      setDownloadError("")
      const params = new URLSearchParams()
      params.set('period', period)
      if (fromDate) params.set('from', fromDate)
      if (toDate) params.set('to', toDate)
      const res = await authFetch(`/api/reports/sales-summary.pdf?${params.toString()}`, { headers: { 'Accept': 'application/pdf' } })
      if (!res.ok) {
        const t = await res.text()
        throw new Error(t || `HTTP ${res.status}`)
      }
      const blob = await res.blob()
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `ventas-${period.toLowerCase()}.pdf`
      document.body.appendChild(a)
      a.click()
      a.remove()
      URL.revokeObjectURL(url)
    } catch (e:any) {
      console.error(e)
      setDownloadError('No fue posible generar el PDF')
    } finally {
      setDownloading(false)
    }
  }

  const downloadCashflowPdf = async () => {
    try {
      setDownloading(true)
      setDownloadError("")
      const params = new URLSearchParams()
      params.set('period', period)
      if (fromDate) params.set('from', fromDate)
      if (toDate) params.set('to', toDate)
      const res = await authFetch(`/api/reports/cashflow-summary.pdf?${params.toString()}`, { headers: { 'Accept': 'application/pdf' } })
      if (!res.ok) {
        const t = await res.text()
        throw new Error(t || `HTTP ${res.status}`)
      }
      const blob = await res.blob()
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `cashflow-${period.toLowerCase()}.pdf`
      document.body.appendChild(a)
      a.click()
      a.remove()
      URL.revokeObjectURL(url)
    } catch (e:any) {
      console.error(e)
      setDownloadError('No fue posible generar el PDF de cashflow')
    } finally {
      setDownloading(false)
    }
  }

  React.useEffect(() => {
    ;(async () => {
      try {
        setLoadingTop(true)
        setErrorTop("")
        const res = await authFetch("/api/reports/top-products?limit=5")
        if (!res.ok) throw new Error(`HTTP ${res.status}`)
        const data = await res.json()
        setTopProducts(Array.isArray(data) ? data : [])
      } catch (e:any) {
        console.error(e)
        setErrorTop("No fue posible cargar Top Productos")
      } finally {
        setLoadingTop(false)
      }
    })()
  }, [])

  const generateBackup = async () => {
    try {
      setBackupMsg("")
      const res = await authFetch("/api/admin/backup", { method: "POST" })
      if (!res.ok) {
        const t = await res.text()
        throw new Error(t || `HTTP ${res.status}`)
      }
      const blob = await res.blob()
      const url = URL.createObjectURL(blob)
      const a = document.createElement("a")
      a.href = url
      a.download = "sgik-backup.sql"
      document.body.appendChild(a)
      a.click()
      a.remove()
      URL.revokeObjectURL(url)
      try { localStorage.setItem("last_backup_at", new Date().toISOString()) } catch {}
      setBackupMsg("Backup generado correctamente")
    } catch (e:any) {
      console.error(e)
      setBackupMsg("Error al generar backup")
    }
  }

  // Recordatorio mensual simple (basado en localStorage)
  const showBackupReminder = React.useMemo(() => {
    if (!isAdmin) return false
    try {
      const v = localStorage.getItem("last_backup_at")
      if (!v) return true
      const last = new Date(v).getTime()
      const now = Date.now()
      const days = (now - last) / (1000*60*60*24)
      return days >= 30
    } catch {
      return true
    }
  }, [isAdmin])
  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-balance">Reportes</h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="cursor-pointer hover:shadow-md transition-shadow">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BarChart3 className="size-5 text-primary" />
              Ventas del Día
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">${dashboardStats.dailySales.toFixed(2)}</p>
            <p className="text-sm text-muted-foreground">Ingresos de hoy</p>
          </CardContent>
        </Card>

      {/* Reporte de Ganancias (PDF) */}
      <Card>
        <CardHeader>
          <CardTitle>Reporte de Ganancias (PDF)</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-5 gap-3 items-end">
            <div>
              <label className="block text-sm mb-1">Período</label>
              <select className="w-full border rounded-md px-3 py-2 bg-input/80 dark:bg-input/30" value={period} onChange={(e) => setPeriod(e.target.value as any)}>
                <option value="DAILY">Diario</option>
                <option value="WEEKLY">Semanal</option>
                <option value="MONTHLY">Mensual</option>
                <option value="YEARLY">Anual</option>
              </select>
            </div>
            <div>
              <label className="block text-sm mb-1">Desde</label>
              <input type="date" className="w-full border rounded-md px-3 py-2 bg-input/80 dark:bg-input/30" value={fromDate} onChange={(e) => setFromDate(e.target.value)} />
            </div>
            <div>
              <label className="block text-sm mb-1">Hasta</label>
              <input type="date" className="w-full border rounded-md px-3 py-2 bg-input/80 dark:bg-input/30" value={toDate} onChange={(e) => setToDate(e.target.value)} />
            </div>
            <div className="md:col-span-2 flex items-end">
              <button disabled={downloading} onClick={downloadProfitPdf} className="inline-flex items-center px-3 py-2 rounded bg-primary text-primary-foreground hover:opacity-90 disabled:opacity-50">
                {downloading ? 'Generando...' : 'Descargar PDF'}
              </button>
            </div>
          </div>
          {downloadError && <div className="mt-2 text-sm text-destructive">{downloadError}</div>}
        </CardContent>
      </Card>

        <Card className="cursor-pointer hover:shadow-md transition-shadow">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="size-5 text-primary" />
              Top Productos
            </CardTitle>
          </CardHeader>
          <CardContent>
            {loadingTop && <p className="text-sm text-muted-foreground">Cargando...</p>}
            {errorTop && <p className="text-sm text-destructive">{errorTop}</p>}
            {!loadingTop && !errorTop && topProducts.length === 0 && <p className="text-sm">Sin datos</p>}
            {!loadingTop && !errorTop && topProducts.map((p, idx) => (
              <p key={p.productId} className="text-sm">{idx+1}. {p.name} — {p.totalQuantity} u. (${Number(p.totalRevenue||0).toFixed(2)})</p>
            ))}
          </CardContent>
        </Card>

        <Card className="cursor-pointer hover:shadow-md transition-shadow">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertTriangle className="size-5 text-accent" />
              Stock Crítico
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold text-accent">{dashboardStats.lowStock}</p>
            <p className="text-sm text-muted-foreground">Productos bajo mínimo</p>
          </CardContent>
        </Card>
      </div>

      {/* Reporte de Cashflow Compras vs Ventas (PDF) */}
      <Card>
        <CardHeader>
          <CardTitle>Cashflow: Compras vs Ventas (PDF)</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-5 gap-3 items-end">
            <div>
              <label className="block text-sm mb-1">Período</label>
              <select className="w-full border rounded-md px-3 py-2 bg-input/80 dark:bg-input/30" value={period} onChange={(e) => setPeriod(e.target.value as any)}>
                <option value="DAILY">Diario</option>
                <option value="WEEKLY">Semanal</option>
                <option value="MONTHLY">Mensual</option>
                <option value="YEARLY">Anual</option>
              </select>
            </div>
            <div>
              <label className="block text-sm mb-1">Desde</label>
              <input type="date" className="w-full border rounded-md px-3 py-2 bg-input/80 dark:bg-input/30" value={fromDate} onChange={(e) => setFromDate(e.target.value)} />
            </div>
            <div>
              <label className="block text-sm mb-1">Hasta</label>
              <input type="date" className="w-full border rounded-md px-3 py-2 bg-input/80 dark:bg-input/30" value={toDate} onChange={(e) => setToDate(e.target.value)} />
            </div>
            <div className="md:col-span-2 flex items-end">
              <button disabled={downloading} onClick={downloadCashflowPdf} className="inline-flex items-center px-3 py-2 rounded bg-primary text-primary-foreground hover:opacity-90 disabled:opacity-50">
                {downloading ? 'Generando...' : 'Descargar PDF'}
              </button>
            </div>
          </div>
          {downloadError && <div className="mt-2 text-sm text-destructive">{downloadError}</div>}
        </CardContent>
      </Card>

      {/* Reporte de Ventas (PDF) */}
      <Card>
        <CardHeader>
          <CardTitle>Reporte de Ventas (PDF)</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-5 gap-3 items-end">
            <div>
              <label className="block text-sm mb-1">Período</label>
              <select className="w-full border rounded-md px-3 py-2 bg-input/80 dark:bg-input/30" value={period} onChange={(e) => setPeriod(e.target.value as any)}>
                <option value="DAILY">Diario</option>
                <option value="WEEKLY">Semanal</option>
                <option value="MONTHLY">Mensual</option>
                <option value="YEARLY">Anual</option>
              </select>
            </div>
            <div>
              <label className="block text-sm mb-1">Desde</label>
              <input type="date" className="w-full border rounded-md px-3 py-2 bg-input/80 dark:bg-input/30" value={fromDate} onChange={(e) => setFromDate(e.target.value)} />
            </div>
            <div>
              <label className="block text-sm mb-1">Hasta</label>
              <input type="date" className="w-full border rounded-md px-3 py-2 bg-input/80 dark:bg-input/30" value={toDate} onChange={(e) => setToDate(e.target.value)} />
            </div>
            <div className="md:col-span-2 flex items-end">
              <button disabled={downloading} onClick={downloadSalesPdf} className="inline-flex items-center px-3 py-2 rounded bg-primary text-primary-foreground hover:opacity-90 disabled:opacity-50">
                {downloading ? 'Generando...' : 'Descargar PDF'}
              </button>
            </div>
          </div>
          {downloadError && <div className="mt-2 text-sm text-destructive">{downloadError}</div>}
        </CardContent>
      </Card>

      {isAdmin && (
        <Card>
          <CardHeader>
            <CardTitle>Administración</CardTitle>
          </CardHeader>
          <CardContent>
            {showBackupReminder && (
              <div className="mb-3 text-sm text-accent">Recordatorio: generá un backup (recomendado 1 vez al mes)</div>
            )}
            <button className="inline-flex items-center px-3 py-2 rounded bg-primary text-primary-foreground hover:opacity-90" onClick={generateBackup}>
              Generar Backup
            </button>
            {backupMsg && <div className="mt-2 text-sm text-muted-foreground">{backupMsg}</div>}
          </CardContent>
        </Card>
      )}
    </div>
  )
}
