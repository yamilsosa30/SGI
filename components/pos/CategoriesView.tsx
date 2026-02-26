"use client"

import React from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Package } from "lucide-react"

interface CategoriesViewProps {
  categories: any[]
  loadingCats: boolean
  catsError: string
  isCatAddOpen: boolean
  setIsCatAddOpen: (v: boolean) => void
  newCategory: { name: string; description: string }
  setNewCategory: React.Dispatch<React.SetStateAction<{ name: string; description: string }>>
  isCatEditOpen: boolean
  setIsCatEditOpen: (v: boolean) => void
  editCategory: any | null
  setEditCategory: React.Dispatch<React.SetStateAction<any | null>>
  categoriesPage: number
  setCategoriesPage: React.Dispatch<React.SetStateAction<number>>
  categoriesPageSize: number
  handleCreateCategory: (e: any) => void | Promise<void>
  openEditCategory: (c: any) => void
  handleUpdateCategory: (e: any) => void | Promise<void>
  handleDeleteCategory: (id: number) => void | Promise<void>
  readOnly?: boolean
}

export default function CategoriesView(props: CategoriesViewProps) {
  const {
    categories, loadingCats, catsError,
    isCatAddOpen, setIsCatAddOpen, newCategory, setNewCategory,
    isCatEditOpen, setIsCatEditOpen, editCategory, setEditCategory,
    categoriesPage, setCategoriesPage, categoriesPageSize,
    handleCreateCategory, openEditCategory, handleUpdateCategory, handleDeleteCategory,
    readOnly = false,
  } = props

  const totalCatPages = Math.max(1, Math.ceil(categories.length / categoriesPageSize))
  const currentCatPage = Math.min(categoriesPage, totalCatPages)
  const catStart = (currentCatPage - 1) * categoriesPageSize
  const categoriesPageItems = categories.slice(catStart, catStart + categoriesPageSize)

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-balance">Categorías</h1>
        {!readOnly && (
          <Dialog open={isCatAddOpen} onOpenChange={setIsCatAddOpen}>
            <DialogTrigger asChild>
              <Button>
                <Package className="size-4 mr-2" />
                Agregar Categoría
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Nueva Categoría</DialogTitle>
              </DialogHeader>
              <form onSubmit={handleCreateCategory} className="space-y-4">
                <div className="grid grid-cols-2 gap-3">
                  <div className="col-span-2">
                    <Label htmlFor="c-name">Nombre</Label>
                    <Input id="c-name" value={newCategory.name} onChange={(e) => setNewCategory({ ...newCategory, name: e.target.value })} required />
                  </div>
                  <div className="col-span-2">
                    <Label htmlFor="c-desc">Descripción</Label>
                    <Input id="c-desc" value={newCategory.description} onChange={(e) => setNewCategory({ ...newCategory, description: e.target.value })} />
                  </div>
                </div>
                <div className="flex justify-end gap-2">
                  <Button type="button" variant="outline" onClick={() => setIsCatAddOpen(false)}>Cancelar</Button>
                  <Button type="submit">Guardar</Button>
                </div>
              </form>
            </DialogContent>
          </Dialog>
        )}
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Listado de Categorías</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Nombre</TableHead>
                <TableHead>Descripción</TableHead>
                {!readOnly && <TableHead>Acciones</TableHead>}
              </TableRow>
            </TableHeader>
            <TableBody>
              {loadingCats && (
                <TableRow>
                  <TableCell colSpan={3}>Cargando...</TableCell>
                </TableRow>
              )}
              {catsError && !loadingCats && (
                <TableRow>
                  <TableCell colSpan={3} className="text-destructive">{catsError}</TableCell>
                </TableRow>
              )}
              {!loadingCats && !catsError && categories.length === 0 && (
                <TableRow>
                  <TableCell colSpan={3}>Sin categorías</TableCell>
                </TableRow>
              )}
              {!loadingCats && !catsError && categoriesPageItems.map((c) => (
                <TableRow key={c.id}>
                  <TableCell>{c.name}</TableCell>
                  <TableCell>{c.description ?? "-"}</TableCell>
                  {!readOnly && (
                    <TableCell>
                      <div className="flex gap-2">
                        <Button size="sm" variant="outline" onClick={() => openEditCategory(c)}>Editar</Button>
                        <Button size="sm" variant="destructive" onClick={() => handleDeleteCategory(c.id)}>Eliminar</Button>
                      </div>
                    </TableCell>
                  )}
                </TableRow>
              ))}
            </TableBody>
          </Table>
          <div className="flex items-center justify-between mt-3">
            <div className="text-sm text-muted-foreground">Página {currentCatPage} de {totalCatPages}</div>
            <div className="flex gap-2">
              <Button variant="outline" disabled={currentCatPage <= 1} onClick={() => setCategoriesPage((p) => Math.max(1, p - 1))}>Anterior</Button>
              <Button variant="outline" disabled={currentCatPage >= totalCatPages} onClick={() => setCategoriesPage((p) => Math.min(totalCatPages, p + 1))}>Siguiente</Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {!readOnly && (
      <Dialog open={isCatEditOpen} onOpenChange={setIsCatEditOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Editar Categoría</DialogTitle>
          </DialogHeader>
          {editCategory && (
            <form onSubmit={handleUpdateCategory} className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div className="col-span-2">
                  <Label htmlFor="ec-name">Nombre</Label>
                  <Input id="ec-name" value={editCategory.name} onChange={(e) => setEditCategory({ ...editCategory, name: e.target.value })} required />
                </div>
                <div className="col-span-2">
                  <Label htmlFor="ec-desc">Descripción</Label>
                  <Input id="ec-desc" value={editCategory.description ?? ""} onChange={(e) => setEditCategory({ ...editCategory, description: e.target.value })} />
                </div>
              </div>
              <div className="flex justify-end gap-2">
                <Button type="button" variant="outline" onClick={() => setIsCatEditOpen(false)}>Cancelar</Button>
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
