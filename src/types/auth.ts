/**
 * Auth Types
 *
 * Typen für die Keycloak-Authentifizierung
 */

/**
 * Benutzerinformationen aus dem Keycloak Token
 */
export interface User {
    id: string;
    username: string;
    email?: string;
    firstName?: string;
    lastName?: string;
    roles: string[];
}

/**
 * Auth Context State
 */
export interface AuthState {
    isAuthenticated: boolean;
    isLoading: boolean;
    user: User | null;
    token: string | null;
    error: string | null;
}

/**
 * Auth Context Actions
 */
export interface AuthContextType extends AuthState {
    login: () => Promise<void>;
    logout: () => Promise<void>;
    getToken: () => Promise<string | null>;
}
