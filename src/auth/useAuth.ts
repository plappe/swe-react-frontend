/**
 * useAuth Hook
 *
 * Custom Hook für den Zugriff auf Auth-Funktionen.
 * Separiert von AuthProvider für Fast Refresh Kompatibilität.
 */

import { useContext } from 'react';
import { AuthContext } from './AuthContext';
import type { AuthContextType } from '../types';

/**
 * Custom Hook für Auth Context
 *
 * Ermöglicht einfachen Zugriff auf Auth-Funktionen:
 * const { isAuthenticated, user, login, logout } = useAuth();
 */
export function useAuth(): AuthContextType {
    const context = useContext(AuthContext);

    if (context === undefined) {
        throw new Error('useAuth muss innerhalb eines AuthProvider verwendet werden');
    }

    return context;
}
