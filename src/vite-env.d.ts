/// <reference types="vite/client" />

/**
 * TypeScript Definitionen für Umgebungsvariablen
 *
 * Erweitert ImportMetaEnv um unsere eigenen Variablen.
 * Ermöglicht Autovervollständigung und Typ-Prüfung.
 */
interface ImportMetaEnv {
    readonly VITE_GRAPHQL_URI: string;
    readonly VITE_KEYCLOAK_URL: string;
    readonly VITE_KEYCLOAK_REALM: string;
    readonly VITE_KEYCLOAK_CLIENT_ID: string;
    readonly DEV: boolean;
    readonly PROD: boolean;
    readonly MODE: string;
}

interface ImportMeta {
    readonly env: ImportMetaEnv;
}
