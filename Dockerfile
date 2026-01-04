# ==============================================================
# Dockerfile für React SPA mit NGINX
# ==============================================================
# Multi-Stage Build:
# 1. Stage (builder): Baut die Anwendung mit Node.js
# 2. Stage (production): Serviert die statischen Dateien mit NGINX
#
# Vorteile:
# - Kleines finales Image (nur NGINX + statische Dateien)
# - Build-Tools sind nicht im Production Image
# - Sicherheit: Keine Node.js Laufzeitumgebung im Container

# ==============================================================
# Stage 1: Builder
# ==============================================================
FROM node:22-alpine AS builder

# Metadaten
LABEL maintainer="SWE Team"
LABEL description="Build stage for React Frontend"

# pnpm installieren
RUN corepack enable && corepack prepare pnpm@latest --activate

# Arbeitsverzeichnis erstellen
WORKDIR /app

# Dependency-Dateien kopieren (für Cache-Optimierung)
# Diese Dateien ändern sich seltener als der Quellcode
COPY package.json pnpm-lock.yaml ./

# Dependencies installieren
# --frozen-lockfile verhindert Updates der Lock-Datei
RUN pnpm install --frozen-lockfile

# Quellcode kopieren
COPY . .

# Build-Argumente für Umgebungsvariablen
# Diese werden zur Build-Zeit gesetzt
ARG VITE_GRAPHQL_URI
ARG VITE_KEYCLOAK_URL
ARG VITE_KEYCLOAK_REALM
ARG VITE_KEYCLOAK_CLIENT_ID

# Production Build erstellen
RUN pnpm build

# ==============================================================
# Stage 2: Production (NGINX)
# ==============================================================
FROM nginx:alpine AS production

# Metadaten
LABEL maintainer="SWE Team"
LABEL description="Production image for React Frontend with NGINX"

# Sicherheits-Updates installieren
RUN apk update && apk upgrade && rm -rf /var/cache/apk/*

# Eigene NGINX-Konfiguration kopieren
COPY docker/nginx.conf /etc/nginx/nginx.conf

# SSL-Zertifikate Verzeichnis erstellen
RUN mkdir -p /etc/nginx/ssl

# Build-Artefakte vom Builder kopieren
COPY --from=builder /app/dist /usr/share/nginx/html

# Healthcheck für Container-Orchestrierung
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
    CMD wget --no-verbose --tries=1 --spider http://localhost:80/health || exit 1

# Port 80 (HTTP) und 443 (HTTPS) exponieren
EXPOSE 80 443

# NGINX im Vordergrund starten (wichtig für Docker)
CMD ["nginx", "-g", "daemon off;"]
