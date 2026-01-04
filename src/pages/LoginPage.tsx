/**
 * Login Page
 *
 * Zeigt Login-Optionen und Fehlermeldungen.
 * Das eigentliche Login wird von Keycloak durchgeführt.
 */

import { useEffect } from 'react';
import { Container, Card, Button, Alert, Spinner } from 'react-bootstrap';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../auth';

/**
 * Location State Type
 * Speichert die ursprüngliche URL für Redirect nach Login
 */
interface LocationState {
    from?: {
        pathname: string;
    };
}

export function LoginPage() {
    const { isAuthenticated, isLoading, error, login } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();

    // Ursprüngliche URL aus dem State holen
    const state = location.state as LocationState;
    const from = state?.from?.pathname || '/';

    // Redirect wenn bereits eingeloggt
    useEffect(() => {
        if (isAuthenticated && !isLoading) {
            navigate(from, { replace: true });
        }
    }, [isAuthenticated, isLoading, navigate, from]);

    // Loading State
    if (isLoading) {
        return (
            <Container className="d-flex justify-content-center align-items-center min-vh-100">
                <Spinner animation="border" role="status">
                    <span className="visually-hidden">Laden...</span>
                </Spinner>
            </Container>
        );
    }

    return (
        <Container className="py-5">
            <Card className="mx-auto" style={{ maxWidth: '400px' }}>
                <Card.Header className="text-center bg-primary text-white">
                    <h4 className="mb-0">🔐 Anmeldung</h4>
                </Card.Header>
                <Card.Body className="p-4">
                    {/* Fehlermeldung */}
                    {error && <Alert variant="danger">{error}</Alert>}

                    {/* Info-Text */}
                    <p className="text-muted text-center mb-4">
                        Melden Sie sich an, um Bücher anzulegen, zu bearbeiten oder zu löschen.
                    </p>

                    {/* Login Button */}
                    <div className="d-grid">
                        <Button variant="primary" size="lg" onClick={login}>
                            Mit Keycloak anmelden
                        </Button>
                    </div>

                    {/* Hinweis */}
                    <small className="text-muted d-block text-center mt-3">
                        Sie werden zur Keycloak-Anmeldeseite weitergeleitet.
                    </small>
                </Card.Body>
            </Card>
        </Container>
    );
}
