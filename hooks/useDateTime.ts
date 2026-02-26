import { useState, useEffect } from "react"

/**
 * Hook para gestión de fecha/hora actual
 * Evita mismatch entre SSR y CSR
 */
export function useDateTime() {
  const [nowString, setNowString] = useState<string>("")
  const [salesStartDate, setSalesStartDate] = useState<string>("")
  const [salesEndDate, setSalesEndDate] = useState<string>("")

  useEffect(() => {
    const now = new Date()
    setNowString(now.toLocaleString())
    const iso = now.toISOString().slice(0, 10)
    setSalesStartDate((prev) => prev || iso)
    setSalesEndDate((prev) => prev || iso)
  }, [])

  return {
    nowString,
    salesStartDate,
    setSalesStartDate,
    salesEndDate,
    setSalesEndDate,
  }
}
