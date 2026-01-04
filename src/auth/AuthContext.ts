/**
 * Auth Context
 *
 * Separiert für Fast Refresh Kompatibilität.
 */

import { createContext } from 'react';
import type { AuthContextType } from '../types';

/**
 * Auth Context erstellen
 *
 * createContext erstellt einen neuen Context.
 * Der Standardwert (undefined) wird verwendet wenn kein Provider existiert.
 */
export const AuthContext = createContext<AuthContextType | undefined>(undefined);
