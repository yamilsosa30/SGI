"use client"

import React from "react"
import { formatNumberEs } from "@/lib/utils"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Truck, Eye } from "lucide-react"

interface PurchasesViewProps {
  purchases: any[]
  suppliers: any[]
  products: any[]
  loadingSuppliers: boolean
  loadingProducts: boolean
  isPurchaseAddOpen: boolean
  setIsPurchaseAddOpen: (v: boolean) => void
  newPurchase: { supplierId: string; items: { productId: string; qty: string; cost: string }[] }
  setNewPurchase: React.Dispatch<React.SetStateAction<{ supplierId: string; items: { productId: string; qty: string; cost: string }[] }>>
  addPurchaseItemRow: () => void
  removePurchaseItemRow: (idx: number) => void
  handlePurchaseItemChange: (idx: number, field: "productId" | "qty" | "cost", value: string) => void
  handleCreatePurchase: (e: any) => void
  completePurchase: (id: number) => void
  cancelPurchase: (id: number) => void
  purchasesSupplierFilter: string
  setPurchasesSupplierFilter: (v: string) => void
  purchasesPendPage: number
  setPurchasesPendPage: React.Dispatch<React.SetStateAction<number>>
  purchasesPendPageSize: number
  purchasesHistPage: number
  setPurchasesHistPage: React.Dispatch<React.SetStateAction<number>>
  purchasesHistPageSize: number
  readOnly?: boolean
}

export default function PurchasesView(props: PurchasesViewProps) {
  const {
    purchases, suppliers, products, loadingSuppliers, loadingProducts,
    isPurchaseAddOpen, setIsPurchaseAddOpen, newPurchase, setNewPurchase,
    addPurchaseItemRow, removePurchaseItemRow, handlePurchaseItemChange, handleCreatePurchase,
    completePurchase, cancelPurchase,
    purchasesSupplierFilter, setPurchasesSupplierFilter,
    purchasesPendPage, setPurchasesPendPage, purchasesPendPageSize,
    purchasesHistPage, setPurchasesHistPage, purchasesHistPageSize,
    readOnly = false,
  } = props

  // Estado para el modal de detalles de compra
  const [selectedPurchase, setSelectedPurchase] = React.useState<any>(null)
  const [showPurchaseDetails, setShowPurchaseDetails] = React.useState(false)

  const pending = purchases.filter((p) => p.status === "PENDING")
  const applySupplier = (arr: any[]) => {
    if (!purchasesSupplierFilter) return arr
    return arr.filter((p) => String(p.supplier?.id ?? "") === purchasesSupplierFilter)
  }
  const pendingFiltered = applySupplier(pending)
  const historyFiltered = applySupplier(purchases.filter((p) => p.status !== "PENDING"))
  const totalPendPages = Math.max(1, Math.ceil(pendingFiltered.length / purchasesPendPageSize))
  const currentPendPage = Math.min(purchasesPendPage, totalPendPages)
  const pendStart = (currentPendPage - 1) * purchasesPendPageSize
  const pendingPageItems = pendingFiltered.slice(pendStart, pendStart + purchasesPendPageSize)

  const totalPurchPages = Math.max(1, Math.ceil(historyFiltered.length / purchasesHistPageSize))
  const currentPurchPage = Math.min(purchasesHistPage, totalPurchPages)
  const purchStart = (currentPurchPage - 1) * purchasesHistPageSize
  const purchasesPageItems = historyFiltered.slice(purchStart, purchStart + purchasesHistPageSize)

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-balance">Compras</h1>
        {!readOnly && (
        <Dialog open={isPurchaseAddOpen} onOpenChange={setIsPurchaseAddOpen}>
          <DialogTrigger asChild>
            <Button>
              <Truck className="size-4 mr-2" />
              Nueva Compra
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Nueva Compra (Pendiente)</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleCreatePurchase} className="space-y-4">
              <div>
                <Label>Proveedor</Label>
                <Select value={newPurchase.supplierId} onValueChange={(v) => setNewPurchase((p) => ({ ...p, supplierId: v }))}>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder={loadingSuppliers ? "Cargando..." : "Seleccionar proveedor"} />
                  </SelectTrigger>
                  <SelectContent>
                    {suppliers.map((s) => (
                      <SelectItem key={s.id} value={String(s.id)}>{s.name}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-3">
                <Label>Ítems</Label>
                {newPurchase.items.map((row, idx) => (
                  <div key={idx} className="grid grid-cols-7 gap-2 items-end">
                    <div className="col-span-4">
                      <Label className="text-xs">Producto</Label>
                      <Select value={row.productId} onValueChange={(v) => handlePurchaseItemChange(idx, "productId", v)}>
                        <SelectTrigger className="w-full">
                          <SelectValue placeholder={loadingProducts ? "Cargando..." : "Seleccionar producto"} />
                        </SelectTrigger>
                        <SelectContent>
                          {products.map((p) => (
                            <SelectItem key={p.id} value={String(p.id)}>
                              {p.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label className="text-xs">Cantidad</Label>
                      <Input value={row.qty} onChange={(e) => handlePurchaseItemChange(idx, "qty", e.target.value)} type="number" />
                    </div>
                    <div>
                      <Label className="text-xs">Costo</Label>
                      <Input value={row.cost} onChange={(e) => handlePurchaseItemChange(idx, "cost", e.target.value)} type="text" placeholder="0,00" />
                    </div>
                    <div className="flex justify-end">
                      <Button type="button" variant="destructive" onClick={() => removePurchaseItemRow(idx)}>
                        Eliminar
                      </Button>
                    </div>
                  </div>
                ))}
                <Button type="button" variant="outline" onClick={addPurchaseItemRow}>Agregar Ítem</Button>
              </div>
              <div className="flex justify-end gap-2">
                <Button type="button" variant="outline" onClick={() => setIsPurchaseAddOpen(false)}>Cancelar</Button>
                <Button type="submit">Guardar Pendiente</Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
        )}
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between gap-3 flex-wrap">
            <CardTitle>Pendientes</CardTitle>
            <div className="flex items-end gap-2">
              <div>
                <Label>Proveedor</Label>
                <Select value={purchasesSupplierFilter || "ALL"} onValueChange={(v) => setPurchasesSupplierFilter(v === "ALL" ? "" : v)}>
                  <SelectTrigger className="w-[220px]">
                    <SelectValue placeholder={loadingSuppliers ? "Cargando..." : "Todos"} />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="ALL">Todos</SelectItem>
                    {suppliers.map((s) => (
                      <SelectItem key={s.id} value={String(s.id)}>{s.name}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Fecha</TableHead>
                <TableHead>Proveedor</TableHead>
                <TableHead>Ítems</TableHead>
                <TableHead>Costo</TableHead>
                <TableHead>Acciones</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {pendingFiltered.length === 0 && (
                <TableRow>
                  <TableCell colSpan={6}>Sin pendientes</TableCell>
                </TableRow>
              )}
              {pendingPageItems.map((p) => (
                <TableRow key={p.id}>
                  <TableCell>{new Date(p.createdAt).toLocaleString()}</TableCell>
                  <TableCell>{p.supplier?.name ?? "-"}</TableCell>
                  <TableCell>{p.items.reduce((sum, it) => sum + Number((it as any).qty ?? (it as any).quantity ?? 0), 0)}</TableCell>
                  <TableCell>${formatNumberEs(p.items.reduce((sum, it) => sum + Number(((it as any).qty ?? (it as any).quantity ?? 0)) * Number((it as any).cost || 0), 0), 2)}</TableCell>
                  <TableCell>
                    <div className="flex gap-2">
                      <Button 
                        size="sm" 
                        variant="outline"
                        onClick={() => {
                          setSelectedPurchase(p)
                          setShowPurchaseDetails(true)
                        }}
                      >
                        <Eye className="size-4" />
                      </Button>
                      {!readOnly && (
                        <>
                          <Button size="sm" onClick={() => completePurchase(p.id)}>Completar</Button>
                          <Button size="sm" variant="destructive" onClick={() => cancelPurchase(p.id)}>Cancelar</Button>
                        </>
                      )}
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          <div className="flex items-center justify-between mt-3">
            <div className="text-sm text-muted-foreground">Página {currentPendPage} de {totalPendPages}</div>
            <div className="flex gap-2">
              <Button variant="outline" disabled={currentPendPage <= 1} onClick={() => setPurchasesPendPage((p) => Math.max(1, p - 1))}>Anterior</Button>
              <Button variant="outline" disabled={currentPendPage >= totalPendPages} onClick={() => setPurchasesPendPage((p) => Math.min(totalPendPages, p + 1))}>Siguiente</Button>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Historial de Compras</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Fecha</TableHead>
                <TableHead>Proveedor</TableHead>
                <TableHead>Ítems</TableHead>
                <TableHead>Costo</TableHead>
                <TableHead>Estado</TableHead>
                <TableHead>Acciones</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {purchases.length === 0 && (
                <TableRow>
                  <TableCell colSpan={6}>Sin compras</TableCell>
                </TableRow>
              )}
              {purchasesPageItems.map((p) => (
                <TableRow key={p.id}>
                  <TableCell>{new Date(p.createdAt).toLocaleString()}</TableCell>
                  <TableCell>{p.supplier?.name ?? "-"}</TableCell>
                  <TableCell>{p.items.reduce((sum, it) => sum + Number(((it as any).qty ?? (it as any).quantity ?? 0)), 0)}</TableCell>
                  <TableCell>${p.items.reduce((sum, it) => sum + Number(((it as any).qty ?? (it as any).quantity ?? 0)) * Number((it as any).cost || 0), 0).toFixed(2)}</TableCell>
                  <TableCell>
                    {p.status === "COMPLETED" ? (
                      <Badge variant="secondary">Completada</Badge>
                    ) : p.status === "CANCELED" ? (
                      <Badge variant="destructive">Cancelada</Badge>
                    ) : (
                      <Badge variant="outline">Pendiente</Badge>
                    )}
                  </TableCell>
                  <TableCell>
                    <Button 
                      size="sm" 
                      variant="outline"
                      onClick={() => {
                        setSelectedPurchase(p)
                        setShowPurchaseDetails(true)
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
            <div className="text-sm text-muted-foreground">Página {currentPurchPage} de {totalPurchPages}</div>
            <div className="flex gap-2">
              <Button variant="outline" disabled={currentPurchPage <= 1} onClick={() => setPurchasesHistPage((p) => Math.max(1, p - 1))}>Anterior</Button>
              <Button variant="outline" disabled={currentPurchPage >= totalPurchPages} onClick={() => setPurchasesHistPage((p) => Math.min(totalPurchPages, p + 1))}>Siguiente</Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Modal de Detalles de Compra */}
      <Dialog open={showPurchaseDetails} onOpenChange={setShowPurchaseDetails}>
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle>Detalles de Compra #{selectedPurchase?.id}</DialogTitle>
          </DialogHeader>
          {selectedPurchase && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="font-semibold">Fecha:</span>{" "}
                  {selectedPurchase.createdAt ? new Date(selectedPurchase.createdAt).toLocaleString() : "-"}
                </div>
                <div>
                  <span className="font-semibold">Proveedor:</span>{" "}
                  {selectedPurchase.supplier?.name ?? "-"}
                </div>
                <div>
                  <span className="font-semibold">Estado:</span>{" "}
                  {selectedPurchase.status === "COMPLETED" ? (
                    <Badge variant="secondary">Completada</Badge>
                  ) : selectedPurchase.status === "CANCELED" ? (
                    <Badge variant="destructive">Cancelada</Badge>
                  ) : (
                    <Badge variant="outline">Pendiente</Badge>
                  )}
                </div>
                {selectedPurchase.completedAt && (
                  <div>
                    <span className="font-semibold">Fecha de Completado:</span>{" "}
                    {new Date(selectedPurchase.completedAt).toLocaleString()}
                  </div>
                )}
              </div>

              <div>
                <h3 className="font-semibold mb-2">Productos Comprados</h3>
                <table className="w-full border-collapse">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left py-2">Producto</th>
                      <th className="text-left py-2">Código</th>
                      <th className="text-right py-2">Costo Unit.</th>
                      <th className="text-right py-2">Cantidad</th>
                      <th className="text-right py-2">Subtotal</th>
                    </tr>
                  </thead>
                  <tbody>
                    {Array.isArray(selectedPurchase.items) && selectedPurchase.items.length > 0 ? (
                      selectedPurchase.items.map((item: any, idx: number) => {
                        const quantity = item.qty ?? item.quantity ?? 0
                        const cost = Number(item.cost || 0)
                        const subtotal = quantity * cost
                        
                        return (
                          <tr key={idx} className="border-b">
                            <td className="py-2">{item.product?.name || "-"}</td>
                            <td className="py-2 text-sm text-muted-foreground">{item.product?.barcode || "-"}</td>
                            <td className="text-right py-2">
                              ${formatNumberEs(cost, 2)}
                            </td>
                            <td className="text-right py-2">
                              {quantity}
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
                          No hay items en esta compra
                        </td>
                      </tr>
                    )}
                  </tbody>
                  <tfoot>
                    <tr className="border-t-2">
                      <td colSpan={4} className="text-right py-2 font-semibold">Total:</td>
                      <td className="text-right py-2 font-bold text-lg">
                        ${formatNumberEs(
                          selectedPurchase.items.reduce(
                            (sum: number, it: any) => sum + (Number(it.qty ?? it.quantity ?? 0) * Number(it.cost || 0)),
                            0
                          ),
                          2
                        )}
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
