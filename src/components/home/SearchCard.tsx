/**
 * Search Card Component
 *
 * Hauptkarte auf der Startseite mit Link zur Suchfunktion.
 */

import { Row, Col, Button } from 'react-bootstrap';
import { Link } from 'react-router-dom';

export function SearchCard() {
    return (
        <Row className="justify-content-center mb-5">
            <Col className="text-center">
                <Link to="/suche">
                    <Button variant="primary" size="lg" className="px-5 py-3">
                        Zur Suche
                    </Button>
                </Link>
            </Col>
        </Row>
    );
}
