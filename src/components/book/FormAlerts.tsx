/**
 * FormAlerts - Erfolgs- und Fehlermeldungen
 *
 * Zeigt Erfolgs- oder Fehlermeldungen nach Formular-Submit an.
 */

import { Alert } from 'react-bootstrap';

interface FormAlertsProps {
    success: boolean;
    error: string | null;
}

export const FormAlerts = ({ success, error }: FormAlertsProps) => {
    return (
        <>
            {success && (
                <Alert variant="success" className="mt-3">
                    <i className="bi bi-check-circle me-2"></i>
                    <strong>Erfolg!</strong> Das Buch wurde erfolgreich erstellt. Sie können ein
                    weiteres Buch anlegen.
                </Alert>
            )}

            {error && (
                <Alert variant="danger" className="mt-3">
                    <i className="bi bi-exclamation-triangle me-2"></i>
                    <strong>Fehler:</strong> {error}
                </Alert>
            )}
        </>
    );
};
