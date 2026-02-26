import { useState, useEffect, useRef } from "react"
import { formatNumberEs } from "@/lib/utils"

/**
 * Hook para gestión de etiquetas de productos con códigos de barras
 */
export function useProductLabel() {
  const [isLabelOpen, setIsLabelOpen] = useState(false)
  const [labelProduct, setLabelProduct] = useState<any | null>(null)
  const barcodeSvgRef = useRef<SVGSVGElement | null>(null)

  const openLabel = (product: any) => {
    setLabelProduct(product)
    setIsLabelOpen(true)
  }

  const printLabel = async () => {
    if (!labelProduct) return
    let svg = ""
    
    // Tomar el SVG ya renderizado si existe
    if (barcodeSvgRef.current && barcodeSvgRef.current.innerHTML.trim().length > 0) {
      svg = barcodeSvgRef.current.outerHTML
    } else if (labelProduct.barcode) {
      // Regenerar de emergencia si aún no se dibujó
      try {
        const mod: any = await import("jsbarcode")
        const JsBarcode = mod.default || mod
        const tmp = document.createElementNS("http://www.w3.org/2000/svg", "svg")
        JsBarcode(tmp as any, String(labelProduct.barcode), {
          format: "CODE128",
          displayValue: true,
          fontSize: 14,
          width: 2,
          height: 60,
          margin: 0,
        })
        svg = tmp.outerHTML
      } catch (err) {
        console.error("Error generando barcode para impresión", err)
        svg = ""
      }
    }
    
    // Asegurar xmlns para que el SVG se renderice en la ventana de impresión
    if (svg && !/xmlns=\"http:\/\/www.w3.org\/2000\/svg\"/.test(svg)) {
      svg = svg.replace("<svg", '<svg xmlns="http://www.w3.org/2000/svg"')
    }

    const name = labelProduct.name ?? ""
    const price = typeof labelProduct.price === "number" ? labelProduct.price : Number(labelProduct.price ?? 0)
    const priceText = formatNumberEs(price, 2)
    
    const html = `<!doctype html><html><head><meta charset="utf-8"><title>Etiqueta</title>
    <style>
      @page { margin: 8mm; }
      body { font-family: sans-serif; }
      .wrap { width: 300px; text-align: center; }
      h2 { font-size: 14px; margin: 0 0 4px; }
      .price { font-size: 16px; font-weight: 700; margin-top: 4px; }
      svg { width: 100%; height: auto; }
    </style></head><body><div class="wrap">
      <h2>${name}</h2>
      ${svg}
      <div class="price">$${priceText}</div>
    </div></body></html>`
    
    const w = window.open("", "PRINT", "height=400,width=600")
    if (!w) return
    w.document.open()
    w.document.write(html)
    w.document.close()
    w.addEventListener("load", () => {
      try {
        w.focus()
        w.print()
      } finally {
        w.close()
      }
    })
  }

  // Generar Code128 con JsBarcode al abrir el diálogo
  useEffect(() => {
    if (isLabelOpen && labelProduct?.barcode && barcodeSvgRef.current) {
      ;(async () => {
        try {
          const mod: any = await import("jsbarcode")
          const JsBarcode = mod.default || mod
          // limpiar y generar
          barcodeSvgRef.current!.innerHTML = ""
          JsBarcode(barcodeSvgRef.current, String(labelProduct.barcode), {
            format: "CODE128",
            displayValue: true,
            fontSize: 14,
            width: 2,
            height: 60,
            margin: 0,
          })
        } catch (err) {
          console.error("Error generando barcode", err)
        }
      })()
    }
  }, [isLabelOpen, labelProduct])

  return {
    isLabelOpen,
    setIsLabelOpen,
    labelProduct,
    barcodeSvgRef,
    openLabel,
    printLabel,
  }
}
