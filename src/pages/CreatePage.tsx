/**
 * Create Page (Neues Buch anlegen)
 *
 * Formular zum Anlegen eines neuen Buchs.
 * Nur für eingeloggte Benutzer zugänglich.
 *
 * TODO: Implementierung in weiteren Schritten
 */

import { Container, Alert } from 'react-bootstrap';

export function CreatePage() {
    return (
        <Container className="py-4">
            <h1>➕ Neues Buch anlegen</h1>
            <Alert variant="info">
                <Alert.Heading>In Entwicklung</Alert.Heading>
                <p>Das Formular zum Anlegen eines neuen Buchs wird in einem der nächsten Schritte implementiert.</p>
                <p>Geplante Features:</p>
                <ul>
                    <li>Eingabefelder für alle Buchdaten</li>
                    <li>Client-seitige Validierung</li>
                    <li>Server-seitige Fehlerbehandlung</li>
                    <li>Erfolgs-/Fehlermeldungen</li>
                </ul>
            </Alert>
        </Container>
    );
}
