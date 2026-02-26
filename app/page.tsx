"use client"

import { useState, useEffect, useMemo } from "react"
import { formatNumberEs, parseEsNumber } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
  AlertTriangle,
  BarChart3,
  Clock,
  HelpCircle,
  LogOut,
  Package,
  ShoppingCart,
  Truck,
  TrendingUp,
  Users,
} from "lucide-react"

// Componentes de vistas
import ProductsView from "@/components/pos/ProductsView"
import DashboardView from "@/components/pos/DashboardView"
import SalesView from "@/components/pos/SalesView"
import StockView from "@/components/pos/StockView"
import PurchasesView from "@/components/pos/PurchasesView"
import CategoriesView from "@/components/pos/CategoriesView"
import CustomersView from "@/components/pos/CustomersView"
import SuppliersView from "@/components/pos/SuppliersView"
import ReportsView from "@/components/pos/ReportsView"
import HelpView from "@/components/pos/HelpView"

// Custom Hooks
import { useAuth } from "@/hooks/useAuth"
import { useProducts } from "@/hooks/useProducts"
import { useCategories } from "@/hooks/useCategories"
import { useCustomers } from "@/hooks/useCustomers"
import { useSuppliers } from "@/hooks/useSuppliers"
import { usePurchases } from "@/hooks/usePurchases"
import { useSales } from "@/hooks/useSales"
import { useDashboard } from "@/hooks/useDashboard"
import { useCart } from "@/hooks/useCart"
import { useBarcodeScanner } from "@/hooks/useBarcodeScanner"
import { useTheme } from "@/hooks/useTheme"
import { useProductLabel } from "@/hooks/useProductLabel"
import { useDateTime } from "@/hooks/useDateTime"

function KioskPOSSystem() {
  // ========== Estado General ==========
  const [activeModule, setActiveModule] = useState("dashboard")

  // ========== Custom Hooks ==========
  const { authRole, authUsername, handleLogout } = useAuth()
  const { products, loadingProducts, loadError, loadProducts, createProduct, updateProduct, deleteProduct } = useProducts()
  const { categories, loadingCats, catsError, loadCategories, createCategory, updateCategory, deleteCategory } = useCategories()
  const { customers, loadingCustomers, customersError, loadCustomers, createCustomer, updateCustomer, deleteCustomer } = useCustomers()
  const { suppliers, loadingSuppliers, suppliersError, loadSuppliers, createSupplier, updateSupplier, deleteSupplier } = useSuppliers()
  const { purchases, loadPurchases, createPurchase, completePurchase, cancelPurchase } = usePurchases()
  const { salesHistory, loadingSalesHistory, salesHistoryError, loadSalesHistory, deleteSale } = useSales()
  const { dashboardStats, recentSales, alerts, loadDashboard, resolveAlert } = useDashboard()
  const { isDarkTheme, toggleTheme } = useTheme()
  const { isLabelOpen, setIsLabelOpen, labelProduct, barcodeSvgRef, openLabel, printLabel } = useProductLabel()
  const { nowString, salesStartDate, setSalesStartDate, salesEndDate, setSalesEndDate } = useDateTime()

  // Carrito y escaneo
  const {
    cartItems,
    setCartItems,
    processingPayment,
    selectedCustomerId,
    setSelectedCustomerId,
    addToCart,
    removeFromCart,
    clearCart,
    processPayment,
  } = useCart()

  const {
    barcodeInput,
    setBarcodeInput,
    barcodeInputRef,
    handleBarcodeSubmit,
    isCamOpen,
    setIsCamOpen,
    videoRef,
  } = useBarcodeScanner(addToCart)

  // ========== Estados de Formularios ==========
  // Productos
  const [isAddOpen, setIsAddOpen] = useState(false)
  const [newProduct, setNewProduct] = useState({
    name: "",
    barcode: "",
    price: "",
    stock: "",
    minStock: "",
    expiryDate: "",
    categoryId: "",
  })
  const [isEditOpen, setIsEditOpen] = useState(false)
  const [editProduct, setEditProduct] = useState<any | null>(null)
  const [editCategoryId, setEditCategoryId] = useState<string>("")

  // Categorías
  const [isCatAddOpen, setIsCatAddOpen] = useState(false)
  const [newCategory, setNewCategory] = useState({ name: "", description: "" })
  const [isCatEditOpen, setIsCatEditOpen] = useState(false)
  const [editCategory, setEditCategory] = useState<any | null>(null)

  // Proveedores
  const [isSupAddOpen, setIsSupAddOpen] = useState(false)
  const [newSupplier, setNewSupplier] = useState({ name: "", phone: "", email: "", address: "" })
  const [isSupEditOpen, setIsSupEditOpen] = useState(false)
  const [editSupplier, setEditSupplier] = useState<any | null>(null)

  // Clientes
  const [isCustAddOpen, setIsCustAddOpen] = useState(false)
  const [newCustomer, setNewCustomer] = useState({ name: "", phone: "", email: "", address: "", creditLimit: "" })
  const [isCustEditOpen, setIsCustEditOpen] = useState(false)
  const [editCustomer, setEditCustomer] = useState<any | null>(null)

  // Compras
  const [isPurchaseAddOpen, setIsPurchaseAddOpen] = useState<boolean>(false)
  const [newPurchase, setNewPurchase] = useState<{
    supplierId: string
    items: { productId: string; qty: string; cost: string }[]
  }>({
    supplierId: "",
    items: [{ productId: "", qty: "", cost: "" }],
  })

  // ========== Filtros y Paginación ==========
  // Stock
  const [stockSearch, setStockSearch] = useState<string>("")
  const [stockOnlyLow, setStockOnlyLow] = useState<boolean>(false)
  const [stockOnlyExpiring, setStockOnlyExpiring] = useState<boolean>(false)
  const [stockCategoryFilter, setStockCategoryFilter] = useState<string>("")
  const [stockPage, setStockPage] = useState<number>(1)
  const [stockPageSize] = useState<number>(10)

  // Productos
  const [productsSearch, setProductsSearch] = useState<string>("")
  const [productsCategoryFilter, setProductsCategoryFilter] = useState<string>("")
  const [productsPage, setProductsPage] = useState<number>(1)
  const [productsPageSize] = useState<number>(10)

  // Categorías
  const [categoriesPage, setCategoriesPage] = useState<number>(1)
  const [categoriesPageSize] = useState<number>(10)

  // Proveedores
  const [suppliersPage, setSuppliersPage] = useState<number>(1)
  const [suppliersPageSize] = useState<number>(10)

  // Clientes
  const [customersPage, setCustomersPage] = useState<number>(1)
  const [customersPageSize] = useState<number>(10)

  // Ventas historial
  const [salesHistPage, setSalesHistPage] = useState<number>(1)
  const [salesHistPageSize] = useState<number>(10)

  // Compras
  const [purchasesPendPage, setPurchasesPendPage] = useState<number>(1)
  const [purchasesPendPageSize] = useState<number>(10)
  const [purchasesHistPage, setPurchasesHistPage] = useState<number>(1)
  const [purchasesHistPageSize] = useState<number>(10)
  const [purchasesSupplierFilter, setPurchasesSupplierFilter] = useState<string>("")

  // ========== Handlers de Productos ==========
  const handleAddProduct = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      await createProduct(newProduct, categories)
      setIsAddOpen(false)
      setNewProduct({ name: "", barcode: "", price: "", stock: "", minStock: "", expiryDate: "", categoryId: "" })
      alert("✅ Producto agregado")
    } catch (err: any) {
      console.error(err)
      alert(`❌ ${err.message || "Error al agregar producto"}`)
    }
  }

  const openEdit = (p: any) => {
    setEditProduct({
      id: p.id,
      name: p.name,
      barcode: p.barcode,
      price: formatNumberEs(Number(p.price ?? 0), 2),
      stock: p.soldByWeight ? formatNumberEs(Number(p.stock ?? 0), 2) : formatNumberEs(Number(p.stock ?? 0), 0),
      minStock: p.minStock != null ? (p.soldByWeight ? formatNumberEs(Number(p.minStock), 2) : formatNumberEs(Number(p.minStock), 0)) : "",
      expiryDate: p.expiryDate ?? "",
    })
    setEditCategoryId(p.category?.id ? String(p.category.id) : "")
    setIsEditOpen(true)
  }

  const handleUpdateProduct = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!editProduct) return
    try {
      await updateProduct(editProduct, editCategoryId, categories)
      setIsEditOpen(false)
      setEditProduct(null)
      alert("✅ Producto actualizado")
    } catch (err: any) {
      console.error(err)
      alert(`❌ ${err.message || "Error al actualizar producto"}`)
    }
  }

  const handleDeleteProduct = async (id: number) => {
    if (!confirm("¿Eliminar producto? (se desactivará)")) return
    try {
      await deleteProduct(id)
      alert("🗑️ Producto eliminado")
    } catch (err) {
      console.error(err)
      alert("❌ Error al eliminar producto.")
    }
  }

  // ========== Handlers de Categorías ==========
  const handleCreateCategory = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      await createCategory(newCategory.name, newCategory.description)
      setIsCatAddOpen(false)
      setNewCategory({ name: "", description: "" })
      alert("✅ Categoría creada")
    } catch (err) {
      console.error(err)
      alert("❌ Error al crear categoría")
    }
  }

  const openEditCategory = (c: any) => {
    setEditCategory({ id: c.id, name: c.name, description: c.description ?? "" })
    setIsCatEditOpen(true)
  }

  const handleUpdateCategory = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!editCategory) return
    try {
      await updateCategory(editCategory.id, editCategory.name, editCategory.description)
      setIsCatEditOpen(false)
      setEditCategory(null)
      alert("✅ Categoría actualizada")
    } catch (err) {
      console.error(err)
      alert("❌ Error al actualizar categoría")
    }
  }

  const handleDeleteCategory = async (id: number) => {
    if (!confirm("¿Eliminar categoría?")) return
    try {
      await deleteCategory(id)
      alert("🗑️ Categoría eliminada")
    } catch (err: any) {
      console.error(err)
      alert("❌ No se puede eliminar. Asegúrate de que no tenga productos asociados.")
    }
  }

  // ========== Handlers de Proveedores ==========
  const handleCreateSupplier = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      await createSupplier(newSupplier)
      setIsSupAddOpen(false)
      setNewSupplier({ name: "", phone: "", email: "", address: "" })
      alert("✅ Proveedor creado")
    } catch (err) {
      console.error(err)
      alert("❌ Error al crear proveedor")
    }
  }

  const openEditSupplier = (s: any) => {
    setEditSupplier({ id: s.id, name: s.name, phone: s.phone ?? "", email: s.email ?? "", address: s.address ?? "" })
    setIsSupEditOpen(true)
  }

  const handleUpdateSupplier = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!editSupplier) return
    try {
      await updateSupplier(editSupplier)
      setIsSupEditOpen(false)
      setEditSupplier(null)
      alert("✅ Proveedor actualizado")
    } catch (err) {
      console.error(err)
      alert("❌ Error al actualizar proveedor")
    }
  }

  const handleDeleteSupplier = async (id: number) => {
    if (!confirm("¿Eliminar proveedor?")) return
    try {
      await deleteSupplier(id)
      alert("🗑️ Proveedor eliminado")
    } catch (err) {
      console.error(err)
      alert("❌ Error al eliminar proveedor")
    }
  }

  // ========== Handlers de Clientes ==========
  const handleCreateCustomer = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      await createCustomer(newCustomer)
      setIsCustAddOpen(false)
      setNewCustomer({ name: "", phone: "", email: "", address: "", creditLimit: "" })
      alert("✅ Cliente creado")
    } catch (err: any) {
      console.error(err)
      alert(`❌ ${err.message || "Error al crear cliente"}`)
    }
  }

  const openEditCustomer = (c: any) => {
    setEditCustomer({
      id: c.id,
      name: c.name,
      phone: c.phone ?? "",
      email: c.email ?? "",
      address: c.address ?? "",
      creditLimit: c.creditLimit != null ? formatNumberEs(Number(c.creditLimit), 2) : "",
    })
    setIsCustEditOpen(true)
  }

  const handleUpdateCustomer = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!editCustomer) return
    try {
      await updateCustomer(editCustomer)
      setIsCustEditOpen(false)
      setEditCustomer(null)
      alert("✅ Cliente actualizado")
    } catch (err: any) {
      console.error(err)
      alert(`❌ ${err.message || "Error al actualizar cliente"}`)
    }
  }

  const handleDeleteCustomer = async (id: number) => {
    if (!confirm("¿Eliminar cliente?")) return
    try {
      await deleteCustomer(id)
      alert("🗑️ Cliente eliminado")
    } catch (err) {
      console.error(err)
      alert("❌ Error al eliminar cliente")
    }
  }

  // ========== Handlers de Compras ==========
  const addPurchaseItemRow = () =>
    setNewPurchase((prev) => ({ ...prev, items: [...prev.items, { productId: "", qty: "", cost: "" }] }))
  
  const removePurchaseItemRow = (idx: number) =>
    setNewPurchase((prev) => ({ ...prev, items: prev.items.filter((_, i) => i !== idx) }))
  
  const handlePurchaseItemChange = (idx: number, field: "productId" | "qty" | "cost", value: string) =>
    setNewPurchase((prev) => {
      const items = [...prev.items]
      items[idx] = { ...items[idx], [field]: value }
      return { ...prev, items }
    })

  const handleCreatePurchase = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      await createPurchase(newPurchase)
      setIsPurchaseAddOpen(false)
      setNewPurchase({ supplierId: "", items: [{ productId: "", qty: "", cost: "" }] })
      alert("✅ Compra creada")
    } catch (e) {
      console.error(e)
      alert("❌ Error al crear compra")
    }
  }

  const handleCompletePurchase = async (id: number) => {
    try {
      await completePurchase(id)
      await loadProducts() // actualizar stock
      alert("✅ Compra completada")
    } catch (e) {
      console.error(e)
      alert("❌ Error al completar compra")
    }
  }

  const handleCancelPurchase = async (id: number) => {
    try {
      await cancelPurchase(id)
      alert("✅ Compra cancelada")
    } catch (e) {
      console.error(e)
      alert("❌ Error al cancelar compra")
    }
  }

  // ========== Handlers de Ventas ==========
  const handleProcessPayment = async (method: "CASH" | "CARD_DEBIT" | "CARD_CREDIT" | "TRANSFER" | "FIADO") => {
    try {
      await processPayment(method)
      // refrescar datos
      try {
        if (method === "FIADO" || selectedCustomerId) {
          await loadCustomers()
        }
      } catch {}
      alert("✅ Venta procesada")
      try {
        await loadProducts()
      } catch {}
    } catch (err: any) {
      console.error(err)
      alert(`❌ ${err?.message || "Error al procesar la venta"}`)
    }
  }

  const handleDeleteSale = async (id: number) => {
    if (!confirm("¿Eliminar venta definitivamente? Esto revertirá el stock y la deuda si corresponde.")) return
    try {
      await deleteSale(id)
      // Recargar vistas relacionadas
      try {
        await loadSalesHistory(salesStartDate, salesEndDate)
      } catch {}
      try {
        await loadProducts()
      } catch {}
      try {
        await loadDashboard()
      } catch {}
      try {
        await loadCustomers()
      } catch {}
      alert("🗑️ Venta eliminada")
    } catch (e: any) {
      console.error(e)
      alert(`❌ No se pudo eliminar la venta${e?.message ? ": " + e.message : ""}`)
    }
  }

  // ========== Resolver Alertas ==========
  const handleResolveAlert = async (alertItem: {
    id: number
    type: string
    message: string
    priority: string
    productId?: number
  }) => {
    if (alertItem.type === "LOW_STOCK") {
      // Abrir compra con ítem precargado
      setActiveModule("purchases")
      setIsPurchaseAddOpen(true)
      setNewPurchase({ supplierId: "", items: [{ productId: String(alertItem.productId ?? ""), qty: "1", cost: "" }] })
    } else if (alertItem.type === "NEAR_EXPIRY") {
      // Abrir edición de producto para sugerir bajada de precio
      const pid = Number(alertItem.productId)
      let prod = products.find((p: any) => Number(p.id) === pid)
      if (!prod) {
        try {
          await loadProducts()
          prod = products.find((p: any) => Number(p.id) === pid)
        } catch {}
      }
      if (prod) {
        openEdit(prod)
        setActiveModule("products")
      } else {
        window.alert("No se pudo cargar el producto para editar")
      }
    } else if (alertItem.type === "NEGATIVE_STOCK") {
      // Abrir edición de producto para actualizar stock
      const pid = Number(alertItem.productId)
      let prod = products.find((p: any) => Number(p.id) === pid)
      if (!prod) {
        try {
          await loadProducts()
          prod = products.find((p: any) => Number(p.id) === pid)
        } catch {}
      }
      if (prod) {
        openEdit(prod)
        setActiveModule("products")
        // Marcar la alerta como resuelta en el backend
        await resolveAlert(alertItem.id, "NEGATIVE_STOCK")
      } else {
        window.alert("No se pudo cargar el producto para editar")
      }
    }
  }

  // ========== Cargar datos según módulo activo ==========
  useEffect(() => {
    if (activeModule === "stock") {
      loadProducts()
      loadCategories()
    }
    if (activeModule === "dashboard") {
      loadDashboard()
    }
    if (activeModule === "categories") {
      loadCategories()
    }
    if (activeModule === "suppliers") {
      loadSuppliers()
    }
    if (activeModule === "purchases") {
      loadPurchases()
      loadSuppliers()
      loadProducts()
    }
    if (activeModule === "customers") {
      loadCustomers()
    }
    if (activeModule === "sales") {
      loadCustomers()
      loadProducts() // Cargar productos para autocompletado
    }
    if (activeModule === "products") {
      loadProducts()
      loadCategories()
    }
  }, [activeModule])

  // Autocargar historial de ventas al entrar a Stock
  useEffect(() => {
    if (activeModule === "stock" && salesStartDate && salesEndDate) {
      loadSalesHistory(salesStartDate, salesEndDate)
    }
  }, [activeModule, salesStartDate, salesEndDate])

  // Resetear paginación al cambiar filtros/datos
  useEffect(() => {
    setStockPage(1)
  }, [stockSearch, stockCategoryFilter, stockOnlyLow, stockOnlyExpiring, products])
  useEffect(() => {
    setSalesHistPage(1)
  }, [salesHistory])
  useEffect(() => {
    setProductsPage(1)
  }, [products, productsSearch, productsCategoryFilter])
  useEffect(() => {
    setCategoriesPage(1)
  }, [categories])
  useEffect(() => {
    setSuppliersPage(1)
  }, [suppliers])
  useEffect(() => {
    setCustomersPage(1)
  }, [customers])
  useEffect(() => {
    setPurchasesPendPage(1)
    setPurchasesHistPage(1)
  }, [purchases, purchasesSupplierFilter])

  // ========== Cálculos derivados ==========
  const lowCriticalCount = dashboardStats.lowStock
  const expiringCount = useMemo(() => alerts.filter((a) => a.type === "NEAR_EXPIRY").length, [alerts])

  // ========== Sidebar Items ==========
  const sidebarItems = [
    { id: "dashboard", label: "Dashboard", icon: BarChart3 },
    { id: "sales", label: "Ventas", icon: ShoppingCart },
    { id: "stock", label: "Stock", icon: Package },
    { id: "purchases", label: "Compras", icon: Truck },
    { id: "products", label: "Productos", icon: Package },
    { id: "categories", label: "Categorías", icon: Package },
    { id: "customers", label: "Clientes", icon: Users },
    { id: "suppliers", label: "Proveedores", icon: Truck },
    { id: "reports", label: "Reportes", icon: TrendingUp },
    { id: "help", label: "Ayuda", icon: HelpCircle },
  ]

  return (
    <div className="pos-grid">
      {/* Sidebar */}
      <div className="bg-card border-r border-border p-4">
        <div className="mb-8 space-y-3">
          <div className="flex items-center gap-2">
            <img src="/logo_triangulo.png" alt="El Triangulo" className="h-8 w-auto rounded-sm" />
            <div>
              <h2 className="text-xl font-bold text-primary">El Triangulo</h2>
              <p className="text-sm text-muted-foreground">Sistema de Gestión Integral</p>
            </div>
          </div>
          <div className="flex items-center justify-between gap-2 bg-accent/30 p-2 rounded">
            <div className="text-xs">
              <div>
                <span className="text-muted-foreground">Usuario:</span> {authUsername || "-"}
              </div>
              <div>
                <span className="text-muted-foreground">Rol:</span> {authRole || "-"}
              </div>
            </div>
            <Button variant="outline" size="sm" onClick={handleLogout}>
              <LogOut className="size-3 mr-1" /> Salir
            </Button>
          </div>
          <div className="flex items-center justify-between gap-2">
            <span className="text-xs text-muted-foreground">Tema</span>
            <Button variant="outline" size="sm" onClick={toggleTheme}>
              {isDarkTheme ? "Oscuro" : "Claro"}
            </Button>
          </div>
        </div>

        <nav className="space-y-2">
          {sidebarItems.map((item) => {
            const Icon = item.icon
            return (
              <Button
                key={item.id}
                variant={activeModule === item.id ? "default" : "ghost"}
                className="w-full justify-start"
                onClick={() => setActiveModule(item.id)}
              >
                <Icon className="size-4 mr-2" />
                {item.label}
              </Button>
            )
          })}
        </nav>

        {/* Alerts in Sidebar */}
        <div className="mt-8">
          <h3 className="text-sm font-medium mb-3 text-muted-foreground">Alertas Rápidas</h3>
          <div className="space-y-2">
            {lowCriticalCount > 0 && (
              <div
                role="button"
                className="flex items-center gap-2 p-2 rounded bg-destructive/10 cursor-pointer hover:bg-destructive/15"
                onClick={() => {
                  setActiveModule("stock")
                  setStockOnlyLow(true)
                  setStockOnlyExpiring(false)
                  setStockSearch("")
                  setStockCategoryFilter("")
                }}
              >
                <AlertTriangle className="size-4 text-destructive" />
                <span className="text-xs">Stock crítico: {lowCriticalCount}</span>
              </div>
            )}
            {expiringCount > 0 && (
              <div
                role="button"
                className="flex items-center gap-2 p-2 rounded bg-accent/10 cursor-pointer hover:bg-accent/15"
                onClick={() => {
                  setActiveModule("stock")
                  setStockOnlyExpiring(true)
                  setStockOnlyLow(false)
                  setStockSearch("")
                  setStockCategoryFilter("")
                }}
              >
                <Clock className="size-4 text-accent" />
                <span className="text-xs">Por vencer: {expiringCount}</span>
              </div>
            )}
            {lowCriticalCount === 0 && expiringCount === 0 && (
              <div className="text-xs text-muted-foreground">Sin alertas por ahora</div>
            )}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="p-6 overflow-auto">
        {activeModule === "dashboard" && (
          <DashboardView
            nowString={nowString}
            dashboardStats={dashboardStats}
            alerts={alerts}
            recentSales={recentSales}
            onResolve={handleResolveAlert}
          />
        )}
        {activeModule === "sales" && (
          <SalesView
            barcodeInput={barcodeInput}
            setBarcodeInput={setBarcodeInput}
            barcodeInputRef={barcodeInputRef}
            handleBarcodeSubmit={handleBarcodeSubmit}
            cartItems={cartItems}
            setCartItems={setCartItems}
            processingPayment={processingPayment}
            handleProcessPayment={handleProcessPayment}
            isCamOpen={isCamOpen}
            setIsCamOpen={setIsCamOpen}
            videoRef={videoRef}
            customers={customers}
            selectedCustomerId={selectedCustomerId}
            setSelectedCustomerId={setSelectedCustomerId}
            products={products}
            onSelectProduct={addToCart}
            salesHistory={salesHistory}
            loadingSalesHistory={loadingSalesHistory}
            salesHistoryError={salesHistoryError}
            salesStartDate={salesStartDate}
            setSalesStartDate={setSalesStartDate}
            salesEndDate={salesEndDate}
            setSalesEndDate={setSalesEndDate}
            salesHistPage={salesHistPage}
            setSalesHistPage={setSalesHistPage}
            salesHistPageSize={salesHistPageSize}
            loadSalesHistory={() => loadSalesHistory(salesStartDate, salesEndDate)}
            onDeleteSale={handleDeleteSale}
          />
        )}
        {activeModule === "stock" && (
          <StockView
            products={products}
            categories={categories}
            loadingProducts={loadingProducts}
            loadError={loadError}
            loadingCats={loadingCats}
            stockSearch={stockSearch}
            setStockSearch={setStockSearch}
            stockOnlyLow={stockOnlyLow}
            setStockOnlyLow={setStockOnlyLow}
            stockOnlyExpiring={stockOnlyExpiring}
            stockCategoryFilter={stockCategoryFilter}
            setStockCategoryFilter={setStockCategoryFilter}
            stockPage={stockPage}
            setStockPage={setStockPage}
            stockPageSize={stockPageSize}
            salesHistory={salesHistory}
            loadingSalesHistory={loadingSalesHistory}
            salesHistoryError={salesHistoryError}
            salesHistPage={salesHistPage}
            setSalesHistPage={setSalesHistPage}
            salesHistPageSize={salesHistPageSize}
            salesStartDate={salesStartDate}
            salesEndDate={salesEndDate}
            setSalesStartDate={setSalesStartDate}
            setSalesEndDate={setSalesEndDate}
            loadSalesHistory={() => loadSalesHistory(salesStartDate, salesEndDate)}
          />
        )}
        {activeModule === "purchases" && (
          <PurchasesView
            purchases={purchases}
            suppliers={suppliers}
            products={products}
            loadingSuppliers={loadingSuppliers}
            loadingProducts={loadingProducts}
            isPurchaseAddOpen={isPurchaseAddOpen}
            setIsPurchaseAddOpen={setIsPurchaseAddOpen}
            newPurchase={newPurchase}
            setNewPurchase={setNewPurchase}
            addPurchaseItemRow={addPurchaseItemRow}
            removePurchaseItemRow={removePurchaseItemRow}
            handlePurchaseItemChange={handlePurchaseItemChange}
            handleCreatePurchase={handleCreatePurchase}
            completePurchase={handleCompletePurchase}
            cancelPurchase={handleCancelPurchase}
            purchasesSupplierFilter={purchasesSupplierFilter}
            setPurchasesSupplierFilter={setPurchasesSupplierFilter}
            purchasesPendPage={purchasesPendPage}
            setPurchasesPendPage={setPurchasesPendPage}
            purchasesPendPageSize={purchasesPendPageSize}
            purchasesHistPage={purchasesHistPage}
            setPurchasesHistPage={setPurchasesHistPage}
            purchasesHistPageSize={purchasesHistPageSize}
            readOnly={authRole === "CASHIER"}
          />
        )}
        {activeModule === "products" && (
          <ProductsView
            products={products}
            categories={categories}
            loadingProducts={loadingProducts}
            loadError={loadError}
            loadingCats={loadingCats}
            productsSearch={productsSearch}
            setProductsSearch={setProductsSearch}
            productsCategoryFilter={productsCategoryFilter}
            setProductsCategoryFilter={setProductsCategoryFilter}
            productsPage={productsPage}
            productsPageSize={productsPageSize}
            setProductsPage={setProductsPage}
            isAddOpen={isAddOpen}
            setIsAddOpen={setIsAddOpen}
            newProduct={newProduct}
            setNewProduct={setNewProduct}
            handleAddProduct={handleAddProduct}
            isEditOpen={isEditOpen}
            setIsEditOpen={setIsEditOpen}
            editProduct={editProduct}
            setEditProduct={setEditProduct}
            editCategoryId={editCategoryId}
            setEditCategoryId={setEditCategoryId}
            handleUpdateProduct={handleUpdateProduct}
            openEdit={openEdit}
            openLabel={openLabel}
            handleDeleteProduct={handleDeleteProduct}
            isLabelOpen={isLabelOpen}
            setIsLabelOpen={setIsLabelOpen}
            labelProduct={labelProduct}
            barcodeSvgRef={barcodeSvgRef}
            printLabel={printLabel}
            readOnly={authRole === "CASHIER"}
          />
        )}
        {activeModule === "categories" && (
          <CategoriesView
            categories={categories}
            loadingCats={loadingCats}
            catsError={catsError}
            isCatAddOpen={isCatAddOpen}
            setIsCatAddOpen={setIsCatAddOpen}
            newCategory={newCategory}
            setNewCategory={setNewCategory}
            isCatEditOpen={isCatEditOpen}
            setIsCatEditOpen={setIsCatEditOpen}
            editCategory={editCategory}
            setEditCategory={setEditCategory}
            categoriesPage={categoriesPage}
            setCategoriesPage={setCategoriesPage}
            categoriesPageSize={categoriesPageSize}
            handleCreateCategory={handleCreateCategory}
            openEditCategory={openEditCategory}
            handleUpdateCategory={handleUpdateCategory}
            handleDeleteCategory={handleDeleteCategory}
            readOnly={authRole === "CASHIER"}
          />
        )}
        {activeModule === "customers" && (
          <CustomersView
            customers={customers}
            loadingCustomers={loadingCustomers}
            customersError={customersError}
            isCustAddOpen={isCustAddOpen}
            setIsCustAddOpen={setIsCustAddOpen}
            newCustomer={newCustomer}
            setNewCustomer={setNewCustomer}
            isCustEditOpen={isCustEditOpen}
            setIsCustEditOpen={setIsCustEditOpen}
            editCustomer={editCustomer}
            setEditCustomer={setEditCustomer}
            customersPage={customersPage}
            setCustomersPage={setCustomersPage}
            customersPageSize={customersPageSize}
            handleCreateCustomer={handleCreateCustomer}
            openEditCustomer={openEditCustomer}
            handleUpdateCustomer={handleUpdateCustomer}
            handleDeleteCustomer={handleDeleteCustomer}
            reloadCustomers={loadCustomers}
            allowDelete={authRole === "ADMIN"}
          />
        )}
        {activeModule === "suppliers" && (
          <SuppliersView
            suppliers={suppliers}
            loadingSuppliers={loadingSuppliers}
            suppliersError={suppliersError}
            isSupAddOpen={isSupAddOpen}
            setIsSupAddOpen={setIsSupAddOpen}
            newSupplier={newSupplier}
            setNewSupplier={setNewSupplier}
            isSupEditOpen={isSupEditOpen}
            setIsSupEditOpen={setIsSupEditOpen}
            editSupplier={editSupplier}
            setEditSupplier={setEditSupplier}
            handleCreateSupplier={handleCreateSupplier}
            openEditSupplier={openEditSupplier}
            handleUpdateSupplier={handleUpdateSupplier}
            handleDeleteSupplier={handleDeleteSupplier}
            suppliersPage={suppliersPage}
            setSuppliersPage={setSuppliersPage}
            suppliersPageSize={suppliersPageSize}
            readOnly={authRole === "CASHIER"}
          />
        )}
        {activeModule === "reports" && <ReportsView dashboardStats={dashboardStats} isAdmin={authRole === "ADMIN"} />}
        {activeModule === "help" && <HelpView />}
      </div>
    </div>
  )
}

export default function Page() {
  return <KioskPOSSystem />
}
