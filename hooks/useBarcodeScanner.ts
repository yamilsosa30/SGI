import { useState, useEffect, useRef } from "react"
import { authFetch } from "@/lib/api-client"

/**
 * Hook para escaneo de códigos de barras (input y cámara)
 */
export function useBarcodeScanner(onProductScanned: (product: any) => void) {
  const [barcodeInput, setBarcodeInput] = useState("")
  const [isCamOpen, setIsCamOpen] = useState(false)
  const barcodeInputRef = useRef<HTMLInputElement | null>(null)
  const videoRef = useRef<HTMLVideoElement | null>(null)
  const scannerControlsRef = useRef<any>(null)
  const codeReaderRef = useRef<any>(null)
  const lastScanRef = useRef<{ code: string; ts: number }>({ code: "", ts: 0 })

  // Procesar código escaneado (compartido por input/cámara)
  const processScannedCode = async (code: string) => {
    const trimmed = code.trim()
    if (!trimmed) return
    
    try {
      const res = await authFetch(`http://localhost:8080/api/products/barcode/${encodeURIComponent(trimmed)}`)
      if (!res.ok) throw new Error(`Producto no encontrado (${res.status})`)
      const prod = await res.json()
      onProductScanned(prod)
    } catch (err) {
      console.error(err)
      alert("❌ Producto no encontrado")
    }
  }

  // Escaneo por input (lectores USB/Bluetooth actúan como teclado)
  const handleBarcodeSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    const code = barcodeInput
    await processScannedCode(code)
    setBarcodeInput("")
    barcodeInputRef.current?.focus()
  }

  // Inicializar cámara con @zxing/browser cuando se abre el diálogo
  useEffect(() => {
    let stopped = false
    if (isCamOpen && videoRef.current) {
      ;(async () => {
        try {
          const mod: any = await import("@zxing/browser")
          const BrowserMultiFormatReader = mod.BrowserMultiFormatReader
          codeReaderRef.current = new BrowserMultiFormatReader()
          scannerControlsRef.current = await codeReaderRef.current.decodeFromConstraints(
            { audio: false, video: { facingMode: "environment" } },
            videoRef.current!,
            async (result: any, err: any) => {
              if (stopped) return
              if (result) {
                const text = String(result.getText())
                const now = Date.now()
                if (text === lastScanRef.current.code && now - lastScanRef.current.ts < 1200) return
                lastScanRef.current = { code: text, ts: now }
                await processScannedCode(text)
              }
            }
          )
        } catch (err) {
          console.error("No fue posible iniciar la cámara", err)
          alert("⚠️ No fue posible iniciar la cámara. Revisa permisos del navegador.")
          setIsCamOpen(false)
        }
      })()
    }
    return () => {
      stopped = true
      try {
        scannerControlsRef.current?.stop?.()
        codeReaderRef.current?.reset?.()
      } catch {}
    }
  }, [isCamOpen])

  return {
    barcodeInput,
    setBarcodeInput,
    barcodeInputRef,
    handleBarcodeSubmit,
    isCamOpen,
    setIsCamOpen,
    videoRef,
    processScannedCode,
  }
}
