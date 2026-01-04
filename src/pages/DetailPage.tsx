/**
 * Detail Page (Buchdetails)
 *
 * Zeigt alle Details eines einzelnen Buchs an.
 * Die ID kommt aus der URL (Route Parameter).
 *
 * TODO: Implementierung in weiteren Schritten
 */

import { Container, Alert } from 'react-bootstrap';
import { useParams } from 'react-router-dom';

export function DetailPage() {
    // useParams extrahiert Parameter aus der URL
    // Bei Route "/buch/:id" enthält params.id den Wert
    const { id } = useParams<{ id: string }>();

    return (
        <Container className="py-4">
            <h1>📖 Buchdetails</h1>
            <Alert variant="info">
                <Alert.Heading>In Entwicklung</Alert.Heading>
                <p>
                    Die Detailansicht für Buch mit ID <strong>{id}</strong> wird in einem der
                    nächsten Schritte implementiert.
                </p>
                <p>Geplante Features:</p>
                <ul>
                    <li>Anzeige aller Buchdaten (Titel, ISBN, Preis, etc.)</li>
                    <li>Anzeige der Abbildungen</li>
                    <li>Bearbeiten-Button (für eingeloggte Benutzer)</li>
                    <li>Löschen-Button (für Admins)</li>
                </ul>
            </Alert>
        </Container>
    );
}
