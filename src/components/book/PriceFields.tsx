/**
 * PriceFields - Preisinformationen für Bucherstellung
 *
 * Formularfelder für Preis, Rabatt, Lieferbarkeit und Datum.
 */

import { Form, Row, Col } from 'react-bootstrap';

interface PriceFieldsProps {
    preis: string;
    setPreis: (value: string) => void;
    rabatt: string;
    setRabatt: (value: string) => void;
    lieferbar: boolean;
    setLieferbar: (value: boolean) => void;
    datum: string;
    setDatum: (value: string) => void;
    fieldErrors: Record<string, string>;
    onPreisBlur: () => void;
}

export function PriceFields({
    preis,
    setPreis,
    rabatt,
    setRabatt,
    lieferbar,
    setLieferbar,
    datum,
    setDatum,
    fieldErrors,
    onPreisBlur,
}: PriceFieldsProps) {
    return (
        <>
            <h5 className="mb-3 mt-4">Preis & Verfügbarkeit</h5>
            <Row>
                <Col md={4} className="mb-3">
                    <Form.Group controlId="preis">
                        <Form.Label>
                            Preis (€) <span className="text-danger">*</span>
                        </Form.Label>
                        <Form.Control
                            type="number"
                            step="0.01"
                            min="0"
                            placeholder="z.B. 29.99"
                            value={preis}
                            onChange={(e) => setPreis(e.target.value)}
                            onBlur={onPreisBlur}
                            isInvalid={!!fieldErrors.preis}
                            required
                        />
                        <Form.Control.Feedback type="invalid">
                            {fieldErrors.preis}
                        </Form.Control.Feedback>
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
                        <Form.Text className="text-muted">0.1 = 10%, 0.5 = 50%, etc.</Form.Text>
                    </Form.Group>
                </Col>

                <Col md={4} className="mb-3">
                    <Form.Group controlId="datum">
                        <Form.Label>Erscheinungsdatum</Form.Label>
                        <Form.Control
                            type="date"
                            value={datum}
                            onChange={(e) => setDatum(e.target.value)}
                        />
                    </Form.Group>
                </Col>
            </Row>

            <Form.Group controlId="lieferbar" className="mb-3">
                <Form.Check
                    type="checkbox"
                    label="Lieferbar"
                    checked={lieferbar}
                    onChange={(e) => setLieferbar(e.target.checked)}
                />
            </Form.Group>
        </>
    );
}
