"use client"

import React, { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"
import {
  BarChart3,
  ShoppingCart,
  Package,
  Truck,
  Users,
  TrendingUp,
  HelpCircle,
  BookOpen,
  Lightbulb,
  AlertTriangle,
  CreditCard,
  Barcode,
  FileText,
  Settings,
  ChevronRight,
} from "lucide-react"

export default function HelpView() {
  const [selectedSection, setSelectedSection] = useState<string | null>(null)

  const sections = [
    {
      id: "dashboard",
      title: "Dashboard",
      icon: BarChart3,
      description: "Panel principal con métricas y alertas del sistema",
      content: `
El Dashboard es la pantalla principal del sistema y muestra un resumen del estado actual del negocio.

**Métricas principales:**
- **Ventas del Día:** Total facturado en el día actual
- **Productos:** Cantidad de productos activos en inventario
- **Stock Bajo:** Productos que necesitan reposición urgente
- **Pedidos Pendientes:** Compras a proveedores pendientes de completar

**Alertas Activas:**
Las alertas se generan automáticamente y pueden ser de dos tipos:
- **Críticas (rojo):** Stock bajo o negativo
- **Medias (amarillo):** Productos próximos a vencer

**Acciones rápidas:**
- Hacer clic en una alerta te lleva directamente al módulo correspondiente para resolverla
- Las alertas de stock bajo abren el módulo de Compras para crear un pedido
- Las alertas de vencimiento abren la edición del producto para ajustar precio o stock
      `,
    },
    {
      id: "sales",
      title: "Ventas",
      icon: ShoppingCart,
      description: "Punto de venta con escaneo de códigos de barras",
      content: `
El módulo de Ventas es donde se procesan todas las transacciones del negocio.

**Agregar productos al carrito:**
1. **Escaneo manual:** Escribí el código de barras en el campo de texto y presioná Enter
2. **Escaneo con cámara:** Hacé clic en "Abrir Cámara" para escanear con la webcam
3. **Búsqueda por nombre:** Usá el buscador para encontrar productos por nombre
4. **Click en producto:** Hacé clic en cualquier producto del listado para agregarlo

**Carrito de compras:**
- Ajustá las cantidades con los botones +/-
- Eliminá productos con el botón de papelera
- El total se actualiza automáticamente

**Métodos de pago disponibles:**
- **Efectivo (CASH):** Pago en efectivo
- **Débito (CARD_DEBIT):** Tarjeta de débito
- **Crédito (CARD_CREDIT):** Tarjeta de crédito
- **Transferencia (TRANSFER):** Transferencia bancaria
- **Fiado (FIADO):** Venta a crédito para clientes registrados

**Ventas fiadas:**
1. Seleccioná un cliente del dropdown antes de procesar el pago
2. Elegí "Fiado" como método de pago
3. El monto se suma a la deuda del cliente
4. Podés registrar pagos de clientes en el módulo de Clientes

**Historial de ventas:**
- Filtrá por rango de fechas
- Visualizá los detalles de cada venta
- Eliminá ventas (revierte stock y deuda si aplica)
      `,
    },
    {
      id: "stock",
      title: "Stock",
      icon: Package,
      description: "Control de inventario con alertas y movimientos",
      content: `
El módulo de Stock permite monitorear y gestionar el inventario de productos.

**Filtros disponibles:**
- **Búsqueda por nombre:** Encontrá productos rápidamente
- **Filtrar por categoría:** Mostrá solo productos de una categoría
- **Solo stock bajo:** Productos por debajo del stock mínimo
- **Solo por vencer:** Productos que vencen en los próximos 7 días

**Indicadores visuales:**
- 🔴 **Rojo:** Stock crítico (por debajo del mínimo)
- 🟡 **Amarillo:** Producto próximo a vencer
- 🟢 **Verde:** Stock normal

**Información mostrada:**
- Stock actual y stock mínimo
- Fecha de vencimiento (si aplica)
- Categoría del producto
- Código de barras

**Historial de ventas del producto:**
Al seleccionar un producto, podés ver su historial de ventas para analizar su rotación.

**Acciones:**
- Acceso rápido a edición de productos
- Crear pedidos de compra para reponer stock
      `,
    },
    {
      id: "purchases",
      title: "Compras",
      icon: Truck,
      description: "Gestión de pedidos a proveedores",
      content: `
El módulo de Compras gestiona los pedidos a proveedores y la reposición de stock.

**Estados de una compra:**
- **Pendiente:** La compra fue creada pero aún no llegó la mercadería
- **Completada:** La mercadería llegó y el stock fue actualizado
- **Cancelada:** La compra fue cancelada

**Crear una nueva compra:**
1. Hacé clic en "Nueva Compra"
2. Seleccioná el proveedor (opcional)
3. Agregá productos con su cantidad y costo
4. Guardá la compra como pendiente

**Completar una compra:**
1. Buscá la compra en la lista de pendientes
2. Hacé clic en "Completar"
3. El stock de los productos se actualiza automáticamente

**Cancelar una compra:**
Si una compra ya no es necesaria, podés cancelarla sin afectar el stock.

**Beneficios:**
- Llevá control de pedidos pendientes
- Sabé qué proveedores te proveen cada producto
- El stock se actualiza automáticamente al completar compras
      `,
    },
    {
      id: "products",
      title: "Productos",
      icon: Package,
      description: "Administración del catálogo de productos",
      content: `
El módulo de Productos permite gestionar todo el catálogo del negocio.

**Crear un nuevo producto:**
1. Hacé clic en "Nuevo Producto"
2. Completá los campos:
   - **Nombre:** Nombre del producto
   - **Código de barras:** Se genera automáticamente si lo dejás vacío
   - **Precio:** Precio de venta
   - **Stock:** Cantidad actual en inventario
   - **Stock mínimo:** Cantidad mínima antes de alertar
   - **Fecha de vencimiento:** Opcional, para productos perecederos
   - **Categoría:** Para organizar el catálogo
3. Guardá el producto

**Editar un producto:**
- Hacé clic en el botón de edición (lápiz)
- Modificá los campos necesarios
- Guardá los cambios

**Eliminar un producto:**
- La eliminación es "suave" (soft delete)
- El producto se marca como inactivo
- No aparece en los listados pero se conserva el historial

**Búsqueda y filtros:**
- Buscá por nombre o código de barras
- Filtrá por categoría
- Paginación para navegar grandes catálogos

**Código de barras automático:**
Si no tenés el código de barras de un producto, el sistema genera uno automáticamente basado en el nombre.
      `,
    },
    {
      id: "categories",
      title: "Categorías",
      icon: Package,
      description: "Organización de productos por categorías",
      content: `
El módulo de Categorías permite organizar los productos en grupos lógicos.

**Crear una categoría:**
1. Hacé clic en "Nueva Categoría"
2. Ingresá el nombre y descripción
3. Guardá

**Editar/Eliminar:**
- Usá los botones de acción en cada fila
- Al eliminar una categoría, los productos quedan sin categoría asignada

**Uso de categorías:**
- Organizá el catálogo de productos
- Filtrá productos por categoría en otros módulos
- Facilitá la búsqueda de productos en el punto de venta

**Ejemplos de categorías comunes:**
- Bebidas
- Snacks
- Cigarrillos
- Limpieza
- Almacenamiento
      `,
    },
    {
      id: "customers",
      title: "Clientes",
      icon: Users,
      description: "Gestión de clientes y cuentas corrientes",
      content: `
El módulo de Clientes permite gestionar la cartera de clientes y sus cuentas corrientes.

**Crear un cliente:**
1. Hacé clic en "Nuevo Cliente"
2. Completá los datos:
   - **Nombre:** Nombre del cliente
   - **Teléfono:** Para contacto
   - **Email:** Opcional
   - **Dirección:** Opcional
   - **Límite de crédito:** Monto máximo de deuda permitida
3. Guardá

**Cuenta corriente:**
- **Deuda actual:** Monto que debe el cliente
- **Límite de crédito:** Tope máximo de deuda
- El sistema alerta si un cliente supera su límite

**Registrar un pago:**
1. Seleccioná el cliente
2. Hacé clic en "Registrar Pago"
3. Ingresá el monto y una nota opcional
4. El pago se descuenta de la deuda

**Historial de pagos:**
- Visualizá todos los pagos registrados
- Fecha, monto y nota de cada pago

**Ventas fiadas:**
- Las ventas con método "Fiado" se asignan al cliente seleccionado
- El monto se suma automáticamente a su deuda
      `,
    },
    {
      id: "suppliers",
      title: "Proveedores",
      icon: Truck,
      description: "Directorio de proveedores",
      content: `
El módulo de Proveedores permite mantener un directorio de los proveedores del negocio.

**Crear un proveedor:**
1. Hacé clic en "Nuevo Proveedor"
2. Completá los datos:
   - **Nombre:** Nombre del proveedor
   - **Teléfono:** Para contacto
   - **Email:** Para pedidos por email
   - **Dirección:** Ubicación
3. Guardá

**Uso en compras:**
- Al crear una compra, podés seleccionar el proveedor
- Llevá control de qué proveedor te provee cada producto
- Filtrá compras por proveedor

**Editar/Eliminar:**
- Usá los botones de acción en cada fila
- Los proveedores eliminados no aparecen en nuevos pedidos
      `,
    },
    {
      id: "reports",
      title: "Reportes",
      icon: TrendingUp,
      description: "Reportes y estadísticas del negocio",
      content: `
El módulo de Reportes ofrece análisis y estadísticas del negocio.

**Tipos de reportes:**

**Resumen de Ventas:**
- Ventas por día, semana, mes o año
- Gráfico de evolución temporal
- Total facturado por período

**Resumen de Ganancias:**
- Ingresos vs. costos
- Margen de ganancia
- Productos más rentables

**Flujo de Caja:**
- Entradas y salidas de dinero
- Balance por período
- Desglose por método de pago

**Productos más vendidos:**
- Ranking de productos por cantidad vendida
- Top 10, 20 o 50 productos
- Análisis de rotación

**Exportación a PDF:**
Todos los reportes pueden exportarse a PDF para imprimir o compartir.

**Períodos disponibles:**
- Hoy
- Ayer
- Últimos 7 días
- Últimos 30 días
- Este mes
- Mes anterior
- Este año
      `,
    },
    {
      id: "general",
      title: "Uso General",
      icon: Settings,
      description: "Funciones generales del sistema",
      content: `
**Inicio de sesión:**
- Usá tu usuario y contraseña para acceder
- El sistema recuerda tu sesión por 8 horas
- Si el token expira, serás redirigido al login

**Navegación:**
- Usá el menú lateral para cambiar entre módulos
- El menú muestra alertas rápidas de stock y vencimientos
- Hacé clic en una alerta para ir directamente al problema

**Tema claro/oscuro:**
- Cambiá entre tema claro y oscuro desde el sidebar
- La preferencia se guarda automáticamente

**Cerrar sesión:**
- Hacé clic en "Salir" en el sidebar
- Tu sesión se cierra de forma segura

**Permisos por rol:**
- **ADMIN:** Acceso completo a todos los módulos
- **CASHIER:** Acceso limitado (ventas, consulta de productos y clientes)

**Atajos de teclado:**
- En el módulo de Ventas, el campo de código de barras tiene foco automático
- Presioná Enter para agregar el producto escaneado
      `,
    },
  ]

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-2">
            <HelpCircle className="size-8" />
            Centro de Ayuda
          </h1>
          <p className="text-muted-foreground mt-1">
            Guía completa de uso del sistema SGIK
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Índice de secciones */}
        <div className="lg:col-span-1">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <BookOpen className="size-5" />
                Índice
              </CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <nav className="space-y-1">
                {sections.map((section) => {
                  const Icon = section.icon
                  return (
                    <button
                      key={section.id}
                      onClick={() => setSelectedSection(section.id)}
                      className={`w-full flex items-center gap-3 px-4 py-3 text-left hover:bg-accent/50 transition-colors ${
                        selectedSection === section.id ? "bg-accent border-l-2 border-primary" : ""
                      }`}
                    >
                      <Icon className="size-4 text-muted-foreground" />
                      <div className="flex-1">
                        <div className="font-medium text-sm">{section.title}</div>
                        <div className="text-xs text-muted-foreground line-clamp-1">
                          {section.description}
                        </div>
                      </div>
                      <ChevronRight className="size-4 text-muted-foreground" />
                    </button>
                  )
                })}
              </nav>
            </CardContent>
          </Card>

          {/* Tips rápidos */}
          <Card className="mt-4">
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <Lightbulb className="size-5 text-yellow-500" />
                Tips Rápidos
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-sm">
              <div className="flex items-start gap-2">
                <Barcode className="size-4 mt-0.5 text-primary" />
                <p>Si no tenés el código de barras, el sistema lo genera automáticamente.</p>
              </div>
              <div className="flex items-start gap-2">
                <AlertTriangle className="size-4 mt-0.5 text-accent" />
                <p>Hacé clic en las alertas del sidebar para resolverlas rápidamente.</p>
              </div>
              <div className="flex items-start gap-2">
                <CreditCard className="size-4 mt-0.5 text-primary" />
                <p>Las ventas fiadas se asignan al cliente seleccionado y suman a su deuda.</p>
              </div>
              <div className="flex items-start gap-2">
                <FileText className="size-4 mt-0.5 text-primary" />
                <p>Los reportes pueden exportarse a PDF para imprimir o compartir.</p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Contenido de la sección seleccionada */}
        <div className="lg:col-span-2">
          {selectedSection ? (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  {(() => {
                    const section = sections.find((s) => s.id === selectedSection)
                    if (!section) return null
                    const Icon = section.icon
                    return (
                      <>
                        <Icon className="size-5" />
                        {section.title}
                      </>
                    )
                  })()}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="prose prose-sm dark:prose-invert max-w-none">
                  {sections
                    .find((s) => s.id === selectedSection)
                    ?.content.split("\n")
                    .map((line, index) => {
                      // Headers
                      if (line.startsWith("**") && line.endsWith(":**")) {
                        return (
                          <h4 key={index} className="font-semibold text-base mt-4 mb-2 text-foreground">
                            {line.replace(/\*\*/g, "").replace(":", "")}
                          </h4>
                        )
                      }
                      // Bold text
                      if (line.startsWith("**") && !line.endsWith(":**")) {
                        return (
                          <p key={index} className="font-medium text-foreground">
                            {line.replace(/\*\*/g, "")}
                          </p>
                        )
                      }
                      // List items
                      if (line.startsWith("- ")) {
                        return (
                          <li key={index} className="ml-4 text-muted-foreground">
                            {line.substring(2).replace(/\*\*(.*?)\*\*/g, "$1")}
                          </li>
                        )
                      }
                      // Numbered items
                      if (/^\d+\./.test(line)) {
                        return (
                          <li key={index} className="ml-4 text-muted-foreground list-decimal">
                            {line.replace(/^\d+\.\s*/, "").replace(/\*\*(.*?)\*\*/g, "$1")}
                          </li>
                        )
                      }
                      // Empty lines
                      if (line.trim() === "") {
                        return <div key={index} className="h-2" />
                      }
                      // Regular paragraphs
                      return (
                        <p key={index} className="text-muted-foreground">
                          {line.replace(/\*\*(.*?)\*\*/g, "$1")}
                        </p>
                      )
                    })}
                </div>
              </CardContent>
            </Card>
          ) : (
            <Card className="h-full flex items-center justify-center min-h-[400px]">
              <CardContent className="text-center">
                <HelpCircle className="size-16 mx-auto text-muted-foreground/50 mb-4" />
                <h3 className="text-xl font-semibold mb-2">Seleccioná un tema</h3>
                <p className="text-muted-foreground">
                  Elegí una sección del índice para ver la ayuda detallada.
                </p>
              </CardContent>
            </Card>
          )}
        </div>
      </div>

      {/* Acordeón con preguntas frecuentes */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <HelpCircle className="size-5" />
            Preguntas Frecuentes
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Accordion type="single" collapsible className="w-full">
            <AccordionItem value="q1">
              <AccordionTrigger>¿Cómo cambio mi contraseña?</AccordionTrigger>
              <AccordionContent>
                Actualmente, el cambio de contraseña debe ser realizado por un usuario con rol ADMIN. 
                Contactá al administrador del sistema para cambiar tu contraseña.
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="q2">
              <AccordionTrigger>¿Qué pasa si elimino una venta?</AccordionTrigger>
              <AccordionContent>
                Al eliminar una venta:
                <ul className="list-disc ml-4 mt-2">
                  <li>El stock de los productos vendidos se restaura automáticamente</li>
                  <li>Si fue una venta fiada, la deuda del cliente se reduce</li>
                  <li>La venta desaparece del historial y de los reportes</li>
                </ul>
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="q3">
              <AccordionTrigger>¿Cómo funcionan las alertas de stock?</AccordionTrigger>
              <AccordionContent>
                Las alertas de stock bajo se generan automáticamente cuando el stock de un producto 
                cae por debajo de su "stock mínimo" configurado. Estas alertas aparecen en el Dashboard 
                y en el sidebar. Haciendo clic en una alerta, podés crear rápidamente una compra 
                para reponer ese producto.
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="q4">
              <AccordionTrigger>¿Puedo usar el sistema sin conexión a internet?</AccordionTrigger>
              <AccordionContent>
                El sistema requiere conexión a la base de datos MySQL y al backend. Sin embargo, 
                puede instalarse localmente en tu computadora para funcionar sin internet 
                (solo necesitas que el backend y la base de datos estén corriendo localmente).
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="q5">
              <AccordionTrigger>¿Cómo exporto los reportes?</AccordionTrigger>
              <AccordionContent>
                En el módulo de Reportes, cada tipo de reporte tiene un botón "Exportar PDF". 
                Hacé clic en ese botón para descargar el reporte en formato PDF, que podés 
                imprimir o compartir por email.
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="q6">
              <AccordionTrigger>¿Qué es una venta fiada?</AccordionTrigger>
              <AccordionContent>
                Una venta fiada es una venta a crédito. El cliente se lleva los productos 
                pero paga después. El monto se suma a su deuda en el módulo de Clientes. 
                Para hacer una venta fiada:
                <ol className="list-decimal ml-4 mt-2">
                  <li>Seleccioná un cliente del dropdown</li>
                  <li>Agregá los productos al carrito</li>
                  <li>Elegí "Fiado" como método de pago</li>
                </ol>
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </CardContent>
      </Card>
    </div>
  )
}
