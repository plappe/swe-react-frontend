/**
 * Auth Provider
 *
 * Ein React Context Provider der Authentifizierungsfunktionen
 * in der gesamten Anwendung verfügbar macht.
 *
 * React Context ist ein Mechanismus um Daten durch den
 * Komponentenbaum zu "tunneln" ohne Props durchzureichen.
 */

import { useState, useEffect, useCallback, useRef, type ReactNode } from 'react';
import { keycloak, keycloakInitOptions } from './keycloak';
import { AuthContext } from './AuthContext';
import type { AuthContextType, User } from '../types';

/**
 * Props für den AuthProvider
 */
interface AuthProviderProps {
    children: ReactNode;
}

/**
 * AuthProvider Komponente
 *
 * Diese Komponente:
 * 1. Initialisiert Keycloak beim App-Start
 * 2. Verwaltet den Authentifizierungsstatus
 * 3. Stellt Login/Logout Funktionen bereit
 * 4. Aktualisiert Tokens automatisch
 */
export function AuthProvider({ children }: AuthProviderProps) {
    // State für Authentifizierung
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [user, setUser] = useState<User | null>(null);
    const [token, setToken] = useState<string | null>(null);
    const [error, setError] = useState<string | null>(null);
    
    // Ref to track if Keycloak is already initialized (prevents double init in StrictMode)
    const isInitialized = useRef(false);

    /**
     * Benutzerinformationen aus Keycloak Token extrahieren
     */
    const extractUser = useCallback((): User | null => {
        if (!keycloak.tokenParsed) return null;

        const tokenParsed = keycloak.tokenParsed as {
            sub?: string;
            preferred_username?: string;
            email?: string;
            given_name?: string;
            family_name?: string;
            realm_access?: { roles?: string[] };
            resource_access?: {
                'nest-client'?: { roles?: string[] };
            };
        };

        // Extrahiere Client-spezifische Rollen (nest-client admin/user)
        const clientRoles = tokenParsed.resource_access?.['nest-client']?.roles ?? [];
        // Kombiniere mit Realm-Rollen falls vorhanden
        const realmRoles = tokenParsed.realm_access?.roles ?? [];
        const allRoles = [...clientRoles, ...realmRoles];

        return {
            id: tokenParsed.sub ?? '',
            username: tokenParsed.preferred_username ?? '',
            email: tokenParsed.email,
            firstName: tokenParsed.given_name,
            lastName: tokenParsed.family_name,
            roles: allRoles,
        };
    }, []);

    /**
     * Login Funktion
     *
     * Leitet zur Keycloak Login-Seite weiter.
     * Nach erfolgreichem Login wird zurück zur App geleitet.
     */
    const login = useCallback(async () => {
        try {
            await keycloak.login({
                redirectUri: window.location.origin,
            });
        } catch (err) {
            setError('Login fehlgeschlagen');
            console.error('Login error:', err);
        }
    }, []);

    /**
     * Logout Funktion
     *
     * Beendet die Session bei Keycloak und leitet zur Startseite.
     */
    const logout = useCallback(async () => {
        try {
            await keycloak.logout({
                redirectUri: window.location.origin,
            });
        } catch (err) {
            setError('Logout fehlgeschlagen');
            console.error('Logout error:', err);
        }
    }, []);

    /**
     * Token abrufen
     *
     * Gibt das aktuelle Token zurück.
     * Aktualisiert das Token wenn es bald abläuft (< 30 Sekunden).
     */
    const getToken = useCallback(async (): Promise<string | null> => {
        try {
            // Token aktualisieren wenn es in weniger als 30 Sekunden abläuft
            await keycloak.updateToken(30);
            return keycloak.token ?? null;
        } catch {
            // Token konnte nicht aktualisiert werden -> neu einloggen
            setIsAuthenticated(false);
            setUser(null);
            setToken(null);
            return null;
        }
    }, []);

    /**
     * Keycloak initialisieren beim App-Start
     */
    useEffect(() => {
        // Prevent double initialization in React StrictMode
        if (isInitialized.current) {
            return;
        }
        
        const initKeycloak = async () => {
            try {
                isInitialized.current = true;
                
                // Keycloak initialisieren
                const authenticated = await keycloak.init(keycloakInitOptions);
                
                setIsAuthenticated(authenticated);

                if (authenticated) {
                    const currentUser = extractUser();
                    setUser(currentUser);
                    setToken(keycloak.token ?? null);

                    // Token im localStorage speichern für Apollo Client
                    if (keycloak.token) {
                        localStorage.setItem('auth_token', keycloak.token);
                    }
                }
            } catch (err) {
                setError('Keycloak Initialisierung fehlgeschlagen');
                console.error('Keycloak init error:', err);
            } finally {
                setIsLoading(false);
            }
        };

        initKeycloak();

        // Token-Refresh Event Handler
        keycloak.onTokenExpired = () => {
            keycloak
                .updateToken(30)
                .then(() => {
                    setToken(keycloak.token ?? null);
                    if (keycloak.token) {
                        localStorage.setItem('auth_token', keycloak.token);
                    }
                })
                .catch(() => {
                    setIsAuthenticated(false);
                    setUser(null);
                    setToken(null);
                    localStorage.removeItem('auth_token');
                });
        };

        // Cleanup bei Unmount
        return () => {
            keycloak.onTokenExpired = undefined;
        };
    }, [extractUser]);

    // Context-Wert der an alle Kinder weitergegeben wird
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
