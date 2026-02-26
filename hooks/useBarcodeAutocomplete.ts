import { useState, useEffect, useCallback } from "react"

/**
 * Hook para autocompletado de códigos de barras y búsqueda de productos
 */
export function useBarcodeAutocomplete(products: any[], inputValue: string) {
  const [suggestions, setSuggestions] = useState<any[]>([])
  const [showSuggestions, setShowSuggestions] = useState(false)
  const [selectedIndex, setSelectedIndex] = useState(-1)

  // Filtrar productos según el input
  useEffect(() => {
    if (!inputValue || inputValue.length < 2) {
      setSuggestions([])
      setShowSuggestions(false)
      setSelectedIndex(-1)
      return
    }

    const searchTerm = inputValue.toLowerCase().trim()
    
    // Buscar por código de barras o nombre
    const filtered = products
      .filter((p: any) => {
        const barcode = String(p.barcode || "").toLowerCase()
        const name = String(p.name || "").toLowerCase()
        return barcode.includes(searchTerm) || name.includes(searchTerm)
      })
      .slice(0, 8) // Máximo 8 sugerencias
    
    setSuggestions(filtered)
    setShowSuggestions(filtered.length > 0)
    setSelectedIndex(-1)
  }, [inputValue, products])

  // Navegar con flechas del teclado
  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (!showSuggestions || suggestions.length === 0) return

      switch (e.key) {
        case "ArrowDown":
          e.preventDefault()
          setSelectedIndex((prev) => (prev < suggestions.length - 1 ? prev + 1 : prev))
          break
        case "ArrowUp":
          e.preventDefault()
          setSelectedIndex((prev) => (prev > 0 ? prev - 1 : -1))
          break
        case "Escape":
          setShowSuggestions(false)
          setSelectedIndex(-1)
          break
      }
    },
    [showSuggestions, suggestions.length]
  )

  // Obtener el producto seleccionado
  const getSelectedProduct = useCallback(() => {
    if (selectedIndex >= 0 && selectedIndex < suggestions.length) {
      return suggestions[selectedIndex]
    }
    return null
  }, [selectedIndex, suggestions])

  const clearSuggestions = useCallback(() => {
    setSuggestions([])
    setShowSuggestions(false)
    setSelectedIndex(-1)
  }, [])

  return {
    suggestions,
    showSuggestions,
    selectedIndex,
    setShowSuggestions,
    handleKeyDown,
    getSelectedProduct,
    clearSuggestions,
  }
}
