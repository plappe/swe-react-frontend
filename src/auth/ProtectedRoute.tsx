/**
 * Protected Route Komponente
 *
 * Eine Higher-Order-Component (HOC) die Routen schützt.
 * Nur authentifizierte Benutzer können geschützte Inhalte sehen.
 */

import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from './useAuth';
import { Spinner, Container } from 'react-bootstrap';
import type { ReactNode } from 'react';

interface ProtectedRouteProps {
    children: ReactNode;
    /** Erforderliche Rollen für den Zugriff (optional) */
    requiredRoles?: string[];
}

/**
 * ProtectedRoute
 *
 * Verwendung:
 * <Route path="/admin" element={
 *   <ProtectedRoute requiredRoles={['admin']}>
 *     <AdminPage />
 *   </ProtectedRoute>
 * } />
 */
export function ProtectedRoute({ children, requiredRoles = [] }: ProtectedRouteProps) {
    const { isAuthenticated, isLoading, user } = useAuth();
    const location = useLocation();

    // Warten während Auth-Status geprüft wird
    if (isLoading) {
        return (
            <Container className="d-flex justify-content-center align-items-center min-vh-100">
                <Spinner animation="border" role="status">
                    <span className="visually-hidden">Laden...</span>
                </Spinner>
            </Container>
        );
    }

    /** Nicht eingeloggt -> zur Login-Seite weiterleiten */
    if (!isAuthenticated) {
        /** State speichert ursprüngliche URL für Redirect nach Login */
        return <Navigate to="/login" state={{ from: location }} replace />;
    }

    /** Rollen prüfen (falls angegeben) */
    if (requiredRoles.length > 0) {
        const hasRequiredRole = requiredRoles.some((role) => user?.roles.includes(role));

        if (!hasRequiredRole) {
            /** Keine Berechtigung -> zur Startseite */
            return <Navigate to="/" replace />;
        }
    }

    /** Zugriff erlaubt */
    return <>{children}</>;
}
