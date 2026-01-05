/**
 * Hero Section Component
 *
 * Zeigt den Titel und Untertitel der Homepage an.
 */

import { Row, Col } from 'react-bootstrap';

export function HeroSection() {
    return (
        <Row className="mb-5 mt-5">
            <Col className="text-center">
                <h1 className="display-3 fw-bold mb-4">Buchverwaltung</h1>
            </Col>
        </Row>
    );
}
