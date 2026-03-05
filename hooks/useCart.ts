import { useState } from "react"
import { authFetch } from "@/lib/api-client"

type CartItem = {
  id: number
  name: string
  barcode: string
  price: number
  quantity: number
  soldByWeight?: boolean
  interestRate?: number
}

/**
 * Hook para gestión del carrito de compras y procesamiento de pagos
 */
export function useCart() {
  const [cartItems, setCartItems] = useState<CartItem[]>([])
  const [processingPayment, setProcessingPayment] = useState(false)
  const [selectedCustomerId, setSelectedCustomerId] = useState<string>("")

  const addToCart = (product: any) => {
    setCartItems((prev) => {
      // Buscar si el producto ya existe en el carrito
      const existingIndex = prev.findIndex(item => item.id === product.id)
      
      if (existingIndex >= 0) {
        // Si existe, incrementar su cantidad
        const newItems = [...prev]
        newItems[existingIndex] = {
          ...newItems[existingIndex],
          quantity: (newItems[existingIndex].quantity || 1) + 1
        }
        return newItems
      } else {
        // Si no existe, agregarlo con cantidad 1
        return [
          ...prev,
          { 
            id: product.id, 
            name: product.name, 
            barcode: product.barcode, 
            price: Number(product.price),
            quantity: 1,
            soldByWeight: product.soldByWeight
          },
        ]
      }
    })
  }

  const removeFromCart = (index: number) => {
    setCartItems((prev) => prev.filter((_, i) => i !== index))
  }

  const clearCart = () => {
    setCartItems([])
    setSelectedCustomerId("")
  }

  const calculateTotal = () => {
    return cartItems.reduce((sum, item) => {
      const price = Number(item.price) || 0
      const qty = item.quantity || 1
      const baseSubtotal = item.soldByWeight ? price * (qty / 1000) : price * qty
      // Agregar interés si existe
      const interest = item.interestRate ? baseSubtotal * (item.interestRate / 100) : 0
      return sum + baseSubtotal + interest
    }, 0)
  }

  const processPayment = async (
    method: "CASH" | "CARD_DEBIT" | "CARD_CREDIT" | "TRANSFER" | "FIADO"
  ) => {
    if (!cartItems || cartItems.length === 0) {
      throw new Error("Carrito vacío")
    }
    
    setProcessingPayment(true)
    try {
      // Preparar ítems: incluir soldByWeight, interestRate y cantidades correctas
      const items = cartItems.map(item => ({
        productId: Number(item.id),
        quantity: item.quantity || 1,
        unitPrice: Number(item.price) || 0,
        soldByWeight: !!item.soldByWeight,
        interestRate: item.interestRate || null,
      }))

      const total = calculateTotal()

      const body: any = {
        items,
        paymentMethod: method,
        customerId: null as number | null,
        isCredit: method === "FIADO",
        total,
      }

      // Si es fiado, exigir cliente y setear customerId
      if (method === "FIADO") {
        if (!selectedCustomerId) {
          throw new Error("Selecciona un cliente para venta fiada")
        }
        body.customerId = Number(selectedCustomerId)
      } else if (selectedCustomerId) {
        // opcional: asociar cliente aunque no sea fiado
        body.customerId = Number(selectedCustomerId)
      }

      const res = await authFetch("http://localhost:8080/api/sales", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      })
      
      if (!res.ok) {
        const msg = await res.text()
        throw new Error(msg || `HTTP ${res.status}`)
      }

      clearCart()
      return true
    } finally {
      setProcessingPayment(false)
    }
  }

  return {
    cartItems,
    setCartItems,
    processingPayment,
    selectedCustomerId,
    setSelectedCustomerId,
    addToCart,
    removeFromCart,
    clearCart,
    calculateTotal,
    processPayment,
  }
}
