"use client"
import React from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Users } from "lucide-react"

// Helper fetch con Authorization y base de API dinámica según hostname actual
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

interface CustomersViewProps {
  customers: any[]
  loadingCustomers: boolean
  customersError: string
  isCustAddOpen: boolean
  setIsCustAddOpen: (v: boolean) => void
  newCustomer: { name: string; phone: string; email: string; address: string; creditLimit: any }
  setNewCustomer: React.Dispatch<React.SetStateAction<{ name: string; phone: string; email: string; address: string; creditLimit: any }>>
  isCustEditOpen: boolean
  setIsCustEditOpen: (v: boolean) => void
  editCustomer: any | null
  setEditCustomer: React.Dispatch<React.SetStateAction<any | null>>
  customersPage: number
  setCustomersPage: React.Dispatch<React.SetStateAction<number>>
  customersPageSize: number
  handleCreateCustomer: (e: any) => void | Promise<void>
  openEditCustomer: (c: any) => void
  handleUpdateCustomer: (e: any) => void | Promise<void>
  handleDeleteCustomer: (id: number) => void | Promise<void>
  reloadCustomers: () => void | Promise<void>
  allowDelete?: boolean
}

export default function CustomersView(props: CustomersViewProps) {
  const {
    customers, loadingCustomers, customersError,
    isCustAddOpen, setIsCustAddOpen, newCustomer, setNewCustomer,
    isCustEditOpen, setIsCustEditOpen, editCustomer, setEditCustomer,
    customersPage, setCustomersPage, customersPageSize,
    handleCreateCustomer, openEditCustomer, handleUpdateCustomer, handleDeleteCustomer,
    reloadCustomers,
    allowDelete = true,
  } = props

  const [isPayOpen, setIsPayOpen] = React.useState(false)
  const [payCustomer, setPayCustomer] = React.useState<any | null>(null)
  const [payAmount, setPayAmount] = React.useState<string>("")
  const [isPayHistOpen, setIsPayHistOpen] = React.useState(false)
  const [payHistCustomer, setPayHistCustomer] = React.useState<any | null>(null)
  const [payHist, setPayHist] = React.useState<Array<{ id:number; amount:number; note:string; paidAt:string }>>([])
  const [loadingPayHist, setLoadingPayHist] = React.useState(false)

  const openPayDialog = (c: any) => {
    setPayCustomer(c)
    setPayAmount("")
    setIsPayOpen(true)
  }

  const openPayHistory = async (c: any) => {
    setPayHistCustomer(c)
    setIsPayHistOpen(true)
    setLoadingPayHist(true)
    try {
      const res = await authFetch(`/api/customers/${c.id}/payments`)
      if (!res.ok) throw new Error(`HTTP ${res.status}`)
      const data = await res.json()
      setPayHist(Array.isArray(data) ? data : [])
    } catch (err) {
      console.error(err)
      setPayHist([])
    } finally {
      setLoadingPayHist(false)
    }
  }

  const submitPayment = async (e: any) => {
    e.preventDefault()
    if (!payCustomer) return
    const amount = parseFloat(payAmount)
    const debt = Number(payCustomer.currentDebt || 0)
    if (!Number.isFinite(amount) || amount <= 0) {
      alert("Monto inválido")
      return
    }
    if (amount > debt) {
      alert("El monto excede la deuda actual")
      return
    }
    try {
      const res = await authFetch(`/api/customers/${payCustomer.id}/payments`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ amount, note: "" }),
      })
      if (!res.ok) {
        const t = await res.text()
        throw new Error(`HTTP ${res.status} - ${t}`)
      }
      setIsPayOpen(false)
      setPayCustomer(null)
      setPayAmount("")
      await reloadCustomers()
    } catch (err) {
      console.error(err)
      alert("❌ Error al registrar cobro")
    }
  }

  const totalCustPages = Math.max(1, Math.ceil(customers.length / customersPageSize))
  const currentCustPage = Math.min(customersPage, totalCustPages)
  const custStart = (currentCustPage - 1) * customersPageSize
  const customersPageItems = customers.slice(custStart, custStart + customersPageSize)

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-balance">Clientes</h1>
        <Dialog open={isCustAddOpen} onOpenChange={setIsCustAddOpen}>
          <DialogTrigger asChild>
            <Button>
              <Users className="size-4 mr-2" />
              Agregar Cliente
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Nuevo Cliente</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleCreateCustomer} className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div className="col-span-2">
                  <Label htmlFor="cu-name">Nombre</Label>
                  <Input id="cu-name" value={newCustomer.name} onChange={(e) => setNewCustomer({ ...newCustomer, name: e.target.value })} required />
                </div>
                <div>
                  <Label htmlFor="cu-phone">Teléfono</Label>
                  <Input id="cu-phone" value={newCustomer.phone} onChange={(e) => setNewCustomer({ ...newCustomer, phone: e.target.value })} />
                </div>
                <div>
                  <Label htmlFor="cu-email">Email</Label>
                  <Input id="cu-email" type="email" value={newCustomer.email} onChange={(e) => setNewCustomer({ ...newCustomer, email: e.target.value })} />
                </div>
                <div className="col-span-2">
                  <Label htmlFor="cu-address">Dirección</Label>
                  <Input id="cu-address" value={newCustomer.address} onChange={(e) => setNewCustomer({ ...newCustomer, address: e.target.value })} />
                </div>
                <div>
                  <Label htmlFor="cu-credit">Límite de crédito</Label>
                  <Input id="cu-credit" type="number" step="0.01" value={newCustomer.creditLimit} onChange={(e) => setNewCustomer({ ...newCustomer, creditLimit: e.target.value })} />
                </div>
              </div>
              <div className="flex justify-end gap-2">
                <Button type="button" variant="outline" onClick={() => setIsCustAddOpen(false)}>Cancelar</Button>
                <Button type="submit">Guardar</Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Listado de Clientes</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Nombre</TableHead>
                <TableHead>Teléfono</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Dirección</TableHead>
                <TableHead>Límite</TableHead>
                <TableHead>Deuda</TableHead>
                <TableHead>Acciones</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loadingCustomers && (
                <TableRow>
                  <TableCell colSpan={7}>Cargando...</TableCell>
                </TableRow>
              )}
              {customersError && !loadingCustomers && (
                <TableRow>
                  <TableCell colSpan={7} className="text-destructive">{customersError}</TableCell>
                </TableRow>
              )}
              {!loadingCustomers && !customersError && customers.length === 0 && (
                <TableRow>
                  <TableCell colSpan={7}>Sin clientes</TableCell>
                </TableRow>
              )}
              {!loadingCustomers && !customersError && customersPageItems.map((c) => (
                <TableRow key={c.id}>
                  <TableCell>{c.name}</TableCell>
                  <TableCell>{c.phone ?? "-"}</TableCell>
                  <TableCell>{c.email ?? "-"}</TableCell>
                  <TableCell>{c.address ?? "-"}</TableCell>
                  <TableCell>{c.creditLimit ?? "-"}</TableCell>
                  <TableCell>{c.currentDebt ?? 0}</TableCell>
                  <TableCell>
                    <div className="flex gap-2">
                      <Button size="sm" variant="outline" onClick={() => openEditCustomer(c)}>Editar</Button>
                      {allowDelete && (
                        <Button size="sm" variant="destructive" onClick={() => handleDeleteCustomer(c.id)}>Eliminar</Button>
                      )}
                      <Button size="sm" onClick={() => openPayDialog(c)} disabled={!c.currentDebt || Number(c.currentDebt) <= 0}>Cobrar</Button>
                      <Button size="sm" variant="outline" onClick={() => openPayHistory(c)}>Historial</Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          <div className="flex items-center justify-between mt-3">
            <div className="text-sm text-muted-foreground">Página {currentCustPage} de {totalCustPages}</div>
            <div className="flex gap-2">
              <Button variant="outline" disabled={currentCustPage <= 1} onClick={() => setCustomersPage((p) => Math.max(1, p - 1))}>Anterior</Button>
              <Button variant="outline" disabled={currentCustPage >= totalCustPages} onClick={() => setCustomersPage((p) => Math.min(totalCustPages, p + 1))}>Siguiente</Button>
            </div>
          </div>
        </CardContent>
      </Card>

      <Dialog open={isCustEditOpen} onOpenChange={setIsCustEditOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Editar Cliente</DialogTitle>
          </DialogHeader>
          {editCustomer && (
            <form onSubmit={handleUpdateCustomer} className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div className="col-span-2">
                  <Label htmlFor="ecu-name">Nombre</Label>
                  <Input id="ecu-name" value={editCustomer.name} onChange={(e) => setEditCustomer({ ...editCustomer, name: e.target.value })} required />
                </div>
                <div>
                  <Label htmlFor="ecu-phone">Teléfono</Label>
                  <Input id="ecu-phone" value={editCustomer.phone} onChange={(e) => setEditCustomer({ ...editCustomer, phone: e.target.value })} />
                </div>
                <div>
                  <Label htmlFor="ecu-email">Email</Label>
                  <Input id="ecu-email" type="email" value={editCustomer.email} onChange={(e) => setEditCustomer({ ...editCustomer, email: e.target.value })} />
                </div>
                <div className="col-span-2">
                  <Label htmlFor="ecu-address">Dirección</Label>
                  <Input id="ecu-address" value={editCustomer.address} onChange={(e) => setEditCustomer({ ...editCustomer, address: e.target.value })} />
                </div>
                <div>
                  <Label htmlFor="ecu-credit">Límite de crédito</Label>
                  <Input id="ecu-credit" type="number" step="0.01" value={editCustomer.creditLimit ?? ""} onChange={(e) => setEditCustomer({ ...editCustomer, creditLimit: e.target.value })} />
                </div>
              </div>
              <div className="flex justify-end gap-2">
                <Button type="button" variant="outline" onClick={() => setIsCustEditOpen(false)}>Cancelar</Button>
                <Button type="submit">Actualizar</Button>
              </div>
            </form>
          )}
        </DialogContent>
      </Dialog>

      {/* Diálogo de Cobro (Pago de Deuda) */}
      <Dialog open={isPayOpen} onOpenChange={setIsPayOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Registrar cobro</DialogTitle>
          </DialogHeader>
          {payCustomer && (
            <form onSubmit={submitPayment} className="space-y-4">
              <div className="space-y-2">
                <div className="text-sm text-muted-foreground">Cliente</div>
                <div className="font-medium">{payCustomer.name}</div>
                <div className="text-sm">Deuda actual: ${Number(payCustomer.currentDebt || 0).toFixed(2)}</div>
              </div>
              <div>
                <Label htmlFor="pay-amount">Monto a cobrar</Label>
                <Input id="pay-amount" type="number" step="0.01" value={payAmount} onChange={(e) => setPayAmount(e.target.value)} required />
              </div>
              <div className="flex justify-end gap-2">
                <Button type="button" variant="outline" onClick={() => setIsPayOpen(false)}>Cancelar</Button>
                <Button type="submit">Confirmar</Button>
              </div>
            </form>
          )}
        </DialogContent>
      </Dialog>

      {/* Diálogo Historial de Cobros */}
      <Dialog open={isPayHistOpen} onOpenChange={setIsPayHistOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Historial de cobros</DialogTitle>
          </DialogHeader>
          {payHistCustomer && (
            <div className="space-y-3">
              <div className="text-sm text-muted-foreground">Cliente</div>
              <div className="font-medium">{payHistCustomer.name}</div>
              {loadingPayHist ? (
                <div className="text-sm">Cargando...</div>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Fecha</TableHead>
                      <TableHead>Monto</TableHead>
                      <TableHead>Nota</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {payHist.length === 0 && (
                      <TableRow>
                        <TableCell colSpan={3}>Sin cobros registrados</TableCell>
                      </TableRow>
                    )}
                    {payHist.map((p) => (
                      <TableRow key={p.id}>
                        <TableCell>{new Date(p.paidAt).toLocaleString()}</TableCell>
                        <TableCell>${Number(p.amount).toFixed(2)}</TableCell>
                        <TableCell>{p.note ?? "-"}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}
