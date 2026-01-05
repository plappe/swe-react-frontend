/**
 * Search Page Component
 *
 * Ermöglicht die Suche nach Büchern mit verschiedenen Kriterien und Pagination.
 */

import { useState, FormEvent } from 'react';
import { Container, Form, Button, Alert, Card, Badge, Row, Col } from 'react-bootstrap';
import { apolloClient } from '../graphql';
import { SUCHE_BUECHER } from '../graphql/queries';
import { LOESCHE_BUCH } from '../graphql/mutations';
import { useAuth } from '../auth';
import { type BuchSuchkriterien, type Buch, Buchart } from '../types';

interface SearchBooksData {
    buecher: Buch[];
}

interface SearchBooksVars {
    suchparameter: BuchSuchkriterien;
}

interface DeleteBuchData {
    delete: {
        success: boolean;
    };
}

interface DeleteBuchVars {
    id: string;
}

export function SearchPage() {
    const { user, isAuthenticated } = useAuth();
    const isAdmin = isAuthenticated && user?.roles?.includes('admin');

    // Form state
    const [isbn, setIsbn] = useState('');
    const [titel, setTitel] = useState('');
    const [art, setArt] = useState<Buchart | ''>('');
    const [rating, setRating] = useState<number | ''>('');
    const [lieferbar, setLieferbar] = useState<boolean | ''>('');

    // Results state
    const [books, setBooks] = useState<Buch[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [hasSearched, setHasSearched] = useState(false);

    const performSearch = async (criteria: BuchSuchkriterien) => {
        setLoading(true);
        setError(null);

        try {
            const result = await apolloClient.query<SearchBooksData, SearchBooksVars>({
                query: SUCHE_BUECHER,
                variables: {
                    suchparameter: criteria,
                },
                fetchPolicy: 'network-only',
            });

            setBooks(result.data?.buecher || []);
        } catch (err) {
            // Handle "no books found" as empty result, not an error
            const errorMessage = err instanceof Error ? err.message : 'Ein Fehler ist aufgetreten';
            if (errorMessage.includes('Keine Buecher gefunden') || errorMessage.includes('Keine Bücher gefunden')) {
                setBooks([]);
                setError(null);
            } else {
                setError(errorMessage);
                setBooks([]);
            }
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();
        setHasSearched(true);

        // Build search criteria
        const criteria: BuchSuchkriterien = {};
        if (isbn.trim()) criteria.isbn = isbn.trim();
        if (titel.trim()) criteria.titel = titel.trim();
        if (art) criteria.art = art;
        if (rating !== '') criteria.rating = Number(rating);
        if (lieferbar !== '') criteria.lieferbar = lieferbar;

        await performSearch(criteria);
    };

    // Backend GraphQL doesn't support pagination parameters
    // It always returns the first 5 books (DEFAULT_PAGE_SIZE)

    const handleDelete = async (bookId: number, bookTitle: string) => {
        // Confirmation dialog
        const confirmed = window.confirm(
            `Möchten Sie das Buch "${bookTitle}" wirklich löschen?\n\nDieser Vorgang kann nicht rückgängig gemacht werden.`
        );

        if (!confirmed) {
            return;
        }

        try {
            const result = await apolloClient.mutate<DeleteBuchData, DeleteBuchVars>({
                mutation: LOESCHE_BUCH,
                variables: { id: String(bookId) },
            });

            if (result.data?.delete?.success) {
                // Remove book from list
                setBooks((prevBooks) => prevBooks.filter((book) => book.id !== bookId));
                setError(null);
            }
        } catch (err) {
            console.error('Delete error:', err);
            setError(err instanceof Error ? err.message : 'Fehler beim Löschen des Buches');
        }
    };

    const handleReset = () => {
        setIsbn('');
        setTitel('');
        setArt('');
        setRating('');
        setLieferbar('');
        setBooks([]);
        setHasSearched(false);
        setError(null);
    };

    return (
        <Container className="py-5">
            <h2 className="mb-4">Buchsuche</h2>

            {/* Search Form */}
            <Card className="shadow-sm mb-4">
                <Card.Body>
                    <h5 className="mb-3">Suchfilter</h5>
                    <Form onSubmit={handleSubmit}>
                        <Row>
                            <Col md={6} className="mb-3">
                                <Form.Group controlId="isbn">
                                    <Form.Label>ISBN</Form.Label>
                                    <Form.Control
                                        type="text"
                                        placeholder="z.B. 978-3-16-148410-0"
                                        value={isbn}
                                        onChange={(e) => setIsbn(e.target.value)}
                                    />
                                </Form.Group>
                            </Col>

                            <Col md={6} className="mb-3">
                                <Form.Group controlId="titel">
                                    <Form.Label>Titel</Form.Label>
                                    <Form.Control
                                        type="text"
                                        placeholder="Buchtitel suchen"
                                        value={titel}
                                        onChange={(e) => setTitel(e.target.value)}
                                    />
                                </Form.Group>
                            </Col>
                        </Row>

                        <Row>
                            <Col md={4} className="mb-3">
                                <Form.Group controlId="art">
                                    <Form.Label>Buchart</Form.Label>
                                    <Form.Select
                                        value={art}
                                        onChange={(e) => setArt(e.target.value as Buchart | '')}
                                    >
                                        <option value="">Alle</option>
                                        <option value={Buchart.EPUB}>E-Book (EPUB)</option>
                                        <option value={Buchart.HARDCOVER}>Hardcover</option>
                                        <option value={Buchart.PAPERBACK}>Paperback</option>
                                    </Form.Select>
                                </Form.Group>
                            </Col>

                            <Col md={4} className="mb-3">
                                <Form.Group controlId="rating">
                                    <Form.Label>Mindestbewertung</Form.Label>
                                    <Form.Select
                                        value={rating}
                                        onChange={(e) =>
                                            setRating(e.target.value ? Number(e.target.value) : '')
                                        }
                                    >
                                        <option value="">Alle</option>
                                        <option value="1">⭐ 1 Stern oder mehr</option>
                                        <option value="2">⭐⭐ 2 Sterne oder mehr</option>
                                        <option value="3">⭐⭐⭐ 3 Sterne oder mehr</option>
                                        <option value="4">⭐⭐⭐⭐ 4 Sterne oder mehr</option>
                                        <option value="5">⭐⭐⭐⭐⭐ 5 Sterne</option>
                                    </Form.Select>
                                </Form.Group>
                            </Col>

                            <Col md={4} className="mb-3">
                                <Form.Group controlId="lieferbar">
                                    <Form.Label>Verfügbarkeit</Form.Label>
                                    <Form.Select
                                        value={lieferbar === '' ? '' : lieferbar.toString()}
                                        onChange={(e) => {
                                            const val = e.target.value;
                                            setLieferbar(val === '' ? '' : val === 'true');
                                        }}
                                    >
                                        <option value="">Alle</option>
                                        <option value="true">Lieferbar</option>
                                        <option value="false">Nicht lieferbar</option>
                                    </Form.Select>
                                </Form.Group>
                            </Col>
                        </Row>

                        <div className="d-flex gap-2">
                            <Button variant="primary" type="submit" disabled={loading}>
                                {loading ? 'Suche läuft...' : 'Suchen'}
                            </Button>
                            <Button variant="outline-secondary" type="button" onClick={handleReset}>
                                Zurücksetzen
                            </Button>
                        </div>
                    </Form>
                </Card.Body>
            </Card>

            {/* Error Alert */}
            {error && (
                <Alert variant="danger" className="mb-4">
                    <i className="bi bi-exclamation-triangle me-2"></i>
                    Fehler beim Laden der Suchergebnisse: {error}
                </Alert>
            )}

            {/* Loading State */}
            {loading && (
                <Alert variant="info">
                    <i className="bi bi-hourglass-split me-2"></i>
                    Suche läuft...
                </Alert>
            )}

            {/* No Search Yet */}
            {!hasSearched && !loading && (
                <Alert variant="secondary">
                    <i className="bi bi-info-circle me-2"></i>
                    Verwenden Sie die Filter oben, um nach Büchern zu suchen.
                </Alert>
            )}

            {/* No Results */}
            {hasSearched && !loading && books.length === 0 && !error && (
                <Alert variant="warning">
                    <i className="bi bi-search me-2"></i>
                    Keine Bücher gefunden. Versuchen Sie andere Suchkriterien.
                </Alert>
            )}

            {/* Results */}
            {books.length > 0 && (
                <div>
                    <div className="mb-3">
                        <strong>{books.length}</strong>{' '}
                        {books.length === 1 ? 'Buch' : 'Bücher'} gefunden
                    </div>

                    <div className="d-flex flex-column gap-3">
                        {books.map((book) => (
                            <Card key={book.id} className="shadow-sm">
                                <Card.Body>
                                    <div className="d-flex justify-content-between align-items-start">
                                        <div className="flex-grow-1">
                                            <h5 className="mb-1">
                                                {book.titel?.titel || 'Ohne Titel'}
                                            </h5>
                                            {book.titel?.untertitel && (
                                                <p className="text-muted small mb-2">
                                                    {book.titel.untertitel}
                                                </p>
                                            )}

                                            <div className="d-flex flex-wrap gap-2 mb-2">
                                                <Badge bg="secondary">ISBN: {book.isbn}</Badge>
                                                {book.art && (
                                                    <Badge
                                                        bg={
                                                            book.art === Buchart.EPUB
                                                                ? 'info'
                                                                : book.art === Buchart.HARDCOVER
                                                                  ? 'primary'
                                                                  : 'success'
                                                        }
                                                    >
                                                        {book.art}
                                                    </Badge>
                                                )}
                                                <Badge bg={book.lieferbar ? 'success' : 'danger'}>
                                                    {book.lieferbar ? 'Lieferbar' : 'Nicht lieferbar'}
                                                </Badge>
                                                <Badge bg="warning" text="dark">
                                                    {'⭐'.repeat(book.rating)} {book.rating}/5
                                                </Badge>
                                            </div>
                                            {isAdmin && (
                                                <div className="mt-2">
                                                    <Button
                                                        variant="outline-danger"
                                                        size="sm"
                                                        onClick={() => handleDelete(book.id, book.titel?.titel || 'Ohne Titel')}
                                                        disabled={loading}
                                                        title="Buch löschen"
                                                    >
                                                        <i className="bi bi-trash me-1"></i>
                                                        Löschen
                                                    </Button>
                                                </div>
                                            )}
                                            {book.schlagwoerter && book.schlagwoerter.length > 0 && (
                                                <div className="mb-2">
                                                    <small className="text-muted">Schlagwörter: </small>
                                                    {book.schlagwoerter.map((tag, idx) => (
                                                        <Badge key={idx} bg="light" text="dark" className="me-1">
                                                            {tag}
                                                        </Badge>
                                                    ))}
                                                </div>
                                            )}

                                            <div className="text-muted small">
                                                Preis: <strong>{book.preis} €</strong>
                                                {Number(book.rabatt) > 0 && (
                                                    <span className="ms-2 text-danger">
                                                        -{book.rabatt}% Rabatt
                                                    </span>
                                                )}
                                            </div>

                                            {book.homepage && (
                                                <div className="text-muted small">
                                                    Homepage:{' '}
                                                    <a
                                                        href={book.homepage}
                                                        target="_blank"
                                                        rel="noopener noreferrer"
                                                    >
                                                        {book.homepage}
                                                    </a>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </Card.Body>
                            </Card>
                        ))}
                    </div>
                </div>
            )}
        </Container>
    );
}

