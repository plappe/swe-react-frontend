/**
 * Create Book Page Component
 *
 * Ermöglicht Admins das Erstellen neuer Bücher.
 * Nur für eingeloggte Admins zugänglich.
 */

import { useState, FormEvent, useEffect } from 'react';
import { Container, Form, Button, Alert, Card, Row, Col, Badge } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../auth';
import { apolloClient } from '../graphql';
import { ERSTELLE_BUCH } from '../graphql/mutations';
import { Buchart } from '../types';

interface TitelInput {
    titel: string;
    untertitel?: string;
}

interface AbbildungInput {
    beschriftung: string;
    contentType: string;
}

interface BuchInput {
    isbn: string;
    rating: number;
    art: Buchart;
    preis: number;
    rabatt?: number;
    lieferbar: boolean;
    datum?: string;
    homepage?: string;
    schlagwoerter?: string[];
    titel: TitelInput;
    abbildungen?: AbbildungInput[];
}

interface CreateBuchData {
    create: {
        id: string;
    };
}

interface CreateBuchVars {
    input: BuchInput;
}

export function CreateBookPage() {
    const navigate = useNavigate();
    const { user, isAuthenticated } = useAuth();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState(false);

    // Check if user is admin
    const isAdmin = isAuthenticated && user?.roles?.includes('admin');

    useEffect(() => {
        if (!isAdmin) {
            navigate('/');
        }
    }, [isAdmin, navigate]);

    // Form state
    const [isbn, setIsbn] = useState('');
    const [titel, setTitel] = useState('');
    const [untertitel, setUntertitel] = useState('');
    const [art, setArt] = useState<Buchart>(Buchart.PAPERBACK);
    const [rating, setRating] = useState(0);
    const [preis, setPreis] = useState('');
    const [rabatt, setRabatt] = useState('');
    const [lieferbar, setLieferbar] = useState(true);
    const [datum, setDatum] = useState('');
    const [homepage, setHomepage] = useState('');
    const [schlagwoerterInput, setSchlagwoerterInput] = useState('');
    const [schlagwoerter, setSchlagwoerter] = useState<string[]>([]);

    // Add schlagwort
    const handleAddSchlagwort = () => {
        const trimmed = schlagwoerterInput.trim();
        if (trimmed && !schlagwoerter.includes(trimmed)) {
            setSchlagwoerter([...schlagwoerter, trimmed]);
            setSchlagwoerterInput('');
        }
    };

    // Remove schlagwort
    const handleRemoveSchlagwort = (wort: string) => {
        setSchlagwoerter(schlagwoerter.filter(w => w !== wort));
    };

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError(null);
        setSuccess(false);

        try {
            // Validate required fields
            if (!isbn || !titel || !preis) {
                throw new Error('ISBN, Titel und Preis sind Pflichtfelder');
            }

            const preisFloat = parseFloat(preis);
            if (isNaN(preisFloat) || preisFloat < 0) {
                throw new Error('Preis muss eine positive Zahl sein');
            }

            let rabattFloat = 0;
            if (rabatt) {
                rabattFloat = parseFloat(rabatt);
                if (isNaN(rabattFloat) || rabattFloat < 0 || rabattFloat > 1) {
                    throw new Error('Rabatt muss zwischen 0 und 1 liegen (z.B. 0.1 für 10%)');
                }
            }

            // Convert date to ISO-8601 DateTime format if provided
            let datumISO: string | undefined = undefined;
            if (datum) {
                // Add time component to make it a valid DateTime
                datumISO = `${datum}T00:00:00.000Z`;
            }

            const input: BuchInput = {
                isbn,
                titel: {
                    titel,
                    untertitel: untertitel || undefined,
                },
                art,
                rating,
                preis: preisFloat,
                rabatt: rabattFloat || undefined,
                lieferbar,
                datum: datumISO,
                homepage: homepage || undefined,
                schlagwoerter: schlagwoerter.length > 0 ? schlagwoerter : undefined,
            };

            const result = await apolloClient.mutate<CreateBuchData, CreateBuchVars>({
                mutation: ERSTELLE_BUCH,
                variables: { input },
            });

            if (result.data?.create?.id) {
                setSuccess(true);
                // Reset form
                setIsbn('');
                setTitel('');
                setUntertitel('');
                setArt(Buchart.PAPERBACK);
                setRating(0);
                setPreis('');
                setRabatt('');
                setLieferbar(true);
                setDatum('');
                setHomepage('');
                setSchlagwoerter([]);
                
                // Redirect after 2 seconds
                setTimeout(() => {
                    navigate('/suche');
                }, 2000);
            }
        } catch (err) {
            console.error('Create error:', err);
            setError(err instanceof Error ? err.message : 'Ein Fehler ist aufgetreten');
        } finally {
            setLoading(false);
        }
    };

    if (!isAdmin) {
        return null;
    }

    return (
        <Container className="py-5">
            <h2 className="mb-4">Neues Buch erstellen</h2>

            {/* Success Alert */}
            {success && (
                <Alert variant="success" className="mb-4">
                    <i className="bi bi-check-circle me-2"></i>
                    Buch erfolgreich erstellt! Sie werden zur Suchseite weitergeleitet...
                </Alert>
            )}

            {/* Error Alert */}
            {error && (
                <Alert variant="danger" className="mb-4">
                    <i className="bi bi-exclamation-triangle me-2"></i>
                    Fehler beim Erstellen: {error}
                </Alert>
            )}

            <Card className="shadow-sm">
                <Card.Body>
                    <Form onSubmit={handleSubmit}>
                        {/* Basic Information */}
                        <h5 className="mb-3">Grundinformationen</h5>
                        <Row>
                            <Col md={6} className="mb-3">
                                <Form.Group controlId="isbn">
                                    <Form.Label>ISBN <span className="text-danger">*</span></Form.Label>
                                    <Form.Control
                                        type="text"
                                        placeholder="z.B. 978-3-16-148410-0"
                                        value={isbn}
                                        onChange={(e) => setIsbn(e.target.value)}
                                        required
                                    />
                                </Form.Group>
                            </Col>

                            <Col md={6} className="mb-3">
                                <Form.Group controlId="art">
                                    <Form.Label>Buchart <span className="text-danger">*</span></Form.Label>
                                    <Form.Select
                                        value={art}
                                        onChange={(e) => setArt(e.target.value as Buchart)}
                                        required
                                    >
                                        <option value={Buchart.PAPERBACK}>Paperback</option>
                                        <option value={Buchart.HARDCOVER}>Hardcover</option>
                                        <option value={Buchart.EPUB}>E-Book (EPUB)</option>
                                    </Form.Select>
                                </Form.Group>
                            </Col>
                        </Row>

                        <Row>
                            <Col md={8} className="mb-3">
                                <Form.Group controlId="titel">
                                    <Form.Label>Titel <span className="text-danger">*</span></Form.Label>
                                    <Form.Control
                                        type="text"
                                        placeholder="Buchtitel"
                                        value={titel}
                                        onChange={(e) => setTitel(e.target.value)}
                                        required
                                    />
                                </Form.Group>
                            </Col>

                            <Col md={4} className="mb-3">
                                <Form.Group controlId="rating">
                                    <Form.Label>Bewertung</Form.Label>
                                    <Form.Select
                                        value={rating}
                                        onChange={(e) => setRating(Number(e.target.value))}
                                    >
                                        <option value={0}>Keine Bewertung</option>
                                        <option value={1}>⭐ 1 Stern</option>
                                        <option value={2}>⭐⭐ 2 Sterne</option>
                                        <option value={3}>⭐⭐⭐ 3 Sterne</option>
                                        <option value={4}>⭐⭐⭐⭐ 4 Sterne</option>
                                        <option value={5}>⭐⭐⭐⭐⭐ 5 Sterne</option>
                                    </Form.Select>
                                </Form.Group>
                            </Col>
                        </Row>

                        <Form.Group controlId="untertitel" className="mb-3">
                            <Form.Label>Untertitel</Form.Label>
                            <Form.Control
                                type="text"
                                placeholder="Optionaler Untertitel"
                                value={untertitel}
                                onChange={(e) => setUntertitel(e.target.value)}
                            />
                        </Form.Group>

                        {/* Pricing */}
                        <h5 className="mb-3 mt-4">Preisinformationen</h5>
                        <Row>
                            <Col md={4} className="mb-3">
                                <Form.Group controlId="preis">
                                    <Form.Label>Preis (€) <span className="text-danger">*</span></Form.Label>
                                    <Form.Control
                                        type="number"
                                        step="0.01"
                                        min="0"
                                        placeholder="z.B. 29.99"
                                        value={preis}
                                        onChange={(e) => setPreis(e.target.value)}
                                        required
                                    />
                                </Form.Group>
                            </Col>

                            <Col md={4} className="mb-3">
                                <Form.Group controlId="rabatt">
                                    <Form.Label>Rabatt (0-1)</Form.Label>
                                    <Form.Control
                                        type="number"
                                        step="0.01"
                                        min="0"
                                        max="1"
                                        placeholder="z.B. 0.1 für 10%"
                                        value={rabatt}
                                        onChange={(e) => setRabatt(e.target.value)}
                                    />
                                    <Form.Text className="text-muted">
                                        Dezimalwert (0.1 = 10%, 0.2 = 20%)
                                    </Form.Text>
                                </Form.Group>
                            </Col>

                            <Col md={4} className="mb-3">
                                <Form.Group controlId="lieferbar">
                                    <Form.Label>Verfügbarkeit</Form.Label>
                                    <Form.Check
                                        type="switch"
                                        label={lieferbar ? 'Lieferbar' : 'Nicht lieferbar'}
                                        checked={lieferbar}
                                        onChange={(e) => setLieferbar(e.target.checked)}
                                        className="mt-2"
                                    />
                                </Form.Group>
                            </Col>
                        </Row>

                        {/* Additional Information */}
                        <h5 className="mb-3 mt-4">Zusatzinformationen</h5>
                        <Row>
                            <Col md={6} className="mb-3">
                                <Form.Group controlId="datum">
                                    <Form.Label>Datum</Form.Label>
                                    <Form.Control
                                        type="date"
                                        value={datum}
                                        onChange={(e) => setDatum(e.target.value)}
                                    />
                                </Form.Group>
                            </Col>

                            <Col md={6} className="mb-3">
                                <Form.Group controlId="homepage">
                                    <Form.Label>Homepage</Form.Label>
                                    <Form.Control
                                        type="url"
                                        placeholder="https://..."
                                        value={homepage}
                                        onChange={(e) => setHomepage(e.target.value)}
                                    />
                                </Form.Group>
                            </Col>
                        </Row>

                        {/* Schlagwörter */}
                        <Form.Group className="mb-3">
                            <Form.Label>Schlagwörter</Form.Label>
                            <div className="d-flex gap-2 mb-2">
                                <Form.Control
                                    type="text"
                                    placeholder="Schlagwort eingeben"
                                    value={schlagwoerterInput}
                                    onChange={(e) => setSchlagwoerterInput(e.target.value)}
                                    onKeyPress={(e) => {
                                        if (e.key === 'Enter') {
                                            e.preventDefault();
                                            handleAddSchlagwort();
                                        }
                                    }}
                                />
                                <Button
                                    variant="outline-primary"
                                    onClick={handleAddSchlagwort}
                                    disabled={!schlagwoerterInput.trim()}
                                >
                                    Hinzufügen
                                </Button>
                            </div>
                            {schlagwoerter.length > 0 && (
                                <div className="d-flex flex-wrap gap-2">
                                    {schlagwoerter.map((wort, idx) => (
                                        <Badge
                                            key={idx}
                                            bg="light"
                                            text="dark"
                                            className="d-flex align-items-center gap-1 px-2 py-1"
                                        >
                                            {wort}
                                            <button
                                                type="button"
                                                onClick={() => handleRemoveSchlagwort(wort)}
                                                className="btn-close btn-close-sm"
                                                aria-label="Entfernen"
                                                style={{ fontSize: '0.6rem' }}
                                            />
                                        </Badge>
                                    ))}
                                </div>
                            )}
                        </Form.Group>

                        {/* Action Buttons */}
                        <div className="d-flex gap-2 mt-4">
                            <Button variant="primary" type="submit" disabled={loading}>
                                {loading ? (
                                    <>
                                        <span className="spinner-border spinner-border-sm me-2" />
                                        Erstelle...
                                    </>
                                ) : (
                                    <>
                                        <i className="bi bi-plus-circle me-2"></i>
                                        Buch erstellen
                                    </>
                                )}
                            </Button>
                            <Button
                                variant="outline-secondary"
                                type="button"
                                onClick={() => navigate('/search')}
                                disabled={loading}
                            >
                                Abbrechen
                            </Button>
                        </div>
                    </Form>
                </Card.Body>
            </Card>
        </Container>
    );
}
