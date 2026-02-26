"use client"

import React from "react"
import { formatNumberEs } from "@/lib/utils"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { AlertTriangle, Clock, DollarSign, Package, Truck, CheckCircle, Eye } from "lucide-react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"

interface DashboardViewProps {
  nowString: string
  dashboardStats: { dailySales: number; totalProducts: number; lowStock: number; pendingOrders: number }
  alerts: Array<{ id: number; type: string; message: string; priority: "high" | "medium" | string }>
  recentSales: Array<any>
  onResolve?: (alert: { id: number; type: string; message: string; priority: string }) => void
}

export default function DashboardView({ nowString, dashboardStats, alerts, recentSales, onResolve }: DashboardViewProps) {
  // Estado para el modal de detalles de venta
  const [selectedSale, setSelectedSale] = React.useState<any>(null)
  const [showSaleDetails, setShowSaleDetails] = React.useState(false)

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-balance">Dashboard Principal</h1>
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Clock className="size-4" />
          <span suppressHydrationWarning>{nowString}</span>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Ventas del Día</CardTitle>
            <DollarSign className="size-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${formatNumberEs(dashboardStats.dailySales, 2)}</div>
            <p className="text-xs text-muted-foreground">Ingresos de hoy</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Productos</CardTitle>
            <Package className="size-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{dashboardStats.totalProducts}</div>
            <p className="text-xs text-muted-foreground">En inventario</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Stock Bajo</CardTitle>
            <AlertTriangle className="size-4 text-accent" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-accent">{dashboardStats.lowStock}</div>
            <p className="text-xs text-muted-foreground">Requieren reposición</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pedidos</CardTitle>
            <Truck className="size-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{dashboardStats.pendingOrders}</div>
            <p className="text-xs text-muted-foreground">Pendientes</p>
          </CardContent>
        </Card>
      </div>

      {/* Alerts Section */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <AlertTriangle className="size-5 text-accent" />
            Alertas Activas
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {alerts.map((alert) => (
              <div key={alert.id} className="flex items-center justify-between p-3 rounded-lg border">
                <div className="flex items-center gap-3">
                  <Badge
                    variant={alert.priority === "high" ? "destructive" : "secondary"}
                    className={alert.priority === "high" ? "alert-badge" : ""}
                  >
                    {alert.priority === "high" ? "Crítico" : "Medio"}
                  </Badge>
                  <span className="text-sm">{alert.message}</span>
                </div>
                <Button size="sm" variant="outline" onClick={() => onResolve?.(alert)}>
                  Resolver
                </Button>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Recent Sales */}
      <Card>
        <CardHeader>
          <CardTitle>Ventas Recientes</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Hora</TableHead>
                <TableHead>Ítems</TableHead>
                <TableHead>Total</TableHead>
                <TableHead>Pago</TableHead>
                <TableHead>Estado</TableHead>
                <TableHead>Acciones</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {recentSales.map((s: any) => {
                const itemsCount = Array.isArray(s.items)
                  ? s.items.reduce((acc: number, it: any) => acc + Number(it.quantity || 0), 0)
                  : 0
                const timeStr = s.saleDate ? new Date(s.saleDate).toLocaleTimeString() : "-"
                const total = Number(s.total ?? 0)
                const pay = String(s.paymentMethod ?? "-")
                return (
                  <TableRow key={s.id}>
                    <TableCell>{timeStr}</TableCell>
                    <TableCell>{itemsCount}</TableCell>
                    <TableCell>{`$${formatNumberEs(total, 2)}`}</TableCell>
                    <TableCell>{pay}</TableCell>
                    <TableCell>
                      <Badge variant="secondary">
                        <CheckCircle className="size-3 mr-1" />
                        Completada
                      </Badge>
                    </TableCell>
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
                )
              })}
            </TableBody>
          </Table>
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
