import { Button } from 'react-bootstrap';

interface FormButtonsProps {
    loading: boolean;
    onCancel: () => void;
}

export const FormButtons = ({ loading, onCancel }: FormButtonsProps) => {
    return (
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
            <Button variant="outline-secondary" type="button" onClick={onCancel} disabled={loading}>
                Abbrechen
            </Button>
        </div>
    );
};
