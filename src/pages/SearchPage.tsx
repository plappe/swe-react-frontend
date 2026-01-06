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
    buecher: {
        content: Buch[];
        totalElements: number;
    };
}

interface SearchBooksVars {
    suchparameter?: BuchSuchkriterien;
    pageable?: {
        page?: number;
        size?: number;
    };
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
    const [selectedArten, setSelectedArten] = useState<Buchart[]>([]);
    const [rating, setRating] = useState<number | ''>('');
    const [lieferbar, setLieferbar] = useState<boolean | ''>('');

    // Pagination state
    const [currentPage, setCurrentPage] = useState(0);
    const [pageSize] = useState(5);
    const [totalElements, setTotalElements] = useState(0);
    const [lastSearchCriteria, setLastSearchCriteria] = useState<BuchSuchkriterien | null>(null);
    const [lastMultiArtFilter, setLastMultiArtFilter] = useState<string[]>([]);

    // Results state
    const [books, setBooks] = useState<Buch[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [hasSearched, setHasSearched] = useState(false);

    const performSearch = async (criteria: BuchSuchkriterien, page: number = 0, multiArtFilter: string[] = []) => {
        setLoading(true);
        setError(null);

        try {
            const isMultipleArtFilter = multiArtFilter.length > 1;

            if (isMultipleArtFilter) {
                // For multiple art filters, fetch all pages and filter client-side
                let allBooks: Buch[] = [];
                let currentBackendPage = 1;
                let hasMore = true;

                // Fetch all pages
                while (hasMore) {
                    const result = await apolloClient.query<SearchBooksData, SearchBooksVars>({
                        query: SUCHE_BUECHER,
                        variables: {
                            suchparameter: criteria,
                            pageable: {
                                page: currentBackendPage,
                                size: pageSize,
                            },
                        },
                        fetchPolicy: 'no-cache',
                    });

                    const books = result.data?.buecher?.content || [];
                    allBooks = [...allBooks, ...books];

                    // Check if there are more pages
                    hasMore = books.length === pageSize;
                    currentBackendPage++;
                }

                // Filter by art types client-side
                const filtered = allBooks.filter(
                    (book) => book.art && multiArtFilter.includes(book.art)
                );
                setTotalElements(filtered.length);

                // Paginate filtered results
                const startIndex = page * pageSize;
                const paginatedBooks = filtered.slice(startIndex, startIndex + pageSize);
                setBooks(paginatedBooks);
            } else {
                // Single art or no art filter - normal backend pagination
                const result = await apolloClient.query<SearchBooksData, SearchBooksVars>({
                    query: SUCHE_BUECHER,
                    variables: {
                        suchparameter: criteria,
                        pageable: {
                            page: page + 1, // Backend expects 1-based page numbers
                            size: pageSize,
                        },
                    },
                    fetchPolicy: 'no-cache',
                });

                setBooks(result.data?.buecher?.content || []);
                setTotalElements(result.data?.buecher?.totalElements || 0);
            }

            setCurrentPage(page);
        } catch (err) {
            // Handle "no books found" as empty result, not an error
            const errorMessage = err instanceof Error ? err.message : 'Ein Fehler ist aufgetreten';
            if (
                errorMessage.includes('Keine Buecher gefunden') ||
                errorMessage.includes('Keine Bücher gefunden')
            ) {
                setBooks([]);
                setTotalElements(0);
                setError(null);
            } else {
                setError(errorMessage);
                setBooks([]);
                setTotalElements(0);
            }
        } finally {
            setLoading(false);
        }
    };

    const handleArtToggle = (art: Buchart) => {
        setSelectedArten((prev) =>
            prev.includes(art) ? prev.filter((a) => a !== art) : [...prev, art],
        );
    };

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();
        setHasSearched(true);

        // Build search criteria - now including art
        const criteria: BuchSuchkriterien = {};
        if (isbn.trim()) criteria.isbn = isbn.trim();
        if (titel.trim()) criteria.titel = titel.trim();
        if (rating !== '') criteria.rating = Number(rating);
        if (lieferbar !== '') criteria.lieferbar = lieferbar;
        // Note: Backend only supports single art, not multiple
        // If multiple arten selected, we still need client-side filtering
        const multiArtFilter = selectedArten.length > 1 ? selectedArten : [];
        if (selectedArten.length === 1) {
            criteria.art = selectedArten[0];
        }

        setLastSearchCriteria(criteria);
        setLastMultiArtFilter(multiArtFilter);
        setCurrentPage(0);
        await performSearch(criteria, 0, multiArtFilter);
    };

    const handleNextPage = () => {
        if (lastSearchCriteria && hasNextPage) {
            performSearch(lastSearchCriteria, currentPage + 1, lastMultiArtFilter);
        }
    };

    const handlePreviousPage = () => {
        if (lastSearchCriteria && currentPage > 0) {
            performSearch(lastSearchCriteria, currentPage - 1, lastMultiArtFilter);
        }
    };

    const handleDelete = async (bookId: number, bookTitle: string) => {
        // Confirmation dialog
        const confirmed = window.confirm(
            `Möchten Sie das Buch "${bookTitle}" wirklich löschen?\n\nDieser Vorgang kann nicht rückgängig gemacht werden.`,
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
        setSelectedArten([]);
        setRating('');
        setLieferbar('');
        setBooks([]);
        setHasSearched(false);
        setError(null);
        setCurrentPage(0);
        setTotalElements(0);
    };

    // Since we handle multi-art filtering in performSearch now, just use books directly
    const filteredBooks = books;

    // Determine if there are more pages based on actual data
    // If current page has fewer books than pageSize, we're on the last page
    const hasNextPage = books.length === pageSize && currentPage < Math.ceil(totalElements / pageSize) - 1;

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
                            <Col md={6} className="mb-3">
                                <Form.Group controlId="art">
                                    <Form.Label>Buchart</Form.Label>
                                    <div>
                                        <Form.Check
                                            type="checkbox"
                                            id="art-epub"
                                            label="E-Book (EPUB)"
                                            checked={selectedArten.includes(Buchart.EPUB)}
                                            onChange={() => handleArtToggle(Buchart.EPUB)}
                                        />
                                        <Form.Check
                                            type="checkbox"
                                            id="art-hardcover"
                                            label="Hardcover"
                                            checked={selectedArten.includes(Buchart.HARDCOVER)}
                                            onChange={() => handleArtToggle(Buchart.HARDCOVER)}
                                        />
                                        <Form.Check
                                            type="checkbox"
                                            id="art-paperback"
                                            label="Paperback"
                                            checked={selectedArten.includes(Buchart.PAPERBACK)}
                                            onChange={() => handleArtToggle(Buchart.PAPERBACK)}
                                        />
                                    </div>
                                </Form.Group>
                            </Col>

                            <Col md={3} className="mb-3">
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

                            <Col md={3} className="mb-3">
                                <Form.Group controlId="lieferbar">
                                    <Form.Label>Verfügbarkeit</Form.Label>
                                    <div>
                                        <Form.Check
                                            type="radio"
                                            id="lieferbar-alle"
                                            label="Alle"
                                            name="lieferbar"
                                            checked={lieferbar === ''}
                                            onChange={() => setLieferbar('')}
                                        />
                                        <Form.Check
                                            type="radio"
                                            id="lieferbar-ja"
                                            label="Lieferbar"
                                            name="lieferbar"
                                            checked={lieferbar === true}
                                            onChange={() => setLieferbar(true)}
                                        />
                                        <Form.Check
                                            type="radio"
                                            id="lieferbar-nein"
                                            label="Nicht lieferbar"
                                            name="lieferbar"
                                            checked={lieferbar === false}
                                            onChange={() => setLieferbar(false)}
                                        />
                                    </div>
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
                    {/* Pagination Controls */}
                    {(hasNextPage || currentPage > 0) && (
                        <div className="mb-3 d-flex justify-content-end">
                            <div className="d-flex gap-2">
                                <Button
                                    variant="outline-primary"
                                    size="sm"
                                    onClick={handlePreviousPage}
                                    disabled={currentPage === 0 || loading}
                                >
                                    <i className="bi bi-chevron-left"></i> Zurück
                                </Button>
                                <span className="align-self-center px-2">
                                    Seite {currentPage + 1}
                                </span>
                                <Button
                                    variant="outline-primary"
                                    size="sm"
                                    onClick={handleNextPage}
                                    disabled={!hasNextPage || loading}
                                >
                                    Weiter <i className="bi bi-chevron-right"></i>
                                </Button>
                            </div>
                        </div>
                    )}

                    <div className="d-flex flex-column gap-3">
                        {filteredBooks.map((book) => (
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
                                                    {book.lieferbar
                                                        ? 'Lieferbar'
                                                        : 'Nicht lieferbar'}
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
                                                        onClick={() =>
                                                            handleDelete(
                                                                book.id,
                                                                book.titel?.titel || 'Ohne Titel',
                                                            )
                                                        }
                                                        disabled={loading}
                                                        title="Buch löschen"
                                                    >
                                                        <i className="bi bi-trash me-1"></i>
                                                        Löschen
                                                    </Button>
                                                </div>
                                            )}
                                            {book.schlagwoerter &&
                                                book.schlagwoerter.length > 0 && (
                                                    <div className="mb-2">
                                                        <small className="text-muted">
                                                            Schlagwörter:{' '}
                                                        </small>
                                                        {book.schlagwoerter.map((tag, idx) => (
                                                            <Badge
                                                                key={idx}
                                                                bg="light"
                                                                text="dark"
                                                                className="me-1"
                                                            >
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
