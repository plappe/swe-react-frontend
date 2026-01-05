/**
 * Direct Auth Provider
 *
 * Verwendet Keycloak Direct Access Grants statt der keycloak-js Library.
 * Für Clients mit "Client authentication ON".
 */

import { useState, useEffect, useCallback, type ReactNode } from 'react';
import { AuthContext } from './AuthContext';
import type { AuthContextType, User } from '../types';
import { loginWithPassword, logout as keycloakLogout, decodeToken } from './keycloakDirect';

interface AuthProviderProps {
    children: ReactNode;
}

export function DirectAuthProvider({ children }: AuthProviderProps) {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [user, setUser] = useState<User | null>(null);
    const [token, setToken] = useState<string | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [refreshTokenValue, setRefreshTokenValue] = useState<string | null>(null);

    /**
     * Benutzerinformationen aus Token extrahieren
     */
    const extractUser = useCallback((accessToken: string): User => {
        const payload = decodeToken(accessToken);

        // Extrahiere Client-spezifische Rollen
        const clientRoles = payload.resource_access?.['nest-client']?.roles ?? [];
        const realmRoles = payload.realm_access?.roles ?? [];
        const allRoles = [...clientRoles, ...realmRoles];

        return {
            id: payload.sub,
            username: payload.preferred_username,
            email: payload.email,
            firstName: payload.given_name,
            lastName: payload.family_name,
            roles: allRoles,
        };
    }, []);

    /**
     * Login mit Benutzername und Passwort
     */
    const login = useCallback(async (username?: string, password?: string) => {
        if (!username || !password) {
            throw new Error('Benutzername und Passwort sind erforderlich');
        }
        try {
            const response = await loginWithPassword(username, password);

            // Token speichern
            setToken(response.access_token);
            setRefreshTokenValue(response.refresh_token);
            localStorage.setItem('auth_token', response.access_token);
            localStorage.setItem('refresh_token', response.refresh_token);

            // User extrahieren
            const currentUser = extractUser(response.access_token);
            setUser(currentUser);
            setIsAuthenticated(true);
            setError(null);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Login fehlgeschlagen');
            throw err;
        }
    }, [extractUser]);

    /**
     * Logout
     */
    const logout = useCallback(async () => {
        try {
            if (refreshTokenValue) {
                await keycloakLogout(refreshTokenValue);
            }
        } catch (err) {
            console.error('Logout error:', err);
        } finally {
            // Immer State clearen
            setIsAuthenticated(false);
            setUser(null);
            setToken(null);
            setRefreshTokenValue(null);
            localStorage.removeItem('auth_token');
            localStorage.removeItem('refresh_token');
        }
    }, [refreshTokenValue]);

    /**
     * Token abrufen (mit automatischem Refresh)
     */
    const getToken = useCallback(async (): Promise<string | null> => {
        if (!token || !refreshTokenValue) return null;

        // TODO: Prüfe ob Token bald abläuft und refreshe wenn nötig
        // Für jetzt geben wir einfach den aktuellen Token zurück
        return token;
    }, [token, refreshTokenValue]);

    /**
     * Beim App-Start: Prüfe ob Token im LocalStorage vorhanden ist
     */
    useEffect(() => {
        const savedToken = localStorage.getItem('auth_token');
        const savedRefreshToken = localStorage.getItem('refresh_token');

        if (savedToken && savedRefreshToken) {
            try {
                const currentUser = extractUser(savedToken);
                setUser(currentUser);
                setToken(savedToken);
                setRefreshTokenValue(savedRefreshToken);
                setIsAuthenticated(true);
            } catch {
                // Token ungültig, clearen
                localStorage.removeItem('auth_token');
                localStorage.removeItem('refresh_token');
            }
        }

        setIsLoading(false);
    }, [extractUser]);

    const contextValue: AuthContextType = {
        isAuthenticated,
        isLoading,
        user,
        token,
        error,
        login,
        logout,
        getToken,
    };

    return <AuthContext.Provider value={contextValue}>{children}</AuthContext.Provider>;
}
