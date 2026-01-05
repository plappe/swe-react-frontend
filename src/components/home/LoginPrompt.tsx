/**
 * Login Prompt Component
 *
 * Zeigt einen Hinweis zur Anmeldung für nicht-authentifizierte Benutzer.
 */

import { Row, Col } from 'react-bootstrap';
import { Link } from 'react-router-dom';

export function LoginPrompt() {
    return (
        <Row className="justify-content-center">
            <Col md={8} lg={6} className="text-center">
                <p className="text-muted">
                    Möchten Sie Bücher verwalten?{' '}
                    <Link to="/login" className="text-decoration-none fw-semibold">
                        Jetzt anmelden
                    </Link>
                </p>
            </Col>
        </Row>
    );
}
