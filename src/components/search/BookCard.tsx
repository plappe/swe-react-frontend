/**
 * BookCard - Darstellung eines Buches
 *
 * Zeigt Buchinformationen an mit optionaler Lösch-Funktion für Admins.
 */

import { Card, Badge, Button } from 'react-bootstrap';
import { type Buch } from '../../types';

interface BookCardProps {
    book: Buch;
    isAdmin: boolean;
    onDelete: (id: number, title: string) => void;
}

export function BookCard({ book, isAdmin, onDelete }: BookCardProps) {
    const renderRating = (rating: number) => {
        return '⭐'.repeat(rating);
    };

    return (
        <Card className="mb-3 shadow-sm">
            <Card.Body>
                <div className="d-flex justify-content-between align-items-start">
                    <div className="flex-grow-1">
                        <h5>{book.titel?.titel || 'Ohne Titel'}</h5>
                        {book.titel?.untertitel && (
                            <h6 className="text-muted">{book.titel.untertitel}</h6>
                        )}

                        <div className="mb-2">
                            <Badge bg="secondary" className="me-2">
                                ISBN: {book.isbn}
                            </Badge>
                            <Badge bg="info" className="me-2">
                                {book.art}
                            </Badge>
                            {book.lieferbar ? (
                                <Badge bg="success">Lieferbar</Badge>
                            ) : (
                                <Badge bg="danger">Nicht lieferbar</Badge>
                            )}
                        </div>

                        <div className="text-muted">
                            {book.rating > 0 && (
                                <div>
                                    Bewertung: {renderRating(book.rating)} ({book.rating}/5)
                                </div>
                            )}
                            <div>Preis: {book.preis} €</div>
                            {book.rabatt && parseFloat(String(book.rabatt)) > 0 && (
                                <div>
                                    Rabatt: {(parseFloat(String(book.rabatt)) * 100).toFixed(0)}%
                                </div>
                            )}
                            {book.homepage && (
                                <div>
                                    <a
                                        href={book.homepage}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                    >
                                        Zur Website
                                    </a>
                                </div>
                            )}
                            {book.schlagwoerter && book.schlagwoerter.length > 0 && (
                                <div className="mt-2">
                                    {book.schlagwoerter.map((tag) => (
                                        <Badge key={tag} bg="light" text="dark" className="me-1">
                                            {tag}
                                        </Badge>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>

                    {isAdmin && (
                        <Button
                            variant="outline-danger"
                            size="sm"
                            onClick={() => onDelete(book.id, book.titel?.titel || 'Ohne Titel')}
                            className="ms-3"
                        >
                            <i className="bi bi-trash"></i> Löschen
                        </Button>
                    )}
                </div>
            </Card.Body>
        </Card>
    );
}
