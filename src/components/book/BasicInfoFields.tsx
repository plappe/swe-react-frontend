/**
 * BasicInfoFields - Grundinformationen für Bucherstellung
 *
 * Formularfelder für ISBN, Titel, Untertitel, Art und Rating.
 */

import { Form, Row, Col } from 'react-bootstrap';
import { Buchart } from '../../types';

interface BasicInfoFieldsProps {
    isbn: string;
    setIsbn: (value: string) => void;
    titel: string;
    setTitel: (value: string) => void;
    untertitel: string;
    setUntertitel: (value: string) => void;
    art: Buchart | '';
    setArt: (value: Buchart | '') => void;
    rating: number;
    setRating: (value: number) => void;
    fieldErrors: Record<string, string>;
    onIsbnBlur: () => void;
    onTitelBlur: () => void;
    onArtBlur: () => void;
}

export function BasicInfoFields({
    isbn,
    setIsbn,
    titel,
    setTitel,
    untertitel,
    setUntertitel,
    art,
    setArt,
    rating,
    setRating,
    fieldErrors,
    onIsbnBlur,
    onTitelBlur,
    onArtBlur,
}: BasicInfoFieldsProps) {
    return (
        <>
            <h5 className="mb-3">Grundinformationen</h5>
            <Row>
                <Col md={6} className="mb-3">
                    <Form.Group controlId="isbn">
                        <Form.Label>
                            ISBN <span className="text-danger">*</span>
                        </Form.Label>
                        <Form.Control
                            type="text"
                            placeholder="z.B. 978-3-16-148410-0"
                            value={isbn}
                            onChange={(e) => setIsbn(e.target.value)}
                            onBlur={onIsbnBlur}
                            isInvalid={!!fieldErrors.isbn}
                            required
                        />
                        <Form.Control.Feedback type="invalid">
                            {fieldErrors.isbn}
                        </Form.Control.Feedback>
                    </Form.Group>
                </Col>

                <Col md={6} className="mb-3">
                    <Form.Group controlId="art">
                        <Form.Label>
                            Buchart <span className="text-danger">*</span>
                        </Form.Label>
                        <Form.Select
                            value={art}
                            onChange={(e) => setArt(e.target.value as Buchart)}
                            onBlur={onArtBlur}
                            isInvalid={!!fieldErrors.art}
                            required
                        >
                            <option value="">Auswählen...</option>
                            <option value={Buchart.PAPERBACK}>Paperback</option>
                            <option value={Buchart.HARDCOVER}>Hardcover</option>
                            <option value={Buchart.EPUB}>E-Book (EPUB)</option>
                        </Form.Select>
                        <Form.Control.Feedback type="invalid">
                            {fieldErrors.art}
                        </Form.Control.Feedback>
                    </Form.Group>
                </Col>
            </Row>

            <Row>
                <Col md={8} className="mb-3">
                    <Form.Group controlId="titel">
                        <Form.Label>
                            Titel <span className="text-danger">*</span>
                        </Form.Label>
                        <Form.Control
                            type="text"
                            placeholder="Buchtitel"
                            value={titel}
                            onChange={(e) => setTitel(e.target.value)}
                            onBlur={onTitelBlur}
                            isInvalid={!!fieldErrors.titel}
                            required
                        />
                        <Form.Control.Feedback type="invalid">
                            {fieldErrors.titel}
                        </Form.Control.Feedback>
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
        </>
    );
}
