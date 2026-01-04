/**
 * Footer Komponente
 *
 * Der Fußbereich der Anwendung.
 * Zeigt Copyright und Links an.
 */

import { Container } from 'react-bootstrap';

/**
 * Footer
 *
 * sticky="bottom" würde den Footer am unteren Rand fixieren,
 * aber wir verwenden stattdessen Flexbox im App-Container.
 */
export function Footer() {
    const currentYear = new Date().getFullYear();

    return (
        <footer className="bg-dark text-light py-3 mt-auto">
            <Container className="text-center">
                <small>&copy; {currentYear} Buchverwaltung - SWE Projekt</small>
            </Container>
        </footer>
    );
}
