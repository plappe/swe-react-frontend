/**
 * Login Form Component
 *
 * Formular für die Benutzeranmeldung mit Keycloak Direct Access.
 */

import { useState, FormEvent } from 'react';
import { Container, Card, Form, Button, Alert } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../auth';

export function LoginForm() {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(false);

    const { login } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();
        setError(null);
        setIsLoading(true);

        try {
            await login(username, password);
            navigate('/'); // Redirect nach erfolgreicher Anmeldung
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Anmeldung fehlgeschlagen');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <Container className="d-flex justify-content-center align-items-center min-vh-100">
            <Card style={{ width: '100%', maxWidth: '400px' }} className="shadow">
                <Card.Body className="p-4">
                    <h2 className="text-center mb-4">Anmeldung</h2>

                    {error && <Alert variant="danger">{error}</Alert>}

                    <Form onSubmit={handleSubmit}>
                        <Form.Group className="mb-3" controlId="username">
                            <Form.Label>Benutzername</Form.Label>
                            <Form.Control
                                type="text"
                                placeholder="admin oder user"
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                                required
                                autoFocus
                            />
                        </Form.Group>

                        <Form.Group className="mb-3" controlId="password">
                            <Form.Label>Passwort</Form.Label>
                            <Form.Control
                                type="password"
                                placeholder="Passwort eingeben"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                            />
                        </Form.Group>

                        <div className="d-grid">
                            <Button variant="primary" type="submit" size="lg" disabled={isLoading}>
                                {isLoading ? 'Anmeldung läuft...' : 'Anmelden'}
                            </Button>
                        </div>
                    </Form>

                    <div className="text-center mt-3 text-muted small">
                        <p className="mb-1">Testbenutzer:</p>
                        <p className="mb-0">admin/p (Administrator)</p>
                        <p>user/p (Benutzer)</p>
                    </div>
                </Card.Body>
            </Card>
        </Container>
    );
}
