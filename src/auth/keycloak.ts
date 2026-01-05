/**
 * Keycloak Konfiguration
 *
 * Keycloak ist ein Open-Source Identity and Access Management System.
 * Es übernimmt:
 * - Benutzer-Authentifizierung (Login/Logout)
 * - Token-Verwaltung (JWT)
 * - Rollen-basierte Zugriffskontrolle (RBAC)
 *
 * Dokumentation: https://www.keycloak.org/docs/latest/securing_apps/
 */

import Keycloak from 'keycloak-js';

/**
 * Keycloak Instanz
 *
 * Konfigurationsoptionen:
 * - url: URL des Keycloak-Servers
 * - realm: Der "Realm" (Mandant) in Keycloak
 * - clientId: Die Client-ID für diese Anwendung
 *
 * Diese Werte werden aus Umgebungsvariablen gelesen,
 * damit verschiedene Umgebungen (Dev, Test, Prod) unterstützt werden.
 */
export const keycloak = new Keycloak({
    url: import.meta.env.VITE_KEYCLOAK_URL || 'https://localhost:8843',
    realm: import.meta.env.VITE_KEYCLOAK_REALM || 'nest',
    clientId: import.meta.env.VITE_KEYCLOAK_CLIENT_ID || 'nest-client',
});

/**
 * Keycloak Initialisierungs-Optionen
 *
 * onLoad: 'check-sso' prüft ob der Benutzer bereits eingeloggt ist
 * (via Session Cookie), ohne Login-Seite anzuzeigen.
 *
 * Alternative: 'login-required' würde sofort zur Login-Seite weiterleiten.
 *
 * silentCheckSsoRedirectUri: Eine leere HTML-Seite für den SSO-Check
 * (wird im public/ Ordner erstellt)
 */
export const keycloakInitOptions = {
    onLoad: 'check-sso' as const,
    silentCheckSsoRedirectUri: `${window.location.origin}/silent-check-sso.html`,
    pkceMethod: 'S256' as const, // Sicherheitsfeature: PKCE
};
