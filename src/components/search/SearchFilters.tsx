/**
 * SearchFilters - Suchfilter für Buchsuche
 *
 * Formularfelder für ISBN, Titel, Art, Rating und Lieferbarkeit.
 */

import { Form, Row, Col } from 'react-bootstrap';
import { Buchart } from '../../types';

interface SearchFiltersProps {
    isbn: string;
    setIsbn: (value: string) => void;
    titel: string;
    setTitel: (value: string) => void;
    selectedArten: Buchart[];
    onArtToggle: (art: Buchart) => void;
    rating: number | '';
    setRating: (value: number | '') => void;
    lieferbar: boolean | '';
    setLieferbar: (value: boolean | '') => void;
}

export function SearchFilters({
    isbn,
    setIsbn,
    titel,
    setTitel,
    selectedArten,
    onArtToggle,
    rating,
    setRating,
    lieferbar,
    setLieferbar,
}: SearchFiltersProps) {
    return (
        <>
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
                                onChange={() => onArtToggle(Buchart.EPUB)}
                            />
                            <Form.Check
                                type="checkbox"
                                id="art-hardcover"
                                label="Hardcover"
                                checked={selectedArten.includes(Buchart.HARDCOVER)}
                                onChange={() => onArtToggle(Buchart.HARDCOVER)}
                            />
                            <Form.Check
                                type="checkbox"
                                id="art-paperback"
                                label="Paperback"
                                checked={selectedArten.includes(Buchart.PAPERBACK)}
                                onChange={() => onArtToggle(Buchart.PAPERBACK)}
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
        </>
    );
}
