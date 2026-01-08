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
        titel {
            titel
            untertitel
        }
    }
`;

/**
 * Query: Alle Bücher suchen
 *
 * Unterstützt Filterung nach Suchkriterien und Pagination
 */
export const SUCHE_BUECHER = gql`
    ${BUCH_FRAGMENT}
    query SucheBuecher($suchparameter: SuchparameterInput, $pageable: PageableInput) {
        buecher(suchparameter: $suchparameter, pageable: $pageable) {
            content {
                ...BuchFields
            }
            totalElements
        }
    }
`;
