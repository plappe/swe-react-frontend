/**
 * Parse backend error messages and return user-friendly German messages
 */
export const parseErrorMessage = (error: Error): string => {
    const message = error.message;

    // ISBN validation errors
    if (message.includes('isbn must be an ISBN')) {
        return 'Die eingegebene ISBN ist ungültig. Bitte verwenden Sie eine gültige ISBN-10 oder ISBN-13 (z.B. 978-3-16-148410-0).';
    }
    if (message.includes('isbn') && message.includes('already exists')) {
        return 'Ein Buch mit dieser ISBN existiert bereits. Bitte verwenden Sie eine andere ISBN.';
    }

    // Rating validation
    if (message.includes('rating') && message.includes('must not be less than')) {
        return 'Die Bewertung muss zwischen 0 und 5 liegen.';
    }
    if (message.includes('rating') && message.includes('must not be greater than')) {
        return 'Die Bewertung darf maximal 5 Sterne betragen.';
    }

    // Price validation
    if (
        message.includes('preis') &&
        (message.includes('must be a positive number') || message.includes('must not be less than'))
    ) {
        return 'Der Preis muss eine positive Zahl sein.';
    }

    // Rabatt validation
    if (message.includes('rabatt') && message.includes('must not be greater than')) {
        return 'Der Rabatt darf maximal 100% (Wert: 1.0) betragen.';
    }
    if (message.includes('rabatt') && message.includes('must not be less than')) {
        return 'Der Rabatt muss zwischen 0 und 1 liegen (z.B. 0.1 für 10%).';
    }

    // Required fields
    if (message.includes('should not be empty') || message.includes('must be defined')) {
        if (message.includes('isbn')) return 'ISBN ist ein Pflichtfeld.';
        if (message.includes('titel')) return 'Titel ist ein Pflichtfeld.';
        if (message.includes('preis')) return 'Preis ist ein Pflichtfeld.';
        return 'Bitte füllen Sie alle Pflichtfelder aus.';
    }

    // Date validation
    if (message.includes('datum') && message.includes('ISO-8601')) {
        return 'Das Datum hat ein ungültiges Format. Bitte verwenden Sie das Datumsfeld.';
    }

    // Homepage/URL validation
    if (
        message.includes('homepage') &&
        (message.includes('must be a URL') || message.includes('must be an URL'))
    ) {
        return 'Die Homepage muss eine gültige URL sein (z.B. https://beispiel.de).';
    }

    // Authentication/Authorization errors
    if (message.includes('Unauthorized') || message.includes('401')) {
        return 'Sie sind nicht angemeldet oder Ihre Sitzung ist abgelaufen. Bitte melden Sie sich erneut an.';
    }
    if (message.includes('Forbidden') || message.includes('403')) {
        return 'Sie haben keine Berechtigung, Bücher zu erstellen. Nur Administratoren können neue Bücher anlegen.';
    }

    // Network errors
    if (message.includes('Network') || message.includes('fetch')) {
        return 'Verbindungsfehler: Der Server ist nicht erreichbar. Bitte überprüfen Sie Ihre Internetverbindung.';
    }

    // Generic GraphQL errors
    if (message.includes('GraphQL')) {
        return 'Ein Fehler ist bei der Kommunikation mit dem Server aufgetreten. Bitte versuchen Sie es erneut.';
    }

    // Default: show original message if no specific match
    return `Fehler beim Erstellen des Buches: ${message}`;
};
