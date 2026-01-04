/**
 * Search Page (Suchformular)
 *
 * Ermöglicht die Suche nach Büchern mit verschiedenen Kriterien.
 * Zeigt Suchergebnisse mit Pagination an.
 *
 * TODO: Implementierung in weiteren Schritten
 */

import { Container, Alert } from 'react-bootstrap';

export function SearchPage() {
    return (
        <Container className="py-4">
            <h1>🔍 Buchsuche</h1>
            <Alert variant="info">
                <Alert.Heading>In Entwicklung</Alert.Heading>
                <p>
                    Das Suchformular wird in einem der nächsten Schritte implementiert. Geplante
                    Features:
                </p>
                <ul>
                    <li>Textfelder für ISBN und Titel</li>
                    <li>Dropdown für Buchart (EPUB, HARDCOVER, PAPERBACK)</li>
                    <li>Radiobuttons für Rating</li>
                    <li>Checkbox für "lieferbar"</li>
                    <li>Suchergebnisse mit Pagination</li>
                </ul>
            </Alert>
        </Container>
    );
}
