/**
 * User Menu Component
 *
 * Zeigt ein Dropdown-Menü mit Benutzerinformationen und Logout-Option.
 */

import { NavDropdown } from 'react-bootstrap';
import { useAuth } from '../../auth';
import { ROLES } from '../../constants';

export function UserMenu() {
    const { user, logout } = useAuth();

    /** Bestimme die Hauptrolle des Benutzers für Anzeige */
    const role = user?.roles?.find((r) => r === ROLES.ADMIN || r === ROLES.USER) || ROLES.USER;

    return (
        <NavDropdown
            title={
                <span>
                    <i className="bi bi-person-circle me-2"></i>
                    {role.charAt(0).toUpperCase() + role.slice(1)}
                </span>
            }
            id="user-dropdown"
            align="end"
        >
            <NavDropdown.Item onClick={logout}>
                <i className="bi bi-box-arrow-right me-2"></i>
                Abmelden
            </NavDropdown.Item>
        </NavDropdown>
    );
}
