/**
 * Login Button Component
 *
 * Zeigt den Login-Button für nicht authentifizierte Benutzer.
 */

import { Button } from 'react-bootstrap';
import { Link } from 'react-router-dom';

export function LoginButton() {
    return (
        <Link to="/login">
            <Button variant="outline-light">
                <i className="bi bi-box-arrow-in-right me-2"></i>
                Anmelden
            </Button>
        </Link>
    );
}
