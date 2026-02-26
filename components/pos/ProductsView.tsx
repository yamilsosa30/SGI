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
import { Package, Printer } from "lucide-react"

interface ProductsViewProps {
  products: any[]
  categories: any[]
  loadingProducts: boolean
  loadError: string
  loadingCats: boolean
  productsSearch: string
  setProductsSearch: (v: string) => void
  productsCategoryFilter: string
  setProductsCategoryFilter: (v: string) => void
  productsPage: number
  productsPageSize: number
  setProductsPage: React.Dispatch<React.SetStateAction<number>>
  isAddOpen: boolean
  setIsAddOpen: (v: boolean) => void
  newProduct: { name: string; barcode: string; price: string; stock: string; minStock: string; expiryDate: string; categoryId: string }
  setNewProduct: React.Dispatch<React.SetStateAction<{ name: string; barcode: string; price: string; stock: string; minStock: string; expiryDate: string; categoryId: string }>>
  handleAddProduct: (e: any) => void | Promise<void>
  isEditOpen: boolean
  setIsEditOpen: (v: boolean) => void
  editProduct: any | null
  setEditProduct: React.Dispatch<React.SetStateAction<any | null>>
  editCategoryId: string
  setEditCategoryId: (v: string) => void
  handleUpdateProduct: (e: any) => void | Promise<void>
  openEdit: (p: any) => void
  openLabel: (p: any) => void
  handleDeleteProduct: (id: number) => void | Promise<void>
  isLabelOpen: boolean
  setIsLabelOpen: (v: boolean) => void
  labelProduct: any | null
  barcodeSvgRef: React.RefObject<SVGSVGElement>
  printLabel: () => void | Promise<void>
  readOnly?: boolean
}

export default function ProductsView(props: ProductsViewProps) {
  const {
    products,
    categories,
    loadingProducts,
    loadError,
    loadingCats,
    productsSearch,
    setProductsSearch,
    productsCategoryFilter,
    setProductsCategoryFilter,
    productsPage,
    productsPageSize,
    setProductsPage,
    isAddOpen,
    setIsAddOpen,
    newProduct,
    setNewProduct,
    handleAddProduct,
    isEditOpen,
    setIsEditOpen,
    editProduct,
    setEditProduct,
    editCategoryId,
    setEditCategoryId,
    handleUpdateProduct,
    openEdit,
    openLabel,
    handleDeleteProduct,
    isLabelOpen,
    setIsLabelOpen,
    labelProduct,
    barcodeSvgRef,
    printLabel,
    readOnly = false,
  } = props

  const lowered = productsSearch.trim().toLowerCase()
  const filtered = products.filter((p: any) => {
    const mm = !lowered || String(p.name ?? "").toLowerCase().includes(lowered)
    const mc = !productsCategoryFilter || String(p.category?.id ?? "") === productsCategoryFilter
    return mm && mc
  })
  const totalProductsPages = Math.max(1, Math.ceil(filtered.length / productsPageSize))
  const currentProductsPage = Math.min(productsPage, totalProductsPages)
  const productsStart = (currentProductsPage - 1) * productsPageSize
  const productsPageItems = filtered.slice(productsStart, productsStart + productsPageSize)

  // Determinar si la categoría seleccionada corresponde a "Por peso"
  const addCat = categories.find((c) => String(c.id) === (newProduct.categoryId || ""))
  const isAddWeight = (addCat?.name || "").toLowerCase() === "por peso"
  const editCat = categories.find((c) => String(c.id) === (editCategoryId || ""))
  const isEditWeight = (editCat?.name || "").toLowerCase() === "por peso"

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-balance">Productos</h1>
        {!readOnly && (
          <Dialog open={isAddOpen} onOpenChange={setIsAddOpen}>
            <DialogTrigger asChild>
              <Button>
                <Package className="size-4 mr-2" />
                Agregar Producto
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Agregar Producto</DialogTitle>
              </DialogHeader>
              {/* reutiliza el mismo formulario de alta */}
              <form onSubmit={handleAddProduct} className="space-y-4">
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <Label htmlFor="p-name">Nombre</Label>
                    <Input id="p-name" value={newProduct.name} onChange={(e) => setNewProduct({ ...newProduct, name: e.target.value })} required />
                  </div>
                  <div>
                    <Label htmlFor="p-barcode">Código de barras</Label>
                    <Input
                      id="p-barcode"
                      value={newProduct.barcode}
                      onChange={(e) => setNewProduct({ ...newProduct, barcode: e.target.value })}
                      placeholder="Vacío para generar automáticamente"
                    />
                  </div>
                  <div className="col-span-2">
                    <Label>Categoría</Label>
                    <div className="mt-1">
                      <Select value={newProduct.categoryId} onValueChange={(v) => setNewProduct({ ...newProduct, categoryId: v })}>
                        <SelectTrigger className="w-full">
                          <SelectValue placeholder={loadingCats ? "Cargando..." : "Seleccionar categoría"} />
                        </SelectTrigger>
                        <SelectContent>
                          {categories.map((c) => (
                            <SelectItem key={c.id} value={String(c.id)}>{c.name}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  <div>
                    <Label htmlFor="p-price">Precio</Label>
                    <Input id="p-price" type="text" value={newProduct.price} onChange={(e) => setNewProduct({ ...newProduct, price: e.target.value })} required placeholder="0,00" />
                  </div>
                  <div>
                    <Label htmlFor="p-stock">Stock</Label>
                    <Input id="p-stock" type="text" value={newProduct.stock} onChange={(e) => setNewProduct({ ...newProduct, stock: e.target.value })} required placeholder={isAddWeight ? "0,00" : "0"} />
                  </div>
                  <div>
                    <Label htmlFor="p-minStock">Stock mínimo</Label>
                    <Input id="p-minStock" type="text" value={newProduct.minStock} onChange={(e) => setNewProduct({ ...newProduct, minStock: e.target.value })} required placeholder={isAddWeight ? "0,00" : "0"} />
                  </div>
                  <div>
                    <Label htmlFor="p-expiry">Vencimiento (opcional)</Label>
                    <Input id="p-expiry" type="date" value={newProduct.expiryDate} onChange={(e) => setNewProduct({ ...newProduct, expiryDate: e.target.value })} />
                  </div>
                </div>
                <div className="flex justify-end gap-2">
                  <Button type="button" variant="outline" onClick={() => setIsAddOpen(false)}>Cancelar</Button>
                  <Button type="submit">Guardar</Button>
                </div>
              </form>
            </DialogContent>
          </Dialog>
        )}
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Filtro de Productos</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
            <div className="md:col-span-2">
              <Label>Búsqueda</Label>
              <Input placeholder="Nombre" value={productsSearch} onChange={(e) => setProductsSearch(e.target.value)} />
            </div>
            <div>
              <Label>Categoría</Label>
              <Select value={productsCategoryFilter || "ALL"} onValueChange={(v) => setProductsCategoryFilter(v === "ALL" ? "" : v)}>
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
                {!readOnly && <TableHead>Acciones</TableHead>}
              </TableRow>
            </TableHeader>
            <TableBody>
              {loadingProducts && (
                <TableRow>
                  <TableCell colSpan={9}>Cargando...</TableCell>
                </TableRow>
              )}
              {loadError && !loadingProducts && (
                <TableRow>
                  <TableCell colSpan={9} className="text-destructive">{loadError}</TableCell>
                </TableRow>
              )}
              {!loadingProducts && !loadError && products.length === 0 && (
                <TableRow>
                  <TableCell colSpan={9}>Sin productos</TableCell>
                </TableRow>
              )}
              {!loadingProducts && !loadError && productsPageItems.map((p) => {
                const isLow = Number(p.stock ?? 0) <= Number(p.minStock ?? 0)
                return (
                  <TableRow key={p.id}>
                    <TableCell>{p.name}</TableCell>
                    <TableCell>{p.barcode}</TableCell>
                    <TableCell>{p.category?.name ?? "-"}</TableCell>
                    <TableCell>{`$${formatNumberEs(Number(p.price ?? 0), 2)}`}</TableCell>
                    <TableCell>{p.soldByWeight ? formatNumberEs(Number(p.stock ?? 0), 2) : formatNumberEs(Number(p.stock ?? 0), 0)}</TableCell>
                    <TableCell>{p.soldByWeight ? formatNumberEs(Number(p.minStock ?? 0), 2) : formatNumberEs(Number(p.minStock ?? 0), 0)}</TableCell>
                    <TableCell>{p.expiryDate ?? "-"}</TableCell>
                    <TableCell>
                      {isLow ? (
                        <Badge variant="destructive">Stock Bajo</Badge>
                      ) : (
                        <Badge variant="secondary">OK</Badge>
                      )}
                    </TableCell>
                    {!readOnly && (
                      <TableCell>
                        <div className="flex gap-2">
                          <Button size="sm" variant="outline" onClick={() => openEdit(p)}>Editar</Button>
                          <Button size="sm" variant="outline" onClick={() => openLabel(p)}>Etiqueta</Button>
                          <Button size="sm" variant="destructive" onClick={() => handleDeleteProduct(p.id)}>Eliminar</Button>
                        </div>
                      </TableCell>
                    )}
                  </TableRow>
                )
              })}
            </TableBody>
          </Table>
          <div className="flex items-center justify-between mt-3">
            <div className="text-sm text-muted-foreground">Página {currentProductsPage} de {totalProductsPages} ({filtered.length} resultados)</div>
            <div className="flex gap-2">
              <Button variant="outline" disabled={currentProductsPage <= 1} onClick={() => setProductsPage((p) => Math.max(1, p - 1))}>Anterior</Button>
              <Button variant="outline" disabled={currentProductsPage >= totalProductsPages} onClick={() => setProductsPage((p) => Math.min(totalProductsPages, p + 1))}>Siguiente</Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Diálogo de edición */}
      {!readOnly && (
      <Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Editar Producto</DialogTitle>
          </DialogHeader>
          {editProduct && (
            <form onSubmit={handleUpdateProduct} className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <Label htmlFor="ep-name">Nombre</Label>
                  <Input id="ep-name" value={editProduct.name} onChange={(e) => setEditProduct({ ...editProduct, name: e.target.value })} required />
                </div>
                <div>
                  <Label htmlFor="ep-barcode">Código de barras</Label>
                  <Input id="ep-barcode" value={editProduct.barcode} onChange={(e) => setEditProduct({ ...editProduct, barcode: e.target.value })} required />
                </div>
                <div className="col-span-2">
                  <Label>Categoría</Label>
                  <div className="mt-1">
                    <Select value={editCategoryId} onValueChange={setEditCategoryId}>
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder={loadingCats ? "Cargando..." : "Seleccionar categoría"} />
                      </SelectTrigger>
                      <SelectContent>
                        {categories.map((c) => (
                          <SelectItem key={c.id} value={String(c.id)}>{c.name}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div>
                  <Label htmlFor="ep-price">Precio</Label>
                  <Input id="ep-price" type="text" value={editProduct.price} onChange={(e) => setEditProduct({ ...editProduct, price: e.target.value })} required placeholder="0,00" />
                </div>
                <div>
                  <Label htmlFor="ep-stock">Stock</Label>
                  <Input id="ep-stock" type="text" value={editProduct.stock} onChange={(e) => setEditProduct({ ...editProduct, stock: e.target.value })} required placeholder={isEditWeight ? "0,00" : "0"} />
                </div>
                <div>
                  <Label htmlFor="ep-minStock">Stock mínimo</Label>
                  <Input id="ep-minStock" type="text" value={editProduct.minStock} onChange={(e) => setEditProduct({ ...editProduct, minStock: e.target.value })} required placeholder={isEditWeight ? "0,00" : "0"} />
                </div>
                <div>
                  <Label htmlFor="ep-expiry">Vencimiento (opcional)</Label>
                  <Input id="ep-expiry" type="date" value={editProduct.expiryDate} onChange={(e) => setEditProduct({ ...editProduct, expiryDate: e.target.value })} />
                </div>
              </div>
              <div className="flex justify-end gap-2">
                <Button type="button" variant="outline" onClick={() => setIsEditOpen(false)}>Cancelar</Button>
                <Button type="submit">Actualizar</Button>
              </div>
            </form>
          )}
        </DialogContent>
      </Dialog>
      )}

      {/* Diálogo de etiqueta */}
      <Dialog open={isLabelOpen} onOpenChange={setIsLabelOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Etiqueta de Producto</DialogTitle>
          </DialogHeader>
          {labelProduct && (
            <div className="space-y-4">
              <div className="text-center">
                <div className="font-bold">{labelProduct.name}</div>
                <div className="text-sm text-muted-foreground">#{labelProduct.barcode}</div>
              </div>
              <div className="flex justify-center">
                <svg ref={barcodeSvgRef}></svg>
              </div>
              <div className="flex justify-end gap-2">
                <Button type="button" variant="outline" onClick={() => setIsLabelOpen(false)}>Cerrar</Button>
                <Button type="button" onClick={printLabel}>
                  <Printer className="size-4 mr-2" />
                  Imprimir
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}
