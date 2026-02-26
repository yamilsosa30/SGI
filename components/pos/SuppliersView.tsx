"use client"

import React from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Truck } from "lucide-react"

interface SuppliersViewProps {
  suppliers: any[]
  loadingSuppliers: boolean
  suppliersError: string
  isSupAddOpen: boolean
  setIsSupAddOpen: (v: boolean) => void
  newSupplier: { name: string; phone: string; email: string; address: string }
  setNewSupplier: React.Dispatch<React.SetStateAction<{ name: string; phone: string; email: string; address: string }>>
  isSupEditOpen: boolean
  setIsSupEditOpen: (v: boolean) => void
  editSupplier: any | null
  setEditSupplier: React.Dispatch<React.SetStateAction<any | null>>
  handleCreateSupplier: (e: any) => void | Promise<void>
  openEditSupplier: (s: any) => void
  handleUpdateSupplier: (e: any) => void | Promise<void>
  handleDeleteSupplier: (id: number) => void | Promise<void>
  suppliersPage: number
  setSuppliersPage: React.Dispatch<React.SetStateAction<number>>
  suppliersPageSize: number
  readOnly?: boolean
}

export default function SuppliersView(props: SuppliersViewProps) {
  const {
    suppliers, loadingSuppliers, suppliersError,
    isSupAddOpen, setIsSupAddOpen, newSupplier, setNewSupplier,
    isSupEditOpen, setIsSupEditOpen, editSupplier, setEditSupplier,
    handleCreateSupplier, openEditSupplier, handleUpdateSupplier, handleDeleteSupplier,
    suppliersPage, setSuppliersPage, suppliersPageSize,
    readOnly = false,
  } = props

  const totalSupPages = Math.max(1, Math.ceil(suppliers.length / suppliersPageSize))
  const currentSupPage = Math.min(suppliersPage, totalSupPages)
  const supStart = (currentSupPage - 1) * suppliersPageSize
  const suppliersPageItems = suppliers.slice(supStart, supStart + suppliersPageSize)

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-balance">Proveedores</h1>
        {!readOnly && (
          <Dialog open={isSupAddOpen} onOpenChange={setIsSupAddOpen}>
            <DialogTrigger asChild>
              <Button>
                <Truck className="size-4 mr-2" />
                Agregar Proveedor
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Nuevo Proveedor</DialogTitle>
              </DialogHeader>
              <form onSubmit={handleCreateSupplier} className="space-y-4">
                <div className="grid grid-cols-2 gap-3">
                  <div className="col-span-2">
                    <Label htmlFor="s-name">Nombre</Label>
                    <Input id="s-name" value={newSupplier.name} onChange={(e) => setNewSupplier({ ...newSupplier, name: e.target.value })} required />
                  </div>
                  <div>
                    <Label htmlFor="s-phone">Teléfono</Label>
                    <Input id="s-phone" value={newSupplier.phone} onChange={(e) => setNewSupplier({ ...newSupplier, phone: e.target.value })} />
                  </div>
                  <div>
                    <Label htmlFor="s-email">Email</Label>
                    <Input id="s-email" type="email" value={newSupplier.email} onChange={(e) => setNewSupplier({ ...newSupplier, email: e.target.value })} />
                  </div>
                  <div className="col-span-2">
                    <Label htmlFor="s-address">Dirección</Label>
                    <Input id="s-address" value={newSupplier.address} onChange={(e) => setNewSupplier({ ...newSupplier, address: e.target.value })} />
                  </div>
                </div>
                <div className="flex justify-end gap-2">
                  <Button type="button" variant="outline" onClick={() => setIsSupAddOpen(false)}>Cancelar</Button>
                  <Button type="submit">Guardar</Button>
                </div>
              </form>
            </DialogContent>
          </Dialog>
        )}
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Listado de Proveedores</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Nombre</TableHead>
                <TableHead>Teléfono</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Dirección</TableHead>
                {!readOnly && <TableHead>Acciones</TableHead>}
              </TableRow>
            </TableHeader>
            <TableBody>
              {loadingSuppliers && (
                <TableRow>
                  <TableCell colSpan={5}>Cargando...</TableCell>
                </TableRow>
              )}
              {suppliersError && !loadingSuppliers && (
                <TableRow>
                  <TableCell colSpan={5} className="text-destructive">{suppliersError}</TableCell>
                </TableRow>
              )}
              {!loadingSuppliers && !suppliersError && suppliers.length === 0 && (
                <TableRow>
                  <TableCell colSpan={5}>Sin proveedores</TableCell>
                </TableRow>
              )}
              {!loadingSuppliers && !suppliersError && suppliersPageItems.map((s) => (
                <TableRow key={s.id}>
                  <TableCell>{s.name}</TableCell>
                  <TableCell>{s.phone ?? "-"}</TableCell>
                  <TableCell>{s.email ?? "-"}</TableCell>
                  <TableCell>{s.address ?? "-"}</TableCell>
                  {!readOnly && (
                    <TableCell>
                      <div className="flex gap-2">
                        <Button size="sm" variant="outline" onClick={() => openEditSupplier(s)}>Editar</Button>
                        <Button size="sm" variant="destructive" onClick={() => handleDeleteSupplier(s.id)}>Eliminar</Button>
                      </div>
                    </TableCell>
                  )}
                </TableRow>
              ))}
            </TableBody>
          </Table>
          <div className="flex items-center justify-between mt-3">
            <div className="text-sm text-muted-foreground">Página {currentSupPage} de {totalSupPages}</div>
            <div className="flex gap-2">
              <Button variant="outline" disabled={currentSupPage <= 1} onClick={() => setSuppliersPage((p) => Math.max(1, p - 1))}>Anterior</Button>
              <Button variant="outline" disabled={currentSupPage >= totalSupPages} onClick={() => setSuppliersPage((p) => Math.min(totalSupPages, p + 1))}>Siguiente</Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {!readOnly && (
      <Dialog open={isSupEditOpen} onOpenChange={setIsSupEditOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Editar Proveedor</DialogTitle>
          </DialogHeader>
          {editSupplier && (
            <form onSubmit={handleUpdateSupplier} className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div className="col-span-2">
                  <Label htmlFor="es-name">Nombre</Label>
                  <Input id="es-name" value={editSupplier.name} onChange={(e) => setEditSupplier({ ...editSupplier, name: e.target.value })} required />
                </div>
                <div>
                  <Label htmlFor="es-phone">Teléfono</Label>
                  <Input id="es-phone" value={editSupplier.phone} onChange={(e) => setEditSupplier({ ...editSupplier, phone: e.target.value })} />
                </div>
                <div>
                  <Label htmlFor="es-email">Email</Label>
                  <Input id="es-email" type="email" value={editSupplier.email} onChange={(e) => setEditSupplier({ ...editSupplier, email: e.target.value })} />
                </div>
                <div className="col-span-2">
                  <Label htmlFor="es-address">Dirección</Label>
                  <Input id="es-address" value={editSupplier.address} onChange={(e) => setEditSupplier({ ...editSupplier, address: e.target.value })} />
                </div>
              </div>
              <div className="flex justify-end gap-2">
                <Button type="button" variant="outline" onClick={() => setIsSupEditOpen(false)}>Cancelar</Button>
                <Button type="submit">Actualizar</Button>
              </div>
            </form>
          )}
        </DialogContent>
      </Dialog>
      )}
    </div>
  )
}
