import { Form, Button, Badge } from 'react-bootstrap';

interface MetadataFieldsProps {
    homepage: string;
    setHomepage: (value: string) => void;
    schlagwoerterInput: string;
    setSchlagwoerterInput: (value: string) => void;
    schlagwoerter: string[];
    onAddSchlagwort: () => void;
    onRemoveSchlagwort: (wort: string) => void;
    fieldErrors: Record<string, string>;
    onHomepageBlur: () => void;
}

export function MetadataFields({
    homepage,
    setHomepage,
    schlagwoerterInput,
    setSchlagwoerterInput,
    schlagwoerter,
    onAddSchlagwort,
    onRemoveSchlagwort,
    fieldErrors,
    onHomepageBlur,
}: MetadataFieldsProps) {
    return (
        <>
            <h5 className="mb-3 mt-4">Zusätzliche Informationen</h5>

            <Form.Group controlId="homepage" className="mb-3">
                <Form.Label>Homepage</Form.Label>
                <Form.Control
                    type="url"
                    placeholder="https://beispiel.de"
                    value={homepage}
                    onChange={(e) => setHomepage(e.target.value)}
                    onBlur={onHomepageBlur}
                    isInvalid={!!fieldErrors.homepage}
                />
                <Form.Control.Feedback type="invalid">{fieldErrors.homepage}</Form.Control.Feedback>
            </Form.Group>

            <Form.Group controlId="schlagwoerter" className="mb-3">
                <Form.Label>Schlagwörter</Form.Label>
                <div className="d-flex gap-2 mb-2">
                    <Form.Control
                        type="text"
                        placeholder="Schlagwort eingeben"
                        value={schlagwoerterInput}
                        onChange={(e) => setSchlagwoerterInput(e.target.value)}
                        onKeyDown={(e) => {
                            if (e.key === 'Enter') {
                                e.preventDefault();
                                onAddSchlagwort();
                            }
                        }}
                    />
                    <Button
                        variant="outline-primary"
                        onClick={onAddSchlagwort}
                        disabled={!schlagwoerterInput.trim()}
                    >
                        Hinzufügen
                    </Button>
                </div>
                {schlagwoerter.length > 0 && (
                    <div className="d-flex flex-wrap gap-2">
                        {schlagwoerter.map((wort) => (
                            <Badge
                                key={wort}
                                bg="primary"
                                className="d-flex align-items-center gap-1"
                            >
                                {wort}
                                <button
                                    type="button"
                                    className="btn-close btn-close-white"
                                    aria-label="Entfernen"
                                    onClick={() => onRemoveSchlagwort(wort)}
                                    style={{ fontSize: '0.6rem' }}
                                />
                            </Badge>
                        ))}
                    </div>
                )}
            </Form.Group>
        </>
    );
}
