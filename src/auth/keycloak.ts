/**
 * Keycloak Konfiguration
 *
 * Dokumentation: https://www.keycloak.org/docs/latest/securing_apps/
 */

import Keycloak from 'keycloak-js';

/** Keycloak Instanz - Konfiguration aus Umgebungsvariablen */
export const keycloak = new Keycloak({
    url: import.meta.env.VITE_KEYCLOAK_URL || 'https://localhost:8843',
    realm: import.meta.env.VITE_KEYCLOAK_REALM || 'nest',
    clientId: import.meta.env.VITE_KEYCLOAK_CLIENT_ID || 'nest-client',
});

/**
 * Keycloak Initialisierungs-Optionen
 *
 * - check-sso: Prüft bestehende Session ohne Login-Redirect
 * - PKCE: Sicherheitsfeature für OAuth2
 */
export const keycloakInitOptions = {
    onLoad: 'check-sso' as const,
    silentCheckSsoRedirectUri: `${window.location.origin}/silent-check-sso.html`,
    pkceMethod: 'S256' as const,
};
