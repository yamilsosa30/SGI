"use client"

import React from "react"
import { formatNumberEs } from "@/lib/utils"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Eye } from "lucide-react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"

interface StockViewProps {
  products: any[]
  categories: any[]
  loadingProducts: boolean
  loadError: string
  loadingCats: boolean
  stockSearch: string
  setStockSearch: (v: string) => void
  stockOnlyLow: boolean
  setStockOnlyLow: (v: boolean | ((prev: boolean) => boolean)) => void
  stockOnlyExpiring?: boolean
  stockCategoryFilter: string
  setStockCategoryFilter: (v: string) => void
  stockPage: number
  setStockPage: React.Dispatch<React.SetStateAction<number>>
  stockPageSize: number
  salesHistory: any[]
  loadingSalesHistory: boolean
  salesHistoryError: string
  salesHistPage: number
  setSalesHistPage: React.Dispatch<React.SetStateAction<number>>
  salesHistPageSize: number
  salesStartDate: string
  salesEndDate: string
  setSalesStartDate: (v: string) => void
  setSalesEndDate: (v: string) => void
  loadSalesHistory: () => void | Promise<void>
}

export default function StockView(props: StockViewProps) {
  const {
    products, categories, loadingProducts, loadError, loadingCats,
    stockSearch, setStockSearch, stockOnlyLow, setStockOnlyLow,
    stockCategoryFilter, setStockCategoryFilter,
    stockPage, setStockPage, stockPageSize,
    salesHistory, loadingSalesHistory, salesHistoryError,
    salesHistPage, setSalesHistPage, salesHistPageSize,
    salesStartDate, salesEndDate, setSalesStartDate, setSalesEndDate,
    loadSalesHistory,
  } = props

  // Estado para el modal de detalles de venta
  const [selectedSale, setSelectedSale] = React.useState<any>(null)
  const [showSaleDetails, setShowSaleDetails] = React.useState(false)

  const lowered = stockSearch.trim().toLowerCase()
  const filtered = products.filter((p: any) => {
    const matchText = !lowered || String(p.name ?? "").toLowerCase().includes(lowered) || String(p.barcode ?? "").toLowerCase().includes(lowered)
    const matchCat = !stockCategoryFilter || String(p.category?.id ?? "") === stockCategoryFilter
    const isLow = Number(p.stock ?? 0) <= Number(p.minStock ?? 0)
    const matchLow = !stockOnlyLow || isLow
    const isExpiring = (() => {
      if (!p.expiryDate) return false
      try {
        const d = new Date(p.expiryDate)
        const today = new Date()
        today.setHours(0,0,0,0)
        const limit = new Date(today)
        limit.setDate(limit.getDate() + 7)
        return d <= limit
      } catch {
        return false
      }
    })()
    const matchExp = !props.stockOnlyExpiring || isExpiring
    return matchText && matchCat && matchLow && matchExp
  })
  const totalStockPages = Math.max(1, Math.ceil(filtered.length / stockPageSize))
  const currentStockPage = Math.min(stockPage, totalStockPages)
  const stockStart = (currentStockPage - 1) * stockPageSize
  const stockPageItems = filtered.slice(stockStart, stockStart + stockPageSize)

  const totalSalesPages = Math.max(1, Math.ceil(salesHistory.length / salesHistPageSize))
  const currentSalesPage = Math.min(salesHistPage, totalSalesPages)
  const salesStart = (currentSalesPage - 1) * salesHistPageSize
  const salesPageItems = salesHistory.slice(salesStart, salesStart + salesHistPageSize)

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-balance">Stock</h1>
        <div className="text-sm text-muted-foreground">Productos: {products.length}</div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Filtro de Stock</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
            <div className="md:col-span-2">
              <Label>Búsqueda</Label>
              <Input placeholder="Nombre o código de barras" value={stockSearch} onChange={(e) => setStockSearch(e.target.value)} />
            </div>
            <div>
              <Label>Categoría</Label>
              <Select value={stockCategoryFilter || "ALL"} onValueChange={(v) => setStockCategoryFilter(v === "ALL" ? "" : v)}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder={loadingCats ? "Cargando..." : "Todas"} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="ALL">Todas</SelectItem>
                  {categories.map((c) => (
                    <SelectItem key={c.id} value={String(c.id)}>{c.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="flex items-end">
              <Button type="button" variant={stockOnlyLow ? "destructive" : "outline"} onClick={() => setStockOnlyLow((v: any) => (typeof v === 'boolean' ? !v : !stockOnlyLow))} className="w-full">
                {stockOnlyLow ? "Solo stock bajo: Sí" : "Solo stock bajo: No"}
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Listado de Productos</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Producto</TableHead>
                <TableHead>Código</TableHead>
                <TableHead>Categoría</TableHead>
                <TableHead>Precio</TableHead>
                <TableHead>Stock</TableHead>
                <TableHead>Mínimo</TableHead>
                <TableHead>Vencimiento</TableHead>
                <TableHead>Estado</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loadingProducts && (
                <TableRow>
                  <TableCell colSpan={8}>Cargando...</TableCell>
                </TableRow>
              )}
              {loadError && !loadingProducts && (
                <TableRow>
                  <TableCell colSpan={8} className="text-destructive">{loadError}</TableCell>
                </TableRow>
              )}
              {!loadingProducts && !loadError && filtered.length === 0 && (
                <TableRow>
                  <TableCell colSpan={8}>Sin productos</TableCell>
                </TableRow>
              )}
              {!loadingProducts && !loadError && stockPageItems.map((p: any) => {
                const isLow = Number(p.stock ?? 0) <= Number(p.minStock ?? 0)
                return (
                  <TableRow key={p.id}>
                    <TableCell>{p.name}</TableCell>
                    <TableCell>{p.barcode}</TableCell>
                    <TableCell>{p.category?.name ?? "-"}</TableCell>
                    <TableCell>${formatNumberEs(Number(p.price ?? 0), 2)}</TableCell>
                    <TableCell>{p.soldByWeight ? formatNumberEs(Number(p.stock ?? 0), 2) : formatNumberEs(Number(p.stock ?? 0), 0)}</TableCell>
                    <TableCell>{p.soldByWeight ? formatNumberEs(Number(p.minStock ?? 0), 2) : formatNumberEs(Number(p.minStock ?? 0), 0)}</TableCell>
                    <TableCell>{p.expiryDate ?? "-"}</TableCell>
                    <TableCell>
                      {isLow ? <Badge variant="destructive">Stock Bajo</Badge> : <Badge variant="secondary">OK</Badge>}
                    </TableCell>
                  </TableRow>
                )}
              )}
            </TableBody>
          </Table>
          <div className="flex items-center justify-between mt-3">
            <div className="text-sm text-muted-foreground">Página {currentStockPage} de {totalStockPages}</div>
            <div className="flex gap-2">
              <Button variant="outline" disabled={currentStockPage <= 1} onClick={() => setStockPage((p) => Math.max(1, p - 1))}>Anterior</Button>
              <Button variant="outline" disabled={currentStockPage >= totalStockPages} onClick={() => setStockPage((p) => Math.min(totalStockPages, p + 1))}>Siguiente</Button>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Historial de Ventas por Fecha</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-5 gap-3 mb-4">
            <div>
              <Label>Desde</Label>
              <Input type="date" value={salesStartDate} onChange={(e) => setSalesStartDate(e.target.value)} />
            </div>
            <div>
              <Label>Hasta</Label>
              <Input type="date" value={salesEndDate} onChange={(e) => setSalesEndDate(e.target.value)} />
            </div>
            <div className="md:col-span-2 flex items-end">
              <Button type="button" onClick={loadSalesHistory}>Buscar</Button>
            </div>
            <div className="flex items-end justify-end text-sm text-muted-foreground">
              {loadingSalesHistory ? "Cargando..." : salesHistoryError || `${salesHistory.length} ventas`}
            </div>
          </div>

          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Fecha</TableHead>
                <TableHead>Método</TableHead>
                <TableHead>Ítems</TableHead>
                <TableHead>Total</TableHead>
                <TableHead>Acciones</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {!loadingSalesHistory && salesHistory.length === 0 && !salesHistoryError && (
                <TableRow>
                  <TableCell colSpan={5}>Sin ventas en el rango</TableCell>
                </TableRow>
              )}
              {salesPageItems.map((s: any) => (
                <TableRow key={s.id}>
                  <TableCell>{new Date(s.saleDate).toLocaleString()}</TableCell>
                  <TableCell>{s.paymentMethod}</TableCell>
                  <TableCell>{s.items?.length ?? 0}</TableCell>
                  <TableCell>${Number(s.total).toFixed(2)}</TableCell>
                  <TableCell>
                    <Button 
                      size="sm" 
                      variant="outline"
                      onClick={() => {
                        setSelectedSale(s)
                        setShowSaleDetails(true)
                      }}
                    >
                      <Eye className="size-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          <div className="flex items-center justify-between mt-3">
            <div className="text-sm text-muted-foreground">Página {currentSalesPage} de {totalSalesPages}</div>
            <div className="flex gap-2">
              <Button variant="outline" disabled={currentSalesPage <= 1} onClick={() => setSalesHistPage((p) => Math.max(1, p - 1))}>Anterior</Button>
              <Button variant="outline" disabled={currentSalesPage >= totalSalesPages} onClick={() => setSalesHistPage((p) => Math.min(totalSalesPages, p + 1))}>Siguiente</Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Modal de Detalles de Venta */}
      <Dialog open={showSaleDetails} onOpenChange={setShowSaleDetails}>
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle>Detalles de Venta #{selectedSale?.id}</DialogTitle>
          </DialogHeader>
          {selectedSale && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="font-semibold">Fecha:</span>{" "}
                  {selectedSale.saleDate ? new Date(selectedSale.saleDate).toLocaleString() : "-"}
                </div>
                <div>
                  <span className="font-semibold">Método de Pago:</span>{" "}
                  {selectedSale.paymentMethod}
                </div>
                {selectedSale.customerName && (
                  <div className="col-span-2">
                    <span className="font-semibold">Cliente:</span>{" "}
                    {selectedSale.customerName}
                  </div>
                )}
              </div>

              <div>
                <h3 className="font-semibold mb-2">Productos Vendidos</h3>
                <table className="w-full border-collapse">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left py-2">Producto</th>
                      <th className="text-left py-2">Código</th>
                      <th className="text-right py-2">Precio Unit.</th>
                      <th className="text-right py-2">Cantidad</th>
                      <th className="text-right py-2">Subtotal</th>
                    </tr>
                  </thead>
                  <tbody>
                    {Array.isArray(selectedSale.items) && selectedSale.items.length > 0 ? (
                      selectedSale.items.map((item: any, idx: number) => {
                        const quantity = item.quantity || 1
                        const price = Number(item.unitPrice || 0)
                        // Usar el subtotal que viene del backend ya calculado correctamente
                        const subtotal = Number(item.subtotal || 0)
                        // Determinar si es por peso basado en la categoría del producto
                        const isByWeight = item.product?.category?.name === "VERDULERIA"
                        
                        return (
                          <tr key={idx} className="border-b">
                            <td className="py-2">{item.product?.name || "-"}</td>
                            <td className="py-2 text-sm text-muted-foreground">{item.product?.barcode || "-"}</td>
                            <td className="text-right py-2">
                              ${formatNumberEs(price, 2)}{isByWeight ? "/kg" : ""}
                            </td>
                            <td className="text-right py-2">
                              {isByWeight ? `${quantity}g` : quantity}
                            </td>
                            <td className="text-right py-2 font-medium">
                              ${formatNumberEs(subtotal, 2)}
                            </td>
                          </tr>
                        )
                      })
                    ) : (
                      <tr>
                        <td colSpan={5} className="text-center py-4 text-muted-foreground">
                          No hay items en esta venta
                        </td>
                      </tr>
                    )}
                  </tbody>
                  <tfoot>
                    <tr className="border-t-2">
                      <td colSpan={4} className="text-right py-2 font-semibold">Total:</td>
                      <td className="text-right py-2 font-bold text-lg">
                        ${formatNumberEs(Number(selectedSale.total ?? 0), 2)}
                      </td>
                    </tr>
                  </tfoot>
                </table>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}
