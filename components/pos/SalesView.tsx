"use client"

import React from "react"
import { formatNumberEs } from "@/lib/utils"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Scan, Scale, Package, Eye } from "lucide-react"
import { useBarcodeAutocomplete } from "@/hooks/useBarcodeAutocomplete"

interface SalesViewProps {
  barcodeInput: string
  setBarcodeInput: (v: string) => void
  barcodeInputRef: React.RefObject<HTMLInputElement>
  handleBarcodeSubmit: (e: any) => void | Promise<void>
  cartItems: Array<any>
  setCartItems: React.Dispatch<React.SetStateAction<any[]>>
  processingPayment: boolean
  handleProcessPayment: (m: "CASH" | "CARD_DEBIT" | "CARD_CREDIT" | "TRANSFER" | "FIADO") => void | Promise<void>
  isCamOpen: boolean
  setIsCamOpen: (v: boolean) => void
  videoRef: React.RefObject<HTMLVideoElement>
  customers: any[]
  selectedCustomerId: string
  setSelectedCustomerId: (v: string) => void
  products: any[] // NUEVO: lista de productos para autocompletado
  onSelectProduct: (product: any) => void // NUEVO: callback para seleccionar producto
  // Historial de ventas
  salesHistory: any[]
  loadingSalesHistory: boolean
  salesHistoryError: string
  salesStartDate: string
  setSalesStartDate: (v: string) => void
  salesEndDate: string
  setSalesEndDate: (v: string) => void
  salesHistPage: number
  setSalesHistPage: React.Dispatch<React.SetStateAction<number>>
  salesHistPageSize: number
  loadSalesHistory: () => void | Promise<void>
  onDeleteSale: (id: number) => void | Promise<void>
}

export default function SalesView(props: SalesViewProps) {
  const {
    barcodeInput,
    setBarcodeInput,
    barcodeInputRef,
    handleBarcodeSubmit,
    cartItems,
    setCartItems,
    processingPayment,
    handleProcessPayment,
    isCamOpen,
    setIsCamOpen,
    videoRef,
    customers,
    selectedCustomerId,
    setSelectedCustomerId,
    products,
    onSelectProduct,
    // Historial
    salesHistory,
    loadingSalesHistory,
    salesHistoryError,
    salesStartDate,
    setSalesStartDate,
    salesEndDate,
    setSalesEndDate,
    salesHistPage,
    setSalesHistPage,
    salesHistPageSize,
    loadSalesHistory,
    onDeleteSale,
  } = props

  // Estado para el modal de detalles de venta
  const [selectedSale, setSelectedSale] = React.useState<any>(null)
  const [showSaleDetails, setShowSaleDetails] = React.useState(false)

  // Hook de autocompletado
  const {
    suggestions,
    showSuggestions,
    selectedIndex,
    setShowSuggestions,
    handleKeyDown,
    getSelectedProduct,
    clearSuggestions,
  } = useBarcodeAutocomplete(products, barcodeInput)

  // Manejar submit del formulario
  const onSubmitForm = async (e: React.FormEvent) => {
    e.preventDefault()
    
    // Si hay una sugerencia seleccionada con las flechas, usarla
    const selectedProduct = getSelectedProduct()
    if (selectedProduct) {
      onSelectProduct(selectedProduct)
      setBarcodeInput("")
      clearSuggestions()
      barcodeInputRef.current?.focus()
      return
    }
    
    // Si no, procesar como código de barras normal
    await handleBarcodeSubmit(e)
    clearSuggestions()
  }

  // Seleccionar una sugerencia con click
  const handleSelectSuggestion = (product: any) => {
    onSelectProduct(product)
    setBarcodeInput("")
    clearSuggestions()
    barcodeInputRef.current?.focus()
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-balance">Ventas</h1>
        <div className="flex items-center gap-2">
          <Button variant="outline" onClick={() => setIsCamOpen(true)}>
            <Scan className="size-4 mr-2" />
            Escanear
          </Button>
          <Button variant="destructive" onClick={() => setCartItems([])}>Vaciar Carrito</Button>
        </div>
      </div>

      {/* Input con Autocompletado */}
      <form onSubmit={onSubmitForm} className="relative">
        <div className="flex items-center gap-2">
          <div className="relative flex-1">
            <Input
              ref={barcodeInputRef}
              value={barcodeInput}
              onChange={(e) => setBarcodeInput(e.target.value)}
              onKeyDown={handleKeyDown}
              onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
              onFocus={() => barcodeInput.length >= 2 && suggestions.length > 0 && setShowSuggestions(true)}
              placeholder="Escanea o escribe un código de barras / nombre del producto"
              autoComplete="off"
            />
            
            {/* Dropdown de Sugerencias */}
            {showSuggestions && suggestions.length > 0 && (
              <div className="absolute z-50 w-full mt-1 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-md shadow-lg max-h-80 overflow-auto">
                {suggestions.map((product, index) => (
                  <div
                    key={product.id}
                    onClick={() => handleSelectSuggestion(product)}
                    className={`px-4 py-3 cursor-pointer transition-colors border-b border-gray-100 dark:border-gray-700 last:border-b-0 ${
                      index === selectedIndex
                        ? "bg-blue-50 dark:bg-blue-900/30"
                        : "hover:bg-gray-50 dark:hover:bg-gray-700/50"
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      <Package className="size-5 text-gray-400 mt-0.5 flex-shrink-0" />
                      <div className="flex-1 min-w-0">
                        <div className="font-medium text-sm text-gray-900 dark:text-gray-100 truncate">
                          {product.name}
                        </div>
                        <div className="flex items-center gap-2 mt-1">
                          <span className="text-xs text-gray-500 dark:text-gray-400 font-mono">
                            {product.barcode}
                          </span>
                          <span className="text-xs text-gray-400 dark:text-gray-500">•</span>
                          <span className="text-xs font-semibold text-green-600 dark:text-green-400">
                            ${formatNumberEs(Number(product.price || 0), 2)}
                          </span>
                          {product.soldByWeight && (
                            <>
                              <span className="text-xs text-gray-400 dark:text-gray-500">•</span>
                              <span className="text-xs text-orange-600 dark:text-orange-400 flex items-center gap-1">
                                <Scale className="size-3" />
                                Por peso
                              </span>
                            </>
                          )}
                        </div>
                        <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                          Stock: {product.stock} {product.soldByWeight ? "kg" : "unid."}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
          <Button type="submit">Agregar</Button>
        </div>
        
        {/* Indicador de sugerencias */}
        {barcodeInput.length > 0 && barcodeInput.length < 2 && (
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
            Escribe al menos 2 caracteres para ver sugerencias
          </p>
        )}
        {barcodeInput.length >= 2 && suggestions.length === 0 && (
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
            No se encontraron productos que coincidan
          </p>
        )}
        {showSuggestions && suggestions.length > 0 && (
          <p className="text-xs text-blue-600 dark:text-blue-400 mt-1">
            {suggestions.length} producto{suggestions.length !== 1 ? "s" : ""} encontrado{suggestions.length !== 1 ? "s" : ""}. 
            Usa ↑↓ para navegar, Enter para seleccionar
          </p>
        )}
      </form>

      <Card>
        <CardHeader>
          <CardTitle>Carrito</CardTitle>
        </CardHeader>
        <CardContent>
          <table className="w-full">
            <thead>
              <tr className="text-left">
                <th>Producto</th>
                <th>Código</th>
                <th>Precio Unit.</th>
                <th>Cantidad/Peso</th>
                <th>Subtotal</th>
                <th>Interés %</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {cartItems.length === 0 && (
                <tr>
                  <td colSpan={7}>Carrito vacío</td>
                </tr>
              )}
              {cartItems.map((it, idx) => {
                const quantity = it.quantity || 1;
                const price = Number(it.price || 0);
                const interestRate = it.interestRate || 0;
                const baseSubtotal = it.soldByWeight 
                  ? price * (quantity / 1000) // Convertir gramos a kilos para el cálculo
                  : price * quantity;
                const interestAmount = baseSubtotal * (interestRate / 100);
                const subtotal = baseSubtotal + interestAmount;
                
                return (
                  <tr key={`${it.id}-${idx}`}>
                    <td>{it.name}</td>
                    <td>{it.barcode}</td>
                    <td>${formatNumberEs(price, 2)}{it.soldByWeight ? "/kg" : ""}</td>
                    <td>
                      <input
                        type="text"
                        inputMode="decimal"
                        defaultValue={it.interestRate || 0}
                        onBlur={(e) => {
                          const value = parseFloat(e.target.value) || 0;
                          if (value < 0 || value > 100) return;
                          const newCart = [...cartItems];
                          newCart[idx] = { ...newCart[idx], interestRate: value };
                          setCartItems(newCart);
                        }}
                        className="w-16 text-center border rounded-md px-1"
                        placeholder="%"
                      />
                      <span className="ml-1 text-sm text-gray-500">%</span>
                    </td>
                    <td>
                      {it.soldByWeight ? (
                        <div className="flex items-center border rounded-md">
                          <input
                            type="number"
                            min="1"
                            value={quantity}
                            onChange={(e) => {
                              const value = parseInt(e.target.value) || 1;
                              if (value < 1) return;
                              
                              setCartItems((prev) => {
                                const newItems = [...prev];
                                newItems[idx] = {
                                  ...newItems[idx],
                                  quantity: value
                                };
                                return newItems;
                              });
                            }}
                            className="w-20 text-center border-none focus:outline-none focus:ring-0"
                          />
                          <span className="px-2 text-sm text-gray-500">g</span>
                          <Scale className="size-4 mr-2 text-gray-500" />
                        </div>
                      ) : (
                        <div className="flex items-center border rounded-md">
                          <button 
                            type="button"
                            className="px-2 py-1 text-lg border-r hover:bg-gray-100"
                            onClick={() => {
                              setCartItems((prev) => {
                                // Si solo queda 1, eliminar el item
                                if (prev[idx].quantity === 1 || !prev[idx].quantity) {
                                  return prev.filter((_, i) => i !== idx);
                                }
                                // Sino, decrementar
                                const newItems = [...prev];
                                newItems[idx] = {
                                  ...newItems[idx],
                                  quantity: (newItems[idx].quantity || 1) - 1
                                };
                                return newItems;
                              });
                            }}
                          >
                            -
                          </button>
                          <input
                            type="number"
                            min="1"
                            value={quantity}
                            onChange={(e) => {
                              const value = parseInt(e.target.value) || 1;
                              if (value < 1) return;
                              
                              setCartItems((prev) => {
                                const newItems = [...prev];
                                newItems[idx] = {
                                  ...newItems[idx],
                                  quantity: value
                                };
                                return newItems;
                              });
                            }}
                            className="w-12 text-center border-none focus:outline-none focus:ring-0"
                          />
                          <button 
                            type="button"
                            className="px-2 py-1 text-lg border-l hover:bg-gray-100"
                            onClick={() => {
                              setCartItems((prev) => {
                                const newItems = [...prev];
                                newItems[idx] = {
                                  ...newItems[idx],
                                  quantity: (newItems[idx].quantity || 1) + 1
                                };
                                return newItems;
                              });
                            }}
                          >
                            +
                          </button>
                        </div>
                      )}
                    </td>
                    <td className="font-medium">${formatNumberEs(subtotal, 2)}</td>
                    <td>
                      <Button size="sm" variant="destructive" onClick={() => setCartItems((prev) => prev.filter((_, i) => i !== idx))}>
                        Eliminar
                      </Button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>

          <div className="flex justify-end mt-4">
            <div className="text-right">
              <div className="text-sm text-muted-foreground">Total</div>
              <div className="text-2xl font-bold">
                ${formatNumberEs(cartItems.reduce((sum, i) => {
                  const price = Number(i.price || 0);
                  const quantity = i.quantity || 1;
                  const baseSubtotal = i.soldByWeight ? price * (quantity / 1000) : price * quantity;
                  const interest = i.interestRate ? baseSubtotal * (i.interestRate / 100) : 0;
                  return sum + baseSubtotal + interest;
                }, 0), 2)}
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mt-4">
            <div className="md:col-span-2" />
            <div>
              <label className="text-sm block mb-1">Cliente (requerido para fiado)</label>
              <Select value={selectedCustomerId || "NONE"} onValueChange={(v) => setSelectedCustomerId(v === "NONE" ? "" : v)}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Seleccionar cliente" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="NONE">Sin cliente</SelectItem>
                  {customers.map((c) => (
                    <SelectItem key={c.id} value={String(c.id)}>{c.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="flex justify-end gap-2 mt-4">
            <Button disabled={processingPayment || cartItems.length === 0} onClick={() => handleProcessPayment("CASH")}>Efectivo</Button>
            <Button variant="outline" disabled={processingPayment || cartItems.length === 0} onClick={() => handleProcessPayment("CARD_DEBIT")}>Tarjeta Débito</Button>
            <Button variant="outline" disabled={processingPayment || cartItems.length === 0} onClick={() => handleProcessPayment("CARD_CREDIT")}>Tarjeta Crédito</Button>
            <Button variant="outline" disabled={processingPayment || cartItems.length === 0} onClick={() => handleProcessPayment("TRANSFER")}>Transferencia</Button>
            <Button variant="outline" disabled={processingPayment || cartItems.length === 0} onClick={() => handleProcessPayment("FIADO")}>Fiado</Button>
          </div>
        </CardContent>
      </Card>

      <Dialog open={isCamOpen} onOpenChange={setIsCamOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Escanear Código</DialogTitle>
          </DialogHeader>
          <div className="space-y-3">
            <video ref={videoRef} className="w-full rounded border" autoPlay playsInline muted />
            <div className="flex justify-end">
              <Button type="button" variant="outline" onClick={() => setIsCamOpen(false)}>Cerrar</Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Historial de Ventas con Filtros y Paginación */}
      <Card>
        <CardHeader>
          <CardTitle>Historial de Ventas</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-5 gap-3 mb-4">
            <div>
              <label className="text-sm">Desde</label>
              <Input type="date" value={salesStartDate} onChange={(e) => setSalesStartDate(e.target.value)} />
            </div>
            <div>
              <label className="text-sm">Hasta</label>
              <Input type="date" value={salesEndDate} onChange={(e) => setSalesEndDate(e.target.value)} />
            </div>
            <div className="md:col-span-2 flex items-end">
              <Button type="button" onClick={loadSalesHistory}>Buscar</Button>
            </div>
            <div className="flex items-end justify-end text-sm text-muted-foreground">
              {loadingSalesHistory ? "Cargando..." : salesHistoryError}
            </div>
          </div>

          {/* Ordenar por recientes y paginar */}
          {(() => {
            const sorted = Array.isArray(salesHistory)
              ? [...salesHistory].sort((a: any, b: any) => new Date(b.saleDate).getTime() - new Date(a.saleDate).getTime())
              : []
            const totalSalesPages = Math.max(1, Math.ceil(sorted.length / salesHistPageSize))
            const currentSalesPage = Math.min(salesHistPage, totalSalesPages)
            const salesStart = (currentSalesPage - 1) * salesHistPageSize
            const pageItems = sorted.slice(salesStart, salesStart + salesHistPageSize)

            return (
              <>
                <table className="w-full">
                  <thead>
                    <tr className="text-left">
                      <th>Fecha</th>
                      <th>Método</th>
                      <th>Ítems</th>
                      <th>Total</th>
                      <th>Acciones</th>
                    </tr>
                  </thead>
                  <tbody>
                    {!loadingSalesHistory && pageItems.length === 0 && !salesHistoryError && (
                      <tr>
                        <td colSpan={5}>Sin ventas en el rango</td>
                      </tr>
                    )}
                    {pageItems.map((s: any) => (
                      <tr key={s.id}>
                        <td>{s.saleDate ? new Date(s.saleDate).toLocaleString() : "-"}</td>
                        <td>{s.paymentMethod}</td>
                        <td>{Array.isArray(s.items) ? s.items.length : 0}</td>
                        <td>${formatNumberEs(Number(s.total ?? 0), 2)}</td>
                        <td>
                          <div className="flex gap-2">
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
                            <Button size="sm" variant="destructive" onClick={() => onDeleteSale(s.id)}>Eliminar</Button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>

                <div className="flex items-center justify-between mt-3">
                  <div className="text-sm text-muted-foreground">Página {currentSalesPage} de {totalSalesPages}</div>
                  <div className="flex gap-2">
                    <Button variant="outline" disabled={currentSalesPage <= 1} onClick={() => setSalesHistPage((p) => Math.max(1, p - 1))}>Anterior</Button>
                    <Button variant="outline" disabled={currentSalesPage >= totalSalesPages} onClick={() => setSalesHistPage((p) => Math.min(totalSalesPages, p + 1))}>Siguiente</Button>
                  </div>
                </div>
              </>
            )
          })()}
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
