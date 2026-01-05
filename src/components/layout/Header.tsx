/**
 * Header Komponente
 *
 * Die Navigationsleiste der Anwendung.
 * Verwendet React-Bootstrap für responsive Gestaltung.
 */

import { Navbar, Nav, Container } from 'react-bootstrap';
import { Link, NavLink } from 'react-router-dom';
import { useAuth } from '../../auth';
import { UserMenu } from './UserMenu';
import { LoginButton } from './LoginButton';

/**
 * Header
 *
 * Features:
 * - Responsive Navigation (Hamburger-Menü auf mobilen Geräten)
 * - Aktive Route wird hervorgehoben (NavLink)
 * - Login/User-Menü je nach Auth-Status
 */
export function Header() {
    const { isAuthenticated } = useAuth();

    return (
        <Navbar bg="dark" variant="dark" expand="lg" sticky="top">
            <Container>
                {/* Logo/Brand */}
                <Navbar.Brand as={Link} to="/">
                    Buchverwaltung
                </Navbar.Brand>

                {/* Hamburger-Button für mobile Ansicht */}
                <Navbar.Toggle aria-controls="main-navbar" />

                {/* Navigationselemente */}
                <Navbar.Collapse id="main-navbar">
                    <Nav className="me-auto">
                        {/* NavLink fügt automatisch "active" Klasse hinzu */}
                        <Nav.Link as={NavLink} to="/">
                            Home
                        </Nav.Link>
                        <Nav.Link as={NavLink} to="/suche">
                            Suche
                        </Nav.Link>
                        {/* "Neu anlegen" nur für eingeloggte Benutzer */}
                        {isAuthenticated && (
                            <Nav.Link as={NavLink} to="/neu">
                                Neues Buch
                            </Nav.Link>
                        )}
                    </Nav>

                    {/* Rechte Seite: Login/User Menu */}
                    <Nav>
                        {isAuthenticated ? <UserMenu /> : <LoginButton />}
                    </Nav>
                </Navbar.Collapse>
            </Container>
        </Navbar>
    );
}
