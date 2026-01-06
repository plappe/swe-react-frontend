/**
 * Search Page Component
 *
 * Ermöglicht die Suche nach Büchern mit verschiedenen Kriterien und Pagination.
 */

import { useState, FormEvent } from 'react';
import { Container, Form, Button, Alert, Card } from 'react-bootstrap';
import { apolloClient } from '../graphql';
import { SUCHE_BUECHER } from '../graphql/queries';
import { LOESCHE_BUCH } from '../graphql/mutations';
import { useAuth } from '../auth';
import { type BuchSuchkriterien, type Buch, Buchart } from '../types';
import { SearchFilters, BookCard, Pagination } from '../components/search';

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

    const performSearch = async (
        criteria: BuchSuchkriterien,
        page: number = 0,
        multiArtFilter: string[] = [],
    ) => {
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
                    (book) => book.art && multiArtFilter.includes(book.art),
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

    // Determine if there are more pages based on actual data
    const hasNextPage =
        books.length === pageSize && currentPage < Math.ceil(totalElements / pageSize) - 1;

    return (
        <Container className="py-5">
            <h2 className="mb-4">Buchsuche</h2>

            {/* Search Form */}
            <Card className="shadow-sm mb-4">
                <Card.Body>
                    <h5 className="mb-3">Suchfilter</h5>
                    <Form onSubmit={handleSubmit}>
                        <SearchFilters
                            isbn={isbn}
                            setIsbn={setIsbn}
                            titel={titel}
                            setTitel={setTitel}
                            selectedArten={selectedArten}
                            onArtToggle={handleArtToggle}
                            rating={rating}
                            setRating={setRating}
                            lieferbar={lieferbar}
                            setLieferbar={setLieferbar}
                        />

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
                    <Pagination
                        currentPage={currentPage}
                        hasNextPage={hasNextPage}
                        loading={loading}
                        onPrevious={handlePreviousPage}
                        onNext={handleNextPage}
                    />

                    <div className="d-flex flex-column gap-3">
                        {books.map((book) => (
                            <BookCard
                                key={book.id}
                                book={book}
                                isAdmin={isAdmin || false}
                                onDelete={handleDelete}
                            />
                        ))}
                    </div>
                </div>
            )}
        </Container>
    );
}
