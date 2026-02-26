import { useState } from "react"
import { authFetch } from "@/lib/api-client"
import { parseEsNumber, formatNumberEs } from "@/lib/utils"

/**
 * Hook para manejar el ABM de productos.
 * Se encarga de cargar, crear, actualizar y eliminar productos.
 */
export function useProducts() {
  const [products, setProducts] = useState<any[]>([])
  const [loadingProducts, setLoadingProducts] = useState(false)
  const [loadError, setLoadError] = useState("")

  const loadProducts = async () => {
    try {
      setLoadingProducts(true)
      setLoadError("")
      const res = await authFetch("http://localhost:8080/api/products")
      if (!res.ok) throw new Error(`Error ${res.status}`)
      const data = await res.json()
      setProducts(data)
    } catch (e) {
      console.error(e)
      setLoadError("No pude cargar los productos")
    } finally {
      setLoadingProducts(false)
    }
  }

  const createProduct = async (newProduct: any, categories: any[]) => {
    const priceNum = parseEsNumber(newProduct.price)
    const stockNum = parseEsNumber(newProduct.stock)
    const minStockNum = parseEsNumber(newProduct.minStock)
    const categoria = categories.find((c: any) => String(c.id) === (newProduct.categoryId || ""))
    const esPorPeso = ((categoria?.name || "").toLowerCase() === "por peso")
    
    if (isNaN(priceNum) || isNaN(stockNum) || isNaN(minStockNum)) {
      throw new Error("Los valores numéricos no son válidos. Usá el formato 1.234,56")
    }
    
    if (!esPorPeso && !Number.isInteger(stockNum)) {
      throw new Error("Para productos que no son 'Por peso', el stock debe ser un número entero")
    }
    
    if (!esPorPeso && !Number.isInteger(minStockNum)) {
      throw new Error("Para productos que no son 'Por peso', el stock mínimo debe ser un número entero")
    }
    
    const payload: any = {
      name: newProduct.name.trim(),
      barcode: newProduct.barcode.trim(),
      price: priceNum,
      stock: stockNum,
      minStock: minStockNum,
    }
    
    if (newProduct.expiryDate) payload.expiryDate = newProduct.expiryDate
    if (newProduct.categoryId) payload.category = { id: Number(newProduct.categoryId) }

    const res = await authFetch("http://localhost:8080/api/products", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    })
    
    if (!res.ok) throw new Error(`Error ${res.status}`)
    await loadProducts()
  }

  const updateProduct = async (editProduct: any, editCategoryId: string, categories: any[]) => {
    const priceNum = parseEsNumber(editProduct.price)
    const stockNum = parseEsNumber(editProduct.stock)
    const minStockNum = parseEsNumber(editProduct.minStock)
    const categoria = categories.find((c: any) => String(c.id) === (editCategoryId || ""))
    const esPorPeso = ((categoria?.name || "").toLowerCase() === "por peso")
    
    if (isNaN(priceNum) || isNaN(stockNum) || isNaN(minStockNum)) {
      throw new Error("Los valores numéricos no son válidos. Usá el formato 1.234,56")
    }
    
    if (!esPorPeso && !Number.isInteger(stockNum)) {
      throw new Error("Para productos que no son 'Por peso', el stock debe ser un número entero")
    }
    
    if (!esPorPeso && !Number.isInteger(minStockNum)) {
      throw new Error("Para productos que no son 'Por peso', el stock mínimo debe ser un número entero")
    }
    
    const payload: any = {
      id: editProduct.id,
      name: editProduct.name.trim(),
      barcode: editProduct.barcode.trim(),
      price: priceNum,
      stock: stockNum,
      minStock: minStockNum,
    }
    
    if (editProduct.expiryDate) payload.expiryDate = editProduct.expiryDate
    if (editCategoryId) payload.category = { id: Number(editCategoryId) }

    const res = await authFetch(`http://localhost:8080/api/products/${editProduct.id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    })
    
    if (!res.ok) throw new Error(`Error ${res.status}`)
    await loadProducts()
  }

  const deleteProduct = async (id: number) => {
    const res = await authFetch(`http://localhost:8080/api/products/${id}`, { method: "DELETE" })
    if (!res.ok) throw new Error(`Error ${res.status}`)
    await loadProducts()
  }

  return {
    products,
    loadingProducts,
    loadError,
    loadProducts,
    createProduct,
    updateProduct,
    deleteProduct,
  }
}
