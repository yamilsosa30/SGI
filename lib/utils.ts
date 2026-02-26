import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// Formatea números con separador decimal "," y miles "." usando locale es-AR/es-ES
export function formatNumberEs(value: number | string | null | undefined, fractionDigits: number = 2): string {
  if (value === null || value === undefined || value === "") return "0,00"
  const num = typeof value === "number" ? value : Number(value)
  const fmt = new Intl.NumberFormat("es-AR", { minimumFractionDigits: fractionDigits, maximumFractionDigits: fractionDigits })
  return fmt.format(isNaN(num) ? 0 : num)
}

// Convierte cadenas con formato "1.234,56" a número JS 1234.56
export function parseEsNumber(input: string | number | null | undefined): number {
  if (input === null || input === undefined) return NaN
  if (typeof input === "number") return input
  const s = String(input).trim()
  if (!s) return NaN
  // quitar separadores de miles y convertir coma decimal a punto
  const normalized = s.replace(/\./g, "").replace(/,/g, ".")
  const n = parseFloat(normalized)
  return isNaN(n) ? NaN : n
}
