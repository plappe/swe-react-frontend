/**
 * Header Komponente
 *
 * Die Navigationsleiste der Anwendung.
 * Verwendet React-Bootstrap für responsive Gestaltung.
 */

import { Navbar, Nav, Container, Button } from 'react-bootstrap';
import { Link, NavLink } from 'react-router-dom';
import { useAuth } from '../../auth';

/**
 * Header
 *
 * Features:
 * - Responsive Navigation (Hamburger-Menü auf mobilen Geräten)
 * - Aktive Route wird hervorgehoben (NavLink)
 * - Login/Logout Button je nach Auth-Status
 */
export function Header() {
    const { isAuthenticated, user, login, logout } = useAuth();

    return (
        <Navbar bg="dark" variant="dark" expand="lg" sticky="top">
            <Container>
                {/* Logo/Brand */}
                <Navbar.Brand as={Link} to="/">
                    📚 Buchverwaltung
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

                    {/* Rechte Seite: Login/User Info */}
                    <Nav>
                        {isAuthenticated ? (
                            <>
                                <Navbar.Text className="me-3">
                                    Angemeldet als: <strong>{user?.username}</strong>
                                </Navbar.Text>
                                <Button variant="outline-light" onClick={logout}>
                                    Logout
                                </Button>
                            </>
                        ) : (
                            <Button variant="outline-light" onClick={login}>
                                Login
                            </Button>
                        )}
                    </Nav>
                </Navbar.Collapse>
            </Container>
        </Navbar>
    );
}
