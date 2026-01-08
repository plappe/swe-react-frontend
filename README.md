# 📚 Buchverwaltung Frontend

Eine Single Page Application (SPA) für die Buchverwaltung, entwickelt mit React, Vite und TypeScript.

## 🛠️ Tech Stack

| Kategorie | Technologie |
| --------- | ----------- |
| **Web Framework** | React 19 + Vite 7 |
| **Sprache** | TypeScript |
| **CSS Framework** | Bootstrap 5 |
| **API Client** | Apollo Client (GraphQL) |
| **Routing** | React Router v6 |
| **Authentifizierung** | Keycloak |
| **Linting** | ESLint 9 (Flat Config) |
| **Formatierung** | Prettier |
| **E2E Tests** | Playwright |
| **Package Manager** | npm |
| **Containerisierung** | Docker + NGINX |

## ✨ Features

- **Buchsuche** mit erweiterten Filtern (ISBN, Titel, Art, Rating, Lieferbarkeit)
- **Pagination** für Suchergebnisse
- **Buch-Erstellung** mit Formularvalidierung (Admin-Bereich)
- **Keycloak Integration** für Authentifizierung und Autorisierung
- **Responsive Design** mit Bootstrap 5
- **GraphQL API** für effiziente Datenabfragen
- **E2E Tests** mit Playwright und Page Object Pattern

## 🚀 Schnellstart

### Voraussetzungen

- Node.js >= 22
- npm >= 10
- Docker (für Container-Deployment)
- Backend läuft auf `https://localhost:3000` (NestJS + PostgreSQL + Keycloak)

### Installation

```bash
# Repository klonen
git clone <repository-url>
cd swe-react-frontend

# Dependencies installieren
npm install

# Entwicklungsserver starten
npm run dev
```

Die Anwendung ist dann unter `http://localhost:5173` erreichbar.

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
| ------ | ----------- |
| `npm run dev` | Startet Entwicklungsserver mit HMR |
| `npm run build` | Erstellt Production Build |
| `npm run preview` | Vorschau des Production Builds |
| `npm run lint` | ESLint Prüfung |
| `npm run lint:fix` | ESLint mit Auto-Fix |
| `npm run format` | Formatierung mit Prettier |
| `npm run format:check` | Formatierung prüfen |
| `npm run test:e2e` | E2E-Tests mit Playwright |
| `npm run test:e2e:ui` | E2E-Tests mit UI |

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
npm run test:e2e

# Tests mit UI
npm run test:e2e:ui

# Spezifischen Browser
npm run test:e2e -- --project=chromium
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
4. **Rollen**: Admin-Rolle für geschützte Bereiche (z.B. Buch-Erstellung)

## 📐 Architektur

- **Component-Based**: Wiederverwendbare UI-Komponenten
- **Page Objects**: Test-Pattern für bessere Wartbarkeit
- **Context API**: Zentrale Authentifizierungsverwaltung
- **GraphQL**: Typsichere API-Kommunikation
- **Error Handling**: Deutsche Fehlermeldungen mit zentralem Error Parser

## 📚 Dokumentation

- [React](https://react.dev/)
- [Vite](https://vitejs.dev/)
- [Apollo Client](https://www.apollographql.com/docs/react/)
- [React Router](https://reactrouter.com/)
- [Keycloak JS](https://www.keycloak.org/docs/latest/securing_apps/)
- [Bootstrap](https://getbootstrap.com/)
- [Playwright](https://playwright.dev/)

---

SWE Projekt - Hochschule Karlsruhe
