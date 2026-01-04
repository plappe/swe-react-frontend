/**
 * GraphQL Queries für die Buchverwaltung
 *
 * GraphQL Queries sind READ-Operationen (wie GET in REST).
 * Sie holen Daten vom Server ohne Änderungen vorzunehmen.
 *
 * gql ist ein Template Literal Tag der GraphQL-Strings
 * in ein Query-Dokument umwandelt.
 */

import { gql } from '@apollo/client';

/**
 * Fragment für Buch-Basisdaten
 *
 * Fragments sind wiederverwendbare Teile von Queries.
 * Vermeidet Code-Duplikation wenn mehrere Queries
 * die gleichen Felder benötigen.
 */
export const BUCH_FRAGMENT = gql`
    fragment BuchFields on Buch {
        id
        version
        isbn
        rating
        art
        preis
        rabatt
        lieferbar
        datum
        homepage
        schlagwoerter
        erzeugt
        aktualisiert
        titel {
            id
            titel
            untertitel
        }
    }
`;

/**
 * Query: Alle Bücher suchen
 *
 * Unterstützt:
 * - Filterung nach Suchkriterien
 * - Pagination mit first/after (Cursor-based)
 *
 * $suchkriterien ist eine Variable die beim Query-Aufruf übergeben wird
 */
export const SUCHE_BUECHER = gql`
    ${BUCH_FRAGMENT}
    query SucheBuecher($suchkriterien: SuchkriterienInput) {
        buecher(suchkriterien: $suchkriterien) {
            ...BuchFields
        }
    }
`;

/**
 * Query: Einzelnes Buch nach ID
 *
 * Wird für die Detailansicht verwendet.
 * $id ist die ID des Buchs (Int!)
 */
export const FINDE_BUCH_BY_ID = gql`
    ${BUCH_FRAGMENT}
    query FindeBuchById($id: Int!) {
        buch(id: $id) {
            ...BuchFields
            abbildungen {
                id
                beschriftung
                contentType
            }
        }
    }
`;

/**
 * Query: Buch nach ISBN suchen
 *
 * ISBN ist eindeutig, daher max. 1 Ergebnis
 */
export const FINDE_BUCH_BY_ISBN = gql`
    ${BUCH_FRAGMENT}
    query FindeBuchByIsbn($isbn: String!) {
        buecher(suchkriterien: { isbn: $isbn }) {
            ...BuchFields
        }
    }
`;
