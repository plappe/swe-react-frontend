/**
 * User Menu Component
 *
 * Zeigt ein Dropdown-Menü mit Benutzerinformationen und Logout-Option.
 */

import { NavDropdown } from 'react-bootstrap';
import { useAuth } from '../../auth';

export function UserMenu() {
    const { user, logout } = useAuth();

    // Extrahiere die Rolle aus den Keycloak-Rollen
    // Suche nach 'admin' oder 'user' in den Rollen
    const role = user?.roles?.find((r) => r === 'admin' || r === 'user') || 'user';

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
            <NavDropdown.ItemText>
                <div className="text-muted small">Angemeldet als</div>
                <strong>{user?.username}</strong>
            </NavDropdown.ItemText>
            <NavDropdown.Divider />
            <NavDropdown.Item onClick={logout}>
                <i className="bi bi-box-arrow-right me-2"></i>
                Abmelden
            </NavDropdown.Item>
        </NavDropdown>
    );
}
