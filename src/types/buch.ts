/**
 * TypeScript Types für die Buchverwaltung
 *
 * Diese Typen entsprechen dem Prisma-Schema aus dem Backend.
 * TypeScript verwendet diese Typen für:
 * - Autovervollständigung in der IDE
 * - Compile-Time Fehlerprüfung
 * - Dokumentation des Datenmodells
 */

/**
 * Buchart Enum
 */
export enum Buchart {
    EPUB = 'EPUB',
    HARDCOVER = 'HARDCOVER',
    PAPERBACK = 'PAPERBACK',
}

/**
 * Titel Interface
 */
export interface Titel {
    id: number;
    titel: string;
    untertitel?: string | null;
}

/**
 * Abbildung Interface
 */
export interface Abbildung {
    id: number;
    beschriftung: string;
    contentType: string;
}

/**
 * Buch Interface
 */
export interface Buch {
    id: number;
    version: number;
    isbn: string;
    rating: number;
    art?: Buchart | null;
    preis: number | string; // Decimal vom Backend
    rabatt: number | string; // Decimal vom Backend
    lieferbar: boolean;
    datum?: string | null; // ISO Date String
    homepage?: string | null;
    schlagwoerter?: string[] | null;
    erzeugt: string; // ISO DateTime String
    aktualisiert: string; // ISO DateTime String
    titel?: Titel | null;
    abbildungen?: Abbildung[];
}

/**
 * Input Type für Buch-Erstellung
 * Wird beim Anlegen eines neuen Buchs verwendet
 */
export interface BuchInput {
    isbn: string;
    rating: number;
    art?: Buchart | null;
    preis: number;
    rabatt: number;
    lieferbar: boolean;
    datum?: string | null;
    homepage?: string | null;
    schlagwoerter?: string[];
    titel: TitelInput;
    abbildungen?: AbbildungInput[];
}

/**
 * Input Type für Titel
 */
export interface TitelInput {
    titel: string;
    untertitel?: string | null;
}

/**
 * Input Type für Abbildung
 */
export interface AbbildungInput {
    beschriftung: string;
    contentType: string;
}

/**
 * Suchkriterien für die Buchsuche
 */
export interface BuchSuchkriterien {
    isbn?: string;
    titel?: string;
    art?: Buchart;
    rating?: number;
    lieferbar?: boolean;
    schlagwoerter?: string[];
}
