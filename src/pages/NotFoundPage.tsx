/**
 * 404 Not Found Page
 *
 * Wird angezeigt wenn keine Route passt.
 */

import { Container, Button } from 'react-bootstrap';
import { Link } from 'react-router-dom';

export function NotFoundPage() {
    return (
        <Container className="py-5 text-center">
            <h1 className="display-1">404</h1>
            <h2 className="mb-4">Seite nicht gefunden</h2>
            <p className="text-muted mb-4">
                Die angeforderte Seite existiert nicht oder wurde verschoben.
            </p>
            <Link to="/">
                <Button variant="primary">Zur Startseite</Button>
            </Link>
        </Container>
    );
}
