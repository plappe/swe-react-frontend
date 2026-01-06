/**
 * Keycloak Direct Access Service
 *
 * Verwendet den "Direct Access Grants" Flow (Resource Owner Password Credentials)
 * für Clients mit "Client authentication ON".
 *
 * HINWEIS: Dies ist nur für Entwicklung/Lernen geeignet!
 * In Produktion sollte man den Authorization Code Flow mit PKCE verwenden.
 */

interface TokenResponse {
    access_token: string;
    refresh_token: string;
    expires_in: number;
    refresh_expires_in: number;
    token_type: string;
}

interface TokenPayload {
    sub: string;
    preferred_username: string;
    email?: string;
    given_name?: string;
    family_name?: string;
    resource_access?: {
        'nest-client'?: {
            roles?: string[];
        };
    };
    realm_access?: {
        roles?: string[];
    };
}

// In development, use proxy to avoid CORS issues
const IS_DEV = import.meta.env.DEV;
const KEYCLOAK_URL = IS_DEV
    ? '/auth'
    : import.meta.env.VITE_KEYCLOAK_URL || 'https://localhost:8843';
const REALM = import.meta.env.VITE_KEYCLOAK_REALM || 'nest';
const CLIENT_ID = import.meta.env.VITE_KEYCLOAK_CLIENT_ID || 'nest-client';
const CLIENT_SECRET = import.meta.env.VITE_KEYCLOAK_CLIENT_SECRET || '';

/**
 * Authentifizierung mit Benutzername und Passwort
 */
export async function loginWithPassword(
    username: string,
    password: string,
): Promise<TokenResponse> {
    const tokenUrl = `${KEYCLOAK_URL}/realms/${REALM}/protocol/openid-connect/token`;

    const body = new URLSearchParams({
        grant_type: 'password',
        client_id: CLIENT_ID,
        client_secret: CLIENT_SECRET,
        username,
        password,
    });

    const response = await fetch(tokenUrl, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: body.toString(),
    });

    if (!response.ok) {
        const error = await response.json().catch(() => ({ error: 'Unknown error' }));
        throw new Error(error.error_description || error.error || 'Login fehlgeschlagen');
    }

    return response.json();
}

/**
 * Token aktualisieren mit Refresh Token
 */
export async function refreshToken(refreshToken: string): Promise<TokenResponse> {
    const tokenUrl = `${KEYCLOAK_URL}/realms/${REALM}/protocol/openid-connect/token`;

    const body = new URLSearchParams({
        grant_type: 'refresh_token',
        client_id: CLIENT_ID,
        client_secret: CLIENT_SECRET,
        refresh_token: refreshToken,
    });

    const response = await fetch(tokenUrl, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: body.toString(),
    });

    if (!response.ok) {
        throw new Error('Token refresh fehlgeschlagen');
    }

    return response.json();
}

/**
 * Logout (Token widerrufen)
 */
export async function logout(refreshToken: string): Promise<void> {
    const logoutUrl = `${KEYCLOAK_URL}/realms/${REALM}/protocol/openid-connect/logout`;

    const body = new URLSearchParams({
        client_id: CLIENT_ID,
        client_secret: CLIENT_SECRET,
        refresh_token: refreshToken,
    });

    await fetch(logoutUrl, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: body.toString(),
    });
}

/**
 * JWT Token dekodieren
 */
export function decodeToken(token: string): TokenPayload {
    const parts = token.split('.');
    if (parts.length !== 3) {
        throw new Error('Invalid JWT token');
    }
    const base64Url = parts[1]!;
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(
        atob(base64)
            .split('')
            .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
            .join(''),
    );

    return JSON.parse(jsonPayload);
}
