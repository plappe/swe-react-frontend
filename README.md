# 📚 Buchverwaltung Frontend

Eine Single Page Application (SPA) für die Buchverwaltung, entwickelt mit React, Vite und TypeScript.

## 🛠️ Tech Stack

| Kategorie | Technologie |
|-----------|-------------|
| **Web Framework** | React 18 + Vite |
| **Sprache** | TypeScript |
| **CSS Framework** | Bootstrap 5 |
| **API Client** | Apollo Client (GraphQL) |
| **Routing** | React Router v6 |
| **Authentifizierung** | Keycloak |
| **Linting** | ESLint 9 (Flat Config) |
| **Formatierung** | Prettier |
| **E2E Tests** | Playwright |
| **Package Manager** | pnpm |
| **Containerisierung** | Docker + NGINX |

## 📁 Projektstruktur

```
swe-react-frontend/
├── .github/
│   └── workflows/
│       └── ci.yml              # GitHub Actions CI/CD Pipeline
├── docker/
│   ├── nginx.conf              # NGINX Konfiguration für HTTPS
│   └── generate-certs.ps1      # Script für SSL-Zertifikate
├── public/
│   └── silent-check-sso.html   # Keycloak SSO Check
├── src/
│   ├── auth/                   # Keycloak Authentifizierung
│   │   ├── AuthProvider.tsx    # Auth Context Provider
│   │   ├── ProtectedRoute.tsx  # Route Guard
│   │   └── keycloak.ts         # Keycloak Konfiguration
│   ├── components/
│   │   └── layout/             # Layout Komponenten
│   │       ├── Header.tsx
│   │       └── Footer.tsx
│   ├── graphql/                # GraphQL Client & Queries
│   │   ├── client.ts           # Apollo Client Setup
│   │   ├── queries.ts          # GraphQL Queries
│   │   └── mutations.ts        # GraphQL Mutations
│   ├── pages/                  # Seiten-Komponenten
│   │   ├── HomePage.tsx
│   │   ├── LoginPage.tsx
│   │   ├── SearchPage.tsx
│   │   ├── DetailPage.tsx
│   │   ├── CreatePage.tsx
│   │   └── NotFoundPage.tsx
│   ├── styles/                 # Globale Styles
│   │   └── index.css
│   ├── types/                  # TypeScript Typen
│   │   ├── buch.ts
│   │   └── auth.ts
│   ├── App.tsx                 # Haupt-App mit Routing
│   └── main.tsx                # Entry Point
├── tests/
│   └── e2e/                    # Playwright E2E Tests
│       ├── fixtures.ts         # Test Fixtures
│       ├── pages/              # Page Objects
│       └── specs/              # Test Specs
├── .env.development            # Entwicklungs-Umgebungsvariablen
├── .env.production             # Produktions-Umgebungsvariablen
├── docker-compose.yml          # Docker Compose Konfiguration
├── Dockerfile                  # Multi-Stage Docker Build
├── eslint.config.js            # ESLint Konfiguration
├── playwright.config.ts        # Playwright Konfiguration
├── tsconfig.json               # TypeScript Konfiguration
└── vite.config.ts              # Vite Konfiguration
```

## 🚀 Schnellstart

### Voraussetzungen

- Node.js >= 22
- pnpm >= 9
- Docker (für Container-Deployment)
- Backend läuft (NestJS + PostgreSQL + Keycloak)

### Installation

```bash
# Repository klonen
git clone <repository-url>
cd swe-react-frontend

# Dependencies installieren
pnpm install

# Entwicklungsserver starten
pnpm dev
```

Die Anwendung ist dann unter `http://localhost:3000` erreichbar.

### Umgebungsvariablen

Passe `.env.development` an deine lokale Umgebung an:

```env
VITE_GRAPHQL_URI=https://localhost:3000/graphql
VITE_KEYCLOAK_URL=https://localhost:8443
VITE_KEYCLOAK_REALM=acme
VITE_KEYCLOAK_CLIENT_ID=buch-frontend
```

## 📜 Verfügbare Scripts

| Script | Beschreibung |
|--------|-------------|
| `pnpm dev` | Startet Entwicklungsserver mit HMR |
| `pnpm build` | Erstellt Production Build |
| `pnpm preview` | Vorschau des Production Builds |
| `pnpm lint` | ESLint Prüfung |
| `pnpm lint:fix` | ESLint mit Auto-Fix |
| `pnpm format` | Formatierung mit Prettier |
| `pnpm format:check` | Formatierung prüfen |
| `pnpm test:e2e` | E2E-Tests mit Playwright |
| `pnpm test:e2e:ui` | E2E-Tests mit UI |

## 🐳 Docker Deployment

### SSL-Zertifikate generieren (lokal)

```powershell
# PowerShell
.\docker\generate-certs.ps1
```

### Container starten

```bash
# Image bauen und Container starten
docker compose up -d

# Logs anzeigen
docker compose logs -f

# Container stoppen
docker compose down
```

Die Anwendung ist dann unter `https://localhost` erreichbar.

## 🧪 Testing

### E2E-Tests mit Playwright

```bash
# Tests ausführen
pnpm test:e2e

# Tests mit UI
pnpm test:e2e:ui

# Spezifischen Browser
pnpm test:e2e --project=chromium
```

### Page Objects

Tests verwenden das Page Object Pattern für bessere Wartbarkeit:

```typescript
// tests/e2e/specs/example.spec.ts
import { test, expect } from '../fixtures';

test('sollte zur Suchseite navigieren', async ({ homePage, page }) => {
    await homePage.goto();
    await homePage.goToSearch();
    await expect(page).toHaveURL(/\/suche/);
});
```

## 🔐 Authentifizierung

Die Anwendung verwendet Keycloak für die Authentifizierung:

1. **Login**: Benutzer wird zu Keycloak weitergeleitet
2. **Token**: Nach erfolgreichem Login erhält die App ein JWT
3. **Protected Routes**: Bestimmte Seiten erfordern Authentifizierung
4. **Rollen**: Benutzer können verschiedene Rollen haben (z.B. admin)

## 📝 Nächste Schritte

- [ ] Suchformular implementieren (Textfelder, Dropdown, Radiobuttons, Checkboxen)
- [ ] Suchergebnisse mit Pagination anzeigen
- [ ] Detailansicht für Bücher
- [ ] Formular zum Anlegen neuer Bücher mit Validierung
- [ ] Bearbeiten und Löschen von Büchern

## 📚 Dokumentation

- [React](https://react.dev/)
- [Vite](https://vitejs.dev/)
- [Apollo Client](https://www.apollographql.com/docs/react/)
- [React Router](https://reactrouter.com/)
- [Keycloak JS](https://www.keycloak.org/docs/latest/securing_apps/)
- [Bootstrap](https://getbootstrap.com/)
- [Playwright](https://playwright.dev/)

---

*SWE Projekt - Hochschule Karlsruhe*