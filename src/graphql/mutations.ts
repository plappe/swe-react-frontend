/**
 * GraphQL Mutations für die Buchverwaltung
 *
 * Mutations sind WRITE-Operationen (wie POST, PUT, DELETE in REST).
 * Sie verändern Daten auf dem Server.
 *
 * Best Practice: Mutations sollten die geänderten Daten zurückgeben,
 * damit Apollo den Cache automatisch aktualisieren kann.
 */

import { gql } from '@apollo/client';
import { BUCH_FRAGMENT } from './queries';

/**
 * Mutation: Neues Buch erstellen
 *
 * Input-Typen werden mit "Input" Suffix benannt (Konvention).
 * Die Mutation gibt das erstellte Buch zurück.
 */
export const ERSTELLE_BUCH = gql`
    ${BUCH_FRAGMENT}
    mutation ErstelleBuch($input: BuchInput!) {
        create(input: $input) {
            ...BuchFields
        }
    }
`;

/**
 * Mutation: Buch aktualisieren
 *
 * Benötigt:
 * - id: ID des zu aktualisierenden Buchs
 * - version: Optimistic Locking (verhindert Konflikte)
 * - input: Die neuen Daten
 */
export const AKTUALISIERE_BUCH = gql`
    ${BUCH_FRAGMENT}
    mutation AktualisiereBuch($id: Int!, $version: Int!, $input: BuchUpdateInput!) {
        update(id: $id, version: $version, input: $input) {
            ...BuchFields
        }
    }
`;

/**
 * Mutation: Buch löschen
 *
 * Gibt nur eine Bestätigung zurück, keine Daten.
 */
export const LOESCHE_BUCH = gql`
    mutation LoescheBuch($id: Int!) {
        delete(id: $id)
    }
`;
