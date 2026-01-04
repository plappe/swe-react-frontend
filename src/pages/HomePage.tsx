/**
 * Home Page
 *
 * Die Startseite der Anwendung.
 * Zeigt eine Willkommensnachricht und Navigation zu anderen Bereichen.
 */

import { Container, Row, Col, Card, Button } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { useAuth } from '../auth';

export function HomePage() {
    const { isAuthenticated } = useAuth();

    return (
        <Container className="py-5">
            {/* Hero Section */}
            <Row className="mb-5">
                <Col className="text-center">
                    <h1 className="display-4">📚 Willkommen zur Buchverwaltung</h1>
                    <p className="lead text-muted">
                        Verwalten Sie Ihre Bücher einfach und übersichtlich.
                    </p>
                </Col>
            </Row>

            {/* Feature Cards */}
            <Row className="g-4">
                {/* Suche Card */}
                <Col md={6} lg={4}>
                    <Card className="h-100 shadow-sm">
                        <Card.Body>
                            <Card.Title>🔍 Bücher suchen</Card.Title>
                            <Card.Text>
                                Durchsuchen Sie den Bestand nach ISBN, Titel, Art oder anderen
                                Kriterien.
                            </Card.Text>
                            <Link to="/suche">
                                <Button variant="primary">Zur Suche</Button>
                            </Link>
                        </Card.Body>
                    </Card>
                </Col>

                {/* Neues Buch Card */}
                <Col md={6} lg={4}>
                    <Card className="h-100 shadow-sm">
                        <Card.Body>
                            <Card.Title>➕ Neues Buch anlegen</Card.Title>
                            <Card.Text>
                                Fügen Sie ein neues Buch mit allen Details zum Bestand hinzu.
                            </Card.Text>
                            {isAuthenticated ? (
                                <Link to="/neu">
                                    <Button variant="success">Buch anlegen</Button>
                                </Link>
                            ) : (
                                <Link to="/login">
                                    <Button variant="outline-secondary">
                                        Anmeldung erforderlich
                                    </Button>
                                </Link>
                            )}
                        </Card.Body>
                    </Card>
                </Col>

                {/* Info Card */}
                <Col md={6} lg={4}>
                    <Card className="h-100 shadow-sm">
                        <Card.Body>
                            <Card.Title>ℹ️ Über die Anwendung</Card.Title>
                            <Card.Text>
                                Diese SPA wurde mit React, Vite, Bootstrap und GraphQL erstellt.
                            </Card.Text>
                            <small className="text-muted">SWE Projekt - Hochschule Karlsruhe</small>
                        </Card.Body>
                    </Card>
                </Col>
            </Row>
        </Container>
    );
}
