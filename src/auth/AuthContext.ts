/**
 * AuthContext - React Context für Authentifizierung
 *
 * Separiert für Fast Refresh Kompatibilität.
 */

import { createContext } from 'react';
import type { AuthContextType } from '../types';

export const AuthContext = createContext<AuthContextType | undefined>(undefined);
