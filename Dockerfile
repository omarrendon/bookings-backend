# ── ETAPA 1: Builder ──────────────────────────────────────────────────────────
FROM node:22-alpine AS builder

WORKDIR /app

# Copiar manifests primero para aprovechar cache de capas de Docker
COPY package*.json ./
COPY tsconfig*.json ./

# Instalar todas las dependencias (incluye devDependencies para compilar TS)
RUN npm ci

# Copiar el resto del código fuente
COPY src ./src

# Compilar TypeScript → dist/
RUN npm run build

# ── ETAPA 2: Production ───────────────────────────────────────────────────────
FROM node:22-alpine AS production

WORKDIR /app

# Copiar manifests e instalar solo dependencias de producción
COPY package*.json ./
RUN npm ci --omit=dev

# Copiar solo el código compilado desde la etapa builder
COPY --from=builder /app/dist ./dist

# Usar usuario no-root por seguridad (viene incluido en la imagen oficial de Node)
USER node

EXPOSE 3000

CMD ["node", "dist/app.js"]
