# =============================================================================
# Dockerfile para Frontend Next.js - SGIK POS
# Multi-stage build para optimizar tamaño de imagen
# =============================================================================

# -----------------------------------------
# Stage 1: Instalar dependencias
# -----------------------------------------
FROM node:20-alpine AS deps

WORKDIR /app

# Copiar archivos de dependencias
COPY package.json package-lock.json* ./

# Instalar dependencias
RUN npm ci --only=production=false

# -----------------------------------------
# Stage 2: Build de la aplicación
# -----------------------------------------
FROM node:20-alpine AS builder

WORKDIR /app

# Copiar dependencias desde stage anterior
COPY --from=deps /app/node_modules ./node_modules
COPY . .

# Variables de entorno para build
ENV NEXT_TELEMETRY_DISABLED=1
ENV NODE_ENV=production

# Build de Next.js (standalone output)
RUN npm run build

# -----------------------------------------
# Stage 3: Runtime mínimo
# -----------------------------------------
FROM node:20-alpine AS runner

LABEL maintainer="SGIK POS Team"
LABEL description="Frontend para Sistema de Gestión de Inventario Kiosco"
LABEL version="1.0"

WORKDIR /app

# Crear usuario no-root
RUN addgroup --system --gid 1001 nodejs && \
    adduser --system --uid 1001 nextjs

# Copiar archivos necesarios para runtime
COPY --from=builder /app/public ./public
COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static

# Cambiar propietario
RUN chown -R nextjs:nodejs /app

# Cambiar a usuario no-root
USER nextjs

# Puerto expuesto
EXPOSE 3000

# Variables de entorno
ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1
ENV PORT=3000
ENV HOSTNAME="0.0.0.0"

# Health check
HEALTHCHECK --interval=30s --timeout=10s --start-period=30s --retries=3 \
    CMD wget --no-verbose --tries=1 --spider http://localhost:3000 || exit 1

# Comando de inicio
CMD ["node", "server.js"]

